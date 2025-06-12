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
          { id: 1, fullName: 'Арнольд Александр Сергеевич', department: 'ИСиП', group: '103', achievementLevel: 3, levels_rat: Math.floor(Math.random() * 5) + 1, points: Math.floor(Math.random() * 101) },
          { id: 2, fullName: '', department: 'ИСиП', group: '103', achievementLevel: 2, levels_rat: Math.floor(Math.random() * 5) + 1, points: Math.floor(Math.random() * 101) },
          { id: 3, fullName: 'Сидоров Алексей Петрович', department: 'ИСиП', group: '203', achievementLevel: 4, levels_rat: Math.floor(Math.random() * 5) + 1, points: Math.floor(Math.random() * 101) },
          { id: 4, fullName: 'Кузнецова Полина Ивановна', department: 'ИСиП', group: '103', achievementLevel: 3, levels_rat: Math.floor(Math.random() * 5) + 1, points: Math.floor(Math.random() * 101) },
          { id: 5, fullName: 'Смирнов Дмитрий Андреевич', department: 'ИСиП', group: '203', achievementLevel: 1, levels_rat: Math.floor(Math.random() * 5) + 1, points: Math.floor(Math.random() * 101) },
          { id: 6, fullName: 'Васильева Елена Викторовна', department: 'ИСиП', group: '203', achievementLevel: 2, levels_rat: Math.floor(Math.random() * 5) + 1, points: Math.floor(Math.random() * 101) },
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
                      <th className="level-col">Уровень достижений</th>
                      <th className="rating-level-col">Рейтинговый уровень</th>
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
                          <span className={`level-badge level-${student.achievementLevel}`}>
                            {student.achievementLevel}
                          </span>
                        </td>
                        <td className="rating-level-col">
                          <span className={`level-badge level-${student.levels_rat}`}>
                            {student.levels_rat}
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
                      <span className={`level-badge level-${student.achievementLevel}`}>
                        Уровень достижений {student.achievementLevel}
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
                      <div className="detail-row">
                        <span>Рейтинговый уровень:</span>
                        <span className={`level-badge level-${student.levels_rat}`}>
                          {student.levels_rat}
                        </span>
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