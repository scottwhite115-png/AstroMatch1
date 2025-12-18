-- ============================================
-- MIGRATION 005: GEO SEARCH FUNCTION
-- Function to find profiles within radius
-- ============================================

-- Function to get profiles within a certain radius
CREATE OR REPLACE FUNCTION public.profiles_within_radius(
  user_lat DOUBLE PRECISION,
  user_lon DOUBLE PRECISION,
  radius_km INTEGER DEFAULT 50
)
RETURNS TABLE (
  id UUID,
  display_name TEXT,
  age INTEGER,
  birthdate DATE,
  western_sign TEXT,
  chinese_sign TEXT,
  tropical_western_sign TEXT,
  sidereal_western_sign TEXT,
  photos TEXT[],
  bio TEXT,
  occupation TEXT,
  height TEXT,
  religion TEXT,
  children_preference TEXT,
  city TEXT,
  location_name TEXT,
  distance_km DOUBLE PRECISION,
  interests TEXT[],
  relationship_goals TEXT[],
  gender TEXT,
  profile_complete BOOLEAN,
  account_active BOOLEAN,
  lat DOUBLE PRECISION,
  lon DOUBLE PRECISION
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    p.id,
    p.display_name,
    p.age,
    p.birthdate,
    p.western_sign,
    p.chinese_sign,
    p.tropical_western_sign,
    p.sidereal_western_sign,
    p.photos,
    p.bio,
    p.occupation,
    p.height,
    p.religion,
    p.children_preference,
    p.city,
    p.location_name,
    earth_distance(
      ll_to_earth(user_lat, user_lon),
      ll_to_earth(p.lat, p.lon)
    ) / 1000.0 AS distance_km,
    p.interests,
    p.relationship_goals,
    p.gender,
    p.profile_complete,
    p.account_active,
    p.lat,
    p.lon
  FROM public.profiles p
  WHERE p.lat IS NOT NULL 
    AND p.lon IS NOT NULL
    AND earth_distance(
      ll_to_earth(user_lat, user_lon),
      ll_to_earth(p.lat, p.lon)
    ) <= (radius_km * 1000.0)
  ORDER BY earth_distance(
    ll_to_earth(user_lat, user_lon),
    ll_to_earth(p.lat, p.lon)
  )
  LIMIT 100;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

COMMENT ON FUNCTION public.profiles_within_radius IS 
  'Get profiles within specified radius (km) from user location, ordered by distance';

-- Grant execute permission
GRANT EXECUTE ON FUNCTION public.profiles_within_radius TO authenticated;

