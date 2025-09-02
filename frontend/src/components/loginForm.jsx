import React, { useState } from 'react';

export default function LoginForm() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    try {
      const response = await fetch('http://localhost:5000/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include', // para manter sessão com Flask
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (response.ok) {
        setSuccess('Login efetuado com sucesso!');
        // aqui você pode redirecionar, salvar estado, etc
      } else {
        setError(data.message || 'Erro no login');
      }
    } catch (err) {
      setError('Erro ao conectar com o servidor');
    }
  };

  return (
    <main className="login-main">
      <section className="login-section container">
        <div className="row justify-content-center">
          <div className="col-12 col-md-6 col-lg-4">
            <form onSubmit={handleSubmit}>
              <h2>Entrar</h2>

              <div className="mb-3">
                <label htmlFor="username" className="form-label">Nome do usuário</label>
                <input 
                  type="text" 
                  id="username" 
                  className="form-control" 
                  required 
                  value={username} 
                  onChange={(e) => setUsername(e.target.value)} 
                />
              </div>

              <div className="mb-3">
                <label htmlFor="password" className="form-label">Senha</label>
                <input 
                  type="password" 
                  id="password" 
                  className="form-control" 
                  required 
                  value={password} 
                  onChange={(e) => setPassword(e.target.value)} 
                />
              </div>

              {error && <div className="alert alert-danger">{error}</div>}
              {success && <div className="alert alert-success">{success}</div>}

              <button type="submit" className="btn btn-primary w-100">Entrar</button>
            </form>
          </div>
        </div>
      </section>
    </main>
  );
}
