import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Activity } from 'lucide-react';

export default function LoginScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    
    if (!email || !password) {
      alert("Preencha email e senha");
      return;
    }

    setLoading(true);
    try {
      console.log('📤 Tentando login com:', { email, password });
      
      await login(email, password);
      
      console.log('✅ Login bem-sucedido!');
      navigate("/feed");
    } catch (err) {
      console.error('❌ Erro no login:', err);
      alert("Credenciais inválidas");
    } finally {
      setLoading(false);
    }
  }

  function handleKeyPress(e: React.KeyboardEvent) {
    if (e.key === 'Enter') {
      handleSubmit(e);
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <div className="flex items-center justify-center mb-8">
            <div className="bg-indigo-600 p-3 rounded-full">
              <Activity className="w-8 h-8 text-white" />
            </div>
          </div>
          
          <h1 className="text-center text-2xl font-bold text-indigo-600 mb-2">Pulse</h1>
          <p className="text-center text-gray-600 mb-8">
            Entre na conversa
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-gray-700 mb-2">
                Email
              </label>
              <Input
                id="email"
                type="email"
                placeholder="seu@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onKeyPress={handleKeyPress}
                required
                disabled={loading}
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-gray-700 mb-2">
                Senha
              </label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyPress={handleKeyPress}
                required
                disabled={loading}
              />
            </div>

            <Button 
              type="submit" 
              className="w-full" 
              disabled={loading}
            >
              {loading ? "Entrando..." : "Entrar"}
            </Button>
          </form>

    <div className="mt-6 text-center">
      <p className="text-gray-600">
        Não tem conta?{' '}
        <Link to="/register" className="text-indigo-600 font-medium hover:underline">
          Cadastre-se
        </Link>
      </p>
</div>
  );
}