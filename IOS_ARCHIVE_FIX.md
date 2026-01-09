# Fix: Archive Still Asking for Development Profile

Since the bundle ID is correct and Archive is set to Release, but you're still getting the "no devices" error, try these solutions:

## Solution 1: Force Xcode to Create Distribution Profile

The error happens because Xcode checks for profiles before creating them. Let's force it:

1. **In Xcode, go to Signing & Capabilities:**
   - Click the blue "App" icon
   - Select "App" target
   - Go to "Signing & Capabilities" tab
   - **Uncheck** "Automatically manage signing" (temporarily)
   - Wait 2 seconds
   - **Check** "Automatically manage signing" again
   - Select your team: QCFWAM8ZYB
   - This forces Xcode to refresh its profile cache

2. **Clean everything:**
   - Product → Clean Build Folder (Shift+Cmd+K)
   - Close Xcode completely
   - Reopen Xcode
   - Open the project again

3. **Try Archive:**
   - Select "Any iOS Device"
   - Product → Archive

## Solution 2: Create Distribution Profile Manually

If Solution 1 doesn't work, create the profile manually:

1. **Go to Apple Developer:**
   - https://developer.apple.com/account/resources/profiles/list

2. **Create Distribution Profile:**
   - Click the **"+"** button
   - Select **"App Store"** → Continue
   - Select App ID: **com.astromatch.ios** → Continue
   - Select your Distribution Certificate → Continue
   - Name it: **"AstroMatch App Store"** → Generate
   - **Download** the .mobileprovision file

3. **Install the Profile:**
   - Double-click the downloaded .mobileprovision file
   - It will install automatically

4. **In Xcode:**
   - Signing & Capabilities tab
   - Uncheck "Automatically manage signing"
   - Under "Provisioning Profile", select the profile you just installed
   - Try Product → Archive

## Solution 3: Use Xcode's Automatic Certificate Management

Sometimes Xcode needs to create certificates first:

1. **In Xcode:**
   - Xcode → Settings → Accounts
   - Select your Apple ID
   - Click **"Manage Certificates..."**
   - Click the **"+"** button (bottom left)
   - Select **"iOS Distribution"**
   - Xcode will create the certificate

2. **Go back to your project:**
   - Signing & Capabilities
   - Make sure "Automatically manage signing" is checked
   - Select your team
   - Try Archive again

## Solution 4: Ignore the Warning and Archive Anyway

Sometimes you can Archive even with the warning:

1. **In Xcode, look for a yellow warning icon** in the Signing & Capabilities tab
2. Click on it - it might say "Fix Issue" or show details
3. If it says "Fix Issue", click it and let Xcode try to fix it
4. Then try Product → Archive

## Solution 5: Check Team Permissions

Make sure your Apple ID has the right permissions:

1. Go to: https://developer.apple.com/account
2. Check that you're a member/admin of team QCFWAM8ZYB
3. If you're not, you might need to be added by the team admin

## Solution 6: Build for Generic iOS Device First

Try this sequence:

1. **Product → Scheme → Edit Scheme**
2. Select **Run** (left sidebar)
3. **Info** tab → Build Configuration: **Release**
4. Click **Close**
5. Select **"Generic iOS Device"** (if available) or **"Any iOS Device"**
6. **Product → Archive**

## Most Likely Solution:

Since everything else is correct, the issue is probably that Xcode hasn't created the distribution profile yet. Try **Solution 1** first (uncheck/recheck automatic signing), then **Solution 3** (create distribution certificate), then Archive.

The "no devices" error is a red herring - it's really saying "I can't create a development profile because no devices are registered", but for Archive you need a distribution profile, not a development one.

Let me know which solution works, or if you see a different error after trying these!

