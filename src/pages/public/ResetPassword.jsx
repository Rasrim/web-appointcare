/* ResetPassword.jsx */

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useParams, useNavigate, Link } from "react-router-dom";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import { resetPasswordSchema } from "./schema/reset-password.schema";
import doctorImage from "../../images/docter1.png";

const ResetPassword = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [serverError, setServerError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordRequirements, setPasswordRequirements] = useState({
    minLength: false,
    hasCapital: false,
    hasNumber: false,
    hasSpecial: false,
  });
  const [showRequirements, setShowRequirements] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
    watch,
  } = useForm({
    resolver: zodResolver(resetPasswordSchema),
    mode: "onChange",
    defaultValues: { password: "", confirmPassword: "" },
  });

  const password = watch("password");

  useEffect(() => {
    // Validate token on mount
    if (!token) {
      setServerError("Invalid or missing reset token");
    }

    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [token]);

  // Validate password requirements
  useEffect(() => {
    if (password) {
      const requirements = {
        minLength: password.length >= 6,
        hasCapital: /[A-Z]/.test(password),
        hasNumber: /[0-9]/.test(password),
        hasSpecial: /[!@#$%^&*()_+\-={};":|,.<>/?]/.test(password),
      };
      setPasswordRequirements(requirements);
    }
  }, [password]);

  const onSubmit = async (data) => {
    if (!token) {
      setServerError("Invalid reset token");
      return;
    }

    setLoading(true);
    setMessage("");
    setServerError("");

    try {
      const response = await fetch("http://localhost:3000/api/auth/reset-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          token,
          password: data.password,
        }),
      });

      const responseData = await response.json();

      if (response.ok) {
        setMessage("Password reset successfully! Redirecting to login...");
        setTimeout(() => {
          navigate("/login");
        }, 2000);
      } else {
        setServerError(responseData.message || "Failed to reset password. Please try again.");
      }
    } catch (err) {
      setServerError("Error connecting to server. Please try again later.");
      console.error("Error:", err);
    } finally {
      setLoading(false);
    }
  };

  if (!token) {
    return (
      <div style={styles.container}>
        <div style={styles.errorContainer}>
          <h2 style={styles.errorTitle}>Invalid Reset Link</h2>
          <p style={styles.errorText}>
            The password reset link is invalid or has expired. Please request a new one.
          </p>
          <Link to="/forgot-password" style={styles.button}>
            Request New Reset Link
          </Link>
        </div>
      </div>
    );
  }

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

      {/* Right Side - Reset Password Form */}
      <div style={styles.formSection}>
        <Link to="/login" style={styles.closeButton}>
          ✕
        </Link>
        
        <div style={styles.formContainer}>
          <h1 style={styles.title}><center>Reset Password</center></h1>
          <p style={styles.subtitle}>
            <center>
            Enter your new password below
            </center>
          </p>

          <form onSubmit={handleSubmit(onSubmit)}>
            <div style={styles.formGroup}>
              <label style={styles.label}>New Password</label>
              <div style={styles.passwordContainer}>
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  {...register("password")}
                  onFocus={() => setShowRequirements(true)}
                  onBlur={() => setShowRequirements(password?.length > 0)}
                  style={{
                    ...styles.passwordInput,
                    borderColor: errors.password ? "#dc3545" : "#ddd",
                  }}
                />
                <button
                  type="button"
                  style={styles.eyeButton}
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <AiOutlineEyeInvisible /> : <AiOutlineEye />}
                </button>
              </div>
              {errors.password && (
                <span style={styles.errorText}>{errors.password.message}</span>
              )}
              
              {/* Password Requirements Display */}
              {showRequirements && (
                <div style={styles.requirementsBox}>
                  <p style={styles.requirementsTitle}>Password Requirements:</p>
                  <div style={styles.requirementItem}>
                    <span style={passwordRequirements.minLength ? styles.requirementMet : styles.requirementUnmet}>
                      {passwordRequirements.minLength ? "✓" : "✗"} At least 6 characters
                    </span>
                  </div>
                  <div style={styles.requirementItem}>
                    <span style={passwordRequirements.hasCapital ? styles.requirementMet : styles.requirementUnmet}>
                      {passwordRequirements.hasCapital ? "✓" : "✗"} At least 1 capital letter (A-Z)
                    </span>
                  </div>
                  <div style={styles.requirementItem}>
                    <span style={passwordRequirements.hasNumber ? styles.requirementMet : styles.requirementUnmet}>
                      {passwordRequirements.hasNumber ? "✓" : "✗"} At least 1 number (0-9)
                    </span>
                  </div>
                  <div style={styles.requirementItem}>
                    <span style={passwordRequirements.hasSpecial ? styles.requirementMet : styles.requirementUnmet}>
                      {passwordRequirements.hasSpecial ? "✓" : "✗"} At least 1 special character (!@#$%^&*)
                    </span>
                  </div>
                </div>
              )}
            </div>

            <div style={styles.formGroup}>
              <label style={styles.label}>Confirm Password</label>
              <div style={styles.passwordContainer}>
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="••••••••"
                  {...register("confirmPassword")}
                  style={{
                    ...styles.passwordInput,
                    borderColor: errors.confirmPassword ? "#dc3545" : "#ddd",
                  }}
                />
                <button
                  type="button"
                  style={styles.eyeButton}
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? <AiOutlineEyeInvisible /> : <AiOutlineEye />}
                </button>
              </div>
              {errors.confirmPassword && (
                <span style={styles.errorText}>{errors.confirmPassword.message}</span>
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
              {loading ? "Resetting..." : "Reset Password"}
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
  errorContainer: {
    width: "100%",
    maxWidth: "500px",
    padding: "40px 30px",
    textAlign: "center",
    margin: "0 auto",
  },
  errorTitle: {
    fontSize: "24px",
    fontWeight: "700",
    color: "#dc3545",
    margin: "0 0 20px 0",
  },
  errorText: {
    fontSize: "16px",
    color: "#666",
    lineHeight: "1.6",
    margin: "0 0 30px 0",
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
  },
  brandingContent: {
    textAlign: "center",
    color: "#fff",
    overflow: "hidden",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    height: "100%",
  },
  brandTitle: {
    fontSize: "clamp(2rem, 8vw, 3.5rem)",
    fontWeight: "700",
    color: "#fff",
    margin: "0 0 60px 0",
  },
  featuresContainer: {
    marginBottom: "40px",
    display: "flex",
    flexDirection: "column",
    gap: "20px",
    width: "100%",
    maxWidth: "500px",
  },
  featureItem: {
    display: "flex",
    alignItems: "center",
    gap: "20px",
    padding: "20px 25px",
    background: "rgba(0, 0, 0, 0.25)",
    borderRadius: "12px",
    backdropFilter: "blur(10px)",
  },
  featureIcon: {
    fontSize: "clamp(2rem, 5vw, 2.5rem)",
    flexShrink: 0,
    minWidth: "50px",
  },
  featureText: {
    textAlign: "left",
    margin: "0",
    fontSize: "clamp(0.8rem, 2vw, 0.95rem)",
    color: "#fff",
  },
  doctorsImage: {
    marginTop: "20px",
    height: "350px",
    width: "100%",
    maxWidth: "450px",
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
    alignItems: "center",
    justifyContent: "center",
    padding: "clamp(15px, 5vw, 30px)",
    boxSizing: "border-box",
    position: "relative",
    overflow: "hidden",
    background: "#fff",
    minHeight: window.innerWidth < 768 ? "100vh" : "auto",
  },
  closeButton: {
    position: "absolute",
    top: window.innerWidth < 768 ? "15px" : "20px",
    right: window.innerWidth < 768 ? "15px" : "20px",
    background: "none",
    border: "none",
    fontSize: "1.5rem",
    cursor: "pointer",
    color: "#333",
    textDecoration: "none",
  },
  formContainer: {
    width: "100%",
    maxWidth: window.innerWidth < 768 ? "100%" : "420px",
  },
  title: {
    fontSize: window.innerWidth < 768 ? "1.5rem" : "2rem",
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
  passwordContainer: {
    position: "relative",
    display: "flex",
    alignItems: "center",
  },
  passwordInput: {
    width: "100%",
    padding: "12px 40px 12px 14px",
    border: "1px solid #ddd",
    borderRadius: "6px",
    fontSize: "clamp(0.85rem, 2vw, 0.95rem)",
    boxSizing: "border-box",
  },
  eyeButton: {
    position: "absolute",
    right: "12px",
    background: "none",
    border: "none",
    fontSize: "1.2rem",
    cursor: "pointer",
    color: "#666",
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
    backgroundColor: "#d4edda",
    color: "#155724",
    padding: "12px",
    borderRadius: "6px",
    marginTop: "15px",
    fontSize: "clamp(0.8rem, 2vw, 0.9rem)",
    textAlign: "center",
    border: "1px solid #c3e6cb",
  },
  errorMessage: {
    backgroundColor: "#f8d7da",
    color: "#721c24",
    padding: "12px",
    borderRadius: "6px",
    marginTop: "15px",
    fontSize: "clamp(0.8rem, 2vw, 0.9rem)",
    textAlign: "center",
    border: "1px solid #f5c6cb",
  },
  requirementsBox: {
    backgroundColor: "#f9f9f9",
    border: "1px solid #ddd",
    borderRadius: "6px",
    padding: "12px",
    marginTop: "10px",
    fontSize: "clamp(0.75rem, 2vw, 0.85rem)",
  },
  requirementsTitle: {
    fontWeight: "600",
    color: "#333",
    margin: "0 0 8px 0",
    fontSize: "clamp(0.85rem, 2vw, 0.9rem)",
  },
  requirementItem: {
    marginBottom: "6px",
    display: "flex",
    alignItems: "center",
  },
  requirementMet: {
    color: "#28a745",
    fontWeight: "500",
  },
  requirementUnmet: {
    color: "#dc3545",
    fontWeight: "500",
  },
};

export default ResetPassword;
