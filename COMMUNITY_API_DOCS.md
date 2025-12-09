# Community API - Complete Implementation

## ✅ Threads API (Stories & Q&A)

### `GET /api/community/posts`
**Fetch posts with filtering and pagination**

Query params:
- `topic` - Filter by topic (e.g., "general-astrology")
- `cursor` - Pagination cursor (ISO date string)
- `limit` - Max results (default 20, max 50)
- `sort` - "latest" (default) | "top"

Response:
```json
{
  "posts": [{
    "id": "...",
    "topic": "general-astrology",
    "type": "STORY" | "QUESTION",
    "title": "...",
    "snippet": "First 200 chars...",
    "createdAt": "2025-01-01T00:00:00.000Z",
    "likeCount": 10,
    "commentCount": 5,
    "author": {
      "id": "...",
      "displayName": "...",
      "eastWestCode": "Leo Rabbit",
      "chineseSign": "Rabbit"
    }
  }],
  "nextCursor": "2025-01-01T00:00:00.000Z" | null
}
```

### `POST /api/community/posts`
**Create a new post**

Auth: Required

Body:
```json
{
  "topic": "general-astrology",
  "type": "STORY" | "QUESTION",
  "title": "Post title (3-200 chars)",
  "content": "Post content (10-10000 chars)"
}
```

### `GET /api/community/posts/[postId]`
**Get full post with all comments**

Returns post + threaded comments (1 level nesting)

### `POST /api/community/posts/[postId]/comments`
**Add a comment to a post**

Auth: Required

Body:
```json
{
  "content": "Comment text (1-2000 chars)",
  "parentId": "optional-comment-id-to-reply-to"
}
```

Creates notification for post author or parent comment author.

### `POST /api/community/comments/[commentId]/like`
**Toggle like on a comment**

Auth: Required

Response:
```json
{
  "liked": true,
  "likeCount": 15
}
```

---

## ✅ San He Live Chat API

### `POST /api/community/live/join`
**Join a San He house chat room**

Auth: Required

Body:
```json
{
  "house": "VISIONARIES" | "STRATEGISTS" | "ADVENTURERS" | "ARTISTS",
  "regionScope": "NEAR_ME" | "COUNTRY" | "GLOBAL",
  "countryCode": "US" (optional, for COUNTRY scope)
}
```

Logic:
- Finds active room with space and recent activity
- Creates new room if none available
- Manages user presence (removes from old room if switching)
- Updates room user counts

Response:
```json
{
  "roomId": "...",
  "house": "VISIONARIES",
  "regionScope": "GLOBAL",
  "countryCode": null,
  "maxUsers": 40,
  "currentUsers": 12
}
```

### `GET /api/community/live/room`
**Get current room info and recent messages**

Auth: Required

Query params:
- `house` - Filter by house (optional)
- `regionScope` - Filter by scope (optional)

Response:
```json
{
  "room": {
    "id": "...",
    "house": "VISIONARIES",
    "regionScope": "GLOBAL",
    "countryCode": null,
    "maxUsers": 40,
    "currentUsers": 12
  },
  "messages": [{
    "id": "...",
    "content": "Message text",
    "createdAt": "2025-01-01T00:00:00.000Z",
    "author": {
      "id": "...",
      "displayName": "...",
      "eastWestCode": "Leo Rabbit",
      "chineseSign": "Rabbit",
      "photoUrl": "..."
    }
  }]
}
```

Returns last 100 messages in chronological order.

### `POST /api/community/live/message`
**Send a message to current room**

Auth: Required

Body:
```json
{
  "roomId": "...",
  "content": "Message text (1-500 chars)"
}
```

Validates user has presence in the room.

### `POST /api/community/live/switch`
**Switch to a different room (Meet new people)**

Auth: Required

Body:
```json
{
  "house": "VISIONARIES",
  "regionScope": "GLOBAL",
  "countryCode": "US" (optional)
}
```

Logic:
- Removes user from current room in that house/scope
- Finds different active room with space
- Creates new room if none available
- Returns new room info

---

## 🧹 Cleanup Utility

**Script:** `scripts/cleanup-sanhe-chat.ts`

Functions:
- `cleanupSanHeRooms()` - Mark rooms inactive after 24h no activity
- `truncateOldMessages()` - Keep only last 200 messages per room
- `cleanupStalePresence()` - Remove presence not updated in 2h
- `runFullCleanup()` - Run all cleanup tasks

Run manually:
```bash
npx tsx scripts/cleanup-sanhe-chat.ts
```

Or setup as cron job / Vercel cron.

---

## San He House Mapping

```typescript
VISIONARIES  → Rat · Dragon · Monkey
STRATEGISTS  → Ox · Snake · Rooster
ADVENTURERS  → Tiger · Horse · Dog
ARTISTS      → Rabbit · Goat · Pig
```

---

## Features

### Threads (Stories & Q&A)
- ✅ Cursor-based pagination
- ✅ Topic filtering
- ✅ Sort by latest or top (engagement)
- ✅ Nested comments (1 level)
- ✅ Like comments
- ✅ Notifications for replies
- ✅ Author preview with zodiac info

### San He Live Chat
- ✅ Regional sharding (NEAR_ME/COUNTRY/GLOBAL)
- ✅ Dynamic room creation
- ✅ Max 40 users per room (soft cap)
- ✅ User presence tracking
- ✅ Switch rooms ("Meet new people")
- ✅ Message history (last 100)
- ✅ Automatic cleanup of old data

---

## Usage Example

```typescript
// Fetch posts
const response = await fetch('/api/community/posts?topic=general-astrology&sort=latest&limit=20')
const { posts, nextCursor } = await response.json()

// Create post
await fetch('/api/community/posts', {
  method: 'POST',
  body: JSON.stringify({
    topic: 'general-astrology',
    type: 'QUESTION',
    title: 'What does Mercury retrograde mean?',
    content: 'I keep hearing about Mercury retrograde...'
  })
})

// Join San He house
const room = await fetch('/api/community/live/join', {
  method: 'POST',
  body: JSON.stringify({
    house: 'VISIONARIES',
    regionScope: 'GLOBAL'
  })
}).then(r => r.json())

// Send message
await fetch('/api/community/live/message', {
  method: 'POST',
  body: JSON.stringify({
    roomId: room.roomId,
    content: 'Hello from Rat-Dragon-Monkey lounge! 🐉'
  })
})
```

---

## Notes

- All routes use Supabase auth
- Strongly typed with Prisma
- Transaction-safe operations
- No WebSockets yet (use polling/SWR)
- Ready for real-time layer

