-- ============================================
-- APPROVAL SYSTEM UPDATE FOR HOSTELVOICE
-- Run this AFTER the main supabase-schema.sql
-- ============================================

-- Add approval_status column to users table
ALTER TABLE users 
ADD COLUMN IF NOT EXISTS approval_status TEXT DEFAULT 'pending' CHECK (approval_status IN ('pending', 'approved', 'rejected'));

-- Add approved_by and approval_date columns
ALTER TABLE users 
ADD COLUMN IF NOT EXISTS approved_by UUID REFERENCES users(id) ON DELETE SET NULL,
ADD COLUMN IF NOT EXISTS approval_date TIMESTAMPTZ,
ADD COLUMN IF NOT EXISTS rejection_reason TEXT;

-- Create index for approval status
CREATE INDEX IF NOT EXISTS idx_users_approval_status ON users(approval_status);

-- Update existing users to approved (if any exist)
UPDATE users SET approval_status = 'approved' WHERE approval_status IS NULL;

-- Admins are automatically approved
CREATE OR REPLACE FUNCTION auto_approve_admin()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.role = 'admin' THEN
    NEW.approval_status = 'approved';
    NEW.approval_date = NOW();
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for auto-approving admins
DROP TRIGGER IF EXISTS auto_approve_admin_trigger ON users;
CREATE TRIGGER auto_approve_admin_trigger
  BEFORE INSERT ON users
  FOR EACH ROW
  EXECUTE FUNCTION auto_approve_admin();

-- Update RLS policy for login - only approved users can access their data
DROP POLICY IF EXISTS "Users can view own profile" ON users;
CREATE POLICY "Users can view own profile"
  ON users FOR SELECT
  USING (
    auth.uid() = id AND 
    (approval_status = 'approved' OR role = 'admin')
  );

-- Admins can view all users including pending ones
DROP POLICY IF EXISTS "Admins can view all users" ON users;
CREATE POLICY "Admins can view all users"
  ON users FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE id = auth.uid() 
      AND role = 'admin' 
      AND approval_status = 'approved'
    )
  );

-- Admins can update user approval status
CREATE POLICY "Admins can update user approval"
  ON users FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE id = auth.uid() 
      AND role = 'admin' 
      AND approval_status = 'approved'
    )
  );

-- Allow insert for registration (handled by registration flow)
DROP POLICY IF EXISTS "Enable insert for authenticated users" ON users;
CREATE POLICY "Enable insert for authenticated users"
  ON users FOR INSERT
  WITH CHECK (auth.uid() = id);

-- Create a view for pending approvals (admin only)
CREATE OR REPLACE VIEW pending_approvals AS
SELECT 
  u.id,
  u.email,
  u.full_name,
  u.role,
  u.student_id,
  u.caretaker_id,
  u.hostel_name,
  u.room_number,
  u.phone_number,
  u.department,
  u.approval_status,
  u.created_at
FROM users u
WHERE u.approval_status = 'pending'
ORDER BY u.created_at DESC;

-- Grant access to view for admins
GRANT SELECT ON pending_approvals TO authenticated;

-- Create notification function for new registrations
CREATE OR REPLACE FUNCTION notify_admin_new_registration()
RETURNS TRIGGER AS $$
DECLARE
  admin_id UUID;
BEGIN
  -- Only notify for non-admin registrations
  IF NEW.role != 'admin' AND NEW.approval_status = 'pending' THEN
    -- Insert notification for all admins
    FOR admin_id IN 
      SELECT id FROM users 
      WHERE role = 'admin' AND approval_status = 'approved'
    LOOP
      INSERT INTO notifications (
        user_id,
        title,
        message,
        type,
        category,
        reference_id
      ) VALUES (
        admin_id,
        'New Registration Pending',
        'A new ' || NEW.role || ' (' || NEW.full_name || ') is waiting for approval.',
        'info',
        'system',
        NEW.id
      );
    END LOOP;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for admin notifications
DROP TRIGGER IF EXISTS notify_admin_trigger ON users;
CREATE TRIGGER notify_admin_trigger
  AFTER INSERT ON users
  FOR EACH ROW
  EXECUTE FUNCTION notify_admin_new_registration();

-- Create function to update approval status
CREATE OR REPLACE FUNCTION approve_user(
  user_id_param UUID,
  approved_by_param UUID,
  approve BOOLEAN DEFAULT TRUE,
  reason TEXT DEFAULT NULL
)
RETURNS VOID AS $$
BEGIN
  IF approve THEN
    UPDATE users 
    SET 
      approval_status = 'approved',
      approved_by = approved_by_param,
      approval_date = NOW(),
      rejection_reason = NULL
    WHERE id = user_id_param;
    
    -- Notify user of approval
    INSERT INTO notifications (
      user_id,
      title,
      message,
      type,
      category
    ) VALUES (
      user_id_param,
      'Account Approved! 🎉',
      'Your account has been approved. You can now log in and access all features.',
      'success',
      'system'
    );
  ELSE
    UPDATE users 
    SET 
      approval_status = 'rejected',
      approved_by = approved_by_param,
      approval_date = NOW(),
      rejection_reason = reason
    WHERE id = user_id_param;
    
    -- Notify user of rejection
    INSERT INTO notifications (
      user_id,
      title,
      message,
      type,
      category
    ) VALUES (
      user_id_param,
      'Account Registration Declined',
      COALESCE('Reason: ' || reason, 'Your registration was not approved. Please contact administration for more details.'),
      'error',
      'system'
    );
  END IF;
END;
$$ LANGUAGE plpgsql;

-- ============================================
-- VERIFICATION QUERIES
-- ============================================

-- Check approval status column added
SELECT column_name, data_type, column_default 
FROM information_schema.columns 
WHERE table_name = 'users' AND column_name IN ('approval_status', 'approved_by', 'approval_date');

-- View all pending registrations
SELECT id, email, full_name, role, approval_status, created_at
FROM users
WHERE approval_status = 'pending'
ORDER BY created_at DESC;

-- Count users by approval status
SELECT approval_status, role, COUNT(*) as count
FROM users
GROUP BY approval_status, role
ORDER BY approval_status, role;
