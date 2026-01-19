# Quick Reference: Profile Stack Behavior Changes

## ✅ IMPLEMENTED CHANGES

### 1. Chat Button Behavior
**BEFORE:**
```
User clicks chat → Auto-likes profile → Profile disappears from stack → Opens chat
```

**AFTER:**
```
User clicks chat → Opens chat → Profile STAYS in stack until swiped
```

### 2. Pass (Swipe Left) Duration
**BEFORE:**
```
Swipe left → Hidden for 28 days
```

**AFTER:**
```
Swipe left → Hidden for 7 days → Reappears in stack
```

---

## 🎯 USER EXPERIENCE

### Scenario 1: Browse then decide
1. User A sees User B's profile
2. User A clicks chat to see if they vibe
3. User A browses the chat or sends a test message
4. User A backs out to matches
5. **User B's profile is STILL there** ✅
6. User A can now decide: Swipe left (pass) or Swipe right (like)

### Scenario 2: Second chances
1. User swipes left (pass) on Monday
2. Profile disappears from stack
3. **Next Monday** (7 days later)
4. Profile reappears in stack ✅
5. User can swipe left again or change their mind and swipe right

---

## 🔧 TO COMPLETE SETUP

Run this SQL in Supabase Dashboard → SQL Editor:

```sql
ALTER TABLE public.passes 
ALTER COLUMN expires_at SET DEFAULT NOW() + INTERVAL '7 days';
```

---

## 📝 CODE LOCATIONS

**Chat button logic:**
`app/matches/page.tsx` - Line ~2690

**Pass function:**
`lib/supabase/matchActions.ts` - Line ~88

**Migration SQL:**
`supabase/manual_update_pass_default.sql`

---

## ✅ VERIFICATION

Check browser console for these messages:

**When opening chat:**
```
[Matches] Opening chat without auto-liking. Profile stays in stack.
```

**When swiping left:**
```
✓ Pass saved (hidden for 7 days)
```

---

**Status**: Implementation complete, ready for testing
**Date**: December 25, 2025

