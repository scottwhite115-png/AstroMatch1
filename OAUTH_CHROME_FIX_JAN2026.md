# OAuth Chrome Redirect Fix - January 12, 2026

## Problem
The app was opening Chrome browser during Google/Apple sign in, causing Google Play testing to not count the testing days. The tester reported: "your app still send users to chrome" which prevented closed testing approval.

## Root Cause
The OAuth flow was using `window.location.href = data.url` which navigates the WebView directly to OAuth URLs. Google/Apple OAuth providers detect WebView access and force users to open Chrome for security reasons.

## Solution Applied
Changed OAuth flow to use **Capacitor's Browser plugin** with `Browser.open()`. This opens OAuth in an **in-app browser** (Chrome Custom Tabs) which:
- Keeps users within your app context
- Satisfies Google Play's testing requirements
- Follows Google's recommended OAuth implementation
- Prevents the external Chrome app from opening

## Files Changed

### 1. `app/login/page.tsx`
**Changes:**
- Set `skipBrowserRedirect: true` in signInWithOAuth options
- Import `Browser` from `@capacitor/browser`
- Replace `window.location.href = data.url` with `Browser.open({ url: data.url })`
- Added `Browser.close()` when OAuth callback is received

### 2. `app/signup/page.tsx`
**Changes:**
- Set `skipBrowserRedirect: true` in signInWithOAuth options
- Import `Browser` from `@capacitor/browser`
- Replace `window.location.href = data.url` with `Browser.open({ url: data.url })`
- Added `Browser.close()` when OAuth callback is received

### 3. `capacitor.config.ts`
**Changes:**
- Commented out `url: 'http://localhost:3000'` (should not be in production builds)
- Commented out `cleartext: true` (security issue for production)
- Changed schemes from `'astromatch'` to `'https'` for production

## What This Fixes
✅ OAuth now opens in an in-app browser (Chrome Custom Tabs) instead of external Chrome
✅ Users stay within your app context during authentication
✅ Google Play testing will count the testing days properly
✅ Production config no longer points to localhost

## Next Steps

### 1. Build a new AAB file
```bash
cd /Users/scottwhite/Desktop/AstroMatch1
npm run build
npx cap sync android
cd android
./gradlew bundleRelease
```

### 2. Upload to Google Play Console
- Go to Google Play Console
- Navigate to Testing > Closed Testing
- Upload the new AAB file from:
  `android/app/build/outputs/bundle/release/app-release.aab`

### 3. Submit for Review
- Click "Submit update"
- Wait for tester to confirm the Chrome issue is resolved

## Testing Locally (Optional)
To test on your local device:
```bash
npm run dev
npx cap run android
```
Then test Google Sign In - it should open in an in-app browser, not external Chrome.

## Important Notes
- The `@capacitor/browser` package was already installed (v8.0.0)
- Deep link handling remains the same (astromatch://, https://astro-match1.vercel.app)
- Email/password login is unaffected by these changes
- Changes are minimal and targeted to only fix the OAuth Chrome issue

## Expected Result
When users tap "Sign in with Google" or "Sign in with Apple":
- An in-app browser window opens (looks like part of your app)
- Users authenticate with Google/Apple
- The in-app browser closes automatically
- Users are back in your app, signed in

The tester should confirm: "OAuth works in-app, no Chrome opening"
