import { useEffect, useCallback } from 'react';
import doctorNotificationService from '../utils/doctorNotificationService';

/**
 * Custom hook for synchronizing doctor data across components
 * Automatically listens for doctor updates and triggers refetch
 */
export const useDoctorSync = (fetchDoctorsCallback, dependencies = []) => {
  useEffect(() => {
    // Subscribe to doctor updates
    const unsubscribe = doctorNotificationService.subscribe((event) => {
      // Refetch doctors when any update occurs
      if (event.type === 'DOCTOR_CREATED' || 
          event.type === 'DOCTOR_UPDATED' || 
          event.type === 'DOCTOR_DELETED' ||
          event.type === 'DOCTOR_LIST_REFRESH') {
        fetchDoctorsCallback();
      }
    });

    // Cleanup on unmount
    return () => {
      unsubscribe();
    };
  }, [fetchDoctorsCallback]);
};

export default useDoctorSync;
