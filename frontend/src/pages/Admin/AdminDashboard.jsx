import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { API_URL } from "../../utils/api";
import doctorNotificationService from "../../utils/doctorNotificationService";

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [doctors, setDoctors] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [schedules, setSchedules] = useState([]);
  const [activeTab, setActiveTab] = useState("doctors");
  const [showForm, setShowForm] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [editingId, setEditingId] = useState(null);
  
  // Confirmation modal state
  const [confirmModal, setConfirmModal] = useState({
    show: false,
    title: "",
    message: "",
    onConfirm: null,
    onCancel: null,
  });
  
  // Form states
  const [doctorForm, setDoctorForm] = useState({
    name: "",
    specialty: "",
    experience: "",
    fee: "",
    bio: "",
  });

  const [scheduleForm, setScheduleForm] = useState({
    doctor_id: "",
    schedule_date: "",
    start_time: "",
    end_time: "",
    clinic: "Clinic 1",
  });

  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [showTimeForm, setShowTimeForm] = useState(false);
  const [editingScheduleId, setEditingScheduleId] = useState(null);

  const [contactForm, setContactForm] = useState({
    phone: "",
    email: "",
    address: "",
    city: "",
    opening_time: "",
    closing_time: "",
  });

  // Check admin and fetch data
  useEffect(() => {
    const checkAdmin = async () => {
      const adminEmail = localStorage.getItem("adminEmail");
      const isAdminUser = localStorage.getItem("isAdmin") === "true";
      
      if (adminEmail === "admin1245@gmail.com" && isAdminUser) {
        setIsAdmin(true);
        // Fetch all data
        await Promise.all([
          fetchDoctors(),
          fetchAppointments(),
          fetchSchedules(),
          fetchContactInfo(),
        ]);
        setLoading(false);
      } else {
        navigate("/login");
      }
    };
    
    checkAdmin();
  }, [navigate]);

  // API calls
  const fetchDoctors = async () => {
    try {
      const response = await fetch(`${API_URL}/api/doctors`);
      if (response.ok) {
        const data = await response.json();
        setDoctors(Array.isArray(data) ? data : []);
      } else {
        setDoctors([]);
        setError("Failed to fetch doctors");
      }
    } catch (err) {
      setDoctors([]);
      setError("Failed to fetch doctors: " + err.message);
    }
  };

  const fetchAppointments = async () => {
    try {
      const response = await fetch(`${API_URL}/api/appointments/admin/all`);
      if (response.ok) {
        const data = await response.json();
        setAppointments(Array.isArray(data) ? data : []);
      } else {
        setAppointments([]);
        setError("Failed to fetch appointments");
      }
    } catch (err) {
      setAppointments([]);
      setError("Failed to fetch appointments: " + err.message);
    }
  };

  const fetchSchedules = async () => {
    try {
      const response = await fetch(`${API_URL}/api/schedules/admin/all`);
      if (response.ok) {
        const data = await response.json();
        // Backend returns { success: true, data: [...] }
        const schedulesList = data.data || data;
        setSchedules(Array.isArray(schedulesList) ? schedulesList : []);
      } else {
        setSchedules([]);
        setError("Failed to fetch schedules");
      }
    } catch (err) {
      setSchedules([]);
      setError("Failed to fetch schedules: " + err.message);
    }
  };

  const fetchContactInfo = async () => {
    try {
      const response = await fetch(`${API_URL}/api/contact-info`);
      if (response.ok) {
        const data = await response.json();
        setContactForm(data || {
          phone: "",
          email: "",
          address: "",
          city: "",
          opening_time: "",
          closing_time: "",
        });
      } else {
        setContactForm({
          phone: "",
          email: "",
          address: "",
          city: "",
          opening_time: "",
          closing_time: "",
        });
      }
    } catch (err) {
      setContactForm({
        phone: "",
        email: "",
        address: "",
        city: "",
        opening_time: "",
        closing_time: "",
      });
      setError("Failed to fetch contact info: " + err.message);
    }
  };

  // Doctor functions
  const handleDoctorSubmit = async (e) => {
    e.preventDefault();
    try {
      const url = editingId ? `${API_URL}/api/doctors/${editingId}` : `${API_URL}/api/doctors`;
      const method = editingId ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(doctorForm),
      });

      if (response.ok) {
        const data = await response.json();
        setMessage(editingId ? "Doctor updated successfully!" : "Doctor added successfully!");
        setDoctorForm({ name: "", specialty: "", experience: "", fee: "", bio: "" });
        setEditingId(null);
        setShowForm(false);
        fetchDoctors();
        
        // Broadcast the change to other tabs/components
        if (editingId) {
          doctorNotificationService.broadcastDoctorUpdated(data.doctor || doctorForm);
        } else {
          doctorNotificationService.broadcastDoctorCreated(data.doctor || doctorForm);
        }
        
        setTimeout(() => setMessage(""), 3000);
      } else {
        setError("Failed to save doctor");
      }
    } catch (err) {
      setError("Error saving doctor: " + err.message);
    }
  };

  const handleDoctorEdit = (doctor) => {
    setDoctorForm(doctor);
    setEditingId(doctor.id);
    setShowForm(true);
  };

  const handleDoctorDelete = async (id) => {
    setConfirmModal({
      show: true,
      title: "Delete Doctor",
      message: "Are you sure you want to delete this doctor?",
      onConfirm: async () => {
        try {
          const response = await fetch(`${API_URL}/api/doctors/${id}`, {
            method: "DELETE",
          });
          if (response.ok) {
            setMessage("Doctor deleted successfully!");
            fetchDoctors();
            
            // Broadcast the deletion to other tabs/components
            doctorNotificationService.broadcastDoctorDeleted(id);
            
            setTimeout(() => setMessage(""), 3000);
          }
        } catch (err) {
          setError("Failed to delete doctor");
        }
        setConfirmModal({ ...confirmModal, show: false });
      },
      onCancel: () => {
        setConfirmModal({ ...confirmModal, show: false });
      },
    });
  };

  // Schedule functions
  const handleScheduleEdit = (schedule) => {
    setScheduleForm({
      doctor_id: schedule.doctor_id,
      schedule_date: schedule.schedule_date,
      start_time: schedule.start_time,
      end_time: schedule.end_time,
      clinic: schedule.clinic,
    });
    setEditingScheduleId(schedule.id);
    setShowTimeForm(true);
  };

  const handleScheduleSubmit = async (e) => {
    e.preventDefault();
    if (!scheduleForm.doctor_id || !scheduleForm.schedule_date || !scheduleForm.start_time || !scheduleForm.end_time) {
      setError("Please fill all schedule fields");
      return;
    }

    try {
      const url = editingScheduleId 
        ? `${API_URL}/api/schedules/${editingScheduleId}`
        : `${API_URL}/api/schedules`;
      const method = editingScheduleId ? "PUT" : "POST";

      console.log("📝 Sending schedule data:", scheduleForm);

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(scheduleForm),
      });

      console.log("📊 Response status:", response.status);

      const data = await response.json();
      console.log("📋 Response data:", data);

      if (response.ok) {
        setMessage(editingScheduleId ? "Schedule updated successfully!" : "Schedule added successfully!");
        setScheduleForm({ doctor_id: "", schedule_date: "", start_time: "", end_time: "", clinic: "Clinic 1" });
        setEditingScheduleId(null);
        setShowTimeForm(false);
        await fetchSchedules();
        setTimeout(() => setMessage(""), 3000);
      } else {
        setError(data.message || data.error || `Failed to save schedule (Status: ${response.status})`);
      }
    } catch (err) {
      console.error("❌ Error saving schedule:", err);
      setError("Error saving schedule: " + err.message);
    }
  };

  const handleScheduleDelete = async (id) => {
    setConfirmModal({
      show: true,
      title: "Delete Schedule",
      message: "Are you sure you want to delete this schedule?",
      onConfirm: async () => {
        try {
          const response = await fetch(`${API_URL}/api/schedules/${id}`, {
            method: "DELETE",
          });
          if (response.ok) {
            setMessage("Schedule deleted!");
            fetchSchedules();
            setTimeout(() => setMessage(""), 3000);
          }
        } catch (err) {
          setError("Failed to delete schedule");
        }
        setConfirmModal({ ...confirmModal, show: false });
      },
      onCancel: () => {
        setConfirmModal({ ...confirmModal, show: false });
      },
    });
  };

  // Contact functions
  const handleContactSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${API_URL}/api/contact-info`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(contactForm),
      });

      if (response.ok) {
        setMessage("Contact information updated successfully!");
        setTimeout(() => setMessage(""), 3000);
      } else {
        setError("Failed to update contact info");
      }
    } catch (err) {
      setError("Error: " + err.message);
    }
  };

  // Helper function to check if appointment is completed
  const isAppointmentCompleted = (appointment) => {
    const appointmentTime = new Date(`${appointment.appointment_date}T${appointment.start_time}`);
    return new Date() > appointmentTime;
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  if (loading) return <div style={styles.loadingContainer}>Loading...</div>;
  if (!isAdmin) return null;

  return (
    <div style={styles.container}>
      {/* Confirmation Modal */}
      {confirmModal.show && (
        <div style={styles.modalOverlay}>
          <div style={styles.modalContent}>
            <h3 style={{ margin: "0 0 15px 0", color: "#1a1a1a" }}>{confirmModal.title}</h3>
            <p style={{ margin: "0 0 20px 0", color: "#666" }}>{confirmModal.message}</p>
            <div style={{ display: "flex", gap: "10px", justifyContent: "flex-end" }}>
              <button
                onClick={confirmModal.onCancel}
                style={{
                  padding: "8px 16px",
                  background: "#e5e7eb",
                  color: "#333",
                  border: "none",
                  borderRadius: "6px",
                  fontWeight: "600",
                  cursor: "pointer",
                }}
              >
                Cancel
              </button>
              <button
                onClick={confirmModal.onConfirm}
                style={{
                  padding: "8px 16px",
                  background: "#ef4444",
                  color: "#fff",
                  border: "none",
                  borderRadius: "6px",
                  fontWeight: "600",
                  cursor: "pointer",
                }}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <header style={styles.header}>
        <h1 style={styles.title}>Admin Dashboard</h1>
        <div style={{ display: "flex", gap: "15px", alignItems: "center" }}>
          <button onClick={handleLogout} style={styles.logoutBtn}>Logout</button>
          <Link to="/" style={styles.homeLink}>Back to Home</Link>
        </div>
      </header>

      {/* Error and Success Messages */}
      {error && (
        <div style={{
          ...styles.message,
          backgroundColor: "#f8d7da",
          color: "#721c24",
          borderColor: "#f5c6cb",
          marginBottom: "15px",
        }}>
          {error}
        </div>
      )}
      {message && (
        <div style={{
          ...styles.message,
          backgroundColor: "#d4edda",
          color: "#155724",
          borderColor: "#c3e6cb",
          marginBottom: "15px",
        }}>
          {message}
        </div>
      )}

      {/* Tabs */}
      <div style={styles.tabContainer}>
        {["doctors", "appointments", "schedule", "contact"].map((tab) => (
          <button
            key={tab}
            onClick={() => {
              setActiveTab(tab);
              setShowForm(false);
              setError("");
              setMessage("");
            }}
            style={{
              ...styles.tabButton,
              background: activeTab === tab ? "#3B82F6" : "#e5e7eb",
              color: activeTab === tab ? "#fff" : "#666",
            }}
          >
            {tab === "doctors" && "Manage Doctors"}
            {tab === "appointments" && `View Appointments (${appointments.length})`}
            {tab === "schedule" && "Manage Schedule"}
            {tab === "contact" && "Contact Info"}
          </button>
        ))}
      </div>

      {/* Content */}
      <div style={styles.mainContent}>
        {message && <div style={styles.successMessage}>{message}</div>}
        {error && <div style={styles.errorMessage}>{error}</div>}

        {/* Doctors Tab */}
        {activeTab === "doctors" && (
          <div>
            <div style={styles.sectionHeader}>
              <h2 style={styles.sectionTitle}>Manage Doctors</h2>
              <button
                onClick={() => {
                  setShowForm(!showForm);
                  setEditingId(null);
                  setDoctorForm({ name: "", specialty: "", experience: "", fee: "", bio: "" });
                }}
                style={styles.primaryButton}
              >
                {showForm ? "Cancel" : "+ Add Doctor"}
              </button>
            </div>

            {showForm && (
              <form onSubmit={handleDoctorSubmit} style={styles.form}>
                <h3>{editingId ? "Edit Doctor" : "Add New Doctor"}</h3>
                <div style={styles.formGrid}>
                  <input
                    type="text"
                    placeholder="Doctor Name"
                    value={doctorForm.name}
                    onChange={(e) => setDoctorForm({ ...doctorForm, name: e.target.value })}
                    style={styles.input}
                    required
                  />
                  <input
                    type="text"
                    placeholder="Specialty"
                    value={doctorForm.specialty}
                    onChange={(e) => setDoctorForm({ ...doctorForm, specialty: e.target.value })}
                    style={styles.input}
                    required
                  />
                  <input
                    type="number"
                    placeholder="Experience (years)"
                    value={doctorForm.experience}
                    onChange={(e) => setDoctorForm({ ...doctorForm, experience: e.target.value })}
                    style={styles.input}
                    required
                  />
                  <input
                    type="number"
                    placeholder="Consultation Fee"
                    value={doctorForm.fee}
                    onChange={(e) => setDoctorForm({ ...doctorForm, fee: e.target.value })}
                    style={styles.input}
                    required
                  />
                  <textarea
                    placeholder="Bio"
                    value={doctorForm.bio}
                    onChange={(e) => setDoctorForm({ ...doctorForm, bio: e.target.value })}
                    style={{ ...styles.input, gridColumn: "1 / -1", minHeight: "100px" }}
                  />
                </div>
                <button type="submit" style={styles.submitButton}>
                  {editingId ? "Update Doctor" : "Add Doctor"}
                </button>
              </form>
            )}

            <div style={styles.cardsGrid}>
              {Array.isArray(doctors) && doctors.map((doctor) => (
                <div key={doctor.id} style={styles.card}>
                  <h3>{doctor.name}</h3>
                  <p><strong>Specialty:</strong> {doctor.specialty}</p>
                  <p><strong>Experience:</strong> {doctor.experience} years</p>
                  <p><strong>Fee:</strong> ₹{doctor.fee}</p>
                  {doctor.bio && <p><strong>Bio:</strong> {doctor.bio}</p>}
                  <div style={styles.cardActions}>
                    <button
                      onClick={() => handleDoctorEdit(doctor)}
                      style={styles.editButton}
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDoctorDelete(doctor.id)}
                      style={styles.deleteButton}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Appointments Tab */}
        {activeTab === "appointments" && (
          <div>
            <h2 style={styles.sectionTitle}>All Appointments</h2>
            <div style={styles.tableContainer}>
              <table style={styles.table}>
                <thead>
                  <tr style={styles.tableHeader}>
                    <th>Patient Name</th>
                    <th>Phone Number</th>
                    <th>Doctor</th>
                    <th>Date</th>
                    <th>Time</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {Array.isArray(appointments) && appointments.map((apt) => (
                    <tr key={apt.id} style={styles.tableRow}>
                      <td>{apt.user_name || "N/A"}</td>
                      <td>{apt.phone_number || "N/A"}</td>
                      <td>{apt.doctor_name}</td>
                      <td>{apt.appointment_date}</td>
                      <td>{apt.start_time}</td>
                      <td style={{
                        color: isAppointmentCompleted(apt) ? "#28a745" : "#3B82F6",
                        fontWeight: "600"
                      }}>
                        {isAppointmentCompleted(apt) ? "Completed" : "Upcoming"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Schedule Tab */}
        {activeTab === "schedule" && (
          <div>
            <div style={styles.sectionHeader}>
              <h2 style={styles.sectionTitle}>Manage Doctor Schedules</h2>
            </div>

            {/* Calendar View */}
            <div style={styles.scheduleContainer}>
              <div style={styles.calendarWrapper}>
                <CalendarPicker 
                  currentMonth={currentMonth}
                  setCurrentMonth={setCurrentMonth}
                  onDateSelect={(date) => {
                    setScheduleForm({ ...scheduleForm, schedule_date: date });
                    setShowTimeForm(true);
                  }}
                  schedules={schedules}
                />
              </div>

              {/* Schedule Modal */}
              {showTimeForm && (
                <div style={styles.scheduleModalOverlay}>
                  <div style={styles.scheduleModalContent}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
                      <h2 style={{ margin: 0, fontSize: "24px", fontWeight: "700", color: "#1a1a1a" }}>
                        {editingScheduleId ? "Edit Schedule" : "Add Schedule"}
                      </h2>
                      <button
                        onClick={() => {
                          setShowTimeForm(false);
                          setEditingScheduleId(null);
                          setScheduleForm({ doctor_id: "", schedule_date: "", start_time: "", end_time: "", clinic: "Clinic 1" });
                        }}
                        style={{
                          background: "none",
                          border: "none",
                          fontSize: "24px",
                          cursor: "pointer",
                          color: "#666",
                        }}
                      >
                        ✕
                      </button>
                    </div>

                    <form onSubmit={handleScheduleSubmit} style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
                      {/* Date Picker */}
                      <div>
                        <label style={{ display: "block", fontWeight: "600", marginBottom: "8px", color: "#1a1a1a" }}>
                          Select Date
                        </label>
                        <input
                          type="date"
                          value={scheduleForm.schedule_date}
                          onChange={(e) => setScheduleForm({ ...scheduleForm, schedule_date: e.target.value })}
                          style={{
                            width: "100%",
                            padding: "10px 12px",
                            border: "1px solid #ddd",
                            borderRadius: "6px",
                            fontSize: "14px",
                            fontFamily: "inherit",
                            boxSizing: "border-box",
                          }}
                          required
                        />
                      </div>

                      {/* Doctor Selector */}
                      <div>
                        <label style={{ display: "block", fontWeight: "600", marginBottom: "8px", color: "#1a1a1a" }}>
                          Select Doctor
                        </label>
                        <select
                          value={scheduleForm.doctor_id}
                          onChange={(e) => setScheduleForm({ ...scheduleForm, doctor_id: e.target.value })}
                          style={{
                            width: "100%",
                            padding: "10px 12px",
                            border: "1px solid #ddd",
                            borderRadius: "6px",
                            fontSize: "14px",
                            fontFamily: "inherit",
                            boxSizing: "border-box",
                          }}
                          required
                        >
                          <option value="">Select Doctor</option>
                          {Array.isArray(doctors) && doctors.map((doc) => (
                            <option key={doc.id} value={doc.id}>{doc.name}</option>
                          ))}
                        </select>
                      </div>

                      {/* Clinic Selector */}
                      <div>
                        <label style={{ display: "block", fontWeight: "600", marginBottom: "8px", color: "#1a1a1a" }}>
                          Clinic
                        </label>
                        <select
                          value={scheduleForm.clinic}
                          onChange={(e) => setScheduleForm({ ...scheduleForm, clinic: e.target.value })}
                          style={{
                            width: "100%",
                            padding: "10px 12px",
                            border: "1px solid #ddd",
                            borderRadius: "6px",
                            fontSize: "14px",
                            fontFamily: "inherit",
                            boxSizing: "border-box",
                          }}
                        >
                          <option value="Clinic 1">Clinic 1</option>
                          <option value="Clinic 2">Clinic 2</option>
                          <option value="Clinic 3">Clinic 3</option>
                          <option value="Clinic 4">Clinic 4</option>
                        </select>
                      </div>

                      {/* Time Pickers */}
                      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                        <div>
                          <label style={{ display: "block", fontWeight: "600", marginBottom: "8px", color: "#1a1a1a" }}>
                            Start Time
                          </label>
                          <input
                            type="time"
                            value={scheduleForm.start_time}
                            onChange={(e) => setScheduleForm({ ...scheduleForm, start_time: e.target.value })}
                            style={{
                              width: "100%",
                              padding: "10px 12px",
                              border: "1px solid #ddd",
                              borderRadius: "6px",
                              fontSize: "14px",
                              fontFamily: "inherit",
                              boxSizing: "border-box",
                            }}
                            required
                          />
                        </div>
                        <div>
                          <label style={{ display: "block", fontWeight: "600", marginBottom: "8px", color: "#1a1a1a" }}>
                            End Time
                          </label>
                          <input
                            type="time"
                            value={scheduleForm.end_time}
                            onChange={(e) => setScheduleForm({ ...scheduleForm, end_time: e.target.value })}
                            style={{
                              width: "100%",
                              padding: "10px 12px",
                              border: "1px solid #ddd",
                              borderRadius: "6px",
                              fontSize: "14px",
                              fontFamily: "inherit",
                              boxSizing: "border-box",
                            }}
                            required
                          />
                        </div>
                      </div>

                      {/* Buttons */}
                      <div style={{ display: "flex", gap: "12px", marginTop: "10px" }}>
                        <button
                          type="submit"
                          style={{
                            flex: 1,
                            padding: "12px 20px",
                            background: "#3B82F6",
                            color: "#fff",
                            border: "none",
                            borderRadius: "6px",
                            fontWeight: "600",
                            fontSize: "14px",
                            cursor: "pointer",
                          }}
                        >
                          {editingScheduleId ? "Update Schedule" : "Save Schedule"}
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setShowTimeForm(false);
                            setEditingScheduleId(null);
                            setScheduleForm({ doctor_id: "", schedule_date: "", start_time: "", end_time: "", clinic: "Clinic 1" });
                          }}
                          style={{
                            flex: 1,
                            padding: "12px 20px",
                            background: "#e5e7eb",
                            color: "#333",
                            border: "none",
                            borderRadius: "6px",
                            fontWeight: "600",
                            fontSize: "14px",
                            cursor: "pointer",
                          }}
                        >
                          Cancel
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              )}
            </div>

            <h3 style={{ marginTop: "40px" }}>Existing Schedules</h3>
            <div style={styles.tableContainer}>
              <table style={styles.table}>
                <thead>
                  <tr style={styles.tableHeader}>
                    <th>Doctor</th>
                    <th>Date</th>
                    <th>Start Time</th>
                    <th>End Time</th>
                    <th>Clinic</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {Array.isArray(schedules) && schedules.map((sch) => (
                    <tr key={sch.id} style={styles.tableRow}>
                      <td>{sch.doctor_name}</td>
                      <td>{sch.schedule_date}</td>
                      <td>{sch.start_time}</td>
                      <td>{sch.end_time}</td>
                      <td>{sch.clinic}</td>
                      <td style={{ display: "flex", gap: "8px" }}>
                        <button
                          onClick={() => handleScheduleEdit(sch)}
                          style={{ ...styles.deleteButton, background: "#3B82F6" }}
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleScheduleDelete(sch.id)}
                          style={styles.deleteButton}
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Contact Tab */}
        {activeTab === "contact" && (
          <div>
            <h2 style={styles.sectionTitle}>Edit Contact Information</h2>
            <form onSubmit={handleContactSubmit} style={styles.form}>
              <div style={styles.formGrid}>
                <input
                  type="tel"
                  placeholder="Phone Number"
                  value={contactForm.phone}
                  onChange={(e) => setContactForm({ ...contactForm, phone: e.target.value })}
                  style={styles.input}
                />
                <input
                  type="email"
                  placeholder="Email Address"
                  value={contactForm.email}
                  onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })}
                  style={styles.input}
                />
                <input
                  type="text"
                  placeholder="City"
                  value={contactForm.city}
                  onChange={(e) => setContactForm({ ...contactForm, city: e.target.value })}
                  style={styles.input}
                />
                <textarea
                  placeholder="Address"
                  value={contactForm.address}
                  onChange={(e) => setContactForm({ ...contactForm, address: e.target.value })}
                  style={{ ...styles.input, gridColumn: "1 / -1" }}
                />
                <input
                  type="time"
                  placeholder="Opening Time"
                  value={contactForm.opening_time}
                  onChange={(e) => setContactForm({ ...contactForm, opening_time: e.target.value })}
                  style={styles.input}
                />
                <input
                  type="time"
                  placeholder="Closing Time"
                  value={contactForm.closing_time}
                  onChange={(e) => setContactForm({ ...contactForm, closing_time: e.target.value })}
                  style={styles.input}
                />
              </div>
              <button type="submit" style={styles.submitButton}>Update Contact Info</button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

const styles = {
  container: {
    minHeight: "100vh",
    background: "#f5f7fa",
    fontFamily: "system-ui, -apple-system, sans-serif",
  },
  modalOverlay: {
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: "rgba(0, 0, 0, 0.5)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1000,
  },
  modalContent: {
    background: "#fff",
    padding: "30px",
    borderRadius: "8px",
    boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
    maxWidth: "400px",
    width: "90%",
  },
  scheduleModalOverlay: {
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: "rgba(0, 0, 0, 0.5)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1000,
  },
  scheduleModalContent: {
    background: "#fff",
    padding: "40px",
    borderRadius: "12px",
    boxShadow: "0 10px 25px rgba(0, 0, 0, 0.15)",
    maxWidth: "500px",
    width: "90%",
  },
  loadingContainer: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: "100vh",
    fontSize: "18px",
  },
  header: {
    background: "#fff",
    padding: "20px 30px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    borderBottom: "2px solid #e5e7eb",
    boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
  },
  title: {
    margin: 0,
    fontSize: "28px",
    fontWeight: "700",
    color: "#1a1a1a",
  },
  logoutBtn: {
    padding: "8px 16px",
    background: "#ef4444",
    color: "#fff",
    border: "none",
    borderRadius: "6px",
    fontWeight: "600",
    cursor: "pointer",
  },
  homeLink: {
    padding: "8px 16px",
    background: "#3B82F6",
    color: "#fff",
    textDecoration: "none",
    borderRadius: "6px",
    fontWeight: "600",
  },
  tabContainer: {
    display: "flex",
    gap: "10px",
    padding: "20px 30px",
    background: "#f9fafb",
    borderBottom: "2px solid #e5e7eb",
    overflowX: "auto",
  },
  tabButton: {
    padding: "10px 20px",
    border: "none",
    borderRadius: "6px",
    fontWeight: "600",
    cursor: "pointer",
    whiteSpace: "nowrap",
    transition: "all 0.3s ease",
  },
  mainContent: {
    padding: "30px",
    maxWidth: "1400px",
    margin: "0 auto",
  },
  successMessage: {
    background: "#d4edda",
    color: "#155724",
    padding: "12px 16px",
    borderRadius: "6px",
    marginBottom: "20px",
    border: "1px solid #c3e6cb",
  },
  message: {
    padding: "12px 16px",
    borderRadius: "6px",
    marginBottom: "20px",
    border: "1px solid",
  },
  errorMessage: {
    background: "#f8d7da",
    color: "#721c24",
    padding: "12px 16px",
    borderRadius: "6px",
    marginBottom: "20px",
    border: "1px solid #f5c6cb",
  },
  sectionHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "20px",
  },
  sectionTitle: {
    fontSize: "24px",
    fontWeight: "700",
    margin: 0,
    color: "#1a1a1a",
  },
  primaryButton: {
    padding: "10px 20px",
    background: "#3B82F6",
    color: "#fff",
    border: "none",
    borderRadius: "6px",
    fontWeight: "600",
    cursor: "pointer",
  },
  form: {
    background: "#fff",
    padding: "20px",
    borderRadius: "8px",
    marginBottom: "30px",
    boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
  },
  formGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
    gap: "15px",
    marginBottom: "15px",
  },
  input: {
    padding: "10px 12px",
    border: "1px solid #ddd",
    borderRadius: "6px",
    fontSize: "14px",
    fontFamily: "inherit",
  },
  submitButton: {
    padding: "12px 24px",
    background: "#10b981",
    color: "#fff",
    border: "none",
    borderRadius: "6px",
    fontWeight: "600",
    cursor: "pointer",
    fontSize: "14px",
  },
  cardsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
    gap: "20px",
  },
  card: {
    background: "#fff",
    padding: "20px",
    borderRadius: "8px",
    boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
  },
  cardActions: {
    display: "flex",
    gap: "10px",
    marginTop: "15px",
  },
  editButton: {
    flex: 1,
    padding: "8px 12px",
    background: "#3B82F6",
    color: "#fff",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
    fontWeight: "600",
  },
  deleteButton: {
    flex: 1,
    padding: "8px 12px",
    background: "#ef4444",
    color: "#fff",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
    fontWeight: "600",
  },
  tableContainer: {
    background: "#fff",
    borderRadius: "8px",
    overflow: "auto",
    boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
  },
  table: {
    width: "100%",
    borderCollapse: "collapse",
  },
  tableHeader: {
    background: "#f3f4f6",
    borderBottom: "2px solid #e5e7eb",
  },
  tableRow: {
    borderBottom: "1px solid #e5e7eb",
  },
  "table th, table td": {
    padding: "12px 16px",
    textAlign: "left",
    fontSize: "14px",
  },
  scheduleContainer: {
    display: "block",
    marginBottom: "40px",
  },
  calendarWrapper: {
    background: "#fff",
    borderRadius: "12px",
    padding: "30px",
    boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
    maxWidth: "600px",
    margin: "0 auto",
  },
  timeFormCard: {
    background: "#fff",
    borderRadius: "8px",
    padding: "20px",
    boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
    height: "fit-content",
  },
  calendarNav: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "30px",
    gap: "15px",
  },
  calendarNavButton: {
    padding: "10px 20px",
    background: "#3B82F6",
    color: "#fff",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
    fontWeight: "600",
    fontSize: "14px",
    transition: "background 0.2s ease",
  },
  calendarMonth: {
    fontSize: "22px",
    fontWeight: "700",
    color: "#1a1a1a",
    minWidth: "150px",
    textAlign: "center",
  },
  calendarGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(7, 1fr)",
    gap: "10px",
  },
  calendarDayHeader: {
    textAlign: "center",
    fontWeight: "700",
    color: "#333",
    paddingBottom: "12px",
    fontSize: "13px",
    textTransform: "uppercase",
  },
  calendarDay: {
    aspectRatio: "1",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "column",
    borderRadius: "8px",
    cursor: "pointer",
    border: "2px solid #e5e7eb",
    background: "#f9fafb",
    fontSize: "16px",
    fontWeight: "600",
    transition: "all 0.2s ease",
    minHeight: "70px",
  },
  calendarDayActive: {
    background: "#3B82F6",
    color: "#fff",
    borderColor: "#3B82F6",
  },
  calendarDayWithSchedule: {
    background: "#dbeafe",
    color: "#1e40af",
    borderColor: "#3B82F6",
    fontWeight: "700",
  },
};

// Calendar Component
const CalendarPicker = ({ currentMonth, setCurrentMonth, onDateSelect, schedules }) => {
  const getDaysInMonth = (date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  const hasSchedule = (day) => {
    const dateStr = `${currentMonth.getFullYear()}-${String(currentMonth.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    return schedules.some(sch => sch.schedule_date === dateStr);
  };

  const isPastDate = (day) => {
    const dateStr = `${currentMonth.getFullYear()}-${String(currentMonth.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    const selectedDate = new Date(dateStr);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return selectedDate < today;
  };

  const days = [];
  const daysInMonth = getDaysInMonth(currentMonth);
  const firstDay = getFirstDayOfMonth(currentMonth);

  for (let i = 0; i < firstDay; i++) {
    days.push(null);
  }
  for (let i = 1; i <= daysInMonth; i++) {
    days.push(i);
  }

  const monthName = currentMonth.toLocaleString('default', { month: 'long', year: 'numeric' });

  return (
    <div>
      <div style={styles.calendarNav}>
        <button
          style={styles.calendarNavButton}
          onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1))}
        >
          ← Previous
        </button>
        <h3 style={styles.calendarMonth}>{monthName}</h3>
        <button
          style={styles.calendarNavButton}
          onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1))}
        >
          Next →
        </button>
      </div>

      <div style={styles.calendarGrid}>
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
          <div key={day} style={styles.calendarDayHeader}>{day}</div>
        ))}

        {days.map((day, idx) => {
          if (day === null) {
            return <div key={`empty-${idx}`}></div>;
          }
          const dateStr = `${currentMonth.getFullYear()}-${String(currentMonth.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
          const scheduled = hasSchedule(day);
          const isPast = isPastDate(day);

          return (
            <div
              key={day}
              onClick={() => !isPast && onDateSelect(dateStr)}
              style={{
                ...styles.calendarDay,
                ...(isPast ? { opacity: 0.4, backgroundColor: '#f0f0f0', cursor: 'not-allowed', color: '#999' } : {}),
                ...(scheduled && !isPast ? styles.calendarDayWithSchedule : {}),
              }}
            >
              {day}
              {scheduled && !isPast && <span style={{ fontSize: '18px', marginLeft: '2px' }}>●</span>}
            </div>
          );
        })}
      </div>
    </div>
  );};

export default AdminDashboard;