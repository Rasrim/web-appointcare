import { useState, useEffect } from "react";
import { API_URL } from "../utils/api";
import { ChevronLeft, ChevronRight } from "lucide-react";

const DoctorTimesheet = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [doctors, setDoctors] = useState([]);
  const [schedule, setSchedule] = useState({});
  const [showModal, setShowModal] = useState(false);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [selectedDate, setSelectedDate] = useState(null);
  const [timeSlots, setTimeSlots] = useState({
    startTime: "10:00",
    endTime: "17:00",
    clinic: "Clinic 1",
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    fetchDoctors();
  }, []);

  const fetchDoctors = async () => {
    try {
      const response = await fetch(`${API_URL}/api/doctors`);
      if (response.ok) {
        const data = await response.json();
        setDoctors(data);
      }
    } catch (error) {
      console.error(error);
      setError("Failed to fetch doctors");
    }
  };

  const fetchSchedule = async (doctorId, month, year) => {
    try {
      const response = await fetch(
        `${API_URL}/api/schedule/doctor/${doctorId}?month=${month}&year=${year}`
      );
      if (response.ok) {
        const data = await response.json();
        setSchedule((prev) => ({
          ...prev,
          [`${doctorId}-${month}-${year}`]: data,
        }));
      }
    } catch (error) {
      console.error('Failed to fetch schedule:', error);
    }
  };

  const getDaysInMonth = (date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  const handlePrevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1));
  };

  const handleAddSchedule = async (doctorId, date) => {
    setSelectedDoctor(doctorId);
    setSelectedDate(date);
    setShowModal(true);
  };

  const handleSaveSchedule = async () => {
    if (!selectedDoctor || !selectedDate) return;

    setLoading(true);
    setError("");
    setMessage("");

    try {
      const scheduleDate = new Date(
        currentDate.getFullYear(),
        currentDate.getMonth(),
        selectedDate
      );

      const response = await fetch(`${API_URL}/api/schedule`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          doctorId: selectedDoctor,
          scheduleDate: scheduleDate.toISOString().split("T")[0],
          startTime: timeSlots.startTime,
          endTime: timeSlots.endTime,
          clinic: timeSlots.clinic,
          isAvailable: true,
        }),
      });

      if (response.ok) {
        setMessage("Schedule added successfully!");
        setShowModal(false);
        // Refresh schedule
        fetchSchedule(
          selectedDoctor,
          currentDate.getMonth() + 1,
          currentDate.getFullYear()
        );
      } else {
        setError("Failed to save schedule");
      }
    } catch (err) {
      setError("Error: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  const monthName = currentDate.toLocaleString("default", {
    month: "long",
    year: "numeric",
  });

  const daysInMonth = getDaysInMonth(currentDate);
  const firstDay = getFirstDayOfMonth(currentDate);
  const days = Array(firstDay).fill(null).concat(Array.from({ length: daysInMonth }, (_, i) => i + 1));

  const clinics = ["Online", "Clinic 1", "Clinic 2", "Clinic 3", "Clinic 4"];

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h2 style={styles.title}>Doctor Timesheet Schedule</h2>
        <p style={styles.subtitle}>Manage doctor availability and time slots</p>
      </div>

      {message && <div style={styles.successMessage}>{message}</div>}
      {error && <div style={styles.errorMessage}>{error}</div>}

      <div style={styles.content}>
        {/* Calendar Navigation */}
        <div style={styles.calendarHeader}>
          <button style={styles.navButton} onClick={handlePrevMonth}>
            <ChevronLeft size={20} />
          </button>
          <h3 style={styles.monthTitle}>{monthName}</h3>
          <button style={styles.navButton} onClick={handleNextMonth}>
            <ChevronRight size={20} />
          </button>
        </div>

        {/* Day Headers */}
        <div style={styles.dayHeaders}>
          {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
            <div key={day} style={styles.dayHeader}>
              {day}
            </div>
          ))}
        </div>

        {/* Doctors and Calendar Grid */}
        <div style={styles.doctorsContainer}>
          {doctors.map((doctor) => (
            <div key={doctor.id} style={styles.doctorSection}>
              <div style={styles.doctorLabel}>
                <strong>{doctor.name}</strong>
                <span style={styles.specialty}>{doctor.specialty}</span>
              </div>

              <div style={styles.calendarGrid}>
                {days.map((day, index) => (
                  <div
                    key={index}
                    style={{
                      ...styles.dateCell,
                      backgroundColor: !day ? "#f9f9f9" : "white",
                      cursor: day ? "pointer" : "default",
                    }}
                    onClick={() => day && handleAddSchedule(doctor.id, day)}
                  >
                    {day && (
                      <>
                        <div style={styles.dateNumber}>{day}</div>
                        <div style={styles.slots}>
                          {schedule[
                            `${doctor.id}-${currentDate.getMonth() + 1}-${currentDate.getFullYear()}`
                          ]?.some(
                            (s) =>
                              new Date(s.schedule_date).getDate() === day
                          ) ? (
                            <span style={styles.scheduledBadge}>📅 Scheduled</span>
                          ) : (
                            <span style={styles.emptySlot}>+</span>
                          )}
                        </div>
                      </>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Modal for adding schedule */}
      {showModal && (
        <div style={styles.modal}>
          <div style={styles.modalContent}>
            <div style={styles.modalHeader}>
              <h3>Add Schedule</h3>
              <button
                style={styles.closeBtn}
                onClick={() => setShowModal(false)}
              >
                ✕
              </button>
            </div>

            <div style={styles.formGroup}>
              <label style={styles.label}>Clinic</label>
              <select
                value={timeSlots.clinic}
                onChange={(e) =>
                  setTimeSlots({ ...timeSlots, clinic: e.target.value })
                }
                style={styles.select}
              >
                {clinics.map((clinic) => (
                  <option key={clinic} value={clinic}>
                    {clinic}
                  </option>
                ))}
              </select>
            </div>

            <div style={styles.timeRow}>
              <div style={styles.formGroup}>
                <label style={styles.label}>Start Time</label>
                <input
                  type="time"
                  value={timeSlots.startTime}
                  onChange={(e) =>
                    setTimeSlots({ ...timeSlots, startTime: e.target.value })
                  }
                  style={styles.input}
                />
              </div>
              <div style={styles.formGroup}>
                <label style={styles.label}>End Time</label>
                <input
                  type="time"
                  value={timeSlots.endTime}
                  onChange={(e) =>
                    setTimeSlots({ ...timeSlots, endTime: e.target.value })
                  }
                  style={styles.input}
                />
              </div>
            </div>

            <div style={styles.modalButtons}>
              <button
                style={styles.saveBtn}
                onClick={handleSaveSchedule}
                disabled={loading}
              >
                {loading ? "Saving..." : "Save Schedule"}
              </button>
              <button
                style={styles.cancelBtn}
                onClick={() => setShowModal(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const styles = {
  container: {
    padding: "30px",
    background: "#f9f9f9",
    minHeight: "100vh",
  },
  header: {
    marginBottom: "30px",
  },
  title: {
    fontSize: "1.8rem",
    fontWeight: "700",
    color: "#1a1a1a",
    margin: "0 0 10px 0",
  },
  subtitle: {
    fontSize: "0.95rem",
    color: "#666",
    margin: 0,
  },
  content: {
    background: "#fff",
    borderRadius: "12px",
    padding: "20px",
    boxShadow: "0 2px 12px rgba(0,0,0,0.05)",
  },
  calendarHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "20px",
  },
  navButton: {
    background: "#3B82F6",
    color: "white",
    border: "none",
    borderRadius: "6px",
    padding: "8px 12px",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  monthTitle: {
    fontSize: "1.3rem",
    fontWeight: "600",
    color: "#1a1a1a",
    margin: 0,
  },
  dayHeaders: {
    display: "grid",
    gridTemplateColumns: "repeat(7, 1fr)",
    gap: "8px",
    marginBottom: "15px",
    paddingBottom: "15px",
    borderBottom: "2px solid #eee",
  },
  dayHeader: {
    textAlign: "center",
    fontWeight: "600",
    color: "#666",
    fontSize: "0.9rem",
    padding: "8px",
  },
  doctorsContainer: {
    display: "flex",
    flexDirection: "column",
    gap: "25px",
  },
  doctorSection: {
    border: "1px solid #ddd",
    borderRadius: "8px",
    padding: "15px",
    background: "#fafafa",
  },
  doctorLabel: {
    marginBottom: "15px",
    paddingBottom: "10px",
    borderBottom: "2px solid #3B82F6",
  },
  specialty: {
    fontSize: "0.85rem",
    color: "#999",
    marginLeft: "10px",
    fontWeight: "normal",
  },
  calendarGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(7, 1fr)",
    gap: "8px",
  },
  dateCell: {
    border: "1px solid #ddd",
    borderRadius: "6px",
    padding: "10px",
    minHeight: "80px",
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    transition: "all 0.3s ease",
  },
  dateNumber: {
    fontSize: "0.9rem",
    fontWeight: "600",
    color: "#333",
  },
  slots: {
    fontSize: "0.8rem",
    marginTop: "5px",
  },
  scheduledBadge: {
    background: "#3B82F6",
    color: "white",
    padding: "3px 6px",
    borderRadius: "4px",
    fontSize: "0.7rem",
    whiteSpace: "nowrap",
  },
  emptySlot: {
    color: "#999",
    fontSize: "1.2rem",
  },
  modal: {
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: "rgba(0, 0, 0, 0.5)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 1000,
  },
  modalContent: {
    background: "white",
    borderRadius: "12px",
    padding: "30px",
    maxWidth: "400px",
    width: "90%",
    boxShadow: "0 4px 20px rgba(0,0,0,0.15)",
  },
  modalHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "20px",
    paddingBottom: "15px",
    borderBottom: "1px solid #eee",
  },
  closeBtn: {
    background: "none",
    border: "none",
    fontSize: "1.5rem",
    cursor: "pointer",
    color: "#999",
  },
  formGroup: {
    marginBottom: "15px",
    display: "flex",
    flexDirection: "column",
  },
  label: {
    fontSize: "0.9rem",
    fontWeight: "600",
    marginBottom: "6px",
    color: "#333",
  },
  input: {
    padding: "10px",
    border: "1px solid #ddd",
    borderRadius: "6px",
    fontSize: "0.9rem",
  },
  select: {
    padding: "10px",
    border: "1px solid #ddd",
    borderRadius: "6px",
    fontSize: "0.9rem",
    backgroundColor: "white",
  },
  timeRow: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "10px",
  },
  modalButtons: {
    display: "flex",
    gap: "10px",
    marginTop: "20px",
  },
  saveBtn: {
    flex: 1,
    padding: "12px",
    background: "#3B82F6",
    color: "white",
    border: "none",
    borderRadius: "6px",
    fontWeight: "600",
    cursor: "pointer",
  },
  cancelBtn: {
    flex: 1,
    padding: "12px",
    background: "#f0f0f0",
    color: "#666",
    border: "1px solid #ddd",
    borderRadius: "6px",
    fontWeight: "600",
    cursor: "pointer",
  },
  successMessage: {
    background: "#d4edda",
    color: "#155724",
    padding: "12px 16px",
    borderRadius: "6px",
    marginBottom: "20px",
    border: "1px solid #c3e6cb",
  },
  errorMessage: {
    background: "#f8d7da",
    color: "#721c24",
    padding: "12px 16px",
    borderRadius: "6px",
    marginBottom: "20px",
    border: "1px solid #f5c6cb",
  },
};

export default DoctorTimesheet;
