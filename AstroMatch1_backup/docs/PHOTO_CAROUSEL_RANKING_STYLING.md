# Photo Carousel with Ranking - Styling Customization Guide

This guide shows you how to customize the `ProfilePhotoCarouselWithRanking` component.

## Component Usage

```typescript
import ProfilePhotoCarouselWithRanking from "@/components/ProfilePhotoCarouselWithRanking";
import { getMatchCard } from "@/lib/getMatchCard";

// Example usage
const matchData = getMatchCard("Aquarius", "Monkey", "Gemini", "Rat");

<ProfilePhotoCarouselWithRanking
  images={["/photo1.jpg", "/photo2.jpg", "/photo3.jpg"]}
  profileName="Emma"
  profileAge={28}
  connectionBoxData={matchData}
  theme="dark"
  showDropdown={true}
  onPhotoChange={(index) => console.log("Photo changed to", index)}
/>
```

## Customization Options

### 1. **Ranking Badge Position**

Change the badge location from top-right to other positions:

```typescript
// Top Left
<div className="absolute top-4 left-4 z-20">

// Top Center
<div className="absolute top-4 left-1/2 transform -translate-x-1/2 z-20">

// Bottom Right
<div className="absolute bottom-4 right-4 z-20">
```

### 2. **Badge Style Variations**

#### Minimal Badge (Score Only)
```typescript
<div 
  className="px-3 py-1 rounded-full backdrop-blur-sm"
  style={{
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    borderColor: getRankColor(connectionBoxData.rankKey),
  }}
>
  <span style={{ color: getRankColor(connectionBoxData.rankKey) }}>
    {connectionBoxData.score}%
  </span>
</div>
```

#### Full Badge (Emoji + Label + Score)
```typescript
<div className="flex flex-col items-center gap-1 px-4 py-2 rounded-xl backdrop-blur-sm">
  <span className="text-3xl">{connectionBoxData.emoji}</span>
  <span className="text-xs font-semibold">{connectionBoxData.rank}</span>
  <span className="text-lg font-bold">{connectionBoxData.score}%</span>
</div>
```

#### Pill Badge (Horizontal)
```typescript
<div className="flex items-center gap-2 px-4 py-2 rounded-full">
  <span>{connectionBoxData.emoji}</span>
  <span className="text-sm font-bold">{connectionBoxData.rank}</span>
  <span className="text-sm">•</span>
  <span className="text-sm font-bold">{connectionBoxData.score}%</span>
</div>
```

### 3. **Badge Background Styles**

```typescript
// Glass morphism
backgroundColor: 'rgba(255, 255, 255, 0.1)',
backdropFilter: 'blur(10px)',

// Solid dark
backgroundColor: 'rgba(0, 0, 0, 0.8)',

// Gradient
background: 'linear-gradient(135deg, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0.6) 100%)',

// Rank color background (subtle)
backgroundColor: getRankColor(connectionBoxData.rankKey) + '20', // 20 = 20% opacity
```

### 4. **Border Styles**

```typescript
// Thick glow border
borderWidth: '3px',
boxShadow: `0 0 20px ${getRankColor(connectionBoxData.rankKey)}`,

// Animated pulse border
animation: 'pulse 2s infinite',

// Dashed border
borderStyle: 'dashed',

// No border, shadow only
border: 'none',
boxShadow: `0 4px 12px ${getRankColor(connectionBoxData.rankKey)}50`,
```

### 5. **Dropdown Customization**

#### Compact Dropdown
```typescript
<summary className="p-3 flex items-center justify-between">
  <span className="text-sm font-semibold">{connectionBoxData.connectionLabel}</span>
  <span className="text-xs">{connectionBoxData.score}%</span>
</summary>
```

#### Expanded Dropdown with Zodiac Display
```typescript
<div className="px-4 pb-4 space-y-4">
  {/* Zodiac Signs Row */}
  <div className="flex items-center justify-center gap-3">
    <div className="text-center">
      <div className="text-2xl">{connectionBoxData.a.westGlyph}</div>
      <div className="text-xs">{connectionBoxData.a.west}</div>
    </div>
    <div className="text-center">
      <div className="text-2xl">{connectionBoxData.a.eastGlyph}</div>
      <div className="text-xs">{connectionBoxData.a.east}</div>
    </div>
    <div className="text-lg">×</div>
    <div className="text-center">
      <div className="text-2xl">{connectionBoxData.b.westGlyph}</div>
      <div className="text-xs">{connectionBoxData.b.west}</div>
    </div>
    <div className="text-center">
      <div className="text-2xl">{connectionBoxData.b.eastGlyph}</div>
      <div className="text-xs">{connectionBoxData.b.east}</div>
    </div>
  </div>
  
  {/* Rest of content */}
</div>
```

### 6. **Color Themes**

Override rank colors to match your brand:

```typescript
const getCustomRankColor = (rankKey?: string) => {
  switch (rankKey) {
    case "soulmate": return "#FFD700"; // Gold
    case "twin_flame": return "#FF6B6B"; // Red
    case "excellent": return "#4ECDC4"; // Teal
    case "good": return "#95E1D3"; // Mint
    case "learning": return "#A8E6CF"; // Light green
    case "challenging": return "#FFA07A"; // Light salmon
    case "incompatible": return "#B0B0B0"; // Gray
    default: return "#A855F7"; // Purple
  }
};
```

### 7. **Animation Effects**

```css
/* Add to your CSS */
@keyframes fadeInScale {
  from {
    opacity: 0;
    transform: scale(0.9);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

@keyframes pulse {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.7;
  }
}

@keyframes glow {
  0%, 100% {
    box-shadow: 0 0 5px currentColor;
  }
  50% {
    box-shadow: 0 0 20px currentColor;
  }
}
```

Apply animations:
```typescript
className="animate-[fadeInScale_0.3s_ease-out]"
className="animate-pulse"
style={{ animation: 'glow 2s infinite' }}
```

### 8. **Responsive Design**

```typescript
// Mobile: small badge
// Desktop: larger badge with more info
<div className="
  px-3 py-1.5 md:px-4 md:py-2
  text-xs md:text-sm
  rounded-full md:rounded-xl
">
  <span className="text-lg md:text-2xl">{emoji}</span>
  <span className="hidden md:inline">{rank}</span>
  <span>{score}%</span>
</div>
```

## Complete Custom Example

```typescript
<ProfilePhotoCarouselWithRanking
  images={profileImages}
  profileName="Alex"
  profileAge={26}
  connectionBoxData={{
    ...matchData,
    // Override styling inline if needed
  }}
  theme="dark"
  showDropdown={true}
  // Custom badge in top-left with custom styling
  customBadgePosition="top-left"
  customBadgeStyle={{
    background: 'linear-gradient(135deg, rgba(168,85,247,0.9) 0%, rgba(236,72,153,0.9) 100%)',
    borderRadius: '16px',
    padding: '12px 20px',
    backdropFilter: 'blur(12px)',
  }}
/>
```

## Tips

1. **Keep badges readable**: Use high contrast and sufficient padding
2. **Don't overlap important content**: Position badges away from faces
3. **Make touch targets large enough**: Minimum 44x44px for mobile
4. **Test different ranks**: Ensure all rank colors look good
5. **Consider accessibility**: Ensure sufficient color contrast ratios

## Rank Color Reference

| Rank | Emoji | Default Color | RGB |
|------|-------|---------------|-----|
| Soulmate | ⭐ | Gold | rgb(251, 191, 36) |
| Twin Flame | 🔥 | Orange | rgb(249, 115, 22) |
| Excellent | 💖 | Pink | rgb(236, 72, 153) |
| Good | 🌙 | Purple | rgb(168, 85, 247) |
| Learning | 🧭 | Blue | rgb(59, 130, 246) |
| Challenging | ⚡ | Red | rgb(239, 68, 68) |
| Incompatible | 💔 | Gray | rgb(107, 114, 128) |

