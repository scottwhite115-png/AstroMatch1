# Quick Start - Community Section

## ✅ Your Server is Running!

Your app is running on **port 3001** (not 3000, because that port was in use).

## Test the Community Section

### 1. Open in Browser
Visit: **http://localhost:3001/community**

This will automatically redirect to: **http://localhost:3001/community/general-astrology**

### 2. What You Should See

**If there are no posts yet:**
- You'll see: "No posts yet. Be the first to start the conversation."
- This means it's working! You just need to create your first post.

**If you see posts:**
- You'll see a list of posts with titles, content, author info, and like/comment buttons.

### 3. Create Your First Post

1. Look for a "New Post" or "+" button
2. Click it to open the post creation form
3. Fill in:
   - Title
   - Content
   - Select post type (Story or Question)
4. Submit

### 4. Test Other Features

- **View different topics**: Change the URL to `/community/sun-signs` or other topics
- **View a post**: Click on any post to see its full content and comments
- **Like posts**: Click the like button
- **Comment**: Add comments to posts

## Troubleshooting

### If you see "Database is not configured":
- Check that `.env.local` has `DATABASE_URL` set
- Restart the dev server

### If you see "Can't reach database server":
- Your Supabase database might be paused (free tier pauses after inactivity)
- Go to Supabase dashboard and wake it up, or wait a moment and refresh

### If the page is blank or loading forever:
- Check the browser console (F12) for errors
- Check the terminal where `npm run dev` is running for errors

## All Set!

Your community section should be working now. Try visiting:
- http://localhost:3001/community
- http://localhost:3001/community/general-astrology
- http://localhost:3001/community/sun-signs

Let me know if you see any errors!
