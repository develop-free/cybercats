import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        const response = await axios.post(`${API_URL}/refresh-token`, {}, { withCredentials: true });
        const { accessToken } = response.data;

        localStorage.setItem('accessToken', accessToken);
        originalRequest.headers.Authorization = `Bearer ${accessToken}`;

        return api(originalRequest);
      } catch (refreshError) {
        localStorage.clear();
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error.response?.data || error);
  }
);

export const registerUser = async (userData) => {
  const response = await api.post('/register', userData);
  return response.data;
};

export const loginUser = async (userData) => {
  const response = await api.post('/login', userData);
  return response.data;
};

export const logoutUser = async () => {
  const response = await api.post('/logout');
  localStorage.clear();
  return response.data;
};

export const checkUserRole = async () => {
  const response = await api.get('/check-role');
  return response.data;
};
