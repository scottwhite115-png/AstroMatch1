-- ============================================
-- MIGRATION 006: PROFILES RLS POLICIES
-- Ensures profiles table has SELECT + UPDATE so photo (and other) updates succeed.
-- Supabase UPDATE requires both SELECT and UPDATE policies when RLS is enabled.
-- ============================================

-- Enable RLS on profiles if not already (idempotent)
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Allow users to read all profiles (needed for discovery; restrict in app if needed)
DROP POLICY IF EXISTS "profiles_select_public" ON public.profiles;
CREATE POLICY "profiles_select_public"
  ON public.profiles FOR SELECT
  USING (true);

-- Allow users to insert their own profile (e.g. on signup)
DROP POLICY IF EXISTS "profiles_insert_own" ON public.profiles;
CREATE POLICY "profiles_insert_own"
  ON public.profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

-- Allow users to update only their own profile (required for saving photos and other fields)
DROP POLICY IF EXISTS "profiles_update_own" ON public.profiles;
CREATE POLICY "profiles_update_own"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);
