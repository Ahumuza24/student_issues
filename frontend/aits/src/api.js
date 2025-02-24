// src/api.js
import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8000/api/',
});

export const setAuthToken = (token) => {
  if (token) {
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  } else {
    delete api.defaults.headers.common['Authorization'];
  }
};

export const login = (email, password) => api.post('/token/', { email, password });
export const refreshToken = (refresh) => api.post('/token/refresh/', { refresh });
export const signup = (data) => api.post('/register/', data);
export const getIssues = () => api.get('issues/');
export const getStats = () => api.get('issues/stats/');
export const getCourses = () => api.get('issues/courses/');
export const getStaff = () => api.get('issues/staff/');
export const createIssue = (data) => api.post('issues/', data);
export const updateIssue = (id, data) => api.patch(`issues/${id}/`, data);
export const getNotifications = () => api.get('notifications/');
export const markNotificationRead = (id) => api.post(`notifications/${id}/mark_as_read/`);
export const getAuditLogs = () => api.get('audit-logs/');