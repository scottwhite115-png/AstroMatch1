-- Migration script to add location columns to existing profiles table
-- Run this if your profiles table already exists without location fields

-- Add latitude column if it doesn't exist
do $$
begin
  if not exists (select 1 from information_schema.columns 
                 where table_schema = 'public' 
                 and table_name = 'profiles' 
                 and column_name = 'latitude') then
    alter table public.profiles add column latitude double precision;
  end if;
end $$;

-- Add longitude column if it doesn't exist
do $$
begin
  if not exists (select 1 from information_schema.columns 
                 where table_schema = 'public' 
                 and table_name = 'profiles' 
                 and column_name = 'longitude') then
    alter table public.profiles add column longitude double precision;
  end if;
end $$;

-- Add location_updated_at column if it doesn't exist
do $$
begin
  if not exists (select 1 from information_schema.columns 
                 where table_schema = 'public' 
                 and table_name = 'profiles' 
                 and column_name = 'location_updated_at') then
    alter table public.profiles add column location_updated_at timestamp with time zone;
  end if;
end $$;

-- Add email_verified column if it doesn't exist
do $$
begin
  if not exists (select 1 from information_schema.columns 
                 where table_schema = 'public' 
                 and table_name = 'profiles' 
                 and column_name = 'email_verified') then
    alter table public.profiles add column email_verified boolean default false;
  end if;
end $$;

-- Create index for location-based queries (for efficient nearby user searches)
create index if not exists profiles_location_idx on public.profiles(latitude, longitude) 
where latitude is not null and longitude is not null;

-- Create a function to calculate distance between two points (in kilometers)
create or replace function public.calculate_distance(
  lat1 double precision,
  lon1 double precision,
  lat2 double precision,
  lon2 double precision
)
returns double precision
language plpgsql
immutable
as $$
declare
  r double precision := 6371; -- Earth's radius in kilometers
  dlat double precision;
  dlon double precision;
  a double precision;
  c double precision;
begin
  dlat := radians(lat2 - lat1);
  dlon := radians(lon2 - lon1);
  a := sin(dlat/2) * sin(dlat/2) + cos(radians(lat1)) * cos(radians(lat2)) * sin(dlon/2) * sin(dlon/2);
  c := 2 * atan2(sqrt(a), sqrt(1-a));
  return r * c;
end;
$$;

-- Create a function to find nearby users within a certain radius (in kilometers)
create or replace function public.find_nearby_profiles(
  user_lat double precision,
  user_lon double precision,
  radius_km double precision default 50
)
returns table (
  id uuid,
  full_name text,
  age integer,
  bio text,
  zodiac_sign text,
  chinese_zodiac text,
  location text,
  photos text[],
  distance_km double precision
)
language plpgsql
security definer
as $$
begin
  return query
  select 
    p.id,
    p.full_name,
    p.age,
    p.bio,
    p.zodiac_sign,
    p.chinese_zodiac,
    p.location,
    p.photos,
    calculate_distance(user_lat, user_lon, p.latitude, p.longitude) as distance_km
  from public.profiles p
  where 
    p.latitude is not null 
    and p.longitude is not null
    and p.id != auth.uid() -- Exclude current user
    and calculate_distance(user_lat, user_lon, p.latitude, p.longitude) <= radius_km
    -- Exclude blocked users
    and not exists (
      select 1 from public.blocked_users bu
      where (bu.user_id = auth.uid() and bu.blocked_user_id = p.id)
         or (bu.user_id = p.id and bu.blocked_user_id = auth.uid())
    )
  order by distance_km asc;
end;
$$;

