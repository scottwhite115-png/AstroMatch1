-- SQL to check if Post table exists and what columns it has
-- Run this in Supabase SQL Editor to verify the table structure

-- Check if Post table exists
SELECT 
    column_name, 
    data_type, 
    is_nullable,
    column_default
FROM information_schema.columns 
WHERE table_name = 'Post' 
ORDER BY ordinal_position;

-- If the table doesn't exist, you'll need to create it
-- The migration assumed it existed and only added/updated columns

