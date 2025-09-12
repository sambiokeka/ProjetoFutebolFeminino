from flask import Flask, request, jsonify
from flask_cors import CORS
import sqlite3
from werkzeug.security import generate_password_hash, check_password_hash
import jwt
import datetime
import secrets

app = Flask(__name__)
app.secret_key = 'chave_teste'
CORS(app)

# ==================== CONFIGURAÇÕES ====================
DATABASE_AUTH = 'users.db'  # SQLite para contas
DATABASE_FUTEBOL = 'futebol_feminino.db'  # SQLite para partidas
SECRET_KEY = secrets.token_urlsafe(64)

# ==================== CONEXÕES SQLite ====================
def init_db_auth():
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

def get_db_connection_auth():
    conn = sqlite3.connect(DATABASE_AUTH)
    conn.row_factory = sqlite3.Row
    return conn

def get_db_connection_futebol():
    conn = sqlite3.connect(DATABASE_FUTEBOL)
    conn.row_factory = sqlite3.Row 
    return conn

# ==================== ROTAS DE AUTENTICAÇÃO ====================
@app.route('/register', methods=['POST'])
def register():
    data = request.get_json()
    username = data.get('username')
    password = data.get('password')
    
    if not username or not password:
        return jsonify({'message': 'Usuário e senha são obrigatórios'}), 400
    
    hashed_password = generate_password_hash(password)
    
    try:
        conn = get_db_connection_auth()
        cursor = conn.cursor()
        cursor.execute('INSERT INTO users (username, password) VALUES (?, ?)', (username, hashed_password))
        user_id = cursor.lastrowid
        conn.commit()
        conn.close()
        
        token = jwt.encode({
            'user_id': user_id,
            'exp': datetime.datetime.utcnow() + datetime.timedelta(hours=2)
        }, SECRET_KEY, algorithm='HS256')
        
        return jsonify({
            'message': 'Usuário criado com sucesso',
            'token': token,
            'username': username 
        }), 201
        
    except sqlite3.IntegrityError:
        return jsonify({'message': 'Usuário já existe'}), 409

@app.route('/login', methods=['POST'])
def login():
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
        token = jwt.encode({
            'user_id': user['id'],
            'exp': datetime.datetime.utcnow() + datetime.timedelta(hours=2)
        }, SECRET_KEY, algorithm='HS256')

        return jsonify({
            'token': token, 
            'username': username, 
            'message': 'Login efetuado com sucesso'
        }), 200
    else:
        return jsonify({'message': 'Usuário ou senha incorretos'}), 401

# ==================== ROTAS DE PARTIDAS ====================
@app.route("/ligas", methods=["GET"])
def listar_ligas():
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
    data = request.get_json()
    id_event = data.get('idEvent')
    id_usuario = data.get('idUsuario')
    
    if not id_event or not id_usuario:
        return jsonify({"error": "Entre para continuar"}), 400
    
    conn = get_db_connection_futebol()
    cur = conn.cursor()
    
    try:
        cur.execute("""
            INSERT INTO partidas_salvas (idEvent, idUsuario)
            VALUES (?, ?)
        """, (id_event, id_usuario))
        conn.commit()
        return jsonify({"success": True, "message": "Partida salva com sucesso!"})
    except sqlite3.IntegrityError:
        return jsonify({"error": "Partida já salva para este usuário"}), 400
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    finally:
        cur.close()
        conn.close()

@app.route("/partidas/salvas/<id_usuario>", methods=["GET"])
def listar_partidas_salvas(id_usuario):
    conn = get_db_connection_futebol()
    cur = conn.cursor()
    
    cur.execute("""
        SELECT p.*, l.strLeague, ps.data_criacao
        FROM partidas_salvas ps
        JOIN partidas p ON ps.idEvent = p.idEvent
        LEFT JOIN ligas l ON p.idLeague = l.idLeague
        WHERE ps.idUsuario = ?
        ORDER BY p.dateEvent, p.strTime
    """, (id_usuario,))
    
    columns = [column[0] for column in cur.description]
    partidas = [dict(zip(columns, row)) for row in cur.fetchall()]
    
    cur.close()
    conn.close()
    
    return jsonify(partidas)

@app.route("/partidas/salvas/remover", methods=["POST"])
def remover_partida_salva():
    data = request.get_json()
    id_event = data.get('idEvent')
    id_usuario = data.get('idUsuario')
    
    if not id_event or not id_usuario:
        return jsonify({"error": "idEvent e idUsuario são obrigatórios"}), 400
    
    conn = get_db_connection_futebol()
    cur = conn.cursor()
    
    try:
        cur.execute("DELETE FROM partidas_salvas WHERE idEvent = ? AND idUsuario = ?", 
                   (id_event, id_usuario))
        conn.commit()
        
        if cur.rowcount > 0:
            return jsonify({"success": True, "message": "Partida removida com sucesso!"})
        else:
            return jsonify({"error": "Partida não encontrada"}), 404
            
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    finally:
        cur.close()
        conn.close()

@app.route("/test", methods=["GET"])
def test():
    return jsonify({"message": "Backend funcionando!", "status": "OK"})

# ==================== INICIALIZAÇÃO ====================
if __name__ == '__main__':
    init_db_auth() 
    app.run(debug=True, port=5000)