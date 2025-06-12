// PersonalAccount.jsx
import { useEffect, useState, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { toast } from 'react-toastify';
import avatar from '../../assets/images/avotar.png';
import { logoutUser } from '../../API/api';
import ProfileAPI from '../../API/profileAPI';
import './personal_account.css';

import ProfileSection from './Navigates/ProfileSection/ProfileSection';
import PortfolioSection from './Navigates/PortfolioSection/PortfolioSection';
import AchievementsSection from './Navigates/AchievementsSection/AchievementsSection';
import EventsSectionUser from './Navigates/EventsSection/EventsSectionUser';
import SettingsSection from './Navigates/SettingsSection/SettingsSection';

const LogoutModal = ({ isOpen, onClose, onConfirm }) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <h3>Подтверждение выхода</h3>
        <p>Вы уверены, что хотите выйти из аккаунта?</p>
        <div className="modal-actions">
          <button className="modal-button confirm" onClick={onConfirm}>
            Подтвердить
          </button>
          <button className="modal-button cancel" onClick={onClose}>
            Отмена
          </button>
        </div>
      </div>
    </div>
  );
};

const PersonalAccount = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [userData, setUserData] = useState({
    firstName: 'Новый',
    lastName: 'Пользователь',
    isNewUser: true,
    avatar: null,
    points: 0,
    level: 1,
  });
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const calculateProgress = (points, currentLevel) => {
    const pointsNeededForNextLevel = 50;
    const pointsInCurrentLevel = points % pointsNeededForNextLevel;
    return (pointsInCurrentLevel / pointsNeededForNextLevel) * 100;
  };

  const fetchUserProfile = useCallback(async () => {
    try {
      const profileResponse = await ProfileAPI.getProfile();
      console.log('Получен профиль:', profileResponse);
      const avatarUrl = profileResponse.data?.avatar
        ? profileResponse.data.avatar.startsWith('http')
          ? profileResponse.data.avatar
          : `http://localhost:5000/api${profileResponse.data.avatar}`
        : null;
      setUserData({
        firstName: profileResponse.data?.first_name || 'Новый',
        lastName: profileResponse.data?.last_name || 'Пользователь',
        isNewUser: profileResponse.isNewUser || false,
        avatar: avatarUrl,
        points: profileResponse.data?.points || 45,
        level: profileResponse.data?.level || 1,
      });
    } catch (error) {
      console.error('Ошибка при загрузке профиля:', error);
      toast.error('Не удалось загрузить профиль. Попробуйте снова.');
      if (error.response?.status === 401) {
        console.warn('Ошибка 401, перенаправление на /login');
        localStorage.removeItem('accessToken');
        navigate('/authorization');
      }
    }
  }, [navigate]);

  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    console.log('Проверка токена:', token ? 'Токен присутствует' : 'Токен отсутствует');
    if (!token) {
      console.warn('Токен отсутствует, перенаправление на /login');
      navigate('/authorization');
      return;
    }
    fetchUserProfile();
  }, [navigate, fetchUserProfile]);

  const handleProfileUpdate = (updatedData) => {
    console.log('Обновленные данные профиля:', updatedData);
    const avatarUrl = updatedData.avatar
      ? updatedData.avatar.startsWith('http')
        ? updatedData.avatar
        : `http://localhost:5000/api${updatedData.avatar}`
      : null;
    setUserData((prev) => ({
      ...prev,
      firstName: updatedData.first_name || prev.firstName,
      lastName: updatedData.last_name || prev.lastName,
      isNewUser: updatedData.isNewUser || false,
      avatar: avatarUrl,
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
      navigate('/authorization');
      toast.success('Выход выполнен успешно!');
    } catch (error) {
      console.error('Ошибка при выходе:', error);
      toast.error(error.message || 'Произошла ошибка при выходе из аккаунта.');
    }
    setShowLogoutModal(false);
  };

  const openLogoutModal = () => {
    setShowLogoutModal(true);
  };

  const closeLogoutModal = () => {
    setShowLogoutModal(false);
  };

  const handleAvatarError = (e) => {
    console.log('Ошибка загрузки аватара:', e.target.src);
    e.target.src = avatar;
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
        return <EventsSectionUser />;
      case 'settings':
        return (
          <SettingsSection
            onProfileUpdate={handleProfileUpdate}
            initialData={userData}
          />
        );
      default:
        return <ProfileSection userData={userData} />;
    }
  };

  return (
    <div className="personal-cabinet-container">
      <div className="sidebar">
        <div className="sidebar-header">
          <img
            src={userData.avatar || avatar}
            alt="Аватар"
            onError={handleAvatarError}
            className="sidebar-avatar"
          />
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
        <button className="sidebar-button logout" onClick={openLogoutModal}>
          Выход
        </button>
      </div>

      <div className="content">
        {renderSection()}
      </div>

      <LogoutModal
        isOpen={showLogoutModal}
        onClose={closeLogoutModal}
        onConfirm={handleLogout}
      />
    </div>
  );
};

export default PersonalAccount;