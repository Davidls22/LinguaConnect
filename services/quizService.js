import api from './api';

export const fetchQuizzes = async () => {
  try {
    const response = await api.get('/quizzes');
    return response.data;
  } catch (error) {
    console.error('Error fetching quizzes:', error);
    throw error;
  }
};

export const getQuizById = async (id) => {
  try {
    const response = await api.get(`/quizzes/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching quiz with ID ${id}:`, error);
    throw error;
  }
};

  
  export const getQuizByLessonId = async (lessonId) => {
    try {
      const response = await api.get(`/lessons/${lessonId}/quiz`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching quiz for lesson ID ${lessonId}:`, error);
      throw error;
    }
  };