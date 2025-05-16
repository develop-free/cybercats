import { useLocation, useNavigate } from 'react-router-dom';
import EventsSection from './all_events/EventsSection.jsx';
import TeachersSection from './all_teachers/TeachersSection.jsx';
import StudentsSection from './all_users/StudentsSection.jsx';

const AdminPanel = () => {
  const location = useLocation();
  const navigate = useNavigate();


  const activeSection = location.pathname.split('/')[2] || 'events_all';

  const handleNavigation = (section) => {
    navigate(`/admin_dashboard/${section}`);
  };

  const handleLogout = () => {
    console.log('Logout clicked');
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

export default AdminPanel;