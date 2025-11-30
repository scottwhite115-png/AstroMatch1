# 🎯 Phase 1: Database Migration - Quick Start

## ✅ What's Ready

All 5 migration files are ready to run:

1. ✅ `001_create_profiles.sql` - Base profiles table
2. ✅ `002_auth_triggers.sql` - Auto-create profiles on signup
3. ✅ `003_location_rpc.sql` - Location search functions
4. ✅ `004_enhance_profiles_schema.sql` - All profile fields
5. ✅ `005_update_profile_completion_no_bio.sql` - Bio made optional

---

## 🚀 Quick Start (5 Minutes)

### **Step 1: Open Supabase Dashboard**
Go to: https://app.supabase.com
- Select your AstroMatch project
- Click "SQL Editor" in the left sidebar

### **Step 2: Run Migrations in Order**

For each file (001 → 002 → 003 → 004 → 005):

1. Open the file in VS Code
2. Copy **ALL contents** (Cmd+A, Cmd+C)
3. In Supabase SQL Editor, click "+ New Query"
4. Paste the contents (Cmd+V)
5. Click **"Run"** button (bottom right)
6. ✅ Wait for "Success" message
7. Move to next file

---

## ⚡ Expected Results

### **After 001_create_profiles.sql:**
✅ "Success. No rows returned"

### **After 002_auth_triggers.sql:**
✅ "Success. No rows returned"

### **After 003_location_rpc.sql:**
✅ "Success. No rows returned"

### **After 004_enhance_profiles_schema.sql:**
✅ You'll see:
```
NOTICE: Migration 004_enhance_profiles_schema.sql completed successfully!
NOTICE: Added fields: profile_complete, photos[], bio, occupation, height, religion, etc.
NOTICE: Added indexes for: gender, age, profile_complete, western_sign, chinese_sign
NOTICE: Added triggers for: auto west_east update, auto profile_complete check
```

### **After 005_update_profile_completion_no_bio.sql:**
✅ "Success. No rows returned"

---

## ✅ Verify Everything Works

Run this test query in Supabase SQL Editor:

```sql
-- Check profiles table exists with all columns
SELECT COUNT(*) as column_count
FROM information_schema.columns
WHERE table_name = 'profiles';
```

**Expected:** Should return 30+ (all profile fields)

---

## 🐛 If You Get Errors

### **"relation 'profiles' already exists"**
➡️ You already ran this migration. Skip to next one.

### **"extension 'cube' does not exist"**
➡️ Run first:
```sql
CREATE EXTENSION IF NOT EXISTS cube;
CREATE EXTENSION IF NOT EXISTS earthdistance;
```

### **"permission denied"**
➡️ Make sure you're in Supabase Dashboard SQL Editor (not CLI)

---

## 📱 After Migrations Complete

Your database is now ready for:
- ✅ User signups (auto-creates profile)
- ✅ Profile completion tracking
- ✅ Location-based matching
- ✅ Advanced search/filtering

**Next:** Test the signup flow in your app!

---

## 🆘 Need Help?

Check the detailed guide: `RUN_MIGRATIONS.md`

Or verify what's running:
```sql
-- See all your tables
SELECT tablename FROM pg_tables WHERE schemaname = 'public';

-- See all your functions
SELECT routine_name FROM information_schema.routines WHERE routine_schema = 'public';
```

---

Ready to start? **Open Supabase Dashboard** and let's run these migrations! 🚀

