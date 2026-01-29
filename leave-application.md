# Leave Application System - Complete Flow

## Overview
The HostelVoice Leave Application System is designed to handle two separate leave processes:
1. **Student Leave Requests** - Students applying for hostel leave (reviewed by caretakers)
2. **Caretaker Leave Requests** - Caretakers applying for work leave (reviewed by admins)

Each user role has their own dedicated page with specific features.

---

## System Architecture

### Three Separate Pages (No Code Mixing!)

#### 1. **Student Leave Page** (`/dashboard/student-leave`)
- **Who can access**: Students only
- **Purpose**: Apply for hostel leave and track status
- **Features**:
  - Apply for Leave (with dates, reason, destination, contact info)
  - View My Leave Requests (track status: Pending/Approved/Rejected/More Info Needed)
  - See review comments from caretaker

#### 2. **Caretaker Leave Page** (`/dashboard/caretaker-leave`)
- **Who can access**: Caretakers only
- **Purpose**: Review student leaves AND manage their own leave
- **Features**:
  - **Review Students Tab**: 
    - View all student leave requests
    - Approve/Reject/Request More Info
    - Add notes for students
  - **Apply for Leave Tab**: 
    - Apply for caretaker's own leave
    - Suggest replacement caretaker
    - Upload supporting documents (medical certificate for sick leave)
  - **My Status Tab**: 
    - Track own leave requests
    - See admin's decision and notes

#### 3. **Admin Leave Management Page** (`/dashboard/admin-leave-management`)
- **Who can access**: Admins only
- **Purpose**: Review caretaker leaves and manage staffing calendar
- **Features**:
  - **Review Caretakers Tab**: 
    - View all caretaker leave requests
    - Approve/Conditional Approve/Reject
    - Assign replacement caretaker
    - Add admin notes
  - **Leave Calendar Tab**: 
    - Monthly calendar view
    - See which caretakers are on leave each day
    - Staffing indicators (Green: 75%+ available, Yellow: 50-75%, Red: <50%)
    - Filter by block (A/B/C/D)
    - Click on dates to see details

---

## Student Leave Flow (Step-by-Step)

### Step 1: Student Applies for Leave
1. Student logs in to their dashboard
2. Clicks on "Leave" in the sidebar → Goes to `/dashboard/student-leave`
3. Clicks on "Apply for Leave" tab
4. Fills out the form:
   - **Leave Type**: Home Visit, Medical Emergency, Family Event, Personal
   - **Start Date & End Date** (calendar picker)
   - **Destination**: Full address where they'll be staying
   - **Contact Number**: Reachable phone number during leave
   - **Reason**: Detailed explanation
   - **Document** (optional): Parent letter, medical certificate, etc.
5. System automatically calculates total days
6. Clicks "Submit Leave Request"
7. Status shows as **"Pending"** in "My Leaves" tab

### Step 2: Caretaker Reviews
1. Caretaker logs in and goes to `/dashboard/caretaker-leave`
2. Opens "Review Students" tab
3. Sees the pending leave request with all details:
   - Student name, room number
   - Leave dates, destination, contact info
   - Reason and any documents
4. Caretaker has 3 options:
   - **Approve**: Leave is granted
   - **Request More Info**: Ask student for additional details
   - **Reject**: Deny the leave with reason

### Step 3: Student Gets Notification
1. Student checks "My Leaves" tab in `/dashboard/student-leave`
2. Status badge shows:
   - **Green "Approved"**: Leave approved, can proceed
   - **Blue "More Info Needed"**: Check notes from caretaker
   - **Red "Rejected"**: Leave denied, see rejection reason
3. Student can click on any leave to see full details and caretaker's notes

---

## Caretaker Leave Flow (Step-by-Step)

### Step 1: Caretaker Applies for Leave
1. Caretaker logs in and goes to `/dashboard/caretaker-leave`
2. Clicks on "Apply for Leave" tab
3. Fills out the form:
   - **Leave Type**: Casual, Sick, Emergency, Earned
   - **Start Date & End Date** (calendar picker)
   - **Reason**: Detailed explanation (e.g., "Personal family function")
   - **Replacement Suggestion**: Suggest which caretaker can cover
   - **Document** (optional): Medical certificate for sick leave
4. System calculates total days
5. Clicks "Submit Leave Request"
6. Goes to "My Status" tab to track

### Step 2: Admin Reviews
1. Admin logs in and goes to `/dashboard/admin-leave-management`
2. Opens "Review Caretakers" tab
3. Sees pending request with:
   - Caretaker name and block
   - Leave dates and duration
   - Reason and suggested replacement
   - Any documents
4. Admin has 3 options:
   - **Approve**: Confirms leave and assigns replacement
   - **Conditional Approve**: Approve with conditions (assigns replacement)
   - **Reject**: Deny with reason

### Step 3: Replacement Assignment
- When approving or conditionally approving, admin **must** assign a replacement caretaker
- Admin can:
  - Accept the caretaker's suggested replacement
  - OR assign a different caretaker
- Example: "Sharma - Block B" will cover for "Kumar - Block A"

### Step 4: Caretaker Gets Result
1. Caretaker checks "My Status" tab in `/dashboard/caretaker-leave`
2. Status badge shows:
   - **Green "Approved"**: Leave granted with assigned replacement
   - **Blue "Conditionally Approved"**: Approved with conditions
   - **Red "Rejected"**: Leave denied with reason
3. Clicking on the leave shows:
   - Full details
   - Assigned replacement (who will cover their duties)
   - Admin notes

---

## Admin Calendar Management

### Purpose
- Visualize which caretakers are on leave each day
- Ensure adequate staffing (minimum caretakers available)
- Prevent too many caretakers being on leave simultaneously

### How It Works
1. Admin opens "Leave Calendar" tab in `/dashboard/admin-leave-management`
2. See monthly calendar with:
   - **Green days**: 75%+ caretakers available (6+ out of 8)
   - **Yellow days**: 50-75% available (4-5 out of 8)
   - **Red days**: <50% available (<4 out of 8) - Critical!
3. Click on any date to see:
   - Which caretakers are on leave
   - Who is covering for them
4. Navigate months using Previous/Next buttons or "Today" button

### Filtering
- Admin can filter by block (A/B/C/D)
- Helps manage block-specific staffing

---

## Current System Status

### What's Working Now ✅
1. **Complete UI for all three roles** (Student, Caretaker, Admin)
2. **Separate pages with no code mixing**:
   - Students → `/dashboard/student-leave`
   - Caretakers → `/dashboard/caretaker-leave`
   - Admins → `/dashboard/admin-leave-management`
3. **Navigation properly configured** in sidebar and dashboard
4. **Dummy data** for testing:
   - Sample student leave requests
   - Sample caretaker leave requests
   - Calendar showing approved leaves

### What's Using Dummy Data (For Now) 📋
Currently, all data is stored in the component's state (in memory):
- When you refresh the page, data resets to default dummy data
- Changes made (approve/reject) work but don't persist
- No database connection yet

### Sample Dummy Data Included
- **Student Leaves**:
  - Rahul Sharma (Room A-204) - Home Visit pending
  
- **Caretaker Leaves**:
  - Kumar Singh (Block A) - Casual leave pending
  - Patel Ji (Block C) - Sick leave approved
  - Sharma (Block B) - Casual leave approved
  - Reddy (Block D) - Emergency pending

---

## Key Features

### For Students
- **Easy Application**: Simple form with calendar picker
- **Status Tracking**: Always know where your leave request stands
- **Transparency**: See caretaker's comments and reasons

### For Caretakers
- **Dual Role**: Review student requests AND manage own leave
- **Quick Actions**: Approve/Reject with one click
- **Notes System**: Communicate with students and admin

### For Admins
- **Centralized Control**: Review all caretaker leaves in one place
- **Staffing Management**: Calendar ensures adequate coverage
- **Replacement Assignment**: Assign and track replacements

---

## Database Schema (For Backend Integration)

### Tables Needed

#### 1. `student_leave_requests`
- id, student_id, student_name, room_number
- leave_type, start_date, end_date
- destination, contact_number, reason
- document_url, status
- submitted_at, reviewed_at, reviewed_by
- rejection_reason, additional_notes

#### 2. `caretaker_leave_requests`
- id, caretaker_id, caretaker_name, caretaker_block
- leave_type, start_date, end_date, number_of_days
- reason, document_url, replacement_suggestion
- status, submitted_at, reviewed_at, reviewed_by
- assigned_replacement, rejection_reason, admin_notes

#### 3. `leave_request_comments` (Optional)
- For conversation threads between users

---

## Status Types

### Student Leave Statuses
- **Pending**: Waiting for caretaker review
- **Approved**: Caretaker approved
- **Rejected**: Caretaker denied
- **More Info Needed**: Caretaker needs clarification

### Caretaker Leave Statuses
- **Pending**: Waiting for admin review
- **Approved**: Admin approved with replacement assigned
- **Conditionally Approved**: Approved with specific conditions
- **Rejected**: Admin denied

---

## Visual Indicators (Color Coding)

### Status Badges
- 🟡 **Yellow**: Pending
- 🟢 **Green**: Approved
- 🔴 **Red**: Rejected
- 🔵 **Blue**: More Info Needed / Conditionally Approved

### Calendar Staffing
- 🟢 **Green**: Safe staffing (≥75%)
- 🟡 **Yellow**: Moderate concern (50-75%)
- 🔴 **Red**: Critical shortage (<50%)

---

## Next Steps for Development

### Phase 1: Backend Integration
- [ ] Connect to Supabase database
- [ ] Create API endpoints for CRUD operations
- [ ] Implement real-time updates
- [ ] Add authentication checks

### Phase 2: Notifications
- [ ] Email notifications when status changes
- [ ] In-app notification system
- [ ] SMS for urgent leave status updates

### Phase 3: Advanced Features
- [ ] Leave balance tracking (annual/sick leave limits)
- [ ] Automatic replacement suggestions based on availability
- [ ] Export calendar to PDF
- [ ] Analytics dashboard (most common leave types, busiest months)
- [ ] Mobile app version

---

## File Structure

```
app/dashboard/
├── student-leave/
│   └── page.tsx                    # Student leave application & tracking
├── caretaker-leave/
│   └── page.tsx                    # Caretaker: review students + own leave
└── admin-leave-management/
    └── page.tsx                    # Admin: review caretakers + calendar

app/dashboard/layout.tsx            # Navigation sidebar (role-based links)
app/dashboard/page.tsx              # Dashboard home (quick action cards)
```

---

## Important Notes

### Role-Based Access
- Each page checks user role using `useAuth()` hook
- Navigation shows only relevant links for each role
- In production, add server-side role verification

### Data Privacy
- Students cannot see other students' leave details
- Caretakers see only students in their block (when backend is ready)
- Admins have full system visibility

### Leave Policies (Customizable)
- Default: 8 total caretakers in system
- Minimum staffing: Alerts when <50% available
- Leave duration limits can be configured
- Document requirements vary by leave type

---

## Testing the System

### As Student:
1. Login with student role
2. Go to Leave section
3. Apply for leave with all details
4. Check "My Leaves" tab for status

### As Caretaker:
1. Login with caretaker role
2. Go to Leave section
3. Review pending student requests
4. Apply for your own leave
5. Check "My Status" for admin's decision

### As Admin:
1. Login with admin role
2. Go to Leave Management
3. Review pending caretaker requests
4. Assign replacements when approving
5. Use calendar to visualize staffing

---

## Support & Questions

For issues or feature requests related to the Leave Application System:
1. Check this documentation first
2. Review the code comments in each page
3. Test with dummy data before backend integration
4. Ensure user roles are correctly set in auth system

---

**Last Updated**: January 29, 2026  
**Status**: ✅ Frontend Complete | 📋 Backend Integration Pending  
**Pages**: 3 (Student, Caretaker, Admin) - Fully Separated
