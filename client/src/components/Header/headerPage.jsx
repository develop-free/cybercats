import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import './headerPage.css';
import logo from '../../assets/images/logo_tab.png';

const Header = () => {
    const navigate = useNavigate();
    const location = useLocation(); // Для определения текущего пути
    const [activeNav, setActiveNav] = useState(location.pathname); // Состояние активного пункта меню
    const [hoverNav, setHoverNav] = useState(null); // Состояние для наведения

    const handleSignInClick = () => {
        navigate('/authorization'); // Переход на страницу авторизации
    };

    const handleNavClick = (path) => {
        setActiveNav(path); // Устанавливаем активный пункт меню при клике
    };

    const handleNavHover = (path) => {
        setHoverNav(path); // Устанавливаем временное состояние при наведении
    };

    const handleNavLeave = () => {
        setHoverNav(null); // Сбрасываем состояние наведения
    };

    return (
        <header>
            <div className="logo">
                <img src={logo} alt="logo" />
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
            <button id="sign-in" onClick={handleSignInClick}>Войти</button>
        </header>
    );
};

export default Header;