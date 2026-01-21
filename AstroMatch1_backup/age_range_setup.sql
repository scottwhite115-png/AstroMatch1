-- 1. Store the user's age range preferences (if you don't already)
create table if not exists preferences (
  user_id uuid primary key references auth.users(id) on delete cascade,
  age_min int not null default 18,
  age_max int not null default 99,
  updated_at timestamptz not null default now()
);

-- 2. Your user profile table needs a birthdate
--    (Assuming you already have this. If not:)
-- create table if not exists profiles (
--   id uuid primary key references auth.users(id) on delete cascade,
--   birthdate date not null, -- YYYY-MM-DD
--   ... other fields ...
-- );

-- 3. A stable, indexable way to filter by age from a birthdate.
--    Age X means birthdate between [today - (X+1) years + 1 day, today - X years]
--    We'll compute dates in the user's main TZ (Australia/Brisbane), but store UTC.
create or replace function brisbane_today() returns date language sql stable as $$
  select (now() at time zone 'Australia/Brisbane')::date
$$;

-- For performance, index birthdate
create index if not exists profiles_birthdate_idx on profiles(birthdate);

-- 4. RPC to fetch matches inside the viewer's saved age range.
--    Excludes the viewer, honors RLS.
create or replace function matches_by_age_range(viewer uuid)
returns setof profiles
language sql
security definer
set search_path = public
as $$
  with my_pref as (
    select age_min, age_max
    from preferences
    where user_id = viewer
  ),
  limits as (
    select
      -- Upper and lower birthdate bounds derived from requested ages
      -- birthdate must be between oldest_allowed and youngest_allowed
      -- Example: age_min = 25 -> oldest_allowed = (today - 99y) cap; we compute exactly below.
      -- We construct exact windows for age_min..age_max
      (brisbane_today() - make_interval(years => (select age_max from my_pref))) as youngest_birthdate, -- age_max => youngest allowed birthdate
      (brisbane_today() - make_interval(years => (select age_min from my_pref)) + interval '1 day') as oldest_birthdate_plus1
  )
  select p.*
  from profiles p, limits l
  where p.id <> viewer
    and p.birthdate >= l.youngest_birthdate::date
    and p.birthdate <  l.oldest_birthdate_plus1::date
  order by p.birthdate desc; -- younger first (optional)
$$;

-- 5. RLS (example policies; adapt to your app's model)
alter table preferences enable row level security;
alter table profiles enable row level security;

-- Users can read their own preference row
create policy "read own prefs" on preferences
for select using (auth.uid() = user_id);

-- Users can upsert their own preference row
create policy "write own prefs" on preferences
for insert with check (auth.uid() = user_id);
create policy "update own prefs" on preferences
for update using (auth.uid() = user_id);

-- Profiles: allow users to read all (for discovering matches),
-- or restrict as you need (e.g., only verified users, same region, etc.)
create policy "read profiles for discovery" on profiles
for select using (true);

-- 6. (Optional) A tiny view to expose computed age if you ever need it:
create or replace view profiles_with_age as
select
  p.*,
  extract(year from age(brisbane_today()::timestamp, p.birthdate::timestamp))::int as age_years
from profiles p;
