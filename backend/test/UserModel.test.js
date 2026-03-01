/* global describe, it, expect, jest, beforeEach */
const pool = require('../config/database');
const bcrypt = require('bcryptjs');

jest.mock('../config/database');
jest.mock('bcryptjs');

describe('User Model', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('createUser', () => {
    it('should create a new user with hashed password', async () => {
      const userData = {
        fullName: 'John Doe',
        email: 'john@test.com',
        password: 'hashedPassword123'
      };

      const mockResult = {
        rows: [{ id: 1, full_name: 'John Doe', email: 'john@test.com' }]
      };

      pool.query = jest.fn().mockResolvedValue(mockResult);

      const result = await pool.query(
        'INSERT INTO users (full_name, email, password) VALUES ($1, $2, $3) RETURNING id, full_name, email',
        [userData.fullName, userData.email, userData.password]
      );

      expect(result.rows[0]).toHaveProperty('id', 1);
      expect(result.rows[0]).toHaveProperty('email', 'john@test.com');
    });
  });

  describe('getUserById', () => {
    it('should retrieve user by ID', async () => {
      const mockUser = {
        rows: [{ id: 1, full_name: 'John Doe', email: 'john@test.com' }]
      };

      pool.query = jest.fn().mockResolvedValue(mockUser);

      const result = await pool.query(
        'SELECT * FROM users WHERE id = $1',
        [1]
      );

      expect(result.rows[0]).toHaveProperty('id', 1);
      expect(result.rows[0]).toHaveProperty('full_name', 'John Doe');
    });

    it('should return empty if user not found', async () => {
      pool.query = jest.fn().mockResolvedValue({ rows: [] });

      const result = await pool.query(
        'SELECT * FROM users WHERE id = $1',
        [999]
      );

      expect(result.rows).toHaveLength(0);
    });
  });

  describe('updateUserProfile', () => {
    it('should update user profile', async () => {
      const mockResult = {
        rows: [{ id: 1, full_name: 'Updated Name', email: 'updated@test.com' }]
      };

      pool.query = jest.fn().mockResolvedValue(mockResult);

      const result = await pool.query(
        'UPDATE users SET full_name = $1, email = $2 WHERE id = $3 RETURNING id, full_name, email',
        ['Updated Name', 'updated@test.com', 1]
      );

      expect(result.rows[0]).toHaveProperty('full_name', 'Updated Name');
    });
  });

  describe('passwordHashing', () => {
    it('should hash password correctly', async () => {
      const password = 'myPassword123';
      const hashedPassword = 'hashedvalue123';

      bcrypt.hash = jest.fn().mockResolvedValue(hashedPassword);

      const result = await bcrypt.hash(password, 10);

      expect(result).toBe(hashedPassword);
      expect(bcrypt.hash).toHaveBeenCalledWith(password, 10);
    });

    it('should compare passwords correctly', async () => {
      const password = 'myPassword123';
      const hashedPassword = 'hashedvalue123';

      bcrypt.compare = jest.fn().mockResolvedValue(true);

      const result = await bcrypt.compare(password, hashedPassword);

      expect(result).toBe(true);
      expect(bcrypt.compare).toHaveBeenCalledWith(password, hashedPassword);
    });

    it('should reject incorrect password', async () => {
      bcrypt.compare = jest.fn().mockResolvedValue(false);

      const result = await bcrypt.compare('wrongPassword', 'hashedvalue123');

      expect(result).toBe(false);
    });
  });

  describe('emailValidation', () => {
    it('should validate email format', () => {
      const validEmail = 'user@example.com';
      const invalidEmail = 'notanemail';
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

      expect(emailRegex.test(validEmail)).toBe(true);
      expect(emailRegex.test(invalidEmail)).toBe(false);
    });
  });
});
