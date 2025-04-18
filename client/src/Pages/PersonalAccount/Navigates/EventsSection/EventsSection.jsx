import React from 'react';
import './EventsSection.css';

const EventsSection = () => {
  return (
    <div className="section" id="events-section">
      <h2>Мероприятия</h2>
      <div className="events-list">
        <div className="event-card">
          <h3>Квест "Технологии будущего"</h3>
          <p>Дата: 25.10.2023</p>
          <p>Место: Аудитория 301</p>
        </div>
        <div className="event-card">
          <h3>Лекция "Искусственный интеллект"</h3>
          <p>Дата: 30.10.2023</p>
          <p>Место: Аудитория 202</p>
        </div>
      </div>
    </div>
  );
};

export default EventsSection;