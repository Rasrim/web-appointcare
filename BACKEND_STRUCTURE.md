# Backend Folder Structure - AppointCare

## Overview
The backend has been reorganized following Node.js/Sequelize best practices with a clean separation of concerns.

## Directory Structure

```
backend/
├── src/
│   ├── models/              # Sequelize ORM Models
│   │   ├── User.js          # User authentication & profile model
│   │   ├── Doctor.js        # Doctor information model
│   │   ├── DoctorSchedule.js # Doctor availability/schedule model
│   │   ├── Appointment.js   # Appointment bookings model
│   │   └── index.js         # Model associations & exports
│   │
│   ├── controllers/         # Request handlers & business logic
│   │   ├── userController.js        # Auth & user management (8 functions)
│   │   ├── doctorController.js      # Doctor operations (5 functions)
│   │   ├── scheduleController.js    # Schedule & appointments (7 functions)
│   │   └── uploadController.js      # File upload handling (2 functions)
│   │
│   ├── routes/              # API route definitions
│   │   └── userRoute.js     # All routes (user, doctor, schedule, appointments)
│   │
│   ├── middleware/          # Express middleware (auth, validation, etc.)
│   │   └── [empty - ready for expansion]
│   │
│   ├── services/            # Business logic layer (optional, for future)
│   │   └── [empty - ready for expansion]
│   │
│   └── utils/               # Utility functions & helpers
│       └── [empty - ready for expansion]
│
├── config/                  # Configuration files
│   ├── sequelize.js         # Sequelize connection & instance
│   ├── email.js             # Email sending configuration
│   ├── multer.js            # File upload configuration
│   └── database.js          # [deprecated - use sequelize.js]
│
├── migrations/              # Database migrations (SQL)
│   ├── 001_create_doctors_table.sql
│   ├── 002_create_schedule_and_appointments_tables.sql
│   ├── 003_add_profile_columns_to_users.sql
│   └── 004_add_email_verification.sql
│
├── seeders/                 # Database seeders (for test data)
│   └── [empty - ready for expansion]
│
├── server.js                # Express app setup & entry point
├── package.json             # Dependencies & scripts
└── .env                      # Environment variables (not tracked)
```

## Key Changes from Old Structure

### Before (Flat structure)
```
backend/
├── controllers/ (mixed concerns)
├── models/ (simple models)
├── routes/ (basic routing)
├── config/ (limited organization)
└── utils/
```

### After (Organized structure)
```
backend/
├── src/ (all source code)
│   ├── models/ (Sequelize ORM)
│   ├── controllers/ (business logic)
│   ├── routes/ (centralized routing)
│   ├── middleware/ (expandable)
│   ├── services/ (expandable)
│   └── utils/ (expandable)
├── config/ (environment & connections)
├── migrations/ (database schema)
└── seeders/ (test data)
```

## File Import Patterns

### From Src Subdirectories

**Models importing config:**
```javascript
// backend/src/models/User.js
const sequelize = require('../../config/sequelize');
```

**Controllers importing models:**
```javascript
// backend/src/controllers/userController.js
const { User, Doctor } = require('../models');
```

**Controllers importing config:**
```javascript
// backend/src/controllers/userController.js
const { sendVerificationEmail } = require('../../config/email');
```

**Routes importing controllers:**
```javascript
// backend/src/routes/userRoute.js
const { registerUser } = require('../controllers/userController');
```

### From Server.js (root level)

**Server importing src modules:**
```javascript
// backend/server.js
const { sequelize } = require('./src/models');
const userRoutes = require('./src/routes/userRoute');
```

## Layer Descriptions

### Models (`src/models/`)
- **Purpose:** Define database schema and Sequelize relationships
- **Files:** User.js, Doctor.js, DoctorSchedule.js, Appointment.js, index.js
- **Responsibility:** Schema definition, field validation, associations
- **Examples:** `User.create()`, `Doctor.findAll()`, `Appointment.findByPk()`

### Controllers (`src/controllers/`)
- **Purpose:** Handle HTTP requests and orchestrate responses
- **Files:** userController, doctorController, scheduleController, uploadController
- **Responsibility:** Route logic, error handling, response formatting
- **Pattern:** `exports.functionName = async (req, res) => { ... }`

### Routes (`src/routes/`)
- **Purpose:** Map HTTP methods and paths to controller functions
- **Files:** userRoute.js (unified route file with all endpoints)
- **Responsibility:** Endpoint definition, middleware assignment
- **Pattern:** `router.post('/register', registerUser)`

### Config (`config/`)
- **Purpose:** Store configuration and connection instances
- **Files:** sequelize.js, email.js, multer.js
- **Responsibility:** External service connections, shared configuration
- **Usage:** Required by models and controllers

### Middleware (`src/middleware/`) [Expandable]
- **Purpose:** Cross-cutting concerns (auth, validation, logging)
- **Future:** Authentication middleware, request validation, error handling

### Services (`src/services/`) [Expandable]
- **Purpose:** Reusable business logic (optional pattern)
- **Future:** Email service, authentication service, upload service

### Utils (`src/utils/`) [Expandable]
- **Purpose:** Helper functions and utilities
- **Future:** Date formatting, validation helpers, common utilities

## API Endpoints

All endpoints follow RESTful conventions:

### User Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login
- `POST /api/auth/verify-email` - Verify email address
- `POST /api/auth/resend-verification` - Resend verification code
- `POST /api/auth/forgot-password` - Request password reset
- `POST /api/auth/reset-password` - Reset password with token

### User Profile
- `GET /api/users/:userId/profile` - Get user profile
- `PUT /api/users/:userId/profile` - Update user profile

### Doctors
- `GET /api/doctors` - Get all doctors
- `GET /api/doctors/:id` - Get single doctor
- `POST /api/doctors` - Create new doctor (admin)
- `PUT /api/doctors/:id` - Update doctor (admin)
- `DELETE /api/doctors/:id` - Delete doctor (admin)

### Schedule & Appointments
- `GET /api/schedule/doctor/:doctorId` - Get doctor's schedule
- `POST /api/schedule` - Create schedule (admin)
- `PUT /api/schedule/:scheduleId` - Update schedule (admin)
- `DELETE /api/schedule/:scheduleId` - Delete schedule (admin)
- `GET /api/available-slots/:doctorId` - Get available slots
- `POST /api/appointments/book` - Book appointment
- `GET /api/appointments/user/:userId` - Get user appointments

## File Sizes & Line Counts

| File | Lines | Purpose |
|------|-------|---------|
| src/models/User.js | 70 | User authentication & profile |
| src/models/Doctor.js | 50 | Doctor information |
| src/models/DoctorSchedule.js | 60 | Schedule management |
| src/models/Appointment.js | 80 | Appointment bookings |
| src/models/index.js | 27 | Model associations |
| src/controllers/userController.js | 345 | User & auth logic (8 functions) |
| src/controllers/doctorController.js | 102 | Doctor operations (5 functions) |
| src/controllers/scheduleController.js | 165 | Schedule & appointment logic (7 functions) |
| src/controllers/uploadController.js | 44 | File upload handling (2 functions) |
| src/routes/userRoute.js | 39 | API route definitions |
| config/sequelize.js | ~20 | Sequelize instance |
| server.js | 40 | Express setup |

## Running the Server

```bash
# From backend directory
npm install        # Install dependencies
npm run dev        # Start server (with nodemon)
npm start          # Start server (production)
```

Expected output:
```
Sequelize connected to AppointCare database
Server running on port 3000
```

## Migration Status

✅ **Completed:**
- All models migrated to Sequelize
- All controllers converted to Sequelize syntax
- All routes organized and updated
- Server.js updated with new import paths
- Folder structure reorganized

⚠️ **Optional Improvements:**
- Add authentication middleware to protected routes
- Add request validation middleware
- Extract business logic to services layer
- Add proper error handling middleware
- Add input sanitization

## Technology Stack

- **Framework:** Express.js
- **ORM:** Sequelize 6.37.7
- **Database:** PostgreSQL
- **Authentication:** JWT + bcryptjs
- **Email:** Nodemailer
- **File Upload:** Multer
- **Environment:** Node.js + dotenv
