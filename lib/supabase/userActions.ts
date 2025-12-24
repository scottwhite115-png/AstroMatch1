/**
 * User Actions - Unmatch, Report, Block
 */

import { createClient } from './client'

/**
 * Get the number of times a user has been reported
 */
async function getReportCount(userId: string): Promise<number> {
  const supabase = createClient()
  
  const { count, error } = await supabase
    .from('reports')
    .select('*', { count: 'exact', head: true })
    .eq('reported_user_id', userId)
  
  if (error) {
    console.error('[Report Count] Error:', error)
    return 0
  }
  
  return count || 0
}

/**
 * Get the number of times a user has been blocked
 */
async function getBlockCount(userId: string): Promise<number> {
  const supabase = createClient()
  
  const { count, error } = await supabase
    .from('blocks')
    .select('*', { count: 'exact', head: true })
    .eq('blocked_user_id', userId)
  
  if (error) {
    console.error('[Block Count] Error:', error)
    return 0
  }
  
  return count || 0
}

/**
 * Ban a user with a specific ban type
 */
async function banUser(userId: string, banType: '2week' | 'permanent'): Promise<boolean> {
  const supabase = createClient()
  
  try {
    const updateData: any = {
      status: banType === 'permanent' ? 'BANNED' : 'SUSPENDED',
    }
    
    // For 2-week ban, set the suspension end date
    if (banType === '2week') {
      const twoWeeksFromNow = new Date()
      twoWeeksFromNow.setDate(twoWeeksFromNow.getDate() + 14)
      updateData.suspensionEndsAt = twoWeeksFromNow.toISOString()
    } else {
      // Permanent ban - set to null
      updateData.suspensionEndsAt = null
    }
    
    const { error } = await supabase
      .from('profiles')
      .update(updateData)
      .eq('id', userId)
    
    if (error) {
      console.error('[Ban User] Error:', error)
      return false
    }
    
    console.log(`[Ban User] User ${userId} banned with ${banType}`)
    return true
  } catch (error) {
    console.error('[Ban User] Unexpected error:', error)
    return false
  }
}

/**
 * Check report violations and return warning/ban info
 * Rules:
 * - 2 reports: Warning
 * - 3rd report: 2-week ban
 * - 4th report (after returning): Permanent ban
 */
export async function checkReportViolation(userId: string): Promise<{
  shouldWarn: boolean
  shouldBan: boolean
  banType?: '2week' | 'permanent'
  warningMessage?: string
}> {
  const supabase = createClient()
  
  // Get user's current status
  const { data: profile } = await supabase
    .from('profiles')
    .select('status, suspensionEndsAt')
    .eq('id', userId)
    .single()
  
  const reportCount = await getReportCount(userId)
  const hasBeenBanned = profile?.status === 'BANNED' || profile?.status === 'SUSPENDED'
  
  // 2 reports = warning
  if (reportCount === 2 && !hasBeenBanned) {
    return {
      shouldWarn: true,
      shouldBan: false,
      warningMessage: '⚠️ Warning: You have been reported twice. One more report will result in a 2-week ban from the platform.'
    }
  }
  
  // 3rd report = 2-week ban
  if (reportCount === 3 && !hasBeenBanned) {
    await banUser(userId, '2week')
    return {
      shouldWarn: true,
      shouldBan: true,
      banType: '2week',
      warningMessage: '🚫 You have been banned for 2 weeks due to multiple reports. If you are reported again after your ban ends, it will result in a permanent ban.'
    }
  }
  
  // 4th report (after being banned once) = permanent ban
  if (reportCount >= 4) {
    await banUser(userId, 'permanent')
    return {
      shouldWarn: true,
      shouldBan: true,
      banType: 'permanent',
      warningMessage: '🚫 You have been permanently banned from the platform due to repeated violations.'
    }
  }
  
  return {
    shouldWarn: false,
    shouldBan: false
  }
}

/**
 * Check block violations and return warning/ban info
 * Rules:
 * - 2 blocks: Warning
 * - 3rd block: 2-week ban
 * - 4th block (after returning): Permanent ban
 */
export async function checkBlockViolation(userId: string): Promise<{
  shouldWarn: boolean
  shouldBan: boolean
  banType?: '2week' | 'permanent'
  warningMessage?: string
}> {
  const supabase = createClient()
  
  // Get user's current status
  const { data: profile } = await supabase
    .from('profiles')
    .select('status, suspensionEndsAt')
    .eq('id', userId)
    .single()
  
  const blockCount = await getBlockCount(userId)
  const hasBeenBanned = profile?.status === 'BANNED' || profile?.status === 'SUSPENDED'
  
  // 2 blocks = warning
  if (blockCount === 2 && !hasBeenBanned) {
    return {
      shouldWarn: true,
      shouldBan: false,
      warningMessage: '⚠️ Warning: You have been blocked twice. One more block will result in a 2-week ban from the platform.'
    }
  }
  
  // 3rd block = 2-week ban
  if (blockCount === 3 && !hasBeenBanned) {
    await banUser(userId, '2week')
    return {
      shouldWarn: true,
      shouldBan: true,
      banType: '2week',
      warningMessage: '🚫 You have been banned for 2 weeks due to multiple blocks. If you are blocked again after your ban ends, it will result in a permanent ban.'
    }
  }
  
  // 4th block (after being banned once) = permanent ban
  if (blockCount >= 4) {
    await banUser(userId, 'permanent')
    return {
      shouldWarn: true,
      shouldBan: true,
      banType: 'permanent',
      warningMessage: '🚫 You have been permanently banned from the platform due to repeated violations.'
    }
  }
  
  return {
    shouldWarn: false,
    shouldBan: false
  }
}

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
 * Report a user - creates a report record and checks for violations
 */
export async function reportUser(
  reporterId: string,
  reportedUserId: string,
  reason?: string
): Promise<{ 
  success: boolean
  error?: string
  shouldWarn?: boolean
  shouldBan?: boolean
  banType?: '2week' | 'permanent'
  warningMessage?: string
}> {
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
    
    // Check for violations
    const violation = await checkReportViolation(reportedUserId)
    
    return { 
      success: true,
      ...violation
    }
  } catch (error: any) {
    console.error('[Report] Unexpected error:', error)
    return { success: false, error: error?.message || 'Failed to report user' }
  }
}

/**
 * Block a user - creates a block record, unmatch, and checks for violations
 */
export async function blockUser(
  blockerId: string,
  blockedUserId: string,
  matchId?: string
): Promise<{ 
  success: boolean
  error?: string
  shouldWarn?: boolean
  shouldBan?: boolean
  banType?: '2week' | 'permanent'
  warningMessage?: string
}> {
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
    
    // Check for violations
    const violation = await checkBlockViolation(blockedUserId)
    
    return { 
      success: true,
      ...violation
    }
  } catch (error: any) {
    console.error('[Block] Unexpected error:', error)
    return { success: false, error: error?.message || 'Failed to block user' }
  }
}

