# 🚀 Quick Launch Steps - Start Here!

## TODAY (2-3 hours):

### Step 1: Fix App Icons (30 min)
```bash
# 1. Go to https://www.appicon.co/
# 2. Upload this file:
#    /Users/scottwhite/Desktop/AstroMatch1/ios/App/App/Assets.xcassets/AppIcon.appiconset/ChatGPT Image Dec 25, 2025, 03_48_27 PM.png
# 3. Download the generated icon pack
# 4. Replace all files in:
#    /Users/scottwhite/Desktop/AstroMatch1/ios/App/App/Assets.xcassets/AppIcon.appiconset/
```

### Step 2: Take Screenshots (1 hour)
```bash
# Open Xcode
open /Users/scottwhite/Desktop/AstroMatch1/ios/App/App.xcworkspace

# In Xcode:
# 1. Select iPhone 15 Pro Max simulator
# 2. Product → Run (Cmd + R)
# 3. Navigate through app and take screenshots (Cmd + S)
# 4. Take 5-10 screenshots showing:
#    - Matches page with profiles
#    - Profile detail view
#    - Messages list
#    - Chat conversation
#    - Account settings
```

### Step 3: Create Privacy Policy (30 min)
```bash
# 1. Go to https://www.privacypolicygenerator.info/
# 2. Fill in:
#    - App Name: AstroMatch
#    - Website: https://astro-match1.vercel.app
#    - Data collected: Email, Birth Date, Location, Photos
#    - Purpose: Dating/Matching
# 3. Generate policy
# 4. Create a Notion page and paste policy
# 5. Make page public
# 6. Save the URL
```

### Step 4: Verify Database (30 min)
```bash
# 1. Go to https://supabase.com/dashboard
# 2. Select your production project
# 3. Go to SQL Editor
# 4. Run this query:

SELECT column_name, column_default
FROM information_schema.columns
WHERE table_name = 'profiles'
AND column_name LIKE 'allow_instant%';

# Should show:
# - allow_instant_messages_connections (default: true)
# - allow_instant_messages_discover (default: true)

# 5. Check pass expiry:
SELECT column_default
FROM information_schema.columns
WHERE table_name = 'passes'
AND column_name = 'expires_at';

# Should show: NOW() + '7 days'::interval

# If missing, run migrations from:
# /Users/scottwhite/Desktop/AstroMatch1/supabase/migrations/
```

---

## TOMORROW (3-4 hours):

### Step 5: Apple Developer Account
```bash
# 1. Go to https://developer.apple.com/programs/
# 2. Enroll in Apple Developer Program ($99/year)
# 3. Wait for approval (usually same day)
```

### Step 6: App Store Connect Setup
```bash
# 1. Go to https://appstoreconnect.apple.com
# 2. Click "My Apps" → "+" → "New App"
# 3. Fill in:
#    - Platform: iOS
#    - Name: AstroMatch
#    - Bundle ID: com.astromatch.app
#    - SKU: astromatch-001
# 4. Upload screenshots
# 5. Add app description (see APP_STORE_LAUNCH_CHECKLIST.md)
# 6. Add privacy policy URL
# 7. Set age rating: 17+ (dating app)
# 8. Set pricing: Free
```

### Step 7: Test on Physical Device
```bash
# 1. Connect iPhone to Mac
# 2. Open Xcode
open /Users/scottwhite/Desktop/AstroMatch1/ios/App/App.xcworkspace

# 3. Select your iPhone as target
# 4. Product → Run (Cmd + R)
# 5. Test all features (see checklist)
```

---

## DAY 3 (2-3 hours):

### Step 8: Build & Archive
```bash
# In Xcode:
# 1. Product → Scheme → Edit Scheme
# 2. Set Build Configuration to "Release"
# 3. Select "Any iOS Device (arm64)" as target
# 4. Product → Archive
# 5. Wait for build (5-10 min)
```

### Step 9: Upload to App Store
```bash
# In Xcode Organizer:
# 1. Window → Organizer
# 2. Select your archive
# 3. Click "Distribute App"
# 4. Select "App Store Connect"
# 5. Click "Upload"
# 6. Wait for processing (10-30 min)
```

### Step 10: Submit for Review
```bash
# In App Store Connect:
# 1. Go to your app
# 2. Select version 1.0
# 3. Click "Add for Review"
# 4. Answer questions
# 5. Click "Submit"
```

---

## REVIEW (1-2 days):

Apple will review your app. You'll get an email when:
- ✅ **Approved** - App goes live!
- ❌ **Rejected** - Fix issues and resubmit

---

## 📞 Quick Support:

**Xcode Issues:**
- Clean build folder: Cmd + Shift + K
- Reset simulator: Device → Erase All Content and Settings

**Signing Issues:**
- Xcode → Preferences → Accounts → Add Apple ID
- Select team in Signing & Capabilities

**Build Errors:**
```bash
cd /Users/scottwhite/Desktop/AstroMatch1
npx cap sync ios
```

---

## ✅ Checklist Progress:

- [ ] App icons generated and installed
- [ ] Screenshots taken (5-10 images)
- [ ] Privacy policy created and hosted
- [ ] Database migrations verified
- [ ] Apple Developer account active
- [ ] App Store Connect listing created
- [ ] Tested on physical device
- [ ] Archive created in Xcode
- [ ] Uploaded to App Store Connect
- [ ] Submitted for review

---

## 🎯 Next Steps After Approval:

1. **Announce Launch**
   - Social media posts
   - Email to friends/testers
   - Product Hunt launch

2. **Monitor**
   - Check reviews daily
   - Respond to user feedback
   - Monitor crash reports

3. **Update**
   - Fix bugs quickly
   - Add new features
   - Keep improving

**You're almost there! 🚀**

