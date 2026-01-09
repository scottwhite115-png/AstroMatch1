# Deploy to Google Play & Apple App Store - January 2026

## ✅ Pre-Deployment Checklist

- [x] Next.js app built successfully
- [x] Capacitor synced for both platforms
- [x] All fixes applied:
  - [x] Chrome opening issue fixed (Primal Astrology links removed)
  - [x] Sign in with Apple improved
  - [x] Rebranded to astrology matchmaking platform
  - [x] App metadata updated
  - [x] All code changes committed and pushed to git

---

## 🤖 Google Play Store (Android)

### Step 1: Build Android App Bundle (AAB)

The AAB file needs to be built using Android Studio or Gradle command line.

**Option A: Using Gradle (Faster)**
```bash
cd ~/Desktop/AstroMatch1/android
./gradlew bundleRelease
```

**Option B: Using Android Studio**
1. Open Android Studio
2. Open `~/Desktop/AstroMatch1/android` folder
3. Wait for Gradle sync
4. Build → Generate Signed Bundle / APK
5. Select "Android App Bundle"
6. Use your existing keystore (or create new one)
7. Build → Build Bundle(s) / APK(s)

**AAB Location After Build:**
```
~/Desktop/AstroMatch1/android/app/build/outputs/bundle/release/app-release.aab
```

### Step 2: Update Version in build.gradle

Before building, update the version:

**File:** `android/app/build.gradle`
```gradle
versionCode 2  // Increment this number (was probably 1)
versionName "1.0.1"  // Update version name
```

### Step 3: Upload to Google Play Console

1. Go to [Google Play Console](https://play.google.com/console)
2. Select your app (AstroMatch)
3. Go to **Production** or **Closed Testing** track
4. Click **Create new release** (or **Edit release** if updating)
5. Upload the AAB file: `app-release.aab`
6. Add release notes:
   ```
   • Fixed Chrome opening issue - all external links removed
   • Improved Sign in with Apple authentication
   • Enhanced app stability and performance
   • Updated app descriptions and branding
   ```
7. Review and roll out

### Step 4: Update App Store Listing (if needed)

If you haven't already, update your app description using:
- `APP_STORE_ASTROLOGY_POSITIONING.md` for the new description

**Key Changes:**
- Title: "AstroMatch: Astrology Matchmaking"
- Short description: "Discover cosmic compatibility through Western & Chinese astrology matchmaking"
- Category: **Lifestyle** (NOT Dating)

---

## 🍎 Apple App Store (iOS)

### Step 1: Update Version in Xcode

1. Open Xcode
2. Open `~/Desktop/AstroMatch1/ios/App/App.xcworkspace`
3. Select the **App** target in the project navigator
4. Go to **General** tab
5. Update **Version** to `1.0.1` (or increment)
6. Update **Build** number (increment by 1)

### Step 2: Configure Signing & Capabilities

1. In Xcode, select **App** target
2. Go to **Signing & Capabilities** tab
3. Ensure:
   - ✅ **Automatically manage signing** is checked
   - ✅ Your **Team** is selected
   - ✅ **Sign in with Apple** capability is enabled
   - ✅ **Bundle Identifier** matches your App ID in Apple Developer

### Step 3: Build Archive

1. In Xcode, select **Any iOS Device** (or your device) as the target
2. Go to **Product** → **Archive**
3. Wait for archive to build (this may take several minutes)

### Step 4: Upload to App Store Connect

1. When archive completes, **Organizer** window will open
2. Select your archive
3. Click **Distribute App**
4. Choose **App Store Connect**
5. Click **Next**
6. Choose **Upload**
7. Click **Next**
8. Select your distribution certificate and provisioning profile
9. Click **Next**
10. Review options, click **Upload**
11. Wait for upload to complete

### Step 5: Create/Update Release in App Store Connect

1. Go to [App Store Connect](https://appstoreconnect.apple.com)
2. Select your app (AstroMatch)
3. Go to **App Store** tab
4. Click **+ Version** (or edit existing version)
5. Fill in version information:
   - **Version:** 1.0.1
   - **What's New in This Version:**
     ```
     • Fixed Sign in with Apple authentication issues
     • Removed external links to improve in-app experience
     • Enhanced app stability and performance
     • Updated app branding and descriptions
     ```
6. **Important:** Update your app description using content from `APP_STORE_ASTROLOGY_POSITIONING.md`

### Step 6: Update App Store Listing

**Use content from:** `APP_STORE_ASTROLOGY_POSITIONING.md`

**Key Updates:**
- **Title:** "AstroMatch - Astrology Matchmaking"
- **Subtitle:** "Cosmic Compatibility Matching"
- **Category:** **Lifestyle** (NOT Dating)
- **Description:** Use the full description from the positioning guide
- **Keywords:** astrology,zodiac,compatibility,horoscope,cosmic,matchmaking

### Step 7: Submit for Review

1. Scroll down and fill in all required fields
2. Upload screenshots if needed
3. Answer compliance questions
4. Click **Submit for Review**
5. Add notes for reviewers:
   ```
   This is an astrology compatibility and matchmaking platform, not a traditional dating app.
   
   Key differentiators:
   - 144 unique Western + Chinese zodiac combinations
   - Vedic astrology integration
   - Educational AstroLab content
   - Focus on cosmic compatibility analysis
   
   We've fixed the Sign in with Apple authentication error and removed all external links.
   ```

---

## 📝 Important Notes

### Google Play (10/14 days testing)
- ✅ Chrome issue fixed - testers should confirm no Chrome appears
- Update your closed testing track
- Testers need to verify fixes before production release

### Apple App Store
- ⚠️ Address Guideline 4.3(b) in your submission
- Emphasize astrology platform positioning
- Use the review notes template if they mention "dating app" concerns

### Both Stores
- Make sure to use updated descriptions emphasizing astrology
- Category should be **Lifestyle**, not Dating
- Highlight unique features (144 combinations, Vedic astrology, etc.)

---

## 🚀 Quick Commands

### Android Build
```bash
cd ~/Desktop/AstroMatch1/android
./gradlew bundleRelease
# AAB will be in: app/build/outputs/bundle/release/app-release.aab
```

### iOS Build (Manual in Xcode)
- Open `ios/App/App.xcworkspace`
- Product → Archive
- Distribute App → App Store Connect

---

## ✅ Post-Deployment

After submitting:
1. Monitor review status in both stores
2. Respond promptly to any reviewer questions
3. For Google Play: Confirm with testers that Chrome issue is fixed
4. For Apple: Be ready to address 4.3(b) concerns with positioning arguments

---

**Good luck with your submissions!** 🍀
