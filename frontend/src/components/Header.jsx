import React, { useState } from 'react';
import bolaIcon from '../assets/bola-icon.png';

const Header = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  return (
    <header className="bg-white shadow-sm border-b border-gray-200 fixed top-0 w-full z-50">
      <nav className="bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Container principal */}
          <div className="flex items-center justify-between h-16">
            {/* Logo - Lado esquerdo */}
            <div className="flex items-center">
              <a href="#" className="flex items-center gap-3 no-underline group">
                <img 
                  src={bolaIcon} 
                  alt="Ícone Bola" 
                  className="w-8 h-8 md:w-12 md:h-12 object-contain transition-transform duration-300 group-hover:scale-110" 
                />
                <h1 className="text-gray-900 font-pacifico text-3xl md:text-4xl transition-colors duration-300 group-hover:text-[#e70fb8]">
                  passa a bola
                </h1>
              </a>
            </div>

            {/* Menu Desktop - Lado direito */}
            <div className="hidden md:flex items-center gap-8">
              <a 
                className="text-gray-700 font-inter font-medium px-4 py-2 transition-all duration-300 hover:text-[#e70fb8] hover:-translate-y-0.5 focus:text-[#e70fb8] focus:font-semibold no-underline" 
                href="/"
              >
                Início
              </a>
              <a 
                className="text-gray-700 font-inter font-medium px-4 py-2 transition-all duration-300 hover:text-[#e70fb8] hover:-translate-y-0.5 focus:text-[#e70fb8] focus:font-semibold no-underline" 
                href="/salvo"
              >
                Meus jogos
              </a>
              <a 
                className="text-gray-700 font-inter font-medium px-4 py-2 transition-all duration-300 hover:text-[#e70fb8] hover:-translate-y-0.5 focus:text-[#e70fb8] focus:font-semibold no-underline" 
                href="/login"
              >
                Entrar
              </a>
            </div>
            
            {/* Menu Hamburger (Mobile) */}
            <button 
              className={`md:hidden flex flex-col justify-between w-6 h-5 bg-transparent border-none cursor-pointer p-0 relative transition-all duration-300 ${
                menuOpen ? 'active' : ''
              }`}
              onClick={toggleMenu}
              aria-label="Toggle navigation"
            >
              <span className={`block w-full h-0.5 bg-gray-700 rounded transition-all duration-300 ${
                menuOpen ? 'rotate-45 translate-y-2 bg-[#e70fb8]' : ''
              }`}></span>
              <span className={`block w-full h-0.5 bg-gray-700 rounded transition-all duration-300 ${
                menuOpen ? 'opacity-0' : ''
              }`}></span>
              <span className={`block w-full h-0.5 bg-gray-700 rounded transition-all duration-300 ${
                menuOpen ? '-rotate-45 -translate-y-2 bg-[#e70fb8]' : ''
              }`}></span>
            </button>
          </div>

          {/* Menu Mobile (Dropdown) */}
          <div className={`md:hidden absolute top-full left-0 right-0 bg-white border-t border-gray-100 shadow-xl transition-all duration-300 ${
            menuOpen 
              ? 'opacity-100 visible translate-y-0' 
              : 'opacity-0 invisible -translate-y-4'
          }`}>
            <div className="container mx-auto px-4 py-3">
              <div className="flex flex-col space-y-1">
                <a 
                  className="text-gray-700 font-inter px-4 py-3 rounded-lg transition-all duration-300 hover:bg-gray-50 hover:text-[#e70fb8] hover:translate-x-2 no-underline" 
                  href="/"
                  onClick={() => setMenuOpen(false)}
                >
                  Início
                </a>
                <a 
                  className="text-gray-700 font-inter px-4 py-3 rounded-lg transition-all duration-300 hover:bg-gray-50 hover:text-[#e70fb8] hover:translate-x-2 no-underline" 
                  href="/salvo"
                  onClick={() => setMenuOpen(false)}
                >
                  Meus jogos
                </a>
                <a 
                  className="text-gray-700 font-inter px-4 py-3 rounded-lg transition-all duration-300 hover:bg-gray-50 hover:text-[#e70fb8] hover:translate-x-2 no-underline" 
                  href="/login"
                  onClick={() => setMenuOpen(false)}
                >
                  Entrar
                </a>
              </div>
            </div>
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Header;