import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';
import { getItemFromLocalStorage, putItemInLocalStorage } from '../service/localStorage.service';
import { HOST } from '../config/URLs';

export const API_URL = HOST;

const $api = axios.create({
  baseURL: API_URL,
  withCredentials: true,
});

const publicUrls = ['/auth/login', '/auth/refresh'];

let isRefreshing = false;
let failedQueue: Array<{
  resolve: (value: unknown) => void;
  reject: (reason?: unknown) => void;
}> = [];

const processQueue = (error: Error | null, token: string | null = null) => {
  failedQueue.forEach(prom => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

$api.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const store = getItemFromLocalStorage('store');
  const url = config.url || '';

  const isPublicUrl = publicUrls.some((publicUrl) => url.includes(publicUrl));
  
  if (isPublicUrl) {
    console.log('Public URL, skipping token:', url);
    return config;
  }

  if (store?.accessToken) {
    console.log('Adding token to request:', url);
    config.headers.Authorization = `Bearer ${store.accessToken}`;
  } else {
    console.warn('No access token found for:', url);
  }

  return config;
});

$api.interceptors.response.use(
  (response) => {
    console.log('Response success:', response.status, response.config.url);
    return response;
  },
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & { _isRetry?: boolean };
    
    console.log('Response error:', error.response?.status, originalRequest?.url);

    if (
      error.response?.status === 401 &&
      originalRequest &&
      !originalRequest.url?.includes('/auth/refresh') &&
      !originalRequest._isRetry
    ) {
      
      if (isRefreshing) {
        console.log('Refresh already in progress, queueing request');
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            if (originalRequest.headers) {
              originalRequest.headers.Authorization = `Bearer ${token}`;
            }
            return $api(originalRequest);
          })
          .catch((err) => Promise.reject(err));
      }

      originalRequest._isRetry = true;
      isRefreshing = true;

      try {
        console.log('Attempting to refresh token');
        
        const refreshResponse = await axios.post(
          `${API_URL}/auth/refresh`,
          {},
          {
            withCredentials: true,
          }
        );

        console.log('Token refresh response:', refreshResponse.status);

        const newAccessToken = refreshResponse.data.access_token || refreshResponse.data.accessToken;
        
        if (!newAccessToken) {
          console.error('No access token in refresh response', refreshResponse.data);
          throw new Error('Failed to refresh token');
        }

        const store = getItemFromLocalStorage('store');
        const newStore = {
          ...store,
          accessToken: newAccessToken,
        };
        putItemInLocalStorage('store', newStore);
        console.log('Token updated in localStorage');

        if (originalRequest.headers) {
          originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        }

        processQueue(null, newAccessToken);

        return $api(originalRequest);
        
      } catch (refreshError) {
        console.error('Failed to refresh token:', refreshError);
        
        processQueue(refreshError as Error, null);
        
        localStorage.removeItem('store');
        window.location.href = '/admin';
        
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

export default $api;
