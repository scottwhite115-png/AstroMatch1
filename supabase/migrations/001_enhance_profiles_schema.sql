-- ============================================
-- MIGRATION 001: ENHANCE PROFILES SCHEMA
-- Add all missing fields for production launch
-- ============================================

-- Add new columns to profiles table
ALTER TABLE public.profiles 
  -- Profile completion & status
  ADD COLUMN IF NOT EXISTS profile_complete BOOLEAN DEFAULT FALSE,
  ADD COLUMN IF NOT EXISTS profile_approved BOOLEAN DEFAULT TRUE,
  ADD COLUMN IF NOT EXISTS account_active BOOLEAN DEFAULT TRUE,
  
  -- Basic info (enhanced)
  ADD COLUMN IF NOT EXISTS age INTEGER,
  ADD COLUMN IF NOT EXISTS western_sign TEXT,
  ADD COLUMN IF NOT EXISTS chinese_sign TEXT,
  ADD COLUMN IF NOT EXISTS tropical_western_sign TEXT,
  ADD COLUMN IF NOT EXISTS sidereal_western_sign TEXT,
  ADD COLUMN IF NOT EXISTS bio TEXT,
  ADD COLUMN IF NOT EXISTS occupation TEXT,
  
  -- Photos (array instead of single URL)
  ADD COLUMN IF NOT EXISTS photos TEXT[],
  
  -- Additional profile fields
  ADD COLUMN IF NOT EXISTS height TEXT,
  ADD COLUMN IF NOT EXISTS religion TEXT,
  ADD COLUMN IF NOT EXISTS children_preference TEXT,
  ADD COLUMN IF NOT EXISTS relationship_status TEXT,
  ADD COLUMN IF NOT EXISTS education TEXT,
  
  -- Search preferences
  ADD COLUMN IF NOT EXISTS looking_for_gender TEXT DEFAULT 'Everyone',
  ADD COLUMN IF NOT EXISTS age_min INTEGER DEFAULT 18,
  ADD COLUMN IF NOT EXISTS age_max INTEGER DEFAULT 99,
  ADD COLUMN IF NOT EXISTS distance_radius INTEGER DEFAULT 50,
  
  -- Privacy & settings
  ADD COLUMN IF NOT EXISTS show_gender BOOLEAN DEFAULT TRUE,
  ADD COLUMN IF NOT EXISTS show_distance BOOLEAN DEFAULT TRUE,
  ADD COLUMN IF NOT EXISTS incognito_mode BOOLEAN DEFAULT FALSE,
  
  -- Additional fields
  ADD COLUMN IF NOT EXISTS city TEXT,
  ADD COLUMN IF NOT EXISTS interests TEXT[],
  ADD COLUMN IF NOT EXISTS relationship_goals TEXT[],
  ADD COLUMN IF NOT EXISTS prompts JSONB,
  
  -- Location details
  ADD COLUMN IF NOT EXISTS location_name TEXT,
  ADD COLUMN IF NOT EXISTS country TEXT,
  ADD COLUMN IF NOT EXISTS state TEXT;

-- Add constraints
ALTER TABLE public.profiles
  ADD CONSTRAINT age_range CHECK (age IS NULL OR (age BETWEEN 18 AND 120)),
  ADD CONSTRAINT age_min_range CHECK (age_min IS NULL OR (age_min BETWEEN 18 AND 120)),
  ADD CONSTRAINT age_max_range CHECK (age_max IS NULL OR (age_max BETWEEN 18 AND 120)),
  ADD CONSTRAINT distance_radius_range CHECK (distance_radius IS NULL OR (distance_radius BETWEEN 1 AND 500));

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_profiles_gender ON public.profiles(gender) WHERE gender IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_profiles_age ON public.profiles(age) WHERE age IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_profiles_complete ON public.profiles(profile_complete);
CREATE INDEX IF NOT EXISTS idx_profiles_active ON public.profiles(account_active, profile_complete);
CREATE INDEX IF NOT EXISTS idx_profiles_birthdate ON public.profiles(birthdate) WHERE birthdate IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_profiles_western_sign ON public.profiles(western_sign) WHERE western_sign IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_profiles_chinese_sign ON public.profiles(chinese_sign) WHERE chinese_sign IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_profiles_looking_for ON public.profiles(looking_for_gender) WHERE looking_for_gender IS NOT NULL;

-- Update RLS policies to include new fields
-- Policies remain the same but now cover all new fields

-- Helper function to calculate age from birthdate
CREATE OR REPLACE FUNCTION public.calculate_age(birthdate DATE)
RETURNS INTEGER AS $$
BEGIN
  RETURN EXTRACT(YEAR FROM AGE(birthdate));
END;
$$ LANGUAGE plpgsql IMMUTABLE;

-- Trigger to auto-update age when birthdate changes
CREATE OR REPLACE FUNCTION public.update_profile_age()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.birthdate IS NOT NULL THEN
    NEW.age := public.calculate_age(NEW.birthdate);
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_update_profile_age ON public.profiles;
CREATE TRIGGER trigger_update_profile_age
  BEFORE INSERT OR UPDATE OF birthdate ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.update_profile_age();

-- Update existing profiles to populate age if birthdate exists
UPDATE public.profiles 
SET age = public.calculate_age(birthdate)
WHERE birthdate IS NOT NULL AND age IS NULL;

COMMENT ON TABLE public.profiles IS 'User profiles with complete dating app information';
COMMENT ON COLUMN public.profiles.profile_complete IS 'Whether user has completed all required profile fields';
COMMENT ON COLUMN public.profiles.photos IS 'Array of photo URLs (at least 2 required for profile completion)';
COMMENT ON COLUMN public.profiles.looking_for_gender IS 'Gender preference: Men, Women, or Everyone';
COMMENT ON COLUMN public.profiles.distance_radius IS 'Search radius in kilometers';

