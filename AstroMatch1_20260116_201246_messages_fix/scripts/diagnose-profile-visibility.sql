-- Comprehensive diagnostic for profile visibility
-- Check all requirements for both profiles

SELECT 
  email,
  id,
  display_name,
  -- Visibility flags
  profile_complete,
  account_active,
  -- Location
  lat,
  lon,
  -- Gender preferences
  gender,
  looking_for_gender,
  -- Age preferences
  age,
  age_min,
  age_max,
  distance_radius,
  -- Required fields
  birthdate,
  western_sign,
  chinese_sign,
  -- Photos
  CASE 
    WHEN photos IS NULL THEN 0
    WHEN array_length(photos, 1) IS NULL THEN 0
    ELSE array_length(photos, 1)
  END as photo_count,
  -- Check if all requirements are met
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
    THEN '✅ READY'
    ELSE '❌ MISSING: ' || 
      CASE WHEN profile_complete IS NOT TRUE THEN 'profile_complete ' ELSE '' END ||
      CASE WHEN account_active IS NOT TRUE THEN 'account_active ' ELSE '' END ||
      CASE WHEN lat IS NULL THEN 'lat ' ELSE '' END ||
      CASE WHEN lon IS NULL THEN 'lon ' ELSE '' END ||
      CASE WHEN birthdate IS NULL THEN 'birthdate ' ELSE '' END ||
      CASE WHEN western_sign IS NULL THEN 'western_sign ' ELSE '' END ||
      CASE WHEN chinese_sign IS NULL THEN 'chinese_sign ' ELSE '' END ||
      CASE WHEN photos IS NULL OR array_length(photos, 1) = 0 THEN 'photos ' ELSE '' END
  END as status
FROM profiles
WHERE email IN ('scottwhite115@gmail.com', 'scottwhite@y7mail.com')
ORDER BY email;

-- Check if they can see each other based on gender preferences
-- User 1 looking for User 2
SELECT 
  p1.email as user1_email,
  p1.gender as user1_gender,
  p1.looking_for_gender as user1_looking_for,
  p2.email as user2_email,
  p2.gender as user2_gender,
  CASE 
    WHEN p1.looking_for_gender = 'Everyone' THEN '✅ CAN SEE'
    WHEN p1.looking_for_gender = p2.gender THEN '✅ CAN SEE'
    WHEN p1.looking_for_gender = 'Men' AND (p2.gender = 'Man' OR p2.gender = 'Male') THEN '✅ CAN SEE'
    WHEN p1.looking_for_gender = 'Women' AND (p2.gender = 'Woman' OR p2.gender = 'Female') THEN '✅ CAN SEE'
    ELSE '❌ CANNOT SEE'
  END as user1_can_see_user2
FROM profiles p1
CROSS JOIN profiles p2
WHERE p1.email = 'scottwhite115@gmail.com'
  AND p2.email = 'scottwhite@y7mail.com';

-- User 2 looking for User 1
SELECT 
  p2.email as user2_email,
  p2.gender as user2_gender,
  p2.looking_for_gender as user2_looking_for,
  p1.email as user1_email,
  p1.gender as user1_gender,
  CASE 
    WHEN p2.looking_for_gender = 'Everyone' THEN '✅ CAN SEE'
    WHEN p2.looking_for_gender = p1.gender THEN '✅ CAN SEE'
    WHEN p2.looking_for_gender = 'Men' AND (p1.gender = 'Man' OR p1.gender = 'Male') THEN '✅ CAN SEE'
    WHEN p2.looking_for_gender = 'Women' AND (p1.gender = 'Woman' OR p1.gender = 'Female') THEN '✅ CAN SEE'
    ELSE '❌ CANNOT SEE'
  END as user2_can_see_user1
FROM profiles p1
CROSS JOIN profiles p2
WHERE p1.email = 'scottwhite115@gmail.com'
  AND p2.email = 'scottwhite@y7mail.com';

-- Check distance between them
SELECT 
  p1.email as user1,
  p2.email as user2,
  p1.lat as user1_lat,
  p1.lon as user1_lon,
  p2.lat as user2_lat,
  p2.lon as user2_lon,
  -- Calculate distance in km using Haversine formula
  (
    6371 * acos(
      cos(radians(p1.lat)) * 
      cos(radians(p2.lat)) * 
      cos(radians(p2.lon) - radians(p1.lon)) + 
      sin(radians(p1.lat)) * 
      sin(radians(p2.lat))
    )
  ) as distance_km,
  p1.distance_radius as user1_radius,
  p2.distance_radius as user2_radius,
  CASE 
    WHEN (
      6371 * acos(
        cos(radians(p1.lat)) * 
        cos(radians(p2.lat)) * 
        cos(radians(p2.lon) - radians(p1.lon)) + 
        sin(radians(p1.lat)) * 
        sin(radians(p2.lat))
      )
    ) <= GREATEST(p1.distance_radius, p2.distance_radius) THEN '✅ WITHIN RANGE'
    ELSE '❌ TOO FAR'
  END as distance_status
FROM profiles p1
CROSS JOIN profiles p2
WHERE p1.email = 'scottwhite115@gmail.com'
  AND p2.email = 'scottwhite@y7mail.com';

-- Check if they've already liked/passed each other
SELECT 
  'Likes' as interaction_type,
  l.liker_id,
  p1.email as liker_email,
  l.liked_id,
  p2.email as liked_email
FROM likes l
JOIN profiles p1 ON p1.id = l.liker_id
JOIN profiles p2 ON p2.id = l.liked_id
WHERE (p1.email = 'scottwhite115@gmail.com' AND p2.email = 'scottwhite@y7mail.com')
   OR (p1.email = 'scottwhite@y7mail.com' AND p2.email = 'scottwhite115@gmail.com')

UNION ALL

SELECT 
  'Passes' as interaction_type,
  ps.passer_id,
  p1.email as passer_email,
  ps.passed_id,
  p2.email as passed_email
FROM passes ps
JOIN profiles p1 ON p1.id = ps.passer_id
JOIN profiles p2 ON p2.id = ps.passed_id
WHERE (p1.email = 'scottwhite115@gmail.com' AND p2.email = 'scottwhite@y7mail.com')
   OR (p1.email = 'scottwhite@y7mail.com' AND p2.email = 'scottwhite115@gmail.com')
   AND ps.expires_at > NOW();

