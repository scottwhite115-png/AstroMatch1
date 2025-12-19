-- Add voting system to comments (Reddit-style upvote/downvote)
-- Run this in Supabase SQL Editor

-- Add upvote and downvote counts to Comment table
ALTER TABLE "Comment" 
ADD COLUMN IF NOT EXISTS "upvoteCount" INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS "downvoteCount" INTEGER DEFAULT 0;

-- Create CommentVote table to track individual votes
CREATE TABLE IF NOT EXISTS "CommentVote" (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  "commentId" TEXT NOT NULL,
  "userId" UUID NOT NULL,
  vote INTEGER NOT NULL, -- 1 for upvote, -1 for downvote
  "createdAt" TIMESTAMP NOT NULL DEFAULT NOW(),
  "updatedAt" TIMESTAMP NOT NULL DEFAULT NOW(),
  CONSTRAINT "CommentVote_commentId_fkey" FOREIGN KEY ("commentId") REFERENCES "Comment"(id) ON DELETE CASCADE,
  CONSTRAINT "CommentVote_userId_fkey" FOREIGN KEY ("userId") REFERENCES "profiles"(id) ON DELETE CASCADE,
  CONSTRAINT "CommentVote_commentId_userId_key" UNIQUE ("commentId", "userId"),
  CONSTRAINT "CommentVote_vote_check" CHECK (vote IN (-1, 1))
);

-- Create indexes
CREATE INDEX IF NOT EXISTS "CommentVote_commentId_idx" ON "CommentVote"("commentId");
CREATE INDEX IF NOT EXISTS "CommentVote_userId_idx" ON "CommentVote"("userId");

