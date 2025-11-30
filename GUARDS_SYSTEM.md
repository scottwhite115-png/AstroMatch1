# Authorization Guards System

## 📚 Overview

The guards system provides a flexible way to protect routes, components, and API endpoints based on user state and profile completeness.

---

## 🛡️ Available Guards

### Client-Side Guards (`lib/guards.ts`)

| Guard | Checks |
|-------|--------|
| `requireAuth()` | User is signed in |
| `requireEmailVerified()` | Email is confirmed |
| `requirePhoneVerified()` | Phone is confirmed |
| `requireLocation()` | Profile has GPS coordinates |
| `requireZodiacSigns()` | Profile has zodiac data |
| `requirePhoto()` | Profile has photo |
| `requireCompleteProfile()` | Profile has all required fields |
| `requireMatchReady()` | Ready for matching (email + location + zodiac) |

### Server-Side Guards (`lib/guards-server.ts`)

Same guards with `Server` suffix for use in API routes and server components.

---

## 🎨 Usage Examples

### 1. Protect a Page Component

```typescript
import { useRequireMatchReady } from "@/lib/hooks/use-guards";

export default function MatchesPage() {
  const { allowed, loading, errorMessage } = useRequireMatchReady();

  if (loading) return <div>Loading...</div>;
  if (!allowed) return <div>{errorMessage}</div>;

  return <div>Your matches...</div>;
}
```

### 2. Protect a Feature

```typescript
import { GuardGate } from "@/lib/hooks/use-guards";
import { requirePhoto } from "@/lib/guards";

export function PhotoFeature() {
  return (
    <GuardGate
      guardFn={requirePhoto}
      fallback={<div>Please upload a photo to use this feature</div>}
      loadingFallback={<div>Checking...</div>}
    >
      <YourFeatureComponent />
    </GuardGate>
  );
}
```

### 3. Combine Multiple Guards

```typescript
import { requireAll, requireAuth, requireEmailVerified, requireLocation } from "@/lib/guards";

// All must pass
const result = await requireAll(
  requireAuth,
  requireEmailVerified,
  requireLocation
);

if (!result.allowed) {
  console.log(result.reason);
}
```

### 4. Protect API Route

```typescript
// app/api/matches/route.ts
import { withGuard, requireMatchReadyServer } from "@/lib/guards-server";

export const GET = withGuard(requireMatchReadyServer, async (request) => {
  // This only runs if guard passes
  return NextResponse.json({ matches: [] });
});
```

### 5. Manual Guard Check

```typescript
import { requireEmailVerified, getGuardErrorMessage } from "@/lib/guards";

async function handleAction() {
  const result = await requireEmailVerified();
  
  if (!result.allowed) {
    alert(getGuardErrorMessage(result));
    return;
  }
  
  // Proceed with action
}
```

### 6. Custom Guard

```typescript
import { requireAuth, type GuardResult } from "@/lib/guards";

async function requirePremiumUser(): Promise<GuardResult> {
  const authCheck = await requireAuth();
  if (!authCheck.allowed) return authCheck;

  // Check if user has premium subscription
  const { data } = await supabase
    .from("subscriptions")
    .select("*")
    .eq("user_id", user.id)
    .eq("status", "active")
    .single();

  if (!data) {
    return { allowed: false, reason: "premium_required" };
  }

  return { allowed: true };
}
```

---

## 🚦 Guard Flow

```
User Action
    ↓
Guard Check
    ↓
  ┌─────────────┐
  │   Allowed?  │
  └─────────────┘
    ↓         ↓
  YES        NO
    ↓         ↓
Proceed   Block + Message
          + Redirect
```

---

## 📍 Auto-Redirect Paths

| Reason | Redirect To |
|--------|-------------|
| `not_signed_in` | `/login` |
| `email_unverified` | `/verify-email` |
| `phone_unverified` | `/verify-phone` |
| `incomplete_profile` | `/profile-builder` |
| `location_required` | `/enable-location` |
| `zodiac_required` | `/profile-builder` |
| `photo_required` | `/profile-builder` |

---

## 🎯 Common Patterns

### Matches Page (Full Protection)
```typescript
// Requires: auth + email + location + zodiac
useRequireMatchReady(true); // auto-redirect
```

### Profile Edit (Auth Only)
```typescript
// Requires: auth only
useRequireAuth(true);
```

### Settings (Email Verified)
```typescript
// Requires: auth + email verified
useRequireEmailVerified(true);
```

### Send Message (Complete Profile)
```typescript
// Requires: auth + complete profile
useRequireCompleteProfile(true);
```

---

## 🔧 Error Handling

```typescript
import { getGuardErrorMessage, getGuardRedirect } from "@/lib/guards";

const result = await requireMatchReady();

if (!result.allowed) {
  // Show user-friendly message
  const message = getGuardErrorMessage(result);
  toast.error(message);
  
  // Get redirect path
  const redirectPath = getGuardRedirect(result);
  router.push(redirectPath);
}
```

---

## 🧪 Testing Guards

```typescript
// Mock guard for testing
const mockGuard = async (): Promise<GuardResult> => ({
  allowed: true
});

// Test component with guard
render(
  <GuardGate guardFn={mockGuard}>
    <ProtectedComponent />
  </GuardGate>
);
```

---

## ⚡ Performance Tips

1. **Cache guard results** - Don't check same guard repeatedly
2. **Use server guards** - For API routes (more secure)
3. **Combine checks** - Use `requireAll` instead of multiple checks
4. **Early returns** - Check cheapest guards first

---

## 🔒 Security Notes

- ✅ Always use server-side guards for API routes
- ✅ Client guards are for UX only (not security)
- ✅ RLS policies are your actual security layer
- ✅ Guards just provide better user experience

---

**🎊 Your app now has a flexible, production-ready authorization system!**

