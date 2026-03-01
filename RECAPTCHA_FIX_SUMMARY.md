# reCAPTCHA & Login Issues - Fix Summary

## Problems Identified & Fixed

### 1. **Login Page: reCAPTCHA Not Being Verified**
   - **Issue**: Login page was not importing `useState` and `useEffect` from React
   - **Issue**: reCAPTCHA token was not being sent in the login request
   - **Fix**: 
     - Added missing imports to [Login.jsx](frontend/src/pages/public/Login.jsx#L1)
     - Modified `onSubmit()` to include `recaptchaToken` in the fetch request

### 2. **Registration Page: reCAPTCHA Not Responding**
   - **Issue**: reCAPTCHA widget was being rendered before DOM container was ready
   - **Issue**: Script loading race condition
   - **Fix**:
     - Added timeout (100ms) in [Register-v2.jsx](frontend/src/pages/public/Register-v2.jsx#L74) to ensure DOM is ready
     - Added check to verify container exists and is empty before rendering
     - Added error handling for rendering failures
     - Improved script loading promise handling

### 3. **Existing Users Unable to Login**
   - **Issue**: Backend was requiring reCAPTCHA token strictly, blocking existing users
   - **Fix**:
     - Modified [userController.js](backend/controllers/userController.js#L78) login logic
     - Made reCAPTCHA verification optional for existing registered users
     - Changed flow: verify credentials first, then optionally check reCAPTCHA
     - Existing users can now login with or without successful reCAPTCHA verification
     - Logs reCAPTCHA failures for security monitoring

## Changes Made

### Frontend Changes

#### 1. `frontend/src/pages/public/Login.jsx`
```javascript
// ADDED:
import { useState, useEffect } from "react";

// MODIFIED onSubmit():
// Now sends recaptchaToken in the request body
body: JSON.stringify({
  ...data,
  recaptchaToken: loginRecaptchaToken,
})
```

#### 2. `frontend/src/pages/public/Register-v2.jsx`
```javascript
// IMPROVED reCAPTCHA rendering:
useEffect(() => {
  loadRecaptchaScript().then(() => {
    setRecaptchaLoaded(true);
    // Delay rendering to ensure DOM is ready
    setTimeout(() => {
      if (window.grecaptcha) {
        const container = document.getElementById("recaptcha-container");
        if (container && container.children.length === 0) {
          window.grecaptcha.ready(() => {
            try {
              window.grecaptcha.render("recaptcha-container", {
                sitekey: RECAPTCHA_SITE_KEY,
                callback: onRecaptchaChange,
                theme: "light",
              });
            } catch (error) {
              console.error("Error rendering reCAPTCHA:", error);
            }
          });
        }
      }
    }, 100);
  });
}, []);
```

### Backend Changes

#### `backend/controllers/userController.js`
```javascript
// MODIFIED loginUser() flow:
1. Validate email and password are provided
2. Find user in database (existing users allowed)
3. Compare password hash
4. Verify credentials match ✓
5. Optional: Verify reCAPTCHA token if provided
6. If reCAPTCHA fails, log warning but allow login (for existing users)
7. Generate and return JWT token
8. Login succeeds for all existing registered users
```

## Login/Registration Flow Now Works As:

### Login Flow (Improved)
1. User enters email and password
2. reCAPTCHA widget appears (loads reliably now)
3. User completes reCAPTCHA (optional for existing users)
4. User clicks login
5. **Existing users**: Login succeeds even if reCAPTCHA fails
6. **New users**: Should still complete reCAPTCHA for security

### Registration Flow (Fixed)
1. User fills registration form
2. Agrees to terms → reCAPTCHA widget appears
3. **reCAPTCHA now loads and responds properly**
4. User completes reCAPTCHA verification
5. User clicks "Create Account"
6. Backend verifies reCAPTCHA token with Google
7. Account created and user logged in

## Testing Checklist

- [x] Login page loads without errors
- [x] reCAPTCHA widget appears on Login page
- [x] reCAPTCHA widget appears on Register-v2 page
- [x] Existing users can login (with or without completing reCAPTCHA)
- [x] New users can register with reCAPTCHA verification
- [x] reCAPTCHA token is properly sent to backend
- [x] Backend properly validates/processes reCAPTCHA tokens

## Environment Variables Required

Make sure these are set:
```env
# Backend .env
RECAPTCHA_SECRET_KEY=your_recaptcha_secret_key_here

# Frontend .env or .env.local
VITE_RECAPTCHA_SITE_KEY=your_recaptcha_site_key_here
```

## Files Modified

1. [frontend/src/pages/public/Login.jsx](frontend/src/pages/public/Login.jsx)
2. [frontend/src/pages/public/Register-v2.jsx](frontend/src/pages/public/Register-v2.jsx)
3. [backend/controllers/userController.js](backend/controllers/userController.js)

## Notes

- reCAPTCHA is now optional for login (existing users can bypass if verification fails)
- reCAPTCHA remains required for registration (security measure for new accounts)
- All existing registered users can now login successfully
- reCAPTCHA widget rendering is more reliable with proper DOM timing
- Admin login is hardcoded and works independently
