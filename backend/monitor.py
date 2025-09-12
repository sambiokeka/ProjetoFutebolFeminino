# monitor.py
import time
import threading
import requests
from database import get_db_connection, get_status
from config import BASE_URL

# URL do seu servidor Flask
FLASK_API_URL = "http://localhost:5000"

def notificar_mudanca_placar(id_event, home_team, away_team, home_score, away_score):
    """Notifica o servidor Flask sobre mudança no placar"""
    try:
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
            timeout=5
        )
        
        if response.status_code == 200:
            print(f"Notificação enviada para {home_team} {home_score} x {away_score} {away_team}")
        else:
            print(f"Erro ao notificar: {response.status_code}")
            
    except Exception as e:
        print(f"Falha ao notificar servidor: {e}")

def monitorar_jogos_ao_vivo():
    """Monitora jogos e atualiza status em tempo real"""
    ultimos_placares = {}  
    
    while True:
        try:
            conn = get_db_connection()
            cursor = conn.cursor()
            
            cursor.execute("""
                SELECT idEvent, dateEvent, strTime, intHomeScore, intAwayScore,
                       strHomeTeam, strAwayTeam 
                FROM partidas 
                WHERE status != 'finalizadas'
            """)
            jogos_ativos = cursor.fetchall()
            
            for jogo in jogos_ativos:
                id_event, date_event, str_time, home_score, away_score, home_team, away_team = jogo
                novo_status = get_status(date_event, str_time, home_score, away_score)
                
                cursor.execute("SELECT status FROM partidas WHERE idEvent = ?", (id_event,))
                result = cursor.fetchone()
                status_atual = result[0] if result else None
                
                if status_atual != novo_status:
                    cursor.execute("UPDATE partidas SET status = ? WHERE idEvent = ?", (novo_status, id_event))
                    
                    if cursor.rowcount > 0:
                        print(f"Jogo {id_event} atualizado de '{status_atual}' para: '{novo_status}'")
                        enviar_notificacao_mudanca_status(id_event, status_atual, novo_status)
                
                # Verifica mudança no placar
                placar_atual = (home_score, away_score)
                placar_anterior = ultimos_placares.get(id_event)
                
                if placar_anterior is not None and placar_atual != placar_anterior:
                    print(f"Placar alterado: {home_team} {home_score} x {away_score} {away_team}")
                    notificar_mudanca_placar(id_event, home_team, away_team, home_score, away_score)
                
                # Atualiza último placar conhecido
                ultimos_placares[id_event] = placar_atual
            
            conn.commit()
            conn.close()
            time.sleep(30)  # Verifica a cada 30 segundos
            
        except Exception as e:
            print(f"Erro no monitoramento: {e}")
            time.sleep(30)

def atualizar_resultados_em_tempo_real():
    """Busca resultados atualizados para jogos ao vivo"""
    while True:
        try:
            conn = get_db_connection()
            cursor = conn.cursor()
            
            cursor.execute("SELECT idEvent, strHomeTeam, strAwayTeam FROM partidas WHERE status = 'ao_vivo'")
            jogos_ao_vivo = cursor.fetchall()
            
            for jogo in jogos_ao_vivo:
                id_event, home_team, away_team = jogo
                try:
                    url = f"{BASE_URL}lookupevent.php?id={id_event}"
                    response = requests.get(url, timeout=10)
                    data = response.json()
                    
                    if data.get('events'):
                        evento = data['events'][0]
                        novo_home_score = evento.get('intHomeScore')
                        novo_away_score = evento.get('intAwayScore')
                        
                        # Verifica se o placar mudou
                        cursor.execute("SELECT intHomeScore, intAwayScore FROM partidas WHERE idEvent = ?", (id_event,))
                        placar_atual = cursor.fetchone()
                        
                        if (placar_atual and 
                            (placar_atual[0] != novo_home_score or placar_atual[1] != novo_away_score)):
                            
                            cursor.execute("""
                                UPDATE partidas 
                                SET intHomeScore = ?, intAwayScore = ? 
                                WHERE idEvent = ?
                            """, (novo_home_score, novo_away_score, id_event))
                            
                            print(f"Placar atualizado: {home_team} {novo_home_score} x {novo_away_score} {away_team}")
                            
                            # Notifica o servidor Flask sobre a mudança
                            notificar_mudanca_placar(id_event, home_team, away_team, novo_home_score, novo_away_score)
                
                except Exception as e:
                    print(f"Erro ao atualizar jogo {id_event}: {e}")
            
            conn.commit()
            conn.close()
            time.sleep(15)  # Verificar a cada 15 segundos para jogos ao vivo
            
        except Exception as e:
            print(f"Erro na atualização de resultados: {e}")
            time.sleep(15)

def enviar_notificacao_mudanca_status(id_event, status_antigo, status_novo):
    """Envia notificação quando o status de um jogo muda"""
    conn = get_db_connection()
    cursor = conn.cursor()
    
    cursor.execute("""
        SELECT ps.idUsuario, p.strHomeTeam, p.strAwayTeam 
        FROM partidas_salvas ps 
        JOIN partidas p ON ps.idEvent = p.idEvent 
        WHERE ps.idEvent = ? AND ps.notificado = 0
    """, (id_event,))
    
    usuarios = cursor.fetchall()
    
    for usuario in usuarios:
        id_usuario, home_team, away_team = usuario
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
    print("Iniciando monitoramento em tempo real...")
    print("Conectado ao servidor Flask em:", FLASK_API_URL)
    
    try:
        thread_monitor = threading.Thread(target=monitorar_jogos_ao_vivo, daemon=True)
        thread_monitor.start()
        
        thread_resultados = threading.Thread(target=atualizar_resultados_em_tempo_real, daemon=True)
        thread_resultados.start()
        
        while True:
            time.sleep(60)
            
    except KeyboardInterrupt:
        print("Encerrando monitoramento...")