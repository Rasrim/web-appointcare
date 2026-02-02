const pool = require('../config/database');
const logger = require('../utils/logger');

// Get doctor's schedule
exports.getDoctorSchedule = async (req, res) => {
  try {
    const { doctorId } = req.params;
    const client = await pool.connect();

    logger.info(`Fetching schedule for doctor: ${doctorId}`);

    const result = await client.query(
      'SELECT * FROM doctor_schedule WHERE doctor_id = $1',
      [doctorId]
    );

    client.release();

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Schedule not found for this doctor',
      });
    }

    res.json({
      success: true,
      data: result.rows[0],
    });
  } catch (error) {
    logger.error(`Error fetching doctor schedule: ${error.message}`);
    res.status(500).json({
      success: false,
      message: 'Error fetching schedule',
      error: error.message,
    });
  }
};

// Create schedule for doctor
exports.createSchedule = async (req, res) => {
  const client = await pool.connect();
  try {
    const { doctorId, startDate, endDate, startTime, endTime, daysOfWeek } = req.body;

    logger.info(`Creating schedule for doctor: ${doctorId}`);

    // Validate input
    if (!doctorId || !startDate || !endDate || !startTime || !endTime) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields',
      });
    }

    // Check if doctor exists
    const doctorCheck = await client.query('SELECT id FROM doctors WHERE id = $1', [doctorId]);
    if (doctorCheck.rows.length === 0) {
      client.release();
      return res.status(404).json({
        success: false,
        message: 'Doctor not found',
      });
    }

    // Check if schedule already exists
    const existingSchedule = await client.query(
      'SELECT id FROM doctor_schedule WHERE doctor_id = $1',
      [doctorId]
    );

    if (existingSchedule.rows.length > 0) {
      client.release();
      return res.status(400).json({
        success: false,
        message: 'Schedule already exists for this doctor',
      });
    }

    const result = await client.query(
      `INSERT INTO doctor_schedule (doctor_id, start_date, end_date, start_time, end_time, days_of_week)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING *`,
      [doctorId, startDate, endDate, startTime, endTime, daysOfWeek || '1,2,3,4,5']
    );

    client.release();

    logger.info(`Schedule created successfully for doctor: ${doctorId}`);

    res.status(201).json({
      success: true,
      message: 'Schedule created successfully',
      data: result.rows[0],
    });
  } catch (error) {
    client.release();
    logger.error(`Error creating schedule: ${error.message}`);
    res.status(500).json({
      success: false,
      message: 'Error creating schedule',
      error: error.message,
    });
  }
};

// Update schedule
exports.updateSchedule = async (req, res) => {
  const client = await pool.connect();
  try {
    const { doctorId } = req.params;
    const { startDate, endDate, startTime, endTime, daysOfWeek } = req.body;

    logger.info(`Updating schedule for doctor: ${doctorId}`);

    let updateQuery = 'UPDATE doctor_schedule SET ';
    const updates = [];
    const values = [];
    let paramCount = 1;

    if (startDate) {
      updates.push(`start_date = $${paramCount}`);
      values.push(startDate);
      paramCount++;
    }
    if (endDate) {
      updates.push(`end_date = $${paramCount}`);
      values.push(endDate);
      paramCount++;
    }
    if (startTime) {
      updates.push(`start_time = $${paramCount}`);
      values.push(startTime);
      paramCount++;
    }
    if (endTime) {
      updates.push(`end_time = $${paramCount}`);
      values.push(endTime);
      paramCount++;
    }
    if (daysOfWeek) {
      updates.push(`days_of_week = $${paramCount}`);
      values.push(daysOfWeek);
      paramCount++;
    }

    if (updates.length === 0) {
      client.release();
      return res.status(400).json({
        success: false,
        message: 'No fields to update',
      });
    }

    updateQuery += updates.join(', ');
    updateQuery += ` WHERE doctor_id = $${paramCount} RETURNING *`;
    values.push(doctorId);

    const result = await client.query(updateQuery, values);

    client.release();

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Schedule not found',
      });
    }

    logger.info(`Schedule updated successfully for doctor: ${doctorId}`);

    res.json({
      success: true,
      message: 'Schedule updated successfully',
      data: result.rows[0],
    });
  } catch (error) {
    client.release();
    logger.error(`Error updating schedule: ${error.message}`);
    res.status(500).json({
      success: false,
      message: 'Error updating schedule',
      error: error.message,
    });
  }
};

// Delete schedule
exports.deleteSchedule = async (req, res) => {
  const client = await pool.connect();
  try {
    const { doctorId } = req.params;

    logger.info(`Deleting schedule for doctor: ${doctorId}`);

    const result = await client.query(
      'DELETE FROM doctor_schedule WHERE doctor_id = $1 RETURNING id',
      [doctorId]
    );

    client.release();

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Schedule not found',
      });
    }

    logger.info(`Schedule deleted successfully for doctor: ${doctorId}`);

    res.json({
      success: true,
      message: 'Schedule deleted successfully',
    });
  } catch (error) {
    client.release();
    logger.error(`Error deleting schedule: ${error.message}`);
    res.status(500).json({
      success: false,
      message: 'Error deleting schedule',
      error: error.message,
    });
  }
};

// Get available slots for a doctor on a specific date
exports.getAvailableSlots = async (req, res) => {
  const client = await pool.connect();
  try {
    const { doctorId, date } = req.query;

    logger.info(`Fetching available slots for doctor: ${doctorId} on date: ${date}`);

    if (!doctorId || !date) {
      return res.status(400).json({
        success: false,
        message: 'Doctor ID and date are required',
      });
    }

    const scheduleResult = await client.query(
      'SELECT * FROM doctor_schedule WHERE doctor_id = $1',
      [doctorId]
    );

    if (scheduleResult.rows.length === 0) {
      client.release();
      return res.status(404).json({
        success: false,
        message: 'Schedule not found',
      });
    }

    // Get booked appointments for this date
    const appointmentsResult = await client.query(
      'SELECT appointment_time FROM appointments WHERE doctor_id = $1 AND appointment_date = $2',
      [doctorId, date]
    );

    client.release();

    const bookedTimes = appointmentsResult.rows.map((row) => row.appointment_time);

    logger.info(`Found available slots for doctor: ${doctorId}`);

    res.json({
      success: true,
      data: bookedTimes,
    });
  } catch (error) {
    client.release();
    logger.error(`Error fetching available slots: ${error.message}`);
    res.status(500).json({
      success: false,
      message: 'Error fetching available slots',
      error: error.message,
    });
  }
};

// Book appointment
exports.bookAppointment = async (req, res) => {
  const client = await pool.connect();
  try {
    const userId = req.user?.id;
    const { doctorId, appointmentDate, appointmentTime, notes } = req.body;

    logger.info(
      `Booking appointment for user: ${userId}, doctor: ${doctorId}, date: ${appointmentDate}`
    );

    // Validate input
    if (!doctorId || !appointmentDate || !appointmentTime) {
      client.release();
      return res.status(400).json({
        success: false,
        message: 'Missing required fields',
      });
    }

    // Check if appointment slot is available
    const existingAppointment = await client.query(
      'SELECT id FROM appointments WHERE doctor_id = $1 AND appointment_date = $2 AND appointment_time = $3',
      [doctorId, appointmentDate, appointmentTime]
    );

    if (existingAppointment.rows.length > 0) {
      client.release();
      return res.status(400).json({
        success: false,
        message: 'This appointment slot is already booked',
      });
    }

    // Create appointment
    const result = await client.query(
      `INSERT INTO appointments (user_id, doctor_id, appointment_date, appointment_time, notes, status)
       VALUES ($1, $2, $3, $4, $5, 'confirmed')
       RETURNING *`,
      [userId, doctorId, appointmentDate, appointmentTime, notes || '']
    );

    client.release();

    logger.info(`Appointment booked successfully: ${result.rows[0].id}`);

    res.status(201).json({
      success: true,
      message: 'Appointment booked successfully',
      data: result.rows[0],
    });
  } catch (error) {
    client.release();
    logger.error(`Error booking appointment: ${error.message}`);
    res.status(500).json({
      success: false,
      message: 'Error booking appointment',
      error: error.message,
    });
  }
};

// Get user's appointments
exports.getUserAppointments = async (req, res) => {
  const client = await pool.connect();
  try {
    const userId = req.user?.id;

    logger.info(`Fetching appointments for user: ${userId}`);

    const result = await client.query(
      `SELECT a.*, d.name, d.specialization, d.location
       FROM appointments a
       LEFT JOIN doctors d ON a.doctor_id = d.id
       WHERE a.user_id = $1
       ORDER BY a.appointment_date DESC`,
      [userId]
    );

    client.release();

    res.json({
      success: true,
      data: result.rows,
    });
  } catch (error) {
    client.release();
    logger.error(`Error fetching user appointments: ${error.message}`);
    res.status(500).json({
      success: false,
      message: 'Error fetching appointments',
      error: error.message,
    });
  }
};

// Get all appointments (admin only)
exports.getAllAppointments = async (req, res) => {
  const client = await pool.connect();
  try {
    logger.info('Admin: Fetching all appointments');

    const result = await client.query(
      `SELECT a.*, d.name, d.specialization
       FROM appointments a
       LEFT JOIN doctors d ON a.doctor_id = d.id
       ORDER BY a.appointment_date DESC`
    );

    client.release();

    res.json({
      success: true,
      data: result.rows,
    });
  } catch (error) {
    client.release();
    logger.error(`Error fetching all appointments: ${error.message}`);
    res.status(500).json({
      success: false,
      message: 'Error fetching appointments',
      error: error.message,
    });
  }
};
