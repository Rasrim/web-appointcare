import { useNavigate } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa";
import HomeNavbar from "../../components/HomeNavbar";
import HomeFooter from "../../components/HomeFooter";

const Support = () => {
  const navigate = useNavigate();
  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      <HomeNavbar />
      <div style={{ flex: 1, maxWidth: "900px", margin: "0 auto", padding: "40px 20px", width: "100%", paddingTop: "80px" }}>
        <button
          onClick={() => navigate("/")}
          style={{
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
          }}
          onMouseOver={(e) => e.target.style.color = "#2563EB"}
          onMouseOut={(e) => e.target.style.color = "#3B82F6"}
        >
          <FaArrowLeft /> Back
        </button>
        <h1 style={{ fontSize: "2.5rem", marginBottom: "20px", color: "#1a1a1a" }}>Customer Support</h1>

        <div style={{ lineHeight: "1.8", color: "#333" }}>
          <section style={{ marginBottom: "40px" }}>
            <h2 style={{ fontSize: "1.5rem", marginBottom: "15px", color: "#1a1a1a" }}>How Can We Help?</h2>
            <p>
              At AppointCare, we're committed to providing you with the best support experience. Whether you have
              questions about your account, need technical assistance, or have feedback, our support team is here to
              help.
            </p>
          </section>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "30px", marginBottom: "40px" }}>
            <div style={{ padding: "20px", backgroundColor: "#f0f7ff", borderRadius: "8px" }}>
              <h3 style={{ fontSize: "1.2rem", marginBottom: "10px", color: "#3B82F6" }}>Email Support</h3>
              <p style={{ marginBottom: "10px" }}>
                Send us an email and we'll get back to you within 24 hours.
              </p>
              <p style={{ fontWeight: "600" }}>support@appointcare.com</p>
            </div>

            <div style={{ padding: "20px", backgroundColor: "#f0f7ff", borderRadius: "8px" }}>
              <h3 style={{ fontSize: "1.2rem", marginBottom: "10px", color: "#3B82F6" }}>Live Chat</h3>
              <p style={{ marginBottom: "10px" }}>
                Chat with our support team in real-time. Available 24/7.
              </p>
              <button
                style={{
                  padding: "8px 16px",
                  backgroundColor: "#3B82F6",
                  color: "#fff",
                  border: "none",
                  borderRadius: "5px",
                  cursor: "pointer",
                  fontWeight: "600",
                }}
              >
                Start Chat
              </button>
            </div>

            <div style={{ padding: "20px", backgroundColor: "#f0f7ff", borderRadius: "8px" }}>
              <h3 style={{ fontSize: "1.2rem", marginBottom: "10px", color: "#3B82F6" }}>Phone Support</h3>
              <p style={{ marginBottom: "10px" }}>
                Call us during business hours for immediate assistance.
              </p>
              <p style={{ fontWeight: "600" }}>+1 (555) 123-4567</p>
            </div>

            <div style={{ padding: "20px", backgroundColor: "#f0f7ff", borderRadius: "8px" }}>
              <h3 style={{ fontSize: "1.2rem", marginBottom: "10px", color: "#3B82F6" }}>Help Center</h3>
              <p style={{ marginBottom: "10px" }}>
                Browse our comprehensive knowledge base and tutorials.
              </p>
              <button
                style={{
                  padding: "8px 16px",
                  backgroundColor: "#3B82F6",
                  color: "#fff",
                  border: "none",
                  borderRadius: "5px",
                  cursor: "pointer",
                  fontWeight: "600",
                }}
              >
                Browse Help
              </button>
            </div>
          </div>

          <section style={{ marginBottom: "40px" }}>
            <h2 style={{ fontSize: "1.5rem", marginBottom: "15px", color: "#1a1a1a" }}>Support Categories</h2>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }}>
              <div>
                <h3 style={{ color: "#3B82F6", marginBottom: "10px" }}>Account & Billing</h3>
                <ul style={{ marginLeft: "20px", color: "#666" }}>
                  <li>Managing your account</li>
                  <li>Payment issues</li>
                  <li>Refund requests</li>
                  <li>Password reset</li>
                </ul>
              </div>
              <div>
                <h3 style={{ color: "#3B82F6", marginBottom: "10px" }}>Technical Support</h3>
                <ul style={{ marginLeft: "20px", color: "#666" }}>
                  <li>App not working</li>
                  <li>Login issues</li>
                  <li>Browser compatibility</li>
                  <li>Connection problems</li>
                </ul>
              </div>
              <div>
                <h3 style={{ color: "#3B82F6", marginBottom: "10px" }}>Appointments</h3>
                <ul style={{ marginLeft: "20px", color: "#666" }}>
                  <li>Booking assistance</li>
                  <li>Rescheduling</li>
                  <li>Cancellations</li>
                  <li>Doctor information</li>
                </ul>
              </div>
              <div>
                <h3 style={{ color: "#3B82F6", marginBottom: "10px" }}>Medical Questions</h3>
                <ul style={{ marginLeft: "20px", color: "#666" }}>
                  <li>Health concerns</li>
                  <li>Medical advice</li>
                  <li>Prescription issues</li>
                  <li>Health records</li>
                </ul>
              </div>
            </div>
          </section>

          <section>
            <h2 style={{ fontSize: "1.5rem", marginBottom: "15px", color: "#1a1a1a" }}>Response Times</h2>
            <table
              style={{
                width: "100%",
                borderCollapse: "collapse",
                marginTop: "15px",
              }}
            >
              <thead>
                <tr style={{ backgroundColor: "#f0f7ff" }}>
                  <th style={{ padding: "10px", textAlign: "left", borderBottom: "2px solid #3B82F6" }}>
                    Support Channel
                  </th>
                  <th style={{ padding: "10px", textAlign: "left", borderBottom: "2px solid #3B82F6" }}>
                    Response Time
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr style={{ borderBottom: "1px solid #eee" }}>
                  <td style={{ padding: "10px" }}>Live Chat</td>
                  <td style={{ padding: "10px" }}>Within 5 minutes</td>
                </tr>
                <tr style={{ borderBottom: "1px solid #eee" }}>
                  <td style={{ padding: "10px" }}>Email</td>
                  <td style={{ padding: "10px" }}>Within 24 hours</td>
                </tr>
                <tr style={{ borderBottom: "1px solid #eee" }}>
                  <td style={{ padding: "10px" }}>Phone</td>
                  <td style={{ padding: "10px" }}>Immediate (during business hours)</td>
                </tr>
                <tr>
                  <td style={{ padding: "10px" }}>Help Center</td>
                  <td style={{ padding: "10px" }}>Instant access 24/7</td>
                </tr>
              </tbody>
            </table>
          </section>
        </div>
      </div>
      <HomeFooter />
    </div>
  );
};

export default Support;
