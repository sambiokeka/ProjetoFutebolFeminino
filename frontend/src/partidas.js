import React, { useState, useEffect } from "react";

function Partidas() {
  const [partidas, setPartidas] = useState([]); // guarda os jogos

  // useEffect executa quando o componente carrega
  useEffect(() => {
    fetch("http://localhost:5000/partidas") // sua API Flask
      .then((res) => res.json())
      .then((data) => setPartidas(data))
      .catch((err) => console.error(err));
  }, []);

  return (
    <div>
      <h2>Partidas do Brasileirão Feminino 2025</h2>
      <table border="1" cellPadding="5">
        <thead>
          <tr>
            <th>Data</th>
            <th>Hora</th>
            <th>Casa</th>
            <th>Visitante</th>
            <th>Placar</th>
            <th>Estádio</th>
          </tr>
        </thead>
        <tbody>
          {partidas.map((p) => (
            <tr key={p.idEvent}>
              <td>{p.dateEvent}</td>
              <td>{p.strTime}</td>
              <td>{p.strHomeTeam}</td>
              <td>{p.strAwayTeam}</td>
              <td>{p.intHomeScore} x {p.intAwayScore}</td>
              <td>{p.strVenue}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Partidas;
