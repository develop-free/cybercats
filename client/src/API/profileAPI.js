import api from './api';

const ProfileAPI = {
  getProfile: async () => {
    const response = await api.get('/students/profile');
    return response.data;
  },

  updateProfile: async (profileData) => {
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
  },

  updateAvatar: async (file) => {
    const formData = new FormData();
    formData.append('avatar', file);
    
    const response = await api.patch('/students/profile/avatar', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  getDepartments: async () => {
    const response = await api.get('/students/departments');
    return response.data;
  },

  getGroups: async (departmentId) => {
    const response = await api.get(`/students/groups/${departmentId}`);
    return response.data;
  },

  changePassword: async (currentPassword, newPassword) => {
    const response = await api.post('/students/change-password', {
      currentPassword,
      newPassword
    });
    return response.data;
  }
};

export default ProfileAPI;