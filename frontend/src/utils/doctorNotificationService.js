/**
 * Doctor Notification Service
 * Handles real-time broadcasting of doctor data changes across all tabs/windows
 */

class DoctorNotificationService {
  constructor() {
    this.listeners = [];
    this.channel = null;
    this.initBroadcastChannel();
  }

  /**
   * Initialize Broadcast Channel API for cross-tab communication
   */
  initBroadcastChannel() {
    try {
      // Check if BroadcastChannel is supported
      if (typeof BroadcastChannel !== 'undefined') {
        this.channel = new BroadcastChannel('doctor_updates');
        this.channel.onmessage = (event) => {
          this.notifyListeners(event.data);
        };
      }
    } catch (e) {
      console.warn('BroadcastChannel not available, using localStorage fallback', e);
      // Will fallback to localStorage events
    }
  }

  /**
   * Subscribe to doctor update events
   * @param {Function} callback - Function to call when doctors are updated
   * @returns {Function} Unsubscribe function
   */
  subscribe(callback) {
    this.listeners.push(callback);

    // Also listen to storage events (for cross-tab via localStorage)
    const storageListener = (e) => {
      if (e.key === 'doctor_update_event' && e.newValue) {
        try {
          const data = JSON.parse(e.newValue);
          callback(data);
        } catch (err) {
          console.error('Error parsing doctor update event:', err);
        }
      }
    };

    window.addEventListener('storage', storageListener);

    // Return unsubscribe function
    return () => {
      this.listeners = this.listeners.filter(l => l !== callback);
      window.removeEventListener('storage', storageListener);
    };
  }

  /**
   * Notify all listeners of a doctor update
   * @param {Object} data - Update data
   */
  notifyListeners(data) {
    this.listeners.forEach(listener => {
      try {
        listener(data);
      } catch (err) {
        console.error('Error in doctor notification listener:', err);
      }
    });
  }

  /**
   * Broadcast doctor creation
   * @param {Object} doctor - Created doctor data
   */
  broadcastDoctorCreated(doctor) {
    const event = {
      type: 'DOCTOR_CREATED',
      doctor,
      timestamp: new Date().toISOString(),
    };
    this.broadcast(event);
  }

  /**
   * Broadcast doctor update
   * @param {Object} doctor - Updated doctor data
   */
  broadcastDoctorUpdated(doctor) {
    const event = {
      type: 'DOCTOR_UPDATED',
      doctor,
      timestamp: new Date().toISOString(),
    };
    this.broadcast(event);
  }

  /**
   * Broadcast doctor deletion
   * @param {number|string} doctorId - ID of deleted doctor
   */
  broadcastDoctorDeleted(doctorId) {
    const event = {
      type: 'DOCTOR_DELETED',
      doctorId,
      timestamp: new Date().toISOString(),
    };
    this.broadcast(event);
  }

  /**
   * Broadcast doctor list refresh (full sync)
   */
  broadcastDoctorListRefresh() {
    const event = {
      type: 'DOCTOR_LIST_REFRESH',
      timestamp: new Date().toISOString(),
    };
    this.broadcast(event);
  }

  /**
   * Internal broadcast method
   * @param {Object} event - Event to broadcast
   */
  broadcast(event) {
    // Notify listeners in same tab
    this.notifyListeners(event);

    // Broadcast to other tabs using BroadcastChannel
    if (this.channel) {
      try {
        this.channel.postMessage(event);
      } catch (err) {
        console.warn('Error broadcasting via BroadcastChannel:', err);
      }
    }

    // Fallback: also use localStorage (not ideal but works for all browsers)
    try {
      localStorage.setItem('doctor_update_event', JSON.stringify(event));
    } catch (err) {
      console.warn('Error broadcasting via localStorage:', err);
    }
  }

  /**
   * Clean up resources
   */
  destroy() {
    if (this.channel) {
      this.channel.close();
    }
    this.listeners = [];
  }
}

// Create singleton instance
export const doctorNotificationService = new DoctorNotificationService();

export default doctorNotificationService;
