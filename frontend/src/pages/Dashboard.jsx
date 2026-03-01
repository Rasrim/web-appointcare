import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import jsPDF from "jspdf";
import { FaBell, FaTimes, FaBellSlash } from "react-icons/fa";
import { API_URL } from "../utils/api";
import { initializeTokenValidator, handleTokenInvalid } from "../utils/tokenValidator";
import doctorImage from "./../images/docter1.png";
import logoImage from "./../images/AppointCarenobg.png";
import { translations } from "../utils/translations";
import SymptomsSection from "../components/SymptomsSection";
import useDoctorSync from "../hooks/useDoctorSync";

const Dashboard = () => {
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [language, setLanguage] = useState(
    localStorage.getItem("language") || "en"
  );
  const t = translations[language];
  const [user, setUser] = useState({
    fullName: localStorage.getItem("fullName") || "FullName",
    email: localStorage.getItem("userEmail") || "",
    phoneNumber: localStorage.getItem("userPhoneNumber") || "",
  });
  const [profileImage, setProfileImage] = useState(localStorage.getItem("profileImage") || null);
  const [doctors, setDoctors] = useState([]);
  const [filteredDoctors, setFilteredDoctors] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [activeMenu, setActiveMenu] = useState("dashboard");
  const [appointmentStatusFilter, setAppointmentStatusFilter] = useState("upcoming");
  const [showAllAppointments, setShowAllAppointments] = useState(false);
  const [showAllDoctors, setShowAllDoctors] = useState(false);
  const [doctorsLoading, setDoctorsLoading] = useState(true);
  const [doctorsError, setDoctorsError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSpecialty, setSelectedSpecialty] = useState("");
  const [specialties, setSpecialties] = useState([]);
  const [showSearchDropdown, setShowSearchDropdown] = useState(false);
  const [contactInfo, setContactInfo] = useState(null);
  const [loadingContact, setLoadingContact] = useState(false);
  const [notifications, setNotifications] = useState(() => {
    try {
      const stored = localStorage.getItem("appointmentNotifications");
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });
  const [showNotifications, setShowNotifications] = useState(false);
  const [selectedRemedy, setSelectedRemedy] = useState(null);
  const [notificationsEnabled, setNotificationsEnabled] = useState(() => {
    try {
      const stored = localStorage.getItem("notificationsEnabled");
      return stored !== null ? JSON.parse(stored) : true;
    } catch {
      return true;
    }
  });
  const navigate = useNavigate();

  // Appointment booking states
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTime, setSelectedTime] = useState("");
  const [availableDates, setAvailableDates] = useState([]);
  const [availableTimes, setAvailableTimes] = useState([]);
  const [allSlots, setAllSlots] = useState([]);
  const [bookedSlots, setBookedSlots] = useState([]);
  const [loadingDates, setLoadingDates] = useState(false);
  const [loadingTimes, setLoadingTimes] = useState(false);
  const [bookedAppointmentMessage, setBookedAppointmentMessage] = useState("");

  // Fetch available dates for selected doctor
  const fetchAvailableDates = async (doctorId) => {
    if (!doctorId) return;
    
    try {
      setLoadingDates(true);
      const response = await fetch(`${API_URL}/api/available-dates?doctorId=${doctorId}`);
      if (response.ok) {
        const data = await response.json();
        setAvailableDates(data.availableDates || []);
        setSelectedDate(""); // Reset selected date when doctor changes
        setSelectedTime("");
        setAvailableTimes([]);
        setAllSlots([]);
        setBookedSlots([]);
      }
    } catch (error) {
      console.error("Error fetching available dates:", error);
      toast.error("Failed to load available dates");
    } finally {
      setLoadingDates(false);
    }
  };

  // Fetch available time slots for selected date
  const fetchAvailableTimes = async (doctorId, date) => {
    if (!doctorId || !date) return;
    
    try {
      setLoadingTimes(true);
      console.log("Fetching times for:", { doctorId, date });
      const response = await fetch(`${API_URL}/api/users/available-times?doctorId=${doctorId}&date=${date}`);
      console.log("Time slots response status:", response.status);
      if (response.ok) {
        const data = await response.json();
        console.log("Time slots data received:", data);
        setAllSlots(data.allSlots || []);
        setAvailableTimes(data.availableSlots || []);
        setBookedSlots(data.bookedSlots || []);
        setSelectedTime(""); // Reset selected time when date changes
      } else {
        console.log("Time slots response not OK:", await response.text());
        setAllSlots([]);
        setAvailableTimes([]);
        setBookedSlots([]);
      }
    } catch (error) {
      console.error("Error fetching available times:", error);
      toast.error("Failed to load available times");
    } finally {
      setLoadingTimes(false);
    }
  };

  // Helper function to convert 24-hour time format to 12-hour format
  const formatTime24To12 = (time24) => {
    if (!time24) return time24;
    const [hours, minutes] = time24.split(':');
    let hour = parseInt(hours);
    const meridiem = hour >= 12 ? 'PM' : 'AM';
    hour = hour % 12 || 12;
    return `${String(hour).padStart(2, '0')}:${minutes} ${meridiem}`;
  };

  useEffect(() => {
    // Initialize token validator - detects tampering and auto-logouts
    initializeTokenValidator();

    // Check if token exists on mount
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }

    // Listen for token invalid events
    const handleTokenInvalidEvent = (event) => {
      toast.error(event.detail?.reason || 'Session invalid');
      navigate("/login");
    };
    window.addEventListener('tokenInvalid', handleTokenInvalidEvent);

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
      window.removeEventListener('tokenInvalid', handleTokenInvalidEvent);
    };
  }, [navigate]);

  // Listen for profile image changes
  useEffect(() => {
    const handleProfileImageChange = () => {
      const newImage = localStorage.getItem("profileImage");
      setProfileImage(newImage);
      const fullName = localStorage.getItem("fullName");
      setUser(prev => ({...prev, fullName: fullName || prev.fullName}));
    };
    
    window.addEventListener('profileImageChanged', handleProfileImageChange);
    window.addEventListener('storage', handleProfileImageChange);
    
    return () => {
      window.removeEventListener('profileImageChanged', handleProfileImageChange);
      window.removeEventListener('storage', handleProfileImageChange);
    };
  }, []);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Fetch doctors
  const fetchDoctors = async () => {
    try {
      setDoctorsLoading(true);
      setDoctorsError(null);
      const response = await fetch(`${API_URL}/api/doctors`);
      if (response.ok) {
        const data = await response.json();
        const docList = Array.isArray(data) ? data : [];
        setDoctors(docList);
        setFilteredDoctors(docList);
        const specs = [...new Set(docList.map(d => d.specialization || d.specialty).filter(Boolean))];
        setSpecialties(specs);
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

  useEffect(() => {
    fetchDoctors();
  }, [t]);

  // Sync doctors when admin updates them
  useDoctorSync(fetchDoctors);

  // Handle notifications
  const addNotification = (doctorName, date) => {
    if (!notificationsEnabled) return;
    
    const newNotification = {
      id: Date.now(),
      doctorName,
      date,
      timestamp: new Date().toLocaleString(),
    };
    const updatedNotifications = [newNotification, ...notifications];
    setNotifications(updatedNotifications);
    localStorage.setItem("appointmentNotifications", JSON.stringify(updatedNotifications));
  };

  const clearNotification = (id) => {
    const updatedNotifications = notifications.filter(n => n.id !== id);
    setNotifications(updatedNotifications);
    localStorage.setItem("appointmentNotifications", JSON.stringify(updatedNotifications));
  };

  const clearAllNotifications = () => {
    setNotifications([]);
    localStorage.setItem("appointmentNotifications", JSON.stringify([]));
  };

  const toggleNotifications = (enabled) => {
    setNotificationsEnabled(enabled);
    localStorage.setItem("notificationsEnabled", JSON.stringify(enabled));
  };

  // Sync doctors when admin updates them
  useDoctorSync(fetchDoctors);

  // Handle search and specialty filtering
  useEffect(() => {
    let list = doctors;
    if (searchQuery.trim()) {
      list = list.filter(d => d.full_name?.toLowerCase().includes(searchQuery.toLowerCase()));
    }
    if (selectedSpecialty) {
      list = list.filter(d => (d.specialization || d.specialty) === selectedSpecialty);
    }
    setFilteredDoctors(list);
  }, [searchQuery, selectedSpecialty, doctors]);

  // Old search filtering (kept for compatibility)
  useEffect(() => {
    if (!searchQuery.trim() && !selectedSpecialty) {
      setFilteredDoctors(doctors);
    } else {
      const query = searchQuery.toLowerCase();
      const filtered = doctors.filter(doctor => 
        (doctor.name && doctor.name.toLowerCase().includes(query)) ||
        (doctor.full_name && doctor.full_name.toLowerCase().includes(query)) ||
        (doctor.specialty && doctor.specialty.toLowerCase().includes(query)) ||
        (doctor.specialization && doctor.specialization.toLowerCase().includes(query)) ||
        (doctor.bio && doctor.bio.toLowerCase().includes(query))
      );
      setFilteredDoctors(filtered);
    }
  }, [searchQuery, doctors]);

  // Fetch appointments
  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const userEmail = localStorage.getItem("userEmail");
        if (userEmail) {
          // Placeholder for future API call
          const storedAppointments =
            JSON.parse(localStorage.getItem("userAppointments")) || [];
          
          // Filter to show only today and future appointments
          const today = new Date();
          today.setHours(0, 0, 0, 0); // Set to midnight for comparison
          
          const filteredAppointments = storedAppointments.filter(apt => {
            if (!apt.date) return false;
            // Parse date (assuming format DD/MM/YYYY)
            const dateParts = apt.date.split('/');
            const appointmentDate = new Date(dateParts[2], dateParts[1] - 1, dateParts[0]);
            return appointmentDate >= today;
          });
          
          setAppointments(filteredAppointments);
        }
      } catch (err) {
        console.error("Error fetching appointments:", err);
      }
    };
    fetchAppointments();
  }, []);

  // Remedy data with detailed information
  const remedyData = {
    "common-cold": {
      title: "Common Cold",
      category: "Home Treatment",
      emoji: "💊",
      shortDesc: "Rest well, drink warm fluids like tea and soup. Use steam inhalation to clear nasal passages. Take vitamin C supplements and honey for cough relief.",
      fullDesc: `A common cold is typically a viral infection of the upper respiratory tract. Here are comprehensive home treatment strategies:

Immediate Relief:
• Get plenty of rest - Sleep helps your immune system fight the virus
• Stay hydrated - Drink at least 8-10 glasses of water daily
• Use a humidifier to add moisture to the air

Natural Remedies:
• Drink warm tea with honey and lemon
• Consume warm broths and soups
• Take vitamin C supplements (1000-2000mg daily)
• Try ginger tea for throat inflammation`,
      tips: ["Rest 7-10 days", "Stay warm", "Avoid cold air", "Eat nutritious food"]
    },
    "headache-migraine": {
      title: "Headache & Migraine",
      category: "Pain Management",
      emoji: "🤕",
      shortDesc: "Apply a cold or warm compress. Rest in a dark, quiet room. Stay hydrated and avoid stress. Try meditation or yoga.",
      fullDesc: `Headaches and migraines can be debilitating. Here's how to manage them:

Immediate Pain Relief:
• Apply a cold compress to the forehead or neck
• Or use a warm compress for tension headaches
• Massage your temples gently

Lifestyle Modifications:
• Stay well hydrated - Dehydration is a common trigger
• Maintain regular sleep schedule
• Avoid trigger foods
• Practice stress management techniques`,
      tips: ["Dark quiet room", "Cold compress", "Hydrate well", "Avoid caffeine"]
    },
    "healthy-digestion": {
      title: "Healthy Digestion",
      category: "Wellness Tips",
      emoji: "🥗",
      shortDesc: "Eat fibre-rich foods, drink plenty of water, and eat slowly. Include ginger and turmeric in your diet. Exercise regularly for better digestion.",
      fullDesc: `Good digestion is fundamental to overall health. Here's how to maintain it:

Dietary Habits:
• Eat slowly and chew food thoroughly (20-30 chews per bite)
• Include fiber-rich foods: fruits, vegetables, whole grains
• Drink at least 8 glasses of water daily

Foods That Aid Digestion:
• Ginger - Reduces bloating and inflammation
• Turmeric - Anti-inflammatory properties
• Probiotics - Yogurt, kefir, sauerkraut
• Leafy greens - High in fiber

Lifestyle Tips:
• Take a 15-minute walk after meals
• Manage stress
• Exercise regularly
• Maintain regular meal times`,
      tips: ["Eat slowly", "Drink water", "High fiber foods", "Ginger tea"]
    },
    "better-sleep": {
      title: "Better Sleep",
      category: "Sleep Hygiene",
      emoji: "😴",
      shortDesc: "Maintain a regular sleep schedule. Keep your room cool and dark. Avoid screens 1 hour before bed. Try deep breathing exercises.",
      fullDesc: `Quality sleep is essential for health. Here's how to improve your sleep:

Sleep Environment:
• Keep room temperature cool (60-67°F is ideal)
• Ensure complete darkness or use an eye mask
• Use comfortable bedding
• Reduce noise levels

Pre-Sleep Routine (1 hour before bed):
• Avoid screens - Blue light disrupts melatonin
• No caffeine after 2 PM
• Do light stretching or relaxation exercises

Sleep Schedule Tips:
• Go to bed and wake up at the same time daily
• Aim for 7-9 hours of sleep
• Avoid long naps (limit to 20-30 minutes)

Relaxation Techniques:
• Practice deep breathing
• Progressive muscle relaxation
• Meditate for 10-15 minutes`,
      tips: ["Dark room", "Cool temperature", "Fixed schedule", "No screens"]
    },
    "stress-relief": {
      title: "Stress Relief",
      category: "Mental Health",
      emoji: "🧘",
      shortDesc: "Practice yoga and meditation daily. Spend time in nature. Connect with friends and family. Journal your thoughts regularly.",
      fullDesc: `Chronic stress affects both mental and physical health. Here's a holistic approach:

Daily Mindfulness Practices:
• Meditation - Start with 5-10 minutes daily
• Deep breathing exercises - 5 minutes, 3x daily
• Journaling - Write down thoughts and emotions

Physical Activities:
• Yoga - 20-30 minutes daily
• Regular exercise - 30 minutes, 5x weekly
• Walking in nature
• Dancing or any enjoyable movement

Social & Emotional Support:
• Spend quality time with family and friends
• Join support groups
• Limit social media usage
• Practice gratitude daily

When to Seek Help:
• If stress symptoms persist for weeks
• Feelings of anxiety or depression
• Difficulty concentrating`,
      tips: ["Yoga daily", "Nature time", "Journaling", "Social connection"]
    },
    "fitness-basics": {
      title: "Fitness Basics",
      category: "Exercise Guide",
      emoji: "💪",
      shortDesc: "Exercise 30 minutes daily. Mix cardio with strength training. Warm up before and cool down after. Start slow and increase gradually.",
      fullDesc: `Regular exercise is vital for overall health. Here's a beginner-friendly guide:

Exercise Frequency:
• Aim for 150 minutes of moderate exercise weekly
• Or 75 minutes of vigorous exercise weekly
• Include strength training 2x weekly

Types of Exercise:

Cardiovascular (30 minutes):
• Brisk walking, running, cycling, swimming

Strength Training (2x weekly):
• Bodyweight exercises, weights, resistance bands
• Gym machines, yoga, pilates

Flexibility Work (Daily):
• Stretching routines - 10 minutes
• Yoga - 20-30 minutes

Beginner Tips:
• Start with low intensity
• Always warm up for 5-10 minutes
• Cool down and stretch after
• Rest for 1-2 minutes between sets`,
      tips: ["30 mins daily", "Mix cardio & weights", "Warm up first", "Stay consistent"]
    }
  };

  // Fetch contact info when Help menu is opened
  useEffect(() => {
    if (activeMenu === "help") {
      fetchContactInfo();
    }
  }, [activeMenu]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("fullName");
    localStorage.removeItem("isAdmin");
    localStorage.removeItem("adminEmail");
    navigate("/login");
  };

  const downloadAppointmentPDF = (appointment) => {
    try {
      const doc = new jsPDF();
      const pageWidth = doc.internal.pageSize.getWidth();
      const pageHeight = doc.internal.pageSize.getHeight();
      const margin = 15;
      const lineHeight = 10;
      
      // Title
      doc.setFontSize(18);
      doc.text("Appointment Form", pageWidth / 2, 20, { align: "center" });
      
      // Line
      doc.setDrawColor(0, 0, 0);
      doc.line(margin, 28, pageWidth - margin, 28);
      
      // Content
      doc.setFontSize(11);
      let yPosition = 40;
      
      // User Info
      doc.setFont(undefined, "bold");
      doc.text("Appointment Details", margin, yPosition);
      yPosition += lineHeight;
      
      doc.setFont(undefined, "normal");
      doc.text(`Date: ${appointment.date || "N/A"}`, margin, yPosition);
      yPosition += lineHeight;
      
      doc.text(`Time: ${appointment.time || "N/A"}`, margin, yPosition);
      yPosition += lineHeight;
      
      doc.text(`Doctor: Dr. ${appointment.doctorName || "N/A"}`, margin, yPosition);
      yPosition += lineHeight;
      
      doc.text(`Specialty: ${appointment.specialty || "N/A"}`, margin, yPosition);
      yPosition += lineHeight;
      
      doc.text(`Consultation Fee: ₹${appointment.fee || "N/A"}`, margin, yPosition);
      yPosition += lineHeight + 5;
      
      // Status
      doc.setFont(undefined, "bold");
      doc.text("Status", margin, yPosition);
      yPosition += lineHeight;
      
      doc.setFont(undefined, "normal");
      doc.text(`Status: ${appointment.status || "Scheduled"}`, margin, yPosition);
      yPosition += lineHeight + 10;
      
      // Footer
      doc.setFontSize(9);
      doc.setFont(undefined, "italic");
      doc.text(`Generated on: ${new Date().toLocaleString()}`, margin, pageHeight - 15);
      doc.text("AppointCare - Healthcare Appointment Booking System", margin, pageHeight - 10);
      
      // Download
      doc.save(`appointment_${appointment.date}_${appointment.id}.pdf`);
      toast.success("Appointment downloaded as PDF!");
    } catch (error) {
      console.error("PDF download error:", error);
      toast.error("Failed to download appointment as PDF");
    }
  };

  const fetchContactInfo = async () => {
    try {
      setLoadingContact(true);
      const response = await fetch(`${API_URL}/api/contact-info`);
      if (response.ok) {
        const data = await response.json();
        setContactInfo(Array.isArray(data) && data.length > 0 ? data[0] : data);
      }
    } catch (error) {
      console.error("Error fetching contact info:", error);
    } finally {
      setLoadingContact(false);
    }
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
      toast.warning(t.selectAllFields);
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

    // Add notification
    addNotification(selectedDoctor.name, `${selectedDate} at ${selectedTime}`);

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

  // Get filtered doctors for search dropdown
  const getSearchResults = () => {
    if (!searchQuery.trim()) return [];
    
    const query = searchQuery.toLowerCase();
    return doctors.filter(doctor => {
      const name = (doctor.full_name || doctor.name || "").toLowerCase();
      const specialty = (doctor.specialization || doctor.specialty || "").toLowerCase();
      return name.includes(query) || specialty.includes(query);
    }).slice(0, 6); // Limit to 6 results
  };

  const searchResults = getSearchResults();

  // Get appointment status
  const getAppointmentStatus = (appointmentDate) => {
    if (!appointmentDate) return "upcoming";
    const dateParts = appointmentDate.split('/');
    const apt = new Date(dateParts[2], dateParts[1] - 1, dateParts[0]);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    apt.setHours(0, 0, 0, 0);
    if (apt < today) return "completed";
    if (apt.getTime() === today.getTime()) return "inProcess";
    return "upcoming";
  };

  // Filter appointments by status
  const getFilteredAppointmentsByStatus = () => {
    return appointments.filter(apt => {
      const status = getAppointmentStatus(apt.date);
      return status === appointmentStatusFilter;
    });
  };

  const nextDays = getNextDays();

  const styles = {
    container: { display: "flex", width: "100%", minHeight: "100vh", background: "#f5f5f5", flexDirection: isMobile ? "column" : "row" },
    sidebar: { width: isMobile ? "100%" : "260px", background: "#fff", padding: "20px", flexDirection: "column", boxShadow: "2px 0 8px rgba(0,0,0,0.05)", borderRight: "1px solid #eee", position: isMobile ? "sticky" : "fixed", top: 0, left: 0, height: isMobile ? "auto" : "100vh", overflow: "auto", display: "flex", flexShrink: 0, zIndex: 100 },
    logo: { display: "flex", alignItems: "center", gap: "12px", marginBottom: "40px", fontSize: "1.4rem", fontWeight: "700", color: "#000", cursor: "pointer", transition: "all 0.3s ease" },
    logoIcon: { width: "40px", height: "40px", objectFit: "contain" },
    logoText: { display: isMobile ? "inline" : "inline" },
    nav: { display: "flex", flexDirection: isMobile ? "row" : "column", gap: "8px", flex: 1, flexWrap: "wrap" },
    navItem: { padding: "12px 16px", border: "none", borderRadius: "6px", fontSize: "0.95rem", fontWeight: "500", cursor: "pointer", transition: "all 0.3s ease", textAlign: "left", whiteSpace: "nowrap", display: "flex", alignItems: "center", gap: "8px" },
    logoutBtn: { padding: "12px 16px", background: "#fef2f2", color: "#e53e3e", border: "1px solid #feb2b2", borderRadius: "6px", fontSize: "0.95rem", fontWeight: "600", cursor: "pointer", transition: "all 0.3s ease", marginTop: "auto" },
    main: { flex: 1, display: "flex", flexDirection: "column", overflow: "auto", width: "100%", marginLeft: isMobile ? 0 : "260px", marginTop: isMobile ? 0 : "80px" },
    header: { background: "#fff", padding: "20px 30px", borderBottom: "1px solid #eee", display: "flex", justifyContent: "space-between", alignItems: "center", gap: "20px", boxShadow: "0 2px 4px rgba(0,0,0,0.05)", position: "fixed", top: 0, left: isMobile ? 0 : "260px", right: 0, zIndex: 99, flexWrap: "wrap", width: isMobile ? "100%" : "calc(100% - 260px)", height: "80px" },
    headerLeft: { flex: 1, minWidth: "200px" },
    headerTitle: { fontSize: "1.8rem", fontWeight: "700", color: "#1a1a1a", margin: "0 0 5px 0" },
    headerSubtitle: { fontSize: "0.9rem", color: "#999", margin: 0 },
    userSection: { display: "flex", alignItems: "center", gap: "15px", flexWrap: "wrap" },
    languageSelect: { padding: "8px 12px", border: "1px solid #ddd", borderRadius: "4px", fontSize: "0.85rem", cursor: "pointer", background: "#fff" },
    userProfile: { display: "flex", alignItems: "center", gap: "10px", cursor: "pointer" },
    userAvatar: { width: "40px", height: "40px", borderRadius: "50%", background: "#e0e7ff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.2rem" },
    userName: { fontSize: "0.9rem", fontWeight: "600", color: "#333" },
    content: { padding: "30px", flex: 1, width: "100%", maxWidth: "1200px", marginLeft: isMobile ? 0 : "auto", marginRight: isMobile ? 0 : "auto" },
    heroBanner: { background: "linear-gradient(135deg, #7B9BA8 0%, #8FA8B4 100%)", borderRadius: "12px", padding: "40px", color: "#fff", marginBottom: "40px", display: "flex", alignItems: "center" },
    bannerContent: { display: "flex", alignItems: "center", gap: "40px", width: "100%", flexWrap: "wrap" },
    bannerText: { flex: 1, minWidth: "280px" },
    bannerTitle: { fontSize: "2rem", fontWeight: "700", color: "#fff", margin: "0 0 10px 0", lineHeight: "1.2" },
    bannerSubtitle: { fontSize: "1.1rem", color: "#fff", margin: "0 0 8px 0", fontWeight: "500" },
    bannerDescription: { fontSize: "0.9rem", color: "rgba(255,255,255,0.85)", margin: "0 0 20px 0" },
    searchSection: { display: "flex", gap: "10px", marginTop: "20px" },
    searchInput: { flex: 1, padding: "12px 16px", border: "none", borderRadius: "6px", fontSize: "0.9rem" },
    searchBtn: { padding: "12px 24px", background: "#3B82F6", color: "#fff", border: "none", borderRadius: "6px", fontSize: "0.95rem", fontWeight: "600", cursor: "pointer" },
    bannerImage: { flex: 1, textAlign: "center", minWidth: "200px" },
    bannerImg: { maxWidth: "100%", height: "auto", maxHeight: "280px" },
    appointmentsSection: { marginBottom: "40px" },
    sectionHeader: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px", flexWrap: "wrap", gap: "10px" },
    sectionTitle: { fontSize: "1.3rem", fontWeight: "700", color: "#1a1a1a", margin: 0 },
    viewAllLink: { color: "#3B82F6", textDecoration: "none", fontSize: "0.9rem", fontWeight: "600" },
    appointmentsList: { display: "flex", flexDirection: "column", gap: "15px" },
    appointmentCard: { background: "#fff", padding: "20px", borderRadius: "8px", border: "1px solid #eee", boxShadow: "0 2px 4px rgba(0,0,0,0.05)", transition: "all 0.3s ease" },
    appointmentCardContent: { display: "flex", alignItems: "center", gap: "20px", flexWrap: "wrap" },
    appointmentIcon: { fontSize: "2rem" },
    appointmentDetails: { flex: 1, minWidth: "150px" },
    appointmentDoctorName: { fontSize: "1rem", fontWeight: "700", color: "#1a1a1a", margin: "0 0 5px 0" },
    appointmentDateTime: { fontSize: "0.9rem", color: "#666", margin: "0 0 5px 0" },
    appointmentSpecialty: { fontSize: "0.85rem", color: "#3B82F6", margin: 0 },
    appointmentFee: { textAlign: "center" },
    feeLabel: { fontSize: "0.8rem", color: "#999", margin: 0 },
    feeAmount: { fontSize: "1.1rem", fontWeight: "700", color: "#3B82F6", margin: 0 },
    noAppointments: { background: "#fff", padding: "40px", borderRadius: "12px", textAlign: "center", border: "1px solid #eee", boxShadow: "0 2px 8px rgba(0,0,0,0.05)" },
    noAppointmentsText: { fontSize: "0.95rem", color: "#999", marginBottom: "20px" },
    noAppointments: { background: "#fff", padding: isMobile ? "25px" : "40px", borderRadius: "12px", textAlign: "center", border: "1px solid #eee", boxShadow: "0 2px 8px rgba(0,0,0,0.05)" },
    doctorsGrid: { display: "grid", gridTemplateColumns: isMobile ? "1fr" : "repeat(auto-fill, minmax(280px, 1fr))", gap: "20px" },
    doctorCard: { background: "#fff", borderRadius: "12px", padding: "20px", textAlign: "center", border: "1px solid #eee", boxShadow: "0 2px 8px rgba(0,0,0,0.05)", transition: "all 0.3s ease", cursor: "pointer" },
    doctorAvatar: { width: "100px", height: "100px", borderRadius: "50%", background: "#e0e7ff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "3rem", margin: "0 auto 15px" },
    doctorName: { fontSize: "1.1rem", fontWeight: "700", color: "#1a1a1a", margin: "0 0 5px 0" },
    doctorSpecialty: { fontSize: "0.9rem", color: "#3B82F6", fontWeight: "600", margin: "0 0 8px 0" },
    doctorExperience: { fontSize: "0.85rem", color: "#999", margin: "0 0 10px 0" },
    doctorSchedule: { fontSize: "0.85rem", color: "#666", margin: "0 0 10px 0" },
    doctorFee: { fontSize: "0.95rem", fontWeight: "600", color: "#1a1a1a", margin: "0 0 15px 0" },
    bookBtn: { width: "100%", padding: "10px 16px", background: "#3B82F6", color: "#fff", border: "none", borderRadius: "6px", fontSize: "0.9rem", fontWeight: "600", cursor: "pointer", transition: "all 0.3s ease" },
    statusBadge: { display: "inline-block", padding: "6px 12px", borderRadius: "20px", fontSize: "0.8rem", fontWeight: "600", marginRight: "10px" },
    statusUpcoming: { background: "#dbeafe", color: "#1e40af" },
    statusCompleted: { background: "#dcfce7", color: "#166534" },
    statusInProcess: { background: "#fef3c7", color: "#92400e" },
    appointmentFilterContainer: { display: "flex", gap: "10px", marginBottom: "20px", flexWrap: "wrap" },
    filterBtn: { padding: "8px 16px", border: "1px solid #ddd", borderRadius: "20px", background: "#fff", cursor: "pointer", fontSize: "0.9rem", fontWeight: "500", transition: "all 0.3s ease" },
  };

  return (
    <div style={styles.container}>
      {/* Sidebar */}
      <aside style={{ ...styles.sidebar, display: isMobile ? "none" : "flex" }}>
        <div style={styles.logo} onClick={() => navigate("/dashboard")}>
          <img src={logoImage} alt="AppointCare Logo" style={styles.logoIcon} />
          <span style={styles.logoText}>AppointCare</span>
        </div>

        <nav style={styles.nav}>
          <button
            style={{
              ...styles.navItem,
              background: activeMenu === "dashboard" ? "#3B82F6" : "transparent",
              color: activeMenu === "dashboard" ? "#fff" : "#666",
            }}
            onClick={() => setActiveMenu("dashboard")}
          >
            📊 {t.dashboard}
          </button>
          <button
            style={{
              ...styles.navItem,
              background: activeMenu === "calendar" ? "#3B82F6" : "transparent",
              color: activeMenu === "calendar" ? "#fff" : "#666",
            }}
            onClick={() => setActiveMenu("calendar")}
          >
            📅 {t.bookAppointments}
          </button>
          <button
            style={{
              ...styles.navItem,
              background: activeMenu === "appointments" ? "#3B82F6" : "transparent",
              color: activeMenu === "appointments" ? "#fff" : "#666",
            }}
            onClick={() => setActiveMenu("appointments")}
          >
            📋 {t.myAppointments}
          </button>
          <button
            style={{
              ...styles.navItem,
              background: activeMenu === "help" ? "#3B82F6" : "transparent",
              color: activeMenu === "help" ? "#fff" : "#666",
            }}
            onClick={() => setActiveMenu("help")}
          >
            ❓ {t.help}
          </button>
        </nav>

        <button style={styles.logoutBtn} onClick={handleLogout}>
          🚪 {t.logout}
        </button>
      </aside>

      {/* Main Content */}
      <main style={styles.main}>
        {/* Header */}
        <header style={styles.header}>
          <div style={styles.headerLeft}>
            <h1 style={styles.headerTitle}>
              Hi, {user.fullName}
            </h1>
            <p style={styles.headerSubtitle}>{t.welcomeBack}</p>
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

            {/* Notification Dropdown */}
            <div style={{ position: "relative" }}>
              <button
                onClick={() => setShowNotifications(!showNotifications)}
                style={{
                  position: "relative",
                  background: "none",
                  border: "none",
                  fontSize: "1.5rem",
                  cursor: "pointer",
                  padding: "5px 10px",
                  opacity: notificationsEnabled ? 1 : 0.5,
                  transition: "opacity 0.2s ease"
                }}
              >
                {notificationsEnabled ? <FaBell /> : <FaBellSlash />}
                {notifications.length > 0 && notificationsEnabled && (
                  <span style={{
                    position: "absolute",
                    top: "-5px",
                    right: "0px",
                    background: "#ef4444",
                    color: "#fff",
                    borderRadius: "50%",
                    width: "20px",
                    height: "20px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "0.75rem",
                    fontWeight: "bold"
                  }}>
                    {notifications.length}
                  </span>
                )}
              </button>

              {/* Notification Dropdown Menu */}
              {showNotifications && (
                <div style={{
                  position: "absolute",
                  top: "50px",
                  right: "0",
                  background: "#fff",
                  border: "1px solid #ddd",
                  borderRadius: "8px",
                  boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                  zIndex: 1000,
                  minWidth: "320px",
                  maxHeight: "400px",
                  overflowY: "auto"
                }}>
                  <div style={{ padding: "12px", borderBottom: "1px solid #eee" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px" }}>
                      <h3 style={{ margin: 0, fontSize: "0.95rem", fontWeight: "600" }}>Notifications</h3>
                      {notifications.length > 0 && (
                        <button
                          onClick={() => clearAllNotifications()}
                          style={{
                            background: "none",
                            border: "none",
                            color: "#999",
                            cursor: "pointer",
                            fontSize: "0.8rem",
                            textDecoration: "underline"
                          }}
                        >
                          Clear All
                        </button>
                      )}
                    </div>

                    {/* Notification Toggle */}
                    <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                      <label style={{ fontSize: "0.85rem", color: "#666", fontWeight: "500", flex: 1 }}>
                        Enable Notifications
                      </label>
                      <button
                        onClick={() => toggleNotifications(!notificationsEnabled)}
                        style={{
                          background: notificationsEnabled ? "#10b981" : "#ddd",
                          border: "none",
                          borderRadius: "16px",
                          width: "44px",
                          height: "24px",
                          cursor: "pointer",
                          display: "flex",
                          alignItems: "center",
                          justify: "center",
                          padding: "2px",
                          transition: "background 0.2s ease"
                        }}
                      >
                        <div style={{
                          width: "20px",
                          height: "20px",
                          borderRadius: "50%",
                          background: "#fff",
                          transform: notificationsEnabled ? "translateX(20px)" : "translateX(0)",
                          transition: "transform 0.2s ease"
                        }}></div>
                      </button>
                    </div>
                  </div>

                  {notifications.length > 0 ? (
                    <div>
                      {notifications.map((notif) => (
                        <div
                          key={notif.id}
                          style={{
                            padding: "12px",
                            borderBottom: "1px solid #f0f0f0",
                            cursor: "pointer",
                            transition: "background 0.2s ease",
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "start",
                          }}
                          onClick={() => {
                            setActiveMenu("appointments");
                            setShowNotifications(false);
                          }}
                          onMouseEnter={(e) => e.currentTarget.style.background = "#f9f9f9"}
                          onMouseLeave={(e) => e.currentTarget.style.background = "transparent"}
                        >
                          <div style={{ flex: 1 }}>
                            <p style={{ fontSize: "0.9rem", fontWeight: "600", margin: "0 0 4px 0", color: "#1a1a1a" }}>
                              Appointment booked
                            </p>
                            <p style={{ fontSize: "0.85rem", color: "#666", margin: "0 0 4px 0" }}>
                              Dr. {notif.doctorName}
                            </p>
                            <p style={{ fontSize: "0.8rem", color: "#999", margin: 0 }}>
                              {notif.date}
                            </p>
                          </div>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              clearNotification(notif.id);
                            }}
                            style={{
                              background: "none",
                              border: "none",
                              color: "#999",
                              cursor: "pointer",
                              padding: "4px 8px",
                              fontSize: "1.2rem"
                            }}
                          >
                            <FaTimes />
                          </button>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div style={{ padding: "20px", textAlign: "center" }}>
                      <p style={{ color: "#999", margin: 0, fontSize: "0.9rem" }}>No notifications</p>
                    </div>
                  )}
                </div>
              )}
            </div>

            <div 
              style={{...styles.userProfile, cursor: "pointer"}}
              onClick={() => navigate("/profile")}
            >
              <img 
                src={profileImage || "https://ui-avatars.com/api/?name=Profile&size=40&background=random"} 
                alt="Profile"
                style={{
                  width: "40px",
                  height: "40px",
                  borderRadius: "50%",
                  objectFit: "cover",
                  border: "2px solid #3B82F6"
                }}
              />
              <span style={styles.userName}>{user.fullName}</span>
            </div>
          </div>
        </header>

        {/* Content Area */}
        <div style={styles.content}>
          {activeMenu === "dashboard" && (
            <>
              {/* Hero Banner with Search */}
              <section style={styles.heroBanner}>
                <div style={styles.bannerContent}>
                  <div style={styles.bannerText}>
                    <h2 style={styles.bannerTitle}>{t.noVisitLocal}</h2>
                    <p style={styles.bannerSubtitle}>{t.getConsultation}</p>
                    <p style={styles.bannerDescription}>Your health is our priority</p>
                    <div style={{ ...styles.searchSection, position: "relative" }}>
                      <input
                        type="text"
                        placeholder="Search by doctor name or specialty"
                        style={styles.searchInput}
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        onFocus={() => setShowSearchDropdown(true)}
                        onBlur={() => setTimeout(() => setShowSearchDropdown(false), 200)}
                      />
                      <button style={styles.searchBtn}>Search</button>

                      {/* Search Dropdown */}
                      {showSearchDropdown && searchQuery.trim() && (
                        <div style={{
                          position: "absolute",
                          top: "100%",
                          left: 0,
                          right: 0,
                          background: "#fff",
                          border: "1px solid #ddd",
                          borderTop: "none",
                          borderRadius: "0 0 8px 8px",
                          boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                          zIndex: 100,
                          maxHeight: "400px",
                          overflowY: "auto"
                        }}>
                          {searchResults.length > 0 ? (
                            <div>
                              {searchResults.map((doctor) => (
                                <div
                                  key={doctor.id}
                                  onClick={() => {
                                    setSelectedDoctor(doctor);
                                    setActiveMenu("calendar");
                                    fetchAvailableDates(doctor.id);
                                    setSearchQuery("");
                                    setShowSearchDropdown(false);
                                  }}
                                  style={{
                                    padding: "12px 16px",
                                    borderBottom: "1px solid #f0f0f0",
                                    cursor: "pointer",
                                    transition: "background 0.2s ease",
                                    display: "flex",
                                    alignItems: "center",
                                    gap: "12px"
                                  }}
                                  onMouseEnter={(e) => e.currentTarget.style.background = "#f9f9f9"}
                                  onMouseLeave={(e) => e.currentTarget.style.background = "transparent"}
                                >
                                  <div style={{
                                    width: "40px",
                                    height: "40px",
                                    borderRadius: "50%",
                                    background: "#e0e7ff",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    fontSize: "1.2rem",
                                    flexShrink: 0
                                  }}>
                                    👨‍⚕️
                                  </div>
                                  <div style={{ flex: 1 }}>
                                    <p style={{ fontSize: "0.95rem", fontWeight: "600", margin: "0 0 2px 0", color: "#1a1a1a" }}>
                                      Dr. {doctor.full_name || doctor.name}
                                    </p>
                                    <p style={{ fontSize: "0.85rem", color: "#666", margin: 0 }}>
                                      {doctor.specialization || doctor.specialty}
                                    </p>
                                  </div>
                                  <div style={{ fontSize: "0.9rem", color: "#3B82F6", fontWeight: "600" }}>
                                    ₹{doctor.consultationFee || doctor.fee || "500"}
                                  </div>
                                </div>
                              ))}
                            </div>
                          ) : (
                            <div style={{
                              padding: "16px",
                              textAlign: "center",
                              color: "#999",
                              fontSize: "0.9rem"
                            }}>
                              No doctors found matching "{searchQuery}"
                            </div>
                          )}
                        </div>
                      )}
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
                  <h2 style={styles.sectionTitle}>{t.upcomingAppointments}</h2>
                  {appointments.length > 0 && (
                    <a 
                      href="#" 
                      style={styles.viewAllLink}
                      onClick={(e) => {
                        e.preventDefault();
                        setShowAllAppointments(true);
                        setActiveMenu("viewAllAppointments");
                      }}
                    >
                      View All ›
                    </a>
                  )}
                </div>

                {appointments.length > 0 ? (
                  <div style={styles.appointmentsList}>
                    {appointments.slice(0, 3).map((apt) => (
                      <div key={apt.id} style={styles.appointmentCard}>
                        <div style={styles.appointmentCardContent}>
                          <div style={styles.appointmentIcon}>📅</div>
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
                    <p style={styles.noAppointmentsText}>No upcoming appointments</p>
                  </div>
                )}
              </section>

              {/* Recommended Doctors */}
              <section style={styles.appointmentsSection}>
                <div style={styles.sectionHeader}>
                  <h2 style={styles.sectionTitle}>{t.recommendedDoctors}</h2>
                  {doctors.length > 0 && (
                    <a 
                      href="#" 
                      style={styles.viewAllLink}
                      onClick={(e) => {
                        e.preventDefault();
                        setShowAllDoctors(true);
                        setActiveMenu("viewAllDoctors");
                      }}
                    >
                      View All ›
                    </a>
                  )}
                </div>

                {doctorsLoading ? (
                  <p style={{ textAlign: "center", color: "#999" }}>Loading doctors...</p>
                ) : doctorsError ? (
                  <div style={styles.noAppointments}>
                    <p style={styles.noAppointmentsText}>{t.errorLoadingDoctors}</p>
                  </div>
                ) : doctors.length > 0 ? (
                  <div style={styles.doctorsGrid}>
                    {doctors.slice(0, 3).map((doctor) => (
                      <div key={doctor.id} style={styles.doctorCard}>
                        <div style={styles.doctorAvatar}>👨‍⚕️</div>
                        <h3 style={styles.doctorName}>Dr. {doctor.name}</h3>
                        <p style={styles.doctorSpecialty}>{doctor.specialization}</p>
                        <p style={styles.doctorExperience}>{doctor.experience} {t.yearsExperience}</p>
                        <p style={styles.doctorSchedule}>
                          {doctor.availableDays ? doctor.availableDays : t.checkAvailability}
                        </p>
                        <p style={styles.doctorFee}>₹{doctor.consultationFee || doctor.fee || "500"}</p>
                        <button 
                          style={styles.bookBtn}
                          onClick={() => {
                            setSelectedDoctor(doctor);
                            setActiveMenu("calendar");
                            fetchAvailableDates(doctor.id);
                          }}
                          onMouseEnter={(e) => e.target.style.background = "#2563eb"}
                          onMouseLeave={(e) => e.target.style.background = "#3B82F6"}
                        >
                          Book an appointment
                        </button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div style={styles.noAppointments}>
                    <p style={styles.noAppointmentsText}>{t.noDoctorsAvailable}</p>
                  </div>
                )}
              </section>

              {/* Online Remedies Section */}
              <section style={styles.appointmentsSection}>
                <div style={styles.sectionHeader}>
                  <h2 style={styles.sectionTitle}>🏥 Online Remedies & Health Tips</h2>
                </div>

                <div style={styles.doctorsGrid}>
                  {Object.entries(remedyData).map(([key, remedy]) => (
                    <div 
                      key={key} 
                      style={{
                        ...styles.doctorCard,
                        cursor: "pointer",
                        transition: "transform 0.2s ease, box-shadow 0.2s ease"
                      }}
                      onClick={() => setSelectedRemedy(key)}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.transform = "translateY(-4px)";
                        e.currentTarget.style.boxShadow = "0 8px 16px rgba(0,0,0,0.15)";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.transform = "translateY(0)";
                        e.currentTarget.style.boxShadow = "0 2px 8px rgba(0,0,0,0.05)";
                      }}
                    >
                      <div style={styles.doctorAvatar}>{remedy.emoji}</div>
                      <h3 style={styles.doctorName}>{remedy.title}</h3>
                      <p style={styles.doctorSpecialty}>{remedy.category}</p>
                      <p style={{ fontSize: "0.85rem", color: "#666", lineHeight: "1.5", marginBottom: "15px" }}>
                        {remedy.shortDesc}
                      </p>
                      <button 
                        style={{ ...styles.bookBtn, background: "#10b981" }}
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedRemedy(key);
                        }}
                      >
                        Learn More
                      </button>
                    </div>
                  ))}
                </div>
              </section>
            </>
          )}

          {/* View All Appointments */}
          {activeMenu === "viewAllAppointments" && (
            <section style={styles.appointmentsSection}>
              <div style={styles.sectionHeader}>
                <h2 style={styles.sectionTitle}>{t.allAppointments}</h2>
                <button 
                  onClick={() => setActiveMenu("dashboard")}
                  style={{ 
                    background: "none", 
                    border: "none", 
                    color: "#3B82F6", 
                    cursor: "pointer",
                    fontSize: "0.9rem",
                    fontWeight: "600"
                  }}
                >
                  ← {t.back}
                </button>
              </div>

              <div style={styles.appointmentFilterContainer}>
                <button 
                  style={{
                    ...styles.filterBtn,
                    ...(appointmentStatusFilter === "upcoming" ? styles.filterBtnActive : {})
                  }}
                  onClick={() => setAppointmentStatusFilter("upcoming")}
                >
                  {t.upcoming}
                </button>
                <button 
                  style={{
                    ...styles.filterBtn,
                    ...(appointmentStatusFilter === "inProcess" ? styles.filterBtnActive : {})
                  }}
                  onClick={() => setAppointmentStatusFilter("inProcess")}
                >
                  {t.inProcess}
                </button>
                <button 
                  style={{
                    ...styles.filterBtn,
                    ...(appointmentStatusFilter === "completed" ? styles.filterBtnActive : {})
                  }}
                  onClick={() => setAppointmentStatusFilter("completed")}
                >
                  {t.completed}
                </button>
              </div>

              {getFilteredAppointmentsByStatus().length > 0 ? (
                <div style={styles.appointmentsList}>
                  {getFilteredAppointmentsByStatus().map((apt) => (
                    <div key={apt.id} style={styles.appointmentCard}>
                      <div style={{ ...styles.appointmentCardContent, justifyContent: "space-between" }}>
                        <div style={{ flex: 1 }}>
                          <div style={{ display: "flex", gap: "10px", alignItems: "center", marginBottom: "10px" }}>
                            <span style={{ ...styles.statusBadge, ...styles[`status${appointmentStatusFilter.charAt(0).toUpperCase() + appointmentStatusFilter.slice(1)}`] }}>
                              {appointmentStatusFilter === "inProcess" ? "In Process" : appointmentStatusFilter.charAt(0).toUpperCase() + appointmentStatusFilter.slice(1)}
                            </span>
                          </div>
                          <p style={styles.appointmentDoctorName}>Dr. {apt.doctorName}</p>
                          <p style={styles.appointmentDateTime}>{apt.date} at {apt.time}</p>
                          <p style={styles.appointmentSpecialty}>{apt.specialty}</p>
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
                    {t.no} {appointmentStatusFilter === "inProcess" ? t.inProcess : appointmentStatusFilter.charAt(0).toUpperCase() + appointmentStatusFilter.slice(1)} {t.noAppointments.toLowerCase()}
                  </p>
                </div>
              )}
            </section>
          )}

          {/* View All Doctors */}
          {activeMenu === "viewAllDoctors" && (
            <section style={styles.appointmentsSection}>
              <div style={styles.sectionHeader}>
                <h2 style={styles.sectionTitle}>{t.allDoctors}</h2>
                <button 
                  onClick={() => setActiveMenu("dashboard")}
                  style={{ 
                    background: "none", 
                    border: "none", 
                    color: "#3B82F6", 
                    cursor: "pointer",
                    fontSize: "0.9rem",
                    fontWeight: "600"
                  }}
                >
                  ← {t.back}
                </button>
              </div>

              {doctorsLoading ? (
                <p style={{ textAlign: "center", color: "#999" }}>Loading doctors...</p>
              ) : doctors.length > 0 ? (
                <div style={styles.doctorsGrid}>
                  {doctors.map((doctor) => (
                    <div key={doctor.id} style={styles.doctorCard}>
                      <div style={styles.doctorAvatar}>👨‍⚕️</div>
                      <h3 style={styles.doctorName}>Dr. {doctor.name}</h3>
                      <p style={styles.doctorSpecialty}>{doctor.specialization}</p>
                      <p style={styles.doctorExperience}>{doctor.experience} {t.yearsExperience}</p>
                      <p style={styles.doctorSchedule}>
                        {doctor.availableDays ? doctor.availableDays : t.checkAvailability}
                      </p>
                      <p style={styles.doctorFee}>₹{doctor.consultationFee || doctor.fee || "500"}</p>
                      <button 
                        style={styles.bookBtn}
                        onClick={() => {
                          setSelectedDoctor(doctor);
                          setActiveMenu("calendar");
                          fetchAvailableDates(doctor.id);
                        }}
                        onMouseEnter={(e) => e.target.style.background = "#2563eb"}
                        onMouseLeave={(e) => e.target.style.background = "#3B82F6"}
                      >
                        Book an appointment
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <div style={styles.noAppointments}>
                  <p style={styles.noAppointmentsText}>{t.noDoctorsAvailable}</p>
                </div>
              )}
            </section>
          )}

          {activeMenu === "appointments" && (
            <section style={styles.appointmentsSection}>
              <div style={styles.sectionHeader}>
                <h2 style={styles.sectionTitle}>{t.myAppointments}</h2>
              </div>

              {appointments.length > 0 ? (
                <div style={styles.appointmentsList}>
                  {appointments.map((apt) => (
                    <div key={apt.id} style={{...styles.appointmentCard, padding: isMobile ? '15px' : '20px'}}>
                      <div style={{display: 'flex', flexDirection: isMobile ? 'column' : 'row', gap: isMobile ? '12px' : '20px', alignItems: isMobile ? 'flex-start' : 'center', flexWrap: 'wrap'}}>
                        <div style={{fontSize: '2rem'}}>📅</div>
                        <div style={{flex: 1, minWidth: '150px'}}>
                          <p style={{...styles.appointmentDoctorName, fontSize: isMobile ? '0.95rem' : '1rem', marginBottom: '3px'}}>
                            Dr. {apt.doctorName}
                          </p>
                          <p style={{...styles.appointmentDateTime, fontSize: isMobile ? '0.85rem' : '0.9rem', marginBottom: '3px'}}>
                            {apt.date} at {apt.time}
                          </p>
                          <p style={{...styles.appointmentSpecialty, fontSize: isMobile ? '0.8rem' : '0.85rem'}}>
                            {apt.specialty}
                          </p>
                        </div>
                        <div style={{textAlign: 'center', minWidth: '80px'}}>
                          <p style={{...styles.feeLabel, fontSize: '0.75rem', marginBottom: '3px'}}>Fee</p>
                          <p style={{...styles.feeAmount, fontSize: isMobile ? '1rem' : '1.1rem'}}>₹{apt.fee}</p>
                        </div>
                        <button
                          onClick={() => downloadAppointmentPDF(apt)}
                          style={{
                            padding: isMobile ? '10px 12px' : '8px 16px',
                            backgroundColor: '#10B981',
                            color: 'white',
                            border: 'none',
                            borderRadius: '4px',
                            cursor: 'pointer',
                            fontWeight: 'bold',
                            fontSize: isMobile ? '13px' : '14px',
                            minHeight: isMobile ? '40px' : 'auto',
                            whiteSpace: 'nowrap',
                            marginLeft: isMobile ? 0 : '10px',
                            flex: isMobile ? '1 1 100%' : '0 0 auto',
                            transition: 'background-color 0.2s ease'
                          }}
                          onMouseEnter={(e) => !isMobile && (e.target.style.backgroundColor = '#059669')}
                          onMouseLeave={(e) => !isMobile && (e.target.style.backgroundColor = '#10B981')}
                        >
                          📥 {t.downloadPDF}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div style={styles.noAppointments}>
                  <p style={styles.noAppointmentsText}>No appointments scheduled yet</p>
                </div>
              )}
            </section>
          )}

          {activeMenu === "calendar" && (
            <section style={styles.appointmentsSection}>
              <div style={styles.sectionHeader}>
                <h2 style={styles.sectionTitle}>{t.bookAnAppointment}</h2>
              </div>
              
              <div style={{ backgroundColor: 'white', padding: '30px', borderRadius: '8px' }}>
                {/* Select Doctor */}
                <div style={{ marginBottom: '30px' }}>
                  <label style={{ display: 'block', marginBottom: '10px', fontWeight: 'bold', color: '#333' }}>{t.selectDoctor}</label>
                  <select value={selectedDoctor?.id || ''} onChange={(e) => {
                    const doctor = doctors.find(d => d.id === parseInt(e.target.value));
                    setSelectedDoctor(doctor);
                    if (doctor) {
                      fetchAvailableDates(doctor.id);
                    }
                  }} style={{ width: '100%', padding: '10px', border: '1px solid #ccc', borderRadius: '4px', fontSize: '16px' }}>
                    <option value="">{t.chooseDoctor}</option>
                    {doctors.map(doc => (
                      <option key={doc.id} value={doc.id}>
                        Dr. {doc.name || doc.full_name || 'Doctor'} - {doc.specialty || doc.specialization}
                      </option>
                    ))}
                  </select>
                </div>

                {selectedDoctor && (
                  <>
                    {/* Select Date */}
                    <div style={{ marginBottom: '30px' }}>
                      <label style={{ display: 'block', marginBottom: '10px', fontWeight: 'bold', color: '#333' }}>{t.selectDate}</label>
                      {loadingDates ? (
                        <p style={{ color: '#999', textAlign: 'center' }}>{t.loadingAvailableDates}</p>
                      ) : availableDates.length > 0 ? (
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '8px' }}>
                          {availableDates.map((date) => {
                            const dateObj = new Date(date);
                            const dateStr = date;
                            return (
                              <button
                                key={dateStr}
                                onClick={() => {
                                  setSelectedDate(dateStr);
                                  fetchAvailableTimes(selectedDoctor.id, dateStr);
                                }}
                                style={{
                                  padding: '10px',
                                  border: selectedDate === dateStr ? 'none' : '1px solid #ddd',
                                  borderRadius: '4px',
                                  backgroundColor: selectedDate === dateStr ? '#3B82F6' : '#f5f5f5',
                                  color: selectedDate === dateStr ? 'white' : '#333',
                                  cursor: 'pointer',
                                  fontWeight: selectedDate === dateStr ? 'bold' : 'normal'
                                }}
                              >
                                {dateObj.getDate()}
                              </button>
                            );
                          })}
                        </div>
                      ) : (
                        <p style={{ color: '#999', textAlign: 'center' }}>{t.noAvailableDates}</p>
                      )}
                    </div>

                    {/* Select Time */}
                    {selectedDate && (
                      <div style={{ marginBottom: '30px' }}>
                        <label style={{ display: 'block', marginBottom: '10px', fontWeight: 'bold', color: '#333' }}>{t.selectTime}</label>
                        {loadingTimes ? (
                          <p style={{ color: '#999', textAlign: 'center' }}>{t.loadingAvailableTimes}</p>
                        ) : availableTimes.length > 0 ? (
                          <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                            {allSlots.map(time => {
                              const isBooked = bookedSlots.includes(time);
                              const isAvailable = availableTimes.includes(time);
                              return (
                                <button
                                  key={time}
                                  onClick={() => !isBooked && setSelectedTime(time)}
                                  disabled={isBooked}
                                  style={{
                                    padding: '10px 15px',
                                    border: isBooked ? '1px solid #ddd' : selectedTime === time ? 'none' : '1px solid #ddd',
                                    borderRadius: '4px',
                                    backgroundColor: isBooked ? '#f0f0f0' : selectedTime === time ? '#3B82F6' : '#f5f5f5',
                                    color: isBooked ? '#999' : selectedTime === time ? 'white' : '#333',
                                    cursor: isBooked ? 'not-allowed' : 'pointer',
                                    fontWeight: selectedTime === time ? 'bold' : 'normal',
                                    opacity: isBooked ? 0.5 : 1,
                                    textDecoration: isBooked ? 'line-through' : 'none'
                                  }}
                                  title={isBooked ? t.slotBooked : ''}
                                >
                                  {formatTime24To12(time)}
                                </button>
                              );
                            })}
                          </div>
                        ) : (
                          <p style={{ color: '#999', textAlign: 'center' }}>{t.noAvailableTimes}</p>
                        )}
                      </div>
                    )}

                    {/* Book Button */}
                    {selectedDate && selectedTime && (
                      <button
                        onClick={() => navigate('/book-appointment-details', { state: { doctor: selectedDoctor, date: selectedDate, time: selectedTime } })}
                        style={{
                          width: '100%',
                          padding: '15px',
                          backgroundColor: '#3B82F6',
                          color: 'white',
                          border: 'none',
                          borderRadius: '4px',
                          fontSize: '16px',
                          fontWeight: 'bold',
                          cursor: 'pointer'
                        }}
                      >
                        {t.bookNow}
                      </button>
                    )}
                  </>
                )}
              </div>
            </section>
          )}

          {activeMenu === "help" && (
            <section style={styles.appointmentsSection}>
              <div style={styles.sectionHeader}>
                <h2 style={styles.sectionTitle}>Help & Support</h2>
              </div>
              
              <div style={{ backgroundColor: 'white', padding: '30px', borderRadius: '8px' }}>
                <h3 style={{ color: '#333', marginBottom: '20px', fontSize: '18px' }}>{t.contactUs}</h3>
                
                {loadingContact ? (
                  <p style={{ color: '#999', textAlign: 'center' }}>{t.loadingContactInfo}</p>
                ) : contactInfo ? (
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px' }}>
                    {contactInfo.phone && (
                      <div style={{ padding: '15px', backgroundColor: '#f0f9ff', borderRadius: '8px', borderLeft: '4px solid #3B82F6' }}>
                        <p style={{ color: '#666', fontSize: '14px', margin: '0 0 5px 0' }}>📞 {t.phone}</p>
                        <p style={{ color: '#333', fontSize: '16px', fontWeight: 'bold', margin: 0 }}>{contactInfo.phone}</p>
                      </div>
                    )}
                    
                    {contactInfo.email && (
                      <div style={{ padding: '15px', backgroundColor: '#fef8f0', borderRadius: '8px', borderLeft: '4px solid #F59E0B' }}>
                        <p style={{ color: '#666', fontSize: '14px', margin: '0 0 5px 0' }}>📧 {t.email}</p>
                        <p style={{ color: '#333', fontSize: '16px', fontWeight: 'bold', margin: 0 }}>{contactInfo.email}</p>
                      </div>
                    )}
                    
                    {contactInfo.city && (
                      <div style={{ padding: '15px', backgroundColor: '#f0fdf4', borderRadius: '8px', borderLeft: '4px solid #10B981' }}>
                        <p style={{ color: '#666', fontSize: '14px', margin: '0 0 5px 0' }}>🏙️ {t.city}</p>
                        <p style={{ color: '#333', fontSize: '16px', fontWeight: 'bold', margin: 0 }}>{contactInfo.city}</p>
                      </div>
                    )}
                  </div>
                ) : (
                  <p style={{ color: '#999', textAlign: 'center' }}>{t.contactUnavailable}</p>
                )}
                
                {contactInfo?.address && (
                  <div style={{ marginTop: '20px', padding: '15px', backgroundColor: '#f0f3f9', borderRadius: '8px' }}>
                    <p style={{ color: '#666', fontSize: '14px', margin: '0 0 8px 0' }}>📍 {t.address}</p>
                    <p style={{ color: '#333', fontSize: '15px', margin: 0, lineHeight: '1.6' }}>{contactInfo.address}</p>
                  </div>
                )}
                
                {(contactInfo?.opening_time || contactInfo?.closing_time) && (
                  <div style={{ marginTop: '20px', padding: '15px', backgroundColor: '#f3e8ff', borderRadius: '8px' }}>
                    <p style={{ color: '#666', fontSize: '14px', margin: '0 0 8px 0' }}>🕐 {t.businessHours}</p>
                    <p style={{ color: '#333', fontSize: '15px', margin: 0 }}>
                      {contactInfo.opening_time} - {contactInfo.closing_time}
                    </p>
                  </div>
                )}
                
                <div style={{ marginTop: '30px', padding: '15px', backgroundColor: '#fef3c7', borderRadius: '8px', borderLeft: '4px solid #F59E0B' }}>
                  <p style={{ color: '#333', fontSize: '14px', margin: '0 0 10px 0', fontWeight: 'bold' }}>ℹ️ {t.helpTips}</p>
                  <ul style={{ color: '#333', fontSize: '14px', margin: 0, paddingLeft: '20px', lineHeight: '1.8' }}>
                    <li>{t.tipBookAppointments}</li>
                    <li>{t.tipViewAppointments}</li>
                    <li>{t.tipDownloadPDF}</li>
                    <li>{t.tipContactSupport}</li>
                  </ul>
                </div>
              </div>
            </section>
          )}
        </div>
      </main>

      {/* Remedy Details Modal */}
      {selectedRemedy && remedyData[selectedRemedy] && (
        <div style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: "rgba(0,0,0,0.5)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 2000,
          padding: "20px"
        }}>
          <div style={{
            background: "#fff",
            borderRadius: "12px",
            padding: "30px",
            maxWidth: "700px",
            maxHeight: "80vh",
            overflowY: "auto",
            boxShadow: "0 20px 60px rgba(0,0,0,0.3)"
          }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start", marginBottom: "20px" }}>
              <div>
                <p style={{ fontSize: "3rem", margin: "0 0 10px 0" }}>{remedyData[selectedRemedy].emoji}</p>
                <h2 style={{ margin: "0 0 5px 0", fontSize: "1.8rem", color: "#1a1a1a" }}>
                  {remedyData[selectedRemedy].title}
                </h2>
                <p style={{ margin: 0, color: "#3B82F6", fontWeight: "600" }}>
                  {remedyData[selectedRemedy].category}
                </p>
              </div>
              <button
                onClick={() => setSelectedRemedy(null)}
                style={{
                  background: "none",
                  border: "none",
                  fontSize: "1.8rem",
                  cursor: "pointer",
                  color: "#999"
                }}
              >
                ✕
              </button>
            </div>

            <div style={{
              background: "#f9fafb",
              padding: "15px",
              borderRadius: "8px",
              marginBottom: "20px",
              borderLeft: "4px solid #10b981"
            }}>
              <p style={{ margin: 0, color: "#1a1a1a", lineHeight: "1.6", whiteSpace: "pre-line" }}>
                {remedyData[selectedRemedy].fullDesc}
              </p>
            </div>

            {remedyData[selectedRemedy].tips && remedyData[selectedRemedy].tips.length > 0 && (
              <div style={{ marginBottom: "20px" }}>
                <h3 style={{ margin: "0 0 12px 0", color: "#1a1a1a", fontSize: "1.1rem" }}>Quick Tips:</h3>
                <div style={{ display: "flex", flexWrap: "wrap", gap: "10px" }}>
                  {remedyData[selectedRemedy].tips.map((tip, idx) => (
                    <span key={idx} style={{
                      background: "#e0f2fe",
                      color: "#1e40af",
                      padding: "8px 12px",
                      borderRadius: "20px",
                      fontSize: "0.85rem",
                      fontWeight: "500"
                    }}>
                      ✓ {tip}
                    </span>
                  ))}
                </div>
              </div>
            )}

            <button
              onClick={() => setSelectedRemedy(null)}
              style={{
                width: "100%",
                padding: "12px",
                background: "#10b981",
                color: "#fff",
                border: "none",
                borderRadius: "8px",
                fontSize: "1rem",
                fontWeight: "600",
                cursor: "pointer",
                marginTop: "20px"
              }}
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* Mobile Menu Button */}
      {isMobile && (
        <div style={styles.mobileMenu}>
          <button style={styles.menuBtn}>☰</button>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
