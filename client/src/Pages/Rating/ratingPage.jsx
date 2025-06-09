import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import './ratingPage.css';
import Header from '../../components/Header/headerPage';
import Footer from '../../components/Footer/footerPage';

const Rating = () => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [sortOrder, setSortOrder] = useState('desc');
  const [filterDepartment, setFilterDepartment] = useState('');
  const [filterGroup, setFilterGroup] = useState('');
  const studentsPerPage = 5;

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        setLoading(true);
        const mockStudents = [
          { id: 1, fullName: 'Иванов Иван Иванович', department: 'ИТ', group: 'ИТ-101', level: 3, points: 95 },
          { id: 2, fullName: 'Петрова Анна Сергеевна', department: 'ИТ', group: 'ИТ-102', level: 2, points: 88 },
          { id: 3, fullName: 'Сидоров Алексей Петрович', department: 'Экономика', group: 'ЭК-201', level: 4, points: 92 },
          { id: 4, fullName: 'Кузнецова Мария Ивановна', department: 'ИТ', group: 'ИТ-101', level: 3, points: 85 },
          { id: 5, fullName: 'Смирнов Дмитрий Андреевич', department: 'Экономика', group: 'ЭК-202', level: 1, points: 78 },
          { id: 6, fullName: 'Васильева Елена Викторовна', department: 'ИТ', group: 'ИТ-102', level: 2, points: 90 },
        ];
        setStudents(mockStudents.sort((a, b) => b.points - a.points));
      } catch (error) {
        toast.error('Ошибка загрузки данных: ' + error.message);
      } finally {
        setLoading(false);
      }
    };
    fetchStudents();
  }, []);

  const handleSort = () => {
    const newSortOrder = sortOrder === 'desc' ? 'asc' : 'desc';
    setSortOrder(newSortOrder);
    setStudents([...students].sort((a, b) => 
      newSortOrder === 'desc' ? b.points - a.points : a.points - b.points
    ));
  };

  const filteredStudents = students.filter(student => 
    (filterDepartment === '' || student.department.toLowerCase().includes(filterDepartment.toLowerCase())) &&
    (filterGroup === '' || student.group.toLowerCase().includes(filterGroup.toLowerCase()))
  );

  const totalPages = Math.ceil(filteredStudents.length / studentsPerPage);
  const paginatedStudents = filteredStudents.slice(
    (currentPage - 1) * studentsPerPage,
    currentPage * studentsPerPage
  );

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  if (loading) {
    return <div className="rating-loading">Загрузка данных...</div>;
  }

  return (
    <>
      <Header />
      <div className="student-container">
        <div className="rating-content">
          <div className="rating-table-section">
            <div className="rating-section-header">
              <h2 className="section-title">Рейтинг студентов</h2>
              <div className="rating-filters">
                <input
                  type="text"
                  placeholder="Отделение..."
                  value={filterDepartment}
                  onChange={(e) => setFilterDepartment(e.target.value)}
                  className="filter-input"
                />
                <input
                  type="text"
                  placeholder="Группа..."
                  value={filterGroup}
                  onChange={(e) => setFilterGroup(e.target.value)}
                  className="filter-input"
                />
              </div>
            </div>
            
           <div className="rating-table-container">
            <div className="rating-table-desktop">
              <table className="rating-table">
                <thead>
                  <tr>
                    <th className="place-col">№</th>
                    <th className="name-col">ФИО</th>
                    <th className="dept-col">Отделение</th>
                    <th className="group-col">Группа</th>
                    <th className="level-col">Уровень</th>
                    <th className="points-col" onClick={handleSort}>
                      Баллы {sortOrder === 'desc' ? '▼' : '▲'}
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedStudents.map((student, index) => (
                    <tr key={student.id}>
                      <td className="place-col">{(currentPage - 1) * studentsPerPage + index + 1}</td>
                      <td className="name-col">{student.fullName}</td>
                      <td className="dept-col">{student.department}</td>
                      <td className="group-col">{student.group}</td>
                      <td className="level-col">
                        <span className={`level-badge level-${student.level}`}>
                          {student.level}
                        </span>
                      </td>
                      <td className="points-col">
                        <span className="points-value">{student.points}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            
            <div className="rating-table-mobile">
              {paginatedStudents.map((student, index) => (
                <div key={student.id} className="rating-card">
                  <div className="card-header">
                    <span className="card-position">{(currentPage - 1) * studentsPerPage + index + 1}</span>
                    <h3 className="card-name">{student.fullName}</h3>
                    <span className={`level-badge level-${student.level}`}>
                      Уровень {student.level}
                    </span>
                  </div>
                  <div className="card-details">
                    <div className="detail-row">
                      <span>Отделение:</span>
                      <span>{student.department}</span>
                    </div>
                    <div className="detail-row">
                      <span>Группа:</span>
                      <span>{student.group}</span>
                    </div>
                    <div className="detail-row highlight">
                      <span>Баллы:</span>
                      <span onClick={handleSort} className="points-value">
                        {student.points} {sortOrder === 'desc' ? '▼' : '▲'}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
              {totalPages > 1 && (
                <div className="rating-pagination">
                  <button
                    className="rating-pagination-button"
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                  >
                    Назад
                  </button>
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                    <button
                      key={page}
                      className={`rating-pagination-button ${currentPage === page ? 'active' : ''}`}
                      onClick={() => handlePageChange(page)}
                    >
                      {page}
                    </button>
                  ))}
                  <button
                    className="rating-pagination-button"
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                  >
                    Вперед
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Rating;  