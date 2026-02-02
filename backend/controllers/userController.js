const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const pool = require('../config/database');
const { verifyRecaptchaToken } = require('../config/recaptcha');

const registerUser = async (req, res) => {
  const client = await pool.connect();
  try {
    const { fullName, email, password, phoneNumber, birthDate, recaptchaToken } = req.body;

    // Validate input
    if (!fullName || !email || !password) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    // Verify reCAPTCHA token
    if (!recaptchaToken) {
      return res.status(400).json({ message: 'reCAPTCHA verification required' });
    }

    const recaptchaResult = await verifyRecaptchaToken(recaptchaToken);
    
    if (!recaptchaResult.verified) {
      return res.status(400).json({ 
        message: 'reCAPTCHA verification failed. Please try again.',
        error: recaptchaResult.error 
      });
    }

    // Check if email already exists
    const existing = await client.query('SELECT * FROM users WHERE email = $1', [email]);
    if (existing.rows.length > 0) {
      return res.status(400).json({ message: 'Email already registered' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Store user as verified (reCAPTCHA verified user)
    const result = await client.query(
      'INSERT INTO users (full_name, email, password, phone_number, birth_date, is_verified) VALUES ($1, $2, $3, $4, $5, $6) RETURNING id, email, full_name',
      [fullName, email, hashedPassword, phoneNumber, birthDate, true]
    );

    const user = result.rows[0];

    // Generate JWT token
    const token = jwt.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET || 'secret', {
      expiresIn: '7d',
    });

    res.status(201).json({
      message: 'User registered successfully with reCAPTCHA verification!',
      user: { id: user.id, email: user.email, fullName: user.full_name },
      token,
      verified: true,
    });
  } catch (err) {
    console.error('Registration error:', err);
    res.status(500).json({ message: 'Server error during registration' });
  } finally {
    client.release();
  }
};

const loginUser = async (req, res) => {
  const client = await pool.connect();
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password required' });
    }

    // Find user in database
    const result = await client.query('SELECT * FROM users WHERE email = $1', [email]);

    if (result.rows.length === 0) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const user = result.rows[0];

    // Compare passwords
    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Generate JWT token
    const token = jwt.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET || 'secret', {
      expiresIn: '7d',
    });

    // Check if user is admin
    const isAdmin = user.email === 'admin1245@gmail.com' && password === 'Admin@1245';

    res.status(200).json({
      message: 'Login successful',
      user: { id: user.id, email: user.email, fullName: user.full_name },
      token,
      isAdmin: isAdmin,
    });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ message: 'Server error during login' });
  } finally {
    client.release();
  }
};

const forgotPassword = async (req, res) => {
  const client = await pool.connect();
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: 'Email is required' });
    }

    // Check if user exists
    const result = await client.query('SELECT * FROM users WHERE email = $1', [email]);

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'User not found with this email' });
    }

    const user = result.rows[0];

    // Generate reset token
    const resetToken = crypto.randomBytes(32).toString('hex');
    const hashedToken = crypto.createHash('sha256').update(resetToken).digest('hex');

    // Update user with reset token and expiry (30 minutes)
    const expiryTime = new Date(Date.now() + 30 * 60 * 1000);
    await client.query(
      'UPDATE users SET reset_password_token = $1, reset_password_expiry = $2 WHERE id = $3',
      [hashedToken, expiryTime, user.id]
    );

    // Create reset link
    const resetUrl = `${process.env.FRONTEND_URL || 'http://localhost:5173'}/reset-password/${resetToken}`;

    // Send email
    try {
      await sendPasswordResetEmail(email, resetToken);
      res.status(200).json({ message: 'Password reset link sent to your email' });
    } catch (emailError) {
      console.error('Failed to send password reset email:', emailError);
      res.status(500).json({ message: 'Failed to send email. Please try again later.' });
    }
  } catch (err) {
    console.error('Forgot password error:', err);
    res.status(500).json({ message: 'Server error' });
  } finally {
    client.release();
  }
};

const resetPassword = async (req, res) => {
  const client = await pool.connect();
  try {
    const { token, password } = req.body;

    if (!token || !password) {
      return res.status(400).json({ message: 'Token and password are required' });
    }

    // Hash the token
    const hashedToken = crypto.createHash('sha256').update(token).digest('hex');

    // Find user with valid reset token
    const result = await client.query(
      'SELECT * FROM users WHERE reset_password_token = $1 AND reset_password_expiry > NOW()',
      [hashedToken]
    );

    if (result.rows.length === 0) {
      return res.status(400).json({ message: 'Invalid or expired reset token' });
    }

    const user = result.rows[0];

    // Hash new password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Update password and clear reset token
    await client.query(
      'UPDATE users SET password = $1, reset_password_token = NULL, reset_password_expiry = NULL WHERE id = $2',
      [hashedPassword, user.id]
    );

    res.status(200).json({ message: 'Password reset successfully' });
  } catch (err) {
    console.error('Reset password error:', err);
    res.status(500).json({ message: 'Server error' });
  } finally {
    client.release();
  }
};

const getUserProfile = async (req, res) => {
  const client = await pool.connect();
  try {
    const { userId } = req.params;

    const result = await client.query(
      'SELECT id, full_name, email, phone_number, gender, location, birth_date, bio, profile_image FROM users WHERE id = $1',
      [userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'User not found' });
    }

    const user = result.rows[0];
    res.status(200).json({
      fullName: user.full_name,
      email: user.email,
      phoneNumber: user.phone_number,
      gender: user.gender,
      location: user.location,
      dateOfBirth: user.birth_date,
      bio: user.bio,
      profileImage: user.profile_image,
    });
  } catch (err) {
    console.error('Get profile error:', err);
    res.status(500).json({ message: 'Server error' });
  } finally {
    client.release();
  }
};

const updateUserProfile = async (req, res) => {
  const client = await pool.connect();
  try {
    const { userId } = req.params;
    const { fullName, email, phoneNumber, gender, location, dateOfBirth, bio, profileImage } = req.body;

    const result = await client.query(
      'UPDATE users SET full_name = $1, email = $2, phone_number = $3, gender = $4, location = $5, birth_date = $6, bio = $7, profile_image = $8 WHERE id = $9 RETURNING id, full_name, email',
      [fullName, email, phoneNumber, gender, location, dateOfBirth, bio, profileImage, userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json({
      message: 'Profile updated successfully',
      user: result.rows[0],
    });
  } catch (err) {
    console.error('Update profile error:', err);
    res.status(500).json({ message: 'Server error' });
  } finally {
    client.release();
  }
};

const verifyRecaptcha = async (req, res) => {
  try {
    const { recaptchaToken } = req.body;

    if (!recaptchaToken) {
      return res.status(400).json({ message: 'reCAPTCHA token required' });
    }

    const recaptchaResult = await verifyRecaptchaToken(recaptchaToken);
    
    if (!recaptchaResult.verified) {
      return res.status(400).json({ 
        message: 'reCAPTCHA verification failed',
        error: recaptchaResult.error 
      });
    }

    res.status(200).json({
      message: 'reCAPTCHA verified successfully',
      verified: true,
      score: recaptchaResult.score,
    });
  } catch (err) {
    console.error('reCAPTCHA verification error:', err);
    res.status(500).json({ message: 'Server error during reCAPTCHA verification' });
  }
};

const resendVerificationCode = async (req, res) => {
  return res.status(410).json({ 
    message: 'Email verification is no longer used. reCAPTCHA verification is required instead.',
  });
};

module.exports = { registerUser, loginUser, forgotPassword, resetPassword, getUserProfile, updateUserProfile, verifyRecaptcha, resendVerificationCode };
