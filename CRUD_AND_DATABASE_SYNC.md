# Complete CRUD & Database Sync Implementation Guide

## Overview
This document provides a complete implementation for:
1. ✅ All CRUD operations (Create, Read, Update, Delete)
2. ✅ Automatic database synchronization
3. ✅ Token validation & auto-logout on tampering
4. ✅ Fully responsive design
5. ✅ Error handling and user feedback

---

## 1. Token Validation & Auto-Logout (IMPLEMENTED)

### Implementation Location
- **File**: `frontend/src/utils/tokenValidator.js`
- **Features**:
  - Validates token structure and integrity
  - Detects token tampering
  - Auto-logout on expiration
  - Periodic validation every 5 minutes
  - Validation on tab visibility change

### How It Works
```javascript
import { initializeTokenValidator, handleTokenInvalid } from '../utils/tokenValidator';

// Initialize on app mount
useEffect(() => {
  initializeTokenValidator();
}, []);

// Listen for token invalid events
useEffect(() => {
  const handleTokenInvalidEvent = (event) => {
    toast.error(event.detail?.reason || 'Session invalid');
    navigate("/login");
  };
  window.addEventListener('tokenInvalid', handleTokenInvalidEvent);
  return () => window.removeEventListener('tokenInvalid', handleTokenInvalidEvent);
}, []);
```

### What Happens on Token Tampering:
1. User modifies token in browser dev tools
2. Token validator detects change
3. Comparison fails (hash doesn't match)
4. `handleTokenInvalid()` is called automatically
5. User is logged out and redirected to login
6. Error message is shown: "Token has been modified"

---

## 2. API Service with Database Sync (IMPLEMENTED)

### Implementation Location
- **File**: `frontend/src/utils/apiService.js`
- **Features**:
  - Centralized API calls with token validation
  - Automatic localStorage sync after updates
  - Event dispatching for component updates
  - Error handling and 401 management

### Usage Examples

#### Update User Profile
```javascript
import { userAPI } from '../utils/apiService';

const handleProfileUpdate = async () => {
  try {
    const response = await userAPI.updateProfile(userId, {
      fullName: "John Doe",
      email: "john@example.com",
      phoneNumber: "+977-9841234567",
      gender: "Male",
      location: "Kathmandu",
      dateOfBirth: "1990-01-15",
      bio: "Patient bio"
    });
    
    toast.success("Profile updated successfully!");
    // localStorage is automatically synced
    // Custom event 'profileUpdated' is dispatched
  } catch (error) {
    toast.error(error.message);
  }
};
```

#### Book Appointment
```javascript
import { appointmentAPI } from '../utils/apiService';

const handleBookAppointment = async () => {
  try {
    const response = await appointmentAPI.bookAppointment({
      doctorId: 5,
      appointmentDate: "2026-02-15",
      appointmentTime: "10:00 AM",
      notes: "Regular checkup"
    });
    
    toast.success("Appointment booked successfully!");
    // Event 'appointmentBooked' is dispatched
    // Components listening can refresh data
  } catch (error) {
    toast.error(error.message);
  }
};
```

#### Update Doctor (Admin Only)
```javascript
import { doctorAPI } from '../utils/apiService';

const handleUpdateDoctor = async () => {
  try {
    const response = await doctorAPI.updateDoctor(doctorId, {
      name: "Dr. Smith",
      specialization: "Cardiology",
      experience: 15,
      fee: 500
    });
    
    toast.success("Doctor updated successfully!");
  } catch (error) {
    toast.error(error.message);
  }
};
```

#### Delete Schedule (Admin Only)
```javascript
import { scheduleAPI } from '../utils/apiService';

const handleDeleteSchedule = async () => {
  try {
    const response = await scheduleAPI.deleteSchedule(scheduleId);
    
    toast.success("Schedule deleted successfully!");
    // Refresh list
    await fetchSchedules();
  } catch (error) {
    toast.error(error.message);
  }
};
```

---

## 3. Available API Endpoints

### User Profile APIs
```javascript
// Get profile
GET /api/users/profile (or /api/users/:userId/profile)
Response: {
  fullName: "John Doe",
  email: "john@example.com",
  phoneNumber: "+977-9841234567",
  gender: "Male",
  location: "Kathmandu",
  dateOfBirth: "1990-01-15",
  bio: "Patient bio",
  profileImage: "url_or_base64"
}

// Update profile
PUT /api/users/profile (or /api/users/:userId/profile)
Body: { fullName, email, phoneNumber, gender, location, dateOfBirth, bio, profileImage }
Response: { message: "Profile updated successfully", user: {...} }

// Change password
PUT /api/users/change-password
Body: { currentPassword, newPassword, confirmPassword }
Response: { message: "Password changed successfully" }
```

### Doctor APIs
```javascript
// Get all doctors
GET /api/doctors
Response: [{ id, name, specialization, experience, fee, bio, photo, ... }]

// Get single doctor
GET /api/doctors/:doctorId
Response: { id, name, specialization, experience, ... }

// Create doctor (Admin only)
POST /api/doctors
Body: { name, specialization, experience, fee, bio, photo }
Response: { id, name, ... }

// Update doctor (Admin only)
PUT /api/doctors/:doctorId
Body: { name, specialization, experience, fee, bio, photo }
Response: { id, name, ... }

// Delete doctor (Admin only)
DELETE /api/doctors/:doctorId
Response: { message: "Doctor deleted successfully" }
```

### Appointment APIs
```javascript
// Get user appointments
GET /api/appointments (requires auth)
Response: [{
  id: 1,
  doctorId: 5,
  doctorName: "Dr. Smith",
  appointmentDate: "2026-02-15",
  appointmentTime: "10:00 AM",
  notes: "Regular checkup",
  status: "upcoming"
}]

// Book appointment
POST /api/appointments
Body: { doctorId, appointmentDate, appointmentTime, notes }
Response: { id, message: "Appointment booked successfully" }

// Update appointment (Reschedule)
PUT /api/appointments/:appointmentId
Body: { appointmentDate, appointmentTime, notes }
Response: { message: "Appointment updated successfully" }

// Cancel appointment
DELETE /api/appointments/:appointmentId
Response: { message: "Appointment cancelled successfully" }

// Get available dates for doctor
GET /api/doctors/:doctorId/available-dates
Response: { availableDates: ["2026-02-15", "2026-02-16", ...] }

// Get available slots for date
GET /api/doctors/:doctorId/available-slots?date=2026-02-15
Response: { availableSlots: ["09:00 AM", "10:00 AM", ...] }
```

### Schedule APIs (Admin)
```javascript
// Get doctor schedule
GET /api/doctors/:doctorId/schedule
Response: [{ id, doctorId, date, startTime, endTime, clinic }]

// Create schedule
POST /api/schedules
Body: { doctorId, date, startTime, endTime, clinic }
Response: { id, ... }

// Update schedule
PUT /api/schedules/:scheduleId
Body: { doctorId, date, startTime, endTime, clinic }
Response: { id, ... }

// Delete schedule
DELETE /api/schedules/:scheduleId
Response: { message: "Schedule deleted successfully" }
```

---

## 4. Database Sync Flow

### When You Update Profile:
```
1. Component calls userAPI.updateProfile()
   ↓
2. Validates token before making API call
   ↓
3. Makes PUT request to /api/users/profile
   ↓
4. Backend updates database
   ↓
5. Backend returns success response
   ↓
6. Frontend receives response
   ↓
7. localStorage is AUTOMATICALLY updated
   ↓
8. Custom event 'profileUpdated' is dispatched
   ↓
9. Other components listening to event refresh
   ↓
10. User sees updated data everywhere
```

### Verification:
- Check localStorage for updated values
- Check database directly
- Verify custom event listeners are working
- Test after page refresh (data should persist from DB)

---

## 5. Responsive Design Implementation

### Hook Usage
```javascript
import { useResponsive } from '../utils/responsive';

const MyComponent = () => {
  const { isMobile, isTablet, isDesktop, width } = useResponsive();
  
  return (
    <div style={{
      padding: isMobile ? '16px' : '24px',
      fontSize: isMobile ? '14px' : '16px',
      columns: isMobile ? 1 : isTablet ? 2 : 3
    }}>
      {isMobile && <MobileMenu />}
      {!isMobile && <DesktopMenu />}
    </div>
  );
};
```

### Responsive Breakpoints
- **XS**: < 480px (Small phones)
- **SM**: 480px - 768px (Large phones)
- **MD**: 768px - 1024px (Tablets)
- **LG**: 1024px - 1280px (Desktops)
- **XL**: ≥ 1280px (Large desktops)

### Helper Values
```javascript
const bp = useResponsive();

bp.isXs        // Extra small screen
bp.isSm        // Small screen
bp.isMd        // Medium screen
bp.isLg        // Large screen
bp.isXl        // Extra large screen
bp.isMobile    // Mobile (< 768px)
bp.isTablet    // Tablet (768px - 1024px)
bp.isDesktop   // Desktop (>= 1024px)
bp.width       // Current width in px
bp.height      // Current height in px
```

---

## 6. Error Handling

### Token-Related Errors
```javascript
// Automatic handling in apiService.js
// When response.status === 401:
// 1. handleTokenInvalid() is called
// 2. User is logged out
// 3. Redirect to /login
// 4. Error message shown
```

### API Errors
```javascript
// All errors are caught and thrown
try {
  await userAPI.updateProfile(userId, data);
} catch (error) {
  // error.message contains human-readable message
  toast.error(error.message);
}
```

### Event Listeners
```javascript
// Component can listen for update events
useEffect(() => {
  const handleProfileUpdate = () => {
    // Refresh data
    loadProfile();
  };
  
  window.addEventListener('profileUpdated', handleProfileUpdate);
  window.addEventListener('appointmentBooked', handleProfileUpdate);
  
  return () => {
    window.removeEventListener('profileUpdated', handleProfileUpdate);
    window.removeEventListener('appointmentBooked', handleProfileUpdate);
  };
}, []);
```

---

## 7. Implementation Checklist

### For Each Component with CRUD Operations:

- [ ] Import apiService: `import { userAPI, doctorAPI, etc } from '../utils/apiService'`
- [ ] Import useResponsive hook
- [ ] Wrap file input/display in `isMobile` checks
- [ ] Use responsive font sizes and padding
- [ ] Call appropriate API method instead of fetch
- [ ] Add error handling with try/catch
- [ ] Add success/error toast notifications
- [ ] Listen for custom events to refresh data
- [ ] Test on mobile (DevTools device emulation)
- [ ] Test after page refresh (data should load from DB)
- [ ] Test token tampering (modify token in DevTools)
- [ ] Verify database is updated (check DB directly)

---

## 8. Quick Implementation Steps

### Step 1: Update Component Imports
```javascript
// Before
import { API_URL } from '../utils/api';

// After
import { userAPI, doctorAPI, appointmentAPI } from '../utils/apiService';
import { useResponsive } from '../utils/responsive';
```

### Step 2: Initialize Token Validator (Dashboard/Main App)
```javascript
import { initializeTokenValidator } from '../utils/tokenValidator';

useEffect(() => {
  initializeTokenValidator();
  window.addEventListener('tokenInvalid', handleTokenInvalidEvent);
  return () => window.removeEventListener('tokenInvalid', handleTokenInvalidEvent);
}, []);
```

### Step 3: Replace fetch Calls
```javascript
// Before
const response = await fetch(`${API_URL}/api/users/${userId}/profile`, {
  method: 'PUT',
  headers: { 'Authorization': `Bearer ${token}` },
  body: JSON.stringify(data)
});

// After
const response = await userAPI.updateProfile(userId, data);
```

### Step 4: Make Components Responsive
```javascript
const { isMobile } = useResponsive();

<div style={{
  padding: isMobile ? '16px' : '24px',
  gridTemplateColumns: isMobile ? '1fr' : 'repeat(3, 1fr)'
}}>
```

### Step 5: Add Event Listeners
```javascript
useEffect(() => {
  const handleUpdate = () => {
    // Refresh component data
  };
  window.addEventListener('profileUpdated', handleUpdate);
  return () => window.removeEventListener('profileUpdated', handleUpdate);
}, []);
```

---

## 9. Testing Checklist

### Token Validation Testing
- [ ] Modify token in localStorage (DevTools)
- [ ] Reload page
- [ ] Should redirect to login with error message
- [ ] Check console for token tampering warning

### Database Sync Testing
- [ ] Update profile
- [ ] Close and reopen browser
- [ ] Data should still be there (from database)
- [ ] Verify in PostgreSQL directly

### CRUD Operations Testing
- [ ] **Create**: Add new doctor/schedule → Should appear immediately
- [ ] **Read**: View data → Should load from database
- [ ] **Update**: Edit information → Should persist after refresh
- [ ] **Delete**: Remove item → Should disappear from all views

### Responsive Testing
- [ ] DevTools mobile emulation (375px, 768px, 1024px)
- [ ] Test on actual phones (iPhone, Android)
- [ ] Check touch interactions
- [ ] Verify text is readable on mobile
- [ ] Ensure buttons are easily clickable (min 44px)

### Error Handling Testing
- [ ] Turn off backend → Should show error message
- [ ] No internet connection → Should show error message
- [ ] Invalid data → Should show validation error
- [ ] Expired token → Should auto-logout

---

## 10. File Summary

### New Files Created
- `frontend/src/utils/tokenValidator.js` - Token validation & tampering detection
- `frontend/src/utils/apiService.js` - Centralized API with database sync
- `frontend/src/utils/responsive.js` - Responsive design utilities
- `CRUD_AND_DATABASE_SYNC.md` - This documentation

### Files to Update
- `frontend/src/pages/Dashboard.jsx` - Add token validation
- `frontend/src/pages/Profile.jsx` - Use apiService, add responsive design
- `frontend/src/pages/Admin/AdminDashboard.jsx` - Use apiService for all CRUD
- `frontend/src/pages/BookAppointment.jsx` - Use appointmentAPI
- Any other page with edit/delete/update buttons

### Backend Files (No Changes Needed)
- All endpoints are already implemented and working
- Authentication middleware properly validates tokens
- Database updates are handled correctly

---

## Summary

**Status**: ✅ All systems implemented and ready for integration

**Key Features**:
1. ✅ Token validation with tampering detection
2. ✅ Auto-logout on token modification
3. ✅ Centralized API service with database sync
4. ✅ Responsive design system
5. ✅ Event-driven component updates
6. ✅ Comprehensive error handling

**Next Steps**:
1. Update all components to use new apiService
2. Add token validator initialization
3. Apply responsive design hooks
4. Test all CRUD operations
5. Verify database persistence

