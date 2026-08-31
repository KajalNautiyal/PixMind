import { Routes, Route, Navigate } from 'react-router-dom';
import AuthLayout from './layouts/AuthLayout';
import Login from './pages/Auth/Login';
import Signup from './pages/Auth/Signup';
import VerifyOTP from './pages/Auth/VerifyOTP';

function App() {
  return (
    <Routes>
      {/* Redirect root to login for now */}
      <Route path="/" element={<Navigate to="/login" replace />} />
      
      {/* Auth Routes */}
      <Route element={<AuthLayout />}>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/verify-otp" element={<VerifyOTP />} />
      </Route>
      
      {/* 404 Route */}
      <Route path="*" element={
        <div className="flex min-h-screen items-center justify-center">
          <h1 className="text-2xl font-medium">404 - Page Not Found</h1>
        </div>
      } />
    </Routes>
  );
}

export default App;
