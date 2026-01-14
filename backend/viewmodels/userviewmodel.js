// Simple view-model / DTO for user responses
const toUserView = (userDoc) => {
  if (!userDoc) return null;
  return {
    id: userDoc._id,
    fullName: userDoc.fullName,
    email: userDoc.email,
    role: userDoc.role,
    createdAt: userDoc.createdAt,
  };
};

module.exports = { toUserView };
