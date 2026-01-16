# Community Seed Data - Quick Guide

## 🚀 How to Add Test Posts

### Option 1: Using the Web UI (Easiest)

1. **Start your dev server** (if not already running):
   ```bash
   npm run dev
   ```

2. **Navigate to the seed page**:
   ```
   http://localhost:3000/seed-community
   ```

3. **Click "Add Test Data"** button
   - This will create test posts, comments, and profiles
   - You'll see a success message with stats

4. **Click "View Community"** to see your test data!

### Option 2: Using the API Directly

**Via Browser:**
```
http://localhost:3000/api/seed/community
```

**Via cURL:**
```bash
curl -X POST http://localhost:3000/api/seed/community \
  -H "Content-Type: application/json" \
  -d '{"clear": false}'
```

**Via fetch (in browser console):**
```javascript
fetch('/api/seed/community', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ clear: false })
}).then(r => r.json()).then(console.log)
```

## 📊 What Gets Created

### Test Profiles (5)
- **Luna Starweaver** - Pisces Dragon
- **Cosmic Sage** - Aquarius Rabbit  
- **Stellar Navigator** - Leo Tiger
- **Nebula Dreamer** - Cancer Snake
- **Astral Wanderer** - Sagittarius Horse

### Test Posts (18)
Distributed across all 6 topics:
- **General Astrology** (3 posts)
- **Sun Signs** (3 posts)
- **Chinese Astrology** (3 posts)
- **Vedic Astrology** (2 posts)
- **Compatibility & Synastry** (3 posts)
- **AstroMatch Feedback** (3 posts)

### Test Comments (8+)
- Random comments on various posts
- 3 nested replies (replies to comments)
- Random like counts for engagement

## 🎨 What You Can Test

Once seeded, you can test:

✅ **Post Cards**
- East-West pills on each post
- Like/comment counts
- Topic hashtags
- Author display names

✅ **Thread Pages**
- Full post display
- Author info with East-West pills
- Comment threads
- Nested replies
- Like buttons

✅ **UI Components**
- New Post button modal
- Comment forms
- Like buttons
- Engagement stats
- Topic navigation

✅ **Design Layouts**
- Dark mode styling
- Card layouts
- Responsive design
- Typography
- Spacing and borders

## 🔄 Re-seeding

### Add More Data
- Just click "Add Test Data" again
- New posts will be added to existing ones

### Clear & Re-seed
- Click "Clear & Re-seed" button
- This removes all test data first, then creates fresh data
- Useful if you want to start clean

## 🗑️ Removing Test Data

To remove test data manually, you can:

1. **Use the API with clear flag:**
   ```bash
   curl -X POST http://localhost:3000/api/seed/community \
     -H "Content-Type: application/json" \
     -d '{"clear": true}'
   ```

2. **Or delete directly in database:**
   ```sql
   -- Delete test posts and related data
   DELETE FROM "CommentLike" WHERE "commentId" IN (
     SELECT id FROM "Comment" WHERE "postId" IN (
       SELECT id FROM "Post" WHERE "authorId" IN (
         '00000000-0000-0000-0000-000000000001',
         '00000000-0000-0000-0000-000000000002',
         '00000000-0000-0000-0000-000000000003',
         '00000000-0000-0000-0000-000000000004',
         '00000000-0000-0000-0000-000000000005'
       )
     )
   );
   
   DELETE FROM "Comment" WHERE "postId" IN (
     SELECT id FROM "Post" WHERE "authorId" IN (
       '00000000-0000-0000-0000-000000000001',
       '00000000-0000-0000-0000-000000000002',
       '00000000-0000-0000-0000-000000000003',
       '00000000-0000-0000-0000-000000000004',
       '00000000-0000-0000-0000-000000000005'
     )
   );
   
   DELETE FROM "PostLike" WHERE "postId" IN (
     SELECT id FROM "Post" WHERE "authorId" IN (
       '00000000-0000-0000-0000-000000000001',
       '00000000-0000-0000-0000-000000000002',
       '00000000-0000-0000-0000-000000000003',
       '00000000-0000-0000-0000-000000000004',
       '00000000-0000-0000-0000-000000000005'
     )
   );
   
   DELETE FROM "Post" WHERE "authorId" IN (
     '00000000-0000-0000-0000-000000000001',
     '00000000-0000-0000-0000-000000000002',
     '00000000-0000-0000-0000-000000000003',
     '00000000-0000-0000-0000-000000000004',
     '00000000-0000-0000-0000-000000000005'
   );
   ```

## 📝 Customizing Test Data

To customize the test posts, edit:
```
app/api/seed/community/route.ts
```

You can modify:
- `TEST_PROFILES` - Add more test users
- `TEST_POSTS` - Add more posts or change content
- Comment generation logic
- Like count ranges

## ⚠️ Notes

- Test profiles use fixed UUIDs (starting with `00000000-0000-0000-0000-...`)
- Test data is safe to use in development
- Don't use in production (or remove seed endpoint in production)
- Posts are created with timestamps staggered by 1 hour for realistic ordering

## 🎯 Quick Test Checklist

After seeding, verify:

- [ ] Posts appear on topic pages
- [ ] Post cards show East-West pills
- [ ] Clicking a post opens thread page
- [ ] Comments display with author info
- [ ] Like buttons work (if logged in)
- [ ] Reply forms appear (if logged in)
- [ ] Engagement stats show correctly
- [ ] All 6 topics have posts
- [ ] Nested replies display properly
- [ ] UI looks good on mobile/desktop

Happy testing! 🚀

