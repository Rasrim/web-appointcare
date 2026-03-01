import { useNavigate } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa";
import { toast } from "react-toastify";
import HomeNavbar from "../../components/HomeNavbar";
import HomeFooter from "../../components/HomeFooter";

const ContactUs = () => {
  const navigate = useNavigate();
  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission
    toast.success("Thank you for your message. We'll get back to you soon!");
  };

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
        <h1 style={{ fontSize: "2.5rem", marginBottom: "20px", color: "#1a1a1a" }}>Contact Us</h1>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "40px", marginBottom: "40px" }}>
          <div>
            <h2 style={{ fontSize: "1.3rem", marginBottom: "15px", color: "#1a1a1a" }}>Get in Touch</h2>
            <div style={{ marginBottom: "20px" }}>
              <h3 style={{ color: "#3B82F6", marginBottom: "5px" }}>Email</h3>
              <p>support@appointcare.com</p>
              <p>privacy@appointcare.com</p>
            </div>
            <div style={{ marginBottom: "20px" }}>
              <h3 style={{ color: "#3B82F6", marginBottom: "5px" }}>Phone</h3>
              <p>+1 (555) 123-4567</p>
              <p>+1 (555) 987-6543</p>
            </div>
            <div style={{ marginBottom: "20px" }}>
              <h3 style={{ color: "#3B82F6", marginBottom: "5px" }}>Office Hours</h3>
              <p>Monday - Friday: 9:00 AM - 6:00 PM</p>
              <p>Saturday: 10:00 AM - 4:00 PM</p>
              <p>Sunday: Closed</p>
            </div>
            <div>
              <h3 style={{ color: "#3B82F6", marginBottom: "5px" }}>Address</h3>
              <p>AppointCare Inc.</p>
              <p>123 Healthcare Avenue</p>
              <p>Medical City, ST 12345</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
            <div>
              <label style={{ display: "block", marginBottom: "5px", fontWeight: "500", color: "#1a1a1a" }}>
                Full Name
              </label>
              <input
                type="text"
                required
                placeholder="Your Name"
                style={{
                  width: "100%",
                  padding: "10px",
                  border: "1px solid #ddd",
                  borderRadius: "5px",
                  fontSize: "1rem",
                  boxSizing: "border-box",
                }}
              />
            </div>
            <div>
              <label style={{ display: "block", marginBottom: "5px", fontWeight: "500", color: "#1a1a1a" }}>
                Email
              </label>
              <input
                type="email"
                required
                placeholder="your@email.com"
                style={{
                  width: "100%",
                  padding: "10px",
                  border: "1px solid #ddd",
                  borderRadius: "5px",
                  fontSize: "1rem",
                  boxSizing: "border-box",
                }}
              />
            </div>
            <div>
              <label style={{ display: "block", marginBottom: "5px", fontWeight: "500", color: "#1a1a1a" }}>
                Subject
              </label>
              <input
                type="text"
                required
                placeholder="Subject"
                style={{
                  width: "100%",
                  padding: "10px",
                  border: "1px solid #ddd",
                  borderRadius: "5px",
                  fontSize: "1rem",
                  boxSizing: "border-box",
                }}
              />
            </div>
            <div>
              <label style={{ display: "block", marginBottom: "5px", fontWeight: "500", color: "#1a1a1a" }}>
                Message
              </label>
              <textarea
                required
                placeholder="Your message..."
                rows="5"
                style={{
                  width: "100%",
                  padding: "10px",
                  border: "1px solid #ddd",
                  borderRadius: "5px",
                  fontSize: "1rem",
                  boxSizing: "border-box",
                  fontFamily: "inherit",
                }}
              />
            </div>
            <button
              type="submit"
              style={{
                padding: "12px 24px",
                backgroundColor: "#3B82F6",
                color: "#fff",
                border: "none",
                borderRadius: "5px",
                fontSize: "1rem",
                fontWeight: "600",
                cursor: "pointer",
                transition: "background-color 0.3s ease",
              }}
              onMouseEnter={(e) => (e.target.style.backgroundColor = "#2563EB")}
              onMouseLeave={(e) => (e.target.style.backgroundColor = "#3B82F6")}
            >
              Send Message
            </button>
          </form>
        </div>
      </div>
      <HomeFooter />
    </div>
  );
};

export default ContactUs;
