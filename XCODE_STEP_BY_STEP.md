# Xcode Step-by-Step Walkthrough for AstroMatch

## 🎯 Goal: Build and upload your app to the App Store

---

## STEP 1: Xcode Should Be Opening Now

I've started opening Xcode for you. You should see:
- Xcode icon bouncing in your dock
- Xcode window opening
- Your project loading

**If Xcode doesn't open automatically:**
- Open Xcode manually (Applications folder, or Spotlight: Cmd+Space, type "Xcode")
- File → Open
- Navigate to: `Desktop → AstroMatch1 → ios`
- Open the `App` folder (or `.xcworkspace` file if you see it)

---

## STEP 2: Wait for Indexing (First Time Only)

When Xcode first opens, you'll see:
- A progress bar at the top saying "Indexing..." or "Processing..."
- This is normal and can take 2-5 minutes
- **Wait for this to finish before proceeding**

---

## STEP 3: Understanding the Xcode Window

Once loaded, you'll see:

**Left Sidebar (Project Navigator):**
- Blue folder icon at the top = Your project
- Files and folders listed below

**Top Toolbar:**
- Play button (▶️) = Run
- Stop button (⏹️) = Stop
- Device selector = Shows what device/simulator is selected

**Main Area:**
- Shows file contents or project settings

**Bottom Area:**
- May show build logs or debug console

---

## STEP 4: Select Your Project (IMPORTANT!)

1. **Look at the LEFT SIDEBAR** (called "Project Navigator")
2. **Click on the BLUE FOLDER ICON** at the very top
   - It should say "App" or have a folder icon
   - This is your project settings
3. The main area should now show project settings

---

## STEP 5: Select the Target

In the main area, you'll see:

**TARGETS** section (left side of main area)
- Under this, you should see "App" listed
- **Click on "App"** (it should highlight/select)

If you see multiple targets, click on the one that says "App" for AstroMatch

---

## STEP 6: Go to Signing & Capabilities

At the TOP of the main area, you'll see tabs:
- General
- **Signing & Capabilities** ← Click this one
- Info
- Build Settings
- etc.

Click **"Signing & Capabilities"**

---

## STEP 7: Configure Signing

You'll now see signing options:

### Option A: If you see "Automatically manage signing" checkbox:
1. **Check the box** that says "Automatically manage signing"
2. Under **"Team"** dropdown:
   - Click the dropdown menu
   - If you see your Apple ID/Developer account, select it
   - If you see "Add an Account..." or nothing:
     - Click "Add an Account..."
     - Sign in with your Apple ID
     - If you don't have a Developer account ($99/year), you'll need to sign up first

### Option B: If you see errors (red text):
- You may need an Apple Developer account
- Go to: https://developer.apple.com/programs/
- Sign up for the Apple Developer Program ($99/year)
- Then come back and select your team

**What you should see:**
- ✅ Green checkmark next to "Automatically manage signing"
- ✅ Your Team selected
- ✅ Bundle Identifier: com.astromatch.ios
- ✅ No red error messages

---

## STEP 8: Check Version Number

Still in the **Signing & Capabilities** tab, look for:

**"Version"** field:
- Should say: **1.0.4**

**"Build"** field:
- Should say: **5** (or higher)

If these are different, update them to match.

---

## STEP 9: Select Build Target (CRITICAL STEP!)

Look at the TOP of Xcode, near the Play button. You'll see a device selector that might say:
- "App" 
- "iPhone 15 Pro"
- "Any iOS Device"
- Or a device name

**Click on this dropdown**

**IMPORTANT:** Select **"Any iOS Device"** or **"Generic iOS Device"**
- ⚠️ DO NOT select a simulator (like "iPhone 15 Pro Simulator")
- ⚠️ You MUST select a real device option to create an archive

If "Any iOS Device" isn't in the list:
- Make sure you completed Step 7 (signing is configured)
- Try selecting "Generic iOS Device" if available
- If still not available, you may need to connect an iPhone/iPad or complete signing first

---

## STEP 10: Create Archive

1. In the top menu bar, click **"Product"**
2. In the dropdown menu, click **"Archive"**
3. Wait for the build to start (this takes 5-10 minutes)

**What you'll see:**
- Progress indicator at the top center of Xcode
- "Building..." or "Preparing Archive..."
- Build log may appear at the bottom
- Just wait - don't close Xcode!

**Common messages:**
- "Building..." = Normal, just wait
- Any red errors = We'll need to fix those (tell me what they say)

---

## STEP 11: Organizer Window Opens

When the archive completes:
- The **Organizer** window will open automatically
- If it doesn't: Go to **Window → Organizer** (or press Cmd+Shift+9)

**What you'll see:**
- List of archives on the left
- Your new archive should be selected (highlighted)
- Details on the right side
- Blue **"Distribute App"** button

---

## STEP 12: Distribute App

1. Click the blue **"Distribute App"** button (on the right side)
2. A dialog window will appear

---

## STEP 13: Choose Distribution Method

In the dialog:

1. Select **"App Store Connect"** (first option, usually selected by default)
2. Click **"Next"** button (bottom right)

---

## STEP 14: Choose Upload or Export

1. Select **"Upload"** (first option)
   - This uploads directly to App Store Connect
2. Click **"Next"**

---

## STEP 15: Distribution Options

1. Usually leave everything as default
2. Click **"Next"**

---

## STEP 16: Signing Options

1. Usually **"Automatically manage signing"** is fine (should be selected)
2. Click **"Next"**

---

## STEP 17: Review & Upload

1. Review the summary (you can scroll through it)
2. Click **"Upload"** button (bottom right)
3. Wait for upload (5-15 minutes)

**What you'll see:**
- Progress bar
- "Uploading..." status
- Don't close Xcode during upload!

---

## STEP 18: Upload Complete!

When done, you'll see:
- ✅ "Upload Successful" or similar message
- You can close the dialog
- You can close Xcode (or keep it open)

**Next:** Go to App Store Connect to submit for review (see next section)

---

## STEP 19: Submit in App Store Connect

1. Go to: https://appstoreconnect.apple.com
2. Sign in with your Apple ID (same one you used in Xcode)
3. Click **"My Apps"**
4. Click on **AstroMatch** (or create it if it's your first time)
5. Click **"+ Version"** or select the version (1.0.4)
6. Under **"Build"**, click **"Select a build before you submit your app"**
7. Your uploaded build should appear (may take 5-30 minutes)
8. Select your build (version 1.0.4)
9. Fill in **"What's New in This Version"**:
   ```
   • Added native splash screen for faster app launch
   • New onboarding walkthrough to help you get started
   • Improved app structure for better performance
   • Enhanced user experience with native screens
   ```
10. Answer any required questions (export compliance, etc.)
11. Click **"Submit for Review"**

---

## 🆘 Troubleshooting

### "No signing certificate" error
- Make sure you have an Apple Developer account
- Go back to Step 7 and add your account

### "Archive" is grayed out
- Make sure you selected "Any iOS Device" (Step 9)
- Make sure signing is configured (Step 7)

### Build errors (red text)
- Tell me what the error says and I'll help fix it
- Common: Missing dependencies, signing issues

### Upload fails
- Check internet connection
- Make sure you're signed in to App Store Connect
- Try uploading again

---

## 📞 Need Help?

Just tell me:
- What step you're on
- What you see on your screen
- Any error messages (copy/paste them)
- What's confusing

I'll guide you through it!

