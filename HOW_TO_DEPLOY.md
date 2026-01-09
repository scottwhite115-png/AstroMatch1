# How to Deploy AstroMatch to Stores

## ✅ What I've Done Automatically:
1. ✅ Incremented version to 1.0.4 (versionCode 5)
2. ✅ Built Next.js app
3. ✅ Synced Capacitor for Android
4. ✅ Synced Capacitor for iOS

---

## 📱 For Google Play Store

### Option 1: Build in Terminal (If you have Android SDK installed)
If the AAB file was created, you can find it at:
```
~/Desktop/AstroMatch1/android/app/build/outputs/bundle/release/app-release.aab
```

### Option 2: Build in Android Studio (Easier if you're not familiar with terminal)

1. **Open Android Studio**
   - If you don't have it: Download from https://developer.android.com/studio

2. **Open the Project**
   - File → Open
   - Navigate to: `~/Desktop/AstroMatch1/android`
   - Click "Open"

3. **Build the App Bundle**
   - Wait for Gradle to sync (bottom status bar)
   - Go to: **Build → Generate Signed Bundle / APK**
   - Select: **Android App Bundle**
   - Click **Next**
   - Select your keystore (you should already have one set up)
   - Enter your keystore password
   - Click **Next**
   - Select **release** build variant
   - Click **Create**
   - The AAB file will be saved (usually in the same folder as above)

4. **Upload to Google Play Console**
   - Go to: https://play.google.com/console
   - Select your AstroMatch app
   - Go to **Production** (or your testing track)
   - Click **Create new release**
   - Upload the `.aab` file you just created
   - Add release notes (e.g., "Added native splash screen and onboarding flow")
   - Click **Review release**
   - Click **Start rollout to Production**

---

## 🍎 For Apple App Store

1. **Open Xcode**
   - If you don't have it: Download from Mac App Store (free)

2. **Open the Project**
   - In terminal, run: `cd ~/Desktop/AstroMatch1 && npx cap open ios`
   - OR manually: Open Xcode → File → Open → Navigate to `~/Desktop/AstroMatch1/ios`

3. **Configure Signing**
   - In Xcode, select the **AstroMatch** project (left sidebar, blue icon)
   - Select the **AstroMatch** target
   - Go to **Signing & Capabilities** tab
   - Check **Automatically manage signing**
   - Select your **Team** (your Apple Developer account)

4. **Update Version (if needed)**
   - In the same **Signing & Capabilities** screen
   - Make sure Version matches Android (1.0.4)
   - Build number should be 5 (or higher)

5. **Build and Archive**
   - At the top of Xcode, select **Any iOS Device** (not a simulator)
   - Go to: **Product → Archive**
   - Wait for the archive to build (this takes a few minutes)

6. **Upload to App Store Connect**
   - The Organizer window should open automatically
   - If not: **Window → Organizer** (or press Cmd+Shift+9)
   - Select your archive
   - Click **Distribute App**
   - Select **App Store Connect**
   - Click **Next**
   - Select **Upload**
   - Click **Next**
   - Follow the wizard (usually just keep clicking Next)
   - Wait for upload to complete

7. **Submit for Review**
   - Go to: https://appstoreconnect.apple.com
   - Select your app
   - Go to the new build
   - Fill in the submission details
   - Submit for review

---

## 📝 Release Notes Suggestions

### Google Play Store:
```
New in version 1.0.4:
- Added native splash screen for faster app launch
- New onboarding walkthrough to help you get started
- Improved app structure for better performance
- Enhanced user experience with native Android screens
```

### Apple App Store:
```
What's New in Version 1.0.4:
- Native splash screen for faster launch
- New onboarding experience
- Performance improvements
- Enhanced user interface
```

---

## ⚠️ Important Notes

- **Version Numbers**: Already updated to 1.0.4 (versionCode 5)
- **Testing**: Make sure to test the new flow (Splash → Onboarding → Start → App) before submitting
- **Signing**: Your Android keystore should already be configured. For iOS, you'll need an Apple Developer account ($99/year)
- **Review Time**: Google Play usually reviews in 1-3 days. Apple usually takes 1-7 days.

---

## 🆘 Need Help?

If you run into issues:
- **Android Studio**: Make sure you have the latest version and Android SDK installed
- **Xcode**: Make sure you have the latest version and an active Apple Developer account
- **Signing Issues**: Check that your keystore/credentials are properly configured

