// src/pages/RegisterPage.jsx

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../utils/api';

function RegisterPage() {
  const [formData, setFormData] = useState({
    email: '',
    username: '',
    password: '',
    password2: '',
    role: 'CUSTOMER', // Default role
  });
  
  // This hook helps us redirect the user
  const navigate = useNavigate();
  
  const [errors, setErrors] = useState(null);
  const [loading, setLoading] = useState(false);

  // Update state when user types in the form
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // Handle the form submission
  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent page reload
    setLoading(true);
    setErrors(null);

    // Check if passwords match
    if (formData.password !== formData.password2) {
      setErrors({ detail: 'Passwords do not match.' });
      setLoading(false);
      return;
    }

    try {
      // --- This is the API call ---
      // We send the form data to our registration endpoint
      const response = await api.post('/api/auth/register/', {
        email: formData.email,
        username: formData.username,
        password: formData.password,
        password2: formData.password2,
        role: formData.role,
      });

      console.log('Registration successful:', response.data);
      
      // On success, redirect to the login page
      navigate('/login');
      
    } catch (err) {
      // Handle errors from the backend
      console.error('Registration error:', err.response.data);
      setErrors(err.response.data || { detail: 'Registration failed.' });
    } finally {
      setLoading(false);
    }
  };

  // Helper to render backend error messages
  const renderErrors = () => {
    if (!errors) return null;

    // 'errors' can be an object with field names or just a 'detail' string
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
        <strong className="font-bold">Error:</strong>
        <ul>
          {Object.entries(errors).map(([key, value]) => (
            <li key={key}>
              {/* 'value' might be an array, so join it */}
              {`${key}: ${Array.isArray(value) ? value.join(' ') : value}`}
            </li>
          ))}
        </ul>
      </div>
    );
  };

  return (
    <div className="max-w-md mx-auto mt-10">
      <h1 className="text-3xl font-bold text-center mb-6">Create Your Account</h1>
      
      <form onSubmit={handleSubmit} className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
        
        {/* Render any API errors here */}
        {errors && renderErrors()}
        
        {/* Email */}
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">
            Email
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="email"
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>
        
        {/* Username */}
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="username">
            Username
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="username"
            type="text"
            name="username"
            value={formData.username}
            onChange={handleChange}
            required
          />
        </div>

        {/* Password */}
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password">
            Password
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
            id="password"
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
          />
        </div>
        
        {/* Confirm Password */}
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password2">
            Confirm Password
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
            id="password2"
            type="password"
            name="password2"
            value={formData.password2}
            onChange={handleChange}
            required
          />
        </div>

        {/* Role Selection */}
        <div className="mb-6">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="role">
            Register as a:
          </label>
          <select
            id="role"
            name="role"
            value={formData.role}
            onChange={handleChange}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          >
            <option value="CUSTOMER">Customer (I want to buy)</option>
            <option value="SELLER">Seller (I want to sell)</option>
          </select>
        </div>

        {/* Submit Button */}
        <div className="flex items-center justify-between">
          <button
            className={`bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
            type="submit"
            disabled={loading}
          >
            {loading ? 'Registering...' : 'Register'}
          </button>
        </div>
      </form>
    </div>
  );
}

export default RegisterPage;