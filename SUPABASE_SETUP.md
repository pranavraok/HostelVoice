# Supabase Setup Guide for HostelVoice

## Prerequisites
- A Supabase account (sign up at https://supabase.com)
- Your project's environment variables ready

## Step 1: Create a Supabase Project

1. Go to https://supabase.com/dashboard
2. Click "New Project"
3. Fill in your project details:
   - Name: `hostelvoice` (or your preferred name)
   - Database Password: Create a strong password
   - Region: Choose closest to your users
4. Click "Create new project" and wait for it to initialize

## Step 2: Get Your API Keys

1. In your Supabase project dashboard, go to **Settings** > **API**
2. Copy the following:
   - **Project URL** (under Project URL)
   - **anon/public key** (under Project API keys)

## Step 3: Configure Environment Variables

1. Open the `.env.local` file in your project root
2. Replace the placeholder values with your actual Supabase credentials:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project-ref.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
```

## Step 4: Run the Database Schema

1. In your Supabase dashboard, go to **SQL Editor**
2. Click "New Query"
3. Copy the entire contents of `supabase-schema.sql`
4. Paste it into the SQL Editor
5. Click "Run" to execute the schema

This will create:
- ✅ Users table with role-based access
- ✅ Issues table for complaint tracking
- ✅ Announcements table
- ✅ Lost & Found table
- ✅ Residents table for additional student info
- ✅ Notifications table
- ✅ Audit logs for tracking actions
- ✅ All necessary indexes and Row Level Security (RLS) policies
- ✅ Triggers for automatic timestamp updates

## Step 5: Configure Email Authentication

1. Go to **Authentication** > **Providers** in your Supabase dashboard
2. Make sure **Email** is enabled
3. Configure email templates (optional):
   - Go to **Authentication** > **Email Templates**
   - Customize confirmation and password recovery emails

## Step 6: Set Up Storage Buckets (Optional but Recommended)

For file uploads (issue images, documents, etc.):

1. Go to **Storage** in your Supabase dashboard
2. Create the following buckets:
   
   **Bucket 1: issue-images**
   - Name: `issue-images`
   - Public: Yes (or No if you want private)
   - Click "Create bucket"
   
   **Bucket 2: lost-found-images**
   - Name: `lost-found-images`
   - Public: Yes
   - Click "Create bucket"
   
   **Bucket 3: announcement-attachments**
   - Name: `announcement-attachments`
   - Public: Yes
   - Click "Create bucket"
   
   **Bucket 4: resident-documents**
   - Name: `resident-documents`
   - Public: No (private documents)
   - Click "Create bucket"

3. Set up storage policies for each bucket:
   - Click on the bucket
   - Go to "Policies"
   - Add appropriate policies (examples provided in the SQL file)

## Step 7: Test Your Setup

1. Start your development server:
```bash
pnpm dev
```

2. Navigate to http://localhost:3000/register
3. Try registering a new user (student, caretaker, or admin)
4. Check your Supabase dashboard:
   - **Authentication** > **Users** - should show the new user
   - **Table Editor** > **users** - should show the user profile

## Step 8: Create Demo Users (Optional)

To create demo users with the credentials from your login page:

### Method 1: Through the App (Recommended)
1. Go to http://localhost:3000/register
2. Register users with these credentials:
   - **Student**: student@hostelvoice.com / password123
   - **Caretaker**: caretaker@hostelvoice.com / password123
   - **Admin**: admin@hostelvoice.com / password123

### Method 2: Using Supabase Dashboard
1. Go to **Authentication** > **Users**
2. Click "Add user" > "Create new user"
3. Enter email and password
4. After creating in Auth, manually insert into `users` table:

```sql
-- Example for student user
INSERT INTO users (id, email, full_name, role, phone_number, student_id, hostel_name, room_number)
VALUES (
  'auth-user-uuid-here', -- Use the UUID from auth.users
  'student@hostelvoice.com',
  'Arjun Singh',
  'student',
  '+91 9876543210',
  'STU2025001',
  'North Wing Hostel',
  'A-203'
);
```

## Step 9: Enable Realtime (Optional)

For live updates in your app:

1. Go to **Database** > **Replication**
2. Enable replication for these tables:
   - issues
   - announcements
   - notifications
   - lost_found

Or run this SQL:
```sql
ALTER PUBLICATION supabase_realtime ADD TABLE issues;
ALTER PUBLICATION supabase_realtime ADD TABLE announcements;
ALTER PUBLICATION supabase_realtime ADD TABLE notifications;
ALTER PUBLICATION supabase_realtime ADD TABLE lost_found;
```

## Security Best Practices

1. **Never commit `.env.local`** to version control
2. **Row Level Security (RLS)** is already enabled on all tables
3. **Review and customize RLS policies** based on your specific requirements
4. **Set up proper storage policies** if using file uploads
5. **Enable email verification** in production:
   - Go to **Authentication** > **Settings**
   - Enable "Enable email confirmations"

## Troubleshooting

### "Invalid API key" error
- Double-check your `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` in `.env.local`
- Make sure there are no extra spaces or quotes
- Restart your dev server after changing environment variables

### "User not found" after registration
- Check if the user was created in **Authentication** > **Users**
- Check if the user profile was created in **Table Editor** > **users**
- Review RLS policies if data isn't showing up

### "Permission denied" errors
- Check Row Level Security policies in the SQL Editor
- Verify the user's role matches the expected role for the action
- Check the policies for the specific table causing issues

### Email confirmation not working
- Check email settings in **Authentication** > **Settings**
- For development, you can disable email confirmation temporarily
- Check spam folder for confirmation emails

## Next Steps

1. **Customize the schema** as needed for your specific use case
2. **Set up CI/CD** with GitHub Actions for automated deployments
3. **Configure custom domain** in Supabase settings
4. **Set up monitoring** and alerts
5. **Implement file upload functionality** using Supabase Storage
6. **Add real-time features** using Supabase Realtime

## Additional Resources

- [Supabase Documentation](https://supabase.com/docs)
- [Supabase Auth with Next.js](https://supabase.com/docs/guides/auth/auth-helpers/nextjs)
- [Row Level Security](https://supabase.com/docs/guides/auth/row-level-security)
- [Supabase Storage](https://supabase.com/docs/guides/storage)

## Support

If you encounter any issues:
1. Check the [Supabase Discord](https://discord.supabase.com)
2. Review [GitHub Issues](https://github.com/supabase/supabase/issues)
3. Consult the [Supabase Docs](https://supabase.com/docs)
