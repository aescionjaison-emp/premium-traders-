import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';

export const axiosClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request Interceptor: Attach JWT Token if present
axiosClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('showroom_admin_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor: Handle unauthenticated responses
axiosClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // If we are currently in an admin route, token expired
      if (window.location.pathname.startsWith('/admin') && window.location.pathname !== '/admin/login') {
        localStorage.removeItem('showroom_admin_token');
        localStorage.removeItem('showroom_admin_user');
        window.location.href = '/admin/login?expired=true';
      }
    }
    return Promise.reject(error);
  }
);

export default axiosClient;
