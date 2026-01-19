# 🚀 Walkthrough: Build & Upload AAB - Start Here!

## Your Keystore Info (I Found This For You!)

Based on your `key.properties` file:
- **Keystore file**: `astromatch-release-key.keystore`
- **Key alias**: `astromatch`
- **Store password**: `astromatch2024`
- **Key password**: `astromatch2024`

The keystore file should be in: `/Users/scottwhite/Desktop/AstroMatch1/android/app/`

---

## 📋 Quick Start - Follow These Steps

### STEP 1: Open Android Studio

1. Open **Android Studio** on your Mac
2. If you see the welcome screen, click **"Open"**
3. If Android Studio is already open, go to **File → Open**

---

### STEP 2: Open Your Project

1. Navigate to this folder:
   ```
   /Users/scottwhite/Desktop/AstroMatch1/android
   ```
   
2. **Important**: Select the `android` folder (the one that contains `app` and `gradle` folders)

3. Click **"Open"**

4. **Wait for Gradle Sync** (1-3 minutes)
   - You'll see "Gradle Sync" in the bottom status bar
   - Wait until it says "Gradle sync finished"

---

### STEP 3: Generate Signed Bundle

1. Click **"Build"** in the top menu
2. Select **"Generate Signed Bundle / APK"**
3. In the dialog:
   - Select **"Android App Bundle"** (not APK)
   - Click **"Next"**

---

### STEP 4: Enter Keystore Info

1. **Keystore path**: 
   - Click the folder icon 📁
   - Navigate to: `/Users/scottwhite/Desktop/AstroMatch1/android/app/`
   - Select: `astromatch-release-key.keystore`
   - (If you can't find it, let me know and we'll locate it)

2. **Key store password**: 
   ```
   astromatch2024
   ```

3. **Key alias**: 
   ```
   astromatch
   ```

4. **Key password**: 
   ```
   astromatch2024
   ```

5. Click **"Next"**

---

### STEP 5: Select Release Build

1. Under **"Build Variant"**, select: **"release"**
2. Make sure both signature versions are checked:
   - ✅ V1 (Jar Signature)
   - ✅ V2 (Full APK Signature)
3. Click **"Finish"**

---

### STEP 6: Wait for Build

- Wait 30-60 seconds for the build to complete
- You'll see a notification when done

---

### STEP 7: Find Your AAB

The AAB file will be at:
```
/Users/scottwhite/Desktop/AstroMatch1/android/app/release/app-release.aab
```

Or Android Studio will show a notification with a "locate" button.

---

### STEP 8: Upload to Google Play Console

1. Go to: https://play.google.com/console
2. Select **"AstroMatch"**
3. Go to **Testing → Internal testing** (or your testing track)
4. Click **"Create new release"**
5. Click **"Upload"** → Select `app-release.aab`
6. **Release notes**:
   ```
   Fixed Google OAuth sign-in to work within the app instead of opening external browser.
   - OAuth now opens in in-app browser (not Chrome)
   - Users automatically return to app after sign-in
   - No longer stuck in Chrome browser
   - Version 1.0.2
   ```
7. Click **"Review release"** → **"Start rollout"**

---

## ✅ That's It!

Your AAB will be uploaded and testers can download the update.

---

## 🆘 If You Get Stuck

**Tell me which step you're on and what you see**, and I'll help you through it!

Common issues:
- **"Keystore not found"** → We'll locate it together
- **"Gradle sync failed"** → We'll fix the sync issue
- **"Build failed"** → We'll check the error message

---

## 📝 Detailed Instructions

For more detailed step-by-step instructions with screenshots descriptions, see:
- `STEP_BY_STEP_BUILD.md` - Complete detailed walkthrough

