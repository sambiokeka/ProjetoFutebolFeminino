import React, { useState, useEffect, useCallback, useRef } from "react";
import '../styles/Partidas.css';
import { traduzirNome } from '../utils/traduzir';
import { getEscudoTime } from '../utils/escudos';
import Popup from '../components/Popup';

function Partidas() {
  const [partidas, setPartidas] = useState([]);
  const [partidasSalvas, setPartidasSalvas] = useState([]);
  const [filtros, setFiltros] = useState({
    data: "",
    liga: "",
    time: "",
    status: ""
  });
  const [showPopup, setShowPopup] = useState(false);
  const [partidaParaSalvar, setPartidaParaSalvar] = useState(null);

  const partidasSectionRef = useRef(null);
  const [usuario] = useState(localStorage.getItem('username') || '');

  const traduzirPartidas = (partidas) => {
    return partidas.map(partida => ({
      ...partida,
      strHomeTeam: traduzirNome(partida.strHomeTeam),
      strAwayTeam: traduzirNome(partida.strAwayTeam),
      strLeague: traduzirNome(partida.strLeague),
      strEvent: traduzirNome(partida.strEvent)
    }));
  };

  const buscarPartidas = useCallback(async () => {
    try {
      const res = await fetch("http://localhost:5000/partidas");
      if (!res.ok) {
        throw new Error(`Erro HTTP! status: ${res.status}`);
      }
      const data = await res.json();
      const partidasTraduzidas = traduzirPartidas(data);
      setPartidas(partidasTraduzidas);
    } catch (err) {
      console.error("Erro ao carregar partidas:", err);
    }
  }, []);

  const carregarPartidasSalvas = () => {
    fetch(`http://localhost:5000/partidas/salvas/${usuario}`)
      .then((res) => res.json())
      .then((data) => setPartidasSalvas(data))
      .catch((err) => console.error("Erro ao carregar partidas salvas:", err));
  };
  
  useEffect(() => {
    buscarPartidas();

    const intervalId = setInterval(() => {
      buscarPartidas();
    }, 5000);

    return () => clearInterval(intervalId);
  }, [buscarPartidas]);

  useEffect(() => {
    carregarPartidasSalvas();
  }, [usuario]);

  const handleCalendarioClick = (e) => {
    e.preventDefault();
    setFiltros(prev => ({
      ...prev,
      status: "proxima",
      data: "",
      liga: "",
      time: ""
    }));
    
    setTimeout(() => {
      if (partidasSectionRef.current) {
        partidasSectionRef.current.scrollIntoView({ 
          behavior: 'smooth',
          block: 'start'
        });
      }
    }, 100);
  };

  const salvarPartida = async (idEvent) => {
    if (!usuario) {
      setPartidaParaSalvar(idEvent);
      setShowPopup(true); 
      return;
    }

    try {
      const response = await fetch("http://localhost:5000/partidas/salvar", {
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
        carregarPartidasSalvas();
      } else {
        alert(result.error || "Erro ao salvar partida");
      }
    } catch (error) {
      console.error("Erro:", error);
      alert("Erro ao conectar com o servidor");
    }
  };

  const handleLoginPopupClose = () => {
    setShowPopup(false);
    setPartidaParaSalvar(null);
  };

  const handleLoginRedirect = () => {
    setShowPopup(false);
    localStorage.setItem('partidaParaSalvar', partidaParaSalvar);
    window.location.href = '/login';
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
        carregarPartidasSalvas();
      } else {
        alert(result.error || "Erro ao remover partida");
      }
    } catch (error) {
      console.error("Erro:", error);
      alert("Erro ao conectar com o servidor");
    }
  };

  const handleFiltroChange = (e) => {
    const { name, value } = e.target;
    setFiltros((prev) => ({ ...prev, [name]: value }));
  };

  const ligasUnicas = [...new Set(partidas.map((p) => p.strLeague))].sort((a, b) => 
    a.localeCompare(b, 'pt-BR', { sensitivity: 'base' })
  );

  const ajustarHorarioBrasil = (horaUTC, status = "proxima") => {
    if (!horaUTC) {
      return status === "proxima" ? "--" : "--:--";
    }
    
    const [hours, minutes] = horaUTC.split(':');
    let horasBrasil = parseInt(hours) - 3;
    
    if (horasBrasil < 0) {
      horasBrasil += 24;
    }
    
    return `${horasBrasil.toString().padStart(2, '0')}:${minutes}`;
  };

  const getStatusPartida = useCallback((partida) => {
    if (partida.status) {
      const statusMap = {
        'proximas': 'proxima',
        'ao_vivo': 'ao-vivo', 
        'finalizadas': 'finalizada'
      };
      return statusMap[partida.status] || 'proxima';
    }
    const agora = new Date();
    
    if (partida.intHomeScore !== null && partida.intAwayScore !== null) {
      return "finalizada";
    }
    
    if (!partida.dateEvent || !partida.strTime) {
      return "proxima";
    }
    
    try {
      const horaBrasil = ajustarHorarioBrasil(partida.strTime);
      const dataPartidaStr = `${partida.dateEvent}T${horaBrasil}`;
      const dataPartida = new Date(dataPartidaStr);
      
      if (isNaN(dataPartida.getTime())) {
        return "proxima";
      }
      
      const dataFimPartida = new Date(dataPartida.getTime() + (2 * 60 * 60 * 1000));
      
      if (agora < dataPartida) {
        return "proxima";
      } else if (agora >= dataPartida && agora <= dataFimPartida) {
        return "ao-vivo";
      } else {
        return "finalizada";
      }
      
    } catch {
      return "proxima";
    }
  }, []);

  const isPartidaSalva = (idEvent) => {
    return partidasSalvas.some(ps => ps.idEvent === idEvent);
  };

  const filtrarPartidas = () => {
    const partidasFiltradas = partidas.filter((p) => {
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

      if (filtros.liga && p.strLeague !== filtros.liga) return false;

      if (
        filtros.time &&
        !(
          p.strHomeTeam.toLowerCase().includes(filtros.time.toLowerCase()) ||
          p.strAwayTeam.toLowerCase().includes(filtros.time.toLowerCase())
        )
      )
        return false;

      if (filtros.status) {
        const statusPartida = getStatusPartida(p);
        if (filtros.status !== statusPartida) return false;
      }

      return true;
    });
    
    return partidasFiltradas;
  };

  const partidasOrdenadas = filtrarPartidas().sort((a, b) => {
    const horaA = ajustarHorarioBrasil(a.strTime);
    const horaB = ajustarHorarioBrasil(b.strTime);
    const dataA = new Date(`${a.dateEvent}T${horaA || "00:00"}`);
    const dataB = new Date(`${b.dateEvent}T${horaB || "00:00"}`);
    return dataA - dataB;
  });

  const partidasAgrupadas = partidasOrdenadas.reduce((acc, partida) => {
    if (!acc[partida.dateEvent]) acc[partida.dateEvent] = [];
    acc[partida.dateEvent].push(partida);
    return acc;
  }, {});

  const formatarData = (dataStr) => {
    try {
      const dataUTC = new Date(dataStr + 'T12:00:00Z'); 
      
      const dataBrasil = new Date(dataUTC.getTime() - (3 * 60 * 60 * 1000));
      
      return dataBrasil.toLocaleDateString('pt-BR', { 
        weekday: 'long', 
        day: 'numeric', 
        month: 'long', 
        year: 'numeric' 
      });
    } catch (error) {
      return dataStr;
    }
  };
  
  return (
    <div className="partidas-container">
      <Popup 
      isOpen={showPopup}
      onClose={handleLoginPopupClose}
      onLoginRedirect={handleLoginRedirect}
      />

      <div className="hero-section">
        <div className="hero-content">
          <h1>O Futuro do Futebol Feminino</h1>
          <p>Acompanhe todas as partidas, estatísticas e notícias do futebol feminino.<br />
          Celebramos o talento, a paixão e a força das mulheres no esporte.</p>
          <div className="hero-actions">
            <a href="/Salvo" className="icon-btn">
              <i className="fas fa-play-circle"></i>
              Ver meus jogos Salvos
            </a>
            <a href="#" className="icon-btn" onClick={handleCalendarioClick}>
              <i className="fas fa-calendar-alt"></i>
              Calendário de jogos
            </a>
          </div>
        </div>
      </div>

      <div ref={partidasSectionRef} className="filtros-section">
        <h2>Todas as partidas</h2>
        <p className="subtitulo">Acompanhe os jogos mais importantes de futebol feminino</p>
        
        <div className="filtros-container">
          <div className="filtro-group">
            <label>Data</label>
            <input
              type="date"
              name="data"
              value={filtros.data}
              onChange={handleFiltroChange}
              className="filtro-input"
            />
          </div>

          <div className="filtro-group">
            <label>Liga/Campeonato</label>
              <select 
                name="liga" 
                value={filtros.liga} 
                onChange={handleFiltroChange}
                className="filtro-select"
              >
                <option value="">Todos os campeonatos</option>
                {ligasUnicas.map((liga) => (
                  <option key={liga} value={liga}>
                    {liga}
                  </option>
                ))}
              </select>
          </div>

          <div className="filtro-group">
            <label>Time</label>
            <input
              type="text"
              name="time"
              placeholder="Nome do time"
              value={filtros.time}
              onChange={handleFiltroChange}
              className="filtro-input"
            />
          </div>

          <div className="filtro-group">
            <label>Status</label>
            <select
              name="status"
              value={filtros.status}
              onChange={handleFiltroChange}
              className="filtro-select"
            >
              <option value="">Todos</option>
              <option value="proxima">Próximas</option>
              <option value="ao-vivo">Ao Vivo</option>
              <option value="finalizada">Finalizadas</option>
            </select>
          </div>
        </div>
      </div>

      <div className="partidas-content">
        {Object.keys(partidasAgrupadas).length > 0 ? (
          Object.keys(partidasAgrupadas).map((data) => (
            <div key={data} className="partidas-dia">
              <h3 className="data-titulo">{formatarData(data)}</h3>
              
              {partidasAgrupadas[data].map((p) => {
                const status = getStatusPartida(p);
                const partidaSalva = isPartidaSalva(p.idEvent);
                
                return (
                  <div key={p.idEvent} className="partida-card">
                    <div className="partida-header">
                      <span className="liga-nome">{p.strLeague}</span>
                      {status === "proxima" && (
                        <span className="partida-proxima">PRÓXIMA</span>
                      )}
                      {status === "ao-vivo" && (
                        <span className="partida-ao-vivo">● AO VIVO</span>
                      )}
                      {status === "finalizada" && (
                        <span className="partida-finalizada">FINALIZADA</span>
                      )}
                    </div>
                    
                    <div className="partida-corpo">
                      <div className="time time-casa">
                        <div className="time-escudo">
                          <img 
                            src={getEscudoTime(p.strHomeTeam)} 
                            alt={p.strHomeTeam}
                            className="escudo-time"
                            onError={(e) => {
                              e.target.style.display = 'none';
                              e.target.nextSibling.style.display = 'flex';
                            }}
                          />
                          <div className="escudo-placeholder">
                            <i className="fas fa-shield-alt"></i>
                          </div>
                        </div>
                        <span className="time-nome">{p.strHomeTeam}</span>
                      </div>
                      
                      <div className="placar">
                        {status === "proxima" ? (
                            <span className="partida-horario">
                              {ajustarHorarioBrasil(p.strTime, status)}
                            </span>
                        ) : (
                          <>
                            <span className="placar-numero">{p.intHomeScore !== null ? p.intHomeScore : '-'}</span>
                            <span className="placar-divisoria">x</span>
                            <span className="placar-numero">{p.intAwayScore !== null ? p.intAwayScore : '-'}</span>
                          </>
                        )}
                      </div>
                      
                      <div className="time time-visitante">
                        <div className="time-escudo">
                          <img 
                            src={getEscudoTime(p.strAwayTeam)} 
                            alt={p.strAwayTeam}
                            className="escudo-time"
                            onError={(e) => {
                              e.target.style.display = 'none';
                              e.target.nextSibling.style.display = 'flex';
                            }}
                          />
                          <div className="escudo-placeholder">
                            <i className="fas fa-shield-alt"></i>
                          </div>
                        </div>
                        <span className="time-nome">{p.strAwayTeam}</span>
                      </div>
                    </div>
                    
                    <div className="partida-footer">
                      {status === "proxima" && (
                        partidaSalva ? (
                          <button 
                            className="btn-lembrar salvo"
                            onClick={() => removerPartida(p.idEvent)}
                          >
                            <i className="fas fa-check-circle"></i>
                            Lembrar-me
                          </button>
                        ) : (
                          <button 
                            className="btn-lembrar"
                            onClick={() => salvarPartida(p.idEvent)}
                          >
                            <i className="fas fa-bell"></i>
                            Lembrar-me
                          </button>
                        )
                      )}
                      
                      {status === "ao-vivo" && (
                        <button className="btn-assistir">
                          <i className="fas fa-play-circle"></i>
                          Assistir ao vivo
                        </button>
                      )}
                      
                      {status === "finalizada" && (
                        <button className="btn-detalhes">
                          <i className="fas fa-info-circle"></i>
                          Ver detalhes
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          ))
        ) : (
          <div className="sem-partidas">
            <i className="fas fa-futbol"></i>
            <p>Nenhuma partida encontrada com os filtros selecionados</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default Partidas;