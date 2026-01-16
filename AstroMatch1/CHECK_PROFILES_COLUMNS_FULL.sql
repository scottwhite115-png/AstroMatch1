-- Check all columns in the profiles table
-- This will help us see what columns actually exist

SELECT 
  column_name,
  data_type,
  is_nullable,
  column_default
FROM information_schema.columns
WHERE table_schema = 'public' 
  AND table_name = 'profiles'
ORDER BY ordinal_position;

-- Check if status column exists (might be named differently)
SELECT column_name
FROM information_schema.columns
WHERE table_schema = 'public' 
  AND table_name = 'profiles'
  AND (column_name LIKE '%status%' OR column_name LIKE '%suspension%' OR column_name LIKE '%suspended%')
ORDER BY column_name;

