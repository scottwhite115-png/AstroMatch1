# AstroMatch — Task Master Plan (from PRD.md)

## 0. Global setup
- Read docs/PRD.md as source of truth.
- Stack: React + TypeScript + Tailwind. Supabase for Auth + DB + Realtime.
- Add routing (react-router or expo-router if RN).

### Acceptance
- App boots with a minimal shell.
- Tailwind working.
- Type-safe TS config.

---

## 1) Authentication (Google, Facebook, Apple, Email)
**Goal:** Nice login screen; session persistence.

**Steps**
- Install Supabase client; set env vars:
  - VITE_SUPABASE_URL / NEXT_PUBLIC_SUPABASE_URL
  - VITE_SUPABASE_ANON_KEY / NEXT_PUBLIC_SUPABASE_ANON_KEY
- Build `/auth/login` screen with 4 buttons:
  - Google, Facebook, Apple, Email magic link.
- Implement `/auth/callback` route.
- On first login, route to Profile Setup.

**Acceptance**
- Each provider launches flow and returns session.
- Email magic link works.
- Session persists after refresh.

---

## 2) Onboarding & East–West sign assignment
**Goal:** Roller birthdate picker; assign West + Chinese sign; save profile basics.

**Steps**
- Build `/setup` with fields: name, gender, sexual orientation, birthdate (roller), city (opt), photo grid (up to 6).
- Implement sign assignment helpers:
  - `getWesternSign(date)`; `getChineseSign(year)`
  - `getEastWestCombo(date)`
- On save, persist profile in DB and cache in LocalStorage.

**Acceptance**
- Roller picker works.
- On save, profile has `westSign`, `eastAnimal`.

---

## 3) Matching Engine (scaffold)
**Goal:** Engine exists; reads matrix; returns % (Discovery shows % only).

**Files**
- `src/lib/compatibility/engine.ts`
- `src/lib/compatibility/matrix.json` (placeholder {})

**Code (paste and complete later)**
- `getWesternSign`, `getChineseSign`, `getEastWestCombo`
- `getCompatibility(userA: Date, userB: Date): number`
- `rankMatches(viewerBirthdate, candidates[])`

**Acceptance**
- With a small dummy matrix, `rankMatches` orders candidates by % descending.
- Discovery cards receive a numeric `compatibility` prop.

---

## 4) Discovery (Potential Matches)
**Goal:** Swipe/Tap UI; overlays per photo; pass=4-week cooldown; like=mutual→match.

**Steps**
- Build `/discovery`:
  - Card stack with photo carousel:
    - Tap left/right to change photos
    - Swipe right=Like; Swipe left=Pass
  - Overlay content by photo index:
    - Photo 1: Name • East–West signs • Compatibility %
    - Photo 2: Job title • City • Profession • Relationship goals
    - Photo 3: Hobbies & Interests
    - Photo 4: Favorite foods
    - Photo 5: Favorite music
    - Photo 6: Have/want children
- Implement 4-week reappearance for passes (store per-user cooldown timestamps).

**Acceptance**
- Cards swipe and advance correctly.
- Overlays change with photo index.
- Passed user reappears after mocked 4-week offset.

---

## 5) Likes → Matches
**Goal:** Mutual likes form a match; moves to Matches tab.

**Steps**
- Likes list: show inbound likes; user can Like or Pass.
- On mutual like: create `match` record (stable ID) and hide from each other’s Discovery (others still see them).

**Acceptance**
- Mutual like creates single match, visible to both in Matches.
- Non-mutual remains in Likes.

---

## 6) Matches & Chat (frontend + backend)
**Goal:** Matches list; private chat with photo header; realtime messages.

**Steps**
- DB tables or Firestore collections:
  - `matches`: id, participants[], createdAt, updatedAt
  - `messages`: id, chatId, senderId, content, sentAt, seenBy[]
- Matches screen: list cards (first photo + name + East–West).
- Chat screen:
  - Header shows first photo; tabs Chat | Profile
  - Settings menu: notifications toggle (stub), We Met (stub), Hide, Unmatch, Report
- Realtime: subscribe to messages per chat.

**Acceptance**
- Sending messages updates both clients live.
- Unmatch closes chat and starts 7-day cooldown before re-surfacing in Discovery for the leaver.

---

## 7) Astrology section
**Goal:** Western / Chinese buttons with thin outline; calendar boxes; lists; Vedic section; 144 combos table.

**Steps**
- `/astrology`:
  - Top buttons: Western | Chinese (outlined)
- Western page:
  - Calendar box (signs + date ranges)
  - 12-sign list (buttons → detail pages with deep descriptions)
  - Elements: Fire, Air, Earth, Water (detailed)
- Chinese page:
  - Calendar box (CNY ranges 1940–2040 → animal)
  - 12-animal list (buttons → detail pages with deep descriptions)
  - Elements: Wood, Fire, Earth, Metal, Water
- Combination table (144):
  - Each combo detail page: Personality, Love, Profession, Compatibility explanation, **Compatibility % included here**
- Vedic subsection:
  - Overview + horizontal scroll (Sidereal, Mahadasha, Antardashas, Nakshatras, Compatibility Calculator [UI scaffold only])
- Daily Insights:
  - Top banner: user’s Western Sun sign + Chinese animal insight (placeholder generator)

**Acceptance**
- Western/Chinese pages share matching layout (outlined boxes equal size).
- Each sign/animal button routes to a detail page.
- Combo detail includes % and long-form text.
- Vedic calculator form renders; no real calc yet.

---

## 8) Profile (Edit / Preview) + Settings
**Goal:** Combined tab; stylish white-first; dark mode toggle.

**Fields**
- Name
- East–West signs (display, read-only)
- City
- Profession / Job title
- Relationship goals
- Hobbies & interests
- Favorite foods
- Favorite music
- Do you have or want children
- Photos (6, reorder)

**Settings**
- Account (email/phone/logout)
- Notifications (stub)
- Privacy & Safety (block/unmatch list)
- Legal (links)
- Appearance: Light/Dark (persist LocalStorage)

**Acceptance**
- Edit autosaves; Preview mirrors.
- Dark mode toggle persists and applies immediately.

---

## 9) Geolocation & Preferences
**Goal:** Save location on app open; filter by distance/age/gender; rank by compatibility.

**Steps**
- Store `{ lat, lng, updatedAt }` in LocalStorage on load (permission-aware).
- `match_prefs`: gender(s), age range, distance_km.
- Discovery query: filter by prefs + cooldowns; sort by compatibility %.

**Acceptance**
- Changing prefs updates Discovery feed.
- Distance filter uses haversine.

---

## 10) Polish & QA
- Empty states
- Error toasts
- Accessibility: 44px touch targets, aria labels
- Performance: lazy image loading
- Basic SEO (meta) if web

**Acceptance**
- No console errors.
- LCP acceptable on mid device.
