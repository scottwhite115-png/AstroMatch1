-- ============================================================================
-- ASTROMATCH - COMMUNITY TABLES MIGRATION
-- ============================================================================
-- This creates all tables for the community/forum features
-- Based on Prisma schema, adapted for Supabase PostgreSQL
-- ============================================================================

-- ============================================
-- ENUMS
-- ============================================

-- PostType enum
DO $$ BEGIN
  CREATE TYPE post_type AS ENUM ('STORY', 'QUESTION');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- NotificationType enum
DO $$ BEGIN
  CREATE TYPE notification_type AS ENUM ('POST_REPLY', 'COMMENT_REPLY');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- Role enum (if not exists from profiles)
DO $$ BEGIN
  CREATE TYPE role_type AS ENUM ('USER', 'ADMIN', 'OWNER');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- AccountStatus enum
DO $$ BEGIN
  CREATE TYPE account_status AS ENUM ('ACTIVE', 'SUSPENDED', 'BANNED');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- ReportStatus enum
DO $$ BEGIN
  CREATE TYPE report_status AS ENUM ('PENDING', 'REVIEWED', 'ACTIONED');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- ============================================
-- POSTS TABLE
-- ============================================

CREATE TABLE IF NOT EXISTS public."Post" (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::TEXT,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  topic TEXT NOT NULL,
  type post_type NOT NULL DEFAULT 'STORY',
  "authorId" UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  language TEXT,
  "countryCode" TEXT,
  "likeCount" INTEGER NOT NULL DEFAULT 0,
  "commentCount" INTEGER NOT NULL DEFAULT 0,
  "isHidden" BOOLEAN NOT NULL DEFAULT FALSE,
  "createdAt" TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  "updatedAt" TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  
  CONSTRAINT title_length CHECK (char_length(title) >= 3 AND char_length(title) <= 200),
  CONSTRAINT content_length CHECK (char_length(content) >= 10 AND char_length(content) <= 10000)
);

CREATE INDEX IF NOT EXISTS idx_post_topic_created ON public."Post"(topic, "createdAt" DESC);
CREATE INDEX IF NOT EXISTS idx_post_author ON public."Post"("authorId");
CREATE INDEX IF NOT EXISTS idx_post_created ON public."Post"("createdAt" DESC);

-- ============================================
-- COMMENTS TABLE
-- ============================================

CREATE TABLE IF NOT EXISTS public."Comment" (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::TEXT,
  "postId" TEXT NOT NULL REFERENCES public."Post"(id) ON DELETE CASCADE,
  "parentId" TEXT REFERENCES public."Comment"(id) ON DELETE CASCADE,
  "authorId" UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  "likeCount" INTEGER NOT NULL DEFAULT 0,
  "createdAt" TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  "updatedAt" TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  
  CONSTRAINT content_length CHECK (char_length(content) > 0 AND char_length(content) <= 2000)
);

CREATE INDEX IF NOT EXISTS idx_comment_post_created ON public."Comment"("postId", "createdAt");
CREATE INDEX IF NOT EXISTS idx_comment_author ON public."Comment"("authorId");
CREATE INDEX IF NOT EXISTS idx_comment_parent ON public."Comment"("parentId") WHERE "parentId" IS NOT NULL;

-- ============================================
-- POST LIKES TABLE
-- ============================================

CREATE TABLE IF NOT EXISTS public."PostLike" (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::TEXT,
  "postId" TEXT NOT NULL REFERENCES public."Post"(id) ON DELETE CASCADE,
  "userId" UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  "createdAt" TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  
  UNIQUE("postId", "userId")
);

CREATE INDEX IF NOT EXISTS idx_postlike_post ON public."PostLike"("postId");
CREATE INDEX IF NOT EXISTS idx_postlike_user ON public."PostLike"("userId");

-- ============================================
-- COMMENT LIKES TABLE
-- ============================================

CREATE TABLE IF NOT EXISTS public."CommentLike" (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::TEXT,
  "commentId" TEXT NOT NULL REFERENCES public."Comment"(id) ON DELETE CASCADE,
  "userId" UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  "createdAt" TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  
  UNIQUE("commentId", "userId")
);

CREATE INDEX IF NOT EXISTS idx_commentlike_comment ON public."CommentLike"("commentId");
CREATE INDEX IF NOT EXISTS idx_commentlike_user ON public."CommentLike"("userId");

-- ============================================
-- NOTIFICATIONS TABLE
-- ============================================

CREATE TABLE IF NOT EXISTS public."Notification" (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::TEXT,
  "userId" UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  "actorId" UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  type notification_type NOT NULL,
  "postId" TEXT REFERENCES public."Post"(id) ON DELETE CASCADE,
  "commentId" TEXT REFERENCES public."Comment"(id) ON DELETE CASCADE,
  "isRead" BOOLEAN NOT NULL DEFAULT FALSE,
  "createdAt" TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_notification_user_created ON public."Notification"("userId", "createdAt" DESC);
CREATE INDEX IF NOT EXISTS idx_notification_user_read ON public."Notification"("userId", "isRead");

-- ============================================
-- POST REPORTS TABLE
-- ============================================

CREATE TABLE IF NOT EXISTS public."PostReport" (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::TEXT,
  "postId" TEXT NOT NULL REFERENCES public."Post"(id) ON DELETE CASCADE,
  "reporterId" UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  reason TEXT NOT NULL,
  status report_status NOT NULL DEFAULT 'PENDING',
  "createdAt" TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  "reviewedAt" TIMESTAMPTZ
);

CREATE INDEX IF NOT EXISTS idx_postreport_status_created ON public."PostReport"(status, "createdAt" DESC);
CREATE INDEX IF NOT EXISTS idx_postreport_post ON public."PostReport"("postId");
CREATE INDEX IF NOT EXISTS idx_postreport_reporter ON public."PostReport"("reporterId");

-- ============================================
-- USER BLOCKS TABLE (if not exists)
-- ============================================

CREATE TABLE IF NOT EXISTS public."UserBlock" (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::TEXT,
  "blockerId" UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  "blockedId" UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  "createdAt" TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  
  UNIQUE("blockerId", "blockedId"),
  CHECK("blockerId" != "blockedId")
);

CREATE INDEX IF NOT EXISTS idx_userblock_blocker ON public."UserBlock"("blockerId");
CREATE INDEX IF NOT EXISTS idx_userblock_blocked ON public."UserBlock"("blockedId");

-- ============================================
-- FUNCTIONS FOR AUTO-UPDATING COUNTS
-- ============================================

-- Function to update post comment count
CREATE OR REPLACE FUNCTION update_post_comment_count()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE public."Post" 
    SET "commentCount" = "commentCount" + 1 
    WHERE id = NEW."postId";
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE public."Post" 
    SET "commentCount" = GREATEST("commentCount" - 1, 0)
    WHERE id = OLD."postId";
  END IF;
  RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql;

-- Trigger for comment count
DROP TRIGGER IF EXISTS trigger_update_post_comment_count ON public."Comment";
CREATE TRIGGER trigger_update_post_comment_count
  AFTER INSERT OR DELETE ON public."Comment"
  FOR EACH ROW
  EXECUTE FUNCTION update_post_comment_count();

-- Function to update post like count
CREATE OR REPLACE FUNCTION update_post_like_count()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE public."Post" 
    SET "likeCount" = "likeCount" + 1 
    WHERE id = NEW."postId";
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE public."Post" 
    SET "likeCount" = GREATEST("likeCount" - 1, 0)
    WHERE id = OLD."postId";
  END IF;
  RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql;

-- Trigger for post like count
DROP TRIGGER IF EXISTS trigger_update_post_like_count ON public."PostLike";
CREATE TRIGGER trigger_update_post_like_count
  AFTER INSERT OR DELETE ON public."PostLike"
  FOR EACH ROW
  EXECUTE FUNCTION update_post_like_count();

-- Function to update comment like count
CREATE OR REPLACE FUNCTION update_comment_like_count()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE public."Comment" 
    SET "likeCount" = "likeCount" + 1 
    WHERE id = NEW."commentId";
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE public."Comment" 
    SET "likeCount" = GREATEST("likeCount" - 1, 0)
    WHERE id = OLD."commentId";
  END IF;
  RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql;

-- Trigger for comment like count
DROP TRIGGER IF EXISTS trigger_update_comment_like_count ON public."CommentLike";
CREATE TRIGGER trigger_update_comment_like_count
  AFTER INSERT OR DELETE ON public."CommentLike"
  FOR EACH ROW
  EXECUTE FUNCTION update_comment_like_count();

-- Function to update updatedAt timestamp
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW."updatedAt" = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers for updatedAt
DROP TRIGGER IF EXISTS trigger_update_post_updated_at ON public."Post";
CREATE TRIGGER trigger_update_post_updated_at
  BEFORE UPDATE ON public."Post"
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

DROP TRIGGER IF EXISTS trigger_update_comment_updated_at ON public."Comment";
CREATE TRIGGER trigger_update_comment_updated_at
  BEFORE UPDATE ON public."Comment"
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

-- ============================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================

-- Enable RLS on all tables
ALTER TABLE public."Post" ENABLE ROW LEVEL SECURITY;
ALTER TABLE public."Comment" ENABLE ROW LEVEL SECURITY;
ALTER TABLE public."PostLike" ENABLE ROW LEVEL SECURITY;
ALTER TABLE public."CommentLike" ENABLE ROW LEVEL SECURITY;
ALTER TABLE public."Notification" ENABLE ROW LEVEL SECURITY;
ALTER TABLE public."PostReport" ENABLE ROW LEVEL SECURITY;
ALTER TABLE public."UserBlock" ENABLE ROW LEVEL SECURITY;

-- Posts: Anyone can read, authenticated users can create
DROP POLICY IF EXISTS "Posts are viewable by everyone" ON public."Post";
CREATE POLICY "Posts are viewable by everyone" ON public."Post"
  FOR SELECT USING (true);

DROP POLICY IF EXISTS "Authenticated users can create posts" ON public."Post";
CREATE POLICY "Authenticated users can create posts" ON public."Post"
  FOR INSERT WITH CHECK (auth.uid() = "authorId");

DROP POLICY IF EXISTS "Users can update their own posts" ON public."Post";
CREATE POLICY "Users can update their own posts" ON public."Post"
  FOR UPDATE USING (auth.uid() = "authorId");

DROP POLICY IF EXISTS "Users can delete their own posts" ON public."Post";
CREATE POLICY "Users can delete their own posts" ON public."Post"
  FOR DELETE USING (auth.uid() = "authorId");

-- Comments: Anyone can read, authenticated users can create
DROP POLICY IF EXISTS "Comments are viewable by everyone" ON public."Comment";
CREATE POLICY "Comments are viewable by everyone" ON public."Comment"
  FOR SELECT USING (true);

DROP POLICY IF EXISTS "Authenticated users can create comments" ON public."Comment";
CREATE POLICY "Authenticated users can create comments" ON public."Comment"
  FOR INSERT WITH CHECK (auth.uid() = "authorId");

DROP POLICY IF EXISTS "Users can update their own comments" ON public."Comment";
CREATE POLICY "Users can update their own comments" ON public."Comment"
  FOR UPDATE USING (auth.uid() = "authorId");

DROP POLICY IF EXISTS "Users can delete their own comments" ON public."Comment";
CREATE POLICY "Users can delete their own comments" ON public."Comment"
  FOR DELETE USING (auth.uid() = "authorId");

-- Post Likes: Anyone can read, authenticated users can create/delete
DROP POLICY IF EXISTS "Post likes are viewable by everyone" ON public."PostLike";
CREATE POLICY "Post likes are viewable by everyone" ON public."PostLike"
  FOR SELECT USING (true);

DROP POLICY IF EXISTS "Authenticated users can like posts" ON public."PostLike";
CREATE POLICY "Authenticated users can like posts" ON public."PostLike"
  FOR INSERT WITH CHECK (auth.uid() = "userId");

DROP POLICY IF EXISTS "Users can unlike their own likes" ON public."PostLike";
CREATE POLICY "Users can unlike their own likes" ON public."PostLike"
  FOR DELETE USING (auth.uid() = "userId");

-- Comment Likes: Anyone can read, authenticated users can create/delete
DROP POLICY IF EXISTS "Comment likes are viewable by everyone" ON public."CommentLike";
CREATE POLICY "Comment likes are viewable by everyone" ON public."CommentLike"
  FOR SELECT USING (true);

DROP POLICY IF EXISTS "Authenticated users can like comments" ON public."CommentLike";
CREATE POLICY "Authenticated users can like comments" ON public."CommentLike"
  FOR INSERT WITH CHECK (auth.uid() = "userId");

DROP POLICY IF EXISTS "Users can unlike their own likes" ON public."CommentLike";
CREATE POLICY "Users can unlike their own likes" ON public."CommentLike"
  FOR DELETE USING (auth.uid() = "userId");

-- Notifications: Users can only see their own
DROP POLICY IF EXISTS "Users can view their own notifications" ON public."Notification";
CREATE POLICY "Users can view their own notifications" ON public."Notification"
  FOR SELECT USING (auth.uid() = "userId");

DROP POLICY IF EXISTS "System can create notifications" ON public."Notification";
CREATE POLICY "System can create notifications" ON public."Notification"
  FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Users can update their own notifications" ON public."Notification";
CREATE POLICY "Users can update their own notifications" ON public."Notification"
  FOR UPDATE USING (auth.uid() = "userId");

-- Post Reports: Users can create and view their own
DROP POLICY IF EXISTS "Users can view their own reports" ON public."PostReport";
CREATE POLICY "Users can view their own reports" ON public."PostReport"
  FOR SELECT USING (auth.uid() = "reporterId");

DROP POLICY IF EXISTS "Authenticated users can report posts" ON public."PostReport";
CREATE POLICY "Authenticated users can report posts" ON public."PostReport"
  FOR INSERT WITH CHECK (auth.uid() = "reporterId");

-- User Blocks: Users can view and create their own blocks
DROP POLICY IF EXISTS "Users can view their own blocks" ON public."UserBlock";
CREATE POLICY "Users can view their own blocks" ON public."UserBlock"
  FOR SELECT USING (auth.uid() = "blockerId" OR auth.uid() = "blockedId");

DROP POLICY IF EXISTS "Users can create their own blocks" ON public."UserBlock";
CREATE POLICY "Users can create their own blocks" ON public."UserBlock"
  FOR INSERT WITH CHECK (auth.uid() = "blockerId");

DROP POLICY IF EXISTS "Users can delete their own blocks" ON public."UserBlock";
CREATE POLICY "Users can delete their own blocks" ON public."UserBlock"
  FOR DELETE USING (auth.uid() = "blockerId");

-- ============================================================================
-- MIGRATION COMPLETE!
-- ============================================================================
DO $$ BEGIN
  RAISE NOTICE '✅ Community tables created successfully!';
  RAISE NOTICE '✅ Triggers and functions created!';
  RAISE NOTICE '✅ Row Level Security policies enabled!';
END $$;

