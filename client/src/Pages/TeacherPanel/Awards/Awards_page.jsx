import { useState, useEffect, useCallback, useRef } from 'react';
import { toast } from 'react-toastify';
import { fetchStudents, fetchDepartments, fetchGroups, fetchAwardTypes, fetchAwardDegrees, createAward } from '../../../API/awardAPI';
import './Awards_page.css';

const AwardsPage = ({ teacherId }) => {
  const [students, setStudents] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [groups, setGroups] = useState([]);
  const [awardTypes, setAwardTypes] = useState([]);
  const [awardDegrees, setAwardDegrees] = useState([]);
  const [formData, setFormData] = useState({
    studentId: '',
    studentName: '',
    departmentId: '',
    groupId: '',
    eventName: '',
    awardType: '',
    awardDegree: '',
    file: null,
  });
  const [filteredDegrees, setFilteredDegrees] = useState([]);
  const [studentSuggestions, setStudentSuggestions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const debounceTimeoutRef = useRef(null);

  // Загрузка начальных данных
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const [studentsRes, departmentsRes, awardTypesRes, awardDegreesRes] = await Promise.all([
          fetchStudents(),
          fetchDepartments(),
          fetchAwardTypes(),
          fetchAwardDegrees(),
        ]);

        setStudents(studentsRes.data || []);
        setDepartments(departmentsRes.data || []);
        setAwardTypes(awardTypesRes.data || []);
        setAwardDegrees(awardDegreesRes.data || []);
      } catch (error) {
        toast.error('Ошибка при загрузке данных');
        console.error('Ошибка загрузки начальных данных:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  // Загрузка групп при изменении departmentId
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
        console.error('Ошибка при загрузке групп:', error);
        toast.error(error.response?.data?.message || 'Ошибка при загрузке групп');
      } finally {
        setIsLoading(false);
      }
    };

    fetchGroupsData();
  }, [formData.departmentId]);

  // Фильтрация степеней наград
  useEffect(() => {
    const degreeMapping = {
      грамота: ['1 место', '2 место', '3 место', 'участник'],
      сертификат: ['участник', 'победитель'],
      диплом: ['1 степень', '2 степень', '3 степень', 'победитель'],
      'благодарственное письмо': ['участник'],
    };

    if (formData.awardType) {
      const selectedType = awardTypes.find((type) => type._id === formData.awardType);
      if (selectedType) {
        const validDegrees = degreeMapping[selectedType.name.toLowerCase()] || [];
        const filtered = awardDegrees.filter((degree) => validDegrees.includes(degree.name));
        setFilteredDegrees(filtered);
        setFormData((prev) => ({ ...prev, awardDegree: '' }));
      }
    } else {
      setFilteredDegrees(awardDegrees);
    }
  }, [formData.awardType, awardTypes, awardDegrees]);

  // Обработка ввода ФИО с дебouncing
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

  // Обработка выбора студента из подсказок
  const handleSuggestionClick = (student) => {
    setFormData((prev) => ({
      ...prev,
      studentId: student._id,
      studentName: `${student.last_name} ${student.first_name} ${student.middle_name}`,
      departmentId: student.departmentId || '',
      groupId: student.groupId || '',
    }));
    setStudentSuggestions([]);
  };

  // Обработка изменения полей формы
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Обработка загрузки файла
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file && !['image/jpeg', 'image/png', 'application/pdf'].includes(file.type)) {
      toast.error('Поддерживаются только файлы JPEG, PNG или PDF');
      return;
    }
    setFormData((prev) => ({ ...prev, file }));
  };

  // Обработка отправки формы
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Валидация формы
    if (!formData.studentId) {
      toast.error('Выберите студента из списка подсказок');
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
    if (!formData.eventName.trim()) {
      toast.error('Введите название мероприятия');
      return;
    }
    if (!formData.awardType) {
      toast.error('Выберите тип награды');
      return;
    }
    if (!formData.awardDegree) {
      toast.error('Выберите степень награды');
      return;
    }
    if (!formData.file) {
      toast.error('Загрузите файл награды');
      return;
    }

    const formDataToSend = new FormData();
    formDataToSend.append('studentId', formData.studentId);
    formDataToSend.append('departmentId', formData.departmentId);
    formDataToSend.append('groupId', formData.groupId);
    formDataToSend.append('eventName', formData.eventName);
    formDataToSend.append('awardType', formData.awardType);
    formDataToSend.append('awardDegree', formData.awardDegree);
    formDataToSend.append('filePath', formData.file);
    formDataToSend.append('teacherId', teacherId);

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
        file: null,
      });
      setStudentSuggestions([]);
      setGroups([]);
    } catch (error) {
      console.error('Ошибка при создании награды:', error);
      toast.error(error.response?.data?.message || 'Ошибка при добавлении награды');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="awards-page p-6">
      <h2 className="text-2xl font-bold mb-4">Добавить награду</h2>
      {isLoading && <div className="text-center">Загрузка...</div>}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="relative">
          <label className="block text-sm font-medium text-gray-700">ФИО студента</label>
          <input
            type="text"
            name="studentName"
            value={formData.studentName}
            onChange={handleStudentNameChange}
            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
            placeholder="Введите ФИО студента"
            required
            disabled={isLoading}
          />
          {studentSuggestions.length > 0 && (
            <ul className="absolute z-10 bg-white border border-gray-300 w-full max-h-40 overflow-y-auto rounded-md mt-1">
              {studentSuggestions.map((student) => (
                <li
                  key={student._id}
                  className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                  onClick={() => handleSuggestionClick(student)}
                >
                  {student.last_name} {student.first_name} {student.middle_name}
                </li>
              ))}
            </ul>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Отделение</label>
          <select
            name="departmentId"
            value={formData.departmentId}
            onChange={handleInputChange}
            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
            required
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

        <div>
          <label className="block text-sm font-medium text-gray-700">Группа</label>
          <select
            name="groupId"
            value={formData.groupId}
            onChange={handleInputChange}
            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
            required
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

        <div>
          <label className="block text-sm font-medium text-gray-700">Название мероприятия</label>
          <input
            type="text"
            name="eventName"
            value={formData.eventName}
            onChange={handleInputChange}
            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
            required
            disabled={isLoading}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Тип награды</label>
          <select
            name="awardType"
            value={formData.awardType}
            onChange={handleInputChange}
            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
            required
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

        <div>
          <label className="block text-sm font-medium text-gray-700">Степень награды</label>
          <select
            name="awardDegree"
            value={formData.awardDegree}
            onChange={handleInputChange}
            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
            required
            disabled={!formData.awardType || isLoading}
          >
            <option value="">Выберите степень награды</option>
            {filteredDegrees.map((degree) => (
              <option key={degree._id} value={degree._id}>
                {degree.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Файл награды</label>
          <input
            type="file"
            name="file"
            onChange={handleFileChange}
            className="mt-1 block w-full text-gray-700"
            accept="image/jpeg,image/png,application/pdf"
            required
            disabled={isLoading}
          />
        </div>

        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 disabled:bg-gray-400"
          disabled={isLoading}
        >
          {isLoading ? 'Добавление...' : 'Добавить награду'}
        </button>
      </form>
    </div>
  );
};

export default AwardsPage;