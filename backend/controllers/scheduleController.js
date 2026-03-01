const pool = require('../config/database');
const logger = require('../utils/logger');
const { sendAppointmentConfirmationEmail } = require('../config/email');

// Get doctor's schedule
exports.getDoctorSchedule = async (req, res) => {
  try {
    const { doctorId } = req.params;
    const client = await pool.connect();

    logger.info(`Fetching schedule for doctor: ${doctorId}`);

    const result = await client.query(
      'SELECT * FROM doctor_schedules WHERE doctor_id = $1',
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
      'SELECT id FROM doctor_schedules WHERE doctor_id = $1',
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
      `INSERT INTO doctor_schedules (doctor_id, schedule_date, start_time, end_time, duration_minutes, is_active)
       VALUES ($1, $2, $3, $4, 30, true)
       RETURNING *`,
      [doctorId, startDate, startTime, endTime]
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

    let updateQuery = 'UPDATE doctor_schedules SET ';
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
      'DELETE FROM doctor_schedules WHERE doctor_id = $1 RETURNING id',
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
      'SELECT * FROM doctor_schedules WHERE doctor_id = $1',
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

    // Get user details for email
    const userResult = await client.query(
      'SELECT full_name, email FROM users WHERE id = $1',
      [userId]
    );

    const user = userResult.rows[0];
    if (!user) {
      client.release();
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    // Get doctor details for email
    const doctorResult = await client.query(
      'SELECT full_name, specialization, consultationFee FROM doctors WHERE id = $1',
      [doctorId]
    );

    const doctor = doctorResult.rows[0];
    if (!doctor) {
      client.release();
      return res.status(404).json({
        success: false,
        message: 'Doctor not found',
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

    const appointment = result.rows[0];

    logger.info(`Appointment booked successfully: ${appointment.id}`);

    // Send confirmation email (non-blocking - don't fail if email fails)
    try {
      await sendAppointmentConfirmationEmail(user.email, {
        doctorName: doctor.full_name,
        date: appointmentDate,
        time: appointmentTime,
        specialization: doctor.specialization,
        fee: doctor.consultationFee || 500,
        patientName: user.full_name,
      });
      logger.info(`Confirmation email sent to ${user.email}`);
    } catch (emailError) {
      logger.error(`Failed to send confirmation email: ${emailError.message}`);
      // Don't fail the appointment booking if email fails
    }

    res.status(201).json({
      success: true,
      message: 'Appointment booked successfully',
      data: appointment,
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
      `SELECT a.id, a.user_id, a.doctor_id, a.appointment_date, a.start_time, a.clinic, a.status, a.notes,
              a.created_at, a.updated_at,
              u.full_name as user_name, u.phone_number,
              d.name as doctor_name, d.specialty as specialization
       FROM appointments a
       LEFT JOIN users u ON a.user_id = u.id
       LEFT JOIN doctors d ON a.doctor_id = d.id
       ORDER BY a.appointment_date DESC, a.start_time DESC`
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
// Admin: Create schedule with date and time
exports.createScheduleAdmin = async (req, res) => {
  const client = await pool.connect();
  try {
    const { doctor_id, schedule_date, start_time, end_time, clinic } = req.body;

    console.log("📝 createScheduleAdmin called with:", { doctor_id, schedule_date, start_time, end_time, clinic });

    if (!doctor_id || !schedule_date || !start_time || !end_time) {
      console.warn("⚠️  Missing required fields:", { doctor_id, schedule_date, start_time, end_time });
      return res.status(400).json({
        success: false,
        message: 'Missing required fields',
      });
    }

    // Check if doctor exists (in users table)
    console.log("🔍 Checking if doctor exists with ID:", doctor_id);
    const doctorCheck = await client.query('SELECT id, full_name FROM users WHERE id = $1', [doctor_id]);
    if (doctorCheck.rows.length === 0) {
      console.warn("⚠️  Doctor not found with ID:", doctor_id);
      client.release();
      return res.status(404).json({
        success: false,
        message: 'Doctor not found',
      });
    }

    console.log("✅ Doctor found:", doctorCheck.rows[0].full_name);

    const result = await client.query(
      `INSERT INTO doctor_schedules (doctor_id, schedule_date, start_time, end_time, duration_minutes, is_active)
       VALUES ($1, $2, $3, $4, 30, true)
       RETURNING *`,
      [doctor_id, schedule_date, start_time, end_time]
    );

    client.release();

    console.log("✅ Schedule created successfully:", result.rows[0]);

    res.status(201).json({
      success: true,
      message: 'Schedule created successfully',
      data: result.rows[0],
    });
  } catch (error) {
    client.release();
    console.error("❌ Error creating schedule:", error.message);
    console.error("   Stack:", error.stack);
    res.status(500).json({
      success: false,
      message: 'Error creating schedule',
      error: error.message,
      details: error.detail || error.constraint,
    });
  }
};

// Admin: Get all schedules with doctor info
exports.getAllSchedulesAdmin = async (req, res) => {
  const client = await pool.connect();
  try {
    console.log("📅 getAllSchedulesAdmin called");
    
    const result = await client.query(
      `SELECT ds.id, ds.doctor_id, ds.schedule_date, ds.start_time, ds.end_time, ds.is_active, d.full_name as doctor_name
       FROM doctor_schedules ds
       LEFT JOIN users d ON ds.doctor_id = d.id
       ORDER BY ds.schedule_date DESC, ds.start_time DESC`
    );

    console.log("📋 Fetched schedules:", result.rows.length, "records");
    console.log("📝 Schedule data:", JSON.stringify(result.rows, null, 2));

    client.release();

    res.json({
      success: true,
      schedules: result.rows,
      data: result.rows,
    });
  } catch (error) {
    client.release();
    console.error("❌ Error fetching schedules:", error.message);
    res.status(500).json({
      success: false,
      message: 'Error fetching schedules',
      error: error.message,
    });
  }
};

// Admin: Update schedule
exports.updateScheduleAdmin = async (req, res) => {
  const client = await pool.connect();
  try {
    const { id } = req.params;
    const { doctor_id, schedule_date, start_time, end_time, clinic } = req.body;

    if (!doctor_id || !schedule_date || !start_time || !end_time) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields',
      });
    }

    const result = await client.query(
      `UPDATE doctor_schedules 
       SET doctor_id = $1, schedule_date = $2, start_time = $3, end_time = $4
       WHERE id = $5
       RETURNING *`,
      [doctor_id, schedule_date, start_time, end_time, id]
    );

    client.release();

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Schedule not found',
      });
    }

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

// Admin: Delete schedule
exports.deleteScheduleAdmin = async (req, res) => {
  const client = await pool.connect();
  try {
    const { id } = req.params;

    await client.query(
      'DELETE FROM doctor_schedules WHERE id = $1',
      [id]
    );

    client.release();

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

// Generate 30-minute time slots
const generateTimeSlots = (startTime, endTime) => {
  const slots = [];
  const [startHour, startMin] = startTime.split(':').map(Number);
  const [endHour, endMin] = endTime.split(':').map(Number);

  let currentHour = startHour;
  let currentMin = startMin;

  while (currentHour < endHour || (currentHour === endHour && currentMin < endMin)) {
    const timeStr = `${String(currentHour).padStart(2, '0')}:${String(currentMin).padStart(2, '0')}`;
    slots.push(timeStr);
    currentMin += 30;
    if (currentMin >= 60) {
      currentHour += Math.floor(currentMin / 60);
      currentMin = currentMin % 60;
    }
  }
  return slots;
};

// Get available dates for a doctor (next 30 days)
exports.getAvailableDatesForBooking = async (req, res) => {
  const client = await pool.connect();
  try {
    const { doctorId } = req.query;

    console.log("📅 getAvailableDatesForBooking called for doctor:", doctorId);

    if (!doctorId) {
      return res.status(400).json({
        success: false,
        message: 'Doctor ID is required',
      });
    }

    const result = await client.query(
      `SELECT DISTINCT schedule_date FROM doctor_schedules 
       WHERE doctor_id = $1 AND schedule_date >= CURRENT_DATE 
       AND schedule_date <= CURRENT_DATE + INTERVAL '30 days'
       ORDER BY schedule_date ASC`,
      [doctorId]
    );

    console.log("📋 Available dates query returned:", result.rows.length, "dates");
    console.log("📝 Dates:", result.rows.map(r => r.schedule_date));

    client.release();

    res.json({
      success: true,
      availableDates: result.rows.map(row => row.schedule_date)
    });
  } catch (error) {
    client.release();
    console.error("❌ Error fetching available dates:", error.message);
    res.status(500).json({
      success: false,
      message: 'Error fetching available dates',
      error: error.message,
    });
  }
};

// Get available time slots for a doctor on a specific date
exports.getAvailableTimeSlotsForBooking = async (req, res) => {
  const client = await pool.connect();
  try {
    const { doctorId, date } = req.query;

    console.log("⏰ getAvailableTimeSlotsForBooking called with:", { doctorId, date, type: typeof date });

    if (!doctorId || !date) {
      return res.status(400).json({
        success: false,
        message: 'Doctor ID and date are required',
      });
    }

    // Check if date is in the past
    const selectedDate = new Date(date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    if (selectedDate < today) {
      return res.status(400).json({
        success: false,
        message: 'Cannot book appointments for past dates'
      });
    }

    // Get doctor schedule for the date
    console.log("🔍 Querying schedule for doctor_id:", doctorId, "schedule_date:", date);
    const scheduleResult = await client.query(
      `SELECT * FROM doctor_schedules 
       WHERE doctor_id = $1 AND schedule_date = $2`,
      [doctorId, date]
    );

    console.log("📅 Schedule query result rows:", scheduleResult.rows.length);
    console.log("📋 Full schedule result:", JSON.stringify(scheduleResult.rows, null, 2));

    if (scheduleResult.rows.length === 0) {
      console.log("⚠️  No schedule found for doctor_id:", doctorId, "date:", date);
      client.release();
      return res.json({
        success: true,
        availableSlots: [],
        message: 'No schedule available for this date'
      });
    }

    const schedule = scheduleResult.rows[0];
    console.log("✅ Schedule found:", { start_time: schedule.start_time, end_time: schedule.end_time });

    // Generate time slots (30-minute intervals)
    const allSlots = generateTimeSlots(schedule.start_time, schedule.end_time);
    console.log("🕒 Generated slots:", allSlots);

    // Get booked appointments for this date
    const bookedResult = await client.query(
      `SELECT appointment_time FROM appointments 
       WHERE doctor_id = $1 AND appointment_date = $2 AND status = 'confirmed'`,
      [doctorId, date]
    );

    const bookedTimes = bookedResult.rows.map(row => row.appointment_time);
    console.log("🚫 Booked times:", bookedTimes);

    // Filter out booked slots
    const availableSlots = allSlots.filter(slot => !bookedTimes.includes(slot));
    console.log("✨ Available slots after filtering:", availableSlots);

    client.release();

    res.json({
      success: true,
      scheduleId: schedule.id,
      date: date,
      allSlots: allSlots,
      availableSlots: availableSlots,
      bookedSlots: bookedTimes
    });
  } catch (error) {
    client.release();
    console.error("❌ Error fetching available time slots:", error.message);
    res.status(500).json({
      success: false,
      message: 'Error fetching available time slots',
      error: error.message,
    });
  }
};