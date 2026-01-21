const express = require('express');
const router = express.Router();
const { registerUser, loginUser, forgotPassword, resetPassword, getUserProfile, updateUserProfile, verifyEmail, resendVerificationCode } = require('../controllers/userController');
const { getAllDoctors, getDoctorById, createDoctor, updateDoctor, deleteDoctor } = require('../controllers/doctorController');
const { getDoctorSchedule, createSchedule, updateSchedule, deleteSchedule, getAvailableSlots, bookAppointment, getUserAppointments } = require('../controllers/scheduleController');

// User routes
router.post('/register', registerUser);
router.post('/verify-email', verifyEmail);
router.post('/resend-verification', resendVerificationCode);
router.post('/login', loginUser);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);
router.get('/users/:userId/profile', getUserProfile);
router.put('/users/:userId/profile', updateUserProfile);

// Doctor routes
router.get('/doctors', getAllDoctors);
router.get('/doctors/:id', getDoctorById);
router.post('/doctors', createDoctor);
router.put('/doctors/:id', updateDoctor);
router.delete('/doctors/:id', deleteDoctor);

// Schedule/Appointment routes
router.get('/schedule/doctor/:doctorId', getDoctorSchedule);
router.post('/schedule', createSchedule);
router.put('/schedule/:scheduleId', updateSchedule);
router.delete('/schedule/:scheduleId', deleteSchedule);
router.get('/available-slots/:doctorId', getAvailableSlots);
router.post('/appointments/book', bookAppointment);
router.get('/appointments/user/:userId', getUserAppointments);

module.exports = router;
