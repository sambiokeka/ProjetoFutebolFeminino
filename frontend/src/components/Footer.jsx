import React from 'react';
import '../styles/Footer.css';

const Footer = () => {
  return (
    <footer className="site-footer">
      <div className="container">
        
        {/* Seção Superior - Passa a Bola */}
        <div className="footer-top">
          <div className="row">
            <div className="col-lg-6">
              <h3 className="footer-logo">passa a bela</h3>
              <p className="footer-description">
                A plataforma completa para acompanhar o futebol feminino. 
                Valorizando o talento e a paixão das mulheres no esporte.
              </p>
            </div>
          </div>
        </div>

        {/* Divisor */}
        <hr className="footer-divider" />

        {/* Seção de Links - 2 Colunas */}
        <div className="footer-middle">
          <div className="row">
            
            {/* Coluna Partidas */}
            <div className="col-md-6">
              <h5 className="footer-title">Partidas</h5>
              <ul className="footer-links">
                <li><a href="#todas">Todas as partidas</a></li>
                <li><a href="#calendario">Calendário</a></li>
                <li><a href="#estatisticas">Estatísticas</a></li>
              </ul>
            </div>

            {/* Coluna Sobre */}
            <div className="col-md-6">
              <h5 className="footer-title">Sobre Nós</h5>
              <ul className="footer-links">
                <li><a href="#sobre">Sobre</a></li>
                <li><a href="#contato">Contato</a></li>
                <li><a href="#duvidas">Dúvidas</a></li>
              </ul>
            </div>

          </div>
        </div>

        {/* Divisor */}
        <hr className="footer-divider" />

        {/* Rodapé Inferior */}
        <div className="footer-bottom">
          <div className="row">
            <div className="col-12">
              <p className="copyright">
                © 2025 Passa a Bela. Todos os direitos reservados.
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