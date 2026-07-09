import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5000/api',
});

// Request Interceptor to inject session token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export const login = (email, password) => api.post('/auth/login', { email, password });
export const signup = (email, password, name, role) => api.post('/auth/register', { email, password, name, role });
export const getProfile = () => api.get('/auth/me');

export const uploadCSV = (file) => {
  const formData = new FormData();
  formData.append('file', file);
  return api.post('/upload', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
};

export const getKPIs = () => api.get('/analytics/kpi');
export const getRegionalSales = () => api.get('/analytics/regional-sales');
export const getMonthlyTrend = () => api.get('/analytics/monthly-trend');
export const getCategorySales = () => api.get('/analytics/category-sales');
export const getTopProducts = () => api.get('/analytics/top-products');
export const getRecentTransactions = () => api.get('/sales/recent');

export const getSales = (page = 1, limit = 10, search = '') => 
  api.get('/sales', { params: { page, limit, search } });
export const deleteSale = (id) => api.delete(`/sales/${id}`);
export const clearSales = () => api.delete('/sales');
