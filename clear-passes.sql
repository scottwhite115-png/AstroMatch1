-- Clear passes for scottwhite@y7mail.com profile to show in matches again
-- Run this in Supabase SQL Editor

-- First, find the profile ID
SELECT id, email, name FROM profiles WHERE email = 'scottwhite@y7mail.com';

-- Clear any passes (swipe lefts) for this profile
DELETE FROM passes 
WHERE passed_id = (SELECT id FROM profiles WHERE email = 'scottwhite@y7mail.com');

-- Clear any likes if needed (optional - uncomment if you want to reset likes too)
-- DELETE FROM likes 
-- WHERE liked_id = (SELECT id FROM profiles WHERE email = 'scottwhite@y7mail.com');

-- Verify it's cleared
SELECT COUNT(*) as passes_removed FROM passes 
WHERE passed_id = (SELECT id FROM profiles WHERE email = 'scottwhite@y7mail.com');

