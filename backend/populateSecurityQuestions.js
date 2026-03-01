/**
 * Populate Security Questions for Existing Users
 * Extracts security question answers from user names
 */

const pool = require('./config/database');

async function populateSecurityQuestions() {
  console.log('\n🔧 Populating security questions for existing users...\n');

  try {
    // Get all users
    const result = await pool.query('SELECT id, full_name FROM users WHERE first_name_letters IS NULL OR first_name_letters = \'\'');
    const users = result.rows;

    console.log(`📁 Found ${users.length} users needing security questions\n`);

    for (const user of users) {
      try {
        // Extract security question answers from fullName
        const nameParts = user.full_name.trim().split(/\s+/);
        const firstName = nameParts[0] || '';
        const surname = nameParts[nameParts.length - 1] || '';
        const firstNameLetters = firstName.substring(0, 2).toUpperCase();
        const lastSurnameLetters = surname.substring(surname.length - 2).toUpperCase();

        // Update user
        await pool.query(
          'UPDATE users SET first_name_letters = $1, last_surname_letters = $2 WHERE id = $3',
          [firstNameLetters, lastSurnameLetters, user.id]
        );

        console.log(`✅ User "${user.full_name}" → ${firstNameLetters}, ${lastSurnameLetters}`);
      } catch (error) {
        console.error(`❌ Error updating user ${user.id}:`, error.message);
      }
    }

    console.log('\n✅ Security questions populated for all users!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

populateSecurityQuestions();
