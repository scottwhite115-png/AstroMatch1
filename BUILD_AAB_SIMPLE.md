# Simple Way to Build Release AAB

## Option 1: Command Line (Easiest & Most Reliable)

Open Terminal and run:

```bash
cd ~/Desktop/AstroMatch1/android
./gradlew bundleRelease
```

Wait for it to finish (will take 1-2 minutes).

The AAB will be at:
```
android/app/build/outputs/bundle/release/app-release.aab
```

Then upload this file to Play Console!

---

## Option 2: Android Studio - Build Variants

1. Look at the bottom-left of Android Studio
2. Find "Build Variants" tab (or View → Tool Windows → Build Variants)
3. Change "app" variant from "debug" to **"release"**
4. Then go to: Build → Make Module 'app'
5. Then try: Build → Build Bundle(s)

---

## Option 3: Android Studio - Gradle Panel

1. Look at the right side of Android Studio
2. Open the "Gradle" panel/tab
3. Navigate: app → Tasks → bundle → **bundleRelease**
4. Double-click "bundleRelease"
5. Wait for build to complete

The AAB will be at: `android/app/build/outputs/bundle/release/app-release.aab`

