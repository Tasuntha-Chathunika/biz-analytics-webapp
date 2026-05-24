import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5000/api',
});

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
