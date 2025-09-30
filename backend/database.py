import sqlite3
from datetime import datetime, timedelta
import pytz
import os

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
DB_DIR = os.path.join(BASE_DIR, 'database')
DATABASE_FUTEBOL = os.path.join(DB_DIR, 'futebol_feminino.db')

def get_db_connection():
    if not os.path.exists(DB_DIR):
        os.makedirs(DB_DIR)
    conn = sqlite3.connect(DATABASE_FUTEBOL, check_same_thread=False)
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

    cursor.execute("""
    CREATE TABLE IF NOT EXISTS partidas (
        idEvent TEXT PRIMARY KEY,
        idAPIfootball TEXT,
        idLeague TEXT,
        strEvent TEXT,
        strEventAlternate TEXT,
        strFilename TEXT,
        strDescriptionEN TEXT,
        strSeason TEXT,
        intRound TEXT,
        strGroup TEXT,
        idHomeTeam TEXT,
        strHomeTeam TEXT,
        strHomeTeamBadge TEXT,
        idAwayTeam TEXT,
        strAwayTeam TEXT,
        strAwayTeamBadge TEXT,
        intHomeScore INTEGER,
        intAwayScore INTEGER,
        strResult TEXT,
        intScore INTEGER,
        intScoreVotes INTEGER,
        strTimestamp TEXT,
        dateEvent TEXT,
        dateEventLocal TEXT,
        strTime TEXT,
        strTimeLocal TEXT,
        idVenue TEXT,
        strVenue TEXT,
        strCountry TEXT,
        strCity TEXT,
        strMap TEXT,
        strOfficial TEXT,
        intSpectators INTEGER,
        strPoster TEXT,
        strSquare TEXT,
        strFanart TEXT,
        strThumb TEXT,
        strBanner TEXT,
        strVideo TEXT,
        strTweet1 TEXT,
        strTweet2 TEXT,
        strTweet3 TEXT,
        strPostponed TEXT,
        strLocked TEXT,
        status_calculado TEXT CHECK(status_calculado IN ('proximas', 'ao_vivo', 'finalizadas')) DEFAULT 'proximas',
        FOREIGN KEY (idLeague) REFERENCES ligas(idLeague)
    )
    """)
    
    conn.commit()
    conn.close()

def get_status(date_str, time_str):
    if not time_str or not date_str:
        return "proximas"
    
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
    except (ValueError, TypeError):
        return "proximas"