-- Verify that the voting columns were added successfully
-- Run this in Supabase SQL Editor to check

-- Check if columns exist
SELECT column_name, data_type, column_default
FROM information_schema.columns
WHERE table_name = 'Post' 
  AND (column_name = 'upvoteCount' OR column_name = 'downvoteCount')
ORDER BY column_name;

-- Check if PostVote table exists
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
  AND table_name = 'PostVote';

-- Check PostVote table structure
SELECT column_name, data_type
FROM information_schema.columns
WHERE table_name = 'PostVote'
ORDER BY ordinal_position;

-- Check current post data
SELECT id, title, "upvoteCount", "downvoteCount", "likeCount"
FROM "Post"
LIMIT 5;

