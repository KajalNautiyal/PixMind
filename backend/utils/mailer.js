const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: parseInt(process.env.SMTP_PORT),
  secure: true,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

/**
 * Generate a 6-digit OTP
 */
const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

/**
 * Send OTP email to user
 */
const sendOTPEmail = async (to, otp, name) => {
  const mailOptions = {
    from: process.env.SMTP_FROM,
    to,
    subject: '🔐 PixMind — Email Verification OTP',
    html: `
      <div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 480px; margin: 0 auto; background: #0f0f23; color: #e0e0e0; border-radius: 16px; overflow: hidden;">
        <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 32px; text-align: center;">
          <h1 style="margin: 0; color: white; font-size: 28px;">PixMind AI</h1>
          <p style="margin: 8px 0 0; color: rgba(255,255,255,0.85); font-size: 14px;">Intelligent Photo Management</p>
        </div>
        <div style="padding: 32px;">
          <p style="font-size: 16px; margin: 0 0 8px;">Hey <strong>${name}</strong> 👋</p>
          <p style="font-size: 14px; color: #aaa; margin: 0 0 24px;">Use this OTP to verify your email address:</p>
          <div style="background: #1a1a3e; border: 1px solid #667eea; border-radius: 12px; padding: 24px; text-align: center; margin-bottom: 24px;">
            <span style="font-size: 36px; font-weight: bold; letter-spacing: 8px; color: #667eea;">${otp}</span>
          </div>
          <p style="font-size: 13px; color: #888; margin: 0;">⏱ This OTP expires in <strong>${process.env.OTP_EXPIRY_MINUTES || 10} minutes</strong>.</p>
          <p style="font-size: 13px; color: #888; margin: 8px 0 0;">If you didn't request this, ignore this email.</p>
        </div>
        <div style="background: #0a0a1a; padding: 16px; text-align: center;">
          <p style="margin: 0; font-size: 12px; color: #555;">© 2026 PixMind AI — Privacy-First Photo Platform</p>
        </div>
      </div>
    `,
  };

  await transporter.sendMail(mailOptions);
};

module.exports = { generateOTP, sendOTPEmail };
