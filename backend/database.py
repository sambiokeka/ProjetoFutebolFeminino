# database.py
import sqlite3
from datetime import datetime, timedelta
import pytz

def get_db_connection():
    conn = sqlite3.connect('futebol_feminino.db', check_same_thread=False)
    conn.row_factory = sqlite3.Row
    return conn

def create_tables():
    conn = get_db_connection()
    cursor = conn.cursor()
    
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS ligas (
        idLeague TEXT PRIMARY KEY,
        strLeague TEXT,
        strSport TEXT,
        strLeagueAlternate TEXT
    )
    """)

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

def get_status(date_str, time_str, home_score=None, away_score=None):
    if not time_str:
        time_str = "00:00:00"
    try:
        hora_jogo_utc = datetime.strptime(f"{date_str} {time_str}", "%Y-%m-%d %H:%M:%S")
        fuso_brasil = pytz.timezone('America/Sao_Paulo')
        hora_jogo_brasil = hora_jogo_utc.replace(tzinfo=pytz.UTC).astimezone(fuso_brasil)
        agora_brasil = datetime.now(fuso_brasil)
        duracao_jogo = timedelta(hours=2)
        
        if hora_jogo_brasil <= agora_brasil <= hora_jogo_brasil + duracao_jogo:
            return "ao_vivo"
        elif agora_brasil > hora_jogo_brasil + duracao_jogo:
            return "finalizadas"
        else:
            return "proximas"
            
    except Exception as e:
        print(f"Erro ao calcular status: {e}")
        return "proximas"