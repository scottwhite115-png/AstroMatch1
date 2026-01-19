-- Run this in Supabase SQL Editor to update the default pass expiry
-- This changes pass expiry from 28 days to 7 days

-- Update the default for the expires_at column
ALTER TABLE public.passes 
ALTER COLUMN expires_at SET DEFAULT NOW() + INTERVAL '7 days';

-- Add a helpful comment
COMMENT ON COLUMN public.passes.expires_at IS 
  'Profiles reappear in stack after 7 days. User must swipe left again to hide for another 7 days.';

-- Verify the change
SELECT 
  column_name, 
  column_default,
  data_type
FROM information_schema.columns
WHERE table_schema = 'public' 
  AND table_name = 'passes' 
  AND column_name = 'expires_at';

