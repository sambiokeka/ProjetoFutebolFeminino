import React, { useState, useEffect } from "react";

function Salvo() {
  const [partidasSalvas, setPartidasSalvas] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState(null);
  const [mostrarModalExclusao, setMostrarModalExclusao] = useState(false);
  
  const [usuario] = useState(localStorage.getItem('username') || '');

  useEffect(() => {
    if (usuario) {
      carregarPartidasSalvas();
    } else {
      setErro("Usuário não está logado");
      setCarregando(false);
    }
  }, [usuario]);

  const carregarPartidasSalvas = () => {
    if (!usuario) {
      setErro("Usuário não está logado");
      setCarregando(false);
      return;
    }

    console.log("Carregando partidas salvas para:", usuario);
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
        // Limpa localStorage e redireciona para login
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
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h1>Partidas Salvas</h1>
        <div style={{ display: 'flex', gap: '10px' }}>
          <button 
            onClick={logout}
            style={{
              backgroundColor: '#666',
              color: 'white',
              border: 'none',
              padding: '8px 16px',
              borderRadius: '5px',
              cursor: 'pointer'
            }}
          >
            Sair
          </button>
          <button 
            onClick={() => setMostrarModalExclusao(true)}
            style={{
              backgroundColor: '#ff4444',
              color: 'white',
              border: 'none',
              padding: '8px 16px',
              borderRadius: '5px',
              cursor: 'pointer'
            }}
          >
            Excluir Minha Conta
          </button>
        </div>
      </div>

      <p>Usuário: <strong>{usuario}</strong></p>
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

      {/* Modal de Confirmação de Exclusão */}
      {mostrarModalExclusao && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.5)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 1000
        }}>
          <div style={{
            backgroundColor: 'white',
            padding: '20px',
            borderRadius: '10px',
            width: '400px',
            textAlign: 'center'
          }}>
            <h3>Excluir Conta</h3>
            <p>Tem certeza que deseja excluir sua conta?</p>
            <p style={{ color: 'red', fontWeight: 'bold' }}>
              Esta ação não pode ser desfeita! Todas as suas partidas salvas serão perdidas.
            </p>
            <div style={{ marginTop: '20px', display: 'flex', gap: '10px', justifyContent: 'center' }}>
              <button 
                onClick={() => setMostrarModalExclusao(false)}
                style={{
                  backgroundColor: '#666',
                  color: 'white',
                  border: 'none',
                  padding: '10px 20px',
                  borderRadius: '5px',
                  cursor: 'pointer'
                }}
              >
                Cancelar
              </button>
              <button 
                onClick={excluirConta}
                style={{
                  backgroundColor: '#ff4444',
                  color: 'white',
                  border: 'none',
                  padding: '10px 20px',
                  borderRadius: '5px',
                  cursor: 'pointer'
                }}
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