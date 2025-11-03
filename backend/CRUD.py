import sqlite3
import os
from datetime import datetime

# --- CONFIGURAÇÃO DO BANCO DE DADOS ---
# Garante que o script encontre o banco de dados, não importa de onde ele seja executado.
# Esta parte é idêntica à configuração nos seus outros arquivos para manter a consistência.
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
DB_DIR = os.path.join(BASE_DIR, 'database')
DATABASE_FUTEBOL = os.path.join(DB_DIR, 'futebol_feminino.db')

def get_db_connection():
    """
    Cria e retorna uma conexão com o banco de dados de futebol.
    A conexão é configurada para retornar dicionários em vez de tuplas, facilitando o acesso aos dados.
    """
    conn = sqlite3.connect(DATABASE_FUTEBOL)
    # conn.row_factory = sqlite3.Row permite acessar colunas pelo nome (ex: partida['strHomeTeam'])
    conn.row_factory = sqlite3.Row
    return conn

# --- OPERAÇÕES CRUD ---

# CREATE (Criar)
def create_partida(id_event, id_league, home_team, away_team, event_date, home_score=None, away_score=None):
    """
    Adiciona uma nova partida ao banco de dados.

    Args:
        id_event (str): O ID único do evento (Chave Primária).
        id_league (str): O ID da liga.
        home_team (str): Nome do time da casa.
        away_team (str): Nome do time de fora.
        event_date (str): Data do evento no formato 'YYYY-MM-DD'.
        home_score (int, optional): Placar do time da casa. Padrão é None.
        away_score (int, optional): Placar do time de fora. Padrão é None.
    """
    # A instrução SQL INSERT INTO é usada para adicionar um novo registro.
    # Os '?' são placeholders que serão substituídos de forma segura pelos valores no tuple 'partida_data'.
    # Isso previne ataques de injeção de SQL.
    sql = """
        INSERT INTO partidas (idEvent, idLeague, strHomeTeam, strAwayTeam, dateEvent, intHomeScore, intAwayScore)
        VALUES (?, ?, ?, ?, ?, ?, ?)
    """
    partida_data = (id_event, id_league, home_team, away_team, event_date, home_score, away_score)
    
    conn = get_db_connection()
    try:
        cursor = conn.cursor()
        cursor.execute(sql, partida_data)
        # conn.commit() é crucial para salvar as alterações no banco de dados. Sem isso, a operação é perdida.
        conn.commit()
        print(f"Partida '{home_team} vs {away_team}' (ID: {id_event}) criada com sucesso!")
    except sqlite3.IntegrityError:
        print(f"ERRO: A partida com ID {id_event} já existe no banco de dados.")
    except Exception as e:
        print(f"Ocorreu um erro ao criar a partida: {e}")
    finally:
        # É uma boa prática sempre fechar a conexão, não importa se a operação deu certo ou errado.
        conn.close()

# READ (Ler)
def read_partida(id_event):
    """
    Lê e exibe os detalhes de uma partida específica pelo seu ID.
    """
    # A instrução SQL SELECT é usada para buscar dados.
    # Usamos LEFT JOIN para buscar também o nome do campeonato na tabela 'ligas'.
    sql = """
        SELECT p.idEvent, p.strHomeTeam, p.strAwayTeam, p.dateEvent, p.intHomeScore, p.intAwayScore, l.strLeague
        FROM partidas p
        LEFT JOIN ligas l ON p.idLeague = l.idLeague
        WHERE p.idEvent = ?
    """
    
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute(sql, (id_event,))
    
    # cursor.fetchone() retorna a primeira linha encontrada ou None se não houver resultados.
    partida = cursor.fetchone()
    conn.close()
    
    if partida:
        print("\n--- Detalhes da Partida Encontrada ---")
        # Como usamos conn.row_factory, podemos acessar os dados como um dicionário.
        print(f"  ID do Evento: {partida['idEvent']}")
        print(f"  Campeonato: {partida['strLeague'] or 'Não especificado'}")
        print(f"  Data: {partida['dateEvent']}")
        print(f"  Jogo: {partida['strHomeTeam']} vs {partida['strAwayTeam']}")
        print(f"  Placar: {partida['intHomeScore']} x {partida['intAwayScore']}")
        print("------------------------------------")
        return dict(partida)
    else:
        print(f"\nNenhuma partida encontrada com o ID: {id_event}")
        return None

# UPDATE (Atualizar)
def update_placar_partida(id_event, new_home_score, new_away_score):
    """
    Atualiza o placar de uma partida existente.

    Args:
        id_event (str): O ID da partida a ser atualizada.
        new_home_score (int): O novo placar do time da casa.
        new_away_score (int): O novo placar do time de fora.
    """
    # A instrução SQL UPDATE é usada para modificar registros existentes.
    # A cláusula WHERE é fundamental para garantir que apenas a partida correta seja atualizada.
    sql = """
        UPDATE partidas
        SET intHomeScore = ?, intAwayScore = ?
        WHERE idEvent = ?
    """
    
    conn = get_db_connection()
    try:
        cursor = conn.cursor()
        cursor.execute(sql, (new_home_score, new_away_score, id_event))
        conn.commit()
        
        # cursor.rowcount nos diz quantas linhas foram afetadas pela última operação.
        if cursor.rowcount > 0:
            print(f"Placar da partida (ID: {id_event}) atualizado para {new_home_score} x {new_away_score}!")
        else:
            print(f"Nenhuma partida encontrada com o ID {id_event} para atualizar.")
    except Exception as e:
        print(f"Ocorreu um erro ao atualizar a partida: {e}")
    finally:
        conn.close()

# DELETE (Deletar)
def delete_partida(id_event):
    """
    Remove uma partida do banco de dados pelo seu ID.
    """
    # A instrução SQL DELETE remove registros.
    # Assim como no UPDATE, a cláusula WHERE é crucial para não apagar a tabela inteira.
    sql = "DELETE FROM partidas WHERE idEvent = ?"
    
    conn = get_db_connection()
    try:
        cursor = conn.cursor()
        cursor.execute(sql, (id_event,))
        conn.commit()
        
        if cursor.rowcount > 0:
            print(f"Partida (ID: {id_event}) deletada com sucesso!")
        else:
            print(f"Nenhuma partida encontrada com o ID {id_event} para deletar.")
    except Exception as e:
        print(f"Ocorreu um erro ao deletar a partida: {e}")
    finally:
        conn.close()

# --- DEMONSTRAÇÃO DE USO ---
if __name__ == "__main__":
    # ID de exemplo para nossa partida de teste.
    # Usamos um ID alto para não conflitar com dados reais.
    ID_PARTIDA_TESTE = "9999999"
    ID_LIGA_TESTE = "5201" # ID da liga brasileira feminina (exemplo)

    print("--- INICIANDO DEMONSTRAÇÃO DO CRUD ---")

    # PASSO 1: CREATE - Vamos criar uma nova partida de exemplo.
    print("\n--- PASSO 1: Criando uma nova partida... ---")
    create_partida(
        id_event=ID_PARTIDA_TESTE,
        id_league=ID_LIGA_TESTE,
        home_team="Corinthians (Teste)",
        away_team="Palmeiras (Teste)",
        event_date=datetime.now().strftime("%Y-%m-%d"),
        home_score=0,
        away_score=0
    )

    # PASSO 2: READ - Vamos ler a partida que acabamos de criar para confirmar.
    print("\n--- PASSO 2: Lendo a partida recém-criada... ---")
    read_partida(ID_PARTIDA_TESTE)

    # PASSO 3: UPDATE - Vamos simular que o jogo aconteceu e atualizar o placar.
    print("\n--- PASSO 3: Atualizando o placar da partida... ---")
    update_placar_partida(ID_PARTIDA_TESTE, 3, 1)

    # PASSO 4: READ (DE NOVO) - Vamos ler a partida novamente para ver o placar atualizado.
    print("\n--- PASSO 4: Lendo a partida após a atualização... ---")
    read_partida(ID_PARTIDA_TESTE)

    # PASSO 5: DELETE - Agora, vamos limpar o banco de dados removendo a partida de teste.
    print("\n--- PASSO 5: Deletando a partida de teste... ---")
    delete_partida(ID_PARTIDA_TESTE)

    # PASSO 6: READ (FINAL) - Vamos tentar ler a partida mais uma vez para confirmar que foi deletada.
    print("\n--- PASSO 6: Verificando se a partida foi deletada... ---")
    read_partida(ID_PARTIDA_TESTE)

    print("\n--- DEMONSTRAÇÃO DO CRUD CONCLUÍDA ---")