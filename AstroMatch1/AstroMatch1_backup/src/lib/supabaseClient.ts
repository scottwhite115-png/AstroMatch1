import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

// Check if we have real Supabase credentials
const hasValidCredentials = supabaseUrl && 
  supabaseUrl !== 'your_supabase_project_url' && 
  supabaseUrl.startsWith('https://') &&
  supabaseAnonKey && 
  supabaseAnonKey !== 'your_supabase_anon_key'

let supabase: any = null

if (hasValidCredentials) {
  // Create real Supabase client
  supabase = createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: true
    }
  })
} else {
  // Mock client for development without Supabase setup
  supabase = {
    auth: {
      signInWithOtp: async () => ({ 
        error: { message: 'Supabase not configured. Please set up your Supabase project and add credentials to .env.local' } 
      }),
      signInWithOAuth: async () => ({ 
        error: { message: 'Supabase not configured. Please set up your Supabase project and add credentials to .env.local' } 
      }),
      exchangeCodeForSession: async () => ({ 
        error: { message: 'Supabase not configured. Please set up your Supabase project and add credentials to .env.local' } 
      }),
    }
  }
}

export { supabase }

// Database types for AstroMatch
export interface User {
  id: string
  email: string
  name: string
  birth_date: string
  birth_time?: string
  birth_location: string
  sun_sign: string
  moon_sign: string
  rising_sign: string
  chinese_animal: string
  created_at: string
  updated_at: string
}

export interface Match {
  id: string
  user1_id: string
  user2_id: string
  compatibility_score: number
  compatibility_details: any
  created_at: string
  updated_at: string
}

export interface Message {
  id: string
  chat_id: string
  sender_id: string
  content: string
  sent_at: string
  seen_by: string[]
}

export interface Chat {
  id: string
  participants: string[]
  created_at: string
  updated_at: string
}
