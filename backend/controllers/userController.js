const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const pool = require('../config/database');
const { verifyRecaptchaToken } = require('../config/recaptcha');
const { sendPasswordResetEmail } = require('../config/email');

const registerUser = async (req, res) => {
  const client = await pool.connect();
  try {
    const { fullName, email, password, phoneNumber, birthDate, recaptchaToken, gender } = req.body;

    console.log("\n=== REGISTRATION REQUEST RECEIVED ===");
    console.log("Full body:", JSON.stringify(req.body, null, 2));
    console.log("Phone number received:", phoneNumber);
    console.log("Phone length:", phoneNumber ? phoneNumber.length : "null");
    console.log("Email:", email);
    console.log("Has reCAPTCHA token:", !!recaptchaToken);
    console.log("=====================================\n");

    // Validate input
    if (!fullName || !email || !password) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    // Validate Nepal phone number format if provided
    if (phoneNumber) {
      const nepalPhoneRegex = /^\+9779[87]\d{8}$/;
      const domesticPhoneRegex = /^9[87]\d{8}$/;
      
      console.log("\n🔍 PHONE VALIDATION DEBUG:");
      console.log("   Raw value:", JSON.stringify(phoneNumber));
      console.log("   Length:", phoneNumber.length);
      console.log("   Char codes:", phoneNumber.split('').map(c => `${c}(${c.charCodeAt(0)})`).join(', '));
      console.log("   Regex +9779...:", nepalPhoneRegex.test(phoneNumber));
      console.log("   Regex 9...:", domesticPhoneRegex.test(phoneNumber));
      
      const isValidNepal = nepalPhoneRegex.test(phoneNumber);
      const isValidDomestic = domesticPhoneRegex.test(phoneNumber);
      
      if (!isValidNepal && !isValidDomestic) {
        console.log("   ❌ INVALID - Neither regex matched");
        console.log("   Expected +9779 followed by exactly 9 digits (14 chars total)");
        console.log("   OR 9 followed by exactly 9 digits (10 chars total)\n");
        return res.status(400).json({ 
          message: `Invalid Nepal phone number format. Received: "${phoneNumber}" (${phoneNumber.length} chars). Must be +9779XXXXXXXXX (14 chars) or 9XXXXXXXXX (10 chars).` 
        });
      }
      console.log("   ✅ VALID\n");
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

    // Extract security question answers from fullName
    // First 2 letters of first name, last 2 letters of surname
    const nameParts = fullName.trim().split(/\s+/);
    const firstName = nameParts[0] || '';
    const surname = nameParts[nameParts.length - 1] || '';
    const firstNameLetters = firstName.substring(0, 2).toUpperCase();
    const lastSurnameLetters = surname.substring(surname.length - 2).toUpperCase();

    console.log("Security Questions:");
    console.log("  First name:", firstName, "-> First 2 letters:", firstNameLetters);
    console.log("  Surname:", surname, "-> Last 2 letters:", lastSurnameLetters);

    // Store user as verified (reCAPTCHA verified user)
    const result = await client.query(
      'INSERT INTO users (full_name, email, password, phone_number, birth_date, is_verified, gender, first_name_letters, last_surname_letters) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING id, email, full_name, phone_number',
      [fullName, email, hashedPassword, phoneNumber, birthDate, true, gender || null, firstNameLetters, lastSurnameLetters]
    );

    const user = result.rows[0];

    console.log("✅ User created successfully:");
    console.log("  ID:", user.id);
    console.log("  Email:", user.email);
    console.log("  Phone:", user.phone_number);

    // Generate JWT token
    const token = jwt.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET || 'secret', {
      expiresIn: '7d',
    });

    res.status(201).json({
      message: 'User registered successfully with reCAPTCHA verification!',
      user: { id: user.id, email: user.email, fullName: user.full_name, phoneNumber: user.phone_number },
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
      user: { 
        id: user.id, 
        email: user.email, 
        fullName: user.full_name,
        phoneNumber: user.phone_number,
        gender: user.gender,
        location: user.location,
      },
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

const logout = async (req, res) => {
  try {
    // Logout is typically handled on the client side by removing the token
    // This endpoint can be used for server-side session cleanup if needed
    res.status(200).json({ message: 'Logout successful' });
  } catch (error) {
    console.error('Logout error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

const getProfile = async (req, res) => {
  const client = await pool.connect();
  try {
    // Use userId from URL params if provided, otherwise use userId from JWT token
    const userId = req.params.userId || req.user.id;
    
    if (!userId) {
      return res.status(400).json({ message: 'User ID not provided' });
    }

    console.log(`Fetching profile for user: ${userId}`);
    
    const result = await client.query(
      'SELECT id, full_name, email, phone_number, birth_date, gender, location, bio, profile_image, is_verified FROM users WHERE id = $1',
      [userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'User not found' });
    }

    const user = result.rows[0];
    res.status(200).json({
      id: user.id,
      fullName: user.full_name,
      email: user.email,
      phoneNumber: user.phone_number,
      dateOfBirth: user.birth_date,
      gender: user.gender,
      location: user.location,
      bio: user.bio,
      profileImage: user.profile_image,
      isVerified: user.is_verified,
    });
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({ message: 'Server error', details: error.message });
  } finally {
    client.release();
  }
};

const updateProfile = async (req, res) => {
  const client = await pool.connect();
  try {
    // Use userId from URL params if provided, otherwise use userId from JWT token
    const userId = req.params.userId || req.user.id;
    
    if (!userId) {
      return res.status(400).json({ message: 'User ID not provided' });
    }

    const { fullName, email, phoneNumber, gender, location, dateOfBirth, bio, profileImage } = req.body;

    console.log(`Updating profile for user: ${userId}`, { fullName, email, phoneNumber, gender, location, dateOfBirth, bio });

    const result = await client.query(
      'UPDATE users SET full_name = $1, email = $2, phone_number = $3, gender = $4, location = $5, birth_date = $6, bio = $7, profile_image = $8 WHERE id = $9 RETURNING id, full_name, email, phone_number, birth_date, gender, location, bio, profile_image',
      [fullName, email, phoneNumber, gender, location, dateOfBirth, bio, profileImage, userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'User not found' });
    }

    const user = result.rows[0];
    res.status(200).json({ 
      message: 'Profile updated successfully', 
      user: {
        id: user.id,
        fullName: user.full_name,
        email: user.email,
        phoneNumber: user.phone_number,
        dateOfBirth: user.birth_date,
        gender: user.gender,
        location: user.location,
        bio: user.bio,
        profileImage: user.profile_image,
      }
    });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({ message: 'Server error', details: error.message });
  } finally {
    client.release();
  }
};

const changePassword = async (req, res) => {
  const client = await pool.connect();
  try {
    const userId = req.user.id;
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({ message: 'Current password and new password are required' });
    }

    // Get user's current password hash
    const userResult = await client.query(
      'SELECT password FROM users WHERE id = $1',
      [userId]
    );

    if (userResult.rows.length === 0) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Verify current password
    const isPasswordValid = await bcrypt.compare(currentPassword, userResult.rows[0].password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Current password is incorrect' });
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update password
    await client.query(
      'UPDATE users SET password = $1 WHERE id = $2',
      [hashedPassword, userId]
    );

    res.status(200).json({ message: 'Password changed successfully' });
  } catch (error) {
    console.error('Change password error:', error);
    res.status(500).json({ message: 'Server error' });
  } finally {
    client.release();
  }
};

const verifySecurityQuestions = async (req, res) => {
  const client = await pool.connect();
  try {
    const { email, firstNameLetters, lastSurnameLetters } = req.body;

    if (!email || !firstNameLetters || !lastSurnameLetters) {
      return res.status(400).json({ message: 'Email and security answers are required' });
    }

    // Find user by email
    const userResult = await client.query(
      'SELECT id, first_name_letters, last_surname_letters FROM users WHERE email = $1',
      [email]
    );

    if (userResult.rows.length === 0) {
      return res.status(404).json({ message: 'User not found' });
    }

    const user = userResult.rows[0];

    // Verify security questions (case-insensitive)
    if (user.first_name_letters?.toLowerCase() !== firstNameLetters?.toLowerCase() ||
        user.last_surname_letters?.toLowerCase() !== lastSurnameLetters?.toLowerCase()) {
      return res.status(401).json({ message: 'Incorrect security answers' });
    }

    // Generate a temporary reset token
    const resetToken = crypto.randomBytes(32).toString('hex');
    const resetTokenHash = crypto.createHash('sha256').update(resetToken).digest('hex');
    const resetTokenExpiry = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    // Store reset token
    await client.query(
      'UPDATE users SET reset_token = $1, reset_token_expiry = $2 WHERE id = $3',
      [resetTokenHash, resetTokenExpiry, user.id]
    );

    res.status(200).json({ 
      message: 'Security questions verified successfully',
      resetToken: resetToken,
      userId: user.id
    });
  } catch (error) {
    console.error('Verify security questions error:', error);
    res.status(500).json({ message: 'Server error', details: error.message });
  } finally {
    client.release();
  }
};

const resetPasswordWithToken = async (req, res) => {
  const client = await pool.connect();
  try {
    const { resetToken, newPassword, userId } = req.body;

    if (!resetToken || !newPassword || !userId) {
      return res.status(400).json({ message: 'Reset token, new password, and user ID are required' });
    }

    // Hash the reset token to compare
    const resetTokenHash = crypto.createHash('sha256').update(resetToken).digest('hex');

    // Find user and verify token
    const userResult = await client.query(
      'SELECT id FROM users WHERE id = $1 AND reset_token = $2 AND reset_token_expiry > NOW()',
      [userId, resetTokenHash]
    );

    if (userResult.rows.length === 0) {
      return res.status(401).json({ message: 'Invalid or expired reset token' });
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update password and clear reset token
    await client.query(
      'UPDATE users SET password = $1, reset_token = NULL, reset_token_expiry = NULL WHERE id = $2',
      [hashedPassword, userId]
    );

    res.status(200).json({ message: 'Password reset successfully' });
  } catch (error) {
    console.error('Reset password error:', error);
    res.status(500).json({ message: 'Server error', details: error.message });
  } finally {
    client.release();
  }
};

module.exports = { 
  registerUser, 
  loginUser, 
  forgotPassword, 
  resetPassword, 
  getUserProfile, 
  updateUserProfile, 
  verifyRecaptcha, 
  resendVerificationCode, 
  logout, 
  getProfile, 
  updateProfile, 
  changePassword,
  verifySecurityQuestions,
  resetPasswordWithToken,
  requestPasswordReset: forgotPassword
};
