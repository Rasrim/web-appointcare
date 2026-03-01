/**
 * Centralized API Service
 * Handles all API calls with proper error handling, token validation, and database sync
 */

import { validateBeforeAPICall, handleTokenInvalid } from './tokenValidator';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

/**
 * Helper function to make API calls with proper headers and error handling
 */
export const apiCall = async (endpoint, options = {}) => {
  // Validate token before making API call
  if (!validateBeforeAPICall()) {
    throw new Error('Invalid or expired session');
  }

  const url = `${API_URL}${endpoint}`;
  const token = localStorage.getItem('token');
  
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  try {
    const response = await fetch(url, {
      ...options,
      headers
    });

    // Handle token expiration or invalid token from server
    if (response.status === 401) {
      handleTokenInvalid('Session expired or unauthorized');
      throw new Error('Unauthorized - Please log in again');
    }

    if (response.status === 403) {
      handleTokenInvalid('Access denied');
      throw new Error('Access denied');
    }

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `HTTP ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error(`API Error [${options.method || 'GET'} ${endpoint}]:`, error);
    throw error;
  }
};

/**
 * User Profile APIs
 */
export const userAPI = {
  /**
   * Get user profile from database
   */
  getProfile: async (userId) => {
    return apiCall(`/api/users/${userId}/profile`, {
      method: 'GET'
    });
  },

  /**
   * Update user profile in database
   */
  updateProfile: async (userId, profileData) => {
    const response = await apiCall(`/api/users/${userId}/profile`, {
      method: 'PUT',
      body: JSON.stringify(profileData)
    });

    // Sync with localStorage after successful update
    if (response.message?.includes('successfully')) {
      localStorage.setItem('fullName', profileData.fullName || '');
      localStorage.setItem('userEmail', profileData.email || '');
      localStorage.setItem('userPhoneNumber', profileData.phoneNumber || '');
      localStorage.setItem('gender', profileData.gender || '');
      localStorage.setItem('location', profileData.location || '');
      localStorage.setItem('dateOfBirth', profileData.dateOfBirth || '');
      localStorage.setItem('bio', profileData.bio || '');
      
      // Dispatch custom event to notify other components
      window.dispatchEvent(new Event('profileUpdated'));
    }

    return response;
  },

  /**
   * Upload profile picture
   */
  uploadProfilePicture: async (file) => {
    const formData = new FormData();
    formData.append('file', file);

    const token = localStorage.getItem('token');
    const headers = {};

    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }

    const response = await fetch(`${API_URL}/api/upload/profile-picture`, {
      method: 'POST',
      headers,
      body: formData
    });

    if (!response.ok) {
      throw new Error('Failed to upload profile picture');
    }

    const data = await response.json();
    
    // Sync with localStorage
    if (data.imageUrl) {
      localStorage.setItem('profileImage', data.imageUrl);
      window.dispatchEvent(new Event('profileImageChanged'));
    }

    return data;
  },

  /**
   * Change password
   */
  changePassword: async (userId, passwordData) => {
    return apiCall(`/api/users/${userId}/change-password`, {
      method: 'PUT',
      body: JSON.stringify(passwordData)
    });
  }
};

/**
 * Doctor APIs
 */
export const doctorAPI = {
  /**
   * Get all doctors
   */
  getAllDoctors: async () => {
    return apiCall('/api/doctors', {
      method: 'GET'
    });
  },

  /**
   * Get single doctor by ID
   */
  getDoctorById: async (doctorId) => {
    return apiCall(`/api/doctors/${doctorId}`, {
      method: 'GET'
    });
  },

  /**
   * Create new doctor (Admin only)
   */
  createDoctor: async (doctorData) => {
    return apiCall('/api/doctors', {
      method: 'POST',
      body: JSON.stringify(doctorData)
    });
  },

  /**
   * Update doctor (Admin only)
   */
  updateDoctor: async (doctorId, doctorData) => {
    return apiCall(`/api/doctors/${doctorId}`, {
      method: 'PUT',
      body: JSON.stringify(doctorData)
    });
  },

  /**
   * Delete doctor (Admin only)
   */
  deleteDoctor: async (doctorId) => {
    return apiCall(`/api/doctors/${doctorId}`, {
      method: 'DELETE'
    });
  },

  /**
   * Upload doctor image
   */
  uploadDoctorImage: async (file) => {
    const formData = new FormData();
    formData.append('file', file);

    const token = localStorage.getItem('token');
    const headers = {};

    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }

    const response = await fetch(`${API_URL}/api/upload/doctor-image`, {
      method: 'POST',
      headers,
      body: formData
    });

    if (!response.ok) {
      throw new Error('Failed to upload doctor image');
    }

    return response.json();
  }
};

/**
 * Appointment APIs
 */
export const appointmentAPI = {
  /**
   * Get user's appointments
   */
  getUserAppointments: async (userId) => {
    return apiCall(`/api/users/${userId}/appointments`, {
      method: 'GET'
    });
  },

  /**
   * Book new appointment
   */
  bookAppointment: async (appointmentData) => {
    const response = await apiCall('/api/appointments/book', {
      method: 'POST',
      body: JSON.stringify(appointmentData)
    });

    // Dispatch event to notify components about new appointment
    if (response.id || response.message?.includes('successfully')) {
      window.dispatchEvent(new Event('appointmentBooked'));
    }

    return response;
  },

  /**
   * Cancel appointment
   */
  cancelAppointment: async (appointmentId) => {
    const response = await apiCall(`/api/appointments/${appointmentId}`, {
      method: 'DELETE'
    });

    // Dispatch event to notify components
    if (response.message?.includes('successfully')) {
      window.dispatchEvent(new Event('appointmentCancelled'));
    }

    return response;
  },

  /**
   * Update appointment (reschedule)
   */
  updateAppointment: async (appointmentId, appointmentData) => {
    const response = await apiCall(`/api/appointments/${appointmentId}`, {
      method: 'PUT',
      body: JSON.stringify(appointmentData)
    });

    // Dispatch event to notify components
    if (response.message?.includes('successfully')) {
      window.dispatchEvent(new Event('appointmentUpdated'));
    }

    return response;
  },

  /**
   * Get available dates for doctor
   */
  getAvailableDates: async (doctorId) => {
    return apiCall(`/api/doctors/${doctorId}/available-dates`, {
      method: 'GET'
    });
  },

  /**
   * Get available time slots for doctor on specific date
   */
  getAvailableSlots: async (doctorId, date) => {
    return apiCall(`/api/doctors/${doctorId}/available-slots?date=${date}`, {
      method: 'GET'
    });
  }
};

/**
 * Schedule APIs
 */
export const scheduleAPI = {
  /**
   * Get doctor schedule
   */
  getDoctorSchedule: async (doctorId) => {
    return apiCall(`/api/doctors/${doctorId}/schedule`, {
      method: 'GET'
    });
  },

  /**
   * Create schedule (Admin only)
   */
  createSchedule: async (scheduleData) => {
    return apiCall('/api/schedules', {
      method: 'POST',
      body: JSON.stringify(scheduleData)
    });
  },

  /**
   * Update schedule (Admin only)
   */
  updateSchedule: async (scheduleId, scheduleData) => {
    return apiCall(`/api/schedules/${scheduleId}`, {
      method: 'PUT',
      body: JSON.stringify(scheduleData)
    });
  },

  /**
   * Delete schedule (Admin only)
   */
  deleteSchedule: async (scheduleId) => {
    return apiCall(`/api/schedules/${scheduleId}`, {
      method: 'DELETE'
    });
  }
};

/**
 * Contact APIs
 */
export const contactAPI = {
  /**
   * Get contact information
   */
  getContactInfo: async () => {
    return apiCall('/api/contact-info', {
      method: 'GET'
    });
  },

  /**
   * Update contact information (Admin only)
   */
  updateContactInfo: async (contactData) => {
    return apiCall('/api/contact-info', {
      method: 'PUT',
      body: JSON.stringify(contactData)
    });
  }
};

/**
 * Helper function to sync data with backend
 * Call this after any create/update/delete operation
 */
export const syncWithBackend = async (type, operation, data) => {
  try {
    console.log(`Syncing ${type} ${operation}:`, data);
    
    // Data is already synced by the specific API calls above
    // This is a utility function for tracking sync operations
    return true;
  } catch (error) {
    console.error(`Sync error for ${type} ${operation}:`, error);
    return false;
  }
};

export default {
  apiCall,
  userAPI,
  doctorAPI,
  appointmentAPI,
  scheduleAPI,
  contactAPI,
  syncWithBackend
};
