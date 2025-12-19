/**
 * User Actions - Unmatch, Report, Block
 */

import { createClient } from './client'

/**
 * Unmatch with a user - deletes the match record
 */
export async function unmatchUser(currentUserId: string, otherUserId: string, matchId: string): Promise<{ success: boolean; error?: string }> {
  const supabase = createClient()
  
  try {
    // Delete the match
    const { error } = await supabase
      .from('matches')
      .delete()
      .eq('id', matchId)
    
    if (error) {
      console.error('[Unmatch] Error deleting match:', error)
      return { success: false, error: error.message }
    }
    
    // Also delete any likes between these users
    await supabase
      .from('likes')
      .delete()
      .or(`and(liker_id.eq.${currentUserId},liked_id.eq.${otherUserId}),and(liker_id.eq.${otherUserId},liked_id.eq.${currentUserId})`)
    
    return { success: true }
  } catch (error: any) {
    console.error('[Unmatch] Unexpected error:', error)
    return { success: false, error: error?.message || 'Failed to unmatch' }
  }
}

/**
 * Report a user - creates a report record for admin review
 */
export async function reportUser(
  reporterId: string,
  reportedUserId: string,
  reason?: string
): Promise<{ success: boolean; error?: string }> {
  const supabase = createClient()
  
  try {
    const { error } = await supabase
      .from('reports')
      .insert({
        reporter_id: reporterId,
        reported_user_id: reportedUserId,
        reason: reason || 'User reported from chat',
        status: 'pending',
        created_at: new Date().toISOString(),
      })
    
    if (error) {
      console.error('[Report] Error creating report:', error)
      return { success: false, error: error.message }
    }
    
    return { success: true }
  } catch (error: any) {
    console.error('[Report] Unexpected error:', error)
    return { success: false, error: error?.message || 'Failed to report user' }
  }
}

/**
 * Block a user - creates a block record and also unmatch
 */
export async function blockUser(
  blockerId: string,
  blockedUserId: string,
  matchId?: string
): Promise<{ success: boolean; error?: string }> {
  const supabase = createClient()
  
  try {
    // Create block record
    const { error: blockError } = await supabase
      .from('blocks')
      .insert({
        blocker_id: blockerId,
        blocked_user_id: blockedUserId,
        created_at: new Date().toISOString(),
      })
    
    if (blockError) {
      console.error('[Block] Error creating block:', blockError)
      return { success: false, error: blockError.message }
    }
    
    // Also unmatch if matchId is provided
    if (matchId) {
      await unmatchUser(blockerId, blockedUserId, matchId)
    }
    
    return { success: true }
  } catch (error: any) {
    console.error('[Block] Unexpected error:', error)
    return { success: false, error: error?.message || 'Failed to block user' }
  }
}

