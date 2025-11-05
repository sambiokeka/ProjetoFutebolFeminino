import React from 'react';
import { useNavigate } from 'react-router-dom';
import googleIcon from '../assets/google-icon.png';
import facebookIcon from '../assets/facebook-icon.png';

export default function RegisterForm() {
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    // Lógica de validação/envio para backend
    navigate('/');
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-[#da5b8f] to-[#6c3cbd] flex items-center justify-center py-8 px-4 pt-20 md:pt-4">
      <section className="container mx-auto">
        <div className="flex justify-center">
          <div className="w-full max-w-md lg:max-w-lg xl:max-w-xl">
            <article className="bg-[#3d1b5c] rounded-2xl shadow-xl overflow-hidden animate-fade-in-up">
              <header className="bg-[#3d1b5c] text-center py-8 px-6">
                <h1 className="text-3xl font-bold text-white mb-2">Criar Conta</h1>
                <p className="text-white opacity-90">Junte-se a nós hoje mesmo</p>
              </header>
              
              <div className="p-6">
                <form className="space-y-4" onSubmit={handleSubmit}>
                  {/* Nome do usuário */}
                  <div>
                    <label htmlFor="username" className="block text-white font-semibold mb-2">
                      Nome do usuário
                    </label>
                    <input 
                      type="text" 
                      className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-[#4facfe] focus:ring-2 focus:ring-[#4facfe] focus:ring-opacity-25 transition-all duration-300 outline-none"
                      id="username" 
                      required
                    />
                  </div>
                  
                  {/* Email */}
                  <div>
                    <label htmlFor="email" className="block text-white font-semibold mb-2">
                      Email
                    </label>
                    <input 
                      type="email" 
                      className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-[#4facfe] focus:ring-2 focus:ring-[#4facfe] focus:ring-opacity-25 transition-all duration-300 outline-none"
                      id="email" 
                      required
                    />
                  </div>
                  
                  {/* Senha e Confirmar Senha */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="password" className="block text-white font-semibold mb-2">
                        Senha
                      </label>
                      <input 
                        type="password" 
                        className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-[#4facfe] focus:ring-2 focus:ring-[#4facfe] focus:ring-opacity-25 transition-all duration-300 outline-none"
                        id="password" 
                        required
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="confirmPassword" className="block text-white font-semibold mb-2">
                        Confirmar senha
                      </label>
                      <input 
                        type="password" 
                        className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-[#4facfe] focus:ring-2 focus:ring-[#4facfe] focus:ring-opacity-25 transition-all duration-300 outline-none"
                        id="confirmPassword" 
                        required
                      />
                    </div>
                  </div>
                  
                  {/* Botão Criar Conta */}
                  <button 
                    type="submit" 
                    className="w-full bg-gradient-to-r from-[#ec4cbc] to-[#5800aa] text-white py-3 rounded-2xl font-semibold hover:-translate-y-0.5 hover:shadow-lg transition-all duration-300 mb-4"
                  >
                    Criar Conta
                  </button>
                  
                  {/* Divisor */}
                  <div className="relative mb-6">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-[#d2deeb]"></div>
                    </div>
                    <div className="relative flex justify-center text-sm">
                      <span className="px-3 bg-[#3d1b5c] text-white">Ou</span>
                    </div>
                  </div>
                  
                  {/* Botões Sociais */}
                  <div className="space-y-4">
                    <button 
                      type="button" 
                      className="w-full bg-white text-gray-700 py-3 rounded-2xl border border-gray-300 font-medium hover:-translate-y-0.5 hover:shadow-md transition-all duration-300 flex items-center justify-center"
                    >
                      <img src={googleIcon} alt="Google" className="w-5 h-5 mr-3" />
                      Continuar com Google
                    </button>
                    
                    <button 
                      type="button" 
                      className="w-full bg-blue-600 text-white py-3 rounded-2xl font-medium hover:bg-blue-700 hover:-translate-y-0.5 hover:shadow-md transition-all duration-300 flex items-center justify-center"
                    >
                      <img src={facebookIcon} alt="Facebook" className="w-5 h-5 mr-3" />
                      Continuar com Facebook
                    </button>
                  </div>
                </form>
              </div>
              
              {/* Footer do card */}
              <div className="bg-[#3d1b5c] text-center py-4 px-6">
                <p className="text-white">
                  Já tem uma conta?{' '}
                  <a 
                    href="/login" 
                    className="text-pink-500 font-semibold transition-all duration-300 hover:text-blue-400 relative group"
                  >
                    Entrar
                    <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-blue-400 transition-all duration-300 group-hover:w-full"></span>
                  </a>
                </p>
              </div>
            </article>
          </div>
        </div>
      </section>
    </main>
  );
}