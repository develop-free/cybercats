import React, { useState, useEffect, useMemo } from 'react';
import { toast } from 'react-toastify';
import { fetchTeachers, createTeacher, updateTeacher, deleteTeacher } from '../../../API/teachersAPI';
import './TeachersSection.css';

const Modal = ({ isOpen, onClose, teacher, onSave, onDelete, isAddMode }) => {
  const initialFormData = useMemo(() => {
    return isAddMode
      ? { 
          last_name: '', 
          first_name: '', 
          middle_name: '', 
          position: '', 
          email: '', 
          is_teacher: true 
        }
      : {
          id: teacher?._id || '',
          last_name: teacher?.last_name || '',
          first_name: teacher?.first_name || '',
          middle_name: teacher?.middle_name || '',
          position: teacher?.position || '',
          email: teacher?.email || '',
          is_teacher: teacher?.is_teacher ?? true,
        };
  }, [isAddMode, teacher]);

  const [formData, setFormData] = useState(initialFormData);
  const [isSaving, setIsSaving] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setFormData(initialFormData);
      setShowDeleteConfirm(false);
    }
  }, [isOpen, initialFormData]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSave = async () => {
    if (isSaving) return;
    setIsSaving(true);

    try {
      if (!formData.last_name || !formData.first_name || !formData.position || !formData.email) {
        throw new Error('Заполните все обязательные поля');
      }
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
        throw new Error('Некорректный формат email');
      }

      await onSave(formData);
      toast.success(isAddMode ? 'Преподаватель добавлен!' : 'Изменения сохранены!');
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
      toast.success('Преподаватель удален!');
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
            <p>Вы уверены, что хотите удалить этого преподавателя?</p>
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
            <h2>{isAddMode ? 'Добавить преподавателя' : 'Редактировать преподавателя'}</h2>
            <div className="modal-body">
              <label>
                Фамилия:
                <input
                  type="text"
                  name="last_name"
                  value={formData.last_name}
                  onChange={handleChange}
                  required
                />
              </label>
              <label>
                Имя:
                <input
                  type="text"
                  name="first_name"
                  value={formData.first_name}
                  onChange={handleChange}
                  required
                />
              </label>
              <label>
                Отчество:
                <input
                  type="text"
                  name="middle_name"
                  value={formData.middle_name}
                  onChange={handleChange}
                />
              </label>
              <label>
                Должность:
                <input
                  type="text"
                  name="position"
                  value={formData.position}
                  onChange={handleChange}
                  required
                />
              </label>
              <label>
                Почта:
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </label>
              <label className="checkbox-label">
                Преподаватель:
                <input
                  type="checkbox"
                  name="is_teacher"
                  checked={formData.is_teacher}
                  onChange={handleChange}
                />
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

const TeachersSection = () => {
  const [teachers, setTeachers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedTeacher, setSelectedTeacher] = useState(null);
  const teachersPerPage = 5;

  useEffect(() => {
    const loadTeachers = async () => {
      try {
        setLoading(true);
        const teachersData = await fetchTeachers();
        setTeachers(teachersData || []);
      } catch (error) {
        toast.error(error.message);
      } finally {
        setLoading(false);
      }
    };
    loadTeachers();
  }, []);

  const totalPages = Math.ceil(teachers.length / teachersPerPage);
  const paginatedTeachers = useMemo(() => {
    return teachers.slice(
      (currentPage - 1) * teachersPerPage,
      currentPage * teachersPerPage
    );
  }, [teachers, currentPage, teachersPerPage]);

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const handleAddTeacher = async (teacherData) => {
    try {
      const newTeacher = await createTeacher(teacherData);
      setTeachers([...teachers, newTeacher]);
      setIsAddModalOpen(false);
    } catch (error) {
      throw error;
    }
  };

  const handleUpdateTeacher = async (teacherData) => {
    try {
      const updatedTeacher = await updateTeacher(teacherData.id, teacherData);
      setTeachers(teachers.map(teacher =>
        teacher._id === teacherData.id ? updatedTeacher : teacher
      ));
      setIsEditModalOpen(false);
    } catch (error) {
      throw error;
    }
  };

  const handleDeleteTeacher = async (id) => {
    try {
      await deleteTeacher(id);
      setTeachers(teachers.filter(teacher => teacher._id !== id));
      setIsEditModalOpen(false);
    } catch (error) {
      throw error;
    }
  };

  const handleCellClick = (teacher) => {
    setSelectedTeacher(teacher);
    setIsEditModalOpen(true);
  };

  if (loading) {
    return <div className="loading">Загрузка данных...</div>;
  }

  return (
    <div className="teachers-section">
      <div className="section-header">
        <h2>Преподаватели</h2>
        <button className="action-button add" onClick={() => setIsAddModalOpen(true)}>
          Добавить преподавателя
        </button>
      </div>

      <div className="table-container">
        <table className="teachers-table">
          <thead>
            <tr>
              <th>№</th>
              <th>ФИО</th>
              <th>Должность</th>
            </tr>
          </thead>
          <tbody>
            {paginatedTeachers.map((teacher, index) => (
              <tr key={teacher._id}>
                <td onClick={() => handleCellClick(teacher)}>
                  {(currentPage - 1) * teachersPerPage + index + 1}
                </td>
                <td onClick={() => handleCellClick(teacher)}>
                  {teacher.last_name} {teacher.first_name} {teacher.middle_name || ''}
                </td>
                <td onClick={() => handleCellClick(teacher)}>
                  {teacher.position || '-'}
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
        onSave={handleAddTeacher}
        isAddMode={true}
      />

      <Modal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        teacher={selectedTeacher}
        onSave={handleUpdateTeacher}
        onDelete={handleDeleteTeacher}
      />
    </div>
  );
};

export default TeachersSection;