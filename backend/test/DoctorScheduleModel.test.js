/* global describe, it, expect, jest, beforeEach */
const pool = require('../config/database');

jest.mock('../config/database');

describe('Doctor Schedule Model', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('createSchedule', () => {
    it('should create doctor schedule', async () => {
      const scheduleData = {
        doctorId: 1,
        startDate: '2024-01-01',
        endDate: '2024-12-31',
        startTime: '09:00',
        endTime: '17:00'
      };

      const mockResult = {
        rows: [{ id: 1, ...scheduleData }]
      };

      pool.query = jest.fn().mockResolvedValue(mockResult);

      const result = await pool.query(
        'INSERT INTO doctor_schedule (doctor_id, start_date, end_date, start_time, end_time) VALUES ($1, $2, $3, $4, $5) RETURNING *',
        [scheduleData.doctorId, scheduleData.startDate, scheduleData.endDate, scheduleData.startTime, scheduleData.endTime]
      );

      expect(result.rows[0]).toHaveProperty('id', 1);
      expect(result.rows[0]).toHaveProperty('doctorId', 1);
    });
  });

  describe('getScheduleByDoctor', () => {
    it('should retrieve schedule for a doctor', async () => {
      const mockSchedules = [
        { id: 1, doctor_id: 1, day: 'Monday', start_time: '09:00', end_time: '17:00' },
        { id: 2, doctor_id: 1, day: 'Tuesday', start_time: '09:00', end_time: '17:00' }
      ];

      pool.query = jest.fn().mockResolvedValue({ rows: mockSchedules });

      const result = await pool.query(
        'SELECT * FROM doctor_schedule WHERE doctor_id = $1 ORDER BY day, start_time',
        [1]
      );

      expect(result.rows).toHaveLength(2);
      expect(result.rows.every(sched => sched.doctor_id === 1)).toBe(true);
    });

    it('should return empty if no schedule found for doctor', async () => {
      pool.query = jest.fn().mockResolvedValue({ rows: [] });

      const result = await pool.query(
        'SELECT * FROM doctor_schedule WHERE doctor_id = $1',
        [999]
      );

      expect(result.rows).toHaveLength(0);
    });
  });

  describe('updateSchedule', () => {
    it('should update schedule', async () => {
      const mockResult = {
        rows: [{ id: 1, doctor_id: 1, start_time: '10:00', end_time: '18:00' }]
      };

      pool.query = jest.fn().mockResolvedValue(mockResult);

      const result = await pool.query(
        'UPDATE doctor_schedule SET start_time = $1, end_time = $2 WHERE id = $3 RETURNING *',
        ['10:00', '18:00', 1]
      );

      expect(result.rows[0]).toHaveProperty('start_time', '10:00');
    });
  });

  describe('deleteSchedule', () => {
    it('should delete schedule', async () => {
      pool.query = jest.fn().mockResolvedValue({ rowCount: 1 });

      const result = await pool.query(
        'DELETE FROM doctor_schedule WHERE id = $1',
        [1]
      );

      expect(result.rowCount).toBe(1);
    });
  });

  describe('calculateAvailableSlots', () => {
    it('should calculate available slots', async () => {
      const mockSlots = [
        { slot_time: '09:00', booked: false },
        { slot_time: '09:30', booked: false },
        { slot_time: '10:00', booked: true },
        { slot_time: '10:30', booked: false }
      ];

      pool.query = jest.fn().mockResolvedValue({ rows: mockSlots });

      const result = await pool.query(
        `SELECT slot_time, 
                CASE WHEN appointments.id IS NULL THEN false ELSE true END as booked
         FROM doctor_schedule 
         LEFT JOIN appointments ON doctor_schedule.id = appointments.schedule_id 
         WHERE doctor_id = $1 AND schedule_date = $2`,
        [1, '2024-01-15']
      );

      const availableSlots = result.rows.filter(slot => !slot.booked);
      expect(availableSlots).toHaveLength(3);
    });
  });

  describe('scheduleValidation', () => {
    it('should validate time format', () => {
      const validTime = '09:00';
      const invalidTime = '25:00';
      const timeRegex = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/;

      expect(timeRegex.test(validTime)).toBe(true);
      expect(timeRegex.test(invalidTime)).toBe(false);
    });

    it('should validate start time is before end time', () => {
      const startTime = '09:00';
      const endTime = '17:00';
      const invalidEndTime = '08:00';

      expect(startTime < endTime).toBe(true);
      expect(startTime < invalidEndTime).toBe(false);
    });

    it('should validate date format', () => {
      const validDate = '2024-01-15';
      const invalidDate = '15-01-2024';
      const dateRegex = /^\d{4}-\d{2}-\d{2}$/;

      expect(dateRegex.test(validDate)).toBe(true);
      expect(dateRegex.test(invalidDate)).toBe(false);
    });
  });
});
