import React, { useState, useEffect, useCallback } from 'react';
import { toast } from 'react-toastify';
import { fetchAwardsByStudent, getStudentIdByUser, fetchStudents } from '../../../../API/awardAPI';
import './PortfolioSection.css';

const PortfolioSection = ({ userId }) => { // userId передается через пропсы
  const [awards, setAwards] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [currentStudentId, setCurrentStudentId] = useState(null);
  const [studentName, setStudentName] = useState('');

  const loadStudentAndAwards = useCallback(async () => {
    if (!userId) {
      toast.error('Пользователь не аутентифицирован');
      return;
    }

    setIsLoading(true);
    try {
      // Получаем studentId по userId
      const studentResponse = await getStudentIdByUser(userId);
      const studentId = studentResponse.data.studentId;

      if (!studentId) {
        toast.error('Студент не найден для данного пользователя');
        setIsLoading(false);
        return;
      }

      setCurrentStudentId(studentId);

      // Загружаем информацию о студенте (для отображения имени)
      const student = await fetchStudents().then((res) =>
        res.data.find((s) => s._id === studentId)
      );
      if (student) {
        setStudentName(`${student.last_name} ${student.first_name} ${student.middle_name}`);
      }

      // Загружаем награды по studentId
      const awardsResponse = await fetchAwardsByStudent(studentId);
      setAwards(awardsResponse.data || []);
    } catch (error) {
      toast.error(`Не удалось загрузить данные: ${error.response?.data?.message || error.message}`);
      console.error('Ошибка загрузки данных:', error);
      setAwards([]);
    } finally {
      setIsLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    loadStudentAndAwards();

    const handleAwardAdded = (event) => {
      if (event.detail && event.detail.awards && event.detail.studentId === currentStudentId) {
        setAwards(event.detail.awards);
      }
    };

    window.addEventListener('awardAdded', handleAwardAdded);

    return () => {
      window.removeEventListener('awardAdded', handleAwardAdded);
    };
  }, [currentStudentId, loadStudentAndAwards]);

  return (
    <div className="section" id="portfolio-section">
      <h2>Моё портфолио</h2>
      {studentName && <h3>Студент: {studentName}</h3>}
      {isLoading && <p>Загрузка наград...</p>}
      {!isLoading && !currentStudentId && <p>Студент не найден.</p>}
      {!isLoading && currentStudentId && awards.length === 0 && <p>У вас пока нет наград.</p>}
      <div className="portfolio-list">
        {awards.map((award) => (
          <div key={award._id} className="portfolio-card">
            <h3>{award.eventName}</h3>
            <p>
              Тип награды: {award.awardType?.name || 'Не указан'}
              {award.awardDegree ? `, Степень: ${award.awardDegree.name}` : ''}
            </p>
            <p>Уровень: {award.level?.levelName || 'Не указан'}</p>
            {award.filePath && (
              <p>
                <a href={`/awards/${award.filePath.split('/').pop()}`} target="_blank" rel="noopener noreferrer">
                  Просмотреть документ
                </a>
              </p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default PortfolioSection;