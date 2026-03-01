import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { API_URL } from "../utils/api";

const calculateAge = (dateString) => {
  if (!dateString) return 0;
  try {
    let birthDate;
    
    // Format: YYYY-MM-DDTHH:MM:SS.SSSZ (ISO with timestamp)
    if (dateString.includes("T") && dateString.includes("Z")) {
      birthDate = new Date(dateString);
    } 
    // Format: YYYY-MM-DD (ISO format)
    else if (dateString.includes("-") && dateString.length === 10) {
      birthDate = new Date(dateString);
    } 
    // Format: DD/MM/YYYY
    else if (dateString.includes("/")) {
      const [day, month, year] = dateString.split("/");
      birthDate = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
    } else {
      return 0;
    }

    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    
    return age > 0 ? age : 0;
  } catch (error) {
    console.error("Age calculation error:", error);
    return 0;
  }
};

// Convert DD/MM/YYYY to YYYY-MM-DD for HTML date input
const formatDateForInput = (dateString) => {
  if (!dateString) return "";
  
  // Already in YYYY-MM-DD format
  if (dateString.includes("-") && dateString.length === 10) {
    return dateString;
  }
  
  // DD/MM/YYYY format
  if (dateString.includes("/")) {
    const parts = dateString.split("/");
    if (parts.length === 3) {
      const [day, month, year] = parts;
      return `${year.padStart(4, '0')}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
    }
  }
  
  return "";
};

// Convert YYYY-MM-DD to DD/MM/YYYY for display
const formatDateForDisplay = (dateString) => {
  if (!dateString) return "";
  
  // YYYY-MM-DD format
  if (dateString.includes("-") && dateString.length === 10) {
    const [year, month, day] = dateString.split("-");
    return `${day}/${month}/${year}`;
  }
  
  // Already in DD/MM/YYYY format
  if (dateString.includes("/")) {
    return dateString;
  }
  
  return "";
};

const Profile = () => {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  const [isEditing, setIsEditing] = useState(false);
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [showPasswordChange, setShowPasswordChange] = useState(false);
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [profileData, setProfileData] = useState({
    name: localStorage.getItem("fullName") || "Patient Name",
    gender: localStorage.getItem("gender") || "Not specified",
    location: localStorage.getItem("location") || "Nepal",
    dateOfBirth: localStorage.getItem("dateOfBirth") || "01/01/1990",
    age: calculateAge(localStorage.getItem("birthDate") || localStorage.getItem("dateOfBirth") || "01/01/1990"),
    phoneNumber: localStorage.getItem("userPhoneNumber") || "+1 234 567 890",
    email: localStorage.getItem("userEmail") || "patient@example.com",
    bio: localStorage.getItem("bio") || "Patient Bio",
    profileImage: localStorage.getItem("profileImage") || null,
  });

  const [editedData, setEditedData] = useState(profileData);

  // Fetch profile from database on component mount
  useEffect(() => {
    const loadProfile = async () => {
      const token = localStorage.getItem("token");
      const userId = localStorage.getItem("userId");
      
      if (!token || !userId) return;

      try {
        if (!API_URL) {
          console.error("API_URL not configured");
          return;
        }

        const response = await fetch(`${API_URL}/api/users/${userId}/profile`, {
          method: "GET",
          headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        if (response.ok) {
          const data = await response.json();
          
          // Convert date from YYYY-MM-DD to DD/MM/YYYY for display
          let displayDate = data.dateOfBirth || "01/01/1990";
          if (displayDate && displayDate.includes('-') && displayDate.length === 10) {
            const [year, month, day] = displayDate.split('-');
            displayDate = `${day}/${month}/${year}`;
          }
          
          const updatedProfile = {
            name: data.fullName || "User",
            gender: data.gender || "Not specified",
            location: data.location || "Nepal",
            dateOfBirth: displayDate,
            age: calculateAge(displayDate),
            phoneNumber: data.phoneNumber || "",
            email: data.email || "",
            bio: data.bio || "Patient Bio",
            profileImage: data.profileImage || null,
          };
          
          console.log("Profile loaded from database. Date:", displayDate);
          
          // Update state with database values
          setProfileData(updatedProfile);
          setEditedData(updatedProfile);
          
          // Also update localStorage to keep it in sync
          localStorage.setItem("fullName", updatedProfile.name);
          localStorage.setItem("gender", updatedProfile.gender);
          localStorage.setItem("location", updatedProfile.location);
          localStorage.setItem("dateOfBirth", updatedProfile.dateOfBirth);
          localStorage.setItem("userPhoneNumber", updatedProfile.phoneNumber);
          localStorage.setItem("userEmail", updatedProfile.email);
          localStorage.setItem("bio", updatedProfile.bio);
          if (updatedProfile.profileImage) {
            localStorage.setItem("profileImage", updatedProfile.profileImage);
          }
        } else {
          const errorText = await response.text();
          console.error("Failed to fetch profile:", response.status, errorText);
          // Use localStorage as fallback
        }
      } catch (err) {
        console.error("Error fetching profile from database:", err);
        console.error("API URL attempted:", `${API_URL}/api/users/${userId}/profile`);
        // Use localStorage as fallback if API fails
      }
    };

    loadProfile();
  }, []);

  // Auto-logout on inactivity
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }

    let inactivityTimer;
    const INACTIVITY_TIMEOUT = 20 * 60 * 60 * 1000;

    const handleActivity = () => {
      clearTimeout(inactivityTimer);
      inactivityTimer = setTimeout(() => {
        localStorage.clear();
        navigate("/login");
      }, INACTIVITY_TIMEOUT);
    };

    inactivityTimer = setTimeout(() => {
      localStorage.clear();
      navigate("/login");
    }, INACTIVITY_TIMEOUT);

    window.addEventListener("mousedown", handleActivity);
    window.addEventListener("keydown", handleActivity);
    window.addEventListener("scroll", handleActivity);

    return () => {
      clearTimeout(inactivityTimer);
      window.removeEventListener("mousedown", handleActivity);
      window.removeEventListener("keydown", handleActivity);
      window.removeEventListener("scroll", handleActivity);
    };
  }, [navigate]);

  const handleEditClick = () => {
    setIsEditing(!isEditing);
    if (isEditing) {
      setProfileData(editedData);
      localStorage.setItem("fullName", editedData.name);
      localStorage.setItem("gender", editedData.gender);
      localStorage.setItem("location", editedData.location);
      localStorage.setItem("dateOfBirth", editedData.dateOfBirth);
      localStorage.setItem("userPhoneNumber", editedData.phoneNumber);
      localStorage.setItem("userEmail", editedData.email);
      localStorage.setItem("bio", editedData.bio);
      
      saveProfileToDatabase(editedData);
    } else {
      setEditedData(profileData);
    }
  };

  const saveProfileToDatabase = async (data) => {
    try {
      const userId = localStorage.getItem("userId");
      const token = localStorage.getItem("token");
      
      if (!userId || !token) return;

      // Convert date from DD/MM/YYYY to YYYY-MM-DD for database
      let dateForDatabase = data.dateOfBirth;
      if (data.dateOfBirth && data.dateOfBirth.includes('/')) {
        const [day, month, year] = data.dateOfBirth.split('/');
        dateForDatabase = `${year}-${month}-${day}`;
      }

      // Build payload - only include image if it changed (starts with 'data:' means it's new)
      const payload = {
        fullName: data.name,
        gender: data.gender,
        location: data.location,
        dateOfBirth: dateForDatabase,
        phoneNumber: data.phoneNumber,
        email: data.email,
        bio: data.bio,
      };

      // Only include image if it's actually new (base64 data)
      if (data.profileImage && data.profileImage.startsWith('data:')) {
        payload.profileImage = data.profileImage;
      }

      console.log("Sending profile update to:", `${API_URL}/api/users/${userId}/profile`);
      console.log("Date being saved:", dateForDatabase);
      console.log("Payload size:", JSON.stringify(payload).length, "bytes");

      const response = await fetch(`${API_URL}/api/users/${userId}/profile`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        // Update localStorage with saved data (keep as DD/MM/YYYY for display)
        localStorage.setItem("fullName", data.name);
        localStorage.setItem("gender", data.gender);
        localStorage.setItem("location", data.location);
        localStorage.setItem("dateOfBirth", data.dateOfBirth);
        localStorage.setItem("userPhoneNumber", data.phoneNumber);
        localStorage.setItem("userEmail", data.email);
        localStorage.setItem("bio", data.bio);
        if (data.profileImage) {
          localStorage.setItem("profileImage", data.profileImage);
          // Update navbar profile picture by triggering storage event
          window.dispatchEvent(new Event('profileImageChanged'));
        }
        toast.success("Profile updated successfully!");
      } else {
        const errorText = await response.text();
        console.error("Save profile error:", response.status, errorText);
        toast.error("Failed to save profile. Please try again.");
      }
    } catch (err) {
      console.error("Error saving profile:", err);
      toast.error("Error saving profile. Please check your connection.");
    }
  };

  const handleInputChange = (field, value) => {
    const updatedData = {
      ...editedData,
      [field]: value,
    };
    
    if (field === "dateOfBirth") {
      updatedData.age = calculateAge(value);
    }
    
    setEditedData(updatedData);
  };

  const handlePasswordChange = (field, value) => {
    setPasswordData({
      ...passwordData,
      [field]: value,
    });
  };

  const handlePasswordSubmit = async () => {
    if (!passwordData.currentPassword || !passwordData.newPassword || !passwordData.confirmPassword) {
      toast.error("All password fields are required!");
      return;
    }

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error("Passwords do not match!");
      return;
    }

    if (passwordData.newPassword.length < 6) {
      toast.error("New password must be at least 6 characters!");
      return;
    }

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        toast.error("Authentication required!");
        navigate("/login");
        return;
      }

      const response = await fetch(`${API_URL}/api/users/change-password`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify({
          currentPassword: passwordData.currentPassword,
          newPassword: passwordData.newPassword,
        }),
      });

      if (response.ok) {
        toast.success("Password changed successfully!");
        setShowPasswordChange(false);
        setPasswordData({
          currentPassword: "",
          newPassword: "",
          confirmPassword: "",
        });
      } else {
        const error = await response.json();
        toast.error(error.message || "Failed to change password");
      }
    } catch (err) {
      console.error("Error changing password:", err);
      toast.error("Error changing password. Please check your connection.");
    }
  };

  const handleProfileImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        toast.warning('Please select a valid image file');
        return;
      }

      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast.warning('Image size must be less than 5MB');
        return;
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        // Compress image before storing
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement('canvas');
          let width = img.width;
          let height = img.height;

          // Scale down if too large
          const maxWidth = 400;
          const maxHeight = 400;
          if (width > maxWidth || height > maxHeight) {
            const ratio = Math.min(maxWidth / width, maxHeight / height);
            width = width * ratio;
            height = height * ratio;
          }

          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          ctx.drawImage(img, 0, 0, width, height);

          // Compress to JPEG with quality 0.7
          const compressedData = canvas.toDataURL('image/jpeg', 0.7);
          setEditedData({
            ...editedData,
            profileImage: compressedData,
          });
          // Store in localStorage for preview
          localStorage.setItem("profileImage", compressedData);
        };
        img.src = e.target.result;
      };
      reader.readAsDataURL(file);
    }
  };

  const styles = {
    container: {
      minHeight: "100vh",
      background: "#f5f5f5",
      padding: "30px",
      boxSizing: "border-box",
    },
    headerContainer: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: "30px",
      flexWrap: "wrap",
      gap: "15px",
    },
    title: {
      fontSize: "2rem",
      fontWeight: "700",
      color: "#1a1a1a",
      margin: 0,
    },
    successMessage: {
      background: "#10b981",
      color: "#fff",
      padding: "12px 20px",
      borderRadius: "6px",
      marginBottom: "20px",
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
    },
    successClose: {
      background: "none",
      border: "none",
      color: "#fff",
      fontSize: "20px",
      cursor: "pointer",
    },
    profileCard: {
      background: "#fff",
      borderRadius: "12px",
      padding: "30px",
      marginBottom: "30px",
      boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
      display: "flex",
      alignItems: "center",
      gap: "30px",
      flexWrap: "wrap",
      boxSizing: "border-box",
    },
    profileImageContainer: {
      position: "relative",
      display: "inline-block",
    },
    profileImage: {
      width: "120px",
      height: "120px",
      borderRadius: "50%",
      objectFit: "cover",
      border: "4px solid #3B82F6",
      cursor: "pointer",
    },
    imageUploadLabel: {
      position: "absolute",
      bottom: "0",
      right: "0",
      background: "#3B82F6",
      color: "#fff",
      width: "36px",
      height: "36px",
      borderRadius: "50%",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      cursor: "pointer",
      fontSize: "18px",
      border: "2px solid #fff",
      opacity: isEditing ? 1 : 0,
      pointerEvents: isEditing ? "auto" : "none",
      transition: "opacity 0.3s ease",
    },
    profileInfo: {
      flex: 1,
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      minWidth: "250px",
    },
    profileName: {
      fontSize: "1.8rem",
      fontWeight: "700",
      color: "#1a1a1a",
      margin: "0 0 0 0",
    },
    profileMeta: {
      display: "flex",
      gap: "8px",
      alignItems: "center",
      justifyContent: "center",
      color: "#666",
      fontSize: "0.9rem",
      fontWeight: "500",
      marginTop: "12px",
      paddingTop: "12px",
      borderTop: "1px solid #f0f0f0",
      width: "100%",
      marginTop: "4px",
    },
    editButton: {
      padding: "12px 28px",
      background: "#fff",
      color: "#3B82F6",
      border: "2px solid #3B82F6",
      borderRadius: "6px",
      fontSize: "0.95rem",
      fontWeight: "600",
      cursor: "pointer",
      transition: "all 0.3s ease",
    },
    editButtonActive: {
      background: "#3B82F6",
      color: "#fff",
    },
    section: {
      background: "#fff",
      borderRadius: "12px",
      padding: "30px",
      marginBottom: "20px",
      boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
    },
    sectionTitle: {
      fontSize: "1.1rem",
      fontWeight: "700",
      color: "#1a1a1a",
      marginBottom: "25px",
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
    },
    infoGrid: {
      display: "grid",
      gridTemplateColumns: "repeat(2, 1fr)",
      gap: "30px",
    },
    infoItem: {
      display: "flex",
      flexDirection: "column",
    },
    infoLabel: {
      fontSize: "0.75rem",
      color: "#999",
      fontWeight: "700",
      marginBottom: "8px",
      textTransform: "uppercase",
      letterSpacing: "0.5px",
    },
    infoValue: {
      fontSize: "0.95rem",
      color: "#1a1a1a",
      fontWeight: "500",
    },
    infoInput: {
      fontSize: "0.95rem",
      color: "#1a1a1a",
      padding: "12px 14px",
      border: "1px solid #ddd",
      borderRadius: "6px",
      width: "100%",
      fontFamily: "inherit",
      boxSizing: "border-box",
    },
    settingsRow: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      padding: "18px 0",
      borderBottom: "1px solid #eee",
      gap: "15px",
      flexWrap: "wrap",
    },
    settingsLabel: {
      fontSize: "0.95rem",
      fontWeight: "600",
      color: "#1a1a1a",
    },
    button: {
      padding: "12px 24px",
      background: "#3B82F6",
      color: "#fff",
      border: "none",
      borderRadius: "6px",
      fontSize: "0.95rem",
      fontWeight: "600",
      cursor: "pointer",
      transition: "all 0.3s ease",
    },
    buttonSecondary: {
      background: "#f0f0f0",
      color: "#666",
      border: "1px solid #ddd",
    },
    toggle: {
      width: "50px",
      height: "28px",
      background: notificationsEnabled ? "#3B82F6" : "#ddd",
      border: "none",
      borderRadius: "14px",
      cursor: "pointer",
      transition: "all 0.3s ease",
      position: "relative",
    },
    toggleSlider: {
      width: "24px",
      height: "24px",
      background: "#fff",
      borderRadius: "50%",
      position: "absolute",
      top: "2px",
      left: notificationsEnabled ? "24px" : "2px",
      transition: "left 0.3s ease",
    },
    passwordForm: {
      display: "flex",
      flexDirection: "column",
      gap: "15px",
      padding: "15px 0",
    },
    passwordInput: {
      padding: "12px 14px",
      border: "1px solid #ddd",
      borderRadius: "6px",
      fontSize: "0.95rem",
      fontFamily: "inherit",
    },
  };

  return (
    <div style={styles.container}>
      <div style={{ ...styles.headerContainer, justifyContent: "space-between", alignItems: "center" }}>
        <h1 style={styles.title}>My Profile</h1>
        <button
          onClick={() => navigate("/dashboard")}
          style={{
            background: "#f0f0f0",
            border: "1px solid #ddd",
            padding: "10px 20px",
            borderRadius: "6px",
            fontSize: "0.95rem",
            fontWeight: "500",
            cursor: "pointer",
            color: "#666",
            transition: "all 0.3s ease",
          }}
          onMouseOver={(e) => {
            e.target.style.background = "#e0e0e0";
            e.target.style.color = "#333";
          }}
          onMouseOut={(e) => {
            e.target.style.background = "#f0f0f0";
            e.target.style.color = "#666";
          }}
          title="Back to Dashboard"
        >
          ← Back to Dashboard
        </button>
      </div>

      {/* Profile Card */}
      <div style={styles.profileCard}>
        <div style={styles.profileImageContainer}>
          <img
            src={isEditing ? (editedData.profileImage || "https://via.placeholder.com/120?text=Profile") : (profileData.profileImage || "https://via.placeholder.com/120?text=Profile")}
            alt="Profile"
            style={styles.profileImage}
          />
          {isEditing && (
            <label
              style={styles.imageUploadLabel}
              onClick={() => fileInputRef.current?.click()}
              title="Click to upload image"
            >
              📷
            </label>
          )}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            style={{ display: "none" }}
            onChange={handleProfileImageUpload}
          />
        </div>
        
        <div style={styles.profileInfo}>
          <h2 style={styles.profileName}>{profileData.name}</h2>
          <div style={styles.profileMeta}>
            <span>{profileData.gender}</span>
            <span>•</span>
            <span>{profileData.location}</span>
          </div>
        </div>

        <button 
          style={{
            ...styles.editButton,
            ...(isEditing ? styles.editButtonActive : {}),
          }} 
          onClick={handleEditClick}
        >
          {isEditing ? "Save" : "Edit"} ✎
        </button>
      </div>

      {/* Personal Information Section */}
      <div style={styles.section}>
        <div style={styles.sectionTitle}>
          <span>Personal Information</span>
        </div>
        <div style={styles.infoGrid}>
          <div style={styles.infoItem}>
            <label style={styles.infoLabel}>NAME</label>
            {isEditing ? (
              <input
                style={styles.infoInput}
                value={editedData.name}
                onChange={(e) => handleInputChange("name", e.target.value)}
              />
            ) : (
              <div style={styles.infoValue}>{profileData.name}</div>
            )}
          </div>

          <div style={styles.infoItem}>
            <label style={styles.infoLabel}>DATE OF BIRTH</label>
            {isEditing ? (
              <input
                style={styles.infoInput}
                type="date"
                value={formatDateForInput(editedData.dateOfBirth)}
                onChange={(e) => {
                  if (e.target.value) {
                    const displayFormat = formatDateForDisplay(e.target.value);
                    handleInputChange("dateOfBirth", displayFormat);
                  }
                }}
              />
            ) : (
              <div style={styles.infoValue}>{profileData.dateOfBirth}</div>
            )}
          </div>

          <div style={styles.infoItem}>
            <label style={styles.infoLabel}>AGE</label>
            <div style={styles.infoValue}>{editedData.age || profileData.age}</div>
          </div>

          <div style={styles.infoItem}>
            <label style={styles.infoLabel}>PHONE NUMBER</label>
            {isEditing ? (
              <input
                style={styles.infoInput}
                value={editedData.phoneNumber}
                onChange={(e) => handleInputChange("phoneNumber", e.target.value)}
              />
            ) : (
              <div style={styles.infoValue}>{profileData.phoneNumber}</div>
            )}
          </div>

          <div style={styles.infoItem}>
            <label style={styles.infoLabel}>EMAIL ADDRESS</label>
            {isEditing ? (
              <input
                style={styles.infoInput}
                type="email"
                value={editedData.email}
                onChange={(e) => handleInputChange("email", e.target.value)}
              />
            ) : (
              <div style={styles.infoValue}>{profileData.email}</div>
            )}
          </div>

          <div style={styles.infoItem}>
            <label style={styles.infoLabel}>BIO</label>
            {isEditing ? (
              <input
                style={styles.infoInput}
                value={editedData.bio}
                onChange={(e) => handleInputChange("bio", e.target.value)}
                placeholder="Patient bio"
              />
            ) : (
              <div style={styles.infoValue}>{profileData.bio}</div>
            )}
          </div>
        </div>
      </div>

      {/* General Settings Section */}
      <div style={styles.section}>
        <div style={styles.sectionTitle}>General</div>

        {/* Change Password */}
        <div style={styles.settingsRow}>
          <span style={styles.settingsLabel}>Change Password</span>
          <button
            style={{
              ...styles.button,
              ...(showPasswordChange ? styles.buttonSecondary : {}),
            }}
            onClick={() => setShowPasswordChange(!showPasswordChange)}
          >
            {showPasswordChange ? "Cancel" : "Change"}
          </button>
        </div>

        {showPasswordChange && (
          <div style={styles.passwordForm}>
            <input
              style={styles.passwordInput}
              type="password"
              placeholder="Current Password"
              value={passwordData.currentPassword}
              onChange={(e) => handlePasswordChange("currentPassword", e.target.value)}
            />
            <input
              style={styles.passwordInput}
              type="password"
              placeholder="New Password"
              value={passwordData.newPassword}
              onChange={(e) => handlePasswordChange("newPassword", e.target.value)}
            />
            <input
              style={styles.passwordInput}
              type="password"
              placeholder="Confirm New Password"
              value={passwordData.confirmPassword}
              onChange={(e) => handlePasswordChange("confirmPassword", e.target.value)}
            />
            <button style={styles.button} onClick={handlePasswordSubmit}>
              Update Password
            </button>
          </div>
        )}

        {/* Notifications */}
        <div style={styles.settingsRow}>
          <span style={styles.settingsLabel}>Notifications</span>
          <button
            style={styles.toggle}
            onClick={() => setNotificationsEnabled(!notificationsEnabled)}
          >
            <div style={styles.toggleSlider} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Profile;
