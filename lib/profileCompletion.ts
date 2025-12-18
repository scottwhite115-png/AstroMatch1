/**
 * Profile Completion Checker
 * Determines if a user profile is complete enough to use the app
 */

export interface ProfileCompletionStatus {
  isComplete: boolean
  percentage: number
  missingFields: string[]
  requiredFields: {
    hasEmail: boolean
    hasPhone: boolean
    emailVerified: boolean
    phoneVerified: boolean
    hasBirthdate: boolean
    hasPhotos: boolean
    minPhotos: number
    hasBio: boolean
    hasBasicInfo: boolean
    hasGender: boolean
    hasPreferences: boolean
  }
}

export interface MinimalProfile {
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
        hasEmail: false,
        hasPhone: false,
        emailVerified: false,
        phoneVerified: false,
        hasBirthdate: false,
        hasPhotos: false,
        minPhotos: 0,
        hasBio: false,
        hasBasicInfo: false,
        hasGender: false,
        hasPreferences: false,
      }
    }
  }

  const required = {
    hasEmail: !!(profile.email && profile.email.length > 0),
    hasPhone: !!(profile.phone && profile.phone.length > 0),
    emailVerified: profile.email_verified === true,
    phoneVerified: profile.phone_verified === true,
    hasBirthdate: !!profile.birthdate,
    hasPhotos: (profile.photos?.length ?? 0) >= 2,
    minPhotos: profile.photos?.length ?? 0,
    hasBio: (profile.bio?.length ?? 0) >= 50,
    hasBasicInfo: !!(profile.occupation && profile.height),
    hasGender: !!(profile.gender && profile.gender.length > 0),
    hasPreferences: !!(
      profile.looking_for_gender && 
      profile.age_min && 
      profile.age_max && 
      profile.distance_radius
    )
  }

  const missingFields: string[] = []
  
  if (!required.emailVerified) missingFields.push('Email verification')
  if (!required.phoneVerified) missingFields.push('Phone verification')
  if (!required.hasBirthdate) missingFields.push('Birthdate')
  if (!required.hasPhotos) {
    if (required.minPhotos === 0) {
      missingFields.push('At least 2 photos')
    } else if (required.minPhotos === 1) {
      missingFields.push('1 more photo (2 required)')
    }
  }
  if (!required.hasBio) {
    const bioLength = profile.bio?.length ?? 0
    missingFields.push(`Bio (${bioLength}/50 characters)`)
  }
  if (!required.hasBasicInfo) {
    const missing: string[] = []
    if (!profile.occupation) missing.push('occupation')
    if (!profile.height) missing.push('height')
    missingFields.push(`Basic info: ${missing.join(', ')}`)
  }
  if (!required.hasGender) missingFields.push('Gender')
  if (!required.hasPreferences) missingFields.push('Search preferences')

  // Calculate completion percentage
  const checks = [
    required.emailVerified,
    required.phoneVerified,
    required.hasBirthdate,
    required.hasPhotos,
    required.hasBio,
    required.hasBasicInfo,
    required.hasGender,
    required.hasPreferences
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

  if (!requiredFields.emailVerified) return 'verify_email'
  if (!requiredFields.phoneVerified) return 'verify_phone'
  if (!requiredFields.hasBirthdate) return 'add_birthdate'
  if (!requiredFields.hasGender) return 'add_gender'
  if (!requiredFields.hasPhotos) return 'upload_photos'
  if (!requiredFields.hasBio) return 'write_bio'
  if (!requiredFields.hasBasicInfo) return 'add_basic_info'
  if (!requiredFields.hasPreferences) return 'set_preferences'

  return null
}
