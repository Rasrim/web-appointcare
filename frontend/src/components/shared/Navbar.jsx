import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import logoImage from "../../images/AppointCarenobg.png";

const Navbar = () => {
  const navigate = useNavigate();
  const [hoveredLink, setHoveredLink] = useState(null);
  const [isLoginHovered, setIsLoginHovered] = useState(false);
  
  // Check if user is logged in
  const isLoggedIn = localStorage.getItem("token");
  const profileImage = localStorage.getItem("profileImage");
  const fullName = localStorage.getItem("fullName");
  
  const handleProfileClick = () => {
    navigate("/profile");
  };
  
  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };
  
  return (
    <nav style={styles.navbar}>
      <div style={styles.logoContainer}>
        <img src={logoImage} alt="AppointCare Logo" style={styles.logoImage} />
        <div style={styles.logoText}>
          Appoint<span style={{ color: "#E9D5FF" }}>Care</span>
        </div>
      </div>

      <ul style={styles.navLinks}>
        <li>
          <Link 
            to="/" 
            style={hoveredLink === "home" ? { ...styles.link, ...styles.linkHover } : styles.link}
            onMouseEnter={() => setHoveredLink("home")}
            onMouseLeave={() => setHoveredLink(null)}
          >
            Home
          </Link>
        </li>
        <li>
          <Link 
            to="/appointments" 
            style={hoveredLink === "appointments" ? { ...styles.link, ...styles.linkHover } : styles.link}
            onMouseEnter={() => setHoveredLink("appointments")}
            onMouseLeave={() => setHoveredLink(null)}
          >
            Appointments
          </Link>
        </li>
        <li>
          <Link 
            to="/doctors" 
            style={hoveredLink === "doctors" ? { ...styles.link, ...styles.linkHover } : styles.link}
            onMouseEnter={() => setHoveredLink("doctors")}
            onMouseLeave={() => setHoveredLink(null)}
          >
            Doctors
          </Link>
        </li>
        <li>
          <Link 
            to="/contact" 
            style={hoveredLink === "contact" ? { ...styles.link, ...styles.linkHover } : styles.link}
            onMouseEnter={() => setHoveredLink("contact")}
            onMouseLeave={() => setHoveredLink(null)}
          >
            Contact
          </Link>
        </li>
      </ul>

      {isLoggedIn ? (
        <div style={styles.profileSection}>
          <div style={styles.profileInfo}>
            <span style={styles.userName}>{fullName}</span>
          </div>
          <img
            src={profileImage || "https://via.placeholder.com/40?text=Profile"}
            alt="Profile"
            style={styles.profileImage}
            onClick={handleProfileClick}
            title="Click to view profile"
          />
          <button style={styles.logoutButton} onClick={handleLogout}>
            Logout
          </button>
        </div>
      ) : (
        <Link 
          to="/login" 
          style={isLoginHovered ? { ...styles.button, ...styles.buttonHover } : styles.button}
          onMouseEnter={() => setIsLoginHovered(true)}
          onMouseLeave={() => setIsLoginHovered(false)}
        >
          Login
        </Link>
      )}
    </nav>
  );
};

const styles = {
  navbar: {
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    width: "auto",
    maxWidth: "100%",
    background: "linear-gradient(135deg, #6A0DAD, #7C3AED)",
    height: "auto",
    padding: "0 40px",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
    zIndex: "1000",
  },
  logoContainer: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
  },
  logoCircle: {
    height: "40px",
    width: "40px",
    borderRadius: "50%",
    backgroundColor: "#E9D5FF",
    color: "#4C1D95",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontWeight: "700",
    fontSize: "1rem",
  },
  logoImage: {
    height: "40px",
    width: "40px",
    objectFit: "contain",
  },
  logoText: {
    fontSize: "1.6rem",
    fontWeight: "700",
    color: "#FFFFFF",
    letterSpacing: "1px",
  },
  navLinks: {
    listStyle: "none",
    display: "flex",
    gap: "30px",
    margin: 0,
    padding: 0,
  },
  link: {
    textDecoration: "none",
    color: "#F5F3FF",
    fontSize: "1rem",
    fontWeight: "500",
    transition: "color 0.3s ease",
    cursor: "pointer",
  },
  linkHover: {
    color: "#E9D5FF",
    textShadow: "0 0 8px rgba(233, 213, 255, 0.5)",
  },
  button: {
    textDecoration: "none",
    backgroundColor: "#E9D5FF",
    color: "#4C1D95",
    padding: "8px 18px",
    borderRadius: "20px",
    fontWeight: "600",
    transition: "transform 0.2s ease, box-shadow 0.2s ease",
    cursor: "pointer",
  },
  buttonHover: {
    transform: "scale(1.05)",
    boxShadow: "0 6px 16px rgba(233, 213, 255, 0.4)",
  },
  profileSection: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
  },
  profileInfo: {
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-end",
  },
  userName: {
    color: "#FFFFFF",
    fontSize: "0.9rem",
    fontWeight: "600",
  },
  profileImage: {
    width: "40px",
    height: "40px",
    borderRadius: "50%",
    objectFit: "cover",
    border: "2px solid #E9D5FF",
    cursor: "pointer",
    transition: "transform 0.2s ease",
  },
  logoutButton: {
    backgroundColor: "#E9D5FF",
    color: "#4C1D95",
    padding: "6px 14px",
    borderRadius: "15px",
    border: "none",
    fontWeight: "600",
    fontSize: "0.85rem",
    cursor: "pointer",
    transition: "all 0.2s ease",
  },
};

export default Navbar;
