# Flash Animation Settings

This file contains backup configurations for the swipe flash animations (heart/X icons) on the Matches page.

## Currently Active: BUMBLE SETTINGS

## Quick Restore Instructions

To switch between settings:
1. Open `app/matches/page.tsx`
2. Find the "Bumble-Style Flash Animations" section (around line 1203)
3. Replace the code with either the Tinder or Bumble settings below

---

## TINDER SETTINGS (Original)

**Description:** Flash animations appear in the top corners of the card itself and stay visible throughout the entire swipe. They rotate with the card.

**Location:** Inside the card, counteracting rotation
- Like flash: Top left corner
- Pass flash: Top right corner

**Behavior:** 
- Appear immediately when swiping
- Stay visible until swipe completes
- Scale in with animation
- Fixed to the card (rotate with it)

**Code:**
```tsx
{/* TINDER-STYLE FLASH ANIMATIONS */}
{/* Like Flash - Top Left Corner */}
{showLikeFlash && (
  <div 
    className="absolute top-8 left-8 z-50 pointer-events-none"
    style={{
      transform: `rotate(${-15 - (swipeOffset * 0.03)}deg)`
    }}
  >
    <div style={{ animation: 'scaleIn 0.2s ease-out' }}>
      <svg 
        className="w-32 h-32" 
        viewBox="0 0 24 24" 
        fill="rgb(249, 115, 22)"
        style={{
          filter: 'drop-shadow(0 10px 30px rgba(249, 115, 22, 0.5))'
        }}
      >
        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
      </svg>
    </div>
  </div>
)}

{/* Pass Flash - Top Right Corner */}
{showPassFlash && (
  <div 
    className="absolute top-8 right-8 z-50 pointer-events-none"
    style={{
      transform: `rotate(${15 - (swipeOffset * 0.03)}deg)`
    }}
  >
    <div style={{ animation: 'scaleIn 0.2s ease-out' }}>
      <svg 
        className="w-32 h-32" 
        viewBox="0 0 24 24" 
        fill="none" 
        stroke="rgb(249, 115, 22)" 
        strokeWidth="3"
        style={{
          filter: 'drop-shadow(0 10px 30px rgba(249, 115, 22, 0.5))'
        }}
      >
        <path d="m18 6-12 12" />
        <path d="m6 6 12 12" />
      </svg>
    </div>
  </div>
)}
```

**Placement:** This code goes INSIDE the card div (after line 1100, before `<MatchProfileCard>`).

---

## BUMBLE SETTINGS (Current)

**Description:** Flash animations slide in from the screen edges (opposite to swipe direction), hold briefly, then retreat with the card. Fixed screen position regardless of touch location.

**Location:** Fixed on screen at 25% from top
- Like flash: Slides from RIGHT edge (opposite of right swipe)
- Pass flash: Slides from LEFT edge (opposite of left swipe)

**Behavior:**
- Phase 1 (0-120px): Slide in from edge
- Phase 2 (120-180px): Hold at max position
- Phase 3 (180px+): Retreat WITH the card (60px range - very fast)

**Positioning:**
- Heart: Comes to 58% from left (42% from right)
- X: Comes to 12% from left

**Code:**
```tsx
{/* BUMBLE-STYLE FLASH ANIMATIONS */}
{showLikeFlash && (() => {
  // Like flash: swiping right, so flash comes from RIGHT edge (opposite side)
  // Animation phases:
  // 0-120px: slide in from right edge
  // 120-180px: hold at max position (shorter hold)
  // 180px+: retreat WITH the card (starts earlier, very fast - 60px range)
  const maxPosition = windowWidth * 0.58
  const iconSize = 128 // w-28 = 7rem = 112px
  const startPosition = windowWidth + iconSize // Start completely off-screen right
  
  let currentX: number
  let opacity: number
  
  if (swipeOffset <= 120) {
    // Phase 1: Slide in (0-120px)
    const progress = Math.max(swipeOffset, 0) / 120
    currentX = startPosition - (progress * (startPosition - maxPosition))
    opacity = progress
  } else if (swipeOffset <= 180) {
    // Phase 2: Hold at max position (120-180px) - shorter
    currentX = maxPosition
    opacity = 1
  } else {
    // Phase 3: Retreat WITH the card (180px+, only 60px range - very fast)
    const retreatProgress = Math.min((swipeOffset - 180) / 60, 1)
    currentX = maxPosition + (retreatProgress * (startPosition - maxPosition))
    opacity = 1 - retreatProgress
  }
  
  return (
    <div 
      className="fixed z-50 pointer-events-none"
      style={{
        top: '25%',
        left: 0,
        transform: `translateX(${currentX}px)`,
        transition: isAnimating ? 'transform 0.7s ease-out, opacity 0.7s ease-out' : 'none',
        opacity: opacity,
      }}
    >
      <svg 
        className="w-28 h-28" 
        viewBox="0 0 24 24" 
        fill="rgb(249, 115, 22)"
        style={{
          filter: 'drop-shadow(0 10px 30px rgba(249, 115, 22, 0.5))',
        }}
      >
        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
      </svg>
    </div>
  )
})()}

{showPassFlash && (() => {
  // Pass flash: swiping left, so flash comes from LEFT edge (opposite side)
  // Animation phases:
  // 0-120px: slide in from left edge
  // 120-180px: hold at max position (shorter hold)
  // 180px+: retreat WITH the card (starts earlier, very fast - 60px range)
  const maxPosition = windowWidth * 0.12
  const iconSize = 128
  const startPosition = -iconSize // Start completely off-screen left
  
  let currentX: number
  let opacity: number
  
  if (swipeOffset >= -120) {
    // Phase 1: Slide in (0 to -120px)
    const progress = Math.max(-swipeOffset, 0) / 120
    currentX = startPosition + (progress * (maxPosition - startPosition))
    opacity = progress
  } else if (swipeOffset >= -180) {
    // Phase 2: Hold at max position (-120 to -180px) - shorter
    currentX = maxPosition
    opacity = 1
  } else {
    // Phase 3: Retreat WITH the card (-180px and beyond, only 60px range - very fast)
    const retreatProgress = Math.min((-swipeOffset - 180) / 60, 1)
    currentX = maxPosition - (retreatProgress * (maxPosition - startPosition))
    opacity = 1 - retreatProgress
  }
  
  return (
    <div 
      className="fixed z-50 pointer-events-none"
      style={{
        top: '25%',
        left: 0,
        transform: `translateX(${currentX}px)`,
        transition: isAnimating ? 'transform 0.7s ease-out, opacity 0.7s ease-out' : 'none',
        opacity: opacity,
      }}
    >
      <svg 
        className="w-32 h-32" 
        viewBox="0 0 24 24" 
        fill="none" 
        stroke="rgb(249, 115, 22)" 
        strokeWidth="3"
        style={{
          filter: 'drop-shadow(0 10px 30px rgba(249, 115, 22, 0.5))',
        }}
      >
        <path d="m18 6-12 12" />
        <path d="m6 6 12 12" />
      </svg>
    </div>
  )
})()}
```

**Placement:** This code goes AFTER the card container closes (after line 1183, before the "No profiles match" section).

**Required State:** Don't forget the `windowWidth` state is needed for Bumble settings:
```tsx
const [windowWidth, setWindowWidth] = useState<number>(typeof window !== 'undefined' ? window.innerWidth : 375)
```

And the resize effect:
```tsx
useEffect(() => {
  if (typeof window === 'undefined') return
  
  const updateWindowWidth = () => {
    setWindowWidth(window.innerWidth)
  }
  
  updateWindowWidth()
  window.addEventListener('resize', updateWindowWidth)
  
  return () => {
    window.removeEventListener('resize', updateWindowWidth)
  }
}, [])
```

---

## Comparison

| Feature | Tinder Settings | Bumble Settings |
|---------|----------------|-----------------|
| Position | Card corners | Screen edges |
| Movement | Rotates with card | Slides horizontally |
| Duration | Entire swipe | Quick peek & retreat |
| Location | Relative to card | Fixed on screen |
| Size | Heart: w-32 (128px)<br>X: w-32 (128px) | Heart: w-28 (112px)<br>X: w-32 (128px) |
| Entry direction | Same as swipe | Opposite to swipe |

---

## Notes

- The original Tinder settings are also saved as a comment backup in `app/matches/page.tsx` (lines 1101-1157)
- Both settings use the same state variables (`showLikeFlash`, `showPassFlash`)
- The Bumble settings require the `windowWidth` state and resize listener
- To restore Tinder settings, you can also just uncomment the backup and remove the Bumble code

---

**Last Updated:** Current session
**Active Setting:** Bumble

