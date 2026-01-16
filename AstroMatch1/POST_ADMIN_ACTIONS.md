# Post Admin Actions Component

## Overview
3-dot menu component for CEO/Admin moderation actions on community posts.

## Component
`components/community/PostAdminActions.tsx`

## Features
- ✅ Hide/delete posts
- ✅ Suspend users for 1 week
- ✅ Permanently ban users
- ✅ Only visible to ADMIN/OWNER roles
- ✅ Confirmation dialogs
- ✅ Loading states
- ✅ Theme support (light/dark)
- ✅ Click-outside-to-close

## Usage

### Basic Example

```typescript
import { PostAdminActions } from "@/components/community/PostAdminActions"

export function CommunityPost({ post, currentUserRole }) {
  return (
    <div className="post-card">
      <div className="post-header">
        <h3>{post.title}</h3>
        
        {/* Admin actions - only shows for ADMIN/OWNER */}
        <PostAdminActions
          postId={post.id}
          authorId={post.authorId}
          authorName={post.author.displayName}
          canModerate={currentUserRole === "ADMIN" || currentUserRole === "OWNER"}
          onActionComplete={() => window.location.reload()}
        />
      </div>
      
      <div className="post-content">
        {post.content}
      </div>
    </div>
  )
}
```

### Server Component Integration

```typescript
// app/community/[topic]/page.tsx
import { getCurrentProfileWithRole } from "@/lib/auth-helpers"
import { PostAdminActions } from "@/components/community/PostAdminActions"

export default async function CommunityTopicPage() {
  const profile = await getCurrentProfileWithRole()
  const canModerate = profile?.role === "ADMIN" || profile?.role === "OWNER"
  
  // Fetch posts...
  const posts = await getPosts()
  
  return (
    <div>
      {posts.map(post => (
        <PostCard key={post.id} post={post}>
          <PostAdminActions
            postId={post.id}
            authorId={post.authorId}
            authorName={post.author.displayName}
            canModerate={canModerate}
          />
        </PostCard>
      ))}
    </div>
  )
}
```

### Client Component with State

```typescript
"use client"

import { useState, useEffect } from "react"
import { PostAdminActions } from "@/components/community/PostAdminActions"

export function PostList() {
  const [posts, setPosts] = useState([])
  const [canModerate, setCanModerate] = useState(false)
  
  useEffect(() => {
    // Check if user can moderate
    fetch("/api/profile/me")
      .then(res => res.json())
      .then(profile => {
        setCanModerate(
          profile.role === "ADMIN" || profile.role === "OWNER"
        )
      })
      
    // Fetch posts
    fetch("/api/community/posts")
      .then(res => res.json())
      .then(data => setPosts(data.posts))
  }, [])
  
  function handleActionComplete() {
    // Refresh posts after moderation action
    fetch("/api/community/posts")
      .then(res => res.json())
      .then(data => setPosts(data.posts))
  }
  
  return (
    <div className="space-y-4">
      {posts.map(post => (
        <div key={post.id} className="post-card">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <h3>{post.title}</h3>
              <p>{post.content}</p>
            </div>
            
            <PostAdminActions
              postId={post.id}
              authorId={post.authorId}
              authorName={post.author.displayName}
              canModerate={canModerate}
              onActionComplete={handleActionComplete}
            />
          </div>
        </div>
      ))}
    </div>
  )
}
```

### With Theme Context

```typescript
"use client"

import { useTheme } from "@/contexts/ThemeContext"
import { PostAdminActions } from "@/components/community/PostAdminActions"

export function ThemedPost({ post, canModerate }) {
  const { theme } = useTheme()
  
  return (
    <div className={theme === "light" ? "bg-white" : "bg-slate-800"}>
      <PostAdminActions
        postId={post.id}
        authorId={post.authorId}
        authorName={post.author.displayName}
        canModerate={canModerate}
        theme={theme}
        onActionComplete={() => location.reload()}
      />
    </div>
  )
}
```

## Props

```typescript
interface PostAdminActionsProps {
  postId: string              // Post ID to moderate
  authorId: string            // Post author's user ID
  authorName?: string         // Post author's display name (for confirm dialogs)
  canModerate: boolean        // true if user is ADMIN or OWNER
  theme?: "light" | "dark"    // Theme for styling (default: "light")
  onActionComplete?: () => void // Callback after successful action
}
```

## Actions

### 1. Hide Post
- Confirms with user
- Calls `POST /api/admin/posts/hide`
- Sets `isHidden: true` on post
- Post disappears from feed
- Reversible via admin panel

**Confirmation:**
> Hide this post? It will no longer be visible to users.

### 2. Suspend 1 Week
- Confirms with user
- Calls `POST /api/admin/users/ban-unified` with `type: "ONE_WEEK"`
- User status → SUSPENDED
- Auto-unbans after 7 days
- User can't post/comment during suspension

**Confirmation:**
> Suspend {authorName} for 1 week? They won't be able to post or comment.

### 3. Permanent Ban
- Confirms with user (strong warning)
- Calls `POST /api/admin/users/ban-unified` with `type: "PERMANENT"`
- User status → BANNED
- Requires manual unban
- User completely blocked from app

**Confirmation:**
> Permanently ban {authorName}? This action is severe and should only be used for serious violations.

## UI/UX Features

### Visual States
- **Default**: Gray 3-dot icon
- **Hover**: Background highlight
- **Open**: Dropdown menu appears
- **Loading**: "Processing..." message
- **Disabled**: Actions grayed out during loading

### Click-Outside-to-Close
Menu automatically closes when clicking outside.

### Keyboard Accessible
All buttons are keyboard navigable.

### Responsive
Works on mobile and desktop.

## Styling

### Light Mode
- White background
- Gray borders
- Dark text
- Amber for 1-week suspension
- Red for permanent ban

### Dark Mode
- Slate 800 background
- Slate 700 borders
- White/transparent text
- Amber 400 for suspension
- Red 400 for ban

### Icons
- **MoreVertical**: 3-dot menu button
- **EyeOff**: Hide post action
- **Clock**: 1-week suspension
- **Ban**: Permanent ban

## Integration Examples

### In Existing PostList Component

```typescript
// app/community/_components/PostList.tsx
import { PostAdminActions } from "@/components/community/PostAdminActions"

export function PostList({ posts, canModerate }) {
  return (
    <div>
      {posts.map(post => (
        <article key={post.id}>
          {/* Existing post content */}
          <header className="flex justify-between items-start">
            <div>
              <h2>{post.title}</h2>
              <p>By {post.author.displayName}</p>
            </div>
            
            {/* Add admin actions */}
            <PostAdminActions
              postId={post.id}
              authorId={post.authorId}
              authorName={post.author.displayName}
              canModerate={canModerate}
            />
          </header>
          
          <div>{post.content}</div>
        </article>
      ))}
    </div>
  )
}
```

### In Post Detail Page

```typescript
// app/community/[topic]/[postId]/page.tsx
import { getCurrentProfileWithRole } from "@/lib/auth-helpers"
import { PostAdminActions } from "@/components/community/PostAdminActions"

export default async function PostDetailPage({ params }) {
  const profile = await getCurrentProfileWithRole()
  const post = await getPost(params.postId)
  
  const canModerate = profile?.role === "ADMIN" || profile?.role === "OWNER"
  
  return (
    <article>
      <header>
        <h1>{post.title}</h1>
        
        {canModerate && (
          <PostAdminActions
            postId={post.id}
            authorId={post.authorId}
            authorName={post.author.displayName}
            canModerate={true}
          />
        )}
      </header>
      
      <div>{post.content}</div>
    </article>
  )
}
```

### Helper Function to Check Moderation Access

```typescript
// lib/moderation-helpers.ts
import { getCurrentProfileWithRole } from "@/lib/auth-helpers"

export async function canCurrentUserModerate(): Promise<boolean> {
  const profile = await getCurrentProfileWithRole()
  return profile?.role === "ADMIN" || profile?.role === "OWNER"
}

// Usage in server components:
import { canCurrentUserModerate } from "@/lib/moderation-helpers"

export default async function Page() {
  const canModerate = await canCurrentUserModerate()
  
  return (
    <PostAdminActions
      // ...
      canModerate={canModerate}
    />
  )
}
```

## Error Handling

### Failed Actions
If an API call fails, the component shows an alert with the error message.

```typescript
try {
  const res = await fetch("/api/admin/posts/hide", {...})
  if (res.ok) {
    alert("Post hidden successfully")
  } else {
    const error = await res.json()
    alert(`Failed: ${error.error}`)
  }
} catch (error) {
  alert("Failed to hide post")
}
```

### Network Errors
Caught and displayed to user via alert.

## Testing

### Test as Admin
1. Log in as ADMIN user
2. View community posts
3. See 3-dot menu on each post
4. Click menu → See moderation options
5. Try hiding a post → Post disappears
6. Try suspending user → User can't post

### Test as Regular User
1. Log in as USER
2. View community posts
3. 3-dot menu should NOT appear
4. No moderation actions available

### Test Confirmations
Each action shows a confirmation dialog before executing.

### Test Loading States
While action is processing, buttons are disabled and show "Processing..."

## Best Practices

1. **Always require confirmation** - Moderation actions are serious
2. **Show author name** - Makes it clear who is being moderated
3. **Provide feedback** - Alert user when action succeeds/fails
4. **Refresh data** - Use `onActionComplete` to refresh the UI
5. **Check permissions** - Only pass `canModerate={true}` for ADMIN/OWNER
6. **Theme consistency** - Pass theme prop to match app theme

## Security Notes

- Component only shows if `canModerate={true}`
- API endpoints verify admin role on server side
- Can't ban OWNER accounts
- Can't modify own account status
- All actions logged server-side

## Accessibility

- Keyboard navigable
- Proper ARIA labels
- Clear visual feedback
- Confirmation dialogs for destructive actions

## Summary

✅ **Easy to integrate** - Drop into any post component  
✅ **Role-based** - Only shows for ADMIN/OWNER  
✅ **Safe** - Confirmation dialogs for all actions  
✅ **Themed** - Supports light/dark mode  
✅ **Responsive** - Works on all screen sizes  
✅ **Accessible** - Keyboard and screen reader friendly  

**File:** `components/community/PostAdminActions.tsx`

