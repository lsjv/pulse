import React, { createContext, useContext, useState, useEffect } from 'react';
import { authAPI, api } from '../services/api';

interface User {
  id: number;
  username: string;
  email: string;
  name?: string;
  avatar?: string;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadUser();
  }, []);

  const loadUser = async () => {
    try {
      const token = localStorage.getItem('access');
      console.log('🔐 Token no loadUser:', token);
      
      if (!token) {
        console.log('❌ SEM token - usuário NÃO logado');
        setUser(null);
        setLoading(false);
        return;
      }

      console.log('✅ COM token - verificando se é válido...');
      
      // POR ENQUANTO: Vamos usar mock só para teste
      // DEPOIS: Implementar chamada real para /api/users/me/
      try {
        // Tenta verificar se o token é válido fazendo uma requisição simples
        await api.get('/posts/feed/');
        
        // Se chegou aqui, o token é válido
        const mockUser: User = {
          id: 1,
          username: 'usuario',
          email: 'user@example.com',
          name: 'Usuário Teste'
        };
        setUser(mockUser);
        console.log('👤 Usuário mock definido (token válido)');
      } catch (error) {
        console.log('❌ Token inválido ou expirado');
        localStorage.removeItem('access');
        localStorage.removeItem('refresh');
        setUser(null);
      }
      
    } catch (error) {
      console.error('Erro ao carregar usuário:', error);
      localStorage.removeItem('access');
      localStorage.removeItem('refresh');
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const login = async (email: string, password: string) => {
    try {
      const response = await authAPI.login({ email, password });
      localStorage.setItem('access', response.access);
      localStorage.setItem('refresh', response.refresh);
      
      // Carregar dados do usuário após login
      await loadUser();
    } catch (error) {
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem('access');
    localStorage.removeItem('refresh');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}