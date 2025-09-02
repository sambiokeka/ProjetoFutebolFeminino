import React from 'react';
import '../styles/Footer.css';

const Footer = () => {
  return (
    <footer className="site-footer">
      <div className="container">
        
        {/* Seção com 2 Colunas */}
        <div className="footer-main">
          <div className="row">
            
            {/* Coluna 1 - Passa a Bola */}
            <div className="col-md-6">
              <h3 className="footer-logo">passa a bola</h3>
              <p className="footer-description">
                A plataforma completa para acompanhar o futebol feminino. 
                Valorizando o talento e a paixão das mulheres no esporte.
              </p>
            </div>

            {/* Coluna 2 - Sobre Nós */}
            <div className="col-md-6">
              <h5 className="footer-title">MAIS</h5>
              <ul className="footer-links">
                <li><a href="#sobre">Sobre Nós</a></li>
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