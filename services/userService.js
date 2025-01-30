import api from './api';

export const getUserProgress = async () => {
    try {
      console.log('Requesting user progress...');
      const response = await api.get('/users/progress');
      console.log('User progress response:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error fetching user progress:', error.response?.data || error.message);
      throw error;
    }
  };

export const updateLanguage = async (languageId) => {
    try {
      const response = await api.patch('/users/language', { languageId });
      console.log('Update language response:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error updating language:', error.response?.data || error.message);
      throw error;
    }
  };

export const updateUserPoints = async (points: number) => {
  try {
    console.log(`Updating user points by: ${points}`);
    const response = await api.post('/users/update-points', { points });
    console.log('Update points response:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error updating points:', error.response?.data || error.message);
    throw error;
  }
};

export const getLeaderboard = async () => {
  try {
    console.log('Requesting leaderboard...');
    const response = await api.get('/users/leaderboard');
    console.log('Leaderboard response:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error fetching leaderboard:', error.response?.data || error.message);
    throw error;
  }
};

export const updateUserProfileImage = async (imageUri: string, token: string) => {
  try {
    const response = await api.patch('/users/profile-image', { imageUri }, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
  } catch (error) {
    console.error('Error updating profile image:', error.response?.data || error.message);
    throw error;
  }
};

export const fetchFeed = async () => {
  try {
    console.log('Fetching user feed...');
    const response = await api.get('/users/feed');
    console.log('Feed response:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error fetching feed:', error.response?.data || error.message);
    throw error;
  }
};