import axios from 'axios';

const API_BASE_URL = 'https://sustainable-dominga-nonprecipitative.ngrok-free.dev/api';

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    'ngrok-skip-browser-warning': 'true',
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

export const usersAPI = {
  getMe: () =>
    api.get('/users/me/').then(res => res.data),

  updateMe: (data: FormData) => {
    const hasFile = data.has('avatar') && (data.get('avatar') as File)?.size > 0;
    if (hasFile) {
      return api.patch('/users/me/', data, {
        headers: { 'Content-Type': 'multipart/form-data' },
      }).then(res => res.data);
    } else {
      const jsonData: any = {};
      data.forEach((value, key) => {
        if (key !== 'avatar') jsonData[key] = value;
      });
      return api.patch('/users/me/', jsonData).then(res => res.data);
    }
  },

  getUsers: () =>
    api.get('/users/').then(res => res.data),

  followUser: (userId: string) =>
    api.post(`/users/${userId}/follow/`).then(res => res.data),

  unfollowUser: (userId: string) =>
    api.post(`/users/${userId}/unfollow/`).then(res => res.data),
};