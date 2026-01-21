const { DataTypes } = require('sequelize');
const sequelize = require('../../config/sequelize');

const Doctor = sequelize.define(
  'Doctor',
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    specialty: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    experience: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    fee: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    availability: {
      type: DataTypes.STRING,
    },
    timing: {
      type: DataTypes.STRING,
    },
    photo: {
      type: DataTypes.TEXT,
    },
  },
  {
    tableName: 'doctors',
    timestamps: true,
    underscored: true,
    indexes: [
      {
        fields: ['name'],
      },
      {
        fields: ['specialty'],
      },
    ],
  }
);

module.exports = Doctor;
