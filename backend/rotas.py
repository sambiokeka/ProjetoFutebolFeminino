from flask import Flask, jsonify, request
import mysql.connector
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

def get_db_connection():
    conn = mysql.connector.connect(
        host="localhost",
        user="root",
        password="root",
        database="futebol_feminino"
    )
    return conn


@app.route("/ligas", methods=["GET"])
def listar_ligas():
    conn = get_db_connection()
    cur = conn.cursor(dictionary=True)
    cur.execute("SELECT idLeague, strLeague, strSport, strLeagueAlternate FROM ligas ORDER BY strLeague")
    ligas = cur.fetchall()
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
        sql += " AND p.idLeague = %s"
        params.append(league_id)

    if season:
        sql += " AND p.strSeason = %s"
        params.append(season)

    sql += " ORDER BY p.dateEvent, p.strTime"

    conn = get_db_connection()
    cur = conn.cursor(dictionary=True)
    cur.execute(sql, params)
    partidas = cur.fetchall()
    cur.close()
    conn.close()
    return jsonify(partidas)

@app.route("/debug/partidas/ao_vivo", methods=["GET"])
def debug_partidas_ao_vivo():
    conn = get_db_connection()
    cur = conn.cursor(dictionary=True)
    
    cur.execute("""
        SELECT * FROM partidas 
        WHERE status = 'ao_vivo'
    """)
    
    partidas_ao_vivo = cur.fetchall()
    cur.close()
    conn.close()
    
    return jsonify({
        "count": len(partidas_ao_vivo),
        "partidas": partidas_ao_vivo
    })

@app.route("/partidas/salvar", methods=["POST"])
def salvar_partida():
    data = request.get_json()
    id_event = data.get('idEvent')
    id_usuario = data.get('idUsuario')
    
    if not id_event or not id_usuario:
        return jsonify({"error": "idEvent e idUsuario são obrigatórios"}), 400
    
    conn = get_db_connection()
    cur = conn.cursor()
    
    try:
        cur.execute("""
            INSERT INTO partidas_salvas (idEvent, idUsuario)
            VALUES (%s, %s)
        """, (id_event, id_usuario))
        conn.commit()
        return jsonify({"success": True, "message": "Partida salva com sucesso!"})
    except mysql.connector.IntegrityError:
        return jsonify({"error": "Partida já salva para este usuário"}), 400
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    finally:
        cur.close()
        conn.close()

@app.route("/partidas/salvas/<id_usuario>", methods=["GET"])
def listar_partidas_salvas(id_usuario):
    conn = get_db_connection()
    cur = conn.cursor(dictionary=True)
    
    cur.execute("""
        SELECT p.*, l.strLeague, ps.data_criacao
        FROM partidas_salvas ps
        JOIN partidas p ON ps.idEvent = p.idEvent
        LEFT JOIN ligas l ON p.idLeague = l.idLeague
        WHERE ps.idUsuario = %s
        ORDER BY p.dateEvent, p.strTime
    """, (id_usuario,))
    
    partidas = cur.fetchall()
    cur.close()
    conn.close()
    
    return jsonify(partidas)



@app.route("/partidas/salvas/remover", methods=["POST"])
def remover_partida_salva():
    data = request.get_json()
    id_event = data.get('idEvent')
    id_usuario = data.get('idUsuario')
    
    print(f"Removendo partida: idEvent={id_event}, usuario={id_usuario}")
    
    if not id_event or not id_usuario:
        return jsonify({"error": "idEvent e idUsuario são obrigatórios"}), 400
    
    conn = get_db_connection()
    cur = conn.cursor()
    
    try:
        cur.execute("DELETE FROM partidas_salvas WHERE idEvent = %s AND idUsuario = %s", 
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

if __name__ == "__main__":
    app.run(debug=True, port=5000)