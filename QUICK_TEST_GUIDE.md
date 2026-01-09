# Quick Local Testing Guide

## Testing the Onboarding Screen

### Option 1: Android Studio (Recommended)
1. Android Studio should be opening now (or run: `npx cap open android`)
2. Wait for Gradle sync to complete
3. Connect an Android device via USB (with USB debugging enabled) OR start an emulator
4. Click the "Run" button (green play icon) or press `Shift+F10`
5. The app will install and launch
6. **You should see the native onboarding screen first!**

### Option 2: Build APK and Install Manually
```bash
cd android
./gradlew assembleDebug
```
Then install the APK from: `android/app/build/outputs/apk/debug/app-debug.apk`

### To Test Onboarding Again:
After the first launch, to see onboarding again:
- **On Device/Emulator**: Settings → Apps → AstroMatch → Storage → Clear Data
- Or uninstall and reinstall the app

### What to Look For:
✅ Native onboarding screen appears on first launch  
✅ "Get Started" button is visible and clickable  
✅ After clicking "Get Started", your app loads  
✅ Onboarding doesn't appear on subsequent launches  
✅ OAuth deep links still work (test by triggering OAuth flow)

## Troubleshooting

**If Android Studio doesn't open:**
- Try: `open -a "Android Studio" ~/Desktop/AstroMatch1/android`

**If build fails:**
- Make sure Java/JDK is installed and configured
- Check that Android SDK is set up in Android Studio
- Try "File → Sync Project with Gradle Files" in Android Studio

**If onboarding doesn't appear:**
- Clear app data (Settings → Apps → AstroMatch → Clear Data)
- Or uninstall and reinstall

