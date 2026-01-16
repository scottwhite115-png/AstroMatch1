# Supabase Database Query Map 🗺️

## Overview
This document maps all places where we use **Supabase client for database queries** in AstroMatch. 

**Important**: We're NOT replacing Supabase entirely - just swapping how we query the database:
- `supabase.from('profiles').select()` → `prisma.profiles.findMany()`
- Keep using: `supabase.auth`, `supabase.storage`, `supabase.realtime`

---

## 1. Profile / Account Queries

### `/lib/supabase/profileQueries.ts` ⭐ (Main Profile Module)
**Purpose**: Centralized profile data operations

**Queries:**
1. **`fetchUserProfile()`** - Get current user's full profile
   - `supabase.from('profiles').select('*').eq('id', user.id).single()`
   
2. **`updateUserProfile(updates)`** - Update user profile fields
   - `supabase.from('profiles').update(updates).eq('id', user.id)`
   
3. **`upsertUserProfile(userId, email)`** - Create or update profile on signup
   - `supabase.from('profiles').upsert({ id, email, ... })`
   
4. **`fetchMatchableProfiles(filters)`** - Get profiles for discovery
   - Complex query with filters for gender, age, distance, etc.
   
5. **`checkRadiusFunction()`** - Test if RPC function exists
   - `supabase.rpc('profiles_within_radius', ...)`

**Migration Priority**: 🟢 **HIGH - SAFE** (Well-structured, read-heavy)

---

### `/lib/profiles.ts` (Simple Profile Helpers)
**Purpose**: Quick profile CRUD operations

**Queries:**
1. **`getProfile(userId)`** - Fetch single profile
   - `supabase.from("profiles").select("*").eq("id", userId).single()`
   
2. **`updateProfile(userId, updates)`** - Update profile
   - `supabase.from("profiles").update(updates).eq("id", userId)`
   
3. **`checkOnboardingNeeded()`** - Check if user needs onboarding
   - `supabase.from("profiles").select("onboarding_needed").eq("id", user.id).single()`

**Migration Priority**: 🟢 **HIGH - SAFE** (Simple, well-defined)

---

### `/lib/hooks/use-profile.ts` (React Hook)
**Purpose**: Client-side profile management hook

**Queries:**
1. **`fetchProfile()`** - Load profile data
   - `supabase.from("profiles").select("*").eq("id", targetUserId).single()`
   
2. **`updateProfile(updates)`** - Update with optimistic UI
   - `supabase.from("profiles").upsert({ id: user.id, ...updates })`
   
3. **Refresh after update** - Refetch after save
   - `supabase.from("profiles").select("*").eq("id", user.id).single()`

**Migration Priority**: 🟡 **MEDIUM** (Client-side hook, needs testing)

---

### `/lib/hooks/use-auth.ts` (Auth Hook)
**Purpose**: Authentication state management

**Queries:**
1. **Profile fetch for auth state**
   - `supabase.from("profiles").select("*").eq("id", user.id).single()`

**Migration Priority**: 🟡 **MEDIUM** (Critical for auth, needs careful testing)

---

### `/lib/guards.ts` (Route Guards)
**Purpose**: Check user permissions/status before page access

**Queries:**
1. **`requireLocation()`** - Check if user has location set
   - `supabase.from("profiles").select("lat, lon").eq("id", user.id).single()`
   
2. **`requireZodiac()`** - Check if user has astrology data
   - `supabase.from("profiles").select("west_east").eq("id", user.id).single()`
   
3. **`requireOnboarded()`** - Check if onboarding complete
   - `supabase.from("profiles").select("onboarding_needed").eq("id", user.id).single()`

**Migration Priority**: 🟢 **HIGH - SAFE** (Simple reads, easy to test)

---

### `/lib/routeAfterAuth.ts` (Routing Logic)
**Purpose**: Determine where to send user after login

**Queries:**
1. **Check onboarding status**
   - `supabase.from("profiles").select("onboarding_needed").eq("id", user.id).single()`

**Migration Priority**: 🟢 **HIGH - SAFE** (Simple read)

---

### `/lib/location.ts` (Location Updates)
**Purpose**: Update user location

**Queries:**
1. **`updateLocation(userId, lat, lon)`**
   - `supabase.from("profiles").update({ lat, lon, last_active }).eq("id", user.id)`

**Migration Priority**: 🟢 **HIGH - SAFE** (Simple update)

---

### `/components/AccountSettings.tsx`
**Purpose**: Account settings UI component

**Queries:**
1. **Update auth provider info**
   - `supabase.from('profiles').update({ auth_provider, email }).eq('id', data.id)`

**Migration Priority**: 🟡 **MEDIUM** (Component code, needs UI testing)

---

### `/app/auth/callback/route.ts` ✅ **ALREADY MIGRATED**
**Purpose**: Email verification callback

**Queries:**
1. **Mark email as verified** - ✅ Now uses Prisma!
   - ~~`supabase.from("profiles").update({ email_verified: true }).eq("id", user.id)`~~
   - `prisma.profiles.update({ where: { id: user.id }, data: { email_verified: true } })`

---

## 2. Discover / Swipe / Matches

### `/app/api/matches/route.ts`
**Purpose**: Get potential matches by age range

**Queries:**
1. **`matches_by_age_range` RPC function**
   - `supabase.rpc("matches_by_age_range", { viewer: user_id })`

**Migration Priority**: 🔴 **LOW** (RPC function - keep as-is, Prisma doesn't support custom RPCs well)

---

## 3. Connections / Likes / Messaging

### `/lib/match/recordLike.ts`
**Purpose**: Handle likes and match creation

**Queries:**
1. **Record a like**
   - `supabase.from("likes").insert({ from_user_id, to_user_id })`
   
2. **Check for reciprocal like**
   - `supabase.from("likes").select("id").eq("from_user_id", toUserId).eq("to_user_id", fromUserId)`
   
3. **Check existing conversation**
   - `supabase.from("conversations").select("id").or(...)` 
   
4. **Create conversation**
   - `supabase.from("conversations").insert({ user1_id, user2_id })`
   
5. **Create match notifications**
   - `supabase.from("notifications").insert([...])`
   
6. **`checkMutualLike()`** - Verify mutual interest
   - Two queries checking likes in both directions
   
7. **`getConversationId()`** - Find existing conversation
   - `supabase.from("conversations").select("id").or(...)`

**Migration Priority**: 🟡 **MEDIUM** (Transaction-like logic, migrate carefully)

---

### `/app/messages/page.tsx`
**Purpose**: Messages/conversations page

**Queries:**
1. **Mark conversation as seen**
   - `supabase.from('conversations').update({ is_new_match: false }).eq('id', chat.id)`

**Migration Priority**: 🟢 **HIGH - SAFE** (Simple update)

---

### `/app/api/preferences/age/route.ts`
**Purpose**: Update age preferences

**Queries:**
1. **Upsert age preferences**
   - `supabase.from("preferences").upsert({ user_id, age_min, age_max })`

**Migration Priority**: 🟢 **HIGH - SAFE** (Simple upsert)

---

## 4. Location Queries

### `/lib/supabase/location-queries.ts`
**Purpose**: Location-based profile discovery

**Queries:**
1. **`fetchProfilesInRadius()`** - RPC for radius search
   - `supabase.rpc("profiles_within_radius", { lat, lon, radius_m })`
   
2. **`fetchProfilesInBoundingBox()`** - Geographic bounding box
   - `supabase.from("profiles").select("*").gte("latitude", ...).lte(...)`
   
3. **`fetchMatchableProfiles()`** - Get matchable profiles
   - `supabase.from("matchable_profiles").select("*")`
   
4. **`batchFetchWithDistance()`** - RPC for distance calculation
   - `supabase.rpc("calculate_profile_distances", ...)`
   
5. **`updateLastActive()`** - Update user activity
   - `supabase.from("profiles").update({ last_active_at }).eq("id", userId)`
   
6. **`getNearbyCount()`** - Count profiles in radius
   - `supabase.rpc("count_profiles_in_radius", ...)`

**Migration Priority**: 🔴 **LOW** (Heavy RPC usage - keep as-is for now)

---

## Migration Priority Summary

### 🟢 **Safest to Migrate First (Phase 1)**

1. ✅ `/app/auth/callback/route.ts` - **DONE!**
2. `/lib/profiles.ts` - Simple CRUD helpers
3. `/lib/guards.ts` - Simple profile field checks
4. `/lib/routeAfterAuth.ts` - Single onboarding check
5. `/lib/location.ts` - Simple location update
6. `/app/messages/page.tsx` - Mark conversation as seen
7. `/app/api/preferences/age/route.ts` - Age preference upsert

**Why safe?** Single-table, simple queries, easy to verify

---

### 🟡 **Medium Priority (Phase 2)**

1. `/lib/supabase/profileQueries.ts` - Main profile module
2. `/lib/hooks/use-profile.ts` - Client-side hook
3. `/lib/hooks/use-auth.ts` - Auth hook
4. `/lib/match/recordLike.ts` - Like recording logic
5. `/components/AccountSettings.tsx` - Settings component

**Why medium?** More complex, client-side code, needs careful testing

---

### 🔴 **Keep as Supabase (Don't Migrate)**

1. `/app/api/matches/route.ts` - Uses RPC `matches_by_age_range`
2. `/lib/supabase/location-queries.ts` - Heavy RPC usage (radius searches, distance calculations)

**Why keep?** Uses Postgres RPC functions that Prisma doesn't handle well

---

## Recommended Next Steps

### Phase 1: Simple Migrations (Start Here)

1. Migrate `/lib/profiles.ts` (5 simple functions)
2. Migrate `/lib/guards.ts` (3 guard functions)
3. Migrate `/lib/routeAfterAuth.ts` (1 function)
4. Migrate `/lib/location.ts` (1 function)

### Phase 2: After Phase 1 Works

1. Add more tables to `prisma/schema.prisma` (likes, conversations, preferences, notifications)
2. Run `npx prisma generate`
3. Migrate `/lib/match/recordLike.ts`
4. Migrate `/lib/supabase/profileQueries.ts`

### Keep Using Supabase For:
- All `supabase.auth.*` calls
- All `supabase.storage.*` calls
- All `supabase.rpc(...)` calls
- Realtime subscriptions
- Row Level Security policies

---

## Quick Reference

### What Changes:
```typescript
// Database queries
supabase.from('profiles').select() → prisma.profiles.findMany()
supabase.from('likes').insert()    → prisma.likes.create()
supabase.from('profiles').update() → prisma.profiles.update()
```

### What Stays:
```typescript
// These stay exactly as they are
supabase.auth.getUser()           ← Keep
supabase.auth.signIn()            ← Keep
supabase.storage.upload()         ← Keep
supabase.rpc('custom_function')   ← Keep
```

---

**Total Database Queries Found**: ~30-35 queries across the app  
**Already Migrated**: 1  
**Safe to Migrate Next**: 7-10 queries  
**Should Stay Supabase**: ~5-7 RPC queries

