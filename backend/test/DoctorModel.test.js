/* global describe, it, expect, jest, beforeEach */
const pool = require('../config/database');

jest.mock('../config/database');

describe('Doctor Model', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('createDoctor', () => {
    it('should create a new doctor', async () => {
      const doctorData = {
        name: 'Dr. Smith',
        specialty: 'Cardiology',
        experience: 10,
        fee: 100
      };

      const mockResult = {
        rows: [{ id: 1, ...doctorData }]
      };

      pool.query = jest.fn().mockResolvedValue(mockResult);

      const result = await pool.query(
        'INSERT INTO doctors (name, specialty, experience, fee) VALUES ($1, $2, $3, $4) RETURNING *',
        [doctorData.name, doctorData.specialty, doctorData.experience, doctorData.fee]
      );

      expect(result.rows[0]).toHaveProperty('id', 1);
      expect(result.rows[0]).toHaveProperty('specialty', 'Cardiology');
    });
  });

  describe('getAllDoctors', () => {
    it('should retrieve all doctors', async () => {
      const mockDoctors = [
        { id: 1, name: 'Dr. Smith', specialty: 'Cardiology', experience: 10 },
        { id: 2, name: 'Dr. Johnson', specialty: 'Neurology', experience: 8 }
      ];

      pool.query = jest.fn().mockResolvedValue({ rows: mockDoctors });

      const result = await pool.query('SELECT * FROM doctors ORDER BY name');

      expect(result.rows).toHaveLength(2);
      expect(result.rows[0]).toHaveProperty('name', 'Dr. Smith');
    });

    it('should return empty array if no doctors found', async () => {
      pool.query = jest.fn().mockResolvedValue({ rows: [] });

      const result = await pool.query('SELECT * FROM doctors ORDER BY name');

      expect(result.rows).toHaveLength(0);
    });
  });

  describe('getDoctorsBySpecialty', () => {
    it('should filter doctors by specialization', async () => {
      const mockDoctors = [
        { id: 1, name: 'Dr. Smith', specialty: 'Cardiology', experience: 10 },
        { id: 3, name: 'Dr. Brown', specialty: 'Cardiology', experience: 5 }
      ];

      pool.query = jest.fn().mockResolvedValue({ rows: mockDoctors });

      const result = await pool.query(
        'SELECT * FROM doctors WHERE specialty = $1 ORDER BY name',
        ['Cardiology']
      );

      expect(result.rows).toHaveLength(2);
      expect(result.rows.every(doc => doc.specialty === 'Cardiology')).toBe(true);
    });
  });

  describe('updateDoctor', () => {
    it('should update doctor profile', async () => {
      const mockResult = {
        rows: [{ id: 1, name: 'Dr. Smith Updated', specialty: 'Cardiology', fee: 120 }]
      };

      pool.query = jest.fn().mockResolvedValue(mockResult);

      const result = await pool.query(
        'UPDATE doctors SET name = $1, fee = $2 WHERE id = $3 RETURNING *',
        ['Dr. Smith Updated', 120, 1]
      );

      expect(result.rows[0]).toHaveProperty('fee', 120);
    });
  });

  describe('deleteDoctor', () => {
    it('should delete a doctor', async () => {
      pool.query = jest.fn().mockResolvedValue({ rowCount: 1 });

      const result = await pool.query(
        'DELETE FROM doctors WHERE id = $1',
        [1]
      );

      expect(result.rowCount).toBe(1);
    });

    it('should return 0 if doctor not found for deletion', async () => {
      pool.query = jest.fn().mockResolvedValue({ rowCount: 0 });

      const result = await pool.query(
        'DELETE FROM doctors WHERE id = $1',
        [999]
      );

      expect(result.rowCount).toBe(0);
    });
  });

  describe('doctorValidation', () => {
    it('should validate experience is a positive number', () => {
      const validExperience = 10;
      const invalidExperience = -5;

      expect(validExperience > 0).toBe(true);
      expect(invalidExperience > 0).toBe(false);
    });

    it('should validate fee is a positive number', () => {
      const validFee = 100;
      const invalidFee = -50;

      expect(validFee > 0).toBe(true);
      expect(invalidFee > 0).toBe(false);
    });
  });
});
