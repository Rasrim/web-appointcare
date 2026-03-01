# Backend Database & API Setup Guide

## Prerequisites
- Node.js (v14+)
- PostgreSQL (v12+)
- PostgreSQL client tools (psql)

## Installation & Setup

### 1. Install Dependencies
```bash
cd backend
npm install
```

### 2. Configure Environment Variables
Create a `.env` file in the `backend` directory:

```env
# Database Configuration
DB_USER=postgres
DB_PASSWORD=your_password
DB_HOST=localhost
DB_PORT=5432
DB_NAME=appointcare

# JWT Configuration
JWT_SECRET=your_jwt_secret_key_here

# Server Configuration
PORT=3000
NODE_ENV=development

# Email Configuration (for password reset)
EMAIL_USER=your_email@gmail.com
EMAIL_PASSWORD=your_app_password
EMAIL_SERVICE=gmail

# reCAPTCHA Configuration
RECAPTCHA_SECRET_KEY=your_recaptcha_secret_key
```

### 3. Create PostgreSQL Database
```bash
# Using psql directly
psql -U postgres -c "CREATE DATABASE appointcare;"
```

Or use the init script:
```bash
chmod +x init-db.sh
./init-db.sh
```

### 4. Run Database Migrations
The migrations will be applied automatically by the init script or via the Node.js initialization script:

```bash
node scripts/initDatabase.js
```

This will create all necessary tables:
- **users**: User profiles with authentication
- **doctors**: Doctor information
- **appointments**: User appointment bookings
- **doctor_schedule**: Doctor availability

### 5. Start the Backend Server
```bash
npm start
```

Server will run on `http://localhost:3000`

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login
- `POST /api/users/change-password` - Change password (requires auth)

### User Profile
- `GET /api/users/profile` - Get current user profile (requires auth)
- `PUT /api/users/profile` - Update profile (requires auth)
- `GET /api/users/:userId/profile` - Get user profile by ID (requires auth)
- `PUT /api/users/:userId/profile` - Update profile by ID (requires auth)

### Doctors
- `GET /api/doctors` - Get all doctors
- `GET /api/doctors/:id` - Get doctor details
- `POST /api/doctors` - Create doctor (admin only)
- `PUT /api/doctors/:id` - Update doctor (admin only)
- `DELETE /api/doctors/:id` - Delete doctor (admin only)

### Appointments
- `GET /api/appointments` - Get user's appointments (requires auth)
- `POST /api/appointments` - Book appointment (requires auth)
- `GET /api/appointments/admin/all` - Get all appointments (admin only)

### Doctor Schedule
- `GET /api/schedule/:doctorId` - Get doctor's schedule
- `POST /api/schedule` - Create schedule (requires auth)
- `PUT /api/schedule/:doctorId` - Update schedule (requires auth)
- `DELETE /api/schedule/:doctorId` - Delete schedule (requires auth)

## Database Schema

### users table
```sql
- id: SERIAL PRIMARY KEY
- full_name: VARCHAR(255) NOT NULL
- email: VARCHAR(255) UNIQUE NOT NULL
- password: VARCHAR(255) NOT NULL
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

### doctors table
```sql
- id: SERIAL PRIMARY KEY
- name: VARCHAR(255) NOT NULL
- specialty: VARCHAR(255) NOT NULL
- experience: INTEGER
- fee: DECIMAL(10, 2)
- availability: VARCHAR(255)
- timing: VARCHAR(255)
- photo: TEXT
- created_at: TIMESTAMP
- updated_at: TIMESTAMP
```

### appointments table
```sql
- id: SERIAL PRIMARY KEY
- user_id: INTEGER (FK to users)
- doctor_id: INTEGER (FK to doctors)
- appointment_date: DATE
- start_time: VARCHAR(50)
- status: VARCHAR(50)
- clinic: VARCHAR(255)
- created_at: TIMESTAMP
```

## Testing the API

### Using cURL

**Register**
```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "fullName": "John Doe",
    "email": "john@example.com",
    "password": "Password123",
    "phoneNumber": "+9779800000000",
    "recaptchaToken": "token_here"
  }'
```

**Login**
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "Password123"
  }'
```

**Get Profile** (requires auth)
```bash
curl -X GET http://localhost:3000/api/users/profile \
  -H "Authorization: Bearer your_token_here"
```

**Update Profile** (requires auth)
```bash
curl -X PUT http://localhost:3000/api/users/profile \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer your_token_here" \
  -d '{
    "fullName": "John Updated",
    "phoneNumber": "+9779800000001",
    "gender": "Male",
    "location": "Kathmandu",
    "dateOfBirth": "1990-01-15",
    "bio": "Medical professional"
  }'
```

## Troubleshooting

### Database Connection Error
```
Error: connect ECONNREFUSED 127.0.0.1:5432
```
**Solution**: Ensure PostgreSQL is running and connection details in `.env` are correct.

### Port Already in Use
```
Error: listen EADDRINUSE :::3000
```
**Solution**: Change PORT in `.env` or kill process using port 3000.

### JWT Token Issues
**Solution**: Ensure `JWT_SECRET` is set in `.env` file.

### Migration Errors
**Solution**: Check if tables already exist (migrations use `IF NOT EXISTS`).

## Admin Credentials
Default admin account (for testing):
- Email: `admin1245@gmail.com`
- Password: `Admin@1245`

⚠️ **Change these credentials in production!**

## Environment Variables Reference

| Variable | Description | Required |
|----------|-------------|----------|
| DB_USER | PostgreSQL username | Yes |
| DB_PASSWORD | PostgreSQL password | Yes |
| DB_HOST | Database host | Yes |
| DB_PORT | Database port | Yes |
| DB_NAME | Database name | Yes |
| JWT_SECRET | JWT secret key | Yes |
| PORT | Server port | No (default: 3000) |
| NODE_ENV | Environment (dev/prod) | No |
| EMAIL_USER | Email for notifications | No |
| EMAIL_PASSWORD | Email password | No |
| RECAPTCHA_SECRET_KEY | reCAPTCHA secret | No |

## Support & Documentation
- Full API documentation: See VIVA_DOCUMENTATION.md
- Database structure: See BACKEND_STRUCTURE.md
