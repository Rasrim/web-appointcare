import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [doctors, setDoctors] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    specialty: "",
    experience: "",
    fee: "",
    availability: "",
    timing: "",
    photo: "",
  });
  const [dragActive, setDragActive] = useState(false);
  const [photoPreview, setPhotoPreview] = useState("");

  // Check if user is admin
  useEffect(() => {
    const checkAdmin = () => {
      const adminEmail = localStorage.getItem("adminEmail");
      const isAdminUser = localStorage.getItem("isAdmin") === "true";
      
      if (adminEmail === "admin1245@gmail.com" && isAdminUser) {
        setIsAdmin(true);
        setLoading(false);
      } else {
        // Not admin, redirect to dashboard
        navigate("/dashboard");
      }
    };
    
    checkAdmin();
  }, [navigate]);

  // Fetch doctors
  useEffect(() => {
    fetchDoctors();
  }, []);

  const fetchDoctors = async () => {
    try {
      const response = await fetch("http://localhost:3000/api/doctors");
      if (response.ok) {
        const data = await response.json();
        setDoctors(data);
      }
    } catch {
      setError("Failed to fetch doctors");
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleImageFile = (file) => {
    if (file && file.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoPreview(reader.result);
        setFormData({
          ...formData,
          photo: reader.result,
        });
      };
      reader.readAsDataURL(file);
    } else {
      setError("Please select a valid image file");
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    const files = e.dataTransfer.files;
    if (files && files[0]) {
      handleImageFile(files[0]);
    }
  };

  const handleFileInput = (e) => {
    const files = e.target.files;
    if (files && files[0]) {
      handleImageFile(files[0]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setMessage("");

    try {
      const url = editingId
        ? `http://localhost:3000/api/doctors/${editingId}`
        : "http://localhost:3000/api/doctors";
      const method = editingId ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setMessage(
          editingId
            ? "Doctor updated successfully!"
            : "Doctor added successfully!"
        );
        setFormData({
          name: "",
          specialty: "",
          experience: "",
          fee: "",
          availability: "",
          timing: "",
          photo: "",
        });
        setPhotoPreview("");
        setEditingId(null);
        setShowForm(false);
        fetchDoctors();
      } else {
        setError("Failed to save doctor");
      }
    } catch (err) {
      setError("Error: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (doctor) => {
    setFormData(doctor);
    setEditingId(doctor.id);
    setShowForm(true);
  };

  const handleDelete = async (doctorId) => {
    if (window.confirm("Are you sure you want to delete this doctor?")) {
      try {
        const response = await fetch(
          `http://localhost:3000/api/doctors/${doctorId}`,
          { method: "DELETE" }
        );
        if (response.ok) {
          setMessage("Doctor deleted successfully!");
          fetchDoctors();
        }
      } catch {
        setError("Failed to delete doctor");
      }
    }
  };

  const handleCancel = () => {
    setShowForm(false);
    setFormData({
      name: "",
      specialty: "",
      experience: "",
      fee: "",
      availability: "",
      timing: "",
      photo: "",
    });
    setPhotoPreview("");
    setEditingId(null);
  };

  if (loading) {
    return (
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: "100vh", fontSize: "1.2rem", color: "#3B82F6" }}>
        Loading...
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: "100vh", fontSize: "1.2rem", color: "red" }}>
        <div style={{ textAlign: "center" }}>
          <h1>Access Denied</h1>
          <p>You do not have permission to access the admin panel.</p>
          <a href="/dashboard" style={{ color: "#3B82F6", textDecoration: "none", fontWeight: "600" }}>Go to Dashboard</a>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      {/* Header */}
      <header style={styles.header}>
        <h1 style={styles.title}>Admin Dashboard</h1>
        <Link to="/" style={styles.logoutBtn}>
          Back to Home
        </Link>
      </header>

      {/* Main Content */}
      <div style={styles.mainContent}>
        <div style={styles.contentHeader}>
          <h2 style={styles.contentTitle}>Manage Doctors</h2>
          <button
            style={styles.addButton}
            onClick={() => setShowForm(!showForm)}
          >
            {showForm ? "Close Form" : "+ Add New Doctor"}
          </button>
        </div>

        {message && <div style={styles.successMessage}>{message}</div>}
        {error && <div style={styles.errorMessage}>{error}</div>}

        {/* Form Section */}
        {showForm && (
          <form onSubmit={handleSubmit} style={styles.form}>
            <h3 style={styles.formTitle}>
              {editingId ? "Edit Doctor" : "Add New Doctor"}
            </h3>

            <div style={styles.formGrid}>
              <div style={styles.formGroup}>
                <label style={styles.label}>Doctor Name *</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="Enter doctor's full name"
                  style={styles.input}
                  required
                />
              </div>

              <div style={styles.formGroup}>
                <label style={styles.label}>Specialty *</label>
                <input
                  type="text"
                  name="specialty"
                  value={formData.specialty}
                  onChange={handleInputChange}
                  placeholder="e.g., Cardiologist, Dentist"
                  style={styles.input}
                  required
                />
              </div>

              <div style={styles.formGroup}>
                <label style={styles.label}>Experience (years) *</label>
                <input
                  type="number"
                  name="experience"
                  value={formData.experience}
                  onChange={handleInputChange}
                  placeholder="e.g., 5"
                  style={styles.input}
                  required
                />
              </div>

              <div style={styles.formGroup}>
                <label style={styles.label}>Consultation Fee (₹) *</label>
                <input
                  type="number"
                  name="fee"
                  value={formData.fee}
                  onChange={handleInputChange}
                  placeholder="e.g., 350"
                  style={styles.input}
                  required
                />
              </div>

              <div style={styles.formGroup}>
                <label style={styles.label}>Availability *</label>
                <input
                  type="text"
                  name="availability"
                  value={formData.availability}
                  onChange={handleInputChange}
                  placeholder="e.g., Mon, Wed, Fri"
                  style={styles.input}
                  required
                />
              </div>

              <div style={styles.formGroup}>
                <label style={styles.label}>Timing *</label>
                <input
                  type="text"
                  name="timing"
                  value={formData.timing}
                  onChange={handleInputChange}
                  placeholder="e.g., 10:00 AM - 01:00 PM"
                  style={styles.input}
                  required
                />
              </div>

              <div style={{ ...styles.formGroup, gridColumn: "1 / -1" }}>
                <label style={styles.label}>Photo</label>
                <div
                  style={{
                    ...styles.dropZone,
                    backgroundColor: dragActive ? "#e3f2fd" : "#f9f9f9",
                    borderColor: dragActive ? "#3B82F6" : "#ddd",
                  }}
                  onDragEnter={handleDrag}
                  onDragLeave={handleDrag}
                  onDragOver={handleDrag}
                  onDrop={handleDrop}
                >
                  <input
                    type="file"
                    id="photo-input"
                    accept="image/*"
                    onChange={handleFileInput}
                    style={styles.fileInput}
                  />
                  <label htmlFor="photo-input" style={styles.dropZoneLabel}>
                    <div style={styles.dropZoneContent}>
                      <div style={styles.uploadIcon}>📸</div>
                      <p style={styles.dropZoneText}>
                        Drag and drop your image here or <strong>click to browse</strong>
                      </p>
                      <p style={styles.dropZoneSubtext}>
                        Supported formats: JPG, PNG, GIF, WebP
                      </p>
                    </div>
                  </label>
                </div>
                
                {photoPreview && (
                  <div style={styles.previewContainer}>
                    <div style={styles.previewLabel}>Preview:</div>
                    <img
                      src={photoPreview}
                      alt="Preview"
                      style={styles.previewImage}
                    />
                    <button
                      type="button"
                      onClick={() => {
                        setPhotoPreview("");
                        setFormData({ ...formData, photo: "" });
                      }}
                      style={styles.clearImageBtn}
                    >
                      Clear Image
                    </button>
                  </div>
                )}
              </div>
            </div>

            <div style={styles.buttonGroup}>
              <button type="submit" style={styles.submitBtn} disabled={loading}>
                {loading
                  ? editingId
                    ? "Updating..."
                    : "Adding..."
                  : editingId
                    ? "Update Doctor"
                    : "Add Doctor"}
              </button>
              <button
                type="button"
                style={styles.cancelBtn}
                onClick={handleCancel}
              >
                Cancel
              </button>
            </div>
          </form>
        )}

        {/* Doctors List */}
        <div style={styles.doctorsListContainer}>
          {doctors.length > 0 ? (
            <div style={styles.doctorsGrid}>
              {doctors.map((doctor, index) => (
                <div key={index} style={styles.doctorCard}>
                  <div style={styles.doctorCardHeader}>
                    <h3 style={styles.doctorCardTitle}>{doctor.name}</h3>
                    <div style={styles.actionButtons}>
                      <button
                        style={styles.editBtn}
                        onClick={() => handleEdit(doctor)}
                      >
                        ✏️ Edit
                      </button>
                      <button
                        style={styles.deleteBtn}
                        onClick={() => handleDelete(doctor.id)}
                      >
                        🗑️ Delete
                      </button>
                    </div>
                  </div>

                  <div style={styles.doctorInfo}>
                    <p style={styles.infoItem}>
                      <strong>Specialty:</strong> {doctor.specialty}
                    </p>
                    <p style={styles.infoItem}>
                      <strong>Experience:</strong> {doctor.experience} years
                    </p>
                    <p style={styles.infoItem}>
                      <strong>Fee:</strong> ₹{doctor.fee}
                    </p>
                    <p style={styles.infoItem}>
                      <strong>Available:</strong> {doctor.availability}
                    </p>
                    <p style={styles.infoItem}>
                      <strong>Timing:</strong> {doctor.timing}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div style={styles.noDoctorsMessage}>
              <p>No doctors added yet. Click "Add New Doctor" to get started!</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const styles = {
  container: {
    minHeight: "100vh",
    background: "#f9f9f9",
  },
  header: {
    background: "#3B82F6",
    color: "#fff",
    padding: "clamp(15px, 5vw, 25px)",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
    flexWrap: "wrap",
    gap: "15px",
  },
  title: {
    fontSize: "clamp(1.2rem, 5vw, 1.8rem)",
    fontWeight: "700",
    margin: 0,
  },
  logoutBtn: {
    padding: "8px 16px",
    background: "#fff",
    color: "#3B82F6",
    textDecoration: "none",
    borderRadius: "6px",
    fontWeight: "600",
    transition: "all 0.3s ease",
    fontSize: "clamp(0.8rem, 2vw, 0.95rem)",
  },
  mainContent: {
    maxWidth: "1400px",
    margin: "0 auto",
    padding: "clamp(20px, 5vw, 40px)",
  },
  contentHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "30px",
    flexWrap: "wrap",
    gap: "15px",
  },
  contentTitle: {
    fontSize: "clamp(1.2rem, 4vw, 1.5rem)",
    fontWeight: "700",
    color: "#1a1a1a",
    margin: 0,
  },
  addButton: {
    padding: "10px 20px",
    background: "#3B82F6",
    color: "#fff",
    border: "none",
    borderRadius: "6px",
    fontSize: "clamp(0.8rem, 2vw, 0.95rem)",
    fontWeight: "600",
    cursor: "pointer",
    transition: "all 0.3s ease",
    boxShadow: "0 2px 8px rgba(59, 130, 246, 0.3)",
    whiteSpace: "nowrap",
  },
  form: {
    background: "#fff",
    padding: "clamp(20px, 5vw, 30px)",
    borderRadius: "12px",
    marginBottom: "40px",
    boxShadow: "0 2px 12px rgba(0,0,0,0.05)",
    border: "1px solid #eee",
  },
  formTitle: {
    fontSize: "clamp(1.1rem, 4vw, 1.3rem)",
    fontWeight: "700",
    color: "#1a1a1a",
    marginBottom: "20px",
  },
  formGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
    gap: "15px",
    marginBottom: "20px",
  },
  formGroup: {
    display: "flex",
    flexDirection: "column",
  },
  label: {
    fontSize: "clamp(0.8rem, 2vw, 0.9rem)",
    fontWeight: "600",
    marginBottom: "6px",
    color: "#333",
  },
  input: {
    padding: "10px 12px",
    border: "1px solid #ddd",
    borderRadius: "6px",
    fontSize: "clamp(0.8rem, 2vw, 0.9rem)",
    transition: "border-color 0.3s ease",
    width: "100%",
    boxSizing: "border-box",
  },
  dropZone: {
    border: "2px dashed #ddd",
    borderRadius: "8px",
    padding: "clamp(20px, 5vw, 40px)",
    textAlign: "center",
    cursor: "pointer",
    transition: "all 0.3s ease",
    position: "relative",
  },
  fileInput: {
    display: "none",
  },
  dropZoneLabel: {
    cursor: "pointer",
    display: "block",
  },
  dropZoneContent: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
  },
  uploadIcon: {
    fontSize: "clamp(2rem, 8vw, 3rem)",
    marginBottom: "12px",
  },
  dropZoneText: {
    fontSize: "clamp(0.9rem, 3vw, 1rem)",
    color: "#333",
    margin: "8px 0",
    fontWeight: "500",
  },
  dropZoneSubtext: {
    fontSize: "clamp(0.75rem, 2vw, 0.85rem)",
    color: "#999",
    margin: "4px 0 0 0",
  },
  previewContainer: {
    marginTop: "20px",
    textAlign: "center",
  },
  previewLabel: {
    fontSize: "0.9rem",
    fontWeight: "600",
    marginBottom: "12px",
    color: "#333",
  },
  previewImage: {
    maxWidth: "100%",
    maxHeight: "300px",
    borderRadius: "8px",
    marginBottom: "12px",
    border: "1px solid #ddd",
  },
  clearImageBtn: {
    padding: "8px 16px",
    background: "#ef4444",
    color: "#fff",
    border: "none",
    borderRadius: "6px",
    fontSize: "0.85rem",
    fontWeight: "600",
    cursor: "pointer",
    transition: "all 0.3s ease",
  },
  buttonGroup: {
    display: "flex",
    gap: "10px",
    flexWrap: "wrap",
  },
  submitBtn: {
    padding: "10px 20px",
    background: "#3B82F6",
    color: "#fff",
    border: "none",
    borderRadius: "6px",
    fontSize: "clamp(0.8rem, 2vw, 0.95rem)",
    fontWeight: "600",
    cursor: "pointer",
    transition: "all 0.3s ease",
    flex: 1,
    minWidth: "120px",
  },
  cancelBtn: {
    padding: "10px 20px",
    background: "#f0f0f0",
    color: "#666",
    border: "1px solid #ddd",
    borderRadius: "6px",
    fontSize: "clamp(0.8rem, 2vw, 0.95rem)",
    fontWeight: "600",
    cursor: "pointer",
    transition: "all 0.3s ease",
    flex: 1,
    minWidth: "100px",
  },
  doctorsListContainer: {
    marginTop: "40px",
  },
  doctorsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))",
    gap: "clamp(15px, 4vw, 25px)",
  },
  doctorCard: {
    background: "#fff",
    padding: "clamp(15px, 4vw, 20px)",
    borderRadius: "12px",
    boxShadow: "0 2px 12px rgba(0,0,0,0.05)",
    border: "1px solid #eee",
    transition: "all 0.3s ease",
  },
  doctorCardHeader: {
    marginBottom: "15px",
    paddingBottom: "15px",
    borderBottom: "2px solid #3B82F6",
  },
  doctorCardTitle: {
    fontSize: "clamp(1rem, 4vw, 1.2rem)",
    fontWeight: "700",
    color: "#1a1a1a",
    margin: "0 0 10px 0",
    wordBreak: "break-word",
  },
  actionButtons: {
    display: "flex",
    gap: "8px",
    flexWrap: "wrap",
  },
  editBtn: {
    flex: 1,
    minWidth: "70px",
    padding: "8px 10px",
    background: "#3B82F6",
    color: "#fff",
    border: "none",
    borderRadius: "4px",
    fontSize: "clamp(0.75rem, 2vw, 0.85rem)",
    fontWeight: "600",
    cursor: "pointer",
    transition: "all 0.3s ease",
  },
  deleteBtn: {
    flex: 1,
    minWidth: "70px",
    padding: "8px 10px",
    background: "#ef4444",
    color: "#fff",
    border: "none",
    borderRadius: "4px",
    fontSize: "clamp(0.75rem, 2vw, 0.85rem)",
    fontWeight: "600",
    cursor: "pointer",
    transition: "all 0.3s ease",
  },
  doctorInfo: {
    display: "flex",
    flexDirection: "column",
    gap: "8px",
  },
  infoItem: {
    fontSize: "clamp(0.8rem, 2vw, 0.9rem)",
    color: "#666",
    margin: 0,
    lineHeight: "1.5",
    wordBreak: "break-word",
  },
  successMessage: {
    background: "#d4edda",
    color: "#155724",
    padding: "12px 16px",
    borderRadius: "6px",
    marginBottom: "20px",
    border: "1px solid #c3e6cb",
  },
  errorMessage: {
    background: "#f8d7da",
    color: "#721c24",
    padding: "12px 16px",
    borderRadius: "6px",
    marginBottom: "20px",
    border: "1px solid #f5c6cb",
  },
  noDoctorsMessage: {
    textAlign: "center",
    padding: "60px 20px",
    background: "#fff",
    borderRadius: "12px",
    color: "#999",
    border: "2px dashed #ddd",
  },
};

export default AdminDashboard;
