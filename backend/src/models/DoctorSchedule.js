const { DataTypes } = require('sequelize');
const sequelize = require('../../config/sequelize');
const Doctor = require('./Doctor');

const DoctorSchedule = sequelize.define(
  'DoctorSchedule',
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
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
    scheduleDate: {
      type: DataTypes.DATE,
      allowNull: false,
      field: 'schedule_date',
    },
    startTime: {
      type: DataTypes.TIME,
      allowNull: false,
      field: 'start_time',
    },
    endTime: {
      type: DataTypes.TIME,
      allowNull: false,
      field: 'end_time',
    },
    clinic: {
      type: DataTypes.STRING(100),
      defaultValue: 'Clinic 1',
    },
    isAvailable: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
      field: 'is_available',
    },
  },
  {
    tableName: 'doctor_schedule',
    timestamps: true,
    underscored: true,
    indexes: [
      {
        fields: ['doctor_id', 'schedule_date'],
      },
    ],
  }
);

DoctorSchedule.belongsTo(Doctor, { foreignKey: 'doctorId' });

module.exports = DoctorSchedule;
