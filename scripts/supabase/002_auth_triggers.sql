-- Migration: Auto-create and sync profiles with auth
-- Version: 002
-- Description: Triggers to automatically create/update profiles when users sign up or verify

-- 1) On user creation, make a profile row
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (
    id,
    email,
    display_name,
    photo_url,
    email_verified,
    phone_verified
  )
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'name', ''),
    NEW.raw_user_meta_data->>'avatar_url',
    NEW.email_confirmed_at IS NOT NULL,
    NEW.phone_confirmed_at IS NOT NULL
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- 2) Keep verified flags in sync if user verifies later
CREATE OR REPLACE FUNCTION public.sync_verification_flags()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE public.profiles
  SET 
    email_verified = (NEW.email_confirmed_at IS NOT NULL),
    phone_verified = (NEW.phone_confirmed_at IS NOT NULL),
    email = NEW.email
  WHERE id = NEW.id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_updated ON auth.users;
CREATE TRIGGER on_auth_user_updated
  AFTER UPDATE ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.sync_verification_flags();

-- 3) Comments
COMMENT ON FUNCTION public.handle_new_user IS 'Auto-create profile when user signs up';
COMMENT ON FUNCTION public.sync_verification_flags IS 'Keep email/phone verification status in sync';

