# Verify Google Client ID Configuration

## Your Current Supabase Client ID
Based on what you showed me:
```
785991543102-99prl7ka8ruoadimvh6osade5jrl96d0.apps.googleusercontent.com
```

## Verification Steps

### Step 1: Go to Google Cloud Console
1. Open: https://console.cloud.google.com/apis/credentials
2. Make sure you're in the correct project (the one for AstroMatch)

### Step 2: Find Your OAuth Client ID
1. Look for "OAuth 2.0 Client IDs" in the credentials list
2. You should see one named something like:
   - "AstroMatch Web"
   - "Web client" 
   - Or similar

### Step 3: Verify the Client ID Matches
1. Click on the OAuth Client ID to view/edit it
2. Check the **Client ID** field - it should match:
   ```
   785991543102-99prl7ka8ruoadimvh6osade5jrl96d0.apps.googleusercontent.com
   ```
3. ✅ If it matches - you're good!
4. ❌ If it doesn't match - copy the correct Client ID from Google Cloud Console and update it in Supabase

### Step 4: Verify Redirect URI is Correct
While you're in the OAuth Client ID settings, also verify:

**Authorized redirect URIs** should include EXACTLY:
```
https://umorkbxikucjlluzezhq.supabase.co/auth/v1/callback
```

**Authorized JavaScript origins** should include:
```
http://localhost:3000
https://umorkbxikucjlluzezhq.supabase.co
https://astro-match1.vercel.app
```

### Step 5: Get the Client Secret (if needed)
1. In the same OAuth Client ID page, you'll see the **Client secret**
2. If it shows "Reset secret" or is hidden, you can view it or reset it
3. Make sure this matches what's in Supabase (the secret field)

## If the Client ID Doesn't Match

### Option 1: Update Supabase with Correct Client ID
1. Copy the Client ID from Google Cloud Console
2. Go to Supabase > Authentication > Providers > Google
3. Paste the correct Client ID
4. Also update the Client Secret if needed
5. Click "Save"

### Option 2: Create a New OAuth Client ID (if needed)
If you can't find the matching Client ID:
1. In Google Cloud Console, click "+ CREATE CREDENTIALS" > "OAuth client ID"
2. Application type: **Web application**
3. Name: AstroMatch Web
4. Authorized JavaScript origins:
   - `http://localhost:3000`
   - `https://umorkbxikucjlluzezhq.supabase.co`
   - `https://astro-match1.vercel.app`
5. Authorized redirect URIs:
   - `https://umorkbxikucjlluzezhq.supabase.co/auth/v1/callback`
6. Click "Create"
7. Copy the new Client ID and Secret
8. Update Supabase with these new values

## Quick Checklist

- [ ] Client ID in Supabase matches Google Cloud Console
- [ ] Client Secret in Supabase matches Google Cloud Console
- [ ] Redirect URI is: `https://umorkbxikucjlluzezhq.supabase.co/auth/v1/callback`
- [ ] JavaScript origins include production URL
- [ ] Changes saved in both Google Cloud Console and Supabase

