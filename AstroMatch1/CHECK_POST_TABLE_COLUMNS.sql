-- Check all columns in the Post table
-- This will help identify which column is missing

SELECT 
  column_name,
  data_type,
  is_nullable,
  column_default
FROM information_schema.columns
WHERE table_schema = 'public' 
  AND table_name = 'Post'
ORDER BY ordinal_position;

-- Also check the Comment table since we're including comments
SELECT 
  column_name,
  data_type
FROM information_schema.columns
WHERE table_schema = 'public' 
  AND table_name = 'Comment'
ORDER BY ordinal_position;

