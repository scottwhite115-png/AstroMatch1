# Troubleshooting Community Section

## Common Issues and Fixes

### 1. Database Connection Error

**Symptoms:**
- Page shows "Database is not configured" or "Can't reach database server"
- Error in browser console about database connection

**Fix:**
- Check that `.env.local` has `DATABASE_URL` set correctly
- Make sure your Supabase database is not paused (free tier pauses after inactivity)
- Try restarting your dev server: `npm run dev`

### 2. "No posts yet" Message

**This is normal!** If you see "No posts yet. Be the first to start the conversation" - that means it's working! You just need to create your first post.

### 3. Page Not Loading / Blank Page

**Check:**
- Is your dev server running? (`npm run dev`)
- Check the terminal for error messages
- Check browser console (F12) for JavaScript errors
- Try visiting: http://localhost:3000/community/general-astrology directly

### 4. Prisma Client Error

**Symptoms:**
- "Prisma client not initialized" error

**Fix:**
```bash
cd /Users/scottwhite/Desktop/AstroMatch1
npx prisma generate
npm run dev
```

### 5. Migration Not Applied

**Symptoms:**
- "Table doesn't exist" errors
- "Column doesn't exist" errors

**Fix:**
- Make sure you ran the safe migration SQL in Supabase
- Check Supabase SQL Editor to verify tables exist

## Quick Diagnostic Steps

1. **Check dev server is running:**
   ```bash
   npm run dev
   ```

2. **Check DATABASE_URL is set:**
   ```bash
   cat .env.local | grep DATABASE_URL
   ```

3. **Verify Prisma client:**
   ```bash
   npx prisma generate
   ```

4. **Check browser console:**
   - Open browser DevTools (F12)
   - Look at Console tab for errors
   - Look at Network tab for failed requests

5. **Check terminal output:**
   - Look for error messages in the terminal where `npm run dev` is running

## Still Not Working?

Please share:
1. What error message you see (if any)
2. What page you're trying to visit
3. Any error messages from the terminal
4. Any error messages from the browser console (F12)

