-- Fix the PostType enum to match Prisma expectations
-- Prisma expects: STORY, QUESTION (uppercase)

-- First, check current enum values
SELECT enumlabel 
FROM pg_enum 
WHERE enumtypid = 'post_type'::regtype
ORDER BY enumsortorder;

-- If the enum has lowercase values, we need to:
-- 1. Drop the old enum values (if possible)
-- 2. Add the correct uppercase values

-- Option 1: If enum has wrong values, recreate it
-- WARNING: This will fail if there are existing posts using the old values
-- First, let's see what values exist:

DO $$
DECLARE
    has_story BOOLEAN := false;
    has_question BOOLEAN := false;
    has_STORY BOOLEAN := false;
    has_QUESTION BOOLEAN := false;
BEGIN
    -- Check for lowercase
    SELECT EXISTS(SELECT 1 FROM pg_enum WHERE enumtypid = 'post_type'::regtype AND enumlabel = 'story') INTO has_story;
    SELECT EXISTS(SELECT 1 FROM pg_enum WHERE enumtypid = 'post_type'::regtype AND enumlabel = 'question') INTO has_question;
    
    -- Check for uppercase
    SELECT EXISTS(SELECT 1 FROM pg_enum WHERE enumtypid = 'post_type'::regtype AND enumlabel = 'STORY') INTO has_STORY;
    SELECT EXISTS(SELECT 1 FROM pg_enum WHERE enumtypid = 'post_type'::regtype AND enumlabel = 'QUESTION') INTO has_QUESTION;
    
    -- Add uppercase if they don't exist
    IF NOT has_STORY THEN
        ALTER TYPE post_type ADD VALUE IF NOT EXISTS 'STORY';
    END IF;
    
    IF NOT has_QUESTION THEN
        ALTER TYPE post_type ADD VALUE IF NOT EXISTS 'QUESTION';
    END IF;
    
    RAISE NOTICE 'Enum check complete. STORY exists: %, QUESTION exists: %', has_STORY OR has_story, has_QUESTION OR has_question;
END $$;

-- Verify the enum values now
SELECT enumlabel 
FROM pg_enum 
WHERE enumtypid = 'post_type'::regtype
ORDER BY enumsortorder;

