import React, { useEffect, useState } from 'react';
import './SettingsSection.css';
import ProfileAPI from '../../../../API/profileAPI';

const SettingsSection = () => {
  const [profile, setProfile] = useState({
    lastName: '',
    firstName: '',
    middleName: '',
    birthdate: '',
    department: '',
    group: '',
    login: '',
    email: '',
    avatar: null,
  });

  const [departments, setDepartments] = useState([]);
  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [profileData, departmentsData] = await Promise.all([
          ProfileAPI.getProfile(),
          ProfileAPI.getDepartments()
        ]);
        
        setProfile({
          ...profileData,
          birthdate: profileData.birthDate || '',
          department: profileData.department?._id || '',
          group: profileData.group?._id || ''
        });
        
        setDepartments(departmentsData);
        setError(null);
      } catch (err) {
        console.error('Error fetching initial data:', err);
        setError('Не удалось загрузить данные профиля');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    const fetchGroups = async () => {
      if (profile.department) {
        try {
          const groupsData = await ProfileAPI.getGroups(profile.department);
          setGroups(groupsData);
        } catch (err) {
          console.error('Error fetching groups:', err);
          setGroups([]);
        }
      }
    };

    fetchGroups();
  }, [profile.department]);

  const handleChange = (e) => {
    const { id, value } = e.target;
    setProfile(prevProfile => ({
      ...prevProfile,
      [id]: value,
    }));
  };

  const handleFileChange = (e) => {
    setProfile(prevProfile => ({
      ...prevProfile,
      avatar: e.target.files[0],
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const formData = {
        lastName: profile.lastName,
        firstName: profile.firstName,
        middleName: profile.middleName,
        birthdate: profile.birthdate,
        department: profile.department,
        group: profile.group,
        email: profile.email,
        avatar: profile.avatar
      };

      const response = await ProfileAPI.updateProfile(formData);
      
      if (response.success) {
        alert('Профиль успешно сохранен!');
        // Обновляем данные профиля после сохранения
        const updatedProfile = await ProfileAPI.getProfile();
        setProfile({
          ...updatedProfile,
          birthdate: updatedProfile.birthDate || '',
          department: updatedProfile.department?._id || '',
          group: updatedProfile.group?._id || ''
        });
      } else {
        alert(response.message || 'Ошибка при сохранении профиля');
      }
    } catch (error) {
      console.error('Error saving profile:', error);
      alert('Произошла ошибка при сохранении профиля');
    }
  };

  if (loading) {
    return <div className="section">Загрузка данных профиля...</div>;
  }

  if (error) {
    return <div className="section error">{error}</div>;
  }

  return (
    <div className="section" id="settings-section">
      <div className="heading-fixed">
        <h2>Настройки профиля</h2>
      </div>
      <div className='center-form'>
        <form className="settings-form" onSubmit={handleSubmit}>
          <label htmlFor="lastName">Фамилия:</label>
          <input 
            type="text" 
            id="lastName" 
            value={profile.lastName} 
            onChange={handleChange} 
            required 
          />

          <label htmlFor="firstName">Имя:</label>
          <input 
            type="text" 
            id="firstName" 
            value={profile.firstName} 
            onChange={handleChange} 
            required 
          />

          <label htmlFor="middleName">Отчество:</label>
          <input 
            type="text" 
            id="middleName" 
            value={profile.middleName} 
            onChange={handleChange} 
          />

          <label htmlFor="birthdate">Дата рождения:</label>
          <input 
            type="date" 
            id="birthdate" 
            value={profile.birthdate} 
            onChange={handleChange} 
          />

          <label htmlFor="department">Отделение:</label>
          <select 
            id="department" 
            value={profile.department} 
            onChange={handleChange}
          >
            <option value="">Выберите отделение</option>
            {departments.map(dept => (
              <option key={dept._id} value={dept._id}>{dept.name}</option>
            ))}
          </select>

          <label htmlFor="group">Группа:</label>
          <select 
            id="group" 
            value={profile.group} 
            onChange={handleChange}
            disabled={!profile.department}
          >
            <option value="">Выберите группу</option>
            {groups.map(grp => (
              <option key={grp._id} value={grp._id}>{grp.name}</option>
            ))}
          </select>

          <label htmlFor="login">Логин:</label>
          <input 
            type="text" 
            id="login" 
            value={`${profile.firstName} ${profile.lastName}`} 
            readOnly 
          />

          <label htmlFor="email">Электронная почта:</label>
          <input 
            type="email" 
            id="email" 
            value={profile.email} 
            onChange={handleChange} 
            required 
          />

          <label htmlFor="password">Новый пароль:</label>
          <input 
            type="password" 
            id="password" 
            placeholder="Введите новый пароль" 
          />

          <label htmlFor="avatar">Аватарка:</label>
          <input 
            type="file" 
            id="avatar" 
            accept="image/*" 
            onChange={handleFileChange} 
          />

          <button type="submit">Сохранить изменения</button>
        </form>
      </div>
    </div>
  );
};

export default SettingsSection;