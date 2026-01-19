-- Additional RPC functions for optimized queries

-- Count profiles within radius (for stats/UI)
CREATE OR REPLACE FUNCTION count_profiles_in_radius(
  lat DOUBLE PRECISION,
  lon DOUBLE PRECISION,
  radius_m INTEGER
)
RETURNS INTEGER
LANGUAGE SQL
STABLE
AS $$
  SELECT COUNT(*)::INTEGER
  FROM profiles p
  WHERE p.western_sign IS NOT NULL
    AND p.chinese_sign IS NOT NULL
    AND p.latitude IS NOT NULL
    AND p.longitude IS NOT NULL
    AND earth_distance(
      ll_to_earth(lat, lon),
      ll_to_earth(p.latitude, p.longitude)
    ) < radius_m;
$$;

-- Calculate distances for specific profile IDs
CREATE OR REPLACE FUNCTION calculate_profile_distances(
  lat DOUBLE PRECISION,
  lon DOUBLE PRECISION,
  profile_ids UUID[]
)
RETURNS TABLE (
  id UUID,
  distance_km DOUBLE PRECISION
)
LANGUAGE SQL
STABLE
AS $$
  SELECT 
    p.id,
    earth_distance(
      ll_to_earth(lat, lon),
      ll_to_earth(p.latitude, p.longitude)
    ) / 1000.0 as distance_km
  FROM profiles p
  WHERE p.id = ANY(profile_ids)
    AND p.latitude IS NOT NULL
    AND p.longitude IS NOT NULL;
$$;

-- Get active users within radius (active in last 7 days)
CREATE OR REPLACE FUNCTION active_profiles_within_radius(
  lat DOUBLE PRECISION,
  lon DOUBLE PRECISION,
  radius_m INTEGER,
  hours_threshold INTEGER DEFAULT 168, -- 7 days
  limit_count INTEGER DEFAULT 100
)
RETURNS TABLE (
  id UUID,
  full_name TEXT,
  western_sign TEXT,
  chinese_sign TEXT,
  latitude DOUBLE PRECISION,
  longitude DOUBLE PRECISION,
  last_active_at TIMESTAMP WITH TIME ZONE,
  avatar_url TEXT,
  distance_m DOUBLE PRECISION,
  hours_since_active DOUBLE PRECISION
)
LANGUAGE SQL
STABLE
AS $$
  SELECT 
    p.id,
    p.full_name,
    p.western_sign,
    p.chinese_sign,
    p.latitude,
    p.longitude,
    p.last_active_at,
    p.avatar_url,
    earth_distance(
      ll_to_earth(lat, lon),
      ll_to_earth(p.latitude, p.longitude)
    ) as distance_m,
    EXTRACT(EPOCH FROM (NOW() - p.last_active_at)) / 3600 as hours_since_active
  FROM profiles p
  WHERE p.western_sign IS NOT NULL
    AND p.chinese_sign IS NOT NULL
    AND p.latitude IS NOT NULL
    AND p.longitude IS NOT NULL
    AND p.last_active_at IS NOT NULL
    AND p.last_active_at > NOW() - (hours_threshold || ' hours')::INTERVAL
    AND earth_distance(
      ll_to_earth(lat, lon),
      ll_to_earth(p.latitude, p.longitude)
    ) < radius_m
  ORDER BY p.last_active_at DESC
  LIMIT limit_count;
$$;

-- Get compatibility insights for specific zodiac combinations
CREATE OR REPLACE FUNCTION get_zodiac_distribution(
  lat DOUBLE PRECISION,
  lon DOUBLE PRECISION,
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
    CONCAT(p.western_sign, '-', p.chinese_sign) as zodiac_combo,
    COUNT(*) as count
  FROM profiles p
  WHERE p.western_sign IS NOT NULL
    AND p.chinese_sign IS NOT NULL
    AND p.latitude IS NOT NULL
    AND p.longitude IS NOT NULL
    AND earth_distance(
      ll_to_earth(lat, lon),
      ll_to_earth(p.latitude, p.longitude)
    ) < radius_m
  GROUP BY zodiac_combo
  ORDER BY count DESC;
$$;

-- Grant permissions
GRANT EXECUTE ON FUNCTION count_profiles_in_radius TO authenticated;
GRANT EXECUTE ON FUNCTION calculate_profile_distances TO authenticated;
GRANT EXECUTE ON FUNCTION active_profiles_within_radius TO authenticated;
GRANT EXECUTE ON FUNCTION get_zodiac_distribution TO authenticated;

-- Add comments
COMMENT ON FUNCTION count_profiles_in_radius IS 'Count matchable profiles within radius without fetching data';
COMMENT ON FUNCTION calculate_profile_distances IS 'Calculate distances for specific profile IDs';
COMMENT ON FUNCTION active_profiles_within_radius IS 'Get recently active profiles within radius';
COMMENT ON FUNCTION get_zodiac_distribution IS 'Get distribution of zodiac combinations in area';

