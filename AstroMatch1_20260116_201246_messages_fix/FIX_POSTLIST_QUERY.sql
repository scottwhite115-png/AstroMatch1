-- Fix the PostList query to use the correct column names
-- Remove east_west_code since it doesn't exist in the database

-- Test the corrected query
SELECT
  p."id",
  p."title",
  p."content",
  p."topic",
  p."type",
  p."createdAt",
  p."likeCount",
  p."commentCount",
  pr."id" as "author_id",
  pr."display_name",
  pr."western_sign",
  pr."chinese_sign"
FROM "Post" p
LEFT JOIN "profiles" pr ON p."authorId" = pr."id"
WHERE p."isHidden" = false
  AND p."topic" = 'general-astrology'
ORDER BY p."createdAt" DESC
LIMIT 50;

