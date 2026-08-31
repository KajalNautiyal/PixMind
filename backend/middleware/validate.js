const { z } = require('zod');

// Allowed email domains
const ALLOWED_DOMAINS = [
  'gmail.com', 'yahoo.com', 'yahoo.in', 'outlook.com', 'hotmail.com',
  'live.com', 'icloud.com', 'protonmail.com', 'zoho.com', 'aol.com',
  'rediffmail.com', 'yandex.com', 'mail.com',
];

const emailSchema = z.string()
  .email('Invalid email address')
  .refine((email) => {
    const domain = email.split('@')[1]?.toLowerCase();
    return ALLOWED_DOMAINS.includes(domain);
  }, { message: 'Email domain not allowed. Use Gmail, Yahoo, Outlook, etc.' });

const passwordSchema = z.string()
  .min(8, 'Password must be at least 8 characters')
  .regex(/[A-Z]/, 'Password must contain an uppercase letter')
  .regex(/[a-z]/, 'Password must contain a lowercase letter')
  .regex(/[0-9]/, 'Password must contain a number')
  .regex(/[^A-Za-z0-9]/, 'Password must contain a special character');

const registerSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').max(50).trim(),
  email: emailSchema,
  password: passwordSchema,
});

const loginSchema = z.object({
  email: emailSchema,
  password: z.string().min(1, 'Password is required'),
});

const otpSchema = z.object({
  email: emailSchema,
  otp: z.string().length(6, 'OTP must be 6 digits').regex(/^\d+$/, 'OTP must contain only digits'),
});

const resendOTPSchema = z.object({
  email: emailSchema,
});

/**
 * Middleware factory — validates request body against a Zod schema
 */
const validate = (schema) => (req, res, next) => {
  try {
    const result = schema.safeParse(req.body);
    if (!result.success) {
      const errors = result.error.errors.map((e) => e.message);
      return res.status(400).json({
        success: false,
        message: errors[0],
        errors,
      });
    }
    req.body = result.data; // Use sanitized data
    next();
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: 'Invalid input',
    });
  }
};

module.exports = { validate, registerSchema, loginSchema, otpSchema, resendOTPSchema };
