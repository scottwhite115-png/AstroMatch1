/**
 * Location hooks
 * React hooks for location access and updates
 */

import { useEffect, useState, useCallback } from "react";
import {
  getCurrentLocation,
  updateMyLocation,
  checkLocationPermission,
  getCachedLocation,
  type Coordinates,
} from "@/lib/location";

/**
 * Auto-update location on app start
 * Throttled to prevent excessive updates
 */
export function useLocationOnStart(throttleMinutes: number = 6) {
  useEffect(() => {
    const lastUpdateKey = "loc_last";
    const last = Number(localStorage.getItem(lastUpdateKey) || 0);
    const throttleMs = throttleMinutes * 60 * 1000;

    // Skip if recently updated
    if (Date.now() - last < throttleMs) return;

    updateMyLocation()
      .then(() => {
        localStorage.setItem(lastUpdateKey, String(Date.now()));
      })
      .catch((error) => {
        // Silently ignore permission denials
        console.debug("Location update skipped:", error.message);
      });
  }, [throttleMinutes]);
}

/**
 * Get current location with loading/error states
 */
export function useCurrentLocation() {
  const [location, setLocation] = useState<Coordinates | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchLocation = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const coords = await getCurrentLocation();
      setLocation(coords);
      return coords;
    } catch (err: any) {
      console.error("Location error:", err);
      setError(err.message || "Failed to get location");
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  return { location, loading, error, fetchLocation };
}

/**
 * Check and track location permission status
 */
export function useLocationPermission() {
  const [permission, setPermission] = useState<PermissionState>("prompt");
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    const checkPermission = async () => {
      const state = await checkLocationPermission();
      setPermission(state);
      setChecking(false);
    };

    checkPermission();

    // Listen for permission changes (if supported)
    if (navigator.permissions) {
      navigator.permissions
        .query({ name: "geolocation" })
        .then((result) => {
          result.addEventListener("change", () => {
            setPermission(result.state);
          });
        })
        .catch(() => {
          // Permission API not fully supported
        });
    }
  }, []);

  return { permission, checking };
}

/**
 * Get location with fallback to cached
 */
export function useLocationWithCache() {
  const [location, setLocation] = useState<Coordinates | null>(() =>
    getCachedLocation()
  );
  const [source, setSource] = useState<"live" | "cached" | null>(
    getCachedLocation() ? "cached" : null
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const coords = await getCurrentLocation();
      setLocation(coords);
      setSource("live");

      // Cache for future use
      localStorage.setItem("cached_location", JSON.stringify(coords));

      return coords;
    } catch (err: any) {
      console.error("Location error:", err);
      setError(err.message || "Failed to get location");

      // Fall back to cached if available
      const cached = getCachedLocation();
      if (cached && !location) {
        setLocation(cached);
        setSource("cached");
      }

      return null;
    } finally {
      setLoading(false);
    }
  }, [location]);

  // Auto-fetch on mount if no cached location
  useEffect(() => {
    if (!location) {
      refresh();
    }
  }, []);

  return { location, source, loading, error, refresh };
}

/**
 * Periodic location updates
 */
export function usePeriodicLocationUpdate(intervalMinutes: number = 10) {
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null);

  useEffect(() => {
    const updateLocation = async () => {
      try {
        await updateMyLocation();
        setLastUpdate(new Date());
      } catch (error) {
        console.debug("Periodic location update failed:", error);
      }
    };

    // Update immediately
    updateLocation();

    // Then update periodically
    const intervalMs = intervalMinutes * 60 * 1000;
    const interval = setInterval(updateLocation, intervalMs);

    return () => clearInterval(interval);
  }, [intervalMinutes]);

  return { lastUpdate };
}

/**
 * Require location for a feature
 */
export function useRequireLocation() {
  const [hasLocation, setHasLocation] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const checkLocation = async () => {
      try {
        const cached = getCachedLocation();
        if (cached) {
          setHasLocation(true);
          setLoading(false);
          return;
        }

        const coords = await getCurrentLocation();
        if (coords) {
          setHasLocation(true);
        }
      } catch (err: any) {
        setError(err.message || "Location required");
      } finally {
        setLoading(false);
      }
    };

    checkLocation();
  }, []);

  return { hasLocation, loading, error };
}

/**
 * Real-time location tracking
 */
export function useLocationTracking(enabled: boolean = false) {
  const [location, setLocation] = useState<Coordinates | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!enabled || !navigator.geolocation) return;

    const watchId = navigator.geolocation.watchPosition(
      (position) => {
        setLocation({
          lat: position.coords.latitude,
          lon: position.coords.longitude,
          accuracy: position.coords.accuracy,
          timestamp: position.timestamp,
        });
        setError(null);
      },
      (err) => {
        setError(err.message);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 30000,
      }
    );

    return () => {
      navigator.geolocation.clearWatch(watchId);
    };
  }, [enabled]);

  return { location, error };
}
