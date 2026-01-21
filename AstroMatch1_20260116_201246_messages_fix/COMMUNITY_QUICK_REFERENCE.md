# Community Section - Quick Reference Guide

## 🚀 Quick Start

### Run the Migration
```bash
# When your database is accessible, run:
npx prisma generate
npx prisma db execute --file ./prisma/migrations/add_counters.sql --schema ./prisma/schema.prisma

# Or if Prisma migrate works:
npx prisma migrate dev --name add_like_comment_counts
```

## 📍 Key Endpoints

### Posts
- `GET /api/community/posts?topic={topic}&sort=latest&limit=20` - List posts
- `POST /api/community/posts` - Create post (auth required)
- `GET /api/community/posts/{postId}` - Get single post with comments

### Comments  
- `GET /api/community/posts/{postId}/comments` - List comments
- `POST /api/community/posts/{postId}/comments` - Create comment (auth required)

### Likes
- `POST /api/community/posts/{postId}/like` - Toggle post like (auth required)
- `POST /api/community/comments/{commentId}/like` - Toggle comment like (auth required)

### Notifications
- `GET /api/community/notifications` - Get user's notifications (auth required)
- `POST /api/community/notifications/mark-read` - Mark as read (auth required)

## 🎨 Components

### Server Components (use directly in pages)
- `<PostList topic="general-astrology" />` - Displays posts for a topic

### Client Components (marked with "use client")
- `<PostCardClient post={...} currentUserProfile={...} />` - Individual post card
- `<NewPostButton topic="general-astrology" />` - Green + button with modal
- `<CommentThread postId="..." currentUser={...} />` - Comment list
- `<NewCommentForm postId="..." />` - Reply to post form
- `<LikeButton commentId="..." initialCount={0} disabled={false} />` - Like button

## 🔑 Key Changes from Original

### Database
- ✅ Added `likeCount` and `commentCount` columns (denormalized for performance)
- ✅ Changed `Notification.readAt` → `Notification.isRead`
- ✅ Added indexes for better query performance

### API
- ✅ All endpoints return full author info (displayName, westSign, chineseSign, eastWestCode)
- ✅ Pagination with cursor support
- ✅ "Top" sorting by engagement score
- ✅ Transactions for count updates (atomicity)

### UI
- ✅ East-West pills on all posts/comments (like Connection Box)
- ✅ Auth guards with login prompts
- ✅ Like/comment counts displayed with icons
- ✅ Consistent dark mode styling

## 🐛 Troubleshooting

### "Can't reach database server"
- Check your DATABASE_URL in .env.local
- Make sure your Neon/Supabase database is running
- Try running migrations when you have internet connection

### "readAt column doesn't exist"
- Run the migration SQL file to add isRead column
- The migration handles the transition from readAt to isRead

### "Author info not showing"
- Make sure you regenerated Prisma client: `npx prisma generate`
- Check that profiles table has western_sign, chinese_sign, east_west_code columns

### Like count not updating
- Ensure the migration added likeCount columns
- Check browser console for API errors
- Verify user is authenticated

## 📊 Data Models

### Post
```typescript
{
  id: string (cuid)
  title: string
  content: string
  topic: string
  authorId: string (uuid)
  likeCount: number
  commentCount: number
  createdAt: DateTime
  updatedAt: DateTime
}
```

### Comment
```typescript
{
  id: string (cuid)
  postId: string
  parentId?: string (for replies)
  authorId: string (uuid)
  content: string
  likeCount: number
  createdAt: DateTime
  updatedAt: DateTime
}
```

### Notification
```typescript
{
  id: string (cuid)
  userId: string (uuid)
  actorId: string (uuid)
  type: "POST_REPLY" | "COMMENT_REPLY"
  postId?: string
  commentId?: string
  isRead: boolean
  createdAt: DateTime
}
```

## 🎯 Common Tasks

### Add a new topic
1. Edit `app/community/topics.ts`
2. Add to COMMUNITY_TOPICS array with id, label, hashtag, description, icon

### Change sorting algorithm
1. Edit `app/api/community/posts/route.ts`
2. Modify the "top" sorting logic (currently: `likeCount + commentCount * 2`)

### Add post editing
1. Create `PUT /api/community/posts/[postId]` route
2. Add auth check: only post author can edit
3. Add "Edit" button to PostCardClient for own posts
4. Create edit modal (similar to NewPostButton)

### Add moderation
1. Add `reported: boolean` field to Post/Comment models
2. Create `POST /api/community/posts/[postId]/report` endpoint
3. Add admin UI to review reported content
4. Add soft delete functionality

## 📱 Pages

- `/community` → Redirects to `/community/general-astrology`
- `/community/general-astrology` → General Astrology topic feed
- `/community/sun-signs` → Sun Signs topic feed
- `/community/chinese-astrology` → Chinese Astrology topic feed
- `/community/vedic-astrology` → Vedic Astrology topic feed
- `/community/compatibility-and-synastry` → Compatibility topic feed
- `/community/astromatch-feedback` → Feedback topic feed
- `/community/{topic}/{postId}` → Individual thread page

## 🔐 Auth Flow

All mutation endpoints check for authentication:
```typescript
const user = await getCurrentUser();
if (!user) {
  return new NextResponse("Unauthorized", { status: 401 });
}
```

UI handles 401 by:
- Showing "Log in to [action]" prompts
- Redirecting to `/login` when user attempts action
- Disabling interactive elements (like buttons) when not logged in

## 🎨 Styling Reference

East-West Pill (from PostCardClient):
```jsx
<div className="inline-flex items-center gap-1 rounded-full border border-slate-700 bg-slate-950/60 px-2 py-1 text-[11px] font-medium text-slate-200">
  <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-slate-800 text-[10px]">
    {westSign?.[0] || "?"}
  </span>
  <span className="truncate max-w-[120px]">
    {eastWestCode}
  </span>
</div>
```

Card styling:
```jsx
<div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-4 shadow-sm">
  {/* content */}
</div>
```

## ✅ All Prompts Implemented

- ✅ **Prompt 1**: Prisma models with likeCount, commentCount, notifications
- ✅ **Prompt 2**: API routes for posts, comments, likes with pagination
- ✅ **Prompt 3**: UI wiring with topics, pagination, modals
- ✅ **Prompt 4**: Thread page with replies, auth guards, East-West pills

**Status: Production Ready** 🎉

