-- Check the actual PostType enum values in the database
-- This will help us understand what values are accepted

SELECT 
  t.typname AS enum_name,
  e.enumlabel AS enum_value,
  e.enumsortorder AS sort_order
FROM pg_type t 
JOIN pg_enum e ON t.oid = e.enumtypid 
WHERE t.typname = 'post_type'
ORDER BY e.enumsortorder;

-- Also check what the Post table expects
SELECT 
  column_name,
  data_type,
  udt_name
FROM information_schema.columns
WHERE table_name = 'Post' AND column_name = 'type';

