import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import googleIcon from '../assets/google-icon.png';
import facebookIcon from '../assets/facebook-icon.png';

export default function Login() {
  const navigate = useNavigate();
  const [keepConnected, setKeepConnected] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Lógica de autenticação aqui
    
    if (keepConnected) {
      localStorage.setItem('keepConnected', 'true');
    }
    
    navigate('/');
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-[#da5b8f] to-[#6c3cbd] flex items-center justify-center py-8 px-4 pt-20 md:pt-4">
      <section className="container mx-auto">
        <div className="flex justify-center">
          <div className="w-full max-w-md lg:max-w-lg xl:max-w-xl">
            <article className="bg-[#3d1b5c] rounded-2xl shadow-xl overflow-hidden animate-fade-in-up">
              <header className="bg-[#3d1b5c] text-center py-8 px-6">
                <h1 className="text-3xl font-bold text-white mb-2">Login</h1>
                <p className="text-white opacity-90">Entre na sua conta já cadastrada</p>
              </header>
              
              <div className="p-6">
                <form className="space-y-4" onSubmit={handleSubmit}>
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
                  
                  <div className="flex items-center mb-4">
                    <input 
                      className="w-4 h-4 text-[#ce31ee] bg-[#3d1b5c] border-[#ce31ee] rounded focus:ring-[#ce31ee] focus:ring-2 focus:ring-opacity-25"
                      type="checkbox" 
                      id="keepConnected"
                      checked={keepConnected}
                      onChange={(e) => setKeepConnected(e.target.checked)}
                    />
                    <label className="ml-2 text-white text-sm" htmlFor="keepConnected">
                      Mantenha-me conectado
                    </label>
                  </div>
                  
                  <button 
                    type="submit" 
                    className="w-full bg-gradient-to-r from-[#ec4cbc] to-[#5800aa] text-white py-3 rounded-2xl font-semibold hover:-translate-y-0.5 hover:shadow-lg transition-all duration-300 mb-4"
                  >
                    Entrar
                  </button>
                  
                  <div className="relative mb-6">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-[#d2deeb]"></div>
                    </div>
                    <div className="relative flex justify-center text-sm">
                      <span className="px-3 bg-[#3d1b5c] text-white">Ou</span>
                    </div>
                  </div>
                  
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
              
              <div className="bg-[#3d1b5c] text-center py-4 px-6">
                <p className="text-white">
                  Não possui uma conta?{' '}
                  <a 
                    href="/register" 
                    className="text-pink-500 font-semibold transition-all duration-300 hover:text-pink-500 hover:border-[#00f2fe] border-b-2 border-transparent pb-1"
                  >
                    Criar conta
                    <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#00f2fe] transition-all duration-300 group-hover:w-full"></span>
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