const { Pool } = require('pg');
const dotenv = require('dotenv');
const fs = require('fs');
const path = require('path');

dotenv.config();

const pool = new Pool({
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 5432,
  database: process.env.DB_NAME || 'appointcare',
});

async function initDatabase() {
  try {
    console.log('Initializing database...');

    // Read and execute doctors table migration
    const migrationPath = path.join(__dirname, '../migrations/001_create_doctors_table.sql');
    const migrationSQL = fs.readFileSync(migrationPath, 'utf-8');
    
    await pool.query(migrationSQL);
    console.log('✅ Doctors table created/verified');

    // Seed with sample doctors if table is empty
    const countResult = await pool.query('SELECT COUNT(*) FROM doctors');
    if (countResult.rows[0].count === '0') {
      console.log('Seeding sample doctors...');
      
      const sampleDoctors = [
        {
          name: 'Dr. Rajesh Kumar',
          specialty: 'Cardiologist',
          experience: 12,
          fee: 500,
          availability: 'Mon, Wed, Fri',
          timing: '10:00 AM-01:00 PM',
          photo: null
        },
        {
          name: 'Dr. Priya Sharma',
          specialty: 'Dermatologist',
          experience: 8,
          fee: 400,
          availability: 'Tue, Thu, Sat',
          timing: '02:00 PM-05:00 PM',
          photo: null
        },
        {
          name: 'Dr. Amit Patel',
          specialty: 'Orthopedic',
          experience: 15,
          fee: 600,
          availability: 'Mon, Wed, Fri',
          timing: '09:00 AM-12:00 PM',
          photo: null
        }
      ];

      for (const doctor of sampleDoctors) {
        await pool.query(
          'INSERT INTO doctors (name, specialty, experience, fee, availability, timing, photo) VALUES ($1, $2, $3, $4, $5, $6, $7)',
          [doctor.name, doctor.specialty, doctor.experience, doctor.fee, doctor.availability, doctor.timing, doctor.photo]
        );
      }
      console.log('✅ Sample doctors added');
    } else {
      console.log(`✅ Database already has ${countResult.rows[0].count} doctors`);
    }

    console.log('✅ Database initialization complete!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Database initialization failed:', error);
    process.exit(1);
  }
}

initDatabase();
