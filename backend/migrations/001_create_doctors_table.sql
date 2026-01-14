-- Create doctors table
CREATE TABLE IF NOT EXISTS doctors (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  specialty VARCHAR(255) NOT NULL,
  experience INTEGER NOT NULL,
  fee DECIMAL(10, 2) NOT NULL,
  availability VARCHAR(255),
  timing VARCHAR(255),
  photo TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create index on name for faster searches
CREATE INDEX IF NOT EXISTS idx_doctors_name ON doctors(name);
CREATE INDEX IF NOT EXISTS idx_doctors_specialty ON doctors(specialty);
