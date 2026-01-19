/**
 * Message Actions
 * Handle chat messages between matched users
 */

import { createClient } from './client'
import { fetchUserProfile } from './profileQueries'
import { getChinesePatternCode } from '../matchEngineHelpers'

export interface Message {
  id: string
  match_id: string
  sender_id: string
  receiver_id: string
  content: string
  message_type: 'text' | 'gif' | 'emoji' | 'image'
  is_read: boolean
  read_at?: string
  created_at: string
  updated_at: string
}

export interface SendMessageResult {
  success: boolean
  message?: Message
  error?: string
}

/**
 * Send a message to a matched user
 * Checks instant messaging settings - if disabled, requires a match first
 */
export async function sendMessage(
  matchId: string,
  senderId: string,
  receiverId: string,
  content: string,
  messageType: 'text' | 'gif' | 'emoji' | 'image' = 'text',
  messageSource?: 'connections' | 'discover' // Track where message is coming from
): Promise<SendMessageResult> {
  const supabase = createClient()

  try {
    // Check if receiver allows instant messages
    const { data: receiverProfile } = await supabase
      .from('profiles')
      .select('allow_instant_messages_connections, allow_instant_messages_discover, only_sanhe_liuhe_messages, chinese_sign')
      .eq('id', receiverId)
      .single()

    if (receiverProfile) {
      // Determine which setting to check based on message source
      const allowInstantMessages = messageSource === 'connections' 
        ? (receiverProfile.allow_instant_messages_connections ?? true)
        : (receiverProfile.allow_instant_messages_discover ?? true)

      if (!allowInstantMessages) {
        // Check if there's an active match - if not, they can't message
        const { data: match } = await supabase
          .from('matches')
          .select('id, is_active')
          .eq('id', matchId)
          .single()

        if (!match || !match.is_active) {
          return {
            success: false,
            error: 'This user requires a mutual match before messaging. Please swipe right on their profile first.'
          }
        }
      }

      // Check if receiver only accepts Soulmate & Secret Friends messages
      if (receiverProfile.only_sanhe_liuhe_messages) {
        // Fetch sender's profile to get Chinese sign
        const senderProfile = await fetchUserProfile(senderId)
        
        if (senderProfile && receiverProfile.chinese_sign && senderProfile.chinese_sign) {
          // Calculate Chinese pattern between sender and receiver
          const pattern = getChinesePatternCode(senderProfile.chinese_sign, receiverProfile.chinese_sign)
          
          // Only allow San He (Soulmate) or Liu He (Secret Friends) patterns
          if (pattern !== 'SAN_HE' && pattern !== 'LIU_HE') {
            return {
              success: false,
              error: 'This user only accepts messages from Soulmate or Secret Friends profiles.'
            }
          }
        }
      }
    }

    const { data, error } = await supabase
      .from('messages')
      .insert({
        match_id: matchId,
        sender_id: senderId,
        receiver_id: receiverId,
        content: content,
        message_type: messageType
      })
      .select()
      .single()

    if (error) {
      console.error('[Message Actions] Error sending message:', error)
      return {
        success: false,
        error: error.message
      }
    }

    return {
      success: true,
      message: data as Message
    }
  } catch (error) {
    console.error('[Message Actions] Unexpected error:', error)
    return {
      success: false,
      error: 'Unexpected error sending message'
    }
  }
}

/**
 * Get messages for a match
 */
export async function getMessages(matchId: string, limit: number = 50): Promise<Message[]> {
  const supabase = createClient()

  const { data, error } = await supabase
    .from('messages')
    .select('*')
    .eq('match_id', matchId)
    .order('created_at', { ascending: true })
    .limit(limit)

  if (error) {
    console.error('[Message Actions] Error fetching messages:', error)
    return []
  }

  return (data as Message[]) || []
}

/**
 * Mark a message as read
 */
export async function markMessageAsRead(messageId: string): Promise<boolean> {
  const supabase = createClient()

  const { error } = await supabase
    .rpc('mark_message_read', { message_id: messageId })

  if (error) {
    console.error('[Message Actions] Error marking message as read:', error)
    return false
  }

  return true
}

/**
 * Mark all messages in a match as read
 */
export async function markMatchMessagesAsRead(matchId: string): Promise<boolean> {
  const supabase = createClient()

  const { error } = await supabase
    .rpc('mark_match_messages_read', { match_id_param: matchId })

  if (error) {
    console.error('[Message Actions] Error marking match messages as read:', error)
    return false
  }

  return true
}

/**
 * Get unread message count
 */
export async function getUnreadMessageCount(): Promise<number> {
  const supabase = createClient()

  const { data, error } = await supabase
    .rpc('get_unread_message_count')

  if (error) {
    console.error('[Message Actions] Error getting unread count:', error)
    return 0
  }

  return data || 0
}

/**
 * Subscribe to new messages for a match (real-time)
 */
export function subscribeToMessages(
  matchId: string,
  onMessage: (message: Message) => void
) {
  const supabase = createClient()

  const subscription = supabase
    .channel(`messages:${matchId}`)
    .on(
      'postgres_changes',
      {
        event: 'INSERT',
        schema: 'public',
        table: 'messages',
        filter: `match_id=eq.${matchId}`
      },
      (payload) => {
        onMessage(payload.new as Message)
      }
    )
    .subscribe()

  return subscription
}

/**
 * Unsubscribe from messages
 */
export async function unsubscribeFromMessages(subscription: any) {
  await subscription.unsubscribe()
}

/**
 * Delete a message (soft delete)
 */
export async function deleteMessage(messageId: string): Promise<boolean> {
  const supabase = createClient()

  const { error } = await supabase
    .rpc('soft_delete_message', { message_id: messageId })

  if (error) {
    console.error('[Message Actions] Error deleting message:', error)
    return false
  }

  return true
}

