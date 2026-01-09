# How to Sync Gradle in Android Studio

## Method 1: Menu (Easiest)
1. Click **File** → **Sync Project with Gradle Files**
2. Wait for sync to complete (check bottom status bar)

## Method 2: Keyboard Shortcut
- **Mac**: `Cmd + Shift + O` or `Cmd + Option + Y`
- **Windows/Linux**: `Ctrl + Shift + O` or `Ctrl + Alt + Y`

## Method 3: Toolbar Button
- Look for the circular arrow icon (🔄) in the toolbar
- Click it to trigger sync

## Method 4: Notification Banner
- If you see a banner at the top saying "Gradle files have changed"
- Click **"Sync Now"** button

## Method 5: Command Line (Advanced)
```bash
cd ~/Desktop/AstroMatch1/android
./gradlew build --refresh-dependencies
```
Note: This syncs Gradle but won't update Android Studio's internal state.

## What to Look For:
- Bottom status bar shows "Gradle sync" progress
- "Gradle sync finished" message when complete
- No red error indicators in the project view
- Build should work after successful sync

## If Sync Fails:
1. Try: **File** → **Invalidate Caches / Restart** → **Invalidate and Restart**
2. Make sure you're connected to internet (Gradle downloads dependencies)
3. Check that Java/JDK is properly configured in Android Studio
4. Try cleaning: **Build** → **Clean Project**, then sync again

