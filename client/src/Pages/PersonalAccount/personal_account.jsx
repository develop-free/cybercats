import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { toast } from 'react-toastify';
import avatar from '../../assets/images/avotar.png';
import { logoutUser } from '../../API/api';
import './personal_account.css';

// Импорт компонентов разделов
import ProfileSection from './Navigates/ProfileSection/ProfileSection';
import PortfolioSection from './Navigates/PortfolioSection/PortfolioSection';
import AchievementsSection from './Navigates/AchievementsSection/AchievementsSection';
import EventsSection from './Navigates/EventsSection/EventsSection';
import SettingsSection from './Navigates/SettingsSection/SettingsSection';

const PersonalAccount = () => {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    if (!token) {
      navigate('/login');
    }
  }, [navigate]);

  const activeSection = location.pathname.split('/')[2] || 'profile';

  const handleNavigation = (section) => {
    navigate(`/personal_account/${section}`);
  };

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
      <div className="sidebar">
        <div className="sidebar-header">
          <img src={avatar} alt="Аватар" />
          <h3>Иван Петров</h3>
          <p>Студент</p>
        </div>

        <div className="level-progress">
          <div className="progress-bar">
            <div className="progress-fill" style={{ width: '60%' }}></div>
          </div>
          <div className="level-info">
            <span className="points">1200 баллов</span>
            <span className="level">Уровень 5</span>
          </div>
        </div>

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

      <div className="content">
        {renderSection()}
      </div>
    </div>
  );
};

export default PersonalAccount;