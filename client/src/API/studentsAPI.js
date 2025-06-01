import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'https://cyber-cats.ru/api';

const fetchStudents = async () => {
  try {
    const response = await axios.get(`${API_URL}/students`);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.error || 'Ошибка получения студентов');
  }
};

const createStudent = async (studentData) => {
  try {
    const response = await axios.post(`${API_URL}/students`, studentData);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.error || 'Ошибка создания студента');
  }
};

const updateStudent = async (id, studentData) => {
  try {
    const response = await axios.put(`${API_URL}/students/${id}`, studentData);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.error || 'Ошибка обновления студента');
  }
};

const deleteStudent = async (id) => {
  try {
    await axios.delete(`${API_URL}/students/${id}`);
  } catch (error) {
    throw new Error(error.response?.data?.error || 'Ошибка удаления студента');
  }
};

const fetchDepartments = async () => {
  try {
    const response = await axios.get(`${API_URL}/departments`);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.error || 'Ошибка получения отделений');
  }
};

const fetchGroups = async (departmentId) => {
  try {
    const response = await axios.get(`${API_URL}/groups?department_id=${departmentId}`);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.error || 'Ошибка получения групп');
  }
};

export { fetchStudents, createStudent, updateStudent, deleteStudent, fetchDepartments, fetchGroups };