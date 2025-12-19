/**
 * Profile Completion Checker
 * Determines if a user profile is complete enough to use the app
 */

export interface ProfileCompletionStatus {
  isComplete: boolean
  percentage: number
  missingFields: string[]
  requiredFields: {
    hasName: boolean
    hasBirthdate: boolean
    hasPhotos: boolean
    minPhotos: number
  }
}

export interface MinimalProfile {
  display_name?: string | null
  email?: string | null
  phone?: string | null
  email_verified?: boolean | null
  phone_verified?: boolean | null
  birthdate?: string | Date | null
  photos?: string[] | null
  bio?: string | null
  gender?: string | null
  occupation?: string | null
  height?: string | null
  looking_for_gender?: string | null
  age_min?: number | null
  age_max?: number | null
  distance_radius?: number | null
}

/**
 * Check if a profile is complete enough to use the app
 */
export function checkProfileCompletion(profile: MinimalProfile | null | undefined): ProfileCompletionStatus {
  if (!profile) {
    return {
      isComplete: false,
      percentage: 0,
      missingFields: ['All fields'],
      requiredFields: {
        hasName: false,
        hasBirthdate: false,
        hasPhotos: false,
        minPhotos: 0,
      }
    }
  }

  // Simplified requirements: Only Name, Birthdate, and Photo required
  const required = {
    hasName: !!(profile.display_name && profile.display_name.length > 0),
    hasBirthdate: !!profile.birthdate,
    hasPhotos: (profile.photos?.length ?? 0) >= 1, // At least 1 photo
    minPhotos: profile.photos?.length ?? 0
  }

  const missingFields: string[] = []
  
  if (!required.hasName) missingFields.push('Name')
  if (!required.hasBirthdate) missingFields.push('Birthdate')
  if (!required.hasPhotos) {
    missingFields.push('At least 1 photo')
  }

  // Calculate completion percentage (3 required fields)
  const checks = [
    required.hasName,
    required.hasBirthdate,
    required.hasPhotos
  ]

  const completedChecks = checks.filter(v => v === true).length
  const totalChecks = checks.length
  const percentage = Math.round((completedChecks / totalChecks) * 100)

  return {
    isComplete: missingFields.length === 0,
    percentage,
    missingFields,
    requiredFields: required
  }
}

/**
 * Get a user-friendly message about profile completion
 */
export function getCompletionMessage(status: ProfileCompletionStatus): string {
  if (status.isComplete) {
    return '✅ Your profile is complete!'
  }

  if (status.percentage === 0) {
    return '🚀 Let\'s set up your profile!'
  }

  if (status.percentage < 25) {
    return `📝 ${status.percentage}% complete - Let's add more details`
  }

  if (status.percentage < 50) {
    return `📸 ${status.percentage}% complete - Almost there!`
  }

  if (status.percentage < 75) {
    return `🎯 ${status.percentage}% complete - You're doing great!`
  }

  return `🌟 ${status.percentage}% complete - Just a few more things!`
}

/**
 * Get the next recommended action for profile completion
 */
export function getNextAction(status: ProfileCompletionStatus): string | null {
  if (status.isComplete) return null

  const { requiredFields } = status

  // Only check the 3 required fields: Name, Birthdate, Photo
  if (!requiredFields.hasName) return 'add_name'
  if (!requiredFields.hasBirthdate) return 'add_birthdate'
  if (!requiredFields.hasPhotos) return 'upload_photos'

  return null
}
