/* global describe, it, beforeEach, expect, jest */
const doctorController = require('../controllers/doctorController');
const pool = require('../config/database');

// Mock dependencies
jest.mock('../config/database');

describe('Doctor Controller', () => {
  let mockReq, mockRes;

  beforeEach(() => {
    mockReq = {
      body: {},
      params: {},
      user: { id: 1 }
    };
    mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
    };
    jest.clearAllMocks();
  });

  describe('getAllDoctors', () => {
    it('should retrieve all doctors', async () => {
      const mockDoctors = [
        { id: 1, name: 'Dr. Smith', specialty: 'Cardiology', experience: 10 },
        { id: 2, name: 'Dr. Johnson', specialty: 'Neurology', experience: 8 }
      ];

      pool.query = jest.fn().mockResolvedValue({ rows: mockDoctors });

      await doctorController.getAllDoctors(mockReq, mockRes);

      expect(mockRes.json).toHaveBeenCalledWith(mockDoctors);
    });

    it('should handle error when fetching doctors', async () => {
      pool.query = jest.fn().mockRejectedValue(new Error('Database error'));

      await doctorController.getAllDoctors(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockRes.json).toHaveBeenCalledWith(
        expect.objectContaining({
          message: 'Error fetching doctors'
        })
      );
    });
  });

  describe('getDoctorById', () => {
    it('should retrieve doctor by ID', async () => {
      mockReq.params = { id: 1 };
      const mockDoctor = { id: 1, name: 'Dr. Smith', specialty: 'Cardiology' };

      pool.query = jest.fn().mockResolvedValue({ rows: [mockDoctor] });

      await doctorController.getDoctorById(mockReq, mockRes);

      expect(pool.query).toHaveBeenCalledWith('SELECT * FROM doctors WHERE id = $1', [1]);
      expect(mockRes.json).toHaveBeenCalledWith(mockDoctor);
    });

    it('should return 404 if doctor not found', async () => {
      mockReq.params = { id: 999 };

      pool.query = jest.fn().mockResolvedValue({ rows: [] });

      await doctorController.getDoctorById(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(404);
      expect(mockRes.json).toHaveBeenCalledWith(
        expect.objectContaining({
          message: 'Doctor not found'
        })
      );
    });
  });

  describe('getDoctorSchedule', () => {
    it('should retrieve doctor schedule', async () => {
      mockReq.params = { doctorId: 1 };
      const mockSchedule = [
        { id: 1, doctor_id: 1, day: 'Monday', start_time: '09:00', end_time: '17:00' }
      ];

      pool.query = jest.fn().mockResolvedValue({ rows: mockSchedule });

      await doctorController.getDoctorSchedule(mockReq, mockRes);

      expect(pool.query).toHaveBeenCalledWith(
        'SELECT * FROM doctor_schedule WHERE doctor_id = $1 ORDER BY day, start_time',
        [1]
      );
      expect(mockRes.json).toHaveBeenCalledWith(mockSchedule);
    });

    it('should handle error when fetching schedule', async () => {
      mockReq.params = { doctorId: 1 };

      pool.query = jest.fn().mockRejectedValue(new Error('Database error'));

      await doctorController.getDoctorSchedule(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockRes.json).toHaveBeenCalledWith(
        expect.objectContaining({
          message: 'Error fetching doctor schedule'
        })
      );
    });
  });

  describe('createDoctor', () => {
    it('should create a new doctor', async () => {
      mockReq.body = {
        name: 'Dr. Williams',
        specialty: 'Dermatology',
        experience: 12,
        fee: 100,
        availability: 'Available',
        timing: '9AM-6PM'
      };

      const mockCreatedDoctor = { id: 1, ...mockReq.body };

      pool.query = jest.fn().mockResolvedValue({ rows: [mockCreatedDoctor] });

      await doctorController.createDoctor(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(201);
      expect(mockRes.json).toHaveBeenCalledWith(
        expect.objectContaining({
          message: 'Doctor added successfully'
        })
      );
    });

    it('should not create doctor with missing required fields', async () => {
      mockReq.body = {
        name: 'Dr. Williams',
        specialty: 'Dermatology'
        // Missing experience and fee
      };

      await doctorController.createDoctor(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith(
        expect.objectContaining({
          message: 'Missing required fields'
        })
      );
    });
  });
});
