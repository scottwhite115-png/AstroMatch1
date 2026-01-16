-- Fix Post table column names to match Prisma schema expectations
-- Run this in Supabase SQL Editor

-- Note: PostgreSQL is case-sensitive with quoted identifiers
-- Prisma expects camelCase: authorId, likeCount, createdAt, etc.

-- Check current column names first
SELECT column_name 
FROM information_schema.columns 
WHERE table_name = 'Post' 
ORDER BY ordinal_position;

-- Rename columns to match Prisma schema (camelCase, lowercase where needed)
-- Only rename if the names are different

-- Fix authorID -> authorId (if it exists with capital ID)
DO $$ 
BEGIN
    IF EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'Post' AND column_name = 'authorID'
    ) THEN
        ALTER TABLE "Post" RENAME COLUMN "authorID" TO "authorId";
    END IF;
END $$;

-- Fix Id -> id (if it exists with capital I)
DO $$ 
BEGIN
    IF EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'Post' AND column_name = 'Id'
    ) THEN
        ALTER TABLE "Post" RENAME COLUMN "Id" TO "id";
    END IF;
END $$;

-- Fix "like count" -> likeCount (if it exists as "like count" or "like_count")
DO $$ 
BEGIN
    IF EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'Post' AND column_name = 'like count'
    ) THEN
        ALTER TABLE "Post" RENAME COLUMN "like count" TO "likeCount";
    END IF;
    
    IF EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'Post' AND column_name = 'like_count'
    ) THEN
        ALTER TABLE "Post" RENAME COLUMN "like_count" TO "likeCount";
    END IF;
END $$;

-- Verify the column names after renaming
SELECT column_name 
FROM information_schema.columns 
WHERE table_name = 'Post' 
ORDER BY ordinal_position;

