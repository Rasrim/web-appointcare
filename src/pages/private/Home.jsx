import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import doctorImage from "../../images/doctor1.png";
import SymptomsSection from "../../components/SymptomsSection";
import HomeNavbar from "../../components/HomeNavbar";

const Home = () => {
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [fadeIn] = useState(true);

  // Fade in animation on mount
  useEffect(() => {
    // Component mounts with fade-in enabled
    return () => {};
  }, []);

  const handleResize = () => {
    setIsMobile(window.innerWidth < 768);
  };

  useEffect(() => {
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div style={{ ...styles.container, opacity: fadeIn ? 1 : 0, transition: "opacity 0.5s ease-in" }}>
      <HomeNavbar />

      {/* Hero Section */}
      <section style={styles.heroSection}>
        <div style={styles.heroContent}>
          <div style={styles.heroText}>
            <h1 style={styles.heroTitle}>
              Healthcare at Your Fingertips
            </h1>
            <p style={styles.heroSubtitle}>
              Book doctor appointments online
            </p>
            <p style={styles.heroDescription}>
              Connect with qualified healthcare professionals anytime, anywhere. Say goodbye to long waiting times and hello to convenient online consultations.
            </p>
            <div style={styles.buttonGroup}>
              <button style={styles.ctaButton}>Get Started</button>
              <button style={styles.signInButton}>Sign In</button>
            </div>
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
      

      {/* Why Choose AppointCare Section */}
      <section style={styles.whyChooseSection}>
        <h2 style={styles.whyChooseTitle}>Why Choose AppointCare?</h2>
        <div style={styles.whyChooseContainer}>
          <div 
            style={styles.whyChooseCard}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "translateY(-5px)";
              e.currentTarget.style.boxShadow = "0 8px 20px rgba(0, 0, 0, 0.1)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "translateY(0)";
              e.currentTarget.style.boxShadow = "0 2px 8px rgba(0, 0, 0, 0.05)";
            }}
          >
            <div style={styles.whyChooseIcon}>⏰</div>
            <h3 style={styles.whyChooseCardTitle}>24/7 Availability</h3>
            <p style={styles.whyChooseCardText}>Book appointments anytime that suits you best. No more waiting for clinic timings.</p>
          </div>
          <div 
            style={styles.whyChooseCard}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "translateY(-5px)";
              e.currentTarget.style.boxShadow = "0 8px 20px rgba(0, 0, 0, 0.1)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "translateY(0)";
              e.currentTarget.style.boxShadow = "0 2px 8px rgba(0, 0, 0, 0.05)";
            }}
          >
            <div style={styles.whyChooseIcon}>👨‍⚕️</div>
            <h3 style={styles.whyChooseCardTitle}>Expert Doctors</h3>
            <p style={styles.whyChooseCardText}>Access to verified and experienced healthcare professionals from various specialties.</p>
          </div>
          <div 
            style={styles.whyChooseCard}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "translateY(-5px)";
              e.currentTarget.style.boxShadow = "0 8px 20px rgba(0, 0, 0, 0.1)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "translateY(0)";
              e.currentTarget.style.boxShadow = "0 2px 8px rgba(0, 0, 0, 0.05)";
            }}
          >
            <div style={styles.whyChooseIcon}>🔒</div>
            <h3 style={styles.whyChooseCardTitle}>Secure & Private</h3>
            <p style={styles.whyChooseCardText}>Your health information is encrypted and protected with industry-standard security.</p>
          </div>
        </div>
      </section>

      {/* Symptoms Section */}
      <SymptomsSection />

      {/* Statistics Section */}
      <section style={styles.statisticsSection}>
        <div style={styles.statisticsContainer}>
          <div style={styles.statisticCard}>
            <div style={styles.statisticNumber}>50K+</div>
            <div style={styles.statisticLabel}>Happy Patients</div>
          </div>
          <div style={styles.statisticCard}>
            <div style={styles.statisticNumber}>500+</div>
            <div style={styles.statisticLabel}>Verified Doctors</div>
          </div>
          <div style={styles.statisticCard}>
            <div style={styles.statisticNumber}>100K+</div>
            <div style={styles.statisticLabel}>Appointments Booked</div>
          </div>
          <div style={styles.statisticCard}>
            <div style={styles.statisticNumber}>4.8★</div>
            <div style={styles.statisticLabel}>Average Rating</div>
          </div>
        </div>
      </section>

      {/* Ready to Book Section */}
      <section style={styles.readyToBookSection}>
        <div style={styles.readyToBookContent}>
          <h2 style={styles.readyToBookTitle}>Ready to Book Your Appointment?</h2>
          <p style={styles.readyToBookText}>Join thousands of patients who have already experienced convenient healthcare through AppointCare.</p>
          <button style={styles.readyToBookButton}>Start Now</button>
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
    display: "flex",
    justifyContent: "center",
  },
  heroContent: {
    display: "flex",
    alignItems: "center",
    gap: "clamp(30px, 5vw, 60px)",
    justifyContent: "center",
    flexWrap: "wrap",
  },
  heroText: {
    flex: 1,
    minWidth: "250px",
    textAlign: "center",
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
    color: "#3B82F6",
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
    justifyContent: "center",
    gap: "15px",
    marginBottom: "30px",
    animation: "fadeInUp 0.8s ease-out 0.5s both",
    flexWrap: "wrap",
  },
  doctorAvatar: {
    display: "flex",
    gap: "8px",
    fontSize: "clamp(1.5rem, 5vw, 2rem)",
    justifyContent: "center",
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
  },
  signInButton: {
    padding: "clamp(10px, 3vw, 14px) clamp(20px, 5vw, 32px)",
    background: "transparent",
    color: "#3B82F6",
    border: "2px solid #3B82F6",
    borderRadius: "8px",
    fontSize: "clamp(0.9rem, 2vw, 1rem)",
    fontWeight: "600",
    cursor: "pointer",
    transition: "all 0.3s ease",
    animation: "fadeInUp 0.8s ease-out 0.6s both",
  },
  buttonGroup: {
    display: "flex",
    gap: "15px",
    flexWrap: "wrap",
    marginTop: "20px",
    justifyContent: "center",
    animation: "fadeInUp 0.8s ease-out 0.6s both",
    width: "100%",
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
  whyChooseSection: {
    padding: "clamp(40px, 8vw, 80px) 20px",
    maxWidth: "1400px",
    margin: "0 auto",
    textAlign: "center",
  },
  whyChooseTitle: {
    fontSize: "clamp(1.8rem, 5vw, 2.5rem)",
    fontWeight: "700",
    marginBottom: "50px",
    color: "#1f2937",
  },
  whyChooseContainer: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
    gap: "30px",
  },
  whyChooseCard: {
    padding: "30px",
    backgroundColor: "#f9fafb",
    borderRadius: "12px",
    transition: "all 0.3s ease",
    cursor: "pointer",
    boxShadow: "0 2px 8px rgba(0, 0, 0, 0.05)",
  },
  whyChooseIcon: {
    fontSize: "3rem",
    marginBottom: "15px",
  },
  whyChooseCardTitle: {
    fontSize: "1.2rem",
    fontWeight: "700",
    marginBottom: "10px",
    color: "#1f2937",
  },
  whyChooseCardText: {
    fontSize: "0.95rem",
    color: "#6b7280",
    lineHeight: "1.6",
  },
  statisticsSection: {
    backgroundColor: "#3B82F6",
    color: "#fff",
    width: "100%",
    marginLeft: "-20px",
    marginRight: "-20px",
    padding: "clamp(40px, 8vw, 80px) 20px",
  },
  statisticsContainer: {
    display: "grid",
    gridTemplateColumns: "repeat(4, 1fr)",
    gap: "30px",
    textAlign: "center",
    maxWidth: "1400px",
    margin: "0 auto",
  },
  statisticCard: {
    padding: "30px 20px",
  },
  statisticNumber: {
    fontSize: "clamp(2rem, 6vw, 3.5rem)",
    fontWeight: "700",
    marginBottom: "10px",
  },
  statisticLabel: {
    fontSize: "1rem",
    fontWeight: "500",
  },
  readyToBookSection: {
    padding: "clamp(40px, 8vw, 80px) 20px",
    maxWidth: "1400px",
    margin: "0 auto",
    textAlign: "center",
  },
  readyToBookContent: {
    padding: "40px",
    borderRadius: "12px",
  },
  readyToBookTitle: {
    fontSize: "clamp(1.8rem, 5vw, 2.5rem)",
    fontWeight: "700",
    marginBottom: "15px",
    color: "#1f2937",
  },
  readyToBookText: {
    fontSize: "1rem",
    color: "#6b7280",
    marginBottom: "30px",
    lineHeight: "1.6",
  },
  readyToBookButton: {
    padding: "12px 30px",
    background: "#3B82F6",
    color: "#fff",
    border: "none",
    borderRadius: "6px",
    fontSize: "1rem",
    fontWeight: "600",
    cursor: "pointer",
    transition: "all 0.3s ease",
  },
};

export default Home;
