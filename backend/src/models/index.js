const sequelize = require('../../config/sequelize');
const User = require('./User');
const Doctor = require('./Doctor');
const DoctorSchedule = require('./DoctorSchedule');
const Appointment = require('./Appointment');

// Define associations
Doctor.hasMany(DoctorSchedule, { foreignKey: 'doctorId' });
DoctorSchedule.belongsTo(Doctor, { foreignKey: 'doctorId' });

User.hasMany(Appointment, { foreignKey: 'userId' });
Appointment.belongsTo(User, { foreignKey: 'userId' });

Doctor.hasMany(Appointment, { foreignKey: 'doctorId' });
Appointment.belongsTo(Doctor, { foreignKey: 'doctorId' });

DoctorSchedule.hasMany(Appointment, { foreignKey: 'scheduleId' });
Appointment.belongsTo(DoctorSchedule, { foreignKey: 'scheduleId' });

module.exports = {
  sequelize,
  User,
  Doctor,
  DoctorSchedule,
  Appointment,
};
