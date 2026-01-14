/* eslint-disable no-undef */
const nodemailer = require('nodemailer');
const dotenv = require('dotenv');

dotenv.config();

// Create transporter with Gmail or custom SMTP
const transporter = nodemailer.createTransport({
  service: process.env.EMAIL_SERVICE || 'gmail',
  auth: {
    user: process.env.EMAIL_USER || 'your_email@gmail.com',
    pass: process.env.EMAIL_PASSWORD || 'your_app_password',
  },
  // Optional: For custom SMTP servers
  ...(process.env.SMTP_HOST && {
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT || 587,
    secure: process.env.SMTP_SECURE === 'true',
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASSWORD,
    },
  }),
});

// Verify transporter connection
transporter.verify((error, success) => {
  if (error) {
    console.error('Email transporter error:', error);
  } else {
    console.log('Email transporter ready:', success);
  }
});

/**
 * Send verification email with code
 * @param {string} email - Recipient email
 * @param {string} verificationCode - 6-digit verification code
 * @returns {Promise}
 */
const sendVerificationEmail = async (email, verificationCode) => {
  const mailOptions = {
    from: `"AppointCare" <${process.env.EMAIL_USER || 'appointcare@gmail.com'}>`,
    to: email,
    subject: 'AppointCare - Email Verification Code',
    html: `
      <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; padding: 0;">
        <div style="background: linear-gradient(135deg, #7B9BA8 0%, #8FA8B4 100%); padding: 30px; text-align: center; border-radius: 8px 8px 0 0;">
          <h2 style="color: #fff; margin: 0; font-size: 28px;">AppointCare</h2>
          <p style="color: rgba(255,255,255,0.9); margin: 8px 0 0 0; font-size: 14px;">Healthcare Appointment System</p>
        </div>
        
        <div style="background-color: #fff; padding: 40px 30px; border-radius: 0 0 8px 8px; border: 1px solid #e0e0e0; border-top: none;">
          <h3 style="color: #1a1a1a; margin: 0 0 20px 0; font-size: 22px;">Email Verification</h3>
          
          <p style="color: #666; line-height: 1.6; font-size: 15px; margin: 0 0 25px 0;">
            Welcome to AppointCare! Thank you for registering. To verify your email address and complete your registration, please use the verification code below:
          </p>
          
          <div style="background-color: #f0f7ff; padding: 25px; border-radius: 8px; text-align: center; margin: 30px 0; border-left: 5px solid #3B82F6; border-right: 5px solid #3B82F6;">
            <p style="margin: 0 0 12px 0; font-size: 12px; color: #666; font-weight: 600; text-transform: uppercase; letter-spacing: 1px;">Verification Code</p>
            <p style="margin: 0; font-size: 42px; font-weight: bold; color: #3B82F6; letter-spacing: 10px; font-family: 'Courier New', monospace;">${verificationCode}</p>
          </div>
          
          <div style="background-color: #fef3e2; padding: 15px; border-radius: 6px; margin: 25px 0; border-left: 4px solid #f59e0b;">
            <p style="margin: 0; color: #92400e; font-size: 13px;">
              <strong>⏱️ Important:</strong> This code will expire in 10 minutes. If you didn't request this code, please ignore this email.
            </p>
          </div>
          
          <p style="color: #666; line-height: 1.6; font-size: 14px; margin: 25px 0;">
            If you have any questions or need assistance, please don't hesitate to contact our support team.
          </p>
          
          <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e0e0e0;">
            <p style="color: #999; font-size: 12px; margin: 0;">
              This is an automated email. Please do not reply to this message.<br>
              © 2026 AppointCare. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    `,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log('Verification email sent successfully:', {
      messageId: info.messageId,
      to: email,
      timestamp: new Date().toISOString(),
    });
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('Failed to send verification email:', {
      to: email,
      error: error.message,
      timestamp: new Date().toISOString(),
    });
    throw error;
  }
};

/**
 * Send password reset email
 * @param {string} email - Recipient email
 * @param {string} resetToken - Password reset token
 * @returns {Promise}
 */
const sendPasswordResetEmail = async (email, resetToken) => {
  const resetUrl = `${process.env.FRONTEND_URL || 'http://localhost:5173'}/reset-password/${resetToken}`;

  const mailOptions = {
    from: `"AppointCare" <${process.env.EMAIL_USER || 'appointcare@gmail.com'}>`,
    to: email,
    subject: 'AppointCare - Password Reset Request',
    html: `
      <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; padding: 0;">
        <div style="background: linear-gradient(135deg, #7B9BA8 0%, #8FA8B4 100%); padding: 30px; text-align: center; border-radius: 8px 8px 0 0;">
          <h2 style="color: #fff; margin: 0; font-size: 28px;">AppointCare</h2>
          <p style="color: rgba(255,255,255,0.9); margin: 8px 0 0 0; font-size: 14px;">Healthcare Appointment System</p>
        </div>
        
        <div style="background-color: #fff; padding: 40px 30px; border-radius: 0 0 8px 8px; border: 1px solid #e0e0e0; border-top: none;">
          <h3 style="color: #1a1a1a; margin: 0 0 20px 0; font-size: 22px;">Password Reset Request</h3>
          
          <p style="color: #666; line-height: 1.6; font-size: 15px; margin: 0 0 25px 0;">
            We received a request to reset your password. If you didn't make this request, you can safely ignore this email.
          </p>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="${resetUrl}" style="background-color: #3B82F6; color: white; padding: 14px 32px; text-decoration: none; border-radius: 6px; display: inline-block; font-weight: 600; font-size: 15px; transition: background-color 0.3s;">
              Reset Your Password
            </a>
          </div>
          
          <p style="color: #666; line-height: 1.6; font-size: 14px; margin: 25px 0;">
            Or copy and paste this link in your browser:
          </p>
          <p style="background-color: #f5f5f5; padding: 12px; border-radius: 6px; word-break: break-all; color: #666; font-size: 12px; font-family: 'Courier New', monospace; margin: 0;">
            ${resetUrl}
          </p>
          
          <div style="background-color: #fef3e2; padding: 15px; border-radius: 6px; margin: 25px 0; border-left: 4px solid #f59e0b;">
            <p style="margin: 0; color: #92400e; font-size: 13px;">
              <strong>⏱️ Important:</strong> This reset link will expire in 30 minutes.
            </p>
          </div>
          
          <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e0e0e0;">
            <p style="color: #999; font-size: 12px; margin: 0;">
              This is an automated email. Please do not reply to this message.<br>
              © 2026 AppointCare. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    `,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log('Password reset email sent successfully:', {
      messageId: info.messageId,
      to: email,
      timestamp: new Date().toISOString(),
    });
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('Failed to send password reset email:', {
      to: email,
      error: error.message,
      timestamp: new Date().toISOString(),
    });
    throw error;
  }
};

module.exports = {
  transporter,
  sendVerificationEmail,
  sendPasswordResetEmail,
};
