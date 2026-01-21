# 🚀 Quick Start: Compatibility Blurbs

## One-Liner Usage

```tsx
import { useCompatibility } from "@/lib/hooks/useCompatibilityBlurbs"

const compat = useCompatibility("Aries", "Rat", "Taurus", "Ox")
// compat.score: 60
// compat.blurb: "Aries Rat × Taurus Ox: you click through easy give-and-take..."
// compat.tier: "Balanced"
```

## Copy-Paste Examples

### 1. Simple Profile Card

```tsx
import { useCompatibility } from "@/lib/hooks/useCompatibilityBlurbs"

function ProfileCard({ profile, userWest, userEast }) {
  const compat = useCompatibility(userWest, userEast, profile.western, profile.eastern)
  
  return (
    <div>
      <h3>{profile.name}</h3>
      <div>{compat.score}% Match</div>
      <p>{compat.blurb}</p>
    </div>
  )
}
```

### 2. Compatibility Section

```tsx
import { useCompatibility } from "@/lib/hooks/useCompatibilityBlurbs"
import { getCompatibilityTier } from "@/lib/compatibilityWithBlurbs"

function CompatibilitySection({ west1, east1, west2, east2 }) {
  const compat = useCompatibility(west1, east1, west2, east2)
  const tier = getCompatibilityTier(compat.score)
  
  return (
    <div className="bg-zinc-800/60 p-4 rounded-xl">
      <div className="flex justify-between mb-4">
        <h2>Compatibility</h2>
        <div className="text-2xl font-bold">{compat.score}%</div>
      </div>
      <div className={tier.color}>
        {tier.emoji} {tier.tier}
      </div>
      <p className="text-sm">{compat.blurb}</p>
    </div>
  )
}
```

### 3. Profile List with Batch Loading

```tsx
import { useBatchCompatibility } from "@/lib/hooks/useCompatibilityBlurbs"

function ProfileList({ profiles, userWest, userEast }) {
  const compatMap = useBatchCompatibility(
    userWest,
    userEast,
    profiles.map(p => ({ id: p.id, westernSign: p.west, easternSign: p.east }))
  )
  
  return profiles.map(profile => {
    const compat = compatMap.get(profile.id)
    return (
      <div key={profile.id}>
        <h3>{profile.name}</h3>
        {compat && <span>{compat.score}%</span>}
      </div>
    )
  })
}
```

## Test It

Visit: **http://localhost:3000/test-compatibility**

## Tier Reference

| Score | Tier | Color | Emoji |
|-------|------|-------|-------|
| 90+ | Exceptional | green | 🌟 |
| 80-89 | Highly Compatible | blue | ✨ |
| 70-79 | Balanced | yellow | ⚖️ |
| 60-69 | Challenging | orange | 🔥 |

## API Quick Ref

```tsx
// Hooks
useCompatibility(west1, east1, west2, east2) 
  → { score, blurb, tier, loading, error }

useBatchCompatibility(userWest, userEast, profiles)
  → Map<id, { score, blurb, tier }>

// Utils
getCompatibilityTier(score)
  → { tier, color, emoji }

getCompatibilityWithBlurb(west1, east1, west2, east2)
  → Promise<{ score, blurb, tier, source }>
```

## That's It! 🎉

Your compatibility system is ready to use!


