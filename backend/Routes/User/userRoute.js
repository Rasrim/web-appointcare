const express = require("express");
const router = express.Router();
const userController = require("../../controllers/userController");
const doctorController = require("../../controllers/doctorController");
const scheduleController = require("../../controllers/scheduleController");
const contactController = require("../../controllers/contactController");
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
router.post("/verify-security-questions", userController.verifySecurityQuestions);
router.post("/reset-password-with-token", userController.resetPasswordWithToken);
router.post("/verify-recaptcha", userController.verifyRecaptcha);

// Alternative routes for /users/:userId/profile (Frontend compatibility)
router.get("/:userId/profile", authMiddleware, userController.getProfile);
router.put("/:userId/profile", authMiddleware, userController.updateProfile);

// Doctor routes
router.get("/doctors", doctorController.getAllDoctors);
router.post("/doctors", doctorController.createDoctor);
router.get("/doctors/:doctorId", doctorController.getDoctorById);
router.put("/doctors/:doctorId", doctorController.updateDoctor);
router.delete("/doctors/:doctorId", doctorController.deleteDoctor);
router.get("/doctors/:doctorId/schedule", doctorController.getDoctorSchedule);

// Appointment/Schedule routes
router.get("/schedule/:doctorId", scheduleController.getDoctorSchedule);
router.post("/schedule", authMiddleware, scheduleController.createSchedule);
router.put("/schedule/:doctorId", authMiddleware, scheduleController.updateSchedule);
router.delete("/schedule/:doctorId", authMiddleware, scheduleController.deleteSchedule);
router.get("/available-slots", scheduleController.getAvailableSlots);
router.get("/available-dates", scheduleController.getAvailableDatesForBooking);
router.get("/available-times", scheduleController.getAvailableTimeSlotsForBooking);
router.post("/appointments", authMiddleware, scheduleController.bookAppointment);
router.get("/appointments", authMiddleware, scheduleController.getUserAppointments);
router.get("/all-appointments", authMiddleware, scheduleController.getAllAppointments);

// Admin routes for schedules
router.get("/schedules/admin/all", scheduleController.getAllSchedulesAdmin);
router.post("/schedules", scheduleController.createScheduleAdmin);
router.put("/schedules/:id", scheduleController.updateScheduleAdmin);
router.delete("/schedules/:id", scheduleController.deleteScheduleAdmin);

// Admin routes for contact info
router.get("/contact-info", contactController.getContactInfo);
router.post("/contact-info", contactController.updateContactInfo);

// Admin routes for appointments
router.get("/appointments/admin/all", scheduleController.getAllAppointments);
module.exports = router;