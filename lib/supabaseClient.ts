import { createClient } from "@supabase/supabase-js";

export const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true,
    },
  }
);

// Type for profile
export type Profile = {
  id: string;
  display_name: string | null;
  west_east: string | null;
  photo_url: string | null;
  email: string | null;
  phone: string | null;
  email_verified: boolean;
  phone_verified: boolean;
  lat: number | null;
  lon: number | null;
  last_active: string;
  created_at: string;
  updated_at: string;
};
