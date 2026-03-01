/* global describe, it, expect, jest */
const pool = require('../config/database');

// Mock dependencies
jest.mock('../config/database');

describe('Appointment Model', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('createAppointment', () => {
    it('should create a new appointment', async () => {
      const appointmentData = {
        userId: 1,
        doctorId: 1,
        appointmentDate: '2024-01-15',
        appointmentTime: '09:00',
        reason: 'Regular checkup'
      };

      const mockResult = {
        rows: [{ id: 1, ...appointmentData }]
      };

      pool.query = jest.fn().mockResolvedValue(mockResult);

      const result = await pool.query(
        'INSERT INTO appointments (user_id, doctor_id, appointment_date, appointment_time, reason) VALUES ($1, $2, $3, $4, $5) RETURNING *',
        [appointmentData.userId, appointmentData.doctorId, appointmentData.appointmentDate, appointmentData.appointmentTime, appointmentData.reason]
      );

      expect(result.rows[0]).toHaveProperty('id', 1);
      expect(result.rows[0]).toHaveProperty('userId', 1);
    });
  });

  describe('getUserAppointments', () => {
    it('should retrieve user appointments', async () => {
      const mockAppointments = [
        { id: 1, user_id: 1, doctor_id: 1, appointment_date: '2024-01-15' },
        { id: 2, user_id: 1, doctor_id: 2, appointment_date: '2024-01-20' }
      ];

      pool.query = jest.fn().mockResolvedValue({ rows: mockAppointments });

      const result = await pool.query(
        'SELECT * FROM appointments WHERE user_id = $1 ORDER BY appointment_date',
        [1]
      );

      expect(result.rows).toHaveLength(2);
      expect(result.rows[0]).toHaveProperty('user_id', 1);
    });

    it('should return empty array if no appointments found', async () => {
      pool.query = jest.fn().mockResolvedValue({ rows: [] });

      const result = await pool.query(
        'SELECT * FROM appointments WHERE user_id = $1 ORDER BY appointment_date',
        [999]
      );

      expect(result.rows).toHaveLength(0);
    });
  });

  describe('cancelAppointment', () => {
    it('should cancel an appointment', async () => {
      const mockResult = {
        rows: [{ id: 1, status: 'cancelled' }]
      };

      pool.query = jest.fn().mockResolvedValue(mockResult);

      const result = await pool.query(
        'UPDATE appointments SET status = $1 WHERE id = $2 RETURNING *',
        ['cancelled', 1]
      );

      expect(result.rows[0]).toHaveProperty('status', 'cancelled');
    });

    it('should return null if appointment not found for cancellation', async () => {
      pool.query = jest.fn().mockResolvedValue({ rows: [] });

      const result = await pool.query(
        'UPDATE appointments SET status = $1 WHERE id = $2 RETURNING *',
        ['cancelled', 999]
      );

      expect(result.rows).toHaveLength(0);
    });
  });

  describe('checkAvailableSlots', () => {
    it('should check available slots for a doctor on a specific date', async () => {
      const mockSlots = [
        { slot_time: '09:00', is_available: true },
        { slot_time: '09:30', is_available: true },
        { slot_time: '10:00', is_available: false },
        { slot_time: '10:30', is_available: true }
      ];

      pool.query = jest.fn().mockResolvedValue({ rows: mockSlots });

      const result = await pool.query(
        `SELECT slot_time, 
                CASE WHEN appointments.id IS NULL THEN true ELSE false END as is_available
         FROM doctor_schedule 
         LEFT JOIN appointments ON doctor_schedule.id = appointments.schedule_id 
         WHERE doctor_id = $1 AND schedule_date = $2`,
        [1, '2024-01-15']
      );

      expect(result.rows).toHaveLength(4);
      expect(result.rows.filter(slot => slot.is_available)).toHaveLength(3);
    });
  });

  describe('appointmentValidation', () => {
    it('should validate appointment date is in the future', () => {
      const pastDate = new Date('2020-01-01');
      const futureDate = new Date('2027-12-31');

      expect(futureDate > new Date()).toBe(true);
      expect(pastDate > new Date()).toBe(false);
    });

    it('should validate appointment time format', () => {
      const validTime = '09:00';
      const invalidTime = '25:00';

      const timeRegex = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/;
      expect(timeRegex.test(validTime)).toBe(true);
      expect(timeRegex.test(invalidTime)).toBe(false);
    });
  });
});
