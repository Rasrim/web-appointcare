import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";

const SymptomsSection = () => {
  const navigate = useNavigate();
  const [currentSlide, setCurrentSlide] = useState(0);

  const symptoms = [
    { icon: "👁️", name: "Poor Eyesight", problem: "Blurred vision, difficulty focusing, eye strain", solution: "Regular eye checkups, corrective lenses, eye exercises" },
    { icon: "🫘", name: "Gastric Problem", problem: "Acid reflux, stomach pain, bloating, indigestion", solution: "Dietary changes, antacids, avoid spicy foods, consult gastroenterologist" },
    { icon: "🧠", name: "Brain Problem", problem: "Memory issues, concentration problems, confusion", solution: "Neurological assessment, cognitive therapy, proper rest and nutrition" },
    { icon: "❤️", name: "Heart Attack", problem: "Chest pain, shortness of breath, irregular heartbeat", solution: "Emergency medical attention, ECG, cardiac rehabilitation" },
    { icon: "👂", name: "Ear Problem", problem: "Hearing loss, ear pain, tinnitus, earwax buildup", solution: "Audiometry test, ear cleaning, hearing aids, medication" },
    { icon: "⚕️", name: "Surgery Case", problem: "Need for surgical intervention, trauma, injury", solution: "Surgical consultation, pre-operative tests, post-operative care" },
    { icon: "😵", name: "Dizziness", problem: "Vertigo, lightheadedness, loss of balance", solution: "Balance therapy, medication, vestibular rehabilitation" },
    { icon: "🤒", name: "Fever", problem: "High body temperature, chills, weakness", solution: "Rest, hydration, antipyretics, treat underlying infection" },
    { icon: "🤕", name: "Headache", problem: "Head pain, migraines, tension headaches", solution: "Pain relief medication, stress management, hydration" },
    { icon: "😷", name: "Cough", problem: "Persistent cough, throat irritation, mucus production", solution: "Cough syrup, throat lozenges, steam inhalation, antibiotics if needed" },
    { icon: "🦴", name: "Joint Pain", problem: "Arthritis, inflammation, stiffness, reduced mobility", solution: "Physical therapy, anti-inflammatory medication, joint support" },
    { icon: "😴", name: "Insomnia", problem: "Difficulty falling asleep, frequent wake-ups, poor sleep quality", solution: "Sleep hygiene, relaxation techniques, melatonin, cognitive behavioral therapy" },
    { icon: "🤧", name: "Common Cold", problem: "Runny nose, sneezing, sore throat, mild fever", solution: "Rest, vitamin C, warm fluids, nasal drops, decongestants" },
    { icon: "🩹", name: "Skin Infection", problem: "Rash, itching, redness, pustules", solution: "Antifungal/antibacterial cream, proper hygiene, dermatological consultation" },
    { icon: "😫", name: "Anxiety", problem: "Panic attacks, nervousness, excessive worry", solution: "Counseling, meditation, breathing exercises, anti-anxiety medication if needed" },
    { icon: "🏃", name: "Back Pain", problem: "Lower or upper back pain, muscle strain, limited mobility", solution: "Physical therapy, pain medication, proper posture, back support" },
    { icon: "🤢", name: "Nausea", problem: "Feeling sick, vomiting, stomach discomfort", solution: "Ginger tea, antiemetics, hydration, avoid triggers" },
    { icon: "💊", name: "Allergy", problem: "Itching, swelling, rash, respiratory symptoms", solution: "Antihistamines, allergy testing, avoidance of allergens" },
    { icon: "📊", name: "Diabetes", problem: "High blood sugar, fatigue, increased thirst, frequent urination", solution: "Insulin therapy, dietary control, exercise, blood sugar monitoring" },
    { icon: "🦋", name: "Thyroid Problem", problem: "Weight changes, fatigue, temperature sensitivity", solution: "TSH test, thyroid medication, iodine intake, specialist consultation" },
    { icon: "⬆️", name: "High Blood Pressure", problem: "Headache, chest pain, dizziness, vision problems", solution: "ACE inhibitors, salt reduction, exercise, stress management" },
    { icon: "💨", name: "Asthma", problem: "Wheezing, shortness of breath, chest tightness", solution: "Inhalers, bronchodilators, avoid triggers, respiratory therapy" },
    { icon: "🫁", name: "Bronchitis", problem: "Persistent cough, mucus production, chest discomfort", solution: "Expectorants, humidifier, rest, antibiotics if bacterial" },
    { icon: "🏥", name: "Pneumonia", problem: "Severe cough, fever, difficulty breathing", solution: "Antibiotics, oxygen therapy, hospitalization if needed" },
    { icon: "💎", name: "Kidney Stone", problem: "Severe back pain, painful urination, nausea", solution: "Hydration, pain relief, urologist consultation, imaging tests" },
    { icon: "🚽", name: "Urinary Tract Infection", problem: "Painful urination, frequency, urgency, cloudy urine", solution: "Antibiotics, cranberry juice, increased hydration, urinalysis" },
    { icon: "🎯", name: "Migraine", problem: "Severe throbbing headache, light sensitivity, nausea", solution: "Migraine medication, dark room, cold compress, rest" },
    { icon: "🌀", name: "Vertigo", problem: "Spinning sensation, imbalance, nausea, vomiting", solution: "Vestibular therapy, medication, head positioning, specialist care" },
    { icon: "🔗", name: "Arthritis", problem: "Joint pain, swelling, stiffness, reduced range of motion", solution: "Anti-inflammatory medication, physical therapy, joint protection" },
    { icon: "🦴", name: "Osteoporosis", problem: "Weak bones, frequent fractures, height loss", solution: "Calcium and vitamin D supplements, weight-bearing exercise, hormone therapy" },
    { icon: "🩸", name: "Anemia", problem: "Fatigue, weakness, pale skin, shortness of breath", solution: "Iron supplements, blood transfusion if severe, dietary iron intake" },
    { icon: "🔴", name: "Hemophilia", problem: "Easy bruising, prolonged bleeding, joint pain", solution: "Clotting factor replacement, avoiding trauma, genetic counseling" },
    { icon: "🦟", name: "Dengue", problem: "High fever, rash, joint pain, hemorrhage", solution: "Supportive care, platelet transfusion, hospitalization, rest" },
    { icon: "🦟", name: "Malaria", problem: "Fever, chills, headache, muscle aches", solution: "Antimalarial drugs, fever management, blood tests" },
    { icon: "🔥", name: "Typhoid", problem: "High fever, headache, weakness, abdominal pain", solution: "Antibiotics, fluid replacement, bed rest, vaccination prevention" },
    { icon: "💼", name: "Tuberculosis", problem: "Persistent cough, chest pain, blood in sputum, fever", solution: "Anti-tuberculosis drugs, isolation, nutritional support, chest X-ray" },
    { icon: "🧬", name: "Hepatitis", problem: "Jaundice, fatigue, abdominal pain, dark urine", solution: "Antiviral medication, liver support, vaccines, liver function tests" },
    { icon: "💛", name: "Jaundice", problem: "Yellow skin and eyes, dark urine, pale stool", solution: "Treat underlying cause, bilirubin testing, dietary modification" },
    { icon: "🤕", name: "Ulcer", problem: "Burning stomach pain, bloating, dark stools", solution: "Proton pump inhibitors, H pylori treatment, dietary changes" },
    { icon: "🚽", name: "Constipation", problem: "Difficulty having bowel movements, hard stool, bloating", solution: "Fiber intake, hydration, laxatives, stool softeners" },
    { icon: "💩", name: "Diarrhea", problem: "Loose watery stool, frequency, dehydration", solution: "Oral rehydration, anti-diarrheal medication, bland diet" },
    { icon: "📍", name: "Hemorrhoids", problem: "Rectal pain, itching, bleeding, swelling", solution: "Topical cream, stool softeners, sitz bath, surgical removal if needed" },
    { icon: "🤐", name: "Appendicitis", problem: "Severe abdominal pain, fever, vomiting", solution: "Emergency surgery, antibiotics, pain management" },
    { icon: "🔷", name: "Gallstones", problem: "Biliary colic, nausea, vomiting, upper right pain", solution: "Ursodeoxycholic acid, surgical removal, dietary modification" },
    { icon: "🔴", name: "Pancreatitis", problem: "Upper abdominal pain, nausea, elevated lipase", solution: "Pain management, enzyme replacement, dietary restriction" },
    { icon: "🍂", name: "Cirrhosis", problem: "Liver failure symptoms, ascites, jaundice", solution: "Abstain from alcohol, diuretics, liver transplant if needed" },
    { icon: "🥓", name: "Fatty Liver", problem: "Fatigue, abdominal discomfort, elevated liver enzymes", solution: "Weight loss, avoid alcohol, healthy diet, exercise" },
    { icon: "👩", name: "PCOS", problem: "Irregular periods, infertility, excess hair growth", solution: "Hormonal medication, lifestyle changes, fertility treatment" },
    { icon: "🤰", name: "Endometriosis", problem: "Severe menstrual pain, infertility, painful intercourse", solution: "Pain medication, hormonal therapy, surgical treatment" },
    { icon: "📌", name: "Menstrual Cramps", problem: "Lower abdominal pain, muscle aches during periods", solution: "NSAIDs, heating pad, exercise, oral contraceptives" },
    { icon: "🧬", name: "Thyroiditis", problem: "Thyroid inflammation, fatigue, neck pain", solution: "Anti-inflammatory medication, thyroid hormone replacement" },
    { icon: "❄️", name: "Hypothyroidism", problem: "Fatigue, weight gain, cold sensitivity, slow metabolism", solution: "Thyroid hormone replacement, TSH monitoring, iodine intake" },
    { icon: "🔥", name: "Hyperthyroidism", problem: "Weight loss, rapid heartbeat, anxiety, heat sensitivity", solution: "Beta blockers, antithyroid drugs, radioactive iodine therapy" },
    { icon: "🎨", name: "Psoriasis", problem: "Red scaly patches, itching, skin thickening", solution: "Topical steroids, phototherapy, immunosuppressants" },
    { icon: "🧴", name: "Eczema", problem: "Dry itchy skin, inflammation, cracked skin", solution: "Moisturizers, topical steroids, antihistamines, avoid triggers" },
    { icon: "⚪", name: "Vitiligo", problem: "Loss of skin pigmentation, white patches", solution: "Topical corticosteroids, phototherapy, skin grafting" },
    { icon: "😤", name: "Acne", problem: "Pimples, blackheads, oily skin, inflammation", solution: "Benzoyl peroxide, retinoids, antibiotics, dermatologist consultation" },
    { icon: "💇", name: "Baldness", problem: "Hair loss, thinning, receding hairline", solution: "Minoxidil, finasteride, hair transplant, PRP therapy" },
    { icon: "🍄", name: "Fungal Infection", problem: "Itching, burning, discolored patches", solution: "Antifungal cream, oral medication, proper hygiene" },
    { icon: "🔴", name: "Herpes", problem: "Painful blisters, tingling, viral infection", solution: "Antiviral medication, pain relief, avoiding triggers" },
    { icon: "🦗", name: "Chickenpox", problem: "Fever, rash, fluid-filled blisters", solution: "Antivirals, calamine lotion, rest, vaccination" },
    { icon: "⚡", name: "Shingles", problem: "Severe nerve pain, blistering rash", solution: "Antivirals, pain management, topical cream, vaccination" },
    { icon: "🌳", name: "Warts", problem: "Rough skin growths, spreading infection", solution: "Cryotherapy, salicylic acid, surgical removal" },
    { icon: "🔴", name: "Boils", problem: "Painful pus-filled lumps, fever, spreading", solution: "Antibiotics, warm compress, drainage, proper hygiene" },
    { icon: "👃", name: "Sinusitis", problem: "Nasal congestion, facial pain, headache", solution: "Nasal spray, decongestants, antibiotics, saline irrigation" },
    { icon: "🤧", name: "Rhinitis", problem: "Nasal inflammation, runny nose, sneezing", solution: "Antihistamines, nasal spray, avoid triggers" },
    { icon: "😖", name: "Pharyngitis", problem: "Sore throat, difficulty swallowing, fever", solution: "Throat lozenges, antibiotics, rest, warm liquids" },
    { icon: "🗣️", name: "Laryngitis", problem: "Hoarse voice, throat pain, difficulty speaking", solution: "Voice rest, humidifier, throat lozenges, steam inhalation" },
    { icon: "💨", name: "Bronchial Asthma", problem: "Wheezing, breathlessness, chest tightness, cough", solution: "Inhalers, bronchodilators, controller medication, trigger avoidance" },
    { icon: "😴", name: "Sleep Apnea", problem: "Breathing pauses during sleep, daytime fatigue", solution: "CPAP machine, weight loss, positional therapy, surgery if needed" },
  ];

  const itemsPerSlide = 5;
  const totalSlides = Math.max(symptoms.length - itemsPerSlide + 1, 1);

  const handleNext = () => {
    setCurrentSlide((prev) => (prev + 1) % totalSlides);
  };

  const handlePrev = () => {
    setCurrentSlide((prev) => (prev - 1 + totalSlides) % totalSlides);
  };

  const handleSymptomClick = (symptomName) => {
    const routeName = symptomName.toLowerCase().replace(/ /g, "-");
    window.scrollTo({ top: 0, behavior: "smooth" });
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
      overflowX: "hidden",
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
    flexWrap: "nowrap",
    position: "relative",
    maxWidth: "1000px",
    margin: "0 auto",
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
      transition: "background-color 0.3s ease",
      boxShadow: "0 4px 12px rgba(75, 123, 255, 0.3)",
      flexShrink: 0,
      position: "absolute",
      top: "50%",
      transform: "translateY(-50%)",
      zIndex: 10,
      padding: 0,
      lineHeight: 1,
    },
    sliderButtonHover: {
      backgroundColor: "#3a62d9",
    },
symptomsGrid: {
  display: "flex",
  gap: "15px",
  justifyContent: "center",
  flexWrap: "nowrap", 
  maxWidth: "900px",
  overflow: "hidden", 
},
symptomCard: {
  backgroundColor: "white",
  borderRadius: "12px",
  padding: "25px 20px",
  textAlign: "center",
  width: "140px",
  height: "140px",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  flexShrink: 0,
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
            style={{ ...styles.sliderButton, left: "0" }}
            onClick={handlePrev}
            onMouseEnter={(e) => {
              e.target.style.backgroundColor = "#3a62d9";
            }}
            onMouseLeave={(e) => {
              e.target.style.backgroundColor = "#4b7bff";
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
            style={{ ...styles.sliderButton, right: "0" }}
            onClick={handleNext}
            onMouseEnter={(e) => {
              e.target.style.backgroundColor = "#3a62d9";
            }}
            onMouseLeave={(e) => {
              e.target.style.backgroundColor = "#4b7bff";
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
