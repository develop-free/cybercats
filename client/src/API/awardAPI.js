import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'https://cyber-cats.ru/api';

export const fetchStudents = async () => {
  try {
    return await axios.get(`${API_URL}/awards/students`);
  } catch (error) {
    console.error('Ошибка при загрузке студентов:', error.message);
    throw error;
  }
};

export const fetchDepartments = async () => {
  try {
    return await axios.get(`${API_URL}/awards/departments`);
  } catch (error) {
    console.error('Ошибка при загрузке отделений:', error.message);
    throw error;
  }
};

export const fetchGroups = async (departmentId) => {
  if (!departmentId) {
    return { data: [] };
  }
  try {
    return await axios.get(`${API_URL}/awards/groups/${departmentId}`);
  } catch (error) {
    console.error('Ошибка при загрузке групп:', error.message);
    throw error;
  }
};

export const fetchAwardTypes = async () => {
  try {
    return await axios.get(`${API_URL}/awards/types`);
  } catch (error) {
    console.error('Ошибка при загрузке типов наград:', error.message);
    throw error;
  }
};

export const fetchAwardDegrees = async () => {
  try {
    return await axios.get(`${API_URL}/awards/degrees`);
  } catch (error) {
    console.error('Ошибка при загрузке степеней наград:', error.message);
    throw error;
  }
};

export const fetchLevels = async () => {
  try {
    return await axios.get(`${API_URL}/awards/levels`);
  } catch (error) {
    console.error('Ошибка при загрузке уровней:', error.message);
    throw error;
  }
};

export const fetchEvents = async () => {
  try {
    return await axios.get(`${API_URL}/awards/events`);
  } catch (error) {
    console.error('Ошибка при загрузке мероприятий:', error.message);
    throw error;
  }
};

export const fetchAwardsByStudent = async (studentId) => {
  try {
    return await axios.get(`${API_URL}/awards/student/${studentId}`);
  } catch (error) {
    console.error('Ошибка при загрузке наград студента:', error.message);
    throw error;
  }
};

export const getStudentIdByUser = async (userId) => {
  try {
    return await axios.get(`${API_URL}/awards/user/${userId}/studentId`);
  } catch (error) {
    console.error('Ошибка при получении studentId:', error.message);
    throw error;
  }
};

export const createAward = async (formData) => {
  try {
    return await axios.post(`${API_URL}/awards`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  } catch (error) {
    console.error('Ошибка при создании награды:', error.message);
    throw error;
  }
};