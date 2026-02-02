const express = require("express");
const router = express.Router();
const userController = require("../../controllers/userController");
const doctorController = require("../../controllers/doctorController");
const scheduleController = require("../../controllers/scheduleController");
const authMiddleware = require("../../middleware/authMiddleware");

// User routes
router.post("/register", userController.registerUser);
router.post("/login", userController.loginUser);
router.post("/logout", authMiddleware, userController.logout);
router.get("/profile", authMiddleware, userController.getProfile);
router.put("/profile", authMiddleware, userController.updateProfile);
router.post("/change-password", authMiddleware, userController.changePassword);
router.post("/request-password-reset", userController.requestPasswordReset);
router.post("/reset-password", userController.resetPassword);
router.post("/verify-recaptcha", userController.verifyRecaptcha);

// Doctor routes
router.get("/doctors", doctorController.getAllDoctors);
router.get("/doctors/:doctorId", doctorController.getDoctorById);
router.get("/doctors/:doctorId/schedule", doctorController.getDoctorSchedule);

// Appointment/Schedule routes
router.get("/schedule/:doctorId", scheduleController.getDoctorSchedule);
router.post("/schedule", authMiddleware, scheduleController.createSchedule);
router.put("/schedule/:doctorId", authMiddleware, scheduleController.updateSchedule);
router.delete("/schedule/:doctorId", authMiddleware, scheduleController.deleteSchedule);
router.get("/available-slots", scheduleController.getAvailableSlots);
router.post("/appointments", authMiddleware, scheduleController.bookAppointment);
router.get("/appointments", authMiddleware, scheduleController.getUserAppointments);
router.get("/all-appointments", authMiddleware, scheduleController.getAllAppointments);

module.exports = router;
