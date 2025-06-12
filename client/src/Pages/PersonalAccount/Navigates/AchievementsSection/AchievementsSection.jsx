import React from 'react';
import './AchievementsSection.css';

const achievementsData = [
  { id: 1, title: 'Мастер кода', points: 8, earned: true, logo: 'code' },
  { id: 2, title: 'Звезда знаний', points: 5, earned: true, logo: 'star' },
  { id: 3, title: 'Гуру технологий', points: 10, earned: true, logo: 'tech' },
  { id: 4, title: 'Искры гениальности', points: 6, earned: true, logo: 'spark' },
  { id: 5, title: 'Пионер инноваций', points: 7, earned: true, logo: 'rocket' },
  { id: 6, title: 'Виртуоз данных', points: 9, earned: true, logo: 'data' },
  { id: 7, title: 'Стратег решений', points: 4, earned: false, logo: 'puzzle' },
  { id: 8, title: 'Мудрец систем', points: 5, earned: false, logo: 'system' },
  { id: 9, title: 'Чемпион алгоритмов', points: 8, earned: false, logo: 'algo' },
  { id: 10, title: 'Вдохновитель идей', points: 6, earned: false, logo: 'idea' },
  { id: 11, title: 'Легенда кодирования', points: 10, earned: false, logo: 'code' },
  { id: 12, title: 'Знаток сетей', points: 5, earned: false, logo: 'network' },
  { id: 13, title: 'Архитектор решений', points: 7, earned: false, logo: 'arch' },
  { id: 14, title: 'Маэстро данных', points: 8, earned: false, logo: 'data' },
  { id: 15, title: 'Визионер технологий', points: 6, earned: false, logo: 'vision' },
  { id: 16, title: 'Гений оптимизации', points: 5, earned: false, logo: 'optimize' },
  { id: 17, title: 'Победитель багов', points: 9, earned: false, logo: 'bug' },
  { id: 18, title: 'Мастер интерфейсов', points: 6, earned: false, logo: 'ui' },
  { id: 19, title: 'Король дебаггинга', points: 10, earned: false, logo: 'debug' },
  { id: 20, title: 'Страж безопасности', points: 5, earned: false, logo: 'shield' },
  { id: 21, title: 'Путеводитель кода', points: 7, earned: false, logo: 'guide' },
  { id: 22, title: 'Творец систем', points: 8, earned: false, logo: 'system' },
  { id: 23, title: 'Искатель решений', points: 6, earned: false, logo: 'search' },
  { id: 24, title: 'Маг автоматизации', points: 5, earned: false, logo: 'auto' },
];

const getSvgIcon = (type) => {
  switch (type) {
    case 'code':
      return <svg width="60" height="60" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M10 7l-5 5 5 5M14 17l5-5-5-5M7 9l2-2m8 10l-2 2" stroke="#512da8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>;
    case 'star':
      return <svg width="60" height="60" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" stroke="#512da8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>;
    case 'tech':
      return <svg width="60" height="60" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12 2a10 10 0 100 20 10 10 0 000-20zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" stroke="#512da8" strokeWidth="2"/></svg>;
    case 'spark':
      return <svg width="60" height="60" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12 3v6l3-3M12 21v-6l-3 3M3 12h6l-3-3m18 3h-6l3 3" stroke="#512da8" strokeWidth="2" strokeLinecap="round"/></svg>;
    case 'rocket':
      return <svg width="60" height="60" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12 2l3 9h-6l3-9zm0 6a1 1 0 100-2 1 1 0 000 2zm-7 7l3 7h8l3-7H5z" stroke="#512da8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>;
    case 'data':
      return <svg width="60" height="60" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M4 4h16v16H4zM8 8h8v8H8z" stroke="#512da8" strokeWidth="2" strokeLinecap="round"/></svg>;
    case 'puzzle':
      return <svg width="60" height="60" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M4 7h6V4h4v3h6v10h-3v3H7v-3H4V7z" stroke="#512da8" strokeWidth="2" strokeLinecap="round"/></svg>;
    case 'system':
      return <svg width="60" height="60" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M4 6h16M4 12h16M4 18h16" stroke="#512da8" strokeWidth="2" strokeLinecap="round"/></svg>;
    case 'algo':
      return <svg width="60" height="60" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M5 5h14v14H5zM9 9l6 6M15 9l-6 6" stroke="#512da8" strokeWidth="2" strokeLinecap="round"/></svg>;
    case 'idea':
      return <svg width="60" height="60" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12 3a5 5 0 00-5 5h10a5 5 0 00-5-5zm0 12a4 4 0 100-8 4 4 0 000 8zm-2 2h4v4h-4z" stroke="#512da8" strokeWidth="2" strokeLinecap="round"/></svg>;
    case 'network':
      return <svg width="60" height="60" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M8 6h8M6 12h12M8 18h8" stroke="#512da8" strokeWidth="2" strokeLinecap="round"/></svg>;
    case 'arch':
      return <svg width="60" height="60" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M4 4h16v4H4zm4 8h8v8H8z" stroke="#512da8" strokeWidth="2" strokeLinecap="round"/></svg>;
    case 'vision':
      return <svg width="60" height="60" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8zm11 4a4 4 0 100-8 4 4 0 000 8z" stroke="#512da8" strokeWidth="2" strokeLinecap="round"/></svg>;
    case 'optimize':
      return <svg width="60" height="60" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12 4v16m-8-8h16" stroke="#512da8" strokeWidth="2" strokeLinecap="round"/></svg>;
    case 'bug':
      return <svg width="60" height="60" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M8 4h8M6 8h12M8 12h8M6 16h12" stroke="#512da8" strokeWidth="2" strokeLinecap="round"/></svg>;
    case 'ui':
      return <svg width="60" height="60" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M3 3h18v18H3zM8 8h8v8H8z" stroke="#512da8" strokeWidth="2" strokeLinecap="round"/></svg>;
    case 'debug':
      return <svg width="60" height="60" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M9 9l6 6M15 9l-6 6m-4-4h14" stroke="#512da8" strokeWidth="2" strokeLinecap="round"/></svg>;
    case 'shield':
      return <svg width="60" height="60" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12 2c-6 0-9 3-9 9v7c0 3 3 4 9 4s9-1 9-4v-7c0-6-3-9-9-9zm0 14l-5-5 1.41-1.41L12 13.17l3.59-3.58L17 11l-5 5z" stroke="#512da8" strokeWidth="2" strokeLinecap="round"/></svg>;
    case 'guide':
      return <svg width="60" height="60" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12 2v20M2 12h20" stroke="#512da8" strokeWidth="2" strokeLinecap="round"/></svg>;
    case 'search':
      return <svg width="60" height="60" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M11 3a8 8 0 100 16 8 8 0 000-16zm5 13l4 4" stroke="#512da8" strokeWidth="2" strokeLinecap="round"/></svg>;
    case 'auto':
      return <svg width="60" height="60" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M8 6l6 6-6 6M16 6l6 6-6 6" stroke="#512da8" strokeWidth="2" strokeLinecap="round"/></svg>;
    default:
      return <svg width="60" height="60" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12 2a10 10 0 100 20 10 10 0 000-20z" stroke="#512da8" strokeWidth="2"/></svg>;
  }
};

const AchievementsSection = () => {
  return (
    <div className="section" id="achievements-section">
      <h2>Мои достижения</h2>
      <div className="achievements-list">
        {achievementsData.map((achievement) => (
          <div
            key={achievement.id}
            className={`achievement-card ${achievement.earned ? 'earned' : 'locked'}`}
          >
            <div className="achievement-logo">{getSvgIcon(achievement.logo)}</div>
            <h3>{achievement.title}</h3>
            <p>Баллы: {achievement.points}</p>
            <p>{achievement.earned ? 'Получено' : 'Не получено'}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AchievementsSection;