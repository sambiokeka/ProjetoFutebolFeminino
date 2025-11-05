import bolaIcon from '../assets/bola-icon.png';

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white py-12 pt-8 mt-auto">
      <div className="container mx-auto px-4 max-w-6xl">
        
        {/* Footer Main */}
        <div className="mb-8">
          <div className="flex flex-col lg:flex-row justify-between items-start gap-8 lg:gap-12">
            
            {/* Coluna 1 - Match Point */}
            <div className="w-full lg:w-2/5 flex flex-col items-center lg:items-start text-center lg:text-left">
              <div className="flex items-center gap-3 mb-4">
                <img 
                  src={bolaIcon} 
                  alt="Ícone Bola" 
                  className="w-11 h-11 object-contain -mt-1" 
                />
                <h3 className="logo-text text-2xl text-white">Match Point</h3>
              </div>
              <p className="text-gray-400 leading-relaxed text-base max-w-md">
                A plataforma completa para acompanhar o futebol feminino. 
                Valorizando o talento e a paixão das mulheres no esporte.
              </p>
            </div>

            {/* Colunas da Direita */}
            <div className="w-full lg:w-3/5 flex flex-col sm:flex-row gap-8 lg:gap-12 justify-center lg:justify-between">
              
              {/* Coluna 2 - Páginas */}
              <div className="flex-1 min-w-[140px] flex flex-col items-center lg:items-start text-center lg:text-left">
                <h5 className="text-white font-bold text-lg mb-4">Páginas</h5>
                <ul className="space-y-2">
                  <li>
                    <a 
                      href="/Partidas" 
                      className="text-gray-400 hover:text-white transition-colors duration-300 text-base hover:underline"
                    >
                      Inicio
                    </a>
                  </li>
                  <li>
                    <a 
                      href="/Salvo" 
                      className="text-gray-400 hover:text-white transition-colors duration-300 text-base hover:underline"
                    >
                      Meus jogos
                    </a>
                  </li>
                  <li>
                    <a 
                      href="/Login" 
                      className="text-gray-400 hover:text-white transition-colors duration-300 text-base hover:underline"
                    >
                      Entrar
                    </a>
                  </li>
                </ul>
              </div>

              {/* Coluna 3 - Mais */}
              <div className="flex-1 min-w-[140px] flex flex-col items-center lg:items-start text-center lg:text-left">
                <h5 className="text-white font-bold text-lg mb-4">Mais</h5>
                <ul className="space-y-2">
                  <li>
                    <a 
                      href="#sobre" 
                      className="text-gray-400 hover:text-white transition-colors duration-300 text-base hover:underline"
                    >
                      Sobre Nós
                    </a>
                  </li>
                  <li>
                    <a 
                      href="#contato" 
                      className="text-gray-400 hover:text-white transition-colors duration-300 text-base hover:underline"
                    >
                      Contato
                    </a>
                  </li>
                  <li>
                    <a 
                      href="#duvidas" 
                      className="text-gray-400 hover:text-white transition-colors duration-300 text-base hover:underline"
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
        <hr className="border-gray-700 my-8" />

        {/* Footer Bottom */}
        <div className="text-center">
          <div className="flex flex-col items-center">
            <p className="text-gray-400 mb-3 text-sm">
              © 2025 Match Point. Todos os direitos reservados.
            </p>
            <div className="flex items-center space-x-3 text-sm">
              <a 
                href="#privacidade" 
                className="text-gray-400 hover:text-gray-300 transition-colors duration-300 hover:underline"
              >
                Política de Privacidade
              </a>
              <span className="text-gray-500">|</span>
              <a 
                href="#termos" 
                className="text-gray-400 hover:text-gray-300 transition-colors duration-300 hover:underline"
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