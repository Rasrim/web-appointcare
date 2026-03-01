# Complete AppointCare Setup & Verification Guide

## ✅ What's Been Updated

### Frontend (UI Matching Complete)
- ✅ Dashboard redesigned to match old layout
- ✅ Sidebar with correct navigation items
- ✅ Profile page with full editing capabilities
- ✅ All form fields and validations working

### Backend (API Integration Complete)
- ✅ User profile GET/PUT endpoints
- ✅ Password change endpoint
- ✅ Login returns userId
- ✅ All responses use camelCase field names
- ✅ JWT authentication middleware

### Database (Schema Complete)
- ✅ Users table with all profile columns
- ✅ Proper data types and constraints
- ✅ Indexes for performance
- ✅ Migration scripts for safe setup

---

## 🚀 Quick Start Guide

### Prerequisites
```bash
# Check Node.js version (need v14+)
node --version

# Check PostgreSQL version (need v12+)
psql --version
```

### 1. Backend Setup (5 minutes)

```bash
# Navigate to backend
cd backend

# Install dependencies
npm install

# Create .env file
cat > .env << EOF
DB_USER=postgres
DB_PASSWORD=postgres
DB_HOST=localhost
DB_PORT=5432
DB_NAME=appointcare
JWT_SECRET=your_secret_key_12345
PORT=3000
NODE_ENV=development
EOF

# Initialize database
node scripts/initDatabase.js

# Start server
npm start
```

Expected output:
```
PostgreSQL connected to AppointCare database
Server running on port 3000
```

### 2. Frontend Setup (3 minutes)

```bash
# Navigate to frontend
cd frontend

# Install dependencies
npm install

# Start development server
npm run dev
```

Expected output:
```
VITE v... ready in ... ms
Local: http://localhost:5173/
```

### 3. Access the Application
- Frontend: http://localhost:5173
- Backend API: http://localhost:3000

---

## 🧪 Testing Workflow

### Test 1: User Registration
1. Open http://localhost:5173/register
2. Fill in form:
   - Name: Test User
   - Email: test@example.com
   - Phone: +9779800000000
   - Password: TestPassword123
3. Complete reCAPTCHA
4. Click Register
5. ✅ Should redirect to login

### Test 2: User Login
1. Go to http://localhost:5173/login
2. Enter credentials:
   - Email: test@example.com
   - Password: TestPassword123
3. Click Login
4. ✅ Should redirect to dashboard
5. ✅ Check localStorage for `userId`, `token`, `fullName`

### Test 3: Profile Page
1. From dashboard, click on profile (user icon in header)
2. You should see:
   - Profile picture with upload option (when editing)
   - Personal Information section with all fields
   - General settings (password change, notifications)
3. ✅ Page loads without errors

### Test 4: Edit Profile
1. Click "Edit" button on profile card
2. Change any field (e.g., phone number)
3. Click "Save"
4. ✅ Should show success message
5. ✅ Data should persist on page reload

### Test 5: Change Password
1. In profile page, scroll to "General" section
2. Click "Change" button
3. Enter:
   - Current password: TestPassword123
   - New password: NewPassword123
   - Confirm: NewPassword123
4. Click "Update Password"
5. ✅ Should show success message
6. ✅ Try logging out and logging in with new password

### Test 6: Dashboard Features
1. Go back to dashboard
2. Verify sections appear:
   - ✅ Hero banner with search
   - ✅ Upcoming appointments (empty initially)
   - ✅ Navigation sidebar
3. Click other nav items:
   - ✅ Book Appointments
   - ✅ My Appointments
   - ✅ Help

---

## 🔍 API Testing with cURL

### Register
```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "fullName": "John Doe",
    "email": "john@test.com",
    "password": "Password123",
    "phoneNumber": "+9779800000001",
    "recaptchaToken": "test_token"
  }'
```

### Login
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@test.com",
    "password": "Password123"
  }' | jq .
```

Save the token from response as `TOKEN=...`

### Get Profile
```bash
TOKEN="your_token_here"
curl -X GET http://localhost:3000/api/users/1/profile \
  -H "Authorization: Bearer $TOKEN" | jq .
```

### Update Profile
```bash
TOKEN="your_token_here"
curl -X PUT http://localhost:3000/api/users/1/profile \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "fullName": "John Updated",
    "gender": "Male",
    "location": "Kathmandu",
    "phoneNumber": "+9779800000002",
    "dateOfBirth": "1990-01-15",
    "bio": "Sample bio"
  }' | jq .
```

### Change Password
```bash
TOKEN="your_token_here"
curl -X POST http://localhost:3000/api/users/change-password \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "currentPassword": "Password123",
    "newPassword": "NewPassword123"
  }' | jq .
```

---

## 🛠️ Troubleshooting

### Issue: "Cannot GET /api/users/1/profile"
**Solution**: Make sure you're sending Authorization header with Bearer token

### Issue: "Database connection failed"
**Solution**: 
1. Check PostgreSQL is running: `psql -U postgres -c "\l"`
2. Verify .env file has correct credentials
3. Database name matches: `appointcare`

### Issue: "Token expired"
**Solution**: Login again to get new token

### Issue: "Current password is incorrect"
**Solution**: Ensure you enter the CURRENT password before changing it

### Issue: Profile image not saving
**Solution**: 
- Check image is under 5MB
- Must be valid image format (jpg, png, etc)
- Profile image stored as base64 in database

### Issue: Frontend can't reach backend
**Solution**:
1. Backend running on port 3000? `lsof -i :3000`
2. Check CORS is enabled in server.js
3. Verify API_URL in frontend matches backend URL

---

## 📊 Database Verification

### Check if tables exist
```bash
psql -U postgres -d appointcare -c "\dt"
```

Should show:
```
            List of relations
 Schema |       Name        | Type  | Owner
--------+-------------------+-------+----------
 public | appointments      | table | postgres
 public | doctors           | table | postgres
 public | users             | table | postgres
 public | doctor_schedule   | table | postgres
```

### Check users table structure
```bash
psql -U postgres -d appointcare -c "\d users"
```

Should show columns:
- id, full_name, email, password, phone_number, birth_date, gender, location, bio, profile_image, is_verified

### Test user data
```bash
psql -U postgres -d appointcare -c "SELECT id, full_name, email FROM users LIMIT 5;"
```

---

## 📝 Environment Variables Checklist

```
✅ DB_USER=postgres
✅ DB_PASSWORD=postgres
✅ DB_HOST=localhost
✅ DB_PORT=5432
✅ DB_NAME=appointcare
✅ JWT_SECRET=your_secret_here
✅ PORT=3000
✅ NODE_ENV=development
```

---

## 🎯 Feature Checklist

### Registration ✅
- [x] Email validation
- [x] Phone number validation (Nepal format)
- [x] Password hashing
- [x] reCAPTCHA verification
- [x] User created in database

### Login ✅
- [x] Email/password verification
- [x] JWT token generation
- [x] userId saved to localStorage
- [x] Profile data saved to localStorage
- [x] Admin detection

### Profile ✅
- [x] Load user data from database
- [x] Edit all profile fields
- [x] Save changes to database
- [x] Upload profile image
- [x] Auto-calculate age from DOB
- [x] Change password with validation

### Dashboard ✅
- [x] Display user welcome message
- [x] Show upcoming appointments
- [x] Sidebar navigation
- [x] Search functionality
- [x] Link to profile editing

---

## 📚 Documentation Files

1. **DATABASE_SETUP.md** - Complete database configuration guide
2. **BACKEND_DATABASE_SYNC.md** - Backend changes and API integration
3. **VIVA_DOCUMENTATION.md** - Full API documentation
4. **BACKEND_STRUCTURE.md** - Backend architecture overview

---

## 🚨 Important Notes

1. **Admin Credentials** (for testing):
   - Email: admin1245@gmail.com
   - Password: Admin@1245

2. **Change JWT_SECRET in production!**

3. **Enable HTTPS in production**

4. **Store images properly** (consider cloud storage for production)

5. **Rate limiting** not implemented (add in production)

6. **Input validation** should be enhanced for production

---

## ✅ Verification Checklist

Before considering setup complete:

- [x] PostgreSQL database created
- [x] All tables created with proper columns
- [x] Backend server starts without errors
- [x] Frontend loads at localhost:5173
- [x] User can register with all fields
- [x] User can login
- [x] Profile page displays user data
- [x] Can edit and save profile
- [x] Can change password
- [x] Avatar/profile image saves
- [x] JWT tokens work correctly
- [x] All API endpoints respond correctly

---

## 🎉 Setup Complete!

If all tests pass, your AppointCare application is fully functional with:
- ✅ Matching UI to the old dashboard design
- ✅ Fully functional profile management
- ✅ Backend API properly integrated
- ✅ Database properly configured
- ✅ Authentication working correctly

**Happy testing! 🚀**
