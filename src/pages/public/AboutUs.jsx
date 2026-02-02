import HomeNavbar from "../../components/HomeNavbar";
import HomeFooter from "../../components/HomeFooter";

const AboutUs = () => {
  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      <HomeNavbar />
      <div style={{ flex: 1, maxWidth: "900px", margin: "0 auto", padding: "40px 20px", width: "100%" }}>
        <h1 style={{ fontSize: "2.5rem", marginBottom: "20px", color: "#1a1a1a" }}>About AppointCare</h1>

        <div style={{ lineHeight: "1.8", color: "#333" }}>
          <section style={{ marginBottom: "30px" }}>
            <h2 style={{ fontSize: "1.5rem", marginBottom: "15px", color: "#1a1a1a" }}>Our Mission</h2>
            <p>
              At AppointCare, we're committed to revolutionizing healthcare accessibility by providing a seamless,
              secure, and user-friendly platform that connects patients with qualified healthcare professionals. Our
              mission is to make quality healthcare available to everyone, regardless of geographic location or time
              constraints.
            </p>
          </section>

          <section style={{ marginBottom: "30px" }}>
            <h2 style={{ fontSize: "1.5rem", marginBottom: "15px", color: "#1a1a1a" }}>Who We Are</h2>
            <p>
              AppointCare is a modern healthcare technology company founded with the vision of transforming how patients
              access medical services. Our team comprises healthcare professionals, software developers, and innovators
              dedicated to creating a better healthcare experience.
            </p>
          </section>

          <section style={{ marginBottom: "30px" }}>
            <h2 style={{ fontSize: "1.5rem", marginBottom: "15px", color: "#1a1a1a" }}>What We Offer</h2>
            <ul style={{ marginLeft: "20px", marginTop: "10px" }}>
              <li>Easy appointment booking with verified healthcare professionals</li>
              <li>Secure telemedicine consultations</li>
              <li>Digital prescriptions and medical records management</li>
              <li>Real-time appointment reminders</li>
              <li>AI-powered symptom checker for initial guidance</li>
              <li>Multi-language support for accessibility</li>
            </ul>
          </section>

          <section style={{ marginBottom: "30px" }}>
            <h2 style={{ fontSize: "1.5rem", marginBottom: "15px", color: "#1a1a1a" }}>Our Values</h2>
            <div style={{ marginTop: "15px" }}>
              <div style={{ marginBottom: "15px" }}>
                <h3 style={{ color: "#3B82F6", marginBottom: "5px" }}>Patient First</h3>
                <p>Every decision we make is centered around improving the patient experience.</p>
              </div>
              <div style={{ marginBottom: "15px" }}>
                <h3 style={{ color: "#3B82F6", marginBottom: "5px" }}>Security & Privacy</h3>
                <p>Your health information is sacred. We employ industry-leading security measures.</p>
              </div>
              <div style={{ marginBottom: "15px" }}>
                <h3 style={{ color: "#3B82F6", marginBottom: "5px" }}>Innovation</h3>
                <p>We continuously innovate to provide cutting-edge healthcare solutions.</p>
              </div>
              <div>
                <h3 style={{ color: "#3B82F6", marginBottom: "5px" }}>Accessibility</h3>
                <p>Healthcare should be accessible to everyone, everywhere.</p>
              </div>
            </div>
          </section>

          <section style={{ marginBottom: "30px" }}>
            <h2 style={{ fontSize: "1.5rem", marginBottom: "15px", color: "#1a1a1a" }}>Why Choose AppointCare?</h2>
            <ul style={{ marginLeft: "20px", marginTop: "10px" }}>
              <li>Verified and licensed healthcare professionals</li>
              <li>24/7 availability for appointments</li>
              <li>HIPAA compliant and secure</li>
              <li>Affordable and transparent pricing</li>
              <li>Multiple payment options</li>
              <li>Excellent customer support</li>
            </ul>
          </section>

          <section>
            <h2 style={{ fontSize: "1.5rem", marginBottom: "15px", color: "#1a1a1a" }}>Get in Touch</h2>
            <p>
              Have questions or feedback? We'd love to hear from you. Contact our team at{" "}
              <strong>support@appointcare.com</strong> or visit our contact page.
            </p>
          </section>
        </div>
      </div>
      <HomeFooter />
    </div>
  );
};

export default AboutUs;
