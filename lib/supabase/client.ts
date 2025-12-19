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
  
  return createBrowserClient(url, key, {
    cookies: {
      getAll() {
        const cookies: { name: string; value: string }[] = []
        if (typeof document !== 'undefined' && document.cookie) {
          document.cookie.split(';').forEach((cookie) => {
            const parts = cookie.trim().split('=')
            if (parts.length >= 2) {
              const name = parts[0].trim()
              const value = parts.slice(1).join('=') // Handle values with '='
              if (name) {
                cookies.push({ name, value })
              }
            }
          })
        }
        return cookies
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value, options }) => {
          if (typeof document === 'undefined' || options?.httpOnly) return
          
          // Build cookie string with all necessary attributes
          let cookie = `${name}=${value}`
          cookie += `; path=${options?.path || '/'}`
          
          if (options?.maxAge !== undefined) {
            cookie += `; max-age=${options.maxAge}`
          }
          if (options?.sameSite) {
            cookie += `; samesite=${options.sameSite}`
          }
          if (options?.secure && window.location.protocol === 'https:') {
            cookie += `; secure`
          }
          
          document.cookie = cookie
        })
      },
    },
  })
}
