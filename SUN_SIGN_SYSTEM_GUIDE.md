# Sun Sign System Implementation Guide

## ✅ What Has Been Implemented

### 1. **New "Sun Signs" Section on Account Page**
Location: `/app/profile/account/page.tsx`

Features:
- Toggle switch between **Tropical (Western)** and **Sidereal (Vedic)** systems
- Displays current selection
- Explanatory text about both systems
- Saves preference to localStorage

### 2. **Sun Sign Calculator**
Location: `/lib/sunSignCalculator.ts`

Functions:
- `getTropicalSunSign(month, day)` - Calculate tropical sun sign
- `getSiderealSunSign(month, day)` - Calculate sidereal sun sign  
- `getBothSunSigns(month, day)` - Calculate both at once
- `getDisplaySunSign(tropical, sidereal, system)` - Get correct sign based on preference
- `getSunSignSystem()` - Get current system from localStorage
- `setSunSignSystem(system)` - Save system preference
- `saveSunSigns(tropical, sidereal)` - Save both signs to localStorage

### 3. **React Hooks**
Location: `/lib/hooks/useSunSign.ts`

Hooks:
- `useSunSign(month, day)` - Returns the sun sign to display based on current system
- `useBothSunSigns(month, day)` - Returns both tropical and sidereal signs
- `useSunSignSystem()` - Returns current system preference

All hooks automatically update when the system toggle is changed!

### 4. **Automatic Calculation**
When a user sets their birthdate, both sun signs are automatically:
- Calculated from the birthdate
- Stored in localStorage
- Available for display throughout the app

### 5. **Real-Time Updates**
When a user toggles the sun sign system:
- The preference is saved to localStorage
- A custom event `sunSignSystemChanged` is dispatched
- All profile displays automatically update via the React hooks

---

## 🎯 How to Use This in Profile Pages

### Option 1: Using the Hook (Recommended)

```typescript
import { useSunSign } from '@/lib/hooks/useSunSign';

function ProfileComponent() {
  // Get month and day from localStorage or props
  const month = parseInt(localStorage.getItem('selectedMonth') || '1');
  const day = parseInt(localStorage.getItem('selectedDay') || '1');
  
  // This will automatically display the correct sign based on user preference
  const displaySign = useSunSign(month, day);
  
  return (
    <div>
      Sun Sign: {displaySign}
    </div>
  );
}
```

### Option 2: Manual Calculation

```typescript
import { getBothSunSigns, getSunSignSystem, getDisplaySunSign } from '@/lib/sunSignCalculator';

function ProfileComponent() {
  const month = 6;
  const day = 15;
  
  // Calculate both signs
  const { tropical, sidereal } = getBothSunSigns(month, day);
  // tropical = "Gemini", sidereal = "Taurus"
  
  // Get user's preference
  const system = getSunSignSystem(); // "tropical" or "sidereal"
  
  // Get the correct sign to display
  const displaySign = getDisplaySunSign(tropical, sidereal, system);
  
  return <div>{displaySign}</div>;
}
```

---

## 📍 Where to Update

Update these files to use the new system:

### 1. **Own Profile** (`/app/profile/profile/page.tsx`)
Replace hardcoded western sign with:
```typescript
const displaySign = useSunSign(selectedMonth, selectedDay);
```

### 2. **Other User Profiles** (`/app/profile/view/[id]/page.tsx`)
Use the hook with the viewed user's birthdate

### 3. **Match Cards** (`/components/UserProfileStack.tsx`, etc.)
Update anywhere a sun sign is displayed

### 4. **Matches Page** (`/app/matches/page.tsx`)
Update profile cards

### 5. **Likes Page** (`/app/likes/page.tsx`)
Update profile cards

### 6. **Messages** (`/app/messages/[id]/page.tsx`)
Update profile headers

---

## 🔄 How It Works

### Tropical (Western) Zodiac
- Based on the **seasons** and **equinoxes**
- Fixed dates (e.g., Aries: March 21 - April 19)
- Most common in Western astrology

### Sidereal (Vedic) Zodiac
- Based on the **actual constellation positions**
- Approximately **23 days earlier** than tropical
- Used in Vedic/Hindu astrology
- Example: If you're a Gemini in tropical, you might be a Taurus in sidereal

### Date Examples:
| Birthdate | Tropical (Western) | Sidereal (Vedic) |
|-----------|-------------------|------------------|
| March 25  | Aries             | Pisces           |
| June 15   | Gemini            | Taurus           |
| August 20 | Leo               | Cancer           |
| November 10 | Scorpio         | Libra            |

---

## 🎨 User Experience

1. **User sets birthdate** → Both signs calculated and saved
2. **Default view** → Shows Tropical (Western) sign
3. **User goes to Account page** → Sees "Sun Signs" section
4. **User toggles to Sidereal** → Preference saved
5. **All profiles update** → Now showing Sidereal signs everywhere
6. **No page refresh needed** → Updates happen automatically via hooks

---

## ✨ Benefits

- ✅ Users get **both zodiac systems** calculated from their birthdate
- ✅ **One toggle** controls the display across the entire app
- ✅ **Automatic updates** when preference changes
- ✅ **Stored in localStorage** for persistence
- ✅ **Easy to integrate** into any component with hooks
- ✅ **No breaking changes** to existing code

---

## 🚀 Next Steps

To complete the integration, update the profile display components to use `useSunSign()` instead of hardcoded western signs. The hook will handle everything automatically!

