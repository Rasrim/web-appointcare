const fs = require('fs');
const path = require('path');

const createUploadsFolder = () => {
  const uploadsDir = path.join(__dirname, '../uploads');
  
  if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
    console.log('✓ Uploads folder created at:', uploadsDir);
  } else {
    console.log('✓ Uploads folder already exists');
  }
  
  return uploadsDir;
};

module.exports = { createUploadsFolder };
