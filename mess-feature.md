# Mess Management System - Feature Documentation

## Overview
The Mess Management System is a comprehensive solution for hostel mess operations, designed for three user roles: Students, Caretakers, and Admins. Each role has specific functionalities tailored to their needs.

---

## User Roles & Access

### 1. **Students** (mess/page.tsx)
- Can view weekly mess menu in calendar format
- Can submit feedback after meals
- Can download menu card PDF uploaded by caretaker

### 2. **Caretakers** (mess-management/page.tsx)
- Can upload complete weekly menu with all meals
- Can view student feedback submissions
- Can respond to feedback and mark as reviewed

### 3. **Admins** (mess-management/page.tsx)
- Full dashboard with analytics and overview
- Can view all menus uploaded by caretakers
- Can view all feedback from students
- Access to reports and statistics

---

## Caretaker Menu Upload Workflow

### Step 1: Create Weekly Menu
When a caretaker clicks on "Mess Management", they see two states:

#### State A: No Menu Exists (or Creating New)
1. **Upload Menu Card Image** (Required)
   - Caretaker must first upload an image of the physical menu card
   - This image will be downloadable by students
   - Validates: Must select an image file

2. **Fill All Days & Meals**
   - System shows 7 days (Monday through Sunday)
   - Each day has 4 meal sections:
     - Breakfast
     - Lunch
     - Snacks
     - Dinner
   - Caretaker enters items as comma-separated values (e.g., "Idli, Sambar, Chutney, Tea")
   - Helper text shows "(comma separated)" for clarity

3. **Validation**
   - All meal fields for all days must be filled
   - Menu image must be uploaded
   - If validation fails, shows error toast message

4. **Submit**
   - Click "Upload Weekly Menu" button
   - System saves the complete week's menu
   - Shows success message
   - Switches to "View Mode" (State B)

#### State B: Menu Exists (View Mode)
1. **Display Current Menu**
   - Shows "Current Week's Menu" as title
   - Displays menu card image with download button
   - Shows all 7 days in beautiful calendar-style cards
   - Each day shows all 4 meals with items as bullet points
   - "Today" badge appears on current day
   - Each meal section has a colored background (gray-50)

2. **Menu Information**
   - Shows last updated timestamp
   - Shows week period (e.g., "Jan 27 - Feb 2, 2026")
   - Has "Quick Edit" button for minor changes
   - Has "Create New Week Menu" button to start fresh

---

## Student Menu Viewing (mess/page.tsx)

### Tab 1: View Menu
1. **Calendar Interface**
   - Interactive calendar to select any day
   - Click on a date to see that day's menu
   - Shows current date by default

2. **Daily Menu Display**
   - Shows selected date prominently
   - Displays all 4 meals with timing:
     - Breakfast (7-9 AM)
     - Lunch (12-2 PM)
     - Snacks (4-5 PM)
     - Dinner (7-9 PM)
   - Each meal shown in separate card with items listed

3. **Download Option**
   - "Download PDF" button at top
   - Downloads the menu card image uploaded by caretaker

### Tab 2: Give Feedback
Students can submit detailed feedback after eating:

1. **Required Fields**
   - Student Name (text input)
   - Overall Rating (1-5 stars, required)

2. **Optional Individual Ratings**
   - Taste (1-5 stars)
   - Quantity (1-5 stars)
   - Quality (1-5 stars)
   - Cleanliness (1-5 stars)

3. **Additional Feedback**
   - Comments (optional text area)
   - Photo Upload (optional, for bad food documentation)
   - Can upload multiple photos

4. **Submission**
   - Validates name and overall rating
   - Shows success message
   - Resets form after submission

---

## Caretaker Feedback Management

### Feedbacks Tab Features

1. **Filter Options**
   - Filter by Meal Type (Breakfast/Lunch/Snacks/Dinner)
   - Filter by Rating (1-5 stars)
   - Filter by Date Range
   - Filter "With Photos Only" toggle

2. **Feedback Display**
   - **Mobile View**: Card-based layout
     - Shows student name, date, meal type
     - Shows rating with star visualization
     - Displays comments (truncated)
     - Status badge (Done/Pending)
     - Action buttons inline
   
   - **Desktop View**: Table format
     - Columns: Date, Meal, Student, Rating, Comments, Photos, Status, Actions
     - Sortable columns
     - Hover effects
     - Low ratings (≤2) highlighted with red background

3. **Feedback Summary**
   - Average Rating display (large numbers)
   - Total feedbacks count
   - Visual star representation

4. **Actions Available**
   - **Mark as Reviewed**: Changes status from "Pending" to "Done"
   - **Reply to Feedback**: Opens dialog to send response to student
   - **View Photos**: If student uploaded photos, icon button to view them
   - **Export to Excel**: Download all feedback data

5. **Rating Trends**
   - Graph placeholder showing trends over time
   - Helps identify patterns in satisfaction

---

## Admin Dashboard Overview

### Overview Tab (Admin-Only)

1. **Key Metrics (4 Cards)**
   - **Average Rating**: Current month's average mess rating out of 5
   - **Total Feedbacks**: Count of feedbacks received this week
   - **Satisfaction %**: Overall satisfaction percentage with trend indicator
   - **Pending Reviews**: Number of feedbacks not yet reviewed by caretaker

2. **Rating Trends Graph**
   - Shows daily average ratings over last 30 days
   - Visual representation of satisfaction trends
   - Helps identify problem periods

3. **Most Common Complaints**
   - Lists top complaints from feedback comments
   - Shows count of each complaint type
   - Sorted by frequency
   - High-frequency issues shown in red

4. **Low-Rated Meals**
   - Lists meals with lowest ratings
   - Shows specific meal type and item
   - Color-coded by severity (red for very low, orange for moderate)
   - Includes trending down indicator

5. **Reports Section**
   - Download Monthly Report (PDF)
   - Compare Month-by-Month analytics
   - Comprehensive data export options

### Menu Tab (Admin View)
- Read-only view of current week's menu
- Shows who uploaded (caretaker name)
- Shows when it was last updated
- Cannot edit (caretakers handle this)

### Feedbacks Tab (Admin View)
- Same features as caretaker view
- Can see all feedback across all time periods
- Additional analytics and insights

---

## Data Flow & State Management

### Current State Variables

1. **Menu Management**
   - `weeklyMenuData`: Stores all 7 days × 4 meals data
   - `menuPhoto`: Stores uploaded menu card image
   - `hasExistingMenu`: Boolean to determine which view to show
   - `showUploadForm`: Controls upload form visibility

2. **Feedback Management**
   - `filterMeal`: Current meal type filter
   - `filterRating`: Current rating filter
   - `filterDate`: Date range filter
   - `showPhotosOnly`: Boolean for photo filter

3. **UI State**
   - `activeTab`: Current tab selection (overview/menu/feedback)
   - `userRole`: Determines which features to show (admin/caretaker/student)

---

## User Experience Flow

### Caretaker's Typical Week:
1. **Monday Morning**: Upload new week's menu
   - Upload menu card image
   - Fill in all meals for 7 days
   - Submit
2. **Throughout Week**: Monitor feedback
   - Check student feedback daily
   - Reply to concerning feedback
   - Mark reviewed feedback
3. **Weekly Review**: Export feedback data for records

### Student's Typical Day:
1. **Morning**: Check today's breakfast menu
2. **After Breakfast**: Submit feedback with ratings
3. **Before Lunch**: Check lunch menu
4. **Download**: Save weekly menu for reference

### Admin's Typical Week:
1. **Monday**: Review dashboard metrics
2. **Mid-week**: Check rating trends
3. **Weekly**: Generate and download reports
4. **Monthly**: Compare month-over-month performance

---

## Technical Features

### Responsive Design
- Mobile-first approach
- Card layout for mobile devices
- Table layout for desktop
- Adaptive text sizes and spacing
- Touch-friendly buttons on mobile

### Visual Hierarchy
- Color-coded sections (blue for primary, orange for secondary)
- Important metrics highlighted
- Warning colors for low ratings
- Success colors for positive feedback

### User Feedback
- Toast notifications for all actions
- Validation messages for form errors
- Success confirmations
- Loading states (planned)

### Data Validation
- Required field checks
- Image file type validation
- Rating range validation (1-5)
- Complete week menu validation

---

## Future Enhancements (Planned)

1. **Backend Integration**
   - Connect to real database
   - Store menu and feedback data
   - Implement image upload to cloud storage
   - Real-time updates

2. **Advanced Features**
   - Menu templates (save and reuse)
   - Copy previous week's menu
   - Automated notifications for students
   - Weekly digest emails

3. **Analytics Improvements**
   - AI-powered complaint categorization
   - Predictive analytics for satisfaction
   - Meal popularity tracking
   - Nutritional information

4. **Student Enhancements**
   - Meal preferences
   - Dietary restrictions marking
   - Allergies alerts
   - Meal rating predictions

---

## Current Implementation Status

✅ **Completed**
- Role-based access control
- Caretaker menu upload workflow
- Student menu viewing (calendar format)
- Student feedback submission
- Feedback filtering and management
- Admin dashboard with metrics
- Responsive mobile design
- Form validations
- Professional UI without emojis

⏳ **Using Dummy Data**
- All menu data is hardcoded
- Feedback data is sample data
- No real backend connection
- No actual file uploads/downloads

🔄 **Ready for Backend**
- All UI components ready
- Data structures defined
- API call points identified
- Form submissions prepared
