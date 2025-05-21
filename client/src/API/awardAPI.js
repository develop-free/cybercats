import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

export const fetchStudents = () => axios.get(`${API_URL}/students`);
export const fetchDepartments = () => axios.get(`${API_URL}/departments`);
export const fetchGroups = (departmentId) => {
  if (!departmentId) {
    return Promise.resolve({ data: [] });
  }
  console.log('Запрос групп для departmentId:', departmentId); // Отладочный лог
  return axios.get(`${API_URL}/groups`, { params: { departmentId } });
};
export const fetchAwardTypes = () => axios.get(`${API_URL}/awards/types`);
export const fetchAwardDegrees = () => axios.get(`${API_URL}/awards/degrees`);
export const createAward = (formData) =>
  axios.post(`${API_URL}/awards`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });