-- Debug query to test if we can fetch a post with comments
-- Run this in Supabase SQL Editor to verify the data structure

-- First, check if we have any posts
SELECT id, title, topic, "authorId", "createdAt" 
FROM "Post" 
LIMIT 1;

-- Check if comments table exists and has the right structure
SELECT column_name, data_type
FROM information_schema.columns
WHERE table_name = 'Comment'
ORDER BY ordinal_position;

-- Try to fetch a post with a simple comment query
SELECT 
  p.id as post_id,
  p.title,
  p."authorId" as post_author_id,
  c.id as comment_id,
  c.content as comment_content,
  c."authorId" as comment_author_id,
  c."parentId" as comment_parent_id
FROM "Post" p
LEFT JOIN "Comment" c ON c."postId" = p.id
WHERE p.id = (SELECT id FROM "Post" LIMIT 1)
ORDER BY c."createdAt" DESC;

