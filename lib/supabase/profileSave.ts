/**
 * Profile Save to Supabase
 * Save all profile edits to database
 */

import { createClient } from './client'

export interface ProfileData {
  display_name?: string
  bio?: string
  birthdate?: string
  age?: number
  western_sign?: string
  chinese_sign?: string
  tropical_western_sign?: string
  sidereal_western_sign?: string
  gender?: string
  occupation?: string
  height?: string
  religion?: string
  children_preference?: string
  photos?: string[]
  interests?: string[]
  relationship_goals?: string[]
  looking_for_gender?: string
  age_min?: number
  age_max?: number
  distance_radius?: number
  city?: string
  lat?: number
  lon?: number
  profile_complete?: boolean
}

export interface SaveResult {
  success: boolean
  error?: string
}

/**
 * Calculate age from birthdate
 */
function calculateAge(birthdate: string | Date): number {
  const birth = new Date(birthdate)
  const today = new Date()
  let age = today.getFullYear() - birth.getFullYear()
  const monthDiff = today.getMonth() - birth.getMonth()
  
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
    age--
  }
  
  return age
}

/**
 * Save user profile to Supabase
 */
export async function saveProfile(
  userId: string,
  profileData: ProfileData
): Promise<SaveResult> {
  const supabase = createClient()

  try {
    // Auto-calculate age if birthdate is provided
    if (profileData.birthdate) {
      profileData.age = calculateAge(profileData.birthdate)
    }

    // Update profile in database
    const { error } = await supabase
      .from('profiles')
      .update(profileData)
      .eq('id', userId)

    if (error) {
      console.error('[Profile Save] Error:', error)
      return {
        success: false,
        error: error.message
      }
    }

    console.log('[Profile Save] ✅ Profile saved successfully!')
    return { success: true }

  } catch (error) {
    console.error('[Profile Save] Unexpected error:', error)
    return {
      success: false,
      error: 'Unexpected error saving profile'
    }
  }
}

/**
 * Update specific profile fields
 */
export async function updateProfileFields(
  userId: string,
  fields: Partial<ProfileData>
): Promise<SaveResult> {
  return saveProfile(userId, fields)
}

/**
 * Update profile photos
 */
export async function updateProfilePhotos(
  userId: string,
  photos: string[]
): Promise<SaveResult> {
  return saveProfile(userId, { photos })
}

/**
 * Update profile completion status
 */
export async function updateProfileCompletion(
  userId: string,
  isComplete: boolean
): Promise<SaveResult> {
  return saveProfile(userId, { profile_complete: isComplete })
}

