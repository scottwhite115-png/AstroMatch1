# iOS Signing & Provisioning Profile Fix

## ✅ What I Just Did:
- Switched from Manual to Automatic signing
- Removed hardcoded provisioning profile references
- Set development team to QCFWAM8ZYB

## Step-by-Step Fix in Xcode:

### Step 1: Open Xcode Project
```bash
cd /Users/scottwhite/Desktop/AstroMatch1 && npx cap open ios
```

### Step 2: Configure Signing

1. **Click the blue "App" icon** (top left in Xcode)
2. **Select the "App" target** (under TARGETS)
3. **Click "Signing & Capabilities" tab**
4. **Check "Automatically manage signing"** ✅
5. **Under "Team"**, select your team: **QCFWAM8ZYB**
   - If you don't see it, click "Add Account..." and sign in

### Step 3: If You See Errors

#### Error: "No devices registered"
**Solution:** You don't need devices for App Store builds! This error only matters for development builds.

1. In Xcode, go to **Signing & Capabilities**
2. Make sure **"Automatically manage signing"** is checked
3. For **Release** builds (App Store), you don't need devices
4. The error should go away when you select "Any iOS Device" for archiving

#### Error: "No provisioning profile found"
**Solution A: Let Xcode create it automatically**
1. Make sure "Automatically manage signing" is checked
2. Select your team
3. Xcode will automatically create the profile
4. Wait a few seconds for it to sync

**Solution B: Create App ID in Apple Developer (if needed)**
1. Go to: https://developer.apple.com/account/resources/identifiers/list
2. Click the **"+"** button
3. Select **"App IDs"** → **Continue**
4. Select **"App"** → **Continue**
5. Description: `AstroMatch`
6. Bundle ID: `com.astromatch.ios` (use Explicit)
7. Check **"Sign in with Apple"** (if you use Apple sign-in)
8. Click **Continue** → **Register**

**Solution C: Create Distribution Certificate (if needed)**
1. Go to: https://developer.apple.com/account/resources/certificates/list
2. Click the **"+"** button
3. Select **"iOS App Store"** → **Continue**
4. Follow the prompts
5. Xcode can also create this automatically

### Step 4: Build for Archive

1. **Select "Any iOS Device"** at the top (next to Play button)
   - ⚠️ NOT a simulator (like "iPhone 15 Pro")
   - Must be "Any iOS Device" or "Generic iOS Device"
2. **Product → Archive**
3. If you still see signing errors, try:
   - **Product → Clean Build Folder** (Shift+Cmd+K)
   - Then **Product → Archive** again

### Step 5: If Automatic Signing Still Fails

Try this workaround:

1. In Xcode, go to **Preferences** (Cmd+,)
2. Click **Accounts** tab
3. Select your Apple ID
4. Click **Download Manual Profiles**
5. Go back to **Signing & Capabilities**
6. Uncheck "Automatically manage signing"
7. Under **Provisioning Profile**, select **"Xcode Managed Profile"** (if available)
8. Or select a profile from the dropdown

## Alternative: Build Without Signing (For Testing)

If you just need to test the build locally:

1. **Product → Scheme → Edit Scheme**
2. Select **Run** (left sidebar)
3. **Info** tab → **Build Configuration**: **Debug**
4. This uses development signing which is more lenient

## For App Store Submission:

You MUST have:
- ✅ Valid Apple Developer account ($99/year)
- ✅ App ID registered: `com.astromatch.ios`
- ✅ Distribution certificate (Xcode can create this)
- ✅ App Store provisioning profile (Xcode can create this)

**Xcode can create all of these automatically if:**
- You're signed in with your Apple ID
- "Automatically manage signing" is checked
- You have an active Apple Developer account

## Quick Checklist:

- [ ] Opened project in Xcode
- [ ] Selected App target
- [ ] Went to Signing & Capabilities tab
- [ ] Checked "Automatically manage signing"
- [ ] Selected team: QCFWAM8ZYB
- [ ] Selected "Any iOS Device" (not simulator)
- [ ] Product → Archive

## Still Having Issues?

1. **Check Apple Developer Account:**
   - Go to: https://developer.apple.com/account
   - Make sure your account is active
   - Check that you have the right permissions

2. **Try Xcode's Automatic Fix:**
   - In Signing & Capabilities, if you see a yellow warning
   - Click on it and see if Xcode offers to "Fix Issue"
   - Click "Fix Issue" if available

3. **Reset Signing:**
   - Uncheck "Automatically manage signing"
   - Close Xcode
   - Reopen Xcode
   - Check "Automatically manage signing" again
   - Select your team

Let me know what error you see after trying these steps!

