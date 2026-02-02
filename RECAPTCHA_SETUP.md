# 🔐 reCAPTCHA INTEGRATION GUIDE

## Email Verification Replaced with Google reCAPTCHA

Your project now uses **Google reCAPTCHA v2 (Checkbox)** instead of email verification codes. This means:

✅ **No email required** to send verification codes  
✅ **Instant verification** during registration  
✅ **Better security** against bot registrations  
✅ **Better user experience** - no waiting for emails  

---

## 📋 SETUP INSTRUCTIONS

### Step 1: Get reCAPTCHA API Keys from Google

1. Go to: https://www.google.com/recaptcha/admin
2. Sign in with your Google account
3. Click **"Create" (+)** button
4. Fill in the form:
   - **Label:** AppointCare
   - **reCAPTCHA type:** reCAPTCHA v2 → **"I'm not a robot" Checkbox**
   - **Domains:** localhost, 127.0.0.1
5. Click **"Create"**
6. You'll get:
   - **Site Key** (public key for frontend)
   - **Secret Key** (private key for backend)

### Step 2: Add Keys to Environment Files

**Backend `.env` file:**
```env
RECAPTCHA_SECRET_KEY=your_recaptcha_secret_key_here
```

**Frontend `.env` file (or `.env.local`):**
```env
REACT_APP_RECAPTCHA_SITE_KEY=your_recaptcha_site_key_here
```

**OR in `vite.config.js` (if using Vite):**
```javascript
VITE_RECAPTCHA_SITE_KEY=your_recaptcha_site_key_here
```

### Step 3: Update Frontend Component

The new Register component is already created at:  
`frontend/src/pages/public/Register-v2.jsx`

To use it, replace your current Register import in `App.jsx`:

```jsx
// OLD:
const Register = React.lazy(() => import('./pages/public/Register'));

// NEW:
const Register = React.lazy(() => import('./pages/public/Register-v2'));
```

### Step 4: Install axios (if not already installed)

```bash
cd backend
npm install axios
```

### Step 5: Restart Backend Server

```bash
node server.js
```

---

## 🎯 HOW IT WORKS

### Registration Flow

1. **User fills form** with:
   - Full Name
   - Email
   - Password
   - Phone Number
   - Gender
   - Birth Date

2. **User completes reCAPTCHA** → "I'm not a robot" checkbox

3. **User clicks "Create Account"**

4. **Frontend submits:**
   - Form data + reCAPTCHA token to backend
   - Token sent to Google for verification

5. **Backend validates:**
   - Checks reCAPTCHA token with Google
   - Creates user immediately (no email wait)
   - Returns JWT token

6. **User logged in automatically** → Redirected to dashboard

---

## 📁 FILES CHANGED

### Backend Changes:

1. **Created:** `backend/config/recaptcha.js`
   - Handles reCAPTCHA token verification
   - Communicates with Google API

2. **Modified:** `backend/controllers/userController.js`
   - Updated `registerUser()` to accept reCAPTCHA token
   - Replaced `verifyEmail()` with `verifyRecaptcha()`
   - No more email sending required

3. **Modified:** `backend/Routes/User/userRoute.js`
   - Changed route from `/verify-email` to `/verify-recaptcha`

### Frontend Changes:

1. **Created:** `frontend/src/pages/public/Register-v2.jsx`
   - New registration form with reCAPTCHA widget
   - Loads Google reCAPTCHA script
   - Validates reCAPTCHA before submission
   - Shows success/error messages

---

## 🧪 TESTING

### Test 1: Complete Registration Flow

1. Go to http://localhost:5173/register
2. Fill all form fields
3. Complete reCAPTCHA ("I'm not a robot")
4. Click "Create Account"
5. Should see "Registration successful!"
6. Should be redirected to dashboard

### Test 2: reCAPTCHA Validation

**Without completing reCAPTCHA:**
- Button should be disabled
- Error message: "Please complete the reCAPTCHA verification"

**After completing reCAPTCHA:**
- Button should be enabled
- "✓ Verified!" message appears

### Test 3: API Endpoint

```bash
# Test reCAPTCHA verification endpoint
curl -X POST http://localhost:3000/api/auth/verify-recaptcha \
  -H "Content-Type: application/json" \
  -d '{"recaptchaToken":"<token_from_frontend>"}'
```

---

## 🔒 reCAPTCHA Score Logic

The backend validates tokens and checks:

| Score | Meaning |
|-------|---------|
| 0.9+ | Almost certainly a legitimate user |
| 0.5+ | Likely a legitimate user (threshold) |
| < 0.5 | Likely a bot |

Current setup accepts scores **> 0.5** (you can adjust in `backend/config/recaptcha.js`)

---

## ⚙️ CONFIGURATION

### Adjust reCAPTCHA Minimum Score

In `backend/config/recaptcha.js`, modify the threshold:

```javascript
// Current: accepts if success && score > 0
// You can add: if (score < 0.5) return error
```

### Use reCAPTCHA v3 Instead (Optional)

For invisible verification without user interaction:

1. Change reCAPTCHA type to **reCAPTCHA v3** in Google Console
2. Update frontend to automatically send token
3. Backend can check score and decide to require additional verification

---

## 🚀 DEPLOYMENT

When deploying to production:

1. Add your production domain to Google reCAPTCHA domains:
   - https://www.yourdomainname.com
   - https://api.yourdomainname.com (if different)

2. Update `.env` files with production keys:
   ```env
   RECAPTCHA_SECRET_KEY=your_production_secret_key
   ```

3. Rebuild frontend:
   ```bash
   npm run build
   ```

---

## 🐛 TROUBLESHOOTING

### "reCAPTCHA verification failed"
- ❌ Ensure reCAPTCHA is configured correctly
- ❌ Check `RECAPTCHA_SECRET_KEY` in `.env`
- ❌ Make sure you're using the correct key pair

### "Please complete reCAPTCHA" but already completed
- ❌ Browser might not have loaded Google script
- ❌ Try refreshing the page
- ❌ Check browser console for errors

### reCAPTCHA widget not showing
- ❌ Frontend environment variables not set
- ❌ `REACT_APP_RECAPTCHA_SITE_KEY` missing
- ❌ Google script didn't load (check network tab)

### "Invalid reCAPTCHA token"
- ❌ Token expired (usually after 2 minutes)
- ❌ User completed reCAPTCHA but form not submitted quickly
- ❌ Test again with new completion

---

## 📞 SUPPORT

For reCAPTCHA issues: https://support.google.com/recaptcha  
Google reCAPTCHA Documentation: https://developers.google.com/recaptcha

---

## ✅ VERIFICATION CHECKLIST

- [ ] Got reCAPTCHA keys from Google
- [ ] Added `RECAPTCHA_SECRET_KEY` to backend `.env`
- [ ] Added `REACT_APP_RECAPTCHA_SITE_KEY` to frontend `.env`
- [ ] Updated Register component import in `App.jsx`
- [ ] Installed axios: `npm install axios`
- [ ] Backend server running: `node server.js`
- [ ] Frontend running: `npm run dev`
- [ ] reCAPTCHA widget visible on /register page
- [ ] Can complete registration with reCAPTCHA
- [ ] User automatically logged in after registration

Once all checked, your **reCAPTCHA integration is complete!** ✨

---

*Integration Date: February 2, 2026*  
*reCAPTCHA Type: v2 (Checkbox)*  
*Status: Ready for Use*
