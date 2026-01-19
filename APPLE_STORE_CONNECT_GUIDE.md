# Apple App Store Connect Upload Guide - OAuth Fix Update

## iOS Version Info
- **Version:** 1.0.7
- **Build:** 8
- **Bundle ID:** com.astromatch.ios

## What Changed in This Update
- ✅ **Fixed OAuth Chrome/Safari issue**: OAuth now happens in-app WebView (no external browser)
- ✅ **No external browser**: Users stay in app during OAuth flow
- ✅ **Same fix as Android**: Consistent behavior across platforms

## Step-by-Step Upload Instructions

### 1. Open Xcode
- Open: `/Users/scottwhite/Desktop/AstroMatch1/ios/App/App.xcodeproj`
- Wait for Xcode to index the project

### 2. Select the Correct Scheme
- At the top, make sure:
  - **Scheme:** App
  - **Destination:** Any iOS Device (or Generic iOS Device)

### 3. Archive the App
- Go to menu: **Product** → **Archive**
- Wait for the archive to build (this may take a few minutes)
- When complete, the Organizer window will open automatically

### 4. Validate the Archive
- In the Organizer window, select your archive
- Click **"Validate App"**
- Sign in with your Apple Developer account
- Select your team: **QCFWAM8ZYB**
- Wait for validation to complete
- Fix any issues if they appear

### 5. Distribute the App
- Still in Organizer, click **"Distribute App"**
- Select: **"App Store Connect"**
- Click **"Next"**
- Select: **"Upload"**
- Click **"Next"**

### 6. Select Distribution Options
- **Distribution options:** Leave defaults (App Thinning: All compatible device variants)
- Click **"Next"**

### 7. Signing
- Select: **"Automatically manage signing"**
- Select your team: **QCFWAM8ZYB**
- Click **"Next"**

### 8. Review and Upload
- Review the summary
- Click **"Upload"**
- Wait for upload to complete (this may take several minutes)

### 9. Go to App Store Connect
- Open: https://appstoreconnect.apple.com
- Sign in with your Apple Developer account
- Select your **AstroMatch** app

### 10. Create New Version
- Click **"App Store"** tab
- Click **"+"** next to iOS App (or click version number if updating existing)
- Enter version: **1.0.7**
- Click **"Create"**

### 11. Select Build
- Scroll to **"Build"** section
- Click **"Select a build before you submit your app"**
- Select build **8** (should appear after upload completes, may take 10-30 minutes)
- Click **"Done"**

### 12. Add What's New
- Scroll to **"What's New in This Version"**
- Add:
  ```
  Fixed OAuth sign-in to work entirely within the app. Users will no longer be redirected to Safari during authentication.
  ```

### 13. Submit for Review
- Review all sections (App Information, Pricing, etc.)
- Scroll to top and click **"Add for Review"** or **"Submit for Review"**
- Answer any export compliance questions
- Click **"Submit"**

## Important Notes

### Build Processing
- After uploading, Apple needs to process the build (10-30 minutes)
- You'll see the build appear in App Store Connect once processing is complete
- Don't worry if it doesn't appear immediately

### Version Matching
- iOS version (1.0.7) matches Android version (1.0.7)
- Build number (8) matches Android version code (8)
- This keeps both platforms in sync

### Testing Before Submission
- Consider using **TestFlight** first to test the OAuth fix
- Upload to TestFlight, then test before submitting to App Store

## Troubleshooting

### If Archive Fails
- Check signing: **Signing & Capabilities** → Make sure "Automatically manage signing" is checked
- Clean build folder: **Product** → **Clean Build Folder** (Shift+Cmd+K)
- Try again

### If Upload Fails
- Check internet connection
- Verify Apple Developer account is active
- Check that bundle ID matches App Store Connect

### If Build Doesn't Appear
- Wait 10-30 minutes for processing
- Check email for any processing errors
- Verify the upload completed successfully in Xcode

## Next Steps After Upload
1. ✅ Wait for build processing (10-30 minutes)
2. ✅ Create new version in App Store Connect
3. ✅ Select the processed build
4. ✅ Add release notes
5. ✅ Submit for review
6. ✅ Wait for Apple review (usually 1-3 days)

## What the Reviewer Will See
- OAuth sign-in works entirely in-app
- No external Safari browser opens
- Consistent with Android version
- Should pass App Store review
