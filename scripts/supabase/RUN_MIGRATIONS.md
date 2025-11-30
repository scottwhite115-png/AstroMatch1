# 🚀 Database Migration Guide - Phase 1

This guide will help you set up your Supabase database for AstroMatch production launch.

---

## 📋 Prerequisites

Before running migrations:
- ✅ Supabase project created
- ✅ Access to Supabase Dashboard (https://app.supabase.com)
- ✅ Project URL and anon/service keys configured in `.env.local`

---

## 🔢 Migration Order

Run these SQL files **in exact order** in the Supabase SQL Editor:

### **Step 1: Create Base Profiles Table**
📄 File: `001_create_profiles.sql`

**What it does:**
- Creates the main `profiles` table
- Adds location support (lat/lon with earthdistance)
- Sets up RLS policies
- Creates indexes for performance

**Run in:** Supabase Dashboard → SQL Editor → New Query
- Copy/paste the entire file contents
- Click "Run"
- ✅ Should see: "Success. No rows returned"

---

### **Step 2: Auth Triggers**
📄 File: `002_auth_triggers.sql`

**What it does:**
- Auto-creates profile when user signs up
- Syncs email from auth.users to profiles
- Handles user deletion cascade

**Run in:** Supabase Dashboard → SQL Editor → New Query
- Copy/paste the entire file contents
- Click "Run"
- ✅ Should see trigger creation confirmations

---

### **Step 3: Location RPC Functions**
📄 File: `003_location_rpc.sql`

**What it does:**
- Creates `profiles_within_radius()` function for nearby matches
- Uses PostgreSQL earthdistance extension
- Returns profiles sorted by distance

**Run in:** Supabase Dashboard → SQL Editor → New Query
- Copy/paste the entire file contents
- Click "Run"
- ✅ Should see function creation confirmation

---

### **Step 4: Enhanced Profile Schema**
📄 File: `004_enhance_profiles_schema.sql`

**What it does:**
- Adds 24+ new profile fields (age, gender, bio, photos, etc.)
- Creates indexes for search performance
- Adds profile completion checker
- Sets up auto-update triggers

**Run in:** Supabase Dashboard → SQL Editor → New Query
- Copy/paste the entire file contents
- Click "Run"
- ✅ Should see: "Migration 004_enhance_profiles_schema.sql completed successfully!"

---

### **Step 5: Update Profile Completion (No Bio Required)**
📄 File: `005_update_profile_completion_no_bio.sql`

**What it does:**
- Updates profile completion logic
- Removes bio as required field (now optional)

**Run in:** Supabase Dashboard → SQL Editor → New Query
- Copy/paste the entire file contents
- Click "Run"
- ✅ Should see function update confirmation

---

## ✅ Verification

After running all migrations, verify with these queries:

### **1. Check profiles table structure:**
```sql
SELECT column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_name = 'profiles'
ORDER BY ordinal_position;
```

**Expected:** Should see all columns including `profile_complete`, `photos`, `age`, `gender`, etc.

---

### **2. Test profile completion function:**
```sql
-- Replace 'YOUR_USER_ID' with an actual user ID
SELECT public.check_profile_completion('YOUR_USER_ID');
```

**Expected:** Returns `true` or `false`

---

### **3. Check indexes:**
```sql
SELECT indexname, indexdef
FROM pg_indexes
WHERE tablename = 'profiles';
```

**Expected:** Should see 8+ indexes including `idx_profiles_gender`, `idx_profiles_age`, etc.

---

### **4. Test RPC function:**
```sql
SELECT public.profiles_within_radius(
  40.7128,  -- NYC latitude
  -74.0060, -- NYC longitude
  50000,    -- 50km radius in meters
  10        -- limit to 10 results
);
```

**Expected:** Returns nearby profiles (may be empty if no test data)

---

## 🔒 RLS Policy Check

Verify Row Level Security is enabled:

```sql
SELECT tablename, rowsecurity
FROM pg_tables
WHERE schemaname = 'public' AND tablename = 'profiles';
```

**Expected:** `rowsecurity` should be `true`

Check policies:

```sql
SELECT policyname, cmd, qual
FROM pg_policies
WHERE tablename = 'profiles';
```

**Expected:** Should see policies for `SELECT`, `INSERT`, `UPDATE`

---

## 🐛 Troubleshooting

### **Error: "relation 'profiles' already exists"**
**Solution:** Table already created. Skip to next migration.

### **Error: "extension 'cube' does not exist"**
**Solution:** Run:
```sql
CREATE EXTENSION IF NOT EXISTS cube;
CREATE EXTENSION IF NOT EXISTS earthdistance;
```

### **Error: "function already exists"**
**Solution:** Use `CREATE OR REPLACE FUNCTION` (already in migration files)

### **Error: "permission denied"**
**Solution:** Make sure you're using the Supabase Dashboard SQL Editor with admin privileges

---

## 📊 Optional: Add Test Data

After migrations, add a test user:

```sql
-- Insert test profile (replace with real auth.users ID)
INSERT INTO public.profiles (
  id,
  display_name,
  email,
  email_verified,
  phone_verified,
  birthdate,
  western_sign,
  chinese_sign,
  west_east,
  gender,
  age,
  bio,
  occupation,
  height,
  city,
  lat,
  lon,
  photos,
  profile_complete,
  account_active
) VALUES (
  'YOUR_AUTH_USER_ID_HERE',
  'Test User',
  'test@example.com',
  true,
  true,
  '1990-01-15',
  'Capricorn',
  'Snake',
  'Capricorn-Snake',
  'Woman',
  34,
  'Test bio for AstroMatch',
  'Software Engineer',
  '5''7"',
  'San Francisco',
  37.7749,
  -122.4194,
  ARRAY['https://example.com/photo1.jpg', 'https://example.com/photo2.jpg'],
  true,
  true
);
```

---

## 🎯 Next Steps After Migration

Once all migrations are complete:

1. ✅ **Update your `.env.local`** with Supabase credentials
2. ✅ **Test sign-up flow** - verify profile auto-creation
3. ✅ **Test profile completion** - onboarding wizard should work
4. ✅ **Test location search** - nearby profiles should load
5. ✅ **Move to Phase 2** - Profile completion UI integration

---

## 📝 Migration Log

Keep track of what you've run:

- [ ] 001_create_profiles.sql
- [ ] 002_auth_triggers.sql
- [ ] 003_location_rpc.sql
- [ ] 004_enhance_profiles_schema.sql
- [ ] 005_update_profile_completion_no_bio.sql

---

## 🆘 Need Help?

- Check Supabase logs: Dashboard → Logs → Postgres Logs
- Test queries in SQL Editor before running migrations
- Always backup your database before major changes
- Keep a record of which migrations have been applied

---

**Ready to begin?** Start with `001_create_profiles.sql` in the Supabase SQL Editor! 🚀

