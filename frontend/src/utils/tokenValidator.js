/**
 * Token Validator
 * Validates JWT token integrity and detects tampering
 * Automatically logs out user if token is tampered with
 */

const jwt_decode = (token) => {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    return JSON.parse(jsonPayload);
  } catch (error) {
    console.error('Token decode error:', error);
    return null;
  }
};

/**
 * Validates token structure and integrity
 * @param {string} token - JWT token
 * @returns {boolean} - True if token is valid
 */
export const validateToken = (token) => {
  if (!token) return false;

  // Check if token has 3 parts separated by dots
  const parts = token.split('.');
  if (parts.length !== 3) {
    console.warn('Invalid token structure: expected 3 parts');
    return false;
  }

  // Try to decode token to verify it's valid JSON
  const decoded = jwt_decode(token);
  if (!decoded) {
    console.warn('Failed to decode token');
    return false;
  }

  // Check if token has required fields
  if (!decoded.userId && !decoded.id && !decoded.sub) {
    console.warn('Token missing user identification');
    return false;
  }

  return true;
};

/**
 * Checks if token has been modified compared to stored copy
 * @param {string} token - Current token
 * @param {string} storedTokenHash - Previously stored token hash
 * @returns {boolean} - True if token hasn't been modified
 */
export const validateTokenIntegrity = (token) => {
  try {
    const storedHash = sessionStorage.getItem('tokenHash');
    
    if (!storedHash) {
      // First time storing token hash
      const hash = generateTokenHash(token);
      sessionStorage.setItem('tokenHash', hash);
      return true;
    }

    // Check if current token hash matches stored hash
    const currentHash = generateTokenHash(token);
    return currentHash === storedHash;
  } catch (error) {
    console.error('Token integrity check error:', error);
    return false;
  }
};

/**
 * Generates a hash of the token (simple implementation)
 * @param {string} token
 * @returns {string}
 */
const generateTokenHash = (token) => {
  let hash = 0;
  if (token.length === 0) return hash.toString();
  
  for (let i = 0; i < token.length; i++) {
    const char = token.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32bit integer
  }
  return hash.toString();
};

/**
 * Checks if token is expired
 * @param {string} token - JWT token
 * @returns {boolean} - True if token is still valid
 */
export const isTokenExpired = (token) => {
  try {
    const decoded = jwt_decode(token);
    if (!decoded || !decoded.exp) return true;

    // exp is in seconds, Date.now() is in milliseconds
    const currentTime = Math.floor(Date.now() / 1000);
    return decoded.exp < currentTime;
  } catch (error) {
    console.error('Token expiration check error:', error);
    return true;
  }
};

/**
 * Main token validation function - called on app initialization
 * Detects tampering and automatically logs out if needed
 */
export const initializeTokenValidator = () => {
  const token = localStorage.getItem('token');
  
  if (!token) return;

  // Check token validity
  if (!validateToken(token)) {
    console.warn('Invalid token detected - logging out');
    handleTokenInvalid();
    return;
  }

  // Check token integrity (detect tampering)
  if (!validateTokenIntegrity(token)) {
    console.warn('Token tampering detected - logging out');
    handleTokenInvalid('Token has been modified');
    return;
  }

  // Check token expiration
  if (isTokenExpired(token)) {
    console.warn('Token expired - logging out');
    handleTokenInvalid('Session expired');
    return;
  }

  // Setup periodic validation
  setupPeriodicValidation();
};

/**
 * Setup periodic token validation
 * Validates token every 5 minutes
 */
const setupPeriodicValidation = () => {
  // Check every 5 minutes
  const validationInterval = setInterval(() => {
    const token = localStorage.getItem('token');
    
    if (!token) {
      clearInterval(validationInterval);
      return;
    }

    // Check if token is still valid
    if (!validateToken(token) || isTokenExpired(token)) {
      clearInterval(validationInterval);
      console.warn('Token validation failed during periodic check');
      handleTokenInvalid('Session expired');
      return;
    }

    // Check for tampering
    if (!validateTokenIntegrity(token)) {
      clearInterval(validationInterval);
      console.warn('Token tampering detected during periodic check');
      handleTokenInvalid('Unauthorized access attempt detected');
      return;
    }
  }, 5 * 60 * 1000); // 5 minutes

  // Also validate on visibility change (when user switches tabs)
  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'visible') {
      const token = localStorage.getItem('token');
      
      if (token && !validateToken(token)) {
        console.warn('Invalid token detected after visibility change');
        handleTokenInvalid();
      }
      
      if (token && isTokenExpired(token)) {
        console.warn('Token expired after visibility change');
        handleTokenInvalid('Session expired');
      }
    }
  });
};

/**
 * Handle token invalidation - logs user out
 */
export const handleTokenInvalid = (reason = 'Invalid token') => {
  // Clear all stored data
  localStorage.clear();
  sessionStorage.clear();
  
  // Show message and redirect
  const message = reason || 'Session invalid. Please log in again.';
  
  // Dispatch custom event that Dashboard/other pages can listen to
  window.dispatchEvent(new CustomEvent('tokenInvalid', { detail: { reason: message } }));
  
  // Redirect to login
  if (window.location.pathname !== '/login') {
    window.location.href = '/login?reason=' + encodeURIComponent(message);
  }
};

/**
 * Validate token before making API calls
 * @returns {boolean} - True if token is valid and safe to use
 */
export const validateBeforeAPICall = () => {
  const token = localStorage.getItem('token');
  
  if (!token) {
    handleTokenInvalid('No token found');
    return false;
  }

  if (!validateToken(token)) {
    handleTokenInvalid('Invalid token');
    return false;
  }

  if (isTokenExpired(token)) {
    handleTokenInvalid('Session expired');
    return false;
  }

  if (!validateTokenIntegrity(token)) {
    handleTokenInvalid('Token has been modified');
    return false;
  }

  return true;
};

/**
 * Update token hash when user logs in
 * @param {string} token - New token
 */
export const updateTokenHash = (token) => {
  const hash = generateTokenHash(token);
  sessionStorage.setItem('tokenHash', hash);
};

export default {
  validateToken,
  validateTokenIntegrity,
  isTokenExpired,
  initializeTokenValidator,
  handleTokenInvalid,
  validateBeforeAPICall,
  updateTokenHash,
};
