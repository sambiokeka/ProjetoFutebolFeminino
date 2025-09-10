import React, { useState, useEffect } from "react";
import '../styles/Partidas.css';
import { traduzirNome } from '../utils/traduzir';

function Partidas() {
  const [partidas, setPartidas] = useState([]);
  const [partidasSalvas, setPartidasSalvas] = useState([]);
  const [filtros, setFiltros] = useState({
    data: "",
    liga: "",
    time: "",
    status: ""
  });
  const [carregando, setCarregando] = useState(true); 
  const [erro, setErro] = useState(null); 
  const [usuario] = useState("user123");

  useEffect(() => {
    carregarPartidas();
    carregarPartidasSalvas();
  }, []);

  const traduzirPartidas = (partidas) => {
    return partidas.map(partida => ({
      ...partida,
      strHomeTeam: traduzirNome(partida.strHomeTeam),
      strAwayTeam: traduzirNome(partida.strAwayTeam),
      strLeague: traduzirNome(partida.strLeague),
      strEvent: traduzirNome(partida.strEvent)
    }));
  };

  const carregarPartidas = () => {
    console.log("Fazendo fetch para http://localhost:5000/partidas");
    setCarregando(true);
    setErro(null);
    
    fetch("http://localhost:5000/partidas")
      .then((res) => {
        console.log("Resposta recebida:", res.status, res.statusText);
        if (!res.ok) {
          throw new Error(`Erro HTTP! status: ${res.status}`);
        }
        return res.json();
      })
      .then((data) => {
        console.log("Dados recebidos:", data);
        
        const partidasTraduzidas = traduzirPartidas(data);
        console.log("Partidas traduzidas:", partidasTraduzidas);
        
        setPartidas(partidasTraduzidas);
        setCarregando(false);
      })
      .catch((err) => {
        console.error("Erro ao carregar partidas:", err);
        setErro("Erro ao carregar partidas: " + err.message);
        setCarregando(false);
        
        const dadosMock = [
          {
            idEvent: "1",
            strEvent: "Flamengo Feminino vs Corinthians Feminino",
            dateEvent: "2024-03-20",
            strTime: "19:00",
            strSeason: "2024",
            strHomeTeam: "Flamengo Feminino",
            strAwayTeam: "Corinthians Feminino",
            intHomeScore: null,
            intAwayScore: null,
            strVenue: "Maracanã",
            idLeague: "123",
            strLeague: "Brasileirão Feminino"
          }
        ];
        
        console.log("Usando dados mock traduzidos");
        setPartidas(dadosMock);
      });
  };

  const carregarPartidasSalvas = () => {
    fetch(`http://localhost:5000/partidas/salvas/${usuario}`)
      .then((res) => res.json())
      .then((data) => setPartidasSalvas(data))
      .catch((err) => console.error("Erro ao carregar partidas salvas:", err));
  };

  const salvarPartida = async (idEvent) => {
    try {
      console.log("Tentando salvar partida com ID:", idEvent, "Tipo:", typeof idEvent);
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
        alert("Partida salva! Você será notificado antes do início.");
        // Recarregar a lista de partidas salvas
        carregarPartidasSalvas();
      } else {
        alert(result.error || "Erro ao salvar partida");
      }
    } catch (error) {
      console.error("Erro:", error);
      alert("Erro ao conectar com o servidor");
    }
  };

  const removerPartida = async (idEvent) => {
    try {
      console.log("Tentando remover partida com ID:", idEvent, "Tipo:", typeof idEvent);
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
        alert("Partida removida da sua lista.");
        // Recarregar a lista de partidas salvas
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

  const ligasUnicas = [...new Set(partidas.map((p) => p.strLeague))];


const getStatusPartida = (partida) => {
  const agora = new Date();
  
  // Se já tem placar, é finalizada
  if (partida.intHomeScore !== null && partida.intAwayScore !== null) {
    return "finalizada";
  }
  
  // Se não tem data/hora, considera como próxima
  if (!partida.dateEvent || !partida.strTime) {
    return "proxima";
  }
  
  // Converte a data e hora da partida
  const dataPartidaStr = `${partida.dateEvent}T${partida.strTime}`;
  let dataPartida;
  
  try {
    dataPartida = new Date(dataPartidaStr);
    
    // Se a data é inválida, considera como próxima
    if (isNaN(dataPartida.getTime())) {
      return "proxima";
    }
    
    // Se a partida já passou mas não tem placar, considera "ao vivo"
    // (supondo que está em andamento)
    if (dataPartida < agora) {
      return "ao-vivo";
    }
    
    // Se a partida é no futuro
    return "proxima";
    
  } catch (error) {
    console.error("Erro ao processar data da partida:", error, partida);
    return "proxima";
  }
};

  // verificar se partida está salva
  const isPartidaSalva = (idEvent) => {
    return partidasSalvas.some(ps => ps.idEvent === idEvent);
  };

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
      if (filtros.status) {
        const statusPartida = getStatusPartida(p);
        if (filtros.status !== statusPartida) return false;
      }

      return true;
    });
  };

  // Ordenar por data + hora
  const partidasOrdenadas = filtrarPartidas().sort((a, b) => {
    const dataA = new Date(`${a.dateEvent}T${a.strTime || "00:00"}`);
    const dataB = new Date(`${b.dateEvent}T${b.strTime || "00:00"}`);
    return dataA - dataB;
  });

  // Agrupar por data
  const partidasAgrupadas = partidasOrdenadas.reduce((acc, partida) => {
    if (!acc[partida.dateEvent]) acc[partida.dateEvent] = [];
    acc[partida.dateEvent].push(partida);
    return acc;
  }, {});

  // Formatar data em português
  const formatarData = (dataStr) => {
    const data = new Date(dataStr);
    const options = { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' };
    return data.toLocaleDateString('pt-BR', options);
  };

  return (
    <div className="partidas-container">
      <div className="hero-section">
        <div className="hero-content">
          <h1>O Futuro do Futebol Feminino</h1>
          <p>Acompanhe todas as partidas, estatísticas e notícias do futebol feminino.<br />
          Celebramos o talento, a paixão e a força das mulheres no esporte.</p>
          <div className="hero-actions">
            <a href="#" className="icon-btn">
              <i className="fas fa-play-circle"></i>
              Encontrar partidas ao vivo
            </a>
            <a href="#" className="icon-btn">
              <i className="fas fa-calendar-alt"></i>
              Calendário de jogos
            </a>
          </div>
        </div>
      </div>

      <div className="filtros-section">
        <h2>Todas as partidas</h2>
        <p className="subtitulo">Acompanhe os jogos mais importantes de futebol feminino</p>
        
        {/* FILTRO */}
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
                          <div className="escudo-placeholder">
                            <i className="fas fa-shield-alt"></i>
                          </div>
                        </div>
                        <span className="time-nome">{p.strHomeTeam}</span>
                      </div>
                      
                      <div className="placar">
                        {status === "proxima" ? (
                          <span className="partida-horario">{p.strTime ? p.strTime.substring(0, 5) : '--:--'}</span>
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