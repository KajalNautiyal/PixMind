import React, { useState, useMemo } from 'react';
import { useLocation, useNavigate, Navigate } from 'react-router-dom';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { authAPI } from '../../services/api';

const getPasswordStrength = (password) => {
  if (!password) return { score: 0, label: '', color: '', width: '0%' };

  let score = 0;
  if (password.length >= 6) score++;
  if (password.length >= 8) score++;
  if (/[A-Z]/.test(password)) score++;
  if (/[a-z]/.test(password)) score++;
  if (/[0-9]/.test(password)) score++;
  if (/[^A-Za-z0-9]/.test(password)) score++;

  if (score <= 2) return { score, label: 'Weak', color: '#ef4444', width: '25%' };
  if (score <= 3) return { score, label: 'Fair', color: '#f97316', width: '50%' };
  if (score <= 4) return { score, label: 'Good', color: '#eab308', width: '75%' };
  return { score, label: 'Strong', color: '#22c55e', width: '100%' };
};

const ResetPassword = () => {
  const location = useLocation();
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    email: location.state?.email || '',
    otp: '',
    newPassword: '',
  });
  
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const passwordStrength = useMemo(() => getPasswordStrength(formData.newPassword), [formData.newPassword]);

  // If accessed directly without an email in state, redirect to forgot password
  if (!location.state?.email) {
    return <Navigate to="/forgot-password" replace />;
  }

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'otp' && value.length > 6) return; // Limit OTP to 6 chars
    setFormData({ ...formData, [name]: value });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.otp.length !== 6) {
      setError('Please enter a valid 6-digit OTP');
      return;
    }

    if (passwordStrength.score < 4) {
      setError('Password is too weak. Please use uppercase, lowercase, numbers & special characters.');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const res = await authAPI.resetPassword(formData);
      if (res.data.success) {
        alert('Password successfully reset! You can now login.');
        navigate('/login', { replace: true });
      }
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to reset password. Check OTP and try again.';
      setError(msg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col">
      <div className="mb-8">
        <h1 className="text-[28px] font-bold text-gray-900 mb-2 tracking-tight">
          Set new password
        </h1>
        <p className="text-[15px] text-gray-500">
          We sent a 6-digit code to <span className="font-medium text-gray-900">{formData.email}</span>.
        </p>
      </div>

      {error && (
        <div className="mb-4 p-3 rounded-xl bg-red-50 border border-red-200 text-red-600 text-sm">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="flex flex-col gap-5">
        <Input 
          label="Verification Code" 
          type="text" 
          name="otp"
          placeholder="Enter 6-digit code"
          value={formData.otp}
          onChange={handleChange}
          required
          maxLength={6}
          className="text-center tracking-widest font-mono text-lg"
        />

        <div>
          <Input 
            label="New Password" 
            type="password" 
            name="newPassword"
            placeholder="Create a strong password"
            value={formData.newPassword}
            onChange={handleChange}
            required
          />
          {/* Password Strength Meter */}
          {formData.newPassword && (
            <div className="mt-2.5">
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-xs text-gray-400">Password strength</span>
                <span className="text-xs font-semibold" style={{ color: passwordStrength.color }}>
                  {passwordStrength.label}
                </span>
              </div>
              <div className="h-1.5 w-full bg-gray-100 rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-500 ease-out"
                  style={{
                    width: passwordStrength.width,
                    backgroundColor: passwordStrength.color,
                  }}
                />
              </div>
            </div>
          )}
        </div>

        <Button type="submit" className="w-full mt-2" size="lg" isLoading={isLoading}>
          Update password
        </Button>
      </form>
    </div>
  );
};

export default ResetPassword;
