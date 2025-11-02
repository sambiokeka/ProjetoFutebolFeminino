import { useState, useEffect, useCallback } from "react";
import "../styles/Salvo.css";
import { traduzirNome } from '../utils/traduzir';
import PartidaCard from "../components/PartidaCard"; // Importa o componente reutilizável

function Salvo() {
  const [partidasSalvas, setPartidasSalvas] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState(null);
  const [abaAtiva, setAbaAtiva] = useState("proximas");
  const [notificacoesAtivas, setNotificacoesAtivas] = useState({});
  
  const [usuario] = useState(localStorage.getItem('username') || '');

  const carregarPartidasSalvas = useCallback(() => {
    if (!usuario) {
      setErro("Utilizador não está logado");
      setCarregando(false);
      return;
    }
    setCarregando(true);
    fetch(`http://localhost:5000/partidas/salvas/${usuario}`)
      .then((res) => {
        if (!res.ok) throw new Error('Falha na resposta da rede');
        return res.json();
      })
      .then((data) => {
        const partidasTraduzidas = data.map(partida => ({
          ...partida,
          strHomeTeam: traduzirNome(partida.strHomeTeam),
          strAwayTeam: traduzirNome(partida.strAwayTeam),
          strLeague: traduzirNome(partida.strLeague)
        }));
        setPartidasSalvas(partidasTraduzidas);
        
        const notificacoesIniciais = {};
        partidasTraduzidas.forEach(partida => {
          notificacoesIniciais[partida.idEvent] = !!partida.notificacao_ativa;
        });
        setNotificacoesAtivas(notificacoesIniciais);
        setCarregando(false);
      })
      .catch((err) => {
        console.error("Erro ao carregar partidas salvas:", err);
        setErro("Não foi possível carregar as partidas salvas.");
        setCarregando(false);
      });
  }, [usuario]);

  useEffect(() => {
    carregarPartidasSalvas();
  }, [carregarPartidasSalvas]); 

  // A função getStatusPartida continua aqui, pois é usada para filtrar as abas.
  const getStatusPartida = useCallback((partida) => {
    if (partida.status_calculado) {
      const statusMap = { 'proximas': 'proxima', 'ao_vivo': 'ao-vivo', 'finalizadas': 'finalizada' };
      return statusMap[partida.status_calculado];
    }
    // Lógica de fallback se o status do backend não estiver disponível
    const agora = new Date();
    if (!partida.dateEvent || !partida.strTime) return "proxima";
    try {
        const [hours, minutes] = partida.strTime.split(':');
        let horasBrasil = parseInt(hours) - 3;
        if (horasBrasil < 0) horasBrasil += 24;
        const horaBrasil = `${horasBrasil.toString().padStart(2, '0')}:${minutes}`;
        const dataPartida = new Date(`${partida.dateEvent}T${horaBrasil}:00`);
        const dataFimPartida = new Date(dataPartida.getTime() + (120 * 60 * 1000));
        if (agora > dataFimPartida) return "finalizada";
        if (agora >= dataPartida) return "ao-vivo";
        return "proxima";
    } catch {
        return "proxima";
    }
  }, []);

  const toggleNotificacao = async (idEvent, notificacaoAtual) => {
    try {
      const novaNotificacao = !notificacaoAtual;
      const response = await fetch("http://localhost:5000/partidas/salvas/notificacao", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ idEvent, idUsuario: usuario, notificacaoAtiva: novaNotificacao }),
      });
      const result = await response.json();
      if (result.success) {
        setNotificacoesAtivas(prev => ({ ...prev, [idEvent]: novaNotificacao }));
      } else {
        alert(result.error || "Erro ao atualizar notificação");
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
        alert("Partida removida!");
        carregarPartidasSalvas(); 
      } else {
        alert(result.error || "Erro ao remover partida");
      }
    } catch (error) {
      console.error("Erro:", error);
    }
  };

  const partidasFiltradas = partidasSalvas.filter((partida) => {
    const status = getStatusPartida(partida);
    if (abaAtiva === "proximas") return status === "proxima" || status === "ao-vivo";
    if (abaAtiva === "finalizadas") return status === "finalizada";
    return false;
  });

  const proximasCount = partidasSalvas.filter((p) => ["proxima", "ao-vivo"].includes(getStatusPartida(p))).length;
  const finalizadasCount = partidasSalvas.filter((p) => getStatusPartida(p) === "finalizada").length;

  if (carregando) {
    return (
      <div className="salvo-container">
        <div className="loading">
          <div className="spinner"></div>
          <p>A carregar partidas salvas...</p>
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
      <div className="salvo-header">
        <h1>Partidas Salvas</h1>
        <p>Gira as tuas partidas favoritas</p>
      </div>

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
          partidasFiltradas.map((partida) => (
            <PartidaCard
              key={partida.idEvent}
              partida={partida}
              status={getStatusPartida(partida)}
              variant="salvo" 
              notificacaoAtiva={notificacoesAtivas[partida.idEvent]}
              onToggleNotificacao={toggleNotificacao}
              onRemover={removerPartida}
            />
          ))
        )}
      </div>
    </div>
  );
}

export default Salvo;