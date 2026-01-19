# Testing Steps - Onboarding Screen

## Step 1: Build the Project
1. In Android Studio: **Build** → **Make Project** (or `Cmd+F9` on Mac)
2. Wait for build to complete (check bottom status bar)
3. Should see "Build completed successfully"

## Step 2: Run the App
### Option A: Physical Device
1. Connect Android device via USB
2. Enable USB debugging on device (Settings → Developer Options)
3. Click **Run** button (green play icon) or press `Shift+F10`
4. Select your device from the list
5. App will install and launch

### Option B: Emulator
1. Create/start an Android Virtual Device (AVD)
2. Click **Run** button (green play icon) or press `Shift+F10`
3. Select the emulator
4. App will install and launch

## Step 3: What You Should See

**First Launch:**
- ✅ Native onboarding screen appears FIRST
- ✅ Black background with orange star icon (✦)
- ✅ "Welcome to AstroMatch" title
- ✅ Description text
- ✅ Orange "Get Started" button at bottom

**After Clicking "Get Started":**
- ✅ Onboarding screen closes
- ✅ Your Capacitor app loads (signup/login screen)
- ✅ App functions normally

**Second Launch (to verify it's remembered):**
- ✅ Onboarding does NOT appear
- ✅ App loads directly to your main screen

## Step 4: Test Again (Reset Onboarding)
To see onboarding again:
- **On Device**: Settings → Apps → AstroMatch → Storage → Clear Data
- **On Emulator**: Settings → Apps → AstroMatch → Storage → Clear Data
- Or: Uninstall and reinstall the app

## Step 5: Test Deep Links (OAuth)
1. Trigger OAuth flow (Google sign-in)
2. Deep link should go directly to MainActivity (bypass onboarding)
3. OAuth callback should work normally

## Troubleshooting

**Build fails?**
- Check for red errors in the code editor
- Try: Build → Clean Project, then Build → Rebuild Project

**App doesn't run?**
- Make sure device/emulator is connected and recognized
- Check that USB debugging is enabled
- Try: Run → Edit Configurations → check settings

**Onboarding doesn't appear?**
- Make sure you cleared app data (Step 4)
- Check logcat for errors: View → Tool Windows → Logcat

**App crashes?**
- Check logcat for crash logs
- Verify all files were created correctly
- Make sure OnboardingActivity.java compiles without errors

