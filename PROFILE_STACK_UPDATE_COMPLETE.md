# Profile Stack Behavior Update - Complete

## Changes Made

### 1. Pass Expiry Changed: 28 Days → 7 Days ✅

**What Changed:**
- Swiped-left (passed) profiles now reappear in the user's stack after **7 days** instead of 28 days
- This gives users a second chance to see profiles they initially passed on

**Files Modified:**
- `lib/supabase/matchActions.ts` - Updated comment to reflect 7-day expiry
- `app/matches/page.tsx` - Updated console log from "28 days" to "7 days"
- `supabase/migrations/006_update_pass_expiry_7_days.sql` - Migration file (for reference)
- `supabase/manual_update_pass_default.sql` - SQL to update database default

**Database Changes Required:**
Run this SQL in your Supabase SQL Editor:
```sql
ALTER TABLE public.passes 
ALTER COLUMN expires_at SET DEFAULT NOW() + INTERVAL '7 days';
```

### 2. Chat Button No Longer Auto-Likes Profiles ✅

**What Changed:**
- Previously: Clicking the chat/message button automatically liked the profile AND opened chat
- **Now**: Clicking the chat button ONLY opens the chat window
- The profile **remains in the user's stack** until they explicitly swipe left or right
- This allows users to message someone without committing to a like

**User Flow:**
```
User A sees User B's profile
  ↓
User A clicks chat button
  ↓
Chat opens (NO auto-like)
  ↓
User A can message or just browse
  ↓
When User A returns to matches, User B's profile is STILL there
  ↓
User A must explicitly swipe left or right to remove from stack
```

**Files Modified:**
- `app/matches/page.tsx` - Removed automatic `likeProfile()` call when opening chat
- Profile now stays in stack until user swipes left (pass) or right (like)

### 3. Profile Stack Persistence Logic

**How It Works:**
1. **Opening Chat**: Profile stays in stack ✅
2. **Swipe Left (Pass)**: Profile hidden for 7 days, then reappears ✅
3. **Swipe Right (Like)**: Profile removed from stack (liked)
4. **Match Created**: Profile removed from stack (matched)

**Filter Logic:**
```javascript
// Profiles are filtered out if:
// 1. Already liked (swiped right)
// 2. Already passed AND pass hasn't expired (< 7 days)
// 3. Already matched
// 4. User has blocked or been blocked by the profile
```

## Testing Instructions

### Test 1: Chat Without Liking
1. Open AstroMatch on localhost:3000
2. Navigate to Matches page
3. View a profile (remember the name)
4. Click the chat/message button
5. Return to Matches page
6. ✅ **Expected**: Same profile should still be visible in stack

### Test 2: Pass Expiry (7 Days)
1. Swipe left (pass) on a profile
2. Note the profile disappears
3. Check database: `SELECT * FROM passes WHERE passer_id = 'YOUR_USER_ID'`
4. ✅ **Expected**: `expires_at` should be 7 days from `created_at`

### Test 3: Profile Reappears After 7 Days
1. Swipe left on a profile
2. Update the pass expiry to be in the past:
   ```sql
   UPDATE passes 
   SET expires_at = NOW() - INTERVAL '1 day' 
   WHERE passer_id = 'YOUR_USER_ID' 
   AND passed_id = 'PROFILE_ID';
   ```
3. Refresh the Matches page
4. ✅ **Expected**: Profile should reappear in stack

## Files Changed Summary

```
✓ lib/supabase/matchActions.ts
✓ app/matches/page.tsx
✓ supabase/migrations/006_update_pass_expiry_7_days.sql
✓ supabase/manual_update_pass_default.sql
✓ scripts/migrate-pass-expiry.js
```

## Database Migration Status

- ✅ Migration script created
- ✅ Migration logic tested
- ⚠️  Database default needs manual update (run `manual_update_pass_default.sql` in Supabase)
- ✅ No existing passes to update (0 found)

## User Impact

### Positive Changes:
1. ✅ **More flexible interaction**: Users can chat without commitment
2. ✅ **Second chances**: Passed profiles return after 1 week
3. ✅ **Better UX**: Profiles don't disappear unexpectedly
4. ✅ **Natural flow**: Explicit swipe actions required

### No Breaking Changes:
- Existing likes and matches are unaffected
- Pass filtering still works correctly
- Messages page functionality unchanged

## Next Steps

1. **Apply database migration**: Run `manual_update_pass_default.sql` in Supabase SQL Editor
2. **Test thoroughly**: Follow testing instructions above
3. **Monitor behavior**: Check console logs for "Opening chat without auto-liking"
4. **Verify pass expiry**: Check that passes show "hidden for 7 days" in console

## Rollback Plan (If Needed)

To revert to old behavior:

1. Change pass expiry back to 28 days:
```sql
ALTER TABLE public.passes 
ALTER COLUMN expires_at SET DEFAULT NOW() + INTERVAL '28 days';
```

2. Re-enable auto-like in `app/matches/page.tsx`:
```javascript
// Add back the likeProfile() call before router.push()
const likeResult = await likeProfile(currentUserId, String(currentProfile.id))
router.push(`/messages/${currentProfile.id}`)
```

---

**Implementation Date**: December 25, 2025
**Status**: ✅ Complete
**Tested**: Ready for user testing

