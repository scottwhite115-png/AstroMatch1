# Supabase Migration Guide

## 📋 Setup Order

Run these SQL files in your Supabase SQL Editor in this exact order:

### 1. Create Profiles Table
```sql
-- File: scripts/supabase/001_create_profiles.sql
-- Creates profiles table with location support, indexes, and RLS
```

### 2. Setup Auth Triggers
```sql
-- File: scripts/supabase/002_auth_triggers.sql
-- Auto-creates profiles when users sign up
-- Syncs verification status
```

### 3. Add Location RPC Functions
```sql
-- File: scripts/supabase/003_location_rpc.sql
-- Optimized functions for radius queries
-- Count, filter, and rank profiles
```

---

## 🔑 Key Schema Changes

### Old Schema → New Schema

| Old | New | Notes |
|-----|-----|-------|
| `western_sign` + `chinese_sign` | `west_east` | Combined e.g. "Aries-Rat" |
| `latitude` | `lat` | Shorter, cleaner |
| `longitude` | `lon` | Shorter, cleaner |
| `last_active_at` | `last_active` | Simpler naming |
| `full_name` | `display_name` | More appropriate for dating |
| `avatar_url` | `photo_url` | Clearer purpose |

---

## 🚀 Quick Migration Script

Copy/paste this into Supabase SQL Editor:

```sql
-- Run all migrations at once
-- (or run each file separately)

-- Migration 001: Create profiles table
\i scripts/supabase/001_create_profiles.sql

-- Migration 002: Auth triggers
\i scripts/supabase/002_auth_triggers.sql

-- Migration 003: Location RPC
\i scripts/supabase/003_location_rpc.sql
```

---

## ✅ Verification

After running migrations, verify everything works:

### 1. Check Extensions
```sql
SELECT extname FROM pg_extension WHERE extname IN ('cube', 'earthdistance');
-- Should return 2 rows
```

### 2. Check Indexes
```sql
SELECT indexname FROM pg_indexes 
WHERE tablename = 'profiles';
-- Should show idx_profiles_earth and others
```

### 3. Test RPC Function
```sql
SELECT * FROM profiles_within_radius(
  37.7749,   -- San Francisco lat
  -122.4194, -- San Francisco lon
  50000,     -- 50km in meters
  10         -- limit
);
-- Should return nearby profiles (or empty if none)
```

### 4. Test Profile Creation
Sign up a new user and check:
```sql
SELECT * FROM public.profiles WHERE email = 'test@example.com';
-- Should auto-create profile row
```

---

## 🔧 Configuration

### RLS Policies

Current setup:
- ✅ **Read**: Anyone can view profiles
- ✅ **Insert**: Users create their own profile on signup
- ✅ **Update**: Users can only update their own profile
- ✅ **Delete**: Cascades from auth.users deletion

To make profiles more private:
```sql
-- Option: Only authenticated users can read profiles
DROP POLICY "read_public_profiles" ON public.profiles;
CREATE POLICY "read_public_profiles"
ON public.profiles FOR SELECT
USING (auth.role() = 'authenticated');
```

---

## 📊 Performance Tips

### 1. Monitor Index Usage
```sql
SELECT 
  indexname,
  idx_scan,
  idx_tup_read
FROM pg_stat_user_indexes
WHERE tablename = 'profiles'
ORDER BY idx_scan DESC;
```

### 2. Analyze Query Performance
```sql
EXPLAIN ANALYZE
SELECT * FROM profiles_within_radius(37.7749, -122.4194, 50000, 100);
```

### 3. Update Statistics
```sql
ANALYZE public.profiles;
```

---

## 🗄️ Sample Data

For testing, insert sample profiles:

```sql
-- Insert test profile
INSERT INTO public.profiles (
  id,
  display_name,
  west_east,
  lat,
  lon,
  email_verified
) VALUES (
  gen_random_uuid(),
  'Test User',
  'Aries-Rat',
  37.7749,
  -122.4194,
  true
);
```

---

## 🔄 Rollback

If you need to rollback:

```sql
-- Drop all functions
DROP FUNCTION IF EXISTS profiles_within_radius CASCADE;
DROP FUNCTION IF EXISTS count_profiles_in_radius CASCADE;
DROP FUNCTION IF EXISTS active_profiles_within_radius CASCADE;
DROP FUNCTION IF EXISTS update_last_active CASCADE;
DROP FUNCTION IF EXISTS get_zodiac_distribution CASCADE;

-- Drop triggers
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP TRIGGER IF EXISTS on_auth_user_updated ON auth.users;
DROP TRIGGER IF EXISTS trg_profiles_updated_at ON public.profiles;

-- Drop functions
DROP FUNCTION IF EXISTS handle_new_user CASCADE;
DROP FUNCTION IF EXISTS sync_verification_flags CASCADE;
DROP FUNCTION IF EXISTS tg_profiles_updated_at CASCADE;

-- Drop table
DROP TABLE IF EXISTS public.profiles CASCADE;

-- Drop extensions (only if not used elsewhere)
-- DROP EXTENSION IF EXISTS earthdistance CASCADE;
-- DROP EXTENSION IF EXISTS cube CASCADE;
```

---

## 📱 Update Your Code

After migration, update your TypeScript code to use new field names:

```typescript
// OLD
profile.western_sign
profile.chinese_sign
profile.latitude
profile.longitude
profile.last_active_at

// NEW
profile.west_east  // Combined "Aries-Rat"
profile.lat
profile.lon
profile.last_active
```

---

## ✅ Post-Migration Checklist

- [ ] All 3 SQL files executed
- [ ] Extensions verified
- [ ] Indexes created
- [ ] RPC functions working
- [ ] Test user signup creates profile
- [ ] RLS policies active
- [ ] TypeScript types updated
- [ ] API routes updated

---

**🎉 Your database is now optimized and ready for production!**

