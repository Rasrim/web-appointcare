import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';

const API_URL = 'http://localhost:5000';

const ManageSchedule = () => {
  const [doctors, setDoctors] = useState([]);
  const [schedules, setSchedules] = useState([]);
  const [selectedDoctor, setSelectedDoctor] = useState('');
  const [scheduleDate, setScheduleDate] = useState('');
  const [startTime, setStartTime] = useState('09:00');
  const [endTime, setEndTime] = useState('17:00');
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(false);
  const token = localStorage.getItem('token');

  const fetchDoctors = async () => {
    try {
      const response = await fetch(`${API_URL}/api/users/doctors`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await response.json();
      if (data.success) {
        setDoctors(data.doctors || []);
      }
    } catch (error) {
      console.error('Error fetching doctors:', error);
      toast.error('Failed to load doctors');
    }
  };

  const fetchSchedules = async () => {
    try {
      const response = await fetch(`${API_URL}/api/users/schedules/admin/all`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await response.json();
      if (data.success) {
        setSchedules(data.schedules || []);
      }
    } catch (error) {
      console.error('Error fetching schedules:', error);
      toast.error('Failed to load schedules');
    }
  };

  useEffect(() => {
    fetchDoctors();
    fetchSchedules();
  }, [token]);

  const validateForm = () => {
    if (!selectedDoctor) {
      toast.error('Please select a doctor');
      return false;
    }
    if (!scheduleDate) {
      toast.error('Please select a date');
      return false;
    }
    if (!startTime || !endTime) {
      toast.error('Please select start and end times');
      return false;
    }

    // Check if date is in the past
    const selectedDate = new Date(scheduleDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    if (selectedDate < today) {
      toast.error('Cannot schedule for past dates');
      return false;
    }

    // Check if start time is before end time
    if (startTime >= endTime) {
      toast.error('Start time must be before end time');
      return false;
    }

    return true;
  };

  const handleAddSchedule = async () => {
    if (!validateForm()) return;

    setLoading(true);
    try {
      const endpoint = editingId
        ? `${API_URL}/api/users/schedules/${editingId}`
        : `${API_URL}/api/users/schedules`;

      const method = editingId ? 'PUT' : 'POST';

      const response = await fetch(endpoint, {
        method: method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          doctorId: selectedDoctor,
          scheduleDate: scheduleDate,
          startTime: startTime,
          endTime: endTime,
        })
      });

      const data = await response.json();

      if (data.success) {
        toast.success(editingId ? 'Schedule updated successfully' : 'Schedule added successfully');
        resetForm();
        fetchSchedules();
      } else {
        toast.error(data.message || 'Failed to save schedule');
      }
    } catch (error) {
      console.error('Error saving schedule:', error);
      toast.error('Error saving schedule');
    } finally {
      setLoading(false);
    }
  };

  const handleEditSchedule = (schedule) => {
    setSelectedDoctor(schedule.doctor_id);
    setScheduleDate(schedule.schedule_date);
    setStartTime(schedule.start_time);
    setEndTime(schedule.end_time);
    setEditingId(schedule.id);
  };

  const handleDeleteSchedule = async (id) => {
    if (window.confirm('Are you sure you want to delete this schedule?')) {
      try {
        const response = await fetch(`${API_URL}/api/users/schedules/${id}`, {
          method: 'DELETE',
          headers: { 'Authorization': `Bearer ${token}` }
        });

        const data = await response.json();

        if (data.success) {
          toast.success('Schedule deleted successfully');
          fetchSchedules();
        } else {
          toast.error(data.message || 'Failed to delete schedule');
        }
      } catch (error) {
        console.error('Error deleting schedule:', error);
        toast.error('Error deleting schedule');
      }
    }
  };

  const resetForm = () => {
    setSelectedDoctor('');
    setScheduleDate('');
    setStartTime('09:00');
    setEndTime('17:00');
    setEditingId(null);
  };

  const getDoctorName = (doctorId) => {
    const doctor = doctors.find(d => d.id === doctorId);
    return doctor ? doctor.full_name : 'Unknown Doctor';
  };

  // Get minimum date (today)
  const today = new Date().toISOString().split('T')[0];

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Manage Doctor Schedules</h1>

      <div style={styles.formSection}>
        <h2 style={styles.sectionTitle}>Add/Edit Schedule</h2>
        
        <div style={styles.formGroup}>
          <label style={styles.label}>Doctor:</label>
          <select
            value={selectedDoctor}
            onChange={(e) => setSelectedDoctor(e.target.value)}
            style={styles.select}
          >
            <option value="">Select a doctor</option>
            {doctors.map(doctor => (
              <option key={doctor.id} value={doctor.id}>
                {doctor.full_name}
              </option>
            ))}
          </select>
        </div>

        <div style={styles.formGroup}>
          <label style={styles.label}>Schedule Date:</label>
          <input
            type="date"
            value={scheduleDate}
            onChange={(e) => setScheduleDate(e.target.value)}
            min={today}
            style={styles.input}
          />
        </div>

        <div style={styles.timeGroup}>
          <div style={styles.formGroup}>
            <label style={styles.label}>Start Time:</label>
            <input
              type="time"
              value={startTime}
              onChange={(e) => setStartTime(e.target.value)}
              style={styles.input}
            />
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>End Time:</label>
            <input
              type="time"
              value={endTime}
              onChange={(e) => setEndTime(e.target.value)}
              style={styles.input}
            />
          </div>
        </div>

        <div style={styles.buttonGroup}>
          <button
            onClick={handleAddSchedule}
            disabled={loading}
            style={{...styles.button, ...styles.addButton}}
          >
            {loading ? 'Saving...' : (editingId ? 'Update Schedule' : 'Add Schedule')}
          </button>
          {editingId && (
            <button
              onClick={resetForm}
              style={{...styles.button, ...styles.cancelButton}}
            >
              Cancel
            </button>
          )}
        </div>
      </div>

      <div style={styles.scheduleList}>
        <h2 style={styles.sectionTitle}>All Schedules</h2>
        {schedules.length === 0 ? (
          <p style={styles.noData}>No schedules added yet</p>
        ) : (
          <div style={styles.table}>
            <div style={styles.tableRow}>
              <div style={{...styles.tableCell, ...styles.tableHeader, flex: 2}}>Doctor</div>
              <div style={{...styles.tableCell, ...styles.tableHeader, flex: 1.5}}>Date</div>
              <div style={{...styles.tableCell, ...styles.tableHeader, flex: 1.5}}>Start Time</div>
              <div style={{...styles.tableCell, ...styles.tableHeader, flex: 1.5}}>End Time</div>
              <div style={{...styles.tableCell, ...styles.tableHeader, flex: 1}}>Actions</div>
            </div>
            {schedules.map((schedule) => (
              <div key={schedule.id} style={styles.tableRow}>
                <div style={{...styles.tableCell, flex: 2}}>
                  {getDoctorName(schedule.doctor_id)}
                </div>
                <div style={{...styles.tableCell, flex: 1.5}}>
                  {new Date(schedule.schedule_date).toLocaleDateString('en-GB')}
                </div>
                <div style={{...styles.tableCell, flex: 1.5}}>
                  {schedule.start_time}
                </div>
                <div style={{...styles.tableCell, flex: 1.5}}>
                  {schedule.end_time}
                </div>
                <div style={{...styles.tableCell, flex: 1}}>
                  <button
                    onClick={() => handleEditSchedule(schedule)}
                    style={{...styles.actionButton, ...styles.editButton}}
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDeleteSchedule(schedule.id)}
                    style={{...styles.actionButton, ...styles.deleteButton}}
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

const styles = {
  container: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '30px 20px',
    fontFamily: '"Segoe UI", Tahoma, Geneva, Verdana, sans-serif',
  },
  title: {
    fontSize: '2em',
    color: '#0066cc',
    marginBottom: '30px',
    textAlign: 'center',
  },
  formSection: {
    backgroundColor: '#f5f5f5',
    padding: '25px',
    borderRadius: '8px',
    marginBottom: '40px',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
  },
  sectionTitle: {
    fontSize: '1.3em',
    color: '#333',
    marginBottom: '20px',
  },
  formGroup: {
    marginBottom: '18px',
  },
  label: {
    display: 'block',
    marginBottom: '8px',
    color: '#333',
    fontWeight: '600',
    fontSize: '0.95em',
  },
  input: {
    width: '100%',
    padding: '10px 12px',
    border: '1px solid #ddd',
    borderRadius: '4px',
    fontSize: '0.95em',
    boxSizing: 'border-box',
    transition: 'border-color 0.3s',
  },
  select: {
    width: '100%',
    padding: '10px 12px',
    border: '1px solid #ddd',
    borderRadius: '4px',
    fontSize: '0.95em',
    boxSizing: 'border-box',
    backgroundColor: '#fff',
  },
  timeGroup: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '20px',
  },
  buttonGroup: {
    display: 'flex',
    gap: '10px',
    marginTop: '25px',
  },
  button: {
    padding: '12px 24px',
    border: 'none',
    borderRadius: '4px',
    fontSize: '0.95em',
    cursor: 'pointer',
    fontWeight: '600',
    transition: 'opacity 0.3s',
  },
  addButton: {
    backgroundColor: '#0066cc',
    color: 'white',
    flex: 1,
  },
  cancelButton: {
    backgroundColor: '#999',
    color: 'white',
  },
  scheduleList: {
    backgroundColor: '#fff',
    padding: '25px',
    borderRadius: '8px',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
  },
  noData: {
    color: '#999',
    textAlign: 'center',
    padding: '20px',
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
  },
  tableRow: {
    display: 'flex',
    borderBottom: '1px solid #eee',
    alignItems: 'center',
    paddingTop: '12px',
    paddingBottom: '12px',
  },
  tableHeader: {
    fontWeight: '700',
    backgroundColor: '#f0f0f0',
    color: '#333',
    paddingTop: '15px',
    paddingBottom: '15px',
  },
  tableCell: {
    padding: '10px 12px',
    fontSize: '0.9em',
    color: '#555',
  },
  actionButton: {
    padding: '6px 12px',
    marginRight: '6px',
    border: 'none',
    borderRadius: '3px',
    cursor: 'pointer',
    fontSize: '0.85em',
    fontWeight: '600',
    transition: 'opacity 0.3s',
  },
  editButton: {
    backgroundColor: '#0066cc',
    color: 'white',
  },
  deleteButton: {
    backgroundColor: '#dc3545',
    color: 'white',
  },
};

export default ManageSchedule;
