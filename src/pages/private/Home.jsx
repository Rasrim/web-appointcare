import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import logoImage from "../../images/AppointCarenobg.png";
import doctorImage from "../../images/doctor1.png";
import SymptomsSection from "../../components/SymptomsSection";

const Home = () => {
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [fadeIn, setFadeIn] = useState(false);

  // Fade in animation on mount
  useEffect(() => {
    setFadeIn(true);
  }, []);

  const handleResize = () => {
    setIsMobile(window.innerWidth < 768);
  };

  useEffect(() => {
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Fetch doctors
  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const response = await fetch("http://localhost:3000/api/doctors");
        if (response.ok) {
          const data = await response.json();
          setDoctors(data);
        }
      } finally {
        setLoading(false);
      }
    };
    fetchDoctors();
  }, []);

  return (
    <div style={{ ...styles.container, opacity: fadeIn ? 1 : 0, transition: "opacity 0.5s ease-in" }}>
      {/* Navbar */}
      <nav style={styles.navbar}>
        <div style={styles.navContainer}>
          <div style={styles.logo}>
            <img src={logoImage} alt="AppointCare" style={styles.logoImg} />
            <span style={styles.logoText}>AppointCare</span>
          </div>
          <div style={styles.navLinks}>
            <a href="#doctors" style={styles.navLink}>Book Appointments</a>
            <a href="#calendar" style={styles.navLink}>Calendar</a>
            <Link to="/login" style={{ ...styles.navLink, ...styles.loginBtn }}>Login</Link>
            <Link to="/register" style={styles.registerBtn}>Register</Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section style={styles.heroSection}>
        <div style={styles.heroContent}>
          <div style={styles.heroText}>
            <h1 style={styles.heroTitle}>
              No need to visit local hospitals
            </h1>
            <p style={styles.heroSubtitle}>
              Book appointments online
            </p>
            <p style={styles.heroDescription}>
              Your health is our priority
            </p>
            <div style={styles.doctorCount}>
              <div style={styles.doctorAvatar}>
                <span>👨‍⚕️</span>
                <span>👩‍⚕️</span>
              </div>
              <span style={styles.doctorCountText}>+18 doctors are available</span>
            </div>
            <button style={styles.ctaButton}>Find doctors</button>
          </div>

          {/* Hero Image */}
          {!isMobile && (
            <div style={styles.heroImage}>
              <img src={doctorImage} alt="Doctors" style={styles.heroImageTag} />
            </div>
          )}
        </div>
      </section>

      {/* Recommended Doctors Section */}
      <section style={styles.doctorsSection}>
        <div style={styles.sectionHeader}>
          <h2 style={styles.sectionTitle}>Recommended Doctors</h2>
          <a href="#" style={styles.viewAllLink}>View All ›</a>
        </div>

        {!loading && doctors.length > 0 ? (
          <div style={styles.doctorsContainer}>
            {doctors.slice(0, 3).map((doctor, index) => (
              <div key={index} style={styles.doctorCard}>
                <div style={styles.doctorImageContainer}>
                  <img 
                    src={doctor.photo || doctorImage} 
                    alt={doctor.name}
                    style={styles.doctorImage}
                  />
                </div>
                <h3 style={styles.doctorName}>{doctor.name}</h3>
                <p style={styles.doctorSpecialty}>{doctor.specialty}</p>
                <p style={styles.doctorExperience}>Specialist | {doctor.experience || "5"} years experience</p>
                <div style={styles.doctorDetails}>
                  <div style={styles.detailItem}>
                    <span style={styles.detailIcon}>📅</span>
                    <span style={styles.detailText}>{doctor.availability || "Tue, Thu"}</span>
                  </div>
                  <div style={styles.detailItem}>
                    <span style={styles.detailIcon}>₹</span>
                    <span style={styles.detailText}>{doctor.fee || "350"}</span>
                  </div>
                </div>
                <div style={styles.doctorTiming}>
                  <span style={styles.timingText}>{doctor.timing || "10:00 AM-01:00 PM"}</span>
                  <span style={styles.startingText}>Starting</span>
                </div>
                <button style={styles.appointmentBtn}>Book an appointment</button>
              </div>
            ))}
          </div>
        ) : (
          <div style={styles.noDoctorsMessage}>
            <p>Loading doctors...</p>
          </div>
        )}
      </section>

      {/* Symptoms Section */}
      <SymptomsSection />

      {/* Calendar Section for Booking */}
      <section id="calendar" style={styles.calendarSection}>
        <div style={styles.calendarWrapper}>
          <h2 style={styles.sectionTitle}>Book Your Appointment</h2>
          <p style={styles.calendarSubtitle}>Select a date and time that works best for you</p>
          
          <div style={styles.calendarContent}>
            <div style={styles.miniCalendarContainer}>
              <h3 style={styles.calendarMonthTitle}>January 2026</h3>
              <div style={styles.daysOfWeek}>
                <div style={styles.dayHeader}>Sun</div>
                <div style={styles.dayHeader}>Mon</div>
                <div style={styles.dayHeader}>Tue</div>
                <div style={styles.dayHeader}>Wed</div>
                <div style={styles.dayHeader}>Thu</div>
                <div style={styles.dayHeader}>Fri</div>
                <div style={styles.dayHeader}>Sat</div>
              </div>
              <div style={styles.daysGrid}>
                {Array.from({ length: 31 }, (_, i) => i + 1).map((day) => (
                  <button key={day} style={styles.dayButton}>
                    {day}
                  </button>
                ))}
              </div>
            </div>

            <div style={styles.timeSlotContainer}>
              <h3 style={styles.timeSlotTitle}>Available Time Slots</h3>
              <div style={styles.timeSlots}>
                {["09:00 AM", "10:00 AM", "11:00 AM", "02:00 PM", "03:00 PM", "04:00 PM", "05:00 PM"].map((time) => (
                  <button key={time} style={styles.timeSlot}>
                    {time}
                  </button>
                ))}
              </div>
              <button style={styles.bookButton}>
                <Link to="/login" style={{ textDecoration: "none", color: "inherit" }}>
                  Proceed to Book
                </Link>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer Section */}
      <footer style={styles.footer}>
        <div style={styles.footerContent}>
          <div style={styles.footerSection}>
            <h4 style={styles.footerTitle}>Service</h4>
            <ul style={styles.footerList}>
              <li><a href="#" style={styles.footerLink}>Searching</a></li>
              <li><a href="#" style={styles.footerLink}>Booking</a></li>
              <li><a href="#" style={styles.footerLink}>TimeSheet</a></li>
            </ul>
          </div>

          <div style={styles.footerSection}>
            <h4 style={styles.footerTitle}>Information</h4>
            <ul style={styles.footerList}>
              <li><a href="#" style={styles.footerLink}>FAQ</a></li>
              <li><a href="#" style={styles.footerLink}>Blog</a></li>
              <li><a href="#" style={styles.footerLink}>Support</a></li>
            </ul>
          </div>

          <div style={styles.footerSection}>
            <h4 style={styles.footerTitle}>Company</h4>
            <ul style={styles.footerList}>
              <li><a href="#" style={styles.footerLink}>About us</a></li>
              <li><a href="#" style={styles.footerLink}>Contact us</a></li>
            </ul>
          </div>
        </div>

        <div style={styles.footerBottom}>
          <div style={styles.footerLinks}>
            <a href="#" style={styles.footerLink}>Terms</a>
            <a href="#" style={styles.footerLink}>Privacy</a>
            <a href="#" style={styles.footerLink}>Cookies</a>
          </div>
          <div style={styles.socialLinks}>
            <a href="#" style={styles.socialIcon}>in</a>
            <a href="#" style={styles.socialIcon}>f</a>
            <a href="#" style={styles.socialIcon}>𝕏</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

const styles = {
  container: {
    minHeight: "100vh",
    background: "#fff",
    overflow: "hidden",
  },
  navbar: {
    position: "sticky",
    top: 0,
    zIndex: 100,
    background: "#fff",
    borderBottom: "1px solid #eee",
    boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
  },
  navContainer: {
    maxWidth: "1400px",
    margin: "0 auto",
    padding: "clamp(8px, 3vw, 12px) 20px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    flexWrap: "wrap",
    gap: "15px",
  },
  logo: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    cursor: "pointer",
    textDecoration: "none",
    color: "#1a1a1a",
  },
  logoImg: {
    height: "clamp(25px, 6vw, 35px)",
  },
  logoText: {
    fontSize: "clamp(1rem, 4vw, 1.3rem)",
    fontWeight: "700",
    color: "#1a1a1a",
  },
  navLinks: {
    display: "flex",
    alignItems: "center",
    gap: "clamp(12px, 3vw, 25px)",
    flexWrap: "wrap",
  },
  navLink: {
    textDecoration: "none",
    color: "#666",
    fontSize: "clamp(0.8rem, 2vw, 0.95rem)",
    fontWeight: "500",
    transition: "color 0.3s ease",
    cursor: "pointer",
    ":hover": {
      color: "#3B82F6",
    },
  },
  loginBtn: {
    color: "#3B82F6",
  },
  registerBtn: {
    padding: "8px 16px",
    background: "#3B82F6",
    color: "#fff",
    borderRadius: "6px",
    textDecoration: "none",
    fontWeight: "600",
    fontSize: "clamp(0.75rem, 2vw, 0.95rem)",
    transition: "all 0.3s ease",
    boxShadow: "0 2px 8px rgba(59, 130, 246, 0.3)",
    whiteSpace: "nowrap",
    ":hover": {
      background: "#2563EB",
      boxShadow: "0 4px 12px rgba(59, 130, 246, 0.4)",
    },
  },
  heroSection: {
    padding: "clamp(30px, 8vw, 60px) 20px",
    maxWidth: "1400px",
    margin: "0 auto",
    animation: "slideDown 0.8s ease-out",
  },
  heroContent: {
    display: "flex",
    alignItems: "center",
    gap: "clamp(30px, 5vw, 60px)",
    justifyContent: "space-between",
    flexWrap: "wrap",
  },
  heroText: {
    flex: 1,
    minWidth: "250px",
  },
  heroTitle: {
    fontSize: "clamp(1.8rem, 7vw, 3.5rem)",
    fontWeight: "700",
    color: "#1a1a1a",
    lineHeight: "1.2",
    marginBottom: "20px",
    animation: "fadeInUp 0.8s ease-out 0.2s both",
  },
  heroSubtitle: {
    fontSize: "clamp(1.1rem, 4vw, 1.5rem)",
    color: "#333",
    marginBottom: "12px",
    animation: "fadeInUp 0.8s ease-out 0.3s both",
  },
  heroDescription: {
    fontSize: "clamp(0.85rem, 3vw, 1rem)",
    color: "#999",
    marginBottom: "30px",
    animation: "fadeInUp 0.8s ease-out 0.4s both",
  },
  doctorCount: {
    display: "flex",
    alignItems: "center",
    gap: "15px",
    marginBottom: "30px",
    animation: "fadeInUp 0.8s ease-out 0.5s both",
    flexWrap: "wrap",
  },
  doctorAvatar: {
    display: "flex",
    gap: "8px",
    fontSize: "clamp(1.5rem, 5vw, 2rem)",
  },
  doctorCountText: {
    fontSize: "clamp(0.8rem, 2vw, 0.9rem)",
    color: "#666",
  },
  ctaButton: {
    padding: "clamp(10px, 3vw, 14px) clamp(20px, 5vw, 32px)",
    background: "#3B82F6",
    color: "#fff",
    border: "none",
    borderRadius: "8px",
    fontSize: "clamp(0.9rem, 2vw, 1rem)",
    fontWeight: "600",
    cursor: "pointer",
    transition: "all 0.3s ease",
    boxShadow: "0 4px 12px rgba(59, 130, 246, 0.3)",
    animation: "fadeInUp 0.8s ease-out 0.6s both",
    ":hover": {
      background: "#2563EB",
      boxShadow: "0 6px 16px rgba(59, 130, 246, 0.4)",
    },
  },
  heroImage: {
    flex: 1,
    textAlign: "center",
    animation: "slideInRight 0.8s ease-out 0.3s both",
    minWidth: "200px",
  },
  heroImageTag: {
    maxWidth: "100%",
    height: "auto",
  },
  doctorsSection: {
    padding: "clamp(40px, 8vw, 80px) 20px",
    maxWidth: "1400px",
    margin: "0 auto",
  },
  sectionHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "40px",
    flexWrap: "wrap",
    gap: "15px",
  },
  sectionTitle: {
    fontSize: "clamp(1.4rem, 5vw, 2rem)",
    fontWeight: "700",
    color: "#1a1a1a",
    margin: 0,
  },
  viewAllLink: {
    color: "#3B82F6",
    textDecoration: "none",
    fontSize: "clamp(0.8rem, 2vw, 0.95rem)",
    fontWeight: "600",
    transition: "color 0.3s ease",
  },
  doctorsContainer: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
    gap: "clamp(15px, 4vw, 30px)",
  },
  doctorCard: {
    background: "#fff",
    border: "1px solid #eee",
    borderRadius: "12px",
    padding: "clamp(12px, 3vw, 20px)",
    textAlign: "center",
    transition: "all 0.3s ease",
    boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
    ":hover": {
      boxShadow: "0 8px 24px rgba(0,0,0,0.12)",
      transform: "translateY(-8px)",
    },
  },
  doctorImageContainer: {
    width: "clamp(80px, 20vw, 120px)",
    height: "clamp(80px, 20vw, 120px)",
    margin: "0 auto 15px",
    borderRadius: "50%",
    overflow: "hidden",
    border: "3px solid #3B82F6",
  },
  doctorImage: {
    width: "100%",
    height: "100%",
    objectFit: "cover",
  },
  doctorName: {
    fontSize: "clamp(1rem, 4vw, 1.3rem)",
    fontWeight: "700",
    color: "#1a1a1a",
    margin: "0 0 5px 0",
  },
  doctorSpecialty: {
    fontSize: "clamp(0.8rem, 2vw, 0.95rem)",
    color: "#3B82F6",
    margin: "0 0 5px 0",
    fontWeight: "600",
  },
  doctorExperience: {
    fontSize: "clamp(0.75rem, 2vw, 0.85rem)",
    color: "#999",
    margin: "0 0 15px 0",
  },
  doctorDetails: {
    display: "flex",
    justifyContent: "center",
    gap: "clamp(15px, 3vw, 30px)",
    marginBottom: "15px",
    paddingBottom: "15px",
    borderBottom: "1px solid #eee",
    flexWrap: "wrap",
  },
  detailItem: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
  },
  detailIcon: {
    fontSize: "clamp(0.9rem, 3vw, 1.2rem)",
  },
  detailText: {
    fontSize: "clamp(0.75rem, 2vw, 0.85rem)",
    color: "#666",
  },
  doctorTiming: {
    display: "flex",
    justifyContent: "center",
    gap: "10px",
    marginBottom: "15px",
    flexWrap: "wrap",
    alignItems: "center",
  },
  timingText: {
    fontSize: "clamp(0.75rem, 2vw, 0.85rem)",
    color: "#666",
  },
  startingText: {
    fontSize: "clamp(0.7rem, 1.5vw, 0.8rem)",
    color: "#999",
  },
  appointmentBtn: {
    width: "100%",
    padding: "10px",
    background: "#3B82F6",
    color: "#fff",
    border: "none",
    borderRadius: "6px",
    fontSize: "clamp(0.85rem, 2vw, 0.95rem)",
    fontWeight: "600",
    cursor: "pointer",
    transition: "all 0.3s ease",
    boxShadow: "0 2px 8px rgba(59, 130, 246, 0.2)",
    ":hover": {
      background: "#2563EB",
      boxShadow: "0 4px 12px rgba(59, 130, 246, 0.3)",
    },
  },
  noDoctorsMessage: {
    textAlign: "center",
    padding: "clamp(20px, 5vw, 40px)",
    color: "#999",
  },
  symptomsSection: {
    padding: "clamp(40px, 8vw, 80px) 20px",
    background: "#f9f9f9",
    maxWidth: "1400px",
    margin: "0 auto",
  },
  symptomsSlider: {
    display: "flex",
    alignItems: "center",
    gap: "clamp(10px, 3vw, 20px)",
    marginTop: "40px",
  },
  sliderButton: {
    width: "44px",
    height: "44px",
    background: "#3B82F6",
    color: "#fff",
    border: "none",
    borderRadius: "50%",
    cursor: "pointer",
    fontSize: "1.2rem",
    transition: "all 0.3s ease",
    boxShadow: "0 2px 8px rgba(59, 130, 246, 0.2)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
    ":hover": {
      background: "#2563EB",
      boxShadow: "0 4px 12px rgba(59, 130, 246, 0.3)",
    },
  },
  symptomsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(80px, 1fr))",
    gap: "clamp(10px, 3vw, 20px)",
    flex: 1,
  },
  symptomCard: {
    background: "#fff",
    padding: "clamp(15px, 3vw, 25px) 10px",
    borderRadius: "12px",
    textAlign: "center",
    cursor: "pointer",
    transition: "all 0.3s ease",
    boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
    border: "1px solid #eee",
  },
  symptomIcon: {
    fontSize: "clamp(1.8rem, 5vw, 2.5rem)",
    marginBottom: "10px",
  },
  symptomName: {
    fontSize: "clamp(0.7rem, 1.5vw, 0.85rem)",
    color: "#666",
    margin: 0,
    fontWeight: "500",
  },
  footer: {
    background: "#f9f9f9",
    padding: "clamp(30px, 5vw, 60px) 20px 20px",
    borderTop: "1px solid #eee",
  },
  footerContent: {
    maxWidth: "1400px",
    margin: "0 auto",
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
    gap: "40px",
    marginBottom: "40px",
  },
  footerSection: {
    display: "flex",
    flexDirection: "column",
    gap: "12px",
  },
  footerTitle: {
    fontSize: "0.95rem",
    fontWeight: "600",
    color: "#1a1a1a",
    margin: 0,
  },
  footerList: {
    listStyle: "none",
    padding: 0,
    margin: 0,
    display: "flex",
    flexDirection: "column",
    gap: "8px",
  },
  footerLink: {
    color: "#999",
    textDecoration: "none",
    fontSize: "0.85rem",
    transition: "color 0.3s ease",
    ":hover": {
      color: "#3B82F6",
    },
  },
  footerBottom: {
    maxWidth: "1400px",
    margin: "0 auto",
    padding: "20px 0",
    borderTop: "1px solid #eee",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  footerLinks: {
    display: "flex",
    gap: "20px",
  },
  socialLinks: {
    display: "flex",
    gap: "15px",
  },
  socialIcon: {
    width: "36px",
    height: "36px",
    background: "#3B82F6",
    color: "#fff",
    borderRadius: "50%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    textDecoration: "none",
    fontSize: "0.9rem",
    fontWeight: "600",
    transition: "all 0.3s ease",
    ":hover": {
      background: "#2563EB",
    },
  },
  calendarSection: {
    padding: "clamp(40px, 8vw, 80px) 20px",
    background: "#fff",
    borderTop: "1px solid #eee",
  },
  calendarWrapper: {
    maxWidth: "1400px",
    margin: "0 auto",
  },
  calendarSubtitle: {
    fontSize: "clamp(0.95rem, 3vw, 1.1rem)",
    color: "#666",
    textAlign: "center",
    marginBottom: "40px",
    margin: "0 auto 40px",
  },
  calendarContent: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
    gap: "40px",
  },
  miniCalendarContainer: {
    background: "#f9f9f9",
    padding: "30px",
    borderRadius: "12px",
    border: "1px solid #eee",
  },
  calendarMonthTitle: {
    fontSize: "1.3rem",
    fontWeight: "700",
    color: "#1a1a1a",
    textAlign: "center",
    marginBottom: "20px",
    margin: "0 0 20px 0",
  },
  daysOfWeek: {
    display: "grid",
    gridTemplateColumns: "repeat(7, 1fr)",
    gap: "8px",
    marginBottom: "15px",
  },
  dayHeader: {
    textAlign: "center",
    fontWeight: "700",
    color: "#666",
    fontSize: "0.85rem",
  },
  daysGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(7, 1fr)",
    gap: "8px",
  },
  dayButton: {
    padding: "12px",
    border: "1px solid #ddd",
    borderRadius: "6px",
    background: "#fff",
    cursor: "pointer",
    fontSize: "0.95rem",
    fontWeight: "600",
    color: "#333",
    transition: "all 0.3s ease",
  },
  timeSlotContainer: {
    background: "linear-gradient(135deg, #3B82F6 0%, #2563EB 100%)",
    color: "#fff",
    padding: "30px",
    borderRadius: "12px",
  },
  timeSlotTitle: {
    fontSize: "1.3rem",
    fontWeight: "700",
    color: "#fff",
    marginBottom: "20px",
    margin: "0 0 20px 0",
  },
  timeSlots: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(110px, 1fr))",
    gap: "10px",
    marginBottom: "30px",
  },
  timeSlot: {
    padding: "12px",
    background: "rgba(255, 255, 255, 0.2)",
    border: "2px solid rgba(255, 255, 255, 0.3)",
    borderRadius: "6px",
    color: "#fff",
    cursor: "pointer",
    fontWeight: "600",
    transition: "all 0.3s ease",
  },
  bookButton: {
    width: "100%",
    padding: "15px",
    background: "#fff",
    color: "#3B82F6",
    border: "none",
    borderRadius: "6px",
    fontSize: "1rem",
    fontWeight: "700",
    cursor: "pointer",
    transition: "all 0.3s ease",
  },
};

export default Home;
