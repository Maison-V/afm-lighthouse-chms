# AFM Lighthouse Church Vryburg — Church Management System

A premium, enterprise-grade Church Management System (ChMS) frontend, built to feel like modern
SaaS software (Stripe / Linear / Notion / Vercel) rather than a typical church website — while
keeping a warm, faith-rooted identity.

## Tech stack

- **Next.js 15** (App Router, Server Components by default)
- **React 19** + **TypeScript**
- **Tailwind CSS v4** (CSS-first config via `@theme`/`@config`, tokens in `src/app/globals.css`)
- **shadcn/ui**-style components on top of **Radix UI** primitives
- **Framer Motion** for micro-interactions
- **React Hook Form** + **Zod** for validated forms
- **TanStack Table** + **TanStack Query**
- **Recharts** for charts
- **Supabase** client stubs (`src/lib/supabase`) — ready to wire up, see below
- Deploys to **Vercel** with zero configuration

## Getting started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) — it redirects to `/dashboard`.

To build for production:

```bash
npm run build
npm run start
```

This project was built and verified with a real `npm run build` — every route compiles and
prerenders cleanly (see the route list printed at the end of the build).

## Project structure

```
src/
  app/
    (app)/                 # Authenticated app shell (sidebar + navbar + mobile nav)
      dashboard/
      members/
        [id]/              # Member profile (tabs: overview, family, attendance, docs, notes)
      visitors/             # Follow-up kanban board
      ministries/
        [slug]/            # Ministry dashboard (tabs: dashboard, members, schedule, reports)
      events/               # Event grid + detail dialog (registration, QR check-in)
      finance/              # Income/expense charts, budgets, transactions
      certificates/         # Live certificate generator + history
      attendance/           # Service records + trend chart
      reports/
      settings/             # General, Users & Roles, Branding, Notifications
    layout.tsx              # Root layout: fonts, theme provider, query provider, toaster
    globals.css              # Design tokens (light/dark), base styles, utilities
  components/
    ui/                     # Reusable primitives (button, card, dialog, table, etc.)
    layout/                 # Sidebar, Navbar, MobileNav, BottomNav, Fab, AppShell
    shared/                 # PageHeader, StatCard, EmptyState, LighthouseMark (brand mark)
    dashboard/ members/ visitors/ ministries/ events/ finance/ certificates/ attendance/
  lib/
    types.ts                # Domain types (Member, Visitor, Ministry, Event, Transaction, …)
    mock-data.ts             # Realistic mock data powering every module
    nav.ts                   # Single source of truth for sidebar/mobile nav items
    supabase/                # Browser + server Supabase clients (stubbed, ready to connect)
    utils.ts                 # cn(), formatCurrency(), formatDate(), initials()
```

## Design system

All tokens live in `src/app/globals.css` as CSS variables, mapped into Tailwind via
`tailwind.config.ts`. They were derived directly from the brand brief:

| Token | Light | Dark |
|---|---|---|
| Primary (Royal Blue) | `#123E73` | brightened for contrast |
| Secondary (Royal Blue accent) | `#2D6ECF` | — |
| Gold accent | `#C9A227` | — |
| Background | `#F7F9FC` | deep navy-black |
| Border | `#E5E7EB` | — |

**Signature design choice:** the sidebar is a fixed, glassmorphic deep-navy panel that does
**not** flip with the light/dark toggle — only the content canvas does. An animated gold "beam"
tracks the active nav item. This is the one deliberate, distinctive visual signature tying the
"lighthouse" brand to the UI without ever drawing a literal lighthouse icon in the body content
(per the brief's instruction to avoid clichés).

Typography: **Cinzel** (headings), **Montserrat** (subheadings), **Inter** (body/UI/tables),
**Libre Baskerville italic** (scripture quotes) — loaded via `next/font/google` in
`src/app/layout.tsx`.

Radii: cards `18px`, buttons/inputs `12px`, dialogs `24px` — encoded as `rounded-card`,
`rounded-button`, `rounded-input`, `rounded-dialog` utilities.

## Connecting real data (Supabase)

Every module currently reads from `src/lib/mock-data.ts` so the whole app is explorable without
any backend. To connect a real Supabase project:

1. Create a project at [supabase.com](https://supabase.com) and copy `.env.example` to `.env.local`,
   filling in `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY`.
2. Design tables matching (or extending) the shapes in `src/lib/types.ts`.
3. Swap the mock-data imports in each page/component for calls through
   `src/lib/supabase/server.ts` (Server Components) or `src/lib/supabase/client.ts` (interactive
   client components), and move to `TanStack Query` for client-side caching where useful.
4. Add Supabase Auth for real login (the navbar user menu and sidebar logout button are stubbed
   and ready to wire up).

## What's fully built vs. scaffolded

Fully built with realistic mock data, interactions, and empty/loading states: **Dashboard,
Members (list + profile), Visitors, Ministries (list + detail), Events, Finance, Certificates,
Attendance, Reports, Settings.**

Interactive patterns demonstrated (reusable across the rest of the app as you connect real data):
searchable/sortable/filterable TanStack table (Members), kanban-style board (Visitors), tabbed
detail views (Member profile, Ministry detail), validated dialog forms with React Hook Form + Zod
(Add Member), a live-updating certificate generator, and animated stat cards.

## Deploying

Push this to GitHub and import it in Vercel — no configuration needed. Add your environment
variables from `.env.example` in the Vercel project settings once Supabase is connected.
