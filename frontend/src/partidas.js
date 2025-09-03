import React, { useState, useEffect } from "react";

function Partidas() {
  const [partidas, setPartidas] = useState([]);
  const [filtros, setFiltros] = useState({
    data: "",
    liga: "",
    time: "",
    status: ""
  });

  useEffect(() => {
    fetch("http://localhost:5000/partidas")
      .then((res) => res.json())
      .then((data) => setPartidas(data))
      .catch((err) => console.error(err));
  }, []);

  const handleFiltroChange = (e) => {
    const { name, value } = e.target;
    setFiltros((prev) => ({ ...prev, [name]: value }));
  };

  const ligasUnicas = [...new Set(partidas.map((p) => p.strLeague))];

  const filtrarPartidas = () => {
    return partidas.filter((p) => {
      // Filtro por data
      if (filtros.data) {
        const filtroData = new Date(filtros.data);
        const dataPartida = new Date(p.dateEvent);

        if (
          filtroData.getFullYear() !== dataPartida.getFullYear() ||
          filtroData.getMonth() !== dataPartida.getMonth() ||
          filtroData.getDate() !== dataPartida.getDate()
        ) {
          return false;
        }
      }

      // Filtro por liga
      if (filtros.liga && p.strLeague !== filtros.liga) return false;

      // Filtro por time
      if (
        filtros.time &&
        !(
          p.strHomeTeam.toLowerCase().includes(filtros.time.toLowerCase()) ||
          p.strAwayTeam.toLowerCase().includes(filtros.time.toLowerCase())
        )
      )
        return false;

      // Filtro por status
      if (filtros.status && p.status !== filtros.status) return false;

      return true;
    });
  };

  // Ordenar por data + hora
  const partidasOrdenadas = filtrarPartidas().sort((a, b) => {
    const dataA = new Date(`${a.dateEvent}T${a.strTime || "00:00:00"}`);
    const dataB = new Date(`${b.dateEvent}T${b.strTime || "00:00:00"}`);
    return dataA - dataB;
  });

  // Agrupar por data
  const partidasAgrupadas = partidasOrdenadas.reduce((acc, partida) => {
    if (!acc[partida.dateEvent]) acc[partida.dateEvent] = [];
    acc[partida.dateEvent].push(partida);
    return acc;
  }, {});

  return (
    <div>
      <h2>Filtros</h2>
      <div style={{ marginBottom: "1rem" }}>
        <input
          type="date"
          name="data"
          value={filtros.data}
          onChange={handleFiltroChange}
        />

        <select name="liga" value={filtros.liga} onChange={handleFiltroChange}>
          <option value="">Todos os campeonatos</option>
          {ligasUnicas.map((liga) => (
            <option key={liga} value={liga}>
              {liga}
            </option>
          ))}
        </select>

        <input
          type="text"
          name="time"
          placeholder="Time"
          value={filtros.time}
          onChange={handleFiltroChange}
        />

        <select
          name="status"
          value={filtros.status}
          onChange={handleFiltroChange}
        >
          <option value="">Todos</option>
          <option value="proximas">Próximas</option>
          <option value="finalizadas">Finalizadas</option>
        </select>
      </div>

      {/* Renderizar blocos */}
      {Object.keys(partidasAgrupadas).map((data) => (
        <div key={data} style={{ marginBottom: "2rem" }}>
          <h3>{new Date(data).toLocaleDateString("pt-BR")}</h3>
          <table border="1" cellPadding="5" style={{ width: "100%" }}>
            <thead>
              <tr>
                <th>Liga</th>
                <th>Hora</th>
                <th>Casa</th>
                <th>Visitante</th>
                <th>Placar</th>
                <th>Estádio</th>
              </tr>
            </thead>
            <tbody>
              {partidasAgrupadas[data].map((p) => (
                <tr key={p.idEvent}>
                  <td>{p.strLeague}</td>
                  <td>{p.strTime}</td>
                  <td>{p.strHomeTeam}</td>
                  <td>{p.strAwayTeam}</td>
                  <td>
                    {p.intHomeScore} x {p.intAwayScore}
                  </td>
                  <td>{p.strVenue}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ))}
    </div>
  );
}

export default Partidas;
