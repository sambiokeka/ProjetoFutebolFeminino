import sqlite3
from datetime import datetime, timedelta
import os 

BASE_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
DB_DIR = os.path.join(BASE_DIR, 'database')

DATABASE_FUTEBOL = os.path.join(DB_DIR, 'futebol_feminino.db') # banco de dados de futebol mesmo

# Conexão com o banco
conn = sqlite3.connect(DATABASE_FUTEBOL)
cursor = conn.cursor()

# Dados para a Copa do Brasil Feminina 2025
dados_copa_do_brasil = [
    # 3ª Fase
    {
        'idEvent': 'copa_br_f3_01', 'strEvent': 'Atlético Piauiense Women vs São José-SP Women',
        'dateEvent': '2025-08-05', 'strTime': '15:00:00', 'strSeason': '2025',
        'strHomeTeam': 'Atlético Piauiense Women', 'strAwayTeam': 'São José-SP Women',
        'intHomeScore': 3, 'intAwayScore': 0, 'strVenue': None,
        'idLeague': 'copa_br_2025', 'status': 'finalizadas'
    },
    {
        'idEvent': 'copa_br_f3_02', 'strEvent': 'Juventude-RS Women vs Fortaleza Women',
        'dateEvent': '2025-08-05', 'strTime': '15:00:00', 'strSeason': '2025',
        'strHomeTeam': 'Juventude-RS Women', 'strAwayTeam': 'Fortaleza Women',
        'intHomeScore': 2, 'intAwayScore': 2, 'strVenue': None,
        'idLeague': 'copa_br_2025', 'status': 'finalizadas', 'intHomePen': 4, 'intAwayPen': 2
    },
    {
        'idEvent': 'copa_br_f3_03', 'strEvent': 'Sport Women vs Manaus FC Women',
        'dateEvent': '2025-08-05', 'strTime': '15:00:00', 'strSeason': '2025',
        'strHomeTeam': 'Sport Women', 'strAwayTeam': 'Manaus FC Women',
        'intHomeScore': 10, 'intAwayScore': 0, 'strVenue': None,
        'idLeague': 'copa_br_2025', 'status': 'finalizadas'
    },
    {
        'idEvent': 'copa_br_f3_04', 'strEvent': 'Bragantino Women vs Botafogo Women',
        'dateEvent': '2025-08-05', 'strTime': '19:00:00', 'strSeason': '2025',
        'strHomeTeam': 'Bragantino Women', 'strAwayTeam': 'Botafogo Women',
        'intHomeScore': 2, 'intAwayScore': 1, 'strVenue': None,
        'idLeague': 'copa_br_2025', 'status': 'finalizadas'
    },
    {
        'idEvent': 'copa_br_f3_05', 'strEvent': 'Avaí/Kindermann Women vs Palmeiras Women',
        'dateEvent': '2025-08-06', 'strTime': '15:00:00', 'strSeason': '2025',
        'strHomeTeam': 'Avaí/Kindermann Women', 'strAwayTeam': 'Palmeiras Women',
        'intHomeScore': 0, 'intAwayScore': 4, 'strVenue': None,
        'idLeague': 'copa_br_2025', 'status': 'finalizadas'
    },
    {
        'idEvent': 'copa_br_f3_06', 'strEvent': 'Coritiba Women vs Ferroviária Women',
        'dateEvent': '2025-08-06', 'strTime': '15:00:00', 'strSeason': '2025',
        'strHomeTeam': 'Coritiba Women', 'strAwayTeam': 'Ferroviária Women',
        'intHomeScore': 1, 'intAwayScore': 5, 'strVenue': None,
        'idLeague': 'copa_br_2025', 'status': 'finalizadas'
    },
    {
        'idEvent': 'copa_br_f3_07', 'strEvent': 'Bahia Women vs Grêmio Women',
        'dateEvent': '2025-08-06', 'strTime': '15:00:00', 'strSeason': '2025',
        'strHomeTeam': 'Bahia Women', 'strAwayTeam': 'Grêmio Women',
        'intHomeScore': 1, 'intAwayScore': 0, 'strVenue': None,
        'idLeague': 'copa_br_2025', 'status': 'finalizadas'
    },
    {
        'idEvent': 'copa_br_f3_08', 'strEvent': 'Real Brasília Women vs Atlético-MG Women',
        'dateEvent': '2025-08-06', 'strTime': '15:00:00', 'strSeason': '2025',
        'strHomeTeam': 'Real Brasília Women', 'strAwayTeam': 'Atlético-MG Women',
        'intHomeScore': 0, 'intAwayScore': 2, 'strVenue': None,
        'idLeague': 'copa_br_2025', 'status': 'finalizadas'
    },
    {
        'idEvent': 'copa_br_f3_09', 'strEvent': 'Flamengo Women vs Operário-MS Women',
        'dateEvent': '2025-08-06', 'strTime': '15:00:00', 'strSeason': '2025',
        'strHomeTeam': 'Flamengo Women', 'strAwayTeam': 'Operário-MS Women',
        'intHomeScore': 6, 'intAwayScore': 0, 'strVenue': None,
        'idLeague': 'copa_br_2025', 'status': 'finalizadas'
    },
    {
        'idEvent': 'copa_br_f3_10', 'strEvent': 'Pinda Women vs Realidade Jovem Women',
        'dateEvent': '2025-08-06', 'strTime': '15:00:00', 'strSeason': '2025',
        'strHomeTeam': 'Pinda Women', 'strAwayTeam': 'Realidade Jovem Women',
        'intHomeScore': 1, 'intAwayScore': 1, 'strVenue': None,
        'idLeague': 'copa_br_2025', 'status': 'finalizadas', 'intHomePen': 2, 'intAwayPen': 4
    },
    {
        'idEvent': 'copa_br_f3_11', 'strEvent': 'Cruzeiro Women vs Corinthians Women',
        'dateEvent': '2025-08-06', 'strTime': '16:30:00', 'strSeason': '2025',
        'strHomeTeam': 'Cruzeiro Women', 'strAwayTeam': 'Corinthians Women',
        'intHomeScore': 1, 'intAwayScore': 1, 'strVenue': None,
        'idLeague': 'copa_br_2025', 'status': 'finalizadas', 'intHomePen': 2, 'intAwayPen': 4
    },
    {
        'idEvent': 'copa_br_f3_12', 'strEvent': 'Internacional Women vs 3B da Amazônia Women',
        'dateEvent': '2025-08-06', 'strTime': '16:30:00', 'strSeason': '2025',
        'strHomeTeam': 'Internacional Women', 'strAwayTeam': '3B da Amazônia Women',
        'intHomeScore': 3, 'intAwayScore': 1, 'strVenue': None,
        'idLeague': 'copa_br_2025', 'status': 'finalizadas'
    },
    {
        'idEvent': 'copa_br_f3_13', 'strEvent': 'Vasco Women vs São Paulo Women',
        'dateEvent': '2025-08-06', 'strTime': '16:30:00', 'strSeason': '2025',
        'strHomeTeam': 'Vasco Women', 'strAwayTeam': 'São Paulo Women',
        'intHomeScore': 1, 'intAwayScore': 3, 'strVenue': None,
        'idLeague': 'copa_br_2025', 'status': 'finalizadas'
    },
    {
        'idEvent': 'copa_br_f3_14', 'strEvent': 'Mixto-MT Women vs Vitória Women',
        'dateEvent': '2025-08-06', 'strTime': '16:30:00', 'strSeason': '2025',
        'strHomeTeam': 'Mixto-MT Women', 'strAwayTeam': 'Vitória Women',
        'intHomeScore': 1, 'intAwayScore': 3, 'strVenue': None,
        'idLeague': 'copa_br_2025', 'status': 'finalizadas'
    },
    {
        'idEvent': 'copa_br_f3_15', 'strEvent': 'Fluminense Women vs Brasil de Farroupilha Women',
        'dateEvent': '2025-08-06', 'strTime': '19:00:00', 'strSeason': '2025',
        'strHomeTeam': 'Fluminense Women', 'strAwayTeam': 'Brasil de Farroupilha Women',
        'intHomeScore': 3, 'intAwayScore': 0, 'strVenue': None,
        'idLeague': 'copa_br_2025', 'status': 'finalizadas'
    },
    {
        'idEvent': 'copa_br_f3_16', 'strEvent': 'América-MG Women vs Santos Women',
        'dateEvent': '2025-08-06', 'strTime': '20:00:00', 'strSeason': '2025',
        'strHomeTeam': 'América-MG Women', 'strAwayTeam': 'Santos Women',
        'intHomeScore': 1, 'intAwayScore': 0, 'strVenue': None,
        'idLeague': 'copa_br_2025', 'status': 'finalizadas'
    },

    # 2ª Fase (Resultados de junho)
    {
        'idEvent': 'copa_br_f2_01', 'strEvent': 'Doce Mel Women vs Pinda Women',
        'dateEvent': '2025-06-09', 'strTime': '15:00:00', 'strSeason': '2025',
        'strHomeTeam': 'Doce Mel Women', 'strAwayTeam': 'Pinda Women',
        'intHomeScore': 2, 'intAwayScore': 3, 'strVenue': None,
        'idLeague': 'copa_br_2025', 'status': 'finalizadas'
    },
    {
        'idEvent': 'copa_br_f2_02', 'strEvent': 'Botafogo Women vs Tuna Luso Women',
        'dateEvent': '2025-06-10', 'strTime': '19:00:00', 'strSeason': '2025',
        'strHomeTeam': 'Botafogo Women', 'strAwayTeam': 'Tuna Luso Women',
        'intHomeScore': 1, 'intAwayScore': 1, 'strVenue': None,
        'idLeague': 'copa_br_2025', 'status': 'finalizadas', 'intHomePen': 4, 'intAwayPen': 3
    },
    {
        'idEvent': 'copa_br_f2_03', 'strEvent': 'Atlético-MG Women vs Paysandu Women',
        'dateEvent': '2025-06-11', 'strTime': '15:00:00', 'strSeason': '2025',
        'strHomeTeam': 'Atlético-MG Women', 'strAwayTeam': 'Paysandu Women',
        'intHomeScore': 4, 'intAwayScore': 0, 'strVenue': None,
        'idLeague': 'copa_br_2025', 'status': 'finalizadas'
    },
    {
        'idEvent': 'copa_br_f2_04', 'strEvent': 'Juventude-SE Women vs Fortaleza Women',
        'dateEvent': '2025-06-11', 'strTime': '15:00:00', 'strSeason': '2025',
        'strHomeTeam': 'Juventude-SE Women', 'strAwayTeam': 'Fortaleza Women',
        'intHomeScore': 2, 'intAwayScore': 4, 'strVenue': None,
        'idLeague': 'copa_br_2025', 'status': 'finalizadas'
    },
    {
        'idEvent': 'copa_br_f2_05', 'strEvent': 'São José-SP Women vs Ypiranga-AP Women',
        'dateEvent': '2025-06-11', 'strTime': '15:00:00', 'strSeason': '2025',
        'strHomeTeam': 'São José-SP Women', 'strAwayTeam': 'Ypiranga-AP Women',
        'intHomeScore': 2, 'intAwayScore': 2, 'strVenue': None,
        'idLeague': 'copa_br_2025', 'status': 'finalizadas', 'intHomePen': 4, 'intAwayPen': 2
    },
    {
        'idEvent': 'copa_br_f2_06', 'strEvent': 'Coritiba Women vs Rolim de Moura-RO Women',
        'dateEvent': '2025-06-11', 'strTime': '15:00:00', 'strSeason': '2025',
        'strHomeTeam': 'Coritiba Women', 'strAwayTeam': 'Rolim de Moura-RO Women',
        'intHomeScore': 2, 'intAwayScore': 1, 'strVenue': None,
        'idLeague': 'copa_br_2025', 'status': 'finalizadas'
    },
    {
        'idEvent': 'copa_br_f2_07', 'strEvent': 'Vasco Women vs Minas Brasília Women',
        'dateEvent': '2025-06-11', 'strTime': '15:00:00', 'strSeason': '2025',
        'strHomeTeam': 'Vasco Women', 'strAwayTeam': 'Minas Brasília Women',
        'intHomeScore': 2, 'intAwayScore': 1, 'strVenue': None,
        'idLeague': 'copa_br_2025', 'status': 'finalizadas'
    },
    {
        'idEvent': 'copa_br_f2_08', 'strEvent': 'Atlético Piauiense Women vs Ação-MT Women',
        'dateEvent': '2025-06-11', 'strTime': '15:00:00', 'strSeason': '2025',
        'strHomeTeam': 'Atlético Piauiense Women', 'strAwayTeam': 'Ação-MT Women',
        'intHomeScore': 2, 'intAwayScore': 0, 'strVenue': None,
        'idLeague': 'copa_br_2025', 'status': 'finalizadas'
    },
    {
        'idEvent': 'copa_br_f2_09', 'strEvent': 'Taubaté Women vs Avaí/Kindermann Women',
        'dateEvent': '2025-06-11', 'strTime': '15:00:00', 'strSeason': '2025',
        'strHomeTeam': 'Taubaté Women', 'strAwayTeam': 'Avaí/Kindermann Women',
        'intHomeScore': 0, 'intAwayScore': 2, 'strVenue': None,
        'idLeague': 'copa_br_2025', 'status': 'finalizadas'
    },
    {
        'idEvent': 'copa_br_f2_10', 'strEvent': 'Realidade Jovem Women vs Rio Negro-RR Women',
        'dateEvent': '2025-06-11', 'strTime': '15:00:00', 'strSeason': '2025',
        'strHomeTeam': 'Realidade Jovem Women', 'strAwayTeam': 'Rio Negro-RR Women',
        'intHomeScore': 1, 'intAwayScore': 0, 'strVenue': None,
        'idLeague': 'copa_br_2025', 'status': 'finalizadas'
    },
    {
        'idEvent': 'copa_br_f2_11', 'strEvent': 'Prosperidade-ES Women vs Mixto-MT Women',
        'dateEvent': '2025-06-11', 'strTime': '15:00:00', 'strSeason': '2025',
        'strHomeTeam': 'Prosperidade-ES Women', 'strAwayTeam': 'Mixto-MT Women',
        'intHomeScore': 1, 'intAwayScore': 1, 'strVenue': None,
        'idLeague': 'copa_br_2025', 'status': 'finalizadas', 'intHomePen': 3, 'intAwayPen': 4
    },
    {
        'idEvent': 'copa_br_f2_12', 'strEvent': 'Manaus FC Women vs Ipojuca Women',
        'dateEvent': '2025-06-11', 'strTime': '15:00:00', 'strSeason': '2025',
        'strHomeTeam': 'Manaus FC Women', 'strAwayTeam': 'Ipojuca Women',
        'intHomeScore': 2, 'intAwayScore': 2, 'strVenue': None,
        'idLeague': 'copa_br_2025', 'status': 'finalizadas', 'intHomePen': 6, 'intAwayPen': 5
    },
    {
        'idEvent': 'copa_br_f2_13', 'strEvent': 'Santos Women vs Pérolas Negras Women',
        'dateEvent': '2025-06-11', 'strTime': '15:00:00', 'strSeason': '2025',
        'strHomeTeam': 'Santos Women', 'strAwayTeam': 'Pérolas Negras Women',
        'intHomeScore': 3, 'intAwayScore': 0, 'strVenue': None,
        'idLeague': 'copa_br_2025', 'status': 'finalizadas'
    },
    {
        'idEvent': 'copa_br_f2_14', 'strEvent': 'Remo Women vs Operário-MS Women',
        'dateEvent': '2025-06-11', 'strTime': '15:00:00', 'strSeason': '2025',
        'strHomeTeam': 'Remo Women', 'strAwayTeam': 'Operário-MS Women',
        'intHomeScore': 1, 'intAwayScore': 1, 'strVenue': None,
        'idLeague': 'copa_br_2025', 'status': 'finalizadas', 'intHomePen': 2, 'intAwayPen': 4
    },
    {
        'idEvent': 'copa_br_f2_15', 'strEvent': 'Brasil de Farroupilha Women vs Itacoatiara Women',
        'dateEvent': '2025-06-11', 'strTime': '15:00:00', 'strSeason': '2025',
        'strHomeTeam': 'Brasil de Farroupilha Women', 'strAwayTeam': 'Itacoatiara Women',
        'intHomeScore': 1, 'intAwayScore': 1, 'strVenue': None,
        'idLeague': 'copa_br_2025', 'status': 'finalizadas', 'intHomePen': 3, 'intAwayPen': 2
    },
    {
        'idEvent': 'copa_br_f2_16', 'strEvent': 'Itabirito Women vs Vitória Women',
        'dateEvent': '2025-06-11', 'strTime': '20:00:00', 'strSeason': '2025',
        'strHomeTeam': 'Itabirito Women', 'strAwayTeam': 'Vitória Women',
        'intHomeScore': 0, 'intAwayScore': 1, 'strVenue': None,
        'idLeague': 'copa_br_2025', 'status': 'finalizadas'
    },

    # 1ª Fase (Resultados de maio)
    {
        'idEvent': 'copa_br_f1_01', 'strEvent': 'UDA-AL Women vs Coritiba Women',
        'dateEvent': '2025-05-28', 'strTime': '15:00:00', 'strSeason': '2025',
        'strHomeTeam': 'UDA-AL Women', 'strAwayTeam': 'Coritiba Women',
        'intHomeScore': 0, 'intAwayScore': 0, 'strVenue': None,
        'idLeague': 'copa_br_2025', 'status': 'finalizadas', 'intHomePen': 4, 'intAwayPen': 5
    },
    {
        'idEvent': 'copa_br_f1_02', 'strEvent': 'Toledo Women vs Brasil de Farroupilha Women',
        'dateEvent': '2025-05-28', 'strTime': '15:00:00', 'strSeason': '2025',
        'strHomeTeam': 'Toledo Women', 'strAwayTeam': 'Brasil de Farroupilha Women',
        'intHomeScore': 1, 'intAwayScore': 3, 'strVenue': None,
        'idLeague': 'copa_br_2025', 'status': 'finalizadas'
    },
    {
        'idEvent': 'copa_br_f1_03', 'strEvent': 'Pinda Women vs São Raimundo-RR Women',
        'dateEvent': '2025-05-28', 'strTime': '15:00:00', 'strSeason': '2025',
        'strHomeTeam': 'Pinda Women', 'strAwayTeam': 'São Raimundo-RR Women',
        'intHomeScore': 3, 'intAwayScore': 1, 'strVenue': None,
        'idLeague': 'copa_br_2025', 'status': 'finalizadas'
    },
    {
        'idEvent': 'copa_br_f1_04', 'strEvent': 'Realidade Jovem Women vs Recanto Interativo Women',
        'dateEvent': '2025-05-28', 'strTime': '15:00:00', 'strSeason': '2025',
        'strHomeTeam': 'Realidade Jovem Women', 'strAwayTeam': 'Recanto Interativo Women',
        'intHomeScore': 5, 'intAwayScore': 0, 'strVenue': None,
        'idLeague': 'copa_br_2025', 'status': 'finalizadas'
    },
    {
        'idEvent': 'copa_br_f1_05', 'strEvent': 'Ceará Women vs Rolim de Moura-RO Women',
        'dateEvent': '2025-05-28', 'strTime': '15:00:00', 'strSeason': '2025',
        'strHomeTeam': 'Ceará Women', 'strAwayTeam': 'Rolim de Moura-RO Women',
        'intHomeScore': 1, 'intAwayScore': 1, 'strVenue': None,
        'idLeague': 'copa_br_2025', 'status': 'finalizadas', 'intHomePen': 1, 'intAwayPen': 3
    },
    {
        'idEvent': 'copa_br_f1_06', 'strEvent': 'Doce Mel Women vs IAPE-MA Women',
        'dateEvent': '2025-05-28', 'strTime': '15:00:00', 'strSeason': '2025',
        'strHomeTeam': 'Doce Mel Women', 'strAwayTeam': 'IAPE-MA Women',
        'intHomeScore': 4, 'intAwayScore': 1, 'strVenue': None,
        'idLeague': 'copa_br_2025', 'status': 'finalizadas'
    },
    {
        'idEvent': 'copa_br_f1_07', 'strEvent': 'Vila Nova-GO Women vs Atlético Piauiense Women',
        'dateEvent': '2025-05-28', 'strTime': '15:30:00', 'strSeason': '2025',
        'strHomeTeam': 'Vila Nova-GO Women', 'strAwayTeam': 'Atlético Piauiense Women',
        'intHomeScore': 1, 'intAwayScore': 2, 'strVenue': None,
        'idLeague': 'copa_br_2025', 'status': 'finalizadas'
    },
    {
        'idEvent': 'copa_br_f1_08', 'strEvent': 'Manaus FC Women vs Guarani de Paripueira Women',
        'dateEvent': '2025-05-28', 'strTime': '16:00:00', 'strSeason': '2025',
        'strHomeTeam': 'Manaus FC Women', 'strAwayTeam': 'Guarani de Paripueira Women',
        'intHomeScore': 4, 'intAwayScore': 3, 'strVenue': None,
        'idLeague': 'copa_br_2025', 'status': 'finalizadas'
    },
    {
        'idEvent': 'copa_br_f1_09', 'strEvent': 'Ipojuca Women vs Atlético de Alagoinhas Women',
        'dateEvent': '2025-05-28', 'strTime': '16:00:00', 'strSeason': '2025',
        'strHomeTeam': 'Ipojuca Women', 'strAwayTeam': 'Atlético de Alagoinhas Women',
        'intHomeScore': 0, 'intAwayScore': 0, 'strVenue': None,
        'idLeague': 'copa_br_2025', 'status': 'finalizadas', 'intHomePen': 5, 'intAwayPen': 4
    },
    {
        'idEvent': 'copa_br_f1_10', 'strEvent': 'Operário-MT Women vs Prosperidade-ES Women',
        'dateEvent': '2025-05-28', 'strTime': '16:00:00', 'strSeason': '2025',
        'strHomeTeam': 'Operário-MT Women', 'strAwayTeam': 'Prosperidade-ES Women',
        'intHomeScore': 0, 'intAwayScore': 1, 'strVenue': None,
        'idLeague': 'copa_br_2025', 'status': 'finalizadas'
    },
    {
        'idEvent': 'copa_br_f1_11', 'strEvent': 'Ypiranga-AP Women vs Galvez-AC Women',
        'dateEvent': '2025-05-28', 'strTime': '16:00:00', 'strSeason': '2025',
        'strHomeTeam': 'Ypiranga-AP Women', 'strAwayTeam': 'Galvez-AC Women',
        'intHomeScore': 2, 'intAwayScore': 0, 'strVenue': None,
        'idLeague': 'copa_br_2025', 'status': 'finalizadas'
    },
    {
        'idEvent': 'copa_br_f1_12', 'strEvent': 'Tarumã-AM Women vs Juventude-SE Women',
        'dateEvent': '2025-05-28', 'strTime': '20:00:00', 'strSeason': '2025',
        'strHomeTeam': 'Tarumã-AM Women', 'strAwayTeam': 'Juventude-SE Women',
        'intHomeScore': 1, 'intAwayScore': 2, 'strVenue': None,
        'idLeague': 'copa_br_2025', 'status': 'finalizadas'
    },
    {
        'idEvent': 'copa_br_f1_13', 'strEvent': 'Mixto-PB Women vs Operário-MS Women',
        'dateEvent': '2025-05-28', 'strTime': '20:00:00', 'strSeason': '2025',
        'strHomeTeam': 'Mixto-PB Women', 'strAwayTeam': 'Operário-MS Women',
        'intHomeScore': 0, 'intAwayScore': 1, 'strVenue': None,
        'idLeague': 'copa_br_2025', 'status': 'finalizadas'
    },
    {
        'idEvent': 'copa_br_f1_14', 'strEvent': 'Tuna Luso Women vs CRESSPOM-DF Women',
        'dateEvent': '2025-05-29', 'strTime': '15:00:00', 'strSeason': '2025',
        'strHomeTeam': 'Tuna Luso Women', 'strAwayTeam': 'CRESSPOM-DF Women',
        'intHomeScore': 1, 'intAwayScore': 1, 'strVenue': None,
        'idLeague': 'copa_br_2025', 'status': 'finalizadas', 'intHomePen': 4, 'intAwayPen': 2
    },
    {
        'idEvent': 'copa_br_f1_15', 'strEvent': 'Criciúma Women vs Pérolas Negras Women',
        'dateEvent': '2025-05-29', 'strTime': '19:30:00', 'strSeason': '2025',
        'strHomeTeam': 'Criciúma Women', 'strAwayTeam': 'Pérolas Negras Women',
        'intHomeScore': 1, 'intAwayScore': 2, 'strVenue': None,
        'idLeague': 'copa_br_2025', 'status': 'finalizadas'
    },
    {
        'idEvent': 'copa_br_f1_16', 'strEvent': 'Itabirito Women vs União-RN Women',
        'dateEvent': '2025-05-29', 'strTime': '20:00:00', 'strSeason': '2025',
        'strHomeTeam': 'Itabirito Women', 'strAwayTeam': 'União-RN Women',
        'intHomeScore': 5, 'intAwayScore': 1, 'strVenue': None,
        'idLeague': 'copa_br_2025', 'status': 'finalizadas'
    },
    
    # Oitavas de Final
    {
        'idEvent': 'copa_br_oitavas_01', 'strEvent': 'Sport Women vs Realidade Jovem Women',
        'dateEvent': '2025-09-16', 'strTime': '15:00:00', 'strSeason': '2025',
        'strHomeTeam': 'Sport Women', 'strAwayTeam': 'Realidade Jovem Women',
        'intHomeScore': 3, 'intAwayScore': 1, 'strVenue': None,
        'idLeague': 'copa_br_2025', 'status': 'proximas'
    },
    {
        'idEvent': 'copa_br_oitavas_02', 'strEvent': 'Bahia Women vs Atlético-MG Women',
        'dateEvent': '2025-09-16', 'strTime': '18:00:00', 'strSeason': '2025',
        'strHomeTeam': 'Bahia Women', 'strAwayTeam': 'Atlético-MG Women',
        'intHomeScore': 1, 'intAwayScore': 0, 'strVenue': None,
        'idLeague': 'copa_br_2025', 'status': 'proximas'
    },
    {
        'idEvent': 'copa_br_oitavas_03', 'strEvent': 'Corinthians Women vs Juventude Women',
        'dateEvent': '2025-09-17', 'strTime': '15:00:00', 'strSeason': '2025',
        'strHomeTeam': 'Corinthians Women', 'strAwayTeam': 'Juventude Women',
        'intHomeScore': None, 'intAwayScore': None, 'strVenue': None,
        'idLeague': 'copa_br_2025', 'status': 'proximas'
    },
    {
        'idEvent': 'copa_br_oitavas_04', 'strEvent': 'Bragantino Women vs Atlético Piauiense Women',
        'dateEvent': '2025-09-17', 'strTime': '17:00:00', 'strSeason': '2025',
        'strHomeTeam': 'Bragantino Women', 'strAwayTeam': 'Atlético Piauiense Women',
        'intHomeScore': None, 'intAwayScore': None, 'strVenue': None,
        'idLeague': 'copa_br_2025', 'status': 'proximas'
    },
    {
        'idEvent': 'copa_br_oitavas_05', 'strEvent': 'São Paulo Women vs Flamengo Women',
        'dateEvent': '2025-09-17', 'strTime': '18:00:00', 'strSeason': '2025',
        'strHomeTeam': 'São Paulo Women', 'strAwayTeam': 'Flamengo Women',
        'intHomeScore': None, 'intAwayScore': None, 'strVenue': None,
        'idLeague': 'copa_br_2025', 'status': 'proximas'
    },
    {
        'idEvent': 'copa_br_oitavas_06', 'strEvent': 'Palmeiras Women vs América-MG Women',
        'dateEvent': '2025-09-17', 'strTime': '19:00:00', 'strSeason': '2025',
        'strHomeTeam': 'Palmeiras Women', 'strAwayTeam': 'América-MG Women',
        'intHomeScore': None, 'intAwayScore': None, 'strVenue': None,
        'idLeague': 'copa_br_2025', 'status': 'proximas'
    },
    {
        'idEvent': 'copa_br_oitavas_07', 'strEvent': 'Ferroviária Women vs Vitória Women',
        'dateEvent': '2025-09-18', 'strTime': '16:00:00', 'strSeason': '2025',
        'strHomeTeam': 'Ferroviária Women', 'strAwayTeam': 'Vitória Women',
        'intHomeScore': None, 'intAwayScore': None, 'strVenue': None,
        'idLeague': 'copa_br_2025', 'status': 'proximas'
    },
    {
        'idEvent': 'copa_br_oitavas_08', 'strEvent': 'Internacional Women vs Fluminense Women',
        'dateEvent': '2025-09-18', 'strTime': '18:00:00', 'strSeason': '2025',
        'strHomeTeam': 'Internacional Women', 'strAwayTeam': 'Fluminense Women',
        'intHomeScore': None, 'intAwayScore': None, 'strVenue': None,
        'idLeague': 'copa_br_2025', 'status': 'proximas'
    }
]

# Inserir liga Copa do Brasil Feminina
cursor.execute("""
    INSERT OR IGNORE INTO ligas (idLeague, strLeague, strSport, strLeagueAlternate)
    VALUES (?, ?, ?, ?)
""", ('copa_br_2025', 'Copa do Brasil Feminina', 'Soccer', 'Copa do Brasil Feminina 2025'))

# Inserir partidas
for partida in dados_copa_do_brasil:
    # Ajusta o horário se existir e o status for 'proximas'
    if partida['strTime'] and partida['status'] == 'proximas':
        # Converte a string de hora para um objeto datetime
        hora_original = datetime.strptime(partida['strTime'], '%H:%M:%S')
        nova_hora = hora_original + timedelta(hours=3)
        # Formata o objeto datetime de volta para uma string de hora
        partida['strTime'] = nova_hora.strftime('%H:%M:%S')

    cursor.execute("""
        INSERT OR REPLACE INTO partidas 
        (idEvent, strEvent, dateEvent, strTime, strSeason, strHomeTeam, strAwayTeam, 
         intHomeScore, intAwayScore, strVenue, idLeague, status)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    """, (
        partida['idEvent'], partida['strEvent'], partida['dateEvent'], 
        partida['strTime'], partida['strSeason'], partida['strHomeTeam'], 
        partida['strAwayTeam'], partida['intHomeScore'], partida['intAwayScore'], 
        partida['strVenue'], partida['idLeague'], partida['status']
    ))

# Commit e fechar conexão
conn.commit()
conn.close()

print("Dados da Copa do Brasil Feminina 2025 inseridos com sucesso!")
print(f"Total de {len(dados_copa_do_brasil)} partidas inseridas")