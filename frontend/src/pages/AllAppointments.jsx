import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { FaArrowLeft, FaCalendarAlt, FaClock, FaStethoscope } from "react-icons/fa";

const AllAppointments = () => {
  const navigate = useNavigate();
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchAppointments();
  }, []);

  const fetchAppointments = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/login");
        return;
      }

      const response = await fetch("http://localhost:3000/api/appointments", {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch appointments");
      }

      const data = await response.json();
      setAppointments(data || []);
      setError(null);
    } catch (err) {
      setError(err.message);
      console.error("Error fetching appointments:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleCancelAppointment = async (appointmentId) => {
    if (!window.confirm("Are you sure you want to cancel this appointment?")) {
      return;
    }

    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `http://localhost:3000/api/appointments/${appointmentId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to cancel appointment");
      }

      setAppointments(
        appointments.filter((apt) => apt.id !== appointmentId)
      );
    } catch (err) {
      toast.error("Error cancelling appointment: " + err.message);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const formatTime = (timeString) => {
    return timeString ? timeString.substring(0, 5) : "N/A";
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case "confirmed":
        return "#10B981";
      case "pending":
        return "#F59E0B";
      case "cancelled":
        return "#EF4444";
      default:
        return "#6B7280";
    }
  };

  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      <HomeNavbar />
      <div
        style={{
          flex: 1,
          maxWidth: "1000px",
          margin: "0 auto",
          padding: "40px 20px",
          paddingTop: "120px",
          width: "100%",
        }}
      >
        <button
          onClick={() => navigate("/")}
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
          <FaArrowLeft /> Back to Home
        </button>

        <h1 style={{ fontSize: "2.5rem", marginBottom: "10px", color: "#1a1a1a" }}>
          My Appointments
        </h1>
        <p style={{ fontSize: "1.1rem", color: "#666", marginBottom: "30px" }}>
          Manage your scheduled appointments
        </p>

        {loading && (
          <div style={{ textAlign: "center", padding: "40px 20px" }}>
            <p style={{ fontSize: "1.1rem", color: "#666" }}>
              Loading appointments...
            </p>
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

        {!loading && appointments.length === 0 && (
          <div
            style={{
              textAlign: "center",
              padding: "40px 20px",
              backgroundColor: "#F9FAFB",
              borderRadius: "8px",
              border: "2px dashed #D1D5DB",
            }}
          >
            <FaCalendarAlt
              style={{ fontSize: "3rem", color: "#D1D5DB", marginBottom: "10px" }}
            />
            <p style={{ fontSize: "1.1rem", color: "#6B7280" }}>
              No appointments scheduled yet
            </p>
            <button
              onClick={() => navigate("/all-doctors")}
              style={{
                marginTop: "15px",
                backgroundColor: "#3B82F6",
                color: "white",
                padding: "10px 20px",
                border: "none",
                borderRadius: "6px",
                cursor: "pointer",
                fontSize: "1rem",
                fontWeight: "500",
              }}
            >
              Book an Appointment
            </button>
          </div>
        )}

        {!loading && appointments.length > 0 && (
          <div style={{ display: "grid", gap: "20px" }}>
            {appointments.map((appointment) => (
              <div
                key={appointment.id}
                style={{
                  backgroundColor: "white",
                  border: "1px solid #E5E7EB",
                  borderRadius: "12px",
                  padding: "20px",
                  boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
                  transition: "all 0.3s ease",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.boxShadow = "0 4px 12px rgba(0,0,0,0.15)";
                  e.currentTarget.style.borderColor = "#3B82F6";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.boxShadow = "0 1px 3px rgba(0,0,0,0.1)";
                  e.currentTarget.style.borderColor = "#E5E7EB";
                }}
              >
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1fr auto",
                    gap: "20px",
                    alignItems: "center",
                  }}
                >
                  <div>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "10px",
                        marginBottom: "15px",
                      }}
                    >
                      <FaStethoscope
                        style={{ color: "#3B82F6", fontSize: "1.2rem" }}
                      />
                      <h3
                        style={{
                          fontSize: "1.3rem",
                          fontWeight: "600",
                          color: "#1a1a1a",
                          margin: 0,
                        }}
                      >
                        {appointment.doctor?.name || "Dr. Unknown"}
                      </h3>
                    </div>

                    <div style={{ display: "grid", gap: "10px", marginBottom: "15px" }}>
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "10px",
                          color: "#666",
                        }}
                      >
                        <FaCalendarAlt style={{ color: "#3B82F6" }} />
                        <span>{formatDate(appointment.appointmentDate)}</span>
                      </div>
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "10px",
                          color: "#666",
                        }}
                      >
                        <FaClock style={{ color: "#3B82F6" }} />
                        <span>{formatTime(appointment.appointmentTime)}</span>
                      </div>
                      {appointment.doctor?.specialization && (
                        <div style={{ color: "#666" }}>
                          Specialization:{" "}
                          <span style={{ fontWeight: "600" }}>
                            {appointment.doctor.specialization}
                          </span>
                        </div>
                      )}
                    </div>

                    {appointment.notes && (
                      <div
                        style={{
                          backgroundColor: "#F9FAFB",
                          padding: "10px",
                          borderRadius: "6px",
                          borderLeft: "3px solid #3B82F6",
                        }}
                      >
                        <strong style={{ color: "#1a1a1a" }}>Notes:</strong>
                        <p style={{ margin: "5px 0 0 0", color: "#666" }}>
                          {appointment.notes}
                        </p>
                      </div>
                    )}
                  </div>

                  <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                    <div
                      style={{
                        backgroundColor: getStatusColor(appointment.status),
                        color: "white",
                        padding: "8px 12px",
                        borderRadius: "6px",
                        textAlign: "center",
                        fontWeight: "600",
                        fontSize: "0.9rem",
                        minWidth: "120px",
                      }}
                    >
                      {appointment.status || "Pending"}
                    </div>

                    {appointment.status?.toLowerCase() !== "cancelled" && (
                      <button
                        onClick={() => handleCancelAppointment(appointment.id)}
                        style={{
                          backgroundColor: "#EF4444",
                          color: "white",
                          padding: "8px 12px",
                          border: "none",
                          borderRadius: "6px",
                          cursor: "pointer",
                          fontWeight: "600",
                          fontSize: "0.9rem",
                          transition: "all 0.3s ease",
                        }}
                        onMouseEnter={(e) => {
                          e.target.style.backgroundColor = "#DC2626";
                        }}
                        onMouseLeave={(e) => {
                          e.target.style.backgroundColor = "#EF4444";
                        }}
                      >
                        Cancel
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AllAppointments;
