import { supabase } from '@/lib/supabaseClient';

export async function getAuthProvider() {
  const { data: { user }, error } = await supabase.auth.getUser();
  if (error || !user) return null;

  const provider = (user.app_metadata as any)?.provider || 'email';
  const email = user.email || null;

  return { id: user.id, provider, email };
}


