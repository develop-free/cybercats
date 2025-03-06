import React from 'react';
import './footerPage.css';
import vkIcon from '../../assets/images/vk-brands-solid.svg';
import telegramIcon from '../../assets/images/telegram-brands-solid.svg';
import youtubeIcon from '../../assets/images/youtube-brands-solid.svg';
import logo from '../../assets/images/logo_tab.png';

const Footer = () => {
  return (
    <footer className="main_footer">
      <div className="container_03">
        <div className="contact">
          <h3>+7 (904) 404-39-34</h3>
          <h3>ditalone@mail.ru</h3>
        </div>
        <div className="soshial_icon">
          <img src={vkIcon} alt="VK" />
          <img src={telegramIcon} alt="Telegram" />
          <img src={youtubeIcon} alt="YouTube" />
        </div>
        <div className="logo_icon">
          <img src={logo} alt="Cyber Cats Logo" />
        </div>
      </div>
    </footer>
  );
};

export default Footer;
