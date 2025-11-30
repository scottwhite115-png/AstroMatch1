/**
 * Supabase Profile Queries
 * 
 * Functions to fetch and update user profiles from the database
 */

import { createClient } from '@/lib/supabase/client'
import type { UserProfile } from '@/lib/profileCompletion'

/**
 * Fetch the current user's profile from Supabase
 */
export async function fetchUserProfile(): Promise<UserProfile | null> {
  try {
    const supabase = createClient()
    
    // Get current user
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    
    if (authError || !user) {
      console.error('[fetchUserProfile] Auth error:', authError)
      return null
    }

    // Fetch profile
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single()

    if (profileError) {
      console.error('[fetchUserProfile] Profile error:', profileError)
      return null
    }

    return profile as UserProfile
  } catch (error) {
    console.error('[fetchUserProfile] Unexpected error:', error)
    return null
  }
}

/**
 * Update the current user's profile
 */
export async function updateUserProfile(updates: Partial<UserProfile>): Promise<{ success: boolean; error?: string }> {
  try {
    const supabase = createClient()
    
    // Get current user
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    
    if (authError || !user) {
      return { success: false, error: 'Not authenticated' }
    }

    // Update profile
    const { error: updateError } = await supabase
      .from('profiles')
      .update(updates)
      .eq('id', user.id)

    if (updateError) {
      console.error('[updateUserProfile] Update error:', updateError)
      return { success: false, error: updateError.message }
    }

    return { success: true }
  } catch (error) {
    console.error('[updateUserProfile] Unexpected error:', error)
    return { success: false, error: 'Failed to update profile' }
  }
}

/**
 * Create or update profile on first login
 */
export async function upsertUserProfile(userId: string, email: string): Promise<{ success: boolean; error?: string }> {
  try {
    const supabase = createClient()

    const { error } = await supabase
      .from('profiles')
      .upsert({
        id: userId,
        email: email,
        email_verified: false,
        phone_verified: false,
        account_active: true,
        profile_complete: false,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      }, {
        onConflict: 'id'
      })

    if (error) {
      console.error('[upsertUserProfile] Upsert error:', error)
      return { success: false, error: error.message }
    }

    return { success: true }
  } catch (error) {
    console.error('[upsertUserProfile] Unexpected error:', error)
    return { success: false, error: 'Failed to create profile' }
  }
}

export interface MatchFilters {
  userGender: string
  lookingForGender: string
  ageMin: number
  ageMax: number
  distanceRadius: number
  userLat: number
  userLon: number
  userId: string
}

/**
 * Fetch matchable profiles based on user preferences
 */
export async function fetchMatchableProfiles(filters: MatchFilters): Promise<UserProfile[]> {
  try {
    const supabase = createClient()
    
    // Get profiles within radius using the RPC function
    const { data: nearbyProfiles, error } = await supabase
      .rpc('profiles_within_radius', {
        user_lat: filters.userLat,
        user_lon: filters.userLon,
        radius_meters: filters.distanceRadius * 1000, // Convert km to meters
        limit_count: 100
      })
    
    if (error) {
      console.error('[fetchMatchableProfiles] RPC error:', error)
      return []
    }

    if (!nearbyProfiles || nearbyProfiles.length === 0) {
      console.log('[fetchMatchableProfiles] No nearby profiles found')
      return []
    }

    // Filter by preferences
    const matchableProfiles = nearbyProfiles.filter((profile: UserProfile) => {
      // Exclude own profile
      if (profile.id === filters.userId) return false
      
      // Must be complete and active
      if (!profile.profile_complete || !profile.account_active) return false
      
      // Gender filter
      if (filters.lookingForGender !== 'Everyone') {
        if (profile.gender !== filters.lookingForGender) return false
      }
      
      // Age filter
      const age = profile.age || 0
      if (age < filters.ageMin || age > filters.ageMax) return false
      
      return true
    })

    console.log(`[fetchMatchableProfiles] Found ${matchableProfiles.length} matchable profiles`)
    return matchableProfiles as UserProfile[]
  } catch (error) {
    console.error('[fetchMatchableProfiles] Unexpected error:', error)
    return []
  }
}

/**
 * Check if profiles_within_radius RPC function exists
 * If not, we'll need to create it
 */
export async function checkRadiusFunction(): Promise<boolean> {
  try {
    const supabase = createClient()
    
    // Try calling with dummy data to see if function exists
    const { error } = await supabase.rpc('profiles_within_radius', {
      user_lat: 0,
      user_lon: 0,
      radius_meters: 1000,
      limit_count: 1
    })

    // If function doesn't exist, we'll get a specific error
    if (error && error.message.includes('does not exist')) {
      console.warn('[checkRadiusFunction] profiles_within_radius function not found')
      return false
    }

    return true
  } catch (error) {
    console.error('[checkRadiusFunction] Error checking function:', error)
    return false
  }
}

