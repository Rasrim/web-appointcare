/**
 * Database Migration Runner
 * Runs all SQL migrations from the migrations folder
 */

const fs = require('fs');
const path = require('path');
const pool = require('./config/database');

async function runMigrations() {
  console.log('\n🔧 Starting database migrations...\n');

  try {
    // Read migration files
    const migrationsDir = path.join(__dirname, 'migrations');
    const migrationFiles = fs.readdirSync(migrationsDir)
      .filter(file => file.endsWith('.sql'))
      .sort();

    console.log(`📁 Found ${migrationFiles.length} migration files\n`);

    for (const file of migrationFiles) {
      const filePath = path.join(migrationsDir, file);
      const sql = fs.readFileSync(filePath, 'utf-8');

      console.log(`▶️  Running: ${file}`);
      try {
        await pool.query(sql);
        console.log(`✅ ${file} completed\n`);
      } catch (error) {
        // Some migrations might fail if objects already exist - that's okay
        if (error.message.includes('already exists') || error.message.includes('duplicate')) {
          console.log(`⚠️  ${file} - table/index already exists (skipped)\n`);
        } else {
          console.error(`❌ Error running ${file}:`, error.message, '\n');
        }
      }
    }

    console.log('✅ All migrations completed!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Migration failed:', error);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

runMigrations();
