/**
 * Haversine formula implementation
 * Calculate distance in kilometers between two GPS coordinates
 */

export interface GeoPoint {
  lat: number;
  lon: number;
}

/**
 * Calculate distance between two points in kilometers
 */
export function kmBetween(
  a: { lat: number; lon: number },
  b: { lat: number; lon: number }
): number {
  const R = 6371; // Earth's radius in kilometers
  const dLat = toRad(b.lat - a.lat);
  const dLon = toRad(b.lon - a.lon);
  const lat1 = toRad(a.lat);
  const lat2 = toRad(b.lat);
  
  const x =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1) * Math.cos(lat2) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  
  const c = 2 * Math.atan2(Math.sqrt(x), Math.sqrt(1 - x));
  
  return R * c;
}

/**
 * Calculate distance in miles
 */
export function milesBetween(
  a: { lat: number; lon: number },
  b: { lat: number; lon: number }
): number {
  return kmBetween(a, b) * 0.621371; // Convert km to miles
}

/**
 * Convert degrees to radians
 */
function toRad(degrees: number): number {
  return (degrees * Math.PI) / 180;
}

/**
 * Check if point is within radius
 */
export function isWithinRadius(
  center: { lat: number; lon: number },
  point: { lat: number; lon: number },
  radiusKm: number
): boolean {
  return kmBetween(center, point) <= radiusKm;
}

/**
 * Filter points by distance from center
 */
export function filterByDistance<T extends { lat: number; lon: number }>(
  center: { lat: number; lon: number },
  points: T[],
  maxDistanceKm: number
): Array<T & { distance: number }> {
  return points
    .map((point) => ({
      ...point,
      distance: kmBetween(center, point),
    }))
    .filter((point) => point.distance <= maxDistanceKm)
    .sort((a, b) => a.distance - b.distance);
}

/**
 * Get nearest N points
 */
export function getNearestPoints<T extends { lat: number; lon: number }>(
  center: { lat: number; lon: number },
  points: T[],
  limit: number = 10
): Array<T & { distance: number }> {
  return points
    .map((point) => ({
      ...point,
      distance: kmBetween(center, point),
    }))
    .sort((a, b) => a.distance - b.distance)
    .slice(0, limit);
}

/**
 * Format distance for display
 */
export function formatDistance(km: number, unit: "km" | "mi" = "km"): string {
  if (unit === "mi") {
    const miles = km * 0.621371;
    return miles < 1
      ? `${Math.round(miles * 5280)} ft`
      : `${miles.toFixed(1)} mi`;
  }
  
  return km < 1 ? `${Math.round(km * 1000)} m` : `${km.toFixed(1)} km`;
}

