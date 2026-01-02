# 🚀 AstroMatch App Store Launch Checklist

## Current Status Assessment

### ✅ What's Already Done:
- [x] iOS project exists (`ios/App`)
- [x] Capacitor config set up (`capacitor.config.ts`)
- [x] App ID configured: `com.astromatch.app`
- [x] App Name: `AstroMatch`
- [x] Basic app icon exists (1024x1024)
- [x] Server URL configured: `https://astro-match1.vercel.app`
- [x] Splash screen configured
- [x] All core features implemented and tested

---

## 📱 PHASE 1: App Icons & Assets (CRITICAL)

### Current Issue:
You only have ONE app icon size (1024x1024). iOS requires MULTIPLE sizes.

### Action Required:

1. **Generate All Required Icon Sizes:**
   - 20x20 (iPhone Notification)
   - 29x29 (iPhone Settings)
   - 40x40 (iPhone Spotlight)
   - 60x60 (iPhone App)
   - 76x76 (iPad App)
   - 83.5x83.5 (iPad Pro)
   - 1024x1024 (App Store)

2. **Tools to Generate Icons:**
   - Option A: Use https://www.appicon.co/ (Free, upload your 1024x1024 image)
   - Option B: Use https://icon.kitchen/ (Free, more customization)
   - Option C: Use Xcode's built-in asset catalog (manual)

3. **Install Icons:**
   ```bash
   # After generating icons, copy them to:
   # /Users/scottwhite/Desktop/AstroMatch1/ios/App/App/Assets.xcassets/AppIcon.appiconset/
   ```

### Current Icon Location:
`/Users/scottwhite/Desktop/AstroMatch1/ios/App/App/Assets.xcassets/AppIcon.appiconset/ChatGPT Image Dec 25, 2025, 03_48_27 PM.png`

**TODO:** 
- [ ] Download your 1024x1024 icon
- [ ] Upload to appicon.co or icon.kitchen
- [ ] Download generated icon pack
- [ ] Replace contents of AppIcon.appiconset folder

---

## 📸 PHASE 2: App Store Screenshots (REQUIRED)

Apple requires screenshots for different device sizes:

### Required Screenshot Sizes:
1. **iPhone 6.7" Display** (iPhone 15 Pro Max, 14 Pro Max, etc.)
   - 1290 x 2796 pixels (portrait)
   - Minimum: 3 screenshots, Maximum: 10

2. **iPhone 6.5" Display** (iPhone 11 Pro Max, XS Max, etc.)
   - 1284 x 2778 pixels (portrait)
   - Minimum: 3 screenshots

3. **iPhone 5.5" Display** (iPhone 8 Plus, 7 Plus, etc.)
   - 1242 x 2208 pixels (portrait)
   - Minimum: 3 screenshots

### How to Take Screenshots:

**Option A: Use iOS Simulator**
```bash
# 1. Open Xcode project
open /Users/scottwhite/Desktop/AstroMatch1/ios/App/App.xcworkspace

# 2. In Xcode:
#    - Select iPhone 15 Pro Max simulator
#    - Run the app (Cmd + R)
#    - Navigate to key screens
#    - Take screenshots (Cmd + S in simulator)
#    - Screenshots saved to ~/Desktop
```

**Option B: Use Physical iPhone**
- Connect iPhone to Mac
- Run app from Xcode on device
- Take screenshots with buttons (Volume Up + Side Button)
- Transfer to Mac via AirDrop

### Recommended Screenshots to Take:
1. **Matches Page** - Show profile cards with compatibility
2. **Profile View** - Show detailed profile with astrology info
3. **Messages Page** - Show conversation list
4. **Chat View** - Show active conversation
5. **Account Settings** - Show user profile/settings
6. **Community/AstroLounge** - If you want to showcase this

**TODO:**
- [ ] Take 3-10 screenshots per device size
- [ ] Save in organized folder
- [ ] Optional: Add text overlays highlighting features

---

## 📝 PHASE 3: App Store Connect Setup

### 1. Create App Store Connect Account
- Go to: https://appstoreconnect.apple.com
- Sign in with Apple Developer account
- **Cost:** $99/year for Apple Developer Program

### 2. Create New App Listing

**TODO:**
- [ ] Click "My Apps" → "+" → "New App"
- [ ] Fill in:
  - Platform: iOS
  - Name: AstroMatch
  - Primary Language: English
  - Bundle ID: `com.astromatch.app`
  - SKU: `astromatch-001` (or any unique identifier)
  - User Access: Full Access

### 3. App Information

**App Name:** AstroMatch (max 30 characters)

**Subtitle:** (max 30 characters)
Suggested: "Astrology Dating & Matches"

**Description:** (max 4000 characters)
```
Find your cosmic connection with AstroMatch - the astrology-powered dating app that helps you discover compatible matches based on Western and Chinese zodiac signs.

KEY FEATURES:

🌟 Advanced Compatibility Matching
• Western Zodiac (Tropical & Sidereal systems)
• Chinese Zodiac with Wu Xing elements
• Soulmate & Secret Friends patterns
• Detailed compatibility scores

💬 Smart Messaging
• Instant messaging with compatible matches
• Privacy controls for who can message you
• Filter by Soulmate and Secret Friends only

🔍 Intelligent Discovery
• Swipe through curated profiles
• Search by zodiac signs and patterns
• Friend Finder for platonic connections
• Profile stack that remembers your preferences

✨ Personalized Experience
• Detailed astrology profiles
• Compatibility insights
• Connection boxes showing your cosmic bond
• Light and dark themes

🛡️ Safe & Secure
• Profile verification
• Block and report features
• Privacy-first design
• Instant message controls

Whether you're looking for love or friendship, AstroMatch uses the ancient wisdom of astrology to help you find meaningful connections. Download now and discover your cosmic compatibility!
```

**Keywords:** (max 100 characters, comma-separated)
```
astrology,dating,zodiac,compatibility,horoscope,matches,love,relationships,chinese zodiac
```

**Support URL:**
- [ ] Create a support page (can be simple GitHub Pages or Notion page)
- Example: `https://astromatch.app/support`

**Marketing URL:** (Optional)
- Your main website if you have one

**TODO:**
- [ ] Write app description
- [ ] Choose keywords
- [ ] Create support page
- [ ] Set up privacy policy URL

---

## 🔒 PHASE 4: Privacy Policy & Terms (REQUIRED)

Apple REQUIRES a privacy policy URL before submission.

### Create Privacy Policy

**Option A: Use a Generator**
- https://www.privacypolicygenerator.info/
- https://www.freeprivacypolicy.com/

**Option B: Host on GitHub Pages**
```bash
# Create a simple HTML page
mkdir -p /Users/scottwhite/Desktop/AstroMatch1/docs
# Add privacy-policy.html
# Push to GitHub and enable GitHub Pages
```

**Option C: Use Notion (Easiest)**
- Create a Notion page with privacy policy
- Make it public
- Use the public link

### What to Include in Privacy Policy:
- What data you collect (email, birth date, location, photos)
- How you use the data (matching, profile display)
- Third-party services (Supabase, Vercel)
- User rights (delete account, data export)
- Contact information

### Terms of Service
- User conduct rules
- Age requirements (18+)
- Content guidelines
- Account termination policy

**TODO:**
- [ ] Create privacy policy
- [ ] Create terms of service
- [ ] Host both online
- [ ] Get URLs for App Store Connect

---

## 🔧 PHASE 5: Technical Setup

### 1. Install Capacitor (If Not Already)

```bash
cd /Users/scottwhite/Desktop/AstroMatch1

# Install Capacitor
npm install @capacitor/core @capacitor/cli @capacitor/ios

# Initialize Capacitor (already done based on your config)
# npx cap init

# Sync changes to iOS
npx cap sync ios
```

### 2. Configure Xcode Project

```bash
# Open Xcode workspace
open ios/App/App.xcworkspace
```

**In Xcode, verify:**
- [ ] Bundle Identifier: `com.astromatch.app`
- [ ] Display Name: `AstroMatch`
- [ ] Version: `1.0.0`
- [ ] Build: `1`
- [ ] Deployment Target: iOS 13.0 or higher
- [ ] Team: Select your Apple Developer team
- [ ] Signing: Automatic signing enabled

### 3. Build for Production

**TODO:**
- [ ] In Xcode: Product → Scheme → Edit Scheme
- [ ] Set Build Configuration to "Release"
- [ ] Product → Archive
- [ ] Wait for archive to complete
- [ ] Window → Organizer → Archives
- [ ] Select your archive → "Distribute App"

---

## 🗄️ PHASE 6: Database Migrations (CRITICAL)

### Verify Production Database

**TODO:**
- [ ] Log into Supabase dashboard
- [ ] Select production project
- [ ] Go to SQL Editor
- [ ] Run verification queries:

```sql
-- Check if instant message fields exist
SELECT column_name, data_type, column_default
FROM information_schema.columns
WHERE table_name = 'profiles'
AND column_name IN ('allow_instant_messages_connections', 'allow_instant_messages_discover');

-- Check pass expiry default
SELECT column_name, column_default
FROM information_schema.columns
WHERE table_name = 'passes'
AND column_name = 'expires_at';

-- Should show: NOW() + '7 days'::interval
```

### Apply Missing Migrations

If any migrations are missing:

```bash
cd /Users/scottwhite/Desktop/AstroMatch1

# Check migration files
ls -la supabase/migrations/

# Apply migrations manually in Supabase SQL Editor:
# 1. Copy content from migration files
# 2. Paste into SQL Editor
# 3. Run each migration
```

**Critical Migrations to Verify:**
- [ ] `03_INSTANT_MESSAGING_SETTINGS.sql` - Instant message fields
- [ ] `006_update_pass_expiry_7_days.sql` - Pass expiry to 7 days
- [ ] All other numbered migrations in `supabase/migrations/`

---

## 🔐 PHASE 7: Environment Variables

### Production Environment Setup

**TODO:**
- [ ] Verify `.env.local` has production Supabase credentials
- [ ] Check Vercel environment variables match
- [ ] Test production API endpoints

```bash
# Check current env file
cat /Users/scottwhite/Desktop/AstroMatch1/.env.local
```

**Required Variables:**
```
NEXT_PUBLIC_SUPABASE_URL=your-production-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-production-key
```

---

## ✅ PHASE 8: Testing Checklist

### Test on Physical Device

**TODO:**
- [ ] Connect iPhone to Mac
- [ ] Open Xcode project
- [ ] Select your iPhone as target
- [ ] Run app (Cmd + R)

### Test All Core Features:

1. **Authentication**
   - [ ] Sign up with email
   - [ ] Sign in with existing account
   - [ ] Password reset

2. **Profile Creation**
   - [ ] Upload photos
   - [ ] Enter birth date/time/location
   - [ ] Save profile information
   - [ ] View calculated zodiac signs

3. **Matches Page**
   - [ ] View profile cards
   - [ ] Swipe right (like)
   - [ ] Swipe left (pass)
   - [ ] Click chat button
   - [ ] Filter by Soulmate/Secret Friends
   - [ ] Search settings work

4. **Messages**
   - [ ] Send message
   - [ ] Receive message
   - [ ] Conversation appears in list
   - [ ] Instant message toggle works
   - [ ] Settings toggle (purple color)

5. **Profile/Account**
   - [ ] View own profile
   - [ ] Edit profile
   - [ ] Instant message toggle (purple)
   - [ ] Sun sign system toggle (purple)
   - [ ] Friend Finder toggle (purple)
   - [ ] Logout

6. **Pass Expiry**
   - [ ] Swipe left on profile
   - [ ] Verify profile hidden
   - [ ] Check database: expires_at is 7 days from now

7. **Match Labels**
   - [ ] Verify "Soulmate" label shows for San He
   - [ ] Verify "Secret Friends" label shows for Liu He
   - [ ] Filter works correctly

---

## 📤 PHASE 9: App Store Submission

### 1. Create Archive in Xcode

```bash
# Open Xcode
open /Users/scottwhite/Desktop/AstroMatch1/ios/App/App.xcworkspace

# In Xcode:
# 1. Product → Scheme → Edit Scheme → Set to "Release"
# 2. Product → Archive
# 3. Wait for build to complete
# 4. Window → Organizer
```

### 2. Upload to App Store Connect

**In Xcode Organizer:**
- [ ] Select your archive
- [ ] Click "Distribute App"
- [ ] Select "App Store Connect"
- [ ] Select "Upload"
- [ ] Choose automatic signing
- [ ] Click "Upload"
- [ ] Wait for processing (10-30 minutes)

### 3. Complete App Store Connect Listing

**Go to App Store Connect:**
- [ ] Select your app
- [ ] Go to "App Store" tab
- [ ] Upload screenshots (all required sizes)
- [ ] Fill in app description
- [ ] Add keywords
- [ ] Set privacy policy URL
- [ ] Set support URL
- [ ] Choose age rating (17+ for dating apps)
- [ ] Set pricing (Free or Paid)
- [ ] Select countries/regions

### 4. Submit for Review

**Before submitting:**
- [ ] Review all information
- [ ] Test app one more time
- [ ] Prepare demo account credentials (Apple may request)

**Submit:**
- [ ] Click "Add for Review"
- [ ] Answer questionnaire about app features
- [ ] Provide demo account if needed
- [ ] Add notes for reviewer (optional)
- [ ] Click "Submit"

### 5. Review Process

**Timeline:**
- Initial review: 24-48 hours typically
- May request additional information
- May reject if issues found

**Common Rejection Reasons:**
- Missing privacy policy
- Incomplete app information
- Bugs or crashes
- Age rating incorrect (dating apps must be 17+)
- In-app purchases not properly configured

---

## 🎯 PHASE 10: Post-Submission

### While Waiting for Approval:

1. **Monitor App Store Connect**
   - Check daily for status updates
   - Respond quickly to any reviewer questions

2. **Prepare Marketing Materials**
   - Social media posts
   - Press release
   - Landing page
   - Email to beta testers

3. **Set Up Analytics**
   - Vercel Analytics (already installed)
   - App Store Analytics
   - Supabase Analytics

4. **Plan Updates**
   - Bug fix pipeline
   - Feature roadmap
   - User feedback system

---

## 📋 Quick Action Items (Start Here)

### IMMEDIATE (Do Today):

1. **Generate App Icons**
   - [ ] Go to https://www.appicon.co/
   - [ ] Upload your 1024x1024 icon
   - [ ] Download icon pack
   - [ ] Replace in `ios/App/App/Assets.xcassets/AppIcon.appiconset/`

2. **Take Screenshots**
   - [ ] Open Xcode
   - [ ] Run on iPhone 15 Pro Max simulator
   - [ ] Take 5-10 screenshots of key features
   - [ ] Save to Desktop

3. **Create Privacy Policy**
   - [ ] Use https://www.privacypolicygenerator.info/
   - [ ] Create Notion page or GitHub Pages
   - [ ] Get public URL

### THIS WEEK:

4. **Set Up App Store Connect**
   - [ ] Create developer account ($99/year)
   - [ ] Create new app listing
   - [ ] Fill in app information

5. **Test on Device**
   - [ ] Run full testing checklist
   - [ ] Fix any bugs found

6. **Verify Database**
   - [ ] Check all migrations applied
   - [ ] Test production environment

### NEXT WEEK:

7. **Create Archive**
   - [ ] Build release version in Xcode
   - [ ] Upload to App Store Connect

8. **Submit for Review**
   - [ ] Complete all App Store Connect fields
   - [ ] Submit app

---

## 🆘 Need Help?

### Resources:
- Apple Developer Documentation: https://developer.apple.com/documentation/
- App Store Review Guidelines: https://developer.apple.com/app-store/review/guidelines/
- Capacitor iOS Guide: https://capacitorjs.com/docs/ios

### Common Issues:

**"No provisioning profiles found"**
- Solution: In Xcode, select your team in Signing & Capabilities

**"Archive not showing in Organizer"**
- Solution: Make sure you selected "Any iOS Device" before archiving

**"Build failed"**
- Solution: Run `npx cap sync ios` and try again

---

## ✨ You're Ready!

Once you complete all phases, your app will be live on the App Store!

**Estimated Timeline:**
- Icons & Screenshots: 2-4 hours
- App Store Connect Setup: 2-3 hours
- Testing: 4-6 hours
- Submission: 1 hour
- Review: 24-48 hours

**Total: ~3-5 days from start to approval**

Good luck with your launch! 🚀

