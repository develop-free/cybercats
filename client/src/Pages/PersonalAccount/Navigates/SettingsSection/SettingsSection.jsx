import React, { useEffect, useState } from 'react';
import './SettingsSection.css';
import ProfileAPI from '../../../../API/profileAPI';

const SettingsSection = () => {
  // Состояние профиля пользователя
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

  // Состояния для данных и загрузки
  const [departments, setDepartments] = useState([]);
  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isNewUser, setIsNewUser] = useState(false);
  const [password, setPassword] = useState('');

  // Загрузка данных профиля и отделений
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Параллельная загрузка профиля и отделений
        const [profileResponse, departmentsResponse] = await Promise.all([
          ProfileAPI.getProfile().catch(e => ({ isNewUser: true, data: null })),
          ProfileAPI.getDepartments().catch(() => [])
        ]);

        // Нормализация данных отделений
        const normalizedDepartments = Array.isArray(departmentsResponse?.data) 
          ? departmentsResponse.data 
          : Array.isArray(departmentsResponse)
            ? departmentsResponse
            : [];

        // Обработка данных профиля
        const profileData = profileResponse?.data || profileResponse || {};
        const isEmptyProfile = !profileData || 
          (!profileData.firstName && !profileData.lastName && !profileData.email);

        // Установка состояний
        setProfile({
          lastName: profileData.lastName || '',
          firstName: profileData.firstName || '',
          middleName: profileData.middleName || '',
          birthdate: profileData.birthDate?.split('T')[0] || '',
          department: profileData.department?._id || '',
          group: profileData.group?._id || '',
          login: profileData.login || '',
          email: profileData.email || '',
          avatar: profileData.avatar || null,
        });

        setIsNewUser(isEmptyProfile);
        setDepartments(normalizedDepartments);
      } catch (err) {
        console.error('Ошибка при получении данных:', err);
        setError('Не удалось загрузить данные профиля. Пожалуйста, обновите страницу.');
        setDepartments([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Загрузка групп при изменении отделения
  useEffect(() => {
    const fetchGroups = async () => {
      if (!profile.department) {
        setGroups([]);
        return;
      }

      try {
        const groupsResponse = await ProfileAPI.getGroups(profile.department);
        const normalizedGroups = Array.isArray(groupsResponse?.data) 
          ? groupsResponse.data 
          : Array.isArray(groupsResponse)
            ? groupsResponse
            : [];
        
        setGroups(normalizedGroups);
      } catch (err) {
        console.error('Ошибка при получении групп:', err);
        setGroups([]);
      }
    };

    fetchGroups();
  }, [profile.department]);

  // Обработчики изменений
  const handleChange = (e) => {
    const { id, value } = e.target;
    setProfile(prev => ({ ...prev, [id]: value }));
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };

  const handleFileChange = (e) => {
    setProfile(prev => ({ ...prev, avatar: e.target.files[0] }));
  };

  // Отправка формы
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      
      // Добавляем все поля профиля
      Object.entries(profile).forEach(([key, value]) => {
        if (value !== null && value !== undefined) {
          formData.append(key, value);
        }
      });

      // Для нового пользователя добавляем пароль
      if (isNewUser && password) {
        formData.append('password', password);
      }

      // Отправка данных
      const response = await ProfileAPI.updateProfile(formData);

      if (response?.success) {
        alert(isNewUser ? 'Профиль успешно создан!' : 'Профиль успешно сохранен!');
        
        // Обновление данных после сохранения
        const updatedProfile = await ProfileAPI.getProfile();
        if (updatedProfile?.data) {
          setProfile({
            ...updatedProfile.data,
            birthdate: updatedProfile.data.birthDate?.split('T')[0] || '',
            department: updatedProfile.data.department?._id || '',
            group: updatedProfile.data.group?._id || ''
          });
          setIsNewUser(false);
        }
      } else {
        alert(response?.message || 'Ошибка при сохранении профиля');
      }
    } catch (error) {
      console.error('Ошибка при сохранении профиля:', error);
      alert('Произошла ошибка при сохранении профиля');
    }
  };

  // Отображение состояния загрузки
  if (loading) {
    return (
      <div className="section loading">
        <div className="spinner"></div>
        <p>Загрузка данных профиля...</p>
      </div>
    );
  }

  // Отображение ошибки
  if (error) {
    return (
      <div className="section error">
        <p>{error}</p>
        <button onClick={() => window.location.reload()}>Обновить страницу</button>
      </div>
    );
  }

  // Основной рендеринг формы
  return (
    <div className="section" id="settings-section">
      <div className="heading-fixed">
        <h2>{isNewUser ? 'Заполните ваш профиль' : 'Настройки профиля'}</h2>
        {isNewUser && (
          <div className="new-user-notice">
            <p>Пожалуйста, заполните обязательную информацию о себе, чтобы продолжить использование сервиса.</p>
          </div>
        )}
      </div>
      
      <div className='center-form'>
        <form className="settings-form" onSubmit={handleSubmit}>
          {/* Личные данные */}
          <div className="form-section">
            <h3>Личные данные</h3>
            <label htmlFor="lastName">Фамилия *</label>
            <input
              type="text"
              id="lastName"
              value={profile.lastName}
              onChange={handleChange}
              required
            />

            <label htmlFor="firstName">Имя *</label>
            <input
              type="text"
              id="firstName"
              value={profile.firstName}
              onChange={handleChange}
              required
            />

            <label htmlFor="middleName">Отчество</label>
            <input
              type="text"
              id="middleName"
              value={profile.middleName}
              onChange={handleChange}
            />

            <label htmlFor="birthdate">Дата рождения</label>
            <input
              type="date"
              id="birthdate"
              value={profile.birthdate}
              onChange={handleChange}
            />
          </div>

          {/* Учебная информация */}
          <div className="form-section">
            <h3>Учебная информация</h3>
            <label htmlFor="department">Отделение</label>
            <select
              id="department"
              value={profile.department}
              onChange={handleChange}
            >
              <option value="">Выберите отделение</option>
              {departments.map(dept => (
                <option key={dept._id} value={dept._id}>
                  {dept.name}
                </option>
              ))}
            </select>

            <label htmlFor="group">Группа</label>
            <select
              id="group"
              value={profile.group}
              onChange={handleChange}
              disabled={!profile.department}
            >
              <option value="">Выберите группу</option>
              {groups.map(grp => (
                <option key={grp._id} value={grp._id}>
                  {grp.name}
                </option>
              ))}
            </select>
          </div>

          {/* Учетные данные */}
          <div className="form-section">
            <h3>Учетные данные</h3>
            <label htmlFor="email">Электронная почта *</label>
            <input
              type="email"
              id="email"
              value={profile.email}
              onChange={handleChange}
              required
            />

            <label htmlFor="password">
              {isNewUser ? 'Пароль *' : 'Новый пароль'}
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={handlePasswordChange}
              placeholder={isNewUser ? 'Введите пароль' : 'Оставьте пустым, если не нужно менять'}
              required={isNewUser}
            />
          </div>

          {/* Аватар */}
          <div className="form-section">
            <h3>Аватар</h3>
            <label htmlFor="avatar">Загрузить изображение</label>
            <input
              type="file"
              id="avatar"
              accept="image/*"
              onChange={handleFileChange}
            />
            {profile.avatar && typeof profile.avatar === 'string' && (
              <div className="avatar-preview">
                <img 
                  src={profile.avatar} 
                  alt="Текущий аватар" 
                  onError={(e) => e.target.style.display = 'none'}
                />
              </div>
            )}
          </div>

          <button type="submit" className="save-button">
            {isNewUser ? 'Создать профиль' : 'Сохранить изменения'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default SettingsSection;