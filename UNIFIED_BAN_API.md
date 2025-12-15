# Unified Ban API Documentation

## Overview
Single API endpoint that handles all user moderation actions: 1-week suspension, permanent ban, and unban.

## Endpoint
```
POST /api/admin/users/ban-unified
```

## Request Body
```typescript
{
  userId: string      // Target user ID
  type: "ONE_WEEK" | "PERMANENT" | "UNBAN"
}
```

## Ban Types

### 1. ONE_WEEK
Temporarily suspends user for 7 days.
- Status: `SUSPENDED`
- `suspensionEndsAt`: 7 days from now
- Auto-unbans after period expires

**Example:**
```typescript
const response = await fetch('/api/admin/users/ban-unified', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    userId: 'user-123',
    type: 'ONE_WEEK'
  })
})
```

**Response:**
```json
{
  "ok": true,
  "message": "User suspended for 1 week (until 12/22/2025)",
  "profileId": "user-123",
  "displayName": "John Doe",
  "status": "SUSPENDED",
  "suspensionEndsAt": "2025-12-22T10:30:00.000Z"
}
```

### 2. PERMANENT
Permanently bans user.
- Status: `BANNED`
- `suspensionEndsAt`: `null`
- Requires manual unban

**Example:**
```typescript
const response = await fetch('/api/admin/users/ban-unified', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    userId: 'user-456',
    type: 'PERMANENT'
  })
})
```

**Response:**
```json
{
  "ok": true,
  "message": "User permanently banned",
  "profileId": "user-456",
  "displayName": "Jane Smith",
  "status": "BANNED",
  "suspensionEndsAt": null
}
```

### 3. UNBAN
Reactivates banned or suspended user.
- Status: `ACTIVE`
- `suspensionEndsAt`: `null`
- Immediate access restored

**Example:**
```typescript
const response = await fetch('/api/admin/users/ban-unified', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    userId: 'user-789',
    type: 'UNBAN'
  })
})
```

**Response:**
```json
{
  "ok": true,
  "message": "User unbanned and reactivated",
  "profileId": "user-789",
  "displayName": "Bob Johnson",
  "status": "ACTIVE",
  "suspensionEndsAt": null
}
```

## Safeguards

### 1. Self-Modification Prevention
Users cannot change their own status.

**Error Response:**
```json
{
  "error": "You cannot change your own status."
}
```
Status: `400`

### 2. OWNER Protection
Only OWNER can modify another OWNER account. ADMINs cannot.

**Error Response:**
```json
{
  "error": "You cannot modify the OWNER account."
}
```
Status: `403`

### 3. OWNER Ban Prevention
OWNER accounts cannot be banned or suspended (even by other OWNERs).

**Error Response:**
```json
{
  "error": "Cannot ban or suspend OWNER accounts."
}
```
Status: `403`

### 4. User Not Found
Target user must exist.

**Error Response:**
```json
{
  "error": "User not found"
}
```
Status: `404`

## Auto-Unban Logic

When a user with `type: "ONE_WEEK"` suspension expires:

1. User logs in or makes API call
2. `normalizeAccountStatus()` in auth helper checks `suspensionEndsAt`
3. If `suspensionEndsAt <= now`:
   - Status → `ACTIVE`
   - `suspensionEndsAt` → `null`
4. User can access app immediately

**Timeline Example:**
```
Dec 15: Admin suspends user (ONE_WEEK)
  - status: "SUSPENDED"
  - suspensionEndsAt: "2025-12-22"

Dec 22: User logs in
  - Auto-unban triggers
  - status: "ACTIVE"
  - suspensionEndsAt: null
```

## Usage in React Components

### Basic Example
```typescript
async function handleBanUser(userId: string, type: 'ONE_WEEK' | 'PERMANENT') {
  try {
    const res = await fetch('/api/admin/users/ban-unified', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId, type })
    })
    
    const data = await res.json()
    
    if (data.ok) {
      alert(data.message)
    } else {
      alert(data.error)
    }
  } catch (error) {
    console.error('Ban failed:', error)
  }
}
```

### Admin Panel Component
```typescript
'use client'

import { useState } from 'react'

export function UserModerationButtons({ userId, currentStatus }) {
  const [loading, setLoading] = useState(false)
  
  async function handleAction(type: 'ONE_WEEK' | 'PERMANENT' | 'UNBAN') {
    if (!confirm(`Are you sure you want to ${type} this user?`)) return
    
    setLoading(true)
    try {
      const res = await fetch('/api/admin/users/ban-unified', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, type })
      })
      
      const data = await res.json()
      
      if (data.ok) {
        alert(data.message)
        window.location.reload() // Refresh to show updated status
      } else {
        alert(data.error)
      }
    } catch (error) {
      alert('Action failed')
    } finally {
      setLoading(false)
    }
  }
  
  return (
    <div className="flex gap-2">
      {currentStatus === 'ACTIVE' && (
        <>
          <button
            onClick={() => handleAction('ONE_WEEK')}
            disabled={loading}
            className="px-3 py-1 bg-yellow-500 text-white rounded"
          >
            Suspend 1 Week
          </button>
          <button
            onClick={() => handleAction('PERMANENT')}
            disabled={loading}
            className="px-3 py-1 bg-red-500 text-white rounded"
          >
            Permanent Ban
          </button>
        </>
      )}
      
      {(currentStatus === 'SUSPENDED' || currentStatus === 'BANNED') && (
        <button
          onClick={() => handleAction('UNBAN')}
          disabled={loading}
          className="px-3 py-1 bg-green-500 text-white rounded"
        >
          Unban
        </button>
      )}
    </div>
  )
}
```

### Dropdown Selection
```typescript
export function BanTypeSelector({ userId, onComplete }) {
  const [banType, setBanType] = useState<'ONE_WEEK' | 'PERMANENT'>('ONE_WEEK')
  
  async function handleSubmit() {
    const res = await fetch('/api/admin/users/ban-unified', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId, type: banType })
    })
    
    const data = await res.json()
    if (data.ok) {
      onComplete(data)
    }
  }
  
  return (
    <div>
      <select 
        value={banType} 
        onChange={(e) => setBanType(e.target.value as any)}
        className="border rounded px-2 py-1"
      >
        <option value="ONE_WEEK">1 Week Suspension</option>
        <option value="PERMANENT">Permanent Ban</option>
      </select>
      
      <button onClick={handleSubmit} className="ml-2 px-4 py-1 bg-red-500 text-white rounded">
        Apply
      </button>
    </div>
  )
}
```

## Error Handling

All errors return appropriate HTTP status codes:

```typescript
try {
  const res = await fetch('/api/admin/users/ban-unified', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ userId, type })
  })
  
  if (!res.ok) {
    const error = await res.json()
    
    switch (res.status) {
      case 400:
        console.log('Bad request:', error.error)
        break
      case 403:
        console.log('Forbidden:', error.error)
        break
      case 404:
        console.log('User not found:', error.error)
        break
      default:
        console.log('Error:', error.error)
    }
  }
} catch (error) {
  console.error('Network error:', error)
}
```

## Comparison with Separate Endpoints

### Old Way (3 separate endpoints):
```typescript
// Suspend
POST /api/admin/users/suspend
{ userId, days: 7 }

// Ban
POST /api/admin/users/ban
{ userId, permanent: true }

// Unban
POST /api/admin/users/unban
{ userId }
```

### New Way (1 unified endpoint):
```typescript
// All actions
POST /api/admin/users/ban-unified
{ userId, type: "ONE_WEEK" | "PERMANENT" | "UNBAN" }
```

**Benefits:**
- ✅ Single endpoint to maintain
- ✅ Consistent request/response format
- ✅ Easier to document
- ✅ Type-safe with TypeScript
- ✅ All safeguards in one place

## Testing

### Test ONE_WEEK Suspension
```bash
curl -X POST http://localhost:3000/api/admin/users/ban-unified \
  -H "Content-Type: application/json" \
  -d '{"userId":"user-123","type":"ONE_WEEK"}'
```

### Test PERMANENT Ban
```bash
curl -X POST http://localhost:3000/api/admin/users/ban-unified \
  -H "Content-Type: application/json" \
  -d '{"userId":"user-456","type":"PERMANENT"}'
```

### Test UNBAN
```bash
curl -X POST http://localhost:3000/api/admin/users/ban-unified \
  -H "Content-Type: application/json" \
  -d '{"userId":"user-789","type":"UNBAN"}'
```

### Test Self-Modification (Should Fail)
```bash
# When logged in as user-123
curl -X POST http://localhost:3000/api/admin/users/ban-unified \
  -H "Content-Type: application/json" \
  -d '{"userId":"user-123","type":"ONE_WEEK"}'

# Expected: 400 - "You cannot change your own status."
```

### Test OWNER Protection (Should Fail)
```bash
# When logged in as ADMIN, trying to ban OWNER
curl -X POST http://localhost:3000/api/admin/users/ban-unified \
  -H "Content-Type: application/json" \
  -d '{"userId":"owner-id","type":"ONE_WEEK"}'

# Expected: 403 - "You cannot modify the OWNER account."
```

## Database Updates

The API updates these fields in the `profiles` table:

```sql
-- ONE_WEEK suspension
UPDATE profiles SET
  status = 'SUSPENDED',
  suspensionEndsAt = NOW() + INTERVAL '7 days'
WHERE id = 'user-id';

-- PERMANENT ban
UPDATE profiles SET
  status = 'BANNED',
  suspensionEndsAt = NULL
WHERE id = 'user-id';

-- UNBAN
UPDATE profiles SET
  status = 'ACTIVE',
  suspensionEndsAt = NULL
WHERE id = 'user-id';
```

## Integration with Auto-Unban

The `requireStaff()` helper automatically unbans users with expired suspensions:

```typescript
// User with expired suspension tries to access app
const profile = await getCurrentProfileWithRole()

// normalizeAccountStatus() checks:
if (profile.status === "SUSPENDED" && 
    profile.suspensionEndsAt <= new Date()) {
  // Auto-unban
  profile = await prisma.profiles.update({
    where: { id: profile.id },
    data: {
      status: "ACTIVE",
      suspensionEndsAt: null
    }
  })
}
```

## Migration Path

If using the old separate endpoints, you can migrate:

**Old:**
```typescript
await fetch('/api/admin/users/suspend', {
  method: 'POST',
  body: JSON.stringify({ userId, days: 7 })
})
```

**New:**
```typescript
await fetch('/api/admin/users/ban-unified', {
  method: 'POST',
  body: JSON.stringify({ userId, type: 'ONE_WEEK' })
})
```

Both endpoints can coexist during migration.

## Summary

- ✅ Single endpoint for all moderation actions
- ✅ Type-safe with TypeScript
- ✅ Multiple safeguards (self-modification, OWNER protection)
- ✅ Auto-unban after 1 week
- ✅ Clear error messages
- ✅ Works with auth helpers
- ✅ Easy to test
- ✅ Production-ready

**File:** `/app/api/admin/users/ban-unified/route.ts`

