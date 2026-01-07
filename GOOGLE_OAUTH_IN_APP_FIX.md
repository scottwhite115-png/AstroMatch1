# Google OAuth In-App Browser Fix

## Problem
The app was redirecting users to Chrome browser for Google OAuth authentication instead of using an in-app browser. This was causing issues with Google Play Console closed testing approval.

## Root Causes Identified
1. **Unreliable Capacitor Detection**: The code was using a simple check `(window as any).Capacitor` which might not work in all cases
2. **Missing Deep Link Configuration**: The AndroidManifest didn't include the `/auth/callback-mobile` path
3. **Browser Plugin Configuration**: The Browser.open() might not have been properly configured for Chrome Custom Tabs

## Fixes Applied

### 1. Created Capacitor Utility (`lib/utils/capacitor.ts`)
- More reliable Capacitor detection using multiple methods
- Platform detection (iOS, Android, Web)
- Centralized OAuth redirect URL generation

### 2. Updated Login Page (`app/login/page.tsx`)
- Uses the new Capacitor utility for reliable detection
- Improved Browser.open() configuration with proper error handling
- Better deep link handling for OAuth callbacks

### 3. Updated Signup Page (`app/signup/page.tsx`)
- Same improvements as login page
- Consistent OAuth handling across both pages

### 4. Updated Callback Page (`app/auth/callback-mobile/page.tsx`)
- Uses the new Capacitor utility
- Improved browser closing logic

### 5. Updated AndroidManifest (`android/app/src/main/AndroidManifest.xml`)
- Added deep link intent filter for `/auth/callback-mobile` path
- Ensures both `/auth/callback` and `/auth/callback-mobile` are handled

## How It Works Now

1. **User clicks "Sign in with Google"**
   - App detects it's running in Capacitor (native app)
   - Uses `@capacitor/browser` plugin to open OAuth in Chrome Custom Tabs (Android) or SFSafariViewController (iOS)
   - Sets up deep link listener before opening browser

2. **User completes OAuth in in-app browser**
   - Google redirects to the callback URL
   - Android intercepts the HTTPS deep link (matching AndroidManifest configuration)
   - App receives the deep link via `appUrlOpen` event

3. **App processes callback**
   - Closes the in-app browser
   - Exchanges OAuth code for session
   - Redirects user to matches page

## Important: Google OAuth Console Configuration

Make sure your Google OAuth console has BOTH redirect URIs registered:

1. `https://astro-match1.vercel.app/auth/callback`
2. `https://astro-match1.vercel.app/auth/callback-mobile`

To check/update:
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Navigate to APIs & Services → Credentials
3. Find your OAuth 2.0 Client ID
4. Under "Authorized redirect URIs", ensure both URLs are listed

## Testing Checklist

After rebuilding the app, test:

- [ ] Click "Sign in with Google" - should open in-app browser (not Chrome)
- [ ] Complete OAuth flow - should stay in-app
- [ ] After OAuth, should return to app (not stuck in browser)
- [ ] Same test for "Sign up with Google"
- [ ] Test on both Android and iOS if possible

## Next Steps

1. **Rebuild the Android app**:
   ```bash
   npm run build
   npx cap sync android
   # Then build AAB in Android Studio
   ```

2. **Verify Google OAuth Console** has both redirect URIs

3. **Test the OAuth flow** on a physical device or emulator

4. **Upload new AAB** to Google Play Console

## Technical Details

- **Chrome Custom Tabs**: On Android, Capacitor Browser plugin uses Chrome Custom Tabs, which is a native Android feature that opens a browser-like interface within the app
- **Deep Links**: The app uses HTTPS deep links (`https://astro-match1.vercel.app/auth/callback-mobile`) which Android intercepts and routes to the app
- **Capacitor Detection**: Uses multiple methods to reliably detect if running in a native app vs web browser

## If Still Opening Chrome

If the app still opens Chrome instead of in-app browser:

1. **Check Capacitor detection**: Add console logs to verify `isCapacitor()` returns `true`
2. **Verify Browser plugin**: Ensure `@capacitor/browser` is properly installed and synced
3. **Check deep links**: Verify the redirect URL matches what's in AndroidManifest
4. **Google OAuth Console**: Ensure redirect URIs are correctly configured

