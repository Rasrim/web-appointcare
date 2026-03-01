const express = require('express');
const { Pool } = require('pg');
const dotenv = require('dotenv');
const cors = require('cors');
const userRoutes = require('./Routes/User/userRoute');

dotenv.config();

const app = express();

// Configure CORS
app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:3000', 'http://127.0.0.1:5173'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Increase payload limit to 50MB for image uploads
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// Serve static files from uploads directory
app.use('/uploads', express.static('uploads'));

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

module.exports = app;
