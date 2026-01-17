import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { API_URL } from "../utils/api";

const calculateAge = (dateString) => {
  if (!dateString) return 0;
  try {
    let day, month, year;
    
    if (dateString.includes("-")) {
      // Format: YYYY-MM-DD or DD-MM-YYYY
      const parts = dateString.split("-");
      if (parts[0].length === 4) {
        // YYYY-MM-DD format
        [year, month, day] = parts;
      } else {
        // DD-MM-YYYY format
        [day, month, year] = parts;
      }
    } else if (dateString.includes("/")) {
      // Format: DD/MM/YYYY
      [day, month, year] = dateString.split("/");
    } else {
      return 0;
    }

    const birthDate = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    
    return age > 0 ? age : 0;
  } catch {
    return 0;
  }
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
    age: calculateAge(localStorage.getItem("dateOfBirth") || "01/01/1990"),
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
        const response = await fetch(`${API_URL}/api/users/${userId}/profile`, {
          method: "GET",
          headers: {
            "Authorization": `Bearer ${token}`,
          },
        });

        if (response.ok) {
          const data = await response.json();
          const updatedProfile = {
            name: data.fullName || profileData.name,
            gender: data.gender || profileData.gender,
            location: data.location || profileData.location,
            dateOfBirth: data.dateOfBirth || profileData.dateOfBirth,
            age: calculateAge(data.dateOfBirth || profileData.dateOfBirth),
            phoneNumber: data.phoneNumber || profileData.phoneNumber,
            email: data.email || profileData.email,
            bio: data.bio || profileData.bio,
            profileImage: data.profileImage || profileData.profileImage,
          };
          
          setProfileData(updatedProfile);
          setEditedData(updatedProfile);
        }
      } catch (err) {
        console.error("Error fetching profile from database:", err);
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

      const response = await fetch(`${API_URL}/api/users/${userId}/profile`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify({
          fullName: data.name,
          gender: data.gender,
          location: data.location,
          dateOfBirth: data.dateOfBirth,
          phoneNumber: data.phoneNumber,
          email: data.email,
          bio: data.bio,
          profileImage: data.profileImage,
        }),
      });

      if (response.ok) {
        if (data.profileImage) {
          localStorage.setItem("profileImage", data.profileImage);
        }
        alert("Profile updated successfully!");
      } else {
        alert("Failed to save profile. Please try again.");
      }
    } catch (err) {
      console.error("Error saving profile:", err);
      alert("Error saving profile. Please check your connection.");
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

  const handlePasswordSubmit = () => {
    if (passwordData.newPassword && passwordData.newPassword === passwordData.confirmPassword) {
      console.log("Password changed successfully");
      setShowPasswordChange(false);
      setPasswordData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
      alert("Password changed successfully!");
    } else {
      alert("Passwords do not match!");
    }
  };

  const handleProfileImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        alert('Please select a valid image file');
        return;
      }

      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert('Image size must be less than 5MB');
        return;
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        const imageData = e.target.result;
        setEditedData({
          ...editedData,
          profileImage: imageData,
        });
        // Store in localStorage temporarily for preview
        localStorage.setItem("profileImage", imageData);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleBackClick = () => {
    navigate("/dashboard");
  };

  const styles = {
    container: {
      minHeight: "100vh",
      background: "#f8f9fa",
      padding: "clamp(15px, 4vw, 30px)",
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
      fontSize: "clamp(1.5rem, 5vw, 2rem)",
      fontWeight: "700",
      color: "#1a1a1a",
    },
    backButton: {
      padding: "10px 20px",
      background: "#f0f0f0",
      color: "#666",
      border: "1px solid #ddd",
      borderRadius: "6px",
      fontSize: "14px",
      fontWeight: "600",
      cursor: "pointer",
      transition: "all 0.3s ease",
    },
    profileCard: {
      background: "#fff",
      borderRadius: "12px",
      padding: "clamp(15px, 4vw, 30px)",
      marginBottom: "30px",
      boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
      display: "flex",
      alignItems: "center",
      gap: "clamp(12px, 3vw, 20px)",
      flexWrap: "wrap",
      boxSizing: "border-box",
    },
    profileImageContainer: {
      position: "relative",
      display: "inline-block",
    },
    profileImage: {
      width: "clamp(70px, 20vw, 100px)",
      height: "clamp(70px, 20vw, 100px)",
      borderRadius: "50%",
      objectFit: "cover",
      border: "3px solid #3B82F6",
      cursor: "pointer",
    },
    imageUploadLabel: {
      position: "absolute",
      bottom: "0",
      right: "0",
      background: "#3B82F6",
      color: "#fff",
      width: "32px",
      height: "32px",
      borderRadius: "50%",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      cursor: "pointer",
      fontSize: "16px",
      border: "2px solid #fff",
      opacity: isEditing ? 1 : 0,
      pointerEvents: isEditing ? "auto" : "none",
      transition: "opacity 0.3s ease",
    },
    profileInfo: {
      flex: 1,
      minWidth: "200px",
    },
    profileName: {
      fontSize: "clamp(1.3rem, 4vw, 1.5rem)",
      fontWeight: "700",
      color: "#1a1a1a",
      margin: "0 0 5px 0",
    },
    profileMeta: {
      display: "flex",
      gap: "15px",
      alignItems: "center",
      flexWrap: "wrap",
      color: "#666",
      fontSize: "14px",
    },
    editButton: {
      padding: "10px 24px",
      background: "#fff",
      color: "#3B82F6",
      border: "1.5px solid #3B82F6",
      borderRadius: "6px",
      fontSize: "14px",
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
      fontSize: "18px",
      fontWeight: "700",
      color: "#1a1a1a",
      marginBottom: "20px",
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
    },
    infoGrid: {
      display: "grid",
      gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
      gap: "25px",
    },
    infoItem: {
      display: "flex",
      flexDirection: "column",
    },
    infoLabel: {
      fontSize: "12px",
      color: "#999",
      fontWeight: "600",
      marginBottom: "8px",
      textTransform: "uppercase",
      letterSpacing: "0.5px",
    },
    infoValue: {
      fontSize: "14px",
      color: "#1a1a1a",
      fontWeight: "500",
    },
    infoInput: {
      fontSize: "14px",
      color: "#1a1a1a",
      padding: "10px 12px",
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
      padding: "15px 0",
      borderBottom: "1px solid #eee",
      gap: "15px",
      flexWrap: "wrap",
    },
    settingsLabel: {
      fontSize: "14px",
      fontWeight: "600",
      color: "#1a1a1a",
    },
    button: {
      padding: "10px 20px",
      background: "#3B82F6",
      color: "#fff",
      border: "none",
      borderRadius: "6px",
      fontSize: "14px",
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
      padding: "10px 12px",
      border: "1px solid #ddd",
      borderRadius: "6px",
      fontSize: "14px",
      fontFamily: "inherit",
    },
  };

  return (
    <div style={styles.container}>
      <div style={styles.headerContainer}>
        <h1 style={styles.title}>My Profile</h1>
        <button style={styles.backButton} onClick={handleBackClick}>
          ← Back to Dashboard
        </button>
      </div>

      {/* Profile Card */}
      <div style={styles.profileCard}>
        <div style={styles.profileImageContainer}>
          <img
            src={isEditing ? (editedData.profileImage || "https://via.placeholder.com/100?text=Profile") : (profileData.profileImage || "https://via.placeholder.com/100?text=Profile")}
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
            <label style={styles.infoLabel}>Name</label>
            {isEditing ? (
              <input
                style={styles.infoInput}
                value={editedData.name}
                onChange={(e) => handleInputChange("name", e.target.value)}
              />
            ) : (
              <div style={styles.infoValue}>{profileData.name || "Should be fetched from database"}</div>
            )}
          </div>

          <div style={styles.infoItem}>
            <label style={styles.infoLabel}>Date Of Birth</label>
            {isEditing ? (
              <input
                style={styles.infoInput}
                value={editedData.dateOfBirth}
                onChange={(e) => handleInputChange("dateOfBirth", e.target.value)}
                placeholder="DD/MM/YYYY or YYYY-MM-DD"
              />
            ) : (
              <div style={styles.infoValue}>{profileData.dateOfBirth || "Should be fetched from database"}</div>
            )}
          </div>

          <div style={styles.infoItem}>
            <label style={styles.infoLabel}>Age</label>
            <div style={styles.infoValue}>{editedData.age || profileData.age || "Should be converted from dob"}</div>
          </div>

          <div style={styles.infoItem}>
            <label style={styles.infoLabel}>Phone Number</label>
            {isEditing ? (
              <input
                style={styles.infoInput}
                value={editedData.phoneNumber}
                onChange={(e) => handleInputChange("phoneNumber", e.target.value)}
              />
            ) : (
              <div style={styles.infoValue}>{profileData.phoneNumber || "Should be fetched from database"}</div>
            )}
          </div>

          <div style={styles.infoItem}>
            <label style={styles.infoLabel}>Email Address</label>
            {isEditing ? (
              <input
                style={styles.infoInput}
                type="email"
                value={editedData.email}
                onChange={(e) => handleInputChange("email", e.target.value)}
              />
            ) : (
              <div style={styles.infoValue}>{profileData.email || "Should be fetched from database"}</div>
            )}
          </div>

          <div style={styles.infoItem}>
            <label style={styles.infoLabel}>Bio</label>
            {isEditing ? (
              <input
                style={styles.infoInput}
                value={editedData.bio}
                onChange={(e) => handleInputChange("bio", e.target.value)}
                placeholder="Patient bio"
              />
            ) : (
              <div style={styles.infoValue}>{profileData.bio || "Patient"}</div>
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
