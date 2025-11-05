import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../components/AuthContext';
import googleIcon from '../assets/google-icon.png';
import facebookIcon from '../assets/facebook-icon.png';

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth(); 
  const [keepConnected, setKeepConnected] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch('http://localhost:5000/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });

      if (!response.ok) throw new Error('Login falhou');

      const data = await response.json();

      localStorage.setItem('token', data.token);
      localStorage.setItem('username', data.username);  

      login(data.username, data.token);

      if (keepConnected) {
        localStorage.setItem('keepConnected', 'true');
      }

      navigate('/partidas');
    } catch (error) {
      console.error('Erro ao logar:', error);
      alert('Falha ao logar. Verifique usuário e senha.');
    }
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
                  {/* Usuário */}
                  <div>
                    <label htmlFor="username" className="block text-white font-semibold mb-2">
                      Usuário
                    </label>
                    <input 
                      type="text" 
                      className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-[#4facfe] focus:ring-2 focus:ring-[#4facfe] focus:ring-opacity-25 transition-all duration-300 outline-none text-white placeholder-gray-300 bg-[#3d1b5c] autofill:bg-[#3d1b5c] autofill:text-white"
                      id="username" 
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      required
                    />
                  </div>
                  
                  {/* Senha */}
                  <div>
                    <label htmlFor="password" className="block text-white font-semibold mb-2">
                      Senha
                    </label>
                    <input 
                      type="password" 
                      className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-[#4facfe] focus:ring-2 focus:ring-[#4facfe] focus:ring-opacity-25 transition-all duration-300 outline-none text-white placeholder-gray-300 bg-transparent autofill:bg-transparent autofill:text-white"
                      id="password" 
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                  </div>
                  
                  {/* Checkbox Mantenha-me conectado */}
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
                  
                  {/* Botão Entrar */}
                  <button 
                    type="submit" 
                    className="w-full bg-gradient-to-r from-[#ec4cbc] to-[#5800aa] text-white py-3 rounded-2xl font-semibold hover:-translate-y-0.5 hover:shadow-lg transition-all duration-300 mb-4"
                  >
                    Entrar
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
              
              {/* Footer */}
              <div className="bg-[#3d1b5c] text-center py-4 px-6">
                <p className="text-white">
                  Não possui uma conta?{' '}
                  <a 
                    href="/register" 
                    className="text-pink-500 font-semibold transition-all duration-300 hover:text-blue-400 relative group"
                  >
                    Criar conta
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