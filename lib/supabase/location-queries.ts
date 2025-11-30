/**
 * Optimized Supabase queries for location-based matching
 * Uses PostgreSQL earthdistance extension for efficient geo queries
 */

import { SupabaseClient } from "@supabase/supabase-js";

export interface LocationQueryOptions {
  userLat: number;
  userLon: number;
  radiusKm: number;
  limit?: number;
  excludeUserId?: string;
}

/**
 * Fetch profiles within radius using optimized earth_distance query
 * This uses the GiST index for fast lookups
 */
export async function fetchProfilesInRadius(
  supabase: SupabaseClient,
  options: LocationQueryOptions
) {
  const { userLat, userLon, radiusKm, limit = 100, excludeUserId } = options;
  const radiusMeters = radiusKm * 1000;

  // Use RPC call for complex query with earth_distance
  const { data, error } = await supabase.rpc("profiles_within_radius", {
    lat: userLat,
    lon: userLon,
    radius_m: radiusMeters,
    limit_count: limit,
    exclude_id: excludeUserId || null,
  });

  if (error) {
    console.error("Error fetching profiles in radius:", error);
    throw error;
  }

  return data;
}

/**
 * Fetch profiles using bounding box (faster but less accurate)
 * Good for initial filtering before precise distance calculation
 */
export async function fetchProfilesInBoundingBox(
  supabase: SupabaseClient,
  options: LocationQueryOptions
) {
  const { userLat, userLon, radiusKm, limit = 100, excludeUserId } = options;

  // Calculate bounding box
  // Approximate: 1 degree latitude ≈ 111 km
  // 1 degree longitude varies by latitude
  const latDelta = radiusKm / 111.0;
  const lonDelta = radiusKm / (111.0 * Math.cos((userLat * Math.PI) / 180));

  let query = supabase
    .from("profiles")
    .select("*")
    .gte("latitude", userLat - latDelta)
    .lte("latitude", userLat + latDelta)
    .gte("longitude", userLon - lonDelta)
    .lte("longitude", userLon + lonDelta)
    .not("western_sign", "is", null)
    .not("chinese_sign", "is", null)
    .limit(limit);

  if (excludeUserId) {
    query = query.neq("id", excludeUserId);
  }

  const { data, error } = await query;

  if (error) {
    console.error("Error fetching profiles in bounding box:", error);
    throw error;
  }

  return data;
}

/**
 * Fetch matchable profiles (has zodiac + location)
 * Uses the materialized view for better performance
 */
export async function fetchMatchableProfiles(
  supabase: SupabaseClient,
  excludeUserId?: string
) {
  let query = supabase.from("matchable_profiles").select("*");

  if (excludeUserId) {
    query = query.neq("id", excludeUserId);
  }

  const { data, error } = await query;

  if (error) {
    console.error("Error fetching matchable profiles:", error);
    throw error;
  }

  return data;
}

/**
 * Create RPC function in Supabase for radius queries
 * Run this SQL in your Supabase SQL editor:
 */
export const CREATE_RADIUS_FUNCTION_SQL = `
-- RPC function for fetching profiles within radius
CREATE OR REPLACE FUNCTION profiles_within_radius(
  lat DOUBLE PRECISION,
  lon DOUBLE PRECISION,
  radius_m INTEGER,
  limit_count INTEGER DEFAULT 100,
  exclude_id UUID DEFAULT NULL
)
RETURNS TABLE (
  id UUID,
  full_name TEXT,
  date_of_birth DATE,
  western_sign TEXT,
  chinese_sign TEXT,
  latitude DOUBLE PRECISION,
  longitude DOUBLE PRECISION,
  last_active_at TIMESTAMP WITH TIME ZONE,
  avatar_url TEXT,
  bio TEXT,
  occupation TEXT,
  city TEXT,
  height TEXT,
  children TEXT,
  interests TEXT,
  aspirations TEXT,
  distance_m DOUBLE PRECISION,
  west_east TEXT
)
LANGUAGE SQL
STABLE
AS $$
  SELECT 
    p.id,
    p.full_name,
    p.date_of_birth,
    p.western_sign,
    p.chinese_sign,
    p.latitude,
    p.longitude,
    p.last_active_at,
    p.avatar_url,
    p.bio,
    p.occupation,
    p.city,
    p.height,
    p.children,
    p.interests,
    p.aspirations,
    earth_distance(
      ll_to_earth(lat, lon),
      ll_to_earth(p.latitude, p.longitude)
    ) as distance_m,
    CONCAT(p.western_sign, '-', p.chinese_sign) as west_east
  FROM profiles p
  WHERE p.western_sign IS NOT NULL
    AND p.chinese_sign IS NOT NULL
    AND p.latitude IS NOT NULL
    AND p.longitude IS NOT NULL
    AND (exclude_id IS NULL OR p.id != exclude_id)
    AND earth_distance(
      ll_to_earth(lat, lon),
      ll_to_earth(p.latitude, p.longitude)
    ) < radius_m
  ORDER BY distance_m ASC
  LIMIT limit_count;
$$;

-- Grant execute permission
GRANT EXECUTE ON FUNCTION profiles_within_radius TO authenticated;
`;

/**
 * Batch fetch profiles with distance calculation
 */
export async function batchFetchWithDistance(
  supabase: SupabaseClient,
  userLat: number,
  userLon: number,
  profileIds: string[]
) {
  const { data, error } = await supabase.rpc("calculate_profile_distances", {
    lat: userLat,
    lon: userLon,
    profile_ids: profileIds,
  });

  if (error) {
    console.error("Error calculating distances:", error);
    throw error;
  }

  return data;
}

/**
 * Update user's last active timestamp
 */
export async function updateLastActive(
  supabase: SupabaseClient,
  userId: string
) {
  const { error } = await supabase
    .from("profiles")
    .update({ last_active_at: new Date().toISOString() })
    .eq("id", userId);

  if (error) {
    console.error("Error updating last active:", error);
    throw error;
  }
}

/**
 * Get nearby user count without fetching full profiles
 */
export async function getNearbyCount(
  supabase: SupabaseClient,
  userLat: number,
  userLon: number,
  radiusKm: number
): Promise<number> {
  const { data, error } = await supabase.rpc("count_profiles_in_radius", {
    lat: userLat,
    lon: userLon,
    radius_m: radiusKm * 1000,
  });

  if (error) {
    console.error("Error counting nearby profiles:", error);
    return 0;
  }

  return data || 0;
}

