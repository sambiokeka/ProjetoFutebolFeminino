import React from 'react';
import '../styles/Footer.css';
import bolaIcon from '../assets/bola-icon.png';

const Footer = () => {
  return (
    <footer className="site-footer">
      <div className="container">
        
        <div className="footer-main">
          <div className="row">
            

            <div className="col-md-5">
              <div className="footer-logo-container">
                <img src={bolaIcon} alt="Ícone Bola" className="footer-logo-icon" />
                <h3 className="footer-logo">Match Point</h3>
              </div>
              <p className="footer-description">
                A plataforma completa para acompanhar o futebol feminino. 
                Valorizando o talento e a paixão das mulheres no esporte.
              </p>
            </div>


            <div className="col-md-3">
              <h5 className="footer-title">Páginas</h5>
              <ul className="footer-links">
                <li><a href="/Partidas">Inicio</a></li>
                <li><a href="/Salvo">Meus jogos</a></li>
                <li><a href="/Login">Entrar</a></li>
              </ul>
            </div>


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
                © 2025 Match Point. Todos os direitos reservados.
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