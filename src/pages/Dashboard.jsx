import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import doctorImage from "./../images/docter1.png";
import logoImage from "./../images/AppointCarenobg.png";
import { translations } from "../utils/translations";
import SymptomsSection from "../components/SymptomsSection";
import { MdDashboard, MdAssignmentInd, MdCalendarToday, MdHelp, MdLogout, MdSearch, MdDownload, MdClose } from "react-icons/md";
import { FaUser } from "react-icons/fa";

const Dashboard = () => {
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [language, setLanguage] = useState(
    localStorage.getItem("language") || "en"
  );
  const t = translations[language];
  const [user] = useState({
    fullName: localStorage.getItem("fullName") || "FullName",
    email: localStorage.getItem("userEmail") || "",
    phoneNumber: localStorage.getItem("userPhoneNumber") || "",
  });
  const [doctors, setDoctors] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [activeMenu, setActiveMenu] = useState("appointments");
  const [doctorsLoading, setDoctorsLoading] = useState(true);
  const [doctorsError, setDoctorsError] = useState(null);
  const navigate = useNavigate();

  // Appointment booking states
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTime, setSelectedTime] = useState("");
  const availableSlots = [
    "09:00 AM",
    "10:00 AM",
    "11:00 AM",
    "02:00 PM",
    "03:00 PM",
    "04:00 PM",
  ];
  const [bookedAppointmentMessage, setBookedAppointmentMessage] = useState("");
  const [selectedAppointmentDetail, setSelectedAppointmentDetail] = useState(null);

  useEffect(() => {
    // Check if token exists on mount
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }

    let inactivityTimer;
    const INACTIVITY_TIMEOUT = 20 * 60 * 60 * 1000; // 20 hours in milliseconds

    const handleActivity = () => {
      // Reset inactivity timer on any activity
      clearTimeout(inactivityTimer);
      inactivityTimer = setTimeout(() => {
        // Auto-logout due to inactivity
        localStorage.clear();
        navigate("/login");
      }, INACTIVITY_TIMEOUT);
    };

    // Set initial timer
    inactivityTimer = setTimeout(() => {
      localStorage.clear();
      navigate("/login");
    }, INACTIVITY_TIMEOUT);

    // Add event listeners for user activity
    window.addEventListener("mousedown", handleActivity);
    window.addEventListener("keydown", handleActivity);
    window.addEventListener("scroll", handleActivity);
    window.addEventListener("touchstart", handleActivity);

    return () => {
      clearTimeout(inactivityTimer);
      window.removeEventListener("mousedown", handleActivity);
      window.removeEventListener("keydown", handleActivity);
      window.removeEventListener("scroll", handleActivity);
      window.removeEventListener("touchstart", handleActivity);
    };
  }, [navigate]);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Fetch doctors
  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        setDoctorsLoading(true);
        setDoctorsError(null);
        const response = await fetch("http://localhost:3000/api/doctors");
        if (response.ok) {
          const data = await response.json();
          setDoctors(data);
        } else {
          setDoctorsError(t.failedLoadDoctors);
        }
      } catch (err) {
        setDoctorsError(t.backendNotRunning);
        console.error("Doctors fetch error:", err);
      } finally {
        setDoctorsLoading(false);
      }
    };
    fetchDoctors();
  }, [t]);

  // Fetch appointments
  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const userEmail = localStorage.getItem("userEmail");
        if (userEmail) {
          // Placeholder for future API call
          const storedAppointments =
            JSON.parse(localStorage.getItem("userAppointments")) || [];
          setAppointments(storedAppointments);
        }
      } catch (err) {
        console.error("Error fetching appointments:", err);
      }
    };
    fetchAppointments();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("fullName");
    localStorage.removeItem("isAdmin");
    localStorage.removeItem("adminEmail");
    navigate("/login");
  };

  const handleLanguageChange = (lang) => {
    setLanguage(lang);
    localStorage.setItem("language", lang);
  };

  const handleBookAppointment = (doctor) => {
    setSelectedDoctor(doctor);
    setActiveMenu("calendar");
  };

  const handleConfirmBooking = () => {
    if (!selectedDoctor || !selectedDate || !selectedTime) {
      alert(t.selectAllFields);
      return;
    }

    const newAppointment = {
      id: Date.now(),
      doctorName: selectedDoctor.name,
      doctorId: selectedDoctor.id,
      date: selectedDate,
      time: selectedTime,
      specialty: selectedDoctor.specialty,
      fee: selectedDoctor.fee,
      bookedAt: new Date().toISOString(),
    };

    const updatedAppointments = [
      ...appointments,
      newAppointment,
    ];
    setAppointments(updatedAppointments);
    localStorage.setItem(
      "userAppointments",
      JSON.stringify(updatedAppointments)
    );

    setBookedAppointmentMessage(t.appointmentBooked);
    setTimeout(() => {
      setBookedAppointmentMessage("");
      setSelectedDoctor(null);
      setSelectedDate("");
      setSelectedTime("");
      setActiveMenu("dashboard");
    }, 2000);
  };

  // Get next 30 days
  const getNextDays = () => {
    const days = [];
    for (let i = 0; i < 30; i++) {
      const date = new Date();
      date.setDate(date.getDate() + i);
      days.push(date);
    }
    return days;
  };
  const nextDays = getNextDays();

  const handleDownloadPDF = () => {
    if (!selectedAppointmentDetail) return;

    const apt = selectedAppointmentDetail;
    const bookingDate = new Date(apt.bookedAt).toLocaleDateString();
    
    // Create PDF content as HTML
    const pdfContent = `
      <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; margin: 20px; }
            .header { text-align: center; margin-bottom: 30px; border-bottom: 2px solid #3B82F6; padding-bottom: 15px; }
            .title { font-size: 24px; font-weight: bold; color: #3B82F6; margin: 0; }
            .section { margin-bottom: 25px; }
            .section-title { font-size: 16px; font-weight: bold; color: #3B82F6; margin-bottom: 12px; border-bottom: 1px solid #eee; padding-bottom: 8px; }
            .detail-row { display: flex; justify-content: space-between; margin-bottom: 10px; font-size: 14px; }
            .label { font-weight: bold; min-width: 150px; }
            .value { text-align: right; }
            .footer { text-align: center; margin-top: 30px; border-top: 1px solid #eee; padding-top: 15px; font-size: 12px; color: #999; }
          </style>
        </head>
        <body>
          <div class="header">
            <p class="title">AppointCare Appointments</p>
          </div>

          <div class="section">
            <div class="section-title">Patient's Details</div>
            <div class="detail-row">
              <span class="label">Name:</span>
              <span class="value">${user.fullName}</span>
            </div>
            <div class="detail-row">
              <span class="label">Email:</span>
              <span class="value">${user.email}</span>
            </div>
            <div class="detail-row">
              <span class="label">Phone:</span>
              <span class="value">${user.phoneNumber}</span>
            </div>
          </div>

          <div class="section">
            <div class="section-title">Doctor's Details</div>
            <div class="detail-row">
              <span class="label">Name:</span>
              <span class="value">Dr. ${apt.doctorName}</span>
            </div>
            <div class="detail-row">
              <span class="label">Specialty:</span>
              <span class="value">${apt.specialty}</span>
            </div>
          </div>

          <div class="section">
            <div class="section-title">Appointment Details</div>
            <div class="detail-row">
              <span class="label">Appointment Status:</span>
              <span class="value">${apt.status || "Scheduled"}</span>
            </div>
            <div class="detail-row">
              <span class="label">Date of Booking:</span>
              <span class="value">${bookingDate}</span>
            </div>
            <div class="detail-row">
              <span class="label">Date of Appointment:</span>
              <span class="value">${apt.date}</span>
            </div>
            <div class="detail-row">
              <span class="label">Appointment Time:</span>
              <span class="value">${apt.time}</span>
            </div>
          </div>

          <div class="section">
            <div class="detail-row">
              <span class="label" style="font-size: 16px;">Total Amount:</span>
              <span class="value" style="font-size: 16px; font-weight: bold; color: #3B82F6;">₹${apt.fee}</span>
            </div>
          </div>

          <div class="footer">
            <p>Please visit the hospital on the scheduled date and time with this document.</p>
            <p>© 2024 AppointCare. All rights reserved.</p>
          </div>
        </body>
      </html>
    `;

    // Create a new window and print to PDF
    const printWindow = window.open("", "PRINT", "height=600,width=800");
    printWindow.document.write(pdfContent);
    printWindow.document.close();
    printWindow.print();
  };

  const styles = {
    container: { display: "flex", width: "100%", minHeight: "100vh", background: "#f9f9f9", flexDirection: isMobile ? "column" : "row" },
    sidebar: { width: isMobile ? "100%" : "200px", background: "#fff", padding: "clamp(12px, 3vw, 20px)", flexDirection: "column", boxShadow: "2px 0 8px rgba(0,0,0,0.05)", borderRight: "1px solid #eee", position: "sticky", top: 0, height: isMobile ? "auto" : "100vh", overflow: "auto", display: "flex", flexShrink: 0 },
    logo: { display: "flex", alignItems: "center", gap: "12px", marginBottom: "30px", fontSize: "clamp(0.9rem, 3vw, 1.2rem)", fontWeight: "700", color: "#3B82F6" },
    logoIcon: { width: "clamp(40px, 8vw, 50px)", height: "clamp(40px, 8vw, 50px)", objectFit: "contain" },
    logoText: { display: isMobile ? "inline" : "none" },
    nav: { display: "flex", flexDirection: isMobile ? "row" : "column", gap: "8px", flex: 1, flexWrap: "wrap" },
    navItem: { padding: "10px 12px", border: "none", borderRadius: "6px", fontSize: "clamp(0.8rem, 2vw, 0.9rem)", fontWeight: "500", cursor: "pointer", transition: "all 0.3s ease", textAlign: "left", whiteSpace: "nowrap" },
    logoutBtn: { padding: "10px 12px", background: "#f0f0f0", color: "#666", border: "1px solid #ddd", borderRadius: "6px", fontSize: "clamp(0.8rem, 2vw, 0.9rem)", fontWeight: "600", cursor: "pointer", transition: "all 0.3s ease" },
    main: { flex: 1, display: "flex", flexDirection: "column", overflow: "auto", width: "100%" },
    header: { background: "#fff", padding: "clamp(12px, 3vw, 30px)", borderBottom: "1px solid #eee", display: "flex", justifyContent: "space-between", alignItems: "center", gap: "clamp(10px, 3vw, 20px)", boxShadow: "0 2px 4px rgba(0,0,0,0.05)", position: "sticky", top: 0, zIndex: 50, flexWrap: "wrap", width: "100%" },
    headerLeft: { flex: 1, minWidth: "200px" },
    headerTitle: { fontSize: "clamp(1.1rem, 4vw, 1.5rem)", fontWeight: "700", color: "#1a1a1a", margin: "0 0 5px 0" },
    headerSubtitle: { fontSize: "clamp(0.75rem, 2vw, 0.9rem)", color: "#999", margin: 0 },
    searchBar: { display: "flex", gap: "8px", flex: 1, minWidth: "200px" },
    searchInput: { flex: 1, padding: "10px 15px", border: "1px solid #ddd", borderRadius: "6px", fontSize: "clamp(0.8rem, 2vw, 0.9rem)" },
    searchBtn: { padding: "8px 16px", background: "#3B82F6", color: "#fff", border: "none", borderRadius: "6px", fontSize: "clamp(0.8rem, 2vw, 0.9rem)", fontWeight: "600", cursor: "pointer" },
    userSection: { display: "flex", alignItems: "center", gap: "clamp(8px, 2vw, 15px)", flexWrap: "wrap" },
    languageSelect: { padding: "8px 12px", border: "1px solid #ddd", borderRadius: "4px", fontSize: "clamp(0.75rem, 2vw, 0.85rem)", cursor: "pointer", background: "#fff" },
    userProfile: { display: "flex", alignItems: "center", gap: "10px", cursor: "pointer" },
    userAvatar: { width: "clamp(30px, 8vw, 40px)", height: "clamp(30px, 8vw, 40px)", borderRadius: "50%", background: "#e0e7ff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "clamp(0.9rem, 3vw, 1.2rem)" },
    userName: { fontSize: "clamp(0.8rem, 2vw, 0.9rem)", fontWeight: "600", color: "#333" },
    content: { padding: "clamp(15px, 5vw, 30px)", flex: 1, width: "100%" },
    heroBanner: { background: "linear-gradient(135deg, #7B9BA8 0%, #8FA8B4 100%)", borderRadius: "12px", padding: "clamp(25px, 5vw, 40px)", color: "#fff", marginBottom: "40px", display: "flex", alignItems: "center" },
    bannerContent: { display: "flex", alignItems: "center", gap: "clamp(20px, 5vw, 40px)", width: "100%", flexWrap: "wrap" },
    bannerText: { flex: 1, minWidth: "200px" },
    bannerTitle: { fontSize: "clamp(1.4rem, 5vw, 2rem)", fontWeight: "700", color: "#fff", margin: "0 0 10px 0" },
    bannerSubtitle: { fontSize: "clamp(0.95rem, 3vw, 1.1rem)", color: "#fff", margin: "0 0 5px 0" },
    bannerDescription: { fontSize: "clamp(0.8rem, 2vw, 0.9rem)", color: "rgba(255,255,255,0.8)", margin: "0 0 20px 0" },
    doctorsOnlineInfo: { display: "flex", alignItems: "center", gap: "10px" },
    doctorsOnlineCircles: { fontSize: "clamp(0.9rem, 3vw, 1.2rem)" },
    doctorsOnlineText: { fontSize: "clamp(0.75rem, 2vw, 0.9rem)", color: "#fff" },
    bannerImage: { flex: 1, textAlign: "center", minWidth: "150px" },
    bannerImg: { maxWidth: "100%", height: "auto", maxHeight: "250px" },
    appointmentsSection: { marginBottom: "40px" },
    sectionHeader: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px", flexWrap: "wrap", gap: "10px" },
    sectionTitle: { fontSize: "clamp(1.1rem, 4vw, 1.3rem)", fontWeight: "700", color: "#1a1a1a", margin: 0 },
    viewAllLink: { color: "#3B82F6", textDecoration: "none", fontSize: "clamp(0.8rem, 2vw, 0.9rem)", fontWeight: "600" },
    appointmentsList: { display: "flex", flexDirection: "column", gap: "15px" },
    appointmentCard: { background: "#fff", padding: "clamp(12px, 3vw, 20px)", borderRadius: "8px", border: "1px solid #eee", boxShadow: "0 2px 4px rgba(0,0,0,0.05)", transition: "all 0.3s ease" },
    appointmentCardContent: { display: "flex", alignItems: "center", gap: "clamp(12px, 3vw, 20px)", flexWrap: "wrap" },
    appointmentIcon: { fontSize: "clamp(1.5rem, 4vw, 2rem)" },
    appointmentDetails: { flex: 1, minWidth: "150px" },
    appointmentDoctorName: { fontSize: "clamp(0.9rem, 3vw, 1rem)", fontWeight: "700", color: "#1a1a1a", margin: "0 0 5px 0" },
    appointmentDateTime: { fontSize: "clamp(0.8rem, 2vw, 0.9rem)", color: "#666", margin: "0 0 5px 0" },
    appointmentSpecialty: { fontSize: "clamp(0.75rem, 2vw, 0.85rem)", color: "#3B82F6", margin: 0 },
    appointmentFee: { textAlign: "center" },
    feeLabel: { fontSize: "clamp(0.7rem, 2vw, 0.8rem)", color: "#999", margin: 0 },
    feeAmount: { fontSize: "clamp(0.95rem, 3vw, 1.1rem)", fontWeight: "700", color: "#3B82F6", margin: 0 },
    noAppointments: { background: "#fff", padding: "clamp(20px, 5vw, 40px)", borderRadius: "12px", textAlign: "center", border: "1px solid #eee", boxShadow: "0 2px 8px rgba(0,0,0,0.05)" },
    noAppointmentsText: { fontSize: "clamp(0.85rem, 2vw, 0.95rem)", color: "#999", marginBottom: "20px" },
    calendarPlaceholder: { display: "flex", justifyContent: "center", overflowX: "auto" },
    miniCalendar: { width: "100%", maxWidth: "300px", border: "1px solid #eee", borderRadius: "8px", padding: "clamp(10px, 3vw, 15px)", background: "#f9f9f9" },
    calendarMonth: { textAlign: "center", fontWeight: "600", marginBottom: "15px", color: "#333", fontSize: "clamp(0.8rem, 2vw, 0.9rem)" },
    calendarGrid: { display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: "8px" },
    calendarDay: { aspect: "1", display: "flex", alignItems: "center", justifyContent: "center", borderRadius: "4px", fontSize: "clamp(0.65rem, 2vw, 0.8rem)", fontWeight: "600" },
    doctorsSection: { marginTop: "40px" },
    doctorsGrid: { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: "clamp(15px, 4vw, 25px)" },
    doctorCard: { background: "#fff", border: "1px solid #eee", borderRadius: "12px", padding: "clamp(12px, 3vw, 20px)", textAlign: "center", transition: "all 0.3s ease", boxShadow: "0 2px 8px rgba(0,0,0,0.05)" },
    doctorImageContainer: { width: "clamp(80px, 20vw, 120px)", height: "clamp(80px, 20vw, 120px)", margin: "0 auto 15px", borderRadius: "50%", overflow: "hidden", border: "3px solid #3B82F6" },
    doctorImage: { width: "100%", height: "100%", objectFit: "cover" },
    doctorName: { fontSize: "1.2rem", fontWeight: "700", color: "#1a1a1a", margin: "0 0 5px 0" },
    doctorSpecialty: { fontSize: "0.9rem", color: "#3B82F6", margin: "0 0 5px 0", fontWeight: "600" },
    doctorExperience: { fontSize: "0.8rem", color: "#999", margin: "0 0 15px 0" },
    doctorDetails: { display: "flex", justifyContent: "center", gap: "30px", marginBottom: "15px", paddingBottom: "15px", borderBottom: "1px solid #eee" },
    detailItem: { display: "flex", alignItems: "center", gap: "8px" },
    detailIcon: { fontSize: "1rem" },
    detailText: { fontSize: "0.8rem", color: "#666" },
    doctorTiming: { display: "flex", justifyContent: "center", gap: "10px", marginBottom: "15px", alignItems: "center" },
    timingText: { fontSize: "0.8rem", color: "#666" },
    startingText: { fontSize: "0.75rem", color: "#999" },
    appointmentBtn: { width: "100%", padding: "10px", background: "#3B82F6", color: "#fff", border: "none", borderRadius: "6px", fontSize: "0.9rem", fontWeight: "600", cursor: "pointer", transition: "all 0.3s ease" },
    noDoctorsText: { textAlign: "center", color: "#999" },
    errorBox: { background: "#fef2f2", border: "1px solid #fecaca", borderRadius: "8px", padding: "16px", marginBottom: "20px" },
    errorText: { color: "#991b1b", margin: 0, fontSize: "0.95rem" },
    loadingText: { textAlign: "center", color: "#3B82F6", fontSize: "0.95rem", fontWeight: "500" },
    successBox: { background: "#f0fdf4", border: "1px solid #86efac", borderRadius: "8px", padding: "16px", marginBottom: "20px" },
    successText: { color: "#166534", margin: 0, fontSize: "0.95rem" },
    calendarSection: { background: "#fff", padding: "30px", borderRadius: "12px", boxShadow: "0 2px 8px rgba(0,0,0,0.05)" },
    bookingForm: { marginTop: "30px" },
    formGroup: { marginBottom: "25px" },
    formLabel: { display: "block", fontSize: "0.95rem", fontWeight: "600", color: "#333", marginBottom: "10px" },
    formSelect: { width: "100%", padding: "12px", border: "1px solid #ddd", borderRadius: "6px", fontSize: "0.95rem", background: "#fff", cursor: "pointer" },
    datesGrid: { display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(80px, 1fr))", gap: "10px" },
    dateButton: { padding: "12px", border: "2px solid #ddd", borderRadius: "8px", background: "#f0f0f0", cursor: "pointer", transition: "all 0.3s ease" },
    dateButtonDay: { fontSize: "0.75rem", fontWeight: "600", marginBottom: "5px" },
    dateButtonDate: { fontSize: "1.1rem", fontWeight: "700" },
    timeSlotsGrid: { display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(100px, 1fr))", gap: "10px" },
    timeSlotButton: { padding: "12px", border: "2px solid #ddd", borderRadius: "6px", background: "#fff", cursor: "pointer", fontWeight: "600", transition: "all 0.3s ease" },
    bookButton: { width: "100%", padding: "15px", background: "#3B82F6", color: "#fff", border: "none", borderRadius: "6px", fontSize: "1rem", fontWeight: "600", cursor: "pointer", transition: "all 0.3s ease", marginTop: "20px" },
    emptySection: { background: "#fff", padding: "40px", borderRadius: "12px", textAlign: "center", minHeight: "400px", display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center" },
    footer: { background: "#fff", padding: "40px 30px", borderTop: "1px solid #eee", marginTop: "40px" },
    footerContent: { display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "40px", marginBottom: "30px" },
    footerColumn: { display: "flex", flexDirection: "column", gap: "12px" },
    footerTitle: { fontSize: "0.95rem", fontWeight: "700", color: "#333", margin: 0 },
    footerLink: { fontSize: "0.85rem", color: "#666", textDecoration: "none", transition: "color 0.3s ease" },
    footerBottom: { textAlign: "center", paddingTop: "20px", borderTop: "1px solid #eee" },
    footerText: { fontSize: "0.85rem", color: "#999", margin: 0 },
    mobileMenu: { position: "fixed", bottom: "20px", right: "20px", zIndex: 100 },
    menuBtn: { width: "56px", height: "56px", background: "#3B82F6", color: "#fff", border: "none", borderRadius: "50%", fontSize: "1.5rem", cursor: "pointer", boxShadow: "0 2px 12px rgba(59, 130, 246, 0.3)" },
    modalOverlay: { position: "fixed", top: 0, left: 0, right: 0, bottom: 0, background: "rgba(0,0,0,0.5)", display: selectedAppointmentDetail ? "flex" : "none", alignItems: "center", justifyContent: "center", zIndex: 1000 },
    modalContent: { background: "#fff", borderRadius: "12px", padding: "40px", maxWidth: "700px", width: "90%", maxHeight: "90vh", overflowY: "auto", boxShadow: "0 10px 40px rgba(0,0,0,0.3)" },
    modalHeader: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "30px", borderBottom: "2px solid #3B82F6", paddingBottom: "15px" },
    modalTitle: { fontSize: "1.8rem", fontWeight: "700", color: "#1a1a1a", margin: 0 },
    modalCloseBtn: { background: "none", border: "none", fontSize: "1.5rem", cursor: "pointer", color: "#999" },
    detailSection: { marginBottom: "25px" },
    detailSectionTitle: { fontSize: "1.2rem", fontWeight: "700", color: "#3B82F6", marginBottom: "15px", borderBottom: "1px solid #eee", paddingBottom: "10px" },
    detailRow: { display: "flex", justifyContent: "space-between", marginBottom: "12px", fontSize: "0.95rem" },
    detailLabel: { fontWeight: "600", color: "#666", minWidth: "150px" },
    detailValue: { color: "#1a1a1a", textAlign: "right", flex: 1 },
    modalButtonGroup: { display: "flex", gap: "15px", marginTop: "30px", justifyContent: "flex-end" },
    downloadPdfBtn: { padding: "12px 24px", background: "#3B82F6", color: "#fff", border: "none", borderRadius: "6px", fontSize: "1rem", fontWeight: "600", cursor: "pointer", transition: "all 0.3s ease" },
    closeModalBtn: { padding: "12px 24px", background: "#f0f0f0", color: "#666", border: "1px solid #ddd", borderRadius: "6px", fontSize: "1rem", fontWeight: "600", cursor: "pointer", transition: "all 0.3s ease" }
  };

  return (
    <div style={styles.container}>
      {/* Sidebar */}
      <aside style={{ ...styles.sidebar, display: isMobile ? "none" : "flex" }}>
        <div style={styles.logo}>
          <img src={logoImage} alt="AppointCare Logo" style={styles.logoIcon} />
          <span style={styles.logoText}>AppointCare</span>
        </div>

        <nav style={styles.nav}>
          <button
            style={{
              ...styles.navItem,
              background: activeMenu === "dashboard" ? "#3B82F6" : "transparent",
              color: activeMenu === "dashboard" ? "#fff" : "#666",
              display: "flex",
              alignItems: "center",
              gap: "8px",
            }}
            onClick={() => setActiveMenu("dashboard")}
          >
            <MdDashboard size={20} /> {t.dashboard}
          </button>
          <button
            style={{
              ...styles.navItem,
              background: activeMenu === "appointments" ? "#3B82F6" : "transparent",
              color: activeMenu === "appointments" ? "#fff" : "#666",
              display: "flex",
              alignItems: "center",
              gap: "8px",
            }}
            onClick={() => setActiveMenu("appointments")}
          >
            <MdAssignmentInd size={20} /> My Appointments
          </button>
          <button
            style={{
              ...styles.navItem,
              background: activeMenu === "calendar" ? "#3B82F6" : "transparent",
              color: activeMenu === "calendar" ? "#fff" : "#666",
              display: "flex",
              alignItems: "center",
              gap: "8px",
            }}
            onClick={() => setActiveMenu("calendar")}
          >
            <MdCalendarToday size={20} /> {t.calendar}
          </button>
          <button
            style={{
              ...styles.navItem,
              background: activeMenu === "help" ? "#3B82F6" : "transparent",
              color: activeMenu === "help" ? "#fff" : "#666",
              display: "flex",
              alignItems: "center",
              gap: "8px",
            }}
            onClick={() => setActiveMenu("help")}
          >
            <MdHelp size={20} /> {t.help}
          </button>
        </nav>

        <button style={styles.logoutBtn} onClick={handleLogout}>
          <MdLogout size={18} style={{ marginRight: "6px" }} /> {t.logout}
        </button>
      </aside>

      {/* Main Content */}
      <main style={styles.main}>
        {/* Header */}
        <header style={styles.header}>
          <div style={styles.headerLeft}>
            <h1 style={styles.headerTitle}>
              {t.hi}, {user.fullName}
            </h1>
            <p style={styles.headerSubtitle}>{t.welcomeBack}</p>
          </div>
          <div style={styles.searchBar}>
            <input
              type="text"
              placeholder={t.findDoctors}
              style={styles.searchInput}
            />
            <button style={styles.searchBtn}>
              <MdSearch size={20} />
            </button>
          </div>
          <div style={styles.userSection}>
            <select
              style={styles.languageSelect}
              value={language}
              onChange={(e) => handleLanguageChange(e.target.value)}
            >
              <option value="en">EN 🌍</option>
              <option value="ne">ने 🇳🇵</option>
            </select>
            <div 
              style={{...styles.userProfile, cursor: "pointer"}}
              onClick={() => navigate("/profile")}
            >
              <div style={styles.userAvatar}><FaUser size={20} /></div>
              <span style={styles.userName}>{user.fullName}</span>
            </div>
          </div>
        </header>

        {/* Content Area */}
        <div style={styles.content}>
          {activeMenu === "appointments" && (
            <div style={styles.appointmentsSection}>
              <h1 style={styles.sectionTitle}>
                <MdAssignmentInd style={{display: "inline", marginRight: "8px"}} /> My Appointments
              </h1>
              <p style={{ color: "#999", marginBottom: "30px" }}>View all your booked appointments</p>

              {appointments.length > 0 ? (
                <div style={styles.appointmentsList}>
                  {appointments.map((apt, index) => (
                    <div 
                      key={index} 
                      style={{...styles.appointmentCard, cursor: "pointer"}}
                      onClick={() => setSelectedAppointmentDetail(apt)}
                    >
                      <div style={styles.appointmentCardContent}>
                        <div style={styles.appointmentIcon}><MdAssignmentInd size={28} color="#3B82F6" /></div>
                        <div style={styles.appointmentDetails}>
                          <p style={styles.appointmentDoctorName}>
                            Dr. {apt.doctorName || "Doctor"}
                          </p>
                          <p style={styles.appointmentDateTime}>
                            📅 {apt.date || "Pending"} | ⏰ {apt.time || "Pending"}
                          </p>
                          <p style={styles.appointmentSpecialty}>
                            {apt.specialty || "General Consultation"}
                          </p>
                          <p style={{ fontSize: "0.85rem", color: "#666", marginTop: "8px" }}>
                            Status: <span style={{ fontWeight: "600", color: apt.status === "completed" ? "#22c55e" : apt.status === "cancelled" ? "#ef4444" : "#3b82f6" }}>
                              {apt.status || "Scheduled"}
                            </span>
                          </p>
                        </div>
                        <div style={styles.appointmentFee}>
                          <p style={styles.feeLabel}>Consultation Fee</p>
                          <p style={styles.feeAmount}>₹{apt.fee || "0"}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div style={styles.noAppointments}>
                  <p style={{ fontSize: "2rem", marginBottom: "10px" }}>📭</p>
                  <p style={styles.noAppointmentsText}>You don't have any appointments yet.</p>
                  <p style={{ color: "#3B82F6", fontSize: "0.95rem", marginTop: "20px" }}>
                    👉 Go to the <strong>Calendar</strong> tab to book your first appointment with a doctor.
                  </p>
                </div>
              )}
            </div>
          )}

          {activeMenu === "dashboard" && (
            <>
              {/* Hero Banner */}
              <section style={styles.heroBanner}>
                <div style={styles.bannerContent}>
                  <div style={styles.bannerText}>
                    <h2 style={styles.bannerTitle}>{t.noVisitLocal}</h2>
                    <p style={styles.bannerSubtitle}>{t.getConsultation}</p>
                    <p style={styles.bannerDescription}>{t.audioTextVideo}</p>
                    <div style={styles.doctorsOnlineInfo}>
                      <span style={styles.doctorsOnlineCircles}>
                        👨‍⚕️ 👩‍⚕️ 👨‍⚕️
                      </span>
                      <span style={styles.doctorsOnlineText}>
                        +180 {t.doctorsOnline}
                      </span>
                    </div>
                  </div>
                  <div style={styles.bannerImage}>
                    <img
                      src={doctorImage}
                      alt="Doctors"
                      style={styles.bannerImg}
                    />
                  </div>
                </div>
              </section>

              {/* Upcoming Appointments */}
              <section style={styles.appointmentsSection}>
                <div style={styles.sectionHeader}>
                  <h2 style={styles.sectionTitle}>
                    {t.upcomingAppointments}
                  </h2>
                  <a href="#" style={styles.viewAllLink}>
                    {t.viewAll} ›
                  </a>
                </div>

                {appointments.length > 0 ? (
                  <div style={styles.appointmentsList}>
                    {appointments.map((apt) => (
                      <div key={apt.id} style={styles.appointmentCard}>
                        <div style={styles.appointmentCardContent}>
                          <div style={styles.appointmentIcon}><MdCalendarToday size={28} color="#3B82F6" /></div>
                          <div style={styles.appointmentDetails}>
                            <p style={styles.appointmentDoctorName}>
                              Dr. {apt.doctorName}
                            </p>
                            <p style={styles.appointmentDateTime}>
                              {apt.date} at {apt.time}
                            </p>
                            <p style={styles.appointmentSpecialty}>
                              {apt.specialty}
                            </p>
                          </div>
                          <div style={styles.appointmentFee}>
                            <p style={styles.feeLabel}>Fee</p>
                            <p style={styles.feeAmount}>₹{apt.fee}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div style={styles.noAppointments}>
                    <p style={styles.noAppointmentsText}>
                      {t.noAppointments}
                    </p>
                    <div style={styles.calendarPlaceholder}>
                      <div style={styles.miniCalendar}>
                        <div style={styles.calendarMonth}>
                          {new Date().toLocaleDateString(language === "ne" ? "ne-NP" : "en-US", {
                            month: "long",
                            year: "numeric",
                          })}
                        </div>
                        <div style={styles.calendarGrid}>
                          {Array.from({ length: 30 }).map((_, i) => (
                            <div
                              key={i}
                              style={{
                                ...styles.calendarDay,
                                background: i === 14 ? "#3B82F6" : "#f9f9f9",
                                color: i === 14 ? "#fff" : "#666",
                              }}
                            >
                              {i + 1}
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </section>

              {/* Recommended Doctors */}
              <section style={styles.doctorsSection}>
                <div style={styles.sectionHeader}>
                  <h2 style={styles.sectionTitle}>{t.recommendedDoctors}</h2>
                  <a href="#" style={styles.viewAllLink}>
                    {t.viewAll} ›
                  </a>
                </div>

                {doctorsError && (
                  <div style={styles.errorBox}>
                    <p style={styles.errorText}>⚠️ {doctorsError}</p>
                  </div>
                )}

                {doctorsLoading && (
                  <p style={styles.loadingText}>{t.loadingDoctors}</p>
                )}

                {!doctorsLoading && !doctorsError && doctors.length > 0 ? (
                  <div style={styles.doctorsGrid}>
                    {doctors.slice(0, 3).map((doctor) => (
                      <div key={doctor.id} style={styles.doctorCard}>
                        <div style={styles.doctorImageContainer}>
                          <img
                            src={doctor.photo || doctorImage}
                            alt={doctor.name}
                            style={styles.doctorImage}
                          />
                        </div>
                        <h3 style={styles.doctorName}>{doctor.name}</h3>
                        <p style={styles.doctorSpecialty}>
                          {t.specialist} | {doctor.specialty}
                        </p>
                        <p style={styles.doctorExperience}>
                          {doctor.experience} {t.yearsExperience}
                        </p>
                        <div style={styles.doctorDetails}>
                          <div style={styles.detailItem}>
                            <span style={styles.detailIcon}>📅</span>
                            <span style={styles.detailText}>
                              {doctor.availability || "Tue, Thu"}
                            </span>
                          </div>
                          <div style={styles.detailItem}>
                            <span style={styles.detailIcon}>₹</span>
                            <span style={styles.detailText}>{doctor.fee}</span>
                          </div>
                        </div>
                        <div style={styles.doctorTiming}>
                          <span style={styles.timingText}>
                            {doctor.timing || "10:00 AM-01:00 PM"}
                          </span>
                          <span style={styles.startingText}>{t.starting}</span>
                        </div>
                        <button
                          style={styles.appointmentBtn}
                          onClick={() => handleBookAppointment(doctor)}
                        >
                          {t.bookAppointment}
                        </button>
                      </div>
                    ))}
                  </div>
                ) : !doctorsLoading && !doctorsError && doctors.length === 0 ? (
                  <p style={styles.noDoctorsText}>No doctors available</p>
                ) : null}
              </section>

              {/* Symptoms Section */}
              <SymptomsSection />

              {/* Footer */}
              <footer style={styles.footer}>
                <div style={styles.footerContent}>
                  <div style={styles.footerColumn}>
                    <h4 style={styles.footerTitle}>{t.service}</h4>
                    <a href="#" style={styles.footerLink}>
                      {t.searching}
                    </a>
                    <a href="#" style={styles.footerLink}>
                      {t.booking}
                    </a>
                    <a href="#" style={styles.footerLink}>
                      {t.timeSheet}
                    </a>
                  </div>
                  <div style={styles.footerColumn}>
                    <h4 style={styles.footerTitle}>{t.information}</h4>
                    <a href="#" style={styles.footerLink}>
                      {t.faq}
                    </a>
                    <a href="#" style={styles.footerLink}>
                      {t.blog}
                    </a>
                    <a href="#" style={styles.footerLink}>
                      {t.support}
                    </a>
                  </div>
                  <div style={styles.footerColumn}>
                    <h4 style={styles.footerTitle}>{t.company}</h4>
                    <a href="#" style={styles.footerLink}>
                      {t.aboutUs}
                    </a>
                    <a href="#" style={styles.footerLink}>
                      {t.contactUs}
                    </a>
                  </div>
                </div>
                <div style={styles.footerBottom}>
                  <p style={styles.footerText}>© 2024 AppointCare. All rights reserved.</p>
                </div>
              </footer>
            </>
          )}

          {activeMenu === "calendar" && (
            <div style={styles.calendarSection}>
              <h2 style={styles.sectionTitle}>{t.calendarView}</h2>

              {bookedAppointmentMessage && (
                <div style={styles.successBox}>
                  <p style={styles.successText}>✅ {bookedAppointmentMessage}</p>
                </div>
              )}

              <div style={styles.bookingForm}>
                {/* Doctor Selection */}
                <div style={styles.formGroup}>
                  <label style={styles.formLabel}>{t.selectDoctor}</label>
                  <select
                    style={styles.formSelect}
                    value={selectedDoctor?.id || ""}
                    onChange={(e) => {
                      const doctor = doctors.find(
                        (d) => d.id === parseInt(e.target.value)
                      );
                      setSelectedDoctor(doctor);
                    }}
                  >
                    <option value="">-- {t.selectDoctor} --</option>
                    {doctors.map((doctor) => (
                      <option key={doctor.id} value={doctor.id}>
                        Dr. {doctor.name} - {doctor.specialty}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Calendar with dates */}
                <div style={styles.formGroup}>
                  <label style={styles.formLabel}>{t.selectDate}</label>
                  <div style={styles.datesGrid}>
                    {nextDays.map((date, index) => (
                      <button
                        key={index}
                        style={{
                          ...styles.dateButton,
                          background:
                            selectedDate === date.toISOString().split("T")[0]
                              ? "#3B82F6"
                              : "#f0f0f0",
                          color:
                            selectedDate === date.toISOString().split("T")[0]
                              ? "#fff"
                              : "#333",
                        }}
                        onClick={() =>
                          setSelectedDate(date.toISOString().split("T")[0])
                        }
                      >
                        <div style={styles.dateButtonDay}>
                          {date.toLocaleDateString(language === "ne" ? "ne-NP" : "en-US", {
                            weekday: "short",
                          })}
                        </div>
                        <div style={styles.dateButtonDate}>
                          {date.getDate()}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Time Selection */}
                {selectedDate && (
                  <div style={styles.formGroup}>
                    <label style={styles.formLabel}>{t.selectTime}</label>
                    <div style={styles.timeSlotsGrid}>
                      {availableSlots.map((slot, index) => (
                        <button
                          key={index}
                          style={{
                            ...styles.timeSlotButton,
                            background:
                              selectedTime === slot ? "#3B82F6" : "#fff",
                            color: selectedTime === slot ? "#fff" : "#333",
                            border:
                              selectedTime === slot
                                ? "2px solid #3B82F6"
                                : "2px solid #ddd",
                          }}
                          onClick={() => setSelectedTime(slot)}
                        >
                          {slot}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Book Button */}
                <button
                  style={styles.bookButton}
                  onClick={handleConfirmBooking}
                >
                  {t.bookNow}
                </button>
              </div>
            </div>
          )}

          {activeMenu === "help" && (
            <div style={styles.emptySection}>
              <h2>{t.helpSupport}</h2>
              <p>{t.comingSoon}</p>
            </div>
          )}
        </div>
      </main>

      {/* Mobile Menu Button */}
      {isMobile && (
        <div style={styles.mobileMenu}>
          <button style={styles.menuBtn}>☰</button>
        </div>
      )}

      {/* Appointment Detail Modal */}
      <div style={styles.modalOverlay} onClick={() => setSelectedAppointmentDetail(null)}>
        <div style={styles.modalContent} onClick={(e) => e.stopPropagation()}>
          {selectedAppointmentDetail && (
            <>
              <div style={styles.modalHeader}>
                <h2 style={styles.modalTitle}>AppointCare Appointments</h2>
                <button 
                  style={styles.modalCloseBtn}
                  onClick={() => setSelectedAppointmentDetail(null)}
                >
                  <MdClose size={24} />
                </button>
              </div>

              <div style={styles.detailSection}>
                <h3 style={styles.detailSectionTitle}>Patient's Details</h3>
                <div style={styles.detailRow}>
                  <span style={styles.detailLabel}>Name:</span>
                  <span style={styles.detailValue}>{user.fullName}</span>
                </div>
                <div style={styles.detailRow}>
                  <span style={styles.detailLabel}>Email:</span>
                  <span style={styles.detailValue}>{user.email}</span>
                </div>
                <div style={styles.detailRow}>
                  <span style={styles.detailLabel}>Phone:</span>
                  <span style={styles.detailValue}>{user.phoneNumber}</span>
                </div>
              </div>

              <div style={styles.detailSection}>
                <h3 style={styles.detailSectionTitle}>Doctor's Details</h3>
                <div style={styles.detailRow}>
                  <span style={styles.detailLabel}>Name:</span>
                  <span style={styles.detailValue}>Dr. {selectedAppointmentDetail.doctorName}</span>
                </div>
                <div style={styles.detailRow}>
                  <span style={styles.detailLabel}>Specialty:</span>
                  <span style={styles.detailValue}>{selectedAppointmentDetail.specialty}</span>
                </div>
              </div>

              <div style={styles.detailSection}>
                <h3 style={styles.detailSectionTitle}>Appointment Details</h3>
                <div style={styles.detailRow}>
                  <span style={styles.detailLabel}>Appointment Status:</span>
                  <span style={{...styles.detailValue, fontWeight: "600", color: selectedAppointmentDetail.status === "completed" ? "#22c55e" : selectedAppointmentDetail.status === "cancelled" ? "#ef4444" : "#3b82f6"}}>
                    {selectedAppointmentDetail.status || "Scheduled"}
                  </span>
                </div>
                <div style={styles.detailRow}>
                  <span style={styles.detailLabel}>Date of Booking:</span>
                  <span style={styles.detailValue}>{new Date(selectedAppointmentDetail.bookedAt).toLocaleDateString()}</span>
                </div>
                <div style={styles.detailRow}>
                  <span style={styles.detailLabel}>Date of Appointment:</span>
                  <span style={styles.detailValue}>{selectedAppointmentDetail.date}</span>
                </div>
                <div style={styles.detailRow}>
                  <span style={styles.detailLabel}>Appointment Time:</span>
                  <span style={styles.detailValue}>{selectedAppointmentDetail.time}</span>
                </div>
              </div>

              <div style={{...styles.detailSection, borderTop: "2px solid #3B82F6", paddingTop: "20px"}}>
                <div style={{...styles.detailRow, fontSize: "1.1rem"}}>
                  <span style={{...styles.detailLabel, fontSize: "1.1rem"}}>Total Amount:</span>
                  <span style={{...styles.detailValue, fontSize: "1.1rem", fontWeight: "700", color: "#3B82F6"}}>₹{selectedAppointmentDetail.fee}</span>
                </div>
              </div>

              <div style={styles.modalButtonGroup}>
                <button 
                  style={styles.downloadPdfBtn}
                  onClick={handleDownloadPDF}
                >
                  <MdDownload size={20} style={{marginRight: "8px"}} /> Download PDF
                </button>
                <button 
                  style={styles.closeModalBtn}
                  onClick={() => setSelectedAppointmentDetail(null)}
                >
                  Close
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
