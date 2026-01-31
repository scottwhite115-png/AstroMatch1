-- ============================================================================
-- Create instant match function - bypasses RLS for instant messaging
-- Used when receiver allows instant messages; runs with SECURITY DEFINER
-- ============================================================================

-- Add instant messaging columns if missing (required by create_instant_match)
ALTER TABLE public.profiles 
  ADD COLUMN IF NOT EXISTS allow_instant_messages_connections BOOLEAN DEFAULT TRUE,
  ADD COLUMN IF NOT EXISTS allow_instant_messages_discover BOOLEAN DEFAULT TRUE;

CREATE INDEX IF NOT EXISTS idx_profiles_instant_messages_connections ON public.profiles(allow_instant_messages_connections);
CREATE INDEX IF NOT EXISTS idx_profiles_instant_messages_discover ON public.profiles(allow_instant_messages_discover);

CREATE OR REPLACE FUNCTION public.create_instant_match(other_user_id UUID)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  current_user_id UUID := auth.uid();
  u1 UUID;
  u2 UUID;
  new_match_id UUID;
  receiver_allow_connections BOOLEAN;
  receiver_allow_discover BOOLEAN;
BEGIN
  IF current_user_id IS NULL THEN
    RAISE EXCEPTION 'Not authenticated';
  END IF;
  
  IF other_user_id = current_user_id THEN
    RAISE EXCEPTION 'Cannot message yourself';
  END IF;

  -- Get receiver's instant message settings
  SELECT COALESCE(allow_instant_messages_connections, true),
         COALESCE(allow_instant_messages_discover, true)
  INTO receiver_allow_connections, receiver_allow_discover
  FROM profiles
  WHERE id = other_user_id;
  
  IF NOT receiver_allow_connections AND NOT receiver_allow_discover THEN
    RAISE EXCEPTION 'This user requires a mutual match before messaging. Please like their profile first.';
  END IF;

  -- Check block (receiver blocked sender?)
  IF EXISTS (
    SELECT 1 FROM blocks 
    WHERE blocker_id = other_user_id AND blocked_user_id = current_user_id
  ) THEN
    RAISE EXCEPTION 'You cannot message this user. They have blocked you.';
  END IF;

  -- Order for CHECK (user1_id < user2_id)
  u1 := LEAST(current_user_id, other_user_id);
  u2 := GREATEST(current_user_id, other_user_id);

  -- Check existing match
  SELECT id INTO new_match_id
  FROM matches
  WHERE user1_id = u1 AND user2_id = u2 AND is_active = true;

  IF new_match_id IS NOT NULL THEN
    RETURN new_match_id;
  END IF;

  -- Create new match (SECURITY DEFINER bypasses RLS)
  INSERT INTO matches (user1_id, user2_id, is_active)
  VALUES (u1, u2, true)
  RETURNING id INTO new_match_id;

  RETURN new_match_id;
END;
$$;

COMMENT ON FUNCTION public.create_instant_match(UUID) IS 'Creates an instant match when receiver allows instant messages. Bypasses RLS.';
