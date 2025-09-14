import json
import os
from datetime import datetime, timedelta
import pytz
from typing import Dict, List, Any

# Caminhos dos JSON que vamos usar na pasta database
DB_DIR = 'database'
os.makedirs(DB_DIR, exist_ok=True) 

FUTEBOL_DB_FILE = os.path.join(DB_DIR, 'futebol_feminino.json')
USERS_DB_FILE = os.path.join(DB_DIR, 'users.json')

# Estrutura inicial dos bancos de dados JSON
DEFAULT_FUTEBOL_STRUCTURE = {
    "ligas": [],
    "partidas": [],
    "partidas_salvas": []
}

DEFAULT_USERS_STRUCTURE = {
    "usuarios": []
}

# Criar os arquivos JSON automaticamente 
def init_all_dbs():
    """Inicializa todos os bancos de dados JSON"""
    for db_file, default_structure in [
        (FUTEBOL_DB_FILE, DEFAULT_FUTEBOL_STRUCTURE),
        (USERS_DB_FILE, DEFAULT_USERS_STRUCTURE)
    ]:
        if not os.path.exists(db_file):
            with open(db_file, 'w', encoding='utf-8') as f:
                json.dump(default_structure, f, indent=2, ensure_ascii=False)
            print(f"Arquivo {db_file} criado com sucesso!")

# Executa a inicialização 
init_all_dbs()

def read_futebol_db():
    # Lê todo o conteúdo do arquivo futebol_feminino.json
    with open(FUTEBOL_DB_FILE, 'r', encoding='utf-8') as f:
        return json.load(f)

def write_futebol_db(data):
    # Escreve dados no arquivo futebol_feminino.json
    with open(FUTEBOL_DB_FILE, 'w', encoding='utf-8') as f:
        json.dump(data, f, indent=2, ensure_ascii=False)

def read_users_db():
    # Lê todo o conteúdo do arquivo users.json
    with open(USERS_DB_FILE, 'r', encoding='utf-8') as f:
        return json.load(f)

def write_users_db(data):
    # Escreve dados no arquivo users.json
    with open(USERS_DB_FILE, 'w', encoding='utf-8') as f:
        json.dump(data, f, indent=2, ensure_ascii=False)


# Determina o status de uma partida com base na data e hora
def get_status(date_str, time_str, home_score=None, away_score=None):
    # Trata casos onde data ou hora são None
    if not time_str:
        time_str = "00:00:00"

    # Converte a data e hora da partida para o fuso horário de São Paulo, já q a API retorna em UTC
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

# Funções para manipular o banco de futebol

def get_ligas():
    # Retorna todas as ligas
    db = read_futebol_db()
    return db["ligas"]

def save_liga(liga_data):
    # Salva ou atualiza uma liga
    db = read_futebol_db()
    
    # Verifica se a liga já existe
    for i, liga in enumerate(db["ligas"]):
        if liga["idLeague"] == liga_data["idLeague"]:
            db["ligas"][i] = liga_data
            write_futebol_db(db)
            return
    
    # Se não existe, adiciona nova
    db["ligas"].append(liga_data)
    write_futebol_db(db)

# Retorna partidas com filtros opcionais
def get_partidas(filters=None):
    db = read_futebol_db()
    partidas = db["partidas"]
    
    # Se não há filtros, retorna todas
    if not filters:
        return partidas
    
    # Aplica filtros
    filtered_partidas = []
    for partida in partidas:
        match = True
        for key, value in filters.items():
            if partida.get(key) != value:
                match = False
                break
        if match:
            filtered_partidas.append(partida)
    
    return filtered_partidas

def save_partida(partida_data):
    # Salva ou atualiza uma partida
    db = read_futebol_db()
    
    # Verifica se a partida já existe
    for i, partida in enumerate(db["partidas"]):
        if partida["idEvent"] == partida_data["idEvent"]:
            db["partidas"][i] = partida_data
            write_futebol_db(db)
            return
    
    # Se não existe, adiciona uma nova
    db["partidas"].append(partida_data)
    write_futebol_db(db)


# Retorna partidas salvas com filtros opcionais
def get_partidas_salvas(filters=None):

    db = read_futebol_db()
    partidas_salvas = db["partidas_salvas"]
    
    if not filters:
        return partidas_salvas
    
    # Aplica filtros
    filtered = []
    for ps in partidas_salvas:
        match = True
        for key, value in filters.items():
            if ps.get(key) != value:
                match = False
                break
        if match:
            filtered.append(ps)
    
    return filtered


def save_partida_salva(partida_salva_data):
    # Salva uma partida salva (evitando duplicatas
    db = read_futebol_db()
    
    # Verifica se já existe para o mesmo usuário e evento
    for i, ps in enumerate(db["partidas_salvas"]):
        if (ps["idEvent"] == partida_salva_data["idEvent"] and 
            ps["idUsuario"] == partida_salva_data["idUsuario"]):
            # Atualiza existente
            db["partidas_salvas"][i] = partida_salva_data
            write_futebol_db(db)
            return
    
    # Adiciona nova com ID único
    if not partida_salva_data.get("id"):
        # Gera um ID único simples
        max_id = max([ps.get("id", 0) for ps in db["partidas_salvas"]] or [0])
        partida_salva_data["id"] = max_id + 1
    
    db["partidas_salvas"].append(partida_salva_data)
    write_futebol_db(db)

def delete_partida_salva(id_event, id_usuario):
    # Remove uma partida salva
    db = read_futebol_db()
    
    # Filtra mantendo apenas as que não correspondem ao id_event e id_usuario
    db["partidas_salvas"] = [
        ps for ps in db["partidas_salvas"] 
        if not (ps["idEvent"] == id_event and ps["idUsuario"] == id_usuario)
    ]
    
    write_futebol_db(db)


def get_usuarios():
    # Retorna todos os usuários
    db = read_users_db()
    return db["usuarios"]

def save_usuario(usuario_data):
    # Salva ou atualiza um usuário
    db = read_users_db()
    
    # Verifica se o usuário já existe
    for i, usuario in enumerate(db["usuarios"]):
        if usuario["username"] == usuario_data["username"]:
            db["usuarios"][i] = usuario_data
            write_users_db(db)
            return
    
    # Se não existe, adiciona novo
    db["usuarios"].append(usuario_data)
    write_users_db(db)