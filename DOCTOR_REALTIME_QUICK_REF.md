# Doctor Real-Time Update - Quick Reference

## For Developers Adding This to New Components

### Step 1: Import the Hook
```jsx
import useDoctorSync from '../hooks/useDoctorSync';
```

### Step 2: Create Your Fetch Function
```jsx
const fetchDoctors = async () => {
  try {
    const response = await fetch(`${API_URL}/api/doctors`);
    if (response.ok) {
      const data = await response.json();
      setDoctors(data);
    }
  } catch (err) {
    console.error('Error fetching doctors:', err);
  }
};
```

### Step 3: Add the Sync Hook
```jsx
useEffect(() => {
  fetchDoctors();
}, [dependencies]);

// Add this line - that's it!
useDoctorSync(fetchDoctors);
```

## For Admins Broadcasting Changes

### Creating Doctor
```jsx
const response = await fetch(`${API_URL}/api/doctors`, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(doctorForm),
});

if (response.ok) {
  const data = await response.json();
  doctorNotificationService.broadcastDoctorCreated(data.doctor);
}
```

### Updating Doctor
```jsx
const response = await fetch(`${API_URL}/api/doctors/${doctorId}`, {
  method: 'PUT',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(updates),
});

if (response.ok) {
  const data = await response.json();
  doctorNotificationService.broadcastDoctorUpdated(data.doctor);
}
```

### Deleting Doctor
```jsx
const response = await fetch(`${API_URL}/api/doctors/${doctorId}`, {
  method: 'DELETE',
});

if (response.ok) {
  doctorNotificationService.broadcastDoctorDeleted(doctorId);
}
```

## File Locations

```
frontend/src/
├── utils/
│   └── doctorNotificationService.js    ← The broadcast service
├── hooks/
│   └── useDoctorSync.js               ← The React hook
└── pages/
    ├── Admin/
    │   └── AdminDashboard.jsx         ← Uses broadcasts
    ├── private/
    │   └── Home.jsx                   ← Uses hook
    ├── Dashboard.jsx                  ← Uses hook
    ├── AllDoctors.jsx                 ← Uses hook
    ├── BookAppointment.jsx            ← Uses hook
    └── DoctorDetail.jsx               ← Uses listener
```

## Event Structure

```javascript
{
  type: 'DOCTOR_CREATED|DOCTOR_UPDATED|DOCTOR_DELETED|DOCTOR_LIST_REFRESH',
  doctor: {...},        // Only for CREATED/UPDATED
  doctorId: number,     // Only for DELETED
  timestamp: 'ISO-8601' // Always present
}
```

## Browser Compatibility

| Browser | Supported | Method |
|---------|-----------|--------|
| Chrome 50+ | ✅ | BroadcastChannel |
| Firefox 55+ | ✅ | BroadcastChannel |
| Safari 15.1+ | ✅ | BroadcastChannel |
| Edge 79+ | ✅ | BroadcastChannel |
| Older browsers | ✅ | localStorage fallback |

## Testing Quick Commands

```javascript
// In browser console:

// 1. Check service availability
console.log('Service:', doctorNotificationService)

// 2. Subscribe and watch events
doctorNotificationService.subscribe(e => console.log('Event:', e))

// 3. Manual broadcast (for testing)
doctorNotificationService.broadcastDoctorListRefresh()

// 4. Check BroadcastChannel support
console.log('BroadcastChannel:', typeof BroadcastChannel)
```

## Common Issues

| Issue | Solution |
|-------|----------|
| "Module not found: useDoctorSync" | Check hook path in import statement |
| Changes not appearing | Clear browser cache, restart dev server |
| Too many API calls | Normal behavior, each component refetches |
| Cross-tab not working | Use BroadcastChannel (check browser support) |
| Single tab not syncing | Use localStorage fallback or manual refresh |

## Extending to Other Entities

To add this to Appointments, Schedules, etc.:

1. **Create notification service** (copy pattern from `doctorNotificationService.js`)
2. **Create custom hook** (copy pattern from `useDoctorSync.js`)
3. **Add broadcasts** in admin operations
4. **Add hook calls** in components that use the entity
5. **Update event types** as needed

Example:
```javascript
// appointmentNotificationService.js
class AppointmentNotificationService {
  broadcastAppointmentCreated(appointment) {
    this.broadcast({
      type: 'APPOINTMENT_CREATED',
      appointment,
      timestamp: new Date().toISOString()
    })
  }
  // ... similar for update, delete
}
```

## Performance Tips

1. **Debounce updates** if too many changes happen rapidly
2. **Use React.memo** on doctor cards to prevent unnecessary re-renders
3. **Cache doctor data** using React Query or SWR for better performance
4. **Batch multiple operations** before broadcasting
5. **Consider WebSocket** for real-time updates if scaling beyond 100s of users

## Debugging

Enable detailed logging:
```javascript
// Add to doctorNotificationService.js
const DEBUG = true;

broadcast(event) {
  if (DEBUG) console.log('📡 Broadcasting:', event);
  // ... rest of code
}
```

## Migration Notes

- **No breaking changes** - works alongside existing code
- **Backward compatible** - old components still work
- **Gradual adoption** - add hook to components as you update them
- **Zero config** - works out of the box
