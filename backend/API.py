import requests
import mysql.connector

API_KEY = "123"  
BASE_URL = f"https://www.thesportsdb.com/api/v1/json/{API_KEY}/"


LEAGUE_ID = "5201"
SEASON = "2025"

conn = mysql.connector.connect(
    host="localhost",
    user="root",      # troque pelo nome do seu usuário do mySQL
    password="root",  # troque pela senha q vc usa no mySQL
    database="futebol_feminino"
)
cursor = conn.cursor()

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
    strVenue VARCHAR(255)
)
""")

def get_season_events(league_id, season):
    url = f"{BASE_URL}eventsseason.php?id={league_id}&s={season}"
    response = requests.get(url)
    data = response.json()
    return data.get("events", [])

def save_to_db(events):
    for e in events:
        cursor.execute("""
            INSERT INTO partidas (idEvent, strEvent, dateEvent, strTime, strSeason, 
                                  strHomeTeam, strAwayTeam, intHomeScore, intAwayScore, strVenue)
            VALUES (%s,%s,%s,%s,%s,%s,%s,%s,%s,%s)
            ON DUPLICATE KEY UPDATE
                strEvent=VALUES(strEvent),
                dateEvent=VALUES(dateEvent),
                strTime=VALUES(strTime),
                strSeason=VALUES(strSeason),
                strHomeTeam=VALUES(strHomeTeam),
                strAwayTeam=VALUES(strAwayTeam),
                intHomeScore=VALUES(intHomeScore),
                intAwayScore=VALUES(intAwayScore),
                strVenue=VALUES(strVenue)
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
        ))
    conn.commit()

if __name__ == "__main__":
    events = get_season_events(LEAGUE_ID, SEASON)
    print(f"Total de jogos encontrados: {len(events)}")

    for ev in events[:5]:  
        print(ev["dateEvent"], ev["strEvent"], ev["strHomeTeam"], "vs", ev["strAwayTeam"])

    save_to_db(events)
    print("Jogos salvos no banco de dados!")

cursor.close()
conn.close()
