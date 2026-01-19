# Quick Integration Guide: PostAdminActions

## Add Moderation Menu to Existing Community Posts

### Step 1: Import the Component

Find your community post component (likely in `app/community/` or similar).

```typescript
import { PostAdminActions } from "@/components/community/PostAdminActions"
import { canCurrentUserModerate } from "@/lib/moderation-helpers"
```

### Step 2: Check User Permissions (Server Component)

```typescript
// app/community/[topic]/page.tsx
export default async function CommunityTopicPage() {
  // Check if current user can moderate
  const canModerate = await canCurrentUserModerate()
  
  // Fetch posts...
  const posts = await getPosts()
  
  return (
    <div>
      {posts.map(post => (
        <PostCard 
          key={post.id} 
          post={post}
          canModerate={canModerate} // Pass to child
        />
      ))}
    </div>
  )
}
```

### Step 3: Add to Post Card

```typescript
// components/PostCard.tsx
import { PostAdminActions } from "@/components/community/PostAdminActions"

export function PostCard({ post, canModerate }) {
  return (
    <article className="post-card">
      {/* Post header with admin actions */}
      <header className="flex items-start justify-between">
        <div className="flex-1">
          <h3>{post.title}</h3>
          <p className="text-sm text-gray-500">
            By {post.author.displayName}
          </p>
        </div>
        
        {/* Admin 3-dot menu - only shows for ADMIN/OWNER */}
        <PostAdminActions
          postId={post.id}
          authorId={post.authorId}
          authorName={post.author.displayName}
          canModerate={canModerate}
          onActionComplete={() => window.location.reload()}
        />
      </header>
      
      {/* Post content */}
      <div className="post-content">
        {post.content}
      </div>
    </article>
  )
}
```

### Step 4: Style Integration (Example)

If your posts look like this:

```typescript
<div className="bg-white rounded-lg shadow-md p-4">
  <div className="flex justify-between items-start mb-2">
    <div>
      <h3 className="font-bold">{post.title}</h3>
      <p className="text-sm text-gray-500">by {post.author.displayName}</p>
    </div>
    
    {/* Add here ⬇️ */}
    <PostAdminActions
      postId={post.id}
      authorId={post.authorId}
      authorName={post.author.displayName}
      canModerate={canModerate}
      theme="light"
    />
  </div>
  
  <p>{post.content}</p>
</div>
```

### Step 5: With Theme Context

If using ThemeContext:

```typescript
"use client"

import { useTheme } from "@/contexts/ThemeContext"
import { PostAdminActions } from "@/components/community/PostAdminActions"

export function ThemedPostCard({ post, canModerate }) {
  const { theme } = useTheme()
  
  return (
    <div className={theme === "light" ? "bg-white" : "bg-slate-800"}>
      <PostAdminActions
        postId={post.id}
        authorId={post.authorId}
        authorName={post.author.displayName}
        canModerate={canModerate}
        theme={theme} // Pass theme
      />
    </div>
  )
}
```

## Client-Side Version (if not using server components)

```typescript
"use client"

import { useState, useEffect } from "react"
import { PostAdminActions } from "@/components/community/PostAdminActions"

export function PostList() {
  const [canModerate, setCanModerate] = useState(false)
  
  useEffect(() => {
    // Check moderation access
    fetch("/api/admin/check-access")
      .then(res => res.json())
      .then(data => setCanModerate(data.hasAccess))
      .catch(() => setCanModerate(false))
  }, [])
  
  return (
    <div>
      {posts.map(post => (
        <PostCard 
          key={post.id} 
          post={post}
          canModerate={canModerate}
        />
      ))}
    </div>
  )
}
```

## Real-World Example: Full Integration

```typescript
// app/community/[topic]/page.tsx
import { PostAdminActions } from "@/components/community/PostAdminActions"
import { canCurrentUserModerate } from "@/lib/moderation-helpers"
import { prisma } from "@/lib/prisma"

export default async function TopicPage({ params }: { params: { topic: string } }) {
  const canModerate = await canCurrentUserModerate()
  
  // Fetch posts for this topic
  const posts = await prisma.post.findMany({
    where: { 
      topic: params.topic,
      isHidden: false // Don't show hidden posts to regular users
    },
    include: {
      author: {
        select: {
          id: true,
          display_name: true,
          east_west_code: true,
          chinese_sign: true,
        }
      }
    },
    orderBy: { createdAt: 'desc' },
    take: 20
  })
  
  return (
    <div className="max-w-3xl mx-auto p-4 space-y-4">
      <h1 className="text-2xl font-bold">{params.topic}</h1>
      
      {posts.map(post => (
        <article 
          key={post.id}
          className="bg-white dark:bg-slate-800 rounded-lg shadow p-4"
        >
          {/* Header with author and admin actions */}
          <div className="flex items-start justify-between mb-3">
            <div className="flex-1">
              <h2 className="text-xl font-semibold">{post.title}</h2>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  {post.author.display_name}
                </span>
                <span className="text-xs text-gray-400">
                  {post.east_west_code}
                </span>
              </div>
            </div>
            
            {/* Admin menu (only visible to ADMIN/OWNER) */}
            <PostAdminActions
              postId={post.id}
              authorId={post.authorId}
              authorName={post.author.display_name || "Anonymous"}
              canModerate={canModerate}
            />
          </div>
          
          {/* Post content */}
          <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
            {post.content}
          </p>
          
          {/* Footer with stats */}
          <div className="flex gap-4 mt-3 text-sm text-gray-500">
            <span>👍 {post.likeCount}</span>
            <span>💬 {post.commentCount}</span>
          </div>
        </article>
      ))}
    </div>
  )
}
```

## What Each User Sees

### Regular User (USER role):
- No 3-dot menu
- No moderation options
- Just sees normal post

### Admin/CEO (ADMIN/OWNER role):
- 3-dot menu appears on each post
- Can hide posts
- Can suspend/ban users
- Sees confirmation dialogs

## Testing

1. **As regular user**: Log in → Go to community → No 3-dot menu
2. **As admin**: Log in → Go to community → See 3-dot menu
3. **Click menu**: See "Hide post", "Suspend 1 week", "Permanent ban"
4. **Hide post**: Post disappears from feed
5. **Suspend user**: User can't create new posts

## Done! 🎉

Your community now has inline moderation controls that only admins can see and use.

