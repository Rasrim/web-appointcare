import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link, useNavigate } from "react-router-dom";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import { registerSchema } from "./schema/register.schema";
import VerificationCodeInput from "../../components/VerificationCodeInput";
import doctorImage from "../../images/docter1.png";

const Register = () => {
  const navigate = useNavigate();
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [step, setStep] = useState("register"); // register, verification, success
  const [verificationEmail, setVerificationEmail] = useState("");
  const [verificationCode, setVerificationCode] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [countryCode, setCountryCode] = useState("+977");
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
    resolver: zodResolver(registerSchema),
    mode: "onChange",
    defaultValues: {
      fullName: "",
      email: "",
      phoneNumber: "",
      password: "",
      confirmPassword: "",
      birthDate: "",
    },
  });

  const password = watch("password");
  const phoneNumber = watch("phoneNumber");

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
    // Check if trying to register with admin email
    if (data.email === "admin1245@gmail.com") {
      setServerError("This email is reserved for admin. Please use a different email to register.");
      return;
    }

    setLoading(true);
    setMessage("");
    setServerError("");

    try {
      const response = await fetch("http://localhost:3000/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          fullName: data.fullName,
          email: data.email,
          password: data.password,
          phoneNumber: `${countryCode}${data.phoneNumber}`,
          birthDate: data.birthDate,
        }),
      });

      const responseData = await response.json();

      if (response.ok && responseData.requiresVerification) {
        setVerificationEmail(data.email);
        setStep("verification");
        setMessage("Verification code sent to your email. Please check and enter it below.");
      } else {
        setServerError(responseData.message || "Registration failed");
      }
    } catch (err) {
      setServerError("Error: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleVerificationSubmit = async (e) => {
    e.preventDefault();

    if (!verificationCode || verificationCode.length !== 6) {
      setServerError("Please enter a valid 6-digit code");
      return;
    }

    setLoading(true);
    setServerError("");

    try {
      const response = await fetch("http://localhost:3000/api/auth/verify-email", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: verificationEmail,
          verificationCode: verificationCode,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("fullName", data.user.fullName);
        localStorage.setItem("userEmail", data.user.email);
        setStep("success");
        setMessage("Email verified successfully!");
        setTimeout(() => {
          navigate("/dashboard");
        }, 2000);
      } else {
        setServerError(data.message || "Verification failed");
      }
    } catch (err) {
      setServerError("Error: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleResendCode = async () => {
    setLoading(true);
    setServerError("");

    try {
      const response = await fetch("http://localhost:3000/api/auth/resend-verification", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: verificationEmail,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage("New verification code sent to your email");
      } else {
        setServerError(data.message || "Failed to resend code");
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

      {/* Right Side - Register Form */}
      <div style={styles.formSection}>
        <button style={styles.closeButton} onClick={() => navigate("/")} title="Close">✕</button>
        <div style={styles.formContainer}>
          <h2 style={styles.title}><center>Create Account</center></h2>
          <p style={styles.subtitle}>
            <center>
            Already have an account? <Link to="/login" style={styles.loginLink}>Log in</Link>
            </center>
          </p>

          {message && <div style={styles.successMessage}>{message}</div>}
          {serverError && <div style={styles.errorMessage}>{serverError}</div>}

          {step === "register" && (
          <form onSubmit={handleSubmit(onSubmit)}>
            <div style={styles.formGroup}>
              <label style={styles.label}>Full Name</label>
              <input
                type="text"
                placeholder="Your Full Name"
                {...register("fullName")}
                style={{
                  ...styles.input,
                  borderColor: errors.fullName ? "#dc3545" : "#ddd",
                }}
              />
              {errors.fullName && (
                <span style={styles.errorText}>{errors.fullName.message}</span>
              )}
            </div>

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
              <label style={styles.label}>Phone Number</label>
              <div style={styles.phoneContainer}>
                <select 
                  value={countryCode} 
                  onChange={(e) => setCountryCode(e.target.value)}
                  style={styles.countrySelect}
                >
                  <option value="+977">🇳🇵 +977</option>
                  <option value="+91">🇮🇳 +91</option>
                  <option value="+1">🇺🇸 +1</option>
                  <option value="+44">🇬🇧 +44</option>
                </select>
                <input
                  type="tel"
                  placeholder="1234567890"
                  {...register("phoneNumber")}
                  maxLength="10"
                  style={{
                    ...styles.phoneInput,
                    borderColor: errors.phoneNumber ? "#dc3545" : "#ddd",
                  }}
                />
              </div>
              {errors.phoneNumber && (
                <span style={styles.errorText}>{errors.phoneNumber.message}</span>
              )}
              {countryCode === "+977" && (
                <div style={styles.phoneHelper}>
                  <span style={{
                    color: phoneNumber?.length === 10 ? "#28a745" : "#666",
                    fontWeight: "500"
                  }}>
                    {phoneNumber?.length || 0}/10 digits
                  </span>
                  {phoneNumber?.length === 10 && (
                    <span style={styles.validationIcon}>✓ Valid</span>
                  )}
                </div>
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

            <div style={styles.formGroup}>
              <label style={styles.label}>Birth Date</label>
              <input
                type="date"
                {...register("birthDate")}
                style={{
                  ...styles.input,
                  borderColor: errors.birthDate ? "#dc3545" : "#ddd",
                }}
              />
              {errors.birthDate && (
                <span style={styles.errorText}>{errors.birthDate.message}</span>
              )}
            </div>

            <button 
              type="submit" 
              style={{
                ...styles.button,
                opacity: !isValid || loading ? 0.5 : 1,
                cursor: !isValid || loading ? "not-allowed" : "pointer",
              }} 
              disabled={!isValid || loading}
            >
              {loading ? "Creating Account..." : "Sign Up"}
            </button>
          </form>
          )}

          {step === "verification" && (
          <form onSubmit={handleVerificationSubmit}>
            <div style={styles.verificationContainer}>
              <h3 style={styles.verificationTitle}>Verify Your Email</h3>
              <p style={styles.verificationSubtitle}>
                We've sent a 6-digit code to <strong>{verificationEmail}</strong>
              </p>
              
              {message && <div style={styles.successMessage}>{message}</div>}
              {serverError && <div style={styles.errorMessage}>{serverError}</div>}
              
              <div style={styles.formGroup}>
                <label style={styles.label}>Enter Verification Code</label>
                <VerificationCodeInput 
                  onCodeChange={setVerificationCode}
                  length={6}
                />
              </div>

              <button
                type="submit"
                style={{...styles.button, opacity: loading ? 0.6 : 1, cursor: loading ? "not-allowed" : "pointer"}}
                disabled={loading || verificationCode.length !== 6}
              >
                {loading ? "Verifying..." : "Verify Code"}
              </button>

              <p style={styles.resendText}>
                Didn't receive the code?{" "}
                <button
                  type="button"
                  onClick={handleResendCode}
                  style={styles.resendLink}
                  disabled={loading}
                >
                  Resend Code
                </button>
              </p>
            </div>
          </form>
          )}

          {step === "success" && (
          <div style={styles.successContainer}>
            <div style={styles.successIcon}>✓</div>
            <h3 style={styles.verificationTitle}>Email Verified!</h3>
            <p style={styles.verificationSubtitle}>
              Your account has been successfully activated.
              <br />
              Redirecting to dashboard...
            </p>
          </div>
          )}
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
    overflow: "visible",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "flex-start",
    height: "100%",
  },
  brandTitle: {
    fontSize: "clamp(2rem, 8vw, 3.5rem)",
    fontWeight: "700",
    color: "#fff",
    margin: "40px 0 30px 0",
  },
  featuresContainer: {
    marginBottom: "20px",
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
    marginTop: "auto",
    height: "100%",
    flex: 1,
    overflow: "hidden",
    display: "flex",
    alignItems: "flex-end",
    justifyContent: "center",
    width: "100%",
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
    overflow: window.innerWidth < 768 ? "visible" : "hidden",
    background: "#fff",
    minHeight: window.innerWidth < 768 ? "auto" : "auto",
    paddingTop: window.innerWidth < 768 ? "80px" : "clamp(15px, 5vw, 30px)",
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
    zIndex: 10,
  },
  formContainer: {
    width: "100%",
    maxWidth: window.innerWidth < 768 ? "100%" : "420px",
    maxHeight: window.innerWidth < 768 ? "none" : "95vh",
    overflowY: window.innerWidth < 768 ? "visible" : "auto",
    paddingRight: window.innerWidth < 768 ? "0" : "8px",
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
  loginLink: {
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
  phoneContainer: {
    display: "flex",
    gap: "8px",
    alignItems: "center",
    flexWrap: "wrap",
  },
  countrySelect: {
    padding: "12px 8px",
    border: "1px solid #ddd",
    borderRadius: "6px",
    fontSize: "clamp(0.8rem, 2vw, 0.9rem)",
    backgroundColor: "#fff",
    cursor: "pointer",
    minWidth: "90px",
  },
  phoneInput: {
    flex: 1,
    minWidth: "150px",
    padding: "12px 14px",
    border: "1px solid #ddd",
    borderRadius: "6px",
    fontSize: "clamp(0.85rem, 2vw, 0.95rem)",
    boxSizing: "border-box",
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
    marginRight: "8px",
    cursor: "pointer",
  },
  checkboxLabel: {
    color: "#333",
    cursor: "pointer",
    whiteSpace: "nowrap",
  },
  phoneHelper: {
    fontSize: "clamp(0.75rem, 2vw, 0.85rem)",
    marginTop: "6px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    color: "#666",
    flexWrap: "wrap",
  },
  validationIcon: {
    color: "#28a745",
    fontWeight: "600",
    fontSize: "0.9rem",
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
  verificationContainer: {
    textAlign: "center",
    width: "100%",
  },
  verificationTitle: {
    fontSize: "clamp(1.2rem, 3vw, 1.5rem)",
    fontWeight: "700",
    color: "#1a1a1a",
    margin: "0 0 12px 0",
  },
  verificationSubtitle: {
    fontSize: "clamp(0.85rem, 2vw, 0.95rem)",
    color: "#666",
    margin: "0 0 25px 0",
    lineHeight: "1.5",
  },
  resendText: {
    fontSize: "clamp(0.8rem, 2vw, 0.9rem)",
    color: "#666",
    margin: "20px 0 0 0",
  },
  resendLink: {
    background: "none",
    border: "none",
    color: "#3B82F6",
    cursor: "pointer",
    fontWeight: "600",
    fontSize: "inherit",
    textDecoration: "underline",
    padding: "0",
    transition: "color 0.3s",
  },
  successContainer: {
    textAlign: "center",
    padding: "40px 20px",
  },
  successIcon: {
    fontSize: "64px",
    color: "#28a745",
    marginBottom: "20px",
    fontWeight: "bold",
  },
};

export default Register;
