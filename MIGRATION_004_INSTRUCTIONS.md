# 🚀 Migration 004: Database Schema Enhancement

## Overview
This migration adds all required fields to the `profiles` table to prepare AstroMatch for production launch.

---

## 📋 What This Migration Does

### **1. Profile Completion & Status**
- `profile_complete` - Boolean flag (auto-calculated)
- `profile_approved` - Manual review system (optional)
- `account_active` - User can deactivate temporarily

### **2. Basic Info**
- `age` - Calculated from birthdate
- `birthdate` - Required for zodiac calculation
- `western_sign` - Sun sign (Aries, Taurus, etc.)
- `chinese_sign` - Chinese zodiac (Rat, Dragon, etc.)
- `gender` - User's gender identity
- `bio` - About me text (min 50 chars)
- `occupation` - Job title

### **3. Photos**
- `photos` - Array of photo URLs (min 2 required)

### **4. Additional Profile Fields**
- `height` - e.g., "5'9\"" or "175 cm"
- `religion` - Religious affiliation
- `children_preference` - e.g., "Want children", "Don't want"

### **5. Search Preferences**
- `looking_for_gender` - "Men", "Women", or "Everyone"
- `age_min` - Minimum age preference (default: 18)
- `age_max` - Maximum age preference (default: 99)
- `distance_radius` - Max distance in km (default: 50)

### **6. Privacy Settings**
- `show_gender` - Display gender on profile
- `show_distance` - Display distance to other users
- `incognito_mode` - Hide from matches

### **7. Additional Data**
- `city` - User's city
- `interests` - Array of interest tags
- `relationship_goals` - Array of relationship goal tags
- `prompts` - JSONB array of {question, answer} objects

### **8. Performance Indexes**
- Indexes on: gender, age, profile_complete, western_sign, chinese_sign
- Composite index on: account_active + profile_complete

### **9. Auto-Triggers**
- Auto-update `west_east` when western/chinese signs change
- Auto-update `profile_complete` flag when profile is updated

---

## 🔧 How to Run This Migration

### **Option 1: Supabase Dashboard (Recommended)**

1. Go to your Supabase project: https://app.supabase.com
2. Navigate to **SQL Editor** in the left sidebar
3. Click **New Query**
4. Copy the entire contents of `scripts/supabase/004_enhance_profiles_schema.sql`
5. Paste into the SQL Editor
6. Click **Run** (bottom right)
7. Wait for success message: ✅ "Migration completed successfully!"

### **Option 2: Supabase CLI**

```bash
# Make sure you're in the project root
cd /Users/scottwhite/Documents/GitHub/v0-datingappprofilecopy1-23

# Run the migration
supabase db push --file scripts/supabase/004_enhance_profiles_schema.sql
```

---

## ✅ Verification Steps

After running the migration, verify it worked:

```sql
-- Check new columns exist
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'profiles' 
  AND table_schema = 'public'
ORDER BY column_name;

-- Check indexes were created
SELECT indexname, indexdef 
FROM pg_indexes 
WHERE tablename = 'profiles' 
  AND schemaname = 'public';

-- Check triggers were created
SELECT trigger_name, event_manipulation 
FROM information_schema.triggers 
WHERE event_object_table = 'profiles';

-- Test profile completion function
SELECT public.check_profile_completion('your-user-id-here');
```

---

## 🔒 Row Level Security (RLS) Policies

After migration, you may want to add RLS policies:

```sql
-- Users can read their own profile
CREATE POLICY "Users can view own profile"
  ON public.profiles FOR SELECT
  USING (auth.uid() = id);

-- Users can update their own profile
CREATE POLICY "Users can update own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id);

-- Authenticated users can view complete, active profiles
CREATE POLICY "Users can view other complete profiles"
  ON public.profiles FOR SELECT
  USING (
    auth.role() = 'authenticated' AND
    profile_complete = TRUE AND
    account_active = TRUE AND
    incognito_mode = FALSE
  );
```

---

## 📊 Expected Field Values

### **Gender Options**
- "Man", "Woman", "Non-binary", "Other"

### **Looking For Gender Options**
- "Men", "Women", "Everyone"

### **Children Preference Options**
- "Have children", "Don't have, want someday", "Don't have, don't want", "Don't have, undecided"

### **Religion Options**
- "Spiritual", "Christian", "Muslim", "Hindu", "Buddhist", "Jewish", "Agnostic", "Atheist", "None", "Other"

### **Photos Array**
- Minimum: 2 photos
- Maximum: 6 photos (recommended)
- Format: `['https://storage.supabase.co/...', 'https://...']`

### **Prompts JSONB Format**
```json
[
  {"question": "My ideal Sunday", "answer": "Brunch with friends..."},
  {"question": "I'm looking for", "answer": "Someone who..."}
]
```

---

## 🧪 Testing After Migration

### **1. Create a Test Profile**

```sql
UPDATE public.profiles
SET
  birthdate = '1995-08-15',
  western_sign = 'Leo',
  chinese_sign = 'Pig',
  gender = 'Woman',
  bio = 'This is my test bio that is definitely more than 50 characters long to meet the minimum requirement.',
  occupation = 'Software Engineer',
  height = '5''7"',
  religion = 'Spiritual',
  children_preference = 'Don''t have, want someday',
  photos = ARRAY['https://example.com/photo1.jpg', 'https://example.com/photo2.jpg'],
  city = 'Sydney',
  interests = ARRAY['Yoga', 'Travel', 'Reading'],
  relationship_goals = ARRAY['Long-term relationship', 'Marriage'],
  prompts = '[
    {"question": "My ideal Sunday", "answer": "Brunch and beach walks"},
    {"question": "What makes me unique", "answer": "I can speak three languages"}
  ]'::jsonb,
  looking_for_gender = 'Men',
  age_min = 25,
  age_max = 35,
  distance_radius = 30
WHERE id = 'your-user-id-here';
```

### **2. Verify Profile Completion**

```sql
-- This should return TRUE if all required fields are filled
SELECT public.check_profile_completion('your-user-id-here');

-- Check profile_complete flag was auto-updated
SELECT profile_complete, profile_approved, account_active
FROM public.profiles
WHERE id = 'your-user-id-here';
```

---

## 🚨 Rollback (If Needed)

If something goes wrong, you can rollback:

```sql
-- Remove all new columns
ALTER TABLE public.profiles DROP COLUMN IF EXISTS profile_complete;
ALTER TABLE public.profiles DROP COLUMN IF EXISTS profile_approved;
ALTER TABLE public.profiles DROP COLUMN IF EXISTS account_active;
ALTER TABLE public.profiles DROP COLUMN IF EXISTS age;
ALTER TABLE public.profiles DROP COLUMN IF EXISTS birthdate;
ALTER TABLE public.profiles DROP COLUMN IF EXISTS western_sign;
ALTER TABLE public.profiles DROP COLUMN IF EXISTS chinese_sign;
ALTER TABLE public.profiles DROP COLUMN IF EXISTS gender;
ALTER TABLE public.profiles DROP COLUMN IF EXISTS bio;
ALTER TABLE public.profiles DROP COLUMN IF EXISTS occupation;
ALTER TABLE public.profiles DROP COLUMN IF EXISTS photos;
ALTER TABLE public.profiles DROP COLUMN IF EXISTS height;
ALTER TABLE public.profiles DROP COLUMN IF EXISTS religion;
ALTER TABLE public.profiles DROP COLUMN IF EXISTS children_preference;
ALTER TABLE public.profiles DROP COLUMN IF EXISTS looking_for_gender;
ALTER TABLE public.profiles DROP COLUMN IF EXISTS age_min;
ALTER TABLE public.profiles DROP COLUMN IF EXISTS age_max;
ALTER TABLE public.profiles DROP COLUMN IF EXISTS distance_radius;
ALTER TABLE public.profiles DROP COLUMN IF EXISTS show_gender;
ALTER TABLE public.profiles DROP COLUMN IF EXISTS show_distance;
ALTER TABLE public.profiles DROP COLUMN IF EXISTS incognito_mode;
ALTER TABLE public.profiles DROP COLUMN IF EXISTS city;
ALTER TABLE public.profiles DROP COLUMN IF EXISTS interests;
ALTER TABLE public.profiles DROP COLUMN IF EXISTS relationship_goals;
ALTER TABLE public.profiles DROP COLUMN IF EXISTS prompts;

-- Remove triggers
DROP TRIGGER IF EXISTS on_profile_west_east_update ON public.profiles;
DROP TRIGGER IF EXISTS on_profile_update_complete ON public.profiles;

-- Remove functions
DROP FUNCTION IF EXISTS public.update_west_east();
DROP FUNCTION IF EXISTS public.auto_update_profile_complete();
DROP FUNCTION IF EXISTS public.check_profile_completion(UUID);
```

---

## 📝 Next Steps After Migration

Once this migration is successful:

1. ✅ **Phase 2**: Build Profile Completion System
   - Create `/lib/profileCompletion.ts`
   - Build onboarding wizard
   - Block incomplete profiles from matches

2. ✅ **Phase 3**: Replace Test Profiles with Real Database Queries
   - Update matches page to fetch from Supabase
   - Calculate real-time compatibility scores
   - Filter by preferences

3. ✅ **Phase 4**: Photo Upload System
   - Set up Supabase Storage bucket
   - Implement photo upload in profile settings

---

## 📞 Support

If you encounter any issues:
1. Check Supabase logs in the dashboard
2. Verify you have the correct permissions
3. Make sure you're running this on the correct database (development vs. production)

---

**Ready to proceed?** Run the migration and let me know if you see the success message! 🚀

