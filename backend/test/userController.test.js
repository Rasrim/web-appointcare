/* global describe, it, beforeEach, expect, jest */
const userController = require('../controllers/userController');
const pool = require('../config/database');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { verifyRecaptchaToken } = require('../config/recaptcha');

// Mock dependencies
jest.mock('../config/database');
jest.mock('bcryptjs');
jest.mock('jsonwebtoken');
jest.mock('../config/recaptcha');

describe('User Controller', () => {
  let mockReq, mockRes;

  beforeEach(() => {
    mockReq = {
      body: {},
      user: { id: 1, email: 'test@test.com' },
      params: {}
    };
    mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
    };
    jest.clearAllMocks();
  });

  describe('registerUser', () => {
    beforeEach(() => {
      // Mock successful reCAPTCHA verification by default
      verifyRecaptchaToken.mockResolvedValue({
        verified: true,
        score: 0.9,
        action: 'register'
      });
    });

    it('should register a new user successfully', async () => {
      mockReq.body = {
        fullName: 'John Doe',
        email: 'john@test.com',
        password: 'Password123',
        recaptchaToken: 'valid_token'
      };

      const mockClient = {
        query: jest.fn()
          .mockResolvedValueOnce({ rows: [] }) // Check if email exists
          .mockResolvedValueOnce({ rows: [{ id: 1, email: 'john@test.com', full_name: 'John Doe' }] }), // Insert user
        release: jest.fn()
      };

      pool.connect = jest.fn().mockResolvedValue(mockClient);
      bcrypt.hash = jest.fn().mockResolvedValue('hashedpassword');
      jwt.sign = jest.fn().mockReturnValue('token123');

      await userController.registerUser(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(201);
      expect(mockRes.json).toHaveBeenCalledWith(
        expect.objectContaining({
          message: expect.stringContaining('registered successfully')
        })
      );
    });

    it('should not register with missing fields', async () => {
      mockReq.body = { email: 'test@test.com' }; // Missing password and fullName

      const mockClient = { release: jest.fn() };
      pool.connect = jest.fn().mockResolvedValue(mockClient);

      await userController.registerUser(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith(
        expect.objectContaining({
          message: 'Missing required fields'
        })
      );
    });

    it('should not register if email already exists', async () => {
      mockReq.body = {
        fullName: 'John Doe',
        email: 'existing@test.com',
        password: 'Password123',
        recaptchaToken: 'valid_token'
      };

      const mockClient = {
        query: jest.fn().mockResolvedValueOnce({ rows: [{ id: 1 }] }), // Email exists
        release: jest.fn()
      };

      pool.connect = jest.fn().mockResolvedValue(mockClient);

      await userController.registerUser(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith(
        expect.objectContaining({
          message: 'Email already registered'
        })
      );
    });
  });

  describe('loginUser', () => {
    it('should login user successfully with correct credentials', async () => {
      mockReq.body = {
        email: 'test@test.com',
        password: 'correctpassword'
      };

      const mockClient = {
        query: jest.fn().mockResolvedValueOnce({
          rows: [{ id: 1, email: 'test@test.com', password: 'hashedpassword' }]
        }),
        release: jest.fn()
      };

      pool.connect = jest.fn().mockResolvedValue(mockClient);
      bcrypt.compare = jest.fn().mockResolvedValue(true);
      jwt.sign = jest.fn().mockReturnValue('token123');

      await userController.loginUser(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith(
        expect.objectContaining({
          message: 'Login successful',
          token: 'token123'
        })
      );
    });

    it('should reject login with invalid credentials', async () => {
      mockReq.body = {
        email: 'test@test.com',
        password: 'wrongpassword'
      };

      const mockClient = {
        query: jest.fn().mockResolvedValueOnce({
          rows: [{ id: 1, email: 'test@test.com', password: 'hashedpassword' }]
        }),
        release: jest.fn()
      };

      pool.connect = jest.fn().mockResolvedValue(mockClient);
      bcrypt.compare = jest.fn().mockResolvedValue(false);

      await userController.loginUser(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(401);
      expect(mockRes.json).toHaveBeenCalledWith(
        expect.objectContaining({
          message: 'Invalid credentials'
        })
      );
    });
  });

  describe('getProfile', () => {
    it('should get user profile successfully', async () => {
      const mockClient = {
        query: jest.fn().mockResolvedValueOnce({
          rows: [{ id: 1, full_name: 'John Doe', email: 'john@test.com' }]
        }),
        release: jest.fn()
      };

      pool.connect = jest.fn().mockResolvedValue(mockClient);

      await userController.getProfile(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalled();
    });

    it('should return 404 if user not found', async () => {
      const mockClient = {
        query: jest.fn().mockResolvedValueOnce({ rows: [] }),
        release: jest.fn()
      };

      pool.connect = jest.fn().mockResolvedValue(mockClient);

      await userController.getProfile(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(404);
      expect(mockRes.json).toHaveBeenCalledWith(
        expect.objectContaining({
          message: 'User not found'
        })
      );
    });
  });

  describe('updateProfile', () => {
    it('should update profile successfully', async () => {
      mockReq.body = {
        fullName: 'Updated Name',
        email: 'updated@test.com',
        phoneNumber: '1234567890'
      };

      const mockClient = {
        query: jest.fn().mockResolvedValueOnce({
          rows: [{ id: 1, full_name: 'Updated Name', email: 'updated@test.com' }]
        }),
        release: jest.fn()
      };

      pool.connect = jest.fn().mockResolvedValue(mockClient);

      await userController.updateProfile(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith(
        expect.objectContaining({
          message: 'Profile updated successfully'
        })
      );
    });
  });

  describe('changePassword', () => {
    it('should change password successfully', async () => {
      mockReq.body = {
        currentPassword: 'oldpassword',
        newPassword: 'newpassword123'
      };

      const mockClient = {
        query: jest.fn()
          .mockResolvedValueOnce({ rows: [{ password: 'hashed_old_password' }] })
          .mockResolvedValueOnce({ rows: [{ id: 1 }] }),
        release: jest.fn()
      };

      pool.connect = jest.fn().mockResolvedValue(mockClient);
      bcrypt.compare = jest.fn().mockResolvedValue(true);
      bcrypt.hash = jest.fn().mockResolvedValue('hashed_new_password');

      await userController.changePassword(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith(
        expect.objectContaining({
          message: 'Password changed successfully'
        })
      );
    });

    it('should reject with wrong current password', async () => {
      mockReq.body = {
        currentPassword: 'wrongpassword',
        newPassword: 'newpassword123'
      };

      const mockClient = {
        query: jest.fn().mockResolvedValueOnce({
          rows: [{ password: 'hashed_old_password' }]
        }),
        release: jest.fn()
      };

      pool.connect = jest.fn().mockResolvedValue(mockClient);
      bcrypt.compare = jest.fn().mockResolvedValue(false);

      await userController.changePassword(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(401);
      expect(mockRes.json).toHaveBeenCalledWith(
        expect.objectContaining({
          message: 'Current password is incorrect'
        })
      );
    });
  });

  describe('logout', () => {
    it('should logout successfully', async () => {
      await userController.logout(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith(
        expect.objectContaining({
          message: 'Logout successful'
        })
      );
    });
  });
});
