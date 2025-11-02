import { useState } from 'react';
import { useAuth } from './AuthContext';
import '../styles/Header.css';
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
    <header className="bg-white shadow-md fixed top-0 w-full z-50">
      <nav className="bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-between items-center py-2">
            {/* Logo */}
            <a className="!no-underline" href="/Partidas">
              <div className="flex items-center gap-2">
                <img 
                  src={bolaIcon} 
                  alt="Ícone Bola" 
                  className="w-12 h-12 md:w-14 md:h-14 object-contain" 
                />
                <h1 className="logo-text text-black !text-3xl !md:text-4xl">
                  Match Point
                </h1>
              </div>
            </a>
            
            {/* Menu Desktop */}
            <div className="hidden lg:flex items-center space-x-8">
              <a 
                className="nav-link text-black px-4 py-2 transition-all duration-300 hover:text-pink-600" 
                href="/Partidas"
              >
                Início
              </a>
              <a 
                className="nav-link text-black px-4 py-2 transition-all duration-300 hover:text-pink-600" 
                href="/Salvo"
              >
                Meus jogos
              </a>
              
              {username ? (
                <div className="relative">
                  <button 
                    className="nav-link text-black px-4 py-2 transition-all duration-300 hover:text-pink-600"
                    onClick={toggleProfile}
                  >
                    {username}
                  </button>
                  {profileOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50 border border-gray-200">
                      <button 
                        className="nav-link block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors duration-200"
                        onClick={handleLogout}
                      >
                        Sair
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <a 
                  className="nav-link text-black px-4 py-2 transition-all duration-300 hover:text-pink-600" 
                  href="/Login"
                >
                  Entrar
                </a>
              )}
            </div>

            {/* Hamburger Menu Button (Mobile) */}
            <button 
              className={`lg:hidden flex flex-col justify-between w-8 h-6 bg-transparent border-none cursor-pointer p-0 relative ${
                menuOpen ? 'active' : ''
              }`}
              onClick={toggleMenu}
              aria-label="Toggle navigation"
            >
              <span className={`block w-full h-0.5 bg-black rounded transition-all duration-300 ${
                menuOpen ? 'rotate-45 translate-y-2.5' : ''
              }`}></span>
              <span className={`block w-full h-0.5 bg-black rounded transition-all duration-300 ${
                menuOpen ? 'opacity-0' : 'opacity-100'
              }`}></span>
              <span className={`block w-full h-0.5 bg-black rounded transition-all duration-300 ${
                menuOpen ? '-rotate-45 -translate-y-2.5' : ''
              }`}></span>
            </button>
          </div>

          {/* Mobile Menu */}
          <div className={`lg:hidden transition-all duration-300 ease-in-out ${
            menuOpen 
              ? 'max-h-96 opacity-100 visible translate-y-0' 
              : 'max-h-0 opacity-0 invisible -translate-y-2'
          }`}>
            <div className="bg-white rounded-lg shadow-lg mt-2 py-3 border border-gray-100 mb-4">
              <div className="flex flex-col space-y-1">
                <a 
                  className="nav-link text-black px-4 py-3 rounded-lg hover:bg-gray-50 transition-colors duration-200"
                  href="/Partidas"
                  onClick={() => setMenuOpen(false)}
                >
                  Início
                </a>
                <a 
                  className="nav-link text-black px-4 py-3 rounded-lg hover:bg-gray-50 transition-colors duration-200"
                  href="/Salvo"
                  onClick={() => setMenuOpen(false)}
                >
                  Meus jogos
                </a>
                
                {username ? (
                  <div className="border-t border-gray-100 pt-2 mt-2">

                    <button 
                      className="nav-link w-full text-left text-black px-4 py-3 rounded-lg hover:bg-gray-50 transition-colors duration-200 mt-2"
                      onClick={handleLogout}
                    >
                      Sair
                    </button>
                  </div>
                ) : (
                  <a 
                    className="nav-link text-black px-4 py-3 rounded-lg hover:bg-gray-50 transition-colors duration-200 border-t border-gray-100 mt-2 pt-2 !-mb-1"
                    href="/Login"
                    onClick={() => setMenuOpen(false)}
                  >
                    Entrar
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Header;