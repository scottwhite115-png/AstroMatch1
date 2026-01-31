/**
 * Supabase Profile Queries
 * Fetch and filter matchable profiles from database
 */

import { createClient } from './client'

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

export interface EnrichedProfile {
  id: string
  name: string
  age: number
  birthdate: string
  westernSign: string
  easternSign: string
  tropicalWesternSign?: string
  siderealWesternSign?: string
  photos: string[]
  bio?: string
  occupation?: string
  height?: string
  religion?: string
  children_preference?: string
  city?: string
  distance?: number
  interests?: string[]
  relationship_goals?: string[]
  gender?: string
  orientation?: string
  lat?: number
  lon?: number
}

/**
 * Fetch profiles within radius using PostGIS
 */
export async function fetchMatchableProfiles(filters: MatchFilters): Promise<EnrichedProfile[]> {
    const supabase = createClient()
    
  try {
    console.log('[Profile Queries] Fetching profiles with filters:', {
      userId: filters.userId,
      userLat: filters.userLat,
      userLon: filters.userLon,
      radius: filters.distanceRadius,
      lookingForGender: filters.lookingForGender,
      ageRange: `${filters.ageMin}-${filters.ageMax}`
    })

    // First, get profiles within distance radius
    // Using earthdistance extension for geo queries
    const { data: nearbyProfiles, error } = await supabase
      .rpc('profiles_within_radius', {
        user_lat: filters.userLat,
        user_lon: filters.userLon,
        radius_km: filters.distanceRadius
      })
    
    if (error) {
      console.error('[Profile Queries] Error fetching nearby profiles:', error)
      return []
    }

    console.log(`[Profile Queries] Found ${nearbyProfiles?.length || 0} profiles within radius`)

    if (!nearbyProfiles || nearbyProfiles.length === 0) {
      console.log('[Profile Queries] No profiles found within radius')
      return []
    }

    // Fetch orientation/interested_in for nearby profiles (RPC doesn't return it)
    const ids = nearbyProfiles.map((p: any) => p.id)
    const { data: orientationRows } = await supabase
      .from('profiles')
      .select('id, orientation, looking_for_gender')
      .in('id', ids)
    const orientationById: Record<string, string> = {}
    if (orientationRows) {
      for (const row of orientationRows) {
        const orient = (row as any).orientation || (row as any).looking_for_gender || ''
        orientationById[row.id] = orient
      }
    }

    /**
     * GENDER & ORIENTATION MATCHING LOGIC
     * ====================================
     * 
     * RULES:
     * 1. Man interested in Men      → sees only Men interested in Men (gay men see gay men)
     * 2. Woman interested in Women  → sees only Women interested in Women (lesbian women see lesbian women)
     * 3. Man interested in Women    → sees only Women interested in Men (straight man sees straight women)
     * 4. Woman interested in Men    → sees only Men interested in Women (straight woman sees straight men)
     * 5. Anyone interested in "Everyone"         → sees all genders who could be interested back (mutual)
     * 6. Anyone interested in "Prefer not to say" → sees all genders who could be interested back (mutual)
     * 7. Gender = "Prefer not to say", interested in Men   → sees all Men (gay + straight)
     * 8. Gender = "Prefer not to say", interested in Women → sees all Women (lesbian + straight)
     * 9. Gender = "Non-binary" → shown to those who select "Everyone" or "Prefer not to say" in interested-in
     * 
     * This separates homosexual and heterosexual users to prevent confusion.
     * Mutual matching: you only see profiles that could also be interested in you.
     */
    
    // Normalize for matching (case-insensitive comparison)
    const norm = (s: string) => (s || '').toLowerCase().trim()
    const viewerGender = norm(filters.userGender)
    const viewerInterestedInRaw = (filters.lookingForGender || '').trim()
    const viewerInterestedIn = norm(viewerInterestedInRaw)

    console.log(`[Profile Queries] 🎯 Viewer preferences: gender="${viewerGender}", interested_in="${viewerInterestedIn}"`)

    // Check if profile's gender matches what the viewer is interested in
    const profileGenderMatchesInterestedIn = (profileGender: string, interestedIn: string) => {
      const g = norm(profileGender)
      const i = norm(interestedIn)
      // "Everyone" or "Prefer not to say" interested-in → see all genders
      if (i === 'everyone' || i === 'prefer not to say') return true
      // Non-binary / Prefer not to say gender → shown to viewer (viewer's interested-in decides)
      if (g === 'prefer not to say' || g === 'non-binary') return true
      // Specific match: interested in Men → profile must be Man/Male
      if (i === 'men' && (g === 'man' || g === 'male')) return true
      // Specific match: interested in Women → profile must be Woman/Female
      if (i === 'women' && (g === 'woman' || g === 'female')) return true
      return false
    }

    // Check if profile's "interested in" includes the viewer's gender (mutual matching)
    const profileInterestedInMatchesGender = (profileInterestedIn: string, viewerGenderValue: string) => {
      const pi = norm(profileInterestedIn)
      const g = norm(viewerGenderValue)
      // Profile interested in "Everyone" or "Prefer not to say" → they see everyone
      if (pi === 'everyone' || pi === 'prefer not to say') return true
      // Viewer is Non-binary / Prefer not to say → profile sees them regardless
      if (g === 'prefer not to say' || g === 'non-binary') return true
      // Specific match: profile interested in Men → viewer must be Man/Male
      if (pi === 'men' && (g === 'man' || g === 'male')) return true
      // Specific match: profile interested in Women → viewer must be Woman/Female
      if (pi === 'women' && (g === 'woman' || g === 'female')) return true
      return false
    }

    let filteredCount = 0
    const matchableProfiles = nearbyProfiles.filter((profile: any) => {
      // Exclude own profile
      if (profile.id === filters.userId) {
        filteredCount++
        return false
      }
      
      // Must have complete and active profile
      if (!profile.profile_complete || !profile.account_active) {
        filteredCount++
        return false
      }

      const profileInterestedIn = orientationById[profile.id] || (profile.orientation || profile.looking_for_gender || '')
      const profileGender = profile.gender || ''
      const profileG = norm(profileGender)
      const profileI = norm(profileInterestedIn)

      // --- Requirement: Profile must have gender and orientation set (empty = not discoverable)
      if (profileG === '' || profileI === '') {
        filteredCount++
        console.log(`[Profile Queries] ❌ Filtered out incomplete gender/orientation: ${profile.email || profile.id} (gender="${profileG}", interested="${profileI}")`)
        return false
      }

      // --- 1) Viewer's "Interested in" check: profile's gender must match what viewer wants
      // Skip if viewer selected "Everyone" or "Prefer not to say" (they see all genders)
      if (viewerInterestedIn !== 'everyone' && viewerInterestedIn !== 'prefer not to say') {
        if (!profileGenderMatchesInterestedIn(profileGender, viewerInterestedInRaw)) {
          // Exception: show profiles with "Prefer not to say" or "Non-binary" gender
          if (profileG !== 'prefer not to say' && profileG !== 'non-binary') {
            filteredCount++
            console.log(`[Profile Queries] ❌ Gender mismatch: ${profile.email || profile.id} (viewer wants "${viewerInterestedIn}", profile is "${profileG}")`)
            return false
          }
        }
      }

      // --- 2) Mutual matching: profile's "interested in" must include viewer's gender
      // Skip if viewer's gender is "Prefer not to say" or "Non-binary" (they see based on their interested-in only)
      if (viewerGender !== 'prefer not to say' && viewerGender !== 'non-binary' && viewerGender !== '') {
        if (!profileInterestedInMatchesGender(profileInterestedIn, filters.userGender)) {
          filteredCount++
          console.log(`[Profile Queries] ❌ Not mutual: ${profile.email || profile.id} (profile wants "${profileI}", viewer is "${viewerGender}")`)
          return false
        }
      }
      
      // Age filter
      if (profile.age < filters.ageMin || profile.age > filters.ageMax) {
        filteredCount++
        console.log(`[Profile Queries] Filtered out age: ${profile.email || profile.id} (age: ${profile.age}, range: ${filters.ageMin}-${filters.ageMax})`)
        return false
      }

      // Has required fields
      if (!profile.birthdate || !profile.western_sign || !profile.chinese_sign) {
        filteredCount++
        console.log(`[Profile Queries] Filtered out missing fields: ${profile.email || profile.id} (birthdate: ${!!profile.birthdate}, western: ${!!profile.western_sign}, chinese: ${!!profile.chinese_sign})`)
        return false
      }

      // Has at least one photo
      if (!profile.photos || profile.photos.length === 0) {
        filteredCount++
        console.log(`[Profile Queries] Filtered out no photos: ${profile.email || profile.id}`)
        return false
      }
      
      console.log(`[Profile Queries] ✅ Match: ${profile.email || profile.id} (gender="${profileG}", wants="${profileI}") ↔ viewer (gender="${viewerGender}", wants="${viewerInterestedIn}")`)
      return true
    })

    console.log(`[Profile Queries] After filtering: ${matchableProfiles.length} matchable profiles (filtered out ${filteredCount})`)

    // Map to EnrichedProfile format (photos from profile – same as View tab carousel source)
    const enrichedProfiles: EnrichedProfile[] = matchableProfiles.map((profile: any) => {
      const photosRaw = profile.photos
      const photos = Array.isArray(photosRaw)
        ? photosRaw.filter((url: any) => url != null && String(url).trim() !== '')
        : []
      return {
      id: profile.id,
      name: profile.display_name || 'Anonymous',
      age: profile.age,
      birthdate: profile.birthdate,
      westernSign: profile.western_sign,
      easternSign: profile.chinese_sign,
      tropicalWesternSign: profile.tropical_western_sign || profile.western_sign,
      siderealWesternSign: profile.sidereal_western_sign || profile.western_sign,
      photos,
      bio: profile.bio,
      occupation: profile.occupation,
      height: profile.height,
      religion: profile.religion,
      children_preference: profile.children_preference,
      city: profile.city || profile.location_name,
      distance: profile.distance_km ? Math.round(profile.distance_km) : undefined,
      interests: profile.interests || [],
      relationship_goals: profile.relationship_goals || [],
      gender: profile.gender,
      orientation: orientationById[profile.id] || profile.orientation || profile.looking_for_gender,
      lat: profile.lat,
      lon: profile.lon
      }
    })

    console.log(`[Profile Queries] Found ${enrichedProfiles.length} matchable profiles`)
    return enrichedProfiles

  } catch (error) {
    console.error('[Profile Queries] Unexpected error:', error)
    return []
  }
}

/**
 * Get profiles that the user has already liked
 */
export async function fetchLikedProfileIds(userId: string): Promise<string[]> {
  const supabase = createClient()

  const { data, error } = await supabase
    .from('likes')
    .select('liked_id')
    .eq('liker_id', userId)

  if (error) {
    console.error('[Profile Queries] Error fetching likes:', error)
    return []
  }

  return data?.map(like => like.liked_id) || []
}

/**
 * Get profiles that the user has passed on
 */
export async function fetchPassedProfileIds(userId: string): Promise<string[]> {
  const supabase = createClient()

  // Only get passes that haven't expired
  const { data, error } = await supabase
    .from('passes')
    .select('passed_id')
    .eq('passer_id', userId)
    .gt('expires_at', new Date().toISOString())

  if (error) {
    console.error('[Profile Queries] Error fetching passes:', error)
    return []
  }

  return data?.map(pass => pass.passed_id) || []
}

/**
 * Get the current user's profile
 */
export async function fetchUserProfile(userId?: string): Promise<any | null> {
  const supabase = createClient()

  // If no userId provided, get current authenticated user
  if (!userId) {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return null
    userId = user.id
  }

  console.log('[Profile Queries] Fetching profile for userId:', userId)

  // Use wildcard to get all available columns (avoids 406 cache issues)
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .maybeSingle()

  console.log('[Profile Queries] Query result:', { 
    hasData: !!data, 
    hasError: !!error,
    errorCode: error?.code,
    errorMessage: error?.message 
  })

  if (error) {
    console.error('[Profile Queries] Error fetching user profile:', error)
    return null
  }

  if (!data) {
    console.warn('[Profile Queries] No profile data returned for userId:', userId)
  }

  return data
}

/**
 * Get matches for the current user
 */
export async function fetchUserMatches(userId: string): Promise<any[]> {
    const supabase = createClient()
    
  const { data, error } = await supabase
    .from('matches')
    .select(`
      *,
      user1:profiles!matches_user1_id_fkey(id, display_name, photos, western_sign, chinese_sign),
      user2:profiles!matches_user2_id_fkey(id, display_name, photos, western_sign, chinese_sign)
    `)
    .or(`user1_id.eq.${userId},user2_id.eq.${userId}`)
    .eq('is_active', true)
    .order('last_message_at', { ascending: false, nullsFirst: false })

  if (error) {
    console.error('[Profile Queries] Error fetching matches:', error)
    return []
  }

  // Map to include the other user's profile
  return data?.map(match => {
    const otherUser = match.user1_id === userId ? match.user2 : match.user1
    return {
      ...match,
      profile: otherUser
    }
  }) || []
}

/**
 * Find a match between two specific users
 */
export async function findMatchBetweenUsers(userId1: string, userId2: string): Promise<any | null> {
  const supabase = createClient()
  
  // Try both orderings: user1_id/user2_id and user2_id/user1_id
  const { data: data1, error: error1 } = await supabase
    .from('matches')
    .select('*')
    .eq('user1_id', userId1)
    .eq('user2_id', userId2)
    .eq('is_active', true)
    .maybeSingle()

  if (error1) {
    console.error('[Profile Queries] Error finding match (order 1):', error1)
  }

  if (data1) {
    return data1
  }

  // Try reverse order
  const { data: data2, error: error2 } = await supabase
    .from('matches')
    .select('*')
    .eq('user1_id', userId2)
    .eq('user2_id', userId1)
    .eq('is_active', true)
    .maybeSingle()

  if (error2) {
    console.error('[Profile Queries] Error finding match (order 2):', error2)
  }

  return data2 || null
}

/**
 * Get profiles that liked the current user (incoming likes)
 */
export async function fetchIncomingLikes(userId: string): Promise<any[]> {
  const supabase = createClient()

  const { data, error } = await supabase
    .from('likes')
    .select(`
      *,
      liker:profiles!likes_liker_id_fkey(*)
    `)
    .eq('liked_id', userId)
    .order('created_at', { ascending: false })

  if (error) {
    console.error('[Profile Queries] Error fetching incoming likes:', error)
    return []
    }

  return data?.map(like => like.liker) || []
}

/**
 * Update user's last_active timestamp
 */
export async function updateLastActive(userId: string): Promise<void> {
  const supabase = createClient()

  await supabase
    .from('profiles')
    .update({ last_active: new Date().toISOString() })
    .eq('id', userId)
}

/**
 * Filter out profiles that user has already seen (liked or passed)
 */
export function filterSeenProfiles(
  profiles: EnrichedProfile[],
  likedIds: string[],
  passedIds: string[]
): EnrichedProfile[] {
  const seenIds = new Set([...likedIds, ...passedIds])
  return profiles.filter(profile => !seenIds.has(profile.id))
  }
