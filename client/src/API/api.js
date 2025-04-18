import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('accessToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => {
    // Успешные ответы
    if (response.data && response.data.success !== false) {
      return response;
    }
    
    // Ошибки от сервера
    const error = new Error(response.data?.message || 'Ошибка сервера');
    error.response = response;
    throw error;
  },
  (error) => {
    // Ошибки сети или сервера
    if (error.response?.status === 401) {
      localStorage.removeItem('accessToken');
      window.location.href = '/login?sessionExpired=true';
    }
    
    error.message = error.response?.data?.message || 'Ошибка сервера';
    return Promise.reject(error);
  }
);

export const registerUser = async (userData) => {
  const response = await api.post('/auth/register', userData);
  return response;
};

export const loginUser = async (credentials) => {
  const response = await api.post('/auth/login', credentials);
  return response;
};

export const logoutUser = async () => {
  const response = await api.post('/auth/logout');
  localStorage.removeItem('accessToken');
  return response;
};

export const checkAuth = async () => {
  return await api.get('/auth/check');
};

export default api;