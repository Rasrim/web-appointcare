import { useState, useEffect, useCallback } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { API_URL } from "../utils/api";

const BookingCalendar = () => {
  // Get Nepal Standard Time (NST = UTC+5:45)
  const getNepaliTime = () => {
    const now = new Date();
    // Convert to UTC first by removing the local timezone offset
    const utcDate = new Date(now.getTime() + now.getTimezoneOffset() * 60000);
    // Then add NST offset (5 hours 45 minutes = 5.75 hours)
    const nepaliTime = new Date(utcDate.getTime() + 5 * 60 * 60 * 1000 + 45 * 60 * 1000);
    return nepaliTime;
  };

  const [currentDate, setCurrentDate] = useState(() => getNepaliTime());
  const [doctors, setDoctors] = useState([]);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [appointments, setAppointments] = useState([]);
  const [availableSlots, setAvailableSlots] = useState([]);
  const [selectedDate, setSelectedDate] = useState(null);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const userId = localStorage.getItem("userId") || "1"; // Get from auth

  const fetchAppointments = useCallback(async () => {
    try {
      const month = currentDate.getMonth() + 1;
      const year = currentDate.getFullYear();
      const response = await fetch(
        `${API_URL}/api/appointments/user/${userId}?month=${month}&year=${year}`
      );
      if (response.ok) {
        const data = await response.json();
        setAppointments(data);
      }
    } catch (_error) {
      console.error("Failed to fetch appointments:", _error);
    }
  }, [currentDate, userId]);

  useEffect(() => {
    // Auto-select today's date and set current month to today
    const today = getNepaliTime();
    setCurrentDate(today);
    setSelectedDate(today.toISOString().split("T")[0]);
    fetchDoctors();
    fetchAppointments();
  }, [fetchAppointments]);

  useEffect(() => {
    if (selectedDoctor && selectedDate) {
      fetchAvailableSlots(selectedDoctor, selectedDate);
    }
  }, [selectedDoctor, selectedDate]);

  const fetchDoctors = async () => {
    try {
      const response = await fetch(`${API_URL}/api/doctors`);
      if (response.ok) {
        const data = await response.json();
        setDoctors(data);
        if (data.length > 0) {
          setSelectedDoctor(data[0].id);
        }
      }
    } catch (error) {
      console.error(error);
      setError("Failed to fetch doctors");
    }
  };

  const fetchAvailableSlots = async (doctorId, date) => {
    try {
      const response = await fetch(
        `${API_URL}/api/available-slots/${doctorId}?date=${date}`
      );
      if (response.ok) {
        const data = await response.json();
        setAvailableSlots(data);
      }
    } catch (slotError) {
      console.error('Failed to fetch slots:', slotError);
    }
  };

  const handlePrevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1));
  };

  const handleDateClick = (day) => {
    const date = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth(),
      day
    );
    setSelectedDate(date.toISOString().split("T")[0]);
    setShowBookingModal(true);
  };

  const handleBookAppointment = async () => {
    if (!selectedSlot || !selectedDate) return;

    setLoading(true);
    setError("");
    setMessage("");

    try {
      const response = await fetch(`${API_URL}/api/appointments/book`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: parseInt(userId),
          doctorId: selectedDoctor,
          scheduleId: selectedSlot.id,
          appointmentDate: selectedDate,
          startTime: selectedSlot.start_time,
          clinic: selectedSlot.clinic,
        }),
      });

      if (response.ok) {
        setMessage("Appointment booked successfully!");
        setShowBookingModal(false);
        setSelectedSlot(null);
        fetchAppointments();
      } else {
        setError("Failed to book appointment");
      }
    } catch (err) {
      setError("Error: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  const getDaysInMonth = (date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  const monthName = currentDate.toLocaleString("default", {
    month: "long",
    year: "numeric",
  });

  const daysInMonth = getDaysInMonth(currentDate);
  const firstDay = getFirstDayOfMonth(currentDate);
  const days = Array(firstDay)
    .fill(null)
    .concat(Array.from({ length: daysInMonth }, (_, i) => i + 1));

  const getAppointmentsForDate = (day) => {
    const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
    const dateStr = date.toISOString().split("T")[0];
    return appointments.filter((apt) => apt.appointment_date === dateStr);
  };

  const selectedDoctorData = doctors.find((d) => d.id === selectedDoctor);

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h2 style={styles.title}>Book an Appointment</h2>
        <p style={styles.subtitle}>Select a doctor and available time slot</p>
      </div>

      {message && <div style={styles.successMessage}>{message}</div>}
      {error && <div style={styles.errorMessage}>{error}</div>}

      <div style={styles.mainContent}>
        {/* Doctor Selection */}
        <div style={styles.doctorSelectionSection}>
          <h3 style={styles.sectionTitle}>Select a Doctor</h3>
          <div style={styles.doctorGrid}>
            {doctors.map((doctor) => (
              <div
                key={doctor.id}
                style={{
                  ...styles.doctorCard,
                  borderColor:
                    selectedDoctor === doctor.id ? "#3B82F6" : "#ddd",
                  backgroundColor:
                    selectedDoctor === doctor.id ? "#f0f8ff" : "white",
                }}
                onClick={() => setSelectedDoctor(doctor.id)}
              >
                <h4 style={styles.doctorName}>{doctor.name}</h4>
                <p style={styles.specialty}>{doctor.specialty}</p>
                <p style={styles.experience}>{doctor.experience} years exp.</p>
                <p style={styles.fee}>₹{doctor.fee}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Calendar Section */}
        <div style={styles.calendarSection}>
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

          {/* Calendar Grid */}
          <div style={styles.calendarGrid}>
            {days.map((day, index) => {
              const appts = day ? getAppointmentsForDate(day) : [];
              const nepaliNow = getNepaliTime();
              const isToday =
                day &&
                day === nepaliNow.getDate() &&
                currentDate.getMonth() === nepaliNow.getMonth() &&
                currentDate.getFullYear() === nepaliNow.getFullYear();

              return (
                <div
                  key={index}
                  style={{
                    ...styles.dateCell,
                    backgroundColor: !day
                      ? "#f9f9f9"
                      : isToday
                        ? "#fff3cd"
                        : "white",
                    cursor: day ? "pointer" : "default",
                    borderColor:
                      appts.length > 0 ? "#3B82F6" : "#ddd",
                  }}
                  onClick={() => day && handleDateClick(day)}
                >
                  {day && (
                    <>
                      <div style={styles.dateNumber}>{day}</div>
                      {appts.length > 0 ? (
                        <div style={styles.appointmentBadges}>
                          {appts.map((apt, i) => (
                            <div key={i} style={styles.appointmentBadge}>
                              <span style={styles.badgeText}>
                                {apt.start_time}
                              </span>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div style={styles.availableIndicator}>Available</div>
                      )}
                    </>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Upcoming Appointments */}
        <div style={styles.upcomingSection}>
          <h3 style={styles.sectionTitle}>Upcoming Appointments</h3>
          {appointments.length > 0 ? (
            <div style={styles.appointmentsList}>
              {appointments.map((apt) => (
                <div key={apt.id} style={styles.appointmentItem}>
                  <div style={styles.appointmentInfo}>
                    <h4 style={styles.appointmentTitle}>{apt.name}</h4>
                    <p style={styles.appointmentDetails}>
                      📅 {apt.appointment_date} | ⏰ {apt.start_time}
                    </p>
                    <p style={styles.appointmentDetails}>
                      🏥 {apt.clinic} | Specialty: {apt.specialty}
                    </p>
                  </div>
                  <div style={styles.appointmentFee}>₹{apt.fee}</div>
                </div>
              ))}
            </div>
          ) : (
            <p style={styles.noAppointments}>
              No appointments booked yet. Select a date to book one!
            </p>
          )}
        </div>
      </div>

      {/* Booking Modal */}
      {showBookingModal && (
        <div style={styles.modal}>
          <div style={styles.modalContent}>
            <div style={styles.modalHeader}>
              <h3>Available Time Slots</h3>
              <button
                style={styles.closeBtn}
                onClick={() => setShowBookingModal(false)}
              >
                ✕
              </button>
            </div>

            {selectedDoctorData && (
              <div style={styles.doctorInfo}>
                <h4>{selectedDoctorData.name}</h4>
                <p>{selectedDoctorData.specialty}</p>
                <p style={styles.fee}>Fee: ₹{selectedDoctorData.fee}</p>
              </div>
            )}

            <div style={styles.slotsContainer}>
              {availableSlots.length > 0 ? (
                availableSlots.map((slot) => (
                  <button
                    key={slot.id}
                    style={{
                      ...styles.slotButton,
                      backgroundColor:
                        selectedSlot?.id === slot.id
                          ? "#3B82F6"
                          : "white",
                      color:
                        selectedSlot?.id === slot.id ? "white" : "#333",
                      borderColor:
                        selectedSlot?.id === slot.id ? "#3B82F6" : "#ddd",
                    }}
                    onClick={() => setSelectedSlot(slot)}
                  >
                    <div>{slot.start_time} - {slot.end_time}</div>
                    <div style={styles.slotClinic}>{slot.clinic}</div>
                  </button>
                ))
              ) : (
                <p style={styles.noSlots}>
                  No available slots for this date. Please select another date.
                </p>
              )}
            </div>

            <div style={styles.modalButtons}>
              <button
                style={{
                  ...styles.bookBtn,
                  opacity: !selectedSlot ? 0.5 : 1,
                }}
                onClick={handleBookAppointment}
                disabled={!selectedSlot || loading}
              >
                {loading ? "Booking..." : "Book Appointment"}
              </button>
              <button
                style={styles.cancelBtn}
                onClick={() => setShowBookingModal(false)}
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
  mainContent: {
    display: "grid",
    gridTemplateColumns: "1fr 1.5fr",
    gap: "30px",
    alignItems: "start",
  },
  doctorSelectionSection: {
    background: "#fff",
    borderRadius: "12px",
    padding: "20px",
    boxShadow: "0 2px 12px rgba(0,0,0,0.05)",
  },
  sectionTitle: {
    fontSize: "1.1rem",
    fontWeight: "600",
    marginBottom: "15px",
    color: "#1a1a1a",
  },
  doctorGrid: {
    display: "flex",
    flexDirection: "column",
    gap: "12px",
  },
  doctorCard: {
    border: "2px solid #ddd",
    borderRadius: "8px",
    padding: "15px",
    cursor: "pointer",
    transition: "all 0.3s ease",
  },
  doctorName: {
    fontSize: "1rem",
    fontWeight: "600",
    margin: "0 0 5px 0",
    color: "#1a1a1a",
  },
  specialty: {
    fontSize: "0.85rem",
    color: "#3B82F6",
    margin: "0 0 5px 0",
    fontWeight: "500",
  },
  experience: {
    fontSize: "0.8rem",
    color: "#666",
    margin: "0 0 8px 0",
  },
  fee: {
    fontSize: "0.95rem",
    fontWeight: "600",
    color: "#1a1a1a",
    margin: 0,
  },
  calendarSection: {
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
    fontSize: "1.2rem",
    fontWeight: "600",
    color: "#1a1a1a",
    margin: 0,
  },
  dayHeaders: {
    display: "grid",
    gridTemplateColumns: "repeat(7, 1fr)",
    gap: "8px",
    marginBottom: "12px",
    paddingBottom: "12px",
    borderBottom: "2px solid #eee",
  },
  dayHeader: {
    textAlign: "center",
    fontWeight: "600",
    color: "#666",
    fontSize: "0.85rem",
  },
  calendarGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(7, 1fr)",
    gap: "8px",
  },
  dateCell: {
    border: "1px solid #ddd",
    borderRadius: "6px",
    padding: "10px 8px",
    minHeight: "90px",
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
  appointmentBadges: {
    display: "flex",
    flexDirection: "column",
    gap: "4px",
  },
  appointmentBadge: {
    background: "#3B82F6",
    color: "white",
    padding: "3px 6px",
    borderRadius: "3px",
    fontSize: "0.7rem",
    textAlign: "center",
  },
  badgeText: {
    fontSize: "0.7rem",
    fontWeight: "600",
  },
  availableIndicator: {
    fontSize: "0.7rem",
    color: "#3B82F6",
    fontWeight: "500",
  },
  upcomingSection: {
    gridColumn: "1 / -1",
    background: "#fff",
    borderRadius: "12px",
    padding: "20px",
    boxShadow: "0 2px 12px rgba(0,0,0,0.05)",
  },
  appointmentsList: {
    display: "flex",
    flexDirection: "column",
    gap: "12px",
  },
  appointmentItem: {
    border: "1px solid #ddd",
    borderRadius: "8px",
    padding: "15px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#f9f9f9",
  },
  appointmentInfo: {
    flex: 1,
  },
  appointmentTitle: {
    fontSize: "1rem",
    fontWeight: "600",
    margin: "0 0 8px 0",
    color: "#1a1a1a",
  },
  appointmentDetails: {
    fontSize: "0.85rem",
    color: "#666",
    margin: "0 0 5px 0",
  },
  appointmentFee: {
    fontSize: "1.1rem",
    fontWeight: "600",
    color: "#3B82F6",
  },
  noAppointments: {
    textAlign: "center",
    color: "#999",
    padding: "20px",
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
    padding: "clamp(20px, 4vw, 30px)",
    maxWidth: "500px",
    width: "90vw",
    maxHeight: "90vh",
    overflowY: "auto",
    boxShadow: "0 4px 20px rgba(0,0,0,0.15)",
    boxSizing: "border-box",
  },
  modalHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "20px",
    paddingBottom: "15px",
    borderBottom: "1px solid #eee",
    flexWrap: "wrap",
    gap: "10px",
  },
  closeBtn: {
    background: "none",
    border: "none",
    fontSize: "1.5rem",
    cursor: "pointer",
    color: "#999",
  },
  doctorInfo: {
    background: "#f9f9f9",
    padding: "15px",
    borderRadius: "6px",
    marginBottom: "20px",
  },
  slotsContainer: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(100px, 1fr))",
    gap: "clamp(8px, 2vw, 10px)",
    marginBottclamp(10px, 2vw, 12px)",
    cursor: "pointer",
    transition: "all 0.3s ease",
    fontSize: "clamp(0.8rem, 2vw, 0.9rem)d #ddd",
    borderRadius: "6px",
    padding: "12px",
    cursor: "pointer",
    transition: "all 0.3s ease",
    fontSize: "0.9rem",
    fontWeight: "500",
  },
  slotClinic: {
    fontSize: "0.75rem",
    marginTop: "4px",
    opacity: 0.7,
  },
  noSlots: {
    gridColumn: "1 / -1",
    textAlign: "center",
    color: "#999",
    padding: "20px",
  },
  modalButtons: {
    display: "flex",
    gap: "10px",
  },
  bookBtn: {
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

export default BookingCalendar;
