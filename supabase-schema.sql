-- ============================================
-- HOSTELVOICE DATABASE SCHEMA
-- Supabase Setup SQL Commands
-- ============================================

-- Enable UUID extension (if not already enabled)
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- 1. USERS TABLE
-- Core user information linked to Supabase Auth
-- ============================================

CREATE TABLE users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT UNIQUE NOT NULL,
  full_name TEXT NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('student', 'caretaker', 'admin')),
  phone_number TEXT,
  
  -- Student specific fields
  student_id TEXT UNIQUE,
  hostel_name TEXT,
  room_number TEXT,
  
  -- Caretaker specific fields
  caretaker_id TEXT UNIQUE,
  department TEXT,
  experience TEXT,
  
  -- Admin specific fields
  admin_id TEXT UNIQUE,
  university TEXT,
  position TEXT,
  
  -- Metadata
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  
  -- Constraints
  CONSTRAINT check_student_fields CHECK (
    role != 'student' OR (student_id IS NOT NULL)
  ),
  CONSTRAINT check_caretaker_fields CHECK (
    role != 'caretaker' OR (caretaker_id IS NOT NULL)
  ),
  CONSTRAINT check_admin_fields CHECK (
    role != 'admin' OR (admin_id IS NOT NULL)
  )
);

-- Create indexes for better query performance
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role ON users(role);
CREATE INDEX idx_users_student_id ON users(student_id) WHERE student_id IS NOT NULL;
CREATE INDEX idx_users_caretaker_id ON users(caretaker_id) WHERE caretaker_id IS NOT NULL;
CREATE INDEX idx_users_admin_id ON users(admin_id) WHERE admin_id IS NOT NULL;

-- Enable Row Level Security
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- RLS Policies for users table
-- Users can read their own profile
CREATE POLICY "Users can view own profile"
  ON users FOR SELECT
  USING (auth.uid() = id);

-- Users can update their own profile
CREATE POLICY "Users can update own profile"
  ON users FOR UPDATE
  USING (auth.uid() = id);

-- Allow insert during registration (handled by auth trigger)
CREATE POLICY "Enable insert for authenticated users"
  ON users FOR INSERT
  WITH CHECK (auth.uid() = id);

-- Admins can view all users
CREATE POLICY "Admins can view all users"
  ON users FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- ============================================
-- 2. ISSUES TABLE
-- Track issues/complaints reported by students
-- ============================================

CREATE TABLE issues (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  category TEXT NOT NULL CHECK (category IN ('maintenance', 'cleanliness', 'security', 'food', 'other')),
  priority TEXT DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high', 'urgent')),
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'in_progress', 'resolved', 'closed')),
  
  -- Relationships
  reported_by UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  assigned_to UUID REFERENCES users(id) ON DELETE SET NULL,
  
  -- Location details
  hostel_name TEXT,
  room_number TEXT,
  location TEXT,
  
  -- Metadata
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  resolved_at TIMESTAMPTZ,
  
  -- Additional fields
  images TEXT[], -- Array of image URLs
  notes TEXT
);

-- Indexes
CREATE INDEX idx_issues_reported_by ON issues(reported_by);
CREATE INDEX idx_issues_assigned_to ON issues(assigned_to);
CREATE INDEX idx_issues_status ON issues(status);
CREATE INDEX idx_issues_priority ON issues(priority);
CREATE INDEX idx_issues_category ON issues(category);
CREATE INDEX idx_issues_created_at ON issues(created_at DESC);

-- Enable RLS
ALTER TABLE issues ENABLE ROW LEVEL SECURITY;

-- RLS Policies for issues
CREATE POLICY "Users can view own issues"
  ON issues FOR SELECT
  USING (reported_by = auth.uid());

CREATE POLICY "Caretakers can view all issues"
  ON issues FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE id = auth.uid() AND role IN ('caretaker', 'admin')
    )
  );

CREATE POLICY "Students can create issues"
  ON issues FOR INSERT
  WITH CHECK (
    reported_by = auth.uid() AND
    EXISTS (
      SELECT 1 FROM users
      WHERE id = auth.uid() AND role = 'student'
    )
  );

CREATE POLICY "Caretakers can update issues"
  ON issues FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE id = auth.uid() AND role IN ('caretaker', 'admin')
    )
  );

-- ============================================
-- 3. ANNOUNCEMENTS TABLE
-- System-wide announcements from admins/caretakers
-- ============================================

CREATE TABLE announcements (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  category TEXT NOT NULL CHECK (category IN ('general', 'urgent', 'maintenance', 'event', 'policy')),
  priority TEXT DEFAULT 'normal' CHECK (priority IN ('normal', 'high', 'urgent')),
  
  -- Relationships
  created_by UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  
  -- Targeting
  target_role TEXT CHECK (target_role IN ('all', 'student', 'caretaker', 'admin')),
  target_hostel TEXT,
  
  -- Metadata
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  expires_at TIMESTAMPTZ,
  is_active BOOLEAN DEFAULT true,
  
  -- Additional
  attachments TEXT[] -- Array of attachment URLs
);

-- Indexes
CREATE INDEX idx_announcements_created_by ON announcements(created_by);
CREATE INDEX idx_announcements_target_role ON announcements(target_role);
CREATE INDEX idx_announcements_is_active ON announcements(is_active);
CREATE INDEX idx_announcements_created_at ON announcements(created_at DESC);

-- Enable RLS
ALTER TABLE announcements ENABLE ROW LEVEL SECURITY;

-- RLS Policies for announcements
CREATE POLICY "Users can view active announcements"
  ON announcements FOR SELECT
  USING (
    is_active = true AND
    (expires_at IS NULL OR expires_at > NOW()) AND
    (target_role = 'all' OR target_role = (
      SELECT role FROM users WHERE id = auth.uid()
    ))
  );

CREATE POLICY "Admins and caretakers can create announcements"
  ON announcements FOR INSERT
  WITH CHECK (
    created_by = auth.uid() AND
    EXISTS (
      SELECT 1 FROM users
      WHERE id = auth.uid() AND role IN ('admin', 'caretaker')
    )
  );

CREATE POLICY "Creators can update own announcements"
  ON announcements FOR UPDATE
  USING (created_by = auth.uid());

CREATE POLICY "Admins can update all announcements"
  ON announcements FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- ============================================
-- 4. LOST AND FOUND TABLE
-- Track lost and found items
-- ============================================

CREATE TABLE lost_found (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  item_name TEXT NOT NULL,
  description TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('lost', 'found')),
  category TEXT NOT NULL CHECK (category IN ('electronics', 'documents', 'clothing', 'accessories', 'books', 'other')),
  status TEXT DEFAULT 'open' CHECK (status IN ('open', 'claimed', 'returned', 'closed')),
  
  -- Relationships
  reported_by UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  claimed_by UUID REFERENCES users(id) ON DELETE SET NULL,
  
  -- Location details
  location_lost TEXT,
  location_found TEXT,
  current_location TEXT,
  
  -- Metadata
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  date_lost_found DATE,
  claimed_at TIMESTAMPTZ,
  
  -- Additional
  images TEXT[],
  contact_info TEXT,
  notes TEXT
);

-- Indexes
CREATE INDEX idx_lost_found_reported_by ON lost_found(reported_by);
CREATE INDEX idx_lost_found_type ON lost_found(type);
CREATE INDEX idx_lost_found_status ON lost_found(status);
CREATE INDEX idx_lost_found_created_at ON lost_found(created_at DESC);

-- Enable RLS
ALTER TABLE lost_found ENABLE ROW LEVEL SECURITY;

-- RLS Policies for lost_found
CREATE POLICY "Users can view all open lost/found items"
  ON lost_found FOR SELECT
  USING (status = 'open' OR reported_by = auth.uid() OR claimed_by = auth.uid());

CREATE POLICY "Authenticated users can create lost/found items"
  ON lost_found FOR INSERT
  WITH CHECK (reported_by = auth.uid());

CREATE POLICY "Users can update own items"
  ON lost_found FOR UPDATE
  USING (reported_by = auth.uid());

CREATE POLICY "Staff can update all items"
  ON lost_found FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE id = auth.uid() AND role IN ('caretaker', 'admin')
    )
  );

-- ============================================
-- 5. RESIDENTS TABLE
-- Additional resident information for students
-- ============================================

CREATE TABLE residents (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  
  -- Personal details
  emergency_contact_name TEXT,
  emergency_contact_phone TEXT,
  emergency_contact_relation TEXT,
  
  -- Academic details
  course TEXT,
  year_of_study INTEGER,
  enrollment_date DATE,
  
  -- Hostel details
  check_in_date DATE,
  check_out_date DATE,
  rent_amount DECIMAL(10, 2),
  rent_paid_until DATE,
  
  -- Documents
  id_proof_url TEXT,
  parent_consent_url TEXT,
  
  -- Metadata
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  
  UNIQUE(user_id)
);

-- Indexes
CREATE INDEX idx_residents_user_id ON residents(user_id);

-- Enable RLS
ALTER TABLE residents ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can view own resident info"
  ON residents FOR SELECT
  USING (user_id = auth.uid());

CREATE POLICY "Staff can view all resident info"
  ON residents FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE id = auth.uid() AND role IN ('caretaker', 'admin')
    )
  );

-- ============================================
-- 6. NOTIFICATIONS TABLE
-- In-app notifications for users
-- ============================================

CREATE TABLE notifications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('info', 'warning', 'success', 'error')),
  category TEXT CHECK (category IN ('issue', 'announcement', 'lost_found', 'system', 'other')),
  
  -- Status
  is_read BOOLEAN DEFAULT false,
  
  -- Links
  link_url TEXT,
  reference_id UUID, -- ID of related entity (issue, announcement, etc.)
  
  -- Metadata
  created_at TIMESTAMPTZ DEFAULT NOW(),
  read_at TIMESTAMPTZ
);

-- Indexes
CREATE INDEX idx_notifications_user_id ON notifications(user_id);
CREATE INDEX idx_notifications_is_read ON notifications(is_read);
CREATE INDEX idx_notifications_created_at ON notifications(created_at DESC);

-- Enable RLS
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can view own notifications"
  ON notifications FOR SELECT
  USING (user_id = auth.uid());

CREATE POLICY "Users can update own notifications"
  ON notifications FOR UPDATE
  USING (user_id = auth.uid());

-- ============================================
-- 7. AUDIT LOGS TABLE
-- Track important actions for accountability
-- ============================================

CREATE TABLE audit_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE SET NULL,
  
  action TEXT NOT NULL,
  entity_type TEXT NOT NULL,
  entity_id UUID,
  
  old_values JSONB,
  new_values JSONB,
  
  ip_address INET,
  user_agent TEXT,
  
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_audit_logs_user_id ON audit_logs(user_id);
CREATE INDEX idx_audit_logs_entity_type ON audit_logs(entity_type);
CREATE INDEX idx_audit_logs_created_at ON audit_logs(created_at DESC);

-- Enable RLS
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;

-- RLS Policies (only admins can view audit logs)
CREATE POLICY "Admins can view all audit logs"
  ON audit_logs FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- ============================================
-- FUNCTIONS AND TRIGGERS
-- ============================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply updated_at trigger to relevant tables
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_issues_updated_at BEFORE UPDATE ON issues
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_announcements_updated_at BEFORE UPDATE ON announcements
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_lost_found_updated_at BEFORE UPDATE ON lost_found
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_residents_updated_at BEFORE UPDATE ON residents
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- SEED DATA (Optional - for testing)
-- ============================================

-- Note: You'll need to create auth users first through Supabase Auth
-- Then insert corresponding records in the users table
-- Example users will be created through the registration flow

-- ============================================
-- STORAGE BUCKETS (Run in Supabase Dashboard)
-- ============================================

-- Create storage buckets for file uploads
-- Go to Storage > Create bucket in Supabase Dashboard:
-- 1. issue-images (public or private based on requirement)
-- 2. lost-found-images
-- 3. announcement-attachments
-- 4. resident-documents (private)

-- Example storage policy (adjust as needed):
-- CREATE POLICY "Users can upload their own files"
--   ON storage.objects FOR INSERT
--   WITH CHECK (bucket_id = 'issue-images' AND auth.uid() = owner);

-- ============================================
-- REALTIME (Optional - for live updates)
-- ============================================

-- Enable realtime for specific tables if needed
-- ALTER PUBLICATION supabase_realtime ADD TABLE issues;
-- ALTER PUBLICATION supabase_realtime ADD TABLE announcements;
-- ALTER PUBLICATION supabase_realtime ADD TABLE notifications;

-- ============================================
-- SETUP COMPLETE!
-- ============================================
