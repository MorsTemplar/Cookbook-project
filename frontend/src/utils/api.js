import axios from 'axios';

const API = axios.create({
  baseURL: process.env.REACT_APP_API_URL,
  withCredentials: true, // for sending cookies if needed
});

export const signup = (formData) => API.post('/api/auth/register', formData);
export const login = (formData) => API.post('/api/auth/login', formData);

export default API;
