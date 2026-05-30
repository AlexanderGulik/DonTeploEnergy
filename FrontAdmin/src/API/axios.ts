import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';
import { getItemFromLocalStorage, putItemInLocalStorage } from '../service/localStorage.service';
import { HOST } from '../config/URLs';
export const API_URL = HOST;

const $api = axios.create({
  baseURL: API_URL,
  withCredentials: true,
});

const publicUrls = ['/auth/login'];

$api.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const store = getItemFromLocalStorage('store');
  const url = config.url || '';

  console.log('Request URL:', url, 'Method:', config.method);

  if (publicUrls.some((publicUrl) => url.includes(publicUrl))) {
    return config;
  }

  if (store?.accessToken) {
    console.log('Adding token to request');
    config.headers.Authorization = `Bearer ${store.accessToken}`;
  } else {
    console.warn('No access token found in store');
  }

  return config;
});

interface ExtendedAxiosRequestConfig extends InternalAxiosRequestConfig {
  _isRetry?: boolean;
}

$api.interceptors.response.use(
  (response) => {
    console.log('Response success:', response.status, response.config.url);
    return response;
  },
  async (error: AxiosError) => {
    console.log('Response error:', error.response?.status, error.config?.url);

    const originalRequest = error.config as ExtendedAxiosRequestConfig;

    if (error.response?.status === 401 && originalRequest && !originalRequest.url?.includes('/auth/refresh') && !originalRequest._isRetry) {
      console.log('Attempting to refresh token');
      originalRequest._isRetry = true;

      try {
        const store = getItemFromLocalStorage('store');

        const refreshResponse = await axios.post(
          `${API_URL}/auth/refresh-admin`,
          {},
          {
            withCredentials: true,
          }
        );

        console.log('Token refresh response:', refreshResponse.status);

        if (!refreshResponse.data.accessToken) {
          console.error('No access token in refresh response', refreshResponse.data);
          throw new Error('Failed to refresh token');
        }

        const newStore = {
          ...store,
          accessToken: refreshResponse.data.accessToken,
        };

        putItemInLocalStorage('store', newStore);
        console.log('Tokens updated in localStorage');

        originalRequest.headers.Authorization = `Bearer ${refreshResponse.data.accessToken}`;
        return $api(originalRequest);
      } catch (refreshError) {
        console.error('Failed to refresh token:', refreshError);

        localStorage.removeItem('store');
        window.location.href = '/admin';
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default $api;
