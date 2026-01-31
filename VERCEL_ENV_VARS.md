# Vercel Environment Variables – Complete List

Add these in **Vercel** → your project → **Settings** → **Environment Variables**.

---

## Required (Supabase)

| Key | Value | Where to get it |
|-----|-------|-----------------|
| `NEXT_PUBLIC_SUPABASE_URL` | `https://xxxx.supabase.co` | Supabase → Project Settings → API → Project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | `eyJ...` | Supabase → Project Settings → API → anon public |
| `SUPABASE_SERVICE_ROLE_KEY` | `eyJ...` | Supabase → Project Settings → API → service_role (click Reveal) |

---

## Required (Prisma / Database)

| Key | Value | Where to get it |
|-----|-------|-----------------|
| `DATABASE_URL` | `postgresql://postgres.[ref]:[password]@aws-0-[region].pooler.supabase.com:6543/postgres?pgbouncer=true` | Supabase → Project Settings → Database → Connection string → URI (Transaction pooler) |
| `DIRECT_URL` | `postgresql://postgres.[ref]:[password]@aws-0-[region].pooler.supabase.com:5432/postgres` | Same as above but use port **5432** (Direct connection) |

**To get the connection string:**
1. Supabase Dashboard → **Project Settings** → **Database**
2. Under **Connection string**, choose **URI**
3. Copy and replace `[YOUR-PASSWORD]` with your database password
4. **Transaction pooler** (port 6543) → use for `DATABASE_URL`
5. **Session pooler** or **Direct** (port 5432) → use for `DIRECT_URL`

---

## Optional (for OAuth / production)

| Key | Value |
|-----|-------|
| `NEXT_PUBLIC_SITE_URL` | Your production URL, e.g. `https://your-app.vercel.app` |

---

## Summary

**Minimum for Lunar to work:**
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
- `DATABASE_URL`
- `DIRECT_URL`

Set each for **Production** and **Preview** (and **Development** if needed).
