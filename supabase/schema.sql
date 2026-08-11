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
create policy "profiles select own or admin"
  on public.profiles for select
  using (auth.uid() = id or public.is_admin());

create policy "profiles insert own"
  on public.profiles for insert
  with check (auth.uid() = id);

create policy "profiles update own or admin"
  on public.profiles for update
  using (auth.uid() = id or public.is_admin())
  with check (auth.uid() = id or public.is_admin());

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

create policy "announcements select public"
  on public.announcements for select
  using (published = true or public.is_admin());

create policy "announcements insert admin"
  on public.announcements for insert
  with check (public.is_admin());

create policy "announcements update admin"
  on public.announcements for update
  using (public.is_admin())
  with check (public.is_admin());

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