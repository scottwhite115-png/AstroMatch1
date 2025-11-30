-- Migration: RPC functions for location-based matching
-- Version: 003
-- Description: Optimized functions for fetching profiles within radius

-- 1) Get profiles within radius with distance
CREATE OR REPLACE FUNCTION profiles_within_radius(
  user_lat DOUBLE PRECISION,
  user_lon DOUBLE PRECISION,
  radius_m INTEGER,
  limit_count INTEGER DEFAULT 100,
  exclude_id UUID DEFAULT NULL
)
RETURNS TABLE (
  id UUID,
  display_name TEXT,
  west_east TEXT,
  photo_url TEXT,
  lat DOUBLE PRECISION,
  lon DOUBLE PRECISION,
  last_active TIMESTAMPTZ,
  distance_m DOUBLE PRECISION,
  distance_km DOUBLE PRECISION
)
LANGUAGE SQL
STABLE
AS $$
  SELECT 
    p.id,
    p.display_name,
    p.west_east,
    p.photo_url,
    p.lat,
    p.lon,
    p.last_active,
    earth_distance(
      ll_to_earth(user_lat, user_lon),
      ll_to_earth(p.lat, p.lon)
    ) as distance_m,
    earth_distance(
      ll_to_earth(user_lat, user_lon),
      ll_to_earth(p.lat, p.lon)
    ) / 1000.0 as distance_km
  FROM public.profiles p
  WHERE p.west_east IS NOT NULL
    AND p.lat IS NOT NULL
    AND p.lon IS NOT NULL
    AND (exclude_id IS NULL OR p.id != exclude_id)
    AND earth_distance(
      ll_to_earth(user_lat, user_lon),
      ll_to_earth(p.lat, p.lon)
    ) < radius_m
  ORDER BY distance_m ASC
  LIMIT limit_count;
$$;

-- 2) Count profiles in radius (for UI stats)
CREATE OR REPLACE FUNCTION count_profiles_in_radius(
  user_lat DOUBLE PRECISION,
  user_lon DOUBLE PRECISION,
  radius_m INTEGER
)
RETURNS INTEGER
LANGUAGE SQL
STABLE
AS $$
  SELECT COUNT(*)::INTEGER
  FROM public.profiles p
  WHERE p.west_east IS NOT NULL
    AND p.lat IS NOT NULL
    AND p.lon IS NOT NULL
    AND earth_distance(
      ll_to_earth(user_lat, user_lon),
      ll_to_earth(p.lat, p.lon)
    ) < radius_m;
$$;

-- 3) Get active profiles within radius
CREATE OR REPLACE FUNCTION active_profiles_within_radius(
  user_lat DOUBLE PRECISION,
  user_lon DOUBLE PRECISION,
  radius_m INTEGER,
  hours_threshold INTEGER DEFAULT 168, -- 7 days
  limit_count INTEGER DEFAULT 100
)
RETURNS TABLE (
  id UUID,
  display_name TEXT,
  west_east TEXT,
  photo_url TEXT,
  lat DOUBLE PRECISION,
  lon DOUBLE PRECISION,
  last_active TIMESTAMPTZ,
  distance_km DOUBLE PRECISION,
  hours_since_active DOUBLE PRECISION
)
LANGUAGE SQL
STABLE
AS $$
  SELECT 
    p.id,
    p.display_name,
    p.west_east,
    p.photo_url,
    p.lat,
    p.lon,
    p.last_active,
    earth_distance(
      ll_to_earth(user_lat, user_lon),
      ll_to_earth(p.lat, p.lon)
    ) / 1000.0 as distance_km,
    EXTRACT(EPOCH FROM (NOW() - p.last_active)) / 3600 as hours_since_active
  FROM public.profiles p
  WHERE p.west_east IS NOT NULL
    AND p.lat IS NOT NULL
    AND p.lon IS NOT NULL
    AND p.last_active IS NOT NULL
    AND p.last_active > NOW() - (hours_threshold || ' hours')::INTERVAL
    AND earth_distance(
      ll_to_earth(user_lat, user_lon),
      ll_to_earth(p.lat, p.lon)
    ) < radius_m
  ORDER BY p.last_active DESC
  LIMIT limit_count;
$$;

-- 4) Update user's last_active timestamp
CREATE OR REPLACE FUNCTION update_last_active(user_id UUID)
RETURNS VOID
LANGUAGE SQL
VOLATILE
AS $$
  UPDATE public.profiles
  SET last_active = NOW()
  WHERE id = user_id;
$$;

-- 5) Get zodiac distribution in area
CREATE OR REPLACE FUNCTION get_zodiac_distribution(
  user_lat DOUBLE PRECISION,
  user_lon DOUBLE PRECISION,
  radius_m INTEGER
)
RETURNS TABLE (
  zodiac_combo TEXT,
  count BIGINT
)
LANGUAGE SQL
STABLE
AS $$
  SELECT 
    p.west_east as zodiac_combo,
    COUNT(*) as count
  FROM public.profiles p
  WHERE p.west_east IS NOT NULL
    AND p.lat IS NOT NULL
    AND p.lon IS NOT NULL
    AND earth_distance(
      ll_to_earth(user_lat, user_lon),
      ll_to_earth(p.lat, p.lon)
    ) < radius_m
  GROUP BY zodiac_combo
  ORDER BY count DESC;
$$;

-- 6) Grant permissions
GRANT EXECUTE ON FUNCTION profiles_within_radius TO authenticated;
GRANT EXECUTE ON FUNCTION count_profiles_in_radius TO authenticated;
GRANT EXECUTE ON FUNCTION active_profiles_within_radius TO authenticated;
GRANT EXECUTE ON FUNCTION update_last_active TO authenticated;
GRANT EXECUTE ON FUNCTION get_zodiac_distribution TO authenticated;

-- 7) Comments
COMMENT ON FUNCTION profiles_within_radius IS 'Get profiles within radius with distance calculation';
COMMENT ON FUNCTION count_profiles_in_radius IS 'Count matchable profiles in area without fetching data';
COMMENT ON FUNCTION active_profiles_within_radius IS 'Get recently active profiles within radius';
COMMENT ON FUNCTION update_last_active IS 'Update user last active timestamp';
COMMENT ON FUNCTION get_zodiac_distribution IS 'Get distribution of zodiac combinations in area';

