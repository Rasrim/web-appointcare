const { DataTypes } = require('sequelize');
const sequelize = require('../../config/sequelize');
const User = require('./User');
const Doctor = require('./Doctor');
const DoctorSchedule = require('./DoctorSchedule');

const Appointment = sequelize.define(
  'Appointment',
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: User,
        key: 'id',
      },
      field: 'user_id',
      onDelete: 'CASCADE',
    },
    doctorId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: Doctor,
        key: 'id',
      },
      field: 'doctor_id',
      onDelete: 'CASCADE',
    },
    scheduleId: {
      type: DataTypes.INTEGER,
      references: {
        model: DoctorSchedule,
        key: 'id',
      },
      field: 'schedule_id',
      onDelete: 'SET NULL',
    },
    appointmentDate: {
      type: DataTypes.DATE,
      allowNull: false,
      field: 'appointment_date',
    },
    startTime: {
      type: DataTypes.TIME,
      allowNull: false,
      field: 'start_time',
    },
    clinic: {
      type: DataTypes.STRING(100),
      defaultValue: 'Clinic 1',
    },
    status: {
      type: DataTypes.STRING(50),
      defaultValue: 'booked',
      validate: {
        isIn: [['booked', 'completed', 'cancelled']],
      },
    },
    notes: {
      type: DataTypes.TEXT,
    },
  },
  {
    tableName: 'appointments',
    timestamps: true,
    underscored: true,
    indexes: [
      {
        fields: ['user_id', 'appointment_date'],
      },
      {
        fields: ['doctor_id', 'appointment_date'],
      },
    ],
  }
);

Appointment.belongsTo(User, { foreignKey: 'userId' });
Appointment.belongsTo(Doctor, { foreignKey: 'doctorId' });
Appointment.belongsTo(DoctorSchedule, { foreignKey: 'scheduleId' });

module.exports = Appointment;
