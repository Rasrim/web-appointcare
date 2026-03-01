/* global describe, it, beforeEach, expect, jest */
const scheduleController = require('../controllers/scheduleController');
const pool = require('../config/database');
const logger = require('../utils/logger');

// Mock dependencies
jest.mock('../config/database');
jest.mock('../utils/logger');

describe('Schedule Controller', () => {
  let mockReq, mockRes;

  beforeEach(() => {
    mockReq = {
      body: {},
      params: {},
      query: {},
      user: { id: 1 }
    };
    mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
    };
    jest.clearAllMocks();
  });

  describe('getDoctorSchedule', () => {
    it('should retrieve doctor schedule successfully', async () => {
      mockReq.params = { doctorId: 1 };

      const mockClient = {
        query: jest.fn().mockResolvedValue({
          rows: [{ id: 1, doctor_id: 1, day: 'Monday', start_time: '09:00' }]
        }),
        release: jest.fn()
      };

      pool.connect = jest.fn().mockResolvedValue(mockClient);

      await scheduleController.getDoctorSchedule(mockReq, mockRes);

      expect(mockRes.json).toHaveBeenCalledWith(
        expect.objectContaining({
          success: true,
          data: expect.any(Object)
        })
      );
    });

    it('should return 404 if schedule not found', async () => {
      mockReq.params = { doctorId: 999 };

      const mockClient = {
        query: jest.fn().mockResolvedValue({ rows: [] }),
        release: jest.fn()
      };

      pool.connect = jest.fn().mockResolvedValue(mockClient);

      await scheduleController.getDoctorSchedule(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(404);
      expect(mockRes.json).toHaveBeenCalledWith(
        expect.objectContaining({
          success: false,
          message: 'Schedule not found for this doctor'
        })
      );
    });
  });

  describe('createSchedule', () => {
    it('should return 400 for missing required fields', async () => {
      mockReq.body = { doctorId: 1 };

      const mockClient = { release: jest.fn() };
      pool.connect = jest.fn().mockResolvedValue(mockClient);

      await scheduleController.createSchedule(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(400);
    });
  });

  describe('bookAppointment', () => {
    it('should book appointment with valid data', async () => {
      mockReq.body = {
        doctorId: 1,
        appointmentDate: '2024-01-15',
        appointmentTime: '09:00'
      };

      const mockClient = {
        query: jest.fn()
          .mockResolvedValueOnce({ rows: [] })
          .mockResolvedValueOnce({ rows: [{ id: 1, doctor_id: 1, appointment_date: '2024-01-15' }] }),
        release: jest.fn()
      };

      pool.connect = jest.fn().mockResolvedValue(mockClient);

      await scheduleController.bookAppointment(mockReq, mockRes);

      expect(mockClient.query).toHaveBeenCalled();
      expect(mockClient.release).toHaveBeenCalled();
    });

    it('should return 400 for missing required fields', async () => {
      mockReq.body = {
        doctorId: 1
        // missing appointmentDate and appointmentTime
      };

      const mockClient = {
        query: jest.fn(),
        release: jest.fn()
      };

      pool.connect = jest.fn().mockResolvedValue(mockClient);

      await scheduleController.bookAppointment(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(400);
    });
  });

  describe('getUserAppointments', () => {
    it('should retrieve user appointments', async () => {
      const mockClient = {
        query: jest.fn().mockResolvedValue({
          rows: [{ id: 1, doctor_id: 1, appointment_date: '2024-01-15' }]
        }),
        release: jest.fn()
      };

      pool.connect = jest.fn().mockResolvedValue(mockClient);

      await scheduleController.getUserAppointments(mockReq, mockRes);

      expect(mockClient.query).toHaveBeenCalled();
      expect(mockClient.release).toHaveBeenCalled();
      expect(mockRes.json).toHaveBeenCalled();
    });
  });

  describe('getAllAppointments', () => {
    it('should retrieve all appointments', async () => {
      const mockClient = {
        query: jest.fn().mockResolvedValue({
          rows: [
            { id: 1, user_id: 1, doctor_id: 1 },
            { id: 2, user_id: 2, doctor_id: 1 }
          ]
        }),
        release: jest.fn()
      };

      pool.connect = jest.fn().mockResolvedValue(mockClient);

      await scheduleController.getAllAppointments(mockReq, mockRes);

      expect(mockClient.query).toHaveBeenCalled();
      expect(mockClient.release).toHaveBeenCalled();
      expect(mockRes.json).toHaveBeenCalled();
    });
  });
});
