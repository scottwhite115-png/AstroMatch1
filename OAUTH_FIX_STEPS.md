# Step-by-Step: Fix Google OAuth In-App Browser Issue

## Overview
This guide will walk you through:
1. Verifying Google OAuth Console configuration
2. Rebuilding the Android app with the fixes
3. Testing the OAuth flow
4. Uploading to Play Console

---

## Step 1: Verify Google OAuth Console Redirect URIs

**Why:** Google needs to know which URLs are allowed for OAuth callbacks. We need to ensure both callback paths are registered.

### 1.1 Open Google Cloud Console
1. Go to: **https://console.cloud.google.com/**
2. Sign in with your Google account
3. Select your project (or create one if needed)

### 1.2 Navigate to OAuth Credentials
1. In the left sidebar, click **"APIs & Services"** → **"Credentials"**
2. Find your **OAuth 2.0 Client ID** (it might be named "AstroMatch Web" or similar)
3. Click on it to edit

### 1.3 Add/Verify Redirect URIs
Under **"Authorized redirect URIs"**, make sure you have BOTH of these:

```
https://astro-match1.vercel.app/auth/callback
https://astro-match1.vercel.app/auth/callback-mobile
```

**If either is missing:**
1. Click **"+ ADD URI"**
2. Paste the missing URL
3. Click **"Save"** at the bottom

**✅ Checkpoint:** Both redirect URIs should now be listed.

---

## Step 2: Sync Capacitor and Rebuild

**Why:** We need to sync the code changes to the native Android project and rebuild.

### 2.1 Navigate to Project Directory
```bash
cd /Users/scottwhite/Desktop/AstroMatch1
```

### 2.2 Build Next.js App
```bash
npm run build
```
This compiles your Next.js app. Wait for it to complete (should see "Compiled successfully").

### 2.3 Sync Capacitor
```bash
npx cap sync android
```
This syncs your web code and the new Capacitor utility to the Android project.

**✅ Checkpoint:** You should see "Sync complete" or similar message.

---

## Step 3: Open in Android Studio

### 3.1 Open Android Studio
1. Open Android Studio
2. If a project is already open, close it (File → Close Project)

### 3.2 Open the Android Project
1. Click **"Open"** or **File → Open**
2. Navigate to: `/Users/scottwhite/Desktop/AstroMatch1/android`
3. Click **"OK"** or **"Open"**

### 3.3 Wait for Gradle Sync
- Android Studio will automatically sync Gradle
- Wait for it to finish (you'll see "Gradle sync finished" at the bottom)
- This may take 1-2 minutes

**✅ Checkpoint:** Android Studio should show "Gradle sync finished" with no errors.

---

## Step 4: Build the AAB (Android App Bundle)

### 4.1 Open Terminal in Android Studio
1. Look at the bottom of Android Studio
2. Click the **"Terminal"** tab
3. Or: **View → Tool Windows → Terminal**

### 4.2 Build the Release AAB
In the terminal, run:
```bash
cd android
./gradlew bundleRelease
```

**What this does:**
- Builds a release version of your app
- Creates an AAB file ready for Play Console
- Takes 1-3 minutes

### 4.3 Wait for Build to Complete
You'll see:
```
BUILD SUCCESSFUL in Xm Xs
```

**✅ Checkpoint:** You should see "BUILD SUCCESSFUL" message.

### 4.4 Locate the AAB File
The AAB file will be at:
```
/Users/scottwhite/Desktop/AstroMatch1/android/app/build/outputs/bundle/release/app-release.aab
```

**To find it:**
1. In Android Studio: **File → Open**
2. Navigate to: `android/app/build/outputs/bundle/release/`
3. You should see `app-release.aab`

**✅ Checkpoint:** You have the AAB file ready.

---

## Step 5: Test on Device (Optional but Recommended)

**Why:** Test that OAuth now opens in-app browser instead of Chrome.

### 5.1 Install on Device
1. Connect your Android device via USB
2. Enable USB debugging on your device
3. In Android Studio, click the **"Run"** button (green play icon)
4. Select your device
5. Wait for app to install and launch

### 5.2 Test OAuth Flow
1. Open the app on your device
2. Go to Sign In or Sign Up page
3. Click **"Sign in with Google"** or **"Sign up with Google"**
4. **Expected behavior:**
   - ✅ Opens in an in-app browser (looks like a browser but stays in the app)
   - ✅ After signing in, returns to the app automatically
   - ❌ Should NOT open Chrome browser
   - ❌ Should NOT get stuck in Chrome

**✅ Checkpoint:** OAuth should open in-app browser and return to app.

---

## Step 6: Upload to Google Play Console

### 6.1 Open Play Console
1. Go to: **https://play.google.com/console**
2. Sign in with your developer account
3. Select your app: **AstroMatch**

### 6.2 Navigate to Release
1. In the left sidebar, click **"Release"** → **"Production"** (or **"Testing"** → **"Closed testing"**)
2. Click **"Create new release"** (or **"Edit release"** if updating)

### 6.3 Upload AAB
1. Under **"App bundles and APKs"**, click **"Upload"**
2. Navigate to: `/Users/scottwhite/Desktop/AstroMatch1/android/app/build/outputs/bundle/release/`
3. Select `app-release.aab`
4. Wait for upload to complete

### 6.4 Add Release Notes
1. Scroll down to **"Release notes"**
2. Add a note like:
   ```
   Fixed Google OAuth to use in-app browser instead of Chrome
   - OAuth now opens in-app browser (Chrome Custom Tabs)
   - Users no longer get stuck in Chrome after signing in
   - Improved OAuth callback handling
   ```

### 6.5 Review and Rollout
1. Review the release
2. Click **"Save"** (for draft) or **"Review release"** (to publish)
3. Follow the prompts to complete the release

**✅ Checkpoint:** New version uploaded to Play Console.

---

## Step 7: Notify Your Tester

Once the update is available in Play Console:

1. Message your tester (Reda Timi) on Fiverr
2. Let them know:
   - New version is available
   - Google OAuth should now open in-app browser
   - Ask them to test and confirm it no longer opens Chrome

---

## Troubleshooting

### If OAuth Still Opens Chrome:

1. **Check Capacitor Detection:**
   - Add console logs in the app
   - Verify `isCapacitor()` returns `true` on device

2. **Verify Browser Plugin:**
   ```bash
   npm list @capacitor/browser
   ```
   Should show version 8.0.0 or similar

3. **Check Deep Links:**
   - Verify AndroidManifest.xml has both callback paths
   - File: `android/app/src/main/AndroidManifest.xml`

4. **Rebuild from Scratch:**
   ```bash
   cd /Users/scottwhite/Desktop/AstroMatch1
   rm -rf android/app/build
   npm run build
   npx cap sync android
   ```
   Then rebuild in Android Studio

### If Build Fails:

1. **Clean Build:**
   ```bash
   cd android
   ./gradlew clean
   ./gradlew bundleRelease
   ```

2. **Check Gradle Sync:**
   - In Android Studio: **File → Sync Project with Gradle Files**

3. **Check for Errors:**
   - Look at the "Build" tab at the bottom of Android Studio
   - Fix any red error messages

---

## Summary Checklist

- [ ] Verified Google OAuth Console has both redirect URIs
- [ ] Built Next.js app (`npm run build`)
- [ ] Synced Capacitor (`npx cap sync android`)
- [ ] Opened Android project in Android Studio
- [ ] Built AAB (`./gradlew bundleRelease`)
- [ ] Tested on device (optional)
- [ ] Uploaded AAB to Play Console
- [ ] Notified tester

---

## Quick Reference Commands

```bash
# Navigate to project
cd /Users/scottwhite/Desktop/AstroMatch1

# Build Next.js
npm run build

# Sync Capacitor
npx cap sync android

# Build AAB (in Android Studio terminal)
cd android
./gradlew bundleRelease
```

---

**Need help with any step?** Let me know which step you're on and I'll guide you through it!

