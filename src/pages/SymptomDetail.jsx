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
    "fever": {
      icon: "🤒",
      title: "Fever",
      description: "Elevated body temperature indicating infection or illness",
      symptoms: ["High body temperature (over 100.4°F/38°C)", "Chills", "Weakness", "Aches and pains"],
      causes: ["Bacterial infection", "Viral infection", "Immune response"],
      solutions: ["Rest", "Stay hydrated", "Take antipyretics", "Cool compress"],
      recommendations: ["Consult doctor if fever persists over 3 days", "Monitor temperature regularly"],
    },
    "headache": {
      icon: "🤕",
      title: "Headache",
      description: "Pain in the head or upper neck region",
      symptoms: ["Head pain", "Throbbing sensation", "Tension", "Sensitivity to light"],
      causes: ["Stress", "Dehydration", "Tension", "Migraines"],
      solutions: ["Rest in dark room", "Stay hydrated", "Pain relievers", "Stress management"],
      recommendations: ["Identify triggers", "Maintain regular sleep schedule", "Practice relaxation"],
    },
    "cough": {
      icon: "😷",
      title: "Cough",
      description: "Involuntary expulsion of air from the lungs",
      symptoms: ["Dry or productive cough", "Throat irritation", "Chest discomfort", "Fatigue"],
      causes: ["Cold or flu", "Allergy", "Asthma", "Acid reflux"],
      solutions: ["Cough syrup", "Throat lozenges", "Steam inhalation", "Honey and lemon"],
      recommendations: ["Rest voice", "Stay hydrated", "Use humidifier", "See doctor if persistent"],
    },
    "joint-pain": {
      icon: "🦴",
      title: "Joint Pain",
      description: "Discomfort or pain in joints and surrounding areas",
      symptoms: ["Pain in joints", "Swelling", "Stiffness", "Reduced mobility"],
      causes: ["Arthritis", "Injury", "Inflammation", "Age-related wear"],
      solutions: ["Physical therapy", "Anti-inflammatory drugs", "Hot/cold therapy", "Rest"],
      recommendations: ["See rheumatologist", "Maintain healthy weight", "Exercise regularly"],
    },
    "insomnia": {
      icon: "😴",
      title: "Insomnia",
      description: "Persistent difficulty falling or staying asleep",
      symptoms: ["Difficulty falling asleep", "Frequent waking", "Early morning awakening", "Daytime fatigue"],
      causes: ["Stress", "Anxiety", "Poor sleep habits", "Medical conditions"],
      solutions: ["Sleep hygiene", "Relaxation techniques", "Melatonin", "Cognitive therapy"],
      recommendations: ["Maintain regular schedule", "Avoid screens before bed", "See sleep specialist"],
    },
    "common-cold": {
      icon: "🤧",
      title: "Common Cold",
      description: "Viral infection of upper respiratory tract",
      symptoms: ["Runny nose", "Sneezing", "Sore throat", "Mild fever"],
      causes: ["Rhinovirus", "Environmental exposure", "Weak immunity"],
      solutions: ["Rest", "Vitamin C", "Warm fluids", "Decongestants"],
      recommendations: ["Stay home to avoid spreading", "Wash hands frequently", "Get adequate rest"],
    },
    "skin-infection": {
      icon: "🩹",
      title: "Skin Infection",
      description: "Bacterial, fungal, or viral infection of the skin",
      symptoms: ["Red rash", "Itching", "Burning sensation", "Pus or discharge"],
      causes: ["Bacteria", "Fungi", "Poor hygiene", "Open wounds"],
      solutions: ["Antifungal cream", "Antibacterial ointment", "Keep clean and dry", "Avoid scratching"],
      recommendations: ["See dermatologist", "Keep area clean", "Avoid sharing personal items"],
    },
    "anxiety": {
      icon: "😫",
      title: "Anxiety",
      description: "Excessive worry and nervousness affecting daily life",
      symptoms: ["Panic attacks", "Excessive worry", "Tension", "Difficulty concentrating"],
      causes: ["Stress", "Trauma", "Genetics", "Brain chemistry"],
      solutions: ["Meditation", "Breathing exercises", "Counseling", "Medication if needed"],
      recommendations: ["Therapy", "Lifestyle changes", "Regular exercise", "Support groups"],
    },
    "back-pain": {
      icon: "🏃",
      title: "Back Pain",
      description: "Discomfort in the back region",
      symptoms: ["Lower or upper back pain", "Muscle stiffness", "Reduced mobility", "Sharp or dull pain"],
      causes: ["Poor posture", "Muscle strain", "Herniated disc", "Injury"],
      solutions: ["Physical therapy", "Pain medication", "Back support", "Heat therapy"],
      recommendations: ["Maintain good posture", "Strengthen core", "See physiotherapist", "Avoid heavy lifting"],
    },
    "nausea": {
      icon: "🤢",
      title: "Nausea",
      description: "Feeling of sickness and desire to vomit",
      symptoms: ["Feeling sick", "Dizziness", "Weakness", "Loss of appetite"],
      causes: ["Food poisoning", "Motion sickness", "Medication", "Pregnancy"],
      solutions: ["Ginger tea", "Antiemetics", "Rest", "Small frequent meals"],
      recommendations: ["Identify triggers", "Stay hydrated", "Eat light foods", "See doctor if persistent"],
    },
    "allergy": {
      icon: "💊",
      title: "Allergy",
      description: "Immune reaction to specific substances",
      symptoms: ["Itching", "Swelling", "Rash", "Sneezing", "Difficulty breathing"],
      causes: ["Pollen", "Dust", "Pet dander", "Food", "Medications"],
      solutions: ["Antihistamines", "Avoidance", "Epinephrine if severe", "Allergy shots"],
      recommendations: ["Allergy testing", "Identify allergens", "Avoid triggers", "Carry EpiPen if needed"],
    },
    "diabetes": {
      icon: "📊",
      title: "Diabetes",
      description: "Chronic condition affecting blood sugar levels",
      symptoms: ["High blood sugar", "Increased thirst", "Frequent urination", "Fatigue"],
      causes: ["Insulin resistance", "Genetics", "Lifestyle factors", "Pancreas dysfunction"],
      solutions: ["Insulin therapy", "Dietary control", "Regular exercise", "Blood sugar monitoring"],
      recommendations: ["Endocrinologist", "Regular checkups", "Healthy diet", "Weight management"],
    },
    "thyroid-problem": {
      icon: "🦋",
      title: "Thyroid Problem",
      description: "Dysfunction of the thyroid gland",
      symptoms: ["Weight changes", "Fatigue", "Temperature sensitivity", "Hair loss"],
      causes: ["Autoimmune disease", "Iodine deficiency", "Genetics", "Hormonal changes"],
      solutions: ["Thyroid medication", "TSH monitoring", "Iodine supplement", "Specialist care"],
      recommendations: ["Endocrinologist", "Regular TSH tests", "Medication compliance", "Lifestyle changes"],
    },
    "high-blood-pressure": {
      icon: "⬆️",
      title: "High Blood Pressure",
      description: "Elevated arterial blood pressure",
      symptoms: ["Headache", "Chest pain", "Dizziness", "Vision problems"],
      causes: ["Salt intake", "Stress", "Obesity", "Genetics"],
      solutions: ["ACE inhibitors", "Salt reduction", "Regular exercise", "Stress management"],
      recommendations: ["Cardiologist", "Blood pressure monitoring", "Healthy diet", "Regular checkups"],
    },
    "asthma": {
      icon: "💨",
      title: "Asthma",
      description: "Chronic respiratory disease with airway inflammation",
      symptoms: ["Wheezing", "Shortness of breath", "Chest tightness", "Cough"],
      causes: ["Allergies", "Environmental triggers", "Genetics", "Respiratory infections"],
      solutions: ["Inhalers", "Bronchodilators", "Corticosteroids", "Trigger avoidance"],
      recommendations: ["Pulmonologist", "Identify triggers", "Regular medication", "Action plan"],
    },
    "bronchitis": {
      icon: "🫁",
      title: "Bronchitis",
      description: "Inflammation of airways in the lungs",
      symptoms: ["Persistent cough", "Mucus production", "Chest discomfort", "Fatigue"],
      causes: ["Viral infection", "Smoking", "Air pollution", "Bacterial infection"],
      solutions: ["Expectorants", "Humidifier", "Rest", "Antibiotics if bacterial"],
      recommendations: ["Quit smoking", "Avoid irritants", "Rest adequately", "See doctor"],
    },
    "pneumonia": {
      icon: "🏥",
      title: "Pneumonia",
      description: "Serious lung infection causing air sac inflammation",
      symptoms: ["Severe cough", "High fever", "Difficulty breathing", "Chest pain"],
      causes: ["Bacterial infection", "Viral infection", "Fungal infection", "Aspiration"],
      solutions: ["Antibiotics", "Oxygen therapy", "Rest", "Hospitalization if severe"],
      recommendations: ["Immediate medical attention", "Chest X-ray", "Vaccination", "Supportive care"],
    },
    "kidney-stone": {
      icon: "💎",
      title: "Kidney Stone",
      description: "Hard mineral deposits forming in kidneys",
      symptoms: ["Severe back pain", "Painful urination", "Nausea", "Hematuria"],
      causes: ["Dehydration", "Dietary factors", "Genetic predisposition", "Urinary infections"],
      solutions: ["Hydration", "Pain relief", "Dietary changes", "Medical procedures"],
      recommendations: ["Urologist", "Imaging tests", "Increase water intake", "Dietary modification"],
    },
    "urinary-tract-infection": {
      icon: "🚽",
      title: "Urinary Tract Infection",
      description: "Bacterial infection of urinary system",
      symptoms: ["Painful urination", "Frequency", "Urgency", "Cloudy urine"],
      causes: ["Bacteria", "Poor hygiene", "Sexual activity", "Urinary retention"],
      solutions: ["Antibiotics", "Hydration", "Cranberry juice", "Pain relief"],
      recommendations: ["Urinalysis", "Urologist consultation", "Prevent recurrence", "Hygiene practices"],
    },
    "migraine": {
      icon: "🎯",
      title: "Migraine",
      description: "Severe throbbing headache with neurological symptoms",
      symptoms: ["Throbbing head pain", "Nausea", "Light sensitivity", "Aura"],
      causes: ["Genetics", "Stress", "Hormonal changes", "Triggers (food, sleep)"],
      solutions: ["Migraine medication", "Dark rest room", "Cold compress", "Preventive drugs"],
      recommendations: ["Neurologist", "Identify triggers", "Lifestyle changes", "Preventive therapy"],
    },
    "vertigo": {
      icon: "🌀",
      title: "Vertigo",
      description: "Sensation of spinning and loss of balance",
      symptoms: ["Spinning sensation", "Imbalance", "Nausea", "Vomiting"],
      causes: ["Inner ear disorder", "BPPV", "Vestibular neuritis", "Brain issues"],
      solutions: ["Vestibular therapy", "Medication", "Head positioning maneuvers", "Rest"],
      recommendations: ["ENT specialist", "Neurologist", "Cawthorne exercises", "Balance training"],
    },
    "arthritis": {
      icon: "🔗",
      title: "Arthritis",
      description: "Inflammation of joints causing pain and stiffness",
      symptoms: ["Joint pain", "Swelling", "Stiffness", "Reduced range of motion"],
      causes: ["Age", "Autoimmune disease", "Wear and tear", "Genetics"],
      solutions: ["Anti-inflammatory drugs", "Physical therapy", "Joint protection", "Weight management"],
      recommendations: ["Rheumatologist", "Regular exercise", "Maintain healthy weight", "Physical therapy"],
    },
    "osteoporosis": {
      icon: "🦴",
      title: "Osteoporosis",
      description: "Decreased bone density and increased fragility",
      symptoms: ["Bone pain", "Frequent fractures", "Height loss", "Stooped posture"],
      causes: ["Age", "Menopause", "Low calcium", "Sedentary lifestyle"],
      solutions: ["Calcium supplement", "Vitamin D", "Exercise", "Hormone therapy"],
      recommendations: ["Bone density test", "Endocrinologist", "Weight-bearing exercise", "Dietary calcium"],
    },
    "anemia": {
      icon: "🩸",
      title: "Anemia",
      description: "Low red blood cell or hemoglobin levels",
      symptoms: ["Fatigue", "Weakness", "Pale skin", "Shortness of breath"],
      causes: ["Iron deficiency", "Vitamin B12 deficiency", "Chronic disease", "Blood loss"],
      solutions: ["Iron supplements", "Vitamin B12 injection", "Dietary changes", "Blood transfusion"],
      recommendations: ["Hematologist", "Blood tests", "Dietary improvement", "Treat underlying cause"],
    },
    "hemophilia": {
      icon: "🔴",
      title: "Hemophilia",
      description: "Genetic bleeding disorder",
      symptoms: ["Easy bruising", "Prolonged bleeding", "Joint pain", "Spontaneous bleeding"],
      causes: ["Genetic mutation", "Family history", "Clotting factor deficiency"],
      solutions: ["Clotting factor replacement", "Avoiding trauma", "Genetic counseling"],
      recommendations: ["Hematologist", "Regular monitoring", "Preventive therapy", "Emergency planning"],
    },
    "dengue": {
      icon: "🦟",
      title: "Dengue",
      description: "Viral infection transmitted by mosquitoes",
      symptoms: ["High fever", "Rash", "Joint pain", "Muscle pain"],
      causes: ["Dengue virus", "Mosquito bite", "Poor sanitation"],
      solutions: ["Supportive care", "Hydration", "Platelet monitoring", "Pain relief"],
      recommendations: ["Hospitalization if severe", "Mosquito prevention", "Rest", "Fluid intake"],
    },
    "malaria": {
      icon: "🦟",
      title: "Malaria",
      description: "Parasitic infection transmitted by mosquitoes",
      symptoms: ["Fever", "Chills", "Headache", "Muscle aches"],
      causes: ["Plasmodium parasite", "Mosquito bite", "Poor sanitation"],
      solutions: ["Antimalarial drugs", "Fever management", "Hydration"],
      recommendations: ["Blood test confirmation", "Antimalarial treatment", "Prevention in endemic areas"],
    },
    "typhoid": {
      icon: "🔥",
      title: "Typhoid",
      description: "Bacterial infection from contaminated food/water",
      symptoms: ["High fever", "Headache", "Weakness", "Abdominal pain"],
      causes: ["Salmonella typhi", "Poor sanitation", "Contaminated water"],
      solutions: ["Antibiotics", "Fluid replacement", "Rest", "Supportive care"],
      recommendations: ["Vaccination", "Safe water", "Food hygiene", "Proper treatment"],
    },
    "tuberculosis": {
      icon: "💼",
      title: "Tuberculosis",
      description: "Serious bacterial lung infection",
      symptoms: ["Persistent cough", "Chest pain", "Blood in sputum", "Fever"],
      causes: ["Mycobacterium tuberculosis", "Close contact", "Weak immunity"],
      solutions: ["Anti-TB drugs", "Isolation", "Nutritional support", "Long-term therapy"],
      recommendations: ["TB specialist", "Chest X-ray", "Medication compliance", "Contact tracing"],
    },
    "hepatitis": {
      icon: "🧬",
      title: "Hepatitis",
      description: "Inflammation of the liver",
      symptoms: ["Jaundice", "Fatigue", "Abdominal pain", "Dark urine"],
      causes: ["Viral infection", "Autoimmune disease", "Alcohol", "Drug use"],
      solutions: ["Antiviral medication", "Liver support", "Vaccines", "Rest"],
      recommendations: ["Hepatologist", "Liver function tests", "Vaccination", "Lifestyle changes"],
    },
    "jaundice": {
      icon: "💛",
      title: "Jaundice",
      description: "Yellowing of skin and eyes due to bilirubin",
      symptoms: ["Yellow skin", "Yellow eyes", "Dark urine", "Pale stool"],
      causes: ["Liver disease", "Hemolysis", "Biliary obstruction"],
      solutions: ["Treat underlying cause", "Bilirubin testing", "Dietary modification"],
      recommendations: ["Hepatologist", "Imaging tests", "Identify cause", "Appropriate treatment"],
    },
    "ulcer": {
      icon: "🤕",
      title: "Ulcer",
      description: "Open sore in stomach lining",
      symptoms: ["Burning stomach pain", "Bloating", "Dark stools", "Vomiting"],
      causes: ["H. pylori infection", "NSAIDs", "Stress", "Acidic foods"],
      solutions: ["Proton pump inhibitors", "H. pylori treatment", "Dietary changes"],
      recommendations: ["Gastroenterologist", "H. pylori testing", "Avoid triggers", "Proper medication"],
    },
    "constipation": {
      icon: "🚽",
      title: "Constipation",
      description: "Difficulty having bowel movements",
      symptoms: ["Hard stool", "Infrequent bowel movements", "Bloating", "Straining"],
      causes: ["Low fiber diet", "Dehydration", "Sedentary lifestyle", "Medication"],
      solutions: ["Increase fiber", "Hydration", "Laxatives", "Physical activity"],
      recommendations: ["High fiber diet", "Regular exercise", "Proper hydration", "Establish routine"],
    },
    "diarrhea": {
      icon: "💩",
      title: "Diarrhea",
      description: "Frequent loose or watery stools",
      symptoms: ["Loose stool", "Frequency", "Urgency", "Dehydration"],
      causes: ["Infection", "Food intolerance", "Medication", "Stress"],
      solutions: ["Oral rehydration", "Anti-diarrheal medication", "Bland diet"],
      recommendations: ["Hydration priority", "Identify cause", "Probiotics", "See doctor if persistent"],
    },
    "hemorrhoids": {
      icon: "📍",
      title: "Hemorrhoids",
      description: "Swollen veins in rectum or anus",
      symptoms: ["Rectal pain", "Itching", "Bleeding", "Swelling"],
      causes: ["Straining", "Pregnancy", "Anal intercourse", "Chronic constipation"],
      solutions: ["Topical cream", "Stool softeners", "Sitz bath", "Surgical removal"],
      recommendations: ["Increase fiber", "Stay hydrated", "Avoid straining", "See doctor if bleeding"],
    },
    "appendicitis": {
      icon: "🤐",
      title: "Appendicitis",
      description: "Inflammation of the appendix",
      symptoms: ["Severe abdominal pain", "Fever", "Vomiting", "Loss of appetite"],
      causes: ["Blockage", "Infection", "Inflammation"],
      solutions: ["Emergency surgery", "Antibiotics", "Pain management"],
      recommendations: ["Immediate medical attention", "Imaging confirmation", "Surgical removal", "Recovery care"],
    },
    "gallstones": {
      icon: "🔷",
      title: "Gallstones",
      description: "Hard deposits in the gallbladder",
      symptoms: ["Biliary colic", "Right upper pain", "Nausea", "Vomiting"],
      causes: ["Cholesterol", "Bilirubin", "Weight gain", "Genetics"],
      solutions: ["Ursodeoxycholic acid", "Surgical removal", "Dietary modification"],
      recommendations: ["Ultrasound diagnosis", "Avoid fatty foods", "Weight management", "Surgical consultation"],
    },
    "pancreatitis": {
      icon: "🔴",
      title: "Pancreatitis",
      description: "Inflammation of the pancreas",
      symptoms: ["Upper abdominal pain", "Nausea", "Vomiting", "Elevated enzymes"],
      causes: ["Gallstones", "Alcohol", "Genetics", "Medication"],
      solutions: ["Pain management", "Enzyme replacement", "Dietary restriction"],
      recommendations: ["Hospitalization", "Avoid alcohol", "Treat underlying cause", "Enzyme supplements"],
    },
    "cirrhosis": {
      icon: "🍂",
      title: "Cirrhosis",
      description: "Advanced liver scarring and dysfunction",
      symptoms: ["Liver failure", "Ascites", "Jaundice", "Bleeding"],
      causes: ["Chronic hepatitis", "Alcohol abuse", "Fatty liver"],
      solutions: ["Abstain from alcohol", "Diuretics", "Liver transplant"],
      recommendations: ["Hepatologist", "Abstain from alcohol", "Management of complications", "Transplant evaluation"],
    },
    "fatty-liver": {
      icon: "🥓",
      title: "Fatty Liver",
      description: "Excessive fat accumulation in liver cells",
      symptoms: ["Fatigue", "Abdominal discomfort", "Elevated liver enzymes"],
      causes: ["Obesity", "Diabetes", "Alcohol", "High triglycerides"],
      solutions: ["Weight loss", "Avoid alcohol", "Exercise", "Dietary changes"],
      recommendations: ["Lose weight", "Exercise regularly", "Avoid alcohol", "Liver monitoring"],
    },
    "pcos": {
      icon: "👩",
      title: "PCOS",
      description: "Polycystic ovary syndrome affecting hormones",
      symptoms: ["Irregular periods", "Infertility", "Excess hair growth", "Weight gain"],
      causes: ["Insulin resistance", "Hormonal imbalance", "Genetics"],
      solutions: ["Hormonal medication", "Lifestyle changes", "Fertility treatment"],
      recommendations: ["Gynecologist", "Hormone testing", "Weight management", "Fertility specialist"],
    },
    "endometriosis": {
      icon: "🤰",
      title: "Endometriosis",
      description: "Tissue growth outside the uterus",
      symptoms: ["Severe menstrual pain", "Infertility", "Painful intercourse"],
      causes: ["Retrograde menstruation", "Genetics", "Immune dysfunction"],
      solutions: ["Pain medication", "Hormonal therapy", "Surgical treatment"],
      recommendations: ["Gynecologist", "Imaging tests", "Pain management", "Fertility evaluation"],
    },
    "menstrual-cramps": {
      icon: "📌",
      title: "Menstrual Cramps",
      description: "Abdominal pain during menstruation",
      symptoms: ["Lower abdominal pain", "Muscle aches", "Discomfort"],
      causes: ["Prostaglandins", "Uterine contractions", "Hormonal changes"],
      solutions: ["NSAIDs", "Heating pad", "Exercise", "Oral contraceptives"],
      recommendations: ["Heat therapy", "Light exercise", "Rest", "Over-the-counter pain relief"],
    },
    "thyroiditis": {
      icon: "🧬",
      title: "Thyroiditis",
      description: "Inflammation of the thyroid gland",
      symptoms: ["Thyroid inflammation", "Fatigue", "Neck pain", "Fever"],
      causes: ["Autoimmune disease", "Viral infection", "Radiation"],
      solutions: ["Anti-inflammatory medication", "Thyroid hormone replacement"],
      recommendations: ["Endocrinologist", "Thyroid testing", "Medication compliance", "Monitoring"],
    },
    "hypothyroidism": {
      icon: "❄️",
      title: "Hypothyroidism",
      description: "Underactive thyroid producing insufficient hormones",
      symptoms: ["Fatigue", "Weight gain", "Cold sensitivity", "Slow metabolism"],
      causes: ["Autoimmune disease", "Iodine deficiency", "Genetics"],
      solutions: ["Thyroid hormone replacement", "TSH monitoring", "Iodine intake"],
      recommendations: ["Endocrinologist", "Regular TSH tests", "Medication adjustment", "Dietary changes"],
    },
    "hyperthyroidism": {
      icon: "🔥",
      title: "Hyperthyroidism",
      description: "Overactive thyroid producing excess hormones",
      symptoms: ["Weight loss", "Rapid heartbeat", "Anxiety", "Heat sensitivity"],
      causes: ["Graves disease", "Thyroiditis", "Toxic nodule"],
      solutions: ["Beta blockers", "Antithyroid drugs", "Radioactive iodine therapy"],
      recommendations: ["Endocrinologist", "Thyroid testing", "Medication compliance", "Lifestyle changes"],
    },
    "psoriasis": {
      icon: "🎨",
      title: "Psoriasis",
      description: "Chronic autoimmune skin disease",
      symptoms: ["Red scaly patches", "Itching", "Burning", "Skin thickening"],
      causes: ["Genetics", "Immune dysfunction", "Stress", "Infection"],
      solutions: ["Topical steroids", "Phototherapy", "Immunosuppressants"],
      recommendations: ["Dermatologist", "Moisturize regularly", "Avoid triggers", "Stress management"],
    },
    "eczema": {
      icon: "🧴",
      title: "Eczema",
      description: "Inflammatory skin condition",
      symptoms: ["Dry skin", "Itching", "Inflammation", "Cracked skin"],
      causes: ["Genetics", "Environmental factors", "Irritants", "Allergens"],
      solutions: ["Moisturizers", "Topical steroids", "Antihistamines", "Trigger avoidance"],
      recommendations: ["Dermatologist", "Skin care routine", "Avoid triggers", "Hydrate skin"],
    },
    "vitiligo": {
      icon: "⚪",
      title: "Vitiligo",
      description: "Loss of skin pigmentation in patches",
      symptoms: ["White patches", "Loss of pigmentation", "Hypersensitivity to sun"],
      causes: ["Autoimmune disease", "Genetics", "Oxidative stress"],
      solutions: ["Topical corticosteroids", "Phototherapy", "Skin grafting"],
      recommendations: ["Dermatologist", "Sun protection", "Cosmetic camouflage", "Psychological support"],
    },
    "acne": {
      icon: "😤",
      title: "Acne",
      description: "Inflammatory skin condition with pimples",
      symptoms: ["Pimples", "Blackheads", "Oily skin", "Inflammation"],
      causes: ["Excess sebum", "Bacteria", "Hormones", "Genetics"],
      solutions: ["Benzoyl peroxide", "Retinoids", "Antibiotics", "Proper hygiene"],
      recommendations: ["Dermatologist", "Regular cleansing", "Avoid picking", "Non-comedogenic products"],
    },
    "baldness": {
      icon: "💇",
      title: "Baldness",
      description: "Hair loss and pattern baldness",
      symptoms: ["Hair loss", "Thinning hair", "Receding hairline"],
      causes: ["Genetics", "Hormones", "Stress", "Medical conditions"],
      solutions: ["Minoxidil", "Finasteride", "Hair transplant", "PRP therapy"],
      recommendations: ["Dermatologist", "Early intervention", "Hair care routine", "Psychological counseling"],
    },
    "fungal-infection": {
      icon: "🍄",
      title: "Fungal Infection",
      description: "Infection caused by fungal organisms",
      symptoms: ["Itching", "Burning", "Discolored patches", "Odor"],
      causes: ["Moisture", "Poor hygiene", "Weak immunity", "Warm environment"],
      solutions: ["Antifungal cream", "Oral medication", "Proper hygiene"],
      recommendations: ["Keep area dry", "Antifungal powder", "Avoid sharing items", "See dermatologist"],
    },
    "herpes": {
      icon: "🔴",
      title: "Herpes",
      description: "Viral infection causing painful blisters",
      symptoms: ["Painful blisters", "Tingling", "Viral shedding", "Fever"],
      causes: ["Herpes simplex virus", "Sexual contact", "Skin contact"],
      solutions: ["Antiviral medication", "Pain relief", "Trigger avoidance"],
      recommendations: ["Antivirals during outbreak", "Disclosure to partners", "Stress management", "Avoid contact"],
    },
    "chickenpox": {
      icon: "🦗",
      title: "Chickenpox",
      description: "Contagious viral infection",
      symptoms: ["Fever", "Rash", "Fluid-filled blisters", "Itching"],
      causes: ["Varicella-zoster virus", "Airborne transmission"],
      solutions: ["Antivirals", "Calamine lotion", "Rest", "Vaccination"],
      recommendations: ["Stay home", "Avoid contact", "Prevent complications", "Vaccination for prevention"],
    },
    "shingles": {
      icon: "⚡",
      title: "Shingles",
      description: "Reactivation of varicella-zoster virus",
      symptoms: ["Severe nerve pain", "Blistering rash", "Burning sensation"],
      causes: ["Varicella-zoster reactivation", "Weak immunity", "Age"],
      solutions: ["Antivirals", "Pain management", "Topical cream"],
      recommendations: ["Early treatment", "Pain control", "Vaccination prevention", "Stress management"],
    },
    "warts": {
      icon: "🌳",
      title: "Warts",
      description: "Benign skin growths caused by HPV",
      symptoms: ["Rough skin growths", "Spread to other areas"],
      causes: ["Human papillomavirus", "Direct contact", "Weak immunity"],
      solutions: ["Cryotherapy", "Salicylic acid", "Surgical removal"],
      recommendations: ["Dermatologist", "Avoid self-treatment", "Prevent spread", "HPV vaccination"],
    },
    "boils": {
      icon: "🔴",
      title: "Boils",
      description: "Painful pus-filled skin infections",
      symptoms: ["Painful lumps", "Pus formation", "Fever", "Spreading"],
      causes: ["Bacterial infection", "Poor hygiene", "Friction"],
      solutions: ["Antibiotics", "Warm compress", "Drainage", "Proper hygiene"],
      recommendations: ["Seek medical attention", "Don't squeeze", "Keep clean", "Prevent recurrence"],
    },
    "sinusitis": {
      icon: "👃",
      title: "Sinusitis",
      description: "Inflammation of sinuses",
      symptoms: ["Nasal congestion", "Facial pain", "Headache", "Thick discharge"],
      causes: ["Viral infection", "Bacterial infection", "Allergies"],
      solutions: ["Nasal spray", "Decongestants", "Antibiotics", "Saline irrigation"],
      recommendations: ["ENT specialist", "Saline rinse", "Humidifier", "Treat underlying cause"],
    },
    "rhinitis": {
      icon: "🤧",
      title: "Rhinitis",
      description: "Inflammation of nasal passages",
      symptoms: ["Nasal inflammation", "Runny nose", "Sneezing", "Congestion"],
      causes: ["Allergies", "Viral infection", "Irritants"],
      solutions: ["Antihistamines", "Nasal spray", "Decongestants"],
      recommendations: ["Identify allergens", "Avoid triggers", "Nasal rinse", "See allergist"],
    },
    "pharyngitis": {
      icon: "😖",
      title: "Pharyngitis",
      description: "Sore throat inflammation",
      symptoms: ["Sore throat", "Difficulty swallowing", "Fever", "Red throat"],
      causes: ["Viral infection", "Bacterial infection", "Irritation"],
      solutions: ["Throat lozenges", "Antibiotics if bacterial", "Rest", "Warm liquids"],
      recommendations: ["Rest voice", "Throat culture if needed", "Pain relief", "Hydration"],
    },
    "laryngitis": {
      icon: "🗣️",
      title: "Laryngitis",
      description: "Inflammation of the larynx",
      symptoms: ["Hoarse voice", "Throat pain", "Difficulty speaking", "Cough"],
      causes: ["Viral infection", "Vocal strain", "Smoking"],
      solutions: ["Voice rest", "Humidifier", "Throat lozenges", "Steam inhalation"],
      recommendations: ["Rest voice completely", "Avoid whispering", "Hydrate", "See ENT if persistent"],
    },
    "bronchial-asthma": {
      icon: "💨",
      title: "Bronchial Asthma",
      description: "Chronic inflammatory airway disease",
      symptoms: ["Wheezing", "Breathlessness", "Chest tightness", "Cough"],
      causes: ["Allergies", "Environmental triggers", "Genetics", "Infections"],
      solutions: ["Inhalers", "Bronchodilators", "Controller medication", "Trigger avoidance"],
      recommendations: ["Pulmonologist", "Identify triggers", "Medication compliance", "Action plan"],
    },
    "sleep-apnea": {
      icon: "😴",
      title: "Sleep Apnea",
      description: "Breathing pauses during sleep",
      symptoms: ["Breathing pauses", "Daytime fatigue", "Loud snoring", "Morning headaches"],
      causes: ["Airway collapse", "Obesity", "Genetics", "Age"],
      solutions: ["CPAP machine", "Weight loss", "Positional therapy", "Surgery"],
      recommendations: ["Sleep specialist", "Sleep study", "CPAP compliance", "Weight management"],
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
