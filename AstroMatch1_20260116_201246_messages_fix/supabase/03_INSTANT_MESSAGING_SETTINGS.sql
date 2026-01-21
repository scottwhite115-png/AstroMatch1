-- ============================================================================
-- ASTROMATCH - INSTANT MESSAGING SETTINGS MIGRATION
-- ============================================================================
-- This adds settings to control instant messaging behavior
-- ============================================================================

-- Add instant messaging settings to profiles table
ALTER TABLE public.profiles 
  ADD COLUMN IF NOT EXISTS allow_instant_messages_connections BOOLEAN DEFAULT TRUE,
  ADD COLUMN IF NOT EXISTS allow_instant_messages_discover BOOLEAN DEFAULT TRUE;

-- Add indexes for performance
CREATE INDEX IF NOT EXISTS idx_profiles_instant_messages_connections ON public.profiles(allow_instant_messages_connections);
CREATE INDEX IF NOT EXISTS idx_profiles_instant_messages_discover ON public.profiles(allow_instant_messages_discover);

-- ============================================================================
-- MIGRATION COMPLETE!
-- ============================================================================
DO $$ BEGIN
  RAISE NOTICE '✅ Instant messaging settings added successfully!';
END $$;

