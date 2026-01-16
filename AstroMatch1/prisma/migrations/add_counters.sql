-- Migration: Add likeCount and commentCount to Post and Comment models
-- This migration adds denormalized counters for performance

-- Add likeCount and commentCount to Post model
ALTER TABLE "Post" 
ADD COLUMN IF NOT EXISTS "likeCount" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN IF NOT EXISTS "commentCount" INTEGER NOT NULL DEFAULT 0;

-- Add likeCount to Comment model
ALTER TABLE "Comment"
ADD COLUMN IF NOT EXISTS "likeCount" INTEGER NOT NULL DEFAULT 0;

-- Update Notification model to use isRead instead of readAt
ALTER TABLE "Notification"
ADD COLUMN IF NOT EXISTS "isRead" BOOLEAN NOT NULL DEFAULT false;

-- Add index for createdAt on Post
CREATE INDEX IF NOT EXISTS "Post_createdAt_idx" ON "Post"("createdAt" DESC);

-- Backfill existing data (optional - only if you have existing data)
-- Update Post.likeCount based on existing PostLike records
UPDATE "Post" p
SET "likeCount" = (
  SELECT COUNT(*) FROM "PostLike" pl WHERE pl."postId" = p.id
)
WHERE "likeCount" = 0;

-- Update Post.commentCount based on existing Comment records
UPDATE "Post" p
SET "commentCount" = (
  SELECT COUNT(*) FROM "Comment" c WHERE c."postId" = p.id
)
WHERE "commentCount" = 0;

-- Update Comment.likeCount based on existing CommentLike records
UPDATE "Comment" c
SET "likeCount" = (
  SELECT COUNT(*) FROM "CommentLike" cl WHERE cl."commentId" = c.id
)
WHERE "likeCount" = 0;

-- Set isRead based on readAt (if readAt exists)
-- Note: Only run this if readAt column exists
-- UPDATE "Notification" SET "isRead" = true WHERE "readAt" IS NOT NULL;

-- Drop readAt column (optional - only if you want to fully migrate)
-- ALTER TABLE "Notification" DROP COLUMN IF EXISTS "readAt";

