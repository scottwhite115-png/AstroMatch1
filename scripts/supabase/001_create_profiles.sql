-- Migration: Create optimized profiles table
-- Version: 001
-- Description: Main profiles table with location support and RLS

-- 1) Profiles table
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  display_name TEXT,
  west_east TEXT,          -- e.g. 'Aquarius-Monkey'
  photo_url TEXT,
  email TEXT,              -- denormalized convenience (not authoritative)
  phone TEXT,              -- optional, store E.164 when verified
  email_verified BOOLEAN DEFAULT FALSE,
  phone_verified BOOLEAN DEFAULT FALSE,

  lat DOUBLE PRECISION,    -- nullable until user shares GPS
  lon DOUBLE PRECISION,
  last_active TIMESTAMPTZ DEFAULT NOW(),

  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2) Location sanity checks
ALTER TABLE public.profiles
  ADD CONSTRAINT lat_range CHECK (lat IS NULL OR (lat >= -90 AND lat <= 90));

ALTER TABLE public.profiles
  ADD CONSTRAINT lon_range CHECK (lon IS NULL OR (lon >= -180 AND lon <= 180));

-- 3) Geo index (fast nearby search)
CREATE EXTENSION IF NOT EXISTS cube;
CREATE EXTENSION IF NOT EXISTS earthdistance;

CREATE INDEX IF NOT EXISTS idx_profiles_earth ON public.profiles
  USING gist (ll_to_earth(lat, lon));

-- 4) Additional indexes for common queries
CREATE INDEX IF NOT EXISTS idx_profiles_west_east ON public.profiles (west_east)
  WHERE west_east IS NOT NULL;

CREATE INDEX IF NOT EXISTS idx_profiles_last_active ON public.profiles (last_active DESC NULLS LAST);

CREATE INDEX IF NOT EXISTS idx_profiles_active_location ON public.profiles (last_active DESC, west_east)
  WHERE lat IS NOT NULL AND lon IS NOT NULL AND west_east IS NOT NULL;

-- 5) RLS on
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- 6) RLS: anyone can read public profiles (adjust if you want tighter privacy)
CREATE POLICY "read_public_profiles"
ON public.profiles FOR SELECT
USING (true);

-- 7) RLS: user can insert their own row on first login
CREATE POLICY "insert_own_profile"
ON public.profiles FOR INSERT
WITH CHECK (auth.uid() = id);

-- 8) RLS: user can update only their own row
CREATE POLICY "update_own_profile"
ON public.profiles FOR UPDATE
USING (auth.uid() = id)
WITH CHECK (auth.uid() = id);

-- 9) Trigger: keep updated_at fresh
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

-- 10) Comments for documentation
COMMENT ON TABLE public.profiles IS 'User profiles with location and zodiac data';
COMMENT ON COLUMN public.profiles.west_east IS 'Combined zodiac sign e.g. Aries-Rat';
COMMENT ON COLUMN public.profiles.lat IS 'GPS latitude (-90 to 90)';
COMMENT ON COLUMN public.profiles.lon IS 'GPS longitude (-180 to 180)';
COMMENT ON COLUMN public.profiles.last_active IS 'Last time user was active in app';
COMMENT ON INDEX idx_profiles_earth IS 'GiST index for fast radius queries using earthdistance';

