import api from './api';

export const getLeaderboard = async () => {
  try {
    const response = await api.get('/leaderboard'); 
    return response.data;
  } catch (error) {
    console.error('Error fetching leaderboard:', error.response?.data || error.message);
    throw error;
  }
};

export const updateLeaderboard = async (userId: string, username: string, score: number) => {
    try {
      console.log('Updating leaderboard with:', { userId, username, score });
      const response = await api.post('/leaderboard', { userId, username, score }); 
      return response.data;
    } catch (error) {
      console.error('Error updating leaderboard:', error.response?.data || error.message);
      throw error;
    }
  };