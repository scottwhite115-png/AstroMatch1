# Community Section - Testing Checklist

## Pre-Testing Setup

- [ ] Database is accessible
- [ ] Ran migration: `npx prisma db execute --file ./prisma/migrations/add_counters.sql --schema ./prisma/schema.prisma`
- [ ] Regenerated Prisma client: `npx prisma generate`
- [ ] Dev server running: `npm run dev`
- [ ] At least 2 test user accounts created (to test interactions)

---

## ✅ Test 1: View Community Topics

### Steps:
1. Navigate to `/community`
2. Should redirect to `/community/general-astrology`
3. See topic chips/pills at the top
4. Click each topic chip

### Expected:
- [ ] Redirects to general-astrology by default
- [ ] All 6 topics are visible and clickable
- [ ] Each topic shows correct hashtag and description
- [ ] Post list loads for each topic

---

## ✅ Test 2: Create a Post (Authenticated)

### Steps:
1. Log in as User A
2. Navigate to `/community/general-astrology`
3. Click the green "+ New Post" pill
4. Modal opens
5. Fill in:
   - Title: "Test Post 1"
   - Content: "This is a test post about astrology."
6. Click "Post"

### Expected:
- [ ] Modal opens with correct topic pre-selected
- [ ] Submit button disabled when fields empty
- [ ] Post created successfully
- [ ] Modal closes
- [ ] New post appears at top of list
- [ ] Post shows author's East-West pill (e.g., "Aquarius Monkey")
- [ ] Post shows displayName
- [ ] Comment count = 0, Like count = 0 (or hidden)

---

## ✅ Test 3: Create Post (Validation)

### Steps:
1. Click "+ New Post"
2. Try to submit empty form
3. Try to submit with only title
4. Try to submit with only content

### Expected:
- [ ] Error message: "Please add a title and some content"
- [ ] Form does not submit
- [ ] Modal stays open

---

## ✅ Test 4: View Individual Thread

### Steps:
1. Navigate to any topic page
2. Click on a post card

### Expected:
- [ ] Navigates to `/community/{topic}/{postId}`
- [ ] Back link appears: "← Back to {topic}"
- [ ] Post title displayed prominently
- [ ] Topic hashtag with emoji shown
- [ ] Author East-West pill displayed
- [ ] Author displayName shown
- [ ] Full post content visible (not truncated)
- [ ] Time posted shows (e.g., "2 minutes ago")
- [ ] Comment count and like count displayed (if > 0)
- [ ] "Discussion" section below

---

## ✅ Test 5: Reply to Post (Authenticated)

### Steps:
1. Log in as User A
2. Navigate to a thread
3. See reply form at top of discussion section
4. Type: "Great question! Here's my take..."
5. Click "Post Comment"

### Expected:
- [ ] Reply form visible when logged in
- [ ] Submit button disabled when empty
- [ ] Comment posts successfully
- [ ] Page refreshes
- [ ] New comment appears below
- [ ] Comment shows author's East-West pill
- [ ] Comment shows author displayName
- [ ] Time posted shows
- [ ] Like button visible (heart icon)

---

## ✅ Test 6: Reply to Post (Unauthenticated)

### Steps:
1. Log out
2. Navigate to any thread
3. Look for reply section

### Expected:
- [ ] Reply form NOT visible
- [ ] Instead, see message: "Log in to join the discussion"
- [ ] "Log in" is a clickable link
- [ ] Link goes to `/login`

---

## ✅ Test 7: Reply to Comment (Nested Reply)

### Steps:
1. Log in as User B (different from comment author)
2. Navigate to thread with existing comment
3. Click "Reply" button on a comment
4. Reply form appears below that comment
5. Type: "I agree with this!"
6. Click "Post Comment" or submit

### Expected:
- [ ] "Reply" button visible on each comment
- [ ] Clicking "Reply" shows form under that comment
- [ ] Form has "Cancel" option
- [ ] Reply posts successfully
- [ ] Appears indented under parent comment
- [ ] Shows author's East-West pill and name

---

## ✅ Test 8: Reply to Comment (Unauthenticated)

### Steps:
1. Log out
2. Navigate to thread with comments
3. Look at comment actions

### Expected:
- [ ] "Reply" button replaced with "Log in to reply" link
- [ ] Link goes to `/login`
- [ ] Cannot click Reply

---

## ✅ Test 9: Like a Comment (Authenticated)

### Steps:
1. Log in as User B
2. Navigate to thread with User A's comment
3. Click heart icon on comment

### Expected:
- [ ] Heart icon clickable
- [ ] Like count increases by 1
- [ ] Heart fills with color (rose-400)
- [ ] No page reload (instant update)

### Steps (continued):
4. Click heart again to unlike

### Expected:
- [ ] Like count decreases by 1
- [ ] Heart returns to outline
- [ ] No page reload

---

## ✅ Test 10: Like Comment (Unauthenticated)

### Steps:
1. Log out
2. Navigate to thread with comments
3. Look at like buttons

### Expected:
- [ ] Heart icon visible but acts as link
- [ ] Clicking heart redirects to `/login`
- [ ] Like count shows if > 0

---

## ✅ Test 11: Notifications (Reply to Post)

### Steps:
1. User A creates post
2. User B replies to User A's post
3. User A checks notifications

### Expected:
- [ ] User A receives notification
- [ ] Type: "POST_REPLY"
- [ ] Shows who replied (actorId = User B)
- [ ] Links to the post
- [ ] Marked as unread initially

---

## ✅ Test 12: Notifications (Reply to Comment)

### Steps:
1. User A comments on a post
2. User B replies to User A's comment
3. User A checks notifications

### Expected:
- [ ] User A receives notification
- [ ] Type: "COMMENT_REPLY"
- [ ] Shows who replied (actorId = User B)
- [ ] Links to the post/comment
- [ ] Marked as unread initially

---

## ✅ Test 13: Mark Notification as Read

### Steps:
1. User A has unread notification
2. User A calls mark-read API (or clicks "Mark as read" if UI exists)

### Expected:
- [ ] Notification.isRead changes from false to true
- [ ] Notification moves down in list (read notifications sorted after unread)

---

## ✅ Test 14: Engagement Stats on Post Cards

### Steps:
1. Create post
2. Add comment to post
3. Like a comment on the post
4. Return to topic list page

### Expected:
- [ ] Post card shows comment icon with count
- [ ] Like icon shown if post has likes (not comments)
- [ ] Counts match actual data
- [ ] Icons styled consistently

---

## ✅ Test 15: Pagination (Future Feature)

### Steps:
1. Create 25+ posts in a topic
2. Navigate to topic page

### Expected (when pagination implemented):
- [ ] Only 20 posts show initially
- [ ] "Load more" button appears
- [ ] Clicking loads next 20 posts
- [ ] No duplicate posts

**Current State**: Loads all posts (up to 50 limit in PostList)

---

## ✅ Test 16: Top Sorting (API)

### Steps:
1. Call: `GET /api/community/posts?topic=general-astrology&sort=top&limit=10`

### Expected:
- [ ] Returns posts sorted by: `likeCount + (commentCount * 2)`
- [ ] Posts with more engagement appear first
- [ ] Falls back to createdAt DESC for ties

---

## ✅ Test 17: Invalid Topic Handling

### Steps:
1. Navigate to `/community/invalid-topic`

### Expected:
- [ ] Returns 404 Not Found
- [ ] Or shows "Invalid topic" message

---

## ✅ Test 18: Topic Validation (API)

### Steps:
1. Call: `POST /api/community/posts` with invalid topic
   ```json
   {
     "title": "Test",
     "content": "Test",
     "topic": "invalid-topic"
   }
   ```

### Expected:
- [ ] Returns 400 Bad Request
- [ ] Error message: "Invalid topic"

---

## ✅ Test 19: Auth Required (API)

### Steps:
1. Log out
2. Call: `POST /api/community/posts` without auth

### Expected:
- [ ] Returns 401 Unauthorized

---

## ✅ Test 20: East-West Pills Consistency

### Steps:
1. View multiple posts and comments from same user
2. Check East-West pill styling

### Expected:
- [ ] All pills show same format: "{WesternSign} {ChineseSign}"
- [ ] Icon shows first letter of western sign
- [ ] Styling consistent across:
  - Post cards
  - Thread page post header
  - Comments
  - Nested replies

---

## ✅ Test 21: Dark Mode Consistency

### Steps:
1. Navigate through all community pages
2. Check color scheme

### Expected:
- [ ] All cards use slate-900/60 background
- [ ] All text uses slate-* colors
- [ ] All borders use slate-800
- [ ] Green accent color for CTAs (emerald-500)
- [ ] Consistent with rest of AstroMatch app

---

## ✅ Test 22: Mobile Responsive

### Steps:
1. Open community on mobile device or resize browser < 640px
2. Try all actions

### Expected:
- [ ] Topic chips wrap properly
- [ ] Post cards stack nicely
- [ ] Modals fit on screen
- [ ] East-West pills don't overflow
- [ ] Touch targets ≥ 44px

---

## ✅ Test 23: Long Content Handling

### Steps:
1. Create post with 5000 character content
2. Create comment with 2000 character content

### Expected:
- [ ] Post card shows truncated content (line-clamp-3)
- [ ] Thread page shows full content
- [ ] No layout breaking
- [ ] Whitespace preserved (whitespace-pre-wrap)

---

## ✅ Test 24: Empty States

### Test 24a: No Posts
Navigate to new topic with no posts

Expected:
- [ ] Shows: "No posts yet. Be the first to start the conversation."

### Test 24b: No Comments
Navigate to thread with no comments

Expected:
- [ ] Shows: "No comments yet. Be the first to reply!"

---

## ✅ Test 25: Error Handling

### Test 25a: Network Error
1. Disconnect internet
2. Try to create post

Expected:
- [ ] Error message shows
- [ ] User-friendly message (not raw error)
- [ ] Form stays filled (data not lost)

### Test 25b: Server Error
1. Break database connection
2. Try to load posts

Expected:
- [ ] Error message: "Unable to load posts..."
- [ ] Doesn't crash entire page
- [ ] Retry message shown

---

## 🎯 Performance Tests

### Test 26: Query Performance
1. Create 100 posts
2. Navigate to topic page
3. Check page load time

Expected:
- [ ] Loads in < 1 second
- [ ] No N+1 queries (check with Prisma logging)
- [ ] Uses denormalized counts (not COUNT queries)

### Test 27: Real-time Updates
1. User A creates post
2. User B has same topic page open
3. User B refreshes

Expected:
- [ ] User B sees new post after refresh
- [ ] Counts are accurate

---

## 🔒 Security Tests

### Test 28: SQL Injection
1. Try to create post with SQL in content:
   ```
   Title: "'; DROP TABLE Post; --"
   Content: "Normal text"
   ```

Expected:
- [ ] Post creates normally
- [ ] SQL is escaped/sanitized
- [ ] No database tables affected

### Test 29: XSS Prevention
1. Try to create post with HTML/JS:
   ```html
   <script>alert('XSS')</script>
   ```

Expected:
- [ ] Content displays as text (not executed)
- [ ] No alert pops up when viewing

---

## 📊 Database Verification

### Test 30: Counter Accuracy
1. Create post (ID: post-1)
2. Add 3 comments to post-1
3. Add 2 likes to post-1
4. Check database directly

Expected:
```sql
SELECT "likeCount", "commentCount" FROM "Post" WHERE id = 'post-1';
-- likeCount = 2, commentCount = 3
```

---

## Summary

✅ **Total Tests**: 30
📋 **Critical Tests**: 1-15, 19, 24, 30
🎨 **UI Tests**: 20-22
⚡ **Performance Tests**: 26-27
🔒 **Security Tests**: 28-29

Once all critical tests pass, the community section is **production ready**!

---

## Bug Report Template

If you find issues during testing:

```markdown
### Bug: [Short description]

**Steps to Reproduce:**
1. 
2. 
3. 

**Expected Behavior:**
- 

**Actual Behavior:**
- 

**Environment:**
- Browser: 
- User State: [Logged in / Logged out]
- Page: 

**Screenshots:**
(if applicable)

**Console Errors:**
(if any)
```

