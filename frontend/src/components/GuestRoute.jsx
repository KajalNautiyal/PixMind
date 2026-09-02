import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

const GuestRoute = () => {
  const token = localStorage.getItem('pixmind_token');

  // If user is already logged in, redirect them to the dashboard
  if (token) {
    return <Navigate to="/dashboard" replace />;
  }

  // Otherwise, allow them to see the public pages (login, signup, landing)
  return <Outlet />;
};

export default GuestRoute;
