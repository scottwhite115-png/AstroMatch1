-- ============================================================================
-- RUN THIS IN SUPABASE SQL EDITOR
-- Fixes: column "allow_instant_messages_connections" does not exist
-- Also adds status/suspensionEndsAt if missing (fixes 400 errors)
-- ============================================================================

-- 1. Add the missing columns to profiles
ALTER TABLE public.profiles 
  ADD COLUMN IF NOT EXISTS allow_instant_messages_connections BOOLEAN DEFAULT TRUE,
  ADD COLUMN IF NOT EXISTS allow_instant_messages_discover BOOLEAN DEFAULT TRUE;

-- Moderation columns (fixes 400 on status/suspensionEndsAt queries)
-- Use quoted name to match API expectations (Supabase returns exact column name)
ALTER TABLE public.profiles 
  ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'ACTIVE',
  ADD COLUMN IF NOT EXISTS "suspensionEndsAt" TIMESTAMPTZ;

-- 2. Add indexes (safe to run multiple times)
CREATE INDEX IF NOT EXISTS idx_profiles_instant_messages_connections 
  ON public.profiles(allow_instant_messages_connections);
CREATE INDEX IF NOT EXISTS idx_profiles_instant_messages_discover 
  ON public.profiles(allow_instant_messages_discover);

-- 3. Recreate the function (ensures it works with the new columns)
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

  SELECT COALESCE(allow_instant_messages_connections, true),
         COALESCE(allow_instant_messages_discover, true)
  INTO receiver_allow_connections, receiver_allow_discover
  FROM profiles
  WHERE id = other_user_id;
  
  IF NOT receiver_allow_connections AND NOT receiver_allow_discover THEN
    RAISE EXCEPTION 'This user requires a mutual match before messaging. Please like their profile first.';
  END IF;

  IF EXISTS (
    SELECT 1 FROM blocks 
    WHERE blocker_id = other_user_id AND blocked_user_id = current_user_id
  ) THEN
    RAISE EXCEPTION 'You cannot message this user. They have blocked you.';
  END IF;

  u1 := LEAST(current_user_id, other_user_id);
  u2 := GREATEST(current_user_id, other_user_id);

  SELECT id INTO new_match_id
  FROM matches
  WHERE user1_id = u1 AND user2_id = u2 AND is_active = true;

  IF new_match_id IS NOT NULL THEN
    RETURN new_match_id;
  END IF;

  INSERT INTO matches (user1_id, user2_id, is_active)
  VALUES (u1, u2, true)
  RETURNING id INTO new_match_id;

  RETURN new_match_id;
END;
$$;

-- 4. Send message function - bypasses RLS (works without service key)
CREATE OR REPLACE FUNCTION public.send_message(
  p_match_id UUID,
  p_receiver_id UUID,
  p_content TEXT,
  p_message_type TEXT DEFAULT 'text'
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  current_user_id UUID := auth.uid();
  new_message RECORD;
BEGIN
  IF current_user_id IS NULL THEN
    RAISE EXCEPTION 'Not authenticated';
  END IF;

  IF p_receiver_id = current_user_id THEN
    RAISE EXCEPTION 'Cannot message yourself';
  END IF;

  IF p_content IS NULL OR LENGTH(TRIM(p_content)) = 0 OR LENGTH(p_content) > 5000 THEN
    RAISE EXCEPTION 'Invalid message content';
  END IF;

  IF p_message_type NOT IN ('text', 'gif', 'emoji', 'image') THEN
    p_message_type := 'text';
  END IF;

  -- Verify sender is part of the match
  IF NOT EXISTS (
    SELECT 1 FROM matches
    WHERE id = p_match_id AND is_active = TRUE
    AND (user1_id = current_user_id OR user2_id = current_user_id)
  ) THEN
    RAISE EXCEPTION 'You are not part of this match';
  END IF;

  -- Verify receiver is the other user in the match
  IF NOT EXISTS (
    SELECT 1 FROM matches
    WHERE id = p_match_id
    AND (user1_id = p_receiver_id OR user2_id = p_receiver_id)
  ) THEN
    RAISE EXCEPTION 'Invalid receiver for this match';
  END IF;

  -- Block check: receiver blocked sender?
  IF EXISTS (
    SELECT 1 FROM blocks
    WHERE blocker_id = p_receiver_id AND blocked_user_id = current_user_id
  ) THEN
    RAISE EXCEPTION 'You cannot message this user. They have blocked you.';
  END IF;

  INSERT INTO messages (match_id, sender_id, receiver_id, content, message_type)
  VALUES (p_match_id, current_user_id, p_receiver_id, TRIM(p_content), p_message_type)
  RETURNING * INTO new_message;

  RETURN to_jsonb(new_message);
END;
$$;

COMMENT ON FUNCTION public.send_message(UUID, UUID, TEXT, TEXT) IS 'Inserts a message. Bypasses RLS. Validates sender is in match.';
