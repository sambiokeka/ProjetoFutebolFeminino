import React, { useState, useEffect } from "react";

function Salvo() {
  const [partidasSalvas, setPartidasSalvas] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState(null);
  const [usuario] = useState("user123");

  useEffect(() => {
    carregarPartidasSalvas();
  }, []);

  const carregarPartidasSalvas = () => {
    console.log("Carregando partidas salvas...");
    setCarregando(true);
    
    fetch(`http://localhost:5000/partidas/salvas/${usuario}`)
      .then((res) => {
        if (!res.ok) {
          throw new Error(`Erro HTTP! status: ${res.status}`);
        }
        return res.json();
      })
      .then((data) => {
        console.log("Partidas salvas recebidas:", data);
        setPartidasSalvas(data);
        setCarregando(false);
      })
      .catch((err) => {
        console.error("Erro ao carregar partidas salvas:", err);
        setErro("Erro ao carregar partidas salvas: " + err.message);
        setCarregando(false);
      });
  };

  const removerPartida = async (idEvent) => {
    try {
      const response = await fetch("http://localhost:5000/partidas/salvas/remover", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          idEvent: idEvent,
          idUsuario: usuario
        }),
      });
      
      const result = await response.json();
      
      if (result.success) {
        alert("Partida removida!");
        carregarPartidasSalvas();
      } else {
        alert(result.error || "Erro ao remover partida");
      }
    } catch (error) {
      console.error("Erro:", error);
      alert("Erro ao conectar com o servidor");
    }
  };

  if (carregando) {
    return (
      <div style={{ padding: '20px' }}>
        <h1>Partidas Salvas</h1>
        <p>Carregando partidas salvas...</p>
      </div>
    );
  }

  if (erro) {
    return (
      <div style={{ padding: '20px' }}>
        <h1>Partidas Salvas</h1>
        <p style={{ color: 'red' }}>{erro}</p>
        <button onClick={carregarPartidasSalvas}>
          Tentar Novamente
        </button>
      </div>
    );
  }

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h1>Partidas Salvas - VISUALIZAÇÃO BRUTA</h1>
      <p>Usuário: {usuario}</p>
      <p>Total de partidas salvas: {partidasSalvas.length}</p>
      
      {partidasSalvas.length === 0 ? (
        <p>Nenhuma partida salva.</p>
      ) : (
        <div>
          <h2>Lista de Partidas Salvas:</h2>
          <table border="1" style={{ width: '100%', borderCollapse: 'collapse', marginTop: '10px' }}>
            <thead>
              <tr style={{ backgroundColor: '#f0f0f0' }}>
                <th style={{ padding: '8px', textAlign: 'left' }}>ID</th>
                <th style={{ padding: '8px', textAlign: 'left' }}>Partida</th>
                <th style={{ padding: '8px', textAlign: 'left' }}>Data</th>
                <th style={{ padding: '8px', textAlign: 'left' }}>Hora</th>
                <th style={{ padding: '8px', textAlign: 'left' }}>Liga</th>
                <th style={{ padding: '8px', textAlign: 'left' }}>Salvo em</th>
                <th style={{ padding: '8px', textAlign: 'left' }}>Ações</th>
              </tr>
            </thead>
            <tbody>
              {partidasSalvas.map((partida) => (
                <tr key={partida.idEvent} style={{ borderBottom: '1px solid #ddd' }}>
                  <td style={{ padding: '8px' }}>{partida.idEvent}</td>
                  <td style={{ padding: '8px' }}>
                    <strong>{partida.strHomeTeam}</strong> vs <strong>{partida.strAwayTeam}</strong>
                  </td>
                  <td style={{ padding: '8px' }}>{partida.dateEvent}</td>
                  <td style={{ padding: '8px' }}>{partida.strTime || 'N/A'}</td>
                  <td style={{ padding: '8px' }}>{partida.strLeague}</td>
                  <td style={{ padding: '8px' }}>
                    {partida.data_criacao ? new Date(partida.data_criacao).toLocaleString('pt-BR') : 'N/A'}
                  </td>
                  <td style={{ padding: '8px' }}>
                    <button 
                      onClick={() => removerPartida(partida.idEvent)}
                      style={{
                        backgroundColor: '#ff4444',
                        color: 'white',
                        border: 'none',
                        padding: '5px 10px',
                        borderRadius: '3px',
                        cursor: 'pointer'
                      }}
                    >
                      Remover
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default Salvo; 