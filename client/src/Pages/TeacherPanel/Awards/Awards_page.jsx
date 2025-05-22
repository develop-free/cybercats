import { useState, useEffect, useCallback, useRef } from 'react';
import { toast } from 'react-toastify';
import { fetchStudents, fetchDepartments, fetchGroups, fetchAwardTypes, fetchAwardDegrees, fetchLevels, createAward } from '../../../API/awardAPI';
import './Awards_page.css';

const AwardsPage = ({ teacherId }) => {
  const [students, setStudents] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [groups, setGroups] = useState([]);
  const [awardTypes, setAwardTypes] = useState([]);
  const [awardDegrees, setAwardDegrees] = useState([]);
  const [levels, setLevels] = useState([]);
  const [formData, setFormData] = useState({
    studentId: '',
    studentName: '',
    departmentId: '',
    groupId: '',
    eventName: '',
    awardType: '',
    awardDegree: '',
    level: '',
    file: null,
  });
  const [filteredDegrees, setFilteredDegrees] = useState([]);
  const [studentSuggestions, setStudentSuggestions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const debounceTimeoutRef = useRef(null);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const [studentsRes, departmentsRes, awardTypesRes, awardDegreesRes, levelsRes] = await Promise.all([
          fetchStudents(),
          fetchDepartments(),
          fetchAwardTypes(),
          fetchAwardDegrees(),
          fetchLevels(),
        ]);

        setStudents(studentsRes.data || []);
        setDepartments(departmentsRes.data || []);
        setAwardTypes(awardTypesRes.data || []);
        setAwardDegrees(awardDegreesRes.data || []);
        setLevels(levelsRes.data || []);
      } catch (error) {
        toast.error(`Не удалось загрузить данные: ${error.response?.data?.message || error.message}`);
        console.error('Ошибка загрузки начальных данных:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    const fetchGroupsData = async () => {
      if (!formData.departmentId) {
        setGroups([]);
        setFormData((prev) => ({ ...prev, groupId: '' }));
        return;
      }

      setIsLoading(true);
      try {
        const groupsRes = await fetchGroups(formData.departmentId);
        setGroups(groupsRes.data || []);
      } catch (error) {
        toast.error(`Не удалось загрузить группы: ${error.response?.data?.message || error.message}`);
        console.error('Ошибка при загрузке групп:', error);
      } finally {
        setIsLoading(false);
      }
    };

    if (formData.departmentId) {
      fetchGroupsData();
    }
  }, [formData.departmentId]);

  useEffect(() => {
    if (formData.awardType) {
      const selectedType = awardTypes.find((type) => type._id === formData.awardType);
      if (selectedType && selectedType.name.toLowerCase() !== 'благодарственное письмо') {
        const filtered = awardDegrees.filter((degree) => degree.awarddegrees_id.toString() === formData.awardType);
        setFilteredDegrees(filtered);
      } else {
        setFilteredDegrees([]);
        setFormData((prev) => ({ ...prev, awardDegree: '' }));
      }
    } else {
      setFilteredDegrees([]);
      setFormData((prev) => ({ ...prev, awardDegree: '' }));
    }
  }, [formData.awardType, awardTypes, awardDegrees]);

  const handleStudentNameChange = useCallback((e) => {
    const value = e.target.value;
    setFormData((prev) => ({ ...prev, studentName: value, studentId: '' }));

    if (debounceTimeoutRef.current) {
      clearTimeout(debounceTimeoutRef.current);
    }
    debounceTimeoutRef.current = setTimeout(() => {
      if (value.trim().length > 0) {
        const filtered = students.filter((student) =>
          `${student.last_name} ${student.first_name} ${student.middle_name}`
            .toLowerCase()
            .includes(value.toLowerCase())
        );
        setStudentSuggestions(filtered);
      } else {
        setStudentSuggestions([]);
      }
    }, 300);
  }, [students]);

  const handleSuggestionClick = (student) => {
    setFormData((prev) => ({
      ...prev,
      studentId: student._id,
      studentName: `${student.last_name} ${student.first_name} ${student.middle_name}`,
      departmentId: student.department_id || '',
      groupId: student.group_id || '',
    }));
    setStudentSuggestions([]);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setFormData((prev) => ({ ...prev, file }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Проверка обязательных полей
    if (!formData.studentId) {
      toast.error('Выберите студента');
      return;
    }
    if (!formData.departmentId) {
      toast.error('Выберите отделение');
      return;
    }
    if (!formData.groupId) {
      toast.error('Выберите группу');
      return;
    }
    if (!formData.eventName) {
      toast.error('Введите название мероприятия');
      return;
    }
    if (!formData.awardType) {
      toast.error('Выберите тип награды');
      return;
    }
    if (!formData.level) {
      toast.error('Выберите уровень мероприятия');
      return;
    }
    if (!teacherId) {
      toast.error('ID преподавателя отсутствует');
      return;
    }

    const formDataToSend = new FormData();
    formDataToSend.append('studentId', formData.studentId);
    formDataToSend.append('departmentId', formData.departmentId);
    formDataToSend.append('groupId', formData.groupId);
    formDataToSend.append('eventName', formData.eventName);
    formDataToSend.append('awardType', formData.awardType);
    if (formData.awardDegree) {
      formDataToSend.append('awardDegree', formData.awardDegree);
    }
    formDataToSend.append('level', formData.level);
    if (formData.file) {
      formDataToSend.append('filePath', formData.file);
    }
    formDataToSend.append('teacherId', teacherId);

    // Логирование отправляемых данных
    console.log('Отправляемые данные:', {
      studentId: formData.studentId,
      departmentId: formData.departmentId,
      groupId: formData.groupId,
      eventName: formData.eventName,
      awardType: formData.awardType,
      awardDegree: formData.awardDegree,
      level: formData.level,
      file: formData.file ? formData.file.name : null,
      teacherId,
    });

    setIsLoading(true);
    try {
      await createAward(formDataToSend);
      toast.success('Награда успешно добавлена');
      setFormData({
        studentId: '',
        studentName: '',
        departmentId: '',
        groupId: '',
        eventName: '',
        awardType: '',
        awardDegree: '',
        level: '',
        file: null,
      });
      setStudentSuggestions([]);
      setGroups([]);
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message;
      toast.error(`Не удалось добавить награду: ${errorMessage}`);
      console.error('Ошибка при создании награды:', error, error.response?.data);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="awards-page">
      <div className="awards-container">
        <h2 className="awards-title">Добавить награду</h2>
        {isLoading && <div className="awards-loading">Загрузка...</div>}
        <form onSubmit={handleSubmit} className="awards-form">
          <div className="awards-form-group awards-form-group--relative">
            <label className="awards-label">ФИО студента</label>
            <input
              type="text"
              name="studentName"
              value={formData.studentName}
              onChange={handleStudentNameChange}
              className="awards-input"
              placeholder="Введите ФИО студента"
              disabled={isLoading}
            />
            {studentSuggestions.length > 0 && (
              <ul className="awards-suggestions">
                {studentSuggestions.map((student) => (
                  <li
                    key={student._id}
                    className="awards-suggestion-item"
                    onClick={() => handleSuggestionClick(student)}
                  >
                    {student.last_name} {student.first_name} {student.middle_name}
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className="awards-form-group">
            <label className="awards-label">Отделение</label>
            <select
              name="departmentId"
              value={formData.departmentId}
              onChange={handleInputChange}
              className="awards-select"
              disabled={isLoading}
            >
              <option value="">Выберите отделение</option>
              {departments.map((department) => (
                <option key={department._id} value={department._id}>
                  {department.name}
                </option>
              ))}
            </select>
          </div>

          <div className="awards-form-group">
            <label className="awards-label">Группа</label>
            <select
              name="groupId"
              value={formData.groupId}
              onChange={handleInputChange}
              className="awards-select"
              disabled={!formData.departmentId || isLoading}
            >
              <option value="">Выберите группу</option>
              {groups.map((group) => (
                <option key={group._id} value={group._id}>
                  {group.name}
                </option>
              ))}
            </select>
          </div>

          <div className="awards-form-group">
            <label className="awards-label">Название мероприятия</label>
            <input
              type="text"
              name="eventName"
              value={formData.eventName}
              onChange={handleInputChange}
              className="awards-input"
              disabled={isLoading}
            />
          </div>

          <div className="awards-form-group">
            <label className="awards-label">Тип награды</label>
            <select
              name="awardType"
              value={formData.awardType}
              onChange={handleInputChange}
              className="awards-select"
              disabled={isLoading}
            >
              <option value="">Выберите тип награды</option>
              {awardTypes.map((type) => (
                <option key={type._id} value={type._id}>
                  {type.name}
                </option>
              ))}
            </select>
          </div>

          <div className="awards-form-group">
            <label className="awards-label">Степень награды</label>
            <select
              name="awardDegree"
              value={formData.awardDegree}
              onChange={handleInputChange}
              className="awards-select"
              disabled={!formData.awardType || filteredDegrees.length === 0 || isLoading}
            >
              <option value="">Выберите степень награды</option>
              {filteredDegrees.map((degree) => (
                <option key={degree._id} value={degree._id}>
                  {degree.name}
                </option>
              ))}
            </select>
          </div>

          <div className="awards-form-group">
            <label className="awards-label">Уровень мероприятия</label>
            <select
              name="level"
              value={formData.level}
              onChange={handleInputChange}
              className="awards-select"
              disabled={isLoading}
            >
              <option value="">Выберите уровень мероприятия</option>
              {levels.map((level) => (
                <option key={level._id} value={level._id}>
                  {level.levelName}
                </option>
              ))}
            </select>
          </div>

          <div className="awards-form-group">
            <label className="awards-label">Файл награды</label>
            <input
              type="file"
              name="file"
              onChange={handleFileChange}
              className="awards-file-input"
              accept="image/jpeg,image/png,application/pdf"
              disabled={isLoading}
            />
          </div>

          <button
            type="submit"
            className="awards-submit-button"
            disabled={isLoading}
          >
            {isLoading ? 'Добавление...' : 'Добавить награду'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AwardsPage;