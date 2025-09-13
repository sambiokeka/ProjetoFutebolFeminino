import React, { useState, useEffect } from "react";
import "../styles/Salvo.css"; 

function Salvo() {
  const [partidasSalvas, setPartidasSalvas] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState(null);
  const [usuario] = useState("user123");
  const [abaAtiva, setAbaAtiva] = useState("proximas");

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

  const isUpcoming = (dateEvent, strTime) => {
    if (!dateEvent) return false;
    
    const [hours, minutes] = strTime ? strTime.split(':') : [0, 0];
    const matchDate = new Date(dateEvent);
    matchDate.setHours(parseInt(hours), parseInt(minutes), 0, 0);
    
    return matchDate > new Date();
  };

  const formatarData = (dataString) => {
    if (!dataString) return "Data não disponível";
    const data = new Date(dataString);
    return data.toLocaleDateString("pt-BR", { 
      weekday: 'short', 
      day: '2-digit', 
      month: '2-digit'
    });
  };

  const formatarHora = (horaString) => {
    if (!horaString) return "--:--";
    const [hours, minutes] = horaString.split(':');
    return `${hours.padStart(2, '0')}:${minutes.padStart(2, '0')}`;
  };

  const partidasFiltradas = partidasSalvas.filter((partida) => {
    const upcoming = isUpcoming(partida.dateEvent, partida.strTime);
    return abaAtiva === "proximas" ? upcoming : !upcoming;
  });

  const proximasCount = partidasSalvas.filter((p) => isUpcoming(p.dateEvent, p.strTime)).length;
  const finalizadasCount = partidasSalvas.length - proximasCount;

  if (carregando) {
    return (
      <div className="salvo-container">
        <div className="loading">
          <div className="spinner"></div>
          <p>Carregando partidas salvas...</p>
        </div>
      </div>
    );
  }

  if (erro) {
    return (
      <div className="salvo-container">
        <div className="error-container">
          <h4>Erro</h4>
          <p>{erro}</p>
          <button className="btn-tentar-novamente" onClick={carregarPartidasSalvas}>
            Tentar Novamente
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="salvo-container">
      {/* Hero Section com fundo rosa */}
      <div className="hero-section">
        <div className="hero-content">
          <h1>Jogos Salvos</h1>
          <p>Veja as partidas que você escolheu acompanhar</p>
        </div>
      </div>

      {/* Abas */}
      <div className="abas-container">
        <button
          onClick={() => setAbaAtiva("proximas")}
          className={`aba ${abaAtiva === "proximas" ? "ativa" : ""}`}
        >
          Próximas ({proximasCount})
        </button>
        <button
          onClick={() => setAbaAtiva("finalizadas")}
          className={`aba ${abaAtiva === "finalizadas" ? "ativa" : ""}`}
        >
          Finalizadas ({finalizadasCount})
        </button>
      </div>

      {/* Lista de Partidas */}
      <div className="partidas-lista">
        {partidasFiltradas.length === 0 ? (
          <div className="partida-vazia">
            <p>
              {abaAtiva === "proximas" 
                ? "Nenhuma partida próxima salva." 
                : "Nenhuma partida finalizada salva."}
            </p>
          </div>
        ) : (
          partidasFiltradas.map((partida) => {
            const isProxima = isUpcoming(partida.dateEvent, partida.strTime);
            return (
              <div key={partida.idEvent} className="partida-card">
                <div className="partida-header">
                  <span className="liga">{partida.strLeague}</span>
                  <span className={`status ${isProxima ? "proxima" : "finalizada"}`}>
                    {isProxima ? "PRÓXIMA" : "FINALIZADA"}
                  </span>
                </div>

                <div className="partida-content">
                  <div className="time time-casa">
                    <div className="time-logo">
                      <img
                        src={`/abstract-geometric-shapes.png?height=80&width=80&query=${partida.strHomeTeam} logo`}
                        alt={partida.strHomeTeam}
                        onError={(e) => {
                          e.target.src = `https://via.placeholder.com/80/EFEFEF/666666?text=${partida.strHomeTeam?.charAt(0) || 'T'}`;
                        }}
                      />
                    </div>
                    <span className="time-nome">{partida.strHomeTeam}</span>
                  </div>

                  <div className="partida-info">
                    {isProxima ? (
                      <>
                        <span className="hora">{formatarHora(partida.strTime)}</span>
                        <span className="data">{formatarData(partida.dateEvent)}</span>
                      </>
                    ) : (
                      <>
                        <div className="placar">
                          <span>{partida.intHomeScore !== null ? partida.intHomeScore : "-"}</span>
                          <span className="divisor">×</span>
                          <span>{partida.intAwayScore !== null ? partida.intAwayScore : "-"}</span>
                        </div>
                        <span className="data">{formatarData(partida.dateEvent)}</span>
                      </>
                    )}
                  </div>

                  <div className="time time-visitante">
                    <div className="time-logo">
                      <img
                        src={`/abstract-geometric-shapes.png?height=80&width=80&query=${partida.strAwayTeam} logo`}
                        alt={partida.strAwayTeam}
                        onError={(e) => {
                          e.target.src = `https://via.placeholder.com/80/EFEFEF/666666?text=${partida.strAwayTeam?.charAt(0) || 'T'}`;
                        }}
                      />
                    </div>
                    <span className="time-nome">{partida.strAwayTeam}</span>
                  </div>
                </div>

                <div className="partida-actions">
                  <button className="btn-lembrar">
                    <span>Lembrar-me</span>
                  </button>
                  <button 
                    className="btn-remover"
                    onClick={() => removerPartida(partida.idEvent)}
                  >
                    <span>Remover</span>
                  </button>
                </div>

                <div className="partida-footer">
                  <span>Salvo no dia {partida.data_criacao ? formatarData(partida.data_criacao) : "31/08/2025"}</span>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}

export default Salvo;