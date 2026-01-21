# Using ProfilePhotoCarouselWithRanking in Profile View

## Quick Integration Example

To use the new photo carousel with ranking display in the profile view page, replace the existing photo carousel section (around line 2397-2478) with:

```typescript
{activeTab === "view" && (
  <div className="mb-8 pb-32 px-2">
    {/* NEW: Photo Carousel with Ranking Badge and Dropdown */}
    <ProfilePhotoCarouselWithRanking
      images={photos.map(p => p.src || "/placeholder.svg")}
      profileName={name || "Your Name"}
      profileAge={(() => {
        if (!birthInfo.birthdate) return 0;
        const [year, month, day] = birthInfo.birthdate.split("-").map(Number);
        const today = new Date();
        let age = today.getFullYear() - year;
        const monthDiff = today.getMonth() + 1 - month;
        if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < day)) {
          age--;
        }
        return age;
      })()}
      connectionBoxData={connectionBoxData || undefined}
      theme={theme === "light" ? "light" : "dark"}
      showDropdown={true}
      onPhotoChange={(index) => setCurrentPhotoIndex(index)}
    />

    {/* Rest of your profile content */}
    {aboutMeText && (
      <div className="mb-2">
        <div className="rounded-2xl p-5 border bg-gradient-to-b from-white to-[#f9f9ff] text-gray-900 border-purple-200 dark:from-[#1b1130] dark:to-[#100820] dark:text-white dark:border-purple-900/30 shadow-lg dark:shadow-[0_0_20px_rgba(168,85,247,0.15)]">
          <h4 className="text-lg font-semibold mb-2 text-purple-600 dark:text-purple-300">About Me</h4>
          <p className="text-sm leading-relaxed text-gray-700 dark:text-gray-300">
            {aboutMeText}
          </p>
        </div>
      </div>
    )}
    
    {/* ... rest of sections ... */}
  </div>
)}
```

## Features You Get

### 1. **Ranking Badge on Photo** (Top-Right)
- Shows emoji (⭐ 🔥 💖 etc.)
- Displays compatibility score (96%, etc.)
- Color-coded border based on rank
- Semi-transparent backdrop for readability

### 2. **Photo Navigation**
- Click left side to go to previous photo
- Click right side to go to next photo
- Photo indicators at top show current position
- Smooth transitions between photos

### 3. **Expandable Dropdown** (Below Photo)
- Shows connection label ("Destined Union", etc.)
- Rank badge pill
- Expandable details with:
  - Insight paragraph (from new match engine)
  - Chinese zodiac breakdown
  - Western zodiac breakdown

## Customization Examples

### Change Badge Position to Top-Left

In `ProfilePhotoCarouselWithRanking.tsx`, find line ~117:

```typescript
// Change from:
<div className="absolute top-4 right-4 z-20">

// To:
<div className="absolute top-4 left-4 z-20">
```

### Make Badge Larger

```typescript
<div 
  className="px-5 py-3 rounded-full backdrop-blur-sm flex items-center gap-3" // Increased padding
  style={{
    backgroundColor: 'rgba(0, 0, 0, 0.7)', // Darker background
    borderWidth: '3px', // Thicker border
    borderStyle: 'solid',
    borderColor: getRankColor(connectionBoxData.rankKey),
  }}
>
  <span className="text-3xl">{connectionBoxData.emoji}</span> {/* Larger emoji */}
  <span 
    className="text-lg font-bold" // Larger score
    style={{ color: getRankColor(connectionBoxData.rankKey) }}
  >
    {connectionBoxData.score}%
  </span>
</div>
```

### Add Glow Effect to Badge

```typescript
<div 
  className="px-4 py-2 rounded-full backdrop-blur-sm flex items-center gap-2"
  style={{
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    borderWidth: '2px',
    borderStyle: 'solid',
    borderColor: getRankColor(connectionBoxData.rankKey),
    boxShadow: `0 0 20px ${getRankColor(connectionBoxData.rankKey)}`, // Add glow
    animation: 'pulse 2s infinite', // Animated pulse
  }}
>
```

### Compact Badge (Score Only)

```typescript
<div 
  className="w-16 h-16 rounded-full backdrop-blur-sm flex items-center justify-center"
  style={{
    backgroundColor: getRankColor(connectionBoxData.rankKey),
  }}
>
  <span className="text-white text-lg font-bold">
    {connectionBoxData.score}
  </span>
</div>
```

### Full Information Badge

```typescript
<div 
  className="px-4 py-3 rounded-xl backdrop-blur-sm flex flex-col items-center gap-1"
  style={{
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    borderWidth: '2px',
    borderStyle: 'solid',
    borderColor: getRankColor(connectionBoxData.rankKey),
  }}
>
  <span className="text-3xl">{connectionBoxData.emoji}</span>
  <span 
    className="text-xs font-semibold uppercase tracking-wide"
    style={{ color: getRankColor(connectionBoxData.rankKey) }}
  >
    {connectionBoxData.rankKey?.replace('_', ' ')}
  </span>
  <span 
    className="text-2xl font-bold"
    style={{ color: getRankColor(connectionBoxData.rankKey) }}
  >
    {connectionBoxData.score}%
  </span>
  <span className="text-xs text-white/80">Match</span>
</div>
```

## Alternative: Keep Separate Connection Box

If you prefer to keep the connection box below the carousel (not in dropdown), use:

```typescript
<ProfilePhotoCarouselWithRanking
  images={photos.map(p => p.src || "/placeholder.svg")}
  profileName={name || "Your Name"}
  profileAge={age}
  connectionBoxData={connectionBoxData}
  theme={theme === "light" ? "light" : "dark"}
  showDropdown={false} // Disable built-in dropdown
/>

{/* Separate connection box below */}
{connectionBoxData && (
  <div className="mb-2 mt-4">
    <ConnectionBoxSimple data={connectionBoxData} />
  </div>
)}
```

## Testing Different Ranks

To see how different ranks look, temporarily modify your zodiac signs in the profile settings to create different compatibility scores:

- **Soulmate (95-100)**: Same trine + same element
- **Twin Flame (85-94)**: Same trine + compatible element  
- **Excellent (70-84)**: Same trine or same element
- **Good (55-69)**: Compatible elements
- **Learning (40-54)**: Mixed compatibility
- **Challenging (25-39)**: Conflicting elements
- **Incompatible (0-24)**: Opposite signs + conflicting elements

## Performance Tips

1. **Lazy load images**: The component already uses optimized image loading
2. **Memoize connectionBoxData**: It's already computed once per profile
3. **Preload next photo**: Consider preloading adjacent photos for smoother navigation
4. **Debounce photo changes**: If you add swipe gestures, debounce the updates

## Accessibility

The component includes:
- Semantic HTML with proper alt text
- Keyboard navigation support (through click handlers)
- ARIA labels on interactive elements
- High contrast ratios for text

To enhance:
- Add arrow key navigation
- Add focus indicators
- Add screen reader announcements for photo changes

