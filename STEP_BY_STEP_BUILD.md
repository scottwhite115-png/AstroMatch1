# Step-by-Step: Build AAB in Android Studio

## Prerequisites Check

Before we start, let's verify everything is ready:

✅ Next.js build: Complete  
✅ Capacitor sync: Complete  
✅ Version updated: versionCode 3, versionName 1.0.2  
✅ All code changes: Included  

---

## Step 1: Open Android Studio

1. **Launch Android Studio** on your Mac
2. If you see a welcome screen, click **"Open"** or **"Open an Existing Project"**
3. If Android Studio is already open, go to **File → Open**

---

## Step 2: Open the Android Project

1. In the file browser, navigate to:
   ```
   /Users/scottwhite/Desktop/AstroMatch1/android
   ```
   
2. **Important**: Select the `android` folder (not the parent AstroMatch1 folder)
   - You should see folders like: `app`, `gradle`, `build.gradle` inside

3. Click **"Open"** or **"OK"**

4. **Wait for Gradle Sync**:
   - Android Studio will start syncing Gradle
   - You'll see "Gradle Sync" in the bottom status bar
   - This may take 1-3 minutes the first time
   - Wait until you see "Gradle sync finished" or no sync message

---

## Step 3: Verify Project Structure

Once Gradle sync completes, verify you can see:
- In the left sidebar (Project view):
  - `app` folder
  - `gradle` folder
  - `build.gradle` files
- No red error messages in the bottom status bar

---

## Step 4: Generate Signed Bundle

1. In the top menu bar, click **"Build"**

2. From the dropdown menu, select:
   **"Generate Signed Bundle / APK"**

3. A dialog window will appear

---

## Step 5: Select Bundle Type

In the dialog that appears:

1. You'll see two options:
   - **Android App Bundle** ← Select this one
   - APK

2. Click the radio button next to **"Android App Bundle"**

3. Click **"Next"** button at the bottom

---

## Step 6: Select Your Keystore

1. **Keystore path**: 
   - Click the folder icon (📁) next to the path field
   - Navigate to and select your keystore file (usually ends in `.jks` or `.keystore`)
   - If you don't remember where it is, look for files like:
     - `astromatch-release-key.jks`
     - `keystore.jks`
     - Or check your project for a `key.properties` file that might have the path

2. **Key store password**: Enter the password for your keystore

3. **Key alias**: 
   - Click the dropdown or type your key alias
   - Common names: `key0`, `upload`, `release`, or `astromatch`

4. **Key password**: Enter the password for your key alias

5. Click **"Next"**

---

## Step 7: Select Build Variant

1. You'll see **"Build Variants"** section

2. Under **"Signature Versions"**:
   - ✅ Check **"V1 (Jar Signature)"** (if not already checked)
   - ✅ Check **"V2 (Full APK Signature)"** (if not already checked)

3. Under **"Build Variant"**:
   - Select **"release"** from the dropdown
   - (Not "debug")

4. Click **"Finish"** at the bottom

---

## Step 8: Wait for Build

1. You'll see a progress bar at the bottom of Android Studio
2. It will show: "Building 'android' release bundle..."
3. This usually takes 30-60 seconds
4. **Don't close Android Studio** while it's building

---

## Step 9: Find Your AAB

Once the build completes, you'll see one of two things:

### Option A: Notification Popup
- A notification will appear: "Generate Signed Bundle / APK finished"
- Click **"locate"** or **"show in Finder"** in the notification
- This will open Finder to the AAB file location

### Option B: Manual Location
The AAB file will be at:
```
/Users/scottwhite/Desktop/AstroMatch1/android/app/release/app-release.aab
```

**To verify it's the right file:**
- File name: `app-release.aab`
- File size: Should be 20-50 MB (not a few KB)
- File location: `android/app/release/` folder

---

## Step 10: Upload to Google Play Console

1. **Go to Google Play Console**:
   - Open browser: https://play.google.com/console
   - Sign in with your Google account

2. **Select Your App**:
   - Click on **"AstroMatch"** from your app list

3. **Navigate to Testing Track**:
   - In the left sidebar, click **"Testing"**
   - Click **"Internal testing"** (or **"Closed testing"** if that's where your testers are)

4. **Create New Release**:
   - If you see **"Create new release"** button, click it
   - If you see an existing release, click **"Edit release"** or **"Create new release"**

5. **Upload AAB**:
   - Under **"App bundles and APKs"** section
   - Click **"Upload"** button
   - Navigate to: `/Users/scottwhite/Desktop/AstroMatch1/android/app/release/`
   - Select: `app-release.aab`
   - Click **"Open"**
   - Wait for upload to complete (may take 1-2 minutes)

6. **Add Release Notes**:
   - Scroll down to **"Release notes"** section
   - Click **"Add release notes"** or the text field
   - Enter:
     ```
     Fixed Google OAuth sign-in to work within the app instead of opening external browser.
     - OAuth now opens in in-app browser (not Chrome)
     - Users automatically return to app after sign-in
     - No longer stuck in Chrome browser
     - Version 1.0.2
     ```

7. **Review and Release**:
   - Scroll to bottom
   - Click **"Review release"** button
   - Review the summary
   - Click **"Start rollout to Internal testing"** (or your testing track)

8. **Confirm**:
   - Click **"Confirm"** if prompted
   - The release will be processed (usually takes a few minutes)

---

## Step 11: Notify Testers

Once the release is live:
- Testers will receive an email notification
- They can download the update from Google Play
- The new version (1.0.2) will have the fixed OAuth flow

---

## Troubleshooting

### "Gradle sync failed"
- Wait a few minutes and try again
- Check your internet connection
- Go to: File → Invalidate Caches → Invalidate and Restart

### "Keystore file not found"
- Check if you have a `key.properties` file in `android/app/`
- The keystore path might be in that file
- Or ask if you need to create a new keystore

### "Build failed"
- Check the "Build" tab at the bottom for error messages
- Common issues: Missing dependencies (run `npm install` first)
- Make sure you selected "release" build variant

### "AAB file not found"
- Check: `android/app/release/app-release.aab`
- If not there, check: `android/app/build/outputs/bundle/release/app-release.aab`

---

## Success Checklist

Before uploading, verify:
- [ ] AAB file exists and is 20-50 MB
- [ ] File is named `app-release.aab`
- [ ] Version code is 3
- [ ] Version name is 1.0.2
- [ ] No build errors in Android Studio

---

## Need Help?

If you get stuck at any step, let me know which step and what error message you see!

