import React from 'react';
import { useNavigate } from 'react-router-dom'; // 👈 Importa o hook de navegação
import 'bootstrap/dist/css/bootstrap.min.css';
import '../styles/RegisterForm.css';
import googleIcon from '../assets/google-icon.png';
import facebookIcon from '../assets/facebook-icon.png';

export default function RegisterForm() {
  const navigate = useNavigate(); // 👈 Inicializa o hook

  const handleSubmit = (e) => {
    e.preventDefault();

    // Aqui você pode colocar sua lógica de validação/envio para backend
    // Ex: enviar os dados para a API, validar senhas etc.

    // Redireciona para a Home
    navigate('/');
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
                      />
                    </div>
                    
                    <div className="col-12 mb-3">
                      <label htmlFor="email" className="form-label">Email</label>
                      <input 
                        type="email" 
                        className="form-control" 
                        id="email" 
                        required
                      />
                    </div>
                    
                    <div className="col-12 col-md-6 mb-3">
                      <label htmlFor="password" className="form-label">Senha</label>
                      <input 
                        type="password" 
                        className="form-control" 
                        id="password" 
                        required
                      />
                    </div>
                    
                    <div className="col-12 col-md-6 mb-4">
                      <label htmlFor="confirmPassword" className="form-label">Confirmar senha</label>
                      <input 
                        type="password" 
                        className="form-control" 
                        id="confirmPassword" 
                        required
                      />
                    </div>
                  </div>
                  
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
                  Já tem uma conta? <a href="#login" className="text-decoration-none">Entrar</a>
                </p>
              </div>
            </article>
          </div>
        </div>
      </section>
    </main>
  );
}
