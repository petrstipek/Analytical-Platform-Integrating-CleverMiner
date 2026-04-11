import axios from 'axios';
import Cookies from 'js-cookie';
import { storage } from '@/modules/auth/utils/storage';

export const apiClient = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

apiClient.interceptors.request.use((config) => {
  const token = storage.getToken();
  if (token) {
    config.headers['Authorization'] = `Bearer ${token}`;
  }
  return config;
});

let isRedirectingToLogin = false;

apiClient.interceptors.response.use(
  (r) => r,
  async (error) => {
    const originalRequest = error.config;
    const url = originalRequest?.url ?? '';

    const isAuthRequest =
      url.includes('/auth/login') ||
      url.includes('/auth/token/refresh') ||
      url.includes('/auth/logout') ||
      url.includes('/auth/user');

    if (error.response?.status === 401 && !originalRequest._retry && !isAuthRequest) {
      originalRequest._retry = true;
      const refreshToken = storage.getRefreshToken();

      if (!refreshToken) {
        if (window.location.pathname !== '/login') {
          window.location.assign('/login');
        }
        return Promise.reject(error);
      }

      try {
        const { data } = await apiClient.post('/auth/token/refresh/', { refresh: refreshToken });
        storage.setTokens(data.access, data.refresh);

        originalRequest.headers['Authorization'] = `Bearer ${data.access}`;
        return apiClient(originalRequest);
      } catch {
        storage.clearTokens();

        if (!isRedirectingToLogin) {
          isRedirectingToLogin = true;
          window.location.assign('/login');
        }

        return Promise.reject(error);
      }
    }

    return Promise.reject(error);
  },
);
