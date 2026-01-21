/**
 * DESIGN MODE TOGGLE
 * 
 * Set to true to bypass all Supabase authentication and work on UI/UX
 * Set to false to reconnect Supabase and restore full functionality
 * 
 * When ready to reconnect Supabase, just say "Connect Supabase"
 */

export const DESIGN_MODE = true;

/**
 * SUPABASE CONFIGURATION (preserved for reconnection)
 * 
 * When DESIGN_MODE is false, all these features will be restored:
 * - User authentication (sign in/sign up/sign out)
 * - Email verification guards
 * - Phone verification guards  
 * - Location permission guards
 * - Onboarding completion guards
 * - Profile data persistence
 * - Match generation and storage
 * - Real-time updates
 * - API route protection
 * 
 * All Supabase functions are preserved in:
 * - /lib/guards.ts (auth guards)
 * - /lib/guards-server.ts (server-side guards)
 * - /lib/supabase/* (client/server setup)
 * - /lib/auth.ts (auth helpers)
 * - /lib/profiles.ts (profile management)
 * - /lib/hooks/* (auth hooks)
 * - /middleware.ts (route protection)
 */

