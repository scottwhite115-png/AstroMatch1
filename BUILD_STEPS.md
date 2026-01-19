# Build Release AAB - Step by Step

## Method 1: Android Studio Terminal (Recommended)

1. **Open Terminal in Android Studio:**
   - Look at the bottom of Android Studio
   - Click the **"Terminal"** tab (next to "Build", "Run", "Problems", etc.)
   - Or go to: **View → Tool Windows → Terminal**

2. **Run this command:**
   ```bash
   cd android
   ./gradlew bundleRelease
   ```

3. **Wait for build to complete** (1-2 minutes)
   - You'll see "BUILD SUCCESSFUL" when done

4. **Find your AAB:**
   - File → Open (or Cmd+O)
   - Navigate to: `android/app/build/outputs/bundle/release/`
   - File name: `app-release.aab`

---

## Method 2: Find Build Variants

1. **Open Build Variants:**
   - Look at bottom-left corner of Android Studio
   - Click **"Build Variants"** tab
   - OR: **View → Tool Windows → Build Variants**

2. **Change to Release:**
   - In the Build Variants window
   - Find "app" module
   - Change from "debug" to **"release"**

3. **Build:**
   - **Build → Make Module 'app'**
   - Then look for: **Build → Build Bundle(s)**

---

## Quick Check:
The AAB file should be at:
```
android/app/build/outputs/bundle/release/app-release.aab
```

