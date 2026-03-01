import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { toast } from 'react-toastify';

const API_URL = 'http://localhost:3000';

const BookAppointmentDetails = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const doctor = location.state?.doctor;

  const [availableDates, setAvailableDates] = useState([]);
  const [selectedDate, setSelectedDate] = useState(null);
  const [availableSlots, setAvailableSlots] = useState([]);
  const [selectedTime, setSelectedTime] = useState(null);
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);
  const [loadingDates, setLoadingDates] = useState(true);
  const [loadingTimes, setLoadingTimes] = useState(false);
  const token = localStorage.getItem('token');

  // If no doctor selected, redirect back
  useEffect(() => {
    if (!doctor) {
      navigate('/book-appointments');
      return;
    }
    fetchAvailableDates();
  }, [doctor, token]);

  const fetchAvailableDates = async () => {
    if (!doctor) return;
    try {
      setLoadingDates(true);
      const response = await fetch(
        `${API_URL}/api/users/available-dates?doctorId=${doctor.id}`,
        { headers: { 'Authorization': `Bearer ${token}` } }
      );
      const data = await response.json();
      const dates = data.availableDates || data || [];
      setAvailableDates(Array.isArray(dates) ? dates : []);
    } catch (error) {
      console.error('Error fetching dates:', error);
      toast.error('Failed to load available dates');
    } finally {
      setLoadingDates(false);
    }
  };

  const handleSelectDate = async (date) => {
    setSelectedDate(date);
    setSelectedTime(null);

    try {
      setLoadingTimes(true);
      const response = await fetch(
        `${API_URL}/api/users/available-times?doctorId=${doctor.id}&date=${date}`,
        { headers: { 'Authorization': `Bearer ${token}` } }
      );
      const data = await response.json();
      const slots = data.availableSlots || data || [];
      setAvailableSlots(Array.isArray(slots) ? slots : []);
    } catch (error) {
      console.error('Error fetching times:', error);
      toast.error('Failed to load available times');
    } finally {
      setLoadingTimes(false);
    }
  };

  const handleBookAppointment = async () => {
    if (!selectedDate || !selectedTime) {
      toast.error('Please select date and time');
      return;
    }

    try {
      setLoading(true);
      const response = await fetch(`${API_URL}/api/users/appointments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          doctor_id: doctor.id,
          appointment_date: selectedDate,
          appointment_time: selectedTime,
          notes: notes,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to book appointment');
      }

      // Create notification
      const newNotification = {
        id: Date.now(),
        doctorName: doctor.full_name || doctor.name || "Doctor",
        date: `${selectedDate} at ${selectedTime}`,
        timestamp: new Date().toLocaleString(),
      };
      const existingNotifications = JSON.parse(localStorage.getItem("appointmentNotifications") || "[]");
      const updatedNotifications = [newNotification, ...existingNotifications];
      localStorage.setItem("appointmentNotifications", JSON.stringify(updatedNotifications));

      toast.success('Appointment booked successfully!');
      navigate('/dashboard');
    } catch (error) {
      console.error('Error booking appointment:', error);
      toast.error(error.message || 'Failed to book appointment');
    } finally {
      setLoading(false);
    }
  };

  if (!doctor) return null;

  const isFormComplete = selectedDate && selectedTime;

  return (
    <div style={styles.container}>
      <div style={styles.content}>
        {/* Header */}
        <div style={styles.header}>
          <button
            onClick={() => navigate('/book-appointments')}
            style={styles.backButton}
          >
            ← Back to Doctors
          </button>
          <h1 style={styles.title}>Book an Appointment</h1>
        </div>

        {/* Doctor Info */}
        <div style={styles.doctorCard}>
          {doctor.photo && (
            <img src={doctor.photo} alt={doctor.full_name} style={styles.doctorPhoto} />
          )}
          <div style={styles.doctorInfo}>
            <h2 style={styles.doctorName}>{doctor.full_name}</h2>
            <p style={styles.specialty}>{doctor.specialization || doctor.specialty}</p>
            {doctor.bio && <p style={styles.bio}>{doctor.bio}</p>}
            <p style={styles.fee}>Consultation Fee: <strong>Rs {doctor.fee}</strong></p>
          </div>
        </div>

        {/* Date Selection */}
        <div style={styles.section}>
          <h3 style={styles.sectionTitle}>Select Date</h3>
          {loadingDates ? (
            <div style={styles.noData}>Loading available dates...</div>
          ) : availableDates.length === 0 ? (
            <div style={styles.noData}>No available dates</div>
          ) : (
            <div style={styles.dateGrid}>
              {availableDates.map((date, index) => {
                const dateObj = new Date(date);
                return (
                  <div
                    key={index}
                    onClick={() => handleSelectDate(date)}
                    style={{
                      ...styles.dateCard,
                      ...(selectedDate === date ? styles.dateCardSelected : {}),
                    }}
                  >
                    <div style={styles.dayName}>
                      {dateObj.toLocaleDateString('en-US', { weekday: 'short' })}
                    </div>
                    <div style={styles.dayNum}>{dateObj.getDate()}</div>
                    <div style={styles.monthName}>
                      {dateObj.toLocaleDateString('en-US', { month: 'short' })}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Time Selection */}
        {selectedDate && (
          <div style={styles.section}>
            <h3 style={styles.sectionTitle}>Select Time</h3>
            {loadingTimes ? (
              <div style={styles.noData}>Loading available times...</div>
            ) : availableSlots.length === 0 ? (
              <div style={styles.noData}>No available time slots for this date</div>
            ) : (
              <div style={styles.timeSlotGrid}>
                {availableSlots.map((time, index) => (
                  <div
                    key={index}
                    onClick={() => setSelectedTime(time)}
                    style={{
                      ...styles.timeSlot,
                      ...(selectedTime === time ? styles.timeSlotSelected : {}),
                    }}
                  >
                    {time}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Notes */}
        {selectedDate && (
          <div style={styles.section}>
            <label style={styles.label}>Additional Notes (Optional)</label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Enter any medical history or specific concerns..."
              style={styles.textarea}
            />
          </div>
        )}

        {/* Summary & Buttons */}
        {selectedDate && (
          <div style={styles.section}>
            <div style={styles.summaryCard}>
              <h3 style={styles.summaryTitle}>Appointment Summary</h3>
              <div style={styles.summaryRow}>
                <span style={styles.label}>Doctor:</span>
                <span style={styles.value}>{doctor.full_name}</span>
              </div>
              <div style={styles.summaryRow}>
                <span style={styles.label}>Specialization:</span>
                <span style={styles.value}>{doctor.specialization || doctor.specialty}</span>
              </div>
              {selectedDate && (
                <div style={styles.summaryRow}>
                  <span style={styles.label}>Date:</span>
                  <span style={styles.value}>{new Date(selectedDate).toLocaleDateString()}</span>
                </div>
              )}
              {selectedTime && (
                <div style={styles.summaryRow}>
                  <span style={styles.label}>Time:</span>
                  <span style={styles.value}>{selectedTime}</span>
                </div>
              )}
              {doctor.fee && (
                <div style={styles.summaryRow}>
                  <span style={styles.label}>Fee:</span>
                  <span style={styles.value}>Rs {doctor.fee}</span>
                </div>
              )}
            </div>

            <div style={styles.buttonGroup}>
              <button
                onClick={() => navigate('/book-appointments')}
                style={{ ...styles.button, ...styles.cancelButton }}
              >
                Cancel
              </button>
              <button
                onClick={handleBookAppointment}
                style={{
                  ...styles.button,
                  ...styles.bookButton,
                  opacity: isFormComplete ? 1 : 0.6,
                  cursor: isFormComplete ? 'pointer' : 'not-allowed',
                }}
                disabled={!isFormComplete || loading}
              >
                {loading ? 'Booking...' : 'Confirm Booking'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

const styles = {
  container: {
    minHeight: '100vh',
    backgroundColor: '#f5f5f5',
    padding: '20px',
    paddingTop: '80px',
  },
  content: {
    maxWidth: '900px',
    margin: '0 auto',
  },
  header: {
    backgroundColor: 'white',
    borderRadius: '12px',
    padding: '30px',
    marginBottom: '30px',
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
  },
  backButton: {
    background: 'none',
    border: 'none',
    color: '#0066cc',
    fontSize: '0.95em',
    fontWeight: '600',
    cursor: 'pointer',
    marginBottom: '15px',
    padding: '0',
  },
  title: {
    fontSize: '2em',
    fontWeight: '700',
    color: '#333',
    margin: '0',
  },
  doctorCard: {
    display: 'flex',
    gap: '20px',
    backgroundColor: 'white',
    borderRadius: '12px',
    padding: '20px',
    marginBottom: '30px',
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
  },
  doctorPhoto: {
    width: '100px',
    height: '100px',
    borderRadius: '8px',
    objectFit: 'cover',
    flexShrink: 0,
  },
  doctorInfo: {
    flex: 1,
  },
  doctorName: {
    fontSize: '1.3em',
    fontWeight: '700',
    color: '#0066cc',
    margin: '0 0 8px 0',
  },
  specialty: {
    fontSize: '0.95em',
    color: '#666',
    margin: '0 0 8px 0',
    fontWeight: '500',
  },
  bio: {
    fontSize: '0.9em',
    color: '#999',
    margin: '0 0 12px 0',
    lineHeight: '1.5',
  },
  fee: {
    fontSize: '0.95em',
    color: '#333',
    margin: '0',
  },
  section: {
    backgroundColor: 'white',
    borderRadius: '12px',
    padding: '20px',
    marginBottom: '20px',
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
  },
  sectionTitle: {
    fontSize: '1em',
    fontWeight: '700',
    color: '#333',
    margin: '0 0 15px 0',
  },
  dateGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(90px, 1fr))',
    gap: '10px',
  },
  dateCard: {
    border: '2px solid #e0e0e0',
    padding: '12px',
    borderRadius: '6px',
    textAlign: 'center',
    cursor: 'pointer',
    transition: 'all 0.3s',
    backgroundColor: '#f9f9f9',
  },
  dateCardSelected: {
    borderColor: '#0066cc',
    backgroundColor: '#e8f4f8',
  },
  dayName: {
    fontSize: '0.8em',
    color: '#666',
    textTransform: 'uppercase',
    marginBottom: '4px',
  },
  dayNum: {
    fontSize: '1.4em',
    fontWeight: 'bold',
    color: '#0066cc',
    marginBottom: '2px',
  },
  monthName: {
    fontSize: '0.8em',
    color: '#666',
  },
  timeSlotGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(80px, 1fr))',
    gap: '10px',
  },
  timeSlot: {
    border: '2px solid #e0e0e0',
    padding: '10px',
    borderRadius: '6px',
    textAlign: 'center',
    cursor: 'pointer',
    transition: 'all 0.3s',
    backgroundColor: '#f9f9f9',
    fontSize: '0.9em',
    fontWeight: '600',
  },
  timeSlotSelected: {
    borderColor: '#0066cc',
    backgroundColor: '#0066cc',
    color: 'white',
  },
  label: {
    display: 'block',
    marginBottom: '10px',
    fontWeight: '600',
    color: '#333',
    fontSize: '0.95em',
  },
  textarea: {
    width: '100%',
    padding: '10px',
    border: '2px solid #e0e0e0',
    borderRadius: '6px',
    fontSize: '0.9em',
    fontFamily: 'inherit',
    minHeight: '80px',
    boxSizing: 'border-box',
    resize: 'vertical',
  },
  summaryCard: {
    backgroundColor: '#f0f8ff',
    border: '2px solid #0066cc',
    padding: '15px',
    borderRadius: '6px',
    marginBottom: '20px',
  },
  summaryTitle: {
    fontSize: '0.95em',
    fontWeight: '700',
    color: '#0066cc',
    margin: '0 0 12px 0',
  },
  summaryRow: {
    display: 'flex',
    justifyContent: 'space-between',
    padding: '8px 0',
    borderBottom: '1px solid #ddd',
    fontSize: '0.9em',
  },
  value: {
    color: '#0066cc',
    fontWeight: '500',
  },
  buttonGroup: {
    display: 'flex',
    gap: '12px',
    marginTop: '20px',
  },
  button: {
    padding: '12px 24px',
    border: 'none',
    borderRadius: '6px',
    fontSize: '0.95em',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.3s',
    flex: 1,
  },
  bookButton: {
    backgroundColor: '#28a745',
    color: 'white',
  },
  cancelButton: {
    backgroundColor: '#999',
    color: 'white',
  },
  noData: {
    textAlign: 'center',
    color: '#999',
    padding: '30px',
    fontSize: '0.95em',
  },
};

export default BookAppointmentDetails;
