-- Leave Request System Schema

-- Student Leave Requests Table
CREATE TABLE student_leave_requests (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    student_id UUID NOT NULL REFERENCES profiles(id),
    leave_type VARCHAR(50) NOT NULL CHECK (leave_type IN ('Home Visit', 'Emergency', 'Medical', 'Personal')),
    start_date TIMESTAMP NOT NULL,
    end_date TIMESTAMP NOT NULL,
    reason TEXT NOT NULL,
    destination TEXT NOT NULL,
    contact_number VARCHAR(15) NOT NULL,
    supporting_document_url TEXT,
    status VARCHAR(20) NOT NULL DEFAULT 'Pending' CHECK (status IN ('Pending', 'Approved', 'Rejected', 'More Info Needed')),
    reviewed_by UUID REFERENCES profiles(id),
    review_date TIMESTAMP,
    rejection_reason TEXT,
    additional_notes TEXT,
    return_status VARCHAR(20) DEFAULT 'Not Returned' CHECK (return_status IN ('Not Returned', 'Returned', 'Overdue')),
    actual_return_date TIMESTAMP,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Caretaker Leave Requests Table
CREATE TABLE caretaker_leave_requests (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    caretaker_id UUID NOT NULL REFERENCES profiles(id),
    leave_type VARCHAR(50) NOT NULL CHECK (leave_type IN ('Casual', 'Sick', 'Emergency')),
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    number_of_days INTEGER NOT NULL,
    reason TEXT NOT NULL,
    supporting_document_url TEXT,
    replacement_caretaker_id UUID REFERENCES profiles(id),
    status VARCHAR(30) NOT NULL DEFAULT 'Pending' CHECK (status IN ('Pending', 'Approved', 'Rejected', 'Conditionally Approved')),
    reviewed_by UUID REFERENCES profiles(id),
    review_date TIMESTAMP,
    rejection_reason TEXT,
    admin_notes TEXT,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Leave Request Comments (for more info requests)
CREATE TABLE leave_request_comments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    request_id UUID NOT NULL,
    request_type VARCHAR(20) NOT NULL CHECK (request_type IN ('Student', 'Caretaker')),
    commenter_id UUID NOT NULL REFERENCES profiles(id),
    comment TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Indexes for better query performance
CREATE INDEX idx_student_leave_student_id ON student_leave_requests(student_id);
CREATE INDEX idx_student_leave_status ON student_leave_requests(status);
CREATE INDEX idx_student_leave_dates ON student_leave_requests(start_date, end_date);
CREATE INDEX idx_caretaker_leave_caretaker_id ON caretaker_leave_requests(caretaker_id);
CREATE INDEX idx_caretaker_leave_status ON caretaker_leave_requests(status);
CREATE INDEX idx_caretaker_leave_dates ON caretaker_leave_requests(start_date, end_date);

-- Enable Row Level Security
ALTER TABLE student_leave_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE caretaker_leave_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE leave_request_comments ENABLE ROW LEVEL SECURITY;

-- RLS Policies for student_leave_requests
CREATE POLICY "Students can view their own leave requests"
    ON student_leave_requests FOR SELECT
    USING (auth.uid() = student_id);

CREATE POLICY "Students can insert their own leave requests"
    ON student_leave_requests FOR INSERT
    WITH CHECK (auth.uid() = student_id);

CREATE POLICY "Caretakers and admins can view all student leave requests"
    ON student_leave_requests FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM profiles
            WHERE id = auth.uid()
            AND role IN ('Caretaker', 'Admin')
        )
    );

CREATE POLICY "Caretakers and admins can update student leave requests"
    ON student_leave_requests FOR UPDATE
    USING (
        EXISTS (
            SELECT 1 FROM profiles
            WHERE id = auth.uid()
            AND role IN ('Caretaker', 'Admin')
        )
    );

-- RLS Policies for caretaker_leave_requests
CREATE POLICY "Caretakers can view their own leave requests"
    ON caretaker_leave_requests FOR SELECT
    USING (auth.uid() = caretaker_id);

CREATE POLICY "Caretakers can insert their own leave requests"
    ON caretaker_leave_requests FOR INSERT
    WITH CHECK (auth.uid() = caretaker_id);

CREATE POLICY "Admins can view all caretaker leave requests"
    ON caretaker_leave_requests FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM profiles
            WHERE id = auth.uid()
            AND role = 'Admin'
        )
    );

CREATE POLICY "Admins can update caretaker leave requests"
    ON caretaker_leave_requests FOR UPDATE
    USING (
        EXISTS (
            SELECT 1 FROM profiles
            WHERE id = auth.uid()
            AND role = 'Admin'
        )
    );
