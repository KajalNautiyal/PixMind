const express = require('express');
const rateLimit = require('express-rate-limit');
const { register, verifyOTP, resendOTP, login, getMe } = require('../controllers/authController');
const { protect } = require('../middleware/auth');
const { validate, registerSchema, loginSchema, otpSchema, resendOTPSchema } = require('../middleware/validate');

const router = express.Router();

// Rate limiters — prevents brute force attacks
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10, // 10 attempts per window
  message: {
    success: false,
    message: 'Too many attempts. Please try again after 15 minutes.',
  },
  standardHeaders: true,
  legacyHeaders: false,
});

const otpLimiter = rateLimit({
  windowMs: 5 * 60 * 1000, // 5 minutes
  max: 5, // 5 OTP requests per window
  message: {
    success: false,
    message: 'Too many OTP requests. Please try again after 5 minutes.',
  },
});

// Public routes (with rate limiting + validation)
router.post('/register', authLimiter, validate(registerSchema), register);
router.post('/verify-otp', otpLimiter, validate(otpSchema), verifyOTP);
router.post('/resend-otp', otpLimiter, validate(resendOTPSchema), resendOTP);
router.post('/login', authLimiter, validate(loginSchema), login);

// Protected routes
router.get('/me', protect, getMe);

module.exports = router;
