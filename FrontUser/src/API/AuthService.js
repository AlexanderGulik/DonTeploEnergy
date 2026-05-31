// src/API/AuthService.js
import axios from './axios';

export const authAPI = {
  register: async (userData) => {
    try {
      const response = await axios.post('/auth/register-user', userData);
      if (response.data.accessToken) {
        localStorage.setItem('token', response.data.accessToken);
        
        // Сохраняем данные пользователя
        const store = {
          accessToken: response.data.accessToken,
          user: userData
        };
        localStorage.setItem('store', JSON.stringify(store));
      }
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  login: async (email, password) => {
    try {
      const response = await axios.post('/auth/login-user', { email, password });
      
      if (response.data.accessToken) {
        localStorage.setItem('token', response.data.accessToken);
        
        // Сохраняем данные пользователя из ответа
        const store = {
          accessToken: response.data.accessToken,
          user: {
            firstName: response.data.user?.firstName || '',
            lastName: response.data.user?.lastName || '',
            email: response.data.user?.email || email,
            phone: response.data.user?.phone || '',
            address: response.data.user?.address || '',
            userId: response.data.user?.userId
          }
        };
        localStorage.setItem('store', JSON.stringify(store));
      }
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('store');
  },

  refresh: async () => {
    try {
      const response = await axios.post('/auth/refresh-user', {});
      
      if (response.data.accessToken) {
        localStorage.setItem('token', response.data.accessToken);
        
        // Обновляем только токен в store
        const store = JSON.parse(localStorage.getItem('store') || '{}');
        store.accessToken = response.data.accessToken;
        localStorage.setItem('store', JSON.stringify(store));
      }
      
      return response.data;
    } catch (error) {
      throw error;
    }
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
