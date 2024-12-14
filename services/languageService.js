import api from './api';


export const fetchAllLanguages = async () => {
    try {
      console.log('Fetching all languages...');
      const response = await api.get('/languages');
      console.log('Languages fetched:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error fetching languages:', error.response?.data || error.message);
      throw error;
    }
  };