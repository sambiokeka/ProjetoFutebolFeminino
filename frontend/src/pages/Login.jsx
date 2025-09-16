import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useAuth } from '../components/AuthContext';
import '../styles/Login.css';
import googleIcon from '../assets/google-icon.png';
import facebookIcon from '../assets/facebook-icon.png';

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth(); 
  const [keepConnected, setKeepConnected] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

const handleSubmit = async (e) => {
  e.preventDefault();

  try {
    {/* Aqui tem o fetch de login, ele envia os dados pro /login e se os dados baterem o usuario entra */}
    const response = await fetch('http://${BACKEND_HOST}:${BACKEND_PORT}login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
    });

    if (!response.ok) throw new Error('Login falhou');

    const data = await response.json();

    localStorage.setItem('token', data.token);
    localStorage.setItem('username', data.username);  

    login(data.username, data.token);

    if (keepConnected) {
      localStorage.setItem('keepConnected', 'true');
    }

    navigate('/partidas');
  } catch (error) {
    console.error('Erro ao logar:', error);
    alert('Falha ao logar. Verifique usuário e senha.');
  }
};

  return (
    <main className="login-main">
      <section className="login-section container">
        <div className="row justify-content-center">
          <div className="col-12 col-md-8 col-lg-6 col-xl-6">
            <article className="login-card card shadow">
              <header className="card-header text-center py-4">
                <h1 className="h2 mb-2">Login</h1>
                <p className="text-white opacity-90">Entre na sua conta já cadastrada</p>
              </header>

              <div className="card-body p-4 pt-3">
                <form className="login-form" onSubmit={handleSubmit}>
                  <div className="row">
                    <div className="col-12 mb-3 mt-2">
                      <label htmlFor="username" className="form-label">Usuário</label>
                      <input
                        type="text"
                        className="form-control"
                        id="username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                      />
                    </div>

                    <div className="col-12 mb-3">
                      <label htmlFor="password" className="form-label">Senha</label>
                      <input
                        type="password"
                        className="form-control"
                        id="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                      />
                    </div>

                    <div className="col-12 mb-4">
                      <div className="form-check">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          id="keepConnected"
                          checked={keepConnected}
                          onChange={(e) => setKeepConnected(e.target.checked)}
                        />
                        <label className="form-check-label text-white" htmlFor="keepConnected">
                          Mantenha-me conectado
                        </label>
                      </div>
                    </div>
                  </div>

                  <button type="submit" className="btn btn-primary w-100 mb-4 py-2">
                    Entrar
                  </button>

                  <div className="divider mb-4">
                    <span className="divider-text">Ou</span>
                  </div>

                  <div className="social-buttons">
                    <button type="button" className="btn btn-outline-secondary w-100 mb-3">
                      <img src={googleIcon} alt="Google" className="social-icon" />
                      Continuar com Google
                    </button>

                    <button type="button" className="btn btn-outline-primary w-100">
                      <img src={facebookIcon} alt="Facebook" className="social-icon" />
                      Continuar com Facebook
                    </button>
                  </div>
                </form>
              </div>

              <div className="card-footer text-center py-3">
                <p className="mb-0 text-white">
                  Não possui uma conta? <a href="/register" className="text-decoration-none login-link">Criar conta</a>
                </p>
              </div>
            </article>
          </div>
        </div>
      </section>
    </main>
  );
}