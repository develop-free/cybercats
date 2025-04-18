import React from 'react';
import './ProfileSection.css';

const ProfileSection = () => {
  return (
    <div className="section" id="main-section">
      <h2>Мой профиль</h2>
      <p>Здесь вы можете отслеживать свои достижения, участвовать в мероприятиях и управлять настройками профиля.</p>
      <div className="stats">
        <div className="stat-card">
          <h3>Баллы</h3>
          <p>1200</p>
        </div>
        <div className="stat-card">
          <h3>Достижения</h3>
          <p>15</p>
        </div>
        <div className="stat-card">
          <h3>Мероприятия</h3>
          <p>8</p>
        </div>
      </div>
    </div>
  );
};

export default ProfileSection;