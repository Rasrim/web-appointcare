// reCAPTCHA verification service
const axios = require('axios');

const RECAPTCHA_SECRET_KEY = process.env.RECAPTCHA_SECRET_KEY || '6Lf6lFgsAAAAAEAoAUC4j6XuoBXCKSWv-Hz2Qv-V';
const RECAPTCHA_VERIFY_URL = 'https://www.google.com/recaptcha/api/siteverify';

// Verify reCAPTCHA token with Google
const verifyRecaptchaToken = async (token) => {
  try {
    if (!token) {
      throw new Error('reCAPTCHA token is required');
    }

    const response = await axios.post(RECAPTCHA_VERIFY_URL, null, {
      params: {
        secret: RECAPTCHA_SECRET_KEY,
        response: token,
      },
    });

    const { success, score, action } = response.data;

    // For registration: require high success rate
    // score > 0.5 indicates likely legitimate user
    if (!success) {
      return {
        verified: false,
        error: 'reCAPTCHA verification failed',
        score: score || 0,
      };
    }

    return {
      verified: true,
      score: score || 0,
      action: action || 'unknown',
    };
  } catch (err) {
    console.error('reCAPTCHA verification error:', err.message);
    return {
      verified: false,
      error: err.message || 'Failed to verify reCAPTCHA',
      score: 0,
    };
  }
};

module.exports = { verifyRecaptchaToken };
