// src/utils/api.js

import axios from 'axios';

// This is the base URL of your Django backend
const API_BASE_URL = 'http://127.0.0.1:8000';

// Create a new Axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

/*
  This is a 'request interceptor'. It's a piece of code that
  runs BEFORE every single API request.
  
  Its job is to check if we have an auth token in localStorage.
  If we do, it automatically adds it to the 'Authorization' header.
  
  This means we never have to manually add the token to our
  requests for protected endpoints.
*/
api.interceptors.request.use(
  (config) => {
    // We'll get the token from localStorage
    // We'll write the logic to store this token when we build the login page
    const token = localStorage.getItem('authToken'); 
    
    if (token) {
      // Add the 'Bearer' token to the header
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;