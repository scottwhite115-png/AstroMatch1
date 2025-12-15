# Block Integration Guide

## 🎯 How to Filter Blocked Users Across the App

Use the helpers in `lib/utils/block-helpers.ts` to exclude blocked users from all content.

---

## 📚 Helper Functions Reference

```typescript
import {
  isUserBlocked,           // Check if A blocked B
  isBlockedEitherWay,      // Check if blocked in either direction
  getBlockedUserIds,       // Get all IDs user has blocked
  getBlockedByUserIds,     // Get all IDs who blocked user
  getAllBlockedRelationships, // Get all blocked relationships
  filterBlockedUsers,      // Filter array of user IDs
  canUsersInteract,        // Check if users can interact
} from "@/lib/utils/block-helpers"
```

---

## 🔧 Integration Examples

### **1. Community Feed (Hide Posts from Blocked Users)**

**File:** `app/api/community/posts/route.ts`

```typescript
import { getCurrentProfileWithRole } from "@/lib/auth-helpers"
import { getBlockedUserIds } from "@/lib/utils/block-helpers"

export async function GET(req: Request) {
  const profile = await getCurrentProfileWithRole()
  if (!profile) return NextResponse.json({ error: "Not authenticated" }, { status: 401 })

  // Get all users current user has blocked
  const blockedUserIds = await getBlockedUserIds(profile.id)

  // Fetch posts, excluding blocked users
  const posts = await prisma.post.findMany({
    where: {
      authorId: {
        notIn: blockedUserIds  // ✅ Exclude posts from blocked users
      },
      isHidden: false  // Also exclude hidden posts
    },
    include: {
      author: true,
      // ... other relations
    },
    orderBy: { createdAt: "desc" },
    take: 50
  })

  return NextResponse.json({ posts })
}
```

---

### **2. Discover/Matches (Hide Blocked Profiles)**

**File:** `app/api/matches/discover/route.ts`

```typescript
import { getCurrentProfileWithRole } from "@/lib/auth-helpers"
import { getAllBlockedRelationships } from "@/lib/utils/block-helpers"

export async function GET(req: Request) {
  const profile = await getCurrentProfileWithRole()
  if (!profile) return NextResponse.json({ error: "Not authenticated" }, { status: 401 })

  // Get all blocked relationships (both directions)
  const { all: allBlockedIds } = await getAllBlockedRelationships(profile.id)

  // Fetch potential matches, excluding:
  // - Current user
  // - Users they blocked
  // - Users who blocked them
  const matches = await prisma.profiles.findMany({
    where: {
      id: {
        notIn: [profile.id, ...allBlockedIds]  // ✅ Exclude all blocked relationships
      },
      status: "ACTIVE"  // Only active users
    },
    take: 20
  })

  return NextResponse.json({ matches })
}
```

---

### **3. Messages (Block Sending to Blocked Users)**

**File:** `app/api/messages/send/route.ts`

```typescript
import { getCurrentProfileWithRole } from "@/lib/auth-helpers"
import { isBlockedEitherWay } from "@/lib/utils/block-helpers"

export async function POST(req: Request) {
  const profile = await getCurrentProfileWithRole()
  if (!profile) return NextResponse.json({ error: "Not authenticated" }, { status: 401 })

  const { recipientId, content } = await req.json()

  // Check if users have blocked each other (either direction)
  const blocked = await isBlockedEitherWay(profile.id, recipientId)
  
  if (blocked) {
    return NextResponse.json(
      { error: "Cannot send message to this user." },
      { status: 403 }
    )
  }

  // Create message
  const message = await prisma.message.create({
    data: {
      senderId: profile.id,
      recipientId,
      content
    }
  })

  return NextResponse.json({ message })
}
```

---

### **4. Conversations List (Hide Conversations with Blocked Users)**

**File:** `app/api/messages/conversations/route.ts`

```typescript
import { getCurrentProfileWithRole } from "@/lib/auth-helpers"
import { getAllBlockedRelationships } from "@/lib/utils/block-helpers"

export async function GET(req: Request) {
  const profile = await getCurrentProfileWithRole()
  if (!profile) return NextResponse.json({ error: "Not authenticated" }, { status: 401 })

  // Get all blocked relationships
  const { all: blockedIds } = await getAllBlockedRelationships(profile.id)

  // Fetch conversations, excluding blocked users
  const conversations = await prisma.conversation.findMany({
    where: {
      participants: {
        some: { id: profile.id }
      },
      // Exclude conversations with blocked users
      participants: {
        none: {
          id: { in: blockedIds }
        }
      }
    },
    include: {
      participants: true,
      lastMessage: true
    },
    orderBy: { updatedAt: "desc" }
  })

  return NextResponse.json({ conversations })
}
```

---

### **5. Comments (Hide Comments from Blocked Users)**

**File:** `app/api/community/posts/[postId]/comments/route.ts`

```typescript
import { getCurrentProfileWithRole } from "@/lib/auth-helpers"
import { getBlockedUserIds } from "@/lib/utils/block-helpers"

export async function GET(
  req: Request,
  { params }: { params: { postId: string } }
) {
  const profile = await getCurrentProfileWithRole()
  if (!profile) return NextResponse.json({ error: "Not authenticated" }, { status: 401 })

  // Get blocked users
  const blockedUserIds = await getBlockedUserIds(profile.id)

  // Fetch comments, excluding blocked users
  const comments = await prisma.comment.findMany({
    where: {
      postId: params.postId,
      authorId: {
        notIn: blockedUserIds  // ✅ Hide comments from blocked users
      }
    },
    include: {
      author: true
    },
    orderBy: { createdAt: "asc" }
  })

  return NextResponse.json({ comments })
}
```

---

### **6. User Search (Exclude Blocked Users)**

**File:** `app/api/users/search/route.ts`

```typescript
import { getCurrentProfileWithRole } from "@/lib/auth-helpers"
import { getAllBlockedRelationships } from "@/lib/utils/block-helpers"

export async function GET(req: Request) {
  const profile = await getCurrentProfileWithRole()
  if (!profile) return NextResponse.json({ error: "Not authenticated" }, { status: 401 })

  const { searchParams } = new URL(req.url)
  const query = searchParams.get("q") || ""

  // Get all blocked relationships
  const { all: blockedIds } = await getAllBlockedRelationships(profile.id)

  // Search users, excluding blocked
  const users = await prisma.profiles.findMany({
    where: {
      OR: [
        { display_name: { contains: query, mode: "insensitive" } },
        { username: { contains: query, mode: "insensitive" } }
      ],
      id: {
        notIn: [profile.id, ...blockedIds]  // ✅ Exclude self and blocked users
      },
      status: "ACTIVE"
    },
    take: 20
  })

  return NextResponse.json({ users })
}
```

---

### **7. Profile View (Show Block Status)**

**File:** `app/profile/view/[id]/page.tsx`

```typescript
import { getCurrentProfileWithRole } from "@/lib/auth-helpers"
import { isUserBlocked, isBlockedEitherWay } from "@/lib/utils/block-helpers"
import { BlockUserButton } from "@/components/community/BlockUserButton"

export default async function ViewProfilePage({ params }: { params: { id: string } }) {
  const [currentUser, targetProfile] = await Promise.all([
    getCurrentProfileWithRole(),
    prisma.profiles.findUnique({ where: { id: params.id } })
  ])

  if (!currentUser || !targetProfile) {
    notFound()
  }

  // Check block status
  const isBlocked = await isUserBlocked(currentUser.id, targetProfile.id)
  const blockedEitherWay = await isBlockedEitherWay(currentUser.id, targetProfile.id)

  return (
    <div>
      <h1>{targetProfile.display_name}</h1>
      
      {/* Show block button */}
      <BlockUserButton
        userId={targetProfile.id}
        userName={targetProfile.display_name}
        isBlocked={isBlocked}
      />

      {/* Show warning if they blocked you */}
      {blockedEitherWay && !isBlocked && (
        <div className="text-gray-500 text-sm">
          This user has blocked you.
        </div>
      )}

      {/* Hide content if blocked either way */}
      {!blockedEitherWay && (
        <div>
          {/* ... profile content ... */}
        </div>
      )}
    </div>
  )
}
```

---

### **8. Live Chat (Filter Blocked Users)**

**File:** `app/api/community/live/messages/route.ts`

```typescript
import { getCurrentProfileWithRole } from "@/lib/auth-helpers"
import { getBlockedUserIds } from "@/lib/utils/block-helpers"

export async function GET(req: Request) {
  const profile = await getCurrentProfileWithRole()
  if (!profile) return NextResponse.json({ error: "Not authenticated" }, { status: 401 })

  // Get blocked users
  const blockedUserIds = await getBlockedUserIds(profile.id)

  // Fetch live chat messages, excluding blocked users
  const messages = await prisma.liveMessage.findMany({
    where: {
      authorId: {
        notIn: blockedUserIds  // ✅ Hide messages from blocked users
      },
      createdAt: {
        gte: new Date(Date.now() - 24 * 60 * 60 * 1000) // Last 24 hours
      }
    },
    include: {
      author: true
    },
    orderBy: { createdAt: "desc" },
    take: 100
  })

  return NextResponse.json({ messages })
}
```

---

## 🎨 UI Integration Examples

### **Show Block Status on Profile**

```typescript
// In profile header
{isBlocked ? (
  <div className="text-sm text-gray-500">
    🚫 You've blocked this user
  </div>
) : blockedByThem ? (
  <div className="text-sm text-gray-500">
    This user has blocked you
  </div>
) : null}
```

### **Hide Blocked User Content**

```typescript
// In post list
{posts.map((post) => (
  <PostCard key={post.id} post={post} />
))}

// No need for client-side filtering - already filtered by API! ✅
```

### **Disable Interactions**

```typescript
// Disable message button if blocked
<MessageButton
  userId={user.id}
  disabled={blockedEitherWay}
  title={blockedEitherWay ? "Cannot message this user" : "Send message"}
/>
```

---

## 📊 Database Query Patterns

### **Exclude Array of IDs**
```typescript
where: {
  authorId: {
    notIn: blockedUserIds  // Prisma excludes these IDs
  }
}
```

### **Exclude in Join**
```typescript
where: {
  participants: {
    none: {
      id: { in: blockedIds }  // No participants in blocked list
    }
  }
}
```

### **Check Existence**
```typescript
const block = await prisma.userBlock.findUnique({
  where: {
    blockerId_blockedId: { blockerId: userA, blockedId: userB }
  }
})
const isBlocked = !!block
```

---

## ⚡ Performance Tips

### **1. Batch Block Checks**
```typescript
// ❌ Bad - N+1 queries
for (const post of posts) {
  const isBlocked = await isUserBlocked(currentUserId, post.authorId)
  // ...
}

// ✅ Good - Single query upfront
const blockedIds = await getBlockedUserIds(currentUserId)
const filteredPosts = posts.filter(p => !blockedIds.includes(p.authorId))
```

### **2. Use Database Filtering**
```typescript
// ❌ Bad - Fetch all, filter in memory
const allUsers = await prisma.profiles.findMany()
const filtered = allUsers.filter(u => !blockedIds.includes(u.id))

// ✅ Good - Filter at database level
const users = await prisma.profiles.findMany({
  where: { id: { notIn: blockedIds } }
})
```

### **3. Cache Block Lists**
```typescript
// For frequently accessed data, consider caching
const cacheKey = `blocked:${userId}`
let blockedIds = await redis.get(cacheKey)

if (!blockedIds) {
  blockedIds = await getBlockedUserIds(userId)
  await redis.set(cacheKey, blockedIds, { ex: 300 }) // 5 min cache
}
```

---

## 🧪 Testing Checklist

### **Feed Filtering**
- [ ] Posts from blocked users don't appear in feed
- [ ] Comments from blocked users don't appear on posts
- [ ] Live chat messages from blocked users hidden

### **Discovery**
- [ ] Blocked users don't appear in discover stack
- [ ] Users who blocked you don't appear in discover
- [ ] Search results exclude blocked users

### **Messaging**
- [ ] Can't send messages to blocked users
- [ ] Can't receive messages from blocked users
- [ ] Existing conversations with blocked users hidden

### **Profile Views**
- [ ] Block button shows correct state (Block/Unblock)
- [ ] Can block from profile
- [ ] Can unblock from profile
- [ ] Content hidden if blocked either way

### **Settings**
- [ ] Blocked users list shows all blocked users
- [ ] Can unblock from list
- [ ] List updates immediately after unblock

---

## 🚀 Quick Implementation Steps

### **Step 1: Install Helpers**
```bash
# Already done! ✅
# File created: lib/utils/block-helpers.ts
```

### **Step 2: Add to Community Feed**
```typescript
import { getBlockedUserIds } from "@/lib/utils/block-helpers"

const blockedIds = await getBlockedUserIds(currentUserId)

const posts = await prisma.post.findMany({
  where: { authorId: { notIn: blockedIds } }
})
```

### **Step 3: Add to Discover**
```typescript
import { getAllBlockedRelationships } from "@/lib/utils/block-helpers"

const { all } = await getAllBlockedRelationships(currentUserId)

const matches = await prisma.profiles.findMany({
  where: { id: { notIn: [currentUserId, ...all] } }
})
```

### **Step 4: Add to Messages**
```typescript
import { isBlockedEitherWay } from "@/lib/utils/block-helpers"

const blocked = await isBlockedEitherWay(senderId, recipientId)
if (blocked) return 403
```

### **Step 5: Test Everything**
```bash
1. Block a user
2. Check feed - their posts gone ✅
3. Check discover - they don't appear ✅
4. Try to message - blocked ✅
5. Unblock user
6. Everything reappears ✅
```

---

## 📝 Summary

**Helper Functions Ready:**
- ✅ `isUserBlocked` - Check single block
- ✅ `isBlockedEitherWay` - Check mutual block
- ✅ `getBlockedUserIds` - Get all blocked IDs
- ✅ `getAllBlockedRelationships` - Get all blocks (both directions)
- ✅ `filterBlockedUsers` - Filter ID array
- ✅ `canUsersInteract` - Check if interaction allowed

**Integration Points:**
- ✅ Community feed (posts, comments)
- ✅ Discover/matches
- ✅ Messages (send, conversations)
- ✅ Live chat
- ✅ User search
- ✅ Profile views

**Performance:**
- ✅ Database-level filtering (not client-side)
- ✅ Batch queries (no N+1)
- ✅ Cacheable (Redis-ready)

**Ready to integrate blocking across your entire app!** 🎉

