# Lunar – Store Submission Walkthrough

**Test profile removed.** You can re-add one for design verification with:
`npm run seed:one-test-profile`

---

## Part 1: Supabase Settings

### 1.1 Open Supabase Dashboard
1. Go to **https://supabase.com/dashboard**
2. Sign in and select your project (e.g. `umorkbxikucjlluzezhq`)

### 1.2 Run Required SQL Migration
1. Click **SQL Editor** in the left sidebar
2. Click **+ New query**
3. Open the file: `supabase/RUN_THIS_IN_SUPABASE.sql`
4. Copy the **entire contents** and paste into the SQL Editor
5. Click **Run** (or Ctrl/Cmd + Enter)
6. Confirm you see success (no red errors)

This adds:
- `allow_instant_messages_connections` and `allow_instant_messages_discover`
- `status` and `suspensionEndsAt`
- `create_instant_match()` – lets users start chats without matching first
- `send_message()` – sends messages (bypasses RLS)

### 1.3 Verify Tables
1. Click **Table Editor** in the left sidebar
2. Confirm these tables exist: `profiles`, `likes`, `matches`, `messages`, `blocks`, `reports`
3. Click `profiles` and confirm columns like `allow_instant_messages_connections` exist

### 1.4 Auth Providers (for Sign in with Google / Apple)
1. Click **Authentication** → **Providers**
2. **Email**: Enabled (default)
3. **Google**: Enable, add OAuth client ID & secret from Google Cloud Console
4. **Apple**: Enable, add Service ID, Key ID, Team ID, Key from Apple Developer

### 1.5 Get API Keys for Vercel
1. Click **Project Settings** (gear icon) → **API**
2. Copy:
   - **Project URL** → `NEXT_PUBLIC_SUPABASE_URL`
   - **anon public** → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - **service_role** → `SUPABASE_SERVICE_ROLE_KEY` (keep secret; never expose in client code)

### 1.6 Storage (for profile photos)
1. Click **Storage** in the left sidebar
2. Confirm `profile-photos` (or similar) bucket exists
3. Policies: authenticated users can upload; public read for display

---

## Part 2: Apple App Store Connect

### 2.1 Prerequisites
- Apple Developer account ($99/year)
- Xcode installed on Mac
- App built and deployed to Vercel (or your hosting)

### 2.2 Open Xcode Project
1. Open Terminal, go to your project:
   ```bash
   cd /Users/scottwhite/AstroMatch1
   cd ios/App
   open App.xcworkspace
   ```
2. Or open `App.xcodeproj` if no workspace exists

### 2.3 Configure Signing
1. Select the **App** target in the left sidebar
2. Open **Signing & Capabilities**
3. Check **Automatically manage signing**
4. Select your **Team** (Apple Developer account)
5. Set **Bundle Identifier** (e.g. `com.astromatch.app` – must match App Store Connect)

### 2.4 Set Version & Build
1. Under **General**, find **Identity**
2. **Version**: `1.0.0`
3. **Build**: `1` (increment for each upload)

### 2.5 Archive & Upload
1. Product → **Scheme** → **Edit Scheme**
2. Under **Run**, set **Build Configuration** to **Release**
3. Close scheme editor
4. Product → **Archive**
5. When done, **Window** → **Organizer**
6. Select your archive → **Distribute App**
7. **App Store Connect** → Next
8. **Upload** → Next → follow prompts

### 2.6 App Store Connect (appstoreconnect.apple.com)
1. Go to **https://appstoreconnect.apple.com**
2. **My Apps** → select your app (or create new app)

#### App Information
- **Name**: Lunar
- **Subtitle**: Chinese Zodiac & Sun Sign insights
- **Primary Category**: Social Networking (or Lifestyle)
- **Privacy Policy URL**: Your app URL + `/profile/account` (or a dedicated privacy policy page)

#### Pricing and Availability
- **Price**: Free
- **Availability**: Select countries/regions

#### App Privacy
- Complete **Data Collection** questionnaire
- Lunar collects: email, display name, photos, birthdate, location (city), preferences
- **Account deletion**: Yes – users can delete in Profile → Account

#### Version Information
- **Screenshots**: Upload for required sizes (e.g. iPhone 6.7", 6.5", 5.5")
- **Description**: 1–2 paragraphs about Lunar and astrology matching
- **Keywords**: dating, astrology, zodiac, compatibility, matches, Chinese zodiac
- **Support URL**: Your website or `mailto:astromatchchat@gmail.com`
- **Marketing URL** (optional): Your website

#### App Review Information
- **Contact info**: Your email and phone
- **Demo account** (optional): Create a test account and provide email/password
- **Notes**: e.g. "Dating app using astrology. Flow: sign up → complete profile → Connections → like/pass → message. Account deletion in Profile → Account."

### 2.7 Submit for Review
1. After build appears in App Store Connect, attach it to the version
2. Complete all required fields (privacy, age rating, etc.)
3. Click **Submit for Review**

---

## Part 3: Google Play Console

### 3.1 Prerequisites
- Google Play Developer account ($25 one-time)
- Android Studio (for building AAB)
- App built and deployed to Vercel

### 3.2 Add Android (if not present)
```bash
cd /Users/scottwhite/AstroMatch1
npm install @capacitor/core @capacitor/cli @capacitor/android
npx cap add android
npx cap sync
```

### 3.3 Build Release AAB
1. Open Android project:
   ```bash
   npx cap open android
   ```
2. In Android Studio: **Build** → **Generate Signed Bundle / APK**
3. Choose **Android App Bundle (AAB)**
4. Create or select a keystore
5. Build **release** variant
6. AAB is saved (e.g. `android/app/release/app-release.aab`)

### 3.4 Google Play Console (play.google.com/console)
1. Go to **https://play.google.com/console**
2. Select your app (or create new)

#### Dashboard
- **Production** → **Create new release**
- Upload your AAB
- Add **Release notes** (e.g. "Initial release of Lunar")

#### Store listing
- **App name**: Lunar
- **Short description** (80 chars): e.g. "Find your perfect match through Chinese Zodiac & Sun Sign compatibility"
- **Full description** (4000 chars): Expand on features
- **App icon**: 512×512 PNG
- **Feature graphic**: 1024×500 PNG
- **Screenshots**: Phone (and tablet if applicable)

#### Content rating
- Complete questionnaire
- Dating apps typically: **Mature 17+**

#### Target audience
- Select age groups (e.g. 18+)
- **Ads**: Declare if your app shows ads (Yes/No)

#### Data safety
- Describe what you collect: email, profile data, photos, location
- **Account deletion**: Yes – users can delete in-app

#### App content
- **Privacy policy**: URL to your privacy policy
- **Ads declaration**: If using ads
- **Account deletion**: Declare in-app deletion

### 3.5 Submit for Review
1. Complete all required sections
2. **Production** → **Start rollout to Production**
3. Review and submit

---

## Quick Checklist

| Step | Supabase | Apple | Google |
|------|----------|-------|--------|
| 1 | Run RUN_THIS_IN_SUPABASE.sql | Open Xcode, set signing | Add Android, build AAB |
| 2 | Verify tables & auth providers | Archive & upload | Upload AAB to Play Console |
| 3 | Add env vars to Vercel | Complete App Store Connect | Complete store listing |
| 4 | — | Submit for review | Submit for review |

---

## Support

- **Support email**: astromatchchat@gmail.com
- **Privacy policy**: In-app at Profile → Account
- **Account deletion**: Profile → Account → Delete Account Permanently
