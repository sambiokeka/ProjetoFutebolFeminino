import React, { useState, useEffect } from "react";

function Partidas() {
  const [partidas, setPartidas] = useState([]);

  useEffect(() => {
    fetch("http://localhost:5000/partidas") 
      .then((res) => res.json())
      .then((data) => setPartidas(data))
      .catch((err) => console.error(err));
  }, []);

  return (
  <table border="1" cellPadding="5">
    <thead>
      <tr>
        <th>Liga</th> 
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
          <td>{p.strLeague}</td>
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
  );
}

export default Partidas;
