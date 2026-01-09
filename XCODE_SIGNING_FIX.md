# Manual Provisioning Profile Fix

Since automatic signing isn't working, let's try a workaround.

## Option 1: Try Manual Signing (Temporary Workaround)

In Xcode, Signing & Capabilities tab:

1. **Uncheck** "Automatically manage signing"
2. Under "Provisioning Profile", you'll see a dropdown
3. Click the dropdown - it might show "None" or have options
4. If you see any profiles listed, try selecting one
5. If you see "Download Profile" or "Import Profile", try that

If this doesn't work, we need to create a provisioning profile manually.

## Option 2: Create Provisioning Profile Manually

1. Go to: https://developer.apple.com/account/resources/profiles/list
2. Click the **"+"** button (top left)
3. Select **"App Store"** (for distribution)
4. Click **Continue**
5. Select your App ID: **com.astromatch.ios**
6. Click **Continue**
7. Select your certificate (if you have one, or create one if needed)
8. Name it: "AstroMatch App Store"
9. Click **Generate**
10. Download the profile
11. In Xcode, double-click the downloaded .mobileprovision file to install it
12. Go back to Xcode Signing & Capabilities
13. Uncheck "Automatically manage signing"
14. Select the profile from the dropdown

## Option 3: Check Certificate Status

The issue might be missing certificates. Check:

1. Go to: https://developer.apple.com/account/resources/certificates/list
2. Do you see any certificates? (Development or Distribution)
3. If not, you may need to create one, or Xcode should create it automatically

