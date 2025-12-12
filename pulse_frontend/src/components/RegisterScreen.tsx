
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Button } from './ui/button';
import { Input } from './ui/input';
import { authAPI } from '../services/api';
import { Activity } from 'lucide-react';

export default function RegisterScreen() {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    password2: '',
    firstName: '',
    lastName: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (formData.password !== formData.password2) {
      setError('As senhas não coincidem');
      return;
    }

    if (formData.password.length < 6) {
      setError('A senha deve ter pelo menos 6 caracteres');
      return;
    }

    setLoading(true);
    try {
      await authAPI.register(formData);
      alert('Cadastro realizado com sucesso! Faça login.');
      navigate('/login');
    } catch (err: any) {
      const errorMsg = err.response?.data || 'Erro ao cadastrar';
      setError(typeof errorMsg === 'object' ? JSON.stringify(errorMsg) : errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <div className="flex items-center justify-center mb-8">
            <div className="bg-indigo-600 p-3 rounded-full">
              <Activity className="w-8 h-8 text-white" />
            </div>
          </div>
          
          <h1 className="text-center text-2xl font-bold text-indigo-600 mb-2">
            Criar Conta
          </h1>
          <p className="text-center text-gray-600 mb-8">
            Junte-se ao Pulse
          </p>

          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-gray-700 mb-2 text-sm">
                  Nome
                </label>
                <Input
                  name="firstName"
                  placeholder="Seu nome"
                  value={formData.firstName}
                  onChange={handleChange}
                  required
                />
              </div>
              <div>
                <label className="block text-gray-700 mb-2 text-sm">
                  Sobrenome
                </label>
                <Input
                  name="lastName"
                  placeholder="Seu sobrenome"
                  value={formData.lastName}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-gray-700 mb-2 text-sm">
                Nome de usuário
              </label>
              <Input
                name="username"
                placeholder="seu_usuario"
                value={formData.username}
                onChange={handleChange}
                required
                minLength={3}
              />
            </div>

            <div>
              <label className="block text-gray-700 mb-2 text-sm">
                Email
              </label>
              <Input
                name="email"
                type="email"
                placeholder="seu@email.com"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>

            <div>
              <label className="block text-gray-700 mb-2 text-sm">
                Senha
              </label>
              <Input
                name="password"
                type="password"
                placeholder="••••••••"
                value={formData.password}
                onChange={handleChange}
                required
                minLength={6}
              />
            </div>

            <div>
              <label className="block text-gray-700 mb-2 text-sm">
                Confirmar Senha
              </label>
              <Input
                name="password2"
                type="password"
                placeholder="••••••••"
                value={formData.password2}
                onChange={handleChange}
                required
              />
            </div>

            <Button 
              type="submit" 
              className="w-full" 
              disabled={loading}
            >
              {loading ? "Criando conta..." : "Criar Conta"}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-gray-600">
              Já tem uma conta?{' '}
              <Link to="/login" className="text-indigo-600 font-medium hover:underline">
                Entre aqui
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}