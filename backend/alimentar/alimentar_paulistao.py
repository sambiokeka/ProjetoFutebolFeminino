# alimentar.py
import sqlite3
from datetime import datetime, timedelta

# Conexão com o banco
conn = sqlite3.connect('futebol_feminino.db')
cursor = conn.cursor()

dados_paulistao = [
    # Rodada 1
    {
        'idEvent': 'paulistao_R1_01', 'strEvent': 'Realidade Jovem Women vs São Paulo Women',
        'dateEvent': '2025-06-05', 'strTime': None, 'strSeason': '2025',
        'strHomeTeam': 'Realidade Jovem Women', 'strAwayTeam': 'São Paulo Women',
        'intHomeScore': 0, 'intAwayScore': 1, 'strVenue': None,
        'idLeague': 'paulistao_2025', 'status': 'finalizadas'
    },
    {
        'idEvent': 'paulistao_R1_02', 'strEvent': 'Palmeiras Women vs Santos Women',
        'dateEvent': '2025-06-05', 'strTime': None, 'strSeason': '2025',
        'strHomeTeam': 'Palmeiras Women', 'strAwayTeam': 'Santos Women',
        'intHomeScore': 1, 'intAwayScore': 2, 'strVenue': None,
        'idLeague': 'paulistao_2025', 'status': 'finalizadas'
    },
    {
        'idEvent': 'paulistao_R1_03', 'strEvent': 'Corinthians Women vs Ferroviária Women',
        'dateEvent': '2025-07-06', 'strTime': None, 'strSeason': '2025',
        'strHomeTeam': 'Corinthians Women', 'strAwayTeam': 'Ferroviária Women',
        'intHomeScore': 4, 'intAwayScore': 0, 'strVenue': None,
        'idLeague': 'paulistao_2025', 'status': 'finalizadas'
    },
    {
        'idEvent': 'paulistao_R1_04', 'strEvent': 'Bragantino Women vs AD Taubaté Women',
        'dateEvent': '2025-08-06', 'strTime': None, 'strSeason': '2025',
        'strHomeTeam': 'Bragantino Women', 'strAwayTeam': 'AD Taubaté Women',
        'intHomeScore': 5, 'intAwayScore': 0, 'strVenue': None,
        'idLeague': 'paulistao_2025', 'status': 'finalizadas'
    },

    # Rodada 2
    {
        'idEvent': 'paulistao_R2_01', 'strEvent': 'AD Taubaté Women vs Realidade Jovem Women',
        'dateEvent': '2025-08-14', 'strTime': None, 'strSeason': '2025',
        'strHomeTeam': 'AD Taubaté Women', 'strAwayTeam': 'Realidade Jovem Women',
        'intHomeScore': 0, 'intAwayScore': 1, 'strVenue': None,
        'idLeague': 'paulistao_2025', 'status': 'finalizadas'
    },
    {
        'idEvent': 'paulistao_R2_02', 'strEvent': 'Palmeiras Women vs Ferroviária Women',
        'dateEvent': '2025-08-14', 'strTime': None, 'strSeason': '2025',
        'strHomeTeam': 'Palmeiras Women', 'strAwayTeam': 'Ferroviária Women',
        'intHomeScore': 1, 'intAwayScore': 0, 'strVenue': None,
        'idLeague': 'paulistao_2025', 'status': 'finalizadas'
    },
    {
        'idEvent': 'paulistao_R2_03', 'strEvent': 'Santos Women vs Corinthians Women',
        'dateEvent': '2025-08-14', 'strTime': None, 'strSeason': '2025',
        'strHomeTeam': 'Santos Women', 'strAwayTeam': 'Corinthians Women',
        'intHomeScore': 0, 'intAwayScore': 3, 'strVenue': None,
        'idLeague': 'paulistao_2025', 'status': 'finalizadas'
    },
    {
        'idEvent': 'paulistao_R2_04', 'strEvent': 'Bragantino Women vs São Paulo Women',
        'dateEvent': '2025-08-15', 'strTime': None, 'strSeason': '2025',
        'strHomeTeam': 'Bragantino Women', 'strAwayTeam': 'São Paulo Women',
        'intHomeScore': 0, 'intAwayScore': 3, 'strVenue': None,
        'idLeague': 'paulistao_2025', 'status': 'finalizadas'
    },

    # Rodada 3
    {
        'idEvent': 'paulistao_R3_01', 'strEvent': 'Realidade Jovem Women vs Bragantino Women',
        'dateEvent': '2025-08-04', 'strTime': None, 'strSeason': '2025',
        'strHomeTeam': 'Realidade Jovem Women', 'strAwayTeam': 'Bragantino Women',
        'intHomeScore': 0, 'intAwayScore': 4, 'strVenue': None,
        'idLeague': 'paulistao_2025', 'status': 'finalizadas'
    },
    {
        'idEvent': 'paulistao_R3_02', 'strEvent': 'Palmeiras Women vs São Paulo Women',
        'dateEvent': '2025-04-06', 'strTime': None, 'strSeason': '2025',
        'strHomeTeam': 'Palmeiras Women', 'strAwayTeam': 'São Paulo Women',
        'intHomeScore': 3, 'intAwayScore': 2, 'strVenue': None,
        'idLeague': 'paulistao_2025', 'status': 'finalizadas'
    },
    {
        'idEvent': 'paulistao_R3_03', 'strEvent': 'Corinthians Women vs AD Taubaté Women',
        'dateEvent': '2025-08-06', 'strTime': None, 'strSeason': '2025',
        'strHomeTeam': 'Corinthians Women', 'strAwayTeam': 'AD Taubaté Women',
        'intHomeScore': 5, 'intAwayScore': 1, 'strVenue': None,
        'idLeague': 'paulistao_2025', 'status': 'finalizadas'
    },
    {
        'idEvent': 'paulistao_R3_04', 'strEvent': 'Ferroviária Women vs Santos Women',
        'dateEvent': '2025-04-06', 'strTime': None, 'strSeason': '2025',
        'strHomeTeam': 'Ferroviária Women', 'strAwayTeam': 'Santos Women',
        'intHomeScore': 1, 'intAwayScore': 1, 'strVenue': None,
        'idLeague': 'paulistao_2025', 'status': 'finalizadas'
    },

    # Rodada 4
    {
        'idEvent': 'paulistao_R4_01', 'strEvent': 'Ferroviária Women vs Realidade Jovem Women',
        'dateEvent': '2025-06-21', 'strTime': None, 'strSeason': '2025',
        'strHomeTeam': 'Ferroviária Women', 'strAwayTeam': 'Realidade Jovem Women',
        'intHomeScore': 4, 'intAwayScore': 0, 'strVenue': None,
        'idLeague': 'paulistao_2025', 'status': 'finalizadas'
    },
    {
        'idEvent': 'paulistao_R4_02', 'strEvent': 'Bragantino Women vs Palmeiras Women',
        'dateEvent': '2025-06-22', 'strTime': None, 'strSeason': '2025',
        'strHomeTeam': 'Bragantino Women', 'strAwayTeam': 'Palmeiras Women',
        'intHomeScore': 2, 'intAwayScore': 2, 'strVenue': None,
        'idLeague': 'paulistao_2025', 'status': 'finalizadas'
    },
    {
        'idEvent': 'paulistao_R4_03', 'strEvent': 'São Paulo Women vs Corinthians Women',
        'dateEvent': '2025-06-22', 'strTime': None, 'strSeason': '2025',
        'strHomeTeam': 'São Paulo Women', 'strAwayTeam': 'Corinthians Women',
        'intHomeScore': 2, 'intAwayScore': 1, 'strVenue': None,
        'idLeague': 'paulistao_2025', 'status': 'finalizadas'
    },
    {
        'idEvent': 'paulistao_R4_04', 'strEvent': 'AD Taubaté Women vs Santos Women',
        'dateEvent': '2025-09-07', 'strTime': None, 'strSeason': '2025',
        'strHomeTeam': 'AD Taubaté Women', 'strAwayTeam': 'Santos Women',
        'intHomeScore': 2, 'intAwayScore': 0, 'strVenue': None,
        'idLeague': 'paulistao_2025', 'status': 'finalizadas'
    },

    # Rodada 5
    {
        'idEvent': 'paulistao_R5_01', 'strEvent': 'AD Taubaté Women vs São Paulo Women',
        'dateEvent': '2025-02-09', 'strTime': None, 'strSeason': '2025',
        'strHomeTeam': 'AD Taubaté Women', 'strAwayTeam': 'São Paulo Women',
        'intHomeScore': 0, 'intAwayScore': 1, 'strVenue': None,
        'idLeague': 'paulistao_2025', 'status': 'finalizadas'
    },
    {
        'idEvent': 'paulistao_R5_02', 'strEvent': 'Ferroviária Women vs Bragantino Women',
        'dateEvent': '2025-02-09', 'strTime': None, 'strSeason': '2025',
        'strHomeTeam': 'Ferroviária Women', 'strAwayTeam': 'Bragantino Women',
        'intHomeScore': 1, 'intAwayScore': 1, 'strVenue': None,
        'idLeague': 'paulistao_2025', 'status': 'finalizadas'
    },
    {
        'idEvent': 'paulistao_R5_03', 'strEvent': 'Corinthians Women vs Palmeiras Women',
        'dateEvent': '2025-03-09', 'strTime': None, 'strSeason': '2025',
        'strHomeTeam': 'Corinthians Women', 'strAwayTeam': 'Palmeiras Women',
        'intHomeScore': 1, 'intAwayScore': 0, 'strVenue': None,
        'idLeague': 'paulistao_2025', 'status': 'finalizadas'
    },
    {
        'idEvent': 'paulistao_R5_04', 'strEvent': 'Santos Women vs Realidade Jovem Women',
        'dateEvent': '2025-03-09', 'strTime': None, 'strSeason': '2025',
        'strHomeTeam': 'Santos Women', 'strAwayTeam': 'Realidade Jovem Women',
        'intHomeScore': 1, 'intAwayScore': 1, 'strVenue': None,
        'idLeague': 'paulistao_2025', 'status': 'finalizadas'
    },

    # Rodada 6
    {
        'idEvent': 'paulistao_R6_01', 'strEvent': 'Corinthians Women vs Bragantino Women',
        'dateEvent': '2025-12-08', 'strTime': None, 'strSeason': '2025',
        'strHomeTeam': 'Corinthians Women', 'strAwayTeam': 'Bragantino Women',
        'intHomeScore': 2, 'intAwayScore': 2, 'strVenue': None,
        'idLeague': 'paulistao_2025', 'status': 'finalizadas'
    },
    {
        'idEvent': 'paulistao_R6_02', 'strEvent': 'Ferroviária Women vs AD Taubaté Women',
        'dateEvent': '2025-12-08', 'strTime': None, 'strSeason': '2025',
        'strHomeTeam': 'Ferroviária Women', 'strAwayTeam': 'AD Taubaté Women',
        'intHomeScore': 2, 'intAwayScore': 0, 'strVenue': None,
        'idLeague': 'paulistao_2025', 'status': 'finalizadas'
    },
    {
        'idEvent': 'paulistao_R6_03', 'strEvent': 'São Paulo Women vs Realidade Jovem Women',
        'dateEvent': '2025-13-08', 'strTime': None, 'strSeason': '2025',
        'strHomeTeam': 'São Paulo Women', 'strAwayTeam': 'Realidade Jovem Women',
        'intHomeScore': 1, 'intAwayScore': 0, 'strVenue': None,
        'idLeague': 'paulistao_2025', 'status': 'finalizadas'
    },
    {
        'idEvent': 'paulistao_R6_04', 'strEvent': 'Palmeiras Women vs Santos Women',
        'dateEvent': '2025-14-08', 'strTime': None, 'strSeason': '2025',
        'strHomeTeam': 'Palmeiras Women', 'strAwayTeam': 'Santos Women',
        'intHomeScore': 1, 'intAwayScore': 0, 'strVenue': None,
        'idLeague': 'paulistao_2025', 'status': 'finalizadas'
    },

    # Rodada 7
    {
        'idEvent': 'paulistao_R7_01', 'strEvent': 'Ferroviária Women vs São Paulo Women',
        'dateEvent': '2025-09-01', 'strTime': None, 'strSeason': '2025',
        'strHomeTeam': 'Ferroviária Women', 'strAwayTeam': 'São Paulo Women',
        'intHomeScore': 1, 'intAwayScore': 0, 'strVenue': None,
        'idLeague': 'paulistao_2025', 'status': 'finalizadas'
    },
    {
        'idEvent': 'paulistao_R7_02', 'strEvent': 'AD Taubaté Women vs Palmeiras Women',
        'dateEvent': '2025-09-02', 'strTime': None, 'strSeason': '2025',
        'strHomeTeam': 'AD Taubaté Women', 'strAwayTeam': 'Palmeiras Women',
        'intHomeScore': 1, 'intAwayScore': 2, 'strVenue': None,
        'idLeague': 'paulistao_2025', 'status': 'finalizadas'
    },
    
    # Rodada 8
    {
        'idEvent': 'paulistao_R8_01', 'strEvent': 'AD Taubaté Women vs Ferroviária Women',
        'dateEvent': '2025-09-02', 'strTime': None, 'strSeason': '2025',
        'strHomeTeam': 'AD Taubaté Women', 'strAwayTeam': 'Ferroviária Women',
        'intHomeScore': 2, 'intAwayScore': 0, 'strVenue': None,
        'idLeague': 'paulistao_2025', 'status': 'finalizadas'
    },
    {
        'idEvent': 'paulistao_R8_02', 'strEvent': 'Santos Women vs São Paulo Women',
        'dateEvent': '2025-09-02', 'strTime': None, 'strSeason': '2025',
        'strHomeTeam': 'Santos Women', 'strAwayTeam': 'São Paulo Women',
        'intHomeScore': 2, 'intAwayScore': 2, 'strVenue': None,
        'idLeague': 'paulistao_2025', 'status': 'finalizadas'
    },
    {
        'idEvent': 'paulistao_R8_03', 'strEvent': 'Bragantino Women vs Corinthians Women',
        'dateEvent': '2025-09-03', 'strTime': None, 'strSeason': '2025',
        'strHomeTeam': 'Bragantino Women', 'strAwayTeam': 'Corinthians Women',
        'intHomeScore': 2, 'intAwayScore': 3, 'strVenue': None,
        'idLeague': 'paulistao_2025', 'status': 'finalizadas'
    },
    {
        'idEvent': 'paulistao_R8_04', 'strEvent': 'Palmeiras Women vs Realidade Jovem Women',
        'dateEvent': '2025-09-04', 'strTime': None, 'strSeason': '2025',
        'strHomeTeam': 'Palmeiras Women', 'strAwayTeam': 'Realidade Jovem Women',
        'intHomeScore': 7, 'intAwayScore': 0, 'strVenue': None,
        'idLeague': 'paulistao_2025', 'status': 'finalizadas'
    },
    
    # Rodada 9 (Próximos jogos)
    {
        'idEvent': 'paulistao_R9_01', 'strEvent': 'Corinthians Women vs Santos Women',
        'dateEvent': '2025-09-20', 'strTime': '11:00:00', 'strSeason': '2025',
        'strHomeTeam': 'Corinthians Women', 'strAwayTeam': 'Santos Women',
        'intHomeScore': None, 'intAwayScore': None, 'strVenue': None,
        'idLeague': 'paulistao_2025', 'status': 'proximas'
    },
    {
        'idEvent': 'paulistao_R9_02', 'strEvent': 'Realidade Jovem Women vs AD Taubaté Women',
        'dateEvent': '2025-09-20', 'strTime': '15:00:00', 'strSeason': '2025',
        'strHomeTeam': 'Realidade Jovem Women', 'strAwayTeam': 'AD Taubaté Women',
        'intHomeScore': None, 'intAwayScore': None, 'strVenue': None,
        'idLeague': 'paulistao_2025', 'status': 'proximas'
    },
    {
        'idEvent': 'paulistao_R9_03', 'strEvent': 'São Paulo Women vs Bragantino Women',
        'dateEvent': '2025-09-21', 'strTime': '11:00:00', 'strSeason': '2025',
        'strHomeTeam': 'São Paulo Women', 'strAwayTeam': 'Bragantino Women',
        'intHomeScore': None, 'intAwayScore': None, 'strVenue': None,
        'idLeague': 'paulistao_2025', 'status': 'proximas'
    },
    {
        'idEvent': 'paulistao_R9_04', 'strEvent': 'Ferroviária Women vs Palmeiras Women',
        'dateEvent': '2025-09-22', 'strTime': '18:30:00', 'strSeason': '2025',
        'strHomeTeam': 'Ferroviária Women', 'strAwayTeam': 'Palmeiras Women',
        'intHomeScore': None, 'intAwayScore': None, 'strVenue': None,
        'idLeague': 'paulistao_2025', 'status': 'proximas'
    },

    # Rodada 10
    {
        'idEvent': 'paulistao_R10_01', 'strEvent': 'AD Taubaté Women vs Corinthians Women',
        'dateEvent': '2025-09-27', 'strTime': '15:30:00', 'strSeason': '2025',
        'strHomeTeam': 'AD Taubaté Women', 'strAwayTeam': 'Corinthians Women',
        'intHomeScore': None, 'intAwayScore': None, 'strVenue': None,
        'idLeague': 'paulistao_2025', 'status': 'proximas'
    },
    {
        'idEvent': 'paulistao_R10_02', 'strEvent': 'Santos Women vs Ferroviária Women',
        'dateEvent': '2025-09-28', 'strTime': '10:30:00', 'strSeason': '2025',
        'strHomeTeam': 'Santos Women', 'strAwayTeam': 'Ferroviária Women',
        'intHomeScore': None, 'intAwayScore': None, 'strVenue': None,
        'idLeague': 'paulistao_2025', 'status': 'proximas'
    },
    {
        'idEvent': 'paulistao_R10_03', 'strEvent': 'São Paulo Women vs Palmeiras Women',
        'dateEvent': '2025-09-28', 'strTime': '17:30:00', 'strSeason': '2025',
        'strHomeTeam': 'São Paulo Women', 'strAwayTeam': 'Palmeiras Women',
        'intHomeScore': None, 'intAwayScore': None, 'strVenue': None,
        'idLeague': 'paulistao_2025', 'status': 'proximas'
    },
    {
        'idEvent': 'paulistao_R10_04', 'strEvent': 'Bragantino Women vs Realidade Jovem Women',
        'dateEvent': '2025-09-29', 'strTime': '15:00:00', 'strSeason': '2025',
        'strHomeTeam': 'Bragantino Women', 'strAwayTeam': 'Realidade Jovem Women',
        'intHomeScore': None, 'intAwayScore': None, 'strVenue': None,
        'idLeague': 'paulistao_2025', 'status': 'proximas'
    },

    # Rodada 11
    {
        'idEvent': 'paulistao_R11_01', 'strEvent': 'Ferroviária Women vs Realidade Jovem Women',
        'dateEvent': '2025-10-02', 'strTime': '17:30:00', 'strSeason': '2025',
        'strHomeTeam': 'Ferroviária Women', 'strAwayTeam': 'Realidade Jovem Women',
        'intHomeScore': None, 'intAwayScore': None, 'strVenue': None,
        'idLeague': 'paulistao_2025', 'status': 'proximas'
    },
    {
        'idEvent': 'paulistao_R11_02', 'strEvent': 'Corinthians Women vs São Paulo Women',
        'dateEvent': '2025-10-02', 'strTime': None, 'strSeason': '2025',
        'strHomeTeam': 'Corinthians Women', 'strAwayTeam': 'São Paulo Women',
        'intHomeScore': None, 'intAwayScore': None, 'strVenue': None,
        'idLeague': 'paulistao_2025', 'status': 'proximas'
    },
    {
        'idEvent': 'paulistao_R11_03', 'strEvent': 'Palmeiras Women vs Bragantino Women',
        'dateEvent': '2025-10-02', 'strTime': None, 'strSeason': '2025',
        'strHomeTeam': 'Palmeiras Women', 'strAwayTeam': 'Bragantino Women',
        'intHomeScore': None, 'intAwayScore': None, 'strVenue': None,
        'idLeague': 'paulistao_2025', 'status': 'proximas'
    },
    {
        'idEvent': 'paulistao_R11_04', 'strEvent': 'Santos Women vs AD Taubaté Women',
        'dateEvent': '2025-10-02', 'strTime': None, 'strSeason': '2025',
        'strHomeTeam': 'Santos Women', 'strAwayTeam': 'AD Taubaté Women',
        'intHomeScore': None, 'intAwayScore': None, 'strVenue': None,
        'idLeague': 'paulistao_2025', 'status': 'proximas'
    },

    # Rodada 12
    {
        'idEvent': 'paulistao_R12_01', 'strEvent': 'São Paulo Women vs AD Taubaté Women',
        'dateEvent': '2025-11-09', 'strTime': None, 'strSeason': '2025',
        'strHomeTeam': 'São Paulo Women', 'strAwayTeam': 'AD Taubaté Women',
        'intHomeScore': None, 'intAwayScore': None, 'strVenue': None,
        'idLeague': 'paulistao_2025', 'status': 'proximas'
    },
    {
        'idEvent': 'paulistao_R12_02', 'strEvent': 'Bragantino Women vs Ferroviária Women',
        'dateEvent': '2025-11-09', 'strTime': None, 'strSeason': '2025',
        'strHomeTeam': 'Bragantino Women', 'strAwayTeam': 'Ferroviária Women',
        'intHomeScore': None, 'intAwayScore': None, 'strVenue': None,
        'idLeague': 'paulistao_2025', 'status': 'proximas'
    },
    {
        'idEvent': 'paulistao_R12_03', 'strEvent': 'Palmeiras Women vs Corinthians Women',
        'dateEvent': '2025-11-09', 'strTime': None, 'strSeason': '2025',
        'strHomeTeam': 'Palmeiras Women', 'strAwayTeam': 'Corinthians Women',
        'intHomeScore': None, 'intAwayScore': None, 'strVenue': None,
        'idLeague': 'paulistao_2025', 'status': 'proximas'
    },
    {
        'idEvent': 'paulistao_R12_04', 'strEvent': 'Realidade Jovem Women vs Santos Women',
        'dateEvent': '2025-11-09', 'strTime': None, 'strSeason': '2025',
        'strHomeTeam': 'Realidade Jovem Women', 'strAwayTeam': 'Santos Women',
        'intHomeScore': None, 'intAwayScore': None, 'strVenue': None,
        'idLeague': 'paulistao_2025', 'status': 'proximas'
    },

    # Rodada 13
    {
        'idEvent': 'paulistao_R13_01', 'strEvent': 'Ferroviária Women vs Corinthians Women',
        'dateEvent': '2025-11-12', 'strTime': None, 'strSeason': '2025',
        'strHomeTeam': 'Ferroviária Women', 'strAwayTeam': 'Corinthians Women',
        'intHomeScore': None, 'intAwayScore': None, 'strVenue': None,
        'idLeague': 'paulistao_2025', 'status': 'proximas'
    },
    {
        'idEvent': 'paulistao_R13_02', 'strEvent': 'Realidade Jovem Women vs São Paulo Women',
        'dateEvent': '2025-11-12', 'strTime': None, 'strSeason': '2025',
        'strHomeTeam': 'Realidade Jovem Women', 'strAwayTeam': 'São Paulo Women',
        'intHomeScore': None, 'intAwayScore': None, 'strVenue': None,
        'idLeague': 'paulistao_2025', 'status': 'proximas'
    },
    {
        'idEvent': 'paulistao_R13_03', 'strEvent': 'AD Taubaté Women vs Bragantino Women',
        'dateEvent': '2025-11-12', 'strTime': None, 'strSeason': '2025',
        'strHomeTeam': 'AD Taubaté Women', 'strAwayTeam': 'Bragantino Women',
        'intHomeScore': None, 'intAwayScore': None, 'strVenue': None,
        'idLeague': 'paulistao_2025', 'status': 'proximas'
    },
    {
        'idEvent': 'paulistao_R13_04', 'strEvent': 'Santos Women vs Palmeiras Women',
        'dateEvent': '2025-11-12', 'strTime': None, 'strSeason': '2025',
        'strHomeTeam': 'Santos Women', 'strAwayTeam': 'Palmeiras Women',
        'intHomeScore': None, 'intAwayScore': None, 'strVenue': None,
        'idLeague': 'paulistao_2025', 'status': 'proximas'
    },
    
    # Rodada 14
    {
        'idEvent': 'paulistao_R14_01', 'strEvent': 'Palmeiras Women vs AD Taubaté Women',
        'dateEvent': '2025-11-16', 'strTime': None, 'strSeason': '2025',
        'strHomeTeam': 'Palmeiras Women', 'strAwayTeam': 'AD Taubaté Women',
        'intHomeScore': None, 'intAwayScore': None, 'strVenue': None,
        'idLeague': 'paulistao_2025', 'status': 'proximas'
    },
    {
        'idEvent': 'paulistao_R14_02', 'strEvent': 'Corinthians Women vs Realidade Jovem Women',
        'dateEvent': '2025-11-16', 'strTime': None, 'strSeason': '2025',
        'strHomeTeam': 'Corinthians Women', 'strAwayTeam': 'Realidade Jovem Women',
        'intHomeScore': None, 'intAwayScore': None, 'strVenue': None,
        'idLeague': 'paulistao_2025', 'status': 'proximas'
    },
    {
        'idEvent': 'paulistao_R14_03', 'strEvent': 'Bragantino Women vs Santos Women',
        'dateEvent': '2025-11-16', 'strTime': None, 'strSeason': '2025',
        'strHomeTeam': 'Bragantino Women', 'strAwayTeam': 'Santos Women',
        'intHomeScore': None, 'intAwayScore': None, 'strVenue': None,
        'idLeague': 'paulistao_2025', 'status': 'proximas'
    },
    {
        'idEvent': 'paulistao_R14_04', 'strEvent': 'São Paulo Women vs Ferroviária Women',
        'dateEvent': '2025-11-16', 'strTime': None, 'strSeason': '2025',
        'strHomeTeam': 'São Paulo Women', 'strAwayTeam': 'Ferroviária Women',
        'intHomeScore': None, 'intAwayScore': None, 'strVenue': None,
        'idLeague': 'paulistao_2025', 'status': 'proximas'
    }
]

# Inserir liga Paulistão Feminino
cursor.execute("""
    INSERT OR IGNORE INTO ligas (idLeague, strLeague, strSport, strLeagueAlternate)
    VALUES (?, ?, ?, ?)
""", ('paulistao_2025', 'Campeonato Paulista Feminino', 'Soccer', 'Paulistão Feminino 2025'))

# Inserir partidas
for partida in dados_paulistao:
    # Ajusta o horário se existir e o status for 'proximas'
    if partida['strTime'] and partida['status'] == 'proximas':
        # Converte a string de hora para um objeto datetime
        hora_original = datetime.strptime(partida['strTime'], '%H:%M:%S')
        # Adiciona 3 horas
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

print("Dados do Paulistão Feminino 2025 (14 rodadas) inseridos com sucesso!")
print(f"Total de {len(dados_paulistao)} partidas inseridas")