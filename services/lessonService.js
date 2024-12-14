import api from './api';

export const fetchLessonsByLanguage = async (languageId) => {
    try {
      const response = await api.get(`/lessons/language/${languageId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching lessons by language:', error.response?.data || error.message);
      throw error;
    }
  };

export const getLessonById = async (id) => {
  const response = await api.get(`/lessons/${id}`);
  return response.data;
};