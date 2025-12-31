# OAuth Setup Guide for Google and Apple Sign In

This guide will walk you through setting up Google OAuth and Apple Sign In for your AstroMatch app. The UI is already implemented - you just need to configure the OAuth providers.

## Prerequisites
- ✅ Google Developer Account (paid)
- ✅ Apple Developer Account (paid)
- ✅ Supabase project with your app

---

## Part 1: Google OAuth Setup

### Step 1: Create OAuth 2.0 Credentials in Google Cloud Console

1. **Go to Google Cloud Console**
   - Visit: https://console.cloud.google.com/
   - Select your project (or create a new one)

2. **Enable Google+ API**
   - Navigate to "APIs & Services" > "Library"
   - Search for "Google+ API" and enable it
   - Also enable "Google Identity Services API" if available

3. **Create OAuth 2.0 Client ID**
   - Go to "APIs & Services" > "Credentials"
   - Click "Create Credentials" > "OAuth client ID"
   - If prompted, configure the OAuth consent screen first:
     - User Type: External (unless you have a Google Workspace)
     - App name: AstroMatch
     - User support email: Your email
     - Developer contact: Your email
     - Click "Save and Continue"
     - Scopes: Add `email`, `profile`, `openid`
     - Test users: Add your email for testing
     - Click "Save and Continue" until done

4. **Create OAuth Client IDs**
   - Application type: **Web application**
   - Name: AstroMatch Web
   - Authorized JavaScript origins:
     ```
     http://localhost:3000
     https://umorkbxikucjlluzezhq.supabase.co
     ```
   - Authorized redirect URIs:
     ```
     https://umorkbxikucjlluzezhq.supabase.co/auth/v1/callback
     ```
   - Click "Create"
   - **Copy the Client ID and Client Secret** (you'll need these for Supabase)

5. **For Android (if needed for Google Play Console testing)**
   - Create another OAuth client ID
   - Application type: **Android**
   - Package name: (from your Android app - check `android/app/build.gradle`)
   - SHA-1 certificate fingerprint: (get from your keystore)
   - Click "Create"

### Step 2: Add Google OAuth to Supabase

1. **Go to Supabase Dashboard**
   - Visit: https://supabase.com/dashboard
   - Select your project: `umorkbxikucjlluzezhq`

2. **Navigate to Authentication > Providers**
   - Click on "Google" provider
   - Toggle "Enable Google provider" to ON
   - Enter your **Client ID** (from Google Cloud Console)
   - Enter your **Client Secret** (from Google Cloud Console)
   - Click "Save"

3. **Configure Redirect URL**
   - The redirect URL should be: `https://umorkbxikucjlluzezhq.supabase.co/auth/v1/callback`
   - This is automatically handled by Supabase

---

## Part 2: Apple Sign In Setup

### Step 1: Configure Apple Sign In in Apple Developer Console

1. **Go to Apple Developer Portal**
   - Visit: https://developer.apple.com/account/
   - Sign in with your Apple Developer account

2. **Create App ID**
   - Go to "Certificates, Identifiers & Profiles"
   - Click "Identifiers" > "+" button
   - Select "App IDs" > Continue
   - Select "App" > Continue
   - Description: AstroMatch
   - Bundle ID: (use your app's bundle ID, e.g., `com.astromatch.app`)
   - Capabilities: Check "Sign In with Apple"
   - Click "Continue" > "Register"

3. **Create Services ID (for Web)**
   - Go to "Identifiers" > "+" button
   - Select "Services IDs" > Continue
   - Description: AstroMatch Web
   - Identifier: `com.astromatch.app.web` (or similar)
   - Check "Sign In with Apple"
   - Click "Continue" > "Register"
   - Click on the newly created Services ID
   - Under "Sign In with Apple", click "Configure"
   - Primary App ID: Select your App ID from step 2
   - Website URLs:
     - Domains: `umorkbxikucjlluzezhq.supabase.co`
     - Return URLs: `https://umorkbxikucjlluzezhq.supabase.co/auth/v1/callback`
   - Click "Save" > "Continue" > "Save"

4. **Create Key for Sign In with Apple**
   - Go to "Keys" > "+" button
   - Key Name: AstroMatch Sign In Key
   - Check "Sign In with Apple"
   - Click "Configure"
   - Primary App ID: Select your App ID
   - Click "Save" > "Continue" > "Register"
   - **Download the .p8 key file** (you can only download it once!)
   - **Note the Key ID** (you'll need this)

### Step 2: Add Apple Sign In to Supabase

1. **Go to Supabase Dashboard**
   - Visit: https://supabase.com/dashboard
   - Select your project

2. **Navigate to Authentication > Providers**
   - Click on "Apple" provider
   - Toggle "Enable Apple provider" to ON
   - Services ID: Enter your Services ID (e.g., `com.astromatch.app.web`)
   - Secret Key: Open the downloaded .p8 file and copy its contents
   - Key ID: Enter the Key ID from Apple Developer Console
   - Team ID: Enter your Apple Team ID (found in top right of Apple Developer portal)
   - Click "Save"

---

## Part 3: Testing OAuth

### Test Google Sign In

1. **Start your development server**
   ```bash
   npm run dev
   ```

2. **Navigate to login page**
   - Go to: http://localhost:3000/login
   - Click "Sign in with Google"
   - You should be redirected to Google's OAuth page
   - After signing in, you should be redirected back to your app

3. **Test signup flow**
   - Go to: http://localhost:3000/signup
   - Click "Sign up with Google"
   - Complete the OAuth flow

### Test Apple Sign In

1. **Navigate to login page**
   - Go to: http://localhost:3000/login
   - Click "Sign in with Apple"
   - You should see Apple's sign-in page
   - After signing in, you should be redirected back to your app

2. **Test signup flow**
   - Go to: http://localhost:3000/signup
   - Click "Sign up with Apple"
   - Complete the OAuth flow

### Troubleshooting

**Google OAuth Issues:**
- Make sure redirect URI in Google Cloud Console matches: `https://umorkbxikucjlluzezhq.supabase.co/auth/v1/callback`
- Check that OAuth consent screen is configured
- Verify Client ID and Secret are correct in Supabase

**Apple Sign In Issues:**
- Make sure Services ID is configured with correct return URL
- Verify the .p8 key file content is correct (no extra spaces)
- Check that Key ID and Team ID are correct
- Ensure "Sign In with Apple" capability is enabled for your App ID

**General Issues:**
- Check browser console for errors
- Verify Supabase project URL and keys are correct in `.env.local`
- Make sure callback route is working: `/auth/callback`

---

## Part 4: Production Configuration

### For Production Deployment

1. **Update Google OAuth Redirect URIs**
   - Add your production domain to authorized JavaScript origins
   - Add production callback URL to authorized redirect URIs

2. **Update Apple Services ID**
   - Add production domain to Website URLs
   - Add production callback URL to Return URLs

3. **Update Environment Variables**
   - Set `NEXT_PUBLIC_SITE_URL` to your production URL in `.env.local`
   - This ensures OAuth callbacks work correctly in production

---

## Quick Reference

### Google OAuth
- **Client ID**: From Google Cloud Console > Credentials
- **Client Secret**: From Google Cloud Console > Credentials
- **Redirect URI**: `https://umorkbxikucjlluzezhq.supabase.co/auth/v1/callback`

### Apple Sign In
- **Services ID**: From Apple Developer > Identifiers > Services IDs
- **Secret Key**: Contents of .p8 file from Apple Developer > Keys
- **Key ID**: From Apple Developer > Keys
- **Team ID**: From Apple Developer portal (top right)
- **Return URL**: `https://umorkbxikucjlluzezhq.supabase.co/auth/v1/callback`

---

## Support

If you encounter issues:
1. Check Supabase logs: Dashboard > Logs > Auth Logs
2. Check browser console for client-side errors
3. Verify all credentials are correctly entered in Supabase
4. Ensure OAuth providers are enabled in Supabase dashboard

