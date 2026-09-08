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

// Response Interceptor: Handle unauthenticated responses and HTML rewrites
axiosClient.interceptors.response.use(
  (response) => {
    // If Firebase Hosting rewrite returned HTML string for an API route
    if (
      typeof response.data === 'string' &&
      (response.data.includes('<!DOCTYPE html>') || response.data.includes('<!doctype html>') || response.data.includes('<html'))
    ) {
      return Promise.reject(new Error('API offline on static hosting'));
    }
    return response;
  },
  (error) => {
    if (error.response && error.response.status === 401) {
      const token = localStorage.getItem('showroom_admin_token');
      if (token === 'standalone_admin_token_2026') {
        return Promise.reject(error);
      }
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
