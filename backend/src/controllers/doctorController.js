const { Doctor } = require('../models');

// Get all doctors
exports.getAllDoctors = async (req, res) => {
  try {
    const doctors = await Doctor.findAll({
      order: [['name', 'ASC']],
    });
    res.json(doctors);
  } catch (err) {
    console.error('Error fetching doctors:', err);
    res.status(500).json({ message: 'Error fetching doctors' });
  }
};

// Get single doctor
exports.getDoctorById = async (req, res) => {
  try {
    const { id } = req.params;
    const doctor = await Doctor.findByPk(id);
    if (!doctor) {
      return res.status(404).json({ message: 'Doctor not found' });
    }
    res.json(doctor);
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

    const doctor = await Doctor.create({
      name,
      specialty,
      experience,
      fee,
      availability: availability || '',
      timing: timing || '',
      photo: photo || '',
    });

    res.status(201).json({ message: 'Doctor added successfully', doctor });
  } catch (err) {
    console.error('Error creating doctor:', err);
    res.status(500).json({ message: 'Error creating doctor' });
  }
};

// Update doctor
exports.updateDoctor = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, specialty, experience, fee, availability, timing, photo } = req.body;

    const doctor = await Doctor.findByPk(id);
    if (!doctor) {
      return res.status(404).json({ message: 'Doctor not found' });
    }

    await doctor.update({
      name: name || doctor.name,
      specialty: specialty || doctor.specialty,
      experience: experience || doctor.experience,
      fee: fee || doctor.fee,
      availability: availability !== undefined ? availability : doctor.availability,
      timing: timing !== undefined ? timing : doctor.timing,
      photo: photo !== undefined ? photo : doctor.photo,
    });

    res.json({ message: 'Doctor updated successfully', doctor });
  } catch (err) {
    console.error('Error updating doctor:', err);
    res.status(500).json({ message: 'Error updating doctor' });
  }
};

// Delete doctor
exports.deleteDoctor = async (req, res) => {
  try {
    const { id } = req.params;

    const doctor = await Doctor.findByPk(id);
    if (!doctor) {
      return res.status(404).json({ message: 'Doctor not found' });
    }

    await doctor.destroy();
    res.json({ message: 'Doctor deleted successfully' });
  } catch (err) {
    console.error('Error deleting doctor:', err);
    res.status(500).json({ message: 'Error deleting doctor' });
  }
};
