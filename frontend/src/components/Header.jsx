import React from 'react';
import '../styles/Header.css';
import bolaIcon from '../assets/bola-icon.png';

const Header = () => {
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
          
          <button className="navbar-toggler" type="button">
            <span className="navbar-toggler-icon"></span>
          </button>


          <div className="collapse navbar-collapse">
            <ul className="navbar-nav ms-auto">
              <li className="nav-item">
                <a className="nav-link" href="#inicio">Início</a>
              </li>
              <li className="nav-item">
                <a className="nav-link" href="#meusjogos">Meus jogos</a>
              </li>
              <li className="nav-item">
                <a className="nav-link" href="#entrar">Entrar</a>
              </li>
            </ul>
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Header;