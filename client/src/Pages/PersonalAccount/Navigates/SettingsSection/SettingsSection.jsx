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
    admissionYear: new Date().getFullYear(),
  });

  const [departments, setDepartments] = useState([]);
  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isNewUser, setIsNewUser] = useState(false);
  const [password, setPassword] = useState('');

  const validateName = (name) => {
    return /^[А-Яа-яЁёA-Za-z\s-]+$/u.test(name);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        const [profileResponse, departmentsResponse] = await Promise.all([
          ProfileAPI.getProfile().catch(e => ({ isNewUser: true, data: null })),
          ProfileAPI.getDepartments().catch(() => [])
        ]);

        const normalizedDepartments = Array.isArray(departmentsResponse?.data)
          ? departmentsResponse.data
          : Array.isArray(departmentsResponse)
            ? departmentsResponse
            : [];

        const profileData = profileResponse?.data || profileResponse || {};
        const isEmptyProfile = !profileData ||
          (!profileData.firstName && !profileData.lastName && !profileData.email);

        setProfile({
          ...profileData,
          lastName: profileData.lastName || '',
          firstName: profileData.firstName || '',
          middleName: profileData.middleName || '',
          birthdate: profileData.birthDate?.split('T')[0] || '',
          department: profileData.department?._id || '',
          group: profileData.group?._id || '',
          login: profileData.login || '',
          email: profileData.email || profileData.user?.email || '',
          avatar: profileData.avatar || null,
          admissionYear: profileData.admissionYear || new Date().getFullYear(),
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

  const handleChange = (e) => {
    const { id, value } = e.target;

    if (['lastName', 'firstName', 'middleName'].includes(id)) {
      if (value && !validateName(value)) {
        return;
      }
    }

    setProfile(prev => ({ ...prev, [id]: value }));
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };

  const handleFileChange = (e) => {
    setProfile(prev => ({ ...prev, avatar: e.target.files[0] }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      
      // Добавляем только заполненные поля
      if (profile.lastName) formData.append('lastName', profile.lastName);
      if (profile.firstName) formData.append('firstName', profile.firstName);
      if (profile.middleName) formData.append('middleName', profile.middleName);
      if (profile.birthdate) formData.append('birthDate', profile.birthdate);
      if (profile.department) formData.append('department', profile.department);
      if (profile.group) formData.append('group', profile.group);
      if (profile.email) formData.append('email', profile.email);
      if (profile.admissionYear) formData.append('admissionYear', profile.admissionYear);

      if (isNewUser && password) {
        formData.append('password', password);
      }

      if (profile.avatar instanceof File) {
        formData.append('avatar', profile.avatar);
      }

      const response = await ProfileAPI.updateProfile(formData);

      if (response?.success) {
        alert(isNewUser ? 'Профиль успешно создан!' : 'Профиль успешно сохранен!');

        const updatedProfile = await ProfileAPI.getProfile();
        if (updatedProfile?.data) {
          setProfile({
            ...updatedProfile.data,
            birthdate: updatedProfile.data.birthDate?.split('T')[0] || '',
            department: updatedProfile.data.department?._id || '',
            group: updatedProfile.data.group?._id || '',
            admissionYear: updatedProfile.data.admissionYear || new Date().getFullYear(),
            email: updatedProfile.data.email || updatedProfile.data.user?.email || ''
          });
          setIsNewUser(false);
        }
      } else {
        alert(response?.message || 'Ошибка при сохранении профиля');
      }
    } catch (error) {
      console.error('Ошибка при сохранении профиля:', error);
      alert(
        error.validationErrors 
          ? error.validationErrors.join('\n')
          : error.message || 'Произошла ошибка при сохранении профиля'
      );
    }
  };

  if (loading) {
    return (
      <div className="section loading">
        <div className="spinner"></div>
        <p>Загрузка данных профиля...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="section error">
        <p>{error}</p>
        <button onClick={() => window.location.reload()}>Обновить страницу</button>
      </div>
    );
  }

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
          <div className="form-section">
            <h3>Личные данные</h3>
            <label htmlFor="lastName">Фамилия *</label>
            <input
              type="text"
              id="lastName"
              value={profile.lastName}
              onChange={handleChange}
              required
              pattern="[А-Яа-яЁёA-Za-z\s-]+"
              title="Только буквы и дефисы"
            />

            <label htmlFor="firstName">Имя *</label>
            <input
              type="text"
              id="firstName"
              value={profile.firstName}
              onChange={handleChange}
              required
              pattern="[А-Яа-яЁёA-Za-z\s-]+"
              title="Только буквы и дефисы"
            />

            <label htmlFor="middleName">Отчество</label>
            <input
              type="text"
              id="middleName"
              value={profile.middleName}
              onChange={handleChange}
              pattern="[А-Яа-яЁёA-Za-z\s-]*"
              title="Только буквы и дефисы"
            />

            <label htmlFor="birthdate">Дата рождения</label>
            <input
              type="date"
              id="birthdate"
              value={profile.birthdate}
              onChange={handleChange}
            />
          </div>

          <div className="form-section">
            <h3>Учебная информация</h3>
            <label htmlFor="admissionYear">Год поступления *</label>
            <input
              type="number"
              id="admissionYear"
              min="2000"
              max={new Date().getFullYear()}
              value={profile.admissionYear}
              onChange={handleChange}
              required
            />

            <label htmlFor="department">Отделение</label>
            <select
              id="department"
              value={profile.department || ''}
              onChange={handleChange}
            >
              <option value="">Выберите отделение</option>
              {departments.map(dept => (
                <option key={`dept-${dept._id}`} value={dept._id}>
                  {dept.name}
                </option>
              ))}
            </select>

            <label htmlFor="group">Группа</label>
            <select
              id="group"
              value={profile.group || ''}
              onChange={handleChange}
              disabled={!profile.department || groups.length === 0}
            >
              <option value="">Выберите группу</option>
              {groups.map(grp => (
                <option key={`grp-${grp._id}`} value={grp._id}>
                  {grp.name}
                </option>
              ))}
            </select>
          </div>

          <div className="form-section">
            <h3>Учетные данные</h3>
            <label htmlFor="email">Электронная почта *</label>
            <input
              type="email"
              id="email"
              value={profile.email}
              onChange={handleChange}
              required
              readOnly={!isNewUser}
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