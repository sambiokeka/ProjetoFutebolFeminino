import React, { useState } from 'react';
import '../styles/Header.css';
import bolaIcon from '../assets/bola-icon.png';

const Header = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  return (
    <header className="site-header">
      <nav className="navbar navbar-expand-lg navbar-white bg-white">
        <div className="container">
          <a className="navbar-brand" href="#">
            <div className="logo-container">
              <img src={bolaIcon} alt="Ícone Bola" className="logo-icon" />
              <h1 className="logo-text">passa a bola</h1>
            </div>
          </a>
          
          <button 
            className={`navbar-toggler ${menuOpen ? 'active' : ''}`}
            type="button"
            onClick={toggleMenu}
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>

          <div className={`collapse navbar-collapse ${menuOpen ? 'show' : ''}`}>
            <ul className="navbar-nav ms-auto">
              <li className="nav-item">
                <a className="nav-link" href="/Partidas" onClick={() => setMenuOpen(false)}>Início</a>
              </li>
              <li className="nav-item">
                <a className="nav-link" href="#meusjogos" onClick={() => setMenuOpen(false)}>Meus jogos</a>
              </li>
              <li className="nav-item">
                <a className="nav-link" href="/" onClick={() => setMenuOpen(false)}>Entrar</a>
              </li>
            </ul>
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Header;