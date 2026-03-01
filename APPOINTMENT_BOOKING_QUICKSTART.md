# Appointment Booking System - Quick Reference Guide

## Quick Start

### For Users - Booking an Appointment:
1. Login to the AppointCare dashboard
2. Click **"📅 Book Appointments"** in the left sidebar
3. **Step 1**: Select a doctor from the list
4. **Step 2**: Choose an available date (shown in calendar format)
5. **Step 3**: Pick a time slot (30-minute intervals like 10:00, 10:30, 11:00, etc.)
6. **Step 4**: Review details, add optional notes, and click **"Confirm Booking"**
7. Success! You'll be redirected to "My Appointments"

### For Admins - Managing Doctor Schedules:
1. Navigate to `/admin/manage-schedule` or click **"Admin"** → **"Manage Schedule"**
2. **Add Schedule**:
   - Select doctor
   - Pick date (cannot be past date)
   - Set start time (e.g., 09:00)
   - Set end time (e.g., 17:00)
   - Click **"Add Schedule"**
3. **Edit Schedule**:
   - Click **"Edit"** button on schedule row
   - Form pre-fills with existing values
   - Make changes and click **"Update Schedule"**
   - Click **"Cancel"** to exit edit mode
4. **Delete Schedule**:
   - Click **"Delete"** button
   - Confirm deletion

## Component Details

### BookAppointment.jsx
**Location**: `frontend/src/pages/BookAppointment.jsx`
**Route**: `/book-appointment`

**Props**: None (uses localStorage for auth)

**State Management**:
- `step` - Current step (1-4)
- `selectedDoctor` - Selected doctor object
- `selectedDate` - Selected date (YYYY-MM-DD)
- `selectedTime` - Selected time slot
- `availableDates` - Array of available dates
- `availableSlots` - Array of available time slots

**API Calls**:
- `GET /api/users/doctors` - Fetch all doctors
- `GET /api/users/available-dates?doctorId=X` - Get available dates
- `GET /api/users/available-times?doctorId=X&date=YYYY-MM-DD` - Get available slots
- `POST /api/users/appointments` - Book appointment

### ManageSchedule.jsx
**Location**: `frontend/src/pages/Admin/ManageSchedule.jsx`
**Route**: `/admin/manage-schedule`

**Props**: None (uses localStorage for auth)

**State Management**:
- `doctors` - Array of all doctors
- `schedules` - Array of all schedules
- `selectedDoctor` - Selected doctor ID
- `scheduleDate` - Selected date
- `startTime` - Schedule start time
- `endTime` - Schedule end time
- `editingId` - ID of schedule being edited (null if adding new)

**API Calls**:
- `GET /api/users/doctors` - Fetch all doctors
- `GET /api/users/schedules/admin/all` - Get all schedules
- `POST /api/users/schedules` - Create new schedule
- `PUT /api/users/schedules/:id` - Update schedule
- `DELETE /api/users/schedules/:id` - Delete schedule

## API Reference

### GET `/api/users/available-dates`
Get available dates for a doctor (next 30 days)

**Query Parameters**:
- `doctorId` (required) - Doctor ID

**Example Request**:
```
GET http://localhost:5000/api/users/available-dates?doctorId=2
```

**Response**:
```json
{
  "success": true,
  "availableDates": [
    "2024-01-15",
    "2024-01-17",
    "2024-01-19"
  ]
}
```

---

### GET `/api/users/available-times`
Get available time slots for a doctor on a specific date

**Query Parameters**:
- `doctorId` (required) - Doctor ID
- `date` (required) - Date in YYYY-MM-DD format

**Example Request**:
```
GET http://localhost:5000/api/users/available-times?doctorId=2&date=2024-01-15
```

**Response**:
```json
{
  "success": true,
  "scheduleId": 5,
  "date": "2024-01-15",
  "allSlots": [
    "10:00", "10:30", "11:00", "11:30", "12:00",
    "12:30", "13:00", "13:30", "14:00", "14:30",
    "15:00"
  ],
  "availableSlots": [
    "10:00", "10:30", "11:00", "11:30", "12:00",
    "12:30", "13:00", "14:00", "14:30", "15:00"
  ],
  "bookedSlots": ["13:30"]
}
```

---

### POST `/api/users/appointments`
Book an appointment

**Headers**:
- `Authorization: Bearer {token}`
- `Content-Type: application/json`

**Request Body**:
```json
{
  "doctorId": 2,
  "appointmentDate": "2024-01-15",
  "appointmentTime": "10:00",
  "notes": "I have a chronic headache issue"
}
```

**Response**:
```json
{
  "success": true,
  "message": "Appointment booked successfully",
  "appointmentId": 42
}
```

---

### POST `/api/users/schedules`
Create a new doctor schedule (Admin)

**Headers**:
- `Authorization: Bearer {token}`
- `Content-Type: application/json`

**Request Body**:
```json
{
  "doctorId": 2,
  "scheduleDate": "2024-01-25",
  "startTime": "09:00",
  "endTime": "17:00"
}
```

**Response**:
```json
{
  "success": true,
  "message": "Schedule created successfully",
  "scheduleId": 12
}
```

---

### PUT `/api/users/schedules/:id`
Update an existing doctor schedule

**Headers**:
- `Authorization: Bearer {token}`
- `Content-Type: application/json`

**URL Parameters**:
- `id` - Schedule ID

**Request Body**:
```json
{
  "doctorId": 2,
  "scheduleDate": "2024-01-25",
  "startTime": "10:00",
  "endTime": "18:00"
}
```

**Response**:
```json
{
  "success": true,
  "message": "Schedule updated successfully"
}
```

---

### DELETE `/api/users/schedules/:id`
Delete a doctor schedule

**Headers**:
- `Authorization: Bearer {token}`

**URL Parameters**:
- `id` - Schedule ID

**Example Request**:
```
DELETE http://localhost:5000/api/users/schedules/12
```

**Response**:
```json
{
  "success": true,
  "message": "Schedule deleted successfully"
}
```

---

### GET `/api/users/schedules/admin/all`
Get all doctor schedules (Admin)

**Headers**:
- `Authorization: Bearer {token}`

**Example Request**:
```
GET http://localhost:5000/api/users/schedules/admin/all
```

**Response**:
```json
{
  "success": true,
  "schedules": [
    {
      "id": 1,
      "doctor_id": 2,
      "schedule_date": "2024-01-15",
      "start_time": "09:00",
      "end_time": "17:00",
      "clinic": "Main Clinic",
      "is_available": true,
      "created_at": "2024-01-10T10:00:00Z",
      "updated_at": "2024-01-10T10:00:00Z"
    }
  ]
}
```

## Validation Rules

### Frontend Validation
✅ Cannot select past dates
✅ Doctor must be selected
✅ Date must be selected
✅ Time must be selected (for appointments)
✅ Start time must be before end time (for schedules)
✅ All required fields must be filled

### Backend Validation
✅ Date cannot be in the past
✅ Doctor ID is required and must exist
✅ Date format must be YYYY-MM-DD
✅ Time format must be HH:MM (24-hour)
✅ Cannot double-book same time slot
✅ JWT token must be valid and not expired

## Example Workflow

### Scenario: Patient books appointment with Dr. Smith

**Step 1: Patient selects doctor**
```
GET /api/users/doctors
→ Shows list of all doctors including Dr. Smith (ID: 2)
```

**Step 2: System fetches available dates**
```
GET /api/users/available-dates?doctorId=2
→ Returns ["2024-01-20", "2024-01-22", "2024-01-24"]
```

**Step 3: Patient selects date (2024-01-20)**
```
GET /api/users/available-times?doctorId=2&date=2024-01-20
→ Returns allSlots and availableSlots with booked slots filtered out
```

**Step 4: Patient selects time (10:00) and confirms**
```
POST /api/users/appointments
Body: {
  "doctorId": 2,
  "appointmentDate": "2024-01-20",
  "appointmentTime": "10:00",
  "notes": "Regular checkup"
}
→ Appointment booked successfully!
```

**Result**: 10:00 slot now shows in bookedSlots for future queries

## Troubleshooting

### Issue: "No available dates" message
**Cause**: No schedules created for that doctor
**Solution**: Admin needs to add schedule via ManageSchedule component

### Issue: Certain times are unavailable (grayed out)
**Cause**: Already booked by another patient
**Solution**: Select different time slot or date

### Issue: Cannot select past date
**Cause**: Date validation prevents past dates
**Solution**: Select a future date (today or later)

### Issue: 401 Unauthorized error
**Cause**: Missing or invalid JWT token
**Solution**: Login again to refresh token

### Issue: 404 Not Found error
**Cause**: Wrong endpoint or doctor doesn't exist
**Solution**: Verify doctor ID and endpoint URL

## Development Notes

### Time Slot Generation
- Generates 30-minute intervals automatically
- Example: 09:00 - 17:00 generates [09:00, 09:30, 10:00, ..., 17:00]
- Handles hour boundaries automatically (no gap between 09:59 and 10:00)

### Date Format
- Frontend display: DD/MM/YYYY (e.g., "15/01/2024")
- API format: YYYY-MM-DD (e.g., "2024-01-15")
- Conversion happens automatically in components

### Real-Time Updates
- Booked slots immediately unavailable to other users
- Admin changes reflected immediately for new bookings
- No page refresh needed for UI updates

### Authentication
- Uses JWT token stored in localStorage
- Token automatically included in Authorization header
- 7-day token expiry

## Files Modified/Created

### New Files
- `frontend/src/pages/BookAppointment.jsx`
- `frontend/src/pages/Admin/ManageSchedule.jsx`
- `APPOINTMENT_BOOKING_SYSTEM.md` (this file)

### Modified Files
- `frontend/src/App.jsx` - Added routes
- `frontend/src/pages/Dashboard.jsx` - Updated navigation buttons
- `backend/controllers/scheduleController.js` - Added 3 new functions
- `backend/Routes/User/userRoute.js` - Added 2 new routes

## Next Steps (Optional Features)

1. **Email Notifications** - Send confirmation emails
2. **Appointment Reminders** - SMS/Email 24 hours before
3. **Cancellation Feature** - Allow users to cancel appointments
4. **Recurring Schedules** - Set recurring doctor availability
5. **Rating System** - Patients can rate appointments
6. **Calendar View** - Visual calendar with highlighted dates
7. **Timezone Support** - Handle different timezones
8. **Business Hours** - Sync with doctor's contact info hours
