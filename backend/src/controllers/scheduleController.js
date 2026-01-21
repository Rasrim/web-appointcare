const { DoctorSchedule, Appointment, Doctor, User } = require('../models');
const { Op } = require('sequelize');

// Get doctor's schedule for a specific month
exports.getDoctorSchedule = async (req, res) => {
  try {
    const { doctorId } = req.params;
    const { month, year } = req.query;

    if (!month || !year) {
      return res.status(400).json({ message: 'Month and year are required' });
    }

    const schedules = await DoctorSchedule.findAll({
      where: {
        doctorId,
        [Op.and]: [
          DoctorSchedule.sequelize.where(DoctorSchedule.sequelize.fn('EXTRACT', DoctorSchedule.sequelize.literal('MONTH FROM "scheduleDate"')), Op.eq, month),
          DoctorSchedule.sequelize.where(DoctorSchedule.sequelize.fn('EXTRACT', DoctorSchedule.sequelize.literal('YEAR FROM "scheduleDate"')), Op.eq, year),
        ],
      },
      order: [['scheduleDate', 'ASC'], ['startTime', 'ASC']],
    });

    res.json(schedules);
  } catch (err) {
    console.error('Error fetching schedule:', err);
    res.status(500).json({ message: 'Error fetching schedule' });
  }
};

// Create new schedule entry
exports.createSchedule = async (req, res) => {
  try {
    const { doctorId, scheduleDate, startTime, endTime, clinic, isAvailable } = req.body;

    if (!doctorId || !scheduleDate || !startTime || !endTime) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    const schedule = await DoctorSchedule.create({
      doctorId,
      scheduleDate,
      startTime,
      endTime,
      clinic: clinic || 'Clinic 1',
      isAvailable: isAvailable !== false,
    });

    res.status(201).json({
      message: 'Schedule created successfully',
      schedule,
    });
  } catch (err) {
    console.error('Error creating schedule:', err);
    res.status(500).json({ message: 'Error creating schedule' });
  }
};

// Update schedule entry
exports.updateSchedule = async (req, res) => {
  try {
    const { scheduleId } = req.params;
    const { startTime, endTime, clinic, isAvailable } = req.body;

    const schedule = await DoctorSchedule.findByPk(scheduleId);
    if (!schedule) {
      return res.status(404).json({ message: 'Schedule not found' });
    }

    await schedule.update({
      startTime: startTime || schedule.startTime,
      endTime: endTime || schedule.endTime,
      clinic: clinic || schedule.clinic,
      isAvailable: isAvailable !== undefined ? isAvailable : schedule.isAvailable,
    });

    res.json({
      message: 'Schedule updated successfully',
      schedule,
    });
  } catch (err) {
    console.error('Error updating schedule:', err);
    res.status(500).json({ message: 'Error updating schedule' });
  }
};

// Delete schedule entry
exports.deleteSchedule = async (req, res) => {
  try {
    const { scheduleId } = req.params;

    const schedule = await DoctorSchedule.findByPk(scheduleId);
    if (!schedule) {
      return res.status(404).json({ message: 'Schedule not found' });
    }

    await schedule.destroy();
    res.json({ message: 'Schedule deleted successfully' });
  } catch (err) {
    console.error('Error deleting schedule:', err);
    res.status(500).json({ message: 'Error deleting schedule' });
  }
};

// Get available time slots for a doctor on a specific date
exports.getAvailableSlots = async (req, res) => {
  try {
    const { doctorId } = req.params;
    const { date } = req.query;

    if (!date) {
      return res.status(400).json({ message: 'Date is required' });
    }

    const slots = await DoctorSchedule.findAll({
      where: {
        doctorId,
        scheduleDate: date,
        isAvailable: true,
      },
      order: [['startTime', 'ASC']],
    });

    res.json(slots);
  } catch (err) {
    console.error('Error fetching available slots:', err);
    res.status(500).json({ message: 'Error fetching available slots' });
  }
};

// Book an appointment
exports.bookAppointment = async (req, res) => {
  try {
    const { userId, doctorId, scheduleId, appointmentDate, startTime, clinic } = req.body;

    if (!userId || !doctorId || !appointmentDate || !startTime) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    const appointment = await Appointment.create({
      userId,
      doctorId,
      scheduleId: scheduleId || null,
      appointmentDate,
      startTime,
      clinic: clinic || 'Clinic 1',
      status: 'booked',
    });

    res.status(201).json({
      message: 'Appointment booked successfully',
      appointment,
    });
  } catch (err) {
    console.error('Error booking appointment:', err);
    res.status(500).json({ message: 'Error booking appointment' });
  }
};

// Get user's appointments
exports.getUserAppointments = async (req, res) => {
  try {
    const { userId } = req.params;
    const { month, year } = req.query;

    let where = { userId };
    if (month && year) {
      where = {
        ...where,
        [Op.and]: [
          Appointment.sequelize.where(Appointment.sequelize.fn('EXTRACT', Appointment.sequelize.literal('MONTH FROM "appointmentDate"')), Op.eq, month),
          Appointment.sequelize.where(Appointment.sequelize.fn('EXTRACT', Appointment.sequelize.literal('YEAR FROM "appointmentDate"')), Op.eq, year),
        ],
      };
    }

    const appointments = await Appointment.findAll({
      where,
      include: [{ model: Doctor, attributes: ['id', 'name', 'specialty', 'fee'] }],
      order: [['appointmentDate', 'ASC'], ['startTime', 'ASC']],
    });

    res.json(appointments);
  } catch (err) {
    console.error('Error fetching user appointments:', err);
    res.status(500).json({ message: 'Error fetching appointments' });
  }
};
