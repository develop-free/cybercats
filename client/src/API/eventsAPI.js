import axios from 'axios';

const API_URL = 'https://cyber-cats.ru/api/events';

export const fetchEvents = async () => {
  try {
    const response = await axios.get(API_URL);
    return response.data || [];
  } catch (error) {
    console.error('Error fetching events:', error);
    throw new Error('Не удалось загрузить мероприятия');
  }
};

export const createEvent = async (eventData) => {
  try {
    const response = await axios.post(API_URL, eventData);
    if (!response.data?._id) {
      throw new Error('Сервер не вернул ID созданного мероприятия');
    }
    return response.data;
  } catch (error) {
    console.error('Error creating event:', error);
    throw new Error(error.response?.data?.message || 'Не удалось создать мероприятие');
  }
};

export const updateEvent = async (id, eventData) => {
  try {
    if (!id) throw new Error('ID мероприятия не указан');
    const response = await axios.put(`${API_URL}/${id}`, eventData);
    return response.data;
  } catch (error) {
    console.error('Error updating event:', error);
    throw new Error(error.response?.data?.message || 'Не удалось обновить мероприятие');
  }
};

export const deleteEvent = async (id) => {
  try {
    if (!id) throw new Error('ID мероприятия не указан');
    await axios.delete(`${API_URL}/${id}`);
  } catch (error) {
    console.error('Error deleting event:', error);
    throw new Error(error.response?.data?.message || 'Не удалось удалить мероприятие');
  }
};

export const fetchStudents = async () => {
  try {
    const response = await axios.get(`${API_URL}/students`);
    return response.data || [];
  } catch (error) {
    console.error('Error fetching students:', error);
    throw new Error('Не удалось загрузить студентов');
  }
};

export const fetchTeachers = async () => {
  try {
    const response = await axios.get(`${API_URL}/teachers`);
    return response.data || [];
  } catch (error) {
    console.error('Error fetching teachers:', error);
    throw new Error('Не удалось загрузить преподавателей');
  }
};

export const fetchLevels = async () => {
  try {
    const response = await axios.get(`${API_URL}/levels`);
    return response.data || [];
  } catch (error) {
    console.error('Error fetching levels:', error);
    throw new Error('Не удалось загрузить уровни');
  }
};