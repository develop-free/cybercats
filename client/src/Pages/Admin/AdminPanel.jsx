import { useState, useContext } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import { logoutUser } from '../../API/api';
import { toast } from 'react-toastify';
import EventsSection from './all_events/EventsSection.jsx';
import TeachersSection from './all_teachers/TeachersSection.jsx';
import StudentsSection from './all_users/StudentsSection.jsx';
import './AdminPanel.css';

const AdminPanel = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { setAuth } = useContext(AuthContext);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const activeSection = location.pathname.split('/')[2] || 'events_all';

  const handleNavigation = (section) => {
    navigate(`/admin_dashboard/${section}`);
  };

  const handleLogout = async () => {
    try {
      await logoutUser();
      setAuth({ isAuthenticated: false, user: null });
      localStorage.removeItem('accessToken');
      toast.success('Выход выполнен успешно');
      navigate('/login');
    } catch (error) {
      console.error('Logout error:', error.response?.data || error);
      setAuth({ isAuthenticated: false, user: null });
      localStorage.removeItem('accessToken');
      toast.error('Сессия истекла или произошла ошибка. Пожалуйста, войдите снова.');
      navigate('/login');
    }
  };

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const confirmLogout = async () => {
    await handleLogout();
    closeModal();
  };

  const renderSection = () => {
    switch (activeSection) {
      case 'events_all':
        return <EventsSection />;
      case 'teachers_all':
        return <TeachersSection />;
      case 'students_all':
        return <StudentsSection />;
      default:
        return <EventsSection />;
    }
  };

  return (
    <div className="personal-cabinet-container">
      <div className="sidebar">
        <div className="sidebar-header">
          <h3>CyberCats</h3>
          <p>Админ</p>
        </div>

        <nav className="sidebar-menu">
          <button
            className={`sidebar-button ${activeSection === 'events_all' ? 'active' : ''}`}
            onClick={() => handleNavigation('events_all')}
          >
            Все мероприятия
          </button>
          <button
            className={`sidebar-button ${activeSection === 'teachers_all' ? 'active' : ''}`}
            onClick={() => handleNavigation('teachers_all')}
          >
            Преподаватели
          </button>
          <button
            className={`sidebar-button ${activeSection === 'students_all' ? 'active' : ''}`}
            onClick={() => handleNavigation('students_all')}
          >
            Студенты
          </button>
        </nav>
        <button className="sidebar-button logout" onClick={openModal}>
          Выход
        </button>
      </div>

      <div className="content">
        {renderSection()}
      </div>

      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal">
            <h2>Подтверждение выхода</h2>
            <p>Вы уверены, что хотите выйти из системы?</p>
            <div className="modal-buttons">
              <button className="modal-button confirm" onClick={confirmLogout}>
                Да, выйти
              </button>
              <button className="modal-button cancel" onClick={closeModal}>
                Отмена
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminPanel;