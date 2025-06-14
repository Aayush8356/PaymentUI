import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5001/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor to include auth token
api.interceptors.request.use(
  (config: any) => {
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error: any) => {
    return Promise.reject(error);
  }
);

// Add response interceptor to handle errors
api.interceptors.response.use(
  (response: any) => {
    return response;
  },
  (error: any) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('authToken');
      window.location.href = '/admin/login';
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  login: (email: string, password: string) =>
    api.post('/auth/login', { email, password }),
  verify: () => api.get('/auth/verify'),
};

// Transactions API
export const transactionsAPI = {
  create: (data: any) => api.post('/transactions/create', data),
  getAll: (params?: any) => api.get('/transactions', { params }),
  getById: (id: string) => api.get(`/transactions/${id}`),
};

// Analytics API
export const analyticsAPI = {
  getOverview: () => api.get('/analytics/overview'),
  getPaymentMethods: () => api.get('/analytics/payment-methods'),
  getDailyTransactions: () => api.get('/analytics/daily-transactions'),
  getHourlyTransactions: () => api.get('/analytics/hourly-transactions'),
  getStatusDistribution: () => api.get('/analytics/status-distribution'),
};

export default api;