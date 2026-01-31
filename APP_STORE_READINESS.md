# Lunar – App Store Readiness Summary

## Fixes Applied (This Review)

### 1. **Account Deletion (Apple Guideline 5.1.1)**
- **Before:** Only cleared localStorage; user data stayed in Supabase
- **After:** New `/api/account/delete` route deletes the user from Supabase Auth (service role), which cascades to profiles and related data
- **Note:** Requires `SUPABASE_SERVICE_ROLE_KEY` in `.env.local`. If missing, users see an error and can contact support.

### 2. **Branding Updates**
- **Layout metadata:** Title/description updated to "Lunar"
- **Home page:** Loading text updated to "Lunar"
- **Noscript:** "AstroMatch" → "Lunar"
- **Manifest:** App name and description updated to Lunar
- **Delete confirmation:** "AstroHarmony" → "Lunar"

### 3. **Core Features Verified**
- **Auth:** Login, signup, forgot password
- **Profile:** Create/edit, photo upload
- **Connections:** Matches page, like/pass, chat
- **Messaging:** Send/receive, instant match creation, `send_message` RPC
- **Account:** Settings, privacy policy, terms, community guidelines

---

## Apple App Store Checklist

| Requirement | Status |
|-------------|--------|
| Account creation | ✅ |
| Account deletion (server-side) | ✅ |
| Privacy Policy | ✅ (Profile → Account) |
| Terms of Service | ✅ (Profile → Account) |
| Sign in with Apple | ⚠️ Optional (check if required for your app category) |
| No broken features | ✅ Build passes |
| App name consistent | ✅ Lunar |

---

## Supabase Setup Required

1. **Run SQL in Supabase Dashboard** (if not already done):
   - `supabase/RUN_THIS_IN_SUPABASE.sql` – Adds `allow_instant_messages_*`, `status`, `suspensionEndsAt`, `create_instant_match()`, `send_message()`

2. **Environment variables** (`.env.local`):
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY` – Needed for account deletion, backroom admin, and some moderation flows

---

## Known Notes

1. **Profile view Like button** (`/profile/view/[id]`): Uses test profile data; Like button does not call the API. Main Connections flow uses real profiles and has working like/pass/chat.
2. **Likes page**: Uses demo data. In production, consider wiring to real “incoming likes” from Supabase.
3. **Tarot/horoscope providers**: Some TODOs in lib for Prokerala integration; not required for core dating features.

---

## Testing Before Submit

- [ ] Sign up → complete profile → view Connections
- [ ] Like/pass profiles on Connections
- [ ] Chat with a match (or test profile with instant messaging)
- [ ] Unmatch, Report, Block from chat menu
- [ ] Profile → Account → Delete Account (type "DELETE")
- [ ] Ensure `SUPABASE_SERVICE_ROLE_KEY` is set for account deletion to work
