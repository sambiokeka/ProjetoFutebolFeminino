import time
from database import get_db_connection, create_tables, get_status
from config import LEAGUE_DATES, BASE_URL
import requests

def get_events_by_day(date, league_name):
    """Busca eventos de uma liga em uma data específica"""
    url = f"{BASE_URL}eventsday.php?d={date}&l={league_name}"
    response = requests.get(url)
    try:
        data = response.json()
        return data.get("events", []) or []
    except Exception as e:
        print(f"Erro ao processar {date} | {league_name}: {e}")
        return []

def save_events(events):
    """Salva eventos no banco de dados"""
    conn = get_db_connection()
    cursor = conn.cursor()
    
    for e in events:
        # Salva a liga primeiro
        if e.get("idLeague"):
            cursor.execute("""
                INSERT OR REPLACE INTO ligas (idLeague, strLeague, strSport, strLeagueAlternate)
                VALUES (?,?,?,?)
            """, (
                e.get("idLeague"),
                e.get("strLeague"),
                e.get("strSport"),
                e.get("strLeagueAlternate")
            ))
            print(f"Liga {e.get('strLeague')} salva/atualizada.")

        # Determina o status da partida (proximas, terminadas ou ao vivo)
        status = get_status(e.get("dateEvent"), e.get("strTime"))

        # Salva a partida
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
    conn.close()

def process_league(league_name):
    """Processa cada liga separadamente"""
    dates = LEAGUE_DATES.get(league_name, [])
    print(f"\nProcessando liga: {league_name}")
    
    for i, date in enumerate(dates, start=1):
        events = get_events_by_day(date, league_name)
        print(f"[{league_name} | {date}] Jogos encontrados: {len(events)}")
        
        if events:
            save_events(events)
        
        # Pausa para não sobrecarregar a API, já q n somos premium
        if i % 5 == 0:
            wait_time = 3
            print(f"Aguardando {wait_time} segundos...")
            time.sleep(wait_time)
        else:
            time.sleep(1.5)

def main():
    print("Iniciando coleta de dados do futebol feminino...")
    print("Criando tabelas no banco de dados...")
    
    # Criando tabelas primeiro
    create_tables()
    
    # Processar cada liga
    for league_name in LEAGUE_DATES.keys():
        process_league(league_name)
    
    print("Coleta de dados concluída!")

if __name__ == "__main__":
    main()