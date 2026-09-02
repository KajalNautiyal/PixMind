import { Routes, Route } from 'react-router-dom';
import GuestRoute from './components/GuestRoute';
import ProtectedRoute from './components/ProtectedRoute';
import AuthLayout from './layouts/AuthLayout';
import LandingLayout from './layouts/LandingLayout';
import DashboardLayout from './layouts/DashboardLayout';
import Login from './pages/Auth/Login';
import Signup from './pages/Auth/Signup';
import VerifyOTP from './pages/Auth/VerifyOTP';
import ForgotPassword from './pages/Auth/ForgotPassword';
import ResetPassword from './pages/Auth/ResetPassword';
import Landing from './pages/Landing/Landing';
import Home from './pages/Dashboard/Home';

function App() {
  return (
    <Routes>
      {/* Public / Guest Routes (Only accessible if NOT logged in) */}
      <Route element={<GuestRoute />}>
        {/* Landing Page */}
        <Route path="/" element={<LandingLayout />}>
          <Route index element={<Landing />} />
        </Route>

        {/* Auth Pages */}
        <Route element={<AuthLayout />}>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/verify-otp" element={<VerifyOTP />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />
        </Route>
      </Route>
      
      {/* Protected Dashboard Routes */}
      <Route path="/dashboard" element={<ProtectedRoute />}>
        <Route element={<DashboardLayout />}>
          <Route index element={<Home />} />
          {/* We will add more routes here later */}
        </Route>
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
