-- ============================================
-- MIGRATION 003: MESSAGES SYSTEM
-- Real-time chat functionality
-- ============================================

-- MESSAGES TABLE
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

CREATE POLICY select_own_messages ON public.messages
  FOR SELECT USING (
    auth.uid() = sender_id OR auth.uid() = receiver_id
  );

CREATE POLICY insert_own_messages ON public.messages
  FOR INSERT WITH CHECK (
    auth.uid() = sender_id AND
    -- Verify the sender is part of the match
    EXISTS (
      SELECT 1 FROM public.matches
      WHERE id = match_id
      AND is_active = TRUE
      AND (user1_id = auth.uid() OR user2_id = auth.uid())
    )
  );

CREATE POLICY update_own_messages ON public.messages
  FOR UPDATE USING (
    auth.uid() = sender_id OR auth.uid() = receiver_id
  );

CREATE POLICY delete_own_messages ON public.messages
  FOR DELETE USING (
    auth.uid() = sender_id
  );

-- FUNCTION: Update match's last_message_at timestamp
CREATE OR REPLACE FUNCTION public.update_match_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE public.matches
  SET last_message_at = NEW.created_at
  WHERE id = NEW.match_id;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_message_sent ON public.messages;
CREATE TRIGGER on_message_sent
  AFTER INSERT ON public.messages
  FOR EACH ROW
  EXECUTE FUNCTION public.update_match_timestamp();

-- FUNCTION: Mark message as read
CREATE OR REPLACE FUNCTION public.mark_message_read(message_id UUID)
RETURNS VOID AS $$
BEGIN
  UPDATE public.messages
  SET is_read = TRUE, read_at = NOW()
  WHERE id = message_id
  AND receiver_id = auth.uid()
  AND is_read = FALSE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- FUNCTION: Mark all messages in a match as read
CREATE OR REPLACE FUNCTION public.mark_match_messages_read(match_id_param UUID)
RETURNS INTEGER AS $$
DECLARE
  updated_count INTEGER;
BEGIN
  UPDATE public.messages
  SET is_read = TRUE, read_at = NOW()
  WHERE match_id = match_id_param
  AND receiver_id = auth.uid()
  AND is_read = FALSE;
  
  GET DIAGNOSTICS updated_count = ROW_COUNT;
  RETURN updated_count;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- FUNCTION: Get unread message count for user
CREATE OR REPLACE FUNCTION public.get_unread_message_count()
RETURNS INTEGER AS $$
DECLARE
  unread_count INTEGER;
BEGIN
  SELECT COUNT(*)::INTEGER INTO unread_count
  FROM public.messages
  WHERE receiver_id = auth.uid()
  AND is_read = FALSE;
  
  RETURN unread_count;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- FUNCTION: Soft delete message (for sender)
CREATE OR REPLACE FUNCTION public.soft_delete_message(message_id UUID)
RETURNS VOID AS $$
BEGIN
  UPDATE public.messages
  SET deleted_by = array_append(deleted_by, auth.uid())
  WHERE id = message_id
  AND sender_id = auth.uid();
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Updated_at trigger for messages
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

-- Comments
COMMENT ON TABLE public.messages IS 'Chat messages between matched users';
COMMENT ON COLUMN public.messages.message_type IS 'Type of message: text, gif, emoji, or image';
COMMENT ON COLUMN public.messages.deleted_by IS 'Array of user IDs who deleted this message (soft delete)';
COMMENT ON FUNCTION public.mark_match_messages_read(UUID) IS 'Mark all unread messages in a match as read';

