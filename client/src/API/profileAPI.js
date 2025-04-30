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
            avatar: null
          }
        };
      }
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
      const response = await api.get('/students/departments/all');
      return response.data?.data || response.data || [];
    } catch (error) {
      console.error('Departments error:', error);
      return [];
    }
  },

  getGroups: async (departmentId) => {
    try {
      // Проверяем, что departmentId - валидный ID
      if (!departmentId || typeof departmentId !== 'string') {
        return [];
      }
  
      // Используем encodeURIComponent для кодирования departmentId
      const response = await api.get(`/students/groups/${encodeURIComponent(departmentId)}`);
  
      // Возвращаем данные или пустой массив, если данных нет
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