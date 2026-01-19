# How to Create Services ID for Apple Sign In

## Step-by-Step:

1. **Go to Apple Developer Console**
   - https://developer.apple.com/account/resources/identifiers/list

2. **Click "Identifiers" in the left sidebar**

3. **At the top, you'll see different types:**
   - App IDs (this is what you have: com.astromatch.ios)
   - Services IDs (this is what we need for web)
   - etc.

4. **Click on "Services IDs"** (or use the filter/search)

5. **If you see any Services IDs:**
   - Click on it to see the Identifier
   - The Identifier should be something like: `com.astromatch.ios.web` or `com.astromatch.web`

6. **If you DON'T see any Services IDs:**
   - Click the "+" button (top left)
   - Select "Services IDs"
   - Click "Continue"
   - Description: `AstroMatch Web`
   - Identifier: `com.astromatch.ios.web` (or any unique identifier)
   - Check "Sign In with Apple"
   - Click "Continue" > "Register"
   - Then configure it (see next steps)

7. **Configure the Services ID:**
   - Click on the Services ID you created/found
   - Under "Sign In with Apple", click "Configure"
   - Primary App ID: Select `com.astromatch.ios`
   - Domains: `umorkbxikucjlluzezhq.supabase.co`
   - Return URLs: `https://umorkbxikucjlluzezhq.supabase.co/auth/v1/callback`
   - Click "Save" > "Continue" > "Save"

8. **Copy the Services ID Identifier** (the identifier, not the description)
   - It should look like: `com.astromatch.ios.web`

9. **Add it to Supabase:**
   - Go to Supabase > Authentication > Providers > Apple
   - In "Client IDs" field, enter: `com.astromatch.ios.web` (or whatever your Services ID is)
   - Save

