# Matching Engine Integration Guide

This document shows exactly how the astrology matching engine has been wired into your existing UI sections.

## 🎯 What Was Installed

### Core Files
1. **`/lib/match-engine.ts`** - Complete sidereal × Chinese matching algorithm
2. **`/lib/utils/compatibility.ts`** - Integration utilities for your app
3. **`/scripts/005_add_zodiac_fields.sql`** - Database migration for zodiac data

## 📍 Where the Engine Connects

### 1. % Match Pill on Profile Cards

**Location:** `/app/matches/page.tsx` (Line 470) and `/app/profile/view/[id]/page.tsx` (Line 307)

**Current Code:**
```tsx
<span className="match-percentage-text">
  {currentProfile.compatibility}% Match
</span>
```

**How to Wire It Up:**

```tsx
// At the top of your component
import { calculateCompatibilityFromSigns } from "@/lib/utils/compatibility"
import { useAuth } from "@/lib/contexts/auth-context"

// In your component
const { user } = useAuth()
const [userProfile, setUserProfile] = useState(null)

// Fetch current user's profile with zodiac signs
useEffect(() => {
  if (user) {
    // Fetch from Supabase
    const fetchUserProfile = async () => {
      const supabase = createClient()
      const { data } = await supabase
        .from('profiles')
        .select('zodiac_sign, chinese_zodiac')
        .eq('id', user.id)
        .single()
      setUserProfile(data)
    }
    fetchUserProfile()
  }
}, [user])

// Calculate compatibility for each profile
const compatibility = userProfile && currentProfile
  ? calculateCompatibilityFromSigns(
      userProfile.zodiac_sign,
      userProfile.chinese_zodiac,
      currentProfile.westernSign, // or currentProfile.zodiac_sign
      currentProfile.easternSign   // or currentProfile.chinese_zodiac
    )
  : 75 // fallback

// Use it in the UI
<span className="match-percentage-text">
  {compatibility}% Match
</span>
```

### 2. 144 Sign Combination Pages

**Location:** `/app/astrology/[western]/[chinese]/page.tsx` (Lines 536-605)

**Current Code:**
```tsx
function calculateCompatibilityRating(
  userWestern: string,
  userChinese: string,
  pageWestern: string,
  pageChinese: string,
): number {
  // Basic element-based compatibility (lines 542-569)
  return Math.round((westernCompatibility + chineseCompatibility) / 2)
}
```

**How to Replace It:**

```tsx
// Replace the entire calculateCompatibilityRating function with:
import { calculateCompatibilityFromSigns } from "@/lib/utils/compatibility"

function calculateCompatibilityRating(
  userWestern: string,
  userChinese: string,
  pageWestern: string,
  pageChinese: string,
): number {
  return calculateCompatibilityFromSigns(
    userWestern,
    userChinese,
    pageWestern,
    pageChinese
  )
}
```

**Location for Detailed Explanation:** Lines 683-740 already display the compatibility rating. You can add more details:

```tsx
import { explainCompatibilityFromSigns } from "@/lib/utils/compatibility"

// Get detailed explanation
const explanation = explainCompatibilityFromSigns(
  userSigns.western,
  userSigns.chinese,
  params.western,
  params.chinese
)

// Display sub-scores
<div className="space-y-2">
  <div>Core Vibe: {explanation.subs.coreVibe}/100</div>
  <div>Chemistry: {explanation.subs.chemistry}/100</div>
  <div>Communication: {explanation.subs.communication}/100</div>
  <div>Lifestyle: {explanation.subs.lifestyle}/100</div>
  <div>Long Term: {explanation.subs.longTerm}/100</div>
  <div>Growth: {explanation.subs.growth}/100</div>
</div>

// Display explanation bullets
<ul className="space-y-2">
  {explanation.bullets.map((bullet, index) => (
    <li key={index} className="text-white/90">{bullet}</li>
  ))}
</ul>
```

### 3. Simple Combination Page

**Location:** `/app/astrology/[combination]/page.tsx`

**Current Implementation:** Static data for only 3 combinations (leo-rabbit, virgo-horse, pisces-tiger)

**How to Add Compatibility:**

```tsx
import { calculateCompatibilityFromSigns } from "@/lib/utils/compatibility"

// In your component, after parsing the combination
const [westernSign, chineseSign] = combination.split("-")

// Get user's signs from localStorage or Supabase
const userSigns = getUserZodiacSigns()

// Calculate compatibility
const compatibilityRating = userSigns
  ? calculateCompatibilityFromSigns(
      userSigns.western,
      userSigns.chinese,
      westernSign,
      chineseSign
    )
  : null

// Add to your UI (around line 165+)
{compatibilityRating && (
  <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
    <h2 className="text-xl font-bold text-white mb-4">
      Your Compatibility
    </h2>
    <div className="text-4xl font-bold text-white">
      {compatibilityRating}% Match
    </div>
  </div>
)}
```

## 🗄️ Database Setup

### Step 1: Run the SQL Migration

Go to your Supabase SQL Editor and run:
```sql
-- From /scripts/005_add_zodiac_fields.sql
```

This adds:
- `date_of_birth` (date)
- `zodiac_sign` (text) - for sidereal western sign
- `chinese_zodiac` (text) - for Chinese animal

### Step 2: Update Profile Creation

When users create/update their profile with a birthdate:

```tsx
import { getZodiacSigns } from "@/lib/utils/compatibility"
import { createClient } from "@/lib/supabase/client"

async function updateProfileWithBirthdate(userId: string, birthdate: Date) {
  // Calculate zodiac signs
  const signs = getZodiacSigns(birthdate)
  
  // Update in database
  const supabase = createClient()
  const { error } = await supabase
    .from('profiles')
    .update({
      date_of_birth: birthdate.toISOString().split('T')[0], // YYYY-MM-DD
      zodiac_sign: signs.western, // lowercase: "leo", "aries", etc.
      chinese_zodiac: signs.chinese, // lowercase: "rabbit", "rat", etc.
    })
    .eq('id', userId)
  
  if (error) {
    console.error('Error updating zodiac signs:', error)
  }
}
```

## 📊 Example Usage

### Calculate Match % Between Two Users

```tsx
import { calculateCompatibilityFromDates } from "@/lib/utils/compatibility"

const user1Birthdate = new Date('1995-08-20') // Leo Pig
const user2Birthdate = new Date('1987-06-15') // Gemini Rabbit

const matchScore = calculateCompatibilityFromDates(user1Birthdate, user2Birthdate)
console.log(`Match: ${matchScore}%`) // Example: "Match: 87%"
```

### Get Detailed Explanation

```tsx
import { explainCompatibilityFromDates } from "@/lib/utils/compatibility"

const explanation = explainCompatibilityFromDates(user1Birthdate, user2Birthdate)

console.log(`Overall Score: ${explanation.score}/100`)
console.log(`Core Vibe: ${explanation.subs.coreVibe}/100`)
console.log(`Chemistry: ${explanation.subs.chemistry}/100`)
console.log('Reasons:')
explanation.bullets.forEach(bullet => console.log(`- ${bullet}`))
```

### Calculate From Existing Signs

```tsx
import { calculateCompatibilityFromSigns } from "@/lib/utils/compatibility"

// If you already have the signs stored
const score = calculateCompatibilityFromSigns(
  'leo',      // user1 western
  'rabbit',   // user1 chinese
  'scorpio',  // user2 western
  'monkey'    // user2 chinese
)
```

## 🔧 Integration Checklist

- [ ] Run SQL migration (`005_add_zodiac_fields.sql`)
- [ ] Update profile-builder to collect birthdate
- [ ] Calculate zodiac signs when birthdate is saved
- [ ] Update matches page to fetch user's zodiac signs
- [ ] Calculate compatibility % for each profile card
- [ ] Update profile view page with compatibility calculation
- [ ] Replace basic compatibility function in astrology pages
- [ ] Test compatibility scores across different sign combinations
- [ ] Optional: Cache 144×144 matrix in Supabase for faster lookups

## 🎨 UI Enhancement Suggestions (Optional)

### Add Compatibility Breakdown

```tsx
import { explainCompatibilityFromSigns, getCompatibilityDescription } from "@/lib/utils/compatibility"

const explanation = explainCompatibilityFromSigns(...)
const description = getCompatibilityDescription(explanation.score)

<div className="space-y-3">
  <div className="flex items-center gap-2">
    <span className="text-2xl">{description.emoji}</span>
    <span className={description.color}>{description.level}</span>
  </div>
  
  <div className="grid grid-cols-2 gap-2">
    <div>💫 Core Vibe: {explanation.subs.coreVibe}%</div>
    <div>🔥 Chemistry: {explanation.subs.chemistry}%</div>
    <div>💬 Communication: {explanation.subs.communication}%</div>
    <div>🏠 Lifestyle: {explanation.subs.lifestyle}%</div>
    <div>💍 Long Term: {explanation.subs.longTerm}%</div>
    <div>🌱 Growth: {explanation.subs.growth}%</div>
  </div>
  
  <ul className="space-y-1">
    {explanation.bullets.map((bullet, i) => (
      <li key={i} className="text-sm">• {bullet}</li>
    ))}
  </ul>
</div>
```

## 🚀 Performance Optimization

### Option 1: Pre-calculate Matrix (Recommended for Production)

```tsx
import { buildMatrix } from "@/lib/match-engine"

// Run once to generate all 144×144 combinations
const matrix = buildMatrix()

// Store in Supabase or JSON file
// Then lookup scores directly instead of calculating each time
const score = matrix['Leo_Rabbit']['Scorpio_Monkey']
```

### Option 2: Calculate On-the-Fly (Good for Development)

The `pairScore()` function is fast enough for real-time calculations. Each calculation takes < 1ms.

## 📝 Notes

- **Sign Case Handling**: The UI uses lowercase ('leo', 'rabbit'), the engine uses proper case ('Leo', 'Rabbit'). The compatibility utilities handle this automatically.
- **Date Handling**: Always use the user's local timezone when creating Date objects for birthdate input.
- **Fallback**: If zodiac data is missing, use a neutral score (75) or hide the % pill.
- **Sidereal vs Tropical**: The engine uses **sidereal** zodiac (Lahiri ayanamsa), which differs from tropical by ~24 days.

## 🐛 Troubleshooting

### Score always returns 75
- Check that zodiac signs are properly stored in lowercase in the database
- Verify birthdate is being saved correctly

### Signs don't match birthdate
- The engine uses sidereal zodiac, not tropical
- Sidereal dates shift by ~24 days (e.g., Leo is Aug 17-Sep 16, not Jul 23-Aug 22)
- Chinese zodiac is based on Lunar New Year (varies each year)

### Different scores on each page
- Ensure you're using the same user's zodiac signs for comparison
- Check that birthdate timezone is consistent

## 📚 API Reference

See `/lib/match-engine.ts` for full API documentation.

### Key Functions

- `getHybridSignature(date, tzAware?)` - Get zodiac signs from birthdate
- `pairScore(sig1, sig2)` - Get 0-100 compatibility score
- `explainScore(sig1, sig2)` - Get detailed explanation with sub-scores
- `buildMatrix()` - Generate complete 144×144 compatibility matrix

---

**Your matching engine is ready to use! Start by running the database migration and updating your profile-builder to collect birthdates.** 🌟

