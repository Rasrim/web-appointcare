-- Ensure all profile-related columns exist in users table
ALTER TABLE users ADD COLUMN IF NOT EXISTS birth_date DATE;
ALTER TABLE users ADD COLUMN IF NOT EXISTS gender VARCHAR(50);
ALTER TABLE users ADD COLUMN IF NOT EXISTS location VARCHAR(255) DEFAULT 'Nepal';
ALTER TABLE users ADD COLUMN IF NOT EXISTS bio TEXT;
ALTER TABLE users ADD COLUMN IF NOT EXISTS profile_image LONGTEXT;
ALTER TABLE users ADD COLUMN IF NOT EXISTS is_verified BOOLEAN DEFAULT false;

-- Create indexes for faster queries
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_id ON users(id);

-- Ensure full_name column exists
ALTER TABLE users ADD COLUMN IF NOT EXISTS full_name VARCHAR(255);

-- Update any null full_names from existing names if they exist
UPDATE users SET full_name = COALESCE(full_name, 'User') WHERE full_name IS NULL;
