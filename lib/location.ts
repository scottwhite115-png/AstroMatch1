import { supabase } from "./supabaseClient";

export async function updateMyLocation() {
  if (!("geolocation" in navigator)) return null;
  const pos = await new Promise<GeolocationPosition>((res, rej) =>
    navigator.geolocation.getCurrentPosition(res, rej, { enableHighAccuracy: true, timeout: 10000 })
  );
  const { latitude: lat, longitude: lon } = pos.coords;
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;
  
  // Update location in Supabase
  await supabase
    .from('profiles')
    .update({ lat, lon, last_active: new Date().toISOString() })
    .eq('id', user.id);
    
  return { lat, lon };
}

export function kmBetween(a: { lat: number; lon: number }, b: { lat: number; lon: number }) {
  const R = 6371;
  const dLat = ((b.lat - a.lat) * Math.PI) / 180;
  const dLon = ((b.lon - a.lon) * Math.PI) / 180;
  const lat1 = (a.lat * Math.PI) / 180;
  const lat2 = (b.lat * Math.PI) / 180;
  const x =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(x), Math.sqrt(1 - x));
  return R * c;
}

// --- Privacy-respectful location utilities (installed for later Supabase reconnection) ---

export type LocationRecord = {
  formatted: string;
  city?: string | null;
  region?: string | null; // state/province
  country?: string | null;
  lat: number;
  lon: number;
  source: 'gps' | 'manual';
  timestamp: number; // ms since epoch
};

const LS_KEY = 'am_location_v1';

export function loadCachedLocation(maxAgeMs = 1000 * 60 * 60 * 24 * 7): LocationRecord | null {
  try {
    const raw = localStorage.getItem(LS_KEY);
    if (!raw) return null;
    const obj = JSON.parse(raw) as LocationRecord;
    if (!obj?.timestamp) return null;
    if (Date.now() - obj.timestamp > maxAgeMs) return null;
    return obj;
  } catch {
    return null;
  }
}

export function saveCachedLocation(loc: LocationRecord) {
  localStorage.setItem(LS_KEY, JSON.stringify(loc));
}

export function clearCachedLocation() {
  localStorage.removeItem(LS_KEY);
}

export function getGpsPosition(
  opts: PositionOptions = { enableHighAccuracy: true, timeout: 12000, maximumAge: 60000 }
): Promise<GeolocationPosition> {
  return new Promise((resolve, reject) => {
    if (!('geolocation' in navigator)) return reject(new Error('Geolocation not supported'));
    navigator.geolocation.getCurrentPosition(resolve, reject, opts);
  });
}

export async function reverseGeocode(lat: number, lon: number): Promise<Omit<LocationRecord, 'source' | 'timestamp'>> {
  const res = await fetch(`/api/reverse-geocode?lat=${lat}&lon=${lon}`, { method: 'GET' });
  if (!res.ok) throw new Error('Reverse geocode failed');
  const data = await res.json();
  // Expect: { formatted, city, region, country }
  return {
    formatted: data.formatted,
    city: data.city ?? null,
    region: data.region ?? null,
    country: data.country ?? null,
    lat,
    lon,
  };
}

export async function checkLocationPermission(): Promise<PermissionState> {
  if (typeof window === 'undefined' || !('permissions' in navigator)) {
    return 'prompt';
  }
  try {
    const result = await navigator.permissions.query({ name: 'geolocation' as PermissionName });
    return result.state;
  } catch {
    return 'prompt';
  }
}

export async function requestLocationPermission(): Promise<{ lat: number; lon: number } | null> {
  if (!('geolocation' in navigator)) {
    throw new Error('Geolocation is not supported by this browser');
  }
  
  return new Promise((resolve, reject) => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        resolve({
          lat: position.coords.latitude,
          lon: position.coords.longitude,
        });
      },
      (error) => {
        reject(error);
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 60000 }
    );
  });
}
