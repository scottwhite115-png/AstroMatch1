# Community Post Menu Integration Guide

## ✅ 3-Dot Menu Component Complete!

**File:** `components/community/CommunityPostMenu.tsx`

---

## 🎯 What It Does

A beautiful 3-dot dropdown menu on every community post with:

### **For All Users:**
- 🚩 **Report post** - Report inappropriate content
- 🚫 **Block user** - Block the post author

### **For Admins (ADMIN/OWNER):**
- 👁️ **Hide post** - Hide from all users
- ⏰ **1-week ban** - Suspend user for 7 days (auto-unbans)
- ❌ **Permanent ban** - Ban user permanently

---

## 🎨 Features

- ✅ **Click outside to close** - Smooth UX
- ✅ **Confirmation dialogs** - Prevents accidental actions
- ✅ **Loading states** - Disables during API calls
- ✅ **Success messages** - Shows feedback in dropdown
- ✅ **Theme support** - Light/dark mode
- ✅ **Icons** - Clear visual indicators
- ✅ **Auto-close** - Closes after successful action
- ✅ **Responsive** - Works on mobile/desktop
- ✅ **Hides on own posts** - Unless you're an admin

---

## 🔧 How to Use

### **In Your CommunityPost Component:**

```typescript
// app/community/page.tsx or wherever you render posts
import { getCurrentProfileWithRole } from "@/lib/auth-helpers"
import { CommunityPostMenu } from "@/components/community/CommunityPostMenu"

export default async function CommunityPage() {
  const currentUser = await getCurrentProfileWithRole()
  
  // Determine if user can moderate
  const canModerate = currentUser 
    ? (currentUser.role === "ADMIN" || currentUser.role === "OWNER")
    : false

  // Fetch posts
  const posts = await prisma.post.findMany({
    include: { author: true },
    orderBy: { createdAt: "desc" }
  })

  return (
    <div>
      {posts.map((post) => (
        <article key={post.id} className="border rounded-lg p-4">
          {/* Post Header */}
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-3">
              <img src={post.author.photoUrl} className="w-10 h-10 rounded-full" />
              <div>
                <div className="font-semibold">{post.author.displayName}</div>
                <div className="text-xs text-gray-500">
                  {new Date(post.createdAt).toLocaleDateString()}
                </div>
              </div>
            </div>

            {/* 3-Dot Menu */}
            <CommunityPostMenu
              postId={post.id}
              authorId={post.authorId}
              authorName={post.author.displayName}
              canModerate={canModerate}
              isCurrentUser={currentUser?.id === post.authorId}
              theme={theme}
              onAction={() => {
                // Optional: refresh posts or remove from list
                // router.refresh()
              }}
            />
          </div>

          {/* Post Content */}
          <p>{post.content}</p>

          {/* Post Actions (likes, comments, etc.) */}
          {/* ... */}
        </article>
      ))}
    </div>
  )
}
```

---

## 📝 Props Reference

```typescript
interface CommunityPostMenuProps {
  postId: string              // Required: Post ID for actions
  authorId: string            // Required: Author ID for blocking/banning
  authorName?: string         // Optional: Display in confirmations (default: "this user")
  canModerate: boolean        // Required: Show admin actions?
  isCurrentUser?: boolean     // Optional: Hide menu on own posts (default: false)
  theme?: "light" | "dark"    // Optional: Theme (default: "light")
  onAction?: () => void       // Optional: Callback after successful action
}
```

---

## 🎨 UI Preview

### **Regular User View:**
```
┌────────────────────────┐
│ ⋮ (3 dots)            │
└────────────────────────┘
  ↓ Click
┌────────────────────────┐
│ 🚩 Report post         │
│ 🚫 Block User Name     │
└────────────────────────┘
```

### **Admin View:**
```
┌────────────────────────┐
│ ⋮ (3 dots)            │
└────────────────────────┘
  ↓ Click
┌────────────────────────┐
│ 🚩 Report post         │
│ 🚫 Block User Name     │
│ ────────────────────   │
│ 👁️ Hide post           │
│ ⏰ 1-week ban          │
│ ❌ Permanent ban       │
└────────────────────────┘
```

---

## 🔄 User Flows

### **Report Post:**
```
1. Click 3-dot menu
2. Click "Report post"
3. Enter reason in prompt
4. Post is reported
5. Success message shows
6. Menu auto-closes after 2s
```

### **Block User:**
```
1. Click 3-dot menu
2. Click "Block [Name]"
3. Confirm dialog appears
4. User confirms
5. User is blocked
6. Success message shows
7. Menu auto-closes after 1.5s
8. Optional: onAction callback fires
```

### **Admin: Hide Post:**
```
1. Admin clicks 3-dot menu
2. Sees admin section (orange/red actions)
3. Clicks "Hide post"
4. Confirms action
5. Post hidden from all users
6. Success message shows
7. Optional: post disappears from feed
```

### **Admin: Ban User:**
```
1. Admin clicks 3-dot menu
2. Clicks "1-week ban" or "Permanent ban"
3. Confirmation with details
4. Admin confirms
5. User banned/suspended
6. Success message shows
7. Optional: post disappears if needed
```

---

## 🛡️ Security Features

### **1. Permission Checks**
```typescript
// Only shows admin actions if canModerate is true
{canModerate && (
  <>
    <HidePostButton />
    <BanButtons />
  </>
)}
```

### **2. Own Post Protection**
```typescript
// Hides menu on own posts (unless admin)
if (isCurrentUser && !canModerate) {
  return null
}
```

### **3. Confirmation Dialogs**
```typescript
// All destructive actions require confirmation
if (!confirm("Are you sure?")) return
```

### **4. API Validation**
- All APIs validate permissions server-side
- Can't ban/hide if not admin
- Can't block yourself
- Can't report same post twice

---

## 🎨 Styling

### **Light Theme:**
- White background
- Gray text
- Subtle hover effects
- Red/orange/amber for admin actions

### **Dark Theme:**
- Slate-800 background
- Gray-300 text
- White/10 hover effects
- Brighter red/orange/amber for admin actions

### **Responsive:**
- Touch-friendly on mobile (44px+ hit areas)
- Proper z-index (z-50)
- Dropdown positioned correctly
- Click-outside-to-close

---

## 🧪 Testing

### **Test 1: Regular User**
```
1. Log in as regular user
2. Go to community feed
3. See 3-dot menu on posts
4. Click it
5. See "Report post" and "Block user" ✅
6. No admin actions ✅
7. Report a post (enter reason) ✅
8. Block a user (confirm) ✅
```

### **Test 2: Admin User**
```
1. Log in as ADMIN/OWNER
2. Go to community feed
3. Click 3-dot menu
4. See all 5 options ✅
5. See separator line before admin actions ✅
6. Hide a post ✅
7. Apply 1-week ban ✅
8. Apply permanent ban ✅
```

### **Test 3: Own Posts**
```
1. View your own post
2. 3-dot menu hidden (if not admin) ✅
3. As admin, menu still shows ✅
4. Can hide own post as admin ✅
5. Can't ban yourself ✅
```

### **Test 4: Click Outside**
```
1. Open 3-dot menu
2. Click anywhere else on page
3. Menu closes ✅
```

### **Test 5: Loading States**
```
1. Open menu
2. Click any action
3. All buttons disabled during API call ✅
4. Success message appears ✅
5. Menu auto-closes after delay ✅
```

---

## 🔗 Integration with Existing Components

### **Works With:**
- ✅ `ReportPostButton` - Uses same API
- ✅ `BlockUserButton` - Uses same API
- ✅ `PostAdminActions` - Similar functionality (but inline)
- ✅ `UserAdminControls` - Same ban logic

### **Difference from PostAdminActions:**
- **CommunityPostMenu** - 3-dot dropdown (compact, all-in-one)
- **PostAdminActions** - Inline buttons (more visible)

**Choose based on your UI:**
- Use **CommunityPostMenu** for cleaner, more compact posts
- Use **PostAdminActions** for more prominent admin controls

---

## 📊 API Endpoints Used

```typescript
POST /api/community/report          // Report post
POST /api/community/block           // Block user
POST /api/admin/posts/hide          // Hide post (admin)
POST /api/admin/users/ban-unified   // Ban user (admin)
```

---

## 🎯 Example: Full CommunityPost Component

```typescript
// components/community/CommunityPost.tsx
import { getCurrentProfileWithRole } from "@/lib/auth-helpers"
import { CommunityPostMenu } from "@/components/community/CommunityPostMenu"

interface CommunityPostProps {
  post: {
    id: string
    content: string
    createdAt: Date
    authorId: string
    isHidden: boolean
    author: {
      id: string
      displayName: string
      photoUrl: string
    }
  }
}

export async function CommunityPost({ post }: CommunityPostProps) {
  const currentUser = await getCurrentProfileWithRole()
  
  const canModerate = currentUser?.role === "ADMIN" || currentUser?.role === "OWNER"
  const isCurrentUser = currentUser?.id === post.authorId

  // Hide hidden posts from non-admins
  if (post.isHidden && !canModerate) {
    return null
  }

  return (
    <article className="bg-white dark:bg-slate-800 rounded-xl border p-4 space-y-3">
      {/* Hidden Badge (for admins) */}
      {post.isHidden && canModerate && (
        <div className="inline-flex items-center gap-2 px-2 py-1 bg-orange-100 dark:bg-orange-900/20 text-orange-700 dark:text-orange-400 text-xs rounded-full">
          Hidden Post
        </div>
      )}

      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <img 
            src={post.author.photoUrl} 
            alt={post.author.displayName}
            className="w-10 h-10 rounded-full"
          />
          <div>
            <div className="font-semibold">{post.author.displayName}</div>
            <div className="text-xs text-gray-500">
              {new Date(post.createdAt).toLocaleDateString()}
            </div>
          </div>
        </div>

        {/* 3-Dot Menu */}
        <CommunityPostMenu
          postId={post.id}
          authorId={post.authorId}
          authorName={post.author.displayName}
          canModerate={canModerate}
          isCurrentUser={isCurrentUser}
        />
      </div>

      {/* Content */}
      <p className="text-gray-900 dark:text-white">{post.content}</p>

      {/* Actions (likes, comments, etc.) */}
      <div className="flex gap-4 pt-2 border-t">
        <button className="text-sm text-gray-600">Like</button>
        <button className="text-sm text-gray-600">Comment</button>
        <button className="text-sm text-gray-600">Share</button>
      </div>
    </article>
  )
}
```

---

## ✅ Summary

**CommunityPostMenu Component:**
- ✅ 3-dot dropdown on every post
- ✅ Report + block for all users
- ✅ Hide + ban for admins
- ✅ Theme support (light/dark)
- ✅ Click-outside-to-close
- ✅ Confirmation dialogs
- ✅ Success feedback
- ✅ Loading states
- ✅ Auto-closes after action
- ✅ Callback support

**Ready to use! Drop it into any post component.** 🎉

---

## 🚀 Quick Start

```bash
# 1. Import component
import { CommunityPostMenu } from "@/components/community/CommunityPostMenu"

# 2. Add to post header
<CommunityPostMenu
  postId={post.id}
  authorId={post.authorId}
  canModerate={isAdmin}
/>

# 3. Done! Menu appears on all posts ✅
```

**The 3-dot menu is ready to use across your community!** 🚀

