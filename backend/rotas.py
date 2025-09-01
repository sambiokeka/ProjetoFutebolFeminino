from flask import Flask, jsonify, request
import mysql.connector
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

def get_db_connection():
    conn = mysql.connector.connect(
        host="localhost",
        user="root",      # troque pelo nome do seu usuário do mySQL
        password="root",  # troque pela senha q vc usa no mySQL
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

if __name__ == "__main__":
    app.run(debug=True)