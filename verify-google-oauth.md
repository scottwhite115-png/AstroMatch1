# Google OAuth Verification Checklist

## ✅ Deployment Status
- [x] Code deployed to Vercel (commit 7ff250bd pushed)
- [x] Site is live at: https://astro-match1.vercel.app
- [x] PKCE fix is deployed (removed custom cookie handling)

## 🔍 Google Cloud Console Verification

### Step 1: Verify OAuth Client ID Configuration
1. Go to: https://console.cloud.google.com/apis/credentials
2. Find your OAuth 2.0 Client ID (should be named "AstroMatch Web")
3. **CRITICAL - Check these settings:**

   **Authorized JavaScript origins:**
   - ✅ `http://localhost:3000` (for local testing)
   - ✅ `https://umorkbxikucjlluzezhq.supabase.co` (Supabase URL)
   - ✅ `https://astro-match1.vercel.app` (your production URL - ADD THIS if missing!)

   **Authorized redirect URIs:**
   - ✅ `https://umorkbxikucjlluzezhq.supabase.co/auth/v1/callback` (MUST BE EXACT)
   - ❌ DO NOT add your app's `/auth/callback` - Supabase handles the OAuth callback

### Step 2: Verify OAuth Consent Screen
1. Go to: https://console.cloud.google.com/apis/credentials/consent
2. Check that:
   - App name: AstroMatch
   - Publishing status: Either "Testing" (with test users) or "In production"
   - Scopes include: `email`, `profile`, `openid`

## 🔍 Supabase Dashboard Verification

### Step 1: Verify Google Provider is Enabled
1. Go to: https://supabase.com/dashboard/project/umorkbxikucjlluzezhq/auth/providers
2. Click on "Google" provider
3. **Verify:**
   - ✅ "Enable Google provider" toggle is ON
   - ✅ Client ID is filled in (from Google Cloud Console)
   - ✅ Client Secret is filled in (from Google Cloud Console)
   - ✅ Click "Save" if you made any changes

### Step 2: Verify Site URL Configuration
1. Go to: https://supabase.com/dashboard/project/umorkbxikucjlluzezhq/auth/url-configuration
2. **Check these URLs:**
   - Site URL: `https://astro-match1.vercel.app`
   - Redirect URLs should include:
     - `https://astro-match1.vercel.app/**`
     - `http://localhost:3000/**` (for local testing)

## 🧪 Testing Checklist

### Test 1: Local Testing
1. Start dev server: `npm run dev`
2. Go to: http://localhost:3000/login
3. Click "Sign in with Google"
4. Should redirect to Google sign-in page
5. After signing in, should redirect back to app
6. Check browser console for any errors

### Test 2: Production Testing
1. Go to: https://astro-match1.vercel.app/login
2. Click "Sign in with Google"
3. Should redirect to Google sign-in page
4. After signing in, should redirect back to app
5. Check browser console for any errors

### Test 3: Android Testing (Play Console)
1. Build and upload to Play Console
2. Testers should be able to sign in with Google
3. No PKCE errors should appear

## 🐛 Common Issues & Fixes

### Issue: "PKCE code verifier not found in storage"
- ✅ **FIXED**: Removed custom cookie handling from `lib/supabase/client.ts`
- The fix is now deployed to production

### Issue: "redirect_uri_mismatch"
- **Fix**: Make sure Google Cloud Console has EXACTLY:
  - `https://umorkbxikucjlluzezhq.supabase.co/auth/v1/callback`
- Do NOT add your app's callback URL here - Supabase handles it

### Issue: "Invalid client"
- **Fix**: Verify Client ID and Secret in Supabase match Google Cloud Console
- Make sure there are no extra spaces or characters

### Issue: OAuth works locally but not in production
- **Fix**: Add production URL to Google Cloud Console:
  - Authorized JavaScript origins: `https://astro-match1.vercel.app`
  - Make sure Supabase Site URL is set to production URL

## 📝 Quick Verification Commands

Run these to verify your setup:

```bash
# Check if site is deployed
curl -I https://astro-match1.vercel.app

# Check if Supabase is accessible
curl -I https://umorkbxikucjlluzezhq.supabase.co
```

