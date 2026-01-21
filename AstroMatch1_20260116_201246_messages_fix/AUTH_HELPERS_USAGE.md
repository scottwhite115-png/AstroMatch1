# Auth Helpers Usage Guide

## Overview
Complete authentication and authorization system with:
- Auto-promotion of OWNER based on email
- Auto-unban after suspension expires
- Role-based access control
- Account status checks

## Setup

### 1. Environment Variable
Add to `.env.local`:
```bash
ASTROMATCH_OWNER_EMAIL=your-email@example.com
```

### 2. Import
```typescript
import {
  getCurrentProfileWithRole,
  requireStaff,
  requireOwner,
  checkUserAccess,
  getCurrentUserRole,
  isStaff,
  isOwner,
  isAdmin,
  type Role,
  type AccountStatus,
} from "@/lib/auth-helpers"
```

## Core Functions

### `getCurrentProfileWithRole()`
Gets current user profile with automatic role logic:
- Auto-promotes OWNER based on `ASTROMATCH_OWNER_EMAIL`
- Ensures ADMIN/OWNER have `isStaff` flag
- Auto-unbans expired suspensions
- Creates profile if doesn't exist

```typescript
const profile = await getCurrentProfileWithRole()
if (profile) {
  console.log(profile.role) // "USER" | "ADMIN" | "OWNER"
  console.log(profile.status) // "ACTIVE" | "SUSPENDED" | "BANNED"
  console.log(profile.isStaff) // boolean
}
```

### `requireStaff()`
Requires ADMIN or OWNER role. Redirects if unauthorized.

```typescript
// app/admin/page.tsx
export default async function AdminPage() {
  const profile = await requireStaff()
  // User is guaranteed to be ADMIN or OWNER here
  return <AdminDashboard profile={profile} />
}
```

### `requireOwner()`
Requires OWNER role. Redirects if unauthorized.

```typescript
// app/admin/owner-settings/page.tsx
export default async function OwnerSettingsPage() {
  const profile = await requireOwner()
  // User is guaranteed to be OWNER here
  return <OwnerSettings profile={profile} />
}
```

### `checkUserAccess()`
Checks if user can access the app. Returns status and reason.

```typescript
const { canAccess, reason } = await checkUserAccess()
if (!canAccess) {
  return <BannedPage reason={reason} />
}
```

### Helper Functions
Quick role checks:

```typescript
// Check if current user is staff
const isUserStaff = await isStaff() // boolean

// Check if current user is owner
const isUserOwner = await isOwner() // boolean

// Check if current user is admin
const isUserAdmin = await isAdmin() // boolean

// Get current user role
const role = await getCurrentUserRole() // "USER" | "ADMIN" | "OWNER" | null
```

## Auto-Promotion Logic

When a user logs in:
1. If their email matches `ASTROMATCH_OWNER_EMAIL`, they're promoted to OWNER
2. OWNER role automatically gets `isStaff: true`
3. ADMIN and OWNER roles always have `isStaff: true`

**Example:**
```env
ASTROMATCH_OWNER_EMAIL=ceo@astromatch.com
```

When `ceo@astromatch.com` logs in:
- First time: `role: "USER"` → automatically updated to `role: "OWNER"`
- Subsequent logins: Verified as `role: "OWNER"`
- `isStaff` flag automatically set to `true`

## Auto-Unban Logic

Suspensions automatically expire:
1. User is suspended with `suspensionEndsAt` date
2. On next login/API call, if `suspensionEndsAt` has passed:
   - Status changes to `"ACTIVE"`
   - `suspensionEndsAt` set to `null`
3. No manual intervention needed

**Example Timeline:**
```
Day 1: User suspended for 7 days
  - status: "SUSPENDED"
  - suspensionEndsAt: "2025-12-22"

Day 8: User logs in
  - Auto-unban triggers
  - status: "ACTIVE"
  - suspensionEndsAt: null
```

## API Route Protection

### Method 1: Using Helper Functions
```typescript
// app/api/admin/users/route.ts
import { requireStaff } from "@/lib/auth-helpers"

export async function GET() {
  const profile = await requireStaff()
  
  // Fetch users...
  return NextResponse.json({ users })
}
```

### Method 2: Manual Check
```typescript
// app/api/posts/route.ts
import { getCurrentProfileWithRole, checkUserAccess } from "@/lib/auth-helpers"

export async function POST(req: Request) {
  const profile = await getCurrentProfileWithRole()
  
  if (!profile) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }
  
  const { canAccess, reason } = await checkUserAccess()
  if (!canAccess) {
    return NextResponse.json({ error: reason }, { status: 403 })
  }
  
  // Create post...
  return NextResponse.json({ success: true })
}
```

## Server Components

```typescript
// app/admin/dashboard/page.tsx
import { requireStaff } from "@/lib/auth-helpers"

export default async function AdminDashboard() {
  const profile = await requireStaff()
  
  return (
    <div>
      <h1>Welcome, {profile.role}!</h1>
      {profile.role === "OWNER" && (
        <OwnerOnlySection />
      )}
    </div>
  )
}
```

## Conditional Rendering

```typescript
// components/AdminButton.tsx
import { isStaff } from "@/lib/auth-helpers"

export async function AdminButton() {
  const showAdminButton = await isStaff()
  
  if (!showAdminButton) return null
  
  return (
    <Link href="/admin">
      <button>Admin Panel</button>
    </Link>
  )
}
```

## Account Status Pages

Two dedicated pages for account issues:
- `/account/banned` - Shown to permanently banned users
- `/account/suspended` - Shown to temporarily suspended users

These are automatically redirected to by `requireStaff()` and `requireOwner()`.

## Testing

### Test Auto-Promotion
1. Set `ASTROMATCH_OWNER_EMAIL=test@example.com` in `.env.local`
2. Create/login with `test@example.com`
3. Check database: User should have `role: "OWNER"`

### Test Auto-Unban
1. Manually set user suspension in database:
   ```sql
   UPDATE profiles 
   SET status = 'SUSPENDED', 
       "suspensionEndsAt" = NOW() - INTERVAL '1 day'
   WHERE email = 'test@example.com';
   ```
2. User logs in or makes API call
3. Check database: Status should be `"ACTIVE"`, `suspensionEndsAt` should be `null`

### Test Role Checks
```typescript
// app/test-auth/page.tsx
import { 
  getCurrentProfileWithRole, 
  isStaff, 
  isOwner 
} from "@/lib/auth-helpers"

export default async function TestAuth() {
  const profile = await getCurrentProfileWithRole()
  const staff = await isStaff()
  const owner = await isOwner()
  
  return (
    <div>
      <p>Role: {profile?.role}</p>
      <p>Status: {profile?.status}</p>
      <p>Is Staff: {staff ? "Yes" : "No"}</p>
      <p>Is Owner: {owner ? "Yes" : "No"}</p>
    </div>
  )
}
```

## Integration with Admin System

The auth helpers integrate seamlessly with the admin moderation system:

```typescript
// app/api/admin/posts/hide/route.ts
import { requireStaff } from "@/lib/auth-helpers"
import { prisma } from "@/lib/prisma"

export async function POST(req: Request) {
  // Automatically checks role and account status
  await requireStaff()
  
  const { postId, hide } = await req.json()
  
  await prisma.post.update({
    where: { id: postId },
    data: { isHidden: hide }
  })
  
  return NextResponse.json({ success: true })
}
```

## Cron Job Integration

The auto-unban also works with the cron job:

```typescript
// app/api/cron/auto-unban/route.ts
import { checkAndAutoUnbanUsers } from "@/lib/utils/moderation"

export async function GET() {
  // This also triggers auto-unban via the helper
  const result = await checkAndAutoUnbanUsers()
  return NextResponse.json(result)
}
```

## Error Handling

All functions handle errors gracefully:
- Return `null` if not authenticated
- Redirect to appropriate pages for banned/suspended users
- Log errors to console for debugging

## Best Practices

1. **Always use helpers in API routes** - Ensures consistent auth checks
2. **Use `requireStaff()` for admin pages** - Automatic redirects
3. **Check account status before critical operations** - Use `checkUserAccess()`
4. **Set `ASTROMATCH_OWNER_EMAIL`** - Essential for auto-promotion
5. **Test role changes** - Verify auto-promotion works as expected

## Common Patterns

### Admin-Only API Route
```typescript
import { requireStaff } from "@/lib/auth-helpers"

export async function POST(req: Request) {
  const profile = await requireStaff()
  // ... admin logic
}
```

### Owner-Only Feature
```typescript
import { requireOwner } from "@/lib/auth-helpers"

export async function GET() {
  const profile = await requireOwner()
  // ... owner-only logic
}
```

### Conditional UI
```typescript
import { isStaff } from "@/lib/auth-helpers"

export default async function Layout({ children }) {
  const showAdminNav = await isStaff()
  
  return (
    <>
      {showAdminNav && <AdminNavigation />}
      {children}
    </>
  )
}
```

### User Access Check
```typescript
import { checkUserAccess } from "@/lib/auth-helpers"

export default async function CreatePost() {
  const { canAccess, reason } = await checkUserAccess()
  
  if (!canAccess) {
    return <AccessDenied reason={reason} />
  }
  
  return <PostForm />
}
```

## Files Created
- `/lib/auth-helpers.ts` - Core auth functions
- `/app/account/banned/page.tsx` - Banned user page
- `/app/account/suspended/page.tsx` - Suspended user page
- `/app/api/admin/check-access/route.ts` - Updated to use helpers

