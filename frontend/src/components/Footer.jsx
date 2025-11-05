import React from 'react';
import bolaIcon from '../assets/bola-icon.png';

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white py-12 pt-8 mt-auto">
      <div className="container mx-auto px-4 max-w-6xl">
        
        {/* Footer Main */}
        <div className="mb-8">
          <div className="flex flex-col lg:flex-row justify-between items-start gap-8 lg:gap-12">
            
            {/* Coluna 1 - Passa a Bola */}
            <div className="w-full lg:w-2/5 flex flex-col">
              <div className="flex items-center gap-3 mb-4">
                <img 
                  src={bolaIcon} 
                  alt="Ícone Bola" 
                  className="w-12 h-12 object-contain" 
                />
                <h3 className="font-pacifico text-3xl text-white bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                  passa a bola
                </h3>
              </div>
              <p className="text-gray-300 leading-relaxed text-lg max-w-md">
                A plataforma completa para acompanhar o futebol feminino. 
                Valorizando o talento e a paixão das mulheres no esporte.
              </p>
            </div>

            {/* Colunas da Direita */}
            <div className="w-full lg:w-3/5 flex flex-col sm:flex-row gap-8 lg:gap-12 justify-between">
              
              {/* Coluna 2 - Páginas */}
              <div className="flex-1 min-w-[140px]">
                <h5 className="text-white font-bold text-xl mb-6 pb-2 border-b-2 border-pink-500 inline-block">
                  Páginas
                </h5>
                <ul className="space-y-3 mt-4">
                  <li>
                    <a 
                      href="#home" 
                      className="text-gray-300 hover:text-white transition-all duration-300 text-lg font-medium hover:translate-x-2 hover:text-pink-400 block"
                    >
                      Home
                    </a>
                  </li>
                  <li>
                    <a 
                      href="#calendario" 
                      className="text-gray-300 hover:text-white transition-all duration-300 text-lg font-medium hover:translate-x-2 hover:text-pink-400 block"
                    >
                      Calendário
                    </a>
                  </li>
                  <li>
                    <a 
                      href="#estatisticas" 
                      className="text-gray-300 hover:text-white transition-all duration-300 text-lg font-medium hover:translate-x-2 hover:text-pink-400 block"
                    >
                      Estatísticas
                    </a>
                  </li>
                </ul>
              </div>

              {/* Coluna 3 - Mais */}
              <div className="flex-1 min-w-[140px]">
                <h5 className="text-white font-bold text-xl mb-6 pb-2 border-b-2 border-purple-500 inline-block">
                  Mais
                </h5>
                <ul className="space-y-3 mt-4">
                  <li>
                    <a 
                      href="#sobre" 
                      className="text-gray-300 hover:text-white transition-all duration-300 text-lg font-medium hover:translate-x-2 hover:text-purple-400 block"
                    >
                      Sobre Nós
                    </a>
                  </li>
                  <li>
                    <a 
                      href="#contato" 
                      className="text-gray-300 hover:text-white transition-all duration-300 text-lg font-medium hover:translate-x-2 hover:text-purple-400 block"
                    >
                      Contato
                    </a>
                  </li>
                  <li>
                    <a 
                      href="#duvidas" 
                      className="text-gray-300 hover:text-white transition-all duration-300 text-lg font-medium hover:translate-x-2 hover:text-purple-400 block"
                    >
                      Dúvidas
                    </a>
                  </li>
                </ul>
              </div>

            </div>

          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-gray-700 my-8"></div>

        {/* Footer Bottom */}
        <div className="text-center">
          <div className="flex flex-col items-center space-y-4">
            <p className="text-gray-400 text-base">
              © 2025 Passa a Bola. Todos os direitos reservados.
            </p>
            <div className="flex items-center space-x-6 text-base">
              <a 
                href="#privacidade" 
                className="text-gray-400 hover:text-pink-400 transition-colors duration-300 font-medium hover:underline"
              >
                Política de Privacidade
              </a>
              <span className="text-gray-600">•</span>
              <a 
                href="#termos" 
                className="text-gray-400 hover:text-purple-400 transition-colors duration-300 font-medium hover:underline"
              >
                Termos de Uso
              </a>
            </div>
          </div>
        </div>

      </div>
    </footer>
  );
};

export default Footer;