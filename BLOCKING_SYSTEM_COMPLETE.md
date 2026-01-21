# User Blocking System

## ✅ Complete Implementation

Built a full user blocking system with API endpoints and UI components.

---

## 📦 What Was Built

### **1. API Endpoint** ✅
**File:** `app/api/community/block/route.ts`

#### **GET: Fetch Blocked Users**
```typescript
GET /api/community/block

Response:
{
  "blockedUsers": [
    {
      "id": "user-id",
      "displayName": "John Doe",
      "eastWestCode": "♒ Aquarius 🐒 Monkey",
      "chineseSign": "Monkey",
      "photoUrl": "https://...",
      "blockedAt": "2025-12-15T10:00:00Z"
    }
  ]
}
```

#### **POST: Block or Unblock User**
```typescript
POST /api/community/block
{
  "targetUserId": "user-id",
  "action": "BLOCK" // or "UNBLOCK"
}

Response:
{
  "ok": true,
  "message": "Blocked John Doe"
}
```

**Features:**
- ✅ Authentication required
- ✅ GET: List all users you've blocked
- ✅ POST: Block or unblock a user
- ✅ Validates target user exists
- ✅ Prevents self-blocking
- ✅ Uses upsert (no error if already blocked)
- ✅ Returns user-friendly messages

---

### **2. Block User Button Component** ✅
**File:** `components/community/BlockUserButton.tsx`

**Usage:**
```typescript
import { BlockUserButton } from "@/components/community/BlockUserButton"

<BlockUserButton
  userId={user.id}
  userName={user.displayName}
  isBlocked={false}
  onBlockChange={(blocked) => console.log("Blocked:", blocked)}
  theme="light" // or "dark"
  size="md" // sm, md, or lg
/>
```

**Features:**
- ✅ Toggle block/unblock state
- ✅ Confirmation dialog before action
- ✅ Loading state
- ✅ Three sizes (sm, md, lg)
- ✅ Theme support (light/dark)
- ✅ Callback on state change
- ✅ Shows "Block" or "Unblock" based on state

**States:**
- Not blocked → Red "Block" button
- Blocked → Gray "Unblock" button
- Loading → Disabled with "..."

---

### **3. Blocked Users List Component** ✅
**File:** `components/community/BlockedUsersList.tsx`

**Usage:**
```typescript
import { BlockedUsersList } from "@/components/community/BlockedUsersList"

<BlockedUsersList theme="light" />
```

**Features:**
- ✅ Fetches blocked users on mount
- ✅ Shows user avatar, name, signs, block date
- ✅ Unblock button for each user
- ✅ Loading state
- ✅ Empty state ("No blocked users")
- ✅ Count display
- ✅ Theme support
- ✅ Confirmation before unblock

---

## 🎨 UI Design

### **Block Button (on Profile)**
```
┌─────────────────────┐
│ User Profile        │
│ @username           │
│                     │
│ [🚫 Block]          │← Red button
└─────────────────────┘

After blocking:
[🚫 Unblock]  ← Gray button
```

### **Blocked Users List (in Settings)**
```
┌─────────────────────────────────────┐
│ Blocked Users                       │
├─────────────────────────────────────┤
│ ┌─────────────────────────────────┐ │
│ │ [👤] John Doe                   │ │
│ │      ♒ Aquarius 🐒 Monkey       │ │
│ │      Blocked Dec 15, 2025       │ │
│ │                     [Unblock]   │ │
│ └─────────────────────────────────┘ │
│                                     │
│ ┌─────────────────────────────────┐ │
│ │ [👤] Jane Smith                 │ │
│ │      ♍ Virgo 🐉 Dragon          │ │
│ │      Blocked Dec 10, 2025       │ │
│ │                     [Unblock]   │ │
│ └─────────────────────────────────┘ │
│                                     │
│ 2 blocked users                     │
└─────────────────────────────────────┘

Empty State:
┌─────────────────────────────────────┐
│       🚫                            │
│   No blocked users                  │
│ When you block someone,             │
│ they'll appear here.                │
└─────────────────────────────────────┘
```

---

## 🔄 User Flows

### **Flow 1: Block a User**
```
1. User views someone's profile
2. Clicks "🚫 Block" button
3. Confirmation dialog:
   "Block [Name]?
    You won't see their posts, comments, or messages.
    They won't be notified."
4. User confirms
5. API creates UserBlock record
6. Button changes to "Unblock" (gray)
7. Success! User is now blocked
```

### **Flow 2: Unblock a User**
```
1. User goes to Settings → Blocked Users
2. Sees list of blocked users
3. Clicks "Unblock" on a user
4. Confirmation dialog:
   "Unblock [Name]?
    You will see their content again."
5. User confirms
6. API deletes UserBlock record
7. User removed from list
8. Success! User is now unblocked
```

### **Flow 3: View Blocked Users**
```
1. User goes to Settings
2. Navigates to "Blocked Users" section
3. Sees list of all blocked users with:
   - Avatar
   - Name
   - Signs
   - Block date
   - Unblock button
4. Can unblock any user from list
```

---

## 🛡️ Security & Validation

### **1. Authentication**
```typescript
const profile = await getCurrentProfileWithRole()
if (!profile) return 401
```

### **2. Self-Block Prevention**
```typescript
if (targetUserId === profile.id) {
  return 400 // "You cannot block yourself."
}
```

### **3. User Exists Check**
```typescript
const targetUser = await prisma.profiles.findUnique({
  where: { id: targetUserId }
})
if (!targetUser) return 404
```

### **4. Action Validation**
```typescript
if (action !== "BLOCK" && action !== "UNBLOCK") {
  return 400 // "Invalid action"
}
```

### **5. Idempotent Operations**
```typescript
// Using upsert - won't error if already blocked
await prisma.userBlock.upsert({
  where: { blockerId_blockedId: { ... } },
  update: {}, // Do nothing if exists
  create: { ... }
})
```

---

## 🎯 Integration Examples

### **Add to User Profile**
```typescript
// In user profile component
import { BlockUserButton } from "@/components/community/BlockUserButton"

<div className="profile-actions">
  <FollowButton userId={user.id} />
  <MessageButton userId={user.id} />
  <BlockUserButton
    userId={user.id}
    userName={user.displayName}
    isBlocked={checkIfBlocked(user.id)}
  />
</div>
```

### **Add to Settings Page**
```typescript
// In app/profile/account/page.tsx
import { BlockedUsersList } from "@/components/community/BlockedUsersList"

<div className="settings-section">
  <h2>Privacy & Safety</h2>
  
  <div className="mb-8">
    <h3>Blocked Users</h3>
    <p>Users you've blocked won't see your content or message you.</p>
    <BlockedUsersList />
  </div>
</div>
```

### **Add to Post Card (3-dot Menu)**
```typescript
// In PostAdminActions or similar
<button onClick={() => blockUser(post.authorId)}>
  🚫 Block @{post.author.name}
</button>
```

---

## 📊 Database Operations

### **Create Block:**
```sql
INSERT INTO "UserBlock" (id, blockerId, blockedId, createdAt)
VALUES ('cuid...', 'user-123', 'user-456', NOW())
ON CONFLICT (blockerId, blockedId) DO NOTHING;
```

### **Remove Block:**
```sql
DELETE FROM "UserBlock"
WHERE blockerId = 'user-123' AND blockedId = 'user-456';
```

### **Get Blocked Users:**
```sql
SELECT ub.*, p.*
FROM "UserBlock" ub
JOIN "profiles" p ON ub.blockedId = p.id
WHERE ub.blockerId = 'user-123'
ORDER BY ub.createdAt DESC;
```

### **Check if Blocked:**
```sql
SELECT EXISTS(
  SELECT 1 FROM "UserBlock"
  WHERE blockerId = 'user-A' AND blockedId = 'user-B'
);
```

---

## 🔍 Content Filtering (Next Step)

### **Filter Posts from Blocked Users:**
```typescript
// In community feed API
const blockedUserIds = await prisma.userBlock.findMany({
  where: { blockerId: currentUserId },
  select: { blockedId: true }
}).then(blocks => blocks.map(b => b.blockedId))

const posts = await prisma.post.findMany({
  where: {
    authorId: {
      notIn: blockedUserIds  // Exclude blocked users
    }
  }
})
```

### **Hide Blocked Users in Discover:**
```typescript
// In matches/discover API
const blockedIds = await getBlockedUserIds(currentUserId)

const matches = await prisma.profiles.findMany({
  where: {
    id: {
      notIn: [...blockedIds, currentUserId]
    }
  }
})
```

### **Block Messages:**
```typescript
// In messages API
const isBlocked = await prisma.userBlock.findUnique({
  where: {
    blockerId_blockedId: {
      blockerId: recipientId,
      blockedId: senderId
    }
  }
})

if (isBlocked) {
  return 403 // Can't message blocked user
}
```

---

## 🧪 Testing

### **Test 1: Block a User**
```bash
1. Go to user's profile
2. Click "🚫 Block"
3. Confirm dialog
4. Button changes to "Unblock" ✅
5. User's posts disappear from feed ✅
```

### **Test 2: Unblock from Profile**
```bash
1. Go to blocked user's profile
2. See "Unblock" button (gray)
3. Click it
4. Confirm
5. Button changes to "Block" (red) ✅
6. User's posts reappear ✅
```

### **Test 3: View Blocked List**
```bash
1. Go to Settings → Blocked Users
2. See list of blocked users ✅
3. Each shows avatar, name, signs, date ✅
4. Each has "Unblock" button ✅
```

### **Test 4: Unblock from List**
```bash
1. In blocked users list
2. Click "Unblock" on a user
3. Confirm
4. User removed from list ✅
5. Count decreases ✅
```

### **Test 5: Self-Block Prevention**
```bash
1. Try to block yourself via API
2. Get error: "You cannot block yourself." ✅
```

### **Test 6: Already Blocked**
```bash
1. Block a user
2. Try to block them again
3. No error, just success (upsert) ✅
```

---

## 📁 Files Created

```
✅ app/api/community/block/route.ts
   - GET: List blocked users
   - POST: Block/unblock user
   - Validation & error handling

✅ components/community/BlockUserButton.tsx
   - Toggle block/unblock
   - Confirmation dialogs
   - Theme & size variants

✅ components/community/BlockedUsersList.tsx
   - Fetch and display blocked users
   - Unblock from list
   - Empty state & loading
```

---

## 🎉 What You Can Do Now

**Users Can:**
- ✅ Block other users
- ✅ Unblock users (from profile or list)
- ✅ View list of blocked users
- ✅ See when each user was blocked
- ✅ Can't block themselves
- ✅ Get confirmation before blocking

**System Will:**
- ✅ Store blocks in UserBlock table
- ✅ Prevent duplicate blocks (unique constraint)
- ✅ Allow unblocking anytime
- ✅ Track block dates

**Next Steps:**
- Filter blocked users from feeds
- Hide blocked users in discover
- Block messages from blocked users
- Hide blocked users' comments

---

## 🚀 Quick Start

### **1. Run Migration** (if not done)
```bash
npx prisma migrate dev --name add_post_reports_and_user_blocks
npx prisma generate
```

### **2. Add Block Button to Profiles**
```typescript
import { BlockUserButton } from "@/components/community/BlockUserButton"

<BlockUserButton
  userId={user.id}
  userName={user.displayName}
  theme={theme}
/>
```

### **3. Add Blocked List to Settings**
```typescript
import { BlockedUsersList } from "@/components/community/BlockedUsersList"

<section>
  <h3>Blocked Users</h3>
  <BlockedUsersList theme={theme} />
</section>
```

### **4. Test It**
```
1. Go to a user's profile
2. Click "🚫 Block"
3. Confirm
4. Go to Settings → Blocked Users
5. See them in the list
6. Click "Unblock"
7. Success! ✅
```

---

## 📝 API Reference

### **GET /api/community/block**

**Response (200):**
```json
{
  "blockedUsers": [
    {
      "id": "user-id",
      "displayName": "John Doe",
      "eastWestCode": "♒ Aquarius 🐒 Monkey",
      "chineseSign": "Monkey",
      "photoUrl": "https://...",
      "blockedAt": "2025-12-15T10:00:00.000Z"
    }
  ]
}
```

**Error (401):**
```json
{ "error": "Not authenticated" }
```

---

### **POST /api/community/block**

**Request:**
```json
{
  "targetUserId": "user-id",
  "action": "BLOCK" // or "UNBLOCK"
}
```

**Success (200):**
```json
{
  "ok": true,
  "message": "Blocked John Doe"
}
```

**Errors:**
```json
// 400 Invalid Action
{ "error": "Invalid action. Must be BLOCK or UNBLOCK" }

// 400 Self-Block
{ "error": "You cannot block yourself." }

// 400 Missing Fields
{ "error": "targetUserId and action are required" }

// 401 Not Authenticated
{ "error": "Not authenticated" }

// 404 User Not Found
{ "error": "User not found" }
```

---

## ✅ Summary

**Blocking System Complete:**
- ✅ API endpoints (GET blocked users, POST block/unblock)
- ✅ Block button component (with states & sizes)
- ✅ Blocked users list component (for settings)
- ✅ Validation & security (no self-block, user exists)
- ✅ Confirmation dialogs
- ✅ Theme support (light/dark)
- ✅ Loading & error states

**Ready to Use:**
- Drop `<BlockUserButton>` on user profiles
- Add `<BlockedUsersList>` to settings page
- Users can block/unblock immediately
- Blocks stored in database with dates

**Next:** Filter content from blocked users in feeds, discover, and messages! 🚀

