// src/context/AuthContext.jsx
import React, { createContext, useState, useContext, useEffect, useCallback } from 'react';
import { authAPI } from '../API/AuthService';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Просто проверяем наличие токена, но не запрашиваем профиль
    const token = localStorage.getItem('token');
    const savedUser = localStorage.getItem('user');
    
    if (token && savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (error) {
        console.error('Failed to restore user:', error);
      }
    }
    setLoading(false);
  }, []);

  const login = useCallback(async (email, password) => {
    const response = await authAPI.login(email, password);
    console.log('Login response:', response);
    
    if (response.accessToken) {
      // Сохраняем токен
      localStorage.setItem('token', response.accessToken);
      if (response.refreshToken) {
        localStorage.setItem('refreshToken', response.refreshToken);
      }
      
      // Создаем базового пользователя из ответа
      const userData = {
        firstname: response.user?.name?.split('@')[0] || email.split('@')[0],
        lastname: '',
        email: email,
        phone: '',
        address: '',
        district: '',
        isAuthenticated: true
      };
      
      setUser(userData);
      localStorage.setItem('user', JSON.stringify(userData));
    }
    
    return response;
  }, []);

  const register = useCallback(async (userData) => {
    const response = await authAPI.register(userData);
    console.log('Register response:', response);
    
    if (response.accessToken) {
      // Сохраняем токен
      localStorage.setItem('token', response.accessToken);
      if (response.refreshToken) {
        localStorage.setItem('refreshToken', response.refreshToken);
      }
      
      // Создаем пользователя из данных формы
      const newUser = {
        firstname: userData.firstname,
        lastname: userData.lastname || '',
        email: userData.email,
        phone: userData.phone || '',
        address: userData.address || '',
        district: userData.district,
        isAuthenticated: true
      };
      
      setUser(newUser);
      localStorage.setItem('user', JSON.stringify(newUser));
    }
    
    return response;
  }, []);

  const logout = useCallback(() => {
    authAPI.logout();
    setUser(null);
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    localStorage.removeItem('refreshToken');
  }, []);

  const updateUser = useCallback((userData) => {
    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData));
  }, []);

  const value = {
    user,
    loading,
    isAuthenticated: !!user,
    login,
    register,
    logout,
    updateUser,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
