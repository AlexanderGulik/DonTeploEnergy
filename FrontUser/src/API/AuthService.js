// src/API/AuthService.js
import axios from './axios';

export const authAPI = {
  register: async (userData) => {
    try {
      const response = await axios.post('/auth/register-user', userData);
      if (response.data.token) {
        localStorage.setItem('token', response.data.token);
      }
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  login: async (email, password) => {
    try {
      const response = await axios.post('/auth/login-user', { email, password });
      if (response.data.token) {
        localStorage.setItem('token', response.data.token);
      }
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  logout: () => {
    localStorage.removeItem('token');
  },

 


  getDistricts: async () => {
    try {
      const response = await axios.get('/districts');
      return response.data;
    } catch (error) {
      throw error;
    }
  }
};
