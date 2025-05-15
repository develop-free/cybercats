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
            first_name: '',
            last_name: '',
            middle_name: '',
            birth_date: '',
            department_id: null,
            group_id: null,
            login: '',
            email: '',
            avatar: null,
            admission_year: new Date().getFullYear(),
          },
        };
      }
      throw new Error(
        error.response?.data?.message ||
          error.message ||
          'Ошибка при получении профиля'
      );
    }
  },

  createProfile: async (profileData) => {
    try {
      const response = await api.post('/students/profile', profileData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error) {
      const err = new Error(
        error.response?.data?.message ||
          error.message ||
          'Ошибка сервера'
      );
      if (error.response?.data?.errors) {
        err.validationErrors = error.response.data.errors;
      }
      throw err;
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
      const err = new Error(
        error.response?.data?.message ||
          error.message ||
          'Ошибка сервера'
      );
      err.status = error.response?.status;
      if (error.response?.data?.errors) {
        err.validationErrors = error.response.data.errors;
      }
      throw err;
    }
  },

  getDepartments: async () => {
    try {
      const response = await api.get('/students/departments/all');
      return response.data?.data || response.data || [];
    } catch (error) {
      return [];
    }
  },

  getGroups: async (departmentId) => {
    try {
      if (!departmentId || typeof departmentId !== 'string') {
        return [];
      }

      const response = await api.get(
        `/students/groups?department_id=${encodeURIComponent(departmentId)}`
      );
      return response.data?.data || response.data || [];
    } catch (err) {
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
      throw new Error(
        error.response?.data?.message ||
          error.message ||
          'Ошибка при обновлении аватара'
      );
    }
  },
};

export default ProfileAPI;