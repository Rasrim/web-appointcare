import HomeNavbar from "../../components/HomeNavbar";
import HomeFooter from "../../components/HomeFooter";

const TermsAndConditions = () => {
  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      <HomeNavbar />
      <div style={{ flex: 1, maxWidth: "900px", margin: "0 auto", padding: "40px 20px", width: "100%" }}>
        <h1 style={{ fontSize: "2.5rem", marginBottom: "20px", color: "#1a1a1a" }}>Terms and Conditions</h1>
        <p style={{ fontSize: "0.9rem", color: "#666", marginBottom: "30px" }}>
          Last updated: {new Date().toLocaleDateString()}
        </p>

        <div style={{ lineHeight: "1.8", color: "#333" }}>
          <section style={{ marginBottom: "30px" }}>
            <h2 style={{ fontSize: "1.5rem", marginBottom: "15px", color: "#1a1a1a" }}>1. Acceptance of Terms</h2>
            <p>
              By accessing and using AppointCare, you accept and agree to be bound by the terms and provision of this
              agreement. If you do not agree to abide by the above, please do not use this service.
            </p>
          </section>

          <section style={{ marginBottom: "30px" }}>
            <h2 style={{ fontSize: "1.5rem", marginBottom: "15px", color: "#1a1a1a" }}>2. Use License</h2>
            <p>
              Permission is granted to temporarily download one copy of the materials (information or software) on
              AppointCare for personal, non-commercial transitory viewing only. This is the grant of a license, not a
              transfer of title, and under this license you may not:
            </p>
            <ul style={{ marginLeft: "20px", marginTop: "10px" }}>
              <li>Modifying or copying the materials</li>
              <li>Using the materials for any commercial purpose or for any public display</li>
              <li>Attempting to reverse engineer any software contained on AppointCare</li>
              <li>Removing any copyright or other proprietary notations from the materials</li>
              <li>Transferring the materials to another person or "mirroring" the materials on any other server</li>
            </ul>
          </section>

          <section style={{ marginBottom: "30px" }}>
            <h2 style={{ fontSize: "1.5rem", marginBottom: "15px", color: "#1a1a1a" }}>3. Disclaimer</h2>
            <p>
              The materials on AppointCare are provided on an 'as is' basis. AppointCare makes no warranties, expressed
              or implied, and hereby disclaims and negates all other warranties including, without limitation, implied
              warranties or conditions of merchantability, fitness for a particular purpose, or non-infringement of
              intellectual property or other violation of rights.
            </p>
          </section>

          <section style={{ marginBottom: "30px" }}>
            <h2 style={{ fontSize: "1.5rem", marginBottom: "15px", color: "#1a1a1a" }}>4. Limitations</h2>
            <p>
              In no event shall AppointCare or its suppliers be liable for any damages (including, without limitation,
              damages for loss of data or profit, or due to business interruption) arising out of the use or inability
              to use the materials on AppointCare.
            </p>
          </section>

          <section style={{ marginBottom: "30px" }}>
            <h2 style={{ fontSize: "1.5rem", marginBottom: "15px", color: "#1a1a1a" }}>5. Accuracy of Materials</h2>
            <p>
              The materials appearing on AppointCare could include technical, typographical, or photographic errors.
              AppointCare does not warrant that any of the materials on AppointCare are accurate, complete, or current.
              AppointCare may make changes to the materials contained on AppointCare at any time without notice.
            </p>
          </section>

          <section style={{ marginBottom: "30px" }}>
            <h2 style={{ fontSize: "1.5rem", marginBottom: "15px", color: "#1a1a1a" }}>6. Links</h2>
            <p>
              AppointCare has not reviewed all of the sites linked to its website and is not responsible for the
              contents of any such linked site. The inclusion of any link does not imply endorsement by AppointCare of
              the site. Use of any such linked website is at the user's own risk.
            </p>
          </section>

          <section style={{ marginBottom: "30px" }}>
            <h2 style={{ fontSize: "1.5rem", marginBottom: "15px", color: "#1a1a1a" }}>7. Modifications</h2>
            <p>
              AppointCare may revise these terms of service for its website at any time without notice. By using this
              website, you are agreeing to be bound by the then current version of these terms of service.
            </p>
          </section>

          <section style={{ marginBottom: "30px" }}>
            <h2 style={{ fontSize: "1.5rem", marginBottom: "15px", color: "#1a1a1a" }}>8. Governing Law</h2>
            <p>
              These terms and conditions are governed by and construed in accordance with the laws of the jurisdiction
              in which AppointCare operates, and you irrevocably submit to the exclusive jurisdiction of the courts in
              that location.
            </p>
          </section>

          <section>
            <h2 style={{ fontSize: "1.5rem", marginBottom: "15px", color: "#1a1a1a" }}>9. Contact Us</h2>
            <p>
              If you have any questions about these terms and conditions, please contact us at{" "}
              <strong>support@appointcare.com</strong>
            </p>
          </section>
        </div>
      </div>
      <HomeFooter />
    </div>
  );
};

export default TermsAndConditions;
