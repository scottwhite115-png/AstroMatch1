-- ============================================
-- MIGRATION 002: LIKES, MATCHES, AND PASSES
-- Core dating app interaction tables
-- ============================================

-- LIKES TABLE
-- When User A likes User B
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

CREATE POLICY select_own_likes ON public.likes
  FOR SELECT USING (auth.uid() = liker_id OR auth.uid() = liked_id);

CREATE POLICY insert_own_likes ON public.likes
  FOR INSERT WITH CHECK (auth.uid() = liker_id);

CREATE POLICY delete_own_likes ON public.likes
  FOR DELETE USING (auth.uid() = liker_id);

-- MATCHES TABLE
-- When both users like each other
CREATE TABLE IF NOT EXISTS public.matches (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user1_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  user2_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  matched_at TIMESTAMPTZ DEFAULT NOW(),
  last_message_at TIMESTAMPTZ,
  unmatched_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  unmatched_at TIMESTAMPTZ,
  is_active BOOLEAN DEFAULT TRUE,
  CHECK (user1_id < user2_id), -- Ensure unique ordering
  UNIQUE(user1_id, user2_id)
);

CREATE INDEX IF NOT EXISTS idx_matches_user1 ON public.matches(user1_id) WHERE is_active = TRUE;
CREATE INDEX IF NOT EXISTS idx_matches_user2 ON public.matches(user2_id) WHERE is_active = TRUE;
CREATE INDEX IF NOT EXISTS idx_matches_last_message ON public.matches(last_message_at DESC NULLS LAST);
CREATE INDEX IF NOT EXISTS idx_matches_active ON public.matches(is_active);

-- RLS for matches
ALTER TABLE public.matches ENABLE ROW LEVEL SECURITY;

CREATE POLICY select_own_matches ON public.matches
  FOR SELECT USING (
    auth.uid() = user1_id OR auth.uid() = user2_id
  );

CREATE POLICY update_own_matches ON public.matches
  FOR UPDATE USING (
    auth.uid() = user1_id OR auth.uid() = user2_id
  );

-- PASSES TABLE
-- When User A passes on User B (hide for 28 days)
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

CREATE POLICY select_own_passes ON public.passes
  FOR SELECT USING (auth.uid() = passer_id);

CREATE POLICY insert_own_passes ON public.passes
  FOR INSERT WITH CHECK (auth.uid() = passer_id);

CREATE POLICY delete_own_passes ON public.passes
  FOR DELETE USING (auth.uid() = passer_id);

-- FUNCTION: Auto-create match when both users like each other
CREATE OR REPLACE FUNCTION public.check_and_create_match()
RETURNS TRIGGER AS $$
DECLARE
  mutual_like_exists BOOLEAN;
BEGIN
  -- Check if the liked user has also liked the liker
  SELECT EXISTS (
    SELECT 1 FROM public.likes 
    WHERE liker_id = NEW.liked_id 
    AND liked_id = NEW.liker_id
  ) INTO mutual_like_exists;
  
  IF mutual_like_exists THEN
    -- Create a match (ensure user1_id < user2_id for uniqueness)
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

-- Trigger to create matches automatically
DROP TRIGGER IF EXISTS on_like_created ON public.likes;
CREATE TRIGGER on_like_created
  AFTER INSERT ON public.likes
  FOR EACH ROW
  EXECUTE FUNCTION public.check_and_create_match();

-- FUNCTION: Cleanup expired passes (run daily)
CREATE OR REPLACE FUNCTION public.cleanup_expired_passes()
RETURNS INTEGER AS $$
DECLARE
  deleted_count INTEGER;
BEGIN
  DELETE FROM public.passes
  WHERE expires_at < NOW();
  
  GET DIAGNOSTICS deleted_count = ROW_COUNT;
  RETURN deleted_count;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Comments
COMMENT ON TABLE public.likes IS 'User likes - when someone swipes right';
COMMENT ON TABLE public.matches IS 'Mutual likes - both users liked each other';
COMMENT ON TABLE public.passes IS 'User passes - when someone swipes left (hidden for 28 days)';
COMMENT ON FUNCTION public.check_and_create_match() IS 'Automatically creates a match when mutual like is detected';

