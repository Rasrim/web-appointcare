import React, { useState, useEffect, useCallback } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { API_URL } from "../utils/api";
import HomeNavbar from "../components/HomeNavbar";
import Navbar from "../components/Navbar";
import HomeFooter from "../components/HomeFooter";
import doctorImage from "../images/doctor1.png";
import { FaSearch, FaMapMarkerAlt, FaStar, FaArrowLeft } from "react-icons/fa";
import useDoctorSync from "../hooks/useDoctorSync";

const AllDoctors = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [doctors, setDoctors] = useState([]);
  const [filteredDoctors, setFilteredDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState(searchParams.get("search") || "");
  const [selectedSpecialty, setSelectedSpecialty] = useState("");
  const [specialties, setSpecialties] = useState([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  const filterDoctorsFunction = useCallback(() => {
    let filtered = doctors;

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (doctor) =>
          doctor.name?.toLowerCase().includes(query) ||
          doctor.specialization?.toLowerCase().includes(query) ||
          doctor.location?.toLowerCase().includes(query)
      );
    }

    if (selectedSpecialty) {
      filtered = filtered.filter((d) => (d.specialty || d.specialization) === selectedSpecialty);
    }

    setFilteredDoctors(filtered);
  }, [doctors, searchQuery, selectedSpecialty]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsLoggedIn(!!token);
    fetchDoctors();

    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    filterDoctorsFunction();
  }, [filterDoctorsFunction]);

  // Sync doctors when admin updates them
  useDoctorSync(fetchDoctors);

  const fetchDoctors = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_URL}/api/doctors`);
      if (!response.ok) throw new Error("Failed to fetch doctors");
      const data = await response.json();
      setDoctors(data || []);
      
      const uniqueSpecialties = [...new Set(data?.map((d) => d.specialty || d.specialization))].filter(Boolean);
      setSpecialties(uniqueSpecialties);
      setError(null);
    } catch (err) {
      setError(err.message);
      console.error("Error fetching doctors:", err);
    } finally {
      setLoading(false);
    }
  };

  const NavbarComponent = isLoggedIn ? Navbar : HomeNavbar;

  const styles = {
    container: {
      minHeight: "100vh",
      display: "flex",
      flexDirection: "column",
    },
    wrapper: {
      flex: 1,
      maxWidth: "1280px",
      margin: "0 auto",
      padding: "0 20px",
      paddingTop: "80px",
      width: "100%",
      boxSizing: "border-box",
    },
    backButton: {
      display: "flex",
      alignItems: "center",
      gap: "8px",
      backgroundColor: "transparent",
      border: "none",
      color: "#3B82F6",
      fontSize: "16px",
      fontWeight: "600",
      cursor: "pointer",
      marginBottom: "32px",
      padding: "8px",
    },
    headerSection: {
      marginBottom: "40px",
    },
    title: {
      fontSize: "36px",
      fontWeight: "bold",
      marginBottom: "20px",
      color: "#1a1a1a",
    },
    description: {
      fontSize: "18px",
      color: "#4b5563",
      marginBottom: "32px",
    },
    filterContainer: {
      display: "grid",
      gridTemplateColumns: isMobile ? "1fr" : "repeat(4, 1fr)",
      gap: "16px",
      marginBottom: "20px",
    },
    searchInputWrapper: {
      position: "relative",
      gridColumn: isMobile ? "1" : "span 3",
    },
    searchInput: {
      width: "100%",
      paddingLeft: "40px",
      paddingRight: "16px",
      paddingTop: "12px",
      paddingBottom: "12px",
      fontSize: "16px",
      border: "2px solid #e5e7eb",
      borderRadius: "8px",
      outline: "none",
      transition: "all 0.3s ease",
      boxSizing: "border-box",
    },
    searchIcon: {
      position: "absolute",
      left: "12px",
      top: "50%",
      transform: "translateY(-50%)",
      color: "#9ca3af",
      fontSize: "16px",
      pointerEvents: "none",
    },
    selectFilter: {
      paddingLeft: "16px",
      paddingRight: "16px",
      paddingTop: "12px",
      paddingBottom: "12px",
      fontSize: "16px",
      border: "2px solid #e5e7eb",
      borderRadius: "8px",
      cursor: "pointer",
      backgroundColor: "#ffffff",
      outline: "none",
      transition: "all 0.3s ease",
      boxSizing: "border-box",
    },
    clearButton: {
      paddingLeft: "16px",
      paddingRight: "16px",
      paddingTop: "8px",
      paddingBottom: "8px",
      backgroundColor: "#f3f4f6",
      color: "#374151",
      border: "1px solid #d1d5db",
      borderRadius: "6px",
      cursor: "pointer",
      fontSize: "14px",
      fontWeight: "500",
      transition: "all 0.3s ease",
    },
    loadingMessage: {
      textAlign: "center",
      paddingTop: "64px",
      paddingBottom: "64px",
      fontSize: "18px",
      color: "#4b5563",
    },
    errorMessage: {
      backgroundColor: "#fee2e2",
      color: "#b91c1c",
      padding: "16px",
      borderRadius: "8px",
      marginBottom: "20px",
      borderLeft: "4px solid #dc2626",
    },
    errorStrong: {
      fontWeight: "bold",
    },
    emptyState: {
      textAlign: "center",
      paddingTop: "64px",
      paddingBottom: "64px",
      backgroundColor: "#f9fafb",
      borderRadius: "8px",
      border: "2px dashed #e5e7eb",
    },
    emptyIcon: {
      fontSize: "48px",
      color: "#d1d5db",
      marginBottom: "12px",
    },
    emptyText: {
      fontSize: "18px",
      color: "#4b5563",
    },
    resultsInfo: {
      fontSize: "14px",
      color: "#4b5563",
      marginBottom: "20px",
    },
    resultsBold: {
      fontWeight: "bold",
    },
    doctorsGrid: {
      display: "grid",
      gridTemplateColumns: isMobile ? "1fr" : window.innerWidth < 1024 ? "repeat(2, 1fr)" : "repeat(3, 1fr)",
      gap: "24px",
    },
    doctorCard: {
      backgroundColor: "#ffffff",
      border: "1px solid #e5e7eb",
      borderRadius: "12px",
      padding: "20px",
      textAlign: "center",
      boxShadow: "0 1px 2px 0 rgba(0, 0, 0, 0.05)",
      transition: "all 0.3s ease",
    },
    doctorImage: {
      width: "112px",
      height: "112px",
      margin: "0 auto 16px",
      borderRadius: "50%",
      overflow: "hidden",
      border: "4px solid #3B82F6",
    },
    doctorImageTag: {
      width: "100%",
      height: "100%",
      objectFit: "cover",
    },
    doctorName: {
      fontSize: "20px",
      fontWeight: "bold",
      color: "#1a1a1a",
      marginBottom: "4px",
    },
    doctorSpecialty: {
      color: "#3B82F6",
      fontWeight: "600",
      marginBottom: "4px",
      fontSize: "14px",
    },
    doctorTitle: {
      color: "#6b7280",
      fontSize: "14px",
      marginBottom: "16px",
    },
    doctorDetails: {
      display: "flex",
      justifyContent: "center",
      gap: "20px",
      marginBottom: "16px",
      paddingBottom: "16px",
      borderBottom: "1px solid #e5e7eb",
      flexWrap: "wrap",
    },
    doctorDetail: {
      display: "flex",
      alignItems: "center",
      gap: "8px",
      fontSize: "14px",
      color: "#4b5563",
    },
    doctorTiming: {
      display: "flex",
      justifyContent: "center",
      gap: "8px",
      marginBottom: "16px",
      flexWrap: "wrap",
      alignItems: "center",
    },
    doctorTimingText: {
      fontSize: "14px",
      color: "#4b5563",
    },
    doctorTimingSmall: {
      fontSize: "12px",
      color: "#6b7280",
    },
    bookButton: {
      width: "100%",
      paddingTop: "8px",
      paddingBottom: "8px",
      backgroundColor: "#3B82F6",
      color: "#ffffff",
      border: "none",
      borderRadius: "6px",
      fontSize: "16px",
      fontWeight: "600",
      cursor: "pointer",
      transition: "all 0.3s ease",
    },
  };

  return (
    <div style={styles.container}>
      <NavbarComponent />
      <div style={styles.wrapper}>
        <button
          onClick={() => navigate("/")}
          style={styles.backButton}
          onMouseOver={(e) => e.target.style.color = "#2563EB"}
          onMouseOut={(e) => e.target.style.color = "#3B82F6"}
        >
          <FaArrowLeft /> Back
        </button>

        <div style={styles.headerSection}>
          <h1 style={styles.title}>Find a Doctor</h1>
          <p style={styles.description}>
            Search and filter doctors by name, specialization, or location
          </p>

          <div style={styles.filterContainer}>
            <div style={styles.searchInputWrapper}>
              <input
                type="text"
                placeholder="Search by doctor name, specialty, or location..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={styles.searchInput}
                onFocus={(e) => {
                  e.target.style.borderColor = "#3B82F6";
                  e.target.style.boxShadow = "0 0 0 2px rgba(59, 130, 246, 0.1)";
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = "#e5e7eb";
                  e.target.style.boxShadow = "none";
                }}
              />
              <FaSearch style={styles.searchIcon} />
            </div>

            <select
              value={selectedSpecialty}
              onChange={(e) => setSelectedSpecialty(e.target.value)}
              style={styles.selectFilter}
              onFocus={(e) => {
                e.target.style.borderColor = "#3B82F6";
              }}
              onBlur={(e) => {
                e.target.style.borderColor = "#e5e7eb";
              }}
            >
              <option value="">All Specialties</option>
              {specialties.map((spec) => (
                <option key={spec} value={spec}>
                  {spec}
                </option>
              ))}
            </select>
          </div>

          {searchQuery || selectedSpecialty ? (
            <button
              onClick={() => {
                setSearchQuery("");
                setSelectedSpecialty("");
              }}
              style={styles.clearButton}
              onMouseOver={(e) => e.target.style.backgroundColor = "#e5e7eb"}
              onMouseOut={(e) => e.target.style.backgroundColor = "#f3f4f6"}
            >
              Clear filters
            </button>
          ) : null}
        </div>

        {loading && (
          <div style={styles.loadingMessage}>
            <p>Loading doctors...</p>
          </div>
        )}

        {error && (
          <div style={styles.errorMessage}>
            <strong style={styles.errorStrong}>Error:</strong> {error}
          </div>
        )}

        {!loading && filteredDoctors.length === 0 && (
          <div style={styles.emptyState}>
            <FaSearch style={styles.emptyIcon} />
            <p style={styles.emptyText}>
              {doctors.length === 0
                ? "No doctors available"
                : "No doctors match your search criteria"}
            </p>
          </div>
        )}

        {!loading && filteredDoctors.length > 0 && (
          <div>
            <p style={styles.resultsInfo}>
              Found <span style={styles.resultsBold}>{filteredDoctors.length}</span> doctor(s)
            </p>
            <div style={styles.doctorsGrid}>
              {filteredDoctors.map((doctor) => (
                <div
                  key={doctor.id}
                  style={styles.doctorCard}
                  onMouseOver={(e) => {
                    e.currentTarget.style.boxShadow = "0 4px 6px -1px rgba(0, 0, 0, 0.1)";
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.boxShadow = "0 1px 2px 0 rgba(0, 0, 0, 0.05)";
                  }}
                >
                  <div style={styles.doctorImage}>
                    <img 
                      src={doctor.photo && doctor.photo.trim() ? `${API_URL}/uploads/${doctor.photo}` : doctorImage} 
                      alt={doctor.name}
                      style={styles.doctorImageTag}
                      onError={(e) => {e.target.src = doctorImage}}
                    />
                  </div>
                  <h3 style={styles.doctorName}>{doctor.name}</h3>
                  <p style={styles.doctorSpecialty}>{doctor.specialty || doctor.specialization}</p>
                  <p style={styles.doctorTitle}>Specialist | {doctor.experience || "5"} years experience</p>
                  <div style={styles.doctorDetails}>
                    <div style={styles.doctorDetail}>
                      <span>📅</span>
                      <span>{doctor.availability || "Tue, Thu"}</span>
                    </div>
                    <div style={styles.doctorDetail}>
                      <span>₹</span>
                      <span>{doctor.fee || "350"}</span>
                    </div>
                  </div>
                  <div style={styles.doctorTiming}>
                    <span style={styles.doctorTimingText}>{doctor.timing || "10:00 AM-01:00 PM"}</span>
                    <span style={styles.doctorTimingSmall}>Starting</span>
                  </div>
                  <button
                    style={styles.bookButton}
                    onClick={() => {
                      const token = localStorage.getItem("token");
                      if (!token) {
                        navigate("/login");
                        return;
                      }
                      navigate('/book-appointment-details', { state: { doctor } });
                    }}
                    onMouseOver={(e) => {
                      e.target.style.backgroundColor = "#2563EB";
                      e.target.style.boxShadow = "0 4px 6px -1px rgba(0, 0, 0, 0.1)";
                    }}
                    onMouseOut={(e) => {
                      e.target.style.backgroundColor = "#3B82F6";
                      e.target.style.boxShadow = "none";
                    }}
                  >
                    Book an appointment
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
      <HomeFooter />
    </div>
  );
};

export default AllDoctors;
