-- ============================================================================
-- ASTROMATCH - COMBINED DATABASE MIGRATIONS (FIXED)
-- RUN THIS IN SUPABASE SQL EDITOR TO SET UP YOUR DATABASE
-- ============================================================================
-- This file combines migrations 001, 002, 003, and 005
-- Migration 004 (Storage) will be done through Supabase Dashboard UI
-- ============================================================================

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
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'age_range') THEN
    ALTER TABLE public.profiles ADD CONSTRAINT age_range CHECK (age IS NULL OR (age BETWEEN 18 AND 120));
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'age_min_range') THEN
    ALTER TABLE public.profiles ADD CONSTRAINT age_min_range CHECK (age_min IS NULL OR (age_min BETWEEN 18 AND 120));
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'age_max_range') THEN
    ALTER TABLE public.profiles ADD CONSTRAINT age_max_range CHECK (age_max IS NULL OR (age_max BETWEEN 18 AND 120));
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'distance_radius_range') THEN
    ALTER TABLE public.profiles ADD CONSTRAINT distance_radius_range CHECK (distance_radius IS NULL OR (distance_radius BETWEEN 1 AND 500));
  END IF;
END $$;

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_profiles_gender ON public.profiles(gender) WHERE gender IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_profiles_age ON public.profiles(age) WHERE age IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_profiles_complete ON public.profiles(profile_complete);
CREATE INDEX IF NOT EXISTS idx_profiles_active ON public.profiles(account_active, profile_complete);
CREATE INDEX IF NOT EXISTS idx_profiles_birthdate ON public.profiles(birthdate) WHERE birthdate IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_profiles_western_sign ON public.profiles(western_sign) WHERE western_sign IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_profiles_chinese_sign ON public.profiles(chinese_sign) WHERE chinese_sign IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_profiles_looking_for ON public.profiles(looking_for_gender) WHERE looking_for_gender IS NOT NULL;

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


-- ============================================
-- MIGRATION 002: LIKES, MATCHES, AND PASSES
-- Core dating app interaction tables
-- ============================================

-- LIKES TABLE
CREATE TABLE IF NOT EXISTS public.likes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  liker_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  liked_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(liker_id, liked_id),
  CHECK (liker_id != liked_id)
);

CREATE INDEX IF NOT EXISTS idx_likes_liker ON public.likes(liker_id);
CREATE INDEX IF NOT EXISTS idx_likes_liked ON public.likes(liked_id);
CREATE INDEX IF NOT EXISTS idx_likes_created ON public.likes(created_at DESC);

-- RLS for likes
ALTER TABLE public.likes ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS select_own_likes ON public.likes;
CREATE POLICY select_own_likes ON public.likes
  FOR SELECT USING (auth.uid() = liker_id OR auth.uid() = liked_id);

DROP POLICY IF EXISTS insert_own_likes ON public.likes;
CREATE POLICY insert_own_likes ON public.likes
  FOR INSERT WITH CHECK (auth.uid() = liker_id);

DROP POLICY IF EXISTS delete_own_likes ON public.likes;
CREATE POLICY delete_own_likes ON public.likes
  FOR DELETE USING (auth.uid() = liker_id);

-- MATCHES TABLE
CREATE TABLE IF NOT EXISTS public.matches (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user1_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  user2_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  matched_at TIMESTAMPTZ DEFAULT NOW(),
  last_message_at TIMESTAMPTZ,
  unmatched_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  unmatched_at TIMESTAMPTZ,
  is_active BOOLEAN DEFAULT TRUE,
  CHECK (user1_id < user2_id),
  UNIQUE(user1_id, user2_id)
);

CREATE INDEX IF NOT EXISTS idx_matches_user1 ON public.matches(user1_id) WHERE is_active = TRUE;
CREATE INDEX IF NOT EXISTS idx_matches_user2 ON public.matches(user2_id) WHERE is_active = TRUE;
CREATE INDEX IF NOT EXISTS idx_matches_last_message ON public.matches(last_message_at DESC NULLS LAST);
CREATE INDEX IF NOT EXISTS idx_matches_active ON public.matches(is_active);

-- RLS for matches
ALTER TABLE public.matches ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS select_own_matches ON public.matches;
CREATE POLICY select_own_matches ON public.matches
  FOR SELECT USING (auth.uid() = user1_id OR auth.uid() = user2_id);

DROP POLICY IF EXISTS update_own_matches ON public.matches;
CREATE POLICY update_own_matches ON public.matches
  FOR UPDATE USING (auth.uid() = user1_id OR auth.uid() = user2_id);

-- PASSES TABLE
CREATE TABLE IF NOT EXISTS public.passes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  passer_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  passed_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  expires_at TIMESTAMPTZ DEFAULT NOW() + INTERVAL '28 days',
  UNIQUE(passer_id, passed_id),
  CHECK (passer_id != passed_id)
);

CREATE INDEX IF NOT EXISTS idx_passes_passer ON public.passes(passer_id);
CREATE INDEX IF NOT EXISTS idx_passes_passed ON public.passes(passed_id);
CREATE INDEX IF NOT EXISTS idx_passes_expires ON public.passes(expires_at);

-- RLS for passes
ALTER TABLE public.passes ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS select_own_passes ON public.passes;
CREATE POLICY select_own_passes ON public.passes
  FOR SELECT USING (auth.uid() = passer_id);

DROP POLICY IF EXISTS insert_own_passes ON public.passes;
CREATE POLICY insert_own_passes ON public.passes
  FOR INSERT WITH CHECK (auth.uid() = passer_id);

DROP POLICY IF EXISTS delete_own_passes ON public.passes;
CREATE POLICY delete_own_passes ON public.passes
  FOR DELETE USING (auth.uid() = passer_id);

-- FUNCTION: Auto-create match when both users like each other
CREATE OR REPLACE FUNCTION public.check_and_create_match()
RETURNS TRIGGER AS $$
DECLARE
  mutual_like_exists BOOLEAN;
BEGIN
  SELECT EXISTS (
    SELECT 1 FROM public.likes 
    WHERE liker_id = NEW.liked_id 
    AND liked_id = NEW.liker_id
  ) INTO mutual_like_exists;
  
  IF mutual_like_exists THEN
    INSERT INTO public.matches (user1_id, user2_id, matched_at)
    VALUES (
      LEAST(NEW.liker_id, NEW.liked_id),
      GREATEST(NEW.liker_id, NEW.liked_id),
      NOW()
    )
    ON CONFLICT (user1_id, user2_id) 
    DO UPDATE SET 
      is_active = TRUE,
      matched_at = NOW(),
      unmatched_by = NULL,
      unmatched_at = NULL;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_like_created ON public.likes;
CREATE TRIGGER on_like_created
  AFTER INSERT ON public.likes
  FOR EACH ROW
  EXECUTE FUNCTION public.check_and_create_match();

-- FUNCTION: Cleanup expired passes
CREATE OR REPLACE FUNCTION public.cleanup_expired_passes()
RETURNS INTEGER AS $$
DECLARE
  deleted_count INTEGER;
BEGIN
  DELETE FROM public.passes WHERE expires_at < NOW();
  GET DIAGNOSTICS deleted_count = ROW_COUNT;
  RETURN deleted_count;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

COMMENT ON TABLE public.likes IS 'User likes - when someone swipes right';
COMMENT ON TABLE public.matches IS 'Mutual likes - both users liked each other';
COMMENT ON TABLE public.passes IS 'User passes - when someone swipes left (hidden for 28 days)';


-- ============================================
-- MIGRATION 003: MESSAGES SYSTEM
-- Real-time chat functionality
-- ============================================

CREATE TABLE IF NOT EXISTS public.messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  match_id UUID NOT NULL REFERENCES public.matches(id) ON DELETE CASCADE,
  sender_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  receiver_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  message_type TEXT DEFAULT 'text' CHECK (message_type IN ('text', 'gif', 'emoji', 'image')),
  is_read BOOLEAN DEFAULT FALSE,
  read_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  deleted_by UUID[] DEFAULT ARRAY[]::UUID[],
  CHECK (sender_id != receiver_id),
  CHECK (LENGTH(content) > 0 AND LENGTH(content) <= 5000)
);

CREATE INDEX IF NOT EXISTS idx_messages_match ON public.messages(match_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_messages_sender ON public.messages(sender_id);
CREATE INDEX IF NOT EXISTS idx_messages_receiver ON public.messages(receiver_id);
CREATE INDEX IF NOT EXISTS idx_messages_created ON public.messages(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_messages_unread ON public.messages(receiver_id, is_read) WHERE is_read = FALSE;

-- RLS for messages
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS select_own_messages ON public.messages;
CREATE POLICY select_own_messages ON public.messages
  FOR SELECT USING (auth.uid() = sender_id OR auth.uid() = receiver_id);

DROP POLICY IF EXISTS insert_own_messages ON public.messages;
CREATE POLICY insert_own_messages ON public.messages
  FOR INSERT WITH CHECK (
    auth.uid() = sender_id AND
    EXISTS (
      SELECT 1 FROM public.matches
      WHERE id = match_id
      AND is_active = TRUE
      AND (user1_id = auth.uid() OR user2_id = auth.uid())
    )
  );

DROP POLICY IF EXISTS update_own_messages ON public.messages;
CREATE POLICY update_own_messages ON public.messages
  FOR UPDATE USING (auth.uid() = sender_id OR auth.uid() = receiver_id);

DROP POLICY IF EXISTS delete_own_messages ON public.messages;
CREATE POLICY delete_own_messages ON public.messages
  FOR DELETE USING (auth.uid() = sender_id);

-- FUNCTION: Update match timestamp
CREATE OR REPLACE FUNCTION public.update_match_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE public.matches SET last_message_at = NEW.created_at WHERE id = NEW.match_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_message_sent ON public.messages;
CREATE TRIGGER on_message_sent
  AFTER INSERT ON public.messages
  FOR EACH ROW
  EXECUTE FUNCTION public.update_match_timestamp();

-- Message helper functions
CREATE OR REPLACE FUNCTION public.mark_message_read(message_id UUID)
RETURNS VOID AS $$
BEGIN
  UPDATE public.messages SET is_read = TRUE, read_at = NOW()
  WHERE id = message_id AND receiver_id = auth.uid() AND is_read = FALSE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION public.mark_match_messages_read(match_id_param UUID)
RETURNS INTEGER AS $$
DECLARE
  updated_count INTEGER;
BEGIN
  UPDATE public.messages SET is_read = TRUE, read_at = NOW()
  WHERE match_id = match_id_param AND receiver_id = auth.uid() AND is_read = FALSE;
  GET DIAGNOSTICS updated_count = ROW_COUNT;
  RETURN updated_count;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION public.get_unread_message_count()
RETURNS INTEGER AS $$
DECLARE
  unread_count INTEGER;
BEGIN
  SELECT COUNT(*)::INTEGER INTO unread_count FROM public.messages
  WHERE receiver_id = auth.uid() AND is_read = FALSE;
  RETURN unread_count;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION public.update_message_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_update_message_timestamp ON public.messages;
CREATE TRIGGER trigger_update_message_timestamp
  BEFORE UPDATE ON public.messages
  FOR EACH ROW
  EXECUTE FUNCTION public.update_message_timestamp();

COMMENT ON TABLE public.messages IS 'Chat messages between matched users';


-- ============================================
-- MIGRATION 005: GEO SEARCH FUNCTION
-- Function to find profiles within radius
-- ============================================

-- Enable earthdistance extension
CREATE EXTENSION IF NOT EXISTS cube;
CREATE EXTENSION IF NOT EXISTS earthdistance;

-- Drop existing function if it exists (with exact signature)
DROP FUNCTION IF EXISTS public.profiles_within_radius(DOUBLE PRECISION, DOUBLE PRECISION, INTEGER);

-- Geo search function
CREATE OR REPLACE FUNCTION public.profiles_within_radius(
  user_lat DOUBLE PRECISION,
  user_lon DOUBLE PRECISION,
  radius_km INTEGER DEFAULT 50
)
RETURNS TABLE (
  id UUID,
  display_name TEXT,
  age INTEGER,
  birthdate DATE,
  western_sign TEXT,
  chinese_sign TEXT,
  tropical_western_sign TEXT,
  sidereal_western_sign TEXT,
  photos TEXT[],
  bio TEXT,
  occupation TEXT,
  height TEXT,
  religion TEXT,
  children_preference TEXT,
  city TEXT,
  location_name TEXT,
  distance_km DOUBLE PRECISION,
  interests TEXT[],
  relationship_goals TEXT[],
  gender TEXT,
  profile_complete BOOLEAN,
  account_active BOOLEAN,
  lat DOUBLE PRECISION,
  lon DOUBLE PRECISION
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    p.id, p.display_name, p.age, p.birthdate,
    p.western_sign, p.chinese_sign,
    p.tropical_western_sign, p.sidereal_western_sign,
    p.photos, p.bio, p.occupation, p.height,
    p.religion, p.children_preference, p.city, p.location_name,
    earth_distance(ll_to_earth(user_lat, user_lon), ll_to_earth(p.lat, p.lon)) / 1000.0 AS distance_km,
    p.interests, p.relationship_goals, p.gender,
    p.profile_complete, p.account_active, p.lat, p.lon
  FROM public.profiles p
  WHERE p.lat IS NOT NULL AND p.lon IS NOT NULL
    AND earth_distance(ll_to_earth(user_lat, user_lon), ll_to_earth(p.lat, p.lon)) <= (radius_km * 1000.0)
  ORDER BY earth_distance(ll_to_earth(user_lat, user_lon), ll_to_earth(p.lat, p.lon))
  LIMIT 100;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

GRANT EXECUTE ON FUNCTION public.profiles_within_radius TO authenticated;


-- ============================================================================
-- MIGRATION COMPLETE!
-- ============================================================================
-- ✓ Enhanced profiles table
-- ✓ Likes, matches, passes, messages tables
-- ✓ Automatic match detection
-- ✓ All security policies
-- ✓ Geo-location search
-- 
-- NEXT: Create storage bucket through Supabase Dashboard UI
-- ============================================================================

