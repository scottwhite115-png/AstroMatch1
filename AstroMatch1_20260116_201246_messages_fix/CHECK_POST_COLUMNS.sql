-- Check exact column names in Post table (case-sensitive)
-- Run this in Supabase SQL Editor to see the exact column names

SELECT 
    column_name, 
    data_type, 
    is_nullable,
    column_default
FROM information_schema.columns 
WHERE table_name = 'Post' 
ORDER BY ordinal_position;

-- Also check for case variations
SELECT column_name 
FROM information_schema.columns 
WHERE LOWER(table_name) = 'post'
ORDER BY column_name;

