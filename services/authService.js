import api from './api';

export const login = async (credentials) => {
  const response = await api.post('/auth/login', credentials);
  return response.data;
};

export const register = async (credentials) => {
  const response = await api.post('/auth/register', credentials);
  return response.data;
};