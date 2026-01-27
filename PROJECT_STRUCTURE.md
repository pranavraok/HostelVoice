# Project Structure - Supabase Integration

## 📁 Complete Directory Structure

```
hostel-voice-pwa-build/
│
├── 📄 Configuration Files
│   ├── .env.local                    # Your Supabase credentials (DO NOT COMMIT)
│   ├── .env.example                  # Template for environment variables
│   ├── .gitignore                    # Git ignore rules (includes .env.local)
│   ├── next.config.mjs               # Next.js configuration
│   ├── tsconfig.json                 # TypeScript configuration
│   ├── package.json                  # Dependencies
│   └── pnpm-lock.yaml                # Lock file
│
├── 📚 Documentation
│   ├── SETUP_COMPLETE.md             # Quick start summary
│   ├── SETUP_CHECKLIST.md            # Step-by-step checklist
│   ├── SUPABASE_SETUP.md             # Detailed setup guide
│   ├── AUTH_README.md                # Authentication overview
│   ├── SQL_COMMANDS_REFERENCE.md     # Database reference
│   └── Overview.md                   # Original project overview
│
├── 🗄️ Database Scripts
│   ├── supabase-schema.sql           # Main database schema (RUN THIS FIRST)
│   └── demo-users.sql                # Demo user creation script
│
├── 🔧 Core Application
│   ├── middleware.ts                 # Route protection (NEW)
│   │
│   ├── 📁 app/
│   │   ├── layout.tsx                # Root layout with AuthProvider
│   │   ├── page.tsx                  # Landing page
│   │   ├── globals.css               # Global styles
│   │   │
│   │   ├── 📁 login/
│   │   │   └── page.tsx              # Login page (uses Supabase)
│   │   │
│   │   ├── 📁 register/
│   │   │   ├── page.tsx              # Role selection page
│   │   │   ├── 📁 student/
│   │   │   │   └── page.tsx          # Student registration (UPDATED)
│   │   │   ├── 📁 caretaker/
│   │   │   │   └── page.tsx          # Caretaker registration (UPDATED)
│   │   │   └── 📁 admin/
│   │   │       └── page.tsx          # Admin registration (UPDATED)
│   │   │
│   │   └── 📁 dashboard/
│   │       ├── layout.tsx            # Dashboard layout
│   │       ├── page.tsx              # Main dashboard
│   │       ├── 📁 analytics/
│   │       ├── 📁 announcements/
│   │       ├── 📁 issues/
│   │       ├── 📁 lost-found/
│   │       ├── 📁 management/
│   │       └── 📁 residents/
│   │
│   ├── 📁 lib/
│   │   ├── auth-context.tsx          # Authentication context (UPDATED - uses Supabase)
│   │   ├── utils.ts                  # Utility functions
│   │   │
│   │   └── 📁 supabase/              # Supabase configuration (NEW)
│   │       ├── client.ts             # Browser Supabase client
│   │       ├── server.ts             # Server-side Supabase client
│   │       └── middleware.ts         # Session management helper
│   │
│   ├── 📁 components/
│   │   ├── theme-provider.tsx
│   │   └── 📁 ui/                    # Shadcn UI components
│   │       ├── button.tsx
│   │       ├── input.tsx
│   │       ├── card.tsx
│   │       └── ... (50+ components)
│   │
│   ├── 📁 hooks/
│   │   ├── use-mobile.ts
│   │   └── use-toast.ts
│   │
│   ├── 📁 public/
│   │   └── 📁 logo/
│   │       └── logo.png
│   │
│   └── 📁 styles/
│       └── globals.css
```

## 🔑 Key Files Explained

### Authentication Files (Core)

#### `lib/auth-context.tsx` ⭐ UPDATED
```typescript
// Main authentication context
// Provides: login(), register(), logout(), user state
// Uses Supabase Auth instead of localStorage
```

#### `lib/supabase/client.ts` ⭐ NEW
```typescript
// Browser-side Supabase client
// Used in client components
import { createClient } from '@/lib/supabase/client'
```

#### `lib/supabase/server.ts` ⭐ NEW
```typescript
// Server-side Supabase client
// Used in Server Components and API routes
import { createClient } from '@/lib/supabase/server'
```

#### `lib/supabase/middleware.ts` ⭐ NEW
```typescript
// Session refresh helper
// Called by middleware.ts
```

#### `middleware.ts` ⭐ NEW
```typescript
// Route protection
// Runs before every request
// Checks authentication status
// Redirects unauthenticated users
```

### Registration Pages (Updated)

#### `app/register/student/page.tsx` ⭐ UPDATED
```typescript
// Student registration form
// Now calls register() from useAuth()
// Creates user in Supabase
```

#### `app/register/caretaker/page.tsx` ⭐ UPDATED
```typescript
// Caretaker registration form
// Stores caretaker-specific data
```

#### `app/register/admin/page.tsx` ⭐ UPDATED
```typescript
// Admin registration form
// Stores admin-specific data
```

### Configuration Files

#### `.env.local` ⭐ NEW (You create this)
```bash
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJxxx...
```

#### `.env.example` ⭐ NEW
```bash
# Template for .env.local
# Shows what variables are needed
```

### Database Scripts

#### `supabase-schema.sql` ⭐ NEW
```sql
-- Creates all database tables
-- Sets up Row Level Security (RLS)
-- Creates indexes and triggers
-- RUN THIS FIRST in Supabase SQL Editor
```

#### `demo-users.sql` ⭐ NEW
```sql
-- Creates demo users
-- student@hostelvoice.com
-- caretaker@hostelvoice.com
-- admin@hostelvoice.com
```

### Documentation Files

#### `SETUP_COMPLETE.md` ⭐ NEW
- Quick overview of what's been done
- Next steps summary
- Testing instructions

#### `SETUP_CHECKLIST.md` ⭐ NEW
- Step-by-step checklist
- Verify each step works
- Troubleshooting guide

#### `SUPABASE_SETUP.md` ⭐ NEW
- Detailed setup instructions
- Screenshots and examples
- Advanced configuration

#### `AUTH_README.md` ⭐ NEW
- How authentication works
- Flow diagrams
- Customization guide

#### `SQL_COMMANDS_REFERENCE.md` ⭐ NEW
- Database schema explained
- Useful queries
- Maintenance commands

## 🔄 Authentication Flow

```
User Registration:
┌─────────────────┐
│ Registration    │
│ Form            │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ useAuth()       │
│ register()      │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ Supabase Auth   │
│ Creates User    │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ Insert Profile  │
│ in users table  │
│ + approval_     │
│   status        │
└────────┬────────┘
         │
    ┌────┴────┐
    │         │
Admin ▼   Student/Caretaker ▼
┌─────────┐ ┌─────────────────┐
│approved │ │ pending         │
│Auto     │ │ Sign Out User   │
│Login &  │ │ Show "Pending   │
│Redirect │ │ Approval" Msg   │
└─────────┘ │ Redirect Login  │
            └─────────────────┘

User Login:
┌─────────────────┐
│ Login Form      │
│ Enter email,    │
│ password, role  │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ useAuth()       │
│ login()         │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ Supabase Auth   │
│ Validates       │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ Load Profile &  │
│ Verify Role     │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ Check approval  │
│ _status         │
└────────┬────────┘
         │
    ┌────┴────┬────────┐
    │         │        │
pending▼   rejected▼  approved▼
┌─────────┐ ┌──────┐ ┌─────────┐
│Show Err │ │Show  │ │Set User │
│Sign Out │ │Error │ │Redirect │
└─────────┘ │+Reason│ │Dashboard│
            │SignOut│ └─────────┘
            └───────┘

Route Protection:
┌─────────────────┐
│ User Navigates  │
│ to /dashboard   │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ middleware.ts   │
│ Runs First      │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ Check Session   │
│ in Supabase     │
└────────┬────────┘
         │
    ┌────┴────┐
    │         │
Valid ▼     Invalid ▼
┌─────────┐ ┌─────────┐
│ Allow   │ │Redirect │
│ Access  │ │to Login │
└─────────┘ └─────────┘
```

## 📊 Database Schema

```
┌────────────────┐
│  auth.users    │ (Supabase managed)
│  (Auth System) │
└───────┬────────┘
        │
        │ id (UUID)
        ▼
┌────────────────┐
│     users      │ ← Your user profiles
│  (role-based)  │
└───────┬────────┘
        │
        ├─────────────┬────────────┬──────────────┬──────────────┐
        │             │            │              │              │
        ▼             ▼            ▼              ▼              ▼
┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐
│  issues  │  │announce. │  │lost_found│  │residents │  │notifica. │
└──────────┘  └──────────┘  └──────────┘  └──────────┘  └──────────┘

        │
        ▼
┌────────────────┐
│  audit_logs    │
└────────────────┘
```

## 🎯 Next Steps After Setup

1. **Test Authentication**: Follow `SETUP_CHECKLIST.md`
2. **Read Documentation**: Start with `SUPABASE_SETUP.md`
3. **Build Features**: Use database tables for functionality
4. **Add File Uploads**: Set up Supabase Storage
5. **Enable Realtime**: For live updates

## 📝 Quick Commands

```bash
# Development
pnpm dev              # Start dev server
pnpm build            # Build for production
pnpm start            # Start production server

# Database
# Run supabase-schema.sql in Supabase SQL Editor
# Run demo-users.sql after creating auth users
```

## 🔗 Important Links

- **Supabase Dashboard**: https://supabase.com/dashboard
- **Project Settings**: Dashboard → Settings → API
- **SQL Editor**: Dashboard → SQL Editor
- **Table Editor**: Dashboard → Table Editor
- **Authentication**: Dashboard → Authentication → Users

---

**Need help?** Check the documentation files listed above! 📚
