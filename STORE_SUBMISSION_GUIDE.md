# Lunar – Google Play & Apple App Store Submission Guide

## Pre-Submission Checklist

### 1. Supabase Setup
- [ ] Run `supabase/RUN_THIS_IN_SUPABASE.sql` in Supabase SQL Editor (adds columns + `create_instant_match` + `send_message` functions)
- [ ] Ensure `SUPABASE_SERVICE_ROLE_KEY` is set in your deployment env (Vercel) – required for account deletion and instant messaging

### 2. Deploy Web App
- [ ] Deploy to Vercel (or your hosting): `npm run build` then deploy
- [ ] Verify production URL loads correctly (e.g. https://astro-match1.vercel.app)
- [ ] Update `capacitor.config.ts` if your production URL differs from `server.url`

### 3. Branding (Already Updated)
- [x] App name: **Lunar**
- [x] Capacitor appName: Lunar
- [x] iOS CFBundleDisplayName: Lunar
- [x] Manifest: Lunar
- [x] Layout metadata: Lunar

---

## Apple App Store Connect

### Step 1: Open Xcode
```bash
cd ios/App
open App.xcworkspace   # or App.xcodeproj
```

### Step 2: Xcode Configuration
1. **Signing & Capabilities**
   - Select your Apple Developer team
   - Ensure Bundle Identifier is correct (e.g. `com.astromatch.app`)
   - Enable "Automatically manage signing"

2. **Version & Build**
   - Set Marketing Version (e.g. `1.0.0`)
   - Increment Build number for each upload

3. **App Icons**
   - Ensure `Assets.xcassets/AppIcon.appiconset` has all required sizes (1024x1024 for App Store)

### Step 3: Build for Release
1. Product → Scheme → Edit Scheme → Run → Build Configuration: **Release**
2. Product → **Archive**
3. Window → Organizer → Distribute App → **App Store Connect** → Upload

### Step 4: App Store Connect (appstoreconnect.apple.com)
1. **App Information**
   - Name: Lunar
   - Subtitle: Chinese Zodiac & Sun Sign insights
   - Primary Category: Social Networking or Lifestyle
   - Privacy Policy URL: (e.g. your app URL + /profile/account with Privacy Policy section, or a dedicated URL)

2. **Pricing and Availability**
   - Free
   - Select countries/regions

3. **App Privacy**
   - Complete the Data Collection questionnaire
   - Lunar collects: Email, display name, photos, birthdate, location (city), preferences
   - Account deletion: Yes (in-app)

4. **App Review Information**
   - Contact email & phone
   - Demo account (optional but helpful): Provide test email/password if login required
   - Notes: "Dating app using astrology compatibility. Core flow: sign up → complete profile → view Connections → like/pass → message matches."

5. **Version Information**
   - Screenshots: iPhone 6.7", 6.5", 5.5" (required sizes)
   - Description, Keywords, Support URL, Marketing URL

### Apple Notes
- **Sign in with Apple**: Required if you offer third-party sign-in (Google, etc.). Add it or remove other sign-in options.
- **Account deletion**: Lunar has in-app deletion in Profile → Account. Must be clearly discoverable.
- **Guideline 5.1.1**: Account deletion now deletes user from Supabase Auth (server-side).

---

## Google Play Console

### Step 1: Add Android (if not present)
```bash
npm install @capacitor/core @capacitor/cli @capacitor/ios @capacitor/android
npx cap add android
npx cap sync
```

### Step 2: Android Studio
```bash
npx cap open android
```
1. Build → Generate Signed Bundle / APK → **Android App Bundle (AAB)**
2. Create or select keystore
3. Build release AAB

### Step 3: Google Play Console (play.google.com/console)
1. **Create app** (or select existing)
2. **Dashboard** → Production → Create new release

3. **Store listing**
   - App name: Lunar
   - Short description (80 chars): "Find your perfect match through Chinese Zodiac & Sun Sign compatibility"
   - Full description (4000 chars): Expand on features, astrology matching, messaging, etc.
   - App icon: 512x512 PNG
   - Feature graphic: 1024x500
   - Screenshots: Phone, 7" tablet, 10" tablet (as required)

4. **Content rating**
   - Complete questionnaire
   - Dating apps typically: Mature 17+

5. **Target audience**
   - Age groups
   - Ads: Yes/No (declare if using ads)

6. **Privacy policy**
   - URL to your privacy policy (in-app or hosted)

7. **App content**
   - Data safety form (what you collect, how it's used)
   - Ads declaration (if applicable)
   - Account deletion: Declare that users can delete accounts in-app

8. **Upload AAB**
   - Production track
   - Release notes

### Google Notes
- **14-day testing**: You mentioned Google accepted after 14 days – ensure you've completed internal/testing tracks if needed
- **Data safety**: Accurately describe data collection (email, profile data, photos, location)

---

## Quick Reference

| Item | Apple | Google |
|------|-------|--------|
| App name | Lunar | Lunar |
| Bundle ID / Package | com.astromatch.app | com.astromatch.app (or update in build.gradle) |
| Account deletion | Profile → Account → Delete | Same |
| Privacy policy | Required | Required |
| Sign in with Apple | Required if other social login | N/A |

---

## Troubleshooting

**"App loads blank on device"**
- Check `capacitor.config.ts` → `server.url` points to your live deployment
- Ensure CORS allows your app origin
- Test URL in device browser first

**"Account deletion fails"**
- Verify `SUPABASE_SERVICE_ROLE_KEY` is set in Vercel (or backend env)
- Check Supabase Auth allows `auth.admin.deleteUser`

**"Messages/instant match fails"**
- Run `RUN_THIS_IN_SUPABASE.sql` – creates `create_instant_match` and `send_message` functions
- Ensure `allow_instant_messages_connections` column exists on profiles

---

## Support

- **Support email**: astromatchchat@gmail.com (update if different)
- **Privacy policy**: In-app at Profile → Account (Privacy Policy section)
