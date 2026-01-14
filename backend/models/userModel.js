const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  fullName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  phoneNumber: { type: String },
  birthDate: { type: Date },
  role: { type: String, default: 'user' },
  resetPasswordToken: { type: String },
  resetPasswordExpiry: { type: Date },
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);
