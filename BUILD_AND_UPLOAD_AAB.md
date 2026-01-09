# Building and Uploading New AAB to Google Play Console

## Why You Need a New AAB

The OAuth fix requires a new Android App Bundle (AAB) because we made:
- Code changes to OAuth flow
- AndroidManifest.xml updates (deep links)
- New dependencies (@capacitor/browser, @capacitor/app)
- Capacitor config changes

## Step-by-Step Instructions

### 1. Build the Next.js App

```bash
cd /Users/scottwhite/Desktop/AstroMatch1
npm run build
```

This creates the production build in the `.next` folder.

### 2. Sync Capacitor

```bash
npx cap sync android
```

This copies the web build to Android and updates native dependencies.

### 3. Build the Android App Bundle (AAB)

**Option A: Using Android Studio (Recommended)**
1. Open Android Studio
2. Open the project: `File > Open` → Select `/Users/scottwhite/Desktop/AstroMatch1/android`
3. Wait for Gradle sync to complete
4. Go to `Build > Generate Signed Bundle / APK`
5. Select **Android App Bundle**
6. Click **Next**
7. Select your keystore file and enter passwords
8. Select **release** build variant
9. Click **Finish**
10. The AAB will be generated at: `android/app/release/app-release.aab`

**Option B: Using Command Line**
```bash
cd /Users/scottwhite/Desktop/AstroMatch1/android
./gradlew bundleRelease
```

The AAB will be at: `android/app/build/outputs/bundle/release/app-release.aab`

### 4. Update Version in build.gradle

Before building, you may want to increment the version:

```gradle
// In android/app/build.gradle
versionCode 3  // Increment from current version
versionName "1.0.2"  // Update version name
```

### 5. Upload to Google Play Console

1. Go to [Google Play Console](https://play.google.com/console)
2. Select your app (AstroMatch)
3. Go to **Production** (or **Testing** → **Internal testing** / **Closed testing**)
4. Click **Create new release** (or **Edit release** if updating existing)
5. Click **Upload** under "App bundles and APKs"
6. Select your new AAB file: `android/app/release/app-release.aab`
7. Fill in **Release notes**:
   ```
   Fixed Google OAuth sign-in to work within the app instead of opening external browser.
   - OAuth now opens in in-app browser
   - Users are automatically returned to app after sign-in
   - No longer stuck in Chrome browser
   ```
8. Click **Review release**
9. Review and click **Start rollout to Production** (or **Save** for testing track)

### 6. Notify Testers

Once uploaded to the testing track:
- Testers will receive an update notification
- They need to download the new version from Google Play
- The new version will have the fixed OAuth flow

## Important Notes

- **Version Code**: Must be higher than the previous version (increment by 1)
- **Version Name**: Can be any string (e.g., "1.0.2")
- **Testing**: Upload to **Internal testing** or **Closed testing** first to verify the fix works
- **Production**: Only promote to Production after testers confirm it works

## Verification Checklist

After testers download the new version, they should verify:
- [ ] Clicking "Sign in with Google" opens in-app browser (not Chrome)
- [ ] After signing in, automatically returns to app
- [ ] Not stuck in Chrome browser
- [ ] Successfully logged in and redirected to matches page
- [ ] App is not detected as WebView by Google Play

## Troubleshooting

If the AAB build fails:
1. Make sure you have a valid signing key configured
2. Check that all dependencies are installed: `npm install`
3. Ensure Capacitor is synced: `npx cap sync android`
4. Clean build: `cd android && ./gradlew clean`

If testers still see the old behavior:
- Make sure they downloaded the new version from Play Store
- Check the version number in app settings matches the new build
- Clear app data and try again

