import axios from 'axios';

const API_BASE_URL = window.location.hostname === 'localhost' 
  ? 'http://localhost:8000/api'
  : `http://${window.location.hostname}:8000/api`;
// Configuração base do axios
export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// API de Autenticação
export const authAPI = {
  login: async (credentials: { email: string; password: string }) => {
    const response = await api.post('/auth/login/', credentials);
    return response.data;
  },
  
  register: (userData: any) => 
    api.post('/auth/register/', userData).then(res => res.data),

  refreshToken: (refresh: string) =>
    api.post('/auth/token/refresh/', { refresh }).then(res => res.data),
};

// API de Posts
export const postsAPI = {
  getFeed: () => api.get('/posts/feed/').then(res => res.data),
  
  createPost: (postData: FormData) => 
    api.post('/posts/', postData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    }).then(res => res.data),
  
  likePost: (postId: number) =>
    api.post(`/posts/${postId}/like/`).then(res => res.data),
  
  addComment: (postId: number, commentData: { content: string }) =>
    api.post(`/posts/${postId}/comments/`, commentData).then(res => res.data),
};

// Interceptor para adicionar token automaticamente
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('access');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor para tratar erros de autenticação
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      // Token expirado - tentar refresh
      const refreshToken = localStorage.getItem('refresh');
      if (refreshToken) {
        try {
          const refreshResponse = await authAPI.refreshToken(refreshToken);
          localStorage.setItem('access', refreshResponse.access);
          
          // Reenviar a requisição original com novo token
          error.config.headers.Authorization = `Bearer ${refreshResponse.access}`;
          return api.request(error.config);
        } catch (refreshError) {
          // Refresh falhou - fazer logout
          localStorage.removeItem('access');
          localStorage.removeItem('refresh');
          window.location.href = '/login';
        }
      }
    }
    return Promise.reject(error);
  }
);

// src/services/api.ts
