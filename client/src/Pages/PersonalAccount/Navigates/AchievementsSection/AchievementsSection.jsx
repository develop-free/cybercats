import React from 'react';
import './AchievementsSection.css';

const AchievementsSection = () => {
  return (
    <div className="section" id="achievements-section">
      <h2>Мои достижения</h2>
      <div className="achievements-list">
        <div className="achievement-card">
          <h3>Квест "Технологии будущего"</h3>
          <p>Выполнено: 10 заданий</p>
          <p>Награда: 300 баллов</p>
        </div>
        <div className="achievement-card">
          <h3>Лекция "Искусственный интеллект"</h3>
          <p>Посещено: 5 лекций</p>
          <p>Награда: 150 баллов</p>
        </div>
      </div>
    </div>
  );
};

export default AchievementsSection;