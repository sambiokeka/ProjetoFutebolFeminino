import React from 'react';
import '../styles/Footer.css';
import bolaIcon from '../assets/bola-icon.png';

const Footer = () => {
  return (
    <footer className="site-footer">
      <div className="container">
        
        <div className="footer-main">
          <div className="row">
            
            {/* Coluna 1 - Passa a Bola (6 colunas) */}
            <div className="col-md-5">
              <div className="footer-logo-container">
                <img src={bolaIcon} alt="Ícone Bola" className="footer-logo-icon" />
                <h3 className="footer-logo">passa a bola</h3>
              </div>
              <p className="footer-description">
                A plataforma completa para acompanhar o futebol feminino. 
                Valorizando o talento e a paixão das mulheres no esporte.
              </p>
            </div>

            {/* Coluna 2 - Páginas (3.5 colunas) */}
            <div className="col-md-3">
              <h5 className="footer-title">Páginas</h5>
              <ul className="footer-links">
                <li><a href="#home">Home</a></li>
                <li><a href="#calendario">Calendário</a></li>
                <li><a href="#estatisticas">Estatísticas</a></li>
              </ul>
            </div>

            {/* Coluna 3 - Mais (3.5 colunas) */}
            <div className="col-md-3">
              <h5 className="footer-title">Mais</h5>
              <ul className="footer-links">
                <li><a href="#sobre">Sobre Nós</a></li>
                <li><a href="#contato">Contato</a></li>
                <li><a href="#duvidas">Dúvidas</a></li>
              </ul>
            </div>

          </div>
        </div>

        <hr className="footer-divider" />

        <div className="footer-bottom">
          <div className="row">
            <div className="col-12">
              <p className="copyright">
                © 2025 Passa a Bola. Todos os direitos reservados.
              </p>
              <div className="legal-links">
                <a href="#privacidade">Política de Privacidade</a>
                <span className="link-separator">|</span>
                <a href="#termos">Termos de Uso</a>
              </div>
            </div>
          </div>
        </div>

      </div>
    </footer>
  );
};

export default Footer;