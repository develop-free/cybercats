import api from './api';

const ProfileAPI = {
  getProfile: async () => {
    try {
      const response = await api.get('/students/profile');
      return response.data;
    } catch (error) {
      if (error.response?.status === 404) {
        return {
          success: true,
          isNewUser: true,
          data: {
            firstName: '',
            lastName: '',
            middleName: '',
            birthDate: '',
            department: null,
            group: null,
            email: '',
            avatar: null,
            admissionYear: new Date().getFullYear()
          }
        };
      }
      console.error('Ошибка при получении профиля:', error);
      throw error;
    }
  },

  updateProfile: async (profileData) => {
    try {
      const response = await api.put('/students/profile', profileData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error) {
      console.error('Ошибка при обновлении профиля:', error);
      throw {
        message: error.response?.data?.message || 'Ошибка сервера',
        validationErrors: error.response?.data?.errors
      };
    }
  },

  getDepartments: async () => {
    try {
      const response = await api.get('/students/departments/all');
      return response.data?.data || response.data || [];
    } catch (error) {
      console.error('Departments error:', error);
      return [];
    }
  },

  getGroups: async (departmentId) => {
    try {
      if (!departmentId || typeof departmentId !== 'string') {
        return [];
      }

      const response = await api.get(`/students/groups?department_id=${encodeURIComponent(departmentId)}`);
      return response.data?.data || response.data || [];
    } catch (err) {
      console.error('Ошибка при получении групп:', err);
      return [];
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