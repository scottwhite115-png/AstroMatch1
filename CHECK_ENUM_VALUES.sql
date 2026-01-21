-- Check what the actual enum values are in the database
-- Run this in Supabase SQL Editor

-- Check PostType enum values
SELECT enumtypid::regtype AS enum_type,
       enumlabel AS value
FROM pg_enum
WHERE enumtypid::regtype::text = 'post_type'
ORDER BY enumsortorder;

-- Also check if we can insert with lowercase
-- This should work if the enum accepts lowercase
INSERT INTO "Post" (id, title, content, topic, type, "authorId", "createdAt", "updatedAt")
VALUES (
  gen_random_uuid()::text,
  'Test Post',
  'Testing enum values',
  'general-astrology',
  'story', -- Try lowercase
  (SELECT id FROM profiles LIMIT 1),
  NOW(),
  NOW()
) ON CONFLICT DO NOTHING;

SELECT * FROM "Post" WHERE title = 'Test Post';
