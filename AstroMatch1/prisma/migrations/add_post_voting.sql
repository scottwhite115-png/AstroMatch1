-- Add voting system to posts (Reddit-style upvote/downvote)
-- Run this in Supabase SQL Editor

-- Add upvote and downvote counts to Post table
ALTER TABLE "Post" 
ADD COLUMN IF NOT EXISTS "upvoteCount" INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS "downvoteCount" INTEGER DEFAULT 0;

-- Create PostVote table to track individual votes
CREATE TABLE IF NOT EXISTS "PostVote" (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  "postId" TEXT NOT NULL,
  "userId" UUID NOT NULL,
  vote INTEGER NOT NULL, -- 1 for upvote, -1 for downvote
  "createdAt" TIMESTAMP NOT NULL DEFAULT NOW(),
  "updatedAt" TIMESTAMP NOT NULL DEFAULT NOW(),
  CONSTRAINT "PostVote_postId_fkey" FOREIGN KEY ("postId") REFERENCES "Post"(id) ON DELETE CASCADE,
  CONSTRAINT "PostVote_userId_fkey" FOREIGN KEY ("userId") REFERENCES "profiles"(id) ON DELETE CASCADE,
  CONSTRAINT "PostVote_postId_userId_key" UNIQUE ("postId", "userId"),
  CONSTRAINT "PostVote_vote_check" CHECK (vote IN (-1, 1))
);

-- Create indexes
CREATE INDEX IF NOT EXISTS "PostVote_postId_idx" ON "PostVote"("postId");
CREATE INDEX IF NOT EXISTS "PostVote_userId_idx" ON "PostVote"("userId");

-- Add index for sorting by score (upvotes - downvotes)
CREATE INDEX IF NOT EXISTS "Post_score_idx" ON "Post"((("upvoteCount" - "downvoteCount")) DESC, "createdAt" DESC);

-- Initialize counts from existing PostLike table (if it exists)
-- Convert existing likes to upvotes
UPDATE "Post" 
SET "upvoteCount" = COALESCE((
  SELECT COUNT(*) FROM "PostLike" WHERE "PostLike"."postId" = "Post".id
), 0)
WHERE "upvoteCount" = 0;

