import mysql.connector

# Conexão com MySQL
conn = mysql.connector.connect(
    host="localhost",
    user="root",      # troque pelo nome do seu usuário do mySQL
    password="root",  # troque pela senha q vc usa no mySQL
    database="futebol_feminino"
)
cursor = conn.cursor(dictionary=True)  


# Buscar partidas por time
def buscar_por_time(time):
    cursor.execute("""
        SELECT * FROM partidas
        WHERE strHomeTeam = %s OR strAwayTeam = %s
        ORDER BY dateEvent ASC
    """, (time, time))
    return cursor.fetchall()


# Buscar partidas por data específica
def buscar_por_data(data):
    cursor.execute("""
        SELECT * FROM partidas
        WHERE dateEvent = %s
        ORDER BY strTime ASC
    """, (data,))
    return cursor.fetchall()


# Buscar partidas por temporada
def buscar_por_temporada(temporada):
    cursor.execute("""
        SELECT * FROM partidas
        WHERE strSeason = %s
        ORDER BY dateEvent ASC
    """, (temporada,))
    return cursor.fetchall()


# Buscar próximas partidas 
def buscar_proximas():
    cursor.execute("""
        SELECT * FROM partidas
        WHERE intHomeScore IS NULL AND intAwayScore IS NULL
        ORDER BY dateEvent ASC
    """)
    return cursor.fetchall()


# Buscar partidas já jogadas 
def buscar_finalizadas():
    cursor.execute("""
        SELECT * FROM partidas
        WHERE intHomeScore IS NOT NULL AND intAwayScore IS NOT NULL
        ORDER BY dateEvent DESC
    """)
    return cursor.fetchall()


if __name__ == "__main__":
    print("=== Partidas do Corinthians ===")
    for jogo in buscar_por_time("Corinthians W"):
        print(jogo)

    print("\n=== Jogos em 2025-09-10 ===")
    for jogo in buscar_por_data("2025-09-10"):
        print(jogo)

    print("\n=== Jogos da temporada 2025 ===")
    for jogo in buscar_por_temporada("2025"):
        print(jogo)

    print("\n=== Próximas partidas ===")
    for jogo in buscar_proximas():
        print(jogo)

    print("\n=== Partidas finalizadas ===")
    for jogo in buscar_finalizadas():
        print(jogo)

    cursor.close()
    conn.close()
