import { useNavigate } from "react-router-dom";
import HomeNavbar from "../../components/HomeNavbar";
import HomeFooter from "../../components/shared/HomeFooter";
import { FaArrowLeft } from "react-icons/fa";

const CookiesPage = () => {
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
        <h1 style={{ fontSize: "2.5rem", marginBottom: "20px", color: "#1a1a1a" }}>Cookie Policy</h1>
        <p style={{ fontSize: "0.9rem", color: "#666", marginBottom: "30px" }}>
          Last updated: {new Date().toLocaleDateString()}
        </p>

        <div style={{ lineHeight: "1.8", color: "#333" }}>
          <section style={{ marginBottom: "30px" }}>
            <h2 style={{ fontSize: "1.5rem", marginBottom: "15px", color: "#1a1a1a" }}>1. What Are Cookies</h2>
            <p>
              Cookies are small text files that are placed on your computer or mobile device when you visit a website.
              They are widely used to make websites work more efficiently and to provide information to the owners of
              the site. Cookies help us enhance your experience on our platform.
            </p>
          </section>

          <section style={{ marginBottom: "30px" }}>
            <h2 style={{ fontSize: "1.5rem", marginBottom: "15px", color: "#1a1a1a" }}>2. How We Use Cookies</h2>
            <p>AppointCare uses cookies for the following purposes:</p>
            <ul style={{ marginLeft: "20px", marginTop: "10px" }}>
              <li><strong>Essential Cookies:</strong> Required for the operation of our website. They enable core functionality such as security, network management, and accessibility.</li>
              <li><strong>Authentication Cookies:</strong> Used to recognize you when you log in and keep you logged in during your session.</li>
              <li><strong>Preference Cookies:</strong> Enable the website to remember information that changes how the website behaves or looks, such as your preferred language.</li>
              <li><strong>Analytics Cookies:</strong> Help us understand how visitors interact with our website by collecting and reporting information anonymously.</li>
            </ul>
          </section>

          <section style={{ marginBottom: "30px" }}>
            <h2 style={{ fontSize: "1.5rem", marginBottom: "15px", color: "#1a1a1a" }}>3. Types of Cookies We Use</h2>
            <div style={{ marginTop: "15px" }}>
              <h3 style={{ fontSize: "1.2rem", marginBottom: "10px", color: "#333" }}>Session Cookies</h3>
              <p>
                These are temporary cookies that expire when you close your browser. They are essential for the website
                to function properly and are deleted automatically after your session ends.
              </p>
            </div>
            <div style={{ marginTop: "15px" }}>
              <h3 style={{ fontSize: "1.2rem", marginBottom: "10px", color: "#333" }}>Persistent Cookies</h3>
              <p>
                These cookies remain on your device for a set period or until you delete them. They help us recognize
                you as an existing user, making it easier for you to return to AppointCare without signing in again.
              </p>
            </div>
            <div style={{ marginTop: "15px" }}>
              <h3 style={{ fontSize: "1.2rem", marginBottom: "10px", color: "#333" }}>First-Party Cookies</h3>
              <p>
                These are cookies set by AppointCare directly. We use them to remember your preferences and improve
                your experience on our platform.
              </p>
            </div>
          </section>

          <section style={{ marginBottom: "30px" }}>
            <h2 style={{ fontSize: "1.5rem", marginBottom: "15px", color: "#1a1a1a" }}>4. Managing Cookies</h2>
            <p>
              Most web browsers allow you to control cookies through their settings. You can set your browser to:
            </p>
            <ul style={{ marginLeft: "20px", marginTop: "10px" }}>
              <li>Block all cookies</li>
              <li>Accept only first-party cookies</li>
              <li>Delete cookies when you close your browser</li>
              <li>Notify you when a website sets a cookie</li>
            </ul>
            <p style={{ marginTop: "15px" }}>
              Please note that blocking or deleting cookies may impact your experience on our website and limit the
              functionality available to you.
            </p>
          </section>

          <section style={{ marginBottom: "30px" }}>
            <h2 style={{ fontSize: "1.5rem", marginBottom: "15px", color: "#1a1a1a" }}>5. Cookie Consent</h2>
            <p>
              By continuing to use our website, you consent to our use of cookies as described in this policy.
              If you do not agree to our use of cookies, you should adjust your browser settings accordingly or
              refrain from using our website.
            </p>
          </section>

          <section style={{ marginBottom: "30px" }}>
            <h2 style={{ fontSize: "1.5rem", marginBottom: "15px", color: "#1a1a1a" }}>6. Changes to This Policy</h2>
            <p>
              We may update our Cookie Policy from time to time. We will notify you of any changes by posting the new
              Cookie Policy on this page and updating the "Last updated" date. You are advised to review this Cookie
              Policy periodically for any changes.
            </p>
          </section>

          <section style={{ marginBottom: "30px" }}>
            <h2 style={{ fontSize: "1.5rem", marginBottom: "15px", color: "#1a1a1a" }}>7. Contact Us</h2>
            <p>
              If you have any questions about our Cookie Policy, please contact us:
            </p>
            <ul style={{ marginLeft: "20px", marginTop: "10px" }}>
              <li>Email: privacy@appointcare.com</li>
              <li>Phone: +977-1-4XXXXXX</li>
              <li>Address: Kathmandu, Nepal</li>
            </ul>
          </section>
        </div>
      </div>
      <HomeFooter />
    </div>
  );
};

export default CookiesPage;
