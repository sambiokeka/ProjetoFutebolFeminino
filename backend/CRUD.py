import sqlite3
import os
from datetime import datetime

# Pega o caminho do arquivo atual e junta com a pasta 'database' para achar o banco
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
DB_PATH = os.path.join(BASE_DIR, 'database', 'futebol_feminino.db')


# Conecta no banco de dados e configura pra retornar resultados como dicionário
def connect_db():
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row  # Permite acessar os dados pelo nome da coluna
    return conn


# Mostra todas as ligas cadastradas no banco vai servir pra opção 1 do menu
def listar_ligas():
    sql = "SELECT idLeague, strLeague FROM ligas"
    with connect_db() as conn:
        ligas = conn.execute(sql).fetchall()

    print("\n--- Ligas Disponíveis ---")
    for liga in ligas:
        print(f"{liga['idLeague']} - {liga['strLeague']}")
    print("-------------------------\n")

# Adiciona uma nova partida na tabela 'partidas' usando comando SQL INSERT
def criar_partida(id_event, id_league, home, away, date, home_score=None, away_score=None):
    sql = """
        INSERT INTO partidas (idEvent, idLeague, strHomeTeam, strAwayTeam, dateEvent, intHomeScore, intAwayScore)
        VALUES (?, ?, ?, ?, ?, ?, ?)
    """
    try:
        # Conecta, executa o comando e fecha automaticamente com o "with"
        with connect_db() as conn:
            conn.execute(sql, (id_event, id_league, home, away, date, home_score, away_score))
        print(f"[OK] Partida '{home} vs {away}' criada!")
    except sqlite3.IntegrityError:
        # Se tentar criar com um ID que já existe no banco, dá erro de chave primária
        print("[ERRO] ID já existe!")


# Busca no banco pela partida que tem o idEvent informado e exibe os dados
def ver_partida(id_event):
    sql = """
        SELECT p.*, l.strLeague
        FROM partidas p
        LEFT JOIN ligas l ON p.idLeague = l.idLeague
        WHERE p.idEvent = ?
    """
    with connect_db() as conn:
        partida = conn.execute(sql, (id_event,)).fetchone()  # Busca uma linha

    if partida:
        # Mostra os dados se encontrar a partida
        print(f"\nID: {partida['idEvent']}\nLiga: {partida['strLeague'] or '-'}")
        print(f"{partida['strHomeTeam']} vs {partida['strAwayTeam']} em {partida['dateEvent']}")
        print(f"Placar: {partida['intHomeScore']} x {partida['intAwayScore']}\n")
    else:
        print("[INFO] Partida não encontrada.")


# Atualiza o placar da partida usando o idEvent
def atualizar_placar(id_event, home_score, away_score):
    sql = "UPDATE partidas SET intHomeScore = ?, intAwayScore = ? WHERE idEvent = ?"
    with connect_db() as conn:
        cur = conn.execute(sql, (home_score, away_score, id_event))
        if cur.rowcount:
            # Se alguma linha foi afetada, então a atualização funcionou
            print("[OK] Placar atualizado!")
        else:
            print("[INFO] Partida não encontrada.")


# Remove a partida do banco de dados usando o idEvent como chave
def deletar_partida(id_event):
    sql = "DELETE FROM partidas WHERE idEvent = ?"
    with connect_db() as conn:
        cur = conn.execute(sql, (id_event,))
        if cur.rowcount:
            print("[OK] Partida deletada!")
        else:
            print("[INFO] Partida não encontrada.")

# Menu
def menu():
    # Enquanto o usuário n apertar 5 e sair, o while vai ser True e vai continuar 
    while True:
        print("\n--- CRUD Partidas ---")
        print("1. Adicionar partida")
        print("2. Ler partida")
        print("3. Atualizar placar")
        print("4. Deletar partida")
        print("5. Sair")
        op = input("Opção: ")

        if op == "1":

            print("\nAntes de criar partida, veja as ligas disponíveis (isso vai ajudar pro segundo input):")

            listar_ligas()  # mostra as ligas antes do input

            # Os dados são colocado com input em uma lista e depois são enviados como argumentos pro criar_partida
            dados = [
                input("ID Evento: "),
                input("ID Liga: "),
                input("Time Casa: "),
                input("Time Fora: "),
                input("Data (AAAA-MM-DD, Enter = hoje): ") or datetime.now().strftime("%Y-%m-%d")
            ]
            criar_partida(*dados)

        # Usa o idEvent como argumento pra função ver_partida, e mostra a partida
        elif op == "2":
            ver_partida(input("ID Evento: "))

        # Usa o idEvent, home e away como argumentos pra função atualizar_placar
        elif op == "3":
            try:
                id_event = input("ID Evento: ")
                home  = int(input("Placar casa: "))
                away = int(input("Placar fora: "))
                atualizar_placar(id_event, home, away)

            # Se o valor inserido não for aceito, por não poder ser convertido pra inteiro, da ValueError
            except ValueError:
                print("[ERRO] Apenas números no placar.")

        # Confirma se o usuario quer deletar uma partida msm, e depois usa o idEvent como argumento
        elif op == "4":
            if input("Confirma? (s/n): ") == "s":
                deletar_partida(input("ID Evento: "))

        # Fecha o menu
        elif op == "5":
            break

        # Se tiver fora do menu não é aceito    
        else:
            print("Opção inválida.")
            

# Chama e ativa o menu quando o codigo é rodado
if __name__ == "__main__":
    menu()
