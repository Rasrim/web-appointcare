const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

// API service for file uploads
export const uploadProfilePicture = async (file) => {
  const formData = new FormData();
  formData.append('profilePic', file);

  try {
    const response = await fetch(`${API_URL}/api/upload/profile-pic`, {
      method: 'POST',
      body: formData
    });

    if (!response.ok) {
      throw new Error('Failed to upload profile picture');
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error uploading profile picture:', error);
    throw error;
  }
};

export const uploadDoctorImage = async (file) => {
  const formData = new FormData();
  formData.append('doctorImage', file);

  try {
    const response = await fetch(`${API_URL}/api/upload/doctor-image`, {
      method: 'POST',
      body: formData
    });

    if (!response.ok) {
      throw new Error('Failed to upload doctor image');
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error uploading doctor image:', error);
    throw error;
  }
};

// Helper function to get full image URL
export const getImageUrl = (imagePath) => {
  if (!imagePath) return null;
  if (imagePath.startsWith('http')) {
    return imagePath;
  }
  return `http://localhost:3000${imagePath}`;
};
