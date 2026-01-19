# Complete CommunityPost Component Example

## Overview
Complete, production-ready post component with admin moderation built-in.

## Features
✅ Shows post title, content, author, date  
✅ Like and comment counts  
✅ Hidden badge for moderators  
✅ 3-dot admin menu (hide/unhide, suspend, ban)  
✅ Hides hidden posts from regular users  
✅ Theme support (light/dark)  
✅ Responsive design  

## Files
- `components/community/CommunityPost.tsx` - Complete post component
- `components/community/PostAdminActions.tsx` - Updated with hide/unhide toggle

## Usage

### In a Page

```typescript
// app/community/[topic]/page.tsx
import { CommunityPost } from "@/components/community/CommunityPost"
import { prisma } from "@/lib/prisma"

export default async function TopicPage({ params }) {
  const posts = await prisma.post.findMany({
    where: { topic: params.topic },
    include: {
      author: {
        select: {
          id: true,
          display_name: true,
          east_west_code: true,
          chinese_sign: true,
          photo_url: true,
        }
      }
    },
    orderBy: { createdAt: "desc" }
  })
  
  return (
    <div className="max-w-3xl mx-auto p-4 space-y-4">
      <h1 className="text-2xl font-bold mb-6">{params.topic}</h1>
      
      {posts.map(post => (
        <CommunityPost key={post.id} post={post} />
      ))}
    </div>
  )
}
```

### What Users See

#### Regular User (USER role)
- ✅ Sees all non-hidden posts
- ❌ Does NOT see hidden posts
- ❌ No 3-dot menu
- ❌ No moderation controls

#### Admin/CEO (ADMIN/OWNER role)
- ✅ Sees ALL posts (including hidden)
- ✅ Hidden posts show red "Hidden Post" badge
- ✅ 3-dot menu on every post
- ✅ Can hide/unhide posts
- ✅ Can suspend/ban authors

## Post Visibility Logic

```typescript
// Regular users don't see hidden posts
if (post.isHidden && !canModerate) {
  return null
}

// Admins see all posts with a badge
{post.isHidden && canModerate && (
  <div className="badge">
    Hidden Post (visible to moderators only)
  </div>
)}
```

## Admin Actions

### 1. Hide/Unhide Post
- **Hidden posts**: Button says "Unhide post"
- **Visible posts**: Button says "Hide post"
- Toggles `isHidden` field in database
- Confirmation dialog before action

### 2. Suspend 1 Week
- User status → SUSPENDED
- User can't post/comment for 7 days
- Auto-unbans after 1 week

### 3. Permanent Ban
- User status → BANNED
- Complete access block
- Requires manual unban

## Component Props

```typescript
interface CommunityPostProps {
  post: {
    id: string
    title: string
    content: string
    topic: string
    type: "STORY" | "QUESTION"
    createdAt: Date
    likeCount: number
    commentCount: number
    isHidden: boolean           // ← Important for visibility
    authorId: string
    author: {
      id: string
      display_name: string | null
      east_west_code: string | null
      chinese_sign: string | null
      photo_url: string | null
    }
  }
}
```

## Styling

### Light Mode
- White background
- Gray borders
- Dark text
- Colored badges

### Dark Mode
- Slate 800 background
- Slate 700 borders
- White text
- Darker badges

### Responsive
- Mobile-friendly
- Flexible layout
- Touch-friendly buttons

## Integration with Existing Code

### If you have an existing PostCard component:

```typescript
// OLD: Your existing component
export function PostCard({ post }) {
  return (
    <div>
      <h2>{post.title}</h2>
      <p>{post.content}</p>
    </div>
  )
}

// NEW: Replace with CommunityPost
import { CommunityPost } from "@/components/community/CommunityPost"

export default function Page() {
  return posts.map(post => (
    <CommunityPost key={post.id} post={post} />
  ))
}
```

### If you want to customize the component:

```typescript
// Copy components/community/CommunityPost.tsx
// Modify the JSX to match your design
// Keep the admin logic and PostAdminActions integration
```

## API Integration

The component works with these endpoints:

### Get Posts
```typescript
GET /api/community/posts?topic=general

// Include author data
include: {
  author: {
    select: {
      id: true,
      display_name: true,
      east_west_code: true,
      chinese_sign: true
    }
  }
}
```

### Hide Post (Admin)
```typescript
POST /api/admin/posts/hide
{
  "postId": "abc123",
  "hide": true  // or false to unhide
}
```

### Ban User (Admin)
```typescript
POST /api/admin/users/ban-unified
{
  "userId": "user123",
  "type": "ONE_WEEK" // or "PERMANENT"
}
```

## Testing

### Test as Regular User
1. Log in as regular user
2. Go to community
3. Should NOT see:
   - Hidden posts
   - 3-dot menus
   - Admin controls

### Test as Admin
1. Log in as ADMIN
2. Go to community
3. Should see:
   - All posts (including hidden)
   - Red badge on hidden posts
   - 3-dot menu on each post
4. Click 3-dot menu
5. Try hiding a post
6. Post should disappear for regular users
7. Post should show "Hidden Post" badge for you

### Test Hide/Unhide
1. As admin, hide a post
2. Refresh page
3. Post shows "Hidden Post" badge
4. Click 3-dot → "Unhide post"
5. Post becomes visible to all users

### Test Suspend User
1. As admin, suspend a user
2. Log in as that user
3. Try to create a post
4. Should see error: "Account suspended"

## Example Page with Full Integration

```typescript
// app/community/page.tsx
import { CommunityPost } from "@/components/community/CommunityPost"
import { prisma } from "@/lib/prisma"
import { getCurrentProfileWithRole } from "@/lib/auth-helpers"

export default async function CommunityPage() {
  const profile = await getCurrentProfileWithRole()
  const canModerate = profile?.role === "ADMIN" || profile?.role === "OWNER"
  
  // Fetch posts - include hidden for admins, exclude for regular users
  const posts = await prisma.post.findMany({
    where: canModerate ? {} : { isHidden: false },
    include: {
      author: {
        select: {
          id: true,
          display_name: true,
          east_west_code: true,
          chinese_sign: true,
          photo_url: true,
        }
      }
    },
    orderBy: { createdAt: "desc" },
    take: 50
  })
  
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-900">
      <div className="max-w-3xl mx-auto p-4">
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Community
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Stories and questions from our members
          </p>
        </header>
        
        <div className="space-y-4">
          {posts.length === 0 ? (
            <p className="text-center text-gray-500 py-12">
              No posts yet. Be the first to share!
            </p>
          ) : (
            posts.map(post => (
              <CommunityPost key={post.id} post={post} />
            ))
          )}
        </div>
      </div>
    </div>
  )
}
```

## Customization

### Change Post Layout
Edit `components/community/CommunityPost.tsx`:
```typescript
// Current: Vertical layout
<article className="...">
  <header>...</header>
  <div>Content</div>
  <footer>Stats</footer>
</article>

// Change to: Card with image, etc.
```

### Change Colors
Update the className strings:
```typescript
// Current: Purple accents
"bg-purple-100 text-purple-700"

// Change to: Blue accents
"bg-blue-100 text-blue-700"
```

### Add More Actions
Edit `components/community/PostAdminActions.tsx`:
```typescript
// Add pin, feature, etc.
<button onClick={handlePinPost}>
  Pin post
</button>
```

## Summary

✅ **Drop-in component** - Just pass the post data  
✅ **Admin controls built-in** - 3-dot menu for mods  
✅ **Visibility logic** - Hides hidden posts from users  
✅ **Hide/Unhide toggle** - Moderators can show/hide posts  
✅ **User moderation** - Suspend/ban from post menu  
✅ **Theme support** - Light and dark mode  
✅ **Production ready** - Tested and documented  

**Files:**
- `components/community/CommunityPost.tsx`
- `components/community/PostAdminActions.tsx`
- `lib/auth-helpers.ts`
- `app/api/admin/posts/hide/route.ts`
- `app/api/admin/users/ban-unified/route.ts`

