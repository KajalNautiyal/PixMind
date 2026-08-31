import React, { useState, useRef, useEffect } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { Button } from '../../components/ui/Button';
import { authAPI } from '../../services/api';
import { ShieldCheck, RotateCcw } from 'lucide-react';

const VerifyOTP = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const email = location.state?.email;
  const name = location.state?.name;

  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [isLoading, setIsLoading] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [countdown, setCountdown] = useState(60);
  const inputRefs = useRef([]);

  // Redirect if no email in state
  useEffect(() => {
    if (!email) {
      navigate('/signup');
    }
  }, [email, navigate]);

  // Countdown timer for resend
  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  // Auto-focus first input
  useEffect(() => {
    inputRefs.current[0]?.focus();
  }, []);

  const handleChange = (index, value) => {
    if (!/^\d*$/.test(value)) return; // Only digits

    const newOtp = [...otp];
    newOtp[index] = value.slice(-1); // Only last digit
    setOtp(newOtp);
    setError('');

    // Auto-focus next input
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index, e) => {
    // Go back on backspace
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').trim();
    if (/^\d{6}$/.test(pastedData)) {
      const digits = pastedData.split('');
      setOtp(digits);
      inputRefs.current[5]?.focus();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const otpCode = otp.join('');
    if (otpCode.length !== 6) {
      setError('Please enter the complete 6-digit OTP');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const res = await authAPI.verifyOTP({ email, otp: otpCode });
      if (res.data.success) {
        // Save token and redirect
        localStorage.setItem('pixmind_token', res.data.data.token);
        localStorage.setItem('pixmind_user', JSON.stringify(res.data.data.user));
        setSuccess('Email verified! Redirecting...');
        setTimeout(() => navigate('/login'), 1500);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'OTP verification failed');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResend = async () => {
    if (countdown > 0) return;
    setIsResending(true);
    setError('');

    try {
      await authAPI.resendOTP({ email });
      setSuccess('New OTP sent to your email!');
      setCountdown(60);
      setOtp(['', '', '', '', '', '']);
      inputRefs.current[0]?.focus();
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to resend OTP');
    } finally {
      setIsResending(false);
    }
  };

  if (!email) return null;

  return (
    <div className="flex flex-col">
      <div className="mb-8">
        <div className="w-14 h-14 rounded-2xl bg-[#6c5ce7]/10 flex items-center justify-center mb-5">
          <ShieldCheck size={28} className="text-[#6c5ce7]" />
        </div>
        <h1 className="text-[28px] font-bold text-gray-900 mb-2 tracking-tight">
          Verify your email
        </h1>
        <p className="text-[15px] text-gray-500">
          We've sent a 6-digit code to{' '}
          <span className="font-semibold text-gray-700">{email}</span>
        </p>
      </div>

      {error && (
        <div className="mb-4 p-3 rounded-xl bg-red-50 border border-red-200 text-red-600 text-sm">
          {error}
        </div>
      )}

      {success && (
        <div className="mb-4 p-3 rounded-xl bg-green-50 border border-green-200 text-green-600 text-sm">
          {success}
        </div>
      )}

      <form onSubmit={handleSubmit} className="flex flex-col gap-6">
        {/* OTP Input Boxes */}
        <div className="flex gap-3 justify-center" onPaste={handlePaste}>
          {otp.map((digit, index) => (
            <input
              key={index}
              ref={(el) => (inputRefs.current[index] = el)}
              type="text"
              inputMode="numeric"
              maxLength={1}
              value={digit}
              onChange={(e) => handleChange(index, e.target.value)}
              onKeyDown={(e) => handleKeyDown(index, e)}
              className="w-12 h-14 text-center text-xl font-bold rounded-xl border border-gray-200 bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#6c5ce7]/30 focus:border-[#6c5ce7] transition-all duration-200"
            />
          ))}
        </div>

        <Button type="submit" className="w-full" size="lg" isLoading={isLoading}>
          Verify Email
        </Button>
      </form>

      {/* Resend OTP */}
      <div className="mt-6 text-center">
        <p className="text-sm text-gray-500">
          Didn't receive the code?{' '}
          {countdown > 0 ? (
            <span className="font-medium text-gray-400">
              Resend in {countdown}s
            </span>
          ) : (
            <button
              onClick={handleResend}
              disabled={isResending}
              className="font-semibold text-[#6c5ce7] hover:text-[#5a4bd1] transition-colors inline-flex items-center gap-1 cursor-pointer"
            >
              <RotateCcw size={14} />
              Resend OTP
            </button>
          )}
        </p>
      </div>

      <div className="mt-6 text-center">
        <Link to="/signup" className="text-sm font-medium text-gray-400 hover:text-gray-600 transition-colors">
          ← Back to signup
        </Link>
      </div>
    </div>
  );
};

export default VerifyOTP;
