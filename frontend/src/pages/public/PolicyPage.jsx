import { useNavigate } from "react-router-dom";
import HomeNavbar from "../../components/shared/HomeNavbar";
import HomeFooter from "../../components/shared/HomeFooter";
import { FaArrowLeft } from "react-icons/fa";

const PolicyPage = () => {
  const navigate = useNavigate();
  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      <HomeNavbar />
      <div style={{ flex: 1, maxWidth: "900px", margin: "0 auto", padding: "40px 20px", paddingTop: "100px", width: "100%" }}>
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
            marginBottom: "20px",
            padding: "8px 0",
          }}
        >
          <FaArrowLeft /> Back
        </button>
        <h1 style={{ fontSize: "2.5rem", marginBottom: "20px", color: "#1a1a1a" }}>Privacy Policy</h1>
        <p style={{ fontSize: "0.9rem", color: "#666", marginBottom: "30px" }}>
          Last updated: {new Date().toLocaleDateString()}
        </p>

        <div style={{ lineHeight: "1.8", color: "#333" }}>
          <section style={{ marginBottom: "30px" }}>
            <h2 style={{ fontSize: "1.5rem", marginBottom: "15px", color: "#1a1a1a" }}>1. Introduction</h2>
            <p>
              AppointCare operates the website and mobile application. This page informs you of
              our policies regarding the collection, use, and disclosure of personal data when you use our services and
              the choices you have associated with that data.
            </p>
          </section>

          <section style={{ marginBottom: "30px" }}>
            <h2 style={{ fontSize: "1.5rem", marginBottom: "15px", color: "#1a1a1a" }}>2. Information Collection and Use</h2>
            <p>We collect several different types of information for various purposes to provide and improve our services:</p>
            <ul style={{ marginLeft: "20px", marginTop: "10px" }}>
              <li><strong>Personal Data:</strong> Name, email address, phone number, date of birth, medical history</li>
              <li><strong>Usage Data:</strong> Browser type, IP address, pages visited, time and date of visits</li>
              <li><strong>Device Data:</strong> Device type, operating system, unique device identifiers</li>
            </ul>
          </section>

          <section style={{ marginBottom: "30px" }}>
            <h2 style={{ fontSize: "1.5rem", marginBottom: "15px", color: "#1a1a1a" }}>3. Use of Data</h2>
            <p>AppointCare uses the collected data for various purposes:</p>
            <ul style={{ marginLeft: "20px", marginTop: "10px" }}>
              <li>To provide and maintain our services</li>
              <li>To notify you about changes to our services</li>
              <li>To allow you to participate in interactive features of our platform</li>
              <li>To provide customer support</li>
              <li>To gather analysis or valuable information to improve our services</li>
              <li>To monitor the usage of our services</li>
              <li>To detect, prevent and address technical and security issues</li>
            </ul>
          </section>

          <section style={{ marginBottom: "30px" }}>
            <h2 style={{ fontSize: "1.5rem", marginBottom: "15px", color: "#1a1a1a" }}>4. Security of Data</h2>
            <p>
              The security of your data is important to us but remember that no method of transmission over the Internet
              or method of electronic storage is 100% secure. We use SSL/TLS encryption and other security measures to
              protect your information, but we cannot guarantee its absolute security.
            </p>
          </section>

          <section style={{ marginBottom: "30px" }}>
            <h2 style={{ fontSize: "1.5rem", marginBottom: "15px", color: "#1a1a1a" }}>5. Changes to This Policy</h2>
            <p>
              We may update our policy from time to time. We will notify you of any changes by posting the new
              policy on this page and updating the Last updated date at the top.
            </p>
          </section>

          <section style={{ marginBottom: "30px" }}>
            <h2 style={{ fontSize: "1.5rem", marginBottom: "15px", color: "#1a1a1a" }}>6. Contact Us</h2>
            <p>
              If you have any questions about this policy, please contact us at support@appointcare.com
            </p>
          </section>

          <section>
            <h2 style={{ fontSize: "1.5rem", marginBottom: "15px", color: "#1a1a1a" }}>7. Your Rights</h2>
            <p>You have the right to:</p>
            <ul style={{ marginLeft: "20px", marginTop: "10px" }}>
              <li>Access your personal data</li>
              <li>Correct inaccurate data</li>
              <li>Request deletion of your data</li>
              <li>Request restriction of processing</li>
              <li>Data portability</li>
              <li>Withdraw consent at any time</li>
            </ul>
          </section>
        </div>
      </div>
      <HomeFooter />
    </div>
  );
};

export default PolicyPage;
