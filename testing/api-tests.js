// Test Configuration and Helper Functions
// This file contains utilities for testing AppointCare

const API_BASE_URL = 'http://localhost:3000/api';
const FRONTEND_URL = 'http://localhost:5173';

/**
 * Test API Endpoints
 * Run these in browser console or with a testing tool
 */

// 1. AUTHENTICATION TESTS
const tests = {
  // Test User Registration
  testRegister: async () => {
    const response = await fetch(`${API_BASE_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: `test${Date.now()}@gmail.com`,
        password: 'TestPass123!',
        fullName: 'Test User'
      })
    });
    console.log('Register Test:', await response.json());
  },

  // Test User Login
  testLogin: async () => {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'admin1245@gmail.com',
        password: 'Admin@1245'
      })
    });
    console.log('Login Test:', await response.json());
  },

  // Test Get All Doctors
  testGetDoctors: async () => {
    const response = await fetch(`${API_BASE_URL}/doctors`);
    console.log('Get Doctors Test:', await response.json());
  },

  // Test Forgot Password
  testForgotPassword: async () => {
    const response = await fetch(`${API_BASE_URL}/auth/forgot-password`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'test@gmail.com'
      })
    });
    console.log('Forgot Password Test:', await response.json());
  },

  // Test Get User Appointments
  testGetAppointments: async (userId) => {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_BASE_URL}/appointments/user/${userId}`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    console.log('Get Appointments Test:', await response.json());
  },

  // Test Book Appointment
  testBookAppointment: async () => {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_BASE_URL}/appointments/book`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        userId: 1,
        doctorId: 1,
        scheduleId: 1,
        appointmentDate: '2026-01-20'
      })
    });
    console.log('Book Appointment Test:', await response.json());
  }
};

// Usage: In browser console
// tests.testRegister()
// tests.testLogin()
// tests.testGetDoctors()

module.exports = tests;
