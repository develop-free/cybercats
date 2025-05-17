import React, { useState, useEffect } from 'react';
import { fetchEvents } from '../../../../API/eventsAPI';
import './EventsSectionUser.css';

const EventIcon = ({ type }) => {
  switch (type) {
    case 'conference':
      return (
        <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#512da8" strokeWidth="2">
          <path d="M12 14l9-5-9-5-9 5 9 5z" />
          <path d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
        </svg>
      );
    case 'hackathon':
      return (
        <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#512da8" strokeWidth="2">
          <path d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0L6 7m3 0l3 9m-3-9l3-1m0 0l3 1m0 0l-3 9a5.002 5.002 0 006.001 0l-3-9m-6 0l3 1m-3 0l3-1" />
        </svg>
      );
    case 'seminar':
      return (
        <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#512da8" strokeWidth="2">
          <path d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3-.512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" />
        </svg>
      );
    case 'tournament':
      return (
        <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#512da8" strokeWidth="2">
          <path d="M5 3l3 3m0 0l-3 9a5.002 5.002 0 006.001 0L8 6m3 0l3 9m-3-9l3-3m0 0l3 3m0 0l-3 9a5.002 5.002 0 006.001 0l-3-9" />
        </svg>
      );
    default:
      return null;
  }
};

const formatDateTime = (dateTime) => {
  const date = new Date(dateTime);
  return date.toLocaleString('ru-RU', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

const EventsSectionUser = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadEvents = async () => {
      try {
        setLoading(true);
        const eventsData = await fetchEvents();
        setEvents(eventsData || []);
        setLoading(false);
      } catch (err) {
        setError('Ошибка загрузки мероприятий: ' + err.message);
        setLoading(false);
      }
    };
    loadEvents();
  }, []);

  if (loading) {
    return <div className="loading">Загрузка мероприятий...</div>;
  }

  if (error) {
    return <div className="error">{error}</div>;
  }

  return (
    <div className="events-section" id="events-section">
      <h2>Мероприятия</h2>
      <div className="events-list">
        {events.length === 0 ? (
          <p className="no-events">Нет мероприятий для отображения</p>
        ) : (
          events.map((event) => (
            <div key={event._id} className="event-card">
              <div className="event-icon">
                <EventIcon type={event.iconType} />
              </div>
              <div className="event-details">
                <h3>{event.title}</h3>
                <p>Дата: {formatDateTime(event.dateTime)}</p>
                <p>
                  Преподаватель:{' '}
                  {event.teacher ? `${event.teacher.last_name} ${event.teacher.first_name}` : '-'}
                </p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default EventsSectionUser;