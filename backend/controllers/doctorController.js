const pool = require('../config/database');

// Get all doctors
exports.getAllDoctors = async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM doctors ORDER BY name');
    res.json(result.rows);
  } catch (err) {
    console.error('Error fetching doctors:', err);
    res.status(500).json({ message: 'Error fetching doctors' });
  }
};

// Get single doctor
exports.getDoctorById = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query('SELECT * FROM doctors WHERE id = $1', [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Doctor not found' });
    }
    res.json(result.rows[0]);
  } catch (err) {
    console.error('Error fetching doctor:', err);
    res.status(500).json({ message: 'Error fetching doctor' });
  }
};

// Create doctor
exports.createDoctor = async (req, res) => {
  try {
    const { name, specialty, experience, fee, availability, timing, photo } = req.body;

    if (!name || !specialty || !experience || !fee) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    const result = await pool.query(
      'INSERT INTO doctors (name, specialty, experience, fee, availability, timing, photo) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *',
      [name, specialty, experience, fee, availability || '', timing || '', photo || '']
    );

    res.status(201).json({ message: 'Doctor added successfully', doctor: result.rows[0] });
  } catch (err) {
    console.error('Error creating doctor:', err);
    res.status(500).json({ message: 'Error creating doctor' });
  }
};

// Update doctor
exports.updateDoctor = async (req, res) => {
  try {
    const { doctorId } = req.params;
    const { name, specialty, experience, fee, availability, timing, photo } = req.body;

    const result = await pool.query(
      'UPDATE doctors SET name = $1, specialty = $2, experience = $3, fee = $4, availability = $5, timing = $6, photo = $7 WHERE id = $8 RETURNING *',
      [name, specialty, experience, fee, availability || '', timing || '', photo || '', doctorId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Doctor not found' });
    }

    res.json({ message: 'Doctor updated successfully', doctor: result.rows[0] });
  } catch (err) {
    console.error('Error updating doctor:', err);
    res.status(500).json({ message: 'Error updating doctor' });
  }
};

// Delete doctor
exports.deleteDoctor = async (req, res) => {
  try {
    const { doctorId } = req.params;

    const result = await pool.query('DELETE FROM doctors WHERE id = $1 RETURNING *', [doctorId]);

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Doctor not found' });
    }

    res.json({ message: 'Doctor deleted successfully' });
  } catch (err) {
    console.error('Error deleting doctor:', err);
    res.status(500).json({ message: 'Error deleting doctor' });
  }
};

// Get doctor schedule
exports.getDoctorSchedule = async (req, res) => {
  try {
    const { doctorId } = req.params;
    
    const result = await pool.query(
      'SELECT * FROM doctor_schedule WHERE doctor_id = $1 ORDER BY day, start_time',
      [doctorId]
    );
    
    res.json(result.rows);
  } catch (err) {
    console.error('Error fetching doctor schedule:', err);
    res.status(500).json({ message: 'Error fetching doctor schedule' });
  }
};
