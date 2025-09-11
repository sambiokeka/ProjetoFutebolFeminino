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

DATABASE = 'users.db'
SECRET_KEY = secrets.token_urlsafe(64)

def init_db():
    conn = sqlite3.connect(DATABASE)
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

def get_db_connection():
    conn = sqlite3.connect(DATABASE)
    conn.row_factory = sqlite3.Row
    return conn

# 🔹 CHAME init_db() ANTES DE RODAR O APP
init_db()
# Registro permanece igual
@app.route('/register', methods=['POST'])
def register():
    data = request.get_json()
    username = data.get('username')
    password = data.get('password')
    
    if not username or not password:
        return jsonify({'message': 'Usuário e senha são obrigatórios'}), 400
    
    hashed_password = generate_password_hash(password)
    
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        cursor.execute('INSERT INTO users (username, password) VALUES (?, ?)', (username, hashed_password))
        
        # 🔹 Pegar o ID do usuário recém-criado
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



# 🔹 Login com JWT
@app.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    username = data.get('username')
    password = data.get('password')

    if not username or not password:
        return jsonify({'message': 'Usuário e senha são obrigatórios'}), 400

    conn = get_db_connection()
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

if __name__ == '__main__':
    app.run(debug=True)
