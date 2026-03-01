import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link, useNavigate } from "react-router-dom";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import { loginSchema } from "./schema/login.schema";
import { API_URL } from "../../utils/api";
import doctorImage from "../../images/docter1.png";

const Login = () => {
  const navigate = useNavigate();
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [serverError, setServerError] = useState("");
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
    resolver: zodResolver(loginSchema),
    mode: "onChange",
    defaultValues: { email: "", password: "" },
  });

  const password = watch("password");

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

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
    // Check if this is the admin account
    if (data.email === "admin1245@gmail.com" && data.password === "Admin@1245") {
      setLoading(true);
      setMessage("Admin login successful! Redirecting...");
      // Store admin credentials
      localStorage.setItem("adminEmail", "admin1245@gmail.com");
      localStorage.setItem("isAdmin", "true");
      localStorage.setItem("fullName", "Admin");
      localStorage.setItem("token", "admin-token-" + Date.now());
      
      // Redirect admin to admin dashboard
      setTimeout(() => {
        window.location.href = "/admin";
      }, 2000);
      return;
    }

    setLoading(true);
    setMessage("");
    setServerError("");

    try {
      const response = await fetch(`${API_URL}/api/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      const responseData = await response.json();

      if (response.ok) {
        setMessage("Login successful! Redirecting...");
        // Store token if provided
        if (responseData.token) {
          localStorage.setItem("token", responseData.token);
        }
        // Store user ID for appointments
        if (responseData.user && responseData.user.id) {
          localStorage.setItem("userId", responseData.user.id);
        }
        // Store fullName from user object
        if (responseData.user && responseData.user.fullName) {
          localStorage.setItem("fullName", responseData.user.fullName);
        }
        // Store email
        if (responseData.user && responseData.user.email) {
          localStorage.setItem("userEmail", responseData.user.email);
          localStorage.setItem("adminEmail", responseData.user.email);
        }
        // Store phone number
        if (responseData.user && responseData.user.phoneNumber) {
          localStorage.setItem("userPhoneNumber", responseData.user.phoneNumber);
        }
        // Store location
        if (responseData.user && responseData.user.location) {
          localStorage.setItem("location", responseData.user.location);
        }
        // Store date of birth
        if (responseData.user && responseData.user.dateOfBirth) {
          localStorage.setItem("dateOfBirth", responseData.user.dateOfBirth);
        }
        // Store gender
        if (responseData.user && responseData.user.gender) {
          localStorage.setItem("gender", responseData.user.gender);
        }
        // Store bio
        if (responseData.user && responseData.user.bio) {
          localStorage.setItem("bio", responseData.user.bio);
        }
        // Store profile image
        if (responseData.user && responseData.user.profileImage) {
          localStorage.setItem("profileImage", responseData.user.profileImage);
        }
        if (responseData.isAdmin) {
          localStorage.setItem("isAdmin", "true");
          // Redirect admin to admin dashboard
          setTimeout(() => {
            window.location.href = "/admin";
          }, 2000);
        } else {
          localStorage.setItem("isAdmin", "false");
          // Redirect regular user to dashboard
          setTimeout(() => {
            window.location.href = "/dashboard";
          }, 2000);
        }
      } else {
        setServerError(responseData.message || "Login failed");
      }
    } catch (err) {
      setServerError("Error: " + err.message);
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

      {/* Right Side - Login Form */}
      <div style={styles.formSection}>
        <button style={styles.closeButton} onClick={() => navigate("/")} title="Close">✕</button>
        
        <div style={styles.formContainer}>
          <h1 style={{...styles.title, textAlign: 'center'}}>Welcome back</h1>
          <p style={{...styles.subtitle, textAlign: 'center'}}>
            New to AppointCare? <Link to="/register" style={styles.signupLink}>Sign up</Link>
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

            <div style={styles.formGroup}>
              <label style={styles.label}>Password</label>
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
              {loading ? "Logging in..." : "Log in"}
            </button>

            <div style={styles.checkboxContainer}>
              <input
                type="checkbox"
                id="rememberMe"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                style={styles.checkbox}
              />
              <label htmlFor="rememberMe" style={styles.checkboxLabel}>
                Remember me
              </label>
              <Link to="/forgot-password" style={styles.forgotPassword}>
                Forgot password?
              </Link>
            </div>
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
  },
  formContainer: {
    width: "100%",
    maxWidth: "420px",
    padding: "clamp(20px, 4vw, 30px)",
    boxSizing: "border-box",
  },
  title: {
    fontSize: "clamp(1.3rem, 4vw, 2rem)",
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
  signupLink: {
    color: "#3B82F6",
    textDecoration: "none",
    fontWeight: "600",
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
  checkboxContainer: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: "14px",
    fontSize: "clamp(0.8rem, 2vw, 0.9rem)",
    flexWrap: "wrap",
    gap: "10px",
  },
  checkbox: {
    marginRight: "4px",
    cursor: "pointer",
  },
  checkboxLabel: {
    color: "#333",
    cursor: "pointer",
    whiteSpace: "nowrap",
    marginRight: "auto",
  },
  forgotPassword: {
    color: "#3B82F6",
    textDecoration: "none",
    fontWeight: "500",
    whiteSpace: "nowrap",
  },
  errorMessage: {
    backgroundColor: "#fee",
    color: "#c33",
    padding: "10px",
    borderRadius: "6px",
    marginBottom: "15px",
    fontSize: "clamp(0.8rem, 2vw, 0.9rem)",
    border: "1px solid #fcc",
  },
  successMessage: {
    backgroundColor: "#efe",
    color: "#3c3",
    padding: "10px",
    borderRadius: "6px",
    marginBottom: "15px",
    fontSize: "clamp(0.8rem, 2vw, 0.9rem)",
    border: "1px solid #cfc",
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

export default Login;