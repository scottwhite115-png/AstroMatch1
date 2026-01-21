# 🚀 AstroMatch Launch Checklist

## ✅ PRE-LAUNCH CHECKLIST

### Phase 1: Database Setup (15-20 minutes)

#### Step 1: Run Supabase Migrations
1. **Open Supabase Dashboard**
   - Go to: https://supabase.com/dashboard/project/umorkbxikucjlluzezhq
   - Click on "SQL Editor" in the left sidebar

2. **Run Each Migration** (in order!)
   
   **Migration 1: Enhance Profiles**
   ```sql
   -- Copy/paste from: supabase/migrations/001_enhance_profiles_schema.sql
   -- Then click "Run"
   ```
   
   **Migration 2: Likes/Matches/Passes**
   ```sql
   -- Copy/paste from: supabase/migrations/002_create_likes_matches_passes.sql
   -- Then click "Run"
   ```
   
   **Migration 3: Messages**
   ```sql
   -- Copy/paste from: supabase/migrations/003_create_messages.sql
   -- Then click "Run"
   ```
   
   **Migration 4: Storage Bucket**
   ```sql
   -- Copy/paste from: supabase/migrations/004_create_storage_buckets.sql
   -- Then click "Run"
   ```
   
   **Migration 5: Geo Function**
   ```sql
   -- Copy/paste from: supabase/migrations/005_create_geo_function.sql
   -- Then click "Run"
   ```

3. **Verify Migrations**
   ```sql
   -- Run this to check all tables exist:
   SELECT table_name 
   FROM information_schema.tables 
   WHERE table_schema = 'public'
   ORDER BY table_name;
   
   -- Should see: likes, matches, messages, passes, profiles
   ```

4. **Check Storage Bucket**
   - Go to "Storage" in left sidebar
   - Confirm "profile-photos" bucket exists
   - Check bucket policies are set (public read, authenticated write)

#### Step 2: Create Test Accounts (10 minutes)
1. Create Account 1
   - Sign up with email
   - Complete profile (name, birthdate, photos, bio)
   - Set preferences (gender, age range, distance)

2. Create Account 2
   - Sign up with different email
   - Complete profile
   - Set preferences

3. **Test Core Flow**
   - [ ] Account 1 likes Account 2
   - [ ] Account 2 likes Account 1 back
   - [ ] "It's a Match!" modal appears
   - [ ] Can send messages
   - [ ] Messages appear in real-time
   - [ ] Profile photos display correctly
   - [ ] Connection overview shows compatibility

---

### Phase 2: Production Build (5 minutes)

```bash
# 1. Clean build
rm -rf .next

# 2. Build for production
npm run build

# 3. Test production build locally
npm run start

# 4. Open http://localhost:3000
# Verify everything works
```

**Check:**
- [ ] No build errors
- [ ] All pages load
- [ ] Images load correctly
- [ ] No console errors
- [ ] Dark mode works
- [ ] Mobile responsive

---

### Phase 3: Environment Variables

**Required for Production:**
```env
NEXT_PUBLIC_SUPABASE_URL=https://umorkbxikucjlluzezhq.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
DATABASE_URL=postgresql://postgres.umorkbxikucjlluzezhq:...
DIRECT_URL=postgresql://postgres.umorkbxikucjlluzezhq:...
```

**Optional (for admin features):**
```env
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

---

### Phase 4: Deploy to Vercel (10 minutes)

#### Option A: Deploy with Vercel CLI
```bash
# 1. Install Vercel CLI (if not installed)
npm i -g vercel

# 2. Login
vercel login

# 3. Deploy
vercel

# 4. Test deployment
# Visit the preview URL

# 5. Deploy to production
vercel --prod
```

#### Option B: Deploy via GitHub
1. Push code to GitHub
2. Go to vercel.com
3. Click "Import Project"
4. Select your repo
5. Add environment variables
6. Click "Deploy"

**Vercel Settings:**
- Framework Preset: Next.js
- Build Command: `npm run build`
- Output Directory: `.next`
- Install Command: `npm install`

**Environment Variables to Add:**
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `DATABASE_URL`
- `DIRECT_URL`

---

### Phase 5: Post-Deployment Testing (15 minutes)

Test on production URL:

**Core Features:**
- [ ] Sign up flow works
- [ ] Email verification works (if enabled)
- [ ] Profile creation works
- [ ] Photo upload works
- [ ] Discover page loads profiles
- [ ] Like button works
- [ ] Pass button works
- [ ] Match detection works
- [ ] "It's a Match!" modal appears
- [ ] Messages send/receive
- [ ] Real-time messaging works
- [ ] Profile dropdown works
- [ ] Connection overview works
- [ ] AstroLab pages load
- [ ] Match generator works
- [ ] Community features work

**UI/UX:**
- [ ] Dark mode works
- [ ] All fonts load correctly
- [ ] Images load correctly
- [ ] Responsive on mobile
- [ ] Responsive on tablet
- [ ] No layout shifts
- [ ] Smooth animations

**Performance:**
- [ ] Pages load quickly
- [ ] No console errors
- [ ] No 404 errors
- [ ] Images optimized
- [ ] Lighthouse score > 80

---

## 📱 APP STORE SUBMISSION

### Phase 6: iOS App Store (Apple)

#### Requirements:
1. **Apple Developer Account**
   - Cost: $99/year
   - Sign up at: https://developer.apple.com

2. **App Store Connect**
   - Create app listing
   - Add screenshots (6.5", 5.5" iPhones + iPad)
   - Write app description
   - Add app icon (1024x1024px)
   - Set category: Lifestyle
   - Set age rating: 17+ (dating app)

3. **Privacy Policy** (Required!)
   - Must be publicly accessible URL
   - Must cover: data collection, usage, sharing
   - Template: https://www.privacypolicies.com

4. **Terms of Service** (Required!)
   - Must be publicly accessible URL
   - Must cover: user conduct, account termination, liability

5. **App Review Information**
   - Test account credentials
   - Demo video (if needed)
   - Contact information
   - Notes for reviewer

#### Build Process:
```bash
# Using React Native / Expo
npx expo build:ios
```

OR use Capacitor/Cordova to wrap Next.js app

#### Submission Checklist:
- [ ] App screenshots (all required sizes)
- [ ] App icon (1024x1024)
- [ ] App description (compelling!)
- [ ] Keywords for SEO
- [ ] Privacy policy URL
- [ ] Terms of service URL
- [ ] Support URL
- [ ] Marketing URL (optional)
- [ ] Age rating completed
- [ ] Pricing set (free or paid)
- [ ] In-app purchases configured (if any)
- [ ] Test account provided

---

### Phase 7: Google Play Store (Android)

#### Requirements:
1. **Google Play Console Account**
   - Cost: $25 one-time fee
   - Sign up at: https://play.google.com/console

2. **App Listing**
   - Add screenshots (phone + tablet)
   - Feature graphic (1024x500px)
   - App icon (512x512px)
   - Short description (80 chars)
   - Full description (4000 chars)
   - Category: Dating
   - Content rating: Mature 17+

3. **Privacy Policy** (Required!)
   - Same as iOS

4. **Build Process:**
```bash
# Using React Native / Expo
npx expo build:android
```

#### Submission Checklist:
- [ ] App screenshots (phone + tablet)
- [ ] Feature graphic
- [ ] App icon (512x512)
- [ ] Short description
- [ ] Full description
- [ ] Privacy policy URL
- [ ] Content rating questionnaire completed
- [ ] Target age set
- [ ] Release type: Production
- [ ] APK/AAB uploaded
- [ ] Signed with release key

---

## 🔒 SECURITY CHECKLIST

Before launch, verify:

### Database Security:
- [ ] Row Level Security (RLS) enabled on all tables
- [ ] Users can only see their own data
- [ ] Users can only edit their own profiles
- [ ] Matches are mutual (both users liked)
- [ ] Messages only between matched users

### API Security:
- [ ] All API routes check authentication
- [ ] Rate limiting enabled
- [ ] CORS configured correctly
- [ ] SQL injection protection (Supabase handles this)
- [ ] XSS protection enabled

### User Data:
- [ ] Passwords hashed (Supabase handles this)
- [ ] Emails stored securely
- [ ] Phone numbers encrypted (if used)
- [ ] Location data anonymized (only city shown)
- [ ] Photos stored securely in Supabase Storage

### Privacy:
- [ ] GDPR compliant (EU users)
- [ ] CCPA compliant (California users)
- [ ] Users can delete their account
- [ ] Users can export their data
- [ ] Privacy policy linked in app
- [ ] Terms of service linked in app

---

## 📊 ANALYTICS & MONITORING

### Recommended Tools:

1. **Vercel Analytics** (Built-in)
   - Page views
   - Performance metrics
   - Real-time visitors

2. **Sentry** (Error Tracking)
   - https://sentry.io
   - Free tier: 5k errors/month
   - Tracks crashes and errors

3. **PostHog** (Product Analytics)
   - https://posthog.com
   - Free tier: 1M events/month
   - User behavior tracking

4. **Supabase Dashboard** (Database Monitoring)
   - Built-in database stats
   - Real-time queries
   - Storage usage

### Key Metrics to Track:
- Daily Active Users (DAU)
- Sign-up conversion rate
- Profile completion rate
- Match rate
- Message response rate
- User retention (Day 1, Day 7, Day 30)
- Average session duration
- Churn rate

---

## 🚨 TROUBLESHOOTING

### Common Issues:

**Issue: "No profiles found"**
- Check: Profiles have `profile_complete = true`
- Check: Profiles have `account_active = true`
- Check: User preferences match available profiles
- Check: Location data is set (lat/lon)

**Issue: "Matches not detecting"**
- Check: Database trigger `check_and_create_match` exists
- Check: Both users actually liked each other
- Check: `matches` table has correct data

**Issue: "Messages not sending"**
- Check: Users are actually matched
- Check: Supabase real-time is enabled
- Check: Message permissions in RLS

**Issue: "Photos not uploading"**
- Check: Storage bucket `profile-photos` exists
- Check: Bucket policies allow uploads
- Check: File size < 5MB
- Check: File type is JPEG/PNG/WebP

---

## ✅ FINAL GO-LIVE CHECKLIST

### Day Before Launch:
- [ ] All database migrations run
- [ ] Test accounts created and tested
- [ ] Production deployment successful
- [ ] All features tested on production
- [ ] Privacy policy live
- [ ] Terms of service live
- [ ] Support email set up
- [ ] Social media accounts created
- [ ] App store listings drafted
- [ ] Marketing materials ready

### Launch Day:
- [ ] Submit to App Store
- [ ] Submit to Google Play
- [ ] Monitor error logs (Sentry)
- [ ] Monitor analytics (Vercel/PostHog)
- [ ] Watch Supabase dashboard for activity
- [ ] Respond to user feedback
- [ ] Fix any critical bugs immediately

### Week 1:
- [ ] Monitor user feedback
- [ ] Track key metrics
- [ ] Fix reported bugs
- [ ] Improve onboarding based on data
- [ ] Optimize performance
- [ ] Add missing features (if needed)

---

## 🎉 YOU'RE READY TO LAUNCH!

**Total Time to Production:** ~2-3 hours
- Database setup: 20 min
- Testing: 30 min
- Deployment: 15 min
- Post-deployment testing: 30 min
- App store prep: 1-2 hours

**Status:** ✅ 100% READY

Good luck with your launch! 🚀🚀🚀

