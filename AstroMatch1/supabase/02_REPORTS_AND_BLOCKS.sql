-- ============================================================================
-- ASTROMATCH - REPORTS AND BLOCKS MIGRATION
-- ============================================================================
-- This creates the reports and blocks tables for user safety features
-- Run this after 01_MAIN_MIGRATION.sql
-- ============================================================================

-- ============================================
-- REPORTS TABLE
-- ============================================

CREATE TABLE IF NOT EXISTS public.reports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  reporter_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  reported_user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  reason TEXT,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'reviewed', 'resolved', 'dismissed')),
  admin_notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  reviewed_at TIMESTAMPTZ,
  reviewed_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  CHECK (reporter_id != reported_user_id)
);

CREATE INDEX IF NOT EXISTS idx_reports_reporter ON public.reports(reporter_id);
CREATE INDEX IF NOT EXISTS idx_reports_reported ON public.reports(reported_user_id);
CREATE INDEX IF NOT EXISTS idx_reports_status ON public.reports(status);
CREATE INDEX IF NOT EXISTS idx_reports_created ON public.reports(created_at DESC);

ALTER TABLE public.reports ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS select_own_reports ON public.reports;
CREATE POLICY select_own_reports ON public.reports
  FOR SELECT USING (auth.uid() = reporter_id);

DROP POLICY IF EXISTS insert_own_reports ON public.reports;
CREATE POLICY insert_own_reports ON public.reports
  FOR INSERT WITH CHECK (auth.uid() = reporter_id);

-- ============================================
-- BLOCKS TABLE
-- ============================================

CREATE TABLE IF NOT EXISTS public.blocks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  blocker_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  blocked_user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(blocker_id, blocked_user_id),
  CHECK (blocker_id != blocked_user_id)
);

CREATE INDEX IF NOT EXISTS idx_blocks_blocker ON public.blocks(blocker_id);
CREATE INDEX IF NOT EXISTS idx_blocks_blocked ON public.blocks(blocked_user_id);
CREATE INDEX IF NOT EXISTS idx_blocks_created ON public.blocks(created_at DESC);

ALTER TABLE public.blocks ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS select_own_blocks ON public.blocks;
CREATE POLICY select_own_blocks ON public.blocks
  FOR SELECT USING (auth.uid() = blocker_id);

DROP POLICY IF EXISTS insert_own_blocks ON public.blocks;
CREATE POLICY insert_own_blocks ON public.blocks
  FOR INSERT WITH CHECK (auth.uid() = blocker_id);

DROP POLICY IF EXISTS delete_own_blocks ON public.blocks;
CREATE POLICY delete_own_blocks ON public.blocks
  FOR DELETE USING (auth.uid() = blocker_id);

-- ============================================================================
-- MIGRATION COMPLETE!
-- ============================================================================
DO $$ BEGIN
  RAISE NOTICE '✅ Reports and Blocks tables created successfully!';
END $$;

