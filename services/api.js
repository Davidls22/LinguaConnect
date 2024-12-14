import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const API_BASE_URL = 'http://localhost:5001/api'; 

const api = axios.create({
  baseURL: API_BASE_URL,
});

api.interceptors.request.use(
    async (config) => {
      const excludedPaths = ['/auth/register', '/auth/login'];
      console.log(`API Request: ${config.method?.toUpperCase()} ${config.url}`);
  
      if (!excludedPaths.includes(config.url)) {
        const userData = await AsyncStorage.getItem('user');
        const user = userData ? JSON.parse(userData) : null;
  
        if (user && user.token) {
          config.headers.Authorization = `Bearer ${user.token}`;
          console.log('Authorization header set with token.');
        } else {
          console.log('No token found in user data.');
        }
      }
      return config;
    },
    (error) => {
      console.error('API Request Error:', error);
      return Promise.reject(error);
    }
  );

api.interceptors.response.use(
  (response) => {
    console.log(`API Response: ${response.status} ${response.config.url}`);
    return response;
  },
  (error) => {
    console.error(`API Response Error: ${error.response?.status} ${error.config.url}`, error.response?.data || error.message);
    return Promise.reject(error);
  }
);

export default api;