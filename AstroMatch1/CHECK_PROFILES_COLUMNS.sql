-- Check what columns exist in the profiles table
-- The error shows east_west_code doesn't exist

SELECT column_name, data_type
FROM information_schema.columns
WHERE table_name = 'profiles'
ORDER BY ordinal_position;

-- Check if it might be named differently
SELECT column_name
FROM information_schema.columns
WHERE table_name = 'profiles'
  AND column_name LIKE '%east%'
  OR column_name LIKE '%west%'
ORDER BY column_name;

