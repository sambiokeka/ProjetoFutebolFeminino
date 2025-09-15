from flask import Flask, request, jsonify
from flask_cors import CORS # Permite que o frontend acesse o backend.
import sqlite3
from werkzeug.security import generate_password_hash, check_password_hash # Permite verificar senhas.
import jwt # Tokens pra login, vamos precisar.
from datetime import datetime, timedelta
import os # O banco de dados ta sendo criado sempre nos lugares mais inóspitos, então vamo usar os.path 
import secrets # secret é um import q cria chaves de segurança.

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
DB_DIR = os.path.join(BASE_DIR, 'database')

DATABASE_AUTH  = os.path.join(DB_DIR, 'users.db') # banco de dados de usuarios
DATABASE_FUTEBOL = os.path.join(DB_DIR, 'futebol_feminino.db') # banco de dados de futebol mesmo

# Cria a aplicação Flask.
app = Flask(__name__)

# chave teste
app.secret_key = 'chave_teste'

# Aplica o CORS em todas as rotas, permitindo acesso de qualquer origem, obrigado CORS.
CORS(app)

# Gera uma chave secreta segura para JWT. TUDO ISSO SÃO BOAS PRATICAS DE SEGURANÇA.
SECRET_KEY = secrets.token_urlsafe(64)

# --- Funções de Inicialização e Conexão com o Banco de Dados ---

def init_db_auth():
    # Inicializa o banco de dados de autenticação.
    # Cria a tabela `users` com `id`, `username` (único) e `password` (hash).
    conn = sqlite3.connect(DATABASE_AUTH)
    cursor = conn.cursor()
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            username TEXT UNIQUE NOT NULL,
            password TEXT NOT NULL
        )
    ''')
    conn.commit()
    conn.close()

def init_db_futebol():

    # Inicializa o banco de dados de futebol.
    # Verifica se a coluna `notificacao_ativa` existe na tabela `partidas_salvas`
    # e a adiciona se for necessário. Isso é útil para atualizações de esquema.
    conn = sqlite3.connect(DATABASE_FUTEBOL)
    cursor = conn.cursor()
    
    # Obtém informações sobre as colunas da tabela.
    cursor.execute("PRAGMA table_info(partidas_salvas)")
    columns = [column[1] for column in cursor.fetchall()]
    
    # Adiciona a coluna se ela não estiver presente.
    if 'notificacao_ativa' not in columns:
        cursor.execute('''
            ALTER TABLE partidas_salvas 
            ADD COLUMN notificacao_ativa INTEGER DEFAULT 0
        ''')
        conn.commit()
        print("Coluna notificacao_ativa adicionada à tabela partidas_salvas")
    
    conn.close()

def get_db_connection_auth():
    # Cria e retorna uma conexão com o banco de dados de autenticação.
    # `row_factory = sqlite3.Row` permite acessar colunas pelo nome, não apenas pelo índice.
    conn = sqlite3.connect(DATABASE_AUTH)
    conn.row_factory = sqlite3.Row
    return conn

def get_db_connection_futebol():
    # Cria e retorna uma conexão com o banco de dados de futebol.

    conn = sqlite3.connect(DATABASE_FUTEBOL)
    conn.row_factory = sqlite3.Row 
    return conn

# --- Rotas da API ---

@app.route('/register', methods=['POST'])
def register():
    data = request.get_json()
    username = data.get('username')
    password = data.get('password')
    
    if not username or not password:
        return jsonify({'message': 'Usuário e senha são obrigatórios'}), 400
    
    hashed_password = generate_password_hash(password)
    
    conn = None  # Inicializa a variável de conexão fora do bloco
    try:
        conn = get_db_connection_auth()
        cursor = conn.cursor()
        cursor.execute('INSERT INTO users (username, password) VALUES (?, ?)', (username, hashed_password))
        user_id = cursor.lastrowid
        conn.commit()
        
        token = jwt.encode({
            'user_id': user_id,
            'exp': datetime.utcnow() + timedelta(hours=2)
        }, SECRET_KEY, algorithm='HS256')
        
        return jsonify({
            'message': 'Usuário criado com sucesso',
            'token': token,
            'username': username 
        }), 201
        
    except sqlite3.IntegrityError:
        return jsonify({'message': 'Usuário já existe'}), 409
    except Exception as e:
        # Captura qualquer erro
        print(f"Erro no registro: {e}")
        return jsonify({'message': 'Erro ao processar o registro'}), 500
    finally:
        if conn:
            conn.close()

@app.route('/login', methods=['POST'])
def login():
    # Rota para autenticação de usuário.
    # Recebe `username` e `password`.
    # Verifica se a senha fornecida corresponde ao hash no banco de dados.
    # Se a autenticação for bem-sucedida, retorna um novo JWT.
   
    data = request.get_json()
    username = data.get('username')
    password = data.get('password')

    if not username or not password:
        return jsonify({'message': 'Usuário e senha são obrigatórios'}), 400

    conn = get_db_connection_auth()
    cursor = conn.cursor()
    cursor.execute('SELECT id, password FROM users WHERE username = ?', (username,))
    user = cursor.fetchone()
    conn.close()

    if user and check_password_hash(user['password'], password):
        # Gera um JWT após o login.
        token = jwt.encode({
            'user_id': user['id'],
            'exp': datetime.utcnow() + timedelta(hours=2)
        }, SECRET_KEY, algorithm='HS256')

        return jsonify({
            'token': token, 
            'username': username, 
            'message': 'Login efetuado com sucesso'
        }), 200
    else:
        # Retorna erro se as credenciais estiverem incorretas.
        return jsonify({'message': 'Usuário ou senha incorretos'}), 401

@app.route("/ligas", methods=["GET"])
def listar_ligas():
    
    # Rota para listar todas as ligas de futebol.
    # Consulta a tabela `ligas` no banco de dados de futebol.
    # Retorna os dados das ligas em formato JSON.
    
    conn = get_db_connection_futebol()
    cur = conn.cursor()
    cur.execute("SELECT idLeague, strLeague, strSport, strLeagueAlternate FROM ligas ORDER BY strLeague")
    
    columns = [column[0] for column in cur.description]
    ligas = [dict(zip(columns, row)) for row in cur.fetchall()]
    
    cur.close()
    conn.close()
    return jsonify(ligas)

@app.route("/partidas", methods=["GET"])
def listar_partidas():
    
    # Rota para listar partidas, com filtros opcionais.
    # Aceita parâmetros de query `league_id` e `season`.
    # Constrói uma consulta SQL dinâmica para filtrar os resultados.
    # Retorna a lista de partidas correspondentes.
    league_id = request.args.get("league_id")
    season = request.args.get("season")
    
    sql = """
        SELECT p.*, l.strLeague
        FROM partidas p
        LEFT JOIN ligas l ON p.idLeague = l.idLeague
        WHERE 1=1
    """
    params = []

    if league_id:
        sql += " AND p.idLeague = ?"
        params.append(league_id)

    if season:
        sql += " AND p.strSeason = ?"
        params.append(season)

    sql += " ORDER BY p.dateEvent, p.strTime"

    conn = get_db_connection_futebol()
    cur = conn.cursor()
    cur.execute(sql, params)
    
    columns = [column[0] for column in cur.description]
    partidas = [dict(zip(columns, row)) for row in cur.fetchall()]
    
    cur.close()
    conn.close()
    return jsonify(partidas)

@app.route("/partidas/salvar", methods=["POST"])
def salvar_partida():
    
    # Rota para salvar uma partida na lista de um usuário.
    # Recebe o `idEvent` da partida e o `idUsuario`.
    # Insere um novo registro na tabela `partidas_salvas`.
    # `sqlite3.IntegrityError` é usado para evitar que a mesma partida seja salva duas vezes pelo mesmo usuário.
    
    # Pega os dados da requisição.
    data = request.get_json()
    id_event = data.get('idEvent')
    id_usuario = data.get('idUsuario')
    
    # Valida os dados recebidos.
    if not id_event or not id_usuario:
        return jsonify({"error": "Entre para continuar"}), 400
    
    # Salva a partida no banco de dados.
    conn = get_db_connection_futebol()
    cur = conn.cursor()
    # Tenta inserir a partida salva.
    try:
        cur.execute("""
            INSERT INTO partidas_salvas (idEvent, idUsuario, notificacao_ativa)
            VALUES (?, ?, 1)
        """, (id_event, id_usuario))
        conn.commit()
        return jsonify({"success": True, "message": "Partida salva com sucesso!"})
    # Evita que a mesma partida seja salva duas vezes pelo mesmo usuário.
    except sqlite3.IntegrityError:
        return jsonify({"error": "Partida já salva para este usuário"}), 400
    # Captura outros erros genéricos.
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    # Fecha a conexão com o banco.
    finally:
        cur.close()
        conn.close()

@app.route("/partidas/salvas/<id_usuario>", methods=["GET"])
def listar_partidas_salvas(id_usuario):
    
    # Rota para listar as partidas salvas por um usuário específico.
    # Usa o `id_usuario` na URL para buscar as partidas.
    # Faz um JOIN para buscar os dados completos da partida e da liga,
    # além das informações de salvamento.

    conn = get_db_connection_futebol()
    cur = conn.cursor()
    
    cur.execute("""
        SELECT p.*, l.strLeague, ps.data_criacao, ps.notificacao_ativa
        FROM partidas_salvas ps
        JOIN partidas p ON ps.idEvent = p.idEvent
        LEFT JOIN ligas l ON p.idLeague = l.idLeague
        WHERE ps.idUsuario = ?
        ORDER BY p.dateEvent, p.strTime
    """, (id_usuario,))
    # Forma os dicionários para cada linha retornada.
    columns = [column[0] for column in cur.description]
    partidas = [dict(zip(columns, row)) for row in cur.fetchall()]
    
    cur.close()
    conn.close()
    # Retorna a lista de partidas salvas.
    return jsonify(partidas)

@app.route("/partidas/salvas/remover", methods=["POST"])
def remover_partida_salva():
    
    # Rota para remover uma partida da lista de um usuário.
    # Recebe `id_event` e `id_usuario`.
    # Deleta o registro correspondente da tabela `partidas_salvas`.
    
    data = request.get_json()
    id_event = data.get('idEvent')
    id_usuario = data.get('idUsuario')
    # Valida os dados recebidos.
    if not id_event or not id_usuario:
        return jsonify({"error": "idEvent e idUsuario são obrigatórios"}), 400
    
    conn = get_db_connection_futebol()
    cur = conn.cursor()
    # Tenta deletar a partida salva.
    try:
        cur.execute("DELETE FROM partidas_salvas WHERE idEvent = ? AND idUsuario = ?", 
                    (id_event, id_usuario))
        conn.commit()
        
        # Retorna sucesso se a linha foi realmente removida.
        if cur.rowcount > 0:
            return jsonify({"success": True, "message": "Partida removida com sucesso!"})
        else:
            return jsonify({"error": "Partida não encontrada"}), 404
    # Captura erros genéricos.        
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    finally:
        cur.close()
        conn.close()

@app.route("/partidas/salvas/notificacao", methods=["POST"])
def atualizar_notificacao_partida_salva():
  
    # Rota para atualizar o status de notificação de uma partida salva.
    # Permite que o usuário ative ou desative notificações para um jogo específico.

    data = request.get_json()
    id_event = data.get('idEvent')
    id_usuario = data.get('idUsuario')
    notificacao_ativa = data.get('notificacaoAtiva', False)
    # Valida os dados recebidos.
    if not id_event or not id_usuario:
        return jsonify({"error": "idEvent e idUsuario são obrigatórios"}), 400

    conn = get_db_connection_futebol()
    cur = conn.cursor()

    try:
        # Atualiza a coluna `notificacao_ativa` para 1 (ativo) ou 0 (inativo).
        cur.execute("""
            UPDATE partidas_salvas
            SET notificacao_ativa = ?
            WHERE idEvent = ? AND idUsuario = ?
        """, (1 if notificacao_ativa else 0, id_event, id_usuario))
        conn.commit()
        # Verifica se alguma linha foi realmente atualizada.
        if cur.rowcount > 0:
            return jsonify({
                "success": True, 
                "message": "Notificação atualizada com sucesso!",
                "notificacaoAtiva": notificacao_ativa
            })
        # Se nenhuma linha foi atualizada, a partida não foi encontrada para o usuário.
        else:
            return jsonify({"error": "Partida não encontrada para este usuário"}), 404
    # Captura erros genéricos.
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    # Fecha a conexão com o banco.
    finally:
        cur.close()
        conn.close()

@app.route("/test", methods=["GET"])
def test():
    # Rota de teste simples para verificar se a API está funcionando.
    # Retorna uma mensagem de sucesso.
    # Se tiver indo o rotas o /test vai funcionar tbm.
    return jsonify({"message": "Backend funcionando!", "status": "OK"})

@app.route('/webhook/placar', methods=['POST'])
def webhook_placar():
    
    # Rota para simular o recebimento de um webhook de atualização de placar.
    # Imprime os dados recebidos.
    # Este endpoint é usado para receber atualizações em tempo real.
    
    # Tenta processar a requisição JSON.
    try:
        data = request.get_json()
        # Imprime os dados recebidos no console.
        print(f"Webhook recebido - Jogo: {data['homeTeam']} {data['homeScore']} x {data['awayScore']} {data['awayTeam']}")
        print(f"ID Evento: {data['idEvent']}")
        print(f"Timestamp: {datetime.fromtimestamp(data['timestamp'])}")
        # Retorna uma resposta de sucesso.
        return jsonify({"success": True, "message": "Webhook recebido"})
    # Captura erros genéricos.    
    except Exception as e:
        print(f"Erro no webhook: {e}")
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    # `if __name__ == '__main__'` garante que o código só seja executado quando o script é rodado diretamente.
    # Chama as funções de inicialização dos bancos de dados.
    init_db_auth()
    init_db_futebol()
    # Inicia o servidor Flask em modo de depuração na porta 5000.
    app.run(debug=True, port=5000)