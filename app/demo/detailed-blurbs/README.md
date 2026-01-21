# Detailed Compatibility Blurbs Demo

This demo system allows you to preview the connection box with detailed compatibility descriptions extracted directly from the individual sign guide pages.

## 📁 Files Created

### 1. `/scripts/extract-detailed-compat.ts`
Extraction script that reads all Chinese zodiac and Sun sign guide pages and extracts the "Compatibility with Other Signs" descriptions.

**Run it:**
```bash
npx tsx scripts/extract-detailed-compat.ts
```

### 2. `/data/detailedCompatDescriptions.ts`
Auto-generated data file containing:
- **144 Chinese zodiac combinations** (12 × 12)
- **144 Western zodiac combinations** (12 × 12)
- Helper functions to look up compatibility descriptions

**Structure:**
```typescript
export interface DetailedCompatDescription {
  heading: string;    // e.g., "Rat × Ox — Secret Friend (Liu He 六合)"
  tagline: string;    // e.g., "Smart and steady"
  description: string; // Full detailed paragraph
}
```

### 3. `/app/demo/detailed-blurbs/page.tsx`
Demo page where you can toggle between standard blurbs and detailed blurbs.

**Access it:**
```
http://localhost:3000/demo/detailed-blurbs
```

## 🎯 How It Works

### Data Extraction
The script extracts compatibility information from:
- **Chinese pages**: `/app/astrology/guide/next/{animal}/page.tsx`
- **Sun sign pages**: `/app/astrology/guide/{sign}/page.tsx`

Each page has a "Compatibility with Other Signs" section with structured entries:
```tsx
<h3>Rat × Ox — Secret Friend (Liu He 六合)</h3>
<p>Smart and steady</p>
<p>Full detailed description...</p>
```

### Lookup Functions
```typescript
// Get Chinese compatibility
const chineseCompat = getChineseDetailedCompat("dragon", "tiger");
// Returns: { heading, tagline, description }

// Get Western compatibility
const westernCompat = getWesternDetailedCompat("leo", "sagittarius");
// Returns: { heading, tagline, description }

// Get both
const both = getCombinedDetailedBlurb("leo", "sagittarius", "dragon", "tiger");
// Returns: { chinese, western }
```

## 🔄 Integration Options

### Option 1: Feature Flag (Recommended)
Add a feature flag to the match engine to toggle detailed blurbs:

```typescript
// In match engine or environment
const USE_DETAILED_BLURBS = process.env.NEXT_PUBLIC_USE_DETAILED_BLURBS === 'true';

// In buildConnectionBox or similar
if (USE_DETAILED_BLURBS) {
  const detailed = getCombinedDetailedBlurb(westA, westB, eastA, eastB);
  if (detailed.chinese) {
    blurbs.chineseLine = detailed.chinese.description;
  }
  if (detailed.western) {
    blurbs.westernLine = detailed.western.description;
  }
}
```

### Option 2: Page-Specific Override
Override only on specific pages:

```typescript
// In a specific page (e.g., discover page)
import { getChineseDetailedCompat, getWesternDetailedCompat } from '@/data/detailedCompatDescriptions';

// After building connection box
const enhancedBox = {
  ...connectionBox,
  chineseLine: getChineseDetailedCompat(eastA, eastB)?.description || connectionBox.chineseLine,
  westernLine: getWesternDetailedCompat(westA, westB)?.description || connectionBox.westernLine,
};
```

### Option 3: User Preference
Add a user setting:

```typescript
// In user profile or settings
interface UserSettings {
  useDetailedCompatibility: boolean;
}

// In match display
if (user.settings.useDetailedCompatibility) {
  // Use detailed blurbs
}
```

## 📊 Coverage

- ✅ **12 Chinese zodiac signs** × 12 = 144 combinations
- ✅ **12 Sun signs** × 12 = 144 combinations
- ✅ **Total: 288 detailed compatibility descriptions**

Each description includes:
- Pattern classification (e.g., "Secret Friend", "Six Conflicts")
- Short tagline
- Full paragraph of detailed compatibility insight

## 🎨 Demo Features

The demo page (`/app/demo/detailed-blurbs/page.tsx`) includes:

1. **Toggle Switch**: Instantly compare standard vs. detailed blurbs
2. **Sample Match**: Pre-configured Leo/Dragon × Sagittarius/Tiger match
3. **Full Connection Box**: Shows exactly how it would appear in production
4. **Explanation Panel**: Context about the demo and next steps

## 🚀 Next Steps

1. **Test the demo**: Visit `/demo/detailed-blurbs` and toggle the switch
2. **Review the descriptions**: Check if they provide the level of detail you want
3. **Choose integration method**: Decide between feature flag, page-specific, or user preference
4. **Implement**: Apply to desired pages (matches, discovery, etc.)

## 📝 Maintenance

When you update sign guide pages:
1. Run the extraction script: `npx tsx scripts/extract-detailed-compat.ts`
2. The data file will be regenerated with latest content
3. Commit the updated `detailedCompatDescriptions.ts`

## ⚠️ Notes

- The demo does NOT modify the main match engine
- It's a preview/overlay system for testing
- No permanent changes to existing functionality
- Easy to enable/disable via feature flag
- Data is statically extracted (not dynamic from pages)

## 🔍 Example Comparison

**Standard Blurb:**
> "Courage meets adventure. Dynamic fire energy."

**Detailed Blurb:**
> "Courage meets adventure. Leo–Dragon brings presence and power; Sagittarius–Tiger adds optimism and faith in the future. You fuel each other's fire, laughing through challenges and chasing new horizons together. The chemistry feels warm, creative, and motivating."

The detailed version provides:
- More context and personality
- Specific sign trait mentions
- Richer emotional language
- Better storytelling

