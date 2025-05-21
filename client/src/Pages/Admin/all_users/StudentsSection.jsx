import React, { useState, useEffect, useMemo } from 'react';
import { toast } from 'react-toastify';
import { fetchStudents, createStudent, updateStudent, deleteStudent, fetchDepartments, fetchGroups } from '../../../API/studentsAPI';
import './StudentsSection.css';

const Modal = ({ isOpen, onClose, student, onSave, onDelete, isAddMode }) => {
  const [formData, setFormData] = useState({
    last_name: '',
    first_name: '',
    middle_name: '',
    department_id: '',
    group_id: '',
    email: '',
  });
  const [isSaving, setIsSaving] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [departments, setDepartments] = useState([]);
  const [groups, setGroups] = useState([]);

  useEffect(() => {
    if (isOpen) {
      if (isAddMode) {
        setFormData({
          last_name: '',
          first_name: '',
          middle_name: '',
          department_id: '',
          group_id: '',
          email: '',
        });
        setGroups([]);
      } else {
        setFormData({
          id: student?._id || '',
          last_name: student?.last_name || '',
          first_name: student?.first_name || '',
          middle_name: student?.middle_name || '',
          department_id: student?.department_id || '',
          group_id: student?.group_id || '',
          email: student?.email || '',
        });
      }
      setShowDeleteConfirm(false);
    }
  }, [isOpen, isAddMode, student]);

  useEffect(() => {
    const loadDepartments = async () => {
      try {
        const departmentsData = await fetchDepartments();
        setDepartments(departmentsData || []);
      } catch (error) {
        toast.error(error.message);
      }
    };
    loadDepartments();
  }, []);

  useEffect(() => {
    if (formData.department_id) {
      const loadGroups = async () => {
        try {
          const groupsData = await fetchGroups(formData.department_id);
          setGroups(groupsData || []);
        } catch (error) {
          toast.error(error.message);
        }
      };
      loadGroups();
    } else {
      setGroups([]);
    }
  }, [formData.department_id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
      ...(name === 'department_id' && { group_id: '' }),
    }));
  };

  const handleSave = async () => {
    if (isSaving) return;
    setIsSaving(true);

    try {
      if (!formData.last_name || !formData.first_name || !formData.department_id || !formData.group_id || !formData.email) {
        throw new Error('Заполните все обязательные поля');
      }
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
        throw new Error('Некорректный формат email');
      }

      await onSave(formData);
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
            <p>Вы уверены, что хотите удалить этого студента?</p>
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
            <h2>{isAddMode ? 'Добавить студента' : 'Редактировать студента'}</h2>
            <div className="modal-body">
              <label>
                Фамилия:
                <input
                  type="text"
                  name="last_name"
                  value={formData.last_name}
                  onChange={handleChange}
                  placeholder="Введите фамилию"
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
                  placeholder="Введите имя"
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
                  placeholder="Введите отчество"
                />
              </label>
              <label>
                Отделение:
                <select
                  name="department_id"
                  value={formData.department_id}
                  onChange={handleChange}
                  required
                >
                  <option value="">Выберите отделение</option>
                  {departments.map(department => (
                    <option key={department._id} value={department._id}>
                      {department.name}
                    </option>
                  ))}
                </select>
              </label>
              <label>
                Группа:
                <select
                  name="group_id"
                  value={formData.group_id}
                  onChange={handleChange}
                  required
                  disabled={!formData.department_id}
                >
                  <option value="">Выберите группу</option>
                  {groups.map(group => (
                    <option key={group._id} value={group._id}>
                      {group.name}
                    </option>
                  ))}
                </select>
              </label>
              <label>
                Почта:
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Введите email"
                  required
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

const StudentsSection = () => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterDepartment, setFilterDepartment] = useState('');
  const [filterGroup, setFilterGroup] = useState('');
  const [departments, setDepartments] = useState([]);
  const [groups, setGroups] = useState([]);
  const studentsPerPage = 5;

  useEffect(() => {
    const loadStudents = async () => {
      try {
        setLoading(true);
        const studentsData = await fetchStudents();
        setStudents(studentsData || []);
      } catch (error) {
        toast.error(error.message);
      } finally {
        setLoading(false);
      }
    };
    loadStudents();
  }, []);

  useEffect(() => {
    const loadDepartments = async () => {
      try {
        const departmentsData = await fetchDepartments();
        setDepartments(departmentsData || []);
      } catch (error) {
        toast.error(error.message);
      }
    };
    loadDepartments();
  }, []);

  useEffect(() => {
    if (filterDepartment) {
      const loadGroups = async () => {
        try {
          const groupsData = await fetchGroups(filterDepartment);
          setGroups(groupsData || []);
        } catch (error) {
          toast.error(error.message);
        }
      };
      loadGroups();
    } else {
      setGroups([]);
      setFilterGroup('');
    }
  }, [filterDepartment]);

  const filteredStudents = useMemo(() => {
    return students.filter(student => {
      const fullName = `${student.last_name} ${student.first_name} ${student.middle_name || ''}`.toLowerCase();
      const matchesSearch = fullName.includes(searchQuery.toLowerCase());
      const matchesDepartment = filterDepartment ? student.department_id === filterDepartment : true;
      const matchesGroup = filterGroup ? student.group_id === filterGroup : true;
      return matchesSearch && matchesDepartment && matchesGroup;
    });
  }, [students, searchQuery, filterDepartment, filterGroup]);

  const totalPages = Math.ceil(filteredStudents.length / studentsPerPage);
  const paginatedStudents = useMemo(() => {
    return filteredStudents.slice(
      (currentPage - 1) * studentsPerPage,
      currentPage * studentsPerPage
    );
  }, [filteredStudents, currentPage]);

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const handleAddStudent = async (studentData) => {
    const tempId = `temp_${Date.now()}`;
    try {
      setStudents([...students, { ...studentData, _id: tempId }]);
      setIsAddModalOpen(false);
      toast.success('Студент добавлен!');

      const newStudent = await createStudent(studentData);
      setStudents(students => 
        students.map(s => (s._id === tempId ? newStudent : s))
      );

      const updatedStudents = await fetchStudents();
      setStudents(updatedStudents || []);
    } catch (error) {
      toast.error(error.message);
      const updatedStudents = await fetchStudents();
      setStudents(updatedStudents || []);
    }
  };

  const handleUpdateStudent = async (studentData) => {
    try {
      const updatedStudent = await updateStudent(studentData.id, studentData);
      setStudents(students.map(student =>
        student._id === studentData.id ? updatedStudent : student
      ));
      setIsEditModalOpen(false);
      toast.success('Изменения сохранены!');
    } catch (error) {
      toast.error(error.message);
    }
  };

  const handleDeleteStudent = async (id) => {
    try {
      await deleteStudent(id);
      setStudents(students.filter(student => student._id !== id));
      setIsEditModalOpen(false);
      toast.success('Студент удален!');
    } catch (error) {
      toast.error(error.message);
    }
  };

  const handleCellClick = (student) => {
    setSelectedStudent(student);
    setIsEditModalOpen(true);
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1);
  };

  const handleFilterDepartmentChange = (e) => {
    setFilterDepartment(e.target.value);
    setFilterGroup('');
    setCurrentPage(1);
  };

  const handleFilterGroupChange = (e) => {
    setFilterGroup(e.target.value);
    setCurrentPage(1);
  };

  if (loading) {
    return <div className="loading">Загрузка данных...</div>;
  }

  return (
    <div className="students-section">
      <div className="section-header">
        <h2>Студенты</h2>
        <button className="action-button add" onClick={() => setIsAddModalOpen(true)}>
          Добавить студента
        </button>
      </div>

      <div className="filters">
        <input
          type="text"
          placeholder="Поиск по ФИО"
          value={searchQuery}
          onChange={handleSearchChange}
          className="search-input"
        />
        <select
          value={filterDepartment}
          onChange={handleFilterDepartmentChange}
          className="filter-select"
        >
          <option value="">Все отделения</option>
          {departments.map(department => (
            <option key={department._id} value={department._id}>
              {department.name}
            </option>
          ))}
        </select>
        <select
          value={filterGroup}
          onChange={handleFilterGroupChange}
          className="filter-select"
          disabled={!filterDepartment}
        >
          <option value="">Все группы</option>
          {groups.map(group => (
            <option key={group._id} value={group._id}>
              {group.name}
            </option>
          ))}
        </select>
      </div>

      <div className="table-container">
        <table className="students-table">
          <thead>
            <tr>
              <th>№</th>
              <th>ФИО</th>
              <th>Отделение</th>
              <th>Группа</th>
            </tr>
          </thead>
          <tbody>
            {paginatedStudents.map((student, index) => (
              <tr key={student._id} onClick={() => handleCellClick(student)}>
                <td>{(currentPage - 1) * studentsPerPage + index + 1}</td>
                <td>{student.last_name} {student.first_name} {student.middle_name || ''}</td>
                <td>{student.department_name || '-'}</td>
                <td>{student.group_name || '-'}</td>
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
        onSave={handleAddStudent}
        isAddMode={true}
      />

      <Modal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        student={selectedStudent}
        onSave={handleUpdateStudent}
        onDelete={handleDeleteStudent}
      />
    </div>
  );
};

export default StudentsSection;