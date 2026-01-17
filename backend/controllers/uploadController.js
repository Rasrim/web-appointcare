const path = require('path');

// Handle profile picture upload
exports.uploadProfilePic = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    // Create the file path that will be stored in database
    const filePath = `/uploads/${req.file.filename}`;

    res.json({
      message: 'File uploaded successfully',
      filePath: filePath,
      filename: req.file.filename,
      size: req.file.size,
      mimetype: req.file.mimetype
    });
  } catch (err) {
    console.error('Upload error:', err);
    res.status(500).json({ message: 'Error uploading file' });
  }
};

// Handle doctor image upload (for admin adding doctors)
exports.uploadDoctorImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    const filePath = `/uploads/${req.file.filename}`;

    res.json({
      message: 'Doctor image uploaded successfully',
      filePath: filePath,
      filename: req.file.filename,
      size: req.file.size,
      mimetype: req.file.mimetype
    });
  } catch (err) {
    console.error('Upload error:', err);
    res.status(500).json({ message: 'Error uploading file' });
  }
};
