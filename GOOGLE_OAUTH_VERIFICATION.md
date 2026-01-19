# Google OAuth Setup Verification & Fix Guide

## ✅ Current Status
- ✅ Code deployed to production (PKCE fix included)
- ✅ Site is live: https://astro-match1.vercel.app
- ⚠️ **Action Required**: Verify Google OAuth configuration

---

## 🔍 STEP 1: Verify Google Cloud Console Setup

### 1.1 Check OAuth Client ID Configuration

**Go to:** https://console.cloud.google.com/apis/credentials

1. Find your OAuth 2.0 Client ID (should be named "AstroMatch Web" or similar)
2. Click on it to edit
3. **VERIFY these settings:**

   **Authorized JavaScript origins** (must include ALL of these):
   ```
   http://localhost:3000
   https://umorkbxikucjlluzezhq.supabase.co
   https://astro-match1.vercel.app
   ```

   **Authorized redirect URIs** (must include EXACTLY this):
   ```
   https://umorkbxikucjlluzezhq.supabase.co/auth/v1/callback
   ```

   ⚠️ **IMPORTANT**: 
   - Do NOT add `https://astro-match1.vercel.app/auth/callback` here
   - Supabase handles the OAuth callback, not your app directly
   - The redirect URI must match EXACTLY (no trailing slashes, no typos)

4. Click "Save"
5. **Copy your Client ID and Client Secret** (you'll need these for Step 2)

---

## 🔍 STEP 2: Verify Supabase Configuration

### 2.1 Enable Google Provider in Supabase

**Go to:** https://supabase.com/dashboard/project/umorkbxikucjlluzezhq/auth/providers

1. Click on **"Google"** in the providers list
2. **Verify/Set these:**
   - ✅ Toggle **"Enable Google provider"** to **ON**
   - ✅ **Client ID (for OAuth)**: Paste your Google Client ID from Step 1
   - ✅ **Client Secret (for OAuth)**: Paste your Google Client Secret from Step 1
   - Click **"Save"**

### 2.2 Verify Site URL Configuration

**Go to:** https://supabase.com/dashboard/project/umorkbxikucjlluzezhq/auth/url-configuration

1. **Site URL** should be:
   ```
   https://astro-match1.vercel.app
   ```

2. **Redirect URLs** should include:
   ```
   https://astro-match1.vercel.app/**
   http://localhost:3000/**
   ```

3. Click **"Save"** if you made any changes

---

## 🧪 STEP 3: Test the Setup

### Test 1: Production Site Test

1. **Open:** https://astro-match1.vercel.app/login
2. Click **"Sign in with Google"**
3. **Expected behavior:**
   - ✅ Redirects to Google sign-in page
   - ✅ After signing in, redirects back to your app
   - ✅ No "PKCE code verifier" error
   - ✅ User is logged in

4. **If you see errors:**
   - Check browser console (F12) for error messages
   - Common errors and fixes are below

### Test 2: Local Development Test

1. **Start dev server:**
   ```bash
   cd /Users/scottwhite/Desktop/AstroMatch1
   npm run dev
   ```

2. **Open:** http://localhost:3000/login
3. Click **"Sign in with Google"**
4. **Expected behavior:** Same as Test 1

---

## 🐛 Common Errors & Fixes

### Error: "PKCE code verifier not found in storage"
- ✅ **FIXED**: This was fixed in the latest deployment
- If you still see this, clear browser cache and try again
- The fix removes custom cookie handling that was causing the issue

### Error: "redirect_uri_mismatch"
**Cause:** Redirect URI in Google Cloud Console doesn't match Supabase callback URL

**Fix:**
1. Go to Google Cloud Console > Credentials
2. Edit your OAuth Client ID
3. Under "Authorized redirect URIs", make sure you have EXACTLY:
   ```
   https://umorkbxikucjlluzezhq.supabase.co/auth/v1/callback
   ```
4. Save and wait 1-2 minutes for changes to propagate

### Error: "Invalid client" or "unauthorized_client"
**Cause:** Client ID or Secret is incorrect in Supabase

**Fix:**
1. Go to Google Cloud Console > Credentials
2. Copy the Client ID and Client Secret (make sure no extra spaces)
3. Go to Supabase > Authentication > Providers > Google
4. Paste the Client ID and Secret exactly as shown
5. Click Save

### Error: "Access blocked: This app's request is invalid"
**Cause:** OAuth consent screen not properly configured or app not published

**Fix:**
1. Go to Google Cloud Console > OAuth consent screen
2. Make sure:
   - App is in "Testing" mode (with test users added) OR "In production"
   - Your email is added as a test user (if in Testing mode)
   - Scopes include: `email`, `profile`, `openid`

### OAuth works locally but not in production
**Cause:** Production URL not added to Google Cloud Console

**Fix:**
1. Go to Google Cloud Console > Credentials
2. Edit your OAuth Client ID
3. Under "Authorized JavaScript origins", add:
   ```
   https://astro-match1.vercel.app
   ```
4. Save

---

## 📋 Quick Checklist

Before testing with your Fiverr testers, verify:

- [ ] Google Cloud Console: OAuth Client ID created
- [ ] Google Cloud Console: Redirect URI is `https://umorkbxikucjlluzezhq.supabase.co/auth/v1/callback`
- [ ] Google Cloud Console: JavaScript origins include production URL
- [ ] Supabase: Google provider is enabled
- [ ] Supabase: Client ID and Secret are correct
- [ ] Supabase: Site URL is set to `https://astro-match1.vercel.app`
- [ ] Code is deployed to production (✅ Done)
- [ ] Tested locally - Google sign-in works
- [ ] Tested on production - Google sign-in works

---

## 🚀 Next Steps

1. **Complete the verification steps above**
2. **Test Google sign-in on production site**
3. **If everything works, your Fiverr testers can test**
4. **If you encounter errors, check the "Common Errors & Fixes" section above**

---

## 📞 Need Help?

If you're still having issues after following this guide:
1. Check the browser console for specific error messages
2. Check Supabase logs: Dashboard > Logs > Auth Logs
3. Verify all URLs match exactly (no typos, no extra spaces)

