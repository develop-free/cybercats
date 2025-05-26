import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import './headerPage.css';
import logo from '../../assets/images/logo_tab.png';

const Header = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [activeNav, setActiveNav] = useState(location.pathname);
  const [hoverNav, setHoverNav] = useState(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleSignInClick = () => {
    navigate('/authorization');
    setIsMenuOpen(false); // Закрываем меню при клике
  };

  const handleNavClick = (path) => {
    setActiveNav(path);
    setIsMenuOpen(false); // Закрываем меню при выборе пункта
  };

  const handleNavHover = (path) => {
    setHoverNav(path);
  };

  const handleNavLeave = () => {
    setHoverNav(null);
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <header className="main-header">
      <div className="logo">
        <img src={logo} alt="Cyber Cats Logo" />
      </div>
      <nav className="navbar">
        <Link
          className={`navbar-button ${activeNav === '/' && !hoverNav ? 'active' : ''}`}
          to="/"
          onClick={() => handleNavClick('/')}
          onMouseEnter={() => handleNavHover('/')}
          onMouseLeave={handleNavLeave}
        >
          Главная
        </Link>
        <Link
          className={`navbar-button ${activeNav === '/student' && !hoverNav ? 'active' : ''}`}
          to="/student"
          onClick={() => handleNavClick('/student')}
          onMouseEnter={() => handleNavHover('/student')}
          onMouseLeave={handleNavLeave}
        >
          Студенту
        </Link>
        <Link
          className={`navbar-button ${activeNav === '/teacher' && !hoverNav ? 'active' : ''}`}
          to="/teacher"
          onClick={() => handleNavClick('/teacher')}
          onMouseEnter={() => handleNavHover('/teacher')}
          onMouseLeave={handleNavLeave}
        >
          Преподавателю
        </Link>
        <Link
          className={`navbar-button ${activeNav === '/rating' && !hoverNav ? 'active' : ''}`}
          to="/rating"
          onClick={() => handleNavClick('/rating')}
          onMouseEnter={() => handleNavHover('/rating')}
          onMouseLeave={handleNavLeave}
        >
          Рейтинг
        </Link>
      </nav>
      <button id="sign-in" onClick={handleSignInClick}>
        Войти
      </button>
      <div className="burger-menu" onClick={toggleMenu}>
        <span className={isMenuOpen ? 'burger-icon open' : 'burger-icon'}></span>
      </div>
      <div className={`mobile-menu ${isMenuOpen ? 'open' : ''}`}>
        <div className="mobile-menu-content">
          <Link
            className={`mobile-nav-button ${activeNav === '/' ? 'active' : ''}`}
            to="/"
            onClick={() => handleNavClick('/')}
          >
            Главная
          </Link>
          <Link
            className={`mobile-nav-button ${activeNav === '/student' ? 'active' : ''}`}
            to="/student"
            onClick={() => handleNavClick('/student')}
          >
            Студенту
          </Link>
          <Link
            className={`mobile-nav-button ${activeNav === '/teacher' ? 'active' : ''}`}
            to="/teacher"
            onClick={() => handleNavClick('/teacher')}
          >
            Преподавателю
          </Link>
          <Link
            className={`mobile-nav-button ${activeNav === '/rating' ? 'active' : ''}`}
            to="/rating"
            onClick={() => handleNavClick('/rating')}
          >
            Рейтинг
          </Link>
          <button className="mobile-sign-in" onClick={handleSignInClick}>
            Войти
          </button>
          <div className="mobile-contact">
            <h3>+7 (904) 404-39-34</h3>
            <h3>ditalone@mail.ru</h3>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;