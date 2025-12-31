# Step-by-Step Apple Sign In Setup

## Step 1: Open Apple Developer Console

1. Open your browser and go to: **https://developer.apple.com/account/**
2. Sign in with your Apple Developer account (the one you paid for)

**Tell me when you're logged in!**

---

## Step 2: Create App ID

1. In the left sidebar, click **"Certificates, Identifiers & Profiles"**
2. Click **"Identifiers"** in the left sidebar
3. Click the **"+"** button (top left)
4. Select **"App IDs"** > Click **"Continue"**
5. Select **"App"** > Click **"Continue"**
6. Fill in:
   - **Description**: `AstroMatch`
   - **Bundle ID**: Use **"Explicit"** and enter: `com.astromatch.ios`
   - Under **"Capabilities"**, check the box for **"Sign In with Apple"**
7. Click **"Continue"**
8. Review and click **"Register"**

**Tell me when you've created the App ID!**

---

## Step 3: Create Services ID (for Web)

1. Still in "Identifiers", click the **"+"** button again
2. Select **"Services IDs"** > Click **"Continue"**
3. Fill in:
   - **Description**: `AstroMatch Web`
   - **Identifier**: `com.astromatch.ios.web` (or similar - must be unique)
4. Check the box for **"Sign In with Apple"**
5. Click **"Continue"** > **"Register"**
6. Click on the Services ID you just created (click on its name)
7. Under **"Sign In with Apple"**, click **"Configure"**
8. **Primary App ID**: Select `com.astromatch.ios` (the one you created in Step 2)
9. **Website URLs**:
   - **Domains and Subdomains**: `umorkbxikucjlluzezhq.supabase.co`
   - **Return URLs**: `https://umorkbxikucjlluzezhq.supabase.co/auth/v1/callback`
10. Click **"Save"** > **"Continue"** > **"Save"**

**Tell me when you've configured the Services ID!**

---

## Step 4: Create Key for Sign In with Apple

1. In the left sidebar, click **"Keys"**
2. Click the **"+"** button (top left)
3. Fill in:
   - **Key Name**: `AstroMatch Sign In Key`
   - Check the box for **"Sign In with Apple"**
4. Click **"Configure"** next to "Sign In with Apple"
5. **Primary App ID**: Select `com.astromatch.ios`
6. Click **"Save"** > **"Continue"**
7. Click **"Register"**
8. **IMPORTANT**: A page will show your Key ID
   - **Copy the Key ID** (you'll need this)
   - **Download the .p8 key file** (you can only download this once!)
   - Keep both safe

**Tell me when you have the Key ID and have downloaded the .p8 file!**

---

## Step 5: Get Your Team ID

1. Look at the top right of the Apple Developer portal
2. You should see your name/account
3. Click on it - you'll see your **Team ID** (it's a 10-character string like `ABC123DEFG`)
4. **Copy your Team ID**

**Tell me when you have your Team ID!**

---

## Step 6: Add Apple Sign In to Supabase

1. Go back to Supabase Dashboard: **https://supabase.com/dashboard**
2. Select your project
3. Go to **"Authentication"** > **"Providers"**
4. Find **"Apple"** in the list
5. Toggle **"Enable Apple provider"** to **ON**
6. Fill in:
   - **Services ID**: `com.astromatch.ios.web` (the Services ID you created)
   - **Secret Key**: Open the downloaded .p8 file in a text editor and copy ALL its contents (including the BEGIN/END lines)
   - **Key ID**: Paste the Key ID from Step 4
   - **Team ID**: Paste your Team ID from Step 5
7. Click **"Save"**

**Tell me when you've saved!**

---

## Step 7: Test Apple Sign In

1. Go to: **http://localhost:3000/login**
2. Click **"Sign in with Apple"**
3. You should see Apple's sign-in page
4. Sign in with your Apple ID
5. You should be redirected back to your app

**Tell me if it works!**

