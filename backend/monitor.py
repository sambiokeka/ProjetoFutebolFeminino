import time
import threading
import requests
from json_database import (
    get_partidas, get_partidas_salvas, save_partida, 
    get_status, save_partida_salva
)

# Importa a URL base da API sportsdb.
from config import BASE_URL

# Define a URL do servidor Flask.
FLASK_API_URL = "http://localhost:5000"

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
    ultimos_status = {}    # Dicionário para armazenar o último status conhecido de cada jogo.
    
    while True:
        try:
            # Obtém todos os jogos que ainda não terminaram
            jogos_ativos = get_partidas({'status': 'proximas'}) + get_partidas({'status': 'ao_vivo'})
            
            # Percorre cada jogo ativo.
            for jogo in jogos_ativos:
                # Extrai os detalhes do jogo. 
                id_event = jogo["idEvent"]
                date_event = jogo["dateEvent"]
                str_time = jogo["strTime"]
                home_score = jogo["intHomeScore"]
                away_score = jogo["intAwayScore"]
                home_team = jogo["strHomeTeam"]
                away_team = jogo["strAwayTeam"]
                
                # Usa a função `get_status` para determinar o status atual do jogo
                novo_status = get_status(date_event, str_time, home_score, away_score)
                
                # Verifica se o status mudou
                status_anterior = ultimos_status.get(id_event)
                
                # Se o status mudou, atualiza o JSON
                if status_anterior != novo_status:
                    jogo["status"] = novo_status
                    save_partida(jogo)
                    print(f"Jogo {id_event} atualizado de '{status_anterior}' para: '{novo_status}'")
                    
                    # Envia notificações de mudança de status
                    enviar_notificacao_mudanca_status(id_event, status_anterior, novo_status, home_team, away_team)
                
                # Atualiza o último status para a próxima verificação.
                ultimos_status[id_event] = novo_status
                
                # --- Lógica de verificação do placar ---
                placar_atual = (home_score, away_score)
                placar_anterior = ultimos_placares.get(id_event)
                
                # Compara o placar atual com o último placar conhecido.
                if placar_anterior is not None and placar_atual != placar_anterior:
                    # Se houver mudança, atualiza o placar
                    print(f"Placar alterado: {home_team} {home_score} x {away_score} {away_team}")
                    # Notifica o backend sobre a mudança do placar.
                    notificar_mudanca_placar(id_event, home_team, away_team, home_score, away_score)
                
                # Atualiza o último placar para a próxima verificação.
                ultimos_placares[id_event] = placar_atual
            
            time.sleep(30)  # Pausa por 30 segundos antes da próxima verificação.
            
        except Exception as e:
            print(f"Erro no monitoramento: {e}")
            time.sleep(30) # Pausa em caso de erro

# Função para atualizar os resultados dos jogos em tempo real.
def atualizar_resultados_em_tempo_real():
    # Atualiza os resultados dos jogos em tempo real consultando a API externa.
    # Loop infinito para verificar atualizações.
    while True:
        try:
            # Seleciona apenas os jogos que estão com status 'ao_vivo'.
            jogos_ao_vivo = get_partidas({'status': 'ao_vivo'})
            
            # Percorre cada jogo ao vivo.
            for jogo in jogos_ao_vivo:
                # Extrai os detalhes do jogo.
                id_event = jogo["idEvent"]
                home_team = jogo["strHomeTeam"]
                away_team = jogo["strAwayTeam"]
                
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
                        
                        # Compara o placar do JSON com o placar da API.
                        if (jogo["intHomeScore"] != novo_home_score or 
                            jogo["intAwayScore"] != novo_away_score):
                            
                            # Atualiza o placar no JSON
                            jogo["intHomeScore"] = novo_home_score
                            jogo["intAwayScore"] = novo_away_score
                            save_partida(jogo)
                            
                            print(f"Placar atualizado: {home_team} {novo_home_score} x {novo_away_score} {away_team}")
                            
                            # Notifica o servidor Flask.
                            notificar_mudanca_placar(id_event, home_team, away_team, novo_home_score, novo_away_score)
                
                except Exception as e:
                    print(f"Erro ao atualizar jogo {id_event}: {e}")
            
            time.sleep(15)  # Verifica com mais frequência (15s) os jogos ao vivo.

        except Exception as e:
            print(f"Erro na atualização de resultados: {e}")
            time.sleep(15)

# Função para enviar notificações de mudança de status.
def enviar_notificacao_mudanca_status(id_event, status_atual, status_novo, home_team, away_team):
    """
    Envia notificações para usuários quando o status de uma partida muda.
    """
    # Seleciona os usuários que salvaram essa partida e ainda não foram notificados.
    partidas_salvas = get_partidas_salvas({
        'idEvent': id_event,
        'notificado': 0
    })
    
    # Percorre cada partida salva e envia a notificação.
    for ps in partidas_salvas:
        id_usuario = ps["idUsuario"]
        # Se o status mudou para 'ao_vivo', envia a notificação.
        mensagem = f"Status alterado: {home_team} vs {away_team} - {status_novo}"
        print(f"Notificação para {id_usuario}: {mensagem}")

        # Marca como notificado
        ps["notificado"] = 1
        save_partida_salva(ps)

if __name__ == "__main__":
    # Inicia as threads para monitorar jogos ao vivo e atualizar resultados.
    print("Iniciando monitoramento em tempo real...")
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
            
    # Fecha se der Crlt+C     
    except KeyboardInterrupt:
        print("Encerrando monitoramento...")