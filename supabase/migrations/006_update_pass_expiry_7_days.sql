-- Migration: Update pass expiry to 7 days instead of 28 days
-- This makes swiped-left profiles reappear after 1 week

-- Update the default for future passes
ALTER TABLE public.passes 
ALTER COLUMN expires_at SET DEFAULT NOW() + INTERVAL '7 days';

-- Update existing passes to use 7 day expiry from their created_at date
-- Only update passes that were created with the old 28 day expiry
UPDATE public.passes 
SET expires_at = created_at + INTERVAL '7 days'
WHERE expires_at = created_at + INTERVAL '28 days';

-- Add comment for documentation
COMMENT ON COLUMN public.passes.expires_at IS 'Passes expire after 7 days, then the profile reappears in the stack';

