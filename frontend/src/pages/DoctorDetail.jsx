import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { API_URL } from "../utils/api";
import doctorNotificationService from "../utils/doctorNotificationService";
import HomeNavbar from "../components/HomeNavbar";
import HomeFooter from "../components/HomeFooter";
import doctorImage from "../images/doctor1.png";
import { FaArrowLeft, FaStar, FaMapMarkerAlt, FaCalendarAlt, FaClock } from "react-icons/fa";

const DoctorDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [doctor, setDoctor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchDoctorDetails();
  }, [id]);

  // Listen for updates to this specific doctor
  useEffect(() => {
    const unsubscribe = doctorNotificationService.subscribe((event) => {
      if (event.type === 'DOCTOR_UPDATED' && event.doctor && event.doctor.id === parseInt(id)) {
        // Doctor was updated, refresh details
        fetchDoctorDetails();
      } else if (event.type === 'DOCTOR_DELETED' && event.doctorId === parseInt(id)) {
        // Doctor was deleted, navigate back
        navigate('/all-doctors');
      } else if (event.type === 'DOCTOR_LIST_REFRESH') {
        // Full refresh triggered
        fetchDoctorDetails();
      }
    });
    return () => unsubscribe();
  }, [id, navigate]);

  const fetchDoctorDetails = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_URL}/api/doctors/${id}`);
      if (!response.ok) throw new Error("Failed to fetch doctor details");
      const data = await response.json();
      setDoctor(data);
      setError(null);
    } catch (err) {
      setError(err.message);
      console.error("Error fetching doctor:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleBookAppointment = () => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }
    navigate('/book-appointment-details', { state: { doctor } });
  };

  if (loading) {
    return (
      <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
        <HomeNavbar />
        <div
          style={{
            flex: 1,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "1.2rem",
            color: "#3B82F6",
          }}
        >
          Loading...
        </div>
        <HomeFooter />
      </div>
    );
  }

  if (error || !doctor) {
    return (
      <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
        <HomeNavbar />
        <div
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            padding: "40px 20px",
            textAlign: "center",
          }}
        >
          <h2 style={{ color: "#d32f2f", marginBottom: "20px" }}>Doctor Not Found</h2>
          <button
            onClick={() => navigate(-1)}
            style={{
              padding: "10px 20px",
              background: "#3B82F6",
              color: "#fff",
              border: "none",
              borderRadius: "6px",
              cursor: "pointer",
              fontSize: "1rem",
            }}
          >
            Go Back
          </button>
        </div>
        <HomeFooter />
      </div>
    );
  }

  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      <HomeNavbar />
      <div style={{ flex: 1, paddingTop: "70px" }}>
        <div
          style={{
            maxWidth: "1000px",
            margin: "0 auto",
            padding: "40px 20px",
          }}
        >
          {/* Back Button */}
          <button
            onClick={() => navigate(-1)}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              background: "none",
              border: "none",
              color: "#3B82F6",
              cursor: "pointer",
              fontSize: "1rem",
              marginBottom: "30px",
              padding: "0",
            }}
          >
            <FaArrowLeft /> Back
          </button>

          {/* Doctor Card */}
          <div
            style={{
              background: "#fff",
              borderRadius: "12px",
              boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
              overflow: "hidden",
            }}
          >
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "40px", padding: "40px" }}>
              {/* Left Side - Doctor Image */}
              <div style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
                <div
                  style={{
                    width: "300px",
                    height: "300px",
                    borderRadius: "12px",
                    overflow: "hidden",
                    backgroundColor: "#f0f0f0",
                    border: "4px solid #3B82F6",
                  }}
                >
                  <img
                    src={doctor.photo && doctor.photo.trim() ? `${API_URL}/uploads/${doctor.photo}` : doctorImage}
                    alt={doctor.name}
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                    }}
                    onError={(e) => {e.target.src = doctorImage}}
                  />
                </div>
              </div>

              {/* Right Side - Doctor Info */}
              <div>
                <h1 style={{ fontSize: "2rem", marginBottom: "10px", color: "#1a1a1a" }}>
                  {doctor.name}
                </h1>
                <p
                  style={{
                    fontSize: "1.3rem",
                    color: "#3B82F6",
                    fontWeight: "600",
                    marginBottom: "20px",
                  }}
                >
                  {doctor.specialty || doctor.specialization}
                </p>

                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr",
                    gap: "20px",
                    marginBottom: "30px",
                  }}
                >
                  <div
                    style={{
                      padding: "15px",
                      background: "#f9f9f9",
                      borderRadius: "8px",
                      borderLeft: "4px solid #3B82F6",
                    }}
                  >
                    <p style={{ margin: "0", color: "#666", fontSize: "0.9rem" }}>Experience</p>
                    <p style={{ margin: "5px 0 0 0", fontSize: "1.2rem", fontWeight: "600", color: "#1a1a1a" }}>
                      {doctor.experience || "5"} Years
                    </p>
                  </div>

                  <div
                    style={{
                      padding: "15px",
                      background: "#f9f9f9",
                      borderRadius: "8px",
                      borderLeft: "4px solid #3B82F6",
                    }}
                  >
                    <p style={{ margin: "0", color: "#666", fontSize: "0.9rem" }}>Consultation Fee</p>
                    <p style={{ margin: "5px 0 0 0", fontSize: "1.2rem", fontWeight: "600", color: "#1a1a1a" }}>
                      ₹{doctor.fee || "350"}
                    </p>
                  </div>

                  <div
                    style={{
                      padding: "15px",
                      background: "#f9f9f9",
                      borderRadius: "8px",
                      borderLeft: "4px solid #3B82F6",
                    }}
                  >
                    <p style={{ margin: "0", color: "#666", fontSize: "0.9rem" }}>Availability</p>
                    <p style={{ margin: "5px 0 0 0", fontSize: "1.1rem", fontWeight: "600", color: "#1a1a1a" }}>
                      {doctor.availability || "Tue, Thu"}
                    </p>
                  </div>

                  <div
                    style={{
                      padding: "15px",
                      background: "#f9f9f9",
                      borderRadius: "8px",
                      borderLeft: "4px solid #3B82F6",
                    }}
                  >
                    <p style={{ margin: "0", color: "#666", fontSize: "0.9rem" }}>Timing</p>
                    <p style={{ margin: "5px 0 0 0", fontSize: "1.1rem", fontWeight: "600", color: "#1a1a1a" }}>
                      {doctor.timing || "10:00 AM - 01:00 PM"}
                    </p>
                  </div>
                </div>

                <button
                  onClick={handleBookAppointment}
                  style={{
                    width: "100%",
                    padding: "15px",
                    background: "#3B82F6",
                    color: "#fff",
                    border: "none",
                    borderRadius: "8px",
                    fontSize: "1.1rem",
                    fontWeight: "600",
                    cursor: "pointer",
                    transition: "all 0.3s ease",
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.background = "#2563EB";
                    e.target.style.transform = "translateY(-2px)";
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.background = "#3B82F6";
                    e.target.style.transform = "translateY(0)";
                  }}
                >
                  Book an Appointment
                </button>
              </div>
            </div>
          </div>

          {/* About Section */}
          {doctor.about && (
            <div
              style={{
                marginTop: "40px",
                padding: "30px",
                background: "#f9f9f9",
                borderRadius: "12px",
              }}
            >
              <h2 style={{ marginBottom: "15px", color: "#1a1a1a" }}>About Dr. {doctor.name}</h2>
              <p style={{ lineHeight: "1.8", color: "#666" }}>{doctor.about}</p>
            </div>
          )}
        </div>
      </div>
      <HomeFooter />
    </div>
  );
};

export default DoctorDetail;
