-- =====================================================
-- Migration: 004_enhance_profiles_schema.sql
-- Description: Add all missing fields to profiles table for production launch
-- Date: 2025-01-03
-- =====================================================

-- Add missing profile fields
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS profile_complete BOOLEAN DEFAULT FALSE;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS profile_approved BOOLEAN DEFAULT TRUE;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS account_active BOOLEAN DEFAULT TRUE;

-- Basic Info (from Profile & Identity page)
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS age INTEGER;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS birthdate DATE;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS western_sign TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS chinese_sign TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS gender TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS bio TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS occupation TEXT;

-- Photos (array instead of single URL)
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS photos TEXT[];

-- Additional Profile Fields
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS height TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS religion TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS children_preference TEXT;

-- Search Preferences (from Account page)
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS looking_for_gender TEXT DEFAULT 'Everyone';
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS age_min INTEGER DEFAULT 18;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS age_max INTEGER DEFAULT 99;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS distance_radius INTEGER DEFAULT 50;

-- Privacy & Settings
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS show_gender BOOLEAN DEFAULT TRUE;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS show_distance BOOLEAN DEFAULT TRUE;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS incognito_mode BOOLEAN DEFAULT FALSE;

-- Additional Fields
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS city TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS interests TEXT[];
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS relationship_goals TEXT[];
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS prompts JSONB;

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_profiles_gender ON public.profiles(gender);
CREATE INDEX IF NOT EXISTS idx_profiles_age ON public.profiles(age);
CREATE INDEX IF NOT EXISTS idx_profiles_complete ON public.profiles(profile_complete);
CREATE INDEX IF NOT EXISTS idx_profiles_active ON public.profiles(account_active, profile_complete);
CREATE INDEX IF NOT EXISTS idx_profiles_birthdate ON public.profiles(birthdate);
CREATE INDEX IF NOT EXISTS idx_profiles_looking_for ON public.profiles(looking_for_gender);
CREATE INDEX IF NOT EXISTS idx_profiles_western_sign ON public.profiles(western_sign);
CREATE INDEX IF NOT EXISTS idx_profiles_chinese_sign ON public.profiles(chinese_sign);

-- Add check constraint for age
ALTER TABLE public.profiles ADD CONSTRAINT check_age_valid CHECK (age IS NULL OR (age >= 18 AND age <= 120));

-- Add check constraint for age preferences
ALTER TABLE public.profiles ADD CONSTRAINT check_age_min_valid CHECK (age_min >= 18);
ALTER TABLE public.profiles ADD CONSTRAINT check_age_max_valid CHECK (age_max <= 120);
ALTER TABLE public.profiles ADD CONSTRAINT check_age_range_valid CHECK (age_max >= age_min);

-- Add check constraint for distance radius
ALTER TABLE public.profiles ADD CONSTRAINT check_distance_valid CHECK (distance_radius > 0 AND distance_radius <= 500);

COMMENT ON COLUMN public.profiles.profile_complete IS 'True when user has completed all required profile fields';
COMMENT ON COLUMN public.profiles.profile_approved IS 'Manual review system (optional) - set to false to hide profile';
COMMENT ON COLUMN public.profiles.account_active IS 'User can deactivate their account temporarily';
COMMENT ON COLUMN public.profiles.photos IS 'Array of photo URLs (min 2 required for profile_complete)';
COMMENT ON COLUMN public.profiles.prompts IS 'Array of {question, answer} objects for profile prompts';
COMMENT ON COLUMN public.profiles.looking_for_gender IS 'Who user wants to see: Men, Women, or Everyone';
COMMENT ON COLUMN public.profiles.distance_radius IS 'Maximum distance in km for potential matches';
COMMENT ON COLUMN public.profiles.incognito_mode IS 'Hide from matches but keep account active';

-- Update west_east field to be consistent with western_sign and chinese_sign
-- This will be populated by a trigger on insert/update
CREATE OR REPLACE FUNCTION public.update_west_east()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.western_sign IS NOT NULL AND NEW.chinese_sign IS NOT NULL THEN
    NEW.west_east := NEW.western_sign || '-' || NEW.chinese_sign;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_profile_west_east_update ON public.profiles;
CREATE TRIGGER on_profile_west_east_update
  BEFORE INSERT OR UPDATE OF western_sign, chinese_sign ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.update_west_east();

-- Create function to check profile completion
CREATE OR REPLACE FUNCTION public.check_profile_completion(profile_id UUID)
RETURNS BOOLEAN AS $$
DECLARE
  profile_record RECORD;
  is_complete BOOLEAN;
BEGIN
  SELECT * INTO profile_record
  FROM public.profiles
  WHERE id = profile_id;

  -- Check all required fields
  is_complete := (
    profile_record.email_verified = TRUE AND
    profile_record.phone_verified = TRUE AND
    profile_record.birthdate IS NOT NULL AND
    profile_record.western_sign IS NOT NULL AND
    profile_record.chinese_sign IS NOT NULL AND
    profile_record.gender IS NOT NULL AND
    profile_record.bio IS NOT NULL AND
    LENGTH(profile_record.bio) >= 50 AND
    profile_record.occupation IS NOT NULL AND
    profile_record.height IS NOT NULL AND
    profile_record.photos IS NOT NULL AND
    array_length(profile_record.photos, 1) >= 2 AND
    profile_record.city IS NOT NULL
  );

  RETURN is_complete;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Automatically update profile_complete flag when profile is updated
CREATE OR REPLACE FUNCTION public.auto_update_profile_complete()
RETURNS TRIGGER AS $$
BEGIN
  NEW.profile_complete := public.check_profile_completion(NEW.id);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_profile_update_complete ON public.profiles;
CREATE TRIGGER on_profile_update_complete
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.auto_update_profile_complete();

-- Grant necessary permissions
GRANT EXECUTE ON FUNCTION public.check_profile_completion TO authenticated;
GRANT EXECUTE ON FUNCTION public.update_west_east TO authenticated;
GRANT EXECUTE ON FUNCTION public.auto_update_profile_complete TO authenticated;

-- Success message
DO $$
BEGIN
  RAISE NOTICE 'Migration 004_enhance_profiles_schema.sql completed successfully!';
  RAISE NOTICE 'Added fields: profile_complete, photos[], bio, occupation, height, religion, etc.';
  RAISE NOTICE 'Added indexes for: gender, age, profile_complete, western_sign, chinese_sign';
  RAISE NOTICE 'Added triggers for: auto west_east update, auto profile_complete check';
END $$;

