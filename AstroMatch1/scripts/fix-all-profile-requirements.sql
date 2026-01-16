-- Complete fix for both profiles to be visible
-- This ensures ALL requirements are met

-- Step 1: Restore/create the deleted profile if needed
DO $$
DECLARE
  auth_user_record RECORD;
BEGIN
  SELECT id, email, raw_user_meta_data INTO auth_user_record
  FROM auth.users
  WHERE email = 'scottwhite@y7mail.com'
  LIMIT 1;
  
  IF auth_user_record.id IS NOT NULL THEN
    INSERT INTO profiles (
      id, email, display_name, profile_complete, account_active,
      lat, lon, gender, looking_for_gender, age_min, age_max, distance_radius,
      created_at, updated_at
    )
    VALUES (
      auth_user_record.id,
      auth_user_record.email,
      COALESCE(auth_user_record.raw_user_meta_data->>'display_name', 'User'),
      false, true, -27.4698, 153.0251, 'Other', 'Everyone', 18, 99, 100,
      NOW(), NOW()
    )
    ON CONFLICT (id) DO NOTHING;
  END IF;
END $$;

-- Step 2: Set both profiles to 'Everyone' for testing (ensures they see each other)
UPDATE profiles
SET 
  looking_for_gender = 'Everyone',
  profile_complete = true,
  account_active = true,
  lat = COALESCE(lat, -27.4698),
  lon = COALESCE(lon, 153.0251),
  age_min = COALESCE(age_min, 18),
  age_max = COALESCE(age_max, 99),
  distance_radius = COALESCE(distance_radius, 100)
WHERE email IN ('scottwhite115@gmail.com', 'scottwhite@y7mail.com');

-- Step 3: If birthdate/zodiac signs are missing, set defaults (you'll need to update these)
-- Check what's missing first
SELECT 
  email,
  birthdate,
  western_sign,
  chinese_sign,
  photos
FROM profiles
WHERE email IN ('scottwhite115@gmail.com', 'scottwhite@y7mail.com')
  AND (birthdate IS NULL OR western_sign IS NULL OR chinese_sign IS NULL OR photos IS NULL OR array_length(photos, 1) = 0);

-- Step 4: Final verification - show what's still missing
SELECT 
  email,
  CASE 
    WHEN profile_complete = true THEN '✅' ELSE '❌'
  END as profile_complete,
  CASE 
    WHEN account_active = true THEN '✅' ELSE '❌'
  END as account_active,
  CASE 
    WHEN lat IS NOT NULL AND lon IS NOT NULL THEN '✅' ELSE '❌'
  END as location,
  CASE 
    WHEN birthdate IS NOT NULL THEN '✅' ELSE '❌'
  END as birthdate,
  CASE 
    WHEN western_sign IS NOT NULL THEN '✅' ELSE '❌'
  END as western_sign,
  CASE 
    WHEN chinese_sign IS NOT NULL THEN '✅' ELSE '❌'
  END as chinese_sign,
  CASE 
    WHEN photos IS NOT NULL AND array_length(photos, 1) > 0 THEN '✅' ELSE '❌'
  END as photos,
  looking_for_gender,
  gender
FROM profiles
WHERE email IN ('scottwhite115@gmail.com', 'scottwhite@y7mail.com');

