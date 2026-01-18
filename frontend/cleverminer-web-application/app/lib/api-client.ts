import axios from 'axios';
import Cookies from 'js-cookie';

export const apiClient = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

apiClient.interceptors.request.use((config) => {
  const csrfToken = Cookies.get('csrftoken');
  if (csrfToken) {
    config.headers['X-CSRFToken'] = csrfToken;
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
      url.includes('/auth/refresh') ||
      url.includes('/auth/logout') ||
      url.includes('/auth/user');

    if (error.response?.status === 401 && !originalRequest._retry && !isAuthRequest) {
      originalRequest._retry = true;

      try {
        await apiClient.post('/auth/refresh/', {});
        return apiClient(originalRequest);
      } catch {
        if (!isRedirectingToLogin && window.location.pathname !== '/login') {
          isRedirectingToLogin = true;
          window.location.assign('/login');
        }
        return Promise.reject(error);
      }
    }

    if (error.response?.status === 401 && window.location.pathname === '/login') {
      return Promise.reject(error);
    }

    return Promise.reject(error);
  },
);
