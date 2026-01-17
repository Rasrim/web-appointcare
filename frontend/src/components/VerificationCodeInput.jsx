import { useState, useRef, useEffect } from "react";

const VerificationCodeInput = ({ onCodeChange, length = 6 }) => {
  const [codes, setCodes] = useState(Array(length).fill(""));
  const inputRefs = useRef(Array(length).fill(null));

  useEffect(() => {
    onCodeChange(codes.join(""));
  }, [codes, onCodeChange]);

  const handleChange = (e, index) => {
    const value = e.target.value;

    // Only allow digits
    if (!/^\d*$/.test(value)) return;

    const newCodes = [...codes];
    newCodes[index] = value;
    setCodes(newCodes);

    // Auto-focus to next input
    if (value && index < length - 1) {
      inputRefs.current[index + 1]?.focus();
    }

    onCodeChange(newCodes.join(""));
  };

  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace" && !codes[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text");
    const digits = pastedData.replace(/\D/g, "").split("").slice(0, length);

    const newCodes = [...codes];
    digits.forEach((digit, index) => {
      newCodes[index] = digit;
    });
    setCodes(newCodes);

    // Focus on the last filled input or the last input
    const lastFilledIndex = digits.length - 1;
    if (lastFilledIndex < length - 1) {
      inputRefs.current[lastFilledIndex + 1]?.focus();
    }

    onCodeChange(newCodes.join(""));
  };

  return (
    <div style={styles.container}>
      <div style={styles.inputGroup}>
        {codes.map((code, index) => (
          <input
            key={index}
            ref={(el) => (inputRefs.current[index] = el)}
            type="text"
            inputMode="numeric"
            maxLength="1"
            value={code}
            onChange={(e) => handleChange(e, index)}
            onKeyDown={(e) => handleKeyDown(e, index)}
            onPaste={handlePaste}
            style={styles.input}
            placeholder="0"
          />
        ))}
      </div>
    </div>
  );
};

const styles = {
  container: {
    display: "flex",
    justifyContent: "center",
    marginBottom: "20px",
  },
  inputGroup: {
    display: "flex",
    gap: "12px",
    justifyContent: "center",
  },
  input: {
    width: "50px",
    height: "50px",
    textAlign: "center",
    fontSize: "24px",
    fontWeight: "600",
    border: "2px solid #ddd",
    borderRadius: "8px",
    transition: "all 0.3s ease",
    cursor: "text",
    color: "#1a1a1a",
  },
};

export default VerificationCodeInput;
