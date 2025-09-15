import time
import threading
import requests
import sqlite3
import os # le os comentarios do import do os no rotas.py
# import da database.py as funções get_db_connection e get_status
from database import get_status

# Importa a URL base da API sportsdb.
from config import BASE_URL


BASE_DIR = os.path.dirname(os.path.abspath(__file__))
DB_DIR = os.path.join(BASE_DIR, 'database')

DATABASE_FUTEBOL = os.path.join(DB_DIR, 'futebol_feminino.db') # banco de dados de futebol mesmo

# Define a URL do servidor Flask.
FLASK_API_URL = "http://localhost:5000"

# Armazenamento local por thread para conexões de banco de dados
thread_local = threading.local()

# Função para obter uma conexão de banco de dados por thread
def get_thread_db_connection():

    if not hasattr(thread_local, "conn"):
        # Cria uma nova conexão para esta thread
        thread_local.conn = sqlite3.connect(DATABASE_FUTEBOL)
        thread_local.conn.row_factory = sqlite3.Row
        print(f"Nova conexão de banco criada para thread {threading.get_ident()}")
    return thread_local.conn

# Função para notificar o backend sobre mudanças no placar.
def notificar_mudanca_placar(id_event, home_team, away_team, home_score, away_score):
    """
    Notifica o servidor Flask sobre mudanças no placar de uma partida.
    """
    try:
        # Envia os dados do placar para a rota `/webhook/placar` do Flask.
        response = requests.post(
            f"{FLASK_API_URL}/webhook/placar",
            json={
                "idEvent": id_event,
                "homeTeam": home_team,
                "awayTeam": away_team,
                "homeScore": home_score,
                "awayScore": away_score,
                "timestamp": time.time()
            },
            timeout=5  # Define um tempo limite de 5 segundos para a requisição
        )
        
        # Verifica se a notificação foi enviada com sucesso.
        if response.status_code == 200:
            print(f"Notificação enviada para {home_team} {home_score} x {away_score} {away_team}")
        else:
            print(f"Erro ao notificar: {response.status_code}")
            
    except Exception as e:
        # Captura e exibe erros, como falha de conexão com o servidor.
        print(f"Falha ao notificar servidor: {e}")

# Função principal que monitora os jogos em tempo real.
def monitorar_jogos_ao_vivo():
    """
    Monitora continuamente os jogos ativos para detectar mudanças de status
    e atualizações de placar.
    """
    ultimos_placares = {}  # Dicionário para armazenar o último placar conhecido de cada jogo.
    
    while True:
        try:
            # Usa a conexão específica da thread
            conn = get_thread_db_connection()
            cursor = conn.cursor()
            
            # Seleciona todos os jogos que ainda não terminaram
            cursor.execute("""
                SELECT idEvent, dateEvent, strTime, intHomeScore, intAwayScore,
                       strHomeTeam, strAwayTeam 
                FROM partidas 
                WHERE status != 'finalizadas'
            """)
            jogos_ativos = cursor.fetchall()
            
            # Percorre cada jogo ativo.
            for jogo in jogos_ativos:
                # Extrai os detalhes do jogo. 
                id_event, date_event, str_time, home_score, away_score, home_team, away_team = jogo
                
                # Usa a função `get_status` para determinar o status atual do jogo
                novo_status = get_status(date_event, str_time, home_score, away_score)
                
                # Verifica o status atual no banco de dados.
                cursor.execute("SELECT status FROM partidas WHERE idEvent = ?", (id_event,))
                result = cursor.fetchone()
                status_atual = result[0] if result else None
                
                # Se o status mudou, atualiza o banco.
                if status_atual != novo_status:
                    cursor.execute("UPDATE partidas SET status = ? WHERE idEvent = ?", (novo_status, id_event))
                    if cursor.rowcount > 0:
                        print(f"Jogo {id_event} atualizado de '{status_atual}' para: '{novo_status}'")
                        # Envia notificações de mudança de status
                        enviar_notificacao_mudanca_status(id_event, status_atual, novo_status)
                
                # --- Lógica de verificação do placar ---
                placar_atual = (home_score, away_score)
                placar_anterior = ultimos_placares.get(id_event)
                
                # Compara o placar atual com o último placar conhecido.
                if placar_anterior is not None and placar_atual != placar_anterior:
                    # Se houver mudança, atualiza o placar no banco de dados.
                    print(f"Placar alterado: {home_team} {home_score} x {away_score} {away_team}")
                    # Notifica o backend sobre a mudança do placar.
                    notificar_mudanca_placar(id_event, home_team, away_team, home_score, away_score)
                
                # Atualiza o último placar para a próxima verificação.
                ultimos_placares[id_event] = placar_atual
            
            conn.commit()
            time.sleep(30)  # Pausa por 30 segundos antes da próxima verificação.
            
        except Exception as e:
            print(f"Erro no monitoramento: {e}")
            time.sleep(30) # Pausa em caso de erro

# Função para atualizar os resultados dos jogos em tempo real.
def atualizar_resultados_em_tempo_real():
    """
    Atualiza os resultados dos jogos em tempo real consultando a API externa.
    """
    # Loop infinito para verificar atualizações.
    while True:
        try:
            # Usa a conexão específica da thread
            conn = get_thread_db_connection()
            cursor = conn.cursor()
            
            # Seleciona apenas os jogos que estão com status 'ao_vivo'.
            cursor.execute("SELECT idEvent, strHomeTeam, strAwayTeam FROM partidas WHERE status = 'ao_vivo'")
            jogos_ao_vivo = cursor.fetchall()
            
            # Percorre cada jogo ao vivo.
            for jogo in jogos_ao_vivo:
                # Extrai os detalhes do jogo.
                id_event, home_team, away_team = jogo
                try:
                    # Faz uma requisição pra API para obter os dados mais recentes do evento.
                    url = f"{BASE_URL}lookupevent.php?id={id_event}"
                    response = requests.get(url, timeout=10)
                    data = response.json()
                    
                    # Se houver eventos na resposta.
                    if data.get('events'):
                        # Pega o primeiro evento.
                        evento = data['events'][0]
                        novo_home_score = evento.get('intHomeScore')
                        novo_away_score = evento.get('intAwayScore')
                        
                        # Compara o placar do banco com o placar da API.
                        cursor.execute("SELECT intHomeScore, intAwayScore FROM partidas WHERE idEvent = ?", (id_event,))
                        placar_atual = cursor.fetchone()
                        
                        # Se o placar mudou.
                        if (placar_atual and (placar_atual[0] != novo_home_score or placar_atual[1] != novo_away_score)):
                            # Atualiza o placar no banco de dados.
                            cursor.execute("""
                                UPDATE partidas 
                                SET intHomeScore = ?, intAwayScore = ? 
                                WHERE idEvent = ?
                            """, (novo_home_score, novo_away_score, id_event))
                            print(f"Placar atualizado: {home_team} {novo_home_score} x {novo_away_score} {away_team}")
                            
                            # Notifica o servidor Flask.
                            notificar_mudanca_placar(id_event, home_team, away_team, novo_home_score, novo_away_score)
                
                except Exception as e:
                    print(f"Erro ao atualizar jogo {id_event}: {e}")
            
            conn.commit()
            time.sleep(15)  # Verifica com mais frequência (15s) os jogos ao vivo.

        except Exception as e:
            print(f"Erro na atualização de resultados: {e}")
            time.sleep(15)

# Função para enviar notificações de mudança de status.
def enviar_notificacao_mudanca_status(id_event, status_atual, status_novo):
    """
    Envia notificações para usuários quando o status de uma partida muda.
    """
    # Usa a conexão específica da thread
    conn = get_thread_db_connection()
    cursor = conn.cursor()
    
    # Seleciona os usuários que salvaram essa partida e ainda não foram notificados.
    cursor.execute("""
        SELECT ps.idUsuario, p.strHomeTeam, p.strAwayTeam 
        FROM partidas_salvas ps 
        JOIN partidas p ON ps.idEvent = p.idEvent 
        WHERE ps.idEvent = ? AND ps.notificado = 0
    """, (id_event,))

    usuarios = cursor.fetchall()
    
    # Percorre cada usuário e envia a notificação.
    for usuario in usuarios:
        id_usuario, home_team, away_team = usuario
        # Se o status mudou para 'ao_vivo', envia a notificação.
        mensagem = f"Status alterado: {home_team} vs {away_team} - {status_novo}"
        print(f"Notificação para {id_usuario}: {mensagem}")

        cursor.execute("""
            UPDATE partidas_salvas 
            SET notificado = 1 
            WHERE idEvent = ? AND idUsuario = ?
        """, (id_event, id_usuario))
    
    conn.commit()

# Função para fechar todas as conexões ao encerrar
def fechar_conexoes():
    """Fecha todas as conexões de banco de dados abertas."""
    if hasattr(thread_local, "conn"):
        try:
            thread_local.conn.close()
            print(f"Conexão fechada para thread {threading.get_ident()}")
        except:
            pass

if __name__ == "__main__":
    # Inicia as threads para monitorar jogos ao vivo e atualizar resultados.
    print("Iniciando monitoramento em tempo real...")
    print("Conectado ao servidor Flask em:", FLASK_API_URL)
    
    # Registra função para fechar conexões ao encerrar
    import atexit
    atexit.register(fechar_conexoes)
    
    # Tenta iniciar as threads.
    try:
        thread_monitor = threading.Thread(target=monitorar_jogos_ao_vivo, daemon=True)
        thread_monitor.start()
        
        thread_resultados = threading.Thread(target=atualizar_resultados_em_tempo_real, daemon=True)
        thread_resultados.start()
        
        # Mantém o programa principal rodando.
        while True:
            time.sleep(60)
            
    # Captura interrupção do teclado (Ctrl+C) para encerrar o programa.        
    except KeyboardInterrupt:
        print("Encerrando monitoramento...")
        fechar_conexoes()