# iOS App Store Update Guide - Google OAuth & Splash Screen

## ✅ What Has Been Completed

1. **iOS URL Scheme Configuration** - Added `astromatch://` URL scheme to `Info.plist` for OAuth callbacks
2. **Capacitor Sync** - Synced all Capacitor changes to iOS project
3. **Splash Screen** - Already configured in `capacitor.config.ts` and assets exist
4. **OAuth Callback Handler** - The `app/auth/callback-mobile/page.tsx` is ready for iOS

## 📋 Pre-Build Checklist

Before building, verify these items:

### 1. Verify Supabase OAuth Callback URLs

You need to ensure your Supabase project has the iOS callback URL registered:

**Required Callback URLs in Supabase Dashboard:**
- `astromatch://auth/callback-mobile`
- `https://astro-match1.vercel.app/auth/callback-mobile`

**Steps:**
1. Go to your Supabase Dashboard
2. Navigate to: Authentication → URL Configuration
3. Add these URLs to "Redirect URLs" if not already present:
   - `astromatch://auth/callback-mobile`
   - `https://astro-match1.vercel.app/auth/callback-mobile`

### 2. Check Version Numbers

You need to increment the version number for the App Store submission.

**In Xcode:**
- Open `ios/App/App.xcworkspace` (or `.xcodeproj`)
- Select the project in the navigator
- Go to the "General" tab
- Increment:
  - **Version**: e.g., `1.0.1` (or next version)
  - **Build**: e.g., `2` (increment from previous build)

## 🔨 Build Steps

### Step 1: Open Xcode Project

```bash
cd /Users/scottwhite/Desktop/AstroMatch1
open ios/App/App.xcworkspace
```

**Note:** Use `.xcworkspace` if it exists, otherwise use `.xcodeproj`

### Step 2: Configure Signing & Capabilities

In Xcode:

1. **Select the Project** in the navigator (top item)
2. **Select the "App" target** (under TARGETS)
3. **Go to "Signing & Capabilities" tab**
4. **Verify/Set:**
   - ✅ Team: Select your Apple Developer team
   - ✅ Bundle Identifier: `com.astromatch.ios` (should match your App Store Connect app)
   - ✅ Automatically manage signing: ✅ Enabled
   - ✅ Provisioning Profile: Should be auto-generated

### Step 3: Set Build Configuration to Release

1. **Product → Scheme → Edit Scheme...**
2. **Select "Run"** in the left sidebar
3. **Set "Build Configuration"** to **"Release"**
4. Click **"Close"**

### Step 4: Select Build Target

1. **In the toolbar**, click the device selector (next to the play button)
2. **Select "Any iOS Device"** (not a simulator)
   - This is required for App Store builds

### Step 5: Build and Archive

1. **Product → Archive**
2. **Wait for the build to complete** (this may take several minutes)
3. **If successful**, the Organizer window will open automatically
   - If it doesn't: **Window → Organizer**

### Step 6: Verify Archive

In the Organizer window:

1. **Verify your archive appears** in the list
2. **Check the version and build numbers** match what you set
3. **Note the date/time** of the archive

## 📤 App Store Submission Steps

### Step 1: Distribute Archive

In Xcode Organizer:

1. **Select your archive**
2. **Click "Distribute App"**
3. **Select "App Store Connect"**
4. **Click "Next"**
5. **Select "Upload"** (not "Export")
6. **Click "Next"**

### Step 2: Configure Distribution Options

1. **Distribution options:**
   - ✅ Include bitcode (if available)
   - ✅ Upload your app's symbols (recommended)
2. **Click "Next"**

### Step 3: Select Signing Method

1. **Select "Automatically manage signing"** (recommended)
   - Xcode will handle certificates and provisioning profiles
2. **Click "Next"**

### Step 4: Review and Upload

1. **Review the summary:**
   - App name: AstroMatch
   - Bundle ID: com.astromatch.ios
   - Version: (your version number)
   - Build: (your build number)
2. **Click "Upload"**
3. **Wait for upload to complete** (5-15 minutes typically)
4. **Click "Done"** when finished

### Step 5: Wait for Processing

1. **Go to App Store Connect**: https://appstoreconnect.apple.com
2. **Navigate to:** My Apps → AstroMatch
3. **Go to:** App Store → iOS App
4. **Wait for processing** (usually 10-30 minutes)
   - You'll see a yellow "Processing" status
   - When ready, it will show "Ready to Submit" or appear in TestFlight

## 🧪 Testing Before Submission (Recommended)

### Option 1: TestFlight (Recommended)

1. **After upload completes**, go to App Store Connect
2. **Navigate to:** TestFlight tab
3. **Add internal testers** (yourself)
4. **Install TestFlight app** on your iPhone
5. **Test the Google OAuth flow:**
   - Sign up with Google
   - Sign in with Google
   - Verify it works with the in-app browser
   - Verify splash screen appears

### Option 2: Ad Hoc Distribution (Advanced)

If you need to test before TestFlight:
1. In Organizer, select "Ad Hoc" instead of "App Store Connect"
2. Requires device UDIDs registered in your developer account

## 📝 App Store Connect Submission

### Step 1: Prepare Submission

1. **Go to App Store Connect**
2. **Navigate to:** My Apps → AstroMatch → App Store tab
3. **Select the version** you want to submit (or create new version)

### Step 2: What's New in This Version

**Update the "What's New in This Version" section:**

```
Bug fixes and improvements:
- Fixed Google OAuth sign-in and sign-up flow for mobile devices
- Improved OAuth authentication with in-app browser support
- Added splash screen for better app launch experience
- Enhanced mobile authentication experience
```

### Step 3: Submit for Review

1. **Scroll to the bottom** of the version page
2. **Click "Add for Review"** or "Submit for Review"
3. **Answer any questions:**
   - Export compliance (usually "No" unless you use encryption)
   - Content rights (usually "Yes, I have rights")
4. **Click "Submit"**

## ✅ Post-Submission Checklist

- [ ] Submission shows "Waiting for Review" status
- [ ] You receive email confirmation from Apple
- [ ] Monitor App Store Connect for updates
- [ ] Respond promptly to any reviewer questions

## 🔍 What to Test After Update

Once the update is live, verify:

1. **Google Sign-In:**
   - [ ] Opens in in-app browser (not external Safari)
   - [ ] Returns to app after authentication
   - [ ] User is logged in successfully

2. **Google Sign-Up:**
   - [ ] Same as sign-in flow
   - [ ] Profile creation works after OAuth

3. **Splash Screen:**
   - [ ] Appears on launch
   - [ ] Shows for ~2 seconds
   - [ ] Transitions smoothly to app

## 🆘 Troubleshooting

### Build Errors

**"No provisioning profiles found"**
- Solution: In Xcode, go to Signing & Capabilities, select your team, enable automatic signing

**"Archive not showing in Organizer"**
- Solution: Make sure you selected "Any iOS Device" before archiving

**"Upload failed"**
- Solution: Check your internet connection, try again. Verify your Apple Developer account is active.

### OAuth Not Working

**Google OAuth opens in external browser:**
- Verify `@capacitor/browser` is installed: `npm list @capacitor/browser`
- Check that `Info.plist` has the URL scheme configured (already done)
- Verify Supabase callback URLs include `astromatch://auth/callback-mobile`

**OAuth callback not returning to app:**
- Check Supabase redirect URLs are correct
- Verify URL scheme in Info.plist matches `capacitor.config.ts` (should be `astromatch`)

## 📞 Support Resources

- **Apple Developer Support**: https://developer.apple.com/support/
- **App Store Connect Help**: https://help.apple.com/app-store-connect/
- **Capacitor iOS Docs**: https://capacitorjs.com/docs/ios

---

## 🎯 Quick Summary

**What Changed:**
- ✅ Added iOS URL scheme for OAuth callbacks (`astromatch://`)
- ✅ Synced Capacitor changes (splash screen, OAuth fixes)
- ✅ Verified all dependencies are installed

**What You Need to Do:**
1. ✅ Verify Supabase callback URLs
2. ✅ Open Xcode and increment version number
3. ✅ Build and archive the app
4. ✅ Upload to App Store Connect
5. ✅ Test via TestFlight (recommended)
6. ✅ Submit for review

**Estimated Time:**
- Build & Upload: 30-60 minutes
- Processing: 10-30 minutes
- Testing: 30-60 minutes
- Total: ~2-3 hours

Good luck with your submission! 🚀

