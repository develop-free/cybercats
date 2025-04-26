import api from './api';

const ProfileAPI = {
  getProfile: async () => {
    try {
      const response = await api.get('/students/profile');
      return response.data;
    } catch (error) {
      console.error('Ошибка при получении профиля:', error);
      throw error;
    }
  },

  updateProfile: async (profileData) => {
    try {
      const formData = new FormData();
      Object.entries(profileData).forEach(([key, value]) => {
        if (value !== null && value !== undefined) {
          formData.append(key, value);
        }
      });

      const response = await api.put('/students/profile', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error) {
      console.error('Ошибка при обновлении профиля:', error);
      throw error;
    }
  },

  getDepartments: async () => {
    try {
      const response = await api.get('/students/departments');
      return response.data;
    } catch (error) {
      console.error('Ошибка при получении отделений:', error);
      throw error;
    }
  },
  // mafia

  getGroups: async (departmentId) => {
    try {
      const response = await api.get(`/students/groups/${departmentId}`);
      return response.data;
    } catch (error) {
      console.error('Ошибка при получении групп:', error);
      throw error;
    }
  },

  updateAvatar: async (file) => {
    try {
      const formData = new FormData();
      formData.append('avatar', file);

      const response = await api.patch('/students/profile/avatar', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error) {
      console.error('Ошибка при обновлении аватара:', error);
      throw error;
    }
  }
};

export default ProfileAPI;
