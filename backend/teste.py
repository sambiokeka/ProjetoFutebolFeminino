import requests

API_KEY = "123"
BASE_URL = f"https://www.thesportsdb.com/api/v1/json/{API_KEY}/"
GAME_DATE = "2025-03-22"  # Data que você quer buscar

def get_events_by_day(date):
    url = f"{BASE_URL}eventsday.php?d={date}"
    response = requests.get(url)
    try:
        data = response.json()
        events = data.get("events") or []
        return events
    except Exception as err:
        print("Erro ao buscar eventos:", err)
        print("Conteúdo bruto:", response.text)
        return []

events = get_events_by_day(GAME_DATE)
print(f"{len(events)} jogos encontrados na data {GAME_DATE}")

for e in events:
    print(f"{e.get('dateEvent')} - {e.get('strEvent')} - {e.get('strHomeTeam')} vs {e.get('strAwayTeam')}")
