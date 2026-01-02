# 🚀 AstroMatch Launch Quick Checklist

Print this out or keep it open while working!

---

## iOS APP STORE LAUNCH

### Day 1: Assets & Legal (3-4 hours)

#### App Icons ⚠️ CRITICAL
- [ ] Go to https://www.appicon.co/
- [ ] Upload 1024x1024 icon
- [ ] Download icon pack
- [ ] Copy all files to: `ios/App/App/Assets.xcassets/AppIcon.appiconset/`

#### Screenshots
- [ ] Open Xcode workspace: `open ios/App/App.xcworkspace`
- [ ] Select "iPhone 15 Pro Max" simulator
- [ ] Run app (Cmd + R)
- [ ] Take 5-10 screenshots (Cmd + S in simulator)
- [ ] Repeat for "iPhone 11 Pro Max"
- [ ] Repeat for "iPhone 8 Plus"
- [ ] Organize screenshots by device size

#### Privacy Policy
- [ ] Go to https://www.privacypolicygenerator.info/
- [ ] Fill in app details (dating app, collects email, birth date, location, photos)
- [ ] Generate policy
- [ ] Create Notion page (notion.so)
- [ ] Paste privacy policy
- [ ] Publish to web
- [ ] Save public URL: `_____________________`

---

### Day 2: App Store Connect (2-3 hours)

#### Account Setup
- [ ] Go to https://appstoreconnect.apple.com
- [ ] Sign in with Apple Developer account
- [ ] Click "My Apps" → "+" → "New App"

#### App Information
- [ ] Name: `AstroMatch`
- [ ] Bundle ID: `com.astromatch.app`
- [ ] SKU: `astromatch-2025`
- [ ] Platform: iOS
- [ ] Language: English (U.S.)
- [ ] Click "Create"

#### App Store Listing
- [ ] **Name:** AstroMatch
- [ ] **Subtitle:** Astrology Dating & Matches
- [ ] **Category:** Lifestyle (primary), Social Networking (secondary)
- [ ] **Age Rating:** Complete questionnaire (should be 17+)
- [ ] **Description:** Copy from DEPLOYMENT_ROADMAP.md
- [ ] **Keywords:** astrology,dating,zodiac,compatibility,horoscope,matches,love
- [ ] **Support URL:** `_____________________`
- [ ] **Privacy Policy URL:** `_____________________` (from Day 1)

#### Privacy Declarations
- [ ] Contact Info: Email, Name (collected, linked to user)
- [ ] Location: City, Country (collected, linked to user)
- [ ] Photos: Yes (collected, linked to user)
- [ ] Messages: Yes (collected, linked to user)
- [ ] Date of Birth: Yes (collected, linked to user)

#### Screenshots Upload
- [ ] Upload 5+ screenshots for iPhone 6.7" display
- [ ] Upload 5+ screenshots for iPhone 6.5" display
- [ ] Upload 5+ screenshots for iPhone 5.5" display

#### Pricing & Availability
- [ ] Price: Free
- [ ] Countries: United States, UK, Canada, Australia (add more later)

---

### Day 3: Build & Upload (2-3 hours)

#### Xcode Configuration
- [ ] Open: `cd ~/Desktop/AstroMatch1 && open ios/App/App.xcworkspace`
- [ ] Select "App" target (left sidebar)
- [ ] **General Tab:**
  - [ ] Display Name: `AstroMatch`
  - [ ] Bundle ID: `com.astromatch.app`
  - [ ] Version: `1.0.0`
  - [ ] Build: `1`
- [ ] **Signing & Capabilities Tab:**
  - [ ] Automatically manage signing: ✅ CHECKED
  - [ ] Team: Select your Apple Developer team
  - [ ] No errors showing

#### Test Build
- [ ] Select "iPhone 15 Pro" simulator
- [ ] Press Cmd + B to build
- [ ] Fix any errors
- [ ] Press Cmd + R to run
- [ ] Quick test: app launches, can navigate

#### Create Archive
- [ ] Select "Any iOS Device (arm64)" in Xcode dropdown (NOT simulator)
- [ ] Product → Scheme → Edit Scheme
- [ ] Archive → Build Configuration: **Release**
- [ ] Close
- [ ] Product → Archive
- [ ] Wait 5-10 minutes
- [ ] Organizer window opens automatically

#### Upload to App Store
- [ ] In Organizer: Select your archive
- [ ] Click "Distribute App"
- [ ] Select "App Store Connect" → Next
- [ ] Select "Upload" → Next
- [ ] Upload symbols: YES → Next
- [ ] Automatically manage signing: YES → Next
- [ ] Click "Upload"
- [ ] Wait 5-15 minutes
- [ ] Success message appears

---

### Day 4: Submit for Review (1 hour)

#### Wait for Processing
- [ ] Check email for "App Store Connect: Build Processing Completed"
- [ ] Usually takes 15-30 minutes

#### Create Demo Account
- [ ] Sign up in your app: `reviewer@astromatch.demo`
- [ ] Password: `AstroReview2025!`
- [ ] Complete profile with photos
- [ ] Add birth date/time/location
- [ ] Test that account works

#### App Store Connect Final Steps
- [ ] Go to App Store Connect
- [ ] Select AstroMatch
- [ ] App Store tab → Build section
- [ ] Click "Select a build"
- [ ] Choose your uploaded build → Done

#### App Review Information
- [ ] Contact First Name: `_____________________`
- [ ] Contact Last Name: `_____________________`
- [ ] Contact Phone: `_____________________`
- [ ] Contact Email: `_____________________`
- [ ] **Demo Account:**
  - Username: `reviewer@astromatch.demo`
  - Password: `AstroReview2025!`
- [ ] Notes: Copy from DEPLOYMENT_ROADMAP.md

#### Submit!
- [ ] Review all sections (all green checkmarks)
- [ ] Click "Add for Review" (top right)
- [ ] Answer encryption questions:
  - Uses encryption: Yes
  - Export compliance exemption: Yes (standard HTTPS)
- [ ] Click "Submit"
- [ ] Status changes to "Waiting for Review"

---

### Day 5-6: Wait for Review ⏳

- [ ] Check email daily
- [ ] Monitor App Store Connect status
- [ ] Respond quickly to any questions
- [ ] Timeline: 24-48 hours typically

### Day 7: Launch! 🎉

- [ ] Status: "Pending Developer Release" or "Ready for Sale"
- [ ] If approved: Share on social media!
- [ ] If rejected: Read carefully, fix, resubmit

---

## ANDROID GOOGLE PLAY LAUNCH

### Week 2, Day 1: Android Setup (2-3 hours)

#### Install Dependencies
```bash
cd ~/Desktop/AstroMatch1
npm install @capacitor/android
npx cap add android
npx cap sync android
```

#### Install Android Studio
- [ ] Download from https://developer.android.com/studio
- [ ] Install Android Studio
- [ ] Install Android SDK (during setup)
- [ ] Install Android SDK Platform 31+

#### Configure Project
- [ ] Open: `npx cap open android`
- [ ] Update `android/app/build.gradle`:
  - applicationId: `com.astromatch.app`
  - versionCode: `1`
  - versionName: `1.0.0`
- [ ] Update `android/app/src/main/res/values/strings.xml`:
  - app_name: `AstroMatch`
- [ ] File → Sync Project with Gradle Files

#### Generate Icons
- [ ] Go to https://www.appicon.co/
- [ ] Upload 1024x1024 icon
- [ ] Select "Android" platform
- [ ] Download icon pack
- [ ] Copy to `android/app/src/main/res/` folders

#### Test Build
- [ ] Create emulator: Tools → Device Manager → Create Device
- [ ] Select Pixel 5, API 33
- [ ] Click Run (green play button)
- [ ] Test app works

---

### Week 2, Day 2: Play Console (2-3 hours)

#### Create Account
- [ ] Go to https://play.google.com/console/signup
- [ ] Sign in with Google account
- [ ] Pay $25 registration fee
- [ ] Wait for approval (24-48 hours)

#### Create App
- [ ] Go to https://play.google.com/console
- [ ] Click "Create app"
- [ ] App name: `AstroMatch`
- [ ] Language: English (United States)
- [ ] App or game: App
- [ ] Free or paid: Free
- [ ] Accept policies
- [ ] Click "Create app"

#### Store Listing
- [ ] **App name:** AstroMatch
- [ ] **Short description:** Find your cosmic connection with astrology-powered dating
- [ ] **Full description:** Copy from DEPLOYMENT_ROADMAP.md
- [ ] **App icon:** Upload 512x512 PNG
- [ ] **Feature graphic:** Create 1024x500 PNG (use Canva)
- [ ] **Phone screenshots:** Upload 2-8 screenshots (1080x1920)
- [ ] **Category:** Lifestyle
- [ ] **Email:** `_____________________`
- [ ] **Privacy policy URL:** `_____________________`
- [ ] **Website:** https://astro-match1.vercel.app

#### App Content
- [ ] **Privacy Policy:** Paste URL
- [ ] **App Access:** Provide demo account (reviewer@astromatch.demo)
- [ ] **Ads:** No
- [ ] **Content Ratings:** Complete questionnaire (likely Mature 17+)
- [ ] **Target Audience:** 18 and over
- [ ] **Data Safety:** Declare all data collection (similar to iOS)

---

### Week 2, Day 3: Build & Upload (2-3 hours)

#### Generate Signing Key
```bash
cd ~/Desktop/AstroMatch1/android/app
keytool -genkey -v -keystore astromatch-release-key.keystore \
  -alias astromatch -keyalg RSA -keysize 2048 -validity 10000
```

- [ ] Enter keystore password: `_____________________`
- [ ] Enter key password: `_____________________`
- [ ] Save passwords securely!
- [ ] Backup keystore to safe location

#### Configure Signing
- [ ] Create `android/app/key.properties`:
```properties
storePassword=YOUR_KEYSTORE_PASSWORD
keyPassword=YOUR_KEY_PASSWORD
keyAlias=astromatch
storeFile=/Users/scottwhite/Desktop/AstroMatch1/android/app/astromatch-release-key.keystore
```

- [ ] Update `android/app/build.gradle` (see DEPLOYMENT_ROADMAP.md)
- [ ] Verify configuration

#### Build AAB
```bash
cd ~/Desktop/AstroMatch1/android
./gradlew bundleRelease
```

- [ ] Build completes successfully
- [ ] AAB created at: `app/build/outputs/bundle/release/app-release.aab`
- [ ] File size: ~10-50 MB

#### Upload to Play Console
- [ ] Go to Play Console → AstroMatch
- [ ] Production → Releases → Create new release
- [ ] Upload AAB file
- [ ] Wait for processing (2-5 minutes)
- [ ] Release name: `1.0.0 (First Release)`
- [ ] Release notes: Copy from DEPLOYMENT_ROADMAP.md
- [ ] Save
- [ ] Review release
- [ ] Start rollout to Production

---

### Week 2, Day 4-10: Wait for Review ⏳

- [ ] Check email daily
- [ ] Monitor Play Console status
- [ ] Timeline: 1-7 days (often faster than iOS)

### Launch! 🎉

- [ ] Status: "Published"
- [ ] App live on Google Play Store!
- [ ] Share on social media!

---

## IMPORTANT REMINDERS

### Backup These Files! 🔴
- [ ] `android/app/astromatch-release-key.keystore`
- [ ] Keystore passwords
- [ ] Apple Developer account credentials
- [ ] Google Play account credentials

### Keep These URLs!
- [ ] Privacy Policy: `_____________________`
- [ ] Support URL: `_____________________`
- [ ] Demo Account: reviewer@astromatch.demo / AstroReview2025!

### Monitor These
- [ ] App Store Connect email notifications
- [ ] Play Console email notifications
- [ ] Support email for user questions

---

## COST SUMMARY

- [✅] Apple Developer: $99/year (PAID)
- [ ] Google Play: $25 one-time
- **Total remaining: $25**

---

## TIMELINE

**iOS:** 3-5 days
**Android:** 5-7 days (after iOS submitted)
**Total:** 1-2 weeks to both stores

---

## HELP RESOURCES

**Apple:**
- Documentation: https://developer.apple.com/documentation/
- Support: https://developer.apple.com/contact/

**Google:**
- Play Console Help: https://support.google.com/googleplay/android-developer
- Support: https://support.google.com/googleplay/android-developer/answer/7218994

**Capacitor:**
- iOS Guide: https://capacitorjs.com/docs/ios
- Android Guide: https://capacitorjs.com/docs/android

---

## YOU'VE GOT THIS! 💪

Work through each checkbox systematically. Don't skip steps. Test thoroughly. You're so close to launch!

**Good luck! 🚀✨**

