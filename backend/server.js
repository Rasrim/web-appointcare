const express = require('express');
const { Pool } = require('pg');
const dotenv = require('dotenv');
const cors = require('cors');
const userRoutes = require('./routes/userRoute');

dotenv.config();

const app = express();
app.use(express.json());
app.use(cors());

// PostgreSQL Connection Pool
const pool = new Pool({
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 5432,
  database: process.env.DB_NAME || 'appointcare',
});

// Make pool available to routes
app.locals.pool = pool;

// Routes
app.use('/api/auth', userRoutes);
app.use('/api/users', userRoutes);
app.use('/api', userRoutes); // Doctor routes

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'Server running', database: 'PostgreSQL' });
});

const PORT = process.env.PORT || 3000;

pool.connect((err, client, release) => {
  if (err) {
    console.error('PostgreSQL connection error:', err);
    process.exit(1);
  } else {
    console.log('PostgreSQL connected to AppointCare database');
    release();
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  }
});
