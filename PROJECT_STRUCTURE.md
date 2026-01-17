# AppointCare Project Structure Guide

## 📁 Organized Folder Structure

This guide explains the complete project structure for **AppointCare** - Healthcare Appointment Booking System.

```
AppointCare/
│
├── 📂 frontend/                          # React Frontend Application
│   ├── 📂 src/                          # Source code
│   │   ├── 📂 components/               # Reusable React components
│   │   │   ├── BookingCalendar.jsx      # Appointment booking calendar
│   │   │   ├── DoctorTimesheet.jsx      # Doctor schedule management
│   │   │   ├── Navbar.jsx               # Top navigation bar
│   │   │   ├── SymptomsSection.jsx      # Symptoms carousel
│   │   │   ├── TermsAndConditions.jsx   # Terms modal
│   │   │   ├── VerificationCodeInput.jsx # Email verification input
│   │   │   ├── HomeNavbar.jsx           # Landing page navbar
│   │   │   └── HomeFooter.jsx           # Landing page footer
│   │   │
│   │   ├── 📂 pages/                    # Page components
│   │   │   ├── Dashboard.jsx            # Doctor browsing dashboard
│   │   │   ├── Profile.jsx              # User profile management
│   │   │   ├── SymptomDetail.jsx        # Symptom details page
│   │   │   ├── 📂 private/
│   │   │   │   └── Home.jsx             # Authenticated home page
│   │   │   ├── 📂 public/
│   │   │   │   ├── Login.jsx            # User login page
│   │   │   │   ├── Register.jsx         # User registration page
│   │   │   │   ├── ForgotPassword.jsx   # Password reset request
│   │   │   │   ├── ResetPassword.jsx    # Password reset confirmation
│   │   │   │   └── 📂 schema/
│   │   │   │       ├── login.schema.js
│   │   │   │       ├── register.schema.js
│   │   │   │       ├── forgot-password.schema.js
│   │   │   │       └── reset-password.schema.js
│   │   │   └── 📂 Admin/
│   │   │       └── AdminDashboard.jsx   # Admin panel
│   │   │
│   │   ├── 📂 utils/                    # Utility functions
│   │   │   ├── api.js                   # API configuration (VITE_API_URL)
│   │   │   ├── uploadService.js         # File upload utilities
│   │   │   └── translations.js          # i18n support (EN, NE)
│   │   │
│   │   ├── 📂 images/                   # Static images
│   │   │   ├── doctor1.png
│   │   │   ├── AppointCarenobg.png
│   │   │   └── ... other images
│   │   │
│   │   ├── App.jsx                      # Main app component with routes
│   │   ├── App.css                      # Global styles
│   │   ├── main.jsx                     # React entry point
│   │   └── index.css                    # Base styles
│   │
│   ├── 📂 public/                       # Static assets
│   │   └── vite.svg
│   │
│   ├── index.html                       # HTML entry point
│   ├── vite.config.js                   # Vite configuration
│   └── package.json                     # Frontend dependencies
│
├── 📂 backend/                          # Express.js Backend API
│   ├── 📂 config/                       # Configuration files
│   │   ├── database.js                  # PostgreSQL connection pool
│   │   ├── db.js                        # Database helper functions
│   │   ├── email.js                     # Email service (Nodemailer)
│   │   └── multer.js                    # File upload configuration
│   │
│   ├── 📂 controllers/                  # Route handler logic
│   │   ├── userController.js            # Auth & user management
│   │   ├── doctorController.js          # Doctor CRUD operations
│   │   ├── scheduleController.js        # Doctor schedule management
│   │   └── appointmentController.js     # Appointment booking logic
│   │
│   ├── 📂 routes/                       # API endpoint definitions
│   │   └── userRoute.js                 # Auth routes & protected endpoints
│   │
│   ├── 📂 models/                       # Data models
│   │   └── userModel.js                 # User data model
│   │
│   ├── 📂 scripts/                      # Utility scripts
│   │   └── initDatabase.js              # Database initialization
│   │
│   ├── 📂 utils/                        # Helper utilities
│   │   └── helper.js                    # Uploads folder creation
│   │
│   ├── 📂 uploads/                      # User uploaded files (gitignored)
│   │   └── profile_pics/
│   │
│   ├── 📂 viewmodels/                   # View model helpers
│   │   └── userviewmodel.js
│   │
│   ├── server.js                        # Express server entry point
│   ├── .env                             # Backend environment variables
│   ├── .env.example                     # Environment template
│   └── package.json                     # Backend dependencies
│
├── 📂 database/                         # Database Management
│   ├── 📂 migrations/                   # SQL migration files
│   │   ├── 001_create_doctors_table.sql
│   │   ├── 002_create_schedule_and_appointments_tables.sql
│   │   ├── 003_add_profile_columns_to_users.sql
│   │   └── 004_add_email_verification.sql
│   │
│   └── database.js                      # Database schema documentation
│
├── 📂 testing/                          # Testing & QA Documentation
│   ├── api-tests.js                     # API endpoint test suite
│   ├── frontend-tests.txt               # Frontend component tests
│   ├── backend-tests.txt                # Backend endpoint tests
│   └── manual-testing-checklist.md      # Manual QA checklist
│
├── 📄 Root Configuration Files
│   ├── package.json                     # Master configuration
│   ├── .env                             # Root environment (frontend)
│   ├── .env.example                     # Environment template
│   ├── .eslintignore                    # ESLint ignore rules
│   ├── .gitignore                       # Git ignore rules
│   ├── eslint.config.js                 # ESLint configuration
│   ├── postcss.config.js                # PostCSS configuration
│   └── tailwind.config.js               # Tailwind CSS configuration
│
├── 📚 Documentation
│   ├── README.md                        # Project overview and setup
│   └── VIVA_DOCUMENTATION.md            # Complete viva preparation guide
│
└── 📁 git
    └── .git/                            # Version control (hidden)
```

---

## 🎯 Quick Navigation Guide

### For Frontend Developers
- **Main App**: `frontend/src/App.jsx`
- **Components**: `frontend/src/components/`
- **Pages**: `frontend/src/pages/`
- **Styling**: `frontend/src/App.css` + Tailwind
- **Configuration**: `frontend/vite.config.js`
- **Environment**: `frontend/.env`

### For Backend Developers
- **Server Entry**: `backend/server.js`
- **Routes**: `backend/routes/userRoute.js`
- **Controllers**: `backend/controllers/`
- **Database**: `backend/config/database.js`
- **Email**: `backend/config/email.js`
- **Configuration**: `backend/.env`

### For Database Administrators
- **Migrations**: `database/migrations/`
- **Schema**: `database/database.js`
- **Connection**: `backend/config/database.js`
- **Tables**: Users, Doctors, Schedules, Appointments

### For QA/Testing
- **API Tests**: `testing/api-tests.js`
- **Frontend Tests**: `testing/frontend-tests.txt`
- **Backend Tests**: `testing/backend-tests.txt`
- **Documentation**: `VIVA_DOCUMENTATION.md`

---

## 📊 Folder Organization Benefits

### 1. **Frontend Separation** (`frontend/`)
- ✅ Isolated frontend dependencies
- ✅ Easy to host separately
- ✅ Clear component hierarchy
- ✅ Organized by feature (pages/components)

### 2. **Backend Isolation** (`backend/`)
- ✅ Independent API server
- ✅ Clear MVC pattern (models/controllers/routes)
- ✅ Separate configuration
- ✅ Database connection pooling

### 3. **Database Management** (`database/`)
- ✅ Centralized migrations
- ✅ Version control for schema
- ✅ Easy rollback capability
- ✅ Documentation in one place

### 4. **Testing Organization** (`testing/`)
- ✅ Separate test documentation
- ✅ Test cases organized by layer
- ✅ Easy to add new tests
- ✅ Clear testing checklist

---

## 🚀 Running the Project

### Individual Services

**Start Frontend Only**:
```bash
npm run frontend:dev
```
Runs on: `http://localhost:5173`

**Start Backend Only**:
```bash
npm run backend:dev
```
Runs on: `http://localhost:3000`

**Initialize Database**:
```bash
npm run backend:init-db
```

### Full Development Environment

**Start Both Frontend & Backend**:
```bash
npm run dev
```

### First Time Setup

**Complete Setup** (Install all dependencies):
```bash
npm run setup
```

---

## 📋 File Descriptions

### Frontend Files

| File | Purpose | Lines |
|------|---------|-------|
| `App.jsx` | Main app component with routes | ~50 |
| `pages/Login.jsx` | User login page | ~570 |
| `pages/Register.jsx` | User registration | ~950 |
| `pages/Dashboard.jsx` | Doctor browsing | ~745 |
| `pages/Profile.jsx` | User profile management | ~690 |
| `pages/private/Home.jsx` | Authenticated home | ~680 |
| `pages/Admin/AdminDashboard.jsx` | Admin panel | ~990 |
| `components/BookingCalendar.jsx` | Appointment booking | ~700 |
| `components/SymptomsSection.jsx` | Symptoms carousel | ~500 |
| `utils/api.js` | API configuration | ~32 |
| `utils/uploadService.js` | File upload service | ~54 |

### Backend Files

| File | Purpose | Lines |
|------|---------|-------|
| `server.js` | Express server setup | ~86 |
| `controllers/userController.js` | Auth logic | ~400+ |
| `config/email.js` | Nodemailer setup | ~150+ |
| `config/database.js` | PostgreSQL pool | ~15 |
| `routes/userRoute.js` | API endpoints | ~50 |

### Database Files

| File | Purpose |
|------|---------|
| `migrations/*.sql` | Schema creation and updates |
| `database.js` | Connection configuration |

---

## 🔄 Workflow Examples

### Adding a New Feature

1. **Create component** in `frontend/src/components/`
2. **Add page** if needed in `frontend/src/pages/`
3. **Update routes** in `frontend/src/App.jsx`
4. **Add API endpoint** in `backend/routes/`
5. **Create controller** in `backend/controllers/`
6. **Test** using files in `testing/`

### Deploying to Production

1. **Build frontend**: `npm run frontend:build`
2. **Deploy** `frontend/dist/` to hosting
3. **Deploy backend** to server
4. **Run migrations**: `npm run backend:init-db`
5. **Set environment variables** on server
6. **Test** all endpoints

---

## 🔒 Security Considerations

- **Frontend**: Authentication tokens in localStorage
- **Backend**: JWT validation on protected routes
- **Database**: Parameterized queries prevent SQL injection
- **API**: CORS restricted to frontend URL
- **Passwords**: Hashed with bcryptjs
- **Rate Limiting**: Enabled on auth endpoints

---

## 📈 Performance Optimization

- **Frontend**: Code splitting with React.lazy()
- **Backend**: Connection pooling, indexed queries
- **Database**: Proper indexing on frequently queried columns
- **Caching**: Browser caching for static assets
- **Compression**: gzip compression for API responses

---

## 🎓 Learning Resources

For each section, see `VIVA_DOCUMENTATION.md` for:
- Architecture diagrams
- Code flow explanations
- API endpoint documentation
- Database schema details
- Security implementation
- Testing procedures

---

## ✅ Verification Checklist

Ensure all folders exist:
- ✅ `frontend/src/` - Frontend code
- ✅ `backend/config/` - Backend configuration
- ✅ `backend/controllers/` - Route handlers
- ✅ `database/migrations/` - SQL migrations
- ✅ `testing/` - Test files

Ensure all config files exist:
- ✅ `frontend/.env` - Frontend environment
- ✅ `backend/.env` - Backend environment
- ✅ `package.json` (root) - Master config
- ✅ `vite.config.js` (frontend) - Build config
- ✅ `eslint.config.js` (root) - Linting

---

## 🆘 Troubleshooting

**Q: Where is my database configuration?**
A: Check `backend/config/database.js`

**Q: How do I run migrations?**
A: Use `npm run backend:init-db` in backend folder

**Q: Where are API endpoints documented?**
A: See `VIVA_DOCUMENTATION.md` API section

**Q: How do I add a new component?**
A: Add to `frontend/src/components/` and import in pages

**Q: How do I add a new API endpoint?**
A: Add route in `backend/routes/` and controller in `backend/controllers/`

---

*Last Updated: January 2026*
*Version: 1.0.0*
*Status: Production Ready*
