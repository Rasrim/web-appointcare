import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link, useNavigate } from "react-router-dom";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import { registerSchema } from "./schema/register.schema";
import { API_URL } from "../../utils/api";
import doctorImage from "../../images/docter1.png";

// Load reCAPTCHA script
const loadRecaptchaScript = () => {
  return new Promise((resolve) => {
    if (window.grecaptcha) {
      resolve();
      return;
    }
    
    const script = document.createElement('script');
    script.src = 'https://www.google.com/recaptcha/api.js';
    script.async = true;
    script.defer = true;
    script.onload = () => resolve();
    document.head.appendChild(script);
  });
};

const Register = () => {
  const navigate = useNavigate();
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [recaptchaToken, setRecaptchaToken] = useState("");
  const [recaptchaLoaded, setRecaptchaLoaded] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [countryCode, setCountryCode] = useState("+977");
  const [selectedGender, setSelectedGender] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [serverError, setServerError] = useState("");
  const [showTermsModal, setShowTermsModal] = useState(false);
  const [passwordRequirements, setPasswordRequirements] = useState({
    minLength: false,
    hasCapital: false,
    hasNumber: false,
    hasSpecial: false,
  });
  const [showRequirements, setShowRequirements] = useState(false);

  const RECAPTCHA_SITE_KEY = process.env.REACT_APP_RECAPTCHA_SITE_KEY || '6Lf6lFgsAAAAACyWkWW7dw5QxDmMDkFy2B0xPwo0';

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
      gender: "",
      password: "",
      confirmPassword: "",
      birthDate: "",
      agreeToTerms: false,
    },
  });

  const password = watch("password");
  const phoneNumber = watch("phoneNumber");

  // Load reCAPTCHA script on mount
  useEffect(() => {
    loadRecaptchaScript().then(() => {
      setRecaptchaLoaded(true);
    });
  }, []);

  useEffect(() => {
    if (recaptchaLoaded && window.grecaptcha) {
      window.grecaptcha.ready(() => {
        window.grecaptcha.render("recaptcha-container", {
          sitekey: RECAPTCHA_SITE_KEY,
          callback: onRecaptchaChange,
          theme: "light",
        });
      });
    }
  }, [recaptchaLoaded]);

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

  const onRecaptchaChange = (token) => {
    setRecaptchaToken(token);
    setMessage("");
  };

  const onSubmit = async (data) => {
    // Check reCAPTCHA
    if (!recaptchaToken) {
      setServerError("Please complete the reCAPTCHA verification");
      return;
    }

    // Check if trying to register with admin email
    if (data.email === "admin1245@gmail.com") {
      setServerError("This email is reserved for admin. Please use a different email to register.");
      return;
    }

    setLoading(true);
    setMessage("");
    setServerError("");

    try {
      const response = await fetch(`${API_URL}/api/auth/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          fullName: data.fullName,
          email: data.email,
          password: data.password,
          phoneNumber: `${countryCode}${data.phoneNumber}`,
          gender: selectedGender,
          birthDate: data.birthDate,
          recaptchaToken: recaptchaToken,
        }),
      });

      const responseData = await response.json();

      if (response.ok && responseData.verified) {
        // Store user data
        localStorage.setItem("token", responseData.token);
        localStorage.setItem("fullName", responseData.user.fullName);
        localStorage.setItem("userEmail", responseData.user.email);
        
        setMessage("Registration successful! Redirecting to dashboard...");
        setTimeout(() => {
          navigate("/dashboard");
        }, 2000);
      } else {
        setServerError(responseData.message || "Registration failed");
      }
    } catch (err) {
      setServerError("Error: " + err.message);
    return (
      <div style={styles.container}>
        {/* reCAPTCHA widget for registration */}
        <div id="recaptcha-container" style={{ marginBottom: 16 }}></div>
        {/* Left Side - Branding - Hidden on Mobile */}
        {!isMobile && (
          <div style={styles.brandingSection}>
            <div style={styles.brandingContent}>
              <h1 style={styles.brandTitle}>AppointCare</h1>
              <div style={styles.featuresContainer}>
                <div style={styles.featureItem}>
                  <span style={styles.featureIcon}>
                    <strong>Well qualified doctors</strong><br />
                    <small>Treat with utmost care</small>
                  </span>
                  <p style={styles.featureText}>
                    ...existing code...
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
          <h2 style={{...styles.title, textAlign: 'center'}}>Create Account</h2>
          <p style={{...styles.subtitle, textAlign: 'center'}}>
            Already have an account? <Link to="/login" style={styles.loginLink}>Log in</Link>
          </p>

          {message && <div style={styles.successMessage}>{message}</div>}
          {serverError && <div style={styles.errorMessage}>{serverError}</div>}

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
            </div>

            <div style={styles.formGroup}>
              <label style={styles.label}>Gender</label>
              <div style={styles.genderContainer}>
                <button
                  type="button"
                  onClick={() => setSelectedGender("Male")}
                  style={{
                    ...styles.genderButton,
                    backgroundColor: selectedGender === "Male" ? "#3B82F6" : "#f0f0f0",
                    color: selectedGender === "Male" ? "#fff" : "#333",
                    borderColor: selectedGender === "Male" ? "#3B82F6" : "#ddd",
                  }}
                >
                  👨 Male
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedGender("Female")}
                  style={{
                    ...styles.genderButton,
                    backgroundColor: selectedGender === "Female" ? "#3B82F6" : "#f0f0f0",
                    color: selectedGender === "Female" ? "#fff" : "#333",
                    borderColor: selectedGender === "Female" ? "#3B82F6" : "#ddd",
                  }}
                >
                  👩 Female
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedGender("Other")}
                  style={{
                    ...styles.genderButton,
                    backgroundColor: selectedGender === "Other" ? "#3B82F6" : "#f0f0f0",
                    color: selectedGender === "Other" ? "#fff" : "#333",
                    borderColor: selectedGender === "Other" ? "#3B82F6" : "#ddd",
                  }}
                >
                  🧑 Other
                </button>
              </div>
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
                      {passwordRequirements.hasCapital ? "✓" : "✗"} At least one uppercase letter
                    </span>
                  </div>
                  <div style={styles.requirementItem}>
                    <span style={passwordRequirements.hasNumber ? styles.requirementMet : styles.requirementUnmet}>
                      {passwordRequirements.hasNumber ? "✓" : "✗"} At least one number
                    </span>
                  </div>
                  <div style={styles.requirementItem}>
                    <span style={passwordRequirements.hasSpecial ? styles.requirementMet : styles.requirementUnmet}>
                      {passwordRequirements.hasSpecial ? "✓" : "✗"} At least one special character
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
              <label style={styles.label}>Date of Birth</label>
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

            {/* reCAPTCHA Widget */}
            <div style={styles.recaptchaContainer}>
              <div id="recaptcha-container" style={styles.recaptchaBox}></div>
              {!recaptchaToken && (
                <p style={styles.recaptchaWarning}>🔒 Please verify that you're human</p>
              )}
              {recaptchaToken && (
                <p style={styles.recaptchaSuccess}>✓ Verified!</p>
              )}
            </div>

            <div style={styles.termsContainer}>
              <input
                type="checkbox"
                id="agreeToTerms"
                {...register("agreeToTerms")}
                style={styles.checkbox}
              />
              <label htmlFor="agreeToTerms" style={styles.termsLabel}>
                I agree to the{" "}
                <button
                  type="button"
                  onClick={() => setShowTermsModal(true)}
                  style={styles.termsLink}
                >
                  Terms and Conditions
                </button>
              </label>
              {errors.agreeToTerms && (
                <div style={styles.errorText}>{errors.agreeToTerms.message}</div>
              )}
            </div>

            <button
              type="submit"
              disabled={loading || !recaptchaToken || !isValid}
              style={{
                ...styles.submitButton,
                opacity: (loading || !recaptchaToken || !isValid) ? 0.6 : 1,
                cursor: (loading || !recaptchaToken || !isValid) ? "not-allowed" : "pointer",
              }}
            >
              {loading ? "Creating Account..." : "Create Account"}
            </button>
          </form>

          <div style={styles.divider}>or</div>

          <button style={styles.googleButton}>
            <img src="https://www.google.com/favicon.ico" alt="Google" style={styles.googleIcon} />
            Sign up with Google
          </button>
        </div>
      </div>

      {/* Terms Modal */}
      {showTermsModal && (
        <div style={styles.modalOverlay} onClick={() => setShowTermsModal(false)}>
          <div style={styles.modal} onClick={(e) => e.stopPropagation()}>
            <h3>Terms and Conditions</h3>
            <div style={styles.modalContent}>
              <p>Your terms and conditions content here...</p>
            </div>
            <button onClick={() => setShowTermsModal(false)} style={styles.modalCloseButton}>
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

const styles = {
  container: {
    display: "flex",
    height: "100vh",
    backgroundColor: "#f5f5f5",
  },
  brandingSection: {
    flex: 1,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
    color: "#fff",
    padding: "40px",
  },
  brandingContent: {
    textAlign: "center",
  },
  brandTitle: {
    fontSize: "3em",
    marginBottom: "40px",
    fontWeight: "bold",
  },
  featuresContainer: {
    display: "flex",
    flexDirection: "column",
    gap: "30px",
    marginBottom: "40px",
  },
  featureItem: {
    display: "flex",
    alignItems: "center",
    gap: "15px",
  },
  featureIcon: {
    fontSize: "2.5em",
  },
  featureText: {
    marginLeft: "10px",
  },
  doctorsImage: {
    marginTop: "40px",
  },
  doctorImageTag: {
    width: "200px",
    height: "auto",
  },
  formSection: {
    flex: 1,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "40px 20px",
    position: "relative",
  },
  formContainer: {
    width: "100%",
    maxWidth: "450px",
    backgroundColor: "#fff",
    padding: "40px",
    borderRadius: "8px",
    boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
  },
  closeButton: {
    position: "absolute",
    top: "20px",
    right: "20px",
    background: "none",
    border: "none",
    fontSize: "24px",
    cursor: "pointer",
    color: "#666",
  },
  title: {
    fontSize: "28px",
    fontWeight: "bold",
    marginBottom: "10px",
  },
  subtitle: {
    color: "#666",
    marginBottom: "30px",
    fontSize: "14px",
  },
  loginLink: {
    color: "#3B82F6",
    textDecoration: "none",
    fontWeight: "bold",
    cursor: "pointer",
  },
  successMessage: {
    backgroundColor: "#d4edda",
    color: "#155724",
    padding: "12px",
    borderRadius: "4px",
    marginBottom: "20px",
    textAlign: "center",
  },
  errorMessage: {
    backgroundColor: "#f8d7da",
    color: "#721c24",
    padding: "12px",
    borderRadius: "4px",
    marginBottom: "20px",
    textAlign: "center",
  },
  formGroup: {
    marginBottom: "20px",
  },
  label: {
    display: "block",
    marginBottom: "8px",
    fontWeight: "500",
    color: "#333",
  },
  input: {
    width: "100%",
    padding: "10px 12px",
    border: "1px solid #ddd",
    borderRadius: "4px",
    fontSize: "14px",
    fontFamily: "inherit",
    boxSizing: "border-box",
    transition: "border-color 0.3s",
  },
  phoneContainer: {
    display: "flex",
    gap: "10px",
  },
  countrySelect: {
    padding: "10px 12px",
    border: "1px solid #ddd",
    borderRadius: "4px",
    fontSize: "14px",
    backgroundColor: "#fff",
    cursor: "pointer",
  },
  phoneInput: {
    flex: 1,
    padding: "10px 12px",
    border: "1px solid #ddd",
    borderRadius: "4px",
    fontSize: "14px",
    boxSizing: "border-box",
  },
  phoneHelper: {
    display: "flex",
    justifyContent: "space-between",
    marginTop: "5px",
    fontSize: "12px",
  },
  validationIcon: {
    color: "#28a745",
    fontWeight: "bold",
  },
  genderContainer: {
    display: "flex",
    gap: "10px",
  },
  genderButton: {
    flex: 1,
    padding: "10px",
    border: "1px solid",
    borderRadius: "4px",
    cursor: "pointer",
    fontWeight: "500",
    transition: "all 0.3s",
  },
  passwordContainer: {
    position: "relative",
    display: "flex",
    alignItems: "center",
  },
  passwordInput: {
    width: "100%",
    padding: "10px 40px 10px 12px",
    border: "1px solid #ddd",
    borderRadius: "4px",
    fontSize: "14px",
    boxSizing: "border-box",
  },
  eyeButton: {
    position: "absolute",
    right: "12px",
    background: "none",
    border: "none",
    cursor: "pointer",
    fontSize: "18px",
    color: "#666",
  },
  requirementsBox: {
    backgroundColor: "#f8f9fa",
    padding: "12px",
    borderRadius: "4px",
    marginTop: "8px",
    fontSize: "12px",
  },
  requirementsTitle: {
    fontWeight: "bold",
    marginBottom: "8px",
    color: "#333",
  },
  requirementItem: {
    marginBottom: "5px",
  },
  requirementMet: {
    color: "#28a745",
    fontWeight: "500",
  },
  requirementUnmet: {
    color: "#dc3545",
    fontWeight: "500",
  },
  recaptchaContainer: {
    marginBottom: "20px",
    padding: "12px",
    backgroundColor: "#f8f9fa",
    borderRadius: "4px",
    textAlign: "center",
  },
  recaptchaBox: {
    display: "flex",
    justifyContent: "center",
    marginBottom: "10px",
  },
  recaptchaWarning: {
    color: "#dc3545",
    fontSize: "12px",
    margin: "0",
    fontWeight: "500",
  },
  recaptchaSuccess: {
    color: "#28a745",
    fontSize: "12px",
    margin: "0",
    fontWeight: "bold",
  },
  termsContainer: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    marginBottom: "20px",
  },
  checkbox: {
    width: "18px",
    height: "18px",
    cursor: "pointer",
  },
  termsLabel: {
    fontSize: "14px",
    color: "#666",
  },
  termsLink: {
    background: "none",
    border: "none",
    color: "#3B82F6",
    cursor: "pointer",
    textDecoration: "underline",
    fontSize: "14px",
  },
  submitButton: {
    width: "100%",
    padding: "12px",
    backgroundColor: "#3B82F6",
    color: "#fff",
    border: "none",
    borderRadius: "4px",
    fontSize: "16px",
    fontWeight: "bold",
    cursor: "pointer",
    transition: "background-color 0.3s",
  },
  divider: {
    textAlign: "center",
    color: "#999",
    margin: "20px 0",
    fontSize: "14px",
  },
  googleButton: {
    width: "100%",
    padding: "12px",
    backgroundColor: "#fff",
    color: "#333",
    border: "1px solid #ddd",
    borderRadius: "4px",
    fontSize: "14px",
    fontWeight: "500",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "10px",
    transition: "background-color 0.3s",
  },
  googleIcon: {
    width: "16px",
    height: "16px",
  },
  errorText: {
    color: "#dc3545",
    fontSize: "12px",
    marginTop: "5px",
    display: "block",
  },
  modalOverlay: {
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0,0,0,0.5)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 1000,
  },
  modal: {
    backgroundColor: "#fff",
    padding: "30px",
    borderRadius: "8px",
    maxWidth: "600px",
    maxHeight: "80vh",
    overflowY: "auto",
  },
  modalContent: {
    marginBottom: "20px",
  },
  modalCloseButton: {
    backgroundColor: "#3B82F6",
    color: "#fff",
    padding: "10px 20px",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
    fontSize: "14px",
    fontWeight: "bold",
  },
};

export default Register;
