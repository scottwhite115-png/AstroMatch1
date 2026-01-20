# Card Overlay UI Implementation Guide

## Component Created: `/components/CardOverlay.tsx`

A clean, borderless playing card overlay that displays rank and suit on profile photos.

---

## Usage in Matches Page

### Step 1: Import the Component

In `/app/matches/page.tsx`, add the import:

```tsx
import { CardOverlay, CardInfo } from '@/components/CardOverlay';
```

### Step 2: Add Overlay to Profile Photo

Find where profile photos are rendered in the carousel (around line 2300-2400) and add the `CardOverlay` component:

```tsx
{enrichedProfiles.map((profile) => {
  const box = boxes[profile.id]; // SimpleConnectionBox with card overlay
  
  return (
    <div key={profile.id} className="relative">
      {/* Photo carousel */}
      <div className="relative aspect-[3/4] w-full">
        {/* Profile photo */}
        <img 
          src={profile.photos[currentPhotoIndex]} 
          alt={profile.name}
          className="w-full h-full object-cover rounded-2xl"
        />
        
        {/* Card overlay */}
        {box?.card && (
          <CardOverlay 
            card={box.card}
            size="md"
            position="top-right"
          />
        )}
      </div>
      
      {/* Rest of profile info... */}
    </div>
  );
})}
```

---

## Component Props

### CardOverlay

```tsx
interface CardOverlayProps {
  card: CardOverlayType;           // Required: card data from match engine
  size?: 'sm' | 'md' | 'lg';       // Optional: size of card display (default: 'md')
  position?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';  // Optional: position on photo (default: 'top-right')
}
```

**Example with all props:**
```tsx
<CardOverlay 
  card={box.card}
  size="lg"
  position="top-left"
/>
```

---

## Visual Features

### Card Display
- **Rank**: Large bold text (e.g., "A", "K", "Q", "JOKER")
- **Suit Symbol**: Below rank (♥ ♦ ♠ ♣)
- **Trine Pip**: Small letter below suit (A, B, C, D)
- **Background**: White with 95% opacity and blur
- **Shadow**: Subtle shadow for depth

### Color Coding
- **Hearts & Diamonds**: Red text (`text-red-600`)
- **Spades & Clubs**: Black text (`text-gray-900`)

### Edge Styling
- **Warning** (1 overlay): Amber ring (`ring-amber-500`)
- **Danger** (2+ overlays): Red ring (`ring-red-500`)
- **None**: No ring

---

## Size Options

### Small (`size="sm"`)
- Rank/Suit: `text-2xl`
- Pip: `text-xs`
- Best for: Mobile or tight spaces

### Medium (`size="md"`) - Default
- Rank/Suit: `text-3xl`
- Pip: `text-sm`
- Best for: Desktop default

### Large (`size="lg"`)
- Rank/Suit: `text-4xl`
- Pip: `text-base`
- Best for: Hero images or emphasis

---

## Position Options

- **`top-right`** (default): Upper right corner
- **`top-left`**: Upper left corner
- **`bottom-right`**: Lower right corner
- **`bottom-left`**: Lower left corner

---

## Advanced: Card Info Popup

For a detailed view of the card (e.g., on hover or click), use the `CardInfo` component:

```tsx
import { CardInfo } from '@/components/CardOverlay';

// In your component:
const [showInfo, setShowInfo] = useState(false);

<div className="relative">
  <CardOverlay 
    card={box.card}
    onClick={() => setShowInfo(true)}
  />
  
  {showInfo && (
    <div className="absolute top-full right-0 mt-2 z-20">
      <CardInfo card={box.card} />
    </div>
  )}
</div>
```

The `CardInfo` component shows:
- Large card display with rank and suit
- Suit name (e.g., "Hearts (San He)")
- Trine name (e.g., "Visionaries")
- All pills (compatibility factors)

---

## Example: Complete Integration

```tsx
'use client';

import { CardOverlay } from '@/components/CardOverlay';

export default function MatchesPage() {
  return (
    <div className="matches-grid">
      {enrichedProfiles.map((profile) => {
        const box = boxes[profile.id];
        
        return (
          <div key={profile.id} className="profile-card">
            {/* Photo with card overlay */}
            <div className="relative aspect-[3/4] w-full">
              <img 
                src={profile.photos[0]} 
                className="w-full h-full object-cover rounded-2xl"
              />
              
              {/* Playing card overlay */}
              {box?.card && (
                <CardOverlay 
                  card={box.card}
                  size="md"
                  position="top-right"
                />
              )}
            </div>
            
            {/* Profile info below */}
            <div className="p-4">
              <h3 className="text-xl font-bold">{profile.name}</h3>
              <p className="text-gray-600">
                {box?.matchLabel} · {box?.score}%
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
```

---

## Responsive Design

The component automatically adapts to different screen sizes:

```tsx
// Desktop
<CardOverlay card={box.card} size="md" position="top-right" />

// Mobile - smaller size
<div className="md:hidden">
  <CardOverlay card={box.card} size="sm" position="top-right" />
</div>

<div className="hidden md:block">
  <CardOverlay card={box.card} size="md" position="top-right" />
</div>
```

---

## Styling Customization

If you need to customize the appearance, you can extend the component:

### Custom Background
```tsx
// Edit CardOverlay.tsx, line with bg-white/95:
className="bg-gradient-to-br from-white/95 to-gray-50/95"
```

### Custom Shadow
```tsx
// Edit CardOverlay.tsx, line with shadow-lg:
className="shadow-2xl drop-shadow-lg"
```

### Custom Padding
```tsx
// Edit CardOverlay.tsx, line with px-2 py-1.5:
className="px-3 py-2"
```

---

## Card Legend (for UI documentation)

You can add a legend to help users understand the card system:

```tsx
export function CardLegend() {
  return (
    <div className="p-4 bg-white rounded-lg shadow">
      <h3 className="font-bold mb-3">Card Guide</h3>
      
      <div className="space-y-2 text-sm">
        <div className="flex items-center gap-2">
          <span className="text-2xl text-red-600">A♥</span>
          <span>Ace of Hearts - Best match (San He + Same Element)</span>
        </div>
        
        <div className="flex items-center gap-2">
          <span className="text-2xl text-red-600">K♥</span>
          <span>King of Hearts - Excellent (San He + Compatible)</span>
        </div>
        
        <div className="flex items-center gap-2">
          <span className="text-2xl text-gray-900">JOKER♠</span>
          <span>Joker - Magnetic Opposites with strong harmony</span>
        </div>
        
        <div className="mt-3 pt-3 border-t">
          <div className="font-semibold mb-1">Suits:</div>
          <div>♥ Hearts = San He (Triple Harmony)</div>
          <div>♦ Diamonds = Liu He (Six Harmonies)</div>
          <div>♠ Spades = Liu Chong (Six Conflicts)</div>
          <div>♣ Clubs = Same Sign / Neutral</div>
        </div>
        
        <div className="mt-3 pt-3 border-t">
          <div className="font-semibold mb-1">Trine Pips:</div>
          <div>A = Visionaries (Rat/Dragon/Monkey)</div>
          <div>B = Strategists (Ox/Snake/Rooster)</div>
          <div>C = Adventurers (Tiger/Horse/Dog)</div>
          <div>D = Artists (Rabbit/Goat/Pig)</div>
        </div>
      </div>
    </div>
  );
}
```

---

## Testing Checklist

- [ ] Card overlay appears on all profile photos
- [ ] Correct rank is displayed (A, K, Q, J, 10-1, JOKER)
- [ ] Correct suit symbol is displayed (♥ ♦ ♠ ♣)
- [ ] Colors are correct (red for hearts/diamonds, black for spades/clubs)
- [ ] Trine pip is displayed below suit
- [ ] Edge styling appears for warning/danger overlays
- [ ] Overlay is readable on light and dark photos
- [ ] Overlay doesn't block important photo content
- [ ] Responsive design works on mobile
- [ ] Overlay position is adjustable

---

## Next Steps

1. ✅ Component created at `/components/CardOverlay.tsx`
2. 🔄 Add to matches page photo carousel
3. 🔄 Test on desktop and mobile
4. 🔄 Add CardLegend component to help screen
5. 🔄 Optional: Add hover effects or click-to-expand

---

## Files

- **Component**: `/components/CardOverlay.tsx`
- **Integration target**: `/app/matches/page.tsx` (around line 2300-2400)
- **Data source**: `boxes[profile.id].card` (from `buildConnectionBox()`)
