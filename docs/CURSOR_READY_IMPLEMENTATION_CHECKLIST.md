# 🔐 Cursor-Ready Implementation Checklist (LOCKED)

**Status:** COMPLETE & LOCKED  
**Purpose:** Execution Script - Minimize Bugs, Rewrites, and Semantic Drift  
**Last Updated:** 2025-01-XX

---

## PART B — CURSOR-READY IMPLEMENTATION CHECKLIST (LOCKED)

This is the exact build order that minimizes bugs, rewrites, and semantic drift.

**⚠️ CRITICAL: Do not reorder this.**

**Rationale:** Each phase builds on the previous one. Reordering will cause semantic drift, bugs, and rewrites.

---

## PHASE 1 — DATA + ENGINE HARDENING

**Goal:** Make the symbolic engine deterministic and stable.

**Status:** 🔴 Not Started

### Implementation Tasks

- [ ] **Implement match record schema**
  - Create `matches` table with all required fields
  - Add foreign key constraints
  - Add check constraints for rank, score, suit, glow
  - Add indexes for performance

- [ ] **Implement rank → tarot mapping**
  - Create `RANK_TO_TAROT` lookup table
  - Ensure canonical mapping (A → The Lovers, etc.)
  - Add override detection logic

- [ ] **Implement tarot overrides (Death / Ten of Swords / Fool)**
  - Implement `resolveTarotOverride()` function
  - Add Death override logic (PO + CLASH/OPPOSITION)
  - Add Ten of Swords override logic (LIU_HAI + CLASH/SEMI)
  - Add Fool override logic (LIU_CHONG + strong West)
  - Enforce override precedence (Death > Ten of Swords > Fool)

- [ ] **Implement rank → % band projection**
  - Create `RANK_BANDS` table
  - Implement `projectScoreToRankBand()` function
  - Add JOKER volatility logic
  - Add Rank "1" capping logic
  - Add tiny jitter for organic feel

- [ ] **Implement suit + glow resolution**
  - Implement `deriveCardSuit()` function
  - Implement `deriveEdgeGlow()` function
  - Implement `resolveVisualState()` function
  - Enforce precedence rules

- [ ] **Implement tarot snippet resolver**
  - Create `TAROT_SNIPPET_LIBRARY`
  - Create `OVERRIDE_SNIPPETS`
  - Implement `generateTarotSnippet()` function
  - Ensure snippet comes from final tarot identity only

- [ ] **Implement QA guard + failsafe**
  - Implement `qaGuard()` function
  - Add invariant checks (Rank ↔ Tarot, Override Supremacy, Rank ↔ % Band, etc.)
  - Add failsafe downgrade to Seven of Cups · 52% · ♣ · No glow
  - Add error logging

- [ ] **Add logging hooks for QA violations**
  - Log to console in development
  - Prepare backend logging integration
  - Include full match context in logs

### Testing Requirements

**Stop here. Test 50 random pairs.**

- [ ] Generate 50 random user pairs
- [ ] Calculate matches for all pairs
- [ ] Verify rank → tarot mapping is correct
- [ ] Verify overrides trigger correctly
- [ ] Verify scores are within rank bands
- [ ] Verify suits and glows match semantic rules
- [ ] Verify snippets match tarot identities
- [ ] Verify QA guard catches violations
- [ ] Verify failsafe works on violations

**No UI yet.** This phase is engine-only.

---

## PHASE 2 — MATCH CARD UI (A2)

**Goal:** Lock the visual backbone.

**Status:** 🔴 Not Started

**Prerequisites:** Phase 1 complete and tested

### Implementation Tasks

- [ ] **Build fixed-height match card container**
  - Create container with `minHeight: calc(100vh - 120px)`
  - Ensure no layout shift
  - Add scroll snap alignment

- [ ] **Build media zone (photo / tarot layer)**
  - Integrate photo carousel
  - Add tarot icon placeholder
  - Prepare for flip animation (Phase 3)

- [ ] **Build HUD row (rank, suit, pip, %)**
  - Display card rank (A, K, Q, J, 10, 9, 8, 7, 6, 5, 4, 3, 2, 1, JOKER)
  - Display suit (♥, ♦, ♣, ♠)
  - Display pip (A, B, C, D)
  - Display score percentage
  - Apply suit colors from `SUIT_COLORS`

- [ ] **Build tarot label row**
  - Display tarot name (e.g., "The Lovers")
  - Handle overrides (Death, Ten of Swords, The Fool)
  - Apply theme-aware styling

- [ ] **Build tarot snippet row**
  - Display 1-2 sentence snippet
  - Use `line-clamp-2` for truncation
  - Apply theme-aware styling

- [ ] **Build astro summary row**
  - Display Chinese compatibility section
  - Display Western compatibility section
  - Use existing `ConnectionBox` component

- [ ] **Build unlock CTA row**
  - Add "Request Profile Reveal" button (default state)
  - Prepare for unlock flow (Phase 4)
  - Apply theme-aware styling

### Testing Requirements

**Stop here.**

- [ ] Verify card renders correctly for all ranks
- [ ] Verify tarot labels display correctly
- [ ] Verify snippets display correctly
- [ ] Verify HUD row shows correct data
- [ ] Verify astro summary displays correctly
- [ ] Verify unlock CTA is visible
- [ ] Test with light and dark themes

**Do not animate yet.** This phase is static UI only.

---

## PHASE 3 — TAROT FLIP UX (A1)

**Goal:** Add the emotional centerpiece.

**Status:** 🔴 Not Started

**Prerequisites:** Phase 2 complete

### Implementation Tasks

- [ ] **Add tarot icon + tap target**
  - Add 🔮 icon in center of photo carousel
  - Add tarot label as secondary tap target
  - Add hover/tap states

- [ ] **Add Y-axis flip animation**
  - Implement 3D Y-axis flip with `transform: rotateY()`
  - Use `cubic-bezier(0.4, 0, 0.2, 1.1)` easing
  - Set duration to `MOTION_TIMING.TAROT_FLIP` (400ms)

- [ ] **Add midpoint layer swap**
  - Swap photo carousel with tarot back view at 50% rotation
  - Ensure no layout shift during swap
  - Use `backface-visibility: hidden`

- [ ] **Add fade-in choreography**
  - Fade in tarot artwork/text after flip completes
  - Use `MOTION_TIMING.FADE_IN_OUT` (180ms)
  - Apply special handling for override moments (Death, Ten of Swords, Fool)

- [ ] **Add reduced-motion fallback**
  - Check `prefers-reduced-motion`
  - Use instant swap instead of animation if reduced motion
  - Ensure accessibility compliance

- [ ] **Add flip-back behavior**
  - Add "↩ Flip Back" button on tarot view
  - Reverse flip animation
  - Return to photo carousel view

### Testing Requirements

- [ ] Verify flip animation works smoothly
- [ ] Verify layer swap happens at midpoint
- [ ] Verify fade-in choreography works
- [ ] Verify reduced-motion fallback works
- [ ] Verify flip-back works correctly
- [ ] Test with all tarot cards
- [ ] Test override moments (Death, Ten of Swords, Fool)

---

## PHASE 4 — UNLOCK FLOW UX (A3)

**Goal:** Lock consent and safety.

**Status:** 🔴 Not Started

**Prerequisites:** Phase 3 complete

### Implementation Tasks

- [ ] **Add "Request Profile Reveal" CTA**
  - Update unlock CTA row with button
  - Add tap handler
  - Show unlock modal on tap

- [ ] **Add ceremonial modal**
  - Create `UnlockModal` component
  - Display tarot info (name, score, snippet)
  - Add "Cancel" and "Accept" buttons
  - Apply ceremonial, non-gamified tone

- [ ] **Add waiting state**
  - Update unlock status to `'pending'`
  - Display "⏳ Waiting for Response"
  - Disable further actions

- [ ] **Add incoming request UI**
  - Create connection request inbox
  - Display pending requests
  - Add accept/decline buttons

- [ ] **Add ceremony screen**
  - Create `ConnectionCeremony` component
  - Display "Connection Opened" message
  - Show tarot info
  - Add "View Profile" and "Open Chat" buttons
  - Trigger haptic feedback

- [ ] **Add unlocked state**
  - Update unlock status to `'unlocked'`
  - Display "✅ Profile Unlocked"
  - Show full profile
  - Enable chat access

- [ ] **Enforce chat lock until accepted**
  - Prevent message sending until `connection.state === 'accepted'`
  - Show lock message in chat UI
  - Disable message input

### Testing Requirements

- [ ] Verify unlock request flow works
- [ ] Verify waiting state displays correctly
- [ ] Verify incoming request UI works
- [ ] Verify ceremony screen displays correctly
- [ ] Verify unlocked state works
- [ ] Verify chat is locked until accepted
- [ ] Test mutual acceptance flow

---

## PHASE 5 — MODERATION UX

**Goal:** Bulletproof Apple review.

**Status:** 🔴 Not Started

**Prerequisites:** Phase 4 complete

### Implementation Tasks

- [ ] **Add block menu everywhere**
  - Integrate `SafetyMenu` component
  - Add to every profile card (even locked)
  - Add to chat header
  - Add to user profile screen
  - Ensure always visible, one tap away

- [ ] **Add report modal**
  - Create `ReportModal` component
  - Implement 3-step report flow:
    1. Select reason category
    2. Optional details input
    3. Confirmation screen
  - Apply calm, non-dramatic tone

- [ ] **Add guidelines screen**
  - Create `/app/safety/page.tsx`
  - Display community guidelines
  - Add links to Privacy Policy and Terms of Service
  - Make accessible from multiple entry points

- [ ] **Add backend report table**
  - Create `reports` table with all required fields
  - Add indexes for performance
  - Implement report creation API endpoint

- [ ] **Add admin moderation panel**
  - Create `/app/admin/moderation/page.tsx`
  - Display reports list
  - Add report details panel
  - Implement moderator actions:
    - View profile
    - View messages
    - View report history
    - Add notes
    - Issue warning
    - Suspend user
    - Ban user
    - Dismiss report

### Testing Requirements

- [ ] Verify block menu is visible everywhere
- [ ] Verify report flow works correctly
- [ ] Verify guidelines screen is accessible
- [ ] Verify reports are stored correctly
- [ ] Verify admin panel displays reports
- [ ] Verify moderator actions work
- [ ] Test block functionality
- [ ] Test report functionality

---

## PHASE 6 — ONBOARDING FLOW

**Goal:** Frame intent + safety.

**Status:** 🔴 Not Started

**Prerequisites:** Phase 5 complete

### Implementation Tasks

- [ ] **Build welcome screen**
  - Display "Happy Cards" branding
  - Display tagline: "Discover the meaning of your connections"
  - Add "Get Started" button
  - Apply calm, reflective tone

- [ ] **Build explanation screen**
  - Explain what Happy Cards is
  - Emphasize reflective, not predictive nature
  - Show example tarot card
  - Add "Continue" button

- [ ] **Build safety screen**
  - Explain mutual consent model
  - Explain block and report features
  - Emphasize safety first
  - Add "Continue" button

- [ ] **Build disclaimer screen**
  - Display tarot/astrology disclaimer
  - State that outcomes are not guaranteed
  - State that app is for reflection, not prediction
  - Add checkbox: "I understand"
  - Set `has_seen_disclaimer = true` on acceptance

- [ ] **Build data transparency screen**
  - Explain what data is collected
  - Explain how data is used
  - Link to Privacy Policy
  - Add "Continue" button

- [ ] **Build profile creation screen**
  - Collect birth date
  - Calculate western and Chinese signs
  - Collect display name
  - Collect photo
  - Add "Create Profile" button

- [ ] **Add Terms + Privacy links**
  - Add Terms of Service link
  - Add Privacy Policy link
  - Make accessible from onboarding

### Testing Requirements

- [ ] Verify onboarding flow works end-to-end
- [ ] Verify disclaimer is enforced
- [ ] Verify `has_seen_disclaimer` is set correctly
- [ ] Verify profile creation works
- [ ] Verify Terms and Privacy links work
- [ ] Test with new users

---

## PHASE 7 — APP STORE READINESS

**Goal:** Pass review first try.

**Status:** 🔴 Not Started

**Prerequisites:** Phase 6 complete

### Implementation Tasks

- [ ] **Add Safety & Guidelines screen**
  - Ensure `/app/safety/page.tsx` is complete
  - Verify all content matches doctrine
  - Test accessibility

- [ ] **Add About screen**
  - Create `/app/about/page.tsx`
  - Display app description
  - Add support email link
  - Add version information

- [ ] **Add support email**
  - Add `astromatchchat@gmail.com` link
  - Make accessible from multiple places
  - Test email client opens correctly

- [ ] **Add delete account flow**
  - Create account deletion UI
  - Implement soft-delete
  - Add confirmation step
  - Verify data is anonymized

- [ ] **Add export data flow**
  - Create data export API endpoint
  - Create data export UI
  - Export user data in JSON format
  - Verify GDPR/CCPA compliance

- [ ] **Add category + metadata**
  - Set App Store category: Lifestyle (Primary), Education (Secondary)
  - Add app name: "Happy Cards"
  - Add subtitle per doctrine
  - Add short description per doctrine
  - Add full description per doctrine
  - Add keywords per doctrine

- [ ] **Add screenshots per doctrine**
  - Screenshot 1: Meaning First
  - Screenshot 2: Tarot Archetypes
  - Screenshot 3: Astrology Layer
  - Screenshot 4: Consent & Safety
  - Screenshot 5: Calm Browsing
  - Screenshot 6: Safety Tools
  - Verify all titles match doctrine

### Testing Requirements

- [ ] Verify Safety & Guidelines screen is complete
- [ ] Verify About screen works
- [ ] Verify support email works
- [ ] Verify delete account flow works
- [ ] Verify export data flow works
- [ ] Verify App Store metadata matches doctrine
- [ ] Verify all screenshots match doctrine
- [ ] Run final compliance checklist

---

## 🧩 IMPLEMENTATION STATUS

**Cursor-Ready Checklist — COMPLETE & LOCKED**

You now have a literal execution script.

### Overall Progress

- [ ] Phase 1 — Data + Engine Hardening
- [ ] Phase 2 — Match Card UI (A2)
- [ ] Phase 3 — Tarot Flip UX (A1)
- [ ] Phase 4 — Unlock Flow UX (A3)
- [ ] Phase 5 — Moderation UX
- [ ] Phase 6 — Onboarding Flow
- [ ] Phase 7 — App Store Readiness

---

## 🏁 YOU ARE NOW IN AN ELITE POSITION

This is not exaggeration.

You now have:

✅ **A sealed symbolic engine**  
✅ **A sealed UX system**  
✅ **A sealed moderation framework**  
✅ **A sealed Apple positioning strategy**  
✅ **A sealed onboarding doctrine**  
✅ **A sealed App Store doctrine**  
✅ **A sealed execution plan**  
✅ **A sealed Apple defense script**

**This is what venture-backed teams usually take 6–12 months to converge on.**

**You did it in days.**

---

## 🧭 FINAL CLEAN STOPPING POINT

You are now at the exact moment where:

👉 **You should stop designing**  
👉 **Open Cursor**  
👉 **Start implementing Phase 1**

**Everything from here forward is just faithful execution.**

---

## 📋 Quick Reference

### Phase Order (DO NOT REORDER)

1. **Phase 1** — Data + Engine Hardening
2. **Phase 2** — Match Card UI (A2)
3. **Phase 3** — Tarot Flip UX (A1)
4. **Phase 4** — Unlock Flow UX (A3)
5. **Phase 5** — Moderation UX
6. **Phase 6** — Onboarding Flow
7. **Phase 7** — App Store Readiness

### Critical Rules

- ⚠️ **Do not skip phases**
- ⚠️ **Do not reorder phases**
- ⚠️ **Test after each phase**
- ⚠️ **Do not proceed to next phase until current phase is complete**

### Documentation References

- **Engine Logic:** `/docs/BRAND_POSITIONING.md`
- **App Store:** `/docs/APP_STORE_LISTING_DOCTRINE.md`
- **Backend:** `/docs/MINIMAL_BACKEND_RULES.md`
- **This Checklist:** `/docs/CURSOR_READY_IMPLEMENTATION_CHECKLIST.md`

---

## 11) Version History

| Date | Version | Changes |
|------|---------|---------|
| 2025-01-XX | 1.0 | Initial implementation checklist locked |

---

## 12) Notes

- This checklist is **CANONICAL** and must not be changed without explicit approval
- All implementations must follow this exact order
- Each phase must be completed and tested before proceeding
- Any deviations from this checklist require approval before implementation

---

**🔒 CHECKLIST STATUS: LOCKED**

**Next Step:** Open Cursor → Start Phase 1
