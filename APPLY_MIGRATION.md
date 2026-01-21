# Apply Community Migration to Supabase

## Steps to Apply the Migration

1. **Go to Supabase SQL Editor:**
   - Open: https://supabase.com/dashboard/project/umorkbxikucjlluzezhq/sql/new
   - Or: Dashboard → SQL Editor → New Query

2. **Copy the Migration SQL:**
   - Open the file: `prisma/migrations/add_community_threads_and_sanhe_chat.sql`
   - Copy ALL the contents (it's about 102 lines)

3. **Paste and Run:**
   - Paste the SQL into the Supabase SQL Editor
   - Click the "Run" button (or press Cmd/Ctrl + Enter)
   - Wait for it to complete

4. **Verify Success:**
   - You should see "Success. No rows returned" or similar
   - The migration creates:
     - Enums: PostType, NotificationType, SanHeHouse, ChatRegionScope
     - Tables: SanHeRoom, SanHeMessage, SanHePresence
     - Updates: Post table (adds type, language, countryCode columns)
     - Updates: Notification table (changes type to enum)

## What This Migration Does

- Creates the community forum tables (Post, Comment already exist)
- Adds San He Live Chat tables
- Sets up proper foreign keys and indexes
- Adds moderation fields

## After Migration

Once the migration is applied, you can:
- Test the community section at `/community`
- Create posts and comments
- Use the San He Live Chat feature

