# 🏠 HostelVoice - Smart Hostel Management System

A comprehensive hostel management solution built with **Next.js 16**, **Supabase**, and **Tailwind CSS**. Features role-based authentication, issue tracking, announcements, lost & found management, and analytics.

[![Next.js](https://img.shields.io/badge/Next.js-16-black)](https://nextjs.org/)
[![Supabase](https://img.shields.io/badge/Supabase-Auth-green)](https://supabase.com/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9-blue)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-4.0-38bdf8)](https://tailwindcss.com/)

---

## ✨ Features

### 🔐 Authentication & Authorization
- **Role-based access control** (Student, Caretaker, Admin)
- Secure authentication with Supabase Auth
- Protected routes with automatic redirects
- Session management with automatic refresh

### 👥 User Roles

#### 🎓 Student
- Report and track issues
- View announcements
- Post/search lost & found items
- Personal dashboard

#### 🛠️ Caretaker
- Manage and resolve issues
- Create announcements
- Manage lost & found items
- View resident information

#### 👔 Admin
- Comprehensive analytics
- User management
- System-wide announcements
- Audit logs and reporting

### 🎯 Core Modules

- **📋 Issue Tracking** - Report and manage hostel issues/complaints
- **📢 Announcements** - Broadcast updates to students and staff
- **🔍 Lost & Found** - Track lost and found items
- **👥 Resident Management** - Student information and records
- **📊 Analytics** - Data-driven insights for administrators
- **🔔 Notifications** - Real-time in-app notifications

---

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ 
- pnpm (or npm/yarn)
- Supabase account

### Installation

1. **Clone the repository**
```bash
git clone <your-repo-url>
cd hostel-voice-pwa-build
```

2. **Install dependencies**
```bash
pnpm install
```

3. **Set up Supabase**
   - Create a new project at [supabase.com](https://supabase.com)
   - Get your credentials from Settings → API

4. **Configure environment variables**
```bash
# Create .env.local file
cp .env.example .env.local

# Add your Supabase credentials
NEXT_PUBLIC_SUPABASE_URL=your_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
```

5. **Set up database**
   - Open Supabase SQL Editor
   - Run `supabase-schema.sql`

6. **Start development server**
```bash
pnpm dev
```

7. **Open your browser**
   - Navigate to [http://localhost:3000](http://localhost:3000)
   - Register a new user to get started!

**📖 For detailed setup instructions, see [`SUPABASE_SETUP.md`](./SUPABASE_SETUP.md)**

---

## 📚 Documentation

Comprehensive documentation is available:

### Getting Started
- **[SETUP_COMPLETE.md](./SETUP_COMPLETE.md)** - Quick overview of what's been implemented
- **[SETUP_CHECKLIST.md](./SETUP_CHECKLIST.md)** - Step-by-step setup verification
- **[QUICK_REFERENCE.md](./QUICK_REFERENCE.md)** - Cheat sheet for common tasks

### In-Depth Guides
- **[SUPABASE_SETUP.md](./SUPABASE_SETUP.md)** - Complete Supabase configuration guide
- **[AUTH_README.md](./AUTH_README.md)** - Authentication system documentation
- **[PROJECT_STRUCTURE.md](./PROJECT_STRUCTURE.md)** - Code organization and architecture

### Reference
- **[SQL_COMMANDS_REFERENCE.md](./SQL_COMMANDS_REFERENCE.md)** - Database queries and schema
- **[.env.example](./.env.example)** - Environment variables template

---

## 🏗️ Tech Stack

### Frontend
- **[Next.js 16](https://nextjs.org/)** - React framework with App Router
- **[React 19](https://react.dev/)** - UI library
- **[TypeScript](https://www.typescriptlang.org/)** - Type safety
- **[Tailwind CSS](https://tailwindcss.com/)** - Utility-first CSS
- **[Shadcn/ui](https://ui.shadcn.com/)** - Beautiful UI components
- **[Lucide Icons](https://lucide.dev/)** - Icon library

### Backend & Database
- **[Supabase](https://supabase.com/)** - Backend as a Service
  - Authentication
  - PostgreSQL Database
  - Row Level Security (RLS)
  - Real-time subscriptions
  - Storage for file uploads

### Development Tools
- **[pnpm](https://pnpm.io/)** - Fast, disk space efficient package manager
- **[ESLint](https://eslint.org/)** - Code linting
- **[Vercel Analytics](https://vercel.com/analytics)** - Usage analytics

---

## 📁 Project Structure

```
hostel-voice-pwa-build/
├── app/                      # Next.js App Router
│   ├── (auth)/              # Auth pages
│   │   ├── login/
│   │   └── register/
│   ├── dashboard/           # Protected dashboard
│   │   ├── analytics/
│   │   ├── announcements/
│   │   ├── issues/
│   │   ├── lost-found/
│   │   └── residents/
│   └── page.tsx             # Landing page
├── components/              # React components
│   └── ui/                  # Shadcn UI components
├── lib/                     # Utilities and configs
│   ├── auth-context.tsx     # Authentication context
│   └── supabase/           # Supabase clients
├── public/                  # Static assets
├── supabase-schema.sql      # Database schema
└── *.md                     # Documentation files
```

---

## 🗄️ Database Schema

### Tables

1. **users** - User profiles with role-based fields
2. **issues** - Issue/complaint tracking
3. **announcements** - System announcements
4. **lost_found** - Lost and found items
5. **residents** - Additional student information
6. **notifications** - User notifications
7. **audit_logs** - Action tracking

All tables include:
- Row Level Security (RLS) policies
- Proper indexes for performance
- Foreign key relationships
- Automatic timestamp management

**See [SQL_COMMANDS_REFERENCE.md](./SQL_COMMANDS_REFERENCE.md) for details**

---

## 🔐 Security

- ✅ **Row Level Security (RLS)** - Database-level access control
- ✅ **Password hashing** - Secure password storage via Supabase
- ✅ **Role-based access** - Users can only access permitted resources
- ✅ **Protected routes** - Middleware guards all dashboard pages
- ✅ **Session management** - Automatic token refresh
- ✅ **Environment variables** - Sensitive data never committed

---

## 🧪 Testing

### Create Test Users

```bash
# Start dev server
pnpm dev

# Register test users at http://localhost:3000/register
# Or use demo credentials (after setup):

Student: student@hostelvoice.com / password123
Caretaker: caretaker@hostelvoice.com / password123
Admin: admin@hostelvoice.com / password123
```

### Verify Setup

Follow the checklist in [`SETUP_CHECKLIST.md`](./SETUP_CHECKLIST.md)

---

## 📦 Build & Deploy

### Build for Production

```bash
pnpm build
```

### Start Production Server

```bash
pnpm start
```

### Deploy to Vercel

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new)

1. Push code to GitHub
2. Import repository in Vercel
3. Add environment variables:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
4. Deploy!

---

## 🛠️ Development

### Available Scripts

```bash
pnpm dev          # Start development server
pnpm build        # Build for production
pnpm start        # Start production server
pnpm lint         # Run ESLint
```

### Database Development

```bash
# Access Supabase Dashboard
# SQL Editor: Run custom queries
# Table Editor: View/edit data
# Authentication: Manage users
```

---

## 🎨 Customization

### Add New User Role

1. Update `UserRole` type in `lib/auth-context.tsx`
2. Update database check constraint in `supabase-schema.sql`
3. Add RLS policies for the new role
4. Update UI to show role option

### Modify User Fields

1. Update `User` interface in `lib/auth-context.tsx`
2. Update database `users` table schema
3. Update registration forms

### Change Theme

Edit `app/globals.css` for global styles or modify Tailwind config.

---

## 🐛 Troubleshooting

### Common Issues

**"Invalid API credentials"**
- Check `.env.local` has correct Supabase values
- Restart dev server after changing env variables

**"Table does not exist"**
- Run `supabase-schema.sql` in Supabase SQL Editor

**"Permission denied"**
- Check Row Level Security policies
- Verify user role matches expected permissions

**More help:** See [SUPABASE_SETUP.md - Troubleshooting](./SUPABASE_SETUP.md#troubleshooting)

---

## 🤝 Contributing

Contributions are welcome! Please:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

---

## 🙏 Acknowledgments

- [Next.js](https://nextjs.org/) - The React Framework
- [Supabase](https://supabase.com/) - Open Source Firebase Alternative
- [Shadcn/ui](https://ui.shadcn.com/) - Beautiful UI Components
- [Tailwind CSS](https://tailwindcss.com/) - Utility-first CSS Framework
- [Vercel](https://vercel.com/) - Deployment Platform

---

## 📞 Support

- **Documentation**: Check the `*.md` files in the project root
- **Issues**: [GitHub Issues](https://github.com/your-repo/issues)
- **Supabase Help**: [Discord](https://discord.supabase.com)
- **Next.js Help**: [Documentation](https://nextjs.org/docs)

---

## 🗺️ Roadmap

### Current Version (v1.0)
- ✅ User authentication with role-based access
- ✅ Issue tracking system
- ✅ Announcements module
- ✅ Lost & found management
- ✅ Basic analytics

### Upcoming Features
- [ ] File upload for issues (Supabase Storage)
- [ ] Real-time notifications
- [ ] Email notifications
- [ ] Advanced analytics dashboard
- [ ] Mobile app (React Native)
- [ ] Payment integration for rent
- [ ] Visitor management system
- [ ] Room allocation system

---

## 📊 Screenshots

### Landing Page
Modern, responsive landing page with role selection.

### Dashboard
Role-specific dashboards with relevant features and analytics.

### Issue Management
Report, track, and resolve hostel issues efficiently.

---

## ⭐ Show Your Support

Give a ⭐️ if this project helped you!

---

<div align="center">

**Built with ❤️ for better hostel management**

[Documentation](./SUPABASE_SETUP.md) • [Quick Start](./QUICK_REFERENCE.md) • [Report Bug](https://github.com/your-repo/issues) • [Request Feature](https://github.com/your-repo/issues)

</div>
