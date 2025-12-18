/**
 * Message Actions
 * Handle chat messages between matched users
 */

import { createClient } from './client'

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
 */
export async function sendMessage(
  matchId: string,
  senderId: string,
  receiverId: string,
  content: string,
  messageType: 'text' | 'gif' | 'emoji' | 'image' = 'text'
): Promise<SendMessageResult> {
  const supabase = createClient()

  try {
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

