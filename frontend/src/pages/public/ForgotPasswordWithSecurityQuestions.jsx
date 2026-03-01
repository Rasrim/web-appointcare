import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { API_URL } from "../../utils/api";
import doctorImage from "../../images/docter1.png";

const ForgotPasswordSecurityQuestions = () => {
  const navigate = useNavigate();
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [step, setStep] = useState(1); // 1: Email, 2: Security Questions, 3: New Password
  const [email, setEmail] = useState("");
  const [firstNameLetters, setFirstNameLetters] = useState("");
  const [lastSurnameLetters, setLastSurnameLetters] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [resetToken, setResetToken] = useState("");
  const [userId, setUserId] = useState("");

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleEmailSubmit = async (e) => {
    e.preventDefault();
    if (!email) {
      toast.error("Please enter your email");
      return;
    }
    setLoading(true);
    setStep(2);
    // Email validation will happen on the next step when verifying security questions
    setLoading(false);
  };

  const handleSecurityQuestionsSubmit = async (e) => {
    e.preventDefault();
    if (!firstNameLetters || !lastSurnameLetters) {
      toast.error("Please answer both security questions");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/api/users/verify-security-questions`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: email,
          firstNameLetters: firstNameLetters.toUpperCase(),
          lastSurnameLetters: lastSurnameLetters.toUpperCase(),
        }),
      });

      const data = await response.json();

      if (response.ok) {
        toast.success("Security questions verified!");
        setResetToken(data.resetToken);
        setUserId(data.userId);
        setStep(3);
      } else {
        toast.error(data.message || "Incorrect security answers. Please try again.");
      }
    } catch (error) {
      console.error("Error:", error);
      toast.error("Error verifying security questions. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    if (!newPassword || !confirmPassword) {
      toast.error("Please enter both password fields");
      return;
    }

    if (newPassword !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    if (newPassword.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/api/users/reset-password-with-token`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          resetToken: resetToken,
          newPassword: newPassword,
          userId: userId,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        toast.success("Password reset successfully! Redirecting to login...");
        setTimeout(() => {
          navigate("/login");
        }, 2000);
      } else {
        toast.error(data.message || "Failed to reset password. Please try again.");
      }
    } catch (error) {
      console.error("Error:", error);
      toast.error("Error resetting password. Please try again.");
    } finally {
      setLoading(false);
    }
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
    },
    brandingContent: {
      textAlign: "center",
      color: "#fff",
      maxWidth: "400px",
    },
    brandTitle: {
      fontSize: "clamp(2rem, 8vw, 3.5rem)",
      fontWeight: "700",
      color: "#fff",
      margin: "100px 0 50px 0",
    },
    featureIcon: {
      fontSize: "2rem",
      marginRight: "12px",
    },
    featureText: {
      fontSize: "0.9rem",
      color: "#fff",
      margin: "10px 0",
    },
    doctorsImage: {
      marginTop: "50px",
    },
    doctorImageTag: {
      width: "100%",
      height: "auto",
    },
    formSection: {
      flex: 1,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      padding: "40px",
      position: "relative",
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
    backButton: {
      display: "none",
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
    successMessage: {
      backgroundColor: "#efe",
      color: "#3c3",
      padding: "10px",
      borderRadius: "6px",
      marginBottom: "15px",
      fontSize: "clamp(0.8rem, 2vw, 0.9rem)",
      border: "1px solid #cfc",
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
    stepIndicator: {
      fontSize: "clamp(0.75rem, 2vw, 0.85rem)",
      color: "#999",
      marginBottom: "15px",
      fontWeight: "500",
    },
  };

  return (
    <div style={styles.container}>
      {/* Left Side - Branding - Hidden on Mobile */}
      {!isMobile && (
        <div style={styles.brandingSection}>
          <div style={styles.brandingContent}>
            <h1 style={styles.brandTitle}>AppointCare</h1>
            <div>
              <div style={{ marginBottom: "20px" }}>
                <span style={styles.featureIcon}>🔍</span>
                <p style={styles.featureText}>
                  <strong>Well qualified doctors</strong>
                  <br />
                  <small>Treat with utmost care</small>
                </p>
              </div>
              <div>
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

      {/* Right Side - Form */}
      <div style={styles.formSection}>
        <button style={styles.closeButton} onClick={() => navigate("/login")} title="Close">✕</button>

        <div style={styles.formContainer}>
          {step === 1 && (
            <>
              <h2 style={styles.title}>Forgot Password?</h2>
              <p style={styles.subtitle}>Enter your email to recover your account</p>
              <p style={styles.stepIndicator}>Step 1 of 3: Enter Email</p>

              <form onSubmit={handleEmailSubmit}>
                <div style={styles.formGroup}>
                  <label style={styles.label}>Email Address</label>
                  <input
                    type="email"
                    placeholder="your@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    style={styles.input}
                    required
                  />
                </div>

                <button 
                  type="submit"
                  style={{
                    ...styles.button,
                    opacity: loading ? 0.5 : 1,
                  }}
                  disabled={loading}
                >
                  {loading ? "Loading..." : "Next"}
                </button>
              </form>
            </>
          )}

          {step === 2 && (
            <>
              <h2 style={styles.title}>Security Questions</h2>
              <p style={styles.subtitle}>Answer your security questions to verify your identity</p>
              <p style={styles.stepIndicator}>Step 2 of 3: Verify Identity</p>

              <form onSubmit={handleSecurityQuestionsSubmit}>
                <div style={styles.formGroup}>
                  <label style={styles.label}>
                    What are the first 2 letters of your first name? (Uppercase)
                  </label>
                  <input
                    type="text"
                    placeholder="e.g., RA"
                    maxLength="2"
                    value={firstNameLetters}
                    onChange={(e) => setFirstNameLetters(e.target.value.toUpperCase())}
                    style={styles.input}
                    required
                  />
                  <small style={{ color: "#999", marginTop: "4px", display: "block" }}>
                    Example: If your name is "Rasrim", enter "RA"
                  </small>
                </div>

                <div style={styles.formGroup}>
                  <label style={styles.label}>
                    What are the last 2 letters of your surname? (Uppercase)
                  </label>
                  <input
                    type="text"
                    placeholder="e.g., EL"
                    maxLength="2"
                    value={lastSurnameLetters}
                    onChange={(e) => setLastSurnameLetters(e.target.value.toUpperCase())}
                    style={styles.input}
                    required
                  />
                  <small style={{ color: "#999", marginTop: "4px", display: "block" }}>
                    Example: If your surname is "Sigdel", enter "EL"
                  </small>
                </div>

                <button 
                  type="submit"
                  style={{
                    ...styles.button,
                    opacity: loading ? 0.5 : 1,
                  }}
                  disabled={loading}
                >
                  {loading ? "Verifying..." : "Verify"}
                </button>

                <button
                  type="button"
                  onClick={() => setStep(1)}
                  style={{
                    ...styles.button,
                    backgroundColor: "#f0f0f0",
                    color: "#666",
                    marginTop: "10px",
                  }}
                >
                  Back
                </button>
              </form>
            </>
          )}

          {step === 3 && (
            <>
              <h2 style={styles.title}>Set New Password</h2>
              <p style={styles.subtitle}>Enter your new password</p>
              <p style={styles.stepIndicator}>Step 3 of 3: Create New Password</p>

              <form onSubmit={handleResetPassword}>
                <div style={styles.formGroup}>
                  <label style={styles.label}>New Password</label>
                  <input
                    type="password"
                    placeholder="••••••••"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    style={styles.input}
                    required
                  />
                  <small style={{ color: "#999", marginTop: "4px", display: "block" }}>
                    Minimum 6 characters
                  </small>
                </div>

                <div style={styles.formGroup}>
                  <label style={styles.label}>Confirm Password</label>
                  <input
                    type="password"
                    placeholder="••••••••"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    style={styles.input}
                    required
                  />
                </div>

                <button 
                  type="submit"
                  style={{
                    ...styles.button,
                    opacity: loading ? 0.5 : 1,
                  }}
                  disabled={loading}
                >
                  {loading ? "Resetting..." : "Reset Password"}
                </button>

                <button
                  type="button"
                  onClick={() => setStep(2)}
                  style={{
                    ...styles.button,
                    backgroundColor: "#f0f0f0",
                    color: "#666",
                    marginTop: "10px",
                  }}
                >
                  Back
                </button>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordSecurityQuestions;
