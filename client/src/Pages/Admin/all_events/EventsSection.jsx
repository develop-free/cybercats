import React, { useState, useEffect } from 'react';
import './EventsSection.css';

// Моковые данные мероприятий
const mockEvents = [
  {
    id: 1,
    iconType: 'conference',
    title: 'Конференция по ИИ',
    dateTime: '2025-06-01T10:00',
    students: ['Иванов И.И.', 'Петрова А.С.'],
    teacher: 'Смирнов В.А.',
    level: 'Высокий',
  },
  {
    id: 2,
    iconType: 'hackathon',
    title: 'Хакатон CyberCats',
    dateTime: '2025-06-15T09:00',
    students: ['Сидоров М.П.', 'Козлова Е.В.', 'Федоров Д.А.'],
    teacher: 'Кузнецова О.Н.',
    level: 'Средний',
  },
  {
    id: 3,
    iconType: 'seminar',
    title: 'Семинар по кибербезопасности',
    dateTime: '2025-07-01T14:00',
    students: ['Морозов А.Р.'],
    teacher: 'Лебедев С.И.',
    level: 'Низкий',
  },
  {
    id: 4,
    iconType: 'tournament',
    title: 'Турнир по программированию',
    dateTime: '2025-07-10T11:00',
    students: ['Васильев К.Д.', 'Попова М.А.'],
    teacher: 'Иванова Т.Е.',
    level: 'Высокий',
  },
  {
    id: 5,
    iconType: 'conference',
    title: 'Мастер-класс по ML',
    dateTime: '2025-07-15T13:00',
    students: ['Соколов П.В.', 'Зайцева Л.А.'],
    teacher: 'Михайлов Д.Б.',
    level: 'Средний',
  },
  {
    id: 6,
    iconType: 'hackathon',
    title: 'Вебинар по DevOps',
    dateTime: '2025-08-01T16:00',
    students: ['Григорьев А.С.', 'Тихонова Е.Д.'],
    teacher: 'Беляева Н.В.',
    level: 'Низкий',
  },
  {
    id: 7,
    iconType: 'conference',
    title: 'Конференция по ИИ',
    dateTime: '2025-06-01T10:00',
    students: ['Иванов И.И.', 'Петрова А.С.'],
    teacher: 'Смирнов В.А.',
    level: 'Высокий',
  },
  {
    id: 8,
    iconType: 'hackathon',
    title: 'Хакатон CyberCats',
    dateTime: '2025-06-15T09:00',
    students: ['Сидоров М.П.', 'Козлова Е.В.', 'Федоров Д.А.'],
    teacher: 'Кузнецова О.Н.',
    level: 'Средний',
  },
  {
    id: 9,
    iconType: 'seminar',
    title: 'Семинар по кибербезопасности',
    dateTime: '2025-07-01T14:00',
    students: ['Морозов А.Р.'],
    teacher: 'Лебедев С.И.',
    level: 'Низкий',
  },
  {
    id: 10,
    iconType: 'tournament',
    title: 'Турнир по программированию',
    dateTime: '2025-07-10T11:00',
    students: ['Васильев К.Д.', 'Попова М.А.'],
    teacher: 'Иванова Т.Е.',
    level: 'Высокий',
  },
  {
    id: 11,
    iconType: 'conference',
    title: 'Мастер-класс по ML',
    dateTime: '2025-07-15T13:00',
    students: ['Соколов П.В.', 'Зайцева Л.А.'],
    teacher: 'Михайлов Д.Б.',
    level: 'Средний',
  },
  {
    id: 12,
    iconType: 'hackathon',
    title: 'Вебинар по DevOps',
    dateTime: '2025-08-01T16:00',
    students: ['Григорьев А.С.', 'Тихонова Е.Д.'],
    teacher: 'Беляева Н.В.',
    level: 'Низкий',
  },
];

// Форматирование даты и времени для отображения в таблице
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

// Форматирование даты для input типа datetime-local
const formatDateTimeForInput = (dateTime) => {
  if (!dateTime) return '';
  const date = new Date(dateTime);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  return `${year}-${month}-${day}T${hours}:${minutes}`;
};

// Компонент для SVG-иконок
const EventIcon = ({ type }) => {
  switch (type) {
    case 'conference':
      return (
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#512da8" strokeWidth="2">
          <path d="M12 14l9-5-9-5-9 5 9 5z" />
          <path d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
        </svg>
      );
    case 'hackathon':
      return (
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#512da8" strokeWidth="2">
          <path d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0L6 7m3 0l3 9m-3-9l3-1m0 0l3 1m0 0l-3 9a5.002 5.002 0 006.001 0l-3-9m-6 0l3 1m-3 0l3-1" />
        </svg>
      );
    case 'seminar':
      return (
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#512da8" strokeWidth="2">
          <path d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3-.512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" />
        </svg>
      );
    case 'tournament':
      return (
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#512da8" strokeWidth="2">
          <path d="M5 3l3 3m0 0l-3 9a5.002 5.002 0 006.001 0L8 6m3 0l3 9m-3-9l3-3m0 0l3 3m0 0l-3 9a5.002 5.002 0 006.001 0l-3-9" />
        </svg>
      );
    default:
      return null;
  }
};

// Компонент модального окна
const Modal = ({ isOpen, onClose, event, onSave, onDelete, isAddMode }) => {
  const [formData, setFormData] = useState(
    isAddMode
      ? { id: mockEvents.length + 1, iconType: 'conference', title: '', dateTime: '', students: [], teacher: '', level: '' }
      : {
          id: event?.id || 0,
          iconType: event?.iconType || 'conference',
          title: event?.title || '',
          dateTime: event?.dateTime ? formatDateTimeForInput(event.dateTime) : '',
          students: Array.isArray(event?.students) ? event.students : [],
          teacher: event?.teacher || '',
          level: event?.level || '',
        }
  );
  const [studentFilter, setStudentFilter] = useState('');
  const [teacherFilter, setTeacherFilter] = useState('');

  // Сбрасываем фильтры при открытии модального окна
  useEffect(() => {
    if (isOpen) {
      setStudentFilter('');
      setTeacherFilter('');
      // Обновляем formData при изменении event
      if (!isAddMode && event) {
        setFormData({
          id: event?.id || 0,
          iconType: event?.iconType || 'conference',
          title: event?.title || '',
          dateTime: event?.dateTime ? formatDateTimeForInput(event.dateTime) : '',
          students: Array.isArray(event?.students) ? event.students : [],
          teacher: event?.teacher || '',
          level: event?.level || '',
        });
      }
    }
  }, [isOpen, event, isAddMode]);

  // Список всех студентов и преподавателей для выпадающих списков
  const allStudents = [
    'Иванов И.И.', 'Петрова А.С.', 'Сидоров М.П.', 'Козлова Е.В.', 'Федоров Д.А.', 'Морозов А.Р.', 
    'Васильев К.Д.', 'Попова М.А.', 'Соколов П.В.', 'Зайцева Л.А.', 'Григорьев А.С.', 'Тихонова Е.Д.'
  ].sort();
  const allTeachers = [
    'Смирнов В.А.', 'Кузнецова О.Н.', 'Лебедев С.И.', 'Иванова Т.Е.', 'Михайлов Д.Б.', 'Беляева Н.В.'
  ].sort();

  // Фильтрация по введенному тексту
  const filteredStudents = allStudents.filter((student) =>
    student.toLowerCase().includes(studentFilter.toLowerCase())
  );
  const filteredTeachers = allTeachers.filter((teacher) =>
    teacher.toLowerCase().includes(teacherFilter.toLowerCase())
  );

  const iconTypes = ['conference', 'hackathon', 'seminar', 'tournament'];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleStudentToggle = (student) => {
    setFormData((prev) => {
      const students = Array.isArray(prev.students) ? prev.students : [];
      const updatedStudents = students.includes(student)
        ? students.filter((s) => s !== student)
        : [...students, student];
      return { ...prev, students: updatedStudents };
    });
  };

  const handleSave = () => {
    // Преобразуем дату обратно в исходный формат
    const updatedEvent = {
      ...formData,
      dateTime: formData.dateTime, // Уже в формате YYYY-MM-DDThh:mm
    };
    onSave(updatedEvent);
    onClose();
  };

  const handleDelete = () => {
    if (window.confirm('Вы уверены, что хотите удалить это мероприятие?')) {
      onDelete(formData.id);
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <h2>{isAddMode ? 'Добавить мероприятие' : 'Редактировать мероприятие'}</h2>
        <div className="modal-body">
          <label>
            Иконка:
            <select name="iconType" value={formData.iconType} onChange={handleChange}>
              {iconTypes.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
          </label>
          <label>
            Название:
            <input type="text" name="title" value={formData.title} onChange={handleChange} />
          </label>
          <label>
            Дата и время:
            <input type="datetime-local" name="dateTime" value={formData.dateTime} onChange={handleChange} />
          </label>
          <label>
            Студенты:
            <input
              type="text"
              value={studentFilter}
              onChange={(e) => setStudentFilter(e.target.value)}
              placeholder="Введите ФИО студента..."
            />
            <div className="dropdown">
              {filteredStudents.map((student) => (
                <div
                  key={student}
                  className="dropdown-item"
                  onClick={() => handleStudentToggle(student)}
                >
                  <input
                    type="checkbox"
                    checked={(formData.students || []).includes(student)}
                    readOnly
                  />
                  {student}
                </div>
              ))}
            </div>
          </label>
          <label>
            Преподаватель:
            <input
              type="text"
              value={teacherFilter}
              onChange={(e) => setTeacherFilter(e.target.value)}
              placeholder="Введите ФИО преподавателя..."
            />
            <select name="teacher" value={formData.teacher} onChange={handleChange}>
              <option value="">Выберите преподавателя</option>
              {filteredTeachers.map((teacher) => (
                <option key={teacher} value={teacher}>
                  {teacher}
                </option>
              ))}
            </select>
          </label>
          <label>
            Уровень:
            <select name="level" value={formData.level} onChange={handleChange}>
              <option value="">Выберите уровень</option>
              <option value="Высокий">Высокий</option>
              <option value="Средний">Средний</option>
              <option value="Низкий">Низкий</option>
            </select>
          </label>
        </div>
        <div className="modal-actions">
          {!isAddMode && (
            <button className="modal-button delete" onClick={handleDelete}>
              Удалить
            </button>
          )}
          <button className="modal-button save" onClick={handleSave}>
            {isAddMode ? 'Добавить' : 'Сохранить'}
          </button>
          <button className="modal-button cancel" onClick={onClose}>
            Отмена
          </button>
        </div>
      </div>
    </div>
  );
};

const EventsSection = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [events, setEvents] = useState(mockEvents);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const eventsPerPage = 5;

  // Пагинация
  const totalPages = Math.ceil(events.length / eventsPerPage);
  const paginatedEvents = events.slice(
    (currentPage - 1) * eventsPerPage,
    currentPage * eventsPerPage
  );

  // Обработчик смены страницы
  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  // Обработчики для кнопок
  const handleAdd = () => {
    setIsAddModalOpen(true);
  };

  const handleSave = (newEvent) => {
    if (newEvent.id <= events.length) {
      setEvents(events.map((event) => (event.id === newEvent.id ? newEvent : event)));
    } else {
      setEvents([...events, newEvent]);
    }
  };

  const handleDelete = (id) => {
    setEvents(events.filter((event) => event.id !== id));
  };

  // Обработчик клика по ячейке
  const handleCellClick = (event) => {
    setSelectedEvent(event);
    setIsEditModalOpen(true);
  };

  // Логика для отображения кнопок пагинации
  const maxPageButtons = 3; // Максимум 3 кнопки с номерами страниц
  const pageButtons = [];

  if (totalPages <= maxPageButtons + 1) {
    for (let page = 1; page <= totalPages; page++) {
      pageButtons.push(
        <button
          key={page}
          className={`pagination-button ${currentPage === page ? 'active' : ''}`}
          onClick={() => handlePageChange(page)}
        >
          {page}
        </button>
      );
    }
  } else {
    let startPage = Math.max(1, currentPage - 1);
    let endPage = Math.min(totalPages - 1, startPage + maxPageButtons - 1);

    if (endPage === totalPages - 1) {
      startPage = Math.max(1, endPage - maxPageButtons + 1);
    }

    for (let page = startPage; page <= endPage; page++) {
      pageButtons.push(
        <button
          key={page}
          className={`pagination-button ${currentPage === page ? 'active' : ''}`}
          onClick={() => handlePageChange(page)}
        >
          {page}
        </button>
      );
    }

    if (endPage < totalPages - 1) {
      pageButtons.push(
        <span key="ellipsis" className="pagination-ellipsis">
          ...
        </span>
      );
    }

    pageButtons.push(
      <button
        key={totalPages}
        className={`pagination-button ${currentPage === totalPages ? 'active' : ''}`}
        onClick={() => handlePageChange(totalPages)}
      >
        {totalPages}
      </button>
    );
  }

  return (
    <div className="events-section">
      <div className="section-header">
        <h2>Все мероприятия</h2>
        <div className="action-buttons">
          <button className="action-button add" onClick={handleAdd}>
            Добавить
          </button>
        </div>
      </div>
      <div className="table-container">
        <table className="events-table">
          <thead>
            <tr>
              <th>№</th>
              <th className="icon-cell">Иконка</th>
              <th>Название</th>
              <th>Дата и время</th>
              <th>Студенты</th>
              <th>Преподаватель</th>
              <th>Уровень</th>
            </tr>
          </thead>
          <tbody>
            {paginatedEvents.map((event) => (
              <tr key={event.id}>
                <td onClick={() => handleCellClick(event)}>{event.id}</td>
                <td className="icon-cell" onClick={() => handleCellClick(event)}>
                  <EventIcon type={event.iconType} />
                </td>
                <td onClick={() => handleCellClick(event)}>{event.title}</td>
                <td onClick={() => handleCellClick(event)}>{formatDateTime(event.dateTime)}</td>
                <td onClick={() => handleCellClick(event)}>{event.students.join(', ')}</td>
                <td onClick={() => handleCellClick(event)}>{event.teacher}</td>
                <td onClick={() => handleCellClick(event)}>{event.level}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div className="pagination-container">
          <div className="pagination">
            <button
              className="pagination-button"
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
            >
              Предыдущая
            </button>
            {pageButtons}
            <button
              className="pagination-button"
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
            >
              Следующая
            </button>
          </div>
        </div>
      )}

      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSave={handleSave}
        isAddMode={true}
      />
      <Modal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        event={selectedEvent}
        onSave={handleSave}
        onDelete={handleDelete}
      />
    </div>
  );
};

export default EventsSection;