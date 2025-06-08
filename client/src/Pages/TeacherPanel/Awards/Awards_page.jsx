import { useState, useEffect, useCallback, useRef } from 'react';
import { toast } from 'react-toastify';
import { fetchStudents, fetchDepartments, fetchGroups, fetchAwardTypes, fetchAwardDegrees, fetchLevels, fetchEvents, createAward } from '../../../API/awardAPI';
import './Awards_page.css';

const AwardsPage = () => {
  const [students, setStudents] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [groups, setGroups] = useState([]);
  const [awardTypes, setAwardTypes] = useState([]);
  const [awardDegrees, setAwardDegrees] = useState([]);
  const [levels, setLevels] = useState([]);
  const [events, setEvents] = useState([]);
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
  const [eventSuggestions, setEventSuggestions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const debounceTimeoutRef = useRef(null);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const [studentsRes, departmentsRes, awardTypesRes, awardDegreesRes, levelsRes, eventsRes] = await Promise.all([
          fetchStudents().catch(() => ({ data: [] })),
          fetchDepartments().catch(() => ({ data: [] })),
          fetchAwardTypes().catch(() => ({ data: [] })),
          fetchAwardDegrees().catch(() => ({ data: [] })),
          fetchLevels().catch(() => ({ data: [] })),
          fetchEvents().catch(() => ({ data: [] })),
        ]);

        const validStudents = (studentsRes.data || []).filter(
          (student) =>
            student &&
            typeof student.last_name === 'string' &&
            typeof student.first_name === 'string' &&
            typeof student.middle_name === 'string'
        );

        console.log('Award Types:', awardTypesRes.data);
        console.log('Award Degrees:', awardDegreesRes.data);

        setStudents(validStudents);
        setDepartments(departmentsRes.data || []);
        setAwardTypes(awardTypesRes.data || []);
        setAwardDegrees(awardDegreesRes.data || []);
        setLevels(levelsRes.data || []);
        setEvents(eventsRes.data || []);

        if (!validStudents.length) toast.warn('Не удалось загрузить список студентов или данные некорректны');
        if (!departmentsRes.data.length) toast.warn('Не удалось загрузить список отделений');
        if (!awardTypesRes.data.length) toast.warn('Не удалось загрузить типы наград');
        if (!awardDegreesRes.data.length) toast.warn('Не удалось загрузить степени наград');
        if (!levelsRes.data.length) toast.warn('Не удалось загрузить уровни');
        if (!eventsRes.data.length) toast.warn('Не удалось загрузить мероприятия');
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
        const groupsRes = await fetchGroups(formData.departmentId).catch(() => ({ data: [] }));
        setGroups(groupsRes.data || []);
        if (!groupsRes.data.length) toast.warn('Не удалось загрузить группы');
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
    if (formData.awardType && awardTypes.length > 0 && awardDegrees.length > 0) {
      console.log('Selected Award Type ID:', formData.awardType);
      const filtered = awardDegrees.filter((degree) => {
        const hasAwardTypesId = degree.awardtypes_id && String(degree.awardtypes_id).length > 0;
        const match = hasAwardTypesId && degree.awardtypes_id.toString() === formData.awardType;
        console.log(`Degree: ${degree.name}, AwardTypes ID: ${degree.awardtypes_id}, Has AwardTypes ID: ${hasAwardTypesId}, Match: ${match}`);
        return match;
      });
      setFilteredDegrees(filtered);
      if (!filtered.some((degree) => degree._id === formData.awardDegree)) {
        setFormData((prev) => ({ ...prev, awardDegree: '' }));
      }
      console.log('Filtered Degrees:', filtered);
      if (filtered.length === 0) {
        toast.warn('Для выбранного типа награды нет доступных степеней');
      }
    } else {
      setFilteredDegrees([]);
      setFormData((prev) => ({ ...prev, awardDegree: '' }));
    }
  }, [formData.awardType, awardTypes, awardDegrees, formData.awardDegree]);

  const handleStudentNameChange = useCallback(
    (value) => {
      if (debounceTimeoutRef.current) {
        clearTimeout(debounceTimeoutRef.current);
      }
      debounceTimeoutRef.current = setTimeout(() => {
        if (value.trim().length > 0) {
          const filtered = students.filter((student) => {
            if (
              !student ||
              typeof student.last_name !== 'string' ||
              typeof student.first_name !== 'string' ||
              typeof student.middle_name !== 'string'
            ) {
              return false;
            }
            return `${student.last_name} ${student.first_name} ${student.middle_name}`
              .toLowerCase()
              .includes(value.toLowerCase());
          });
          setStudentSuggestions(filtered);
        } else {
          setStudentSuggestions([]);
        }
      }, 150);
    },
    [students]
  );

  const handleEventNameChange = useCallback(
    (value) => {
      if (debounceTimeoutRef.current) {
        clearTimeout(debounceTimeoutRef.current);
      }
      debounceTimeoutRef.current = setTimeout(() => {
        if (value.trim().length > 0) {
          const filtered = events.filter((event) =>
            event.title?.toLowerCase().includes(value.toLowerCase())
          );
          setEventSuggestions(filtered);
        } else {
          setEventSuggestions([]);
        }
      }, 150);
    },
    [events]
  );

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (name === 'studentName') {
      handleStudentNameChange(value);
    } else if (name === 'eventName') {
      handleEventNameChange(value);
    }
  };

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

  const handleEventSuggestionClick = (event) => {
    setFormData((prev) => ({
      ...prev,
      eventName: event.title,
      eventId: event._id, // Сохраняем eventId для отправки на сервер
    }));
    setEventSuggestions([]);
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setFormData((prev) => ({ ...prev, file }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

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
    if (filteredDegrees.length > 0 && !formData.awardDegree) {
      toast.error('Выберите степень награды');
      return;
    }
    if (!formData.level) {
      toast.error('Выберите уровень мероприятия');
      return;
    }

    const formDataToSend = new FormData();
    formDataToSend.append('studentId', formData.studentId);
    formDataToSend.append('departmentId', formData.departmentId);
    formDataToSend.append('groupId', formData.groupId);
    formDataToSend.append('eventName', formData.eventName);
    formDataToSend.append('eventId', formData.eventId || ''); // Добавляем eventId
    formDataToSend.append('awardType', formData.awardType);
    if (formData.awardDegree) {
      formDataToSend.append('awardDegree', formData.awardDegree);
    }
    formDataToSend.append('level', formData.level);
    if (formData.file) {
      formDataToSend.append('filePath', formData.file);
    }

    setIsLoading(true);
    try {
      const response = await createAward(formDataToSend);
      toast.success('Награда успешно добавлена');
      window.dispatchEvent(
        new CustomEvent('awardAdded', {
          detail: { awards: response.data.awards, studentId: formData.studentId },
        })
      );
      setFormData({
        studentId: '',
        studentName: '',
        departmentId: '',
        groupId: '',
        eventName: '',
        eventId: '', // Сбрасываем eventId
        awardType: '',
        awardDegree: '',
        level: '',
        file: null,
      });
      setStudentSuggestions([]);
      setEventSuggestions([]);
      setGroups([]);
      setFilteredDegrees([]);
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
              onChange={handleInputChange}
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

          <div className="awards-form-group awards-form-group--relative">
            <label className="awards-label">Название мероприятия</label>
            <input
              type="text"
              name="eventName"
              value={formData.eventName}
              onChange={handleInputChange}
              className="awards-input"
              placeholder="Введите название мероприятия"
              disabled={isLoading}
            />
            {eventSuggestions.length > 0 && (
              <ul className="awards-suggestions">
                {eventSuggestions.map((event) => (
                  <li
                    key={event._id}
                    className="awards-suggestion-item"
                    onClick={() => handleEventSuggestionClick(event)}
                  >
                    {event.title}
                  </li>
                ))}
              </ul>
            )}
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
              <option value="">{filteredDegrees.length === 0 ? 'Степень недоступна' : 'Выберите степень награды'}</option>
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