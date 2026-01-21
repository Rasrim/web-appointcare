import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { MdArrowBack, MdEdit, MdSave, MdClose, MdUpload, MdDeleteOutline } from "react-icons/md";

const calculateAge = (dateString) => {
  if (!dateString) return 0;
  try {
    const [day, month, year] = dateString.split("/");
    const birthDate = new Date(year, month - 1, day);
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

  const [activeTab, setActiveTab] = useState("general");
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
    gender: "Female",
    location: localStorage.getItem("location") || "Nepal",
    dateOfBirth: localStorage.getItem("dateOfBirth") || "07/01/1997",
    age: calculateAge(localStorage.getItem("dateOfBirth") || "07/01/1997"),
    phoneNumber: localStorage.getItem("userPhoneNumber") || "+1 345 346 347",
    email: localStorage.getItem("userEmail") || "patient.email@gmail.com",
    bio: localStorage.getItem("bio") || "Patient Bio",
    profileImage: localStorage.getItem("profileImage") || null,
    speechDiseases: ["Dysarthria", "Apraxia"],
    physicalDiseases: ["Arthritis"],
  });

  const [editedData, setEditedData] = useState(profileData);

  // Fetch profile from database on component mount
  useEffect(() => {
    const loadProfile = async () => {
      const token = localStorage.getItem("token");
      if (!token) return;

      try {
        const userId = localStorage.getItem("userId");
        if (!userId) return;

        const response = await fetch(`http://localhost:3000/api/users/${userId}/profile`, {
          method: "GET",
          headers: {
            "Authorization": `Bearer ${token}`,
          },
        });

        if (response.ok) {
          const data = await response.json();
          // Update profile data with fetched data from database
          const updatedProfile = {
            name: data.fullName || localStorage.getItem("fullName") || "Patient Name",
            gender: data.gender || "Female",
            location: data.location || "Nepal",
            dateOfBirth: data.dateOfBirth || "07/01/1997",
            age: calculateAge(data.dateOfBirth || "07/01/1997"),
            phoneNumber: data.phoneNumber || localStorage.getItem("userPhoneNumber") || "+1 345 346 347",
            email: data.email || localStorage.getItem("userEmail") || "patient.email@gmail.com",
            bio: data.bio || "Patient Bio",
            profileImage: data.profileImage || localStorage.getItem("profileImage") || null,
            speechDiseases: data.speechDiseases || ["Dysarthria", "Apraxia"],
            physicalDiseases: data.physicalDiseases || ["Arthritis"],
          };
          
          setProfileData(updatedProfile);
          setEditedData(updatedProfile);
          
          // Update localStorage with fresh data
          localStorage.setItem("profileImage", updatedProfile.profileImage || "");
        }
      } catch (err) {
        console.error("Error fetching profile from database:", err);
      }
    };

    loadProfile();
  }, []);

  // Auto-logout on inactivity (20 hours) and token validation
  useEffect(() => {
    // Check if token exists on mount
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }

    let inactivityTimer;
    const INACTIVITY_TIMEOUT = 20 * 60 * 60 * 1000; // 20 hours in milliseconds

    const handleActivity = () => {
      // Reset inactivity timer on any activity
      clearTimeout(inactivityTimer);
      inactivityTimer = setTimeout(() => {
        // Auto-logout due to inactivity
        localStorage.clear();
        navigate("/login");
      }, INACTIVITY_TIMEOUT);
    };

    // Set initial timer
    inactivityTimer = setTimeout(() => {
      localStorage.clear();
      navigate("/login");
    }, INACTIVITY_TIMEOUT);

    // Add event listeners for user activity
    window.addEventListener("mousedown", handleActivity);
    window.addEventListener("keydown", handleActivity);
    window.addEventListener("scroll", handleActivity);
    window.addEventListener("touchstart", handleActivity);

    return () => {
      clearTimeout(inactivityTimer);
      window.removeEventListener("mousedown", handleActivity);
      window.removeEventListener("keydown", handleActivity);
      window.removeEventListener("scroll", handleActivity);
      window.removeEventListener("touchstart", handleActivity);
    };
  }, [navigate]);

  const handleEditClick = () => {
    setIsEditing(!isEditing);
    if (isEditing) {
      // Save profile data to localStorage and database
      setProfileData(editedData);
      localStorage.setItem("fullName", editedData.name);
      localStorage.setItem("bio", editedData.bio);
      
      // Save to database
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

      const response = await fetch(`http://localhost:3000/api/users/${userId}/profile`, {
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
          bio: data.bio,
          profileImage: data.profileImage,
        }),
      });

      if (response.ok) {
        console.log("Profile saved to database successfully");
      } else {
        console.error("Failed to save profile to database");
      }
    } catch (err) {
      console.error("Error saving profile:", err);
    }
  };

  const handleInputChange = (field, value) => {
    const updatedData = {
      ...editedData,
      [field]: value,
    };
    
    // Auto-calculate age when dateOfBirth changes
    if (field === "dateOfBirth") {
      updatedData.age = calculateAge(value);
      localStorage.setItem("dateOfBirth", value);
    }
    
    // Store location in localStorage
    if (field === "location") {
      localStorage.setItem("location", value);
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
    if (
      passwordData.newPassword &&
      passwordData.newPassword === passwordData.confirmPassword
    ) {
      // TODO: Send password change request to backend
      console.log("Password changed successfully");
      setShowPasswordChange(false);
      setPasswordData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    }
  };

  const handleProfileImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const imageData = e.target.result;
        setEditedData({
          ...editedData,
          profileImage: imageData,
        });
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
      background: "#f9f9f9",
      padding: "clamp(20px, 4vw, 40px)",
    },
    header: {
      fontSize: "clamp(1.5rem, 5vw, 2rem)",
      fontWeight: "700",
      color: "#1a1a1a",
      marginBottom: "clamp(20px, 3vw, 30px)",
    },
    userCard: {
      background: "#fff",
      borderRadius: "12px",
      padding: "clamp(20px, 4vw, 30px)",
      display: "flex",
      gap: "clamp(15px, 3vw, 25px)",
      alignItems: "flex-start",
      marginBottom: "clamp(20px, 3vw, 30px)",
      boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
      flexWrap: "wrap",
    },
    userImage: {
      width: "clamp(80px, 20vw, 120px)",
      height: "clamp(80px, 20vw, 120px)",
      borderRadius: "50%",
      objectFit: "cover",
      border: "3px solid #3B82F6",
      cursor: "pointer",
      position: "relative",
    },
    imageUploadLabel: {
      position: "absolute",
      bottom: "0",
      right: "0",
      background: "#3B82F6",
      color: "#fff",
      width: "30px",
      height: "30px",
      borderRadius: "50%",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      cursor: "pointer",
      fontSize: "0.9rem",
      border: "2px solid #fff",
    },
    userInfo: {
      flex: 1,
      minWidth: "200px",
    },
    userName: {
      fontSize: "clamp(1.1rem, 3vw, 1.4rem)",
      fontWeight: "700",
      color: "#1a1a1a",
      margin: "0 0 5px 0",
    },
    userMeta: {
      display: "flex",
      gap: "15px",
      flexWrap: "wrap",
      fontSize: "clamp(0.85rem, 2vw, 0.95rem)",
      color: "#666",
      marginBottom: "10px",
    },
    userLocation: {
      fontSize: "clamp(0.8rem, 2vw, 0.9rem)",
      color: "#999",
      margin: 0,
    },
    editButton: {
      padding: "clamp(8px, 2vw, 12px) clamp(16px, 3vw, 24px)",
      background: "#fff",
      color: "#3B82F6",
      border: "1px solid #3B82F6",
      borderRadius: "6px",
      fontSize: "clamp(0.8rem, 2vw, 0.9rem)",
      fontWeight: "600",
      cursor: "pointer",
      transition: "all 0.3s ease",
    },
    backButton: {
      padding: "clamp(8px, 2vw, 12px) clamp(16px, 3vw, 24px)",
      background: "#f0f0f0",
      color: "#666",
      border: "1px solid #ddd",
      borderRadius: "6px",
      fontSize: "clamp(0.8rem, 2vw, 0.9rem)",
      fontWeight: "600",
      cursor: "pointer",
      transition: "all 0.3s ease",
      marginLeft: "10px",
    },
    tabsContainer: {
      display: "flex",
      gap: "clamp(15px, 3vw, 30px)",
      borderBottom: "1px solid #eee",
      marginBottom: "clamp(20px, 3vw, 30px)",
      overflowX: "auto",
    },
    tab: {
      padding: "clamp(10px, 2vw, 15px) 0",
      border: "none",
      background: "none",
      fontSize: "clamp(0.9rem, 2vw, 1rem)",
      fontWeight: "500",
      color: "#999",
      cursor: "pointer",
      transition: "all 0.3s ease",
      borderBottom: "2px solid transparent",
      whiteSpace: "nowrap",
    },
    tabActive: {
      color: "#3B82F6",
      borderBottomColor: "#3B82F6",
    },
    section: {
      background: "#fff",
      borderRadius: "12px",
      padding: "clamp(20px, 4vw, 30px)",
      marginBottom: "clamp(20px, 3vw, 30px)",
      boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
    },
    sectionTitle: {
      fontSize: "clamp(1rem, 3vw, 1.2rem)",
      fontWeight: "700",
      color: "#1a1a1a",
      marginBottom: "clamp(15px, 3vw, 20px)",
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      gap: "10px",
      flexWrap: "wrap",
    },
    infoGrid: {
      display: "grid",
      gridTemplateColumns: "repeat(auto-fit, minmax(clamp(200px, 45vw, 250px), 1fr))",
      gap: "clamp(20px, 3vw, 30px)",
    },
    infoItem: {
      display: "flex",
      flexDirection: "column",
    },
    infoLabel: {
      fontSize: "clamp(0.75rem, 2vw, 0.85rem)",
      color: "#999",
      fontWeight: "600",
      marginBottom: "5px",
      textTransform: "uppercase",
    },
    infoValue: {
      fontSize: "clamp(0.9rem, 2vw, 1rem)",
      color: "#1a1a1a",
      fontWeight: "500",
    },
    infoInput: {
      fontSize: "clamp(0.9rem, 2vw, 1rem)",
      color: "#1a1a1a",
      padding: "clamp(8px, 2vw, 12px)",
      border: "1px solid #ddd",
      borderRadius: "6px",
      width: "100%",
      fontFamily: "inherit",
    },
    diseaseContainer: {
      display: "flex",
      gap: "clamp(15px, 3vw, 25px)",
      flexWrap: "wrap",
      marginBottom: "clamp(20px, 3vw, 30px)",
    },
    diseaseCategory: {
      flex: 1,
      minWidth: "200px",
    },
    diseaseLabel: {
      fontSize: "clamp(0.85rem, 2vw, 0.95rem)",
      fontWeight: "600",
      color: "#666",
      marginBottom: "10px",
    },
    diseaseTags: {
      display: "flex",
      gap: "8px",
      flexWrap: "wrap",
    },
    diseaseTag: {
      padding: "clamp(6px, 1.5vw, 10px) clamp(10px, 2vw, 16px)",
      background: "#f0f0f0",
      border: "1px solid #ddd",
      borderRadius: "20px",
      fontSize: "clamp(0.8rem, 1.5vw, 0.9rem)",
      color: "#333",
      display: "flex",
      alignItems: "center",
      gap: "6px",
    },
    removeButton: {
      background: "none",
      border: "none",
      color: "#666",
      cursor: "pointer",
      fontSize: "1rem",
      padding: "0",
    },
    settingsRow: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      padding: "clamp(12px, 2vw, 16px) 0",
      borderBottom: "1px solid #eee",
      gap: "15px",
      flexWrap: "wrap",
    },
    settingsLabel: {
      fontSize: "clamp(0.9rem, 2vw, 1rem)",
      fontWeight: "600",
      color: "#1a1a1a",
    },
    settingsActions: {
      display: "flex",
      gap: "10px",
    },
    button: {
      padding: "clamp(8px, 2vw, 12px) clamp(16px, 3vw, 24px)",
      background: "#3B82F6",
      color: "#fff",
      border: "none",
      borderRadius: "6px",
      fontSize: "clamp(0.8rem, 2vw, 0.9rem)",
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
    },
    passwordInput: {
      padding: "clamp(10px, 2vw, 12px)",
      border: "1px solid #ddd",
      borderRadius: "6px",
      fontSize: "clamp(0.9rem, 2vw, 1rem)",
      fontFamily: "inherit",
    },
    emptyState: {
      textAlign: "center",
      padding: "clamp(30px, 5vw, 50px)",
      color: "#999",
    },
  };

  return (
    <div style={styles.container}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "clamp(20px, 3vw, 30px)", flexWrap: "wrap", gap: "10px" }}>
        <h1 style={styles.header}>Profile</h1>
        <button style={styles.backButton} onClick={handleBackClick}>
          ← Back
        </button>
      </div>

      {/* User Card */}
      <div style={styles.userCard}>
        <div style={{ position: "relative", display: "inline-block" }}>
          <img
            src={isEditing ? (editedData.profileImage || "https://via.placeholder.com/120?text=Profile") : (profileData.profileImage || "https://via.placeholder.com/120?text=Profile")}
            alt={profileData.name}
            style={styles.userImage}
          />
          {isEditing && (
            <label
              style={styles.imageUploadLabel}
              onClick={() => fileInputRef.current?.click()}
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
        <div style={styles.userInfo}>
          <h2 style={styles.userName}>
            {profileData.name}{" "}
            <span style={{ fontSize: "clamp(0.9rem, 2vw, 1rem)", color: "#999" }}>
              ({profileData.gender})
            </span>
          </h2>
          <p style={styles.userLocation}>{profileData.location}</p>
        </div>
        <button style={styles.editButton} onClick={handleEditClick}>
          {isEditing ? "Save" : "Edit"} ✎
        </button>
      </div>

      {/* Tabs */}
      <div style={styles.tabsContainer}>
        <button
          style={{
            ...styles.tab,
            ...(activeTab === "general" ? styles.tabActive : {}),
          }}
          onClick={() => setActiveTab("general")}
        >
          General
        </button>
        <button
          style={{
            ...styles.tab,
            ...(activeTab === "consultation" ? styles.tabActive : {}),
          }}
          onClick={() => setActiveTab("consultation")}
        >
          Consultation History
        </button>
        <button
          style={{
            ...styles.tab,
            ...(activeTab === "documents" ? styles.tabActive : {}),
          }}
          onClick={() => setActiveTab("documents")}
        >
          Patient Documents
        </button>
      </div>

      {/* General Tab */}
      {activeTab === "general" && (
        <>
          {/* Personal Information */}
          <div style={styles.section}>
            <div style={styles.sectionTitle}>
              <span>Personal Information</span>
              {isEditing && (
                <button style={styles.editButton} onClick={handleEditClick}>
                  Save
                </button>
              )}
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
                  <div style={styles.infoValue}>{profileData.name}</div>
                )}
              </div>
              <div style={styles.infoItem}>
                <label style={styles.infoLabel}>Gender</label>
                {isEditing ? (
                  <select
                    style={styles.infoInput}
                    value={editedData.gender}
                    onChange={(e) => handleInputChange("gender", e.target.value)}
                  >
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                ) : (
                  <div style={styles.infoValue}>{profileData.gender}</div>
                )}
              </div>
              <div style={styles.infoItem}>
                <label style={styles.infoLabel}>Address</label>
                {isEditing ? (
                  <input
                    style={styles.infoInput}
                    value={editedData.location}
                    onChange={(e) => handleInputChange("location", e.target.value)}
                    placeholder="Your address"
                  />
                ) : (
                  <div style={styles.infoValue}>{profileData.location}</div>
                )}
              </div>
              <div style={styles.infoItem}>
                <label style={styles.infoLabel}>Date Of Birth</label>
                {isEditing ? (
                  <input
                    style={styles.infoInput}
                    value={editedData.dateOfBirth}
                    onChange={(e) =>
                      handleInputChange("dateOfBirth", e.target.value)
                    }
                  />
                ) : (
                  <div style={styles.infoValue}>{profileData.dateOfBirth}</div>
                )}
              </div>
              <div style={styles.infoItem}>
                <label style={styles.infoLabel}>Age</label>
                <div style={styles.infoValue}>{editedData.age || profileData.age}</div>
              </div>
              <div style={styles.infoItem}>
                <label style={styles.infoLabel}>Phone Number</label>
                {isEditing ? (
                  <input
                    style={styles.infoInput}
                    value={editedData.phoneNumber}
                    onChange={(e) =>
                      handleInputChange("phoneNumber", e.target.value)
                    }
                  />
                ) : (
                  <div style={styles.infoValue}>{profileData.phoneNumber}</div>
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
                  <div style={styles.infoValue}>{profileData.email}</div>
                )}
              </div>
              <div style={styles.infoItem}>
                <label style={styles.infoLabel}>Medical Notes</label>
                {isEditing ? (
                  <input
                    style={styles.infoInput}
                    value={editedData.bio}
                    onChange={(e) => handleInputChange("bio", e.target.value)}
                    placeholder="Any additional medical information"
                  />
                ) : (
                  <div style={styles.infoValue}>{profileData.bio}</div>
                )}
              </div>
            </div>
          </div>

          {/* Pre-existing Diseases */}
          <div style={styles.section}>
            <div style={styles.sectionTitle}>Pre-existing Diseases</div>
            <div style={styles.diseaseContainer}>
              <div style={styles.diseaseCategory}>
                <div style={styles.diseaseLabel}>Speech</div>
                <div style={styles.diseaseTags}>
                  {profileData.speechDiseases.map((disease, index) => (
                    <div key={index} style={styles.diseaseTag}>
                      {disease}
                      {isEditing && (
                        <button style={styles.removeButton}>×</button>
                      )}
                    </div>
                  ))}
                </div>
              </div>
              <div style={styles.diseaseCategory}>
                <div style={styles.diseaseLabel}>Physical</div>
                <div style={styles.diseaseTags}>
                  {profileData.physicalDiseases.map((disease, index) => (
                    <div key={index} style={styles.diseaseTag}>
                      {disease}
                      {isEditing && (
                        <button style={styles.removeButton}>×</button>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* General Settings */}
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
              <div style={{ padding: "clamp(15px, 3vw, 20px)" }}>
                <div style={styles.passwordForm}>
                  <input
                    style={styles.passwordInput}
                    type="password"
                    placeholder="Current Password"
                    value={passwordData.currentPassword}
                    onChange={(e) =>
                      handlePasswordChange("currentPassword", e.target.value)
                    }
                  />
                  <input
                    style={styles.passwordInput}
                    type="password"
                    placeholder="New Password"
                    value={passwordData.newPassword}
                    onChange={(e) =>
                      handlePasswordChange("newPassword", e.target.value)
                    }
                  />
                  <input
                    style={styles.passwordInput}
                    type="password"
                    placeholder="Confirm New Password"
                    value={passwordData.confirmPassword}
                    onChange={(e) =>
                      handlePasswordChange("confirmPassword", e.target.value)
                    }
                  />
                  <button
                    style={styles.button}
                    onClick={handlePasswordSubmit}
                  >
                    Update Password
                  </button>
                </div>
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
        </>
      )}

      {/* Consultation History Tab */}
      {activeTab === "consultation" && (
        <div style={styles.section}>
          <div style={styles.emptyState}>
            <p style={{ fontSize: "clamp(1rem, 3vw, 1.2rem)", fontWeight: "600" }}>
              Coming Soon
            </p>
            <p>Your consultation history will appear here.</p>
          </div>
        </div>
      )}

      {/* Patient Documents Tab */}
      {activeTab === "documents" && (
        <div style={styles.section}>
          <div style={styles.emptyState}>
            <p style={{ fontSize: "clamp(1rem, 3vw, 1.2rem)", fontWeight: "600" }}>
              Coming Soon
            </p>
            <p>Your patient documents will appear here.</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;
