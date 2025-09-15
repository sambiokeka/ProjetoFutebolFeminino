import React, { useState } from 'react';
import '../styles/Header.css';
import { useAuth } from './AuthContext';
import bolaIcon from '../assets/bola-icon.png';

const Header = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  const { username, logout } = useAuth();
  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  const toggleProfile = () => {
    setProfileOpen(!profileOpen);
  };

  const handleLogout = () => {
    logout(); 
    setProfileOpen(false);
    window.location.href = '/';
  };

  return (
    <header className="site-header">
      <nav className="navbar navbar-expand-lg navbar-white bg-white">
        <div className="container">
          <a className="navbar-brand" href="/Partidas">
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
                <a className="nav-link" href="/Salvo" onClick={() => setMenuOpen(false)}>Meus jogos</a>
              </li>
              
              {username ? (
                <li className="nav-item dropdown">
                  <button 
                    className="nav-link btn btn-link" 
                    onClick={toggleProfile}
                  >
                    {username}
                  </button>
                  {profileOpen && (
                    <ul className="dropdown-menu show" style={{ position: "absolute" }}>
                      <li>
                        <button className="dropdown-item" onClick={handleLogout}>Sair</button>
                      </li>
                    </ul>
                  )}
                </li>
              ) : (
                <li className="nav-item">
                  <a className="nav-link" href="/Login" onClick={() => setMenuOpen(false)}>Entrar</a>
                </li>
              )}
            </ul>
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Header;