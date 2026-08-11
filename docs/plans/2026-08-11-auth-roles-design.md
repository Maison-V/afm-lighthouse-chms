# Auth, Roles & Public Site — Design

Date: 2026-08-11
Status: Approved
Branch: `feature/auth-roles`

## Goal

Add sign-in for admins and members to the AFM Lighthouse CHMS, with role-based
access, an admin-approval workflow, a public church site, and removal of the
Finance sector from the website (handled privately going forward).

## Decisions (agreed with owner)

1. **Auth provider:** Supabase Auth, email + password (existing stubs in `src/lib/supabase/`).
2. **Members:** sign up without approval (`status=approved` immediately). They see the
   public site (announcements/advertisements, events, ministries — read-only).
3. **Admins:** sign up with `status=pending` and must be approved by an existing approved
   admin. Approved admins see every module in the CHMS.
4. **Approval workflow:** lives in Settings under a new "Admin Approvals" section
   (admin-only). The first admin is seeded in SQL.
5. **Public site:** new `(public)` route group — no auth required for home
   (announcements), events, and ministries. Same URLs render the full admin view for
   approved admins (adaptive layout).
6. **Finance:** removed from nav, routes, dashboard, reports, and notifications.
   Finance components (`src/components/finance/*`) and the `Transaction` type are kept
   in the repo for the private finance tooling.

## Schema (Supabase)

`supabase/schema.sql` — run in the Supabase SQL editor:

- `profiles` (1:1 with `auth.users`): `id`, `full_name`, `email`, `role`
  (`admin`|`member`), `status` (`approved`|`pending`|`rejected`), timestamps.
- `announcements`: `id`, `title`, `body`, `category`, `starts_at`, `ends_at`,
  `published`, `created_by`, timestamps.
- Trigger `handle_new_user` auto-creates a profile on signup: `role` comes from
  `raw_user_meta_data.role` (defaults `member`), `status` is `approved` for members
  and `pending` for admin requests.
- RLS: users read/update their own profile; approved admins read/update all (via a
  `security definer` `is_admin()` helper). Announcements are readable by everyone,
  writable by approved admins.
- Documented seed block for the first admin (SQL comment + instructions).

## Routes

| URL | Access | Content |
|---|---|---|
| `/` | public | Announcements home (hero, feed, upcoming events, service times) |
| `/events` | public / member / admin | Read-only grid; full admin grid when approved admin |
| `/ministries` | public / member / admin | Read-only list; admin list when approved admin |
| `/login` | guest | Email + password sign-in |
| `/register` | guest | Full name, email, password, role (member/admin) |
| `/pending-approval` | pending admin | "Awaiting approval" screen |
| `/dashboard` … `/settings` | approved admin | Existing CHMS (`(app)` group) |
| `/announcements` | approved admin | Create / publish / archive announcements |

## Middleware

`src/middleware.ts` — Supabase session check per request:

- Not configured (no env keys) → allow all (mock-data demo mode).
- No session + protected path → redirect `/login?next=…`.
- Pending admin → only `/pending-approval`.
- Approved admin → everything; `/` and auth pages redirect to `/dashboard`.
- Member → protected paths redirect to `/`; never sees `(app)` group.

## Components

- `src/components/site/site-header.tsx`, `site-footer.tsx` — public/community chrome.
- `src/components/auth/sign-out-button.tsx` — wired into sidebar, mobile nav, navbar,
  site header, and pending-approval screen.
- `src/components/events/events-admin-view.tsx` / `events-public-view.tsx`,
  `src/components/ministries/ministries-admin-view.tsx` / `ministries-public-view.tsx`
  — page content extracted from the current `(app)` pages so the same URL can render
  either variant.
- `src/components/announcements/announcements-manager.tsx` — admin CRUD (client state
  + Supabase writes when configured, `sonner` feedback otherwise).

## Data helpers

- `src/lib/auth.ts` — `isSupabaseConfigured()`, `getCurrentProfile()` (server).
- `src/lib/data.ts` — `getAnnouncements()` (Supabase when configured, mock fallback).
- `src/lib/nav.ts` — Finance removed; `Announcements` added; role set split out.
- `src/lib/types.ts` — `Profile`, `Announcement`, `UserRole`, `ProfileStatus`.
  `Transaction` and finance types retained (unused).

## Sign-out of scope

- Finance deletion (kept as code per owner decision).
- Public event registration / QR check-in.
- Password reset flow (Supabase handles via email link later if required).