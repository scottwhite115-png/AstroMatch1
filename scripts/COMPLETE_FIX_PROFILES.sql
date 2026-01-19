-- COMPLETE FIX: Make both profiles visible to each other
-- Run this entire script in Supabase SQL Editor

-- Step 1: Restore deleted profile if needed
DO $$
DECLARE
  auth_user_record RECORD;
  profile_exists BOOLEAN;
BEGIN
  -- Check if auth user exists
  SELECT id, email INTO auth_user_record
  FROM auth.users
  WHERE email = 'scottwhite@y7mail.com'
  LIMIT 1;
  
  IF auth_user_record.id IS NOT NULL THEN
    -- Check if profile exists
    SELECT EXISTS(SELECT 1 FROM profiles WHERE id = auth_user_record.id) INTO profile_exists;
    
    IF NOT profile_exists THEN
      INSERT INTO profiles (
        id, email, display_name, profile_complete, account_active,
        lat, lon, gender, looking_for_gender, age_min, age_max, distance_radius,
        created_at, updated_at
      )
      VALUES (
        auth_user_record.id,
        auth_user_record.email,
        'User',
        false, true, -27.4698, 153.0251, 'Other', 'Everyone', 18, 99, 100,
        NOW(), NOW()
      );
      RAISE NOTICE 'Created profile for: %', auth_user_record.email;
    END IF;
  END IF;
END $$;

-- Step 2: Set BOTH profiles to 'Everyone' for testing (ensures mutual visibility)
UPDATE profiles
SET 
  looking_for_gender = 'Everyone',
  profile_complete = true,
  account_active = true,
  lat = -27.4698,  -- Same location so they're close
  lon = 153.0251,
  age_min = 18,
  age_max = 99,
  distance_radius = 100  -- Large radius
WHERE email IN ('scottwhite115@gmail.com', 'scottwhite@y7mail.com');

-- Step 3: Ensure both have required fields (set defaults if missing)
-- Note: You'll need to add birthdate, zodiac signs, and photos in the app
-- But this ensures everything else is set

-- Step 4: Clear any likes/passes between them (so they show up fresh)
DELETE FROM likes
WHERE (liker_id IN (SELECT id FROM profiles WHERE email IN ('scottwhite115@gmail.com', 'scottwhite@y7mail.com'))
   AND liked_id IN (SELECT id FROM profiles WHERE email IN ('scottwhite115@gmail.com', 'scottwhite@y7mail.com')));

DELETE FROM passes
WHERE (passer_id IN (SELECT id FROM profiles WHERE email IN ('scottwhite115@gmail.com', 'scottwhite@y7mail.com'))
   AND passed_id IN (SELECT id FROM profiles WHERE email IN ('scottwhite115@gmail.com', 'scottwhite@y7mail.com')));

-- Step 5: Final verification - show exactly what's set
SELECT 
  email,
  id,
  -- Status flags
  profile_complete as "Complete?",
  account_active as "Active?",
  -- Location
  lat,
  lon,
  distance_radius as "Radius (km)",
  -- Gender
  gender,
  looking_for_gender as "Looking For",
  -- Age
  age,
  age_min,
  age_max,
  -- Required fields
  CASE WHEN birthdate IS NOT NULL THEN '✅' ELSE '❌' END as "Birthdate",
  CASE WHEN western_sign IS NOT NULL THEN '✅' ELSE '❌' END as "Western Sign",
  CASE WHEN chinese_sign IS NOT NULL THEN '✅' ELSE '❌' END as "Chinese Sign",
  CASE WHEN photos IS NOT NULL AND array_length(photos, 1) > 0 THEN '✅' ELSE '❌' END as "Photos",
  -- Overall status
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
    THEN '✅ READY TO SHOW'
    ELSE '❌ MISSING: ' || 
      CASE WHEN birthdate IS NULL THEN 'birthdate ' ELSE '' END ||
      CASE WHEN western_sign IS NULL THEN 'western_sign ' ELSE '' END ||
      CASE WHEN chinese_sign IS NULL THEN 'chinese_sign ' ELSE '' END ||
      CASE WHEN photos IS NULL OR array_length(photos, 1) = 0 THEN 'photos ' ELSE '' END
  END as "STATUS"
FROM profiles
WHERE email IN ('scottwhite115@gmail.com', 'scottwhite@y7mail.com')
ORDER BY email;

-- Step 6: Test the RPC function directly
-- This simulates what the app does
SELECT 
  p.email,
  p.id,
  p.display_name,
  p.gender,
  p.looking_for_gender,
  p.profile_complete,
  p.account_active,
  earth_distance(ll_to_earth(-27.4698, 153.0251), ll_to_earth(p.lat, p.lon)) / 1000.0 AS distance_km
FROM profiles p
WHERE p.lat IS NOT NULL 
  AND p.lon IS NOT NULL
  AND p.email IN ('scottwhite115@gmail.com', 'scottwhite@y7mail.com')
  AND earth_distance(ll_to_earth(-27.4698, 153.0251), ll_to_earth(p.lat, p.lon)) <= 100000
ORDER BY distance_km;

