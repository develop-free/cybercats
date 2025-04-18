import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import api from '../../../../API/api';
import './SettingsSection.css';

const SettingsSection = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    middleName: '',
    birthDate: '',
    department: '',
    group: '',
    email: '',
    avatar: null,
    avatarPreview: ''
  });

  const [departments, setDepartments] = useState([]);
  const [groups, setGroups] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  // Загрузка начальных данных
  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        
        const [profileResponse, departmentsResponse] = await Promise.all([
          api.get('/students/profile'),
          api.get('/students/departments')
        ]);

        const { department, group, ...profileData } = profileResponse.data;

        setFormData({
          ...profileData,
          department: department?._id || '',
          group: group?._id || '',
          avatarPreview: profileData.avatar || ''
        });

        setDepartments(departmentsResponse.data);

        if (department) {
          const groupsResponse = await api.get(`/students/groups/${department._id}`);
          setGroups(groupsResponse.data);
        }
      } catch (error) {
        toast.error('Ошибка загрузки данных профиля');
        console.error('Error fetching profile:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  // Загрузка групп при изменении отделения
  useEffect(() => {
    if (formData.department) {
      const fetchGroups = async () => {
        try {
          const response = await api.get(`/students/groups/${formData.department}`);
          setGroups(response.data);
        } catch (error) {
          toast.error('Ошибка загрузки групп');
          console.error('Error fetching groups:', error);
        }
      };
      fetchGroups();
    }
  }, [formData.department]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setFormData(prev => ({
        ...prev,
        avatar: file,
        avatarPreview: URL.createObjectURL(file)
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSaving(true);

    try {
      const formDataToSend = new FormData();
      formDataToSend.append('firstName', formData.firstName);
      formDataToSend.append('lastName', formData.lastName);
      formDataToSend.append('middleName', formData.middleName);
      formDataToSend.append('birthDate', formData.birthDate);
      formDataToSend.append('department', formData.department);
      formDataToSend.append('group', formData.group);
      formDataToSend.append('email', formData.email);
      
      if (formData.avatar) {
        formDataToSend.append('avatar', formData.avatar);
      }

      const response = await api.put('/students/profile', formDataToSend, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      toast.success('Профиль успешно обновлен!');
      setFormData(prev => ({
        ...prev,
        avatar: null,
        avatarPreview: response.data.avatar || prev.avatarPreview
      }));
    } catch (error) {
      toast.error(error.response?.data?.message || 'Ошибка сохранения профиля');
      console.error('Error saving profile:', error);
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return <div className="loading-container">Загрузка профиля...</div>;
  }

  return (
    <div className="settings-container">
      <h2>Настройки профиля</h2>
      
      <form onSubmit={handleSubmit}>
        <div className="avatar-section">
          <div className="avatar-preview">
            <img 
              src={formData.avatarPreview || '/default-avatar.png'} 
              alt="Аватар" 
            />
          </div>
          <div className="avatar-controls">
            <label htmlFor="avatar-upload" className="avatar-upload-label">
              Выбрать изображение
              <input
                id="avatar-upload"
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                style={{ display: 'none' }}
              />
            </label>
            <p>JPG, PNG (макс. 5MB)</p>
          </div>
        </div>

        <div className="form-group">
          <label>Фамилия:</label>
          <input
            type="text"
            name="lastName"
            value={formData.lastName}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label>Имя:</label>
          <input
            type="text"
            name="firstName"
            value={formData.firstName}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label>Отчество:</label>
          <input
            type="text"
            name="middleName"
            value={formData.middleName}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label>Дата рождения:</label>
          <input
            type="date"
            name="birthDate"
            value={formData.birthDate}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label>Отделение:</label>
          <select
            name="department"
            value={formData.department}
            onChange={handleChange}
            required
          >
            <option value="">Выберите отделение</option>
            {departments.map(dept => (
              <option key={dept._id} value={dept._id}>{dept.name}</option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label>Группа:</label>
          <select
            name="group"
            value={formData.group}
            onChange={handleChange}
            required
            disabled={!formData.department}
          >
            <option value="">Выберите группу</option>
            {groups.map(group => (
              <option key={group._id} value={group._id}>{group.name}</option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label>Email:</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>

        <button type="submit" disabled={isSaving} className="save-button">
          {isSaving ? 'Сохранение...' : 'Сохранить изменения'}
        </button>
      </form>
    </div>
  );
};

export default SettingsSection;