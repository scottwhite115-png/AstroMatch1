-- ============================================
-- COMPLETE SUPABASE SETUP
-- Run this entire file in Supabase SQL Editor
-- ============================================

-- PROFILES TABLE
-- ============================================
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  display_name text,
  west_east text,
  photo_url text,
  email text,
  phone text,
  email_verified boolean default false,
  phone_verified boolean default false,
  lat double precision,
  lon double precision,
  last_active timestamptz default now(),
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  onboarding_needed boolean default true,
  birthdate date,
  gender text,
  constraint lat_range check (lat is null or (lat between -90 and 90)),
  constraint lon_range check (lon is null or (lon between -180 and 180))
);

-- GEO INDEXES
-- ============================================
create extension if not exists cube;
create extension if not exists earthdistance;
create index if not exists idx_profiles_earth on public.profiles
  using gist (ll_to_earth(lat, lon));
create index if not exists idx_profiles_west_east on public.profiles (west_east)
  where west_east is not null;
create index if not exists idx_profiles_last_active on public.profiles (last_active desc nulls last);

-- RLS POLICIES
-- ============================================
alter table public.profiles enable row level security;

create policy read_public_profiles
on public.profiles for select using (true);

create policy insert_own_profile
on public.profiles for insert with check (auth.uid() = id);

create policy update_own_profile
on public.profiles for update using (auth.uid() = id) with check (auth.uid() = id);

-- UPDATED_AT TRIGGER
-- ============================================
create or replace function public.tg_profiles_updated_at()
returns trigger as $$
begin new.updated_at = now(); return new; end; $$ language plpgsql;

drop trigger if exists trg_profiles_updated_at on public.profiles;
create trigger trg_profiles_updated_at
before update on public.profiles
for each row execute function public.tg_profiles_updated_at();

-- ONBOARDING COMPLETENESS
-- ============================================

-- Helper to check if onboarding is complete
create or replace function public.recompute_onboarding_needed(p public.profiles)
returns boolean language sql immutable as $$
  select not (
    coalesce(p.display_name,'') <> '' and
    p.birthdate is not null and
    coalesce(p.gender,'') <> '' and
    coalesce(p.west_east,'') <> ''
  );
$$;

-- Auto-update onboarding_needed flag
create or replace function public.tg_profiles_onboarding()
returns trigger as $$
begin
  new.onboarding_needed := public.recompute_onboarding_needed(new);
  return new;
end; $$ language plpgsql;

drop trigger if exists trg_profiles_onboarding on public.profiles;
create trigger trg_profiles_onboarding
before insert or update on public.profiles
for each row execute function public.tg_profiles_onboarding();

-- AUTH TRIGGERS
-- ============================================

-- Auto-create profile on signup
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email, display_name, photo_url, email_verified, phone_verified)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'name',''),
    new.raw_user_meta_data->>'avatar_url',
    new.email_confirmed_at is not null,
    new.phone_confirmed_at is not null
  );
  return new;
end; $$ language plpgsql security definer;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
after insert on auth.users
for each row execute function public.handle_new_user();

-- Sync verification status
create or replace function public.sync_verification_flags()
returns trigger as $$
begin
  update public.profiles
     set email_verified = (new.email_confirmed_at is not null),
         phone_verified = (new.phone_confirmed_at is not null),
         email = new.email
   where id = new.id;
  return new;
end; $$ language plpgsql security definer;

drop trigger if exists on_auth_user_updated on auth.users;
create trigger on_auth_user_updated
after update on auth.users
for each row execute function public.sync_verification_flags();

-- LOCATION RPC FUNCTIONS
-- ============================================

-- Get profiles within radius (fast geo query)
create or replace function profiles_within_radius(
  user_lat double precision,
  user_lon double precision,
  radius_m integer,
  limit_count integer default 100,
  exclude_id uuid default null
)
returns table (
  id uuid,
  display_name text,
  west_east text,
  photo_url text,
  lat double precision,
  lon double precision,
  last_active timestamptz,
  distance_m double precision,
  distance_km double precision
)
language sql stable
as $$
  select 
    p.id, p.display_name, p.west_east, p.photo_url,
    p.lat, p.lon, p.last_active,
    earth_distance(ll_to_earth(user_lat, user_lon), ll_to_earth(p.lat, p.lon)) as distance_m,
    earth_distance(ll_to_earth(user_lat, user_lon), ll_to_earth(p.lat, p.lon)) / 1000.0 as distance_km
  from public.profiles p
  where p.west_east is not null
    and p.lat is not null
    and p.lon is not null
    and (exclude_id is null or p.id != exclude_id)
    and earth_distance(ll_to_earth(user_lat, user_lon), ll_to_earth(p.lat, p.lon)) < radius_m
  order by distance_m asc
  limit limit_count;
$$;

-- Count nearby profiles
create or replace function count_profiles_in_radius(
  user_lat double precision,
  user_lon double precision,
  radius_m integer
)
returns integer
language sql stable
as $$
  select count(*)::integer
  from public.profiles p
  where p.west_east is not null
    and p.lat is not null
    and p.lon is not null
    and earth_distance(ll_to_earth(user_lat, user_lon), ll_to_earth(p.lat, p.lon)) < radius_m;
$$;

-- Update last active timestamp
create or replace function update_last_active(user_id uuid)
returns void
language sql volatile
as $$
  update public.profiles set last_active = now() where id = user_id;
$$;

-- Get active profiles (within time window)
create or replace function active_profiles_within_radius(
  user_lat double precision,
  user_lon double precision,
  radius_m integer,
  hours_threshold integer default 168,
  limit_count integer default 100
)
returns table (
  id uuid,
  display_name text,
  west_east text,
  photo_url text,
  lat double precision,
  lon double precision,
  last_active timestamptz,
  distance_km double precision,
  hours_since_active double precision
)
language sql stable
as $$
  select 
    p.id, p.display_name, p.west_east, p.photo_url,
    p.lat, p.lon, p.last_active,
    earth_distance(ll_to_earth(user_lat, user_lon), ll_to_earth(p.lat, p.lon)) / 1000.0 as distance_km,
    extract(epoch from (now() - p.last_active)) / 3600 as hours_since_active
  from public.profiles p
  where p.west_east is not null
    and p.lat is not null
    and p.lon is not null
    and p.last_active is not null
    and p.last_active > now() - (hours_threshold || ' hours')::interval
    and earth_distance(ll_to_earth(user_lat, user_lon), ll_to_earth(p.lat, p.lon)) < radius_m
  order by p.last_active desc
  limit limit_count;
$$;

-- GRANT PERMISSIONS
-- ============================================
grant execute on function profiles_within_radius to authenticated;
grant execute on function count_profiles_in_radius to authenticated;
grant execute on function update_last_active to authenticated;
grant execute on function active_profiles_within_radius to authenticated;

-- ============================================
-- DONE! Database is ready.
-- ============================================

