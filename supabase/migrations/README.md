# 🗄️ Database Migrations

## Running Migrations

These migrations must be run **in order** in your Supabase SQL Editor.

### Step-by-Step Instructions:

1. **Go to Supabase Dashboard**
   - Navigate to: https://supabase.com/dashboard
   - Select your project: `umorkbxikucjlluzezhq`

2. **Open SQL Editor**
   - Click "SQL Editor" in the left sidebar
   - Click "New Query"

3. **Run Migrations in Order**

#### Migration 001: Enhance Profiles Schema
```bash
# Copy contents of: 001_enhance_profiles_schema.sql
# Paste into SQL Editor
# Click "Run"
```
**What it does:**
- Adds all missing profile fields (bio, photos, age, etc.)
- Adds search preferences (looking_for_gender, age_min, age_max, distance_radius)
- Adds privacy settings
- Creates indexes for fast queries
- Auto-calculates age from birthdate

---

#### Migration 002: Likes, Matches, Passes
```bash
# Copy contents of: 002_create_likes_matches_passes.sql
# Paste into SQL Editor
# Click "Run"
```
**What it does:**
- Creates `likes` table (when user swipes right)
- Creates `matches` table (mutual likes)
- Creates `passes` table (when user swipes left, hidden for 28 days)
- Auto-creates matches when both users like each other (trigger)
- Sets up RLS policies for privacy

---

#### Migration 003: Messages System
```bash
# Copy contents of: 003_create_messages.sql
# Paste into SQL Editor
# Click "Run"
```
**What it does:**
- Creates `messages` table
- Supports text, GIF, emoji, and image messages
- Auto-updates match's `last_message_at` timestamp
- Marks messages as read
- Real-time subscription support
- Sets up RLS policies

---

#### Migration 004: Storage Buckets
```bash
# Copy contents of: 004_create_storage_buckets.sql
# Paste into SQL Editor
# Click "Run"
```
**What it does:**
- Creates `profile-photos` storage bucket
- 5MB file size limit
- Allows JPEG, PNG, WebP formats
- Public read access (anyone can view photos)
- Users can only upload/delete their own photos

**Alternative:** Create bucket manually in Supabase Dashboard:
- Go to Storage > New Bucket
- Name: `profile-photos`
- Public: ✅ Yes
- File size limit: 5MB
- Allowed MIME types: `image/jpeg, image/jpg, image/png, image/webp`

---

## Verification

After running all migrations, verify in Supabase:

### Check Tables
```sql
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public'
AND table_name IN ('profiles', 'likes', 'matches', 'passes', 'messages');
```

### Check Profile Columns
```sql
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'profiles' 
ORDER BY ordinal_position;
```

### Check Storage Bucket
```sql
SELECT * FROM storage.buckets WHERE id = 'profile-photos';
```

---

## Rollback (if needed)

If something goes wrong, you can rollback:

```sql
-- Drop new tables (in reverse order)
DROP TABLE IF EXISTS public.messages CASCADE;
DROP TABLE IF EXISTS public.passes CASCADE;
DROP TABLE IF EXISTS public.matches CASCADE;
DROP TABLE IF EXISTS public.likes CASCADE;

-- Remove new columns from profiles (example)
ALTER TABLE public.profiles 
  DROP COLUMN IF EXISTS profile_complete,
  DROP COLUMN IF EXISTS photos,
  -- ... etc
```

---

## Next Steps

After running migrations:
1. ✅ Test creating a profile with photos
2. ✅ Test liking another profile
3. ✅ Test matching (mutual like)
4. ✅ Test sending messages
5. ✅ Verify RLS policies work correctly

---

## Support

If you encounter errors:
1. Check Supabase logs in Dashboard
2. Verify you're using the correct project
3. Ensure you have proper database permissions
4. Check for existing tables/columns that might conflict

