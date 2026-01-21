# Wake Up Your Database

The error "Can't reach database server" means your Supabase database is paused (common with free tier).

## Quick Fix - Wake Up Database:

1. Go to: https://supabase.com/dashboard/project/umorkbxikucjlluzezhq/sql/new

2. Run this query:
   ```sql
   SELECT NOW();
   ```

3. This wakes up the database (takes 5-10 seconds)

4. Refresh your community page: http://localhost:3000/community

## Better Solution - Use Connection Pooler:

The connection pooler stays awake. To get the pooler URL:

1. Go to: https://supabase.com/dashboard/project/umorkbxikucjlluzezhq/settings/database

2. Scroll down to find "Connection string" section

3. Look for "Connection pooling" tab/section

4. Copy the "URI" connection string (it should have `pooler` in the hostname and port `6543`)

5. Share it here and I'll update your .env.local

The pooler URL should look like:
```
postgresql://postgres.umorkbxikucjlluzezhq:[PASSWORD]@aws-0-[REGION].pooler.supabase.com:6543/postgres?pgbouncer=true
```

