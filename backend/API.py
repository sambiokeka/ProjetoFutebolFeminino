import requests
import mysql.connector

API_KEY = "123"
BASE_URL = f"https://www.thesportsdb.com/api/v1/json/{API_KEY}/"

LEAGUE_IDS = ["5400", "5201"] 
SEASON = "2025"

conn = mysql.connector.connect(
    host="localhost",
    user="root",
    password="root",
    database="futebol_feminino"
)
cursor = conn.cursor()

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
    FOREIGN KEY (idLeague) REFERENCES ligas(idLeague)
)
""")

def save_league_info(league_id):
    url = f"{BASE_URL}lookupleague.php?id={league_id}"
    data = requests.get(url).json()
    league = data.get("leagues", [])[0] if data.get("leagues") else None
    if league:
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

def get_season_events(league_id, season):
    url = f"{BASE_URL}eventsseason.php?id={league_id}&s={season}"
    data = requests.get(url).json()
    return data.get("events", []) or []

def save_events(events, league_id):
    for e in events:
        idLeague_to_save = e.get("idLeague") or league_id

        cursor.execute("""
            INSERT INTO partidas (idEvent, strEvent, dateEvent, strTime, strSeason, 
                                  strHomeTeam, strAwayTeam, intHomeScore, intAwayScore, strVenue, idLeague)
            VALUES (%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s)
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
                idLeague=VALUES(idLeague)
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
            idLeague_to_save
        ))
    conn.commit()


def process_league(league_id, season):
    save_league_info(league_id)             
    events = get_season_events(league_id, season)
    print(f"[{league_id}] jogos encontrados: {len(events)}")
    save_events(events, league_id)            

if __name__ == "__main__":
    for lid in LEAGUE_IDS:
        process_league(lid, SEASON)

    print("Todas as ligas processadas e partidas salvas.")
    cursor.close()
    conn.close()
