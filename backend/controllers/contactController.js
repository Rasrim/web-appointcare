const pool = require('../config/database');
const logger = require('../utils/logger');

// Get contact information
exports.getContactInfo = async (req, res) => {
  const client = await pool.connect();
  try {
    const result = await client.query(
      `SELECT * FROM contact_info LIMIT 1`
    );

    client.release();

    if (result.rows.length === 0) {
      return res.json({
        phone: '',
        email: '',
        address: '',
        city: '',
        opening_time: '09:00',
        closing_time: '18:00',
      });
    }

    res.json(result.rows[0]);
  } catch (error) {
    client.release();
    logger.error(`Error fetching contact info: ${error.message}`);
    // Return default values if table doesn't exist
    res.json({
      phone: '',
      email: '',
      address: '',
      city: '',
      opening_time: '09:00',
      closing_time: '18:00',
    });
  }
};

// Update contact information
exports.updateContactInfo = async (req, res) => {
  const client = await pool.connect();
  try {
    const { phone, email, address, city, opening_time, closing_time } = req.body;

    // Check if contact info exists
    const existing = await client.query('SELECT id FROM contact_info LIMIT 1');

    if (existing.rows.length === 0) {
      // Create new contact info
      const result = await client.query(
        `INSERT INTO contact_info (phone, email, address, city, opening_time, closing_time)
         VALUES ($1, $2, $3, $4, $5, $6)
         RETURNING *`,
        [phone, email, address, city, opening_time, closing_time]
      );
      client.release();
      return res.json({
        message: 'Contact info created successfully',
        data: result.rows[0],
      });
    }

    // Update existing contact info
    const result = await client.query(
      `UPDATE contact_info 
       SET phone = $1, email = $2, address = $3, city = $4, opening_time = $5, closing_time = $6
       WHERE id = $7
       RETURNING *`,
      [phone, email, address, city, opening_time, closing_time, existing.rows[0].id]
    );

    client.release();

    res.json({
      message: 'Contact info updated successfully',
      data: result.rows[0],
    });
  } catch (error) {
    client.release();
    logger.error(`Error updating contact info: ${error.message}`);
    // Try to create the table and insert data
    try {
      const createTableAndInsert = await client.query(
        `CREATE TABLE IF NOT EXISTS contact_info (
          id SERIAL PRIMARY KEY,
          phone VARCHAR(20),
          email VARCHAR(100),
          address TEXT,
          city VARCHAR(100),
          opening_time TIME DEFAULT '09:00',
          closing_time TIME DEFAULT '18:00',
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
        INSERT INTO contact_info (phone, email, address, city, opening_time, closing_time)
        VALUES ($1, $2, $3, $4, $5, $6)
        RETURNING *`,
        [phone, email, address, city, opening_time, closing_time]
      );
      client.release();
      return res.json({
        message: 'Contact info created (table auto-created)',
        data: createTableAndInsert.rows[0],
      });
    } catch (innerError) {
      res.status(500).json({
        message: 'Error updating contact info',
        error: error.message,
      });
    }
  }
};
