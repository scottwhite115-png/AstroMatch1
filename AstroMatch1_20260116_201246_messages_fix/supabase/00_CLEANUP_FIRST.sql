-- ============================================================================
-- ASTROMATCH - CLEANUP SCRIPT
-- RUN THIS FIRST before running the main migration
-- ============================================================================
-- This drops any existing objects that might conflict with the migration
-- Safe to run multiple times
-- ============================================================================

-- Drop existing functions
DROP FUNCTION IF EXISTS public.profiles_within_radius(DOUBLE PRECISION, DOUBLE PRECISION, INTEGER) CASCADE;
DROP FUNCTION IF EXISTS public.profiles_within_radius CASCADE;
DROP FUNCTION IF EXISTS public.calculate_age(DATE) CASCADE;
DROP FUNCTION IF EXISTS public.update_profile_age() CASCADE;
DROP FUNCTION IF EXISTS public.check_and_create_match() CASCADE;
DROP FUNCTION IF EXISTS public.cleanup_expired_passes() CASCADE;
DROP FUNCTION IF EXISTS public.update_match_timestamp() CASCADE;
DROP FUNCTION IF EXISTS public.mark_message_read(UUID) CASCADE;
DROP FUNCTION IF EXISTS public.mark_match_messages_read(UUID) CASCADE;
DROP FUNCTION IF EXISTS public.get_unread_message_count() CASCADE;
DROP FUNCTION IF EXISTS public.update_message_timestamp() CASCADE;

-- Drop existing triggers
DROP TRIGGER IF EXISTS trigger_update_profile_age ON public.profiles;
DROP TRIGGER IF EXISTS on_like_created ON public.likes;
DROP TRIGGER IF EXISTS on_message_sent ON public.messages;
DROP TRIGGER IF EXISTS trigger_update_message_timestamp ON public.messages;

-- Success message
DO $$ BEGIN
  RAISE NOTICE 'Cleanup complete! Now run the main migration file.';
END $$;

