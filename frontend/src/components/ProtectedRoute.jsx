// src/components/ProtectedRoute.jsx

import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function ProtectedRoute() {
  const { user } = useAuth(); // Get the current user

  if (!user) {
    // If user is not logged in, redirect them to the /login page
    // 'replace' stops them from using the "back" button to return
    return <Navigate to="/login" replace />;
  }

  // If user is logged in, render the child component (e.g., CheckoutPage)
  return <Outlet />;
}

export default ProtectedRoute;