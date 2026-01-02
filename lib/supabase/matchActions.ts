/**
 * Match Actions
 * Handle likes, passes, and matches
 */

import { createClient } from './client'

export interface LikeResult {
  success: boolean
  isMatch: boolean
  matchId?: string
  error?: string
}

export interface PassResult {
  success: boolean
  error?: string
}

/**
 * Like a profile (swipe right)
 */
export async function likeProfile(userId: string, profileId: string): Promise<LikeResult> {
  const supabase = createClient()

  try {
    // Insert like
    const { error: likeError } = await supabase
      .from('likes')
      .insert({
        liker_id: userId,
        liked_id: profileId
      })

    if (likeError) {
      // Check if already liked
      if (likeError.code === '23505') { // Unique constraint violation
        console.log('[Match Actions] Profile already liked')
        return { success: true, isMatch: false }
      }
      
      console.error('[Match Actions] Error saving like:', likeError)
      return {
        success: false,
        isMatch: false,
        error: likeError.message
      }
    }

    // Check if it's a match (the trigger handles creation, we just check)
    const { data: match, error: matchError } = await supabase
      .from('matches')
      .select('id')
      .or(`and(user1_id.eq.${userId},user2_id.eq.${profileId}),and(user1_id.eq.${profileId},user2_id.eq.${userId})`)
      .eq('is_active', true)
      .maybeSingle()

    if (matchError) {
      console.error('[Match Actions] Error checking match:', matchError)
    }

    if (match) {
      console.log('[Match Actions] 🎉 It\'s a match!', match.id)
      return {
        success: true,
        isMatch: true,
        matchId: match.id
      }
    }

    return {
      success: true,
      isMatch: false
    }
  } catch (error) {
    console.error('[Match Actions] Unexpected error liking profile:', error)
    return {
      success: false,
      isMatch: false,
      error: 'Unexpected error'
    }
  }
}

/**
 * Pass on a profile (swipe left)
 * Profile will be hidden for 7 days, then reappear in the stack
 */
export async function passProfile(userId: string, profileId: string): Promise<PassResult> {
  const supabase = createClient()

  try {
    const { error } = await supabase
      .from('passes')
      .insert({
        passer_id: userId,
        passed_id: profileId
      })

    if (error) {
      // Check if already passed
      if (error.code === '23505') { // Unique constraint violation
        console.log('[Match Actions] Profile already passed')
        return { success: true }
      }

      console.error('[Match Actions] Error saving pass:', error)
      return {
        success: false,
        error: error.message
      }
    }

    return { success: true }
  } catch (error) {
    console.error('[Match Actions] Unexpected error passing profile:', error)
    return {
      success: false,
      error: 'Unexpected error'
    }
  }
}

/**
 * Unmatch with a user
 */
export async function unmatchUser(userId: string, matchId: string): Promise<boolean> {
  const supabase = createClient()

  try {
    const { error } = await supabase
      .from('matches')
      .update({
        is_active: false,
        unmatched_by: userId,
        unmatched_at: new Date().toISOString()
      })
      .eq('id', matchId)
      .or(`user1_id.eq.${userId},user2_id.eq.${userId}`)

    if (error) {
      console.error('[Match Actions] Error unmatching:', error)
      return false
    }

    return true
  } catch (error) {
    console.error('[Match Actions] Unexpected error unmatching:', error)
    return false
  }
}

/**
 * Check if a profile is already liked
 */
export async function isProfileLiked(userId: string, profileId: string): Promise<boolean> {
  const supabase = createClient()

  const { data, error } = await supabase
    .from('likes')
    .select('id')
    .eq('liker_id', userId)
    .eq('liked_id', profileId)
    .maybeSingle()

  if (error) {
    console.error('[Match Actions] Error checking if liked:', error)
    return false
  }

  return !!data
}

/**
 * Check if a profile is already passed
 */
export async function isProfilePassed(userId: string, profileId: string): Promise<boolean> {
  const supabase = createClient()

  const { data, error } = await supabase
    .from('passes')
    .select('id')
    .eq('passer_id', userId)
    .eq('passed_id', profileId)
    .gt('expires_at', new Date().toISOString())
    .maybeSingle()

  if (error) {
    console.error('[Match Actions] Error checking if passed:', error)
    return false
  }

  return !!data
}

/**
 * Check if there's a match between two users
 */
export async function checkMatch(userId: string, profileId: string): Promise<string | null> {
  const supabase = createClient()

  const { data, error } = await supabase
    .from('matches')
    .select('id')
    .or(`and(user1_id.eq.${userId},user2_id.eq.${profileId}),and(user1_id.eq.${profileId},user2_id.eq.${userId})`)
    .eq('is_active', true)
    .maybeSingle()

  if (error) {
    console.error('[Match Actions] Error checking match:', error)
    return null
  }

  return data?.id || null
}

/**
 * Get match statistics for user
 */
export async function getMatchStats(userId: string): Promise<{
  totalLikes: number
  totalMatches: number
  incomingLikes: number
}> {
  const supabase = createClient()

  // Get total likes sent
  const { count: likesCount } = await supabase
    .from('likes')
    .select('*', { count: 'exact', head: true })
    .eq('liker_id', userId)

  // Get total active matches
  const { count: matchesCount } = await supabase
    .from('matches')
    .select('*', { count: 'exact', head: true })
    .or(`user1_id.eq.${userId},user2_id.eq.${userId}`)
    .eq('is_active', true)

  // Get incoming likes (people who liked you but you haven't liked back)
  const { count: incomingCount } = await supabase
    .from('likes')
    .select('*', { count: 'exact', head: true })
    .eq('liked_id', userId)
    .not('liker_id', 'in', `(SELECT liked_id FROM likes WHERE liker_id = '${userId}')`)

  return {
    totalLikes: likesCount || 0,
    totalMatches: matchesCount || 0,
    incomingLikes: incomingCount || 0
  }
}

