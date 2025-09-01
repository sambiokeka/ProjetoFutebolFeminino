from flask import Flask, jsonify
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

@app.route("/partidas", methods=["GET"])
def listar_partidas():
    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True) 
    cursor.execute("SELECT * FROM partidas ORDER BY dateEvent, strTime")
    partidas = cursor.fetchall()
    cursor.close()
    conn.close()
    return jsonify(partidas)

if __name__ == "__main__":
    app.run(debug=True)
