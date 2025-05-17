// ProfileAPI.js
import api from './api';

const ProfileAPI = {
  getProfile: async () => {
    try {
      const response = await api.get('/students/profile', {
        headers: { 'Cache-Control': 'no-cache' },
      });
      console.log('Получен профиль:', response.data);
      return response.data;
    } catch (error) {
      console.error('Ошибка получения профиля:', {
        message: error.response?.data?.message || error.message,
        status: error.response?.status,
        data: error.response?.data,
      });
      throw error;
    }
  },

  createProfile: async (profileData) => {
    try {
      console.log('Отправка создания профиля:', [...profileData.entries()]);
      const response = await api.post('/students/profile', profileData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Cache-Control': 'no-cache',
        },
      });
      console.log('Ответ создания профиля:', response.data);
      return response.data;
    } catch (error) {
      console.error('Ошибка создания профиля:', {
        message: error.message,
        status: error.response?.status,
        data: error.response?.data,
      });
      throw new Error(error.response?.data?.message || 'Ошибка сервера');
    }
  },

  updateProfile: async (profileData) => {
    try {
      console.log('Отправка обновления профиля:', [...profileData.entries()]);
      const response = await api.put('/students/profile', profileData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Cache-Control': 'no-cache',
        },
      });
      console.log('Ответ обновления профиля:', response.data);
      return response.data;
    } catch (error) {
      console.error('Ошибка обновления профиля:', {
        message: error.message,
        status: error.response?.status,
        data: error.response?.data,
      });
      throw new Error(error.response?.data?.message || 'Ошибка сервера');
    }
  },

  getDepartments: async () => {
    try {
      const response = await api.get('/students/departments/all', {
        headers: { 'Cache-Control': 'no-cache' },
      });
      console.log('Получены отделения:', response.data);
      return response.data?.data || response.data || [];
    } catch (error) {
      console.error('Ошибка получения отделений:', error);
      return [];
    }
  },

  getGroups: async (departmentId) => {
    try {
      if (!departmentId || typeof departmentId !== 'string') {
        console.warn('Некорректный departmentId:', departmentId);
        return [];
      }
      const response = await api.get(`/students/groups?department_id=${encodeURIComponent(departmentId)}`, {
        headers: { 'Cache-Control': 'no-cache' },
      });
      console.log('Получены группы:', response.data);
      return response.data?.data || response.data || [];
    } catch (error) {
      console.error('Ошибка получения групп:', error);
      return [];
    }
  },

  updateAvatar: async (file) => {
    try {
      const formData = new FormData();
      if (file === null) {
        formData.append('removeAvatar', true);
      } else {
        formData.append('avatar', file);
      }
      console.log('Отправка обновления аватара:', [...formData.entries()]);
      const response = await api.patch('/students/profile/avatar', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Cache-Control': 'no-cache',
        },
      });
      console.log('Ответ обновления аватара:', response.data);
      return response.data;
    } catch (error) {
      console.error('Ошибка при обновлении аватара:', {
        message: error.message,
        status: error.response?.status,
        data: error.response?.data,
      });
      throw new Error(error.response?.data?.message || 'Ошибка при обновлении аватара');
    }
  },
};

export default ProfileAPI;