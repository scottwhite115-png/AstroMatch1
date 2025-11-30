# 🎯 Quick Start: 5-Minute Setup

## What You Have Ready

**All code is already written!** You just need to:
1. Run SQL in Supabase
2. Set environment variables
3. Test the flow

---

## Step 1: Supabase Database (2 minutes)

### Copy/Paste These SQL Files

**Open Supabase Dashboard → SQL Editor**

#### Run #1: Create Profiles Table
```sql
-- Copy entire contents of:
scripts/supabase/001_create_profiles.sql

-- Paste and run in SQL Editor
```

#### Run #2: Auth Triggers
```sql
-- Copy entire contents of:
scripts/supabase/002_auth_triggers.sql

-- Paste and run in SQL Editor
```

#### Run #3: Location Functions
```sql
-- Copy entire contents of:
scripts/supabase/003_location_rpc.sql

-- Paste and run in SQL Editor
```

**✅ Database is ready!**

---

## Step 2: Configure Auth Providers (2 minutes)

### Supabase Dashboard → Authentication → Providers

**Enable Email:**
```
☑️ Enable Email provider
☑️ Confirm email: ON
```

**Enable Google (Optional):**
```
☑️ Enable Google provider
   Client ID: [your-google-client-id]
   Secret: [your-google-secret]
```

**Configure Redirect URLs:**
```
Authentication → URL Configuration

Redirect URLs:
  http://localhost:3000/auth/callback
  https://yourdomain.com/auth/callback
```

**✅ Auth is configured!**

---

## Step 3: Environment Variables (1 minute)

### Create `.env.local` in project root:

```bash
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# Optional: OAuth
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-secret
```

**Get these from:**
```
Supabase Dashboard → Settings → API
- Project URL → NEXT_PUBLIC_SUPABASE_URL
- anon public → NEXT_PUBLIC_SUPABASE_ANON_KEY
```

**✅ Environment is set!**

---

## Step 4: Test It! (5 minutes)

### Start dev server:
```bash
npm run dev
```

### Test the flow:

**1. Sign Up**
```
→ Go to /signup
→ Enter email + password
→ Check email for confirmation link
→ Click link
→ Should redirect to /enable-location
```

**2. Enable Location**
```
→ Click "Enable Location"
→ Allow in browser
→ Should save to database
→ Redirects to /profile-builder
```

**3. Complete Profile**
```
→ Add display name
→ Add birthdate (calculates zodiac)
→ Upload photo
→ Submit
→ Redirects to /matches
```

**4. View Matches**
```
→ See list of compatible matches
→ Sorted by compatibility + distance
→ Click to view profiles
```

**✅ Everything works!**

---

## Troubleshooting

### "Profile not found"
→ Wait a few seconds after signup (trigger delay)
→ Or refresh the page

### "Location required"
→ Click browser permission prompt
→ Or go to /enable-location manually

### Email not received
→ Check spam folder
→ Check Supabase → Auth → Logs

### OAuth not working
→ Verify Client ID and Secret
→ Check redirect URL matches exactly

---

## You're Done! 🎉

Your app is now running with:
- ✅ User authentication
- ✅ Email verification
- ✅ GPS location
- ✅ Zodiac matching
- ✅ Distance-based search

**Next:**
- Add more profiles for testing
- Customize the UI
- Deploy to production

---

## Quick Commands

```bash
# Development
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Deploy to Vercel
vercel --prod
```

---

## Need Help?

**Check these docs:**
- `IMPLEMENTATION_GUIDE.md` - Full setup
- `GUARDS_SYSTEM.md` - Route protection
- `LOCATION_SYSTEM.md` - GPS features
- `EMAIL_VERIFICATION.md` - Email flow
- `PHONE_VERIFICATION.md` - SMS OTP
- `MATCH_ENGINE_COMPLETE.md` - Compatibility

**All code is ready to use!** Just follow the steps above. 🚀
