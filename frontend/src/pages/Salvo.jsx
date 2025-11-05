import { useState, useEffect, useCallback } from "react";
import { traduzirNome } from '../utils/traduzir';
import PartidaCard from "../components/PartidaCard"; 

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

  const getStatusPartida = useCallback((partida) => {
    if (partida.status_calculado) {
      const statusMap = { 'proximas': 'proxima', 'ao_vivo': 'ao-vivo', 'finalizadas': 'finalizada' };
      return statusMap[partida.status_calculado];
    }

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
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-10 h-10 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg font-medium">A carregar partidas salvas...</p>
        </div>
      </div>
    );
  }

  if (erro) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl p-8 text-center shadow-lg max-w-md w-full">
          <h4 className="text-red-600 text-xl font-bold mb-4">Erro</h4>
          <p className="text-gray-600 mb-6">{erro}</p>
          <button 
            className="px-6 py-3 bg-gradient-to-r from-purple-600 to-purple-700 text-white rounded-xl font-semibold hover:-translate-y-1 transition-all duration-300 shadow-lg"
            onClick={carregarPartidasSalvas}
          >
            Tentar Novamente
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-20 pb-8">
      <div className="max-w-6xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-8 py-8 border-b-2 border-gray-200">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-2">
            Partidas Salvas
          </h1>
          <p className="text-gray-600 text-lg font-medium">Gira as tuas partidas favoritas</p>
        </div>

        {/* Abas */}
        <div className="flex flex-col sm:flex-row justify-center items-center mb-8 border-b-2 border-gray-200 pb-2 gap-2">
          <button
            onClick={() => setAbaAtiva("proximas")}
            className={`px-6 py-3 font-semibold rounded-lg transition-all duration-300 w-full sm:w-auto text-center ${
              abaAtiva === "proximas" 
                ? "text-purple-600 bg-white border-2 border-purple-600 shadow-md" 
                : "text-gray-500 bg-gray-100 border-2 border-transparent hover:text-purple-500 hover:bg-gray-200"
            }`}
          >
            Próximas ({proximasCount})
          </button>
          <button
            onClick={() => setAbaAtiva("finalizadas")}
            className={`px-6 py-3 font-semibold rounded-lg transition-all duration-300 w-full sm:w-auto text-center ${
              abaAtiva === "finalizadas" 
                ? "text-purple-600 bg-white border-2 border-purple-600 shadow-md" 
                : "text-gray-500 bg-gray-100 border-2 border-transparent hover:text-purple-500 hover:bg-gray-200"
            }`}
          >
            Finalizadas ({finalizadasCount})
          </button>
        </div>

        {/* Lista de Partidas */}
        <div className="space-y-6">
          {partidasFiltradas.length === 0 ? (
            <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl p-12 text-center shadow-lg">
              <i className="fas fa-futbol text-6xl text-gray-300 mb-4"></i>
              <p className="text-gray-600 text-xl font-medium">
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
    </div>
  );
}

export default Salvo;