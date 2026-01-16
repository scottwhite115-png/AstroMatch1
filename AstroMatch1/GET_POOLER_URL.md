# Get the Correct Connection Pooler URL

The connection pooler URL format needs to be exact. Here's how to get it:

## Steps:

1. Go to: https://supabase.com/dashboard/project/umorkbxikucjlluzezhq/settings/database

2. Scroll down to find **"Connection string"** or **"Connection pooling"** section

3. Look for a dropdown or tabs that say:
   - "Direct connection" 
   - "Connection pooling" or "Session mode" or "Transaction mode"

4. Under **"Connection pooling"**, find the **"URI"** field

5. Copy the entire connection string - it should look like:
   ```
   postgresql://postgres.umorkbxikucjlluzezhq:[YOUR-PASSWORD]@aws-0-[REGION].pooler.supabase.com:6543/postgres?pgbouncer=true
   ```

6. Replace `[YOUR-PASSWORD]` with your actual password: `Aquarius_1980$$$`

**Important:** 
- Make sure it has `pooler` in the hostname
- Make sure the port is `6543` (not 5432)
- Make sure it has `pgbouncer=true` in the query string

## Alternative: Try to Wake Up Database

If the pooler URL doesn't work, the database might be paused:

1. Go to Supabase dashboard
2. Click on "SQL Editor" 
3. Run a simple query: `SELECT NOW();`
4. This wakes up the database
5. Then try the direct connection

