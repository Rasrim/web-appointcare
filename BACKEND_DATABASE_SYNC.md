# Backend & Database Synchronization Report

## Summary
All backend controllers, API routes, and database schema have been updated to match the Frontend UI requirements for the Profile page and Dashboard.

## Changes Made

### 1. Backend API Routes (`backend/Routes/User/userRoute.js`)
✅ Added alternative route patterns for Frontend compatibility:
- `GET /api/users/:userId/profile` - Get user profile (with auth)
- `PUT /api/users/:userId/profile` - Update user profile (with auth)
- Existing routes maintained for backward compatibility

### 2. User Controller (`backend/controllers/userController.js`)

#### ✅ Updated `loginUser`
- Now returns user data with: `id`, `email`, `fullName`, `phoneNumber`, `gender`, `location`
- Frontend can now save `userId` in localStorage for profile API calls

#### ✅ Updated `getProfile`
- Returns camelCase field names matching Frontend expectations
- Response includes: `fullName`, `phoneNumber`, `dateOfBirth`, `gender`, `location`, `bio`, `profileImage`

#### ✅ Updated `updateProfile`
- Accepts camelCase field names from Frontend
- Returns updated user data in camelCase format
- Works with both `/profile` and `/:userId/profile` routes

#### ✅ Enhanced `changePassword`
- Validates current password before allowing change
- Uses bcrypt for secure password hashing
- Requires JWT authentication token

### 3. Database Schema (`backend/migrations/`)

#### ✅ Created `000_create_users_table.sql`
Comprehensive users table with all required columns:
```sql
- id: SERIAL PRIMARY KEY
- full_name: VARCHAR(255)
- email: VARCHAR(255) UNIQUE
- password: VARCHAR(255)
- phone_number: VARCHAR(20)
- birth_date: DATE
- gender: VARCHAR(50)
- location: VARCHAR(255)
- bio: TEXT
- profile_image: LONGTEXT
- is_verified: BOOLEAN
- created_at: TIMESTAMP
- updated_at: TIMESTAMP
```

#### ✅ Maintained `003_add_profile_columns_to_users.sql`
- Safely adds missing columns with IF NOT EXISTS clauses
- Idempotent - safe to run multiple times

#### ✅ Created `006_ensure_profile_columns.sql`
- Ensures all required profile columns exist
- Sets proper default values
- Creates necessary indexes

### 4. Frontend Integration Points

#### ✅ Profile Page (`frontend/src/pages/Profile.jsx`)
Endpoints called:
- `GET /api/users/:userId/profile` - Fetch profile on load
- `PUT /api/users/:userId/profile` - Save profile changes
- `POST /api/users/change-password` - Change password

Data fields supported:
- `fullName` - User's full name (editable)
- `email` - Email address (editable)
- `phoneNumber` - Phone number (editable)
- `gender` - Gender (editable)
- `location` - Location (editable)
- `dateOfBirth` - Birth date (editable, age auto-calculated)
- `bio` - User bio (editable)
- `profileImage` - Profile picture (uploadable)

#### ✅ Dashboard (`frontend/src/pages/Dashboard.jsx`)
- Fetches user data from localStorage set by login
- Uses `userId` for profile API calls
- Navigates to profile page with proper routing

### 5. Authentication Middleware (`backend/middleware/authMiddleware.js`)
✅ Verified working correctly:
- Extracts Bearer token from Authorization header
- Validates JWT signature
- Attaches decoded user data to `req.user`
- Returns proper error responses

## API Request/Response Examples

### Get Profile
**Request:**
```
GET /api/users/:userId/profile
Authorization: Bearer {token}
```

**Response:**
```json
{
  "id": 1,
  "fullName": "John Doe",
  "email": "john@example.com",
  "phoneNumber": "+9779800000000",
  "dateOfBirth": "1990-01-15",
  "gender": "Male",
  "location": "Kathmandu",
  "bio": "Medical professional",
  "profileImage": "data:image/jpeg;base64,..."
}
```

### Update Profile
**Request:**
```
PUT /api/users/:userId/profile
Authorization: Bearer {token}
Content-Type: application/json

{
  "fullName": "John Updated",
  "phoneNumber": "+9779800000001",
  "gender": "Male",
  "location": "Kathmandu",
  "dateOfBirth": "1990-01-15",
  "bio": "Updated bio",
  "profileImage": "data:image/jpeg;base64,..."
}
```

**Response:**
```json
{
  "message": "Profile updated successfully",
  "user": {
    "id": 1,
    "fullName": "John Updated",
    "email": "john@example.com",
    ...
  }
}
```

### Change Password
**Request:**
```
POST /api/users/change-password
Authorization: Bearer {token}
Content-Type: application/json

{
  "currentPassword": "OldPassword123",
  "newPassword": "NewPassword123"
}
```

**Response:**
```json
{
  "message": "Password changed successfully"
}
```

## Database Setup Instructions

### Option 1: Using Node.js Script
```bash
cd backend
npm install
node scripts/initDatabase.js
```

### Option 2: Using Bash Script
```bash
cd backend
chmod +x init-db.sh
./init-db.sh
```

### Option 3: Manual Migration
```bash
psql -U postgres -d appointcare -f migrations/000_create_users_table.sql
psql -U postgres -d appointcare -f migrations/003_add_profile_columns_to_users.sql
psql -U postgres -d appointcare -f migrations/006_ensure_profile_columns.sql
```

## Environment Variables Required

```env
# Database
DB_USER=postgres
DB_PASSWORD=your_password
DB_HOST=localhost
DB_PORT=5432
DB_NAME=appointcare

# JWT
JWT_SECRET=your_secret_key_here

# Server
PORT=3000
NODE_ENV=development
```

## Verification Checklist

✅ User registration includes all profile fields
✅ User login returns userId for localStorage
✅ GET profile returns correct field names
✅ PUT profile updates all fields correctly
✅ Password change validates current password
✅ All routes require proper JWT authentication
✅ Database tables have all necessary columns
✅ Indexes created for performance
✅ Migrations are idempotent and safe

## Testing Endpoints

```bash
# Register
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"fullName":"Test","email":"test@test.com","password":"Test123","phoneNumber":"+9779800000000","recaptchaToken":"test"}'

# Login
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@test.com","password":"Test123"}'

# Get Profile
curl -X GET http://localhost:3000/api/users/1/profile \
  -H "Authorization: Bearer {token}"

# Update Profile
curl -X PUT http://localhost:3000/api/users/1/profile \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer {token}" \
  -d '{"fullName":"Updated Name","gender":"Male"}'

# Change Password
curl -X POST http://localhost:3000/api/users/change-password \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer {token}" \
  -d '{"currentPassword":"Old123","newPassword":"New123"}'
```

## Notes

- All profile image data is stored as base64 LONGTEXT in database
- Age is calculated automatically from dateOfBirth on Frontend
- Password change requires current password verification
- All endpoints require JWT authentication except register/login
- Database operations use connection pooling for efficiency
- All SQL migrations use IF NOT EXISTS for safety

## Files Modified

Backend:
- ✅ `backend/Routes/User/userRoute.js`
- ✅ `backend/controllers/userController.js`
- ✅ `backend/migrations/000_create_users_table.sql` (new)
- ✅ `backend/migrations/006_ensure_profile_columns.sql` (new)
- ✅ `backend/DATABASE_SETUP.md` (new)
- ✅ `backend/init-db.sh` (new)

Frontend:
- ✅ `frontend/src/pages/Profile.jsx`
- ✅ `frontend/src/pages/Dashboard.jsx`

Status: **✅ COMPLETE - Backend and Database fully synchronized with UI**
