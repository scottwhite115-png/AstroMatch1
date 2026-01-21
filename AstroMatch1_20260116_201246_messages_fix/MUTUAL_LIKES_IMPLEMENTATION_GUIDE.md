# Mutual Likes System Implementation

## Summary of Changes

This document outlines the changes made to implement a mutual likes system where:
1. A like from User A to User B creates a record
2. When User B likes User A back, a conversation is automatically created
3. Only mutual matches appear in Messages

## Files Created

### 1. Database Migration: `scripts/010_create_likes_table.sql`

Creates the `likes` table and adds `is_new_match` flag to conversations:

```sql
create table public.likes (
  id uuid primary key,
  from_user_id uuid references profiles(id),
  to_user_id uuid references profiles(id),
  created_at timestamptz,
  unique(from_user_id, to_user_id)
);

alter table public.conversations 
add column is_new_match boolean default true;
```

**IMPORTANT**: Run this migration in your Supabase dashboard SQL editor.

### 2. Helper Function: `lib/match/recordLike.ts`

Core function that:
- Records a like from one user to another
- Checks for mutual likes
- Creates conversations on mutual match
- Returns status: "liked_only", "new_match", or "already_matched"

## Implementation Guide

### Step 1: Run the Database Migration

Go to your Supabase dashboard → SQL Editor → Run:
```bash
/scripts/010_create_likes_table.sql
```

### Step 2: Integrate recordLike into Matches Page

The matches page (`app/matches/page.tsx`) currently uses a swipe card system. You need to:

1. **Import the recordLike function**:
```typescript
import { recordLike } from "@/lib/match/recordLike"
import { createClient } from "@/utils/supabase/client"
```

2. **Get current user ID** (add near the top of component):
```typescript
const [currentUserId, setCurrentUserId] = useState<string | null>(null)

useEffect(() => {
  const fetchUser = async () => {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    setCurrentUserId(user?.id || null)
  }
  fetchUser()
}, [])
```

3. **Find the swipe handler** (search for where swipe logic occurs - likely in `onTouchEnd` or `onMouseUp`)

4. **Replace/add like logic**:
```typescript
const handleLike = async (profileId: number) => {
  if (!currentUserId) return
  
  const result = await recordLike({
    fromUserId: currentUserId,
    toUserId: String(profileId)
  })
  
  if (result.status === "new_match") {
    // Show "It's a Match!" animation
    setShowMatchAnimation(true)
    // Optionally navigate to the conversation
    // router.push(`/messages/${result.conversationId}`)
  } else if (result.status === "liked_only") {
    // Just move to next profile
  }
  
  // Move to next profile
  nextProfile()
}
```

### Step 3: Update Messages Page

File: `app/messages/page.tsx`

The messages page currently shows all conversations. Update it to:
- Only fetch conversations where both users have liked each other
- Show "New Match!" badge for conversations with `is_new_match = true`

Example query:
```typescript
const { data: conversations } = await supabase
  .from('conversations')
  .select(`
    *,
    user1:profiles!conversations_user1_id_fkey(id, name, photos),
    user2:profiles!conversations_user2_id_fkey(id, name, photos),
    messages(content, created_at, sender_id)
  `)
  .or(`user1_id.eq.${userId},user2_id.eq.${userId}`)
  .order('last_message_at', { ascending: false })
```

### Step 4: Add "It's a Match!" Animation

Create a match modal component that appears when a mutual match happens:

```typescript
{showMatchAnimation && (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80">
    <div className="text-center">
      <h1 className="text-6xl mb-4">💫 It's a Match! 💫</h1>
      <p className="text-2xl text-white mb-8">
        You and {matchedProfile?.name} like each other!
      </p>
      <div className="flex gap-4">
        <button onClick={() => router.push(`/messages/${conversationId}`)}>
          Send Message
        </button>
        <button onClick={() => setShowMatchAnimation(false)}>
          Keep Swiping
        </button>
      </div>
    </div>
  </div>
)}
```

## Testing Checklist

- [ ] Run database migration
- [ ] Test liking a profile (should create likes record)
- [ ] Test mutual like (should create conversation)
- [ ] Verify conversation appears in Messages
- [ ] Test "It's a Match!" animation
- [ ] Verify non-mutual likes don't show in Messages

## Notes

- The matches page has a swipe card system with gesture handling
- Look for `onTouchEnd`, `onMouseUp`, or swipe threshold logic
- The current implementation uses test data - make sure to integrate with real profiles
- Consider adding a "pass" action that records rejected profiles to avoid showing them again



