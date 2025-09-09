import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../styles/Login.css';
import googleIcon from '../assets/google-icon.png';
import facebookIcon from '../assets/facebook-icon.png';

export default function Login() {
  const navigate = useNavigate();
  const [keepConnected, setKeepConnected] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Lógica de autenticação aqui
    
    if (keepConnected) {
      localStorage.setItem('keepConnected', 'true');
    }
    
    navigate('/');
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
                      <label htmlFor="email" className="form-label">Email</label>
                      <input 
                        type="email" 
                        className="form-control" 
                        id="email" 
                        required
                      />
                    </div>
                    
                    <div className="col-12 mb-3">
                      <label htmlFor="password" className="form-label">Senha</label>
                      <input 
                        type="password" 
                        className="form-control" 
                        id="password" 
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