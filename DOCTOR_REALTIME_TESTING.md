## Doctor Real-Time Update Testing Guide

### Setup
1. Start the backend server: `npm start` (in backend folder)
2. Start the frontend dev server: `npm run dev` (in frontend folder)
3. Open two browser windows/tabs

### Pre-Test Checklist
- [ ] Backend is running on http://localhost:3000
- [ ] Frontend is running on http://localhost:5173 (or similar)
- [ ] Admin is logged in (email: admin1245@gmail.com)
- [ ] No errors in browser console

---

## Test 1: Real-Time Doctor Creation

**Objective**: Verify that when a doctor is created in admin panel, it appears on home page without refresh

**Steps**:
1. **Tab A - User Side**:
   - Navigate to http://localhost:5173/ (Home page as logged-in user)
   - Note the current list of doctors shown in "Recommended Doctors" section
   - DO NOT REFRESH

2. **Tab B - Admin Side**:
   - Navigate to http://localhost:5173/admin (Admin Dashboard)
   - Scroll to "Doctors Management" section
   - Click "Add Doctor" button
   - Fill in form:
     - Name: `Dr. Test Create`
     - Specialty: `Cardiologist`
     - Experience: `5`
     - Fee: `500`
   - Click "Submit" button
   - Wait for success message: "Doctor added successfully!"

3. **Back to Tab A**:
   - Look at "Recommended Doctors" section
   - You should see "Dr. Test Create" with "Cardiologist" in the list
   - **This should happen WITHOUT you refreshing the page**

**Expected Result**: ✅ New doctor appears in Tab A within 1-2 seconds

**What's Happening**:
```
Tab B: Doctor created → API call → Database updated
       → broadcastDoctorCreated() sent
       ↓
Tab A: Receives broadcast
       → fetchDoctors() called automatically
       → Doctor list updated in state
       → Component re-renders → New doctor visible
```

---

## Test 2: Real-Time Doctor Update

**Objective**: Verify that when a doctor is edited, changes appear on all patients' screens

**Steps**:
1. **Tab A - Dashboard**:
   - Navigate to http://localhost:5173/dashboard
   - Find a doctor card (e.g., "Arpana Thapa Chettri" - Ophthalmologist)
   - Note their current fee (e.g., ₹150.00)
   - DO NOT REFRESH

2. **Tab B - Admin**:
   - Go to http://localhost:5173/admin
   - Find the same doctor in "Doctors Management"
   - Click "Edit" button
   - Change Fee to `250`
   - Click "Update" button
   - Wait for success message: "Doctor updated successfully!"

3. **Back to Tab A**:
   - The doctor card fee should change from `₹150.00` to `₹250.00`
   - **WITHOUT page refresh**

**Expected Result**: ✅ Doctor fee updates in Tab A within 1-2 seconds

**Verification Commands** (in browser console Tab A):
```javascript
// You should see the doctor list was refetched
document.querySelectorAll('[style*="doctorCard"]')  // All doctor cards
// Check a specific doctor's fee is updated
```

---

## Test 3: Real-Time Doctor Deletion

**Objective**: Verify that deleted doctors disappear from all pages

**Steps**:
1. **Tab A - Doctors List**:
   - Navigate to http://localhost:5173/all-doctors
   - Search for or scroll to find "Dr. Test Create" (from Test 1)
   - Note that it's in the list
   - DO NOT REFRESH

2. **Tab B - Admin**:
   - Go to http://localhost:5173/admin
   - Find "Dr. Test Create" or any doctor you want to delete
   - Click "Delete" button
   - Confirm deletion: Click "Yes" in confirmation modal
   - Wait for success message: "Doctor deleted successfully!"

3. **Back to Tab A**:
   - The doctor should disappear from the list
   - Count of doctors should decrease by 1
   - **WITHOUT page refresh**

**Expected Result**: ✅ Doctor disappears from Tab A's list within 1-2 seconds

---

## Test 4: Cross-Tab Synchronization

**Objective**: Verify BroadcastChannel is working for real-time cross-tab sync

**Steps**:
1. **Three Tabs Setup**:
   - Tab A: http://localhost:5173/ (Home)
   - Tab B: http://localhost:5173/dashboard (Dashboard)
   - Tab C: http://localhost:5173/admin (Admin)

2. **Check BroadcastChannel Support**:
   - Open browser console in any tab
   - Type: `console.log(typeof BroadcastChannel)`
   - Expected output: `"function"` (supported) or `"undefined"` (not supported, will use localStorage fallback)

3. **Perform Test**:
   - In Tab C (Admin): Create a new doctor "Dr. CrossTab"
   - **Immediately check** Tab A and Tab B
   - New doctor should appear in both without refresh
   - If using localStorage fallback, switch between tabs for them to update

**Expected Result**: 
- ✅ BroadcastChannel: Updates appear in ~100-500ms
- ✅ localStorage fallback: Updates appear within 2-3 seconds
- Either way: **No page refresh needed**

---

## Test 5: Doctor Detail Page Sync

**Objective**: Verify that doctor detail pages update when doctor info changes

**Steps**:
1. **Tab A - Doctor Details**:
   - Go to http://localhost:5173/all-doctors
   - Click on any doctor (e.g., "Arpana Thapa Chettri")
   - This opens the doctor detail page
   - Note the doctor's bio and specialty
   - DO NOT GO BACK

2. **Tab B - Admin Edit**:
   - Go to admin panel
   - Find and edit the same doctor
   - Change their bio or specialty
   - Click "Update"

3. **Back to Tab A**:
   - The detail page should refresh automatically
   - New bio/specialty should be visible
   - **WITHOUT clicking back or refreshing**

**Expected Result**: ✅ Doctor detail page updates in real-time

---

## Test 6: Multiple Rapid Changes

**Objective**: Verify system handles multiple quick updates

**Steps**:
1. **Tab A - Home Page**:
   - Navigate to home page
   - DO NOT REFRESH

2. **Tab B - Admin Panel**:
   - Make 3 rapid doctor edits (10 seconds apart):
     1. Edit Doctor A - change fee
     2. Edit Doctor B - change specialty
     3. Edit Doctor C - change experience
   
3. **Back to Tab A**:
   - All three changes should be visible
   - UI should remain responsive

**Expected Result**: ✅ All three doctors updated, UI responsive

---

## Test 7: Browser Console Verification

**Objective**: Monitor events in browser console

**Steps**:
1. Open browser developer tools (F12)
2. Go to Console tab
3. Run this code:
```javascript
// Import and test notification service
import doctorNotificationService from './utils/doctorNotificationService.js';

// Subscribe and log events
doctorNotificationService.subscribe((event) => {
  console.log('📨 Doctor Update Event:', event);
  console.log(`  Type: ${event.type}`);
  console.log(`  Timestamp: ${event.timestamp}`);
  if (event.doctor) console.log(`  Doctor: ${event.doctor.name}`);
  if (event.doctorId) console.log(`  Doctor ID Deleted: ${event.doctorId}`);
});

console.log('✅ Listening for doctor updates...');
```

4. Perform an edit/create/delete in admin panel
5. Check console output

**Expected Output**:
```
✅ Listening for doctor updates...
📨 Doctor Update Event: Object
  Type: DOCTOR_UPDATED
  Timestamp: 2026-02-06T10:30:15.123Z
  Doctor: Dr. Updated Name
```

---

## Test 8: Network Activity Check

**Objective**: Verify API calls are being made

**Steps**:
1. Open DevTools → Network tab
2. Go to home page
3. Go to admin panel and edit a doctor
4. Go back to home page (or check Network tab)
5. Filter by "XHR" (XmlHttpRequest)
6. You should see: `GET /api/doctors` call

**Expected**: ✅ One `GET /api/doctors` API call made after doctor edit

---

## Test 9: Single Tab (No Cross-Tab)

**Objective**: Verify it works within a single tab (localStorage fallback)

**Steps**:
1. Open ONE tab with home page
2. Open admin in second window (not tab)
3. Edit a doctor
4. Go back to first window/tab
5. Refresh manually or navigate within same window

**Expected Result**: 
- ✅ Changes are visible after navigation
- ✅ Works as fallback when BroadcastChannel unavailable

---

## Troubleshooting Failed Tests

### Issue: Changes don't appear
**Diagnostics**:
```javascript
// Check 1: Is notification service available?
console.log(window.doctorNotificationService)

// Check 2: Are subscriptions working?
console.log(document.querySelectorAll('*'))  // Check if component mounted

// Check 3: Check localStorage for events
console.log(localStorage.getItem('doctor_update_event'))

// Check 4: API call working?
fetch('http://localhost:3000/api/doctors')
  .then(r => r.json())
  .then(console.log)  // Should show latest doctors
```

**Solutions**:
1. Check browser console for errors (F12 → Console)
2. Check if backend is running (http://localhost:3000/api/doctors)
3. Make sure you're on same localhost origin
4. Clear browser cache (Ctrl+Shift+Del)
5. Restart frontend dev server

### Issue: Too many API calls
**This is normal**. Each component calling fetchDoctors is expected.

### Issue: Cross-tab updates not working
1. Try Test 7 (console verification)
2. Check if BroadcastChannel is supported
3. Try localStorage fallback manually
4. Check browser compatibility

---

## Pass/Fail Verdict

| Test | Status | Notes |
|------|--------|-------|
| Test 1: Creation | ✅/❌ | |
| Test 2: Update | ✅/❌ | |
| Test 3: Deletion | ✅/❌ | |
| Test 4: Cross-Tab | ✅/❌ | |
| Test 5: Detail Page | ✅/❌ | |
| Test 6: Multiple Changes | ✅/❌ | |
| Test 7: Console Logs | ✅/❌ | |
| Test 8: Network | ✅/❌ | |
| Test 9: Single Tab | ✅/❌ | |

**Overall Result**: 
- ✅ **PASS** if 7+ tests pass
- ⚠️ **PARTIAL** if 4-6 tests pass
- ❌ **FAIL** if 3 or fewer pass

---

## Video Demo Script

**For recording/demo purposes**:

1. Start with home page (recommended doctors visible)
2. Open admin in another window
3. Say: "Let's add a new doctor..."
4. Add doctor with name "Dr. Live Demo"
5. Back to home page → "See? It's here without refresh!"
6. Back to admin → Edit doctor fee
7. Back to home → "Fee updated instantly!"
8. Back to admin → Delete doctor
9. Back to home → "Doctor removed without refresh!"

---

## Notes

- **Timestamp**: All events include `timestamp` for debugging
- **Event Types**: DOCTOR_CREATED, DOCTOR_UPDATED, DOCTOR_DELETED, DOCTOR_LIST_REFRESH
- **Backward Compatible**: Works even if some components aren't updated yet
- **No Breaking Changes**: Doesn't interfere with existing functionality
