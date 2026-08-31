import React, { useState, useMemo } from 'react';
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

const Signup = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [emailError, setEmailError] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
  });

  const passwordStrength = useMemo(() => getPasswordStrength(formData.password), [formData.password]);

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

    // Validate password strength
    if (passwordStrength.score < 4) {
      setError('Password is too weak. Use uppercase, lowercase, numbers & special characters.');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const res = await authAPI.register(formData);
      if (res.data.success) {
        navigate('/verify-otp', { state: { email: formData.email, name: formData.name } });
      }
    } catch (err) {
      const msg = err.response?.data?.message || 'Registration failed. Try again.';
      setError(msg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col">
      <div className="mb-8">
        <h1 className="text-[28px] font-bold text-gray-900 mb-2 tracking-tight">
          Create your account
        </h1>
        <p className="text-[15px] text-gray-500">
          Start organizing your photos securely with PixMind.
        </p>
      </div>

      {error && (
        <div className="mb-4 p-3 rounded-xl bg-red-50 border border-red-200 text-red-600 text-sm">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="flex flex-col gap-5">
        <Input 
          label="Full Name" 
          type="text" 
          name="name"
          placeholder="Name"
          value={formData.name}
          onChange={handleChange}
          required
        />

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
            placeholder="Create a strong password"
            value={formData.password}
            onChange={handleChange}
            required
          />
          {/* Password Strength Meter */}
          {formData.password && (
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
              <ul className="mt-2 grid grid-cols-2 gap-x-4 gap-y-1">
                {[
                  { check: formData.password.length >= 8, text: '8+ characters' },
                  { check: /[A-Z]/.test(formData.password), text: 'Uppercase letter' },
                  { check: /[a-z]/.test(formData.password), text: 'Lowercase letter' },
                  { check: /[0-9]/.test(formData.password), text: 'Number' },
                  { check: /[^A-Za-z0-9]/.test(formData.password), text: 'Special char (!@#$)' },
                ].map((rule) => (
                  <li key={rule.text} className={`text-[11px] flex items-center gap-1.5 ${rule.check ? 'text-green-500' : 'text-gray-300'}`}>
                    <span>{rule.check ? '✓' : '○'}</span>
                    {rule.text}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        <Button type="submit" className="w-full mt-1" size="lg" isLoading={isLoading}>
          Create account
        </Button>
      </form>

      <div className="mt-8 text-center">
        <p className="text-sm text-gray-500">
          Already have an account?{' '}
          <Link to="/login" className="font-semibold text-[#6c5ce7] hover:text-[#5a4bd1] transition-colors">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Signup;
