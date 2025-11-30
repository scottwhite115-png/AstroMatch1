# 🧱 Cursor Task: Setup Supabase Auth + Profiles + GPS

**Complete setup for dating app authentication, profiles, and location system.**

---

## 0️⃣ Environment & Supabase Dashboard Setup

### Create `.env.local` in project root:

```bash
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Get these values from:**
- Supabase Dashboard → Settings → API
- Project URL → `NEXT_PUBLIC_SUPABASE_URL`
- Project API keys → anon/public → `NEXT_PUBLIC_SUPABASE_ANON_KEY`

### Configure Supabase Dashboard:

**Authentication → URL Configuration:**
```
Site URL: http://localhost:3000
Redirect URLs:
  - http://localhost:3000/auth/callback
  - http://localhost:3000/
```

**Authentication → Providers:**
```
☑️ Email (Enable + Confirm email ON)
☑️ Google (optional - need Client ID + Secret)
☑️ Facebook (optional - need App ID + Secret)  
☑️ Apple (optional - need Service ID)
☑️ Phone (optional - need Twilio config)
```

**Authentication → Email Templates:**
```
Confirm signup: Keep default or customize
Rate limits: Keep defaults (prevent abuse)
```

---

## 1️⃣ SQL — Run in Supabase SQL Editor

### Migration 1: Create Profiles Table

**Copy contents of `scripts/supabase/001_create_profiles.sql` and run:**

```sql
-- Creates profiles table with location support, indexes, and RLS
-- This file already exists in your project
```

**Or paste this directly:**

```sql
-- Migration: Create optimized profiles table
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  display_name TEXT,
  west_east TEXT,          -- e.g. 'Aquarius-Monkey'
  photo_url TEXT,
  email TEXT,
  phone TEXT,
  email_verified BOOLEAN DEFAULT FALSE,
  phone_verified BOOLEAN DEFAULT FALSE,
  lat DOUBLE PRECISION,
  lon DOUBLE PRECISION,
  last_active TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Location constraints
ALTER TABLE public.profiles
  ADD CONSTRAINT lat_range CHECK (lat IS NULL OR (lat >= -90 AND lat <= 90));
ALTER TABLE public.profiles
  ADD CONSTRAINT lon_range CHECK (lon IS NULL OR (lon >= -180 AND lon <= 180));

-- Enable extensions for geo queries
CREATE EXTENSION IF NOT EXISTS cube;
CREATE EXTENSION IF NOT EXISTS earthdistance;

-- Geo index for fast nearby searches
CREATE INDEX IF NOT EXISTS idx_profiles_earth ON public.profiles
  USING gist (ll_to_earth(lat, lon));

-- Additional indexes
CREATE INDEX IF NOT EXISTS idx_profiles_west_east ON public.profiles (west_east)
  WHERE west_east IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_profiles_last_active ON public.profiles (last_active DESC NULLS LAST);

-- Enable RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- RLS: anyone can read profiles
CREATE POLICY "read_public_profiles"
ON public.profiles FOR SELECT
USING (true);

-- RLS: user can insert own profile
CREATE POLICY "insert_own_profile"
ON public.profiles FOR INSERT
WITH CHECK (auth.uid() = id);

-- RLS: user can update own profile
CREATE POLICY "update_own_profile"
ON public.profiles FOR UPDATE
USING (auth.uid() = id)
WITH CHECK (auth.uid() = id);

-- Trigger: auto-update updated_at
CREATE OR REPLACE FUNCTION public.tg_profiles_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_profiles_updated_at ON public.profiles;
CREATE TRIGGER trg_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.tg_profiles_updated_at();
```

---

### Migration 2: Auth Triggers

**Copy contents of `scripts/supabase/002_auth_triggers.sql` and run:**

```sql
-- Auto-create profile on user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (
    id,
    email,
    display_name,
    photo_url,
    email_verified,
    phone_verified
  )
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'name', ''),
    NEW.raw_user_meta_data->>'avatar_url',
    NEW.email_confirmed_at IS NOT NULL,
    NEW.phone_confirmed_at IS NOT NULL
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- Sync verification status
CREATE OR REPLACE FUNCTION public.sync_verification_flags()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE public.profiles
  SET 
    email_verified = (NEW.email_confirmed_at IS NOT NULL),
    phone_verified = (NEW.phone_confirmed_at IS NOT NULL),
    email = NEW.email
  WHERE id = NEW.id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_updated ON auth.users;
CREATE TRIGGER on_auth_user_updated
  AFTER UPDATE ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.sync_verification_flags();
```

---

### Migration 3: Location RPC Functions

**Copy contents of `scripts/supabase/003_location_rpc.sql` and run:**

```sql
-- Get profiles within radius
CREATE OR REPLACE FUNCTION profiles_within_radius(
  user_lat DOUBLE PRECISION,
  user_lon DOUBLE PRECISION,
  radius_m INTEGER,
  limit_count INTEGER DEFAULT 100,
  exclude_id UUID DEFAULT NULL
)
RETURNS TABLE (
  id UUID,
  display_name TEXT,
  west_east TEXT,
  photo_url TEXT,
  lat DOUBLE PRECISION,
  lon DOUBLE PRECISION,
  last_active TIMESTAMPTZ,
  distance_m DOUBLE PRECISION,
  distance_km DOUBLE PRECISION
)
LANGUAGE SQL STABLE
AS $$
  SELECT 
    p.id, p.display_name, p.west_east, p.photo_url,
    p.lat, p.lon, p.last_active,
    earth_distance(ll_to_earth(user_lat, user_lon), ll_to_earth(p.lat, p.lon)) as distance_m,
    earth_distance(ll_to_earth(user_lat, user_lon), ll_to_earth(p.lat, p.lon)) / 1000.0 as distance_km
  FROM public.profiles p
  WHERE p.west_east IS NOT NULL
    AND p.lat IS NOT NULL
    AND p.lon IS NOT NULL
    AND (exclude_id IS NULL OR p.id != exclude_id)
    AND earth_distance(ll_to_earth(user_lat, user_lon), ll_to_earth(p.lat, p.lon)) < radius_m
  ORDER BY distance_m ASC
  LIMIT limit_count;
$$;

-- Count profiles in radius
CREATE OR REPLACE FUNCTION count_profiles_in_radius(
  user_lat DOUBLE PRECISION,
  user_lon DOUBLE PRECISION,
  radius_m INTEGER
)
RETURNS INTEGER
LANGUAGE SQL STABLE
AS $$
  SELECT COUNT(*)::INTEGER
  FROM public.profiles p
  WHERE p.west_east IS NOT NULL
    AND p.lat IS NOT NULL
    AND p.lon IS NOT NULL
    AND earth_distance(ll_to_earth(user_lat, user_lon), ll_to_earth(p.lat, p.lon)) < radius_m;
$$;

-- Update last active
CREATE OR REPLACE FUNCTION update_last_active(user_id UUID)
RETURNS VOID
LANGUAGE SQL VOLATILE
AS $$
  UPDATE public.profiles SET last_active = NOW() WHERE id = user_id;
$$;

-- Grant permissions
GRANT EXECUTE ON FUNCTION profiles_within_radius TO authenticated;
GRANT EXECUTE ON FUNCTION count_profiles_in_radius TO authenticated;
GRANT EXECUTE ON FUNCTION update_last_active TO authenticated;
```

---

## 2️⃣ Verify Database Setup

### Test in Supabase SQL Editor:

```sql
-- Check tables exist
SELECT tablename FROM pg_tables WHERE schemaname = 'public';
-- Should show: profiles

-- Check extensions
SELECT extname FROM pg_extension WHERE extname IN ('cube', 'earthdistance');
-- Should return 2 rows

-- Check indexes
SELECT indexname FROM pg_indexes WHERE tablename = 'profiles';
-- Should show: idx_profiles_earth, idx_profiles_west_east, etc.

-- Check RLS enabled
SELECT tablename, rowsecurity FROM pg_tables WHERE tablename = 'profiles';
-- rowsecurity should be 't' (true)

-- Test RPC function
SELECT * FROM profiles_within_radius(37.7749, -122.4194, 50000, 10);
-- Should return empty or nearby profiles
```

---

## 3️⃣ Code Setup — Files Already Created

### All these files are already in your project! Just verify they exist:

**Core Libraries:**
- ✅ `lib/supabaseClient.ts` - Browser Supabase client
- ✅ `lib/auth.ts` - Auth functions (signup, signin, logout, etc.)
- ✅ `lib/guards.ts` - Client-side authorization guards
- ✅ `lib/guards-server.ts` - Server-side guards
- ✅ `lib/profiles.ts` - Profile CRUD operations
- ✅ `lib/location.ts` - GPS utilities
- ✅ `lib/phone.ts` - Phone verification

**React Hooks:**
- ✅ `lib/hooks/use-auth.ts` - useAuth, useProfile
- ✅ `lib/hooks/use-guards.ts` - Guard hooks
- ✅ `lib/hooks/use-location.ts` - Location hooks

**Pages:**
- ✅ `app/auth/callback/page.tsx` - OAuth callback handler
- ✅ `app/auth/verify-phone/page.tsx` - Phone OTP flow
- ✅ `app/auth/enable-location/page.tsx` - Location permission

**Components:**
- ✅ `components/phone-input.tsx` - PhoneInput + OtpInput
- ✅ `components/location-status.tsx` - Location display

---

## 4️⃣ Create Missing Pages

### Page 1: Email Verification

**Create: `app/auth/verify-email/page.tsx`**

```typescript
/**
 * Email Verification Page
 * Shows after signup, prompts user to check email
 */

"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import { resendConfirmation } from "@/lib/auth";

export default function VerifyEmailPage() {
  const router = useRouter();
  const [resending, setResending] = useState(false);
  const [message, setMessage] = useState("");
  const [countdown, setCountdown] = useState(0);
  const [email, setEmail] = useState("");

  useEffect(() => {
    // Get user email
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (user?.email) {
        setEmail(user.email);
        
        // Check if already verified
        if (user.email_confirmed_at) {
          router.replace("/auth/enable-location");
        }
      }
    });
  }, [router]);

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  const handleResend = async () => {
    if (!email) return;

    setResending(true);
    setMessage("");

    try {
      const { error } = await resendConfirmation(email);
      if (error) throw error;

      setMessage("✓ Email sent! Check your inbox.");
      setCountdown(60);
    } catch (error: any) {
      setMessage(`Error: ${error.message}`);
    } finally {
      setResending(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8">
        <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <svg className="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
          </svg>
        </div>

        <h1 className="text-2xl font-bold text-center mb-2">Check your email</h1>
        
        {email && (
          <p className="text-center text-gray-600 mb-4">
            We sent a verification link to <span className="font-medium">{email}</span>
          </p>
        )}

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
          <h3 className="font-medium text-blue-900 mb-2">Next steps:</h3>
          <ol className="text-sm text-blue-800 space-y-1 list-decimal list-inside">
            <li>Check your inbox</li>
            <li>Click the verification link</li>
            <li>You'll be redirected back here</li>
          </ol>
        </div>

        {message && (
          <div className={`mb-4 p-3 rounded text-sm ${
            message.startsWith("✓") 
              ? "bg-green-100 text-green-800 border border-green-200"
              : "bg-red-100 text-red-800 border border-red-200"
          }`}>
            {message}
          </div>
        )}

        <button
          onClick={handleResend}
          disabled={resending || countdown > 0}
          className="w-full px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {resending ? "Sending..." : countdown > 0 ? `Resend in ${countdown}s` : "Resend email"}
        </button>
      </div>
    </div>
  );
}
```

---

### Page 2: Update App Layout

**Edit: `app/layout.tsx`**

Add location auto-update:

```typescript
"use client";

import { useLocationOnStart } from "@/lib/hooks/use-location";
import "./globals.css";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Auto-update location on app start (throttled to 6 minutes)
  useLocationOnStart(6);

  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
```

---

## 5️⃣ Test Complete Flow

### Test Signup → Verification → Location

1. **Start dev server:**
   ```bash
   npm run dev
   ```

2. **Sign up with email:**
   - Go to `/signup` (create this page or use form)
   - Enter email + password
   - Submit

3. **Check email:**
   - Open inbox
   - Click verification link
   - Should redirect to `/auth/callback`
   - Then to `/auth/enable-location`

4. **Enable location:**
   - Click "Enable Location"
   - Allow in browser prompt
   - Should save to database
   - Check Supabase → Table Editor → profiles
   - Should see lat/lon populated

5. **Verify database:**
   ```sql
   SELECT id, email, email_verified, lat, lon, last_active 
   FROM public.profiles 
   LIMIT 5;
   ```

---

## 6️⃣ Troubleshooting

### Email not received?
- Check Supabase → Authentication → Logs
- Check spam folder
- Verify email provider is enabled
- Check rate limits

### Profile not created?
- Wait 5 seconds after signup (trigger delay)
- Check Supabase → Database → Logs
- Verify triggers are created:
  ```sql
  SELECT tgname FROM pg_trigger WHERE tgrelid = 'auth.users'::regclass;
  ```

### Location permission denied?
- Check browser settings
- Try different browser
- Use HTTPS (required for geolocation in production)

### RLS preventing reads/writes?
- Check policies exist:
  ```sql
  SELECT * FROM pg_policies WHERE tablename = 'profiles';
  ```

---

## ✅ Success Checklist

- [ ] `.env.local` created with Supabase keys
- [ ] Redirect URLs configured in dashboard
- [ ] Email provider enabled with confirmation ON
- [ ] All 3 SQL migrations run successfully
- [ ] Extensions enabled (cube, earthdistance)
- [ ] Indexes created
- [ ] RLS policies active
- [ ] Triggers created (auto-create profile)
- [ ] Verify email page created
- [ ] Location hook added to layout
- [ ] Signup flow tested end-to-end
- [ ] Email verification working
- [ ] Location saving to database
- [ ] Profile visible in Supabase table editor

---

## 🎉 Done!

Your auth + profiles + GPS system is now complete and working!

**Next steps:**
- Create login/signup pages
- Add profile builder
- Build matches page
- Deploy to production

**Documentation:**
- `IMPLEMENTATION_GUIDE.md` - Full guide
- `QUICK_START.md` - Quick reference
- `LOCATION_SYSTEM.md` - GPS details
- `GUARDS_SYSTEM.md` - Auth guards

