# Testing the Native Onboarding Screen

## How to Test Locally

### Option 1: Clear App Data (Recommended)
1. Go to Android Settings → Apps → AstroMatch
2. Tap "Storage" → "Clear Data" 
3. Launch the app again
4. You should see the native onboarding screen with "Get Started" button

### Option 2: Uninstall and Reinstall
1. Uninstall the app completely
2. Install the new version (with onboarding)
3. Launch the app - onboarding should appear

### Option 3: Android Studio/Emulator
1. Build and run from Android Studio
2. The emulator starts with a fresh install, so onboarding will show

## Building for Play Console

### Step 1: Increment Version Code
Before building, you need to increment the version code in:
`android/app/build.gradle`
- Current: `versionCode 3`
- New: `versionCode 4` (or higher)

### Step 2: Build the AAB
```bash
cd android
./gradlew bundleRelease
```
The AAB will be at: `android/app/build/outputs/bundle/release/app-release.aab`

### Step 3: Upload to Play Console
1. Go to Google Play Console → Your App → Testing → Closed Testing
2. Click "Create new release"
3. Upload the new AAB file
4. Add release notes (e.g., "Added native onboarding screen")
5. Review and release to testers

## What Testers Will See

1. **First Launch**: Native onboarding screen with "Get Started" button
2. **After Clicking "Get Started"**: Your app loads (Capacitor WebView)
3. **Subsequent Launches**: App loads directly (onboarding is remembered)
4. **OAuth Deep Links**: Work normally (bypass onboarding, go to MainActivity)

## Notes

- The onboarding screen is **native Android code** (not WebView)
- This helps demonstrate native functionality to Google Play reviewers
- Deep links still work correctly (they bypass onboarding)
- Onboarding is only shown once per installation

