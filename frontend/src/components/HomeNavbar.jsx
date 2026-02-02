import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import logoImage from "../images/AppointCarenobg.png";

const HomeNavbar = ({ onBookAppointmentsClick }) => {
  const navigate = useNavigate();
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [showMobileMenu, setShowMobileMenu] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const styles = {
    navbar: {
      position: "fixed",
      top: 0,
      left: 0,
      right: 0,
      width: "100%",
      height: "auto",
      zIndex: 1000,
      background: "#fff",
      borderBottom: "1px solid #eee",
      boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
      padding: 0,
      margin: 0,
    },
    navContainer: {
      width: "100%",
      height: "100%",
      padding: "12px clamp(15px, 4vw, 40px)",
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      boxSizing: "border-box",
      flexWrap: isMobile ? "wrap" : "nowrap",
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
      display: isMobile ? (showMobileMenu ? "flex" : "none") : "flex",
      alignItems: "center",
      gap: "clamp(12px, 3vw, 25px)",
      flexWrap: "wrap",
      flexDirection: isMobile ? "column" : "row",
      width: isMobile ? "100%" : "auto",
      position: isMobile ? "absolute" : "static",
      top: isMobile ? "60px" : "auto",
      left: 0,
      right: 0,
      background: isMobile ? "#fff" : "transparent",
      padding: isMobile ? "15px" : "0",
      borderTop: isMobile ? "1px solid #eee" : "none",
      boxSizing: "border-box",
    },
    navLink: {
      textDecoration: "none",
      color: "#666",
      fontSize: "clamp(0.8rem, 2vw, 0.95rem)",
      fontWeight: "500",
      transition: "color 0.3s ease",
      cursor: "pointer",
      background: "none",
      border: "none",
      padding: 0,
    },
    navLinkHover: {
      color: "#3B82F6",
    },
    loginBtn: {
      color: "#3B82F6",
      textDecoration: "none",
      fontSize: "clamp(0.8rem, 2vw, 0.95rem)",
      fontWeight: "500",
      transition: "color 0.3s ease",
      cursor: "pointer",
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
      display: "inline-block",
      border: "none",
      cursor: "pointer",
    },
    hamburgerMenu: {
      display: isMobile ? "block" : "none",
      background: "none",
      border: "none",
      fontSize: "1.5rem",
      cursor: "pointer",
      color: "#666",
      padding: "5px 10px",
    },
  };

  return (
    <nav style={styles.navbar}>
      <div style={styles.navContainer}>
        <div style={styles.logo} onClick={() => navigate("/")}>
          <img src={logoImage} alt="AppointCare" style={styles.logoImg} />
          <span style={styles.logoText}>AppointCare</span>
        </div>
        {isMobile && (
          <button
            style={styles.hamburgerMenu}
            onClick={() => setShowMobileMenu(!showMobileMenu)}
          >
            {showMobileMenu ? "✕" : "☰"}
          </button>
        )}
        <div style={styles.navLinks}>
          <button
            onClick={() => {
              onBookAppointmentsClick();
              if (isMobile) setShowMobileMenu(false);
            }}
            style={styles.navLink}
            onMouseEnter={(e) => (e.target.style.color = styles.navLinkHover.color)}
            onMouseLeave={(e) => (e.target.style.color = "#666")}
          >
            Book Appointments
          </button>
          <button
            onClick={() => {
              onBookAppointmentsClick();
              if (isMobile) setShowMobileMenu(false);
            }}
            style={styles.navLink}
            onMouseEnter={(e) => (e.target.style.color = styles.navLinkHover.color)}
            onMouseLeave={(e) => (e.target.style.color = "#666")}
          >
            Calendar
          </button>
          <button
            onClick={() => {
              if (isMobile) setShowMobileMenu(false);
            }}
            style={styles.navLink}
            onMouseEnter={(e) => (e.target.style.color = styles.navLinkHover.color)}
            onMouseLeave={(e) => (e.target.style.color = "#666")}
          >
            Online Recovery
          </button>
          <Link 
            to="/login" 
            style={styles.loginBtn}
            onClick={() => {
              if (isMobile) setShowMobileMenu(false);
            }}
          >
            Login
          </Link>
          <Link 
            to="/register" 
            style={styles.registerBtn}
            onClick={() => {
              if (isMobile) setShowMobileMenu(false);
            }}
          >
            Register
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default HomeNavbar;
