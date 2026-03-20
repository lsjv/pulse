import axios from 'axios';

const API_BASE_URL = 'https://pulse-pecb.onrender.com/api';

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('access');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export const authAPI = {
  login: (credentials: { username: string; password: string }) =>
    api.post('/auth/login/', credentials).then(res => res.data),

  register: (userData: any) =>
    api.post('/auth/register/', userData).then(res => res.data),
};

export const postsAPI = {
  getFeed: () =>
    api.get('/posts/feed/').then(res => res.data),

  createPost: (content: string) =>
    api.post('/posts/', { content }).then(res => res.data),

  likePost: (postId: string) =>
    api.post(`/posts/${postId}/like/`).then(res => res.data),

  commentPost: (postId: string, content: string) =>
    api.post(`/posts/${postId}/comment/`, { content }).then(res => res.data),
};