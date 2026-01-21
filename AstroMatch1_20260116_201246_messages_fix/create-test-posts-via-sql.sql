-- SQL Script to create test posts directly in Supabase
-- Copy this and run it in Supabase SQL Editor
-- This will create test posts using the first user in your database

-- Step 1: Find a user ID (replace this with an actual user ID from your profiles table)
-- Run this first to get a user ID:
-- SELECT id, display_name FROM profiles LIMIT 1;

-- Step 2: Replace 'YOUR_USER_ID_HERE' with the actual user ID from Step 1
-- Then run the INSERT statements below

-- Example test posts for General Astrology topic
INSERT INTO "Post" (id, title, content, topic, type, "authorId", "createdAt", "updatedAt", "likeCount", "commentCount", "isHidden")
VALUES 
  (
    gen_random_uuid()::text,
    'Welcome to AstroLounge! 🌟',
    'This is a test post to verify the community section UI is working correctly. You should be able to see this post, like it, and comment on it!',
    'general-astrology',
    'STORY',
    (SELECT id FROM profiles LIMIT 1), -- Uses first user in database
    NOW(),
    NOW(),
    0,
    0,
    false
  ),
  (
    gen_random_uuid()::text,
    'How do I read my birth chart?',
    'I''m new to astrology and just got my birth chart. Where should I start? What should I focus on first?',
    'general-astrology',
    'QUESTION',
    (SELECT id FROM profiles LIMIT 1),
    NOW(),
    NOW(),
    0,
    0,
    false
  )
ON CONFLICT DO NOTHING;

-- If you want to add more test posts for other topics, add more INSERT statements here
-- For Sun Signs:
INSERT INTO "Post" (id, title, content, topic, type, "authorId", "createdAt", "updatedAt", "likeCount", "commentCount", "isHidden")
VALUES 
  (
    gen_random_uuid()::text,
    'Leo season is here! ☀️',
    'As a Leo, I feel so energized during Leo season. Anyone else feeling the same way?',
    'sun-signs',
    'STORY',
    (SELECT id FROM profiles LIMIT 1),
    NOW(),
    NOW(),
    0,
    0,
    false
  )
ON CONFLICT DO NOTHING;

