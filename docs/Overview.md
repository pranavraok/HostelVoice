# HostelVoice — Project Overview

This is a simple, human-friendly summary of what exists in the project today, how it works, and what’s left to do. It’s aimed at anyone joining the project (product, design, backend, frontend).

## What This App Is
- A Next.js app for hostel management with three roles: Student, Caretaker, Admin.
- Public marketing page, auth flows (login/register), and a role-based dashboard with feature pages.
- UI is polished and responsive; data is currently demo/static.

## Tech Stack
- Framework: Next.js App Router
- Language: TypeScript + React
- Styling: Tailwind CSS + component library in [components/ui](components/ui)
- Icons: lucide-react
- Analytics: @vercel/analytics

## How Auth Works (Today)
- Client-only demo auth stored in localStorage via [lib/auth-context.tsx](lib/auth-context.tsx).
- Login accepts the demo emails shown on the login page; sets a `user` object and redirects to the dashboard.
- Dashboard layout protects routes: if no `user`, it redirects to `/login`.
- There is no real backend login yet; everything is simulated.

## App Structure (High-Level)
- Layouts
  - Root layout in [app/layout.tsx](app/layout.tsx) sets fonts, analytics, and wraps children with the auth provider.
  - Dashboard layout in [app/dashboard/layout.tsx](app/dashboard/layout.tsx) renders the role-based sidebar, mobile nav, and guards routes.
- Public pages
  - Landing: [app/page.tsx](app/page.tsx) — marketing page linking to login/register.
  - Login: [app/login/page.tsx](app/login/page.tsx) — demo sign-in by role.
  - Register: [app/register/page.tsx](app/register/page.tsx) — pick role.
  - Role registration forms: [app/register/admin/page.tsx](app/register/admin/page.tsx), [app/register/caretaker/page.tsx](app/register/caretaker/page.tsx), [app/register/student/page.tsx](app/register/student/page.tsx).
- Dashboard pages (require login)
  - Home: [app/dashboard/page.tsx](app/dashboard/page.tsx) — role-specific cards and shortcuts.
  - Analytics: [app/dashboard/analytics/page.tsx](app/dashboard/analytics/page.tsx) — system metrics (static data).
  - Announcements: [app/dashboard/announcements/page.tsx](app/dashboard/announcements/page.tsx) — view/post (caretaker only to post).
  - Announcements Manage (Admin): [app/dashboard/announcements-manage/page.tsx](app/dashboard/announcements-manage/page.tsx) — full CRUD (local state).
  - Issues: [app/dashboard/issues/page.tsx](app/dashboard/issues/page.tsx) — students report; caretakers view/manage.
  - Caretaker Issue Manager (component): [app/dashboard/issues/caretaker.tsx](app/dashboard/issues/caretaker.tsx) — dedicated caretaking UI (route file missing).
  - Lost & Found: [app/dashboard/lost-found/page.tsx](app/dashboard/lost-found/page.tsx) — report and browse items.
  - Residents: [app/dashboard/residents/page.tsx](app/dashboard/residents/page.tsx) — list with search/filter.
  - Management (Admin): [app/dashboard/management/page.tsx](app/dashboard/management/page.tsx) — hostels/caretakers tables and settings (static).

## What Each Role Sees (Now)
- Student
  - Dashboard shortcuts: Report Issue, View Announcements, Lost & Found.
  - Can submit issues; sees their statuses (data local only).
- Caretaker
  - Dashboard shortcuts: Manage Issues, Announcements, Residents.
  - Can view/manage issues; can post announcements.
- Admin
  - Dashboard shortcuts: Analytics, Announcements Manage, Management, Users (Users page not implemented yet).
  - Can manage announcements; view analytics; see management tables.

## Data Status
- All lists, stats, and forms use hardcoded data in component state.
- No `fetch` calls; no real APIs connected.
- Suggested endpoints and payloads exist in [docs/routes-overview.md](docs/routes-overview.md) if/when we wire a backend.

## Known Gaps / TODOs
- Missing route page for caretaker issues: create [app/dashboard/issues/caretaker/page.tsx](app/dashboard/issues/caretaker/page.tsx) to render the existing component.
- Missing Users page for Admin: create [app/dashboard/users/page.tsx](app/dashboard/users/page.tsx) and link it properly.
- Replace demo auth with real endpoints (`/api/auth/login`, `/api/auth/logout`, `/api/auth/me`).
- Replace in-component demo data with API calls for issues, announcements, lost-found, residents, hostels, analytics.

## How To Run Locally
- Requirements: Node.js 18+
- Scripts (from [package.json](package.json)):

```bash
pnpm install
pnpm dev
# or
npm install
npm run dev
# or
yarn
yarn dev
```

- The app starts on http://localhost:3000

## Quick Glossary
- Dashboard: Authenticated area with role-based navigation.
- Announcements: Broadcast updates; caretakers/admins can post.
- Issues: Maintenance or other problems reported by students; managed by caretakers.
- Lost & Found: Items reported as lost/found by the community.
- Residents: Directory for caretakers to view/search resident info.
- Management: Admin area to view hostels, caretakers, and settings.

## What’s Next (Suggested)
- Decide on backend stack and stand up auth + core entities (users, issues, announcements, items, residents, hostels).
- Wire the dashboard pages to real APIs with role-based access control.
- Add pagination and filtering where lists can grow.
- Add optimistic updates and toasts for create/update/delete operations.
