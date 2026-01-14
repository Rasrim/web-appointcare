import { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa";

const SymptomDetail = () => {
  const { symptomName } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const handleResize = () => {
      // Handle resize if needed
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const symptomDatabase = {
    "poor-eyesight": {
      icon: "👁️",
      title: "Poor Eyesight",
      description: "Visual impairment or reduced ability to see clearly",
      symptoms: [
        "Blurred or fuzzy vision",
        "Difficulty seeing at night",
        "Eye strain and fatigue",
        "Headaches while reading",
        "Difficulty focusing on objects",
      ],
      causes: [
        "Refractive errors (myopia, hyperopia, astigmatism)",
        "Age-related changes (presbyopia)",
        "Cataracts",
        "Diabetic retinopathy",
        "Macular degeneration",
        "Excessive screen time",
      ],
      solutions: [
        "Get a comprehensive eye examination",
        "Wear corrective lenses or glasses",
        "Consider contact lenses or LASIK surgery",
        "Follow the 20-20-20 rule (every 20 minutes, look 20 feet away for 20 seconds)",
        "Take regular breaks from screens",
        "Use proper lighting when reading",
        "Eat foods rich in Vitamin A and antioxidants",
        "Protect eyes from UV radiation with sunglasses",
      ],
      recommendations: [
        "Schedule an appointment with an ophthalmologist",
        "Get your vision checked annually",
        "Use eye drops if experiencing dryness",
        "Practice eye exercises regularly",
      ],
    },
    "gastric-problem": {
      icon: "🫘",
      title: "Gastric Problem",
      description: "Digestive issues related to the stomach and intestines",
      symptoms: [
        "Stomach pain or cramping",
        "Acidity and heartburn",
        "Bloating and gas",
        "Nausea and vomiting",
        "Constipation or diarrhea",
        "Loss of appetite",
      ],
      causes: [
        "Irregular eating habits",
        "Spicy or fatty foods",
        "Excessive caffeine or alcohol",
        "Stress and anxiety",
        "H. pylori infection",
        "GERD (Gastroesophageal reflux disease)",
        "Irritable bowel syndrome (IBS)",
      ],
      solutions: [
        "Eat smaller, frequent meals",
        "Avoid spicy and fatty foods",
        "Reduce caffeine and alcohol intake",
        "Drink plenty of water",
        "Practice stress-reduction techniques",
        "Eat slowly and chew thoroughly",
        "Avoid eating late at night",
        "Use antacids or prescribed medications",
        "Include probiotics in your diet",
      ],
      recommendations: [
        "Consult a gastroenterologist for proper diagnosis",
        "Keep a food diary to identify triggers",
        "Consider dietary modifications",
        "Manage stress through meditation or yoga",
      ],
    },
    "brain-problem": {
      icon: "🧠",
      title: "Brain Problem",
      description: "Neurological issues affecting brain function",
      symptoms: [
        "Persistent headaches or migraines",
        "Memory loss or confusion",
        "Difficulty concentrating",
        "Dizziness and vertigo",
        "Sleep disturbances",
        "Mood changes",
        "Balance issues",
      ],
      causes: [
        "Stress and anxiety",
        "Sleep deprivation",
        "High blood pressure",
        "Infections",
        "Head injuries",
        "Neurological disorders",
        "Hormonal changes",
      ],
      solutions: [
        "Get adequate sleep (7-9 hours daily)",
        "Practice relaxation techniques",
        "Regular exercise and physical activity",
        "Maintain a healthy diet rich in omega-3 fatty acids",
        "Stay mentally active with puzzles and learning",
        "Reduce stress through meditation",
        "Limit screen time before bed",
        "Stay hydrated",
      ],
      recommendations: [
        "Schedule a neurological examination",
        "Get an MRI or CT scan if recommended",
        "Consult a neurologist for persistent symptoms",
        "Consider cognitive therapy or counseling",
      ],
    },
    "heart-attack": {
      icon: "❤️",
      title: "Heart Attack",
      description: "Acute cardiac event requiring immediate medical attention",
      symptoms: [
        "Severe chest pain or pressure",
        "Pain in arms, neck, or jaw",
        "Shortness of breath",
        "Cold sweats",
        "Nausea and dizziness",
        "Fatigue",
        "Irregular heartbeat",
      ],
      causes: [
        "Coronary artery disease",
        "Blood clots",
        "High cholesterol",
        "High blood pressure",
        "Smoking",
        "Diabetes",
        "Obesity",
        "Sedentary lifestyle",
      ],
      solutions: [
        "CALL EMERGENCY SERVICES IMMEDIATELY (911 or local emergency number)",
        "Chew aspirin if not allergic (while waiting for help)",
        "Lie down and rest",
        "Loosen tight clothing",
        "Once treated, follow cardiac rehabilitation",
        "Take prescribed medications regularly",
        "Maintain a heart-healthy diet",
        "Exercise regularly as recommended",
      ],
      recommendations: [
        "Get immediate medical attention - this is an emergency",
        "Undergo cardiac tests (ECG, blood tests, angiography)",
        "Work with a cardiologist on recovery",
        "Make lifestyle changes to prevent recurrence",
        "Participate in cardiac rehabilitation program",
      ],
    },
    "ear-problem": {
      icon: "👂",
      title: "Ear Problem",
      description: "Issues affecting hearing and ear health",
      symptoms: [
        "Hearing loss",
        "Ear pain or ache",
        "Ringing in ears (tinnitus)",
        "Ear discharge",
        "Balance problems",
        "Feeling of fullness in ear",
        "Itching in ears",
      ],
      causes: [
        "Ear infections",
        "Earwax buildup",
        "Loud noise exposure",
        "Age-related hearing loss",
        "Ear trauma",
        "Medication side effects",
        "Eustachian tube dysfunction",
      ],
      solutions: [
        "Keep ears clean and dry",
        "Avoid inserting objects in ears",
        "Wear hearing protection in loud environments",
        "Manage ear infections with prescribed antibiotics",
        "Use ear drops if recommended",
        "Remove earwax safely with professional help",
        "Manage tinnitus with sound therapy",
        "Avoid excessive loud noise",
      ],
      recommendations: [
        "Get a hearing test from an audiologist",
        "Consult an ENT specialist for persistent issues",
        "Consider hearing aids if needed",
        "Use proper ear protection during noisy activities",
      ],
    },
    "surgery-case": {
      icon: "⚕️",
      title: "Surgery Case",
      description: "Situations requiring surgical intervention",
      symptoms: [
        "Severe pain that doesn't respond to medication",
        "Visible injuries or deformities",
        "Inability to function normally",
        "Signs of infection",
        "Internal bleeding symptoms",
        "Critical organ dysfunction",
      ],
      causes: [
        "Traumatic injuries",
        "Internal bleeding",
        "Organ failure",
        "Severe infections",
        "Tumors",
        "Appendicitis",
        "Acute conditions requiring intervention",
      ],
      solutions: [
        "SEEK EMERGENCY MEDICAL HELP IMMEDIATELY",
        "Pre-operative evaluation and tests",
        "Follow surgeon's pre-operative instructions",
        "Arrange transportation and support",
        "Follow post-operative care instructions",
        "Take prescribed medications",
        "Attend follow-up appointments",
        "Gradually return to normal activities",
      ],
      recommendations: [
        "Get immediate emergency care",
        "Consult with surgical specialists",
        "Get second opinion from another surgeon if needed",
        "Follow complete recovery and rehabilitation protocol",
      ],
    },
    "dizziness": {
      icon: "😵",
      title: "Dizziness",
      description: "Feeling of lightheadedness or loss of balance",
      symptoms: [
        "Spinning sensation (vertigo)",
        "Lightheadedness",
        "Unsteadiness",
        "Feeling faint",
        "Loss of balance",
        "Blurred vision",
        "Nausea",
      ],
      causes: [
        "Inner ear disorder (BPPV)",
        "Low blood pressure",
        "Dehydration",
        "Medication side effects",
        "Anxiety or panic attacks",
        "Anemia",
        "Blood sugar imbalance",
        "Ear infections",
      ],
      solutions: [
        "Stay hydrated and drink plenty of water",
        "Sit or lie down immediately",
        "Move slowly and avoid sudden movements",
        "Get adequate rest",
        "Maintain stable blood sugar levels",
        "Practice relaxation techniques",
        "Do vestibular balance exercises",
        "Limit salt intake if recommended",
      ],
      recommendations: [
        "Consult a neurologist or ENT specialist",
        "Get blood pressure monitoring",
        "Check blood sugar levels",
        "Undergo balance testing if needed",
        "Practice Cawthorne-Cooksey exercises for balance",
      ],
    },
  };

  const symptomKey = symptomName
    ?.toLowerCase()
    .replace(/ /g, "-")
    .replace(/-problem$/, "");
  const symptom = symptomDatabase[symptomKey];

  const styles = {
    container: {
      minHeight: "100vh",
      background: "#f9f9f9",
      padding: "20px",
    },
    wrapper: {
      maxWidth: "1000px",
      margin: "0 auto",
    },
    backButton: {
      display: "flex",
      alignItems: "center",
      gap: "10px",
      background: "none",
      border: "none",
      color: "#3B82F6",
      fontSize: "1rem",
      fontWeight: "600",
      cursor: "pointer",
      marginBottom: "30px",
      transition: "all 0.3s ease",
      padding: "10px 15px",
    },
    headerSection: {
      background: "linear-gradient(135deg, #3B82F6 0%, #2563EB 100%)",
      color: "#fff",
      padding: "40px 30px",
      borderRadius: "12px",
      marginBottom: "40px",
      textAlign: "center",
    },
    headerIcon: {
      fontSize: "60px",
      marginBottom: "15px",
    },
    headerTitle: {
      fontSize: "2.2rem",
      fontWeight: "700",
      margin: "0 0 10px 0",
    },
    headerDescription: {
      fontSize: "1.1rem",
      margin: "0",
      opacity: "0.9",
    },
    contentSection: {
      background: "#fff",
      borderRadius: "12px",
      padding: "30px",
      marginBottom: "30px",
      boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
    },
    sectionTitle: {
      fontSize: "1.5rem",
      fontWeight: "700",
      color: "#1a1a1a",
      marginTop: "0",
      marginBottom: "20px",
      paddingBottom: "15px",
      borderBottom: "2px solid #3B82F6",
    },
    itemList: {
      listStyle: "none",
      padding: "0",
      margin: "0",
    },
    listItem: {
      padding: "12px 0",
      borderBottom: "1px solid #f0f0f0",
      display: "flex",
      alignItems: "flex-start",
      gap: "12px",
    },
    listItemIcon: {
      color: "#3B82F6",
      fontWeight: "bold",
      marginTop: "2px",
      minWidth: "20px",
    },
    listItemText: {
      color: "#333",
      fontSize: "0.95rem",
      lineHeight: "1.6",
      margin: "0",
    },
    warningBox: {
      background: "#fef2f2",
      border: "2px solid #dc2626",
      borderRadius: "8px",
      padding: "20px",
      marginBottom: "30px",
    },
    warningTitle: {
      color: "#dc2626",
      fontSize: "1.2rem",
      fontWeight: "700",
      margin: "0 0 10px 0",
    },
    warningText: {
      color: "#991b1b",
      margin: "0",
      fontSize: "0.95rem",
      lineHeight: "1.6",
    },
    infoBox: {
      background: "#eff6ff",
      border: "2px solid #3B82F6",
      borderRadius: "8px",
      padding: "20px",
    },
    infoTitle: {
      color: "#1e40af",
      fontSize: "1.1rem",
      fontWeight: "700",
      margin: "0 0 10px 0",
    },
    infoText: {
      color: "#1e3a8a",
      margin: "0",
      fontSize: "0.9rem",
      lineHeight: "1.6",
    },
  };

  if (!symptom) {
    return (
      <div style={styles.container}>
        <div style={styles.wrapper}>
          <button style={styles.backButton} onClick={() => navigate(-1)}>
            <FaArrowLeft /> Back
          </button>
          <div style={{ ...styles.contentSection, textAlign: "center" }}>
            <h1 style={{ color: "#999" }}>Symptom not found</h1>
            <p style={{ color: "#999" }}>The symptom you're looking for doesn't exist.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <div style={styles.wrapper}>
        <button style={styles.backButton} onClick={() => navigate(-1)}>
          <FaArrowLeft /> Back
        </button>

        <div style={styles.headerSection}>
          <div style={styles.headerIcon}>{symptom.icon}</div>
          <h1 style={styles.headerTitle}>{symptom.title}</h1>
          <p style={styles.headerDescription}>{symptom.description}</p>
        </div>

        {symptom.title === "Heart Attack" && (
          <div style={styles.warningBox}>
            <div style={styles.warningTitle}>⚠️ EMERGENCY!</div>
            <p style={styles.warningText}>
              If you or someone near you is experiencing symptoms of a heart attack, CALL EMERGENCY SERVICES IMMEDIATELY (911 or your local emergency number). Do not wait.
            </p>
          </div>
        )}

        {symptom.title === "Surgery Case" && (
          <div style={styles.warningBox}>
            <div style={styles.warningTitle}>⚠️ URGENT!</div>
            <p style={styles.warningText}>
              If you believe you need surgery, seek immediate medical attention. Contact your doctor or go to the nearest emergency room.
            </p>
          </div>
        )}

        <div style={styles.contentSection}>
          <h2 style={styles.sectionTitle}>Common Symptoms</h2>
          <ul style={styles.itemList}>
            {symptom.symptoms.map((sym, index) => (
              <li key={index} style={styles.listItem}>
                <span style={styles.listItemIcon}>•</span>
                <p style={styles.listItemText}>{sym}</p>
              </li>
            ))}
          </ul>
        </div>

        <div style={styles.contentSection}>
          <h2 style={styles.sectionTitle}>Possible Causes</h2>
          <ul style={styles.itemList}>
            {symptom.causes.map((cause, index) => (
              <li key={index} style={styles.listItem}>
                <span style={styles.listItemIcon}>•</span>
                <p style={styles.listItemText}>{cause}</p>
              </li>
            ))}
          </ul>
        </div>

        <div style={styles.contentSection}>
          <h2 style={styles.sectionTitle}>Recommended Solutions</h2>
          <ul style={styles.itemList}>
            {symptom.solutions.map((solution, index) => (
              <li key={index} style={styles.listItem}>
                <span style={styles.listItemIcon}>✓</span>
                <p style={styles.listItemText}>{solution}</p>
              </li>
            ))}
          </ul>
        </div>

        <div style={styles.infoBox}>
          <div style={styles.infoTitle}>When to Seek Medical Help</div>
          <ul style={{ ...styles.itemList, margin: "10px 0 0 0" }}>
            {symptom.recommendations.map((rec, index) => (
              <li key={index} style={styles.listItem}>
                <span style={styles.listItemIcon}>→</span>
                <p style={styles.listItemText}>{rec}</p>
              </li>
            ))}
          </ul>
        </div>

        <div style={{ textAlign: "center", marginTop: "40px", marginBottom: "40px" }}>
          <button
            style={{
              ...styles.backButton,
              margin: "0 auto",
              background: "#3B82F6",
              color: "#fff",
              padding: "12px 30px",
              borderRadius: "6px",
            }}
            onClick={() => navigate(-1)}
          >
            <FaArrowLeft /> Back to Symptoms
          </button>
        </div>
      </div>
    </div>
  );
};

export default SymptomDetail;
