import axios from 'axios';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
export const API = `${BACKEND_URL}/api`;

export const api = axios.create({
  baseURL: API,
});

export const getAuthHeaders = () => {
  const token = localStorage.getItem('doerly_token');
  return token ? { Authorization: `Bearer ${token}` } : {};
};

export const setAuthToken = (token) => {
  localStorage.setItem('doerly_token', token);
};

export const clearAuthToken = () => {
  localStorage.removeItem('doerly_token');
};
