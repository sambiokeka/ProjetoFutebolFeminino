import { useState, useEffect, useCallback, useRef } from "react";
import { Link } from 'react-router-dom';
import '../styles/Partidas.css';
import { traduzirNome } from '../utils/traduzir';
import Popup from '../components/Popup';
import PartidaCard from "../components/PartidaCard";


export default function Partidas() {
  const [partidas, setPartidas] = useState([]);
  const [partidasSalvas, setPartidasSalvas] = useState([]);
  const [filtros, setFiltros] = useState({ data: "", liga: "", time: "", status: "" });

  const [showPopup, setShowPopup] = useState(false);
  const [partidaParaSalvar, setPartidaParaSalvar] = useState(null);

  const partidasSectionRef = useRef(null);
  const [usuario] = useState(localStorage.getItem('username') || '');

  // --- FUNÇÕES DE DADOS E LÓGICA ---
  const traduzirPartidas = (partidas) => {
    return partidas.map(partida => ({
      ...partida,
      strHomeTeam: traduzirNome(partida.strHomeTeam),
      strAwayTeam: traduzirNome(partida.strAwayTeam),
      strLeague: traduzirNome(partida.strLeague),
    }));
  };

  const buscarPartidas = useCallback(async () => {
    try {
      const res = await fetch("http://localhost:5000/partidas");
      if (!res.ok) throw new Error('Falha na resposta da rede');
      const data = await res.json();
      setPartidas(traduzirPartidas(data));
    } catch (err) {
      console.error("Erro ao carregar partidas:", err);
    }
  }, []);

  const carregarPartidasSalvas = useCallback(() => {
    if (!usuario) return;
    fetch(`http://localhost:5000/partidas/salvas/${usuario}`)
      .then((res) => res.json())
      .then((data) => setPartidasSalvas(data))
      .catch((err) => console.error("Erro ao carregar partidas salvas:", err));
  }, [usuario]);

  useEffect(() => {
    buscarPartidas();
    const intervalId = setInterval(buscarPartidas, 5000);
    return () => clearInterval(intervalId);
  }, [buscarPartidas]);

  useEffect(() => {
    carregarPartidasSalvas();
  }, [carregarPartidasSalvas]);


  // --- FUNÇÕES DE EVENTOS ---
  const salvarPartida = async (idEvent) => {
    if (!usuario) {
      setPartidaParaSalvar(idEvent);
      setShowPopup(true);
      return;
    }
    try {
      const response = await fetch("http://localhost:5000/partidas/salvar", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ idEvent, idUsuario: usuario }),
      });
      const result = await response.json();
      if (result.success) {
        carregarPartidasSalvas();
      } else {
        alert(result.error || "Erro ao salvar partida");
      }
    } catch (error) {
      console.error("Erro:", error);
    }
  };

  const removerPartida = async (idEvent) => {
    try {
      const response = await fetch("http://localhost:5000/partidas/salvas/remover", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ idEvent, idUsuario: usuario }),
      });
      const result = await response.json();
      if (result.success) {
        carregarPartidasSalvas();
      } else {
        alert(result.error || "Erro ao remover partida");
      }
    } catch (error) {
      console.error("Erro:", error);
    }
  };

  const handleFiltroChange = (e) => {
    const { name, value } = e.target;
    setFiltros((prev) => ({ ...prev, [name]: value }));
  };

  const handleCalendarioClick = (e) => {
    e.preventDefault();
    setFiltros(prev => ({ ...prev, status: "proxima", data: "", liga: "", time: "" }));
    setTimeout(() => {
      if (partidasSectionRef.current) {
        partidasSectionRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 100);
  };

  // --- FUNÇÕES DE FILTRO E ORDENAÇÃO ---
  const getStatusPartida = useCallback((partida) => {

    if (partida.status_calculado) {
        const statusMap = { 'proximas': 'proxima', 'ao_vivo': 'ao-vivo', 'finalizadas': 'finalizada' };
        return statusMap[partida.status_calculado];
    }


    const agora = new Date();
    if (!partida.dateEvent || !partida.strTime) {
      return "proxima";
    }

    try {
      const [hours, minutes] = partida.strTime.split(':');
      let horasBrasil = parseInt(hours) - 3;
      if (horasBrasil < 0) horasBrasil += 24;
      const horaBrasil = `${horasBrasil.toString().padStart(2, '0')}:${minutes}`;

      const dataPartida = new Date(`${partida.dateEvent}T${horaBrasil}:00`);
      const dataFimPartida = new Date(dataPartida.getTime() + (120 * 60 * 1000));

      if (isNaN(dataPartida.getTime())) return "proxima";

      if (agora > dataFimPartida) {
        return "finalizada";
      } else if (agora >= dataPartida) {
        return "ao-vivo";
      } else {
        return "proxima";
      }
    } catch {
      return "proxima";
    }
  }, []);

  const isPartidaSalva = (idEvent) => partidasSalvas.some(ps => ps.idEvent === idEvent);

  const filtrarPartidas = () => {
    return partidas.filter((p) => {
      if (filtros.data && p.dateEvent !== filtros.data) return false;
      if (filtros.liga && p.strLeague !== filtros.liga) return false;
      if (filtros.time && !(p.strHomeTeam.toLowerCase().includes(filtros.time.toLowerCase()) || p.strAwayTeam.toLowerCase().includes(filtros.time.toLowerCase()))) return false;
      if (filtros.status && getStatusPartida(p) !== filtros.status) return false;
      return true;
    });
  };

  const partidasOrdenadas = filtrarPartidas().sort((a, b) => {
    const dataA = new Date(`${a.dateEvent}T${a.strTime || "00:00"}`);
    const dataB = new Date(`${b.dateEvent}T${b.strTime || "00:00"}`);
    return dataA - dataB;
  });

  const partidasAgrupadas = partidasOrdenadas.reduce((acc, partida) => {
    if (!acc[partida.dateEvent]) acc[partida.dateEvent] = [];
    acc[partida.dateEvent].push(partida);
    return acc;
  }, {});

  const formatarDataTitulo = (dataStr) => {
    const data = new Date(dataStr + 'T12:00:00Z');
    return new Intl.DateTimeFormat('pt-BR', { weekday: 'long', day: 'numeric', month: 'long' }).format(data);
  };

  const ligasUnicas = [...new Set(partidas.map((p) => p.strLeague))].sort();

  // --- RENDERIZAÇÃO ---

  return (
    <div className="partidas-container">
      <Popup
        isOpen={showPopup}
        onClose={() => setShowPopup(false)}
        onLoginRedirect={() => { setShowPopup(false); window.location.href = '/login'; }}
      />

      <div className="hero-section">
        <div className="hero-content">
          <h1>O Futuro do Futebol Feminino</h1>
          <p>Acompanhe todas as partidas, estatísticas e notícias do futebol feminino.<br />
          Celebramos o talento, a paixão e a força das mulheres no esporte.</p>
          <div className="hero-actions">
            <Link to="/salvo" className="icon-btn">
              <i className="fas fa-play-circle"></i> Ver meus jogos Salvos
            </Link>
            <a href="#" className="icon-btn" onClick={handleCalendarioClick}>
              <i className="fas fa-calendar-alt"></i> Calendário de jogos
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
            <select name="liga" value={filtros.liga} onChange={handleFiltroChange} className="filtro-select">
              <option value="">Todos os campeonatos</option>
              {ligasUnicas.map((liga) => (
                <option key={liga} value={liga}>{liga}</option>
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
            <select name="status" value={filtros.status} onChange={handleFiltroChange} className="filtro-select">
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
              <h3 className="data-titulo">{formatarDataTitulo(data)}</h3>
              {partidasAgrupadas[data].map((p) => (
                <PartidaCard
                  key={p.idEvent}
                  partida={p}
                  status={getStatusPartida(p)}
                  isSalvo={isPartidaSalva(p.idEvent)}
                  onSalvar={salvarPartida}
                  onRemover={removerPartida}
                  onVerDetalhes={() => console.log("Ver detalhes a ser implementado")} 
                  variant="partidas"
                />
              ))}
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