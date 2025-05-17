import React, { useState, useEffect, useMemo } from 'react';
import { toast } from 'react-toastify';
import './EventsSection.css';
import { fetchEvents, createEvent, updateEvent, deleteEvent, fetchStudents, fetchTeachers, fetchLevels } from '../../../API/eventsAPI';

const EventIcon = ({ type }) => {
  switch (type) {
    case 'conference':
      return <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#512da8" strokeWidth="2"><path d="M12 14l9-5-9-5-9 5 9 5z" /><path d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" /></svg>;
    case 'hackathon':
      return <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#512da8" strokeWidth="2"><path d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0L6 7m3 0l3 9m-3-9l3-1m0 0l3 1m0 0l-3 9a5.002 5.002 0 006.001 0l-3-9m-6 0l3 1m-3 0l3-1" /></svg>;
    case 'seminar':
      return <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#512da8" strokeWidth="2"><path d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3-.512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" /></svg>;
    case 'tournament':
      return <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#512da8" strokeWidth="2"><path d="M5 3l3 3m0 0l-3 9a5.002 5.002 0 006.001 0L8 6m3 0l3 9m-3-9l3-3m0 0l3 3m0 0l-3 9a5.002 5.002 0 006.001 0l-3-9" /></svg>;
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

const Modal = ({ isOpen, onClose, event, onSave, onDelete, isAddMode, studentsList, teachersList, levelsList }) => {
  const initialFormData = useMemo(() => {
    return isAddMode
      ? { 
          iconType: 'conference', 
          title: '', 
          dateTime: '', 
          students: [], 
          teacher: null, 
          level: null 
        }
      : {
          id: event?._id || '',
          iconType: event?.iconType || 'conference',
          title: event?.title || '',
          dateTime: event?.dateTime ? formatDateTimeForInput(event.dateTime) : '',
          students: Array.isArray(event?.students) ? event.students.map(s => s._id || s) : [],
          teacher: event?.teacher?._id || null,
          level: event?.level?._id || null
        };
  }, [isAddMode, event]);

  const [formData, setFormData] = useState(initialFormData);
  const [studentFilter, setStudentFilter] = useState('');
  const [teacherFilter, setTeacherFilter] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setFormData(initialFormData);
      setStudentFilter('');
      setTeacherFilter('');
      setShowDeleteConfirm(false);
    }
  }, [isOpen, initialFormData]);

  const iconTypes = ['conference', 'hackathon', 'seminar', 'tournament'];

  const filteredStudents = useMemo(() => {
    return studentsList.filter(student => 
      `${student.last_name} ${student.first_name}`.toLowerCase().includes(studentFilter.toLowerCase())
    );
  }, [studentsList, studentFilter]);

  const filteredTeachers = useMemo(() => {
    return teachersList.filter(teacher =>
      `${teacher.last_name} ${teacher.first_name}`.toLowerCase().includes(teacherFilter.toLowerCase())
    );
  }, [teachersList, teacherFilter]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleStudentToggle = (studentId) => {
    setFormData(prev => {
      const students = prev.students.includes(studentId)
        ? prev.students.filter(id => id !== studentId)
        : [...prev.students, studentId];
      return { ...prev, students };
    });
  };

  const handleSave = async () => {
    if (isSaving) return;
    setIsSaving(true);
    
    try {
      if (!formData.title || !formData.dateTime || !formData.iconType) {
        throw new Error('Заполните все обязательные поля');
      }
      
      await onSave(formData);
      toast.success(isAddMode ? 'Мероприятие добавлено!' : 'Изменения сохранены!');
      onClose();
    } catch (error) {
      toast.error(error.message);
    } finally {
      setIsSaving(false);
    }
  };

  const confirmDelete = async () => {
    try {
      await onDelete(formData.id);
      toast.success('Мероприятие удалено!');
      onClose();
    } catch (error) {
      toast.error(error.message);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        {showDeleteConfirm ? (
          <div className="delete-confirm">
            <h3>Подтверждение удаления</h3>
            <p>Вы уверены, что хотите удалить это мероприятие?</p>
            <div className="modal-actions">
              <button className="modal-button confirm" onClick={confirmDelete}>
                Да, удалить
              </button>
              <button className="modal-button cancel" onClick={() => setShowDeleteConfirm(false)}>
                Отмена
              </button>
            </div>
          </div>
        ) : (
          <>
            <h2>{isAddMode ? 'Добавить мероприятие' : 'Редактировать мероприятие'}</h2>
            <div className="modal-body">
              <label>
                Лого:
                <select name="iconType" value={formData.iconType} onChange={handleChange}>
                  {iconTypes.map(type => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              </label>
              
              <label>
                Название:
                <input 
                  type="text" 
                  name="title" 
                  value={formData.title} 
                  onChange={handleChange} 
                  required 
                />
              </label>
              
              <label>
                Дата и время:
                <input 
                  type="datetime-local" 
                  name="dateTime" 
                  value={formData.dateTime} 
                  onChange={handleChange} 
                  required 
                />
              </label>
              
              <label>
                Студенты:
                <input
                  type="text"
                  value={studentFilter}
                  onChange={(e) => setStudentFilter(e.target.value)}
                  placeholder="Поиск студентов..."
                />
                <div className="students-list">
                  {filteredStudents.map(student => (
                    <div key={student._id} className="student-option">
                      <span>{student.last_name} {student.first_name}</span>
                      <input
                        type="checkbox"
                        checked={formData.students.includes(student._id)}
                        onChange={() => handleStudentToggle(student._id)}
                      />
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
                  placeholder="Поиск преподавателей..."
                />
                <select 
                  name="teacher" 
                  value={formData.teacher || ''} 
                  onChange={handleChange}
                  required
                >
                  <option value="">Выберите преподавателя</option>
                  {filteredTeachers.map(teacher => (
                    <option key={teacher._id} value={teacher._id}>
                      {teacher.last_name} {teacher.first_name}
                    </option>
                  ))}
                </select>
              </label>
              
              <label>
                Уровень:
                <select 
                  name="level" 
                  value={formData.level || ''} 
                  onChange={handleChange}
                  required
                >
                  <option value="">Выберите уровень</option>
                  {levelsList.map(level => (
                    <option key={level._id} value={level._id}>
                      {level.levelName}
                    </option>
                  ))}
                </select>
              </label>
            </div>
            
            <div className="modal-actions">
              {!isAddMode && (
                <button className="modal-button delete" onClick={() => setShowDeleteConfirm(true)}>
                  Удалить
                </button>
              )}
              <button className="modal-button save" onClick={handleSave} disabled={isSaving}>
                {isSaving ? 'Сохранение...' : isAddMode ? 'Добавить' : 'Сохранить'}
              </button>
              <button className="modal-button cancel" onClick={onClose} disabled={isSaving}>
                Отмена
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

const EventsSection = () => {
  const [events, setEvents] = useState([]);
  const [studentsList, setStudentsList] = useState([]);
  const [teachersList, setTeachersList] = useState([]);
  const [levelsList, setLevelsList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const eventsPerPage = 5;

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const [eventsRes, studentsRes, teachersRes, levelsRes] = await Promise.all([
          fetchEvents(),
          fetchStudents(),
          fetchTeachers(),
          fetchLevels()
        ]);
        setEvents(eventsRes || []);
        setStudentsList(studentsRes || []);
        setTeachersList(teachersRes || []);
        setLevelsList(levelsRes || []);
      } catch (error) {
        toast.error('Ошибка загрузки данных: ' + error.message);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  const totalPages = Math.ceil(events.length / eventsPerPage);
  const paginatedEvents = useMemo(() => {
    return events.slice(
      (currentPage - 1) * eventsPerPage,
      currentPage * eventsPerPage
    );
  }, [events, currentPage, eventsPerPage]);

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const handleAddEvent = async (eventData) => {
    try {
      const newEvent = await createEvent(eventData);
      setEvents([...events, newEvent]);
      setIsAddModalOpen(false);
    } catch (error) {
      throw error;
    }
  };

  const handleUpdateEvent = async (eventData) => {
    try {
      const updatedEvent = await updateEvent(eventData.id, eventData);
      setEvents(events.map(event => 
        event._id === eventData.id ? updatedEvent : event
      ));
      setIsEditModalOpen(false);
    } catch (error) {
      throw error;
    }
  };

  const handleDeleteEvent = async (id) => {
    try {
      await deleteEvent(id);
      setEvents(events.filter(event => event._id !== id));
      setIsEditModalOpen(false);
    } catch (error) {
      throw error;
    }
  };

  const handleCellClick = (event) => {
    setSelectedEvent(event);
    setIsEditModalOpen(true);
  };

  if (loading) {
    return <div className="loading">Загрузка данных...</div>;
  }

  return (
    <div className="events-section">
      <div className="section-header">
        <h2>Все мероприятия</h2>
        <button className="action-button add" onClick={() => setIsAddModalOpen(true)}>
          Добавить мероприятие
        </button>
      </div>
      
      <div className="table-container">
        <table className="events-table">
          <thead>
            <tr>
              <th>№</th>
              <th>Лого</th>
              <th>Название</th>
              <th>Дата и время</th>
              <th>Студенты</th>
              <th>Преподаватель</th>
              <th>Уровень</th>
            </tr>
          </thead>
          <tbody>
            {paginatedEvents.map((event, index) => (
              <tr key={event._id}>
                <td onClick={() => handleCellClick(event)}>
                  {(currentPage - 1) * eventsPerPage + index + 1}
                </td>
                <td className="icon-cell" onClick={() => handleCellClick(event)}>
                  <EventIcon type={event.iconType} />
                </td>
                <td onClick={() => handleCellClick(event)}>{event.title}</td>
                <td onClick={() => handleCellClick(event)}>{formatDateTime(event.dateTime)}</td>
                <td onClick={() => handleCellClick(event)}>
                  {event.students?.map(s => `${s.last_name} ${s.first_name}`).join(', ') || '-'}
                </td>
                <td onClick={() => handleCellClick(event)}>
                  {event.teacher ? `${event.teacher.last_name} ${event.teacher.first_name}` : '-'}
                </td>
                <td onClick={() => handleCellClick(event)}>
                  {event.level?.levelName || '-'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      {totalPages > 1 && (
       <div className="pagination">
        <button
          className="pagination-button"
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
        >
          Назад
        </button>

    {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
        <button
          key={page}
          className={`pagination-button ${currentPage === page ? 'active' : ''}`}
          onClick={() => handlePageChange(page)}
        >
          {page}
        </button>
      ))}

      <button
        className="pagination-button"
        onClick={() => handlePageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
      >
        Вперед
      </button>
    </div>
      )}
      
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSave={handleAddEvent}
        isAddMode={true}
        studentsList={studentsList}
        teachersList={teachersList}
        levelsList={levelsList}
      />
      
      <Modal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        event={selectedEvent}
        onSave={handleUpdateEvent}
        onDelete={handleDeleteEvent}
        studentsList={studentsList}
        teachersList={teachersList}
        levelsList={levelsList}
      />
    </div>
  );
};

export default EventsSection;