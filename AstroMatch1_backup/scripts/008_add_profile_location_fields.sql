alter table public.profiles
add column if not exists location_formatted text,
add column if not exists location_city text,
add column if not exists location_region text,
add column if not exists location_country text,
add column if not exists location_lat double precision,
add column if not exists location_lon double precision,
add column if not exists updated_at timestamptz;

-- optional: index for nearby searches later
create index if not exists profiles_location_lat_lon_idx on public.profiles (location_lat, location_lon);


