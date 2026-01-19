# 🎯 Phase 1: Database Schema Enhancement - COMPLETE

## 📊 Overview

Phase 1 prepares your database for production launch by:
- ✅ Creating a robust profiles table with all necessary fields
- ✅ Setting up automatic profile creation on user signup
- ✅ Implementing location-based matching with PostgreSQL earthdistance
- ✅ Adding profile completion tracking (bio optional)
- ✅ Optimizing with indexes and RLS policies

---

## 📁 Files Created

### **Migration Files** (`scripts/supabase/`)

| File | Purpose | Key Features |
|------|---------|--------------|
| `001_create_profiles.sql` | Base profiles table | Location support, RLS, basic fields |
| `002_auth_triggers.sql` | Auth integration | Auto-create profile on signup |
| `003_location_rpc.sql` | Location queries | Find profiles within radius |
| `004_enhance_profiles_schema.sql` | Full profile schema | 24+ fields, indexes, triggers |
| `005_update_profile_completion_no_bio.sql` | Bio optional | Updated completion checker |

### **Documentation Files** (`scripts/supabase/`)

| File | Purpose |
|------|---------|
| `QUICK_START.md` | 5-minute setup guide |
| `RUN_MIGRATIONS.md` | Detailed migration instructions |
| `CHECKLIST.md` | Track your migration progress |

### **Code Files** (`lib/`)

| File | Purpose |
|------|---------|
| `lib/profileCompletion.ts` | Profile completion checker |
| `lib/supabase/profileQueries.ts` | Database query helpers |

### **UI Files** (`app/`)

| File | Purpose |
|------|---------|
| `app/onboarding/page.tsx` | Onboarding wizard UI |

---

## 🗄️ Database Schema

### **Profiles Table Fields**

#### **Identity & Auth**
- `id` (UUID, primary key)
- `email` (TEXT)
- `phone` (TEXT)
- `email_verified` (BOOLEAN)
- `phone_verified` (BOOLEAN)
- `display_name` (TEXT)

#### **Astrology**
- `birthdate` (DATE)
- `western_sign` (TEXT) - e.g., "Aries"
- `chinese_sign` (TEXT) - e.g., "Rat"
- `west_east` (TEXT) - e.g., "Aries-Rat" (auto-populated)

#### **Basic Profile**
- `age` (INTEGER, 18-120)
- `gender` (TEXT)
- `bio` (TEXT, optional)
- `occupation` (TEXT)
- `height` (TEXT)
- `city` (TEXT)
- `photos` (TEXT[], min 2 required)

#### **Preferences**
- `religion` (TEXT)
- `children_preference` (TEXT)
- `interests` (TEXT[])
- `relationship_goals` (TEXT[])
- `prompts` (JSONB)

#### **Search Settings**
- `looking_for_gender` (TEXT, default "Everyone")
- `age_min` (INTEGER, default 18)
- `age_max` (INTEGER, default 99)
- `distance_radius` (INTEGER, default 50km)

#### **Privacy**
- `show_gender` (BOOLEAN, default true)
- `show_distance` (BOOLEAN, default true)
- `incognito_mode` (BOOLEAN, default false)

#### **Status**
- `profile_complete` (BOOLEAN, auto-updated)
- `profile_approved` (BOOLEAN, default true)
- `account_active` (BOOLEAN, default true)

#### **Location**
- `lat` (DOUBLE PRECISION)
- `lon` (DOUBLE PRECISION)

#### **Metadata**
- `last_active` (TIMESTAMPTZ)
- `created_at` (TIMESTAMPTZ)
- `updated_at` (TIMESTAMPTZ, auto-updated)

---

## 🚀 Database Functions

### **Profile Management**
- `check_profile_completion(profile_id)` - Returns if profile is complete
- `update_west_east()` - Auto-updates zodiac combo
- `auto_update_profile_complete()` - Auto-updates completion flag

### **Auth Integration**
- `handle_new_user()` - Creates profile on signup
- `sync_verification_flags()` - Syncs email/phone verification

### **Location Search**
- `profiles_within_radius(lat, lon, radius_m, limit)` - Find nearby profiles
- `active_profiles_within_radius(lat, lon, radius_m, hours)` - Find active nearby
- `count_profiles_in_radius(lat, lon, radius_m)` - Count matches
- `get_zodiac_distribution(lat, lon, radius_m)` - Zodiac stats

### **User Activity**
- `update_last_active(user_id)` - Update activity timestamp

---

## 🔒 Security (RLS Policies)

### **Profiles Table**
- ✅ **SELECT:** Anyone can read public profiles
- ✅ **INSERT:** Users can create their own profile
- ✅ **UPDATE:** Users can only update their own profile
- ✅ **DELETE:** Cascade on auth.users deletion

### **Function Permissions**
All RPC functions granted to `authenticated` role only.

---

## 📈 Performance Optimizations

### **Indexes Created** (8 total)
1. `idx_profiles_earth` (GiST) - Fast radius queries
2. `idx_profiles_west_east` - Zodiac matching
3. `idx_profiles_last_active` - Activity sorting
4. `idx_profiles_gender` - Gender filtering
5. `idx_profiles_age` - Age filtering
6. `idx_profiles_complete` - Complete profiles only
7. `idx_profiles_active` - Active + complete
8. `idx_profiles_western_sign` - Western zodiac
9. `idx_profiles_chinese_sign` - Chinese zodiac
10. `idx_profiles_looking_for` - Gender preferences

### **Constraints**
- Age: 18-120 years
- Age range: max >= min
- Distance: 1-500 km
- Location: Valid lat/lon ranges

---

## ✅ Profile Completion Requirements

Users need these 6 items to have `profile_complete = true`:

1. ✉️ **Email verified**
2. 📱 **Phone verified**
3. 🎂 **Birthdate** (for zodiac)
4. 📸 **2+ photos**
5. 👤 **Basic info** (gender, occupation, height)
6. 📍 **City**

**Bio is optional!** (as per your request)

---

## 🧪 Testing Checklist

After running migrations:

- [ ] Sign up a new user → Profile auto-created
- [ ] Verify email → `email_verified` = true
- [ ] Verify phone → `phone_verified` = true
- [ ] Add birthdate → `western_sign` + `chinese_sign` auto-calculated
- [ ] Upload 2 photos → `photos` array populated
- [ ] Fill basic info → `gender`, `occupation`, `height` set
- [ ] Add city → `profile_complete` automatically becomes `true`
- [ ] Navigate to `/onboarding` → Shows completion status
- [ ] Test location search → Returns nearby profiles

---

## 📊 Database Stats (Expected)

After migrations:
- **Tables:** 1 (`profiles`)
- **Functions:** 10
- **Triggers:** 3
- **Indexes:** 10
- **RLS Policies:** 3
- **Extensions:** 2 (`cube`, `earthdistance`)

---

## 🔄 Automatic Behaviors

### **On User Signup:**
1. Row created in `auth.users`
2. Trigger fires `handle_new_user()`
3. Profile created in `public.profiles`
4. Email/phone verification synced

### **On Profile Update:**
1. `west_east` auto-calculated from signs
2. `profile_complete` auto-checked
3. `updated_at` timestamp refreshed

### **On Email/Phone Verification:**
1. Flags updated in `auth.users`
2. Trigger fires `sync_verification_flags()`
3. Verification synced to `public.profiles`

---

## 🎯 Next Steps (Phase 2)

Now that database is ready:

1. **Frontend Integration**
   - Connect signup flow to profiles table
   - Build profile builder UI
   - Implement photo upload (Supabase Storage)

2. **Onboarding Flow**
   - Email verification page
   - Phone verification (Telnyx SMS)
   - Profile completion wizard

3. **Matching Engine**
   - Query nearby profiles with `profiles_within_radius()`
   - Filter by preferences (age, gender, distance)
   - Score with zodiac compatibility

4. **Testing**
   - Create test users
   - Verify auto-profile creation
   - Test location search
   - Check profile completion logic

---

## 📝 Migration Commands

To run migrations:

```bash
# Option 1: Supabase Dashboard (Recommended)
# 1. Go to https://app.supabase.com
# 2. SQL Editor → New Query
# 3. Copy/paste each file (001 → 005)
# 4. Click Run

# Option 2: Supabase CLI
supabase db reset --linked  # WARNING: Destroys all data
# Then manually run each migration
```

---

## 🐛 Common Issues & Solutions

### **"relation 'profiles' already exists"**
✅ Already ran - skip to next migration

### **"extension 'cube' does not exist"**
```sql
CREATE EXTENSION IF NOT EXISTS cube;
CREATE EXTENSION IF NOT EXISTS earthdistance;
```

### **"permission denied for schema auth"**
✅ Use Supabase Dashboard, not CLI

### **Trigger not firing**
Check:
```sql
SELECT * FROM pg_trigger WHERE tgname LIKE '%profile%';
```

---

## 📚 Additional Resources

- [Supabase Docs: RLS](https://supabase.com/docs/guides/auth/row-level-security)
- [PostgreSQL: earthdistance](https://www.postgresql.org/docs/current/earthdistance.html)
- [Supabase: Database Functions](https://supabase.com/docs/guides/database/functions)

---

## ✅ Phase 1 Status: READY TO DEPLOY

**Database schema:** ✅ Complete  
**Migrations:** ✅ Ready (5 files)  
**Documentation:** ✅ Complete (3 guides)  
**Code utilities:** ✅ Built  
**Testing plan:** ✅ Documented

---

**🚀 Ready to run migrations? Open `QUICK_START.md` and let's go!**

