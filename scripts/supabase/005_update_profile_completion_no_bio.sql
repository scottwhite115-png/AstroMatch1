-- Update profile completion check function to remove bio requirement
-- Run this in Supabase SQL Editor after migration 004

CREATE OR REPLACE FUNCTION public.check_profile_completion(profile_id UUID)
RETURNS BOOLEAN AS $$
DECLARE
  profile_record RECORD;
  is_complete BOOLEAN;
BEGIN
  SELECT * INTO profile_record
  FROM public.profiles
  WHERE id = profile_id;

  -- Check all required fields (bio removed from requirements)
  is_complete := (
    profile_record.email_verified = TRUE AND
    profile_record.phone_verified = TRUE AND
    profile_record.birthdate IS NOT NULL AND
    profile_record.western_sign IS NOT NULL AND
    profile_record.chinese_sign IS NOT NULL AND
    profile_record.gender IS NOT NULL AND
    profile_record.occupation IS NOT NULL AND
    profile_record.height IS NOT NULL AND
    profile_record.photos IS NOT NULL AND
    array_length(profile_record.photos, 1) >= 2 AND
    profile_record.city IS NOT NULL
  );

  RETURN is_complete;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant permissions
GRANT EXECUTE ON FUNCTION public.check_profile_completion TO authenticated;

