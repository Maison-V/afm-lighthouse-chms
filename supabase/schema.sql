-- ============================================================================
-- AFM Lighthouse Church Vryburg — Auth, profiles & announcements schema
-- Run this in the Supabase SQL editor. See docs/plans/2026-08-11-auth-roles-design.md
-- ============================================================================

-- ----------------------------------------------------------------------------
-- profiles — 1:1 with auth.users. role decides what a user can see; status
-- gates admins until an existing admin approves them.
-- ----------------------------------------------------------------------------
create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  full_name text not null default '',
  email text,
  role text not null default 'member' check (role in ('admin', 'member')),
  status text not null default 'approved' check (status in ('approved', 'pending', 'rejected')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.profiles enable row level security;

-- security definer helper: is the current user an approved admin?
create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.profiles
    where id = auth.uid() and role = 'admin' and status = 'approved'
  );
$$;

-- Users read and update their own profile; approved admins manage everyone.
drop policy if exists "profiles select own or admin" on public.profiles;
create policy "profiles select own or admin"
  on public.profiles for select
  using (auth.uid() = id or public.is_admin());

drop policy if exists "profiles insert own" on public.profiles;
create policy "profiles insert own"
  on public.profiles for insert
  with check (auth.uid() = id);

drop policy if exists "profiles update own or admin" on public.profiles;
create policy "profiles update own or admin"
  on public.profiles for update
  using (auth.uid() = id or public.is_admin())
  with check (auth.uid() = id or public.is_admin());

drop policy if exists "profiles delete admin" on public.profiles;
create policy "profiles delete admin"
  on public.profiles for delete
  using (public.is_admin());

-- ----------------------------------------------------------------------------
-- announcements — the church's advertisements. Readable by everyone (public
-- site and members), written only by approved admins.
-- ----------------------------------------------------------------------------
create table if not exists public.announcements (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  body text not null default '',
  category text not null default 'notice' check (category in ('service', 'event', 'notice', 'outreach', 'social')),
  starts_at timestamptz not null default now(),
  ends_at timestamptz,
  published boolean not null default true,
  created_by uuid references public.profiles (id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.announcements enable row level security;

drop policy if exists "announcements select public" on public.announcements;
create policy "announcements select public"
  on public.announcements for select
  using (published = true or public.is_admin());

drop policy if exists "announcements insert admin" on public.announcements;
create policy "announcements insert admin"
  on public.announcements for insert
  with check (public.is_admin());

drop policy if exists "announcements update admin" on public.announcements;
create policy "announcements update admin"
  on public.announcements for update
  using (public.is_admin())
  with check (public.is_admin());

drop policy if exists "announcements delete admin" on public.announcements;
create policy "announcements delete admin"
  on public.announcements for delete
  using (public.is_admin());

-- ----------------------------------------------------------------------------
-- Trigger: auto-create a profile row on signup. Role is chosen at registration
-- (raw_user_meta_data.role); members are approved instantly, admins stay
-- "pending" until an existing approved admin approves them.
-- ----------------------------------------------------------------------------
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  chosen_role text := coalesce(new.raw_user_meta_data ->> 'role', 'member');
begin
  insert into public.profiles (id, full_name, email, role, status)
  values (
    new.id,
    coalesce(new.raw_user_meta_data ->> 'full_name', ''),
    new.email,
    case when chosen_role = 'admin' then 'admin' else 'member' end,
    case when chosen_role = 'admin' then 'pending' else 'approved' end
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ----------------------------------------------------------------------------
-- Seed the first admin (run ONCE, after creating your account):
--
--  1. Create the first administrator's account through the Supabase dashboard
--     (Authentication > Users > Add user) — e.g. pastor@afmlighthouse.church.
--  2. Copy the new user's UUID and run:
--
--     update public.profiles
--     set role = 'admin', status = 'approved'
--     where id = 'REPLACE_WITH_USER_UUID';
--
-- From then on, new admin registrations appear in Settings > Admin Approvals.
-- ----------------------------------------------------------------------------

-- ============================================================================
-- Church data — members, visitors, events, ministries, attendance, certificates
-- All admin-managed records. Public site can only read events, ministries and
-- announcements; anyone can submit an event registration.
-- ============================================================================

-- ----------------------------------------------------------------------------
-- members — the church roster (admin-managed; NOT linked to auth accounts)
-- ----------------------------------------------------------------------------
create table if not exists public.members (
  id uuid primary key default gen_random_uuid(),
  first_name text not null,
  last_name text not null,
  email text,
  phone text,
  status text not null default 'new' check (status in ('active', 'new', 'inactive', 'transferred')),
  joined_at date not null default current_date,
  birthday text, -- MM-DD
  address text,
  ministries text[] not null default '{}',
  volunteer_status text not null default 'none' check (volunteer_status in ('volunteer', 'leader', 'none')),
  family jsonb not null default '[]',
  children jsonb not null default '[]',
  attendance_rate int not null default 0,
  notes jsonb not null default '[]',
  documents jsonb not null default '[]',
  timeline jsonb not null default '[]',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.members enable row level security;

drop policy if exists "members select admin" on public.members;
create policy "members select admin"
  on public.members for select using (public.is_admin());
drop policy if exists "members insert admin" on public.members;
create policy "members insert admin"
  on public.members for insert with check (public.is_admin());
drop policy if exists "members update admin" on public.members;
create policy "members update admin"
  on public.members for update using (public.is_admin()) with check (public.is_admin());
drop policy if exists "members delete admin" on public.members;
create policy "members delete admin"
  on public.members for delete using (public.is_admin());

-- ----------------------------------------------------------------------------
-- visitors — first-time guests tracked through follow-up
-- ----------------------------------------------------------------------------
create table if not exists public.visitors (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text,
  phone text,
  first_visit date not null default current_date,
  source text,
  assigned_to text,
  follow_up_status text not null default 'new' check (follow_up_status in ('new', 'contacted', 'visited', 'integrated', 'lost')),
  visits int not null default 1,
  prayer_request text,
  notes text not null default '',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.visitors enable row level security;

drop policy if exists "visitors select admin" on public.visitors;
create policy "visitors select admin"
  on public.visitors for select using (public.is_admin());
drop policy if exists "visitors insert admin" on public.visitors;
create policy "visitors insert admin"
  on public.visitors for insert with check (public.is_admin());
drop policy if exists "visitors update admin" on public.visitors;
create policy "visitors update admin"
  on public.visitors for update using (public.is_admin()) with check (public.is_admin());
drop policy if exists "visitors delete admin" on public.visitors;
create policy "visitors delete admin"
  on public.visitors for delete using (public.is_admin());

-- ----------------------------------------------------------------------------
-- events — the church calendar. Public can read, admins manage.
-- registered counts come from event_registrations.
-- ----------------------------------------------------------------------------
create table if not exists public.events (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  category text not null default 'service' check (category in ('service', 'conference', 'outreach', 'training', 'social')),
  date text not null, -- YYYY-MM-DD
  time text not null default '09:00',
  location text not null default 'Main Auditorium',
  capacity int not null default 100,
  check_in_enabled boolean not null default false,
  description text not null default '',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.events enable row level security;

drop policy if exists "events select public" on public.events;
create policy "events select public"
  on public.events for select using (true);
drop policy if exists "events insert admin" on public.events;
create policy "events insert admin"
  on public.events for insert with check (public.is_admin());
drop policy if exists "events update admin" on public.events;
create policy "events update admin"
  on public.events for update using (public.is_admin()) with check (public.is_admin());
drop policy if exists "events delete admin" on public.events;
create policy "events delete admin"
  on public.events for delete using (public.is_admin());

-- ----------------------------------------------------------------------------
-- event_registrations — anyone can register for a public event
-- ----------------------------------------------------------------------------
create table if not exists public.event_registrations (
  id uuid primary key default gen_random_uuid(),
  event_id uuid not null references public.events (id) on delete cascade,
  name text not null,
  email text,
  phone text,
  created_at timestamptz not null default now()
);

alter table public.event_registrations enable row level security;

drop policy if exists "event_registrations insert public" on public.event_registrations;
create policy "event_registrations insert public"
  on public.event_registrations for insert with check (true);
drop policy if exists "event_registrations select admin" on public.event_registrations;
create policy "event_registrations select admin"
  on public.event_registrations for select using (public.is_admin());
drop policy if exists "event_registrations delete admin" on public.event_registrations;
create policy "event_registrations delete admin"
  on public.event_registrations for delete using (public.is_admin());

-- ----------------------------------------------------------------------------
-- ministries — teams and departments shown on the public site
-- ----------------------------------------------------------------------------
create table if not exists public.ministries (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  name text not null,
  description text not null default '',
  leader text,
  member_count int not null default 0,
  color text not null default '#2D6ECF',
  meeting_schedule text,
  upcoming_event text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.ministries enable row level security;

drop policy if exists "ministries select public" on public.ministries;
create policy "ministries select public"
  on public.ministries for select using (true);
drop policy if exists "ministries insert admin" on public.ministries;
create policy "ministries insert admin"
  on public.ministries for insert with check (public.is_admin());
drop policy if exists "ministries update admin" on public.ministries;
create policy "ministries update admin"
  on public.ministries for update using (public.is_admin()) with check (public.is_admin());
drop policy if exists "ministries delete admin" on public.ministries;
create policy "ministries delete admin"
  on public.ministries for delete using (public.is_admin());

-- ----------------------------------------------------------------------------
-- attendance — per-service head counts
-- ----------------------------------------------------------------------------
create table if not exists public.attendance (
  id uuid primary key default gen_random_uuid(),
  date text not null, -- YYYY-MM-DD
  service text not null default 'Sunday Morning Service',
  men int not null default 0,
  women int not null default 0,
  children int not null default 0,
  visitors int not null default 0,
  total int not null default 0,
  created_at timestamptz not null default now()
);

alter table public.attendance enable row level security;

drop policy if exists "attendance select admin" on public.attendance;
create policy "attendance select admin"
  on public.attendance for select using (public.is_admin());
drop policy if exists "attendance insert admin" on public.attendance;
create policy "attendance insert admin"
  on public.attendance for insert with check (public.is_admin());
drop policy if exists "attendance update admin" on public.attendance;
create policy "attendance update admin"
  on public.attendance for update using (public.is_admin()) with check (public.is_admin());
drop policy if exists "attendance delete admin" on public.attendance;
create policy "attendance delete admin"
  on public.attendance for delete using (public.is_admin());

-- ----------------------------------------------------------------------------
-- certificates — issued certificate records (PDFs generated from the record)
-- ----------------------------------------------------------------------------
create table if not exists public.certificates (
  id uuid primary key default gen_random_uuid(),
  type text not null check (type in ('baptism', 'membership', 'marriage', 'dedication', 'confirmation')),
  recipient text not null,
  date_issued date not null default current_date,
  issued_by text,
  status text not null default 'issued' check (status in ('issued', 'draft')),
  created_at timestamptz not null default now()
);

alter table public.certificates enable row level security;

drop policy if exists "certificates select admin" on public.certificates;
create policy "certificates select admin"
  on public.certificates for select using (public.is_admin());
drop policy if exists "certificates insert admin" on public.certificates;
create policy "certificates insert admin"
  on public.certificates for insert with check (public.is_admin());
drop policy if exists "certificates delete admin" on public.certificates;
create policy "certificates delete admin"
  on public.certificates for delete using (public.is_admin());
-- ----------------------------------------------------------------------------
-- church_settings — single-row church profile used across certificates,
-- reports and the public site. Seeded with defaults (SQL editor bypasses RLS).
-- ----------------------------------------------------------------------------
create table if not exists public.church_settings (
  id int primary key default 1 check (id = 1),
  church_name text not null default 'AFM Lighthouse Church Vryburg',
  denomination text not null default 'Apostolic Faith Mission',
  address text not null default 'Church Street, Vryburg, North West',
  phone text not null default '+27 53 927 0000',
  email text not null default 'office@afmlighthouse.church',
  senior_pastor text not null default 'Pastor Kabelo Sithole',
  logo_url text,
  brand_colors jsonb not null default '{"primary":"#123E73","secondary":"#2D6ECF","gold":"#C9A227"}',
  updated_at timestamptz not null default now()
);

alter table public.church_settings enable row level security;

drop policy if exists "church_settings select public" on public.church_settings;
create policy "church_settings select public"
  on public.church_settings for select using (true);
drop policy if exists "church_settings update admin" on public.church_settings;
create policy "church_settings update admin"
  on public.church_settings for update using (public.is_admin()) with check (public.is_admin());

insert into public.church_settings (id) values (1) on conflict (id) do nothing;

-- ----------------------------------------------------------------------------
-- user_settings — per-user preferences (notification toggles, etc.)
-- ----------------------------------------------------------------------------
create table if not exists public.user_settings (
  user_id uuid primary key references public.profiles (id) on delete cascade,
  notifications jsonb not null default '{}',
  updated_at timestamptz not null default now()
);

alter table public.user_settings enable row level security;

drop policy if exists "user_settings select own" on public.user_settings;
create policy "user_settings select own"
  on public.user_settings for select using (auth.uid() = user_id);
drop policy if exists "user_settings insert own" on public.user_settings;
create policy "user_settings insert own"
  on public.user_settings for insert with check (auth.uid() = user_id);
drop policy if exists "user_settings update own" on public.user_settings;
create policy "user_settings update own"
  on public.user_settings for update using (auth.uid() = user_id) with check (auth.uid() = user_id);
