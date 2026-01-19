-- Fix gender preferences so both profiles can see each other
-- scottwhite115@gmail.com (man) should see scottwhite@y7mail.com (woman)
-- scottwhite@y7mail.com (woman) should see scottwhite115@gmail.com (man)

-- First, check current state
SELECT 
  email,
  gender,
  looking_for_gender,
  profile_complete,
  account_active,
  birthdate,
  western_sign,
  chinese_sign,
  CASE 
    WHEN photos IS NULL THEN 'NO PHOTOS'
    WHEN array_length(photos, 1) = 0 THEN 'NO PHOTOS'
    ELSE 'HAS PHOTOS'
  END as photo_status
FROM profiles
WHERE email IN ('scottwhite115@gmail.com', 'scottwhite@y7mail.com');

-- Update: Set man to look for Women, woman to look for Men
-- This ensures mutual visibility
UPDATE profiles
SET 
  -- For the man profile: look for Women
  looking_for_gender = CASE 
    WHEN gender = 'Man' OR gender = 'Male' THEN 'Women'
    WHEN gender = 'Woman' OR gender = 'Female' THEN 'Men'
    ELSE 'Everyone'
  END,
  -- Ensure all required fields are set
  profile_complete = true,
  account_active = true,
  lat = COALESCE(lat, -27.4698),  -- Brisbane
  lon = COALESCE(lon, 153.0251),
  age_min = COALESCE(age_min, 18),
  age_max = COALESCE(age_max, 99),
  distance_radius = COALESCE(distance_radius, 100)
WHERE email IN ('scottwhite115@gmail.com', 'scottwhite@y7mail.com');

-- Alternative: Set both to 'Everyone' for testing (uncomment if needed)
-- UPDATE profiles
-- SET looking_for_gender = 'Everyone'
-- WHERE email IN ('scottwhite115@gmail.com', 'scottwhite@y7mail.com');

-- Verify the update
SELECT 
  email,
  gender,
  looking_for_gender,
  profile_complete,
  account_active,
  lat,
  lon,
  birthdate,
  western_sign,
  chinese_sign,
  CASE 
    WHEN photos IS NULL THEN 'NO PHOTOS'
    WHEN array_length(photos, 1) = 0 THEN 'NO PHOTOS'
    ELSE 'HAS PHOTOS'
  END as photo_status,
  CASE 
    WHEN profile_complete = true 
      AND account_active = true 
      AND lat IS NOT NULL 
      AND lon IS NOT NULL
      AND birthdate IS NOT NULL
      AND western_sign IS NOT NULL
      AND chinese_sign IS NOT NULL
      AND photos IS NOT NULL
      AND array_length(photos, 1) > 0
    THEN 'READY'
    ELSE 'MISSING FIELDS'
  END as visibility_status
FROM profiles
WHERE email IN ('scottwhite115@gmail.com', 'scottwhite@y7mail.com');

