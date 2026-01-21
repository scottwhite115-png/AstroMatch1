# ✅ Migration Checklist

Use this to track your progress as you run each migration.

---

## 📋 Pre-Flight Check

- [ ] Supabase project created
- [ ] Logged into Supabase Dashboard (https://app.supabase.com)
- [ ] SQL Editor opened
- [ ] Ready to copy/paste SQL files

---

## 🔢 Migration Progress

### Migration 001: Create Profiles Table
- [ ] Opened `001_create_profiles.sql` in VS Code
- [ ] Copied entire file contents
- [ ] Pasted in Supabase SQL Editor
- [ ] Clicked "Run"
- [ ] ✅ Success message received
- **Notes:** _______________________________

---

### Migration 002: Auth Triggers
- [ ] Opened `002_auth_triggers.sql` in VS Code
- [ ] Copied entire file contents
- [ ] Pasted in Supabase SQL Editor
- [ ] Clicked "Run"
- [ ] ✅ Success message received
- **Notes:** _______________________________

---

### Migration 003: Location RPC
- [ ] Opened `003_location_rpc.sql` in VS Code
- [ ] Copied entire file contents
- [ ] Pasted in Supabase SQL Editor
- [ ] Clicked "Run"
- [ ] ✅ Success message received
- **Notes:** _______________________________

---

### Migration 004: Enhanced Profile Schema
- [ ] Opened `004_enhance_profiles_schema.sql` in VS Code
- [ ] Copied entire file contents
- [ ] Pasted in Supabase SQL Editor
- [ ] Clicked "Run"
- [ ] ✅ Success message received with NOTICE
- **Expected:** "Migration 004_enhance_profiles_schema.sql completed successfully!"
- **Notes:** _______________________________

---

### Migration 005: Update Profile Completion
- [ ] Opened `005_update_profile_completion_no_bio.sql` in VS Code
- [ ] Copied entire file contents
- [ ] Pasted in Supabase SQL Editor
- [ ] Clicked "Run"
- [ ] ✅ Success message received
- **Notes:** _______________________________

---

## ✅ Post-Migration Verification

Run these verification queries in Supabase SQL Editor:

### 1. Check profiles table columns
```sql
SELECT COUNT(*) as total_columns
FROM information_schema.columns
WHERE table_name = 'profiles';
```
- [ ] Ran query
- **Result:** _____ columns (should be 30+)

---

### 2. Check RLS is enabled
```sql
SELECT tablename, rowsecurity
FROM pg_tables
WHERE schemaname = 'public' AND tablename = 'profiles';
```
- [ ] Ran query
- **Result:** `rowsecurity` = true ✅

---

### 3. Check indexes created
```sql
SELECT COUNT(*) as total_indexes
FROM pg_indexes
WHERE tablename = 'profiles';
```
- [ ] Ran query
- **Result:** _____ indexes (should be 8+)

---

### 4. Test profile completion function
```sql
-- This should NOT error, even with fake UUID
SELECT public.check_profile_completion('00000000-0000-0000-0000-000000000000');
```
- [ ] Ran query
- **Result:** Returns false (or error if UUID doesn't exist - that's OK)

---

### 5. Test location RPC function
```sql
SELECT public.profiles_within_radius(
  40.7128,  -- NYC lat
  -74.0060, -- NYC lon
  50000,    -- 50km
  10        -- limit 10
);
```
- [ ] Ran query
- **Result:** Returns empty array or profiles ✅

---

## 🎉 All Done!

- [ ] All 5 migrations completed successfully
- [ ] All 5 verification queries ran without errors
- [ ] Database schema is production-ready

---

## 📝 Notes / Issues

Write any problems or questions here:

________________________________________________

________________________________________________

________________________________________________

________________________________________________

---

## 🚀 What's Next?

After completing all migrations:

1. **Test Signup Flow**
   - Try creating a new user account
   - Check if profile is auto-created in database

2. **Test Profile Completion**
   - Navigate to `/onboarding` in your app
   - Verify it shows missing fields correctly

3. **Move to Phase 2**
   - Frontend integration
   - Profile builder UI
   - Upload system for photos

---

**Date Completed:** _____________

**Time Taken:** _____________

**Ready for Phase 2?** ✅

