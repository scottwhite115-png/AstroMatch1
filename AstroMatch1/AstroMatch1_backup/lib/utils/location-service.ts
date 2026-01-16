/**
 * Location service for updating and managing user location in Supabase
 */

import { createClient } from "@/lib/supabase/client"
import type { LocationData } from "./geolocation"

/**
 * Update user's location in the database
 */
export async function updateUserLocation(userId: string, location: LocationData): Promise<boolean> {
  try {
    const supabase = createClient()

    const { error } = await supabase
      .from("profiles")
      .update({
        latitude: location.latitude,
        longitude: location.longitude,
        location_updated_at: new Date().toISOString(),
      })
      .eq("id", userId)

    if (error) {
      console.error("Error updating location:", error)
      return false
    }

    return true
  } catch (error) {
    console.error("Error updating location:", error)
    return false
  }
}

/**
 * Get nearby users based on current user's location
 */
export async function getNearbyUsers(
  latitude: number,
  longitude: number,
  radiusKm: number = 50
): Promise<any[]> {
  try {
    const supabase = createClient()

    const { data, error } = await supabase.rpc("find_nearby_profiles", {
      user_lat: latitude,
      user_lon: longitude,
      radius_km: radiusKm,
    })

    if (error) {
      console.error("Error fetching nearby users:", error)
      return []
    }

    return data || []
  } catch (error) {
    console.error("Error fetching nearby users:", error)
    return []
  }
}

/**
 * Get user's stored location from database
 */
export async function getUserLocation(userId: string): Promise<LocationData | null> {
  try {
    const supabase = createClient()

    const { data, error } = await supabase
      .from("profiles")
      .select("latitude, longitude, location_updated_at")
      .eq("id", userId)
      .single()

    if (error || !data || !data.latitude || !data.longitude) {
      return null
    }

    return {
      latitude: data.latitude,
      longitude: data.longitude,
      timestamp: new Date(data.location_updated_at || Date.now()),
    }
  } catch (error) {
    console.error("Error getting user location:", error)
    return null
  }
}

/**
 * Update location string (city/area name) based on coordinates
 * Uses reverse geocoding API
 */
export async function updateLocationString(
  userId: string,
  latitude: number,
  longitude: number
): Promise<void> {
  try {
    // Use OpenStreetMap Nominatim for reverse geocoding (free)
    const response = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=10`
    )
    const data = await response.json()

    if (data && data.address) {
      const city = data.address.city || data.address.town || data.address.village || data.address.county
      const state = data.address.state
      const country = data.address.country

      let locationString = ""
      if (city && state) {
        locationString = `${city}, ${state}`
      } else if (city && country) {
        locationString = `${city}, ${country}`
      } else if (state && country) {
        locationString = `${state}, ${country}`
      } else if (country) {
        locationString = country
      }

      if (locationString) {
        const supabase = createClient()
        await supabase.from("profiles").update({ location: locationString }).eq("id", userId)
      }
    }
  } catch (error) {
    console.error("Error updating location string:", error)
  }
}

/**
 * Check if location needs update (older than 1 hour)
 */
export function shouldUpdateLocation(lastUpdate: Date | null): boolean {
  if (!lastUpdate) return true

  const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000)
  return lastUpdate < oneHourAgo
}

