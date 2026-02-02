import React, { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import HomeNavbar from "../../components/shared/HomeNavbar";
import Navbar from "../../components/shared/Navbar";
import HomeFooter from "../../components/shared/HomeFooter";
import { FaSearch, FaMapMarkerAlt, FaStar, FaArrowLeft } from "react-icons/fa";

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

  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsLoggedIn(!!token);
    fetchDoctors();
  }, []);

  useEffect(() => {
    filterDoctors();
  }, [doctors, searchQuery, selectedSpecialty]);

  const fetchDoctors = async () => {
    try {
      setLoading(true);
      const response = await fetch("http://localhost:3000/api/doctors");
      if (!response.ok) throw new Error("Failed to fetch doctors");
      const data = await response.json();
      setDoctors(data || []);
      
      const uniqueSpecialties = [...new Set(data?.map((d) => d.specialization))].filter(Boolean);
      setSpecialties(uniqueSpecialties);
      setError(null);
    } catch (err) {
      setError(err.message);
      console.error("Error fetching doctors:", err);
    } finally {
      setLoading(false);
    }
  };

  const filterDoctors = () => {
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
      filtered = filtered.filter((d) => d.specialization === selectedSpecialty);
    }

    setFilteredDoctors(filtered);
  };

  const handleBookAppointment = (doctorId) => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }
    navigate(`/book-appointment/${doctorId}`);
  };

  const NavbarComponent = isLoggedIn ? Navbar : HomeNavbar;

  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      <NavbarComponent />
      <div
        style={{
          flex: 1,
          maxWidth: "1200px",
          margin: "0 auto",
          padding: "40px 20px",
          paddingTop: "120px",
          width: "100%",
        }}
      >
        <button
          onClick={() => navigate(-1)}
          style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
            background: "none",
            border: "none",
            color: "#3B82F6",
            fontSize: "1rem",
            fontWeight: "500",
            cursor: "pointer",
            marginBottom: "30px",
            padding: "8px 0",
          }}
        >
          <FaArrowLeft /> Back
        </button>

        <div style={{ marginBottom: "40px" }}>
          <h1 style={{ fontSize: "2.5rem", marginBottom: "20px", color: "#1a1a1a" }}>
            Find a Doctor
          </h1>
          <p style={{ fontSize: "1.1rem", color: "#666", marginBottom: "30px" }}>
            Search and filter doctors by name, specialization, or location
          </p>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr auto",
              gap: "15px",
              marginBottom: "20px",
              "@media (max-width: 768px)": {
                gridTemplateColumns: "1fr",
              },
            }}
          >
            <div style={{ display: "flex", gap: "10px" }}>
              <div style={{ flex: 1, position: "relative" }}>
                <input
                  type="text"
                  placeholder="Search by doctor name, specialty, or location..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  style={{
                    width: "100%",
                    padding: "12px 15px 12px 40px",
                    fontSize: "1rem",
                    border: "2px solid #E5E7EB",
                    borderRadius: "8px",
                    boxSizing: "border-box",
                    transition: "all 0.3s",
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = "#3B82F6";
                    e.target.style.boxShadow = "0 0 0 3px rgba(59, 130, 246, 0.1)";
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = "#E5E7EB";
                    e.target.style.boxShadow = "none";
                  }}
                />
                <FaSearch
                  style={{
                    position: "absolute",
                    left: "12px",
                    top: "50%",
                    transform: "translateY(-50%)",
                    color: "#9CA3AF",
                    fontSize: "1rem",
                  }}
                />
              </div>
            </div>

            <select
              value={selectedSpecialty}
              onChange={(e) => setSelectedSpecialty(e.target.value)}
              style={{
                padding: "12px 15px",
                fontSize: "1rem",
                border: "2px solid #E5E7EB",
                borderRadius: "8px",
                cursor: "pointer",
                backgroundColor: "white",
                minWidth: "200px",
                transition: "all 0.3s",
              }}
              onFocus={(e) => {
                e.target.style.borderColor = "#3B82F6";
              }}
              onBlur={(e) => {
                e.target.style.borderColor = "#E5E7EB";
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
              style={{
                padding: "8px 16px",
                backgroundColor: "#F3F4F6",
                color: "#6B7280",
                border: "1px solid #D1D5DB",
                borderRadius: "6px",
                cursor: "pointer",
                fontSize: "0.9rem",
                fontWeight: "500",
              }}
            >
              Clear filters
            </button>
          ) : null}
        </div>

        {loading && (
          <div style={{ textAlign: "center", padding: "60px 20px" }}>
            <p style={{ fontSize: "1.1rem", color: "#666" }}>Loading doctors...</p>
          </div>
        )}

        {error && (
          <div
            style={{
              backgroundColor: "#FEE2E2",
              color: "#DC2626",
              padding: "15px 20px",
              borderRadius: "8px",
              marginBottom: "20px",
              borderLeft: "4px solid #DC2626",
            }}
          >
            <strong>Error:</strong> {error}
          </div>
        )}

        {!loading && filteredDoctors.length === 0 && (
          <div
            style={{
              textAlign: "center",
              padding: "60px 20px",
              backgroundColor: "#F9FAFB",
              borderRadius: "8px",
              border: "2px dashed #D1D5DB",
            }}
          >
            <FaSearch style={{ fontSize: "3rem", color: "#D1D5DB", marginBottom: "10px" }} />
            <p style={{ fontSize: "1.1rem", color: "#6B7280" }}>
              {doctors.length === 0
                ? "No doctors available"
                : "No doctors match your search criteria"}
            </p>
          </div>
        )}

        {!loading && filteredDoctors.length > 0 && (
          <div>
            <p style={{ fontSize: "0.95rem", color: "#6B7280", marginBottom: "20px" }}>
              Found <strong>{filteredDoctors.length}</strong> doctor(s)
            </p>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
                gap: "20px",
              }}
            >
              {filteredDoctors.map((doctor) => (
                <div
                  key={doctor.id}
                  style={{
                    backgroundColor: "white",
                    borderRadius: "12px",
                    overflow: "hidden",
                    border: "1px solid #E5E7EB",
                    boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
                    transition: "all 0.3s ease",
                    display: "flex",
                    flexDirection: "column",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.boxShadow = "0 10px 25px rgba(0,0,0,0.15)";
                    e.currentTarget.style.transform = "translateY(-5px)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.boxShadow = "0 1px 3px rgba(0,0,0,0.1)";
                    e.currentTarget.style.transform = "translateY(0)";
                  }}
                >
                  {doctor.profileImage && (
                    <div
                      style={{
                        width: "100%",
                        height: "200px",
                        backgroundColor: "#F3F4F6",
                        backgroundImage: `url(${doctor.profileImage})`,
                        backgroundSize: "cover",
                        backgroundPosition: "center",
                      }}
                    />
                  )}

                  <div style={{ padding: "20px", flex: 1, display: "flex", flexDirection: "column" }}>
                    <h3 style={{ fontSize: "1.3rem", fontWeight: "600", marginBottom: "5px", color: "#1a1a1a" }}>
                      {doctor.name}
                    </h3>

                    {doctor.specialization && (
                      <p
                        style={{
                          fontSize: "0.95rem",
                          color: "#3B82F6",
                          fontWeight: "500",
                          marginBottom: "10px",
                        }}
                      >
                        {doctor.specialization}
                      </p>
                    )}

                    {doctor.rating && (
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "5px",
                          marginBottom: "10px",
                        }}
                      >
                        <FaStar style={{ color: "#FBBF24", fontSize: "0.9rem" }} />
                        <span style={{ fontSize: "0.9rem", color: "#666" }}>
                          {doctor.rating}/5 ({doctor.reviews || 0} reviews)
                        </span>
                      </div>
                    )}

                    {doctor.location && (
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "8px",
                          color: "#666",
                          fontSize: "0.9rem",
                          marginBottom: "10px",
                        }}
                      >
                        <FaMapMarkerAlt style={{ color: "#EF4444" }} />
                        {doctor.location}
                      </div>
                    )}

                    {doctor.bio && (
                      <p
                        style={{
                          fontSize: "0.9rem",
                          color: "#666",
                          marginBottom: "15px",
                          flex: 1,
                        }}
                      >
                        {doctor.bio}
                      </p>
                    )}

                    <button
                      onClick={() => handleBookAppointment(doctor.id)}
                      style={{
                        width: "100%",
                        backgroundColor: "#3B82F6",
                        color: "white",
                        padding: "12px",
                        border: "none",
                        borderRadius: "6px",
                        cursor: "pointer",
                        fontWeight: "600",
                        fontSize: "1rem",
                        transition: "all 0.3s ease",
                      }}
                      onMouseEnter={(e) => {
                        e.target.style.backgroundColor = "#2563EB";
                      }}
                      onMouseLeave={(e) => {
                        e.target.style.backgroundColor = "#3B82F6";
                      }}
                    >
                      Book Appointment
                    </button>
                  </div>
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
