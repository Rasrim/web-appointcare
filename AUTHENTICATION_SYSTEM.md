# AppointCare Authentication System - Implementation Summary

## Overview
This document outlines the complete authentication system implemented for AppointCare with the following features:
- Nepal phone number validation (10 digits, starts with 9, second digit 8 or 7)
- reCAPTCHA protection on both registration and login
- JWT-based authentication
- Protected routes for authenticated users
- Two-step form submission with reCAPTCHA verification

---

## Registration Flow

### Step 1: Form Submission
1. User fills in all required fields:
   - Full Name
   - Email
   - Phone Number (Nepal format: 9[78]XXXXXXXX)
   - Gender
   - Password (with requirements: min 6 chars, 1 uppercase, 1 number, 1 special char)
   - Confirm Password
   - Birth Date
   - Terms & Conditions checkbox

2. Form validation using Zod schema:
   - Phone number must match: `^9[78]\d{8}$`
   - All fields are required
   - Passwords must match
   - Terms must be agreed

### Step 2: reCAPTCHA Verification
1. After initial form submission, user is redirected to reCAPTCHA step
2. User must verify the reCAPTCHA challenge
3. Upon successful verification, a reCAPTCHA token is generated

### Step 3: Account Creation
1. Registration data + reCAPTCHA token is sent to backend
2. Backend validates reCAPTCHA token with Google's API
3. Backend validates Nepal phone number format
4. User account is created with:
   - Hashed password (bcrypt)
   - Verified status = true (due to reCAPTCHA verification)
5. JWT token is generated and returned
6. **User is redirected to Login page** (not directly to dashboard)

### Backend Endpoint
```
POST /api/auth/register
Body: {
  fullName: string,
  email: string,
  password: string,
  phoneNumber: string (format: +977... or 9[78]...),
  birthDate: string (ISO date),
  gender: string,
  recaptchaToken: string
}
```

---

## Login Flow

### Step 1: Credentials Submission
1. User enters email and password
2. Form validation using Zod schema
3. User clicks "Continue to Verification" button

### Step 2: reCAPTCHA Verification
1. User is presented with reCAPTCHA challenge
2. Must verify to proceed with login
3. **No email verification needed** - reCAPTCHA serves as security measure

### Step 3: Authentication
1. Credentials + reCAPTCHA token sent to backend
2. Backend verifies reCAPTCHA token
3. Backend validates email and password
4. JWT token is generated
5. User is redirected to Dashboard (private home page)

### Backend Endpoint
```
POST /api/auth/login
Body: {
  email: string,
  password: string,
  recaptchaToken: string
}
Response: {
  message: string,
  user: { id, email, fullName },
  token: JWT,
  isAdmin: boolean
}
```

---

## Nepal Phone Number Validation

### Format Rules
- **Total digits**: 10
- **First digit**: Must be 9
- **Second digit**: Must be 8 or 7
- **Pattern**: `9[78]XXXXXXXX`

### Examples
- ✅ Valid: 9841234567, 9787654321
- ❌ Invalid: 8841234567, 9641234567, 98412345

### Regex Pattern
```javascript
^9[78]\d{8}$
```

### Implementation
- Frontend validation (Zod schema)
- Backend validation (additional layer)
- User-friendly error messages

---

## Protected Routes

### Implementation
Created `ProtectedRoute.jsx` component that:
- Checks for valid JWT token in localStorage
- Redirects unauthenticated users to login page
- Supports role-based access (admin vs regular users)

### Protected Routes
1. `/dashboard` - User dashboard (authenticated users only)
2. `/profile` - User profile (authenticated users only)
3. `/admin` - Admin dashboard (admin role only)

### Usage
```jsx
<Route path="/dashboard" element={<ProtectedRoute element={<Dashboard />} />} />
<Route path="/admin" element={<ProtectedRoute element={<AdminDashboard />} requiredRole="admin" />} />
```

---

## JWT Token Management

### Token Generation
- Algorithm: HS256
- Secret: `process.env.JWT_SECRET` or 'secret' (default)
- Expiration: 7 days
- Payload: `{ id: userId, email: userEmail }`

### Token Storage
- Stored in `localStorage` as 'token'
- Retrieved on every protected route access
- Cleared on logout

### Token Validation
- Verified on backend for protected endpoints
- Checked client-side for route protection

---

## Security Features

### 1. reCAPTCHA Protection
- Google reCAPTCHA v2 integration
- Required for both registration and login
- Prevents bot attacks and brute-force attempts
- Server-side verification with Google API

### 2. Password Security
- Bcrypt hashing (salt rounds: 10)
- Password requirements enforced:
  - Minimum 6 characters
  - At least 1 uppercase letter
  - At least 1 number
  - At least 1 special character
- Password strength indicator in UI

### 3. Phone Number Validation
- Nepal-specific format enforcement
- Prevents invalid phone numbers in system
- Both frontend and backend validation

### 4. Email Verification
- Unique email constraint in database
- Duplicate email detection
- User-friendly error messages

### 5. Admin Access
- Special admin email: `admin1245@gmail.com`
- Admin password: `Admin@1245`
- Admin role stored in localStorage
- Protected admin routes

---

## Vite Configuration

### Environment Variables
Create `.env` file in root:
```
VITE_API_URL=http://localhost:5000
VITE_RECAPTCHA_SITE_KEY=your_recaptcha_site_key
```

### Vite Config
```javascript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173
  }
})
```

---

## Files Modified/Created

### Frontend
1. **src/pages/public/Register.jsx** - Updated with reCAPTCHA flow
2. **src/pages/public/Login.jsx** - Updated with reCAPTCHA flow
3. **src/pages/public/schema/register.schema.js** - Nepal phone validation
4. **src/App.jsx** - Added ProtectedRoute
5. **src/components/ProtectedRoute.jsx** - New component

### Backend
1. **backend/controllers/userController.js** - Updated register & login
2. **backend/config/recaptcha.js** - reCAPTCHA verification

---

## Testing Flow

### Registration Test
1. Navigate to `/register`
2. Fill all fields with valid Nepal phone number
3. Click "Sign Up"
4. Complete reCAPTCHA verification
5. Should see success message
6. Should be redirected to `/login`

### Login Test
1. Navigate to `/login`
2. Enter registered email and password
3. Click "Continue to Verification"
4. Complete reCAPTCHA verification
5. Should see success message
6. Should be redirected to `/dashboard`

### Protected Route Test
1. Try accessing `/dashboard` without logging in
2. Should be redirected to `/login`
3. After login, `/dashboard` should be accessible

---

## Error Handling

### Registration Errors
- "Missing required fields" - When required fields are empty
- "Invalid Nepal phone number format..." - When phone doesn't match pattern
- "Email already registered" - When email exists
- "reCAPTCHA verification failed" - When reCAPTCHA fails

### Login Errors
- "Email and password required" - When credentials missing
- "reCAPTCHA verification required" - When reCAPTCHA not verified
- "Invalid credentials" - When email/password don't match

---

## Future Enhancements

1. **Two-Factor Authentication (2FA)** - SMS or email OTP
2. **Social Login** - Google/Facebook integration
3. **Password Recovery Email** - Forgot password workflow
4. **Session Management** - Multiple device login
5. **Activity Logging** - Track user login history
6. **Rate Limiting** - Prevent brute-force attacks
7. **Refresh Tokens** - Separate access and refresh tokens

---

## Notes for Development

- All sensitive data (JWT_SECRET, API keys) should be in environment variables
- Never commit `.env` file to repository
- Test reCAPTCHA with test keys in development
- Ensure backend CORS is configured correctly
- Monitor reCAPTCHA analytics for bot detection patterns

---

Generated: 2026-02-03
Status: ✅ Implementation Complete
