# Sequelize Quick Reference

## Import Models

```javascript
const { User, Doctor, DoctorSchedule, Appointment } = require('../models');
const { Op } = require('sequelize');
```

## User Operations

### Register New User
```javascript
const user = await User.create({
  fullName: 'John Doe',
  email: 'john@example.com',
  password: hashedPassword,
  phoneNumber: '1234567890',
  birthDate: new Date('1990-01-01'),
  verificationCode: code,
  verificationCodeExpiry: expiry,
  isVerified: false,
});
```

### Login User
```javascript
const user = await User.findOne({ where: { email } });
if (!user) return res.status(401).json({ message: 'Invalid credentials' });

const passwordMatch = await bcrypt.compare(password, user.password);
if (!passwordMatch) return res.status(401).json({ message: 'Invalid credentials' });
```

### Update User Profile
```javascript
const user = await User.findByPk(userId);
await user.update({
  fullName: 'New Name',
  phoneNumber: '9876543210',
  profilePicture: 'url',
  specialization: 'Cardiology',
});
```

### Verify Email
```javascript
const user = await User.findOne({ where: { email } });
if (user.verificationCode !== code) {
  return res.status(400).json({ message: 'Invalid code' });
}
await user.update({
  isVerified: true,
  verificationCode: null,
  verificationCodeExpiry: null,
});
```

## Doctor Operations

### Get All Doctors
```javascript
const doctors = await Doctor.findAll({
  order: [['name', 'ASC']],
});
```

### Get Doctor by Specialty
```javascript
const doctors = await Doctor.findAll({
  where: { specialty: 'Cardiology' },
  order: [['name', 'ASC']],
});
```

### Create Doctor
```javascript
const doctor = await Doctor.create({
  name: 'Dr. Smith',
  specialty: 'Cardiology',
  experience: 10,
  fee: 500,
  availability: 'Mon-Fri',
  timing: '9 AM - 5 PM',
  photo: 'url',
});
```

### Update Doctor
```javascript
const doctor = await Doctor.findByPk(doctorId);
await doctor.update({
  name: 'Dr. New Name',
  fee: 600,
});
```

### Delete Doctor
```javascript
const doctor = await Doctor.findByPk(doctorId);
await doctor.destroy(); // Cascade deletes related appointments
```

## Schedule Operations

### Get Doctor Schedule for Month
```javascript
const { Op } = require('sequelize');
const schedules = await DoctorSchedule.findAll({
  where: {
    doctorId,
    [Op.and]: [
      sequelize.where(sequelize.fn('EXTRACT', sequelize.literal('MONTH FROM "scheduleDate"')), Op.eq, month),
      sequelize.where(sequelize.fn('EXTRACT', sequelize.literal('YEAR FROM "scheduleDate"')), Op.eq, year),
    ],
  },
  order: [['scheduleDate', 'ASC'], ['startTime', 'ASC']],
});
```

### Get Available Slots for Date
```javascript
const slots = await DoctorSchedule.findAll({
  where: {
    doctorId,
    scheduleDate: '2024-01-20',
    isAvailable: true,
  },
  order: [['startTime', 'ASC']],
});
```

### Create Schedule
```javascript
const schedule = await DoctorSchedule.create({
  doctorId: 1,
  scheduleDate: '2024-01-20',
  startTime: '09:00:00',
  endTime: '10:00:00',
  clinic: 'Clinic 1',
  isAvailable: true,
});
```

### Update Schedule
```javascript
const schedule = await DoctorSchedule.findByPk(scheduleId);
await schedule.update({
  isAvailable: false,
});
```

### Delete Schedule
```javascript
const schedule = await DoctorSchedule.findByPk(scheduleId);
await schedule.destroy(); // Cascades to related appointments
```

## Appointment Operations

### Book Appointment
```javascript
const appointment = await Appointment.create({
  userId: 1,
  doctorId: 2,
  scheduleId: 3,
  appointmentDate: '2024-01-20',
  startTime: '09:00:00',
  clinic: 'Clinic 1',
  status: 'booked',
});
```

### Get User Appointments
```javascript
const appointments = await Appointment.findAll({
  where: { userId },
  include: [{
    model: Doctor,
    attributes: ['id', 'name', 'specialty', 'fee'],
  }],
  order: [['appointmentDate', 'ASC'], ['startTime', 'ASC']],
});
```

### Get Doctor Appointments
```javascript
const appointments = await Appointment.findAll({
  where: { doctorId },
  include: [{
    model: User,
    attributes: ['id', 'fullName', 'email', 'phoneNumber'],
  }],
  order: [['appointmentDate', 'ASC']],
});
```

### Update Appointment Status
```javascript
const appointment = await Appointment.findByPk(appointmentId);
await appointment.update({
  status: 'completed', // or 'cancelled'
});
```

### Cancel Appointment
```javascript
const appointment = await Appointment.findByPk(appointmentId);
await appointment.update({
  status: 'cancelled',
});
```

## Advanced Queries

### Get Appointments with Doctor Details
```javascript
const appointments = await Appointment.findAll({
  where: { userId },
  include: [{
    model: Doctor,
    include: [{
      model: DoctorSchedule,
    }],
  }],
});
```

### Get Doctor with Schedules
```javascript
const doctor = await Doctor.findByPk(doctorId, {
  include: [{
    model: DoctorSchedule,
    where: { isAvailable: true },
  }],
});
```

### Count Appointments
```javascript
const totalAppointments = await Appointment.count({
  where: { userId },
});

const completedAppointments = await Appointment.count({
  where: {
    userId,
    status: 'completed',
  },
});
```

### Pagination
```javascript
const limit = 10;
const offset = (page - 1) * limit;

const { count, rows } = await Appointment.findAndCountAll({
  where: { userId },
  limit,
  offset,
  order: [['appointmentDate', 'DESC']],
});

res.json({
  total: count,
  page,
  totalPages: Math.ceil(count / limit),
  appointments: rows,
});
```

### Search and Filter
```javascript
const { Op } = require('sequelize');

const doctors = await Doctor.findAll({
  where: {
    [Op.or]: [
      { name: { [Op.iLike]: `%${search}%` } },
      { specialty: { [Op.iLike]: `%${search}%` } },
    ],
    experience: { [Op.gte]: minExperience },
    fee: { [Op.lte]: maxFee },
  },
});
```

## Error Handling

```javascript
try {
  const user = await User.create({ email, password });
} catch (err) {
  if (err.name === 'SequelizeUniqueConstraintError') {
    return res.status(400).json({ message: 'Email already exists' });
  }
  if (err.name === 'SequelizeValidationError') {
    return res.status(400).json({ message: err.errors[0].message });
  }
  console.error(err);
  res.status(500).json({ message: 'Server error' });
}
```

## Performance Tips

### Use Attributes to Select Columns
```javascript
const users = await User.findAll({
  attributes: ['id', 'fullName', 'email'], // Only these columns
});
```

### Exclude Sensitive Data
```javascript
const users = await User.findAll({
  attributes: { exclude: ['password', 'verificationCode'] },
});
```

### Lazy vs Eager Loading
```javascript
// Lazy loading (N+1 problem - multiple queries)
const appointments = await Appointment.findAll();
for (let apt of appointments) {
  apt.doctor = await Doctor.findByPk(apt.doctorId); // Extra query each time
}

// Eager loading (Single query with join)
const appointments = await Appointment.findAll({
  include: [{ model: Doctor }], // One query with join
});
```

### Raw Queries (If Needed)
```javascript
const { sequelize } = require('../models');
const results = await sequelize.query('SELECT * FROM doctors WHERE specialty = ?', {
  replacements: ['Cardiology'],
  type: QueryTypes.SELECT,
});
```

## Testing Queries in Code

```javascript
// Enable logging to see SQL queries
const { sequelize } = require('../models');
sequelize.options.logging = console.log;

// Then run your query
const user = await User.findOne({ where: { email } });
// Will print the SQL query to console
```
