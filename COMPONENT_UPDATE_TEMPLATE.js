/**
 * COMPONENT UPDATE TEMPLATE
 * Use this template to update any component with CRUD operations
 * to use the new apiService, token validation, and responsive design
 */

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

// ===== STEP 1: Import API Services =====
import { 
  userAPI,
  doctorAPI, 
  appointmentAPI, 
  scheduleAPI,
  contactAPI 
} from "../utils/apiService";

// ===== STEP 2: Import Responsive Hook =====
import { useResponsive } from "../utils/responsive";

// ===== STEP 3: Import Token Validator =====
import { initializeTokenValidator } from "../utils/tokenValidator";

const MyComponent = () => {
  const navigate = useNavigate();
  
  // ===== STEP 4: Get Responsive Values =====
  const { isMobile, isTablet, isDesktop, width } = useResponsive();

  // ===== STEP 5: State Management =====
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState(null);

  // ===== STEP 6: Initialize Token Validator =====
  useEffect(() => {
    // Validate token on mount
    initializeTokenValidator();

    // Listen for token invalid events
    const handleTokenInvalid = (event) => {
      toast.error(event.detail?.reason || 'Session invalid');
      navigate("/login");
    };

    window.addEventListener('tokenInvalid', handleTokenInvalid);
    return () => window.removeEventListener('tokenInvalid', handleTokenInvalid);
  }, [navigate]);

  // ===== STEP 7: Listen for Update Events =====
  useEffect(() => {
    const handleUpdate = () => {
      // Refresh data when other components make changes
      loadData();
    };

    window.addEventListener('profileUpdated', handleUpdate);
    window.addEventListener('appointmentBooked', handleUpdate);
    window.addEventListener('appointmentCancelled', handleUpdate);

    return () => {
      window.removeEventListener('profileUpdated', handleUpdate);
      window.removeEventListener('appointmentBooked', handleUpdate);
      window.removeEventListener('appointmentCancelled', handleUpdate);
    };
  }, []);

  // ===== STEP 8: Load Data from Database =====
  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Example: Get user appointments
      const response = await appointmentAPI.getUserAppointments(
        localStorage.getItem('userId')
      );
      
      setData(response || []);
    } catch (err) {
      console.error('Load error:', err);
      setError(err.message);
      toast.error('Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  // ===== STEP 9: Load on Mount =====
  useEffect(() => {
    loadData();
  }, []);

  // ===== STEP 10: CREATE - Add New Item =====
  const handleCreate = async (newData) => {
    try {
      setLoading(true);
      
      // Example: Book appointment
      const response = await appointmentAPI.bookAppointment(newData);
      
      // Data is automatically synced by apiService
      // Refresh local state
      await loadData();
      
      toast.success('Item created successfully!');
      setIsEditing(false);
    } catch (err) {
      console.error('Create error:', err);
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  // ===== STEP 11: READ - Get Single Item =====
  const handleRead = async (itemId) => {
    try {
      // Example: Get single doctor
      const response = await doctorAPI.getDoctorById(itemId);
      setEditData(response);
    } catch (err) {
      console.error('Read error:', err);
      toast.error(err.message);
    }
  };

  // ===== STEP 12: UPDATE - Modify Item =====
  const handleUpdate = async (itemId, updatedData) => {
    try {
      setLoading(true);

      // Example: Update profile
      const response = await userAPI.updateProfile(itemId, updatedData);
      
      // Data is automatically synced by apiService
      // Refresh local state
      await loadData();
      
      toast.success('Item updated successfully!');
      setIsEditing(false);
      setEditData(null);
    } catch (err) {
      console.error('Update error:', err);
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  // ===== STEP 13: DELETE - Remove Item =====
  const handleDelete = async (itemId) => {
    if (!window.confirm('Are you sure you want to delete this item?')) {
      return;
    }

    try {
      setLoading(true);

      // Example: Cancel appointment
      const response = await appointmentAPI.cancelAppointment(itemId);
      
      // Data is automatically synced by apiService
      // Refresh local state
      await loadData();
      
      toast.success('Item deleted successfully!');
    } catch (err) {
      console.error('Delete error:', err);
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  // ===== STEP 14: Responsive Styles =====
  const styles = {
    container: {
      padding: isMobile ? '16px' : '24px',
      maxWidth: isDesktop ? '1200px' : '100%',
      margin: '0 auto',
    },
    grid: {
      display: 'grid',
      gridTemplateColumns: isMobile ? '1fr' : isTablet ? '1fr 1fr' : 'repeat(3, 1fr)',
      gap: isMobile ? '12px' : '20px',
    },
    card: {
      padding: isMobile ? '12px' : '16px',
      borderRadius: '8px',
      background: '#fff',
      boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
      fontSize: isMobile ? '0.875rem' : '1rem',
    },
    button: {
      padding: isMobile ? '8px 12px' : '10px 16px',
      fontSize: isMobile ? '0.75rem' : '0.85rem',
      borderRadius: '4px',
      border: 'none',
      cursor: 'pointer',
      fontWeight: '600',
      transition: 'all 0.3s ease',
    },
    input: {
      width: '100%',
      padding: isMobile ? '8px 12px' : '10px 16px',
      fontSize: isMobile ? '0.875rem' : '1rem',
      borderRadius: '4px',
      border: '1px solid #ddd',
      boxSizing: 'border-box',
    },
  };

  // ===== STEP 15: Responsive Render =====
  if (loading && !data.length) {
    return <div style={styles.container}><p>Loading...</p></div>;
  }

  if (error) {
    return (
      <div style={styles.container}>
        <p style={{ color: 'red' }}>Error: {error}</p>
        <button onClick={loadData} style={{ ...styles.button, background: '#3B82F6', color: '#fff' }}>
          Retry
        </button>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <h1 style={{ fontSize: isMobile ? '1.5rem' : '2rem', marginBottom: '20px' }}>
        My Items
      </h1>

      {/* Create Button */}
      <button
        onClick={() => setIsEditing(true)}
        style={{
          ...styles.button,
          background: '#3B82F6',
          color: '#fff',
          marginBottom: '20px',
          width: isMobile ? '100%' : 'auto',
        }}
      >
        + Add New Item
      </button>

      {/* Edit Form (Modal) */}
      {isEditing && (
        <div style={{
          padding: isMobile ? '16px' : '24px',
          background: '#fff',
          borderRadius: '8px',
          marginBottom: '20px',
          border: '1px solid #ddd',
        }}>
          <h2 style={{ marginTop: 0 }}>
            {editData ? 'Edit Item' : 'Create New Item'}
          </h2>
          
          {/* Form fields would go here */}
          
          <div style={{ display: 'flex', gap: '10px', marginTop: '16px', flexWrap: isMobile ? 'wrap' : 'nowrap' }}>
            <button
              onClick={() => handleUpdate(editData?.id, editData)}
              style={{
                ...styles.button,
                background: '#10b981',
                color: '#fff',
                flex: isMobile ? '1' : 'auto',
              }}
              disabled={loading}
            >
              {loading ? 'Saving...' : 'Save'}
            </button>
            <button
              onClick={() => {
                setIsEditing(false);
                setEditData(null);
              }}
              style={{
                ...styles.button,
                background: '#e5e7eb',
                color: '#333',
                flex: isMobile ? '1' : 'auto',
              }}
              disabled={loading}
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Items List */}
      {data.length > 0 ? (
        <div style={styles.grid}>
          {data.map((item) => (
            <div key={item.id} style={styles.card}>
              <h3 style={{ marginTop: 0 }}>{item.title || item.name || 'Item'}</h3>
              
              {/* Item details would go here */}
              
              <div style={{
                display: 'flex',
                gap: '8px',
                marginTop: '12px',
                flexWrap: 'wrap',
              }}>
                <button
                  onClick={() => handleRead(item.id)}
                  style={{
                    ...styles.button,
                    background: '#3B82F6',
                    color: '#fff',
                    flex: isMobile ? '1' : 'auto',
                  }}
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(item.id)}
                  style={{
                    ...styles.button,
                    background: '#ef4444',
                    color: '#fff',
                    flex: isMobile ? '1' : 'auto',
                  }}
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div style={{
          padding: '40px',
          textAlign: 'center',
          background: '#f5f5f5',
          borderRadius: '8px',
          color: '#999',
        }}>
          <p>No items found</p>
          <button
            onClick={() => setIsEditing(true)}
            style={{
              ...styles.button,
              background: '#3B82F6',
              color: '#fff',
              marginTop: '16px',
            }}
          >
            Create First Item
          </button>
        </div>
      )}
    </div>
  );
};

export default MyComponent;

/**
 * KEY POINTS TO REMEMBER:
 * 
 * 1. ALWAYS import and call initializeTokenValidator() on mount
 * 2. ALWAYS use apiService methods instead of fetch()
 * 3. ALWAYS add error handling with try/catch
 * 4. ALWAYS show toast notifications for user feedback
 * 5. ALWAYS use responsive values for mobile/tablet/desktop layouts
 * 6. ALWAYS listen for custom events (profileUpdated, appointmentBooked, etc)
 * 7. NEVER hardcode pixel values - use responsive calculations
 * 8. NEVER make direct database queries - use API endpoints
 * 9. ALWAYS test on mobile devices or DevTools mobile emulation
 * 10. ALWAYS verify data persists after page refresh (from database)
 */
