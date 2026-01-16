# 🎨 Design Mode Guide

## Quick Toggle

To switch between Design Mode and Production Mode, simply change one line:

**File:** `/lib/design-mode.ts`

```typescript
export const DESIGN_MODE = true;  // Design Mode ON
export const DESIGN_MODE = false; // Production Mode (Supabase connected)
```

---

## Design Mode (Current State)

When `DESIGN_MODE = true`:

✅ **What Works:**
- All UI components render normally
- Navigation works across all pages
- No authentication required
- No database calls
- Mock user data provided
- All pages accessible for design work

🚫 **What's Disabled:**
- Supabase authentication
- Database queries and mutations
- Real user data
- Email verification
- Phone verification
- Location permissions
- Profile persistence
- Match generation and storage

---

## Production Mode (Full Functionality)

When `DESIGN_MODE = false`:

✅ **Everything is reconnected automatically:**

### Authentication
- User sign up with email/password
- User sign in
- Email verification flow
- Phone verification flow
- Session management
- Auto sign-out on token expiry

### Guards & Protection
- Route protection via middleware
- Email verification guards
- Onboarding completion guards
- Location permission guards
- Profile completion guards
- Match-ready guards

### Database Features
- User profiles (CRUD)
- Match generation and storage
- Like system
- Message system
- Real-time updates
- Location-based filtering

### API Routes
- All `/app/api/*` routes functional
- Vedic astrology integrations
- Compatibility calculations
- Match matrix loading

---

## To Reconnect Supabase

Just say to me:

**"Connect Supabase"**

I will:
1. Set `DESIGN_MODE = false`
2. Verify all environment variables are set
3. Test the Supabase connection
4. Restore all guard functionality
5. Re-enable middleware protection
6. Confirm all features are working

---

## Files Affected by Design Mode

### Core Toggle Files
- `/lib/design-mode.ts` - Main toggle switch
- `/lib/guards.ts` - Client-side auth guards
- `/lib/contexts/auth-context.tsx` - Auth state management

### Preserved Supabase Files (Ready to Reconnect)
- `/lib/supabase/client.ts` - Client configuration
- `/lib/supabase/server.ts` - Server configuration
- `/lib/supabase/middleware.ts` - Middleware helpers
- `/lib/guards-server.ts` - Server-side guards
- `/lib/auth.ts` - Auth helpers
- `/lib/profiles.ts` - Profile management
- `/lib/hooks/use-guards.ts` - Guard hooks
- `/lib/hooks/use-auth.ts` - Auth hooks
- `/middleware.ts` - Route protection
- All `/app/api/*` routes - API endpoints

### Environment Variables (Needed for Production)
```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

---

## Current State Summary

🎨 **Design Mode is ACTIVE**

You can now:
- Work on UI/UX freely
- Test layouts on mobile and desktop
- Modify components without auth barriers
- Preview the full app flow
- Make design changes and see them instantly

The entire Supabase infrastructure is preserved and ready to reconnect with a single command when you're ready!

---

## Need Help?

- Want to test a specific feature? Just ask!
- Need mock data for a component? I can add it!
- Ready to reconnect? Just say "Connect Supabase"
- Want to add new features? Design mode makes it easy!

