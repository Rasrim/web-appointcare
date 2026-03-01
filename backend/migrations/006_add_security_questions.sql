-- Add security questions to users table
ALTER TABLE users ADD COLUMN IF NOT EXISTS first_name_letters VARCHAR(2);
ALTER TABLE users ADD COLUMN IF NOT EXISTS last_surname_letters VARCHAR(2);
ALTER TABLE users ADD COLUMN IF NOT EXISTS reset_token VARCHAR(255);
ALTER TABLE users ADD COLUMN IF NOT EXISTS reset_token_expiry TIMESTAMP;

-- Create index for password reset verification
CREATE INDEX IF NOT EXISTS idx_users_security_questions ON users(id, first_name_letters, last_surname_letters);
CREATE INDEX IF NOT EXISTS idx_users_reset_token ON users(reset_token);
