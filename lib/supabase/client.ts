import { createBrowserClient } from '@supabase/ssr'

export function createClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
  
  if (!url || !key) {
    console.warn('[Supabase] Missing environment variables. Using mock client.')
    // Return a mock client that won't crash
    return {
      auth: {
        getUser: () => Promise.resolve({ data: { user: null }, error: null }),
        getSession: () => Promise.resolve({ data: { session: null }, error: null }),
      },
    } as any
  }
  
  // For browser clients, createBrowserClient automatically uses localStorage
  // for PKCE code verifier storage. Don't override with custom cookie handling
  // as it can cause PKCE issues, especially on mobile browsers.
  return createBrowserClient(url, key)
}
