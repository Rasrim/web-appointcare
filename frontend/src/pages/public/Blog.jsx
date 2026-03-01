import { useNavigate } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa";
import HomeNavbar from "../../components/HomeNavbar";
import HomeFooter from "../../components/HomeFooter";

const Blog = () => {
  const navigate = useNavigate();
  const blogPosts = [
    {
      id: 1,
      title: "The Future of Telemedicine",
      date: "January 15, 2026",
      author: "Dr. Sarah Johnson",
      excerpt:
        "Telemedicine is revolutionizing how patients access healthcare. Learn about the latest trends and innovations in remote consultations.",
      content:
        "Telemedicine has transformed the healthcare landscape dramatically over the past few years. With increased accessibility and improved technology, more patients are opting for virtual consultations. This trend is expected to continue growing as we embrace digital health solutions.",
    },
    {
      id: 2,
      title: "Tips for Healthy Living in 2026",
      date: "January 10, 2026",
      author: "Dr. Michael Chen",
      excerpt:
        "Discover practical tips to improve your health and wellness this year. From nutrition to exercise, we cover everything you need.",
      content:
        "A healthy lifestyle is the foundation of good health. This year, consider incorporating these habits: maintain regular exercise, eat a balanced diet, get adequate sleep, manage stress, and have regular check-ups with your healthcare provider.",
    },
    {
      id: 3,
      title: "Understanding Mental Health",
      date: "January 5, 2026",
      author: "Dr. Emily Roberts",
      excerpt:
        "Mental health is just as important as physical health. Learn about recognizing signs and seeking appropriate care.",
      content:
        "Mental health encompasses our emotional, psychological, and social well-being. It's crucial to recognize signs of mental health issues early and seek professional help when needed. Remember, reaching out is a sign of strength, not weakness.",
    },
    {
      id: 4,
      title: "Preventive Care: Why It Matters",
      date: "December 28, 2025",
      author: "Dr. James Wilson",
      excerpt:
        "Prevention is better than cure. Discover why regular check-ups and preventive measures are essential for long-term health.",
      content:
        "Preventive care helps you stay healthy and avoid serious health issues. Regular screenings, vaccinations, and healthy lifestyle choices can significantly reduce the risk of chronic diseases. Make preventive care a priority in your health journey.",
    },
  ];

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
        <h1 style={{ fontSize: "2.5rem", marginBottom: "10px", color: "#1a1a1a" }}>AppointCare Blog</h1>
        <p style={{ fontSize: "1rem", color: "#666", marginBottom: "40px" }}>
          Health tips, insights, and updates from our healthcare experts
        </p>

        <div>
          {blogPosts.map((post) => (
            <article
              key={post.id}
              style={{
                paddingBottom: "30px",
                marginBottom: "30px",
                borderBottom: "1px solid #eee",
              }}
            >
              <h2 style={{ fontSize: "1.8rem", marginBottom: "10px", color: "#1a1a1a" }}>{post.title}</h2>
              <div style={{ display: "flex", gap: "20px", marginBottom: "15px", fontSize: "0.9rem", color: "#666" }}>
                <span>{post.date}</span>
                <span>By {post.author}</span>
              </div>
              <p style={{ fontSize: "1rem", color: "#555", lineHeight: "1.6", marginBottom: "15px" }}>
                {post.excerpt}
              </p>
              <button
                style={{
                  padding: "8px 16px",
                  backgroundColor: "#3B82F6",
                  color: "#fff",
                  border: "none",
                  borderRadius: "5px",
                  fontSize: "0.95rem",
                  fontWeight: "600",
                  cursor: "pointer",
                  transition: "background-color 0.3s ease",
                }}
                onMouseEnter={(e) => (e.target.style.backgroundColor = "#2563EB")}
                onMouseLeave={(e) => (e.target.style.backgroundColor = "#3B82F6")}
              >
                Read More
              </button>
            </article>
          ))}
        </div>
      </div>
      <HomeFooter />
    </div>
  );
};

export default Blog;
