# Sequelize Migration Guide

## Summary

Your backend has been successfully migrated from raw PostgreSQL queries to **Sequelize**, a popular Node.js ORM (Object-Relational Mapping) framework.

## What Changed

### 1. **Installed Packages**
- `sequelize` - ORM for database operations
- `sequelize-cli` - CLI for Sequelize migrations and models
- `pg-hstore` - Required for storing JSON in PostgreSQL

### 2. **New Files Created**

#### Configuration
- **`backend/config/sequelize.js`** - Sequelize instance configuration

#### Models
- **`backend/models/User.js`** - User model
- **`backend/models/Doctor.js`** - Doctor model
- **`backend/models/DoctorSchedule.js`** - Doctor schedule model
- **`backend/models/Appointment.js`** - Appointment model
- **`backend/models/index.js`** - Model index with associations

### 3. **Updated Files**

#### Server
- **`backend/server.js`** - Changed to use Sequelize instead of raw PostgreSQL pool

#### Controllers
- **`backend/controllers/userController.js`** - All functions converted to use Sequelize models
- **`backend/controllers/doctorController.js`** - All functions converted to use Sequelize models
- **`backend/controllers/scheduleController.js`** - All functions converted to use Sequelize models

## Key Benefits of Sequelize

### Before (Raw SQL)
```javascript
const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
const user = result.rows[0];
```

### After (Sequelize)
```javascript
const user = await User.findOne({ where: { email } });
```

### Advantages:
- **Type Safety** - Models define schema structure
- **Automatic Relationships** - Foreign keys and associations handled automatically
- **Data Validation** - Built-in validators
- **Cleaner Code** - No string concatenation for queries
- **Security** - Built-in protection against SQL injection
- **Easy Migrations** - Database schema versioning
- **Better Error Handling** - Consistent error patterns

## Model Relationships

```
User
  ├── hasMany → Appointment
  
Doctor
  ├── hasMany → DoctorSchedule
  ├── hasMany → Appointment
  
DoctorSchedule
  ├── belongsTo → Doctor
  ├── hasMany → Appointment
  
Appointment
  ├── belongsTo → User
  ├── belongsTo → Doctor
  └── belongsTo → DoctorSchedule
```

## Common Sequelize Operations

### Find Operations
```javascript
// Find one
const user = await User.findOne({ where: { email } });
const user = await User.findByPk(id);

// Find all
const users = await User.findAll();
const users = await User.findAll({ where: { role: 'doctor' } });

// Count
const count = await User.count();
```

### Create Operation
```javascript
const user = await User.create({
  fullName,
  email,
  password,
  phoneNumber,
});
```

### Update Operation
```javascript
await user.update({
  fullName: 'New Name',
  email: 'newemail@test.com',
});
```

### Delete Operation
```javascript
await user.destroy();
```

## Query Operators

```javascript
const { Op } = require('sequelize');

// Comparisons
where: { age: { [Op.gt]: 18 } }  // >
where: { age: { [Op.gte]: 18 } } // >=
where: { age: { [Op.lt]: 65 } }  // <
where: { age: { [Op.lte]: 65 } } // <=
where: { age: { [Op.eq]: 30 } }  // =
where: { age: { [Op.ne]: 30 } }  // !=

// Ranges
where: { age: { [Op.between]: [18, 65] } }

// In Array
where: { status: { [Op.in]: ['active', 'pending'] } }

// Like (String search)
where: { name: { [Op.like]: '%john%' } }
```

## Common Patterns in Your Code

### Authentication (userController)
```javascript
// Find user
const user = await User.findOne({ where: { email } });

// Create user
const user = await User.create({
  fullName, email, password: hashedPassword, ...
});

// Update user
await user.update({
  isVerified: true,
  verificationCode: null,
});

// Date comparison
where: {
  resetPasswordExpiry: { [Op.gt]: new Date() }
}
```

### Appointment Management (scheduleController)
```javascript
// Get with associations
const appointments = await Appointment.findAll({
  where: { userId },
  include: [{ model: Doctor, attributes: ['id', 'name', 'specialty'] }],
  order: [['appointmentDate', 'ASC']],
});

// Create with foreign keys
const appointment = await Appointment.create({
  userId, doctorId, appointmentDate, startTime, ...
});
```

## Next Steps

### 1. **Generate Migrations** (Optional but recommended)
```bash
cd backend
npx sequelize-cli migration:generate --name add_new_column
```

### 2. **Test the Backend**
```bash
npm run dev
```

### 3. **Seeding Data** (Optional)
Create seed files to populate initial data:
```bash
npx sequelize-cli seed:generate --name demo-users
```

### 4. **Update Environment Variables**
Ensure your `.env` file has:
```
DB_USER=postgres
DB_PASSWORD=your_password
DB_HOST=localhost
DB_PORT=5432
DB_NAME=appointcare
```

## Troubleshooting

### Issue: "Cannot find module 'models'"
**Solution:** Make sure you're importing from the models index:
```javascript
const { User, Doctor } = require('../models');
```

### Issue: "Model not defined"
**Solution:** Check that associations are set up in `models/index.js`

### Issue: Foreign key constraint errors
**Solution:** Ensure you're using correct field names with camelCase (Sequelize converts to snake_case in DB)

## Database Schema Notes

- All models use `underscored: true` to convert camelCase to snake_case in PostgreSQL
- Timestamps are automatically managed (`createdAt`, `updatedAt`)
- Soft deletes are not enabled (records are permanently deleted)
- All foreign keys have cascade delete enabled

## Performance Tips

1. **Use `attributes`** to select only needed columns:
   ```javascript
   await User.findAll({ attributes: ['id', 'email', 'fullName'] });
   ```

2. **Use `eager loading`** to avoid N+1 queries:
   ```javascript
   await Appointment.findAll({
     include: [{ model: Doctor }]
   });
   ```

3. **Add database indexes** in migration files for frequently queried columns

## Migration from Raw SQL Complete!

Your backend is now using Sequelize ORM. All raw SQL queries have been replaced with model-based operations, making the code more maintainable, secure, and scalable.
