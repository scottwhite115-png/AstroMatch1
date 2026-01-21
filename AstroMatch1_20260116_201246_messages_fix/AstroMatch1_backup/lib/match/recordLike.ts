import { createClient } from "@/lib/supabase/client"

export type RecordLikeResult =
  | { status: "liked_only" }
  | { status: "new_match"; conversationId: string }
  | { status: "already_matched"; conversationId: string }
  | { status: "error"; error: string }

/**
 * Records a like from one user to another.
 * If there's a mutual like, creates a conversation.
 * 
 * @param fromUserId - The ID of the user who is liking
 * @param toUserId - The ID of the user being liked
 * @returns Status of the like action
 */
export async function recordLike({
  fromUserId,
  toUserId,
}: {
  fromUserId: string
  toUserId: string
}): Promise<RecordLikeResult> {
  const supabase = createClient()

  try {
    // Step 1: Insert the like (will fail silently if already exists due to unique constraint)
    const { error: likeError } = await supabase
      .from("likes")
      .insert({
        from_user_id: fromUserId,
        to_user_id: toUserId,
      })
      .select()
      .single()

    // If the like already exists, that's okay - just check for match
    if (likeError && !likeError.message.includes("duplicate")) {
      console.error("Error inserting like:", likeError)
      return { status: "error", error: likeError.message }
    }

    // Step 2: Check if there's a reverse like (mutual match)
    const { data: reverseLike, error: reverseLikeError } = await supabase
      .from("likes")
      .select("id")
      .eq("from_user_id", toUserId)
      .eq("to_user_id", fromUserId)
      .single()

    if (reverseLikeError && reverseLikeError.code !== "PGRST116") {
      // PGRST116 is "no rows returned" which is expected if no reverse like
      console.error("Error checking reverse like:", reverseLikeError)
    }

    // Step 3: If no reverse like exists, it's just a one-way like
    if (!reverseLike) {
      return { status: "liked_only" }
    }

    // Step 4: Mutual like detected! Check if conversation already exists
    // Need to check both directions since conversations use (user1_id, user2_id)
    const { data: existingConversation, error: convCheckError } = await supabase
      .from("conversations")
      .select("id")
      .or(`and(user1_id.eq.${fromUserId},user2_id.eq.${toUserId}),and(user1_id.eq.${toUserId},user2_id.eq.${fromUserId})`)
      .single()

    if (convCheckError && convCheckError.code !== "PGRST116") {
      console.error("Error checking existing conversation:", convCheckError)
    }

    // Step 5: If conversation exists, return it
    if (existingConversation) {
      return {
        status: "already_matched",
        conversationId: existingConversation.id,
      }
    }

    // Step 6: Create new conversation
    // Use smaller user ID as user1_id to maintain consistency
    const [user1Id, user2Id] = [fromUserId, toUserId].sort()

    const { data: newConversation, error: convError } = await supabase
      .from("conversations")
      .insert({
        user1_id: user1Id,
        user2_id: user2Id,
        is_new_match: true,
        last_message_at: new Date().toISOString(),
      })
      .select("id")
      .single()

    if (convError) {
      console.error("Error creating conversation:", convError)
      return { status: "error", error: convError.message }
    }

    // Step 7: Optionally create a notification
    try {
      await supabase.from("notifications").insert([
        {
          user_id: toUserId,
          type: "match",
          content: {
            matched_user_id: fromUserId,
            conversation_id: newConversation.id,
          },
        },
        {
          user_id: fromUserId,
          type: "match",
          content: {
            matched_user_id: toUserId,
            conversation_id: newConversation.id,
          },
        },
      ])
    } catch (notifError) {
      // Non-critical error, just log it
      console.error("Error creating match notifications:", notifError)
    }

    return {
      status: "new_match",
      conversationId: newConversation.id,
    }
  } catch (error) {
    console.error("Unexpected error in recordLike:", error)
    return {
      status: "error",
      error: error instanceof Error ? error.message : "Unknown error",
    }
  }
}

/**
 * Check if two users have mutually liked each other
 */
export async function checkMutualLike({
  userId1,
  userId2,
}: {
  userId1: string
  userId2: string
}): Promise<boolean> {
  const supabase = createClient()

  const { data: like1 } = await supabase
    .from("likes")
    .select("id")
    .eq("from_user_id", userId1)
    .eq("to_user_id", userId2)
    .single()

  const { data: like2 } = await supabase
    .from("likes")
    .select("id")
    .eq("from_user_id", userId2)
    .eq("to_user_id", userId1)
    .single()

  return !!(like1 && like2)
}

/**
 * Get the conversation ID for two users if they have a mutual match
 */
export async function getConversationId({
  userId1,
  userId2,
}: {
  userId1: string
  userId2: string
}): Promise<string | null> {
  const supabase = createClient()

  const { data: conversation } = await supabase
    .from("conversations")
    .select("id")
    .or(`and(user1_id.eq.${userId1},user2_id.eq.${userId2}),and(user1_id.eq.${userId2},user2_id.eq.${userId1})`)
    .single()

  return conversation?.id || null
}

