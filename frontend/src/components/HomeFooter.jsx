import logoImage from "../images/AppointCarenobg.png";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const HomeFooter = () => {
  const navigate = useNavigate();
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);
  const styles = {
    footer: {
      background: "#f9f9f9",
      padding: "80px 40px 40px",
      borderTop: "1px solid #eee",
      width: "100%",
      boxSizing: "border-box",
      marginTop: "40px",
    },
    footerTopSection: {
      display: "grid",
      gridTemplateColumns: isMobile ? "1fr" : "repeat(3, 1fr)",
      gap: isMobile ? "40px" : "80px",
      maxWidth: "1400px",
      margin: "0 auto 60px",
      paddingBottom: "40px",
      borderBottom: "1px solid #eee",
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
      cursor: "pointer",
    },
    footerBottom: {
      maxWidth: "1400px",
      margin: "0 auto",
      padding: "20px 0",
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      flexWrap: "wrap",
      gap: "20px",
      flexDirection: isMobile ? "column" : "row",
    },
    footerLogoSection: {
      display: "flex",
      alignItems: "center",
      gap: "10px",
    },
    footerLogo: {
      width: "40px",
      height: "40px",
    },
    footerLogoText: {
      fontSize: "0.95rem",
      fontWeight: "600",
      color: "#1a1a1a",
    },
    footerCenterLinks: {
      display: "flex",
      gap: "30px",
      flexWrap: "wrap",
      justifyContent: "center",
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
      cursor: "pointer",
    },
  };

  const handleLinkHover = (e) => {
    e.target.style.color = "#3B82F6";
  };

  const handleLinkLeave = (e) => {
    e.target.style.color = "#999";
  };

  const handleSocialHover = (e) => {
    e.target.style.background = "#2563EB";
  };

  const handleSocialLeave = (e) => {
    e.target.style.background = "#3B82F6";
  };

  const handleSearchingClick = () => {
    const searchSection = document.getElementById("searchBar");
    if (searchSection) {
      searchSection.scrollIntoView({ behavior: "smooth" });
    } else {
      toast.warning("Search section not found");
    }
  };

  const handleBookingClick = () => {
    const calendarSection = document.getElementById("calendar");
    if (calendarSection) {
      calendarSection.scrollIntoView({ behavior: "smooth" });
    } else {
      toast.warning("Booking section not found");
    }
  };

  const handleTimeSheetClick = () => {
    toast.info("Please login to access timesheet");
    navigate("/login");
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const navigateAndScrollToTop = (path) => {
    scrollToTop();
    setTimeout(() => {
      navigate(path);
    }, 300);
  };

  return (
    <footer style={styles.footer}>
      <div style={styles.footerTopSection}>
        <div style={styles.footerSection}>
          <h4 style={styles.footerTitle}>Service</h4>
          <ul style={styles.footerList}>
            <li>
              <button
                onClick={handleSearchingClick}
                style={{...styles.footerLink, background: "none", border: "none", padding: 0, textAlign: "left"}}
                onMouseEnter={handleLinkHover}
                onMouseLeave={handleLinkLeave}
              >
                Searching
              </button>
            </li>
            <li>
              <button
                onClick={handleBookingClick}
                style={{...styles.footerLink, background: "none", border: "none", padding: 0, textAlign: "left"}}
                onMouseEnter={handleLinkHover}
                onMouseLeave={handleLinkLeave}
              >
                Booking
              </button>
            </li>
            <li>
              <button
                onClick={handleTimeSheetClick}
                style={{...styles.footerLink, background: "none", border: "none", padding: 0, textAlign: "left"}}
                onMouseEnter={handleLinkHover}
                onMouseLeave={handleLinkLeave}
              >
                TimeSheet
              </button>
            </li>
          </ul>
        </div>

        <div style={styles.footerSection}>
          <h4 style={styles.footerTitle}>Information</h4>
          <ul style={styles.footerList}>
            <li>
              <button
                onClick={() => navigateAndScrollToTop("/faq")}
                style={{...styles.footerLink, background: "none", border: "none", padding: 0, textAlign: "left"}}
                onMouseEnter={handleLinkHover}
                onMouseLeave={handleLinkLeave}
              >
                FAQ
              </button>
            </li>
            <li>
              <button
                onClick={() => navigateAndScrollToTop("/blog")}
                style={{...styles.footerLink, background: "none", border: "none", padding: 0, textAlign: "left"}}
                onMouseEnter={handleLinkHover}
                onMouseLeave={handleLinkLeave}
              >
                Blog
              </button>
            </li>
            <li>
              <button
                onClick={() => navigateAndScrollToTop("/support")}
                style={{...styles.footerLink, background: "none", border: "none", padding: 0, textAlign: "left"}}
                onMouseEnter={handleLinkHover}
                onMouseLeave={handleLinkLeave}
              >
                Support
              </button>
            </li>
          </ul>
        </div>

        <div style={styles.footerSection}>
          <h4 style={styles.footerTitle}>Company</h4>
          <ul style={styles.footerList}>
            <li>
              <button
                onClick={() => navigateAndScrollToTop("/about")}
                style={{...styles.footerLink, background: "none", border: "none", padding: 0, textAlign: "left"}}
                onMouseEnter={handleLinkHover}
                onMouseLeave={handleLinkLeave}
              >
                About us
              </button>
            </li>
            <li>
              <button
                onClick={() => navigateAndScrollToTop("/contact")}
                style={{...styles.footerLink, background: "none", border: "none", padding: 0, textAlign: "left"}}
                onMouseEnter={handleLinkHover}
                onMouseLeave={handleLinkLeave}
              >
                Contact us
              </button>
            </li>
          </ul>
        </div>
      </div>

      <div style={styles.footerBottom}>
        <div style={styles.footerLogoSection}>
          <img src={logoImage} alt="AppointCare" style={styles.footerLogo} />
          <span style={styles.footerLogoText}>AppointCare</span>
        </div>
        <div style={styles.footerCenterLinks}>
          <button
            onClick={() => navigateAndScrollToTop("/terms")}
            style={{...styles.footerLink, background: "none", border: "none", padding: 0}}
            onMouseEnter={handleLinkHover}
            onMouseLeave={handleLinkLeave}
          >
            Terms
          </button>
          <button
            onClick={() => navigateAndScrollToTop("/privacy")}
            style={{...styles.footerLink, background: "none", border: "none", padding: 0}}
            onMouseEnter={handleLinkHover}
            onMouseLeave={handleLinkLeave}
          >
            Privacy
          </button>
          <button
            onClick={() => navigateAndScrollToTop("/cookies")}
            style={{...styles.footerLink, background: "none", border: "none", padding: 0}}
            onMouseEnter={handleLinkHover}
            onMouseLeave={handleLinkLeave}
          >
            Cookies
          </button>
        </div>
      </div>
    </footer>
  );
};

export default HomeFooter;
