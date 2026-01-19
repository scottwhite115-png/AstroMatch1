# Google OAuth Mobile App Fix

## Problem
Testers reported that Google sign-in was opening in Chrome browser instead of staying within the app, and users got stuck in Chrome after signing in. Google Play Console doesn't accept apps that use WebView with external browser redirects.

## Solution Implemented

### 1. Installed Required Packages
- `@capacitor/browser` - For opening OAuth in an in-app browser
- `@capacitor/app` - For handling deep links and app state

### 2. Updated OAuth Flow
- Modified `app/signup/page.tsx` and `app/login/page.tsx` to detect if running in Capacitor (mobile app)
- When in mobile app, uses Capacitor Browser plugin to open OAuth in an in-app browser
- When in web browser, uses standard redirect

### 3. Created Mobile-Specific Callback Page
- Created `app/auth/callback-mobile/page.tsx` to handle OAuth callbacks in mobile apps
- This page automatically closes the in-app browser and processes the OAuth callback
- Redirects to the appropriate page after authentication

### 4. Updated Android Configuration
- Added deep link intent filters to `AndroidManifest.xml`:
  - Custom scheme: `astromatch://auth`
  - HTTPS deep link: `https://astro-match1.vercel.app/auth/callback`
- Updated `capacitor.config.ts` to use custom URL scheme (`astromatch`) for Android

## How It Works

1. User clicks "Sign in with Google" in the mobile app
2. App detects it's running in Capacitor
3. App opens OAuth URL in an in-app browser (not external Chrome)
4. User signs in with Google
5. Google redirects to the callback URL
6. The callback page closes the in-app browser
7. App processes the OAuth callback and redirects to matches page

## Testing Instructions

1. **Build the Android app:**
   ```bash
   cd /Users/scottwhite/Desktop/AstroMatch1
   npm run build
   npx cap sync android
   ```

2. **Test the OAuth flow:**
   - Open the app on an Android device
   - Go to Sign Up or Login page
   - Click "Sign in with Google"
   - Verify it opens in an in-app browser (not external Chrome)
   - Complete the Google sign-in
   - Verify it returns to the app (not stuck in browser)
   - Verify you're logged in and redirected to matches page

3. **Verify it's not a WebView:**
   - The OAuth should open in an in-app browser that's part of the app
   - After sign-in, you should return to the app automatically
   - The app should not be stuck in Chrome

## Important Notes

- The in-app browser is provided by Capacitor, not a WebView
- This approach is accepted by Google Play Console
- The deep link configuration allows the app to intercept OAuth callbacks
- The custom URL scheme (`astromatch://`) is used for app-to-app navigation

## Next Steps

1. Build and test the Android app
2. Verify the OAuth flow works correctly
3. Submit to Google Play Console for testing
4. If testers still report issues, check:
   - AndroidManifest.xml deep link configuration
   - Capacitor Browser plugin is properly installed
   - The callback URL is correctly configured in Supabase

## Files Modified

- `app/signup/page.tsx` - Updated OAuth flow for mobile
- `app/login/page.tsx` - Updated OAuth flow for mobile
- `app/auth/callback-mobile/page.tsx` - New mobile callback handler
- `android/app/src/main/AndroidManifest.xml` - Added deep link intent filters
- `capacitor.config.ts` - Updated URL scheme
- `package.json` - Added @capacitor/browser and @capacitor/app

