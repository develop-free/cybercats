import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';
const api = axios.create({
  baseURL: API_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

let isRefreshing = false;
let failedQueue = [];
let pendingActions = new Set();

const processQueue = (error, token = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('accessToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      !originalRequest.url.includes('/auth/login') &&
      !originalRequest.url.includes('/auth/refresh-token')
    ) {
      if (pendingActions.size > 0) {
        if (isRefreshing) {
          return new Promise((resolve, reject) => {
            failedQueue.push({ resolve, reject });
          })
            .then((token) => {
              originalRequest.headers.Authorization = `Bearer ${token}`;
              return api(originalRequest);
            })
            .catch((err) => Promise.reject(err));
        }

        originalRequest._retry = true;
        isRefreshing = true;

        try {
          const response = await axios.post(
            `${API_URL}/auth/refresh-token`,
            {},
            { withCredentials: true }
          );
          const { accessToken } = response.data;
          localStorage.setItem('accessToken', accessToken);
          api.defaults.headers.common.Authorization = `Bearer ${accessToken}`;
          originalRequest.headers.Authorization = `Bearer ${accessToken}`;
          processQueue(null, accessToken);
          return api(originalRequest);
        } catch (err) {
          processQueue(err, null);
          localStorage.removeItem('accessToken');
          return Promise.reject(err);
        } finally {
          isRefreshing = false;
        }
      }
    }
    const errorMessage = error.response?.data?.message || error.message || 'Неизвестная ошибка';
    console.error('API ошибка:', errorMessage);
    return Promise.reject(new Error(errorMessage));
  }
);

export const registerUser = async (userData) => {
  pendingActions.add('register');
  try {
    const response = await api.post('/auth/register', userData);
    return response;
  } catch (error) {
    console.error('Ошибка регистрации:', error);
    throw new Error(error.message);
  } finally {
    pendingActions.delete('register');
  }
};

export const loginUser = async (credentials) => {
  pendingActions.add('login');
  try {
    const response = await api.post('/auth/login', credentials);
    return response;
  } catch (error) {
    console.error('Ошибка авторизации:', error);
    throw new Error(error.message);
  } finally {
    pendingActions.delete('login');
  }
};

export const refreshToken = async () => {
  pendingActions.add('refresh');
  try {
    const response = await axios.post(
      `${API_URL}/auth/refresh-token`,
      {},
      { withCredentials: true }
    );
    return response;
  } catch (error) {
    console.error('Ошибка обновления токена:', error);
    throw new Error(error.message);
  } finally {
    pendingActions.delete('refresh');
  }
};

export const logoutUser = async () => {
  pendingActions.add('logout');
  try {
    const response = await api.post('/auth/logout');
    localStorage.removeItem('accessToken');
    return response;
  } catch (error) {
    console.error('Ошибка выхода:', error);
    throw new Error(error.message);
  } finally {
    pendingActions.delete('logout');
  }
};

export const logoutAll = async () => {
  pendingActions.add('logoutAll');
  try {
    const response = await api.post('/auth/logout-all');
    localStorage.removeItem('accessToken');
    return response;
  } catch (error) {
    console.error('Ошибка выхода из всех сессий:', error);
    throw new Error(error.message);
  } finally {
    pendingActions.delete('logoutAll');
  }
};

export const checkAuth = async () => {
  pendingActions.add('checkAuth');
  try {
    return await api.get('/auth/check');
  } catch (error) {
    console.error('Ошибка проверки авторизации:', error);
    throw new Error(error.message);
  } finally {
    pendingActions.delete('checkAuth');
  }
};

export default api;