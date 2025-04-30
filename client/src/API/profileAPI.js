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
  
      // Добавляем обязательные текстовые поля
      formData.append('firstName', profileData.firstName || '');
      formData.append('lastName', profileData.lastName || '');
      
      // Добавляем необязательные текстовые поля
      if (profileData.middleName) formData.append('middleName', profileData.middleName);
      if (profileData.birthdate) formData.append('birthDate', profileData.birthdate);
      if (profileData.department) formData.append('department', profileData.department);
      if (profileData.group) formData.append('group', profileData.group);
      if (profileData.email) formData.append('email', profileData.email);
  
      // Добавляем пароль, если он указан (для нового пользователя)
      if (profileData.password) {
        formData.append('password', profileData.password);
      }
  
      // Обработка аватара (может быть File или строкой с URL)
      if (profileData.avatar) {
        if (profileData.avatar instanceof File) {
          // Новый загруженный файл
          formData.append('avatar', profileData.avatar);
        } else if (typeof profileData.avatar === 'string' && profileData.avatar.startsWith('blob:')) {
          // Если это blob-ссылка (превью), не отправляем
          console.warn('Blob URL не будет отправлен на сервер');
        }
        // Существующий URL аватара не требует обработки
      }
  
      // Настройка заголовков для FormData
      const config = {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        transformRequest: (data) => data, // Отключаем автоматическое преобразование
      };
  
      // Отправка запроса
      const response = await api.put('/students/profile', formData, config);
  
      // Проверка успешного ответа
      if (!response.data.success) {
        throw new Error(response.data.message || 'Ошибка при обновлении профиля');
      }
  
      return {
        success: true,
        data: response.data.data,
        message: response.data.message || 'Профиль успешно обновлен'
      };
  
    } catch (error) {
      console.error('Ошибка при обновлении профиля:', error);
      
      // Форматируем ошибку для удобства обработки
      const errorResponse = {
        success: false,
        message: error.response?.data?.message || 
                 error.message || 
                 'Произошла ошибка при обновлении профиля',
        status: error.response?.status,
        data: error.response?.data
      };
  
      // Можно добавить дополнительную обработку для разных статусов
      if (error.response?.status === 401) {
        errorResponse.message = 'Требуется авторизация';
      } else if (error.response?.status === 400) {
        errorResponse.message = 'Некорректные данные: ' + 
          (error.response.data?.errors?.join(', ') || errorResponse.message);
      }
  
      throw errorResponse;
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