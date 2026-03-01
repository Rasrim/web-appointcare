import { useState, useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link, useNavigate } from "react-router-dom";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import { registerSchema } from "./schema/register.schema";
import { API_URL } from "../../utils/api";
import VerificationCodeInput from "../../components/VerificationCodeInput";
import TermsAndConditions from "../../components/TermsAndConditions";
import doctorImage from "../../images/docter1.png";

const Register = () => {
  const navigate = useNavigate();
  const formRef = useRef(null);
  const errorRef = useRef(null);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [step, setStep] = useState("register"); // register, recaptcha, success
  const [verificationEmail, setVerificationEmail] = useState("");
  const [registrationData, setRegistrationData] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [selectedGender, setSelectedGender] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [serverError, setServerError] = useState("");
  const [showTermsModal, setShowTermsModal] = useState(false);
  const [recaptchaLoaded, setRecaptchaLoaded] = useState(false);
  const [recaptchaToken, setRecaptchaToken] = useState("");
  const [recaptchaRendered, setRecaptchaRendered] = useState(false);
  const [passwordRequirements, setPasswordRequirements] = useState({
    minLength: false,
    hasCapital: false,
    hasNumber: false,
    hasSpecial: false,
  });
  const [showRequirements, setShowRequirements] = useState(false);

  const RECAPTCHA_SITE_KEY = process.env.VITE_RECAPTCHA_SITE_KEY || '6Lf6lFgsAAAAACyWkWW7dw5QxDmMDkFy2B0xPwo0';

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
    watch,
    setValue,
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
  const agreeToTerms = watch("agreeToTerms");

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Load reCAPTCHA script when terms are agreed and form is valid
  useEffect(() => {
    if (agreeToTerms && recaptchaLoaded && !recaptchaRendered) {
      renderRecaptcha();
    }
  }, [agreeToTerms, recaptchaLoaded, recaptchaRendered]);

  // Also load script on mount to be ready
  useEffect(() => {
    if (!recaptchaLoaded) {
      loadRecaptchaScript();
    }
  }, []);

  const loadRecaptchaScript = () => {
    if (window.grecaptcha) {
      console.log("grecaptcha already loaded");
      setRecaptchaLoaded(true);
      return;
    }

    const script = document.createElement("script");
    script.src = "https://www.google.com/recaptcha/api.js";
    script.async = true;
    script.defer = true;
    script.onload = () => {
      console.log("reCAPTCHA script loaded successfully");
      setRecaptchaLoaded(true);
    };
    script.onerror = () => {
      console.error("Failed to load reCAPTCHA script");
    };
    document.head.appendChild(script);
  };

  const renderRecaptcha = () => {
    const container = document.getElementById("recaptcha-container");
    console.log("renderRecaptcha called - grecaptcha:", !!window.grecaptcha, "container:", !!container, "recaptchaRendered:", recaptchaRendered);
    
    if (!window.grecaptcha) {
      console.warn("grecaptcha not available yet");
      return;
    }
    
    if (!container) {
      console.warn("recaptcha-container not found");
      return;
    }
    
    if (recaptchaRendered) {
      console.log("reCAPTCHA already rendered");
      return;
    }

    // Clear any existing content
    container.innerHTML = '';
    
    window.grecaptcha.ready(() => {
      try {
        console.log("grecaptcha.ready - rendering with sitekey:", RECAPTCHA_SITE_KEY);
        window.grecaptcha.render("recaptcha-container", {
          sitekey: RECAPTCHA_SITE_KEY,
          callback: "onRecaptchaVerified",
          theme: "light",
        });
        setRecaptchaRendered(true);
        console.log("reCAPTCHA rendered successfully");
      } catch (error) {
        console.error("reCAPTCHA render error:", error);
      }
    });
  };

  const onRecaptchaVerified = (token) => {
    console.log("reCAPTCHA verified with token:", token);
    setRecaptchaToken(token);
    setMessage("");
  };

  // Make callback available globally for reCAPTCHA - this MUST be updated on every render
  useEffect(() => {
    window.onRecaptchaVerified = (token) => {
      console.log("Callback fired with token:", token);
      setRecaptchaToken(token);
      setMessage("");
    };
    return () => {
      delete window.onRecaptchaVerified;
    };
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

  // Scroll to error message when errors occur
  useEffect(() => {
    if (serverError && errorRef.current) {
      setTimeout(() => {
        errorRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 50);
    }
  }, [serverError]);

  const onSubmit = async (data) => {
    // Check if trying to register with admin email
    if (data.email === "admin1245@gmail.com") {
      setServerError("This email is reserved for admin. Please use a different email to register.");
      return;
    }

    // Phone number is already 10 digits (9XXXXXXXX where second digit is 8 or 7)
    const fullPhoneNumber = data.phoneNumber;
    
    // Validate full phone number
    if (fullPhoneNumber.length !== 10) {
      setServerError(`Phone number must be exactly 10 digits. Currently: ${fullPhoneNumber.length}`);
      return;
    }
    
    if (!/^9[87]\d{8}$/.test(fullPhoneNumber)) {
      setServerError("Phone must start with 9, second digit must be 8 or 7");
      return;
    }

    // Get reCAPTCHA token
    const token = window.grecaptcha.getResponse();
    
    if (!token) {
      setServerError("Please complete the reCAPTCHA verification");
      return;
    }

    setLoading(true);
    setMessage("");
    setServerError("");

    try {
      const payload = {
        fullName: data.fullName,
        email: data.email,
        password: data.password,
        phoneNumber: `+977${fullPhoneNumber}`,
        gender: selectedGender,
        birthDate: data.birthDate,
        recaptchaToken: token,
      };
      
      const response = await fetch(`${API_URL}/api/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const result = await response.json();

      if (response.ok) {
        setMessage("Account created successfully! Redirecting to login...");
        localStorage.setItem("token", result.token);
        localStorage.setItem("fullName", result.user.fullName);
        localStorage.setItem("userEmail", result.user.email);
        localStorage.setItem("userId", result.user.id);
        localStorage.setItem("userPhoneNumber", payload.phoneNumber);
        
        setStep("success");
        setTimeout(() => {
          navigate("/login");
        }, 2000);
      } else {
        setServerError(result.message || "Registration failed. Please try again.");
        setStep("register");
      }
    } catch (error) {
      console.error("Registration error:", error);
      setServerError("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleRecaptchaSubmit = async (e) => {
    e.preventDefault();

    if (!recaptchaToken) {
      setServerError("Please complete the reCAPTCHA verification");
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
          ...registrationData,
          recaptchaToken: recaptchaToken,
        }),
      });

      const responseData = await response.json();

      if (response.ok) {
        // Store user data
        localStorage.setItem("token", responseData.token);
        localStorage.setItem("fullName", responseData.user.fullName);
        localStorage.setItem("userEmail", responseData.user.email);
        localStorage.setItem("userId", responseData.user.id);
        
        setStep("success");
        setMessage("Registration successful! Redirecting to login...");
        
        // Redirect to login page after 2 seconds
        setTimeout(() => {
          navigate("/login");
        }, 2000);
      } else {
        setServerError(responseData.message || "Registration failed. Please try again.");
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
    setMessage("");
    setRecaptchaToken("");
    
    // Reset reCAPTCHA
    if (window.grecaptcha) {
      window.grecaptcha.reset();
    }
    
    setLoading(false);
    setMessage("reCAPTCHA has been reset. Please verify again.");
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
            <strong>Well qualified doctors</strong><br />
            <small>Treat with utmost care</small>
          </p>
        </div>

        <div style={styles.featureItem}>
          <span style={styles.featureIcon}>📅</span>
          <p style={styles.featureText}>
            <strong>Book an appointment</strong><br />
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
          <h2 style={{...styles.title, textAlign: 'center'}}>Create Account</h2>
          <p style={{...styles.subtitle, textAlign: 'center'}}>
            Already have an account? <Link to="/login" style={styles.loginLink}>Log in</Link>
          </p>

          {message && <div style={styles.successMessage}>{message}</div>}
          {serverError && <div ref={errorRef} style={styles.errorMessage}>{serverError}</div>}

          {step === "register" && (
          <form ref={formRef} onSubmit={handleSubmit(onSubmit)}>
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
                <div style={styles.countryCodeStatic}>
                  +977
                </div>
                <input
                  type="tel"
                  placeholder="98XXXXXXXX"
                  {...register("phoneNumber")}
                  maxLength="10"
                  onChange={(e) => {
                    // Allow only numbers
                    let value = e.target.value.replace(/[^0-9]/g, '');
                    
                    // Validation: First digit must be 9, second digit must be 8 or 7
                    if (value.length > 0 && value[0] !== '9') {
                      value = '';
                    } else if (value.length > 1 && !['8', '7'].includes(value[1])) {
                      value = value[0]; // Keep only first digit
                    }
                    
                    e.target.value = value;
                    setValue('phoneNumber', value, { shouldValidate: true });
                  }}
                  onKeyPress={(e) => {
                    if (!/[0-9]/.test(e.key)) {
                      e.preventDefault();
                    }
                  }}
                  style={{
                    ...styles.phoneInput,
                    borderColor: errors.phoneNumber ? "#dc3545" : "#ddd",
                    flex: 1,
                    padding: "12px",
                  }}
                />
              </div>
              {phoneNumber && phoneNumber.length === 10 ? (
                <span style={{ color: "#28a745", fontSize: "14px", marginTop: "5px", display: "block", fontWeight: "500" }}>
                  ✓ Phone number verified
                </span>
              ) : phoneNumber && phoneNumber.length < 10 ? (
                <span style={styles.errorText}>{errors.phoneNumber?.message || "Phone must start with 9, second digit 8 or 7"}</span>
              ) : null}
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
            </div>

            <div style={styles.formGroup}>
              <label style={styles.label}>Gender</label>
              <div style={styles.genderContainer}>
                <button
                  type="button"
                  onClick={() => {
                    setSelectedGender("Male");
                    setValue("gender", "Male", { shouldValidate: true });
                  }}
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
                  onClick={() => {
                    setSelectedGender("Female");
                    setValue("gender", "Female", { shouldValidate: true });
                  }}
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
                  onClick={() => {
                    setSelectedGender("Other");
                    setValue("gender", "Other", { shouldValidate: true });
                  }}
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
              {errors.gender && (
                <span style={styles.errorText}>{errors.gender.message}</span>
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

            <div style={styles.termsContainer}>
              <label style={styles.termsLabel}>
                <input
                  type="checkbox"
                  {...register("agreeToTerms")}
                  style={styles.termsCheckbox}
                />
                <span style={styles.termsText}>
                  I agree to the{" "}
                  <button
                    type="button"
                    onClick={() => setShowTermsModal(true)}
                    style={styles.termsLink}
                  >
                    Terms and Conditions
                  </button>
                </span>
              </label>
              {errors.agreeToTerms && (
                <span style={styles.errorText}>{errors.agreeToTerms.message}</span>
              )}
            </div>

            <div style={{...styles.recaptchaWrapper, display: agreeToTerms ? "block" : "none"}}>
              <p style={{ marginBottom: "15px", color: "#666", fontSize: "14px" }}>
                Please verify you're human:
              </p>
              <div id="recaptcha-container" style={{ pointerEvents: "auto", position: "relative", zIndex: 9999 }}></div>
            </div>

            <button 
              type="submit"
              onClick={(e) => {
                console.log("Sign Up button clicked");
                console.log("Current form errors:", errors);
                console.log("Form values:", {
                  fullName: watch("fullName"),
                  email: watch("email"),
                  phoneNumber: watch("phoneNumber"),
                  password: watch("password"),
                  confirmPassword: watch("confirmPassword"),
                  birthDate: watch("birthDate"),
                  agreeToTerms: watch("agreeToTerms"),
                  recaptchaToken: recaptchaToken,
                  loading,
                });
                if (loading || !recaptchaToken) {
                  console.log("Button disabled - loading:", loading, "token:", !!recaptchaToken);
                  e.preventDefault();
                }
              }}
              style={{
                ...styles.button,
                opacity: loading || !recaptchaToken ? 0.5 : 1,
                cursor: loading || !recaptchaToken ? "not-allowed" : "pointer",
              }} 
              disabled={loading || !recaptchaToken}
            >
              {loading ? "Creating Account..." : recaptchaToken ? "Sign Up" : "Complete reCAPTCHA to continue"}
            </button>
          </form>
          )}

          {step === "success" && (
          <div style={styles.successContainer}>
            <div style={styles.successIcon}>✓</div>
            <h3 style={styles.verificationTitle}>Registration Successful!</h3>
            <p style={styles.verificationSubtitle}>
              Your account has been successfully created.
              <br />
              Redirecting to login...
            </p>
          </div>
          )}
        </div>
      </div>

      <TermsAndConditions 
        isOpen={showTermsModal} 
        onClose={() => setShowTermsModal(false)} 
      />
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
    maxWidth: "420px",
    maxHeight: "95vh",
    overflowY: "auto",
    paddingRight: "8px",
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
  countryCodeStatic: {
    padding: "12px 14px",
    border: "1px solid #ddd",
    borderRadius: "6px",
    fontSize: "clamp(0.85rem, 2vw, 0.95rem)",
    backgroundColor: "#f9f9f9",
    fontWeight: "600",
    color: "#333",
    minWidth: "100px",
    textAlign: "center",
  },
  phoneInputWrapper: {
    flex: 1,
    display: "flex",
    alignItems: "center",
    border: "1px solid #ddd",
    borderRadius: "6px",
    overflow: "hidden",
    backgroundColor: "#f9f9f9",
  },
  phonePrefix: {
    padding: "12px 8px",
    fontWeight: "700",
    color: "#333",
    fontSize: "clamp(0.85rem, 2vw, 0.95rem)",
    backgroundColor: "#f0f0f0",
    borderRight: "1px solid #ddd",
    minWidth: "auto",
  },
  phoneInput: {
    flex: 1,
    minWidth: "100px",
    padding: "12px 14px",
    border: "none",
    outline: "none",
    fontSize: "clamp(0.85rem, 2vw, 0.95rem)",
    boxSizing: "border-box",
    backgroundColor: "transparent",
  },
  genderContainer: {
    display: "flex",
    gap: "12px",
    justifyContent: "space-between",
    flexWrap: "wrap",
  },
  genderButton: {
    flex: 1,
    minWidth: "90px",
    padding: "12px 16px",
    border: "2px solid #ddd",
    borderRadius: "6px",
    backgroundColor: "#f0f0f0",
    color: "#333",
    fontSize: "0.9rem",
    fontWeight: "600",
    cursor: "pointer",
    transition: "all 0.3s ease",
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
  termsContainer: {
    marginBottom: "clamp(12px, 3vw, 18px)",
  },
  termsLabel: {
    display: "flex",
    alignItems: "flex-start",
    gap: "10px",
    cursor: "pointer",
  },
  termsCheckbox: {
    marginTop: "4px",
    cursor: "pointer",
    minWidth: "18px",
    minHeight: "18px",
  },
  termsText: {
    fontSize: "clamp(0.8rem, 2vw, 0.9rem)",
    color: "#333",
    lineHeight: "1.4",
  },
  termsLink: {
    background: "none",
    border: "none",
    color: "#3B82F6",
    cursor: "pointer",
    fontWeight: "600",
    textDecoration: "underline",
    padding: "0",
    fontSize: "inherit",
    transition: "color 0.3s",
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
  recaptchaWrapper: {
    display: "flex",
    justifyContent: "center",
    margin: "30px 0",
    padding: "20px",
    backgroundColor: "#f9f9f9",
    borderRadius: "8px",
    border: "1px solid #ddd",
    pointerEvents: "auto",
    zIndex: 9999,
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
