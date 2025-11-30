-- Create profiles table for user management
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  bio text,
  age integer,
  zodiac_sign text,
  chinese_zodiac text,
  location text,
  latitude double precision,
  longitude double precision,
  location_updated_at timestamp with time zone,
  email_verified boolean default false,
  interests text[],
  photos text[],
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS
alter table public.profiles enable row level security;

-- Create policies for profiles
create policy "profiles_select_own"
  on public.profiles for select
  using (auth.uid() = id);

create policy "profiles_insert_own"
  on public.profiles for insert
  with check (auth.uid() = id);

create policy "profiles_update_own"
  on public.profiles for update
  using (auth.uid() = id);

create policy "profiles_delete_own"
  on public.profiles for delete
  using (auth.uid() = id);

-- Allow users to view other profiles for matching
create policy "profiles_select_others"
  on public.profiles for select
  using (true);
