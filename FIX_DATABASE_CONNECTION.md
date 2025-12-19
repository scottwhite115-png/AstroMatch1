# Fix Database Connection Issue

## The Problem
Your app can't reach the Supabase database server. This is common with Supabase free tier because databases pause after inactivity.

## Solution: Use Connection Pooler

The connection pooler stays awake and works better. Here's how to fix it:

### Step 1: Get the Connection Pooler URL

1. Go to: https://supabase.com/dashboard/project/umorkbxikucjlluzezhq/settings/database
2. Scroll down to "Connection string" section
3. Find the "URI" connection string under "Connection pooling" (not "Direct connection")
4. It should look like:
   ```
   postgresql://postgres.umorkbxikucjlluzezhq:[YOUR-PASSWORD]@aws-0-[REGION].pooler.supabase.com:6543/postgres?pgbouncer=true
   ```

### Step 2: Update .env.local

Replace the `DATABASE_URL` in `.env.local` with the pooler connection string you copied.

The format should be:
```
DATABASE_URL="postgresql://postgres.umorkbxikucjlluzezhq:Aquarius_1980@aws-0-[REGION].pooler.supabase.com:6543/postgres?pgbouncer=true&sslmode=require"
```

**Important:** 
- Use the connection pooler URL (port 6543, has `pooler` in the hostname)
- NOT the direct connection URL (port 5432, has `db` in the hostname)
- Replace `[REGION]` with your actual region (like `us-east-1`, `us-west-1`, etc.)

### Step 3: Restart Your Dev Server

After updating `.env.local`:
1. Stop your dev server (Ctrl+C)
2. Start it again: `npm run dev`
3. Try visiting the community page again

## Alternative: Wake Up Your Database

If you prefer to use the direct connection:
1. Go to Supabase dashboard
2. Visit any page in your project (this wakes up the database)
3. Wait a few seconds
4. Try your app again

But the pooler is more reliable for development!

## Still Not Working?

If you still can't connect:
1. Double-check the connection string is correct
2. Make sure your password is correct
3. Try copying the connection string directly from Supabase (don't type it manually)
4. Check if your Supabase project is still active (not deleted/suspended)

