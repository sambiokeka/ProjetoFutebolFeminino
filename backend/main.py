import requests
import sqlite3
import time
from datetime import datetime, timedelta
import pytz
import threading
import os

API_KEY = "123"
BASE_URL = f"https://www.thesportsdb.com/api/v1/json/{API_KEY}/"

# Ligas que queremos monitorar
LEAGUE_NAMES = ["Brazil Brasileiro Women", "International Friendlies Women", "English Womens Super League"]

# Datas dos jogos
LEAGUE_DATES = {
    "Brazil Brasileiro Women": [
        "2025-03-22", "2025-03-23", "2025-03-25", "2025-03-26", "2025-03-27",
        "2025-03-29", "2025-03-30", "2025-03-31",
        "2025-04-11", "2025-04-12", "2025-04-13", "2025-04-15", "2025-04-16",
        "2025-04-17", "2025-04-19", "2025-04-20", "2025-04-21", "2025-04-22",
        "2025-04-26", "2025-04-27", "2025-04-28", "2025-04-30",
        "2025-05-01", "2025-05-03", "2025-05-04", "2025-05-05", "2025-05-10",
        "2025-05-11", "2025-05-12", "2025-05-17", "2025-05-18", "2025-05-19",
        "2025-05-21", "2025-05-22",
        "2025-06-06", "2025-06-07", "2025-06-08", "2025-06-09", "2025-06-14",
        "2025-06-15", "2025-06-18",
        "2025-08-09", "2025-08-10", "2025-08-16", "2025-08-17", "2025-08-24",
        "2025-08-31", '2025-09-14'
    ],
    "International Friendlies Women": [
        "2025-06-29","2025-07-01","2025-07-02","2025-07-03","2025-07-05","2025-07-08"
    ],
    "English Womens Super League": [
        "2025-05-04","2025-05-05","2025-05-10","2025-05-10","2025-05-10",
        "2025-05-10","2025-05-10","2025-05-10","2025-09-05","2025-09-06",
        "2025-09-07","2025-09-07","2025-09-07","2025-09-07","2025-09-12",
        "2025-09-12","2025-09-14","2025-09-14"
    ],
}

# Conexão com SQLite
DB_PATH = "futebol_feminino.db"
conn = sqlite3.connect(DB_PATH, check_same_thread=False)
cursor = conn.cursor()

# ---- Criação de tabelas ----
cursor.execute("""
CREATE TABLE IF NOT EXISTS ligas (
    idLeague TEXT PRIMARY KEY,
    strLeague TEXT,
    strSport TEXT,
    strLeagueAlternate TEXT
)
""")

cursor.execute("""
CREATE TABLE IF NOT EXISTS partidas (
    idEvent TEXT PRIMARY KEY,
    strEvent TEXT,
    dateEvent DATE,
    strTime TEXT,
    strHomeBadge TEXT,
    strAwayBadge TEXT,
    strSeason TEXT,
    strHomeTeam TEXT,
    strAwayTeam TEXT,
    intHomeScore INTEGER,
    intAwayScore INTEGER,
    strVenue TEXT,
    idLeague TEXT,
    status TEXT CHECK(status IN ('proximas', 'ao_vivo', 'finalizadas')) DEFAULT 'proximas',
    FOREIGN KEY (idLeague) REFERENCES ligas(idLeague)
)
""")

cursor.execute("""
CREATE TABLE IF NOT EXISTS partidas_salvas (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    idEvent TEXT NOT NULL,
    idUsuario TEXT NOT NULL,
    data_criacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    notificado INTEGER DEFAULT 0,
    FOREIGN KEY (idEvent) REFERENCES partidas(idEvent),
    UNIQUE (idEvent, idUsuario)
)
""")

# ---- Salva liga no banco ----
def save_league_info(league):
    if not league.get("idLeague"):
        return
    cursor.execute("""
        INSERT OR REPLACE INTO ligas (idLeague, strLeague, strSport, strLeagueAlternate)
        VALUES (?,?,?,?)
    """, (
        league.get("idLeague"),
        league.get("strLeague"),
        league.get("strSport"),
        league.get("strLeagueAlternate")
    ))
    conn.commit()
    print(f"Liga {league.get('strLeague')} salva/atualizada.")

# ---- Determina status da partida ----
def get_status(date_str, time_str, home_score=None, away_score=None):
    if not time_str:
        time_str = "00:00:00"
    try:
        # Criar datetime do jogo em UTC
        hora_jogo_utc = datetime.strptime(f"{date_str} {time_str}", "%Y-%m-%d %H:%M:%S")
        
        # Converter para fuso do Brasil (UTC-3)
        fuso_brasil = pytz.timezone('America/Sao_Paulo')
        hora_jogo_brasil = hora_jogo_utc.replace(tzinfo=pytz.UTC).astimezone(fuso_brasil)
        
        # Hora atual no Brasil
        agora_brasil = datetime.now(fuso_brasil)
        
        # Verificar se o jogo já começou mas ainda não terminou
        duracao_jogo = timedelta(hours=2)  # Provavelmente 2 horas de duração
        
        # Se o jogo está acontecendo agora
        if hora_jogo_brasil <= agora_brasil <= hora_jogo_brasil + duracao_jogo:
            return "ao_vivo"
        # Se o jogo já terminou
        elif agora_brasil > hora_jogo_brasil + duracao_jogo:
            return "finalizadas"
        # Se o jogo ainda não começou
        else:
            return "proximas"
            
    except Exception as e:
        print(f"Erro ao calcular status: {e}")
        return "proximas"

# ---- Busca eventos de uma liga em uma data específica ----
def get_events_by_day(date, league_name):
    url = f"{BASE_URL}eventsday.php?d={date}&l={league_name}"
    response = requests.get(url)
    try:
        data = response.json()
        return data.get("events", []) or []
    except Exception as e:
        print(f"Erro ao processar {date} | {league_name}: {e}")
        print("Conteúdo bruto:", response.text)
        return []

# ---- Salva eventos no banco ----
def save_events(events):
    for e in events:
        league_info = {
            "idLeague": e.get("idLeague"),
            "strLeague": e.get("strLeague"),
            "strSport": e.get("strSport"),
            "strLeagueAlternate": e.get("strLeagueAlternate")
        }
        save_league_info(league_info)

        status = get_status(e.get("dateEvent"), e.get("strTime"))

        cursor.execute("""
            INSERT OR REPLACE INTO partidas 
            (idEvent, strEvent, dateEvent, strTime, strSeason, 
             strHomeTeam, strAwayTeam, intHomeScore, intAwayScore, 
             strVenue, idLeague, status, strHomeBadge, strAwayBadge)
            VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?)
        """, (
            e.get("idEvent"),
            e.get("strEvent"),
            e.get("dateEvent"),
            e.get("strTime"),
            e.get("strSeason"),
            e.get("strHomeTeam"),
            e.get("strAwayTeam"),
            e.get("intHomeScore"),
            e.get("intAwayScore"),
            e.get("strVenue"),
            e.get("idLeague"),
            status,
            e.get("strHomeBadge"),  
            e.get("strAwayBadge")  
        ))
    conn.commit()

# ---- Processa cada liga separadamente ----
def process_league(league_name):
    dates = LEAGUE_DATES.get(league_name, [])
    for i, date in enumerate(dates, start=1):
        events = get_events_by_day(date, league_name)
        print(f"[{league_name} | {date}] Jogos encontrados: {len(events)}")
        save_events(events)
        # Pausa de 3 segundos a cada 5 pulls para não sobrecarregar a API
        if i % 5 == 0:
            time.sleep(3)
        else:
            time.sleep(1.5)

# ---- Monitorar jogos em tempo real ----
def monitorar_jogos_ao_vivo():
    """Monitora jogos e atualiza status em tempo real"""
    while True:
        try:
            cursor.execute("""
                SELECT idEvent, dateEvent, strTime, intHomeScore, intAwayScore 
                FROM partidas 
                WHERE status != 'finalizadas'
            """)
            jogos_ativos = cursor.fetchall()
            
            for jogo in jogos_ativos:
                id_event, date_event, str_time, home_score, away_score = jogo
                
                novo_status = get_status(date_event, str_time, home_score, away_score)
                
                cursor.execute("SELECT status FROM partidas WHERE idEvent = ?", (id_event,))
                result = cursor.fetchone()
                status_atual = result[0] if result else None
                
                if status_atual != novo_status:
                    cursor.execute("""
                        UPDATE partidas 
                        SET status = ? 
                        WHERE idEvent = ?
                    """, (novo_status, id_event))
                    
                    if cursor.rowcount > 0:
                        print(f"Jogo {id_event} atualizado de '{status_atual}' para: '{novo_status}'")
                        # Enviar notificação se houver mudança
                        enviar_notificacao_mudanca_status(id_event, status_atual, novo_status)
            
            conn.commit()
            
            time.sleep(60)
            
        except Exception as e:
            print(f"Erro no monitoramento: {e}")
            time.sleep(60)

# ---- Atualizar resultados em tempo real ----
def atualizar_resultados_em_tempo_real():
    """Busca resultados atualizados para jogos ao vivo"""
    while True:
        try:
            # Buscar jogos ao vivo
            cursor.execute("SELECT idEvent FROM partidas WHERE status = 'ao_vivo'")
            jogos_ao_vivo = cursor.fetchall()
            
            for (id_event,) in jogos_ao_vivo:
                try:
                    # Buscar informações atualizadas da API
                    url = f"{BASE_URL}lookupevent.php?id={id_event}"
                    response = requests.get(url)
                    data = response.json()
                    
                    if data.get('events'):
                        evento = data['events'][0]
                        
                        # Atualizar placar
                        cursor.execute("""
                            UPDATE partidas 
                            SET intHomeScore = ?, intAwayScore = ? 
                            WHERE idEvent = ?
                        """, (
                            evento.get('intHomeScore'), 
                            evento.get('intAwayScore'), 
                            id_event
                        ))
                        
                        print(f"Placar atualizado: {evento.get('strHomeTeam')} {evento.get('intHomeScore')} x {evento.get('intAwayScore')} {evento.get('strAwayTeam')}")
                
                except Exception as e:
                    print(f"Erro ao atualizar jogo {id_event}: {e}")
            
            conn.commit()
            time.sleep(30)  
            
        except Exception as e:
            print(f"Erro na atualização de resultados: {e}")
            time.sleep(30)

# ---- Notificações de mudança de status ----
def enviar_notificacao_mudanca_status(id_event, status_antigo, status_novo):
    """Envia notificação quando o status de um jogo muda"""
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

# ---- Execução principal ----
if __name__ == "__main__":
    for league_name in LEAGUE_DATES.keys():
        process_league(league_name)
    
    print("Processamento inicial concluído. Iniciando monitoramento...")
    
    try:
        thread_monitor = threading.Thread(target=monitorar_jogos_ao_vivo, daemon=True)
        thread_monitor.start()
        
        thread_resultados = threading.Thread(target=atualizar_resultados_em_tempo_real, daemon=True)
        thread_resultados.start()
        
        while True:
            time.sleep(60)
            
    except KeyboardInterrupt:
        print("Encerrando monitoramento...")
    finally:
        cursor.close()
        conn.close()