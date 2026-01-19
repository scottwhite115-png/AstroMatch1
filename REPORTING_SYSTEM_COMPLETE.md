# Post Reporting System

## ✅ Complete Implementation

Built a full post reporting system with API endpoint and UI component.

---

## 📦 What Was Built

### **1. API Endpoint** ✅
**File:** `app/api/community/report/route.ts`

**Endpoint:**
```typescript
POST /api/community/report
{
  "postId": "post-id",
  "reason": "Spam or misleading"
}
```

**Features:**
- ✅ Authentication required
- ✅ Moderation guard (suspended/banned users can't report)
- ✅ Validates post exists
- ✅ Prevents duplicate reports (one report per user per post)
- ✅ Validates reason (minimum 5 characters)
- ✅ Caps reason at 500 characters
- ✅ Creates PostReport with PENDING status

**Response:**
```typescript
// Success:
{
  "ok": true,
  "message": "Report submitted successfully"
}

// Error:
{
  "error": "You have already reported this post"
}
```

**Status Codes:**
- `200` - Report submitted successfully
- `400` - Invalid input / already reported
- `401` - Not authenticated
- `403` - Account suspended/banned
- `404` - Post not found

---

### **2. Report Button Component** ✅
**File:** `components/community/ReportPostButton.tsx`

**Usage:**
```typescript
import { ReportPostButton } from "@/components/community/ReportPostButton"

<ReportPostButton
  postId={post.id}
  postTitle={post.title}
  theme="light" // or "dark"
/>
```

**Features:**
- ✅ Flag icon button (🚩 Report)
- ✅ Modal with report reasons
- ✅ 6 predefined reasons + custom option
- ✅ Character counter (500 max)
- ✅ Loading states
- ✅ Success feedback
- ✅ Error handling
- ✅ Theme support (light/dark)
- ✅ Responsive design
- ✅ Accessible (keyboard navigation)

**Report Reasons:**
1. Spam or misleading
2. Harassment or hate speech
3. Violence or dangerous content
4. Inappropriate or explicit content
5. Misinformation
6. Other (please specify) - with textarea

---

## 🎨 UI Design

### **Button (Collapsed)**
```
[🚩 Report]  ← Small, subtle button
```

### **Modal (Expanded)**
```
┌──────────────────────────────────────┐
│ 🚩 Report Post                    ✕  │
├──────────────────────────────────────┤
│ Reporting: "Post Title Here"         │
│                                      │
│ Why are you reporting this post?    │
│                                      │
│ ○ Spam or misleading                │
│ ○ Harassment or hate speech         │
│ ○ Violence or dangerous content     │
│ ○ Inappropriate or explicit content │
│ ○ Misinformation                    │
│ ● Other (please specify)            │
│                                      │
│ ┌──────────────────────────────────┐│
│ │ Describe why you're reporting... ││
│ │                                  ││
│ └──────────────────────────────────┘│
│ 125/500                             │
│                                      │
│ [Cancel] [Submit Report]            │
└──────────────────────────────────────┘
```

---

## 🔄 User Flow

### **Step 1: Click Report**
```
User sees inappropriate post
  ↓
Clicks "🚩 Report" button
  ↓
Modal opens
```

### **Step 2: Select Reason**
```
User selects reason from list
  ↓
If "Other" → Shows textarea
  ↓
User types custom reason
```

### **Step 3: Submit**
```
User clicks "Submit Report"
  ↓
API validates (auth, post exists, not duplicate)
  ↓
Creates PostReport with status: PENDING
  ↓
Shows success message
  ↓
Modal closes automatically after 2 seconds
```

---

## 🛡️ Security Features

### **1. Authentication Check**
```typescript
const profile = await getCurrentProfileWithRole()
if (!profile) {
  return 401 // Must be logged in
}
```

### **2. Moderation Guard**
```typescript
// Suspended/banned users can't report
if (profile.status === "SUSPENDED" || profile.status === "BANNED") {
  return 403
}
```

### **3. Duplicate Prevention**
```typescript
// Check if user already reported this post
const existingReport = await prisma.postReport.findFirst({
  where: { postId, reporterId: profile.id }
})

if (existingReport) {
  return 400 // Already reported
}
```

### **4. Input Validation**
```typescript
// Minimum reason length
if (reason.trim().length < 5) {
  return 400
}

// Cap at 500 characters
reason: reason.slice(0, 500)
```

### **5. Post Verification**
```typescript
// Ensure post exists
const post = await prisma.post.findUnique({ where: { id: postId } })
if (!post) {
  return 404
}
```

---

## 🎯 Integration Examples

### **Add to CommunityPost Component**
```typescript
// components/community/CommunityPost.tsx
import { ReportPostButton } from "@/components/community/ReportPostButton"

export function CommunityPost({ post }) {
  return (
    <article>
      <header>
        <h2>{post.title}</h2>
        <div className="flex gap-2">
          {/* Existing admin actions */}
          <PostAdminActions {...} />
          
          {/* Add report button for all users */}
          <ReportPostButton
            postId={post.id}
            postTitle={post.title}
          />
        </div>
      </header>
      {/* ... rest of post ... */}
    </article>
  )
}
```

### **Add to Post Card**
```typescript
// In any post list/card component
<div className="post-footer">
  <div className="post-actions">
    <LikeButton postId={post.id} />
    <CommentButton postId={post.id} />
    <ReportPostButton postId={post.id} postTitle={post.title} />
  </div>
</div>
```

---

## 📊 Database Flow

### **Creating a Report:**
```sql
INSERT INTO "PostReport" (
  id, postId, reporterId, reason, status, createdAt
) VALUES (
  'cuid...', 'post-123', 'user-456', 'Spam or misleading', 'PENDING', NOW()
);
```

### **Checking Existing Report:**
```sql
SELECT * FROM "PostReport"
WHERE postId = 'post-123' AND reporterId = 'user-456';
```

### **Getting Post Reports (Admin):**
```sql
SELECT pr.*, p.title, p.content, u.display_name
FROM "PostReport" pr
JOIN "Post" p ON pr.postId = p.id
JOIN "profiles" u ON pr.reporterId = u.id
WHERE pr.status = 'PENDING'
ORDER BY pr.createdAt DESC;
```

---

## 🔍 Admin Dashboard (Next Step)

**To build:** `/admin/reports` page

**Features needed:**
- List all pending reports
- Show post content & author
- Show reporter & reason
- Actions:
  - Mark as reviewed
  - Hide post
  - Ban user
  - Dismiss report

**Query:**
```typescript
const reports = await prisma.postReport.findMany({
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

---

## 🧪 Testing

### **Test 1: Submit Report**
```bash
1. Log in as regular user
2. Find a post
3. Click "🚩 Report"
4. Select reason
5. Submit
6. See success message ✅
```

### **Test 2: Duplicate Prevention**
```bash
1. Report a post
2. Try to report same post again
3. See error: "You have already reported this post" ✅
```

### **Test 3: Suspended User**
```bash
1. Suspend test user
2. Log in as that user
3. Try to report a post
4. See error: "Account suspended" ✅
```

### **Test 4: Validation**
```bash
1. Click report
2. Try to submit without selecting reason
3. Button disabled ✅
4. Select "Other" without typing
5. See error: "At least 5 characters" ✅
```

---

## 📁 Files Created

```
✅ app/api/community/report/route.ts
   - POST endpoint for submitting reports
   - Auth + moderation guards
   - Duplicate prevention
   - Input validation

✅ components/community/ReportPostButton.tsx
   - Report button with modal
   - 6 predefined reasons + custom
   - Theme support
   - Success/error handling
```

---

## 🎉 What You Can Do Now

**Users Can:**
- ✅ Report inappropriate posts
- ✅ Select from common reasons
- ✅ Provide custom details
- ✅ See success confirmation
- ✅ Can't report same post twice

**System Will:**
- ✅ Store report with PENDING status
- ✅ Link to post and reporter
- ✅ Prevent duplicate reports
- ✅ Block suspended users from reporting
- ✅ Validate all inputs

**Next Steps:**
- Build `/admin/reports` dashboard
- Admins review pending reports
- Admins can hide posts or ban users
- Mark reports as REVIEWED/ACTIONED

---

## 🚀 Quick Start

### **1. Run Migration** (if not done yet)
```bash
npx prisma migrate dev --name add_post_reports_and_user_blocks
npx prisma generate
```

### **2. Add Report Button to Posts**
```typescript
import { ReportPostButton } from "@/components/community/ReportPostButton"

<ReportPostButton postId={post.id} postTitle={post.title} />
```

### **3. Test It**
```
1. Go to community feed
2. See "🚩 Report" on posts
3. Click it
4. Submit a report
5. Success! ✅
```

---

## 📝 API Reference

### **POST /api/community/report**

**Request:**
```json
{
  "postId": "string (required)",
  "reason": "string (min 5 chars, max 500)"
}
```

**Success Response (200):**
```json
{
  "ok": true,
  "message": "Report submitted successfully"
}
```

**Error Responses:**
```json
// 401 Not Authenticated
{ "error": "Not authenticated" }

// 403 Suspended
{
  "error": "Your account is suspended from posting and messaging.",
  "suspensionEndsAt": "2025-12-22T10:00:00.000Z"
}

// 403 Banned
{ "error": "Your account has been banned." }

// 400 Invalid Input
{ "error": "postId and reason are required" }

// 400 Too Short
{ "error": "Please provide a detailed reason (at least 5 characters)" }

// 400 Duplicate
{ "error": "You have already reported this post" }

// 404 Not Found
{ "error": "Post not found" }
```

---

## ✅ Summary

**Report System Complete:**
- ✅ API endpoint (`/api/community/report`)
- ✅ UI component (`<ReportPostButton>`)
- ✅ Authentication & moderation guards
- ✅ Duplicate prevention
- ✅ Input validation
- ✅ Theme support
- ✅ Success/error handling

**Ready to Use:**
- Drop `<ReportPostButton>` into any post component
- Users can report posts immediately
- Reports stored with PENDING status
- Ready for admin dashboard integration

**Next:** Build `/admin/reports` page to review and action reports! 🚀

