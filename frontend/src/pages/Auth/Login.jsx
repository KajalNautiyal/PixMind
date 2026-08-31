import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { authAPI } from '../../services/api';

const ALLOWED_DOMAINS = [
  'gmail.com', 'yahoo.com', 'yahoo.in', 'outlook.com', 'hotmail.com',
  'live.com', 'icloud.com', 'protonmail.com', 'zoho.com', 'aol.com',
  'rediffmail.com', 'yandex.com', 'mail.com',
];

const validateEmail = (email) => {
  if (!email) return '';
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) return 'Please enter a valid email address';
  const domain = email.split('@')[1]?.toLowerCase();
  if (!ALLOWED_DOMAINS.includes(domain)) {
    return `Only ${ALLOWED_DOMAINS.slice(0, 4).join(', ')} etc. are allowed`;
  }
  return '';
};

const Login = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [emailError, setEmailError] = useState('');
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    setError('');

    if (name === 'email') {
      setEmailError(value ? validateEmail(value) : '');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate email domain
    const emailErr = validateEmail(formData.email);
    if (emailErr) {
      setEmailError(emailErr);
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const res = await authAPI.login(formData);
      if (res.data.success) {
        localStorage.setItem('pixmind_token', res.data.data.token);
        localStorage.setItem('pixmind_user', JSON.stringify(res.data.data.user));
        // TODO: Navigate to dashboard when ready
        alert('✅ Login successful! Welcome to PixMind, ' + res.data.data.user.name);
      }
    } catch (err) {
      const msg = err.response?.data?.message || 'Login failed. Try again.';
      setError(msg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col">
      <div className="mb-8">
        <h1 className="text-[28px] font-bold text-gray-900 mb-2 tracking-tight">
          Welcome back
        </h1>
        <p className="text-[15px] text-gray-500">
          Sign in to continue to your photo library.
        </p>
      </div>

      {error && (
        <div className="mb-4 p-3 rounded-xl bg-red-50 border border-red-200 text-red-600 text-sm">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="flex flex-col gap-5">
        <Input 
          label="Email address" 
          type="email" 
          name="email"
          placeholder="example@gmail.com"
          value={formData.email}
          onChange={handleChange}
          error={emailError}
          required
        />
        
        <div>
          <Input 
            label="Password" 
            type="password" 
            name="password"
            placeholder="Enter your password"
            value={formData.password}
            onChange={handleChange}
            required
          />
          <div className="flex justify-end mt-2">
            <Link to="#" className="text-sm font-medium text-[#6c5ce7] hover:text-[#5a4bd1] transition-colors">
              Forgot password?
            </Link>
          </div>
        </div>

        <Button type="submit" className="w-full mt-1" size="lg" isLoading={isLoading}>
          Sign in
        </Button>
      </form>

      <div className="mt-8 text-center">
        <p className="text-sm text-gray-500">
          Don't have an account?{' '}
          <Link to="/signup" className="font-semibold text-[#6c5ce7] hover:text-[#5a4bd1] transition-colors">
            Create account
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
