-- Verify and fix the post_type enum
-- This will ensure STORY and QUESTION values exist

-- First, see what enum values currently exist
SELECT 
  enumlabel AS enum_value,
  enumsortorder AS sort_order
FROM pg_enum 
WHERE enumtypid = 'post_type'::regtype
ORDER BY enumsortorder;

-- If STORY doesn't exist, add it
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_enum 
        WHERE enumtypid = 'post_type'::regtype 
        AND enumlabel = 'STORY'
    ) THEN
        ALTER TYPE post_type ADD VALUE 'STORY';
        RAISE NOTICE 'Added STORY to post_type enum';
    ELSE
        RAISE NOTICE 'STORY already exists';
    END IF;
END $$;

-- If QUESTION doesn't exist, add it
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_enum 
        WHERE enumtypid = 'post_type'::regtype 
        AND enumlabel = 'QUESTION'
    ) THEN
        ALTER TYPE post_type ADD VALUE 'QUESTION';
        RAISE NOTICE 'Added QUESTION to post_type enum';
    ELSE
        RAISE NOTICE 'QUESTION already exists';
    END IF;
END $$;

-- Verify again
SELECT 
  enumlabel AS enum_value,
  enumsortorder AS sort_order
FROM pg_enum 
WHERE enumtypid = 'post_type'::regtype
ORDER BY enumsortorder;

