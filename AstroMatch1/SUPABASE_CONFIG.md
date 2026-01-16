# Supabase Configuration

## Environment Variables

### Production Supabase Instance
- **Project URL**: `https://umorkbxikucjlluzezhq.supabase.co`
- **Anon Key**: Configured in `.env.local`
- **Database**: PostgreSQL (Supabase managed)

### Connection Strings

**Connection Pooler (Recommended - Port 6543)**
```
DATABASE_URL="postgresql://postgres.umorkbxikucjlluzezhq:Aquarius_1980$$$@aws-1-ap-southeast-2.pooler.supabase.com:6543/postgres?pgbouncer=true"
```

**Direct Connection (Port 5432)**
```
DIRECT_URL="postgresql://postgres:Aquarius_1980$$$@db.umorkbxikucjlluzezhq.supabase.co:5432/postgres?sslmode=require"
```

## Database Migrations

All migrations are located in `/supabase/` directory:

1. **00_CLEANUP_FIRST.sql** - Cleanup script
2. **01_MAIN_MIGRATION.sql** - Main schema migration
3. **02_REPORTS_AND_BLOCKS.sql** - Reports and blocking system
4. **03_INSTANT_MESSAGING_SETTINGS.sql** - Messaging settings
5. **04_COMMUNITY_TABLES.sql** - Community/forum features

### Running Migrations

Execute migrations in order via Supabase Dashboard SQL Editor or CLI:

```bash
# Via Supabase CLI (if installed)
supabase db push

# Or manually via Dashboard:
# 1. Go to Supabase Dashboard → SQL Editor
# 2. Run each migration file in order (00 → 01 → 02 → 03 → 04)
```

## Schema Overview

- **profiles** - User profiles with astrology data
- **likes** - User likes/matches
- **messages** - Direct messaging
- **posts** - Community posts (STORY, QUESTION types)
- **comments** - Post comments
- **reports** - User/content reports
- **blocks** - User blocking system

## API Configuration

- **NEXT_PUBLIC_SUPABASE_URL**: Set in `.env.local`
- **NEXT_PUBLIC_SUPABASE_ANON_KEY**: Set in `.env.local`

## Security Notes

⚠️ **Never commit `.env.local` to git** - Contains sensitive credentials
- Database passwords
- API keys
- Vercel tokens
