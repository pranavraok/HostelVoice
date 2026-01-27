-- ============================================
-- HOSTELVOICE DATABASE SCHEMA UPDATE
-- Adds approval_status fields to users table
-- Run this AFTER supabase-schema.sql
-- ============================================

-- Add approval fields to users table
ALTER TABLE users 
ADD COLUMN IF NOT EXISTS approval_status TEXT DEFAULT 'pending' CHECK (approval_status IN ('pending', 'approved', 'rejected')),
ADD COLUMN IF NOT EXISTS approved_by UUID REFERENCES users(id) ON DELETE SET NULL,
ADD COLUMN IF NOT EXISTS approval_date TIMESTAMPTZ,
ADD COLUMN IF NOT EXISTS rejection_reason TEXT;

-- Create index for approval_status
CREATE INDEX IF NOT EXISTS idx_users_approval_status ON users(approval_status);

-- Update existing admin users to be auto-approved
UPDATE users SET approval_status = 'approved', approval_date = NOW() WHERE role = 'admin' AND approval_status = 'pending';

-- ============================================
-- FUNCTION: Auto-approve admins on registration
-- ============================================
CREATE OR REPLACE FUNCTION auto_approve_admin()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.role = 'admin' THEN
    NEW.approval_status := 'approved';
    NEW.approval_date := NOW();
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for auto-approval
DROP TRIGGER IF EXISTS auto_approve_admin_trigger ON users;
CREATE TRIGGER auto_approve_admin_trigger
  BEFORE INSERT ON users
  FOR EACH ROW
  EXECUTE FUNCTION auto_approve_admin();

-- ============================================
-- RLS POLICY UPDATES
-- Allow admins to approve/reject users
-- ============================================

-- Policy: Admins can update approval status
CREATE POLICY "Admins can update user approval"
  ON users FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin' AND approval_status = 'approved'
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin' AND approval_status = 'approved'
    )
  );

-- ============================================
-- ADD location fields to lost_found if missing
-- ============================================
ALTER TABLE lost_found 
ADD COLUMN IF NOT EXISTS location_found TEXT,
ADD COLUMN IF NOT EXISTS location_lost TEXT,
ADD COLUMN IF NOT EXISTS date_found TIMESTAMPTZ,
ADD COLUMN IF NOT EXISTS date_lost TIMESTAMPTZ,
ADD COLUMN IF NOT EXISTS images TEXT[],
ADD COLUMN IF NOT EXISTS contact_info TEXT;

-- ============================================
-- SETUP COMPLETE!
-- ============================================
