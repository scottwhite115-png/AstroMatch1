-- Add only_sanhe_liuhe_messages column to profiles table
-- This column controls whether a user only accepts messages from San He and Liu He matches

-- Add the column if it doesn't exist
ALTER TABLE profiles 
ADD COLUMN IF NOT EXISTS only_sanhe_liuhe_messages BOOLEAN DEFAULT false;

-- Add a comment to document the column
COMMENT ON COLUMN profiles.only_sanhe_liuhe_messages IS 'When true, user only accepts messages from San He (Triple Harmony) and Liu He (Six Harmonies) matches';

