import time 
from config import LEAGUE_DATES, BASE_URL
import requests 
from json_database import save_liga, save_partida, get_status

# Função para buscar eventos de futebol por dia e liga.
def get_events_by_day(date, league_name):
    url = f"{BASE_URL}eventsday.php?d={date}&l={league_name}"
    response = requests.get(url, timeout=10)
    
    try:
        data = response.json()
        return data.get("events", []) or []
    except Exception as e:
        print(f"Erro ao processar {date} | {league_name}: {e}")
        return []

# Função para salvar os eventos (partidas) no JSON.
def save_events(events):
    """Salva eventos no arquivo JSON"""
    for e in events:
        # Salva a liga primeiro.
        if e.get("idLeague"):
            save_liga({
                "idLeague": e.get("idLeague"),
                "strLeague": e.get("strLeague"),
                "strSport": e.get("strSport"),
                "strLeagueAlternate": e.get("strLeagueAlternate")
            })
            print(f"Liga {e.get('strLeague')} salva/atualizada.")

        # Determina o status da partida
        status = get_status(e.get("dateEvent"), e.get("strTime"))

        # Salva a partida.
        save_partida({
            "idEvent": e.get("idEvent"),
            "strEvent": e.get("strEvent"),
            "dateEvent": e.get("dateEvent"),
            "strTime": e.get("strTime"),
            "strSeason": e.get("strSeason"),
            "strHomeTeam": e.get("strHomeTeam"),
            "strAwayTeam": e.get("strAwayTeam"),
            "intHomeScore": e.get("intHomeScore"),
            "intAwayScore": e.get("intAwayScore"),
            "strVenue": e.get("strVenue"),
            "idLeague": e.get("idLeague"),
            "status": status,
            "strHomeBadge": e.get("strHomeBadge"),
            "strAwayBadge": e.get("strAwayBadge")
        })

# Função para pegar os dados de uma liga e salvar no JSON
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

# A função principal
def main():
    print("Iniciando coleta de dados do futebol feminino...")
    print("Usando arquivo JSON como banco de dados...")
    
    # Processa todas as ligas
    for league_name in LEAGUE_DATES.keys():
        process_league(league_name)
    
    print("Coleta de dados concluída!")

if __name__ == "__main__":
    main()