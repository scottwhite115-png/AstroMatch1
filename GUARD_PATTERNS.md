# Guard Usage Patterns

## 🎯 Choosing the Right Method

| Method | Use When | Pros | Cons |
|--------|----------|------|------|
| **1. Manual Check** | Need full control | Most flexible | More boilerplate |
| **2. Hook** | Client component (recommended) | Clean, auto-redirect | Client-side only |
| **3. GuardGate** | Wrapping part of page | Granular control | Nesting can be verbose |
| **4. Multiple Guards** | Complex requirements | Type-safe, composable | Multiple checks |
| **5. Server Component** | App Router (best for SEO) | Fastest, no flash | App router only |
| **6. Custom Error** | Need special handling | Very flexible | More code |

---

## ✅ Recommendations

### For App Router (Next.js 13+)
```typescript
// app/matches/page.tsx
import { requireMatchReadyServer } from "@/lib/guards-server";
import { redirect } from "next/navigation";

export default async function MatchesPage() {
  const guard = await requireMatchReadyServer();
  
  if (!guard.allowed) {
    redirect("/profile-builder");
  }

  return <MatchesContent />;
}
```

**Benefits:**
- ✅ Server-side check (no flash of content)
- ✅ Better SEO
- ✅ Faster initial load
- ✅ More secure

### For Pages Router (Next.js 12 or Client Components)
```typescript
// pages/matches.tsx or any client component
import { useRequireMatchReady } from "@/lib/hooks/use-guards";

export default function MatchesPage() {
  const { allowed, loading } = useRequireMatchReady(true);
  
  if (loading) return <Loading />;
  if (!allowed) return null;
  
  return <MatchesContent />;
}
```

**Benefits:**
- ✅ Clean, minimal code
- ✅ Auto-redirect built-in
- ✅ Handles loading state
- ✅ Works in any client component

---

## 🎨 Common Patterns

### 1. Protecting Entire Page
```typescript
function Page() {
  const { allowed, loading } = useRequireAuth(true);
  
  if (loading) return <LoadingPage />;
  if (!allowed) return null;
  
  return <PageContent />;
}
```

### 2. Protecting a Feature
```typescript
function Page() {
  return (
    <div>
      <PublicContent />
      
      <GuardGate 
        guardFn={requirePhoto}
        fallback={<UploadPhotoPrompt />}
      >
        <PhotoFeature />
      </GuardGate>
    </div>
  );
}
```

### 3. Progressive Enhancement
```typescript
function Page() {
  const { allowed: hasPhoto } = useGuard(requirePhoto);
  
  return (
    <div>
      <BasicFeatures />
      
      {hasPhoto && <AdvancedPhotoFeatures />}
      {!hasPhoto && <UploadPhotoPrompt />}
    </div>
  );
}
```

### 4. Inline Feature Toggle
```typescript
function MessagingButton({ recipientId }: { recipientId: string }) {
  const { allowed } = useGuard(requireEmailVerified);
  
  const handleClick = async () => {
    if (!allowed) {
      toast.error("Please verify your email first");
      router.push("/verify-email");
      return;
    }
    
    // Send message
  };
  
  return (
    <button onClick={handleClick}>
      Send Message
    </button>
  );
}
```

### 5. API Route Protection
```typescript
// app/api/send-message/route.ts
import { withGuard, requireEmailVerifiedServer } from "@/lib/guards-server";

export const POST = withGuard(
  requireEmailVerifiedServer,
  async (request) => {
    // Handle message sending
    return NextResponse.json({ success: true });
  }
);
```

---

## 🚦 Decision Tree

```
Need to protect something?
│
├─ Is it a full page?
│  ├─ Using App Router?
│  │  └─ → Use requireMatchReadyServer() + redirect()
│  └─ Using Pages Router?
│     └─ → Use useRequireMatchReady(true)
│
├─ Is it a feature/component?
│  ├─ Show/hide only?
│  │  └─ → Use useGuard() + conditional render
│  └─ Need custom fallback?
│     └─ → Use <GuardGate>
│
└─ Is it an API route?
   └─ → Use withGuard() + requireXServer()
```

---

## 💡 Best Practices

### ✅ DO

```typescript
// Use specific guards
useRequireMatchReady() // Better

// Combine related checks
requireAll(requireAuth, requireEmailVerified)

// Server-side for pages
async function Page() {
  const guard = await requireMatchReadyServer();
  if (!guard.allowed) redirect("/setup");
}

// Provide helpful feedback
{!allowed && <SetupProfilePrompt />}
```

### ❌ DON'T

```typescript
// Don't check same guard multiple times
useRequireAuth();
useRequireEmailVerified(); // This already checks auth
useRequireLocation(); // This also checks auth

// Don't use client guards for security
// They're for UX only - use RLS policies for real security

// Don't forget loading state
if (!allowed) return null; // ❌ Might flash briefly
if (loading) return <Loading />; // ✅ Better
if (!allowed) return null;
```

---

## 🎭 Real-World Examples

### Matches Page
```typescript
// Requires: auth + email + location + zodiac
export default function MatchesPage() {
  const { allowed, loading } = useRequireMatchReady(true);
  
  if (loading) return <MatchesPageSkeleton />;
  if (!allowed) return null;
  
  return <MatchesList />;
}
```

### Profile Edit
```typescript
// Requires: auth only (can edit even if incomplete)
export default function EditProfilePage() {
  const { allowed, loading } = useRequireAuth(true);
  
  if (loading) return <ProfileEditSkeleton />;
  if (!allowed) return null;
  
  return <ProfileEditor />;
}
```

### Send Message Button
```typescript
// Requires: email verified + complete profile
function SendMessageButton() {
  const { allowed, errorMessage } = useGuard(
    () => requireAll(requireEmailVerified, requireCompleteProfile)
  );
  
  const handleClick = () => {
    if (!allowed) {
      toast.error(errorMessage);
      return;
    }
    
    openMessageDialog();
  };
  
  return (
    <button onClick={handleClick} disabled={!allowed}>
      Send Message
    </button>
  );
}
```

---

## 🧪 Testing

```typescript
// Mock guard for testing
const mockGuard = async () => ({ allowed: true });

test("shows content when allowed", () => {
  render(
    <GuardGate guardFn={mockGuard}>
      <ProtectedContent />
    </GuardGate>
  );
  
  expect(screen.getByText("Protected Content")).toBeInTheDocument();
});

test("shows fallback when not allowed", () => {
  const failGuard = async () => ({ 
    allowed: false, 
    reason: "not_signed_in" 
  });
  
  render(
    <GuardGate 
      guardFn={failGuard}
      fallback={<div>Please sign in</div>}
    >
      <ProtectedContent />
    </GuardGate>
  );
  
  expect(screen.getByText("Please sign in")).toBeInTheDocument();
});
```

---

**🎉 Use the right pattern for your use case and enjoy clean, protected routes!**

