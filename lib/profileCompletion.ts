/**
 * Profile Completion Checker
 * 
 * Determines if a user's profile is complete enough to appear in matches.
 * Enforces minimum requirements for profile visibility.
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
    bioLength: number
    hasBasicInfo: boolean
    hasCity: boolean
  }
}

export interface UserProfile {
  id: string
  email?: string | null
  phone?: string | null
  email_verified?: boolean
  phone_verified?: boolean
  birthdate?: string | null
  western_sign?: string | null
  chinese_sign?: string | null
  gender?: string | null
  bio?: string | null
  occupation?: string | null
  height?: string | null
  city?: string | null
  photos?: string[] | null
  profile_complete?: boolean
  account_active?: boolean
}

/**
 * Check if a user's profile meets all requirements for completion
 */
export function checkProfileCompletion(profile: UserProfile | null): ProfileCompletionStatus {
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
        bioLength: 0,
        hasBasicInfo: false,
        hasCity: false,
      }
    }
  }

  // Check each required field
  const required = {
    hasEmail: !!profile.email,
    hasPhone: !!profile.phone,
    emailVerified: profile.email_verified === true,
    phoneVerified: profile.phone_verified === true,
    hasBirthdate: !!profile.birthdate,
    hasPhotos: Array.isArray(profile.photos) && profile.photos.length >= 2,
    minPhotos: Array.isArray(profile.photos) ? profile.photos.length : 0,
    hasBio: true, // Bio is optional, not required
    bioLength: profile.bio?.length || 0,
    hasBasicInfo: !!(profile.gender && profile.occupation && profile.height),
    hasCity: !!profile.city,
  }

  // Build list of missing fields
  const missingFields: string[] = []
  
  if (!required.emailVerified) missingFields.push('Email verification')
  if (!required.phoneVerified) missingFields.push('Phone verification')
  if (!required.hasBirthdate) missingFields.push('Birthdate')
  if (!required.hasPhotos) {
    if (required.minPhotos === 0) {
      missingFields.push('At least 2 photos')
    } else if (required.minPhotos === 1) {
      missingFields.push('1 more photo (need 2 minimum)')
    }
  }
  if (!required.hasBasicInfo) {
    const missing: string[] = []
    if (!profile.gender) missing.push('gender')
    if (!profile.occupation) missing.push('occupation')
    if (!profile.height) missing.push('height')
    missingFields.push(`Basic info: ${missing.join(', ')}`)
  }
  if (!required.hasCity) missingFields.push('City')

  // Calculate completion percentage
  const totalChecks = 6 // email_verified, phone_verified, birthdate, photos, basic_info, city (bio removed)
  const completedChecks = [
    required.emailVerified,
    required.phoneVerified,
    required.hasBirthdate,
    required.hasPhotos,
    required.hasBasicInfo,
    required.hasCity,
  ].filter(Boolean).length

  const percentage = Math.round((completedChecks / totalChecks) * 100)

  return {
    isComplete: missingFields.length === 0,
    percentage,
    missingFields,
    requiredFields: required,
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
    return '🚀 Let\'s set up your profile to start matching!'
  }

  if (status.percentage < 30) {
    return `📝 ${status.percentage}% complete - Keep going!`
  }

  if (status.percentage < 70) {
    return `🎯 ${status.percentage}% complete - You're halfway there!`
  }

  return `🌟 ${status.percentage}% complete - Almost done!`
}

/**
 * Get the next required field that needs to be completed
 */
export function getNextRequiredField(status: ProfileCompletionStatus): string | null {
  if (status.isComplete) return null

  const { requiredFields } = status

  // Priority order for completion
  if (!requiredFields.emailVerified) return 'email_verification'
  if (!requiredFields.phoneVerified) return 'phone_verification'
  if (!requiredFields.hasBirthdate) return 'birthdate'
  if (!requiredFields.hasPhotos) return 'photos'
  if (!requiredFields.hasBasicInfo) return 'basic_info'
  if (!requiredFields.hasCity) return 'city'

  return null
}

/**
 * Get redirect path for completing profile
 */
export function getCompletionRedirectPath(nextField: string | null): string {
  switch (nextField) {
    case 'email_verification':
      return '/auth/verify-email'
    case 'phone_verification':
      return '/auth/verify-phone'
    case 'birthdate':
    case 'photos':
    case 'basic_info':
    case 'city':
      return '/onboarding'
    default:
      return '/profile/profile'
  }
}

