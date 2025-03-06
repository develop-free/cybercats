import React from 'react';
import './headerPage.css';
import logo from '../../assets/images/logo_tab.png';

const Header = () => {
  return (
      <header>
        <div className="logo">
          <img src={logo} alt="logo" />
        </div>
        <nav className="navbar">
          <a className="navbar-button" href="home.html">Главная</a>
          <a className="navbar-button" href="student.html">Студенту</a>
          <a className="navbar-button" href="teacher.html">Преподавателю</a>
          <a className="navbar-button" href="rating.html">Рейтинг</a>
        </nav>
        <button id="sign-in">Войти</button>
      </header>
  );
};

export default Header;
