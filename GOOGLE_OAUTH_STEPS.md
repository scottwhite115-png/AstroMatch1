# Step-by-Step Google OAuth Setup

## Step 1: Open Google Cloud Console

1. Open your browser and go to: **https://console.cloud.google.com/**
2. Sign in with your Google account (the one with the paid developer account)

**Tell me when you're logged in and I'll guide you to the next step!**

---

## Step 2: Create or Select a Project

Once you're logged in:
1. Look at the top of the page - you'll see a project dropdown (it might say "Select a project" or show a project name)
2. Click on the project dropdown
3. Either:
   - **Select an existing project** (if you have one), OR
   - **Click "New Project"** to create a new one
     - Project name: `AstroMatch`
     - Click "Create"

**Tell me when you've selected/created a project!**

---

## Step 3: Enable Required APIs

1. In the left sidebar, click **"APIs & Services"** > **"Library"**
2. In the search bar, type: **"Google+ API"**
3. Click on "Google+ API" in the results
4. Click the **"Enable"** button
5. Go back to the Library (click "APIs & Services" > "Library" again)
6. Search for: **"Google Identity Services API"**
7. If it appears, click on it and click **"Enable"**

**Tell me when you've enabled the APIs!**

---

## Step 4: Configure OAuth Consent Screen

1. In the left sidebar, click **"APIs & Services"** > **"OAuth consent screen"**
2. Select **"External"** (unless you have a Google Workspace account)
3. Click **"Create"**
4. Fill in the form:
   - **App name**: `AstroMatch`
   - **User support email**: (select your email from dropdown)
   - **App logo**: (optional - you can skip this)
   - **Application home page**: `http://localhost:3000` (or your production URL)
   - **Application privacy policy link**: (optional for now)
   - **Application terms of service link**: (optional for now)
   - **Authorized domains**: Leave empty for now
   - **Developer contact information**: (your email)
5. Click **"Save and Continue"**
6. On the "Scopes" page:
   - Click **"Add or Remove Scopes"**
   - Check these scopes:
     - `.../auth/userinfo.email`
     - `.../auth/userinfo.profile`
     - `openid`
   - Click **"Update"**
   - Click **"Save and Continue"**
7. On the "Test users" page:
   - Click **"Add Users"**
   - Add your email address (the one you'll test with)
   - Click **"Add"**
   - Click **"Save and Continue"**
8. Review and click **"Back to Dashboard"**

**Tell me when you've completed the OAuth consent screen!**

---

## Step 5: Create OAuth 2.0 Client ID

1. In the left sidebar, click **"APIs & Services"** > **"Credentials"**
2. Click the **"+ CREATE CREDENTIALS"** button at the top
3. Select **"OAuth client ID"**
4. If prompted about the consent screen, click **"Configure consent screen"** and complete Step 4 above first
5. For **Application type**, select: **"Web application"**
6. Name it: **"AstroMatch Web"**
7. Under **"Authorized JavaScript origins"**, click **"+ ADD URI"** and add:
   ```
   http://localhost:3000
   ```
   Then click **"+ ADD URI"** again and add:
   ```
   https://umorkbxikucjlluzezhq.supabase.co
   ```
8. Under **"Authorized redirect URIs"**, click **"+ ADD URI"** and add:
   ```
   https://umorkbxikucjlluzezhq.supabase.co/auth/v1/callback
   ```
9. Click **"Create"**
10. **IMPORTANT**: A popup will appear with your **Client ID** and **Client Secret**
    - Copy both of these values
    - Keep them safe - you'll need them for Supabase

**Tell me when you have your Client ID and Client Secret copied!**

---

## Step 6: Add Credentials to Supabase

1. Open a new tab and go to: **https://supabase.com/dashboard**
2. Sign in to your Supabase account
3. Select your project: **umorkbxikucjlluzezhq** (or click on it if you see it)
4. In the left sidebar, click **"Authentication"**
5. Click on **"Providers"** (or look for it in the Authentication menu)
6. Find **"Google"** in the list of providers
7. Toggle the **"Enable Google provider"** switch to ON
8. Enter your **Client ID** (from Step 5) in the "Client ID (for OAuth)" field
9. Enter your **Client Secret** (from Step 5) in the "Client Secret (for OAuth)" field
10. Click **"Save"**

**Tell me when you've saved the credentials in Supabase!**

---

## Step 7: Test Google OAuth

1. Make sure your dev server is running:
   ```bash
   cd /Users/scottwhite/Desktop/AstroMatch1
   npm run dev
   ```
2. Open your browser and go to: **http://localhost:3000/login**
3. Click the **"Sign in with Google"** button
4. You should be redirected to Google's sign-in page
5. Sign in with your test account
6. You should be redirected back to your app

**Tell me if it works or if you encounter any errors!**

