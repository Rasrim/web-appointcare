const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const { User } = require('../models');
const { sendVerificationEmail, sendPasswordResetEmail } = require('../../config/email');

const registerUser = async (req, res) => {
  try {
    const { fullName, email, password, phoneNumber, birthDate } = req.body;

    // Validate input
    if (!fullName || !email || !password) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    // Check if email already exists
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ message: 'Email already registered' });
    }

    // Generate 6-digit verification code
    const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();
    const verificationCodeExpiry = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user with verification code (not verified yet)
    const user = await User.create({
      fullName,
      email,
      password: hashedPassword,
      phoneNumber,
      birthDate,
      verificationCode,
      verificationCodeExpiry,
      isVerified: false,
    });

    // Send verification email
    try {
      await sendVerificationEmail(email, verificationCode);
    } catch (emailError) {
      console.error('Failed to send verification email, but user was created:', emailError);
      // Don't return error - user is already created, we'll let them request code resend
    }

    res.status(201).json({
      message: 'User registered. Please check your email for verification code.',
      user: { id: user.id, email: user.email, fullName: user.fullName },
      requiresVerification: true,
    });
  } catch (err) {
    console.error('Registration error:', err);
    res.status(500).json({ message: 'Server error during registration' });
  }
};

const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password required' });
    }

    // Find user by email
    const user = await User.findOne({ where: { email } });

    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

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
      user: { id: user.id, email: user.email, fullName: user.fullName },
      token,
      isAdmin: isAdmin,
    });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ message: 'Server error during login' });
  }
};

const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: 'Email is required' });
    }

    // Check if user exists
    const user = await User.findOne({ where: { email } });

    if (!user) {
      return res.status(404).json({ message: 'User not found with this email' });
    }

    // Generate reset token
    const resetToken = crypto.randomBytes(32).toString('hex');
    const hashedToken = crypto.createHash('sha256').update(resetToken).digest('hex');

    // Update user with reset token and expiry (30 minutes)
    const expiryTime = new Date(Date.now() + 30 * 60 * 1000);
    await user.update({
      resetPasswordToken: hashedToken,
      resetPasswordExpiry: expiryTime,
    });

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
  }
};

const resetPassword = async (req, res) => {
  try {
    const { token, password } = req.body;

    if (!token || !password) {
      return res.status(400).json({ message: 'Token and password are required' });
    }

    // Hash the token
    const hashedToken = crypto.createHash('sha256').update(token).digest('hex');

    // Find user with valid reset token
    const user = await User.findOne({
      where: {
        resetPasswordToken: hashedToken,
        resetPasswordExpiry: { [require('sequelize').Op.gt]: new Date() },
      },
    });

    if (!user) {
      return res.status(400).json({ message: 'Invalid or expired reset token' });
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Update password and clear reset token
    await user.update({
      password: hashedPassword,
      resetPasswordToken: null,
      resetPasswordExpiry: null,
    });

    res.status(200).json({ message: 'Password reset successfully' });
  } catch (err) {
    console.error('Reset password error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

const getUserProfile = async (req, res) => {
  try {
    const { userId } = req.params;

    const user = await User.findByPk(userId, {
      attributes: ['id', 'fullName', 'email', 'phoneNumber', 'birthDate', 'profilePicture', 'specialization', 'licenseNumber', 'experience'],
    });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json(user);
  } catch (err) {
    console.error('Get profile error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

const updateUserProfile = async (req, res) => {
  try {
    const { userId } = req.params;
    const { fullName, email, phoneNumber, birthDate, profilePicture, specialization, licenseNumber, experience } = req.body;

    const user = await User.findByPk(userId);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Check if new email is already in use (only if email changed)
    if (email && email !== user.email) {
      const existingUser = await User.findOne({ where: { email } });
      if (existingUser) {
        return res.status(400).json({ message: 'Email already in use' });
      }
    }

    // Update user
    await user.update({
      fullName: fullName || user.fullName,
      email: email || user.email,
      phoneNumber: phoneNumber || user.phoneNumber,
      birthDate: birthDate || user.birthDate,
      profilePicture: profilePicture || user.profilePicture,
      specialization: specialization || user.specialization,
      licenseNumber: licenseNumber || user.licenseNumber,
      experience: experience !== undefined ? experience : user.experience,
    });

    res.status(200).json({
      message: 'Profile updated successfully',
      user: { id: user.id, email: user.email, fullName: user.fullName },
    });
  } catch (err) {
    console.error('Update profile error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

const verifyEmail = async (req, res) => {
  try {
    const { email, verificationCode } = req.body;

    if (!email || !verificationCode) {
      return res.status(400).json({ message: 'Email and verification code required' });
    }

    // Find user by email
    const user = await User.findOne({ where: { email } });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Check if email is already verified
    if (user.isVerified) {
      return res.status(400).json({ message: 'Email already verified' });
    }

    // Check if verification code is correct
    if (user.verificationCode !== verificationCode) {
      return res.status(400).json({ message: 'Invalid verification code' });
    }

    // Check if code has expired
    if (new Date() > new Date(user.verificationCodeExpiry)) {
      return res.status(400).json({ message: 'Verification code has expired' });
    }

    // Mark user as verified
    await user.update({
      isVerified: true,
      verificationCode: null,
      verificationCodeExpiry: null,
    });

    // Generate JWT token
    const token = jwt.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET || 'secret', {
      expiresIn: '7d',
    });

    res.status(200).json({
      message: 'Email verified successfully',
      user: { id: user.id, email: user.email, fullName: user.fullName },
      token,
    });
  } catch (err) {
    console.error('Verification error:', err);
    res.status(500).json({ message: 'Server error during verification' });
  }
};

const resendVerificationCode = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: 'Email required' });
    }

    // Find user by email
    const user = await User.findOne({ where: { email } });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Check if already verified
    if (user.isVerified) {
      return res.status(400).json({ message: 'Email already verified' });
    }

    // Generate new verification code
    const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();
    const verificationCodeExpiry = new Date(Date.now() + 10 * 60 * 1000);

    // Update verification code
    await user.update({
      verificationCode,
      verificationCodeExpiry,
    });

    // Send verification email
    try {
      await sendVerificationEmail(email, verificationCode);
      res.status(200).json({
        message: 'New verification code sent to your email',
      });
    } catch (emailError) {
      console.error('Failed to send verification email:', emailError);
      // Still return success since code was updated in database
      res.status(200).json({
        message: 'Verification code updated. Please check your email. If you don\'t receive it, please try again.',
      });
    }
  } catch (err) {
    console.error('Resend verification error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = { registerUser, loginUser, forgotPassword, resetPassword, getUserProfile, updateUserProfile, verifyEmail, resendVerificationCode };
