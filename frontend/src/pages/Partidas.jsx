import { useState, useEffect, useCallback, useRef } from "react";
import { Link } from 'react-router-dom';
import { traduzirNome } from '../utils/traduzir';
import Popup from '../components/Popup';
import VerMaisPopup from '../components/detalhes/VerMaisPopup';
import PartidaCard from "../components/PartidaCard";
import heroBackground from '../assets/background.jpg';

export default function Partidas() {
  const [partidas, setPartidas] = useState([]);
  const [partidasSalvas, setPartidasSalvas] = useState([]);
  const [filtros, setFiltros] = useState({ data: "", liga: "", time: "", status: "" });

  const [showPopup, setShowPopup] = useState(false);
  const [partidaParaSalvar, setPartidaParaSalvar] = useState(null);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalData, setModalData] = useState(null);

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


  const verDetalhes = (partida) => {
    const { idAPIfootball } = partida;
    const urlLineups = `https://v3.football.api-sports.io/fixtures/lineups?fixture=${idAPIfootball}`;
    const urlEvents = `https://v3.football.api-sports.io/fixtures/events?fixture=${idAPIfootball}`;
    const headers = {
        "x-rapidapi-host": "v3.football.api-sports.io",
        "x-rapidapi-key": import.meta.env.VITE_API_KEY
    };
    const promiseLineups = fetch(urlLineups, { method: "GET", headers }).then(res => res.json());
    const promiseEvents = fetch(urlEvents, { method: "GET", headers }).then(res => res.json());

    Promise.all([promiseLineups, promiseEvents])
        .then(([dataLineups, dataEvents]) => {
            const dadosCombinados = { lineups: dataLineups, events: dataEvents };
            setModalData(dadosCombinados);
            setIsModalOpen(true);
        })
        .catch(err => {
            console.error("Erro ao buscar detalhes da partida:", err);
            alert("Não foi possível carregar os detalhes da partida.");
        });
  };

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
      if (agora > dataFimPartida) return "finalizada";
      if (agora >= dataPartida) return "ao-vivo";
      return "proxima";
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
    <div className="!max-w-6xl !mx-auto !px-4 !py-4 !font-sans">
      <Popup
        isOpen={showPopup}
        onClose={() => setShowPopup(false)}
        onLoginRedirect={() => { setShowPopup(false); window.location.href = '/login'; }}
      />
      
      <VerMaisPopup
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        data={modalData}
      />

      {/* Hero Section */}
      <div 
        className="!w-screen !relative !left-1/2 !right-1/2 !-ml-[50vw] !-mr-[50vw] !min-h-[80vh] !py-24 !px-8 !bg-cover !bg-center !text-white !text-center !mb-12 !-mt-8 !flex !items-center !justify-center !flex-col"
        style={{ backgroundImage: `url(${heroBackground})` }}
      >
        <div className="!max-w-6xl !mx-auto">
          <h1 className="!text-5xl !font-extrabold !mb-6 !leading-tight">
            O Futuro do Futebol Feminino
          </h1>
          <p className="!text-xl !mb-10 !opacity-95 !leading-relaxed">
            Acompanhe todas as partidas, estatísticas e notícias do futebol feminino.<br />
            Celebramos o talento, a paixão e a força das mulheres no esporte.
          </p>
          <div className="!flex !gap-6 !justify-center !flex-wrap">
            <Link 
              to="/salvo" 
              className="!flex !items-center !justify-center !gap-3 !px-8 !py-5 !bg-white/20 !border-2 !border-white/40 !rounded-full !cursor-pointer !transition-all !duration-300 !backdrop-blur-md !text-white !text-lg !font-semibold !min-w-[220px] hover:!bg-white/30 hover:!-translate-y-1 hover:!shadow-xl"
            >
              <i className="fas fa-play-circle !text-xl !w-6 !text-center"></i>
              Ver meus jogos Salvos
            </Link>
            <a 
              href="#" 
              className="!flex !items-center !justify-center !gap-3 !px-8 !py-5 !bg-white/20 !border-2 !border-white/40 !rounded-full !cursor-pointer !transition-all !duration-300 !backdrop-blur-md !text-white !text-lg !font-semibold !min-w-[220px] hover:!bg-white/30 hover:!-translate-y-1 hover:!shadow-xl"
              onClick={handleCalendarioClick}
            >
              <i className="fas fa-calendar-alt !text-xl !w-6 !text-center"></i>
              Calendário de jogos
            </a>
          </div>
        </div>
      </div>

      {/* Filtros Section */}
      <div ref={partidasSectionRef} className="!bg-gradient-to-br !from-gray-50 !to-gray-100 !rounded-2xl !p-6 !mb-6 !shadow-lg !border !border-white !border-opacity-50">
        <h2 className="!text-purple-700 !text-2xl !font-bold !mb-2 !text-center">
          Todas as partidas
        </h2>
        <p className="!text-gray-600 !text-center !mb-6">
          Acompanhe os jogos mais importantes de futebol feminino
        </p>
        
        <div className="!grid !grid-cols-1 md:!grid-cols-2 lg:!grid-cols-4 !gap-4">
          <div className="!flex !flex-col">
            <label className="!text-sm !font-semibold !text-gray-700 !mb-2">Data</label>
            <input
              type="date"
              name="data"
              value={filtros.data}
              onChange={handleFiltroChange}
              className="!w-full !px-4 !py-3 !text-sm !rounded-xl !border-2 !border-gray-300 !bg-white !text-gray-800 !shadow-sm !transition-all !duration-300 focus:!border-purple-600 focus:!outline-none focus:!ring-4 focus:!ring-purple-100"
            />
          </div>
          
          <div className="!flex !flex-col">
            <label className="!text-sm !font-semibold !text-gray-700 !mb-2">Liga/Campeonato</label>
            <div className="!relative">
              <select 
                name="liga" 
                value={filtros.liga} 
                onChange={handleFiltroChange}
                className="!w-full !px-4 !py-3 !text-sm !rounded-xl !border-2 !border-gray-300 !bg-white !text-gray-800 !shadow-sm !transition-all !duration-300 focus:!border-purple-600 focus:!outline-none focus:!ring-4 focus:!ring-purple-100 !appearance-none !pr-10"
              >
                <option value="">Todos os campeonatos</option>
                {ligasUnicas.map((liga) => (
                  <option key={liga} value={liga}>{liga}</option>
                ))}
              </select>
              <div className="!pointer-events-none !absolute !inset-y-0 !right-0 !flex !items-center !px-2 !text-gray-700">
                <i className="fas fa-chevron-down !text-sm"></i>
              </div>
            </div>
          </div>
          
          <div className="!flex !flex-col">
            <label className="!text-sm !font-semibold !text-gray-700 !mb-2">Time</label>
            <input
              type="text"
              name="time"
              placeholder="Nome do time"
              value={filtros.time}
              onChange={handleFiltroChange}
              className="!w-full !px-4 !py-3 !text-sm !rounded-xl !border-2 !border-gray-200 !bg-white !text-gray-800 !shadow-sm !transition-all !duration-300 focus:!border-purple-600 focus:!outline-none focus:!ring-4 focus:!ring-purple-100 placeholder:!text-gray-500"
            />
          </div>
          
          <div className="!flex !flex-col">
            <label className="!text-sm !font-semibold !text-gray-700 !mb-2">Status</label>
            <div className="!relative">
              <select 
                name="status" 
                value={filtros.status} 
                onChange={handleFiltroChange}
                className="!w-full !px-4 !py-3 !text-sm !rounded-xl !border-2 !border-gray-300 !bg-white !text-gray-800 !shadow-sm !transition-all !duration-300 focus:!border-purple-600 focus:!outline-none focus:!ring-4 focus:!ring-purple-100 !appearance-none !pr-10"
              >
                <option value="">Todos</option>
                <option value="proxima">Próximas</option>
                <option value="ao-vivo">Ao Vivo</option>
                <option value="finalizada">Finalizadas</option>
              </select>
              <div className="!pointer-events-none !absolute !inset-y-0 !right-0 !flex !items-center !px-2 !text-gray-700">
                <i className="fas fa-chevron-down !text-sm"></i>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Partidas Content */}
      <div className="!py-2">
        {Object.keys(partidasAgrupadas).length > 0 ? (
          Object.keys(partidasAgrupadas).map((data) => (
            <div key={data} className="!mb-8">
              <h3 className="!bg-gradient-to-r !from-pink-600 !to-purple-600 !text-white !py-4 !px-6 !rounded-2xl !font-bold !text-xl !text-center !mb-6 !shadow-lg !capitalize">
                {formatarDataTitulo(data)}
              </h3>
              {partidasAgrupadas[data].map((p) => (
                <PartidaCard
                  key={p.idEvent}
                  partida={p}
                  status={getStatusPartida(p)}
                  isSalvo={isPartidaSalva(p.idEvent)}
                  onSalvar={salvarPartida}
                  onRemover={removerPartida}
                  onVerDetalhes={verDetalhes} 
                  variant="partidas"
                />
              ))}
            </div>
          ))
        ) : (
          <div className="!bg-gradient-to-br !from-gray-50 !to-gray-100 !rounded-2xl !py-12 !px-6 !text-center !my-6 !shadow-md">
            <i className="fas fa-futbol !text-5xl !text-gray-300 !opacity-70 !mb-4"></i>
            <p className="!text-lg !font-medium !text-gray-600">
              Nenhuma partida encontrada com os filtros selecionados
            </p>
          </div>
        )}
      </div>
    </div>
  );
}