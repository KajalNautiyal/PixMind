import React, { useEffect, useState } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { authAPI } from '../services/api';

const ProtectedRoute = () => {
  const token = localStorage.getItem('pixmind_token');
  const [isVerifying, setIsVerifying] = useState(true);
  const [isValid, setIsValid] = useState(false);

  useEffect(() => {
    const verifyToken = async () => {
      if (!token) {
        setIsVerifying(false);
        return;
      }

      try {
        await authAPI.getMe();
        setIsValid(true);
      } catch (error) {
        // The axios interceptor in api.js will handle clearing the token
        // and redirecting to login on a 401 response.
        setIsValid(false);
      } finally {
        setIsVerifying(false);
      }
    };

    verifyToken();
  }, [token]);

  if (isVerifying) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="w-8 h-8 border-4 border-[#6c5ce7] border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  // If there's no token or verification failed, redirect to login
  if (!token || !isValid) {
    return <Navigate to="/login" replace />;
  }

  // Otherwise, render the child routes (e.g., Dashboard Layout)
  return <Outlet />;
};

export default ProtectedRoute;
