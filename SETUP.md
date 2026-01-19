# ⚡ Quick Setup

## 1. Copy SQL to Supabase

1. Open [Supabase Dashboard](https://app.supabase.com)
2. Go to **SQL Editor**
3. Copy entire contents of `supabase_setup.sql`
4. Paste and click **Run**

**✅ Done! Database is ready.**

---

## 2. Enable Auth Providers

Go to **Authentication → Providers**:

- ☑️ **Email** (Enable + turn on "Confirm email")
- ☑️ **Google** (optional - need Client ID + Secret)
- ☑️ **Facebook** (optional)
- ☑️ **Apple** (optional)
- ☑️ **Phone** (optional - need Twilio)

---

## 3. Configure URLs

Go to **Authentication → URL Configuration**:

```
Site URL: http://localhost:3000

Redirect URLs:
  http://localhost:3000/auth/callback
  http://localhost:3000/
```

---

## 4. Environment Variables

Create `.env.local`:

```bash
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

Get from: **Settings → API**

---

## 5. Test

```bash
npm run dev
```

Go to `/signup` and test the flow!

---

## ✅ What You Have

- ✅ Profiles table with GPS support
- ✅ Auto-create profile on signup
- ✅ Sync email/phone verification
- ✅ Fast geo queries with earthdistance
- ✅ RLS security policies
- ✅ RPC functions for nearby search

---

## 📁 Files

- `supabase_setup.sql` - Run this in Supabase SQL Editor
- `lib/supabaseClient.ts` - Ready to use
- `lib/auth.ts` - Auth utilities
- `lib/location.ts` - GPS utilities
- `lib/guards.ts` - Route protection

**Everything is ready!** 🎉

