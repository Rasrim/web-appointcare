const TermsAndConditions = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div style={styles.overlay} onClick={onClose}>
      <div style={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div style={styles.header}>
          <h2 style={styles.title}>Terms and Conditions</h2>
          <button style={styles.closeButton} onClick={onClose}>✕</button>
        </div>

        <div style={styles.content}>
          <section style={styles.section}>
            <h3 style={styles.sectionTitle}>1. Services Description</h3>
            <p style={styles.text}>
              AppointCare is an online platform that facilitates scheduling and managing medical appointments 
              between patients and healthcare providers. We act as a medium for appointment booking and do not 
              provide direct medical services. All medical services are provided by independent licensed healthcare 
              professionals and medical facilities.
            </p>
          </section>

          <section style={styles.section}>
            <h3 style={styles.sectionTitle}>2. User Responsibilities</h3>
            <p style={styles.text}>
              Users agree to:
            </p>
            <ul style={styles.list}>
              <li>Provide accurate and truthful information during registration and appointment booking</li>
              <li>Maintain confidentiality of their account login credentials</li>
              <li>Provide valid contact information and keep it updated</li>
              <li>Notify healthcare providers of any medical allergies or conditions relevant to their treatment</li>
              <li>Comply with all applicable laws and regulations</li>
            </ul>
          </section>

          <section style={styles.section}>
            <h3 style={styles.sectionTitle}>3. Appointment Booking and Cancellation Policy</h3>
            <p style={styles.text}>
              <strong>Booking:</strong> Appointments must be booked at least 24 hours in advance. 
              The platform will confirm appointment availability based on doctor schedules.
            </p>
            <p style={styles.text}>
              <strong>Cancellation:</strong> Users may cancel appointments up to 24 hours before the scheduled time 
              without penalty. Cancellations made less than 24 hours before the appointment may result in 
              cancellation fees as determined by the healthcare provider.
            </p>
            <p style={styles.text}>
              <strong>Rescheduling:</strong> Users can reschedule appointments subject to doctor availability 
              and the same cancellation policy.
            </p>
          </section>

          <section style={styles.section}>
            <h3 style={styles.sectionTitle}>4. Medical Records and Privacy</h3>
            <p style={styles.text}>
              Your medical information, personal data, and appointment history are protected under applicable 
              healthcare privacy laws and regulations. We implement industry-standard security measures to protect 
              your data. Your personal health information will only be shared with healthcare providers as necessary 
              for treatment purposes and will not be sold or shared with third parties without your explicit consent.
            </p>
          </section>

          <section style={styles.section}>
            <h3 style={styles.sectionTitle}>5. Doctor-Patient Confidentiality</h3>
            <p style={styles.text}>
              All interactions between patients and healthcare providers through AppointCare are subject to 
              professional medical confidentiality. Doctors are bound by their professional ethics and legal obligations 
              to maintain confidentiality regarding patient information and medical consultations.
            </p>
          </section>

          <section style={styles.section}>
            <h3 style={styles.sectionTitle}>6. Payment Terms</h3>
            <p style={styles.text}>
              Payment for services should be made as per the healthcare provider's billing policy. 
              AppointCare may facilitate payments but is not responsible for billing disputes. 
              All payment information is encrypted and processed securely.
            </p>
          </section>

          <section style={styles.section}>
            <h3 style={styles.sectionTitle}>7. No-Show Policy</h3>
            <p style={styles.text}>
              If a patient fails to appear for a scheduled appointment without cancellation or notification 
              at least 24 hours in advance, they may be subject to a no-show fee as determined by the healthcare provider. 
              Repeated no-shows may result in account suspension.
            </p>
          </section>

          <section style={styles.section}>
            <h3 style={styles.sectionTitle}>8. Limitation of Liability</h3>
            <p style={styles.text}>
              AppointCare provides the platform for appointment scheduling and does not guarantee specific medical outcomes. 
              We are not liable for:
            </p>
            <ul style={styles.list}>
              <li>Medical advice provided by healthcare professionals</li>
              <li>Treatment outcomes or medical decisions</li>
              <li>Data loss due to circumstances beyond our control</li>
              <li>Technical issues or service interruptions</li>
            </ul>
          </section>

          <section style={styles.section}>
            <h3 style={styles.sectionTitle}>9. Disclaimer of Medical Advice</h3>
            <p style={styles.text}>
              AppointCare is not a medical service provider and does not provide medical advice. 
              Any information provided on our platform is for informational purposes only. 
              Always consult with qualified healthcare professionals for medical advice, diagnosis, or treatment.
            </p>
          </section>

          <section style={styles.section}>
            <h3 style={styles.sectionTitle}>10. Intellectual Property</h3>
            <p style={styles.text}>
              All content, features, and functionality of AppointCare (including but not limited to software, design, 
              text, and graphics) are owned by AppointCare or its content suppliers and are protected by international 
              copyright, trademark, and other intellectual property laws.
            </p>
          </section>

          <section style={styles.section}>
            <h3 style={styles.sectionTitle}>11. Prohibited Activities</h3>
            <p style={styles.text}>
              Users agree not to:
            </p>
            <ul style={styles.list}>
              <li>Upload or transmit viruses or any other malicious code</li>
              <li>Collect or track personal information of others without consent</li>
              <li>Spam, phish, or engage in fraudulent activities</li>
              <li>Violate any laws or regulations</li>
              <li>Harass or threaten healthcare providers or other users</li>
            </ul>
          </section>

          <section style={styles.section}>
            <h3 style={styles.sectionTitle}>12. Account Suspension and Termination</h3>
            <p style={styles.text}>
              AppointCare reserves the right to suspend or terminate user accounts that violate these terms, 
              engage in fraudulent activities, or pose a risk to other users or healthcare providers.
            </p>
          </section>

          <section style={styles.section}>
            <h3 style={styles.sectionTitle}>13. Modifications to Terms</h3>
            <p style={styles.text}>
              AppointCare may modify these terms and conditions at any time. Continued use of the platform 
              after modifications constitutes acceptance of the updated terms.
            </p>
          </section>

          <section style={styles.section}>
            <h3 style={styles.sectionTitle}>14. Governing Law</h3>
            <p style={styles.text}>
              These terms and conditions are governed by applicable local and national laws. 
              Any disputes shall be resolved through appropriate legal channels.
            </p>
          </section>

          <section style={styles.section}>
            <h3 style={styles.sectionTitle}>15. Contact Us</h3>
            <p style={styles.text}>
              For questions regarding these Terms and Conditions, privacy concerns, or complaints, 
              please contact us at support@appointcare.com or visit our help center.
            </p>
          </section>
        </div>

        <div style={styles.footer}>
          <button style={styles.acceptButton} onClick={onClose}>
            I Understand and Agree
          </button>
        </div>
      </div>
    </div>
  );
};

const styles = {
  overlay: {
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.6)",
    display: "flex",
    alignItems: "center",
    // justifyContent: "center",
    zIndex: 1000,
    padding: "20px",
  },
  modal: {
    backgroundColor: "#fff",
    borderRadius: "8px",
    boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1), 0 10px 25px rgba(0, 0, 0, 0.2)",
    maxWidth: "700px",
    width: "100%",
    maxHeight: "90vh",
    display: "flex",
    flexDirection: "column",
    overflow: "hidden",
  },
  header: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "20px 24px",
    borderBottom: "1px solid #e5e7eb",
    flexShrink: 0,
  },
  title: {
    fontSize: "1.5rem",
    fontWeight: "700",
    color: "#1a1a1a",
    margin: 0,
  },
  closeButton: {
    background: "none",
    border: "none",
    fontSize: "1.5rem",
    cursor: "pointer",
    color: "#666",
    padding: "0",
    width: "32px",
    height: "32px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: "4px",
    transition: "background-color 0.2s",
  },
  content: {
    flex: 1,
    overflowY: "auto",
    padding: "24px",
  },
  section: {
    marginBottom: "20px",
  },
  sectionTitle: {
    fontSize: "1.05rem",
    fontWeight: "600",
    color: "#333",
    margin: "0 0 10px 0",
  },
  text: {
    fontSize: "0.95rem",
    color: "#555",
    lineHeight: "1.6",
    margin: "0 0 12px 0",
  },
  list: {
    fontSize: "0.95rem",
    color: "#555",
    lineHeight: "1.6",
    marginLeft: "20px",
    marginTop: "8px",
  },
  footer: {
    padding: "16px 24px",
    borderTop: "1px solid #e5e7eb",
    display: "flex",
    justifyContent: "flex-end",
    gap: "10px",
    flexShrink: 0,
    backgroundColor: "#f9fafb",
  },
  acceptButton: {
    padding: "10px 24px",
    backgroundColor: "#3B82F6",
    color: "#fff",
    border: "none",
    borderRadius: "6px",
    fontSize: "0.95rem",
    fontWeight: "600",
    cursor: "pointer",
    transition: "background-color 0.3s",
  },
};

export default TermsAndConditions;
