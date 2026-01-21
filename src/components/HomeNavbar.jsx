import { Link } from "react-router-dom";
import logoImage from "../images/AppointCarenobg.png";

const HomeNavbar = () => {
  const styles = {
    navbar: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      padding: "12px 40px",
      backgroundColor: "#fff",
      boxShadow: "0 2px 8px rgba(0, 0, 0, 0.08)",
      position: "fixed",
      top: 0,
      left: 0,
      right: 0,
      width: "100%",
      zIndex: 1000,
    },
    logoContainer: {
      display: "flex",
      alignItems: "center",
      gap: "10px",
      cursor: "pointer",
      textDecoration: "none",
      color: "#000",
    },
    logoImg: {
      width: "40px",
      height: "40px",
      objectFit: "contain",
    },
    logoText: {
      fontSize: "1.3rem",
      fontWeight: "700",
      color: "#1f2937",
    },
    navLinks: {
      display: "flex",
      alignItems: "center",
      gap: "30px",
    },
    navLink: {
      textDecoration: "none",
      color: "#6b7280",
      fontSize: "0.95rem",
      fontWeight: "500",
      cursor: "pointer",
      transition: "color 0.3s ease",
      ":hover": {
        color: "#1f2937",
      },
    },
    loginBtn: {
      color: "#3b82f6",
      fontWeight: "600",
    },
    registerBtn: {
      padding: "8px 20px",
      backgroundColor: "#3b82f6",
      color: "#fff",
      border: "none",
      borderRadius: "6px",
      fontSize: "0.95rem",
      fontWeight: "600",
      cursor: "pointer",
      textDecoration: "none",
      transition: "background 0.3s ease",
      display: "inline-block",
    },
  };

  return (
    <nav style={styles.navbar}>
      <Link to="/" style={styles.logoContainer}>
        <img src={logoImage} alt="AppointCare" style={styles.logoImg} />
        <span style={styles.logoText}>AppointCare</span>
      </Link>

      <div style={styles.navLinks}>
        <a href="#doctors" style={styles.navLink}>
          Book Appointments
        </a>
        <a href="#calendar" style={styles.navLink}>
          Calendar
        </a>
        <Link
          to="/login"
          style={{ ...styles.navLink, ...styles.loginBtn }}
        >
          Login
        </Link>
        <Link
          to="/register"
          style={styles.registerBtn}
        >
          Register
        </Link>
      </div>
    </nav>
  );
};

export default HomeNavbar;
