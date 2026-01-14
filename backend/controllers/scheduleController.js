const pool = require('../config/database');

// Get doctor's schedule for a specific month
exports.getDoctorSchedule = async (req, res) => {
  const client = await pool.connect();
  try {
    const { doctorId } = req.params;
    const { month, year } = req.query;

    if (!month || !year) {
      return res.status(400).json({ message: 'Month and year are required' });
    }

    const result = await client.query(
      `SELECT * FROM doctor_schedule 
       WHERE doctor_id = $1 
       AND EXTRACT(MONTH FROM schedule_date) = $2 
       AND EXTRACT(YEAR FROM schedule_date) = $3
       ORDER BY schedule_date, start_time`,
      [doctorId, month, year]
    );

    res.json(result.rows);
  } catch (err) {
    console.error('Error fetching schedule:', err);
    res.status(500).json({ message: 'Error fetching schedule' });
  } finally {
    client.release();
  }
};

// Create new schedule entry
exports.createSchedule = async (req, res) => {
  const client = await pool.connect();
  try {
    const { doctorId, scheduleDate, startTime, endTime, clinic, isAvailable } = req.body;

    if (!doctorId || !scheduleDate || !startTime || !endTime) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    const result = await client.query(
      `INSERT INTO doctor_schedule (doctor_id, schedule_date, start_time, end_time, clinic, is_available)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING *`,
      [doctorId, scheduleDate, startTime, endTime, clinic || 'Clinic 1', isAvailable !== false]
    );

    res.status(201).json({
      message: 'Schedule created successfully',
      schedule: result.rows[0]
    });
  } catch (err) {
    console.error('Error creating schedule:', err);
    res.status(500).json({ message: 'Error creating schedule' });
  } finally {
    client.release();
  }
};

// Update schedule entry
exports.updateSchedule = async (req, res) => {
  const client = await pool.connect();
  try {
    const { scheduleId } = req.params;
    const { startTime, endTime, clinic, isAvailable } = req.body;

    const result = await client.query(
      `UPDATE doctor_schedule 
       SET start_time = $1, end_time = $2, clinic = $3, is_available = $4, updated_at = CURRENT_TIMESTAMP
       WHERE id = $5
       RETURNING *`,
      [startTime, endTime, clinic, isAvailable !== false, scheduleId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Schedule not found' });
    }

    res.json({
      message: 'Schedule updated successfully',
      schedule: result.rows[0]
    });
  } catch (err) {
    console.error('Error updating schedule:', err);
    res.status(500).json({ message: 'Error updating schedule' });
  } finally {
    client.release();
  }
};

// Delete schedule entry
exports.deleteSchedule = async (req, res) => {
  const client = await pool.connect();
  try {
    const { scheduleId } = req.params;

    const result = await client.query(
      'DELETE FROM doctor_schedule WHERE id = $1 RETURNING *',
      [scheduleId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Schedule not found' });
    }

    res.json({ message: 'Schedule deleted successfully' });
  } catch (err) {
    console.error('Error deleting schedule:', err);
    res.status(500).json({ message: 'Error deleting schedule' });
  } finally {
    client.release();
  }
};

// Get available time slots for a doctor on a specific date
exports.getAvailableSlots = async (req, res) => {
  const client = await pool.connect();
  try {
    const { doctorId } = req.params;
    const { date } = req.query;

    if (!date) {
      return res.status(400).json({ message: 'Date is required' });
    }

    const result = await client.query(
      `SELECT * FROM doctor_schedule 
       WHERE doctor_id = $1 
       AND schedule_date = $2 
       AND is_available = true
       ORDER BY start_time`,
      [doctorId, date]
    );

    res.json(result.rows);
  } catch (err) {
    console.error('Error fetching available slots:', err);
    res.status(500).json({ message: 'Error fetching available slots' });
  } finally {
    client.release();
  }
};

// Book an appointment
exports.bookAppointment = async (req, res) => {
  const client = await pool.connect();
  try {
    const { userId, doctorId, scheduleId, appointmentDate, startTime, clinic } = req.body;

    if (!userId || !doctorId || !appointmentDate || !startTime) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    const result = await client.query(
      `INSERT INTO appointments (user_id, doctor_id, schedule_id, appointment_date, start_time, clinic, status)
       VALUES ($1, $2, $3, $4, $5, $6, 'booked')
       RETURNING *`,
      [userId, doctorId, scheduleId || null, appointmentDate, startTime, clinic || 'Clinic 1']
    );

    res.status(201).json({
      message: 'Appointment booked successfully',
      appointment: result.rows[0]
    });
  } catch (err) {
    console.error('Error booking appointment:', err);
    res.status(500).json({ message: 'Error booking appointment' });
  } finally {
    client.release();
  }
};

// Get user's appointments
exports.getUserAppointments = async (req, res) => {
  const client = await pool.connect();
  try {
    const { userId } = req.params;
    const { month, year } = req.query;

    let query = `SELECT a.*, d.name, d.specialty, d.fee 
                FROM appointments a
                JOIN doctors d ON a.doctor_id = d.id
                WHERE a.user_id = $1`;
    const params = [userId];

    if (month && year) {
      query += ` AND EXTRACT(MONTH FROM a.appointment_date) = $2 
                AND EXTRACT(YEAR FROM a.appointment_date) = $3`;
      params.push(month, year);
    }

    query += ' ORDER BY a.appointment_date, a.start_time';

    const result = await client.query(query, params);

    res.json(result.rows);
  } catch (err) {
    console.error('Error fetching user appointments:', err);
    res.status(500).json({ message: 'Error fetching appointments' });
  } finally {
    client.release();
  }
};
