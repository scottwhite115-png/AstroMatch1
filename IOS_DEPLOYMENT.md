# iOS Deployment Guide for AstroMatch

## ✅ What's Already Done:
- ✅ Capacitor synced for iOS
- ✅ Version set to 1.0.5 (matches Android)
- ✅ Build number set to 6 (matches Android)
- ✅ OAuth fixes included (in-app browser for Google/Apple sign-in)

---

## 🍎 Step-by-Step: Deploy to Apple App Store

### Step 1: Open the iOS Project in Xcode

**Option A: Using Terminal (Easiest)**
1. Open Terminal (Applications → Utilities → Terminal)
2. Copy and paste this command, then press Enter:
   ```bash
   cd ~/Desktop/AstroMatch1 && npx cap open ios
   ```
3. Xcode should open automatically

**Option B: Manual Opening**
1. Open Xcode
2. File → Open
3. Navigate to: `~/Desktop/AstroMatch1/ios`
4. Select the `App` folder (or the `.xcworkspace` file if you see it)
5. Click Open

---

### Step 2: Configure Signing & Capabilities

1. In Xcode's left sidebar, click on the blue **App** icon (at the very top)
2. In the main area, click on the **App** target (under "TARGETS" - should be selected by default)
3. Click the **Signing & Capabilities** tab at the top
4. Check the box that says **"Automatically manage signing"**
5. Under **Team**, select your Apple Developer account
   - If you don't see your team, click "Add Account..." and sign in with your Apple ID
   - You'll need an Apple Developer account ($99/year)

---

### Step 3: Verify Version Number

1. Still in the **Signing & Capabilities** tab
2. Check that:
   - **Version**: `1.0.5` (should match Android)
   - **Build**: `6` (should match Android versionCode)
   - ✅ These are already set correctly!

---

### Step 4: Select Build Target

At the very top of Xcode (next to the Play/Stop buttons), you'll see a device selector.

1. Click on it (it might say "App" or a device name)
2. Select **"Any iOS Device"** or **"Generic iOS Device"**
   - ⚠️ IMPORTANT: Do NOT select a simulator (like "iPhone 15 Pro")
   - You MUST select a real device or "Any iOS Device" to create an archive

---

### Step 5: Create Archive

1. In the top menu bar, go to: **Product → Archive**
2. Wait for the build to complete (this can take 5-10 minutes)
   - You'll see progress in the top center of Xcode
   - A progress bar will appear
3. When complete, the **Organizer** window will open automatically
   - If it doesn't open: **Window → Organizer** (or press `Cmd+Shift+9`)

---

### Step 6: Upload to App Store Connect

1. In the Organizer window, you should see your archive listed
2. Select your archive (click on it)
3. Click the **"Distribute App"** button (blue button on the right)
4. In the dialog that appears:
   - Select **"App Store Connect"**
   - Click **Next**
5. Select **"Upload"**
   - (Don't select "Export" unless you know you need it)
   - Click **Next**
6. Distribution options:
   - Leave everything as default (usually)
   - Click **Next**
7. Signing options:
   - Usually "Automatically manage signing" is fine
   - Click **Next**
8. Review:
   - Review the summary
   - Click **Upload**
9. Wait for upload to complete (can take 5-15 minutes)
   - You'll see progress in Xcode
   - Don't close Xcode during this time

---

### Step 7: Submit for Review in App Store Connect

1. Go to: https://appstoreconnect.apple.com
2. Sign in with your Apple ID
3. Click **"My Apps"**
4. Select **AstroMatch** (or create the app if it doesn't exist)
5. Go to the version you want to submit (or create a new version)
6. Under **"Build"**, click **"Select a build before you submit your app"**
   - Your uploaded build should appear here (may take 5-30 minutes to appear)
   - If it doesn't appear, wait a bit and refresh
7. Select your build (version 1.0.5, build 6)
8. Fill in the required information:
   - **What's New in This Version** (see suggestions below)
   - Screenshots (if needed)
   - App description, keywords, etc. (if this is a new version)
9. Answer the export compliance questions (usually "No" unless you use encryption)
10. Click **"Submit for Review"**

---

## 📝 Release Notes Suggestion

**What's New in This Version:**
```
• Fixed Google OAuth to use in-app browser instead of Safari
• OAuth sign-in now stays within the app for better user experience
• Improved authentication flow for Google and Apple sign-in
• Enhanced app stability and performance
```

---

## ⚠️ Common Issues & Solutions

### "No signing certificate found"
- Make sure you have an active Apple Developer account
- Go to Signing & Capabilities → Team → Add Account
- Sign in with your Apple ID that has a developer account

### "Archive" option is grayed out
- Make sure you selected "Any iOS Device" (not a simulator)
- Clean build folder: Product → Clean Build Folder (Shift+Cmd+K)
- Try again

### Build fails with errors
- Make sure Capacitor is synced: `npx cap sync ios` in terminal
- Check for any red error messages in Xcode
- Try Product → Clean Build Folder, then Archive again

### Upload fails
- Check your internet connection
- Make sure you're signed in to App Store Connect with the same Apple ID
- Try the upload again

### Build doesn't appear in App Store Connect
- Wait 15-30 minutes (it takes time to process)
- Refresh the page
- Check that the upload completed successfully in Xcode

---

## ⏱️ Timeline Expectations

- **Google Play Review**: Usually 1-3 days
- **Apple App Store Review**: Usually 1-7 days (often 2-3 days)

---

## 🎉 Once Approved

Both stores will notify you when your app is approved and available!

