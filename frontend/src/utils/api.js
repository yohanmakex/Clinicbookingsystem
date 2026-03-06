import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add token to requests if available
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Public API calls
export const getServices = () => api.get('/services');
export const getTimeSlots = (branch) => api.get('/timeslots', { params: { branch } });
export const getAvailableTimeSlots = (date, branch) => api.get('/timeslots/available', { params: { date, branch } });
export const bookAppointment = (data) => api.post('/appointments', data);

// Auth API calls
export const login = (credentials) => api.post('/auth/login', credentials);

// Admin API calls
export const getAppointments = (filters) => api.get('/admin/appointments', { params: filters });
export const updateAppointment = (id, data) => api.patch(`/admin/appointments/${id}`, data);
export const getClientHistory = (email) => api.get(`/admin/clients/${email}`);

export const getAllServices = () => api.get('/admin/services');
export const addService = (data) => api.post('/admin/services', data);
export const updateService = (id, data) => api.put(`/admin/services/${id}`, data);
export const deleteService = (id) => api.delete(`/admin/services/${id}`);

export const getAllTimeSlots = () => api.get('/admin/timeslots');
export const addTimeSlot = (data) => api.post('/admin/timeslots', data);
export const deleteTimeSlot = (id) => api.delete(`/admin/timeslots/${id}`);

export const getMonthlyAnalytics = (year, month) => api.get('/admin/analytics/monthly', { params: { year, month } });

export default api;
