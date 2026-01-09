# Google Play Console Upload Guide - OAuth Fix Update

## AAB File Location
```
/Users/scottwhite/Desktop/AstroMatch1/android/app/release/app-release.aab
```

## What Changed in This Update
- ✅ **Fixed OAuth Chrome issue**: OAuth now happens in-app WebView (no Chrome UI)
- ✅ **No external browser**: Users stay in app during OAuth flow
- ✅ **Google Play approval**: Should now count as in-app testing activity

## Step-by-Step Upload Instructions

### 1. Open Google Play Console
- Go to: https://play.google.com/console
- Sign in with your developer account
- Select your **AstroMatch** app

### 2. Navigate to Production/Testing Track
- In the left sidebar, click **"Release"** → **"Production"** (or **"Testing"** if you're in closed testing)
- If you're in closed testing, click **"Testing"** → **"Closed testing"** → Select your test track

### 3. Create New Release
- Click **"Create new release"** button
- Or if you have a draft release, click **"Edit release"**

### 4. Upload AAB File
- In the **"App bundles"** section, click **"Upload"**
- Navigate to: `/Users/scottwhite/Desktop/AstroMatch1/android/app/release/app-release.aab`
- Select the file and upload it
- Wait for Google Play to process the AAB (usually 1-2 minutes)

### 5. Add Release Notes
- In the **"Release notes"** section, add:
  ```
  Fixed OAuth sign-in to work entirely within the app. Users will no longer be redirected to Chrome during authentication.
  ```

### 6. Review and Rollout
- Review the release details
- Click **"Save"** to save as draft, or **"Review release"** to proceed
- If ready, click **"Start rollout to Production"** (or **"Review release"** for testing)

### 7. Complete Review Process
- Google Play will review your app
- This usually takes 1-3 days
- You'll receive an email when the review is complete

## Important Notes

### Version Code
- The AAB has version code **6** and version name **1.0.5**
- Make sure this is higher than your current published version
- If you need to increment, edit `android/app/build.gradle`:
  ```gradle
  versionCode 7  // Increment this
  versionName "1.0.6"  // Update this
  ```

### Testing Before Release
- Consider uploading to **Internal testing** first
- Test the OAuth flow to ensure no Chrome appears
- Once confirmed, move to **Closed testing** or **Production**

### What to Tell Your Tester
After uploading, let your tester know:
- New version is available in Google Play Console
- OAuth should now work entirely in-app (no Chrome)
- They should test the Google sign-in flow

## Troubleshooting

### If Upload Fails
- Check that version code is higher than current version
- Ensure you have the correct signing key
- Verify AAB file is not corrupted

### If Review is Rejected
- Check the rejection reason in Google Play Console
- Common issues: OAuth still opening Chrome (should be fixed now)
- Contact support if needed

## Next Steps After Upload
1. ✅ Wait for Google Play processing (1-2 minutes)
2. ✅ Review release details
3. ✅ Submit for review
4. ✅ Notify your tester
5. ✅ Monitor for approval (1-3 days)
