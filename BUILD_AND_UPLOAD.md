# Build AAB and Upload to Play Console

## ✅ Version Updated
- **versionCode**: 3 → **4** ✅
- **versionName**: 1.0.2 → **1.0.3** ✅

## Step 1: Build the Release AAB

### Option A: Using Android Studio (Recommended)
1. Open the project in Android Studio
2. Go to: **Build** → **Build Bundle(s) / APK(s)** → **Build Bundle(s)**
3. Select **release** (not debug)
4. Wait for build to complete
5. When done, click on the notification link that appears:
   - "locate" or "analyze" the bundle
6. The AAB file will be at:
   ```
   android/app/build/outputs/bundle/release/app-release.aab
   ```

### Option B: Using Command Line
```bash
cd ~/Desktop/AstroMatch1/android
./gradlew bundleRelease
```
The AAB will be at: `app/build/outputs/bundle/release/app-release.aab`

## Step 2: Upload to Google Play Console

1. **Go to Play Console**
   - Visit: https://play.google.com/console
   - Select your **AstroMatch** app

2. **Navigate to Testing**
   - Go to: **Testing** → **Closed testing**
   - Select your closed testing track (or create one if needed)

3. **Create New Release**
   - Click **"Create new release"** button
   - Or click on the existing track and then **"Create new release"**

4. **Upload AAB**
   - Click **"Upload"** button
   - Select your AAB file: `android/app/build/outputs/bundle/release/app-release.aab`
   - Wait for upload and processing to complete

5. **Add Release Notes**
   - In the "Release notes" section, add:
     ```
     Added native onboarding screen before app launch
     - Improves native app experience
     - Enhances Google Play compliance
     ```
   - Or whatever description you prefer

6. **Review and Release**
   - Click **"Review release"** at the bottom
   - Review all the information
   - Click **"Start rollout to [track name]"** to publish to testers

## Step 3: Notify Testers

Your testers will receive a notification that a new version is available. They can update through the Play Store.

## What's Changed in This Release:

✅ **Native Onboarding Screen**
- Native Android Activity shown before WebView loads
- Demonstrates native functionality for Google Play review
- "Get Started" button launches the Capacitor app
- Onboarding appears only once per installation

## Verification Checklist:

- [ ] AAB built successfully (signed release)
- [ ] Version code is 4 (higher than previous version)
- [ ] AAB uploaded to Play Console
- [ ] Release notes added
- [ ] Release published to closed testing track
- [ ] Testers notified of new version

## Troubleshooting:

**Build fails?**
- Make sure signing config (key.properties) is correct
- Check that all dependencies are resolved
- Try: Build → Clean Project, then rebuild

**Upload fails?**
- Make sure versionCode is higher than previous version
- Check that AAB is signed (release build)
- Verify you're uploading to the correct track

**Tester can't see update?**
- It may take a few minutes to propagate
- Testers need to check Play Store for updates
- Make sure they're in the correct testing track

