import requests

API_KEY = "123"
BASE_URL = f"https://www.thesportsdb.com/api/v1/json/{API_KEY}/"
LEAGUE_ID = "5400"
SEASON = "2025"

url = f"{BASE_URL}eventsseason.php?id={LEAGUE_ID}&s={SEASON}"
response = requests.get(url)

try:
    data = response.json()
    events = data.get("events") or []  # se não tiver eventos, vira lista vazia
    print(f"{len(events)} jogos encontrados na temporada {SEASON} da liga {LEAGUE_ID}")
    for e in events[:10]:  # mostra só os primeiros 10 para teste
        print(f"{e.get('dateEvent')} - {e.get('strEvent')} - {e.get('strHomeTeam')} vs {e.get('strAwayTeam')} ({e.get('strTime')})")
except Exception as err:
    print("Erro ao buscar os jogos:", err)
    print("Conteúdo bruto:", response.text)
