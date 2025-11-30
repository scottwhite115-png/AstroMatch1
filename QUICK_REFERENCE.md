# 📌 Quick Reference Card - Phase 1

## 🚀 Run Migrations (5 min)

1. Go to https://app.supabase.com
2. SQL Editor → New Query
3. Copy/paste each file **in order:**
   - `001_create_profiles.sql`
   - `002_auth_triggers.sql`
   - `003_location_rpc.sql`
   - `004_enhance_profiles_schema.sql`
   - `005_update_profile_completion_no_bio.sql`
4. Click "Run" for each
5. ✅ Done!

---

## ✅ Verify It Worked

Run this in Supabase SQL Editor:

```sql
-- Should return 30+
SELECT COUNT(*) FROM information_schema.columns WHERE table_name = 'profiles';
```

---

## 📋 Profile Requirements (6 items)

Users need to complete:
1. Email verification
2. Phone verification  
3. Birthdate
4. 2+ photos
5. Gender, occupation, height
6. City

**Bio is optional!**

---

## 🧪 Test After Migration

1. **Sign up a test user**
   - Profile auto-created ✓
   
2. **Check database:**
   ```sql
   SELECT id, email, profile_complete FROM profiles;
   ```

3. **Navigate to `/onboarding`**
   - Should show completion status

---

## 🗂️ Key Files

| File | Purpose |
|------|---------|
| `QUICK_START.md` | 5-min setup guide |
| `PHASE_1_COMPLETE.md` | Full summary |
| `DATABASE_ARCHITECTURE.md` | Visual diagrams |
| `CHECKLIST.md` | Track progress |

---

## 🔧 Database Functions You Can Use

```sql
-- Check if profile is complete
SELECT check_profile_completion('user-uuid-here');

-- Find nearby profiles (50km radius)
SELECT * FROM profiles_within_radius(40.7128, -74.0060, 50000, 10);

-- Count matches in area
SELECT count_profiles_in_radius(40.7128, -74.0060, 50000);

-- Update last active
SELECT update_last_active('user-uuid-here');
```

---

## 📱 Frontend Integration

```typescript
// Check profile completion
import { checkProfileCompletion } from '@/lib/profileCompletion'
const status = checkProfileCompletion(profile)

// Fetch nearby profiles  
import { fetchMatchableProfiles } from '@/lib/supabase/profileQueries'
const matches = await fetchMatchableProfiles(filters)
```

---

## 🐛 Common Errors

**"relation 'profiles' already exists"**
→ Already ran - skip to next

**"extension 'cube' does not exist"**
→ Run: `CREATE EXTENSION IF NOT EXISTS cube;`

**"permission denied"**
→ Use Supabase Dashboard, not CLI

---

## 📊 What Gets Created

- 1 table (`profiles`)
- 10 functions
- 3 triggers  
- 10 indexes
- 3 RLS policies
- 2 extensions

---

## 🎯 After Migrations

Test these flows:
- [ ] User signup → profile created
- [ ] Email verification → flag synced
- [ ] Phone verification → flag synced  
- [ ] Add birthdate → zodiac calculated
- [ ] Upload 2 photos → requirement met
- [ ] Fill basic info → fields populated
- [ ] Add city → `profile_complete = true`
- [ ] Visit `/onboarding` → see status

---

## 📞 Need Help?

Check logs: Dashboard → Logs → Postgres Logs

Re-read guides:
- `QUICK_START.md` - Simple steps
- `RUN_MIGRATIONS.md` - Detailed
- `DATABASE_ARCHITECTURE.md` - Diagrams

---

**Ready? Open Supabase Dashboard and start with 001! 🚀**
