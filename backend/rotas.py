from flask import Flask, request, jsonify
from flask_cors import CORS 
import sqlite3
from werkzeug.security import generate_password_hash, check_password_hash
import jwt 
from datetime import datetime, timedelta
import os 
import secrets 

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
DB_DIR = os.path.join(BASE_DIR, 'database')

DATABASE_AUTH  = os.path.join(DB_DIR, 'users.db')
DATABASE_FUTEBOL = os.path.join(DB_DIR, 'futebol_feminino.db')

app = Flask(__name__)
app.secret_key = 'chave_teste'
CORS(app)
SECRET_KEY = secrets.token_urlsafe(64)

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

def init_db_futebol():
    conn = sqlite3.connect(DATABASE_FUTEBOL)
    cursor = conn.cursor()
    
    cursor.execute("PRAGMA table_info(partidas_salvas)")
    columns = [column[1] for column in cursor.fetchall()]
    
    if 'notificacao_ativa' not in columns:
        cursor.execute('''
            ALTER TABLE partidas_salvas 
            ADD COLUMN notificacao_ativa INTEGER DEFAULT 0
        ''')
        conn.commit()
        print("Coluna notificacao_ativa adicionada à tabela partidas_salvas")
    
    conn.close()

def get_db_connection_auth():
    conn = sqlite3.connect(DATABASE_AUTH)
    conn.row_factory = sqlite3.Row
    return conn

def get_db_connection_futebol():
    conn = sqlite3.connect(DATABASE_FUTEBOL)
    conn.row_factory = sqlite3.Row 
    return conn

@app.route('/register', methods=['POST'])
def register():
    data = request.get_json()
    username = data.get('username')
    password = data.get('password')
    
    if not username or not password:
        return jsonify({'message': 'Usuário e senha são obrigatórios'}), 400
    
    hashed_password = generate_password_hash(password)
    
    conn = None
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
        print(f"Erro no registro: {e}")
        return jsonify({'message': 'Erro ao processar o registro'}), 500
    finally:
        if conn:
            conn.close()

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
            'exp': datetime.utcnow() + timedelta(hours=2)
        }, SECRET_KEY, algorithm='HS256')

        return jsonify({
            'token': token, 
            'username': username, 
            'message': 'Login efetuado com sucesso'
        }), 200
    else:
        return jsonify({'message': 'Usuário ou senha incorretos'}), 401

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
            INSERT INTO partidas_salvas (idEvent, idUsuario, notificacao_ativa)
            VALUES (?, ?, 1)
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
        SELECT p.*, l.strLeague, ps.data_criacao, ps.notificacao_ativa
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

@app.route("/partidas/salvas/notificacao", methods=["POST"])
def atualizar_notificacao_partida_salva():
    data = request.get_json()
    id_event = data.get('idEvent')
    id_usuario = data.get('idUsuario')
    notificacao_ativa = data.get('notificacaoAtiva', False)

    if not id_event or not id_usuario:
        return jsonify({"error": "idEvent e idUsuario são obrigatórios"}), 400

    conn = get_db_connection_futebol()
    cur = conn.cursor()

    try:
        cur.execute("""
            UPDATE partidas_salvas
            SET notificacao_ativa = ?
            WHERE idEvent = ? AND idUsuario = ?
        """, (1 if notificacao_ativa else 0, id_event, id_usuario))
        conn.commit()

        if cur.rowcount > 0:
            return jsonify({
                "success": True, 
                "message": "Notificação atualizada com sucesso!",
                "notificacaoAtiva": notificacao_ativa
            })
        else:
            return jsonify({"error": "Partida não encontrada para este usuário"}), 404
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    finally:
        cur.close()
        conn.close()

@app.route("/test", methods=["GET"])
def test():
    return jsonify({"message": "Backend funcionando!", "status": "OK"})

@app.route('/webhook/placar', methods=['POST'])
def webhook_placar():
    try:
        data = request.get_json()
        print(f"Webhook recebido - Jogo: {data['homeTeam']} {data['homeScore']} x {data['awayScore']} {data['awayTeam']}")
        print(f"ID Evento: {data['idEvent']}")
        print(f"Timestamp: {datetime.fromtimestamp(data['timestamp'])}")
        return jsonify({"success": True, "message": "Webhook recebido"})
    except Exception as e:
        print(f"Erro no webhook: {e}")
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    init_db_auth()
    init_db_futebol()
    app.run(debug=True, port=5000)