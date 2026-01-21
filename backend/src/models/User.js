const { DataTypes } = require('sequelize');
const sequelize = require('../../config/sequelize');

const User = sequelize.define(
  'User',
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    fullName: {
      type: DataTypes.STRING,
      allowNull: false,
      field: 'full_name',
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    phoneNumber: {
      type: DataTypes.STRING,
      field: 'phone_number',
    },
    birthDate: {
      type: DataTypes.DATE,
      field: 'birth_date',
    },
    role: {
      type: DataTypes.STRING,
      defaultValue: 'user',
    },
    resetPasswordToken: {
      type: DataTypes.STRING,
      field: 'reset_password_token',
    },
    resetPasswordExpiry: {
      type: DataTypes.DATE,
      field: 'reset_password_expiry',
    },
    verificationCode: {
      type: DataTypes.STRING,
      field: 'verification_code',
    },
    verificationCodeExpiry: {
      type: DataTypes.DATE,
      field: 'verification_code_expiry',
    },
    isVerified: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      field: 'is_verified',
    },
    profilePicture: {
      type: DataTypes.TEXT,
      field: 'profile_picture',
    },
    specialization: {
      type: DataTypes.STRING,
    },
    licenseNumber: {
      type: DataTypes.STRING,
      field: 'license_number',
    },
    experience: {
      type: DataTypes.INTEGER,
    },
  },
  {
    tableName: 'users',
    timestamps: true,
    underscored: true,
  }
);

module.exports = User;
