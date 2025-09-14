import { useState, useEffect, useCallback } from "react";
import "../styles/Salvo.css";
import { traduzirNome } from '../utils/traduzir';
import { getEscudoTime } from '../utils/escudos';

function Salvo() {
  const [partidasSalvas, setPartidasSalvas] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState(null);
  const [mostrarModalExclusao, setMostrarModalExclusao] = useState(false);
  const [abaAtiva, setAbaAtiva] = useState("proximas");
  const [notificacoesAtivas, setNotificacoesAtivas] = useState({});
  
  const [usuario] = useState(localStorage.getItem('username') || '');

  const carregarPartidasSalvas = () => {
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
        const partidasTraduzidas = data.map(partida => ({
          ...partida,
          strHomeTeam: traduzirNome(partida.strHomeTeam),
          strAwayTeam: traduzirNome(partida.strAwayTeam),
          strLeague: traduzirNome(partida.strLeague)
        }));
        setPartidasSalvas(partidasTraduzidas);
        
        // Inicializar estado de notificações
        const notificacoesIniciais = {};
        partidasTraduzidas.forEach(partida => {
          notificacoesIniciais[partida.idEvent] = partida.notificacao_ativa || false;
        });
        setNotificacoesAtivas(notificacoesIniciais);
        
        setCarregando(false);
      })
      .catch((err) => {
        console.error("Erro ao carregar partidas salvas:", err);
        setErro("Erro ao carregar partidas salvas: " + err.message);
        setCarregando(false);
      });
  };

  useEffect(() => {
    if (usuario) {
      carregarPartidasSalvas();
    } else {
      setErro("Usuário não está logado");
      setCarregando(false);
    }
  }, [usuario]); 

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

  const ajustarDataBrasil = (dataString) => {
    if (!dataString) return new Date();
    
    // Cria a data no UTC
    const dataUTC = new Date(dataString + 'T12:00:00Z');
    
    // Ajusta para o fuso horário do Brasil (-3 horas)
    const dataBrasil = new Date(dataUTC.getTime());
    
    return dataBrasil;
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

    const homeScore = partida.intHomeScore !== null && partida.intHomeScore !== undefined 
      ? partida.intHomeScore 
      : (partida.homeScore !== null && partida.homeScore !== undefined 
        ? partida.homeScore 
        : null);
        
    const awayScore = partida.intAwayScore !== null && partida.intAwayScore !== undefined 
      ? partida.intAwayScore 
      : (partida.awayScore !== null && partida.awayScore !== undefined 
        ? partida.awayScore 
        : null);
    
    if (homeScore !== null && awayScore !== null) {
      return "finalizada";
    }
    
    if (!partida.dateEvent || !partida.strTime) {
      return "proxima";
    }
    
    try {
      const horaBrasil = ajustarHorarioBrasil(partida.strTime);
      
      // CORREÇÃO: Usar a data ajustada para o Brasil
      const dataAjustada = ajustarDataBrasil(partida.dateEvent);
      const dataFormatada = dataAjustada.toISOString().split('T')[0];
      
      const dataPartidaStr = `${dataFormatada}T${horaBrasil}`;
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

  const toggleNotificacao = async (idEvent, notificacaoAtual) => {
    if (!usuario) {
      alert("Usuário não está logado");
      return;
    }

    try {
      const novaNotificacao = !notificacaoAtual;
      
      const response = await fetch("http://localhost:5000/partidas/salvas/notificacao", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          idEvent: idEvent,
          idUsuario: usuario,
          notificacaoAtiva: novaNotificacao
        }),
      });
      
      const result = await response.json();
      
      if (result.success) {
        setNotificacoesAtivas(prev => ({
          ...prev,
          [idEvent]: novaNotificacao
        }));
        
      } else {
        alert(result.error || "Erro ao atualizar notificação");
      }
    } catch (error) {
      console.error("Erro:", error);
      alert("Erro ao conectar com o servidor");
    }
  };

  const removerPartida = async (idEvent) => {
    if (!usuario) {
      alert("Usuário não está logado");
      return;
    }

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

  const excluirConta = async () => {
    if (!usuario) {
      alert("Usuário não está logado");
      return;
    }

    if (!window.confirm("Tem certeza que deseja excluir sua conta? Esta ação não pode ser desfeita e todos os seus dados serão perdidos!")) {
      return;
    }

    try {
      const token = localStorage.getItem('token');
      
      const response = await fetch("http://localhost:5000/excluir-conta", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({
          username: usuario
        }),
      });
      
      const result = await response.json();
      
      if (result.success) {
        alert("Conta excluída com sucesso!");
        localStorage.removeItem('token');
        localStorage.removeItem('username');
        window.location.href = '/login';
      } else {
        alert(result.error || "Erro ao excluir conta");
      }
    } catch (error) {
      console.error("Erro:", error);
      alert("Erro ao conectar com o servidor");
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    window.location.href = '/login';
  };

  const formatarData = (dataString) => {
    if (!dataString) return "Data não disponível";
    
    // Usa a mesma lógica de ajuste de fuso horário
    const dataAjustada = ajustarDataBrasil(dataString);
    
    return dataAjustada.toLocaleDateString("pt-BR", { 
      weekday: 'short', 
      day: '2-digit', 
      month: '2-digit'
    });
  };

  const formatarDataCriacao = (dataCriacao) => {
    if (!dataCriacao) return "Data não disponível";
    
    try {
      // Tenta parsear a data no formato do banco (provavelmente ISO string)
      const data = new Date(dataCriacao);
      
      // Verifica se a data é válida
      if (isNaN(data.getTime())) {
        return "Data não disponível";
      }
      
      // Formata apenas a data (dia/mês) sem o dia da semana
      return data.toLocaleDateString("pt-BR", { 
        day: '2-digit', 
        month: '2-digit'
      });
    } catch (error) {
      console.error("Erro ao formatar data de criação:", error, dataCriacao);
      return "Data não disponível";
    }
  };

  const partidasFiltradas = partidasSalvas.filter((partida) => {
    const status = getStatusPartida(partida);
    return abaAtiva === "proximas" ? status === "proxima" : status === "finalizada";
  });

  const proximasCount = partidasSalvas.filter((p) => getStatusPartida(p) === "proxima").length;
  const finalizadasCount = partidasSalvas.filter((p) => getStatusPartida(p) === "finalizada").length;

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
      {/* Header */}
      <div className="salvo-header">
        <h1>Partidas Salvas</h1>
        <p>Gerencie suas partidas favoritas</p>
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
            const status = getStatusPartida(partida);
            const isProxima = status === "proxima";
            const isFinalizada = status === "finalizada";
            
            const homeScore = partida.intHomeScore !== null && partida.intHomeScore !== undefined 
              ? partida.intHomeScore 
              : (partida.homeScore !== null && partida.homeScore !== undefined 
                ? partida.homeScore 
                : null);
                
            const awayScore = partida.intAwayScore !== null && partida.intAwayScore !== undefined 
              ? partida.intAwayScore 
              : (partida.awayScore !== null && partida.awayScore !== undefined 
                ? partida.awayScore 
                : null);
                
            const placarDisponivel = homeScore !== null && awayScore !== null;
            const notificacaoAtiva = notificacoesAtivas[partida.idEvent] || false;
            
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
                        src={getEscudoTime(partida.strHomeTeam)} 
                        alt={partida.strHomeTeam}
                        className="escudo-time"
                        onError={(e) => {
                          e.target.style.display = 'none';
                          e.target.nextSibling.style.display = 'flex';
                        }}
                      />
                      <div className="escudo-placeholder" style={{display: 'none'}}>
                        <i className="fas fa-shield-alt"></i>
                      </div>
                    </div>
                    <span className="time-nome">{partida.strHomeTeam}</span>
                  </div>

                  <div className="partida-info">
                    {isProxima ? (
                      <>
                        <span className="hora">{ajustarHorarioBrasil(partida.strTime)}</span>
                        <span className="data">{formatarData(partida.dateEvent)}</span>
                      </>
                    ) : (
                      <>
                        <div className="placar">
                          <span>{placarDisponivel ? homeScore : "-"}</span>
                          <span className="divisor">×</span>
                          <span>{placarDisponivel ? awayScore : "-"}</span>
                        </div>
                        <span className="data">{formatarData(partida.dateEvent)}</span>
                      </>
                    )}
                  </div>
                  
                  <div className="time time-visitante">
                    <div className="time-logo">
                      <img
                        src={getEscudoTime(partida.strAwayTeam)} 
                        alt={partida.strAwayTeam}
                        className="escudo-time"
                        onError={(e) => {
                          e.target.style.display = 'none';
                          e.target.nextSibling.style.display = 'flex';
                        }}
                      />
                      <div className="escudo-placeholder" style={{display: 'none'}}>
                        <i className="fas fa-shield-alt"></i>
                      </div>
                    </div>
                    <span className="time-nome">{partida.strAwayTeam}</span>
                  </div>
                </div>

                <div className="partida-actions">
                  <button 
                    className={`btn-notificar ${notificacaoAtiva ? 'ativo' : ''}`}
                    onClick={() => toggleNotificacao(partida.idEvent, notificacaoAtiva)}
                    title={notificacaoAtiva ? "Desativar notificações" : "Ativar notificações"}
                  >
                    <i className={`fas ${notificacaoAtiva ? 'fa-bell' : 'fa-bell-slash'}`}></i>
                    <span>{notificacaoAtiva ? 'Notificar' : 'Notificar'}</span>
                  </button>
                  
                  <button 
                    className="btn-remover"
                    onClick={() => removerPartida(partida.idEvent)}
                    title="Remover partida"
                  >
                    <i className="fas fa-trash"></i>
                    <span>Remover</span>
                  </button>
                </div>

                <div className="partida-footer">
                  <span>Salvo em {partida.data_criacao ? formatarDataCriacao(partida.data_criacao) : "Data não disponível"}</span>
                </div>
              </div>
            );
          })
        )}
      </div>

      <div className="acoes-container">
        <button className="btn-logout" onClick={logout}>
          Sair
        </button>
        <button 
          className="btn-excluir-conta"
          onClick={() => setMostrarModalExclusao(true)}
        >
          Excluir Minha Conta
        </button>
      </div>

      {mostrarModalExclusao && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>Excluir Conta</h3>
            <p>Tem certeza que deseja excluir sua conta?</p>
            <p className="warning-text">
              Esta ação não pode ser desfeita! Todas as suas partidas salvas serão perdidas.
            </p>
            <div className="modal-actions">
              <button 
                className="btn-cancelar"
                onClick={() => setMostrarModalExclusao(false)}
              >
                Cancelar
              </button>
              <button 
                className="btn-confirmar-exclusao"
                onClick={excluirConta}
              >
                Sim, Excluir Conta
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Salvo;