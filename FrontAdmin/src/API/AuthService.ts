import $api from './axios';
import { LoginResponseI, LogoutResponseI, RefreshResponseI } from '../types/response.types';
import { LoginCredentialsI } from '../types/user.types';
import { getItemFromLocalStorage, putItemInLocalStorage } from '../service/localStorage.service';

export const AuthService = {
  login: async (credentials: LoginCredentialsI) => {
    const response = await $api.post<LoginResponseI>('/auth/login', credentials);
    
    if (response.data.access_token || response.data.accessToken) {
      const token = response.data.access_token || response.data.accessToken;
      const store = getItemFromLocalStorage('store') || {};
      const newStore = {
        ...store,
        accessToken: token,
      };
      putItemInLocalStorage('store', newStore);
    }
    
    return response.data;
  },
  
  logout: async () => {
    const response = await $api.post<LogoutResponseI>('/auth/logout', {});
    
    const store = getItemFromLocalStorage('store');
    if (store) {
      const newStore = { ...store };
      delete newStore.accessToken;
      putItemInLocalStorage('store', newStore);
    }
    
    return response.data;
  },
  
  refresh: async () => {
    const response = await $api.post<RefreshResponseI>('/auth/refresh-admin', {});
    return response.data;
  },
};
