import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children, role }) => {
  const token = localStorage.getItem('token');
  const userRole = localStorage.getItem('role');

  if (!token) {
    // If there's no token, redirect to login
    return <Navigate to="/login" />;
  }

  if (userRole !== role) {
    // If the user's role doesn't match the required role, redirect to their dashboard
    return userRole === 'admin' ? <Navigate to="/admin" /> : <Navigate to="/user" />;
  }

  return children;
};

export default ProtectedRoute;
