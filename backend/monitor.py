import time
import threading
import requests

# import da database.py as funções get_db_connection e get_status
from database import get_db_connection, get_status

# Importa a URL base da API sportsdb.
from config import BASE_URL

# Define a URL do servidor Flask.
FLASK_API_URL = "http://localhost:5000"

# Função para notificar o backend sobre mudanças no placar.
def notificar_mudanca_placar(id_event, home_team, away_team, home_score, away_score):

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
            timeout=5  # Define um tempo limite de 5 segundos para a requisição, novamente respeitando a API q se irrita facil.
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
    
    ultimos_placares = {}  # Dicionário para armazenar o último placar conhecido de cada jogo.
    
    while True:
        try:
            conn = get_db_connection()
            cursor = conn.cursor()
            
            # Seleciona todos os jogos que ainda não terminaram, ou seja jogos com status de proximo ou ao vivo.
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
                
                # Usa a função `get_status` para determinar o status atual do jogo (ao vivo ou próximo).
                novo_status = get_status(date_event, str_time, home_score, away_score)
                
                # Verifica o status atual no banco de dados.
                cursor.execute("SELECT status FROM partidas WHERE idEvent = ?", (id_event,))
                # Pega o primeiro resultado (se houver).
                result = cursor.fetchone()
                # Define o status atual, ou None se não houver resultado.
                status_atual = result[0] if result else None
                
                # Se o status mudou (de 'proximo' para 'ao_vivo'), atualiza o banco.
                if status_atual != novo_status:
                    cursor.execute("UPDATE partidas SET status = ? WHERE idEvent = ?", (novo_status, id_event))
                    # Se alguma linha foi afetada, significa que houve uma mudança de status.
                    if cursor.rowcount > 0:
                        print(f"Jogo {id_event} atualizado de '{status_atual}' para: '{novo_status}'")
                        # Chama uma função para enviar notificações de mudança de status (se houver).
                        enviar_notificacao_mudanca_status(id_event, status_atual, novo_status)
                
                # --- Lógica de verificação do placar ---
                # Define o placar atual e o último placar conhecido.
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
            conn.close()
            time.sleep(30)  # Pausa por 30 segundos antes da próxima verificação.
            
        except Exception as e:
            print(f"Erro no monitoramento: {e}")
            time.sleep(30) # Pausa em caso de erro para evitar um loop infinito de falhas.

# Função para atualizar os resultados dos jogos em tempo real.
def atualizar_resultados_em_tempo_real():
    # Loop infinito para verificar atualizações.
    while True:
        try:
            conn = get_db_connection()
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
                    response = requests.get(url, timeout=10) # Timeout de 10 segundos, para respeitar a API q novamente se irrita facil.
                    # Decodifica a resposta JSON.
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
                            # Se houver mudança, atualiza o placar no banco de dados.
                            cursor.execute("""
                                UPDATE partidas 
                                SET intHomeScore = ?, intAwayScore = ? 
                                WHERE idEvent = ?
                            """, (novo_home_score, novo_away_score, id_event))
                            print(f"Placar atualizado: {home_team} {novo_home_score} x {novo_away_score} {away_team}")
                            
                            # E notifica o servidor Flask.
                            notificar_mudanca_placar(id_event, home_team, away_team, novo_home_score, novo_away_score)
                # Captura erros específicos de cada jogo para evitar que um erro pare todo o processo.
                except Exception as e:
                    print(f"Erro ao atualizar jogo {id_event}: {e}")
            
            conn.commit()
            conn.close()
            time.sleep(15)  # Verifica com mais frequência (15s) os jogos ao vivo.

        # Captura erros genéricos.    
        except Exception as e:
            print(f"Erro na atualização de resultados: {e}")
            # Em caso de erro, espera 15 segundos antes de tentar novamente.
            time.sleep(15)

# Função para enviar notificações de mudança de status.
def enviar_notificacao_mudanca_status(id_event, status_atual, status_novo):
    conn = get_db_connection()
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
        # Extrai os detalhes do usuário e do jogo.
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
    conn.close()

if __name__ == "__main__":
    # Inicia as threads para monitorar jogos ao vivo e atualizar resultados.
    print("Iniciando monitoramento em tempo real...")
    # Retorno no console pra mostrar que ta conectado ao servidor Flask.
    print("Conectado ao servidor Flask em:", FLASK_API_URL)
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