# Post Reports & User Blocking - Database Schema

## ✅ Schema Updated

Added two new models to support community moderation:
1. **PostReport** - Users can report inappropriate posts
2. **UserBlock** - Users can block other users

---

## 📦 What Was Added

### **1. ReportStatus Enum**
```prisma
enum ReportStatus {
  PENDING    // Just submitted, awaiting admin review
  REVIEWED   // Admin has looked at it
  ACTIONED   // Admin took action (hid post, banned user, etc.)
}
```

### **2. PostReport Model**
```prisma
model PostReport {
  id         String       @id @default(cuid())
  postId     String       // Which post is being reported
  reporterId String       @db.Uuid  // Who reported it
  reason     String       // Why they're reporting it
  status     ReportStatus @default(PENDING)
  createdAt  DateTime     @default(now())
  reviewedAt DateTime?    // When admin reviewed it

  post     Post     @relation(fields: [postId], references: [id], onDelete: Cascade)
  reporter profiles @relation("ReporterReports", fields: [reporterId], references: [id], onDelete: Cascade)

  @@index([status, createdAt(sort: Desc)])  // Fast queries for pending reports
  @@index([postId])   // Find all reports for a post
  @@index([reporterId])  // Find all reports by a user
}
```

**Features:**
- Track who reported what post
- Store the reason for reporting
- Track review status (PENDING → REVIEWED → ACTIONED)
- Timestamp when created and reviewed
- Cascade delete if post or reporter is deleted

### **3. UserBlock Model**
```prisma
model UserBlock {
  id        String   @id @default(cuid())
  blockerId String   @db.Uuid  // Who is blocking
  blockedId String   @db.Uuid  // Who is being blocked
  createdAt DateTime @default(now())

  blocker profiles @relation("BlocksInitiated", fields: [blockerId], references: [id], onDelete: Cascade)
  blocked profiles @relation("BlocksReceived", fields: [blockedId], references: [id], onDelete: Cascade)

  @@unique([blockerId, blockedId])  // Can't block same person twice
  @@index([blockerId])  // Find who user has blocked
  @@index([blockedId])  // Find who blocked this user
}
```

**Features:**
- One user blocks another
- Unique constraint prevents duplicate blocks
- Cascade delete if either user is deleted
- Fast lookups for blocked users

### **4. Updated profiles Model**
```prisma
model profiles {
  // ... existing fields ...
  
  // New relations:
  reports         PostReport[]  @relation("ReporterReports")
  blocksInitiated UserBlock[]   @relation("BlocksInitiated")
  blocksReceived  UserBlock[]   @relation("BlocksReceived")
}
```

**New Relations:**
- `reports` - All reports this user has submitted
- `blocksInitiated` - All users this user has blocked
- `blocksReceived` - All users who have blocked this user

### **5. Updated Post Model**
```prisma
model Post {
  // ... existing fields ...
  
  reports  PostReport[]  // All reports for this post
}
```

---

## 🔄 Migration Steps

### **1. Run the Migration**
```bash
cd /Users/scottwhite/Desktop/AstroMatch1
npx prisma migrate dev --name add_post_reports_and_user_blocks
```

This will:
- Create the `PostReport` table
- Create the `UserBlock` table
- Add necessary indexes
- Add foreign key constraints

### **2. Generate Prisma Client**
```bash
npx prisma generate
```

This updates your Prisma client with the new models.

---

## 🎯 Use Cases

### **PostReport**

**Report a Post:**
```typescript
// User reports inappropriate post
await prisma.postReport.create({
  data: {
    postId: "post-123",
    reporterId: "user-456",
    reason: "Inappropriate content / harassment",
    status: "PENDING"
  }
})
```

**Get Pending Reports (Admin):**
```typescript
// Admin views all pending reports
const pendingReports = await prisma.postReport.findMany({
  where: { status: "PENDING" },
  include: {
    post: {
      include: { author: true }
    },
    reporter: true
  },
  orderBy: { createdAt: "desc" }
})
```

**Review a Report:**
```typescript
// Admin reviews and actions a report
await prisma.postReport.update({
  where: { id: "report-789" },
  data: {
    status: "ACTIONED",
    reviewedAt: new Date()
  }
})

// Also hide the post
await prisma.post.update({
  where: { id: "post-123" },
  data: { isHidden: true }
})
```

**Check if Post Has Reports:**
```typescript
// See if post has been reported
const reportCount = await prisma.postReport.count({
  where: { postId: "post-123" }
})

// Get all reports for a post
const reports = await prisma.postReport.findMany({
  where: { postId: "post-123" },
  include: { reporter: true }
})
```

---

### **UserBlock**

**Block a User:**
```typescript
// User blocks another user
await prisma.userBlock.create({
  data: {
    blockerId: "user-123",  // You
    blockedId: "user-456"   // Person you're blocking
  }
})
```

**Unblock a User:**
```typescript
// Remove the block
await prisma.userBlock.delete({
  where: {
    blockerId_blockedId: {
      blockerId: "user-123",
      blockedId: "user-456"
    }
  }
})
```

**Get Blocked Users:**
```typescript
// Get list of users you've blocked
const blockedUsers = await prisma.userBlock.findMany({
  where: { blockerId: "user-123" },
  include: { blocked: true }
})
```

**Check if User is Blocked:**
```typescript
// Check if userB is blocked by userA
const isBlocked = await prisma.userBlock.findUnique({
  where: {
    blockerId_blockedId: {
      blockerId: "userA-id",
      blockedId: "userB-id"
    }
  }
})

if (isBlocked) {
  // Don't show content
}
```

**Filter Content from Blocked Users:**
```typescript
// Get posts excluding blocked users
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

---

## 🛡️ API Endpoints to Build

### **Report Endpoints**

**1. Submit Report:**
```typescript
// POST /api/community/posts/[postId]/report
{
  "reason": "Spam / Harassment / Inappropriate content"
}
```

**2. Get Reports (Admin):**
```typescript
// GET /api/admin/reports?status=PENDING
// Returns list of pending reports
```

**3. Review Report (Admin):**
```typescript
// POST /api/admin/reports/[reportId]/review
{
  "status": "ACTIONED",
  "action": "hide_post" // or "ban_user", "dismiss"
}
```

### **Block Endpoints**

**1. Block User:**
```typescript
// POST /api/users/block
{
  "userId": "user-to-block-id"
}
```

**2. Unblock User:**
```typescript
// DELETE /api/users/block
{
  "userId": "user-to-unblock-id"
}
```

**3. Get Blocked Users:**
```typescript
// GET /api/users/blocked
// Returns list of blocked users
```

---

## 🎨 UI Components to Build

### **Report Button**
```typescript
// On each post
<button onClick={() => reportPost(post.id)}>
  🚩 Report Post
</button>

// Modal:
- Select reason (dropdown)
- Add details (textarea)
- Submit
```

### **Admin Reports Dashboard**
```typescript
// /admin/reports
- List pending reports
- Show post content
- Show reporter & reason
- Actions: Hide Post, Ban User, Dismiss
- Mark as reviewed
```

### **Block Button**
```typescript
// On user profiles
<button onClick={() => blockUser(user.id)}>
  🚫 Block User
</button>

// In settings:
- View blocked users list
- Unblock button for each
```

---

## 📊 Database Structure

```
profiles (User)
├─ reports → PostReport[] (Reports they submitted)
├─ blocksInitiated → UserBlock[] (Users they blocked)
└─ blocksReceived → UserBlock[] (Users who blocked them)

Post
└─ reports → PostReport[] (Reports for this post)

PostReport
├─ post → Post (The reported post)
└─ reporter → profiles (Who reported it)

UserBlock
├─ blocker → profiles (Who is blocking)
└─ blocked → profiles (Who is blocked)
```

---

## 🔍 Query Examples

### **Most Reported Posts:**
```typescript
const posts = await prisma.post.findMany({
  include: {
    _count: {
      select: { reports: true }
    }
  },
  orderBy: {
    reports: {
      _count: "desc"
    }
  }
})
```

### **Users with Most Reports:**
```typescript
const reporters = await prisma.profiles.findMany({
  include: {
    _count: {
      select: { reports: true }
    }
  },
  orderBy: {
    reports: {
      _count: "desc"
    }
  }
})
```

### **Check Mutual Block:**
```typescript
// Check if userA and userB have blocked each other
const blocks = await prisma.userBlock.findMany({
  where: {
    OR: [
      { blockerId: userA, blockedId: userB },
      { blockerId: userB, blockedId: userA }
    ]
  }
})

if (blocks.length > 0) {
  // One or both have blocked each other
}
```

---

## ✅ Next Steps

1. **Run Migration:**
   ```bash
   npx prisma migrate dev --name add_post_reports_and_user_blocks
   npx prisma generate
   ```

2. **Build Report API:**
   - Create `/api/community/posts/[postId]/report`
   - Create `/api/admin/reports` (list & review)

3. **Build Block API:**
   - Create `/api/users/block` (POST/DELETE)
   - Create `/api/users/blocked` (GET)

4. **Add UI Components:**
   - Report button on posts
   - Block button on user profiles
   - Admin reports dashboard
   - Blocked users list in settings

5. **Filter Content:**
   - Exclude blocked users from feeds
   - Hide posts from blocked users
   - Prevent messages from blocked users

---

## 🎉 Summary

**New Tables:**
- ✅ `PostReport` - Track post reports with status
- ✅ `UserBlock` - One-way blocking between users

**New Enum:**
- ✅ `ReportStatus` - PENDING | REVIEWED | ACTIONED

**Updated Relations:**
- ✅ profiles → reports, blocksInitiated, blocksReceived
- ✅ Post → reports

**Features Enabled:**
- ✅ Users can report inappropriate posts
- ✅ Admins can review and action reports
- ✅ Users can block other users
- ✅ Content filtering based on blocks
- ✅ Cascade deletes for data integrity

**Ready for:**
- Building report UI and API
- Building block UI and API
- Admin reports dashboard
- Content filtering logic

The database schema is ready! Run the migration to create the tables. 🚀

