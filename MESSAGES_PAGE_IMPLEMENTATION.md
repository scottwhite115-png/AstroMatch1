# Messages Page - Mutual Matches Implementation

## Current Status
The Messages page (`app/messages/page.tsx`) currently uses localStorage for demo data. It needs to be updated to:
1. Fetch conversations from Supabase
2. Only show conversations created through mutual likes
3. Display "New Match" badge for fresh matches

## Required Changes

### 1. Update Conversation Interface

Add to `lib/utils/conversations.ts`:

```typescript
export interface Conversation {
  id: string
  userId: string
  userName: string
  userPhoto: string
  lastMessage: string
  timestamp: string
  unread: number
  online: boolean
  messages: Message[]
  isNewMatch?: boolean  // ADD THIS
}
```

### 2. Replace useEffect in `app/messages/page.tsx`

Replace the current useEffect (lines 69-132) with:

```typescript
useEffect(() => {
  const fetchConversations = async () => {
    setLoading(true)
    
    // Get current user
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) {
      console.log("[Messages] No authenticated user - using demo data")
      setCurrentUser({ id: "mock-user-id" })
      
      // Keep existing demo data code here
      let conversations = getConversations()
      // ... rest of demo logic ...
      setChats(conversations)
      setLoading(false)
      return
    }
    
    setCurrentUser(user)
    console.log("[Messages] Fetching conversations for user:", user.id)
    
    // Fetch conversations where current user is a participant
    // IMPORTANT: Only conversations created through mutual likes exist
    const { data: conversations, error } = await supabase
      .from('conversations')
      .select(`
        id,
        created_at,
        last_message_at,
        is_new_match,
        user1:profiles!conversations_user1_id_fkey(id, full_name, photos),
        user2:profiles!conversations_user2_id_fkey(id, full_name, photos),
        messages(content, created_at, sender_id)
      `)
      .or(`user1_id.eq.${user.id},user2_id.eq.${user.id}`)
      .order('last_message_at', { ascending: false })
    
    if (error) {
      console.error("[Messages] Error fetching conversations:", error)
      setChats([])
      setLoading(false)
      return
    }
    
    // Transform Supabase data to Conversation format
    const formattedChats: Conversation[] = (conversations || []).map(conv => {
      // Determine the other user (not the current user)
      const otherUser = conv.user1.id === user.id ? conv.user2 : conv.user1
      
      // Get last message
      const sortedMessages = (conv.messages || []).sort((a, b) => 
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      )
      const lastMsg = sortedMessages[0]
      
      // Count unread
      const unreadCount = sortedMessages.filter(msg => 
        msg.sender_id === otherUser.id
      ).length
      
      // Format timestamp
      const lastMessageTime = lastMsg ? new Date(lastMsg.created_at) : new Date(conv.created_at)
      const now = new Date()
      const diffMs = now.getTime() - lastMessageTime.getTime()
      const diffMins = Math.floor(diffMs / 60000)
      const diffHours = Math.floor(diffMs / 3600000)
      const diffDays = Math.floor(diffMs / 86400000)
      
      let timestamp = "Just now"
      if (diffMins < 60) timestamp = `${diffMins}m ago`
      else if (diffHours < 24) timestamp = `${diffHours}h ago`
      else if (diffDays < 7) timestamp = `${diffDays}d ago`
      else timestamp = lastMessageTime.toLocaleDateString()
      
      return {
        id: conv.id,
        userId: otherUser.id,
        userName: otherUser.full_name || "User",
        userPhoto: (otherUser.photos && otherUser.photos[0]) || "/placeholder.svg",
        lastMessage: lastMsg?.content || (conv.is_new_match ? "New match! Say hi 👋" : "Start a conversation"),
        timestamp,
        unread: unreadCount,
        online: false,
        messages: sortedMessages.map((msg, idx) => ({
          id: idx + 1,
          text: msg.content,
          sent: msg.sender_id === user.id,
          timestamp: new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        })),
        isNewMatch: conv.is_new_match || false
      }
    })
    
    setChats(formattedChats)
    setLoading(false)
  }
  
  fetchConversations()
  
  // Set up real-time subscription
  const channel = supabase
    .channel('conversations-changes')
    .on(
      'postgres_changes',
      { event: '*', schema: 'public', table: 'conversations' },
      () => {
        console.log('[Messages] Conversation change detected, refetching...')
        fetchConversations()
      }
    )
    .subscribe()
  
  return () => {
    channel.unsubscribe()
  }
}, [])
```

### 3. Add "New Match" Badge to Chat List

In the chat list render (around line 270), add the badge:

```tsx
{chats.map((chat) => (
  <div key={chat.id} className="relative">
    {/* ... existing chat item code ... */}
    
    {/* Add this NEW MATCH badge */}
    {chat.isNewMatch && (
      <div className="absolute top-2 right-2 z-10">
        <span className="px-2 py-1 text-[10px] font-bold bg-gradient-to-r from-pink-500 to-purple-500 text-white rounded-full shadow-lg">
          NEW MATCH
        </span>
      </div>
    )}
    
    {/* ... rest of chat item ... */}
  </div>
))}
```

### 4. Mark Match as "Seen" When Opened

Add to `handleOpenChat` function:

```typescript
const handleOpenChat = async (userId: string) => {
  clearUnreadCount(userId)
  
  // Mark match as seen if it's a new match
  const chat = chats.find(c => c.userId === userId)
  if (chat?.isNewMatch) {
    // Update in Supabase
    const { data: { user } } = await supabase.auth.getUser()
    if (user) {
      await supabase
        .from('conversations')
        .update({ is_new_match: false })
        .eq('id', chat.id)
    }
  }
  
  setChats(chats.map((c) => 
    c.userId === userId 
      ? { ...c, unread: 0, isNewMatch: false } 
      : c
  ))
  
  router.push(`/messages/${userId}`)
}
```

## Important Notes

1. **No free messaging**: Conversations ONLY exist after mutual likes. The `recordLike` function creates them.

2. **Automatic filtering**: By querying only from the `conversations` table, we automatically show only mutual matches.

3. **Real-time updates**: The Supabase subscription ensures new matches appear immediately.

4. **Migration required**: Run `scripts/010_create_likes_table.sql` first!

5. **Fallback to demo**: When no user is authenticated, the page falls back to demo data for design/testing.

## Testing Checklist

- [ ] Run database migration
- [ ] Test mutual like creates conversation
- [ ] Verify conversation appears in Messages
- [ ] Check "New Match" badge shows
- [ ] Confirm badge disappears after opening chat
- [ ] Test real-time updates when new match happens
- [ ] Verify no conversations show for non-mutual likes



