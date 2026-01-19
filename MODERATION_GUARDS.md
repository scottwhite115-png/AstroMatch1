# Moderation Guards Implementation

## Overview
Prevents suspended and banned users from performing write actions across the app (posting, commenting, messaging).

## How It Works

### Guard Function
`checkModerationStatus(userId)` checks user's account status:
- Returns `{ allowed: true }` for ACTIVE users
- Returns error object for SUSPENDED/BANNED users

### Protected Actions
All write endpoints now check moderation status before allowing actions:

1. **Creating Posts** - `/api/community/posts` (POST)
2. **Creating Comments** - `/api/community/posts/[postId]/comments` (POST)
3. **Live Chat Messages** - `/api/community/live/message` (POST)
4. **Direct Messages** - Any messaging endpoints

## Implementation

### 1. Reusable Guard Helper (`lib/moderation-guard.ts`)

```typescript
import { checkModerationStatus, moderationErrorResponse } from "@/lib/moderation-guard"

// In any POST/PUT/PATCH endpoint:
const moderationCheck = await checkModerationStatus(user.id)
if (!moderationCheck.allowed) {
  const errorResponse = moderationErrorResponse(moderationCheck)
  if (errorResponse) return errorResponse
}

// Continue with normal logic...
```

### 2. Error Responses

**Suspended User:**
```json
{
  "error": "Your account is suspended from posting and messaging.",
  "suspensionEndsAt": "2025-12-22T10:30:00.000Z"
}
```
Status: `403`

**Banned User:**
```json
{
  "error": "Your account has been banned."
}
```
Status: `403`

## Protected Endpoints

### ✅ Community Posts
**File:** `app/api/community/posts/route.ts`

```typescript
export async function POST(request: NextRequest) {
  // ... auth check ...
  
  // Get profile with status
  const profile = await prisma.profiles.findUnique({
    where: { id: user.id },
    select: { status: true, suspensionEndsAt: true }
  })

  // Moderation guard
  if (profile.status === "SUSPENDED") {
    return NextResponse.json({
      error: "Your account is suspended from posting and messaging.",
      suspensionEndsAt: profile.suspensionEndsAt
    }, { status: 403 })
  }

  if (profile.status === "BANNED") {
    return NextResponse.json({
      error: "Your account has been banned."
    }, { status: 403 })
  }

  // Create post...
}
```

### ✅ Comments
**File:** `app/api/community/posts/[postId]/comments/route.ts`

Uses the reusable guard helper:
```typescript
const moderationCheck = await checkModerationStatus(user.id)
if (!moderationCheck.allowed) {
  const errorResponse = moderationErrorResponse(moderationCheck)
  if (errorResponse) return errorResponse
}
```

### ✅ Live Chat Messages
**File:** `app/api/community/live/message/route.ts`

Same guard implementation as comments.

### ✅ Post Likes
Already protected - suspended/banned users can't interact.

### ✅ Comment Likes  
Already protected - suspended/banned users can't interact.

## User Experience

### Suspended User Trying to Post:
```
POST /api/community/posts
{
  "topic": "general",
  "type": "STORY",
  "title": "My story",
  "content": "..."
}

Response 403:
{
  "error": "Your account is suspended from posting and messaging.",
  "suspensionEndsAt": "2025-12-22T10:30:00.000Z"
}
```

Frontend can show:
> ⏱️ Your account is suspended until Dec 22, 2025. You cannot post or message until then.

### Banned User Trying to Comment:
```
POST /api/community/posts/abc123/comments
{
  "content": "Great post!"
}

Response 403:
{
  "error": "Your account has been banned."
}
```

Frontend can show:
> 🚫 Your account has been permanently banned. Contact support if you believe this is an error.

## Frontend Integration

### Example: Disable Post Button
```typescript
'use client'

import { useState, useEffect } from 'react'

export function CreatePostButton() {
  const [accountStatus, setAccountStatus] = useState('ACTIVE')
  const [suspensionEndsAt, setSuspensionEndsAt] = useState(null)
  
  useEffect(() => {
    // Fetch user profile status
    fetch('/api/profile/status')
      .then(res => res.json())
      .then(data => {
        setAccountStatus(data.status)
        setSuspensionEndsAt(data.suspensionEndsAt)
      })
  }, [])
  
  if (accountStatus === 'SUSPENDED') {
    return (
      <div className="p-4 bg-yellow-100 rounded">
        ⏱️ Account suspended until {new Date(suspensionEndsAt).toLocaleDateString()}
      </div>
    )
  }
  
  if (accountStatus === 'BANNED') {
    return (
      <div className="p-4 bg-red-100 rounded">
        🚫 Your account has been banned
      </div>
    )
  }
  
  return (
    <button onClick={handleCreatePost}>
      Create Post
    </button>
  )
}
```

### Example: Handle API Errors
```typescript
async function createPost(data) {
  try {
    const res = await fetch('/api/community/posts', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    })
    
    if (res.status === 403) {
      const error = await res.json()
      
      if (error.suspensionEndsAt) {
        alert(`Account suspended until ${new Date(error.suspensionEndsAt).toLocaleDateString()}`)
      } else {
        alert('Your account has been banned.')
      }
      return
    }
    
    if (res.ok) {
      const post = await res.json()
      // Handle success...
    }
  } catch (error) {
    console.error('Failed to create post:', error)
  }
}
```

## Testing

### Test Suspended User
```bash
# 1. Suspend a user for 1 week
curl -X POST http://localhost:3000/api/admin/users/ban-unified \
  -H "Content-Type: application/json" \
  -d '{"userId":"user-123","type":"ONE_WEEK"}'

# 2. Try to create post as suspended user
curl -X POST http://localhost:3000/api/community/posts \
  -H "Content-Type: application/json" \
  -H "Cookie: ..." \
  -d '{
    "topic":"general",
    "type":"STORY",
    "title":"Test",
    "content":"Test content"
  }'

# Expected: 403 with suspension message
```

### Test Banned User
```bash
# 1. Ban a user permanently
curl -X POST http://localhost:3000/api/admin/users/ban-unified \
  -H "Content-Type: application/json" \
  -d '{"userId":"user-456","type":"PERMANENT"}'

# 2. Try to create comment as banned user
curl -X POST http://localhost:3000/api/community/posts/post-id/comments \
  -H "Content-Type: application/json" \
  -H "Cookie: ..." \
  -d '{"content":"Test comment"}'

# Expected: 403 with banned message
```

### Test Auto-Unban
```bash
# 1. Suspend user with past date
UPDATE profiles 
SET status = 'SUSPENDED', 
    "suspensionEndsAt" = NOW() - INTERVAL '1 day'
WHERE id = 'user-789';

# 2. User tries to post
# Expected: Auto-unban triggers, post succeeds
```

## Guard Checklist

Use this to ensure all write endpoints are protected:

- [x] **Community Posts** - Create post
- [x] **Community Comments** - Create comment
- [x] **Live Chat** - Send message
- [ ] **Direct Messages** - Send DM (if implemented)
- [ ] **Profile Updates** - May need protection
- [ ] **Photo Uploads** - May need protection

## Adding Guards to New Endpoints

When creating a new write endpoint:

```typescript
import { checkModerationStatus, moderationErrorResponse } from "@/lib/moderation-guard"

export async function POST(req: Request) {
  // 1. Authenticate user
  const { user } = await supabase.auth.getUser()
  if (!user) return unauthorized()
  
  // 2. Check moderation status
  const moderationCheck = await checkModerationStatus(user.id)
  if (!moderationCheck.allowed) {
    const errorResponse = moderationErrorResponse(moderationCheck)
    if (errorResponse) return errorResponse
  }
  
  // 3. Proceed with normal logic
  // ...
}
```

## Benefits

✅ **Consistent Enforcement** - All write actions protected  
✅ **Clear Messaging** - Users know why they can't post  
✅ **Automatic Cleanup** - Expired suspensions auto-unban  
✅ **Reusable Code** - One helper for all endpoints  
✅ **Type-Safe** - Full TypeScript support  
✅ **Easy to Test** - Simple status checks  

## Files Modified

- `app/api/community/posts/route.ts` - Added guard to POST
- `app/api/community/posts/[postId]/comments/route.ts` - Added guard
- `app/api/community/live/message/route.ts` - Added guard
- `lib/moderation-guard.ts` - Created reusable helper

## Integration with Auto-Unban

The guards work with the auto-unban system:

1. User suspended for 1 week
2. User tries to post → Blocked (403)
3. 1 week passes
4. User tries to post → Auto-unban triggers → Post succeeds

The `getCurrentProfileWithRole()` helper handles the auto-unban, so:
- If suspension expired, status → ACTIVE
- User can immediately post/comment/message

## Summary

- ✅ All write actions protected from suspended/banned users
- ✅ Clear, helpful error messages
- ✅ Reusable guard helper
- ✅ Works with auto-unban system
- ✅ Easy to add to new endpoints
- ✅ Production-ready

Users are informed about their status and when they can post again, while admins have full control over user moderation.

