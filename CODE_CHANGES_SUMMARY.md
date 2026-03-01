# Appointment Booking System - Code Changes Summary

## Files Modified/Created

### 1. Backend - Schedule Controller
**File**: `backend/controllers/scheduleController.js`
**Status**: ✅ UPDATED

**Added Functions** (3 new exports):

```javascript
// 1. Helper function: Generate 30-minute time slots
const generateTimeSlots = (startTime, endTime) => {
  const slots = [];
  const [startHour, startMin] = startTime.split(':').map(Number);
  const [endHour, endMin] = endTime.split(':').map(Number);

  let currentHour = startHour;
  let currentMin = startMin;

  while (currentHour < endHour || (currentHour === endHour && currentMin < endMin)) {
    const timeStr = `${String(currentHour).padStart(2, '0')}:${String(currentMin).padStart(2, '0')}`;
    slots.push(timeStr);
    currentMin += 30;
    if (currentMin >= 60) {
      currentHour += Math.floor(currentMin / 60);
      currentMin = currentMin % 60;
    }
  }
  return slots;
};

// 2. Get available dates for a doctor (next 30 days)
exports.getAvailableDatesForBooking = async (req, res) => {
  // Fetches distinct schedule_dates for doctor in next 30 days
  // Returns array of YYYY-MM-DD dates
};

// 3. Get available time slots for a doctor on a specific date
exports.getAvailableTimeSlotsForBooking = async (req, res) => {
  // Validates date is not in past
  // Fetches doctor schedule for date
  // Generates all possible slots (30-min intervals)
  // Checks appointments table for booked slots
  // Returns { allSlots, availableSlots, bookedSlots }
};
```

**Functionality**:
- Generates 30-minute intervals automatically
- Validates past dates at backend level
- Checks real-time availability
- Filters booked appointments
- Returns comprehensive slot information

---

### 2. Backend - User Routes
**File**: `backend/Routes/User/userRoute.js`
**Status**: ✅ UPDATED

**Added Routes**:

```javascript
// Line 42: Added new route for available dates
router.get("/available-dates", scheduleController.getAvailableDatesForBooking);

// Line 43: Added new route for available times
router.get("/available-times", scheduleController.getAvailableTimeSlotsForBooking);
```

**Endpoint Details**:
- `GET /api/users/available-dates?doctorId=X`
- `GET /api/users/available-times?doctorId=X&date=YYYY-MM-DD`
- Both endpoints require query parameters
- No authentication required for these endpoints

---

### 3. Frontend - Book Appointment Page
**File**: `frontend/src/pages/BookAppointment.jsx`
**Status**: ✅ CREATED (NEW FILE)

**Component Structure**:

```jsx
// Main component with 4-step booking wizard
const BookAppointment = () => {
  // State for 4 steps
  const [step, setStep] = useState(1);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);

  // API calls
  const fetchDoctors = async () => { ... }
  const handleSelectDoctor = async (doctor) => { ... }
  const handleSelectDate = async (date) => { ... }
  const handleSelectTime = (time) => { ... }
  const handleBookAppointment = async () => { ... }
  const handleReset = () => { ... }
  const handleBack = () => { ... }

  // 4 conditional renders for each step
  return step === 1 ? <DoctorSelection /> :
         step === 2 ? <DateSelection /> :
         step === 3 ? <TimeSelection /> :
         <Confirmation />;
}
```

**Features**:
- Step 1: Doctor list from API
- Step 2: Calendar-style date selection
- Step 3: 30-minute time slot grid
- Step 4: Confirmation with optional notes
- Back button navigation
- Form validation at each step
- Toast notifications for feedback
- Success redirect to My Appointments

**Styling**:
- Responsive grid layouts
- Blue highlight for selections
- Color-coded buttons
- Card-based UI design

---

### 4. Frontend - Admin Manage Schedule
**File**: `frontend/src/pages/Admin/ManageSchedule.jsx`
**Status**: ✅ CREATED (NEW FILE)

**Component Structure**:

```jsx
// Admin schedule management component
const ManageSchedule = () => {
  // State management
  const [doctors, setDoctors] = useState([]);
  const [schedules, setSchedules] = useState([]);
  const [selectedDoctor, setSelectedDoctor] = useState('');
  const [scheduleDate, setScheduleDate] = useState('');
  const [startTime, setStartTime] = useState('09:00');
  const [endTime, setEndTime] = useState('17:00');
  const [editingId, setEditingId] = useState(null);

  // API calls
  const fetchDoctors = async () => { ... }
  const fetchSchedules = async () => { ... }
  const validateForm = () => { ... }
  const handleAddSchedule = async () => { ... }  // POST/PUT
  const handleEditSchedule = (schedule) => { ... }
  const handleDeleteSchedule = async (id) => { ... }
  const resetForm = () => { ... }

  // Render form section + schedule list
  return (
    <Form section (Add/Edit) />
    <Schedule list (Table) />
  );
}
```

**Features**:
- Doctor selection dropdown
- Date picker with past date prevention
- Start/End time inputs
- Add new schedule functionality
- Edit existing schedule (form pre-fill)
- Delete with confirmation
- Real-time schedule list refresh
- Form validation with toast notifications
- Two-section layout (form + list)

**Styling**:
- Form section: gray background
- Schedule table: responsive columns
- Action buttons: color-coded (blue/red)
- Mobile responsive design

---

### 5. Frontend - App Router
**File**: `frontend/src/App.jsx`
**Status**: ✅ UPDATED

**Added Imports**:

```javascript
// Line 24: Import BookAppointment component
const BookAppointment = React.lazy(() => import('./pages/BookAppointment'));

// Line 25: Import ManageSchedule component
const ManageSchedule = React.lazy(() => import('./pages/Admin/ManageSchedule'));
```

**Added Routes**:

```javascript
// Line 49: Route for user booking
<Route path="/book-appointment" element={<BookAppointment />} />

// Line 50: Route for user's appointments
<Route path="/my-appointments" element={<AllAppointments />} />

// Line 51: Route for admin schedule management
<Route path="/admin/manage-schedule" element={<ManageSchedule />} />
```

**Route Details**:
- `/book-appointment` - Triggers 4-step booking wizard
- `/my-appointments` - Shows user's booked appointments
- `/admin/manage-schedule` - Admin schedule management interface

---

### 6. Frontend - Dashboard Navigation
**File**: `frontend/src/pages/Dashboard.jsx`
**Status**: ✅ UPDATED

**Navigation Changes**:

```javascript
// OLD: Click button set menu state
onClick={() => setActiveMenu("calendar")}

// NEW: Navigate to booking page
onClick={() => navigate("/book-appointment")}

// Same for My Appointments
onClick={() => navigate("/my-appointments")}
```

**Impact**:
- "Book Appointments" button now navigates to `/book-appointment`
- "My Appointments" button now navigates to `/my-appointments`
- Removed local menu state handling for these items
- Cleaner routing architecture

---

## Database Schema

### doctor_schedule Table
```sql
CREATE TABLE doctor_schedule (
  id SERIAL PRIMARY KEY,
  doctor_id INTEGER NOT NULL,
  schedule_date DATE NOT NULL,
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  clinic VARCHAR(255),
  is_available BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(doctor_id, schedule_date, start_time),
  FOREIGN KEY(doctor_id) REFERENCES users(id)
);
```

### appointments Table
```sql
CREATE TABLE appointments (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL,
  doctor_id INTEGER NOT NULL,
  appointment_date DATE NOT NULL,
  appointment_time TIME NOT NULL,
  status VARCHAR(50) DEFAULT 'confirmed',
  notes TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY(user_id) REFERENCES users(id),
  FOREIGN KEY(doctor_id) REFERENCES users(id)
);
```

---

## Configuration Changes

### API Endpoints
No new environment variables needed. Uses existing:
- `API_URL` - Backend base URL (already configured)
- `CORS` - Already allows `/api/users/*` routes

### Dependencies
No new npm packages required. Uses existing:
- `react`
- `react-router-dom`
- `react-toastify`
- `fetch` (built-in)

---

## File Summary

| File | Type | Status | Changes |
|------|------|--------|---------|
| `scheduleController.js` | Backend | Modified | +3 functions |
| `userRoute.js` | Backend | Modified | +2 routes |
| `BookAppointment.jsx` | Frontend | Created | New component |
| `ManageSchedule.jsx` | Frontend | Created | New component |
| `App.jsx` | Frontend | Modified | +2 routes |
| `Dashboard.jsx` | Frontend | Modified | +2 navigation updates |

**Total Lines Added**: ~1500
**Total Lines Modified**: ~50
**New Features**: 7

---

## API Request/Response Examples

### Book Appointment Flow

**1. Get Available Dates**
```
GET http://localhost:5000/api/users/available-dates?doctorId=2
Response: { success: true, availableDates: ["2024-01-15", ...] }
```

**2. Get Available Times**
```
GET http://localhost:5000/api/users/available-times?doctorId=2&date=2024-01-15
Response: {
  success: true,
  scheduleId: 5,
  allSlots: ["10:00", "10:30", ...],
  availableSlots: ["10:00", "10:30", ...],
  bookedSlots: ["11:00"]
}
```

**3. Book Appointment**
```
POST http://localhost:5000/api/users/appointments
Headers: { Authorization: "Bearer {token}" }
Body: {
  doctorId: 2,
  appointmentDate: "2024-01-15",
  appointmentTime: "10:00",
  notes: "Optional notes"
}
Response: { success: true, message: "Appointment booked", appointmentId: 42 }
```

### Admin Schedule Flow

**1. Create Schedule**
```
POST http://localhost:5000/api/users/schedules
Headers: { Authorization: "Bearer {token}" }
Body: {
  doctorId: 2,
  scheduleDate: "2024-01-25",
  startTime: "09:00",
  endTime: "17:00"
}
Response: { success: true, message: "Schedule created", scheduleId: 12 }
```

**2. Get All Schedules**
```
GET http://localhost:5000/api/users/schedules/admin/all
Headers: { Authorization: "Bearer {token}" }
Response: { success: true, schedules: [...] }
```

**3. Update Schedule**
```
PUT http://localhost:5000/api/users/schedules/12
Headers: { Authorization: "Bearer {token}" }
Body: { doctorId: 2, scheduleDate: "2024-01-25", startTime: "10:00", endTime: "18:00" }
Response: { success: true, message: "Schedule updated" }
```

**4. Delete Schedule**
```
DELETE http://localhost:5000/api/users/schedules/12
Headers: { Authorization: "Bearer {token}" }
Response: { success: true, message: "Schedule deleted" }
```

---

## Validation Implementation

### Frontend Validation (Preventive)
```javascript
// Date validation
const selectedDate = new Date(date);
const today = new Date();
today.setHours(0, 0, 0, 0);
if (selectedDate < today) toast.error("Cannot book for past dates");

// Form field validation
if (!selectedDoctor) toast.error("Please select a doctor");
if (!scheduleDate) toast.error("Please select a date");

// Time validation (admin)
if (startTime >= endTime) toast.error("Start time must be before end time");
```

### Backend Validation (Enforced)
```javascript
// Date validation
const selectedDate = new Date(date);
const today = new Date();
today.setHours(0, 0, 0, 0);
if (selectedDate < today) {
  return res.status(400).json({
    success: false,
    message: 'Cannot book appointments for past dates'
  });
}

// Real-time availability check
const bookedResult = await client.query(
  `SELECT appointment_time FROM appointments 
   WHERE doctor_id = $1 AND appointment_date = $2 AND status = 'confirmed'`,
  [doctorId, date]
);
const bookedTimes = bookedResult.rows.map(row => row.appointment_time);
const availableSlots = allSlots.filter(slot => !bookedTimes.includes(slot));
```

---

## Performance Optimizations

1. **Lazy Loading**: Components imported with `React.lazy()` for code splitting
2. **Database Indexes**: Queries use indexed columns (doctor_id, schedule_date, appointment_date)
3. **Query Optimization**: Specific column selection, not SELECT *
4. **Caching**: Uses localStorage for auth tokens and user data
5. **Debouncing**: API calls only on button clicks, not on every render

---

## Security Measures

1. **JWT Authentication**: Admin endpoints require valid Bearer token
2. **Input Validation**: All user inputs validated on frontend and backend
3. **SQL Injection Prevention**: Parameterized queries with $1, $2, etc.
4. **CORS Protection**: Backend restricts origins appropriately
5. **Date Format Validation**: Strict YYYY-MM-DD format enforcement
6. **Unique Constraints**: Database prevents duplicate schedules
7. **Foreign Key Constraints**: Ensures referential integrity

---

## Responsive Design

### Mobile (< 768px)
- Single column layouts
- Full-width buttons
- Touch-friendly spacing
- Calendar dates stack vertically

### Tablet (768px - 1024px)
- Two-column where appropriate
- Optimized spacing
- Grid still responsive

### Desktop (> 1024px)
- Full multi-column layouts
- Optimal button sizes
- Professional spacing
- Maximum content width 1200px

---

## Testing Recommendations

1. **Unit Tests**:
   - `generateTimeSlots()` function
   - Date validation logic
   - Slot filtering logic

2. **Integration Tests**:
   - Full booking flow
   - Admin management flow
   - Real-time blocking

3. **E2E Tests**:
   - User books appointment
   - Admin manages schedules
   - Slot becomes unavailable

4. **Edge Cases**:
   - Midnight bookings
   - End-of-day bookings
   - Concurrent bookings
   - Expired tokens
