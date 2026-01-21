# 🚀 AstroMatch Production Setup Guide

## ✅ Phase 1: Database Migrations (COMPLETE)

All migration files have been created in `supabase/migrations/`:

### Migration Files Created:
1. **001_enhance_profiles_schema.sql** - Add all missing profile fields
2. **002_create_likes_matches_passes.sql** - Dating app interactions
3. **003_create_messages.sql** - Real-time chat system
4. **004_create_storage_buckets.sql** - Photo uploads
5. **005_create_geo_function.sql** - Location-based matching

### Helper Libraries Created:
- ✅ `lib/profileCompletion.ts` - Profile completion checker
- ✅ `lib/supabase/photoUpload.ts` - Photo upload/compression
- ✅ `lib/supabase/profileQueries.ts` - Fetch matchable profiles
- ✅ `lib/supabase/matchActions.ts` - Like/pass/match actions
- ✅ `lib/supabase/messageActions.ts` - Chat functionality

---

## 📋 Step 1: Run Database Migrations

### Instructions:

1. **Open Supabase Dashboard**
   ```
   https://supabase.com/dashboard/project/umorkbxikucjlluzezhq
   ```

2. **Navigate to SQL Editor**
   - Click "SQL Editor" in left sidebar
   - Click "+ New query"

3. **Run Each Migration (in order)**

   Copy and paste each file's contents, then click "Run":
   
   - ✅ `001_enhance_profiles_schema.sql`
   - ✅ `002_create_likes_matches_passes.sql`
   - ✅ `003_create_messages.sql`
   - ✅ `004_create_storage_buckets.sql`
   - ✅ `005_create_geo_function.sql`

4. **Create Storage Bucket (if 004 fails)**
   
   Go to Storage > New Bucket:
   - Name: `profile-photos`
   - Public: ✅ Yes
   - File size limit: 5MB
   - Allowed MIME types: `image/jpeg, image/jpg, image/png, image/webp`

---

## 📋 Step 2: Replace TEST_PROFILES with Real Database

### What's Being Changed:

**Before (Test Data):**
```typescript
const TEST_PROFILES = [
  { id: 1, name: "Emma", ... }
  // Hardcoded test profiles
]
```

**After (Real Database):**
```typescript
// Fetch from Supabase
const profiles = await fetchMatchableProfiles({
  userGender: currentUser.gender,
  lookingForGender: currentUser.looking_for_gender,
  ageMin: currentUser.age_min,
  ageMax: currentUser.age_max,
  distanceRadius: currentUser.distance_radius,
  userLat: currentUser.lat,
  userLon: currentUser.lon,
  userId: currentUser.id
})
```

### Files to Update:
- ✅ `app/matches/page.tsx` - Replace TEST_PROFILES
- ✅ `app/messages/page.tsx` - Load real matches
- ✅ `app/profile/profile/page.tsx` - Save profile to database

---

## 📋 Step 3: Profile Completion Enforcement

### Create Onboarding Flow

**File:** `app/onboarding/page.tsx` (new file)

Multi-step wizard:
1. Upload photos (min 2)
2. Enter birthdate → Calculate zodiac signs
3. Write bio (50+ characters)
4. Add basic info (gender, occupation, height)
5. Set preferences (who to see, age range, distance)

### Add Profile Gate in Matches Page

```typescript
useEffect(() => {
  const checkProfile = async () => {
    const profile = await fetchUserProfile()
    const status = checkProfileCompletion(profile)
    
    if (!status.isComplete) {
      router.push('/onboarding')
      return
    }
    
    // Load matches
    loadMatches()
  }
  checkProfile()
}, [])
```

---

## 📋 Step 4: Implement Like/Pass Actions

### Update Matches Page

**Like Handler:**
```typescript
const handleLike = async (profileId: string) => {
  const result = await likeProfile(currentUserId, profileId)
  
  if (result.isMatch) {
    // Show "It's a Match!" animation
    showMatchAnimation()
  }
  
  nextProfile()
}
```

**Pass Handler:**
```typescript
const handlePass = async (profileId: string) => {
  await passProfile(currentUserId, profileId)
  nextProfile()
}
```

---

## 📋 Step 5: Messages Implementation

### Messages Page Updates

**File:** `app/messages/[id]/page.tsx`

```typescript
// Load messages
const messages = await getMessages(matchId)

// Real-time subscription
useEffect(() => {
  const subscription = subscribeToMessages(matchId, (newMessage) => {
    setMessages(prev => [...prev, newMessage])
  })
  
  return () => unsubscribeFromMessages(subscription)
}, [matchId])

// Send message
const handleSend = async (content: string) => {
  await sendMessage(matchId, currentUserId, otherUserId, content)
}
```

---

## 📋 Step 6: Photo Upload Implementation

### Profile Edit Page

```typescript
const handlePhotoUpload = async (file: File, index: number) => {
  const result = await uploadProfilePhoto(file, currentUserId, index)
  
  if (result.success) {
    // Update profile with new photo URL
    const updatedPhotos = [...photos]
    updatedPhotos[index] = result.url!
    
    await supabase
      .from('profiles')
      .update({ photos: updatedPhotos })
      .eq('id', currentUserId)
  }
}
```

---

## 🧪 Testing Checklist

### Local Testing (Before Launch)

- [ ] Create 5+ test accounts with different zodiac signs
- [ ] Complete onboarding flow for each
- [ ] Test profile editing and photo uploads
- [ ] Test swiping (like/pass) functionality
- [ ] Test matching (mutual likes)
- [ ] Test unmatching
- [ ] Test sending/receiving messages
- [ ] Test real-time message updates
- [ ] Test filtering (distance, age, gender)
- [ ] Test all 7 compatibility tiers display correctly
- [ ] Test on mobile (iOS Safari, Android Chrome)
- [ ] Test on desktop (Chrome, Firefox, Safari)

### Performance Testing

- [ ] Test with 100+ profiles in database
- [ ] Verify location queries are fast (<200ms)
- [ ] Test image loading/compression
- [ ] Test on slow network (3G throttling)
- [ ] Monitor memory usage
- [ ] Check for memory leaks (long sessions)

---

## 🔒 Security Checklist

### Row Level Security (RLS)

All tables have RLS enabled:
- ✅ Users can only see their own likes
- ✅ Users can only see matched profiles in messages
- ✅ Users can only upload to their own photo folder
- ✅ Profiles are publicly readable (for matching)

### Data Validation

- ✅ Age: 18-120 years
- ✅ Distance: 1-500 km
- ✅ Photos: Max 5MB, JPEG/PNG/WebP only
- ✅ Messages: Max 5000 characters
- ✅ Bio: Min 50 characters for profile completion

---

## 📱 App Store Submission

### Requirements

#### iOS (App Store)
- [ ] Apple Developer Account ($99/year)
- [ ] App icon (1024x1024)
- [ ] Screenshots (iPhone 14 Pro, iPad Pro)
- [ ] Privacy Policy URL
- [ ] Terms of Service URL
- [ ] Age rating: 17+ (dating app)

#### Android (Google Play)
- [ ] Google Play Developer Account ($25 one-time)
- [ ] App icon (512x512)
- [ ] Feature graphic (1024x500)
- [ ] Screenshots (phone & tablet)
- [ ] Privacy Policy URL
- [ ] Terms of Service URL
- [ ] Content rating: Mature 17+

---

## 🎯 Launch Readiness

### Critical Items (Must Have)
- ✅ Database migrations run successfully
- ✅ Real user profiles (no TEST_PROFILES)
- ✅ Photo upload working
- ✅ Like/match system working
- ✅ Messages system working
- ✅ Profile completion enforcement
- ✅ RLS policies protecting user data

### Important (Should Have)
- [ ] Onboarding wizard for new users
- [ ] "It's a Match!" animation
- [ ] Push notifications for new matches/messages
- [ ] Report/block user functionality
- [ ] Account deletion
- [ ] Email notifications

### Nice to Have (Post-Launch)
- [ ] Video profiles
- [ ] Voice messages
- [ ] Premium features (see who liked you)
- [ ] Astrology compatibility reports (PDF)
- [ ] Daily horoscopes
- [ ] Astrology events/meetups

---

## 🚀 Launch Day Checklist

### Pre-Launch (Day Before)
- [ ] Run all migrations on production database
- [ ] Verify environment variables (`.env.local`)
- [ ] Test end-to-end user flow
- [ ] Set up error monitoring (Sentry)
- [ ] Prepare customer support email
- [ ] Create social media accounts

### Launch Day
- [ ] Submit iOS app to App Store
- [ ] Submit Android app to Google Play
- [ ] Monitor crash reports
- [ ] Monitor user feedback
- [ ] Be ready for quick bug fixes
- [ ] Announce on social media

### Post-Launch (First Week)
- [ ] Monitor daily active users
- [ ] Check crash-free rate (aim for >99%)
- [ ] Respond to user reviews
- [ ] Fix critical bugs immediately
- [ ] Gather user feedback
- [ ] Plan first update

---

## 📊 Success Metrics

### Week 1 Goals
- 100+ signups
- 50+ completed profiles
- 200+ matches
- 500+ messages sent

### Month 1 Goals
- 1,000+ users
- 500+ daily active users
- 5,000+ matches
- 20,000+ messages sent
- 4.0+ star rating

---

## 🆘 Emergency Contacts

### Supabase Support
- Dashboard: https://supabase.com/dashboard
- Docs: https://supabase.com/docs
- Discord: https://discord.supabase.com

### Critical Issues
1. Database down → Check Supabase status page
2. High error rate → Check Supabase logs
3. Slow queries → Check database indexes
4. Storage full → Upgrade Supabase plan

---

## 🎉 You're Ready!

Follow the steps in order:
1. Run database migrations ✅
2. Test locally with real data ✅
3. Deploy to production ✅
4. Submit to app stores ✅
5. Launch! 🚀

Good luck! 💫

