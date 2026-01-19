-- Update test profiles to be visible to each other
-- Emails: scottwhite115@gmail.com and scottwhite@y7mail.com

-- Update profile_complete and account_active for both users
UPDATE profiles
SET 
  profile_complete = true,
  account_active = true,
  -- Set location (Brisbane coordinates - adjust if needed)
  lat = -27.4698,
  lon = 153.0251,
  -- Ensure gender and preferences are set so they can see each other
  gender = COALESCE(gender, 'Other'),
  looking_for_gender = 'Everyone',  -- So they can see each other regardless of gender
  age_min = COALESCE(age_min, 18),
  age_max = COALESCE(age_max, 99),
  distance_radius = COALESCE(distance_radius, 100)
WHERE email IN ('scottwhite115@gmail.com', 'scottwhite@y7mail.com')
  AND (profile_complete IS NULL OR profile_complete = false OR account_active IS NULL OR account_active = false);

-- Verify the updates
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
  age_min,
  age_max,
  birthdate,
  western_sign,
  chinese_sign,
  photos,
  CASE 
    WHEN photos IS NULL THEN 'NO PHOTOS'
    WHEN array_length(photos, 1) = 0 THEN 'NO PHOTOS'
    ELSE 'HAS PHOTOS'
  END as photo_status
FROM profiles
WHERE email IN ('scottwhite115@gmail.com', 'scottwhite@y7mail.com');

