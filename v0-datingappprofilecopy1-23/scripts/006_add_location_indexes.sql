-- Migration: Add location optimization
-- Enable PostGIS or earthdistance extension for efficient geo queries

-- Enable the cube extension (required by earthdistance)
CREATE EXTENSION IF NOT EXISTS cube;

-- Enable the earthdistance extension
CREATE EXTENSION IF NOT EXISTS earthdistance;

-- Add indexes for location-based queries
CREATE INDEX IF NOT EXISTS profiles_location_idx 
ON profiles USING gist (ll_to_earth(latitude, longitude));

-- Add index for zodiac signs (for filtering)
CREATE INDEX IF NOT EXISTS profiles_zodiac_idx 
ON profiles (western_sign, chinese_sign)
WHERE western_sign IS NOT NULL AND chinese_sign IS NOT NULL;

-- Add index for activity filtering
CREATE INDEX IF NOT EXISTS profiles_last_active_idx 
ON profiles (last_active_at DESC NULLS LAST);

-- Add composite index for common queries
CREATE INDEX IF NOT EXISTS profiles_active_location_idx 
ON profiles (last_active_at DESC, western_sign, chinese_sign)
WHERE latitude IS NOT NULL 
  AND longitude IS NOT NULL 
  AND western_sign IS NOT NULL 
  AND chinese_sign IS NOT NULL;

-- Add function to calculate distance in km
CREATE OR REPLACE FUNCTION calculate_distance_km(
  lat1 DOUBLE PRECISION,
  lon1 DOUBLE PRECISION,
  lat2 DOUBLE PRECISION,
  lon2 DOUBLE PRECISION
)
RETURNS DOUBLE PRECISION
LANGUAGE SQL
IMMUTABLE
AS $$
  SELECT earth_distance(
    ll_to_earth(lat1, lon1),
    ll_to_earth(lat2, lon2)
  ) / 1000.0; -- Convert meters to kilometers
$$;

-- Add view for matchable profiles (has all required fields)
CREATE OR REPLACE VIEW matchable_profiles AS
SELECT 
  id,
  full_name,
  date_of_birth,
  western_sign,
  chinese_sign,
  latitude,
  longitude,
  last_active_at,
  avatar_url,
  bio,
  occupation,
  city,
  height,
  children,
  interests,
  aspirations,
  CONCAT(western_sign, '-', chinese_sign) as west_east
FROM profiles
WHERE western_sign IS NOT NULL
  AND chinese_sign IS NOT NULL
  AND latitude IS NOT NULL
  AND longitude IS NOT NULL;

-- Add comment for documentation
COMMENT ON INDEX profiles_location_idx IS 'GiST index for efficient radius queries using earthdistance';
COMMENT ON INDEX profiles_zodiac_idx IS 'Index for filtering by zodiac signs';
COMMENT ON INDEX profiles_last_active_idx IS 'Index for sorting by recent activity';
COMMENT ON FUNCTION calculate_distance_km IS 'Calculate distance between two GPS coordinates in kilometers';
COMMENT ON VIEW matchable_profiles IS 'Profiles with all required fields for matching (zodiac + location)';

