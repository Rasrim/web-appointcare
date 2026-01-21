import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { GiEye, GiStomach, GiBrain, GiHeartBeats, GiEar, GiHealing, GiHeartOrgan, GiThermometerHot, GiBandage, GiTeethOpen, GiThroat, GiSkinAndBones, GiCough, GiHeadaches, GiBillyClub, GiCrippledHand, GiBackPain, GiNausea, GiVomit, GiAmmoBox, GiBleedingWound, GiLungs, GiDna2, GiMicrobe, GiMedicineBottle, GiPills, GiStressureFracture, GiHairStrands } from "react-icons/gi";
import { MdHealthAndSafety, MdBiotech, MdLocalFireDepartment, MdSnow } from "react-icons/md";
import { AiFillHeart } from "react-icons/ai";
import { BiSolidBody } from "react-icons/bi";

const SymptomsSection = () => {
  const navigate = useNavigate();
  const [currentSlide, setCurrentSlide] = useState(0);

  const symptoms = [
    { icon: <GiEye />, name: "Poor Eyesight" },
    { icon: <GiStomach />, name: "Gastric Problem" },
    { icon: <GiBrain />, name: "Brain Problem" },
    { icon: <GiHeartBeats />, name: "Heart Attack" },
    { icon: <GiEar />, name: "Ear Problem" },
    { icon: <GiHealing />, name: "Surgery Case" },
    { icon: <GiHeartOrgan />, name: "Dizziness" },
    { icon: <GiThermometerHot />, name: "Fever" },
    { icon: <GiHeadaches />, name: "Headache" },
    { icon: <GiCough />, name: "Cough" },
    { icon: <BiSolidBody />, name: "Joint Pain" },
    { icon: <MdHealthAndSafety />, name: "Insomnia" },
    { icon: <AiFillHeart />, name: "Chest Pain" },
    { icon: <GiBandage />, name: "Wound" },
    { icon: <MdSnow />, name: "Runny Nose" },
    { icon: <GiLungs />, name: "Asthma" },
    { icon: <GiTeethOpen />, name: "Tooth Ache" },
    { icon: <GiThroat />, name: "Sore Throat" },
    { icon: <GiSkinAndBones />, name: "Acne" },
    { icon: <MdLocalFireDepartment />, name: "Skin Burn" },
    { icon: <MdSnow />, name: "Cold" },
    { icon: <BiSolidBody />, name: "Muscle Pain" },
    { icon: <BiSolidBody />, name: "Leg Cramps" },
    { icon: <GiCrippledHand />, name: "Hand Tremor" },
    { icon: <GiBackPain />, name: "Back Pain" },
    { icon: <MdHealthAndSafety />, name: "Anxiety" },
    { icon: <MdHealthAndSafety />, name: "Stress" },
    { icon: <GiNausea />, name: "Nausea" },
    { icon: <GiVomit />, name: "Vomiting" },
    { icon: <GiAmmoBox />, name: "Diarrhea" },
    { icon: <MdHealthAndSafety />, name: "Constipation" },
    { icon: <GiBleedingWound />, name: "Heavy Bleeding" },
    { icon: <GiThermometerHot />, name: "High Temperature" },
    { icon: <GiLungs />, name: "Breathing Problem" },
    { icon: <GiDna2 />, name: "Genetic Disorder" },
    { icon: <GiMicrobe />, name: "Infection" },
    { icon: <GiMedicineBottle />, name: "Allergy" },
    { icon: <GiPills />, name: "High Blood Pressure" },
    { icon: <MdBiotech />, name: "Low Blood Pressure" },
    { icon: <GiSkinAndBones />, name: "Dandruff" },
    { icon: <GiHairStrands />, name: "Hair Loss" },
    { icon: <MdHealthAndSafety />, name: "Depression" },
    { icon: <GiHeadaches />, name: "Migraine" },
    { icon: <GiEye />, name: "Eye Strain" },
    { icon: <GiEar />, name: "Sinus Problem" },
    { icon: <GiEar />, name: "Tinnitus" },
    { icon: <GiThroat />, name: "Mouth Ulcer" },
    { icon: <GiTeethOpen />, name: "Gum Disease" },
    { icon: <GiSkinAndBones />, name: "Lip Swelling" },
    { icon: <BiSolidBody />, name: "Foot Pain" },
    { icon: <BiSolidBody />, name: "Heel Pain" },
    { icon: <GiBackPain />, name: "Lower Back Pain" },
    { icon: <BiSolidBody />, name: "Leg Weakness" },
    { icon: <BiSolidBody />, name: "Knee Pain" },
    { icon: <BiSolidBody />, name: "Shoulder Pain" },
    { icon: <BiSolidBody />, name: "Neck Pain" },
    { icon: <BiSolidBody />, name: "Wrist Pain" },
    { icon: <BiSolidBody />, name: "Elbow Pain" },
    { icon: <GiStressureFracture />, name: "Boxing Injury" },
    { icon: <GiStressureFracture />, name: "Sports Injury" },
    { icon: <GiStressureFracture />, name: "Running Injury" },
    { icon: <GiStressureFracture />, name: "Cycling Injury" },
    { icon: <GiStressureFracture />, name: "Swimming Injury" },
    { icon: <GiStressureFracture />, name: "Winter Sports Injury" },
    { icon: <GiStressureFracture />, name: "Climbing Injury" },
    { icon: <MdHealthAndSafety />, name: "Walking Difficulty" },
  ];

  const itemsPerSlide = 5;
  const totalSlides = symptoms.length - itemsPerSlide + 1;

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

  const startIndex = currentSlide;
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
      justifyContent: "space-between",
      gap: "20px",
      width: "100%",
      maxWidth: "1000px",
      margin: "0 auto",
    },
    sliderButton: {
      backgroundColor: "#3B82F6",
      color: "white",
      border: "none",
      borderRadius: "50%",
      width: "48px",
      height: "48px",
      fontSize: "20px",
      cursor: "pointer",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      transition: "all 0.3s ease",
      boxShadow: "0 4px 12px rgba(59, 130, 246, 0.4)",
      flexShrink: 0,
      minWidth: "48px",
    },
    sliderButtonHover: {
      backgroundColor: "#2563EB",
      transform: "scale(1.1)",
      boxShadow: "0 6px 16px rgba(59, 130, 246, 0.5)",
    },
    symptomsGrid: {
      display: "flex",
      gap: "15px",
      justifyContent: "center",
      flex: "0 1 auto",
      minWidth: "0",
      transition: "all 0.5s ease-in-out",
    },
    symptomCard: {
      backgroundColor: "white",
      borderRadius: "12px",
      padding: "12px 8px",
      textAlign: "center",
      flex: "0 0 130px",
      height: "150px",
      boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
      transition: "all 0.3s ease",
      cursor: "pointer",
      border: "1px solid #f0f0f0",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      gap: "6px",
      boxSizing: "border-box",
      overflow: "hidden",
    },
    symptomCardHover: {
      transform: "translateY(-5px)",
      boxShadow: "0 8px 20px rgba(75, 123, 255, 0.15)",
    },
    symptomIcon: {
      fontSize: "36px",
      marginBottom: "0",
      flexShrink: 0,
      lineHeight: "1",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      color: "#3B82F6",
    },
    symptomName: {
      fontSize: "13px",
      fontWeight: "600",
      color: "#333",
      margin: "0",
      fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
      lineHeight: "1.3",
      wordBreak: "break-word",
      maxHeight: "39px",
      overflow: "hidden",
      display: "-webkit-box",
      WebkitLineClamp: "2",
      WebkitBoxOrient: "vertical",
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
              e.target.style.backgroundColor = "#3B82F6";
              e.target.style.transform = "scale(1)";
              e.target.style.boxShadow = "0 4px 12px rgba(59, 130, 246, 0.4)";
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
              e.target.style.backgroundColor = "#3B82F6";
              e.target.style.transform = "scale(1)";
              e.target.style.boxShadow = "0 4px 12px rgba(59, 130, 246, 0.4)";
            }}
          >
            <FaChevronRight />
          </button>
        </div>
      </div>
    </section>
  );
};

export default SymptomsSection;
