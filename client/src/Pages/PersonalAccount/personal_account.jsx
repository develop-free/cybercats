import { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { toast } from 'react-toastify';
import avatar from '../../assets/images/avotar.png';
import { logoutUser } from '../../API/api';
import ProfileAPI from '../../API/profileAPI';
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
  const [userData, setUserData] = useState({
    firstName: 'Новый',
    lastName: 'Пользователь',
    isNewUser: true,
    avatar: null
  });

  const calculateProgress = (points, currentLevel) => {
  const pointsNeededForNextLevel = 100; // или другая логика
  const pointsInCurrentLevel = points % pointsNeededForNextLevel;
  return (pointsInCurrentLevel / pointsNeededForNextLevel) * 100;
};

  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    if (!token) {
      navigate('/login');
    } else {
      fetchUserProfile();
    }
  }, [navigate]);

 const fetchUserProfile = async () => {
  try {
    const profileResponse = await ProfileAPI.getProfile();
    setUserData({
      firstName: profileResponse.data?.first_name || 'Новый',
      lastName: profileResponse.data?.last_name || 'Пользователь',
      isNewUser: profileResponse.isNewUser || !profileResponse.data,
      avatar: profileResponse.data?.avatar || null,
      points: profileResponse.data?.points || 0,    // 0 если нет данных
      level: profileResponse.data?.level || 1       // 1 если нет данных
    });
  } catch (error) {
    console.error('Ошибка при загрузке профиля:', error);
  }
};


  const handleProfileUpdate = (updatedData) => {
    setUserData(prev => ({
      ...prev,
      firstName: updatedData.first_name || prev.firstName,
      lastName: updatedData.last_name || prev.lastName,
      isNewUser: false,
      avatar: updatedData.avatar || prev.avatar
    }));
  };

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
      toast.success('Выход выполнен успешно!');
    } catch (error) {
      toast.error(error.message || 'Произошла ошибка при выходе из аккаунта.');
    }
  };

  const renderSection = () => {
    switch (activeSection) {
      case 'profile':
        return <ProfileSection userData={userData} />;
      case 'portfolio':
        return <PortfolioSection />;
      case 'achievements':
        return <AchievementsSection />;
      case 'events':
        return <EventsSection />;
      case 'settings':
        return <SettingsSection 
                 onProfileUpdate={handleProfileUpdate} 
                 initialData={userData}
               />;
      default:
        return <ProfileSection userData={userData} />;
    }
  };

  return (
    <div className="personal-cabinet-container">
      <div className="sidebar">
        <div className="sidebar-header">
          <img src={userData.avatar || avatar} alt="Аватар" />
          <h3>{`${userData.firstName} ${userData.lastName}`}</h3>
          <p>Студент</p>
        </div>

        <div className="level-progress">
          <div className="progress-bar">
            <div 
              className="progress-fill" 
              style={{ width: `${calculateProgress(userData.points, userData.level)}%` }}
            ></div>
          </div>
          <div className="level-info">
            <span className="points">{userData.points} баллов</span>
            <span className="level">Уровень {userData.level}</span>
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