-- SQL to create the Post table if it doesn't exist
-- Run this in Supabase SQL Editor if the Post table is missing

-- First, make sure the PostType enum exists (from migration)
DO $$ BEGIN
    CREATE TYPE "PostType" AS ENUM ('STORY', 'QUESTION');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Create Post table if it doesn't exist
CREATE TABLE IF NOT EXISTS "Post" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "topic" TEXT NOT NULL,
    "type" "PostType" NOT NULL DEFAULT 'STORY',
    "authorId" UUID NOT NULL,
    "language" TEXT,
    "countryCode" TEXT,
    "likeCount" INTEGER NOT NULL DEFAULT 0,
    "commentCount" INTEGER NOT NULL DEFAULT 0,
    "isHidden" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Post_pkey" PRIMARY KEY ("id")
);

-- Add foreign key constraint
DO $$ BEGIN
    ALTER TABLE "Post" ADD CONSTRAINT "Post_authorId_fkey" 
    FOREIGN KEY ("authorId") REFERENCES "profiles"("id") ON DELETE CASCADE;
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Create indexes
CREATE INDEX IF NOT EXISTS "Post_topic_createdAt_idx" ON "Post"("topic", "createdAt" DESC);
CREATE INDEX IF NOT EXISTS "Post_authorId_idx" ON "Post"("authorId");
CREATE INDEX IF NOT EXISTS "Post_createdAt_idx" ON "Post"("createdAt" DESC);

