import time 
from database import get_db_connection, create_tables, get_status 
from config import LEAGUE_DATES, BASE_URL
import requests

def get_events_by_day(date, league_name):
    url = f"{BASE_URL}eventsday.php?d={date}&l={league_name}"
    response = requests.get(url, timeout=10)
    
    try:
        data = response.json()
        return data.get("events", []) or []
    except Exception as e:
        print(f"Erro ao processar {date} | {league_name}: {e}")
        return []

def save_events(events):
    conn = get_db_connection()
    cursor = conn.cursor()
    
    for e in events:
        if e.get("idLeague"):
            cursor.execute("""
                INSERT OR REPLACE INTO ligas (idLeague, strLeague, strSport, strLeagueAlternate)
                VALUES (?,?,?,?)
            """, (
                e.get("idLeague"), e.get("strLeague"), e.get("strSport"), e.get("strLeagueAlternate")
            ))
            print(f"Liga {e.get('strLeague')} salva/atualizada.")

        status_calculado = get_status(e.get("dateEvent"), e.get("strTime"))

        partida_data = {

            "idEvent": e.get("idEvent"), 

            "idAPIfootball": e.get("idAPIfootball"), 

            "idLeague": e.get("idLeague"),

            "strEvent": e.get("strEvent"),
            "strEventAlternate": e.get("strEventAlternate"),

            "strFilename": e.get("strFilename"),

            "strDescriptionEN": e.get("strDescriptionEN"),

            "strSeason": e.get("strSeason"),

            "intRound": e.get("intRound"),

            "strGroup": e.get("strGroup"),

            "idHomeTeam": e.get("idHomeTeam"), 
            "strHomeTeam": e.get("strHomeTeam"),
            "strHomeTeamBadge": e.get("strHomeTeamBadge"),

            "idAwayTeam": e.get("idAwayTeam"),
            "strAwayTeam": e.get("strAwayTeam"),
            "strAwayTeamBadge": e.get("strAwayTeamBadge"),
             
            "intHomeScore": e.get("intHomeScore"),
            "intAwayScore": e.get("intAwayScore"),

            "strResult": e.get("strResult"),

            "intScore": e.get("intScore"),
            "intScoreVotes": e.get("intScoreVotes"),

            "strTimestamp": e.get("strTimestamp"),
            
            "dateEvent": e.get("dateEvent"),
            "dateEventLocal": e.get("dateEventLocal"),

            "strTime": e.get("strTime"), 
            "strTimeLocal": e.get("strTimeLocal"),
            
            "idVenue": e.get("idVenue"),
            "strVenue": e.get("strVenue"),
            "strCountry": e.get("strCountry"),
            "strCity": e.get("strCity"),
            "strMap": e.get("strMap"),
             
            "strOfficial": e.get("strOfficial"),
             
            "intSpectators": e.get("intSpectators"),

            "strPoster": e.get("strPoster"), 
            "strSquare": e.get("strSquare"),
             
            "strFanart": e.get("strFanart"),

            "strThumb": e.get("strThumb"), 
            
            "strBanner": e.get("strBanner"),
            "strVideo": e.get("strVideo"),

            "strTweet1": e.get("strTweet1"),
            "strTweet2": e.get("strTweet2"), 
            "strTweet3": e.get("strTweet3"),

            "strPostponed": e.get("strPostponed"),
             
            "strLocked": e.get("strLocked"),
            
            "status_calculado": status_calculado
        }

        sql_command = """
            INSERT OR REPLACE INTO partidas (
                idEvent, idAPIfootball, idLeague, strEvent, strEventAlternate, strFilename,
                strDescriptionEN, strSeason, intRound, strGroup, idHomeTeam, strHomeTeam,
                strHomeTeamBadge, idAwayTeam, strAwayTeam, strAwayTeamBadge, intHomeScore,
                intAwayScore, strResult, intScore, intScoreVotes, strTimestamp, dateEvent,
                dateEventLocal, strTime, strTimeLocal, idVenue, strVenue, strCountry,
                strCity, strMap, strOfficial, intSpectators, strPoster, strSquare,
                strFanart, strThumb, strBanner, strVideo, strTweet1, strTweet2, strTweet3,
                strPostponed, strLocked, status_calculado
            ) VALUES (
                :idEvent, :idAPIfootball, :idLeague, :strEvent, :strEventAlternate, :strFilename,
                :strDescriptionEN, :strSeason, :intRound, :strGroup, :idHomeTeam, :strHomeTeam,
                :strHomeTeamBadge, :idAwayTeam, :strAwayTeam, :strAwayTeamBadge, :intHomeScore,
                :intAwayScore, :strResult, :intScore, :intScoreVotes, :strTimestamp, :dateEvent,
                :dateEventLocal, :strTime, :strTimeLocal, :idVenue, :strVenue, :strCountry,
                :strCity, :strMap, :strOfficial, :intSpectators, :strPoster, :strSquare,
                :strFanart, :strThumb, :strBanner, :strVideo, :strTweet1, :strTweet2, :strTweet3,
                :strPostponed, :strLocked, :status_calculado
            )
        """
        
        cursor.execute(sql_command, partida_data)
    
    conn.commit()
    conn.close()

def process_league(league_name):
    dates = LEAGUE_DATES.get(league_name, [])
    print(f"\nProcessando liga: {league_name}")
    
    for i, date in enumerate(dates, start=1):
        events = get_events_by_day(date, league_name)
        print(f"[{league_name} | {date}] Jogos encontrados: {len(events)}")
        
        if events:
            save_events(events)
        
        if i % 5 == 0:
            wait_time = 3
            print(f"Aguardando {wait_time} segundos...")
            time.sleep(wait_time)
        else:
            time.sleep(1.5)

def main():
    print("Iniciando coleta de dados do futebol feminino...")
    print("Criando tabelas no banco de dados...")
    create_tables()
    for league_name in LEAGUE_DATES.keys():
        process_league(league_name)
    print("Coleta de dados concluída!")

if __name__ == "__main__":
    main()