import requests
import mysql.connector
import time
from datetime import datetime

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
        "2025-08-31"
    ],
    "International Friendlies Women": [
        "2025-06-29","2025-07-01","2025-07-02","2025-07-03","2025-07-05","2025-07-08"
    ],
    "English Womens Super League": [
        "2025-05-04","2025-05-05","2025-05-10","2025-05-10","2025-05-10",
        "2025-05-10","2025-05-10","2025-05-10","2025-09-05","2025-09-06",
        "2025-09-07","2025-09-07","2025-09-07","2025-09-07","2025-09-12",
        "2025-09-12","2025-09-14","2025-09-14"
    ]
}

# Conexão com MySQL
conn = mysql.connector.connect(
    host="localhost",
    user="root",
    password="root",
    database="futebol_feminino"
)
cursor = conn.cursor()

# ---- Criação de tabelas ----
cursor.execute("""
CREATE TABLE IF NOT EXISTS ligas (
    idLeague VARCHAR(50) PRIMARY KEY,
    strLeague VARCHAR(255),
    strSport VARCHAR(100),
    strLeagueAlternate VARCHAR(255)
)
""")

cursor.execute("""
CREATE TABLE IF NOT EXISTS partidas (
    idEvent VARCHAR(50) PRIMARY KEY,
    strEvent VARCHAR(255),
    dateEvent DATE,
    strTime VARCHAR(20),
    strSeason VARCHAR(20),
    strHomeTeam VARCHAR(100),
    strAwayTeam VARCHAR(100),
    intHomeScore INT,
    intAwayScore INT,
    strVenue VARCHAR(255),
    idLeague VARCHAR(50),
    status ENUM('proximas','finalizadas') DEFAULT 'proximas',
    FOREIGN KEY (idLeague) REFERENCES ligas(idLeague)
)
""")

cursor.execute("""
CREATE TABLE IF NOT EXISTS partidas_salvas (
    id INT AUTO_INCREMENT PRIMARY KEY,
    idEvent VARCHAR(50) NOT NULL,
    idUsuario VARCHAR(100) NOT NULL,
    data_criacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    notificado TINYINT(1) DEFAULT 0,
    FOREIGN KEY (idEvent) REFERENCES partidas(idEvent),
    UNIQUE KEY unique_partida_usuario (idEvent, idUsuario)
)
""")



# ---- Salva liga no banco ----
def save_league_info(league):
    if not league.get("idLeague"):
        return
    cursor.execute("""
        INSERT INTO ligas (idLeague, strLeague, strSport, strLeagueAlternate)
        VALUES (%s,%s,%s,%s)
        ON DUPLICATE KEY UPDATE
            strLeague=VALUES(strLeague),
            strSport=VALUES(strSport),
            strLeagueAlternate=VALUES(strLeagueAlternate)
    """, (
        league.get("idLeague"),
        league.get("strLeague"),
        league.get("strSport"),
        league.get("strLeagueAlternate")
    ))
    conn.commit()
    print(f"Liga {league.get('strLeague')} salva/atualizada.")

# ---- Determina status da partida ----
def get_status(date_str, time_str):
    if not time_str:
        time_str = "00:00:00"
    if "AM" in time_str or "PM" in time_str:
        time_part, modifier = time_str.split(" ")
        hours, minutes = map(int, time_part.split(":"))
        if modifier.upper() == "PM" and hours < 12:
            hours += 12
        if modifier.upper() == "AM" and hours == 12:
            hours = 0
        time_str = f"{hours:02d}:{minutes:02d}:00"
    jogo_datetime = datetime.strptime(f"{date_str} {time_str}", "%Y-%m-%d %H:%M:%S")
    agora = datetime.now()
    return "proximas" if jogo_datetime > agora else "finalizadas"

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
            INSERT INTO partidas (idEvent, strEvent, dateEvent, strTime, strSeason, 
                                  strHomeTeam, strAwayTeam, intHomeScore, intAwayScore, strVenue, idLeague, status)
            VALUES (%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s)
            ON DUPLICATE KEY UPDATE
                strEvent=VALUES(strEvent),
                dateEvent=VALUES(dateEvent),
                strTime=VALUES(strTime),
                strSeason=VALUES(strSeason),
                strHomeTeam=VALUES(strHomeTeam),
                strAwayTeam=VALUES(strAwayTeam),
                intHomeScore=VALUES(intHomeScore),
                intAwayScore=VALUES(intAwayScore),
                strVenue=VALUES(strVenue),
                idLeague=VALUES(idLeague),
                status=VALUES(status)
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
            status
        ))
    conn.commit()

# ---- Processa cada liga separadamente ----
def process_league(league_name):
    dates = LEAGUE_DATES.get(league_name, [])
    for i, date in enumerate(dates, start=1):
        events = get_events_by_day(date, league_name)
        print(f"[{league_name} | {date}] Jogos encontrados: {len(events)}")
        save_events(events)
        # Pausa de 3 segundos a cada 5 pulls
        if i % 5 == 0:
            time.sleep(3)
        else:
            time.sleep(1.5)

# ---- Execução principal ----
if __name__ == "__main__":
    for league_name in LEAGUE_DATES.keys():
        process_league(league_name)

    print("Processamento concluído.")
    cursor.close()
    conn.close()