import sqlite3
from datetime import datetime, timedelta
import pytz

# Essa função cria e retorna uma conexão com o banco de dados SQLite.
# O `check_same_thread=False` é necessário para usar a conexão em ambientes multi-thread,
# como em um servidor web.
# O `conn.row_factory = sqlite3.Row` permite acessar colunas pelo nome, não apenas pelo índice.
def get_db_connection():
    conn = sqlite3.connect('futebol_feminino.db', check_same_thread=False)
    conn.row_factory = sqlite3.Row
    return conn

# Essa função cria as tabelas do banco de dados se elas ainda não existirem.
def create_tables():
    conn = get_db_connection()
    cursor = conn.cursor()
    
    # Tabela para armazenar informações sobre as ligas de futebol.
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS ligas (
        idLeague TEXT PRIMARY KEY,
        strLeague TEXT,
        strSport TEXT,
        strLeagueAlternate TEXT
    )
    """)

    # Tabela para armazenar informações detalhadas de cada partida.
    # O `FOREIGN KEY` cria um link entre a partida e a liga à qual ela pertence.
    # A coluna `status` tem uma restrição para garantir apenas valores válidos (proximas, finalizadas, ao vivo).
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

    # Tabela para armazenar partidas que os usuários salvaram.
    # O `UNIQUE (idEvent, idUsuario)` impede que o mesmo usuário salve a mesma partida duas vezes.
    # `data_criacao` registra o momento em que a partida foi salva.
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
    
    conn.commit()
    conn.close()

# Esta função determina o status de uma partida com base na data e hora.
# Ela usa fusos horários para garantir que o cálculo seja preciso, 
# independentemente da localização do servidor.
def get_status(date_str, time_str, home_score=None, away_score=None):
    if not time_str:
        time_str = "00:00:00"
    
    try:
        # Combina a data e a hora do jogo para criar um objeto datetime.
        hora_jogo_utc = datetime.strptime(f"{date_str} {time_str}", "%Y-%m-%d %H:%M:%S")
        
        # Define o fuso horário do Brasil (America/Sao_Paulo).
        fuso_brasil = pytz.timezone('America/Sao_Paulo')
        
        # Converte a hora do jogo de UTC para o fuso horário de Brasília.
        hora_jogo_brasil = hora_jogo_utc.replace(tzinfo=pytz.UTC).astimezone(fuso_brasil)
        
        # Obtém a hora atual no fuso horário de Brasília.
        agora_brasil = datetime.now(fuso_brasil)
        
        # Define a duração de um jogo como 2 horas.
        duracao_jogo = timedelta(hours=2)
        
        # Lógica para determinar o status da partida.
        if hora_jogo_brasil <= agora_brasil <= hora_jogo_brasil + duracao_jogo:
            return "ao_vivo"
        elif agora_brasil > hora_jogo_brasil + duracao_jogo:
            return "finalizadas"
        else:
            return "proximas"
            
    except Exception as e:
        print(f"Erro ao calcular status: {e}")
        # Retorna 'proximas' como um valor de fallback em caso de erro.
        return "proximas"