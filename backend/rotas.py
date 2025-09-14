from flask import Flask, request, jsonify
from flask_cors import CORS
from werkzeug.security import generate_password_hash, check_password_hash
import jwt
from datetime import datetime, timedelta
import secrets
from json_database import (
    get_ligas, get_partidas, get_partidas_salvas, save_partida_salva,
    delete_partida_salva, save_usuario, get_usuarios
)

app = Flask(__name__)
app.secret_key = 'chave_teste'
CORS(app)

SECRET_KEY = secrets.token_urlsafe(64)

# Rota para registro de novos usuários
@app.route('/register', methods=['POST'])
def register():
    data = request.get_json()
    username = data.get('username')
    password = data.get('password')
    
    if not username or not password:
        return jsonify({'message': 'Usuário e senha são obrigatórios'}), 400
    
    hashed_password = generate_password_hash(password)
    
    try:
        # Verifica se usuário já existe
        usuarios = get_usuarios()
        for usuario in usuarios:
            if usuario['username'] == username:
                return jsonify({'message': 'Usuário já existe'}), 409
        
        # Cria novo usuário
        user_id = len(usuarios) + 1
        new_user = {
            'id': user_id,
            'username': username,
            'password': hashed_password
        }
        save_usuario(new_user)
        
        # Gera token JWT
        token = jwt.encode({
            'user_id': user_id,
            'exp': datetime.utcnow() + timedelta(hours=2)
        }, SECRET_KEY, algorithm='HS256')
        
        return jsonify({
            'message': 'Usuário criado com sucesso',
            'token': token,
            'username': username 
        }), 201
        
    except Exception as e:
        return jsonify({'message': f'Erro interno: {str(e)}'}), 500
    

# Rota para login de usuários
@app.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    username = data.get('username')
    password = data.get('password')
    # Validação básica
    if not username or not password:
        return jsonify({'message': 'Usuário e senha são obrigatórios'}), 400

    usuarios = get_usuarios()
    user = None
    # Procura o usuário
    for u in usuarios:
        if u['username'] == username:
            user = u
            break
    # Verifica senha
    if user and check_password_hash(user['password'], password):
        # Gera token JWT
        token = jwt.encode({
            'user_id': user['id'],
            'exp': datetime.utcnow() + timedelta(hours=2)
        }, SECRET_KEY, algorithm='HS256')
        # Retorna token e dados do usuário
        return jsonify({
            'token': token, 
            'username': username, 
            'message': 'Login efetuado com sucesso'
        }), 200
    # Usuário não encontrado ou senha incorreta
    else:
        return jsonify({'message': 'Usuário ou senha incorretos'}), 401
    

# Rota para ligas e partidas
@app.route("/ligas", methods=["GET"])
def listar_ligas():
    ligas = get_ligas()
    return jsonify(ligas)


# Rota para partidas
@app.route("/partidas", methods=["GET"])
# Listar partidas com filtros opcionais
def listar_partidas():
    league_id = request.args.get("league_id")
    season = request.args.get("season")
    
    filters = {}
    if league_id:
        filters['idLeague'] = league_id
    if season:
        filters['strSeason'] = season
        
    partidas = get_partidas(filters)
    return jsonify(partidas)


# Rota para salvar uma partida para um usuário
@app.route("/partidas/salvar", methods=["POST"])
def salvar_partida():
    data = request.get_json()
    id_event = data.get('idEvent')
    id_usuario = data.get('idUsuario')
    # Validação básica
    if not id_event or not id_usuario:
        return jsonify({"error": "Entre para continuar"}), 400
    
    try:
        # Verifica se a partida já está salva para este usuário
        partidas_salvas = get_partidas_salvas({
            'idEvent': id_event,
            'idUsuario': id_usuario
        })
        # Se já esta, retorna erro
        if partidas_salvas:
            return jsonify({"error": "Partida já salva para este usuário"}), 400
        
        # Salva nova partida
        nova_partida_salva = {
            'idEvent': id_event,
            'idUsuario': id_usuario,
            'data_criacao': datetime.now().isoformat(),
            'notificado': 0,
            'notificacao_ativa': 1
        }
        
        save_partida_salva(nova_partida_salva)
        return jsonify({"success": True, "message": "Partida salva com sucesso!"})
        
    except Exception as e:
        return jsonify({"error": str(e)}), 500


# Rota para listar partidas salvas de um usuário
@app.route("/partidas/salvas/<id_usuario>", methods=["GET"])
def listar_partidas_salvas(id_usuario):
    try:
        # Busca todas as partidas salvas do usuário
        partidas_salvas = get_partidas_salvas({'idUsuario': id_usuario})
        
        # Para cada partida salva, buscar detalhes da partida
        partidas_completas = []
        for ps in partidas_salvas:
            # Buscar detalhes da partida
            partidas = get_partidas({'idEvent': ps['idEvent']})
            if partidas:
                partida = partidas[0]
                # Adicionar informações adicionais
                partida_completa = {**partida, **ps}
                partidas_completas.append(partida_completa)
        
        return jsonify(partidas_completas)
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route("/partidas/salvas/remover", methods=["POST"])
def remover_partida_salva():
    data = request.get_json()
    id_event = data.get('idEvent')
    id_usuario = data.get('idUsuario')
    
    if not id_event or not id_usuario:
        return jsonify({"error": "idEvent e idUsuario são obrigatórios"}), 400
    
    try:
        # Verifica se a partida existe
        partidas_salvas = get_partidas_salvas({
            'idEvent': id_event,
            'idUsuario': id_usuario
        })
        
        if not partidas_salvas:
            return jsonify({"error": "Partida não encontrada"}), 404
        
        # Remove a partida
        delete_partida_salva(id_event, id_usuario)
        return jsonify({"success": True, "message": "Partida removida com sucesso!"})
            
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route("/partidas/salvas/notificacao", methods=["POST"])
def atualizar_notificacao_partida_salva():
    data = request.get_json()
    id_event = data.get('idEvent')
    id_usuario = data.get('idUsuario')
    notificacao_ativa = data.get('notificacaoAtiva', False)
    
    if not id_event or not id_usuario:
        return jsonify({"error": "idEvent e idUsuario são obrigatórios"}), 400

    try:
        partidas_salvas = get_partidas_salvas({
            'idEvent': id_event,
            'idUsuario': id_usuario
        })
        
        if not partidas_salvas:
            return jsonify({"error": "Partida não encontrada"}), 404
        
        # Atualiza a notificação
        partida_salva = partidas_salvas[0]
        partida_salva['notificacao_ativa'] = 1 if notificacao_ativa else 0
        
        save_partida_salva(partida_salva)
        return jsonify({"success": True, "message": "Notificação atualizada com sucesso!"})
            
    except Exception as e:
        return jsonify({"error": str(e)}), 500

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
    app.run(debug=True, port=5000)