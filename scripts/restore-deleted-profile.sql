-- Restore or recreate scottwhite@y7mail.com profile
-- Step 1: Check if profile exists
SELECT 
  id,
  email,
  display_name,
  profile_complete,
  account_active,
  created_at
FROM profiles
WHERE email = 'scottwhite@y7mail.com';

-- Step 2: Check if auth user exists
SELECT 
  id as auth_user_id,
  email,
  created_at,
  raw_user_meta_data
FROM auth.users
WHERE email = 'scottwhite@y7mail.com';

-- Step 3: If auth user exists but profile doesn't, create the profile
-- This will create the profile entry linked to the auth user
DO $$
DECLARE
  auth_user_record RECORD;
BEGIN
  -- Get the auth user
  SELECT id, email, raw_user_meta_data INTO auth_user_record
  FROM auth.users
  WHERE email = 'scottwhite@y7mail.com'
  LIMIT 1;
  
  -- If auth user exists and profile doesn't, create it
  IF auth_user_record.id IS NOT NULL THEN
    INSERT INTO profiles (
      id,
      email,
      display_name,
      profile_complete,
      account_active,
      lat,
      lon,
      gender,
      looking_for_gender,
      age_min,
      age_max,
      distance_radius,
      created_at,
      updated_at
    )
    VALUES (
      auth_user_record.id,
      auth_user_record.email,
      COALESCE(auth_user_record.raw_user_meta_data->>'display_name', 'User'),
      false,  -- Will be set to true below
      true,
      -27.4698,  -- Brisbane coordinates
      153.0251,
      'Other',
      'Everyone',
      18,
      99,
      100,
      NOW(),
      NOW()
    )
    ON CONFLICT (id) DO NOTHING;
    
    RAISE NOTICE 'Profile created/restored for: %', auth_user_record.email;
  ELSE
    RAISE NOTICE 'Auth user not found for: scottwhite@y7mail.com';
  END IF;
END $$;

-- Update both profiles to be visible
UPDATE profiles
SET 
  profile_complete = true,
  account_active = true,
  lat = -27.4698,
  lon = 153.0251,
  gender = COALESCE(gender, 'Other'),
  looking_for_gender = 'Everyone',
  age_min = COALESCE(age_min, 18),
  age_max = COALESCE(age_max, 99),
  distance_radius = COALESCE(distance_radius, 100)
WHERE email IN ('scottwhite115@gmail.com', 'scottwhite@y7mail.com');

-- Final verification
SELECT 
  id,
  email,
  display_name,
  profile_complete,
  account_active,
  lat,
  lon,
  gender,
  looking_for_gender,
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

