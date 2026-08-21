import axios from 'axios';

const baseURL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

const client = axios.create({ baseURL });

// Attach the JWT (if present) to every outgoing request.
client.interceptors.request.use((config) => {
  const token = localStorage.getItem('es_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// On a 401, the token is stale/invalid - clear it and bounce to login.
client.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      localStorage.removeItem('es_token');
      localStorage.removeItem('es_user');
      if (window.location.pathname !== '/login') {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export default client;
