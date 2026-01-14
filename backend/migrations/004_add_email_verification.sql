-- Migration: Add email verification columns to users table
-- This adds support for email verification before account activation

ALTER TABLE users ADD COLUMN IF NOT EXISTS verification_code VARCHAR(6);
ALTER TABLE users ADD COLUMN IF NOT EXISTS verification_code_expiry TIMESTAMP;
ALTER TABLE users ADD COLUMN IF NOT EXISTS is_verified BOOLEAN DEFAULT false;

-- Add index for faster lookups
CREATE INDEX IF NOT EXISTS idx_users_verification_code ON users(verification_code);
CREATE INDEX IF NOT EXISTS idx_users_is_verified ON users(is_verified);
