/* ForgotPassword.jsx */

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { API_URL } from "../../utils/api";
import { Link, useNavigate } from "react-router-dom";
import { AiOutlineArrowLeft } from "react-icons/ai";
import { forgotPasswordSchema } from "./schema/forgot-password.schema";
import doctorImage from "../../images/docter1.png";

const ForgotPassword = () => {
  const navigate = useNavigate();
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [serverError, setServerError] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm({
    resolver: zodResolver(forgotPasswordSchema),
    mode: "onChange",
    defaultValues: { email: "" },
  });

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const onSubmit = async (data) => {
    setLoading(true);
    setMessage("");
    setServerError("");

    try {
      const response = await fetch(`${API_URL}/api/auth/forgot-password`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      const responseData = await response.json();

      if (response.ok) {
        setMessage("Password reset link has been sent to your email!");
        // Redirect to login after 2 seconds
        setTimeout(() => {
          navigate("/login");
        }, 2000);
      } else {
        setServerError(responseData.message || "Failed to send reset link. Please try again.");
      }
    } catch (err) {
      setServerError("Error connecting to server. Please try again later.");
      console.error("Error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      {/* Left Side - Branding - Hidden on Mobile */}
      {!isMobile && (
        <div style={styles.brandingSection}>
          <div style={styles.brandingContent}>
            <h1 style={styles.brandTitle}>AppointCare</h1>
            <div style={styles.featuresContainer}>
              <div style={styles.featureItem}>
                <span style={styles.featureIcon}>🔍</span>
                <p style={styles.featureText}>
                  <strong>Well qualified doctors</strong>
                  <br />
                  <small>Treat with utmost care</small>
                </p>
              </div>
              <div style={styles.featureItem}>
                <span style={styles.featureIcon}>📅</span>
                <p style={styles.featureText}>
                  <strong>Book an appointment</strong>
                  <br />
                  <small>Book and visit doctor easily</small>
                </p>
              </div>
            </div>
            <div style={styles.doctorsImage}>
              <img 
                src={doctorImage} 
                alt="Doctors" 
                style={styles.doctorImageTag}
              />
            </div>
          </div>
        </div>
      )}

      {/* Right Side - Forgot Password Form */}
      <div style={styles.formSection}>
        <Link to="/login" style={styles.backButton}>
          <AiOutlineArrowLeft style={styles.backIcon} /> Back to Login
        </Link>
        
        <div style={styles.formContainer}>
          <h2 style={styles.title}>Forgot Password?</h2>
          <p style={styles.subtitle}>
            Enter your email address and we'll send you a link to reset your password
          </p>

          <form onSubmit={handleSubmit(onSubmit)}>
            <div style={styles.formGroup}>
              <label style={styles.label}>Email address</label>
              <input
                type="email"
                placeholder="abc@gmail.com"
                {...register("email")}
                style={{
                  ...styles.input,
                  borderColor: errors.email ? "#dc3545" : "#ddd",
                }}
              />
              {errors.email && (
                <span style={styles.errorText}>{errors.email.message}</span>
              )}
            </div>

            {message && <div style={styles.successMessage}>{message}</div>}
            {serverError && <div style={styles.errorMessage}>{serverError}</div>}

            <button 
              type="submit" 
              style={{
                ...styles.button,
                opacity: !isValid || loading ? 0.5 : 1,
                cursor: !isValid || loading ? "not-allowed" : "pointer",
              }} 
              disabled={!isValid || loading}
            >
              {loading ? "Sending..." : "Send Reset Link"}
            </button>

            <p style={styles.footerText}>
              Remember your password? <Link to="/login" style={styles.loginLink}>Log in</Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

const styles = {
  container: {
    height: "100vh",
    width: "100%",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    background: "#fff",
    boxSizing: "border-box",
    overflow: "hidden",
    flexDirection: window.innerWidth < 768 ? "column" : "row",
  },
  brandingSection: {
    flex: 1,
    height: "100%",
    background: "linear-gradient(135deg, #7B9BA8 0%, #8FA8B4 100%)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "20px",
    boxSizing: "border-box",
    overflow: "hidden",
    "@media (maxWidth: 768px)": {
      display: "none",
    },
  },
  brandingContent: {
    textAlign: "center",
    color: "#fff",
    overflow: "hidden",
  },
  brandTitle: {
    fontSize: "clamp(2rem, 8vw, 3.5rem)",
    fontWeight: "700",
    color: "#fff",
    margin: "100px 0 50px 0",
  },
  featuresContainer: {
    marginBottom: "40px",
    maxHeight: "400px",
    overflowY: "auto",
  },
  featureItem: {
    display: "flex",
    alignItems: "center",
    gap: "15px",
    marginBottom: "15px",
    background: "rgba(255, 255, 255, 0.2)",
    padding: "12px 18px",
    borderRadius: "8px",
    backdropFilter: "blur(10px)",
  },
  featureIcon: {
    fontSize: "clamp(1.5rem, 5vw, 2rem)",
    flexShrink: 0,
  },
  featureText: {
    textAlign: "left",
    margin: "0",
    fontSize: "clamp(0.8rem, 2vw, 0.95rem)",
    color: "#fff",
  },
  doctorsImage: {
    marginTop: "10px",
    height: "400px",
    overflow: "hidden",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  doctorImageTag: {
    width: "100%",
    height: "100%",
    objectFit: "contain",
  },
  formSection: {
    flex: window.innerWidth < 768 ? "none" : 1,
    width: window.innerWidth < 768 ? "100%" : "auto",
    height: window.innerWidth < 768 ? "auto" : "100%",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    padding: "clamp(15px, 5vw, 30px)",
    boxSizing: "border-box",
    position: "relative",
    overflow: "hidden",
    background: "#fff",
    minHeight: window.innerWidth < 768 ? "100vh" : "auto",
  },
  backButton: {
    position: "absolute",
    top: "clamp(12px, 3vw, 20px)",
    left: "clamp(12px, 3vw, 30px)",
    background: "none",
    border: "none",
    fontSize: "clamp(0.85rem, 2vw, 0.95rem)",
    cursor: "pointer",
    color: "#3B82F6",
    textDecoration: "none",
    fontWeight: "500",
    display: "flex",
    alignItems: "center",
    gap: "8px",
  },
  backIcon: {
    fontSize: "1.2rem",
  },
  formContainer: {
    width: "100%",
    maxWidth: window.innerWidth < 768 ? "100%" : "420px",
  },
  title: {
    fontSize: "clamp(1.3rem, 5vw, 2rem)",
    fontWeight: "700",
    color: "#1a1a1a",
    margin: "0 0 8px 0",
    textAlign: "left",
  },
  subtitle: {
    fontSize: "clamp(0.8rem, 2vw, 0.9rem)",
    color: "#666",
    margin: "0 0 25px 0",
    textAlign: "left",
    lineHeight: "1.5",
  },
  formGroup: {
    marginBottom: "clamp(12px, 3vw, 18px)",
  },
  label: {
    display: "block",
    fontSize: "clamp(0.8rem, 2vw, 0.9rem)",
    fontWeight: "500",
    marginBottom: "6px",
    color: "#333",
    textAlign: "left",
  },
  input: {
    width: "100%",
    padding: "12px 14px",
    border: "1px solid #ddd",
    borderRadius: "6px",
    fontSize: "clamp(0.85rem, 2vw, 0.95rem)",
    boxSizing: "border-box",
    transition: "border-color 0.3s",
  },
  errorText: {
    display: "block",
    color: "#dc3545",
    fontSize: "0.85rem",
    marginTop: "4px",
  },
  button: {
    width: "100%",
    padding: "12px",
    background: "#3B82F6",
    color: "#fff",
    border: "none",
    borderRadius: "6px",
    fontSize: "clamp(0.9rem, 2vw, 1rem)",
    fontWeight: "600",
    cursor: "pointer",
    marginTop: "15px",
    transition: "background-color 0.3s",
  },
  footerText: {
    textAlign: "center",
    marginTop: "20px",
    fontSize: "clamp(0.8rem, 2vw, 0.9rem)",
    color: "#666",
  },
  loginLink: {
    color: "#3B82F6",
    textDecoration: "none",
    fontWeight: "600",
  },
  successMessage: {
    color: "#10b981",
    marginTop: "15px",
    padding: "10px",
    backgroundColor: "#f0fdf4",
    borderRadius: "6px",
    fontSize: "clamp(0.8rem, 2vw, 0.9rem)",
    textAlign: "center",
    border: "1px solid #10b981",
  },
  errorMessage: {
    color: "#dc3545",
    marginTop: "15px",
    padding: "10px",
    backgroundColor: "#fef2f2",
    borderRadius: "6px",
    fontSize: "clamp(0.8rem, 2vw, 0.9rem)",
    textAlign: "center",
    border: "1px solid #dc3545",
  },
};

export default ForgotPassword;
