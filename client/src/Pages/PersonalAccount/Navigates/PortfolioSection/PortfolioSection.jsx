import React from 'react';
import './PortfolioSection.css';

const PortfolioSection = () => {
  return (
    <div className="section" id="portfolio-section">
      <h2>Моё портфолио</h2>
      <p>Здесь будут отображаться ваши проекты и работы.</p>
      <div className="portfolio-list">
        <div className="portfolio-card">
          <h3>Проект "Технологии будущего"</h3>
          <p>Описание: Разработка инновационного решения для образования.</p>
        </div>
        <div className="portfolio-card">
          <h3>Проект "Искусственный интеллект"</h3>
          <p>Описание: Исследование возможностей ИИ в медицине.</p>
        </div>
      </div>
    </div>
  );
};

export default PortfolioSection;