import time 
from database import get_db_connection, create_tables, get_status 
from config import LEAGUE_DATES, BASE_URL
import requests 

# Função para buscar eventos de futebol por dia e liga.
# Ela faz uma requisição para a API e retorna uma lista de eventos (jogos).
def get_events_by_day(date, league_name):
    # Constrói a URL da API com a data e o nome da liga.
    url = f"{BASE_URL}eventsday.php?d={date}&l={league_name}"
    
    # Faz a requisição GET para a URL da API com um timeout para evitar que o script trave, não sei pq ele trava, mas as vezes acontecia.
    response = requests.get(url, timeout=10)
    
    try:
        # Decodifica a resposta JSON.
        data = response.json()
        # Retorna a lista de eventos (jogos) ou uma lista vazia se n tiver eventos.
        return data.get("events", []) or []
    except Exception as e:
        # Captura e exibe qualquer erro que ocorra durante o processamento da resposta JSON.
        print(f"Erro ao processar {date} | {league_name}: {e}")
        return []

# Função para salvar os eventos (partidas) no banco de dados.
# Ela percorre a lista de eventos e insere cada um nas tabelas `ligas` e `partidas`.
def save_events(events):
    """Salva eventos no banco de dados"""
    conn = get_db_connection() # Pega a conexão com o banco de dados.
    cursor = conn.cursor() # Cria um cursor para executar comandos SQL.
    
    for e in events:
        # Salva a liga primeiro.
        # Usa `INSERT OR REPLACE` para garantir que a liga seja adicionada ou atualizada se já existir, e evitando q ela se duplique.
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

        # Determina o status da partida (próximas, terminadas (sim mudamos de finalizadas pra terminadas, mas não muda nada na pratica) ou ao vivo).
        status = get_status(e.get("dateEvent"), e.get("strTime"))

        # Salva a partida.
        # O comando `INSERT OR REPLACE` q serve pra msm coisa q o outro.
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
    
    conn.commit() # Confirma
    conn.close() # Fecha a conexão.

# Função para processar uma liga, buscando eventos para todas as datas definidas.
def process_league(league_name):
    # Obtém a lista de datas para a liga
    dates = LEAGUE_DATES.get(league_name, [])
    print(f"\nProcessando liga: {league_name}")
    
    # faz um loop por cada data, buscando e salvando eventos.
    for i, date in enumerate(dates, start=1): # Começa a contagem em 1 para facilitar a leitura
        events = get_events_by_day(date, league_name)
        print(f"[{league_name} | {date}] Jogos encontrados: {len(events)}")
        
        if events:
            save_events(events) # Chama a função para salvar os eventos encontrados, o argumento é a lista de eventos.
        
        # Pausa a execução para não sobrecarregar a API, já que não temos uma chave premium.
        # A API gratuita n permite muitas requisições seguidas, então fazemos uma pausa maior a cada 5 requisições.
        if i % 5 == 0:
            wait_time = 3
            print(f"Aguardando {wait_time} segundos...")
            time.sleep(wait_time)
        else:
            time.sleep(1.5)

# A função principal que comanda todo o processo.
def main():
    print("Iniciando coleta de dados do futebol feminino...")
    print("Criando tabelas no banco de dados...")
    
    # Garante que as tabelas do banco de dados existem antes de começar a coleta.
    create_tables()
    
    # Passa por todas as ligas definidas no arquivo de configuração e as processa.
    for league_name in LEAGUE_DATES.keys(): # O key() pega só os nomes das ligas, n precisa do valor.
        process_league(league_name)
    
    print("Coleta de dados concluída!")

# Executa a função principal se o script for executado diretamente.
if __name__ == "__main__":
    main()