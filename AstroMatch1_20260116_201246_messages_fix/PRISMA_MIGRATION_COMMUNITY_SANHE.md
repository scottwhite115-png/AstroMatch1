# Prisma Schema Update - Community Threads + San He Live Chat

## Summary

Extended the Prisma schema with:

### 1. **Community Thread Enhancements**
- Added `PostType` enum (STORY | QUESTION)
- Added `NotificationType` enum (POST_REPLY | COMMENT_REPLY)
- Enhanced `Post` model with:
  - `type` field (PostType)
  - `language` field (ISO code, optional)
  - `countryCode` field (ISO 2-letter, optional)
- Improved indexes for better query performance
- Added cascade deletes for data integrity

### 2. **San He Live Chat System**
- **SanHeHouse** enum: VISIONARIES, STRATEGISTS, ADVENTURERS, ARTISTS
- **ChatRegionScope** enum: NEAR_ME, COUNTRY, GLOBAL

#### Models:
- **SanHeRoom**: Chat "tables" within each house
  - Supports regional sharding (NEAR_ME/COUNTRY/GLOBAL)
  - Soft cap of 40 users per room (configurable)
  - Tracks active/inactive rooms
  
- **SanHeMessage**: Messages within rooms
  - Linked to room and author
  - Timestamped for ordering and cleanup
  
- **SanHePresence**: User presence tracking
  - One entry per user per room
  - Used for "currently online" count
  - Supports "switch table" feature

## Migration Instructions

### Option 1: Apply SQL Directly (Recommended for production)

```bash
# Connect to your Supabase database
psql "postgresql://[your-connection-string]"

# Run the migration SQL
\i prisma/migrations/add_community_threads_and_sanhe_chat.sql
```

### Option 2: Use Prisma Migrate (Development)

```bash
# Generate Prisma Client with new models
npx prisma generate

# If you have DATABASE_URL configured correctly:
npx prisma migrate dev --name add_community_threads_and_sanhe_chat
```

### Option 3: Via Supabase Dashboard

1. Go to Supabase Dashboard → SQL Editor
2. Copy contents of `prisma/migrations/add_community_threads_and_sanhe_chat.sql`
3. Paste and run

## After Migration

```bash
# Regenerate Prisma Client to get TypeScript types
npx prisma generate
```

## Schema Changes Summary

### Modified Models:
- `Post`: Added type, language, countryCode fields
- `Notification`: Changed type from String to enum
- `Comment`: Added author relation with cascade delete
- Improved indexes on Post and Notification

### New Models:
- `SanHeRoom` (4 houses × 3 regions × N countries = dynamic sharding)
- `SanHeMessage` (chat messages in rooms)
- `SanHePresence` (active user tracking)

### Enums Added:
- `PostType`
- `NotificationType`
- `SanHeHouse`
- `ChatRegionScope`

## San He House Mapping

```typescript
VISIONARIES  → Rat, Dragon, Monkey
STRATEGISTS  → Ox, Snake, Rooster
ADVENTURERS  → Tiger, Horse, Dog
ARTISTS      → Rabbit, Goat, Pig
```

## Usage Example

```typescript
import { prisma } from '@/lib/prisma'
import { SanHeHouse, ChatRegionScope } from '@prisma/client'

// Find or create a room for a user
async function joinSanHeRoom(userId: string, house: SanHeHouse, scope: ChatRegionScope) {
  // Find available room
  const room = await prisma.sanHeRoom.findFirst({
    where: {
      house,
      regionScope: scope,
      currentUsers: { lt: 40 },
      isActive: true
    }
  })
  
  // Create presence
  await prisma.sanHePresence.create({
    data: {
      roomId: room.id,
      userId,
      lastSeenAt: new Date()
    }
  })
  
  return room
}
```

## Notes

- Message history can be truncated via scheduled job (delete messages > N hours old)
- `currentUsers` is approximate; sync via presence records periodically
- Room creation is dynamic based on demand
- Users can visit any house, not just their own San He trine


