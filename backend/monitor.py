import time
import threading
import requests
import sqlite3
import os
from database import get_status
from config import BASE_URL

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
DB_DIR = os.path.join(BASE_DIR, 'database')
DATABASE_FUTEBOL = os.path.join(DB_DIR, 'futebol_feminino.db')

FLASK_API_URL = "http://localhost:5000"
thread_local = threading.local()

def get_thread_db_connection():
    if not hasattr(thread_local, "conn"):
        thread_local.conn = sqlite3.connect(DATABASE_FUTEBOL)
        thread_local.conn.row_factory = sqlite3.Row
        print(f"Nova conexão de banco criada para thread {threading.get_ident()}")
    return thread_local.conn

def notificar_mudanca_placar(id_event, home_team, away_team, home_score, away_score):
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
    ultimos_placares = {}
    
    while True:
        try:
            conn = get_thread_db_connection()
            cursor = conn.cursor()
            
            cursor.execute("""
                SELECT idEvent, dateEvent, strTime, intHomeScore, intAwayScore,
                       strHomeTeam, strAwayTeam 
                FROM partidas
                WHERE status_calculado != 'finalizadas'
            """)
            jogos_ativos = cursor.fetchall()
            
            for jogo in jogos_ativos:
                id_event, date_event, str_time, home_score, away_score, home_team, away_team = jogo
                novo_status = get_status(date_event, str_time)
                
                cursor.execute("SELECT status_calculado FROM partidas WHERE idEvent = ?", (id_event,))
                result = cursor.fetchone()
                status_atual = result[0] if result else None
                
                if status_atual != novo_status:

                    cursor.execute("UPDATE partidas SET status_calculado = ? WHERE idEvent = ?", (novo_status, id_event))
                    if cursor.rowcount > 0:
                        print(f"Jogo {id_event} atualizado de '{status_atual}' para: '{novo_status}'")
                        enviar_notificacao_mudanca_status(id_event, status_atual, novo_status)
                
                placar_atual = (home_score, away_score)
                placar_anterior = ultimos_placares.get(id_event)
                
                if placar_anterior is not None and placar_atual != placar_anterior:
                    print(f"Placar alterado: {home_team} {home_score} x {away_score} {away_team}")
                    notificar_mudanca_placar(id_event, home_team, away_team, home_score, away_score)
                
                ultimos_placares[id_event] = placar_atual
            
            conn.commit()
            time.sleep(30)
            
        except Exception as e:
            print(f"Erro no monitoramento: {e}")
            time.sleep(30)

def atualizar_resultados_em_tempo_real():
    while True:
        try:
            conn = get_thread_db_connection()
            cursor = conn.cursor()
            
            cursor.execute("SELECT idEvent, strHomeTeam, strAwayTeam FROM partidas WHERE status_calculado = 'ao_vivo'")
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
                        
                        cursor.execute("SELECT intHomeScore, intAwayScore FROM partidas WHERE idEvent = ?", (id_event,))
                        placar_atual = cursor.fetchone()
                        
                        if (placar_atual and (placar_atual[0] != novo_home_score or placar_atual[1] != novo_away_score)):
                            cursor.execute("""
                                UPDATE partidas
                                SET intHomeScore = ?, intAwayScore = ? 
                                WHERE idEvent = ?
                            """, (novo_home_score, novo_away_score, id_event))
                            print(f"Placar atualizado: {home_team} {novo_home_score} x {novo_away_score} {away_team}")
                            notificar_mudanca_placar(id_event, home_team, away_team, novo_home_score, novo_away_score)
                
                except Exception as e:
                    print(f"Erro ao atualizar jogo {id_event}: {e}")
            
            conn.commit()
            time.sleep(15)

        except Exception as e:
            print(f"Erro na atualização de resultados: {e}")
            time.sleep(15)

def enviar_notificacao_mudanca_status(id_event, status_atual, status_novo):
    conn = get_thread_db_connection()
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

def fechar_conexoes():
    if hasattr(thread_local, "conn"):
        try:
            thread_local.conn.close()
            print(f"Conexão fechada para thread {threading.get_ident()}")
        except:
            pass

if __name__ == "__main__":
    print("Iniciando monitoramento em tempo real...")
    print("Conectado ao servidor Flask em:", FLASK_API_URL)
    
    import atexit
    atexit.register(fechar_conexoes)
    
    try:
        thread_monitor = threading.Thread(target=monitorar_jogos_ao_vivo, daemon=True)
        thread_monitor.start()
        
        thread_resultados = threading.Thread(target=atualizar_resultados_em_tempo_real, daemon=True)
        thread_resultados.start()
        
        while True:
            time.sleep(60)
            
    except KeyboardInterrupt:
        print("Encerrando monitoramento...")
        fechar_conexoes()