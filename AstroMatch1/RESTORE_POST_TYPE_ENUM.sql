-- Restore PostType enum values to match Prisma schema
-- Prisma expects: STORY, QUESTION (uppercase)

-- First, check what enum values currently exist
SELECT 
  enumlabel AS current_value,
  enumsortorder AS sort_order
FROM pg_enum 
WHERE enumtypid = 'post_type'::regtype
ORDER BY enumsortorder;

-- Add the required enum values if they don't exist
-- PostgreSQL doesn't allow removing enum values, but we can add new ones

DO $$
BEGIN
    -- Check and add STORY if it doesn't exist
    IF NOT EXISTS (
        SELECT 1 FROM pg_enum 
        WHERE enumtypid = 'post_type'::regtype 
        AND enumlabel = 'STORY'
    ) THEN
        ALTER TYPE post_type ADD VALUE 'STORY';
        RAISE NOTICE 'Added STORY to post_type enum';
    ELSE
        RAISE NOTICE 'STORY already exists in post_type enum';
    END IF;

    -- Check and add QUESTION if it doesn't exist
    IF NOT EXISTS (
        SELECT 1 FROM pg_enum 
        WHERE enumtypid = 'post_type'::regtype 
        AND enumlabel = 'QUESTION'
    ) THEN
        ALTER TYPE post_type ADD VALUE 'QUESTION';
        RAISE NOTICE 'Added QUESTION to post_type enum';
    ELSE
        RAISE NOTICE 'QUESTION already exists in post_type enum';
    END IF;
END $$;

-- Verify the enum values now
SELECT 
  enumlabel AS enum_value,
  enumsortorder AS sort_order
FROM pg_enum 
WHERE enumtypid = 'post_type'::regtype
ORDER BY enumsortorder;

-- Check if there are any existing posts and what type values they have
SELECT 
  type,
  COUNT(*) as count
FROM "Post"
GROUP BY type;

