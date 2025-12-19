-- Fix Post table column names to exactly match Prisma schema
-- Prisma uses quoted identifiers, so casing matters!
-- Run this in Supabase SQL Editor

-- Expected column names (from Prisma schema):
-- id, title, content, topic, type, authorId, language, countryCode, 
-- likeCount, commentCount, isHidden, createdAt, updatedAt

-- Fix column names one by one
-- Note: We use ALTER TABLE ... RENAME COLUMN which requires the exact current name

-- 1. Fix Id -> id (if it exists with capital I)
DO $$ 
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'Post' AND column_name = 'Id') THEN
        ALTER TABLE "Post" RENAME COLUMN "Id" TO "id";
    END IF;
END $$;

-- 2. Fix authorID -> authorId (lowercase 'd')
DO $$ 
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'Post' AND column_name = 'authorID') THEN
        ALTER TABLE "Post" RENAME COLUMN "authorID" TO "authorId";
    END IF;
END $$;

-- 3. Fix "like count" or "like_count" -> likeCount
DO $$ 
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'Post' AND column_name = 'like count') THEN
        ALTER TABLE "Post" RENAME COLUMN "like count" TO "likeCount";
    END IF;
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'Post' AND column_name = 'like_count') THEN
        ALTER TABLE "Post" RENAME COLUMN "like_count" TO "likeCount";
    END IF;
END $$;

-- Verify final column names
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_schema = 'public' AND table_name = 'Post' 
ORDER BY ordinal_position;

