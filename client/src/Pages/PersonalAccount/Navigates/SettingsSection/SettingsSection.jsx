import React, { useEffect, useState } from 'react';
import './SettingsSection.css';

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

  useEffect(() => {
    // Fetch profile data
    fetch('/api/students/profile', {
      method: 'GET',
      credentials: 'include',
    })
      .then(response => response.json())
      .then(data => setProfile(data))
      .catch(error => console.error('Error fetching profile:', error));

    // Fetch departments
    fetch('/api/students/departments')
      .then(response => response.json())
      .then(data => setDepartments(data))
      .catch(error => console.error('Error fetching departments:', error));
  }, []);

  useEffect(() => {
    if (profile.department) {
      // Fetch groups based on selected department
      fetch(`/api/students/groups/${profile.department}`)
        .then(response => response.json())
        .then(data => setGroups(data))
        .catch(error => console.error('Error fetching groups:', error));
    }
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

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('lastName', profile.lastName);
    formData.append('firstName', profile.firstName);
    formData.append('middleName', profile.middleName);
    formData.append('birthdate', profile.birthdate);
    formData.append('department', profile.department);
    formData.append('group', profile.group);
    formData.append('email', profile.email);
    if (profile.avatar) {
      formData.append('avatar', profile.avatar);
    }

    fetch('/api/students/profile', {
      method: 'PUT',
      body: formData,
      credentials: 'include',
    })
      .then(response => response.json())
      .then(data => {
        if (data.message === 'Профиль успешно сохранен') {
          alert('Profile saved successfully!');
        } else {
          alert('Error saving profile.');
        }
      })
      .catch(error => console.error('Error saving profile:', error));
  };

  return (
    <div className="section" id="settings-section">
      <div className="heading-fixed">
        <h2>Настройки профиля</h2>
      </div>
      <div className='center-form'>
        <form className="settings-form" onSubmit={handleSubmit}>
          <label htmlFor="lastName">Фамилия:</label>
          <input type="text" id="lastName" value={profile.lastName} onChange={handleChange} />

          <label htmlFor="firstName">Имя:</label>
          <input type="text" id="firstName" value={profile.firstName} onChange={handleChange} />

          <label htmlFor="middleName">Отчество:</label>
          <input type="text" id="middleName" value={profile.middleName} onChange={handleChange} />

          <label htmlFor="birthdate">Дата рождения:</label>
          <input type="date" id="birthdate" value={profile.birthdate} onChange={handleChange} />

          <label htmlFor="department">Отделение:</label>
          <select id="department" value={profile.department} onChange={handleChange}>
            <option value="">Выберите отделение</option>
            {departments.map(dept => (
              <option key={dept._id} value={dept._id}>{dept.name}</option>
            ))}
          </select>

          <label htmlFor="group">Группа:</label>
          <select id="group" value={profile.group} onChange={handleChange}>
            <option value="">Выберите группу</option>
            {groups.map(grp => (
              <option key={grp._id} value={grp._id}>{grp.name}</option>
            ))}
          </select>

          <label htmlFor="login">Логин:</label>
          <input type="text" id="login" value={`${profile.firstName} ${profile.lastName}`} readOnly />

          <label htmlFor="email">Электронная почта:</label>
          <input type="email" id="email" value={profile.email} onChange={handleChange} />

          <label htmlFor="password">Новый пароль:</label>
          <input type="password" id="password" placeholder="Введите новый пароль" />

          <label htmlFor="avatar">Аватарка:</label>
          <input type="file" id="avatar" accept="image/*" onChange={handleFileChange} />

          <button type="submit">Сохранить изменения</button>
        </form>
      </div>
    </div>
  );
};

export default SettingsSection;
