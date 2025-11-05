import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../components/AuthContext'; 
import '../styles/Register.css';
import googleIcon from '../assets/google-icon.png';
import facebookIcon from '../assets/facebook-icon.png';

export default function RegisterForm() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState(''); 
  const { login } = useAuth();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate(); 

const handleSubmit = async (e) => {
  e.preventDefault();

  if (password !== confirmPassword) {
    setError('As senhas não coincidem');
    return;
  }

  setError('');
  setSuccess('');

  try {
    {/* Aqui tem o fetch do registro de usuarios, aq ele registra usuarios, vai tomando */}
    const response = await fetch('http://localhost:5000/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
    });

    const data = await response.json();

    if (response.ok) {
      setSuccess(data.message);

      localStorage.setItem('token', data.token);
      localStorage.setItem('username', data.username);  
      login(data.username, data.token); 

      setUsername('');
      setPassword('');
      setConfirmPassword('');
      setEmail('');
      navigate('/partidas');
    } else {
      setError(data.message || 'Erro no registro');
    }
  } catch {
    setError('Erro ao conectar com o servidor');
  }
};

  return (
    <main className="register-main">
      <section className="register-section container">
        <div className="row justify-content-center">
          <div className="col-12 col-md-8 col-lg-6 col-xl-6">
            <article className="register-card card shadow">
              <header className="card-header text-center py-4">
                <h1 className="h2 mb-2">Criar Conta</h1>
                <p className="text-white opacity-90">Junte-se a nós hoje mesmo</p>
              </header>

              <div className="card-body p-4">
                <form className="register-form" onSubmit={handleSubmit}>
                  <div className="row">
                    <div className="col-12 mb-3">
                      <label htmlFor="username" className="form-label">Nome do usuário</label>
                      <input 
                        type="text" 
                        className="form-control" 
                        id="username" 
                        required
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                      />
                    </div>

                    <div className="col-12 mb-3">
                      <label htmlFor="email" className="form-label" >Email</label>
                      <input 
                        type="email" 
                        className="form-control" 
                        id="email" 
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                      />
                    </div>

                    <div className="col-12 col-md-6 mb-3">
                      <label htmlFor="password" className="form-label">Senha</label>
                      <input 
                        type="password" 
                        className="form-control" 
                        id="password" 
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                      />
                    </div>

                    <div className="col-12 col-md-6 mb-4">
                      <label htmlFor="confirmPassword" className="form-label">Confirmar senha</label>
                      <input 
                        type="password" 
                        className="form-control" 
                        id="confirmPassword" 
                        required
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                      />
                    </div>
                  </div>

                  {error && <div className="alert alert-danger">{error}</div>}
                  {success && <div className="alert alert-success">{success}</div>}

                  <button type="submit" className="btn btn-primary w-100 mb-4 py-2">
                    Criar Conta
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
                <p className="mb-0">
                  Já tem uma conta? <a href="/login" className="text-decoration-none">Entrar</a>
                </p>
              </div>
            </article>
          </div>
        </div>
      </section>
    </main>
  );
}