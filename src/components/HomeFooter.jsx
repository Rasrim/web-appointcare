import logoImage from "../images/AppointCarenobg.png";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

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
      padding: "60px 40px 40px",
      borderTop: "1px solid #eee",
      width: "100%",
      boxSizing: "border-box",
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

  return (
    <footer style={styles.footer}>
      <div style={styles.footerTopSection}>
        <div style={styles.footerSection}>
          <h4 style={styles.footerTitle}>Service</h4>
          <ul style={styles.footerList}>
            <li>
              <a
                href="#"
                style={styles.footerLink}
                onMouseEnter={handleLinkHover}
                onMouseLeave={handleLinkLeave}
              >
                Searching
              </a>
            </li>
            <li>
              <a
                href="#"
                style={styles.footerLink}
                onMouseEnter={handleLinkHover}
                onMouseLeave={handleLinkLeave}
              >
                Booking
              </a>
            </li>
            <li>
              <a
                href="#"
                style={styles.footerLink}
                onMouseEnter={handleLinkHover}
                onMouseLeave={handleLinkLeave}
              >
                TimeSheet
              </a>
            </li>
          </ul>
        </div>

        <div style={styles.footerSection}>
          <h4 style={styles.footerTitle}>Information</h4>
          <ul style={styles.footerList}>
            <li>
              <button
                onClick={() => navigate("/faq")}
                style={{...styles.footerLink, background: "none", border: "none", padding: 0, textAlign: "left"}}
                onMouseEnter={handleLinkHover}
                onMouseLeave={handleLinkLeave}
              >
                FAQ
              </button>
            </li>
            <li>
              <button
                onClick={() => navigate("/blog")}
                style={{...styles.footerLink, background: "none", border: "none", padding: 0, textAlign: "left"}}
                onMouseEnter={handleLinkHover}
                onMouseLeave={handleLinkLeave}
              >
                Blog
              </button>
            </li>
            <li>
              <button
                onClick={() => navigate("/support")}
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
                onClick={() => navigate("/about")}
                style={{...styles.footerLink, background: "none", border: "none", padding: 0, textAlign: "left"}}
                onMouseEnter={handleLinkHover}
                onMouseLeave={handleLinkLeave}
              >
                About us
              </button>
            </li>
            <li>
              <button
                onClick={() => navigate("/contact")}
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
            onClick={() => navigate("/terms")}
            style={{...styles.footerLink, background: "none", border: "none", padding: 0}}
            onMouseEnter={handleLinkHover}
            onMouseLeave={handleLinkLeave}
          >
            Terms
          </button>
          <button
            onClick={() => navigate("/privacy")}
            style={{...styles.footerLink, background: "none", border: "none", padding: 0}}
            onMouseEnter={handleLinkHover}
            onMouseLeave={handleLinkLeave}
          >
            Privacy
          </button>
          <button
            onClick={() => navigate("/cookies")}
            style={{...styles.footerLink, background: "none", border: "none", padding: 0}}
            onMouseEnter={handleLinkHover}
            onMouseLeave={handleLinkLeave}
          >
            Cookies
          </button>
        </div>
        <div style={styles.socialLinks}>
          <a
            href="#"
            style={styles.socialIcon}
            onMouseEnter={handleSocialHover}
            onMouseLeave={handleSocialLeave}
          >
            in
          </a>
          <a
            href="#"
            style={styles.socialIcon}
            onMouseEnter={handleSocialHover}
            onMouseLeave={handleSocialLeave}
          >
            f
          </a>
          <a
            href="#"
            style={styles.socialIcon}
            onMouseEnter={handleSocialHover}
            onMouseLeave={handleSocialLeave}
          >
            𝕏
          </a>
        </div>
      </div>
    </footer>
  );
};

export default HomeFooter;
