import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { toast } from 'react-toastify';
import avatar from '../../assets/images/avotar.png';
import { logoutUser } from '../../API/api';
import './personal_account.css';

const PersonalAccount = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // Проверка авторизации при загрузке компонента
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (!user) {
      toast.error('Пожалуйста, войдите в систему');
      navigate('/authorization'); // Перенаправляем на страницу входа, если пользователь не авторизован
    }
  }, [navigate]);

  // Определяем активный раздел на основе текущего пути
  const activeSection = location.pathname.split('/')[2] || 'profile';

  const handleNavigation = (section) => {
    navigate(`/personal_account/${section}`);
  };

  // Обработка выхода из системы
  const handleLogout = async () => {
    try {
      await logoutUser();
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      navigate('/authorization');
      toast.success('Выход выполнен успешно!', {
        position: 'top-right',
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    } catch (error) {
      toast.error(error.message || 'Произошла ошибка при выходе из аккаунта.', {
        position: 'top-right',
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    }
  };

  // Рендер активного раздела
  const renderSection = () => {
    switch (activeSection) {
      case 'profile':
        return <ProfileSection />;
      case 'portfolio':
        return <PortfolioSection />;
      case 'achievements':
        return <AchievementsSection />;
      case 'events':
        return <EventsSection />;
      case 'settings':
        return <SettingsSection />;
      default:
        return <ProfileSection />;
    }
  };

  return (
    <div className="personal-cabinet-container">
      {/* Боковое меню */}
      <div className="sidebar">
        <div className="sidebar-header">
          <img src={avatar} alt="Аватар" />
          <h3>Иван Петров</h3>
          <p>Студент</p>
        </div>

        {/* Прогресс-бар и уровень */}
        <div className="level-progress">
          <div className="progress-bar">
            <div className="progress-fill" style={{ width: '60%' }}></div>
          </div>
          <div className="level-info">
            <span className="points">1200 баллов</span>
            <span className="level">Уровень 5</span>
          </div>
        </div>

        {/* Меню */}
        <nav className="sidebar-menu">
          <button
            className={`sidebar-button ${activeSection === 'profile' ? 'active' : ''}`}
            onClick={() => handleNavigation('profile')}
          >
            Мой профиль
          </button>
          <button
            className={`sidebar-button ${activeSection === 'portfolio' ? 'active' : ''}`}
            onClick={() => handleNavigation('portfolio')}
          >
            Моё портфолио
          </button>
          <button
            className={`sidebar-button ${activeSection === 'achievements' ? 'active' : ''}`}
            onClick={() => handleNavigation('achievements')}
          >
            Мои достижения
          </button>
          <button
            className={`sidebar-button ${activeSection === 'events' ? 'active' : ''}`}
            onClick={() => handleNavigation('events')}
          >
            Мероприятия
          </button>
          <button
            className={`sidebar-button ${activeSection === 'settings' ? 'active' : ''}`}
            onClick={() => handleNavigation('settings')}
          >
            Настройки профиля
          </button>
        </nav>
        <button className="sidebar-button logout" onClick={handleLogout}>
          Выход
        </button>
      </div>

      {/* Контентная область */}
      <div className="content">
        {renderSection()}
      </div>
    </div>
  );
};

// Компоненты для каждого раздела
const ProfileSection = () => {
  return (
    <div className="section" id="main-section">
      <h2>Мой профиль</h2>
      <p>Здесь вы можете отслеживать свои достижения, участвовать в мероприятиях и управлять настройками профиля.</p>
      <div className="stats">
        <div className="stat-card">
          <h3>Баллы</h3>
          <p>1200</p>
        </div>
        <div className="stat-card">
          <h3>Достижения</h3>
          <p>15</p>
        </div>
        <div className="stat-card">
          <h3>Мероприятия</h3>
          <p>8</p>
        </div>
      </div>
    </div>
  );
};

const PortfolioSection = () => {
  return (
    <div className="section" id="portfolio-section">
      <h2>Моё портфолио</h2>
      <p>Здесь будут отображаться ваши проекты и работы.</p>
      <div className="portfolio-list">
        <div className="portfolio-card">
          <h3>Проект "Технологии будущего"</h3>
          <p>Описание: Разработка инновационного решения для образования.</p>
        </div>
        <div className="portfolio-card">
          <h3>Проект "Искусственный интеллект"</h3>
          <p>Описание: Исследование возможностей ИИ в медицине.</p>
        </div>
      </div>
    </div>
  );
};

const AchievementsSection = () => {
  return (
    <div className="section" id="achievements-section">
      <h2>Мои достижения</h2>
      <div className="achievements-list">
        <div className="achievement-card">
          <h3>Квест "Технологии будущего"</h3>
          <p>Выполнено: 10 заданий</p>
          <p>Награда: 300 баллов</p>
        </div>
        <div className="achievement-card">
          <h3>Лекция "Искусственный интеллект"</h3>
          <p>Посещено: 5 лекций</p>
          <p>Награда: 150 баллов</p>
        </div>
      </div>
    </div>
  );
};

const EventsSection = () => {
  return (
    <div className="section" id="events-section">
      <h2>Мероприятия</h2>
      <div className="events-list">
        <div className="event-card">
          <h3>Квест "Технологии будущего"</h3>
          <p>Дата: 25.10.2023</p>
          <p>Место: Аудитория 301</p>
        </div>
        <div className="event-card">
          <h3>Лекция "Искусственный интеллект"</h3>
          <p>Дата: 30.10.2023</p>
          <p>Место: Аудитория 202</p>
        </div>
      </div>
    </div>
  );
};

const SettingsSection = () => {
  return (
    <div className="section" id="settings-section">
      <h2>Настройки профиля</h2>
      <form className="settings-form">
        <label htmlFor="username">Имя пользователя:</label>
        <input type="text" id="username" defaultValue="Иван Петров" />

        <label htmlFor="email">Электронная почта:</label>
        <input type="email" id="email" defaultValue="ivan.petrov@example.com" />

        <label htmlFor="password">Новый пароль:</label>
        <input type="password" id="password" placeholder="Введите новый пароль" />

        <button type="submit">Сохранить изменения</button>
      </form>
    </div>
  );
};

export default PersonalAccount;