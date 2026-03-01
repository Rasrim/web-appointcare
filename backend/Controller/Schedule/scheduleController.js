const Schedule = require("../../models/scheduleModel");
const Appointment = require("../../models/appointmentModel");
const Doctor = require("../../models/doctorModel");
const User = require("../../models/userModel");
const logger = require("../../utils/logger");
const { sendAppointmentConfirmationEmail } = require("../../config/email");

// Get doctor's schedule
exports.getDoctorSchedule = async (req, res) => {
  try {
    const { doctorId } = req.params;
    logger.info(`Fetching schedule for doctor: ${doctorId}`);

    const schedule = await Schedule.findOne({
      where: { doctorId },
      include: [
        {
          model: Doctor,
          attributes: ["id", "name", "specialization"],
        },
      ],
    });

    if (!schedule) {
      return res.status(404).json({
        success: false,
        message: "Schedule not found for this doctor",
      });
    }

    res.json({
      success: true,
      data: schedule,
    });
  } catch (error) {
    logger.error(`Error fetching doctor schedule: ${error.message}`);
    res.status(500).json({
      success: false,
      message: "Error fetching schedule",
      error: error.message,
    });
  }
};

// Create schedule for doctor
exports.createSchedule = async (req, res) => {
  try {
    const { doctorId, startDate, endDate, startTime, endTime, daysOfWeek } = req.body;

    logger.info(`Creating schedule for doctor: ${doctorId}`);

    // Validate input
    if (!doctorId || !startDate || !endDate || !startTime || !endTime) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields",
      });
    }

    // Check if doctor exists
    const doctor = await Doctor.findByPk(doctorId);
    if (!doctor) {
      return res.status(404).json({
        success: false,
        message: "Doctor not found",
      });
    }

    // Check if schedule already exists
    const existingSchedule = await Schedule.findOne({
      where: { doctorId },
    });

    if (existingSchedule) {
      return res.status(400).json({
        success: false,
        message: "Schedule already exists for this doctor",
      });
    }

    const schedule = await Schedule.create({
      doctorId,
      startDate,
      endDate,
      startTime,
      endTime,
      daysOfWeek: daysOfWeek || "1,2,3,4,5", // Monday to Friday by default
    });

    logger.info(`Schedule created successfully for doctor: ${doctorId}`);

    res.status(201).json({
      success: true,
      message: "Schedule created successfully",
      data: schedule,
    });
  } catch (error) {
    logger.error(`Error creating schedule: ${error.message}`);
    res.status(500).json({
      success: false,
      message: "Error creating schedule",
      error: error.message,
    });
  }
};

// Update schedule
exports.updateSchedule = async (req, res) => {
  try {
    const { doctorId } = req.params;
    const { startDate, endDate, startTime, endTime, daysOfWeek } = req.body;

    logger.info(`Updating schedule for doctor: ${doctorId}`);

    const schedule = await Schedule.findOne({
      where: { doctorId },
    });

    if (!schedule) {
      return res.status(404).json({
        success: false,
        message: "Schedule not found",
      });
    }

    if (startDate) schedule.startDate = startDate;
    if (endDate) schedule.endDate = endDate;
    if (startTime) schedule.startTime = startTime;
    if (endTime) schedule.endTime = endTime;
    if (daysOfWeek) schedule.daysOfWeek = daysOfWeek;

    await schedule.save();

    logger.info(`Schedule updated successfully for doctor: ${doctorId}`);

    res.json({
      success: true,
      message: "Schedule updated successfully",
      data: schedule,
    });
  } catch (error) {
    logger.error(`Error updating schedule: ${error.message}`);
    res.status(500).json({
      success: false,
      message: "Error updating schedule",
      error: error.message,
    });
  }
};

// Delete schedule
exports.deleteSchedule = async (req, res) => {
  try {
    const { doctorId } = req.params;

    logger.info(`Deleting schedule for doctor: ${doctorId}`);

    const schedule = await Schedule.findOne({
      where: { doctorId },
    });

    if (!schedule) {
      return res.status(404).json({
        success: false,
        message: "Schedule not found",
      });
    }

    await schedule.destroy();

    logger.info(`Schedule deleted successfully for doctor: ${doctorId}`);

    res.json({
      success: true,
      message: "Schedule deleted successfully",
    });
  } catch (error) {
    logger.error(`Error deleting schedule: ${error.message}`);
    res.status(500).json({
      success: false,
      message: "Error deleting schedule",
      error: error.message,
    });
  }
};

// Get available slots for a doctor on a specific date
exports.getAvailableSlots = async (req, res) => {
  try {
    const { doctorId, date } = req.query;

    logger.info(`Fetching available slots for doctor: ${doctorId} on date: ${date}`);

    if (!doctorId || !date) {
      return res.status(400).json({
        success: false,
        message: "Doctor ID and date are required",
      });
    }

    const schedule = await Schedule.findOne({
      where: { doctorId },
    });

    if (!schedule) {
      return res.status(404).json({
        success: false,
        message: "Schedule not found",
      });
    }

    // Get the day of week (0-6, where 0 is Sunday)
    const appointmentDate = new Date(date);
    const dayOfWeek = appointmentDate.getDay();

    // Check if doctor works on this day
    const daysArray = schedule.daysOfWeek.split(",").map((d) => parseInt(d));
    if (!daysArray.includes(dayOfWeek)) {
      return res.json({
        success: true,
        message: "Doctor is not available on this day",
        data: [],
      });
    }

    // Generate all possible slots (assuming 30-minute slots)
    const slots = [];
    const [startHour, startMin] = schedule.startTime.split(":").map(Number);
    const [endHour, endMin] = schedule.endTime.split(":").map(Number);

    let currentTime = new Date();
    currentTime.setHours(startHour, startMin, 0, 0);

    const endTime = new Date();
    endTime.setHours(endHour, endMin, 0, 0);

    while (currentTime <= endTime) {
      const timeStr = currentTime.toTimeString().slice(0, 5);
      slots.push(timeStr);
      currentTime.setMinutes(currentTime.getMinutes() + 30);
    }

    // Get booked appointments for this date
    const bookedAppointments = await Appointment.findAll({
      where: {
        doctorId,
        appointmentDate: date,
      },
      attributes: ["appointmentTime"],
    });

    const bookedTimes = bookedAppointments.map((apt) => apt.appointmentTime);

    // Filter out booked slots
    const availableSlots = slots.filter((slot) => !bookedTimes.includes(slot));

    logger.info(
      `Found ${availableSlots.length} available slots for doctor: ${doctorId}`
    );

    res.json({
      success: true,
      data: availableSlots,
    });
  } catch (error) {
    logger.error(`Error fetching available slots: ${error.message}`);
    res.status(500).json({
      success: false,
      message: "Error fetching available slots",
      error: error.message,
    });
  }
};

// Book appointment
exports.bookAppointment = async (req, res) => {
  try {
    const userId = req.user.id; // From auth middleware
    const { doctorId, appointmentDate, appointmentTime, notes } = req.body;

    logger.info(
      `Booking appointment for user: ${userId}, doctor: ${doctorId}, date: ${appointmentDate}`
    );

    // Validate input
    if (!doctorId || !appointmentDate || !appointmentTime) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields",
      });
    }

    // Check if appointment slot is available
    const existingAppointment = await Appointment.findOne({
      where: {
        doctorId,
        appointmentDate,
        appointmentTime,
      },
    });

    if (existingAppointment) {
      return res.status(400).json({
        success: false,
        message: "This appointment slot is already booked",
      });
    }

    // Get user details for email
    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Get doctor details for email
    const doctor = await Doctor.findByPk(doctorId);
    if (!doctor) {
      return res.status(404).json({
        success: false,
        message: "Doctor not found",
      });
    }

    // Create appointment
    const appointment = await Appointment.create({
      userId,
      doctorId,
      appointmentDate,
      appointmentTime,
      notes: notes || "",
      status: "confirmed",
    });

    logger.info(`Appointment booked successfully: ${appointment.id}`);

    // Send confirmation email (non-blocking - don't fail if email fails)
    try {
      await sendAppointmentConfirmationEmail(user.email, {
        doctorName: doctor.full_name || doctor.name,
        date: appointmentDate,
        time: appointmentTime,
        specialization: doctor.specialization || doctor.specialty,
        fee: doctor.consultationFee || doctor.fee || 500,
        patientName: user.full_name || user.name,
      });
      logger.info(`Confirmation email sent to ${user.email}`);
    } catch (emailError) {
      logger.error(`Failed to send confirmation email: ${emailError.message}`);
      // Don't fail the appointment booking if email fails
    }

    res.status(201).json({
      success: true,
      message: "Appointment booked successfully",
      data: appointment,
    });
  } catch (error) {
    logger.error(`Error booking appointment: ${error.message}`);
    res.status(500).json({
      success: false,
      message: "Error booking appointment",
      error: error.message,
    });
  }
};

// Get user's appointments
exports.getUserAppointments = async (req, res) => {
  try {
    const userId = req.user.id; // From auth middleware

    logger.info(`Fetching appointments for user: ${userId}`);

    const appointments = await Appointment.findAll({
      where: { userId },
      include: [
        {
          model: Doctor,
          attributes: ["id", "name", "specialization", "location"],
        },
      ],
      order: [["appointmentDate", "DESC"]],
    });

    res.json({
      success: true,
      data: appointments,
    });
  } catch (error) {
    logger.error(`Error fetching user appointments: ${error.message}`);
    res.status(500).json({
      success: false,
      message: "Error fetching appointments",
      error: error.message,
    });
  }
};

// Get all appointments (admin only)
exports.getAllAppointments = async (req, res) => {
  try {
    logger.info("Admin: Fetching all appointments");

    const appointments = await Appointment.findAll({
      include: [
        {
          model: Doctor,
          attributes: ["id", "name", "specialization"],
        },
      ],
      order: [["appointmentDate", "DESC"]],
    });

    res.json({
      success: true,
      data: appointments,
    });
  } catch (error) {
    logger.error(`Error fetching all appointments: ${error.message}`);
    res.status(500).json({
      success: false,
      message: "Error fetching appointments",
      error: error.message,
    });
  }
};
