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

    // Normalize for matching (Men/Women/Everyone/Prefer not to say; Man/Woman/Non-binary/Prefer not to say)
    const norm = (s: string) => (s || '').toLowerCase().trim()
    const viewerGender = norm(filters.userGender)
    const viewerInterestedInRaw = (filters.lookingForGender || '').trim()
    const viewerInterestedIn = norm(viewerInterestedInRaw)

    const profileGenderMatchesInterestedIn = (profileGender: string, interestedIn: string) => {
      const g = norm(profileGender)
      const i = norm(interestedIn)
      if (i === 'everyone' || i === 'prefer not to say') return true
      if (g === 'prefer not to say' || g === 'non-binary') return true // show them; viewer's interested_in is what matters
      if (i === 'men' && (g === 'man' || g === 'male')) return true
      if (i === 'women' && (g === 'woman' || g === 'female')) return true
      return false
    }

    const profileInterestedInMatchesGender = (profileInterestedIn: string, gender: string) => {
      const pi = norm(profileInterestedIn)
      const g = norm(gender)
      if (pi === 'everyone' || pi === 'prefer not to say') return true
      if (g === 'prefer not to say' || g === 'non-binary') return true // profile sees viewer when viewer didn't specify
      if (pi === 'men' && (g === 'man' || g === 'male')) return true
      if (pi === 'women' && (g === 'woman' || g === 'female')) return true
      return false
    }

    // Filter profiles based on preferences + gender/interested-in logic
    // Rules: same-sex sees same-sex, hetero sees hetero, Everyone sees all, Prefer not to say (gender) → interested-in dictates; Prefer not to say (interested in) → see all. Mutual: profile must also be interested in viewer.
    let filteredCount = 0
    const matchableProfiles = nearbyProfiles.filter((profile: any) => {
      // Exclude own profile
      if (profile.id === filters.userId) {
        filteredCount++
        return false
      }
      
      if (!profile.profile_complete || !profile.account_active) {
        filteredCount++
        return false
      }

      const profileInterestedIn = orientationById[profile.id] || (profile.orientation || profile.looking_for_gender || '')
      const profileGender = profile.gender || ''

      // --- 1) Viewer "Interested in" Men/Women: profile's gender must match (or profile gender is Prefer not to say / Non-binary)
      if (viewerInterestedIn !== 'everyone' && viewerInterestedIn !== 'prefer not to say') {
        if (!profileGenderMatchesInterestedIn(profileGender, viewerInterestedInRaw)) {
          const profileG = norm(profileGender)
          if (profileG !== 'prefer not to say' && profileG !== 'non-binary' && profileG !== '') {
            filteredCount++
            return false
          }
        }
      }

      // --- 2) Mutual: profile's "interested in" must include viewer's gender (or profile is Everyone/Prefer not to say). When viewer gender is Prefer not to say / Non-binary, we don't require profile to "include" them — show based on viewer's interested-in only.
      if (viewerGender !== 'prefer not to say' && viewerGender !== 'non-binary' && viewerGender !== '') {
        if (!profileInterestedInMatchesGender(profileInterestedIn, filters.userGender)) {
          filteredCount++
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
      
      console.log(`[Profile Queries] ✅ Profile passed all filters: ${profile.email || profile.id}`)
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
