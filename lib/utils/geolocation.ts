/**
 * Geolocation utilities for location-based matching
 */

export interface LocationData {
  latitude: number
  longitude: number
  timestamp: Date
}

export interface GeolocationError {
  code: number
  message: string
}

/**
 * Request user's current location using browser's Geolocation API
 */
export async function getCurrentLocation(): Promise<LocationData> {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject({
        code: 0,
        message: "Geolocation is not supported by your browser",
      })
      return
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        resolve({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          timestamp: new Date(),
        })
      },
      (error) => {
        reject({
          code: error.code,
          message: getGeolocationErrorMessage(error.code),
        })
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      }
    )
  })
}

/**
 * Watch user's location for continuous updates
 */
export function watchLocation(
  onSuccess: (location: LocationData) => void,
  onError: (error: GeolocationError) => void
): number | null {
  if (!navigator.geolocation) {
    onError({
      code: 0,
      message: "Geolocation is not supported by your browser",
    })
    return null
  }

  return navigator.geolocation.watchPosition(
    (position) => {
      onSuccess({
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
        timestamp: new Date(),
      })
    },
    (error) => {
      onError({
        code: error.code,
        message: getGeolocationErrorMessage(error.code),
      })
    },
    {
      enableHighAccuracy: true,
      timeout: 10000,
      maximumAge: 30000, // Accept cached position up to 30 seconds old
    }
  )
}

/**
 * Stop watching user's location
 */
export function clearLocationWatch(watchId: number): void {
  if (navigator.geolocation) {
    navigator.geolocation.clearWatch(watchId)
  }
}

/**
 * Get human-readable error message for geolocation errors
 */
function getGeolocationErrorMessage(code: number): string {
  switch (code) {
    case 1:
      return "Location permission denied. Please enable location access in your browser settings."
    case 2:
      return "Location unavailable. Please check your device's location settings."
    case 3:
      return "Location request timed out. Please try again."
    default:
      return "An unknown error occurred while getting your location."
  }
}

/**
 * Calculate distance between two coordinates using Haversine formula
 * Returns distance in kilometers
 */
export function calculateDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371 // Earth's radius in kilometers
  const dLat = toRadians(lat2 - lat1)
  const dLon = toRadians(lon2 - lon1)

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRadians(lat1)) * Math.cos(toRadians(lat2)) * Math.sin(dLon / 2) * Math.sin(dLon / 2)

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  const distance = R * c

  return distance
}

/**
 * Convert degrees to radians
 */
function toRadians(degrees: number): number {
  return degrees * (Math.PI / 180)
}

/**
 * Format distance for display
 */
export function formatDistance(kilometers: number): string {
  if (kilometers < 1) {
    return `${Math.round(kilometers * 1000)}m away`
  } else if (kilometers < 10) {
    return `${kilometers.toFixed(1)}km away`
  } else {
    return `${Math.round(kilometers)}km away`
  }
}

/**
 * Check if browser supports geolocation
 */
export function isGeolocationSupported(): boolean {
  return "geolocation" in navigator
}

/**
 * Request location permission (returns permission state if supported)
 */
export async function checkLocationPermission(): Promise<PermissionState | "unsupported"> {
  if (!("permissions" in navigator)) {
    return "unsupported"
  }

  try {
    const result = await navigator.permissions.query({ name: "geolocation" })
    return result.state
  } catch {
    return "unsupported"
  }
}

/**
 * Get location from IP address as fallback (requires external API)
 * This is a placeholder - you would integrate with a service like ipapi.co
 */
export async function getLocationFromIP(): Promise<LocationData | null> {
  try {
    const response = await fetch("https://ipapi.co/json/")
    const data = await response.json()
    
    if (data.latitude && data.longitude) {
      return {
        latitude: data.latitude,
        longitude: data.longitude,
        timestamp: new Date(),
      }
    }
    return null
  } catch (error) {
    console.error("Error getting location from IP:", error)
    return null
  }
}

