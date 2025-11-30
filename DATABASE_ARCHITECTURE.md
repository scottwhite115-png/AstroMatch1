# 🗺️ AstroMatch Database Architecture

## System Flow Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                        USER SIGNUP FLOW                          │
└─────────────────────────────────────────────────────────────────┘

User Signs Up (Email/Google/Apple)
           ↓
    [auth.users] table
           ↓
    TRIGGER: handle_new_user()
           ↓
    Auto-creates row in [public.profiles]
           ↓
    User sees /onboarding page
           ↓
    Completes profile step by step
           ↓
    TRIGGER: auto_update_profile_complete()
           ↓
    profile_complete = true
           ↓
    Redirect to /matches


┌─────────────────────────────────────────────────────────────────┐
│                      PROFILE COMPLETION                          │
└─────────────────────────────────────────────────────────────────┘

                  [lib/profileCompletion.ts]
                           ↓
        checkProfileCompletion(profile)
                           ↓
            ┌──────────────┴──────────────┐
            │   Checks 6 Requirements:    │
            │  1. Email verified          │
            │  2. Phone verified          │
            │  3. Birthdate set           │
            │  4. 2+ photos uploaded      │
            │  5. Basic info filled       │
            │  6. City added              │
            └──────────────┬──────────────┘
                           ↓
        Returns: { isComplete, percentage, missingFields }
                           ↓
                [app/onboarding/page.tsx]
                           ↓
              Shows progress bar + missing items


┌─────────────────────────────────────────────────────────────────┐
│                    LOCATION-BASED MATCHING                       │
└─────────────────────────────────────────────────────────────────┘

User opens /matches page
           ↓
    Gets user's location (lat, lon)
           ↓
    Calls profiles_within_radius(lat, lon, 50km, 100)
           ↓
    PostgreSQL earthdistance calculates distances
           ↓
    Returns profiles sorted by distance
           ↓
    [lib/matchEngine.ts] scores each profile
           ↓
    Ranks: Soulmate → Twin Flame → Excellent → Good...
           ↓
    Displays profiles in swipe UI


┌─────────────────────────────────────────────────────────────────┐
│                      DATABASE STRUCTURE                          │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────┐
│    auth.users       │  (Supabase managed)
│  - id (UUID)        │
│  - email            │
│  - phone            │
│  - email_confirmed  │
│  - phone_confirmed  │
└──────────┬──────────┘
           │ ON DELETE CASCADE
           │ TRIGGERS: handle_new_user, sync_verification_flags
           ↓
┌─────────────────────────────────────────────────────────────────┐
│                     public.profiles                              │
├─────────────────────────────────────────────────────────────────┤
│ Identity & Auth                                                  │
│  • id (UUID) ← PK, FK to auth.users                             │
│  • email, phone                                                  │
│  • email_verified, phone_verified                               │
│  • display_name                                                  │
├─────────────────────────────────────────────────────────────────┤
│ Astrology                                                        │
│  • birthdate (DATE)                                              │
│  • western_sign (TEXT) ← "Aries", "Taurus"...                   │
│  • chinese_sign (TEXT) ← "Rat", "Ox"...                         │
│  • west_east (TEXT) ← Auto-calculated "Aries-Rat"               │
├─────────────────────────────────────────────────────────────────┤
│ Basic Profile                                                    │
│  • age (INT) ← 18-120                                            │
│  • gender (TEXT)                                                 │
│  • bio (TEXT) ← OPTIONAL                                         │
│  • occupation (TEXT)                                             │
│  • height (TEXT)                                                 │
│  • city (TEXT)                                                   │
│  • photos (TEXT[]) ← Min 2 required                              │
├─────────────────────────────────────────────────────────────────┤
│ Preferences                                                      │
│  • religion, children_preference                                 │
│  • interests (TEXT[])                                            │
│  • relationship_goals (TEXT[])                                   │
│  • prompts (JSONB)                                               │
├─────────────────────────────────────────────────────────────────┤
│ Search Settings                                                  │
│  • looking_for_gender ← "Men", "Women", "Everyone"              │
│  • age_min, age_max ← 18-99                                      │
│  • distance_radius ← km, default 50                              │
├─────────────────────────────────────────────────────────────────┤
│ Privacy                                                          │
│  • show_gender, show_distance                                    │
│  • incognito_mode                                                │
├─────────────────────────────────────────────────────────────────┤
│ Status                                                           │
│  • profile_complete ← Auto-updated by trigger                    │
│  • profile_approved ← Manual review (optional)                   │
│  • account_active ← User can deactivate                          │
├─────────────────────────────────────────────────────────────────┤
│ Location                                                         │
│  • lat, lon (DOUBLE PRECISION)                                   │
│  • Indexed with earthdistance (GiST)                             │
├─────────────────────────────────────────────────────────────────┤
│ Metadata                                                         │
│  • last_active (TIMESTAMPTZ)                                     │
│  • created_at, updated_at                                        │
└─────────────────────────────────────────────────────────────────┘

INDEXES:
  • idx_profiles_earth (GiST) ← Fast radius queries
  • idx_profiles_west_east ← Zodiac matching
  • idx_profiles_gender ← Gender filtering
  • idx_profiles_age ← Age filtering
  • idx_profiles_complete ← Complete profiles
  • idx_profiles_active ← Active + complete
  • + 4 more for performance


┌─────────────────────────────────────────────────────────────────┐
│                    DATABASE FUNCTIONS (RPC)                      │
└─────────────────────────────────────────────────────────────────┘

PROFILE MANAGEMENT:
  check_profile_completion(profile_id) → BOOLEAN
  update_west_east() → Trigger function
  auto_update_profile_complete() → Trigger function

AUTH INTEGRATION:
  handle_new_user() → Trigger on auth.users INSERT
  sync_verification_flags() → Trigger on auth.users UPDATE

LOCATION SEARCH:
  profiles_within_radius(lat, lon, radius_m, limit) → TABLE
  active_profiles_within_radius(lat, lon, radius_m, hours) → TABLE
  count_profiles_in_radius(lat, lon, radius_m) → INTEGER
  get_zodiac_distribution(lat, lon, radius_m) → TABLE

USER ACTIVITY:
  update_last_active(user_id) → VOID


┌─────────────────────────────────────────────────────────────────┐
│                    ROW LEVEL SECURITY (RLS)                      │
└─────────────────────────────────────────────────────────────────┘

┌────────────────────┐
│ read_public_profiles│  SELECT: Anyone can read profiles
└────────────────────┘

┌────────────────────┐
│ insert_own_profile │  INSERT: auth.uid() = id
└────────────────────┘

┌────────────────────┐
│ update_own_profile │  UPDATE: auth.uid() = id
└────────────────────┘


┌─────────────────────────────────────────────────────────────────┐
│                       CODE INTEGRATION                           │
└─────────────────────────────────────────────────────────────────┘

FRONTEND:
  app/onboarding/page.tsx
         ↓ uses
  lib/profileCompletion.ts (checkProfileCompletion)
         ↓ queries
  lib/supabase/profileQueries.ts (fetchUserProfile)
         ↓ calls
  Supabase Client
         ↓ executes
  Database RPC: check_profile_completion()

MATCHES PAGE:
  app/matches/page.tsx
         ↓ uses
  lib/supabase/profileQueries.ts (fetchMatchableProfiles)
         ↓ calls
  Supabase Client
         ↓ executes
  Database RPC: profiles_within_radius()
         ↓ returns
  Array of nearby profiles
         ↓ scored by
  lib/matchEngine.ts (calculateCompatibility)
         ↓ displays
  Swipe cards with match rankings


┌─────────────────────────────────────────────────────────────────┐
│                      MIGRATION SEQUENCE                          │
└─────────────────────────────────────────────────────────────────┘

001_create_profiles.sql
  ↓ Creates base table
  ↓ Adds location support
  ↓ Sets up RLS
  ↓
002_auth_triggers.sql
  ↓ Connects auth.users → profiles
  ↓ Auto-create on signup
  ↓
003_location_rpc.sql
  ↓ Adds radius search functions
  ↓ Zodiac distribution
  ↓
004_enhance_profiles_schema.sql
  ↓ Adds 24+ profile fields
  ↓ Creates completion checker
  ↓ Adds indexes
  ↓
005_update_profile_completion_no_bio.sql
  ↓ Makes bio optional
  ✓ READY FOR PRODUCTION


┌─────────────────────────────────────────────────────────────────┐
│                    TYPICAL USER JOURNEY                          │
└─────────────────────────────────────────────────────────────────┘

Day 1:
  1. User signs up → Profile auto-created (incomplete)
  2. Redirected to /onboarding
  3. Verifies email → email_verified = true
  4. Verifies phone → phone_verified = true
  5. Enters birthdate → western_sign + chinese_sign calculated
  6. Uploads 2 photos → photos[] populated
  7. Fills basic info → gender, occupation, height
  8. Adds city → profile_complete = true ✓
  9. Redirected to /matches

Day 2+:
  1. Opens /matches
  2. App queries profiles_within_radius(user.lat, user.lon, 50km)
  3. Match engine scores each profile (60% Eastern, 40% Western)
  4. Profiles displayed as swipe cards
  5. User swipes → likes/passes stored
  6. Mutual like → Match! → /messages

Ongoing:
  • last_active updated on app usage
  • Can update profile anytime
  • profile_complete stays true as long as requirements met
  • Incognito mode hides from search results


┌─────────────────────────────────────────────────────────────────┐
│                    PERFORMANCE NOTES                             │
└─────────────────────────────────────────────────────────────────┘

✅ GiST index on location → O(log n) radius queries
✅ B-tree indexes on filters → Fast WHERE clauses
✅ Triggers auto-update → No manual sync needed
✅ RLS at database level → Security built-in
✅ RPC functions → Business logic in database (faster)

Typical query performance:
  • profiles_within_radius(50km): ~10-50ms for 10k users
  • check_profile_completion(): <1ms
  • Zodiac matching with indexes: ~5ms per profile


┌─────────────────────────────────────────────────────────────────┐
│                    SCALABILITY PLAN                              │
└─────────────────────────────────────────────────────────────────┘

1-10k users: Current setup handles easily
10k-100k: Add read replicas (Supabase Pro)
100k-1M: Shard by location/region
1M+: Consider dedicated PostGIS server

Current bottlenecks (when to optimize):
  • Radius queries with >100k profiles in same city
  • Real-time updates (use Supabase Realtime)
  • Photo storage (use CDN + Supabase Storage)


┌─────────────────────────────────────────────────────────────────┐
│                         NEXT STEPS                               │
└─────────────────────────────────────────────────────────────────┘

✅ Phase 1: Database Schema Enhancement (COMPLETE)

→ Phase 2: Frontend Integration
  • Build profile builder UI
  • Implement photo upload
  • Connect onboarding wizard

→ Phase 3: Matching System
  • Integrate location services
  • Build swipe deck with real data
  • Implement likes/passes storage

→ Phase 4: Messaging
  • Real-time chat with Supabase Realtime
  • Push notifications
  • Match notifications

→ Phase 5: Launch Prep
  • Testing with real users
  • Performance optimization
  • Legal/compliance review

