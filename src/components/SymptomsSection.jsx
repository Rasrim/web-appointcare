import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";

const SymptomsSection = () => {
  const navigate = useNavigate();
  const [currentSlide, setCurrentSlide] = useState(0);

  const symptoms = [
    { icon: "👁️", name: "Poor Eyesight" },
    { icon: "🫘", name: "Gastric Problem" },
    { icon: "🧠", name: "Brain Problem" },
    { icon: "❤️", name: "Heart Attack" },
    { icon: "👂", name: "Ear Problem" },
    { icon: "⚕️", name: "Surgery Case" },
    { icon: "😵", name: "Dizziness" },
    { icon: "🤒", name: "Fever" },
    { icon: "🤕", name: "Headache" },
    { icon: "😷", name: "Cough" },
    { icon: "🦴", name: "Joint Pain" },
    { icon: "😴", name: "Insomnia" },
  ];

  const itemsPerSlide = 5;
  const totalSlides = Math.ceil(symptoms.length / itemsPerSlide);

  const handleNext = () => {
    setCurrentSlide((prev) => (prev + 1) % totalSlides);
  };

  const handlePrev = () => {
    setCurrentSlide((prev) => (prev - 1 + totalSlides) % totalSlides);
  };

  const handleSymptomClick = (symptomName) => {
    const routeName = symptomName.toLowerCase().replace(/ /g, "-");
    navigate(`/symptom/${routeName}`);
  };

  const startIndex = currentSlide * itemsPerSlide;
  const visibleSymptoms = symptoms.slice(
    startIndex,
    startIndex + itemsPerSlide
  );

  const styles = {
    container: {
      padding: "60px 20px",
      backgroundColor: "#f9f9f9",
      marginTop: "40px",
    },
    wrapper: {
      maxWidth: "1200px",
      margin: "0 auto",
    },
    title: {
      fontSize: "32px",
      fontWeight: "700",
      textAlign: "center",
      marginBottom: "50px",
      color: "#1a1a1a",
      fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
    },
    symptomsSlider: {
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      gap: "20px",
      flexWrap: "wrap",
    },
    sliderButton: {
      backgroundColor: "#4b7bff",
      color: "white",
      border: "none",
      borderRadius: "50%",
      width: "50px",
      height: "50px",
      fontSize: "20px",
      cursor: "pointer",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      transition: "all 0.3s ease",
      boxShadow: "0 4px 12px rgba(75, 123, 255, 0.3)",
      flexShrink: 0,
    },
    sliderButtonHover: {
      backgroundColor: "#3a62d9",
      transform: "scale(1.1)",
    },
    symptomsGrid: {
      display: "flex",
      gap: "15px",
      justifyContent: "center",
      flexWrap: "wrap",
      maxWidth: "900px",
    },
    symptomCard: {
      backgroundColor: "white",
      borderRadius: "12px",
      padding: "25px 20px",
      textAlign: "center",
      minWidth: "120px",
      boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
      transition: "all 0.3s ease",
      cursor: "pointer",
      border: "1px solid #f0f0f0",
    },
    symptomCardHover: {
      transform: "translateY(-5px)",
      boxShadow: "0 8px 20px rgba(75, 123, 255, 0.15)",
    },
    symptomIcon: {
      fontSize: "40px",
      marginBottom: "10px",
    },
    symptomName: {
      fontSize: "14px",
      fontWeight: "600",
      color: "#333",
      margin: "0",
      fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
    },
    indicatorsContainer: {
      display: "flex",
      justifyContent: "center",
      gap: "8px",
      marginTop: "25px",
    },
    indicator: {
      width: "10px",
      height: "10px",
      borderRadius: "50%",
      border: "none",
      cursor: "pointer",
      transition: "all 0.3s ease",
    },
  };

  return (
    <section style={styles.container}>
      <div style={styles.wrapper}>
        <h2 style={styles.title}>
          Identify and treat your symptoms instantly with online solutions
        </h2>

        <div style={styles.symptomsSlider}>
          <button
            style={styles.sliderButton}
            onClick={handlePrev}
            onMouseEnter={(e) => Object.assign(e.target.style, styles.sliderButtonHover)}
            onMouseLeave={(e) => {
              e.target.style.backgroundColor = "#4b7bff";
              e.target.style.transform = "scale(1)";
            }}
          >
            <FaChevronLeft />
          </button>

          <div style={styles.symptomsGrid}>
            {visibleSymptoms.map((symptom, index) => (
              <div
                key={index}
                style={styles.symptomCard}
                onMouseEnter={(e) => Object.assign(e.currentTarget.style, styles.symptomCardHover)}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.boxShadow = "0 2px 8px rgba(0, 0, 0, 0.1)";
                }}
                onClick={() => handleSymptomClick(symptom.name)}
              >
                <div style={styles.symptomIcon}>{symptom.icon}</div>
                <p style={styles.symptomName}>{symptom.name}</p>
              </div>
            ))}
          </div>

          <button
            style={styles.sliderButton}
            onClick={handleNext}
            onMouseEnter={(e) => Object.assign(e.target.style, styles.sliderButtonHover)}
            onMouseLeave={(e) => {
              e.target.style.backgroundColor = "#4b7bff";
              e.target.style.transform = "scale(1)";
            }}
          >
            <FaChevronRight />
          </button>
        </div>
      </div>

      {/* Carousel Indicators */}
      <div style={styles.indicatorsContainer}>
        {Array.from({ length: totalSlides }).map((_, index) => (
          <button
            key={index}
            style={{
              ...styles.indicator,
              backgroundColor: index === currentSlide ? "#4b7bff" : "#ddd",
            }}
            onClick={() => setCurrentSlide(index)}
          />
        ))}
      </div>
    </section>
  );
};

export default SymptomsSection;
