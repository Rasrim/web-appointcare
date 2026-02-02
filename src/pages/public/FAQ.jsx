import { useState } from "react";
import HomeNavbar from "../../components/HomeNavbar";
import HomeFooter from "../../components/HomeFooter";

const FAQ = () => {
  const [activeIndex, setActiveIndex] = useState(null);

  const faqs = [
    {
      question: "How do I book an appointment?",
      answer:
        "To book an appointment, navigate to our booking calendar, select your preferred doctor, choose an available time slot, and confirm your booking. You'll receive a confirmation email with all the details.",
    },
    {
      question: "Can I cancel or reschedule my appointment?",
      answer:
        "Yes, you can cancel or reschedule your appointment up to 24 hours before the scheduled time. Go to your dashboard, find the appointment, and click the reschedule or cancel option.",
    },
    {
      question: "What are your consultation fees?",
      answer:
        "Consultation fees vary depending on the doctor and type of consultation. You can view the fees for each doctor on their profile before booking.",
    },
    {
      question: "Is my medical information secure?",
      answer:
        "Yes, we use industry-standard encryption and security measures to protect your personal and medical information. All data is handled in compliance with healthcare privacy regulations.",
    },
    {
      question: "What happens if I miss my appointment?",
      answer:
        "If you miss your appointment, it will be marked as a no-show. You may be charged a cancellation fee depending on our policies. We recommend setting reminders to avoid missing appointments.",
    },
    {
      question: "Can I get a prescription from an online consultation?",
      answer:
        "Yes, doctors can prescribe medications through online consultations. Prescriptions will be sent to you via email and can be filled at any pharmacy.",
    },
    {
      question: "How do I know which doctor is right for me?",
      answer:
        "You can view doctor profiles that include their specialization, experience, qualifications, and patient reviews. You can also use our symptom checker to get recommendations.",
    },
    {
      question: "What payment methods do you accept?",
      answer:
        "We accept credit cards, debit cards, and digital payment methods. All payments are processed securely through our payment gateway.",
    },
  ];

  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      <HomeNavbar />
      <div style={{ flex: 1, maxWidth: "900px", margin: "0 auto", padding: "40px 20px", width: "100%" }}>
        <h1 style={{ fontSize: "2.5rem", marginBottom: "10px", color: "#1a1a1a" }}>
          Frequently Asked Questions
        </h1>
        <p style={{ fontSize: "1rem", color: "#666", marginBottom: "40px" }}>
          Find answers to common questions about AppointCare
        </p>

        <div>
          {faqs.map((faq, index) => (
            <div
              key={index}
              style={{
                marginBottom: "16px",
                border: "1px solid #eee",
                borderRadius: "8px",
                overflow: "hidden",
              }}
            >
              <button
                onClick={() => setActiveIndex(activeIndex === index ? null : index)}
                style={{
                  width: "100%",
                  padding: "16px",
                  backgroundColor: activeIndex === index ? "#f0f7ff" : "#fff",
                  border: "none",
                  cursor: "pointer",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  fontSize: "1rem",
                  fontWeight: "500",
                  color: "#1a1a1a",
                  transition: "background-color 0.3s ease",
                }}
              >
                <span>{faq.question}</span>
                <span
                  style={{
                    transform: activeIndex === index ? "rotate(180deg)" : "rotate(0deg)",
                    transition: "transform 0.3s ease",
                    fontSize: "1.2rem",
                  }}
                >
                  ▼
                </span>
              </button>
              {activeIndex === index && (
                <div style={{ padding: "16px", backgroundColor: "#f9f9f9", color: "#666", lineHeight: "1.6" }}>
                  {faq.answer}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
      <HomeFooter />
    </div>
  );
};

export default FAQ;
