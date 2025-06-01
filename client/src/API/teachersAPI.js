import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'https://cyber-cats.ru/api';

const fetchTeachers = async () => {
  try {
    const response = await axios.get(`${API_URL}/teachers`);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.error || 'Ошибка получения преподавателей');
  }
};

const createTeacher = async (teacherData) => {
  try {
    const response = await axios.post(`${API_URL}/teachers`, teacherData);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.error || 'Ошибка создания преподавателя');
  }
};

const updateTeacher = async (id, teacherData) => {
  try {
    const response = await axios.put(`${API_URL}/teachers/${id}`, teacherData);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.error || 'Ошибка обновления преподавателя');
  }
};

const deleteTeacher = async (id) => {
  try {
    await axios.delete(`${API_URL}/teachers/${id}`);
  } catch (error) {
    throw new Error(error.response?.data?.error || 'Ошибка удаления преподавателя');
  }
};

export { fetchTeachers, createTeacher, updateTeacher, deleteTeacher };