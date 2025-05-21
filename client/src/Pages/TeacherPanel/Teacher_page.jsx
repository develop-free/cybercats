import { useState, useContext } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import { logoutUser } from '../../API/api';
import { toast } from 'react-toastify';
import EventsSection from '../Admin/all_events/EventsSection.jsx'
import StudentsSection from '../Admin/all_users/StudentsSection.jsx';
import AwardsPage from './Awards/Awards_page'
import './Teacher_page.css';

const TeacherPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { auth, setAuth } = useContext(AuthContext);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const activeSection = location.pathname.split('/')[2] || 'events';
  const teacherId = auth.user?._id;

  const handleNavigation = (section) => {
    navigate(`/teacher_dashboard/${section}`);
  };

  const handleLogout = async () => {
    try {
      await logoutUser();
      setAuth({ isAuthenticated: false, user: null });
      localStorage.removeItem('accessToken');
      toast.success('Выход выполнен успешно');
      navigate('/login');
    } catch (error) {
      console.error('Ошибка выхода:', error.response?.data || error);
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
      case 'events':
        return <EventsSection teacherId={teacherId} />;
      case 'students':
        return <StudentsSection teacherId={teacherId} />;
      case 'awards':
       return <AwardsPage teacherId={teacherId} />
      case 'profile':
        return (
          <div className="section-content">
            <h2>Настройки профиля</h2>
            <p>Редактирование информации о вашем профиле.</p>
          </div>
        );
      default:
        return <EventsSection teacherId={teacherId} />;
    }
  };

  return (
    <div className="teacher-page-container">
      <div className="sidebar">
        <div className="sidebar-header">
          <h3>CyberCats</h3>
          <p>Преподаватель</p>
        </div>

        <nav className="sidebar-menu">
          <button
            className={`sidebar-button ${activeSection === 'events' ? 'active' : ''}`}
            onClick={() => handleNavigation('events')}
          >
            Мероприятия
          </button>
          <button
            className={`sidebar-button ${activeSection === 'students' ? 'active' : ''}`}
            onClick={() => handleNavigation('students')}
          >
            Студенты
          </button>
          <button
            className={`sidebar-button ${activeSection === 'awards' ? 'active' : ''}`}
            onClick={() => handleNavigation('awards')}
          >
            Награды
          </button>
          <button
            className={`sidebar-button ${activeSection === 'profile' ? 'active' : ''}`}
            onClick={() => handleNavigation('profile')}
          >
            Настройки профиля
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

export default TeacherPage;