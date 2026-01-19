# Timezone-Aware Chinese Zodiac Calculator

## Overview

This module provides accurate Chinese zodiac calculations that properly handle Chinese New Year boundaries across different timezones. It solves the common issue where people born on or near Chinese New Year get the wrong zodiac animal due to timezone differences.

## The Problem

Chinese New Year happens at midnight in Beijing (UTC+8). Someone born on the same calendar date might be before or after CNY depending on their timezone:

- **Born in Sydney (UTC+11)** on Feb 16, 1980 at 9:55 PM
  - In Beijing: Feb 16, 1980 at 6:55 PM
  - CNY was at midnight (00:00) Feb 16 in Beijing
  - **Result**: Born AFTER CNY → **Monkey** ✅

- **Born in Los Angeles (UTC-8)** on Feb 16, 1980 at 3:00 AM
  - In Beijing: Feb 16, 1980 at 7:00 PM  
  - CNY was at midnight (00:00) Feb 16 in Beijing
  - **Result**: Born AFTER CNY → **Monkey** ✅
  
But someone born at 11 PM on Feb 15 in LA would be:
  - In Beijing: 3 PM on Feb 16
  - Still AFTER CNY → **Monkey**

## The Solution

We convert all dates to UTC for comparison:

1. Parse birth moment in user's timezone
2. Convert to UTC
3. Get CNY moment in Beijing, convert to UTC
4. Compare UTC timestamps
5. If birth < CNY → previous animal, else → new animal

## Installation

```bash
npm install luxon
npm install --save-dev @types/luxon
```

## Usage

### Basic Usage (With Time)

```typescript
import { getChineseZodiacWithTimeZone } from '@/src/lib/astrology';

const animal = getChineseZodiacWithTimeZone({
  isoDateTime: '1980-02-16T21:55',  // Feb 16, 1980 at 9:55 PM
  timeZone: 'Australia/Sydney',
});
// Returns: 'Monkey'
```

### Simple Usage (Date Only)

When you don't have birth time (e.g., during onboarding):

```typescript
import { getChineseZodiacSimple } from '@/src/lib/astrology';

const animal = getChineseZodiacSimple(
  '1980-02-16',
  'Australia/Sydney'  // Optional, defaults to UTC
);
// Returns: 'Monkey'
```

### Integration Example

```typescript
// OLD (simplified, timezone-unaware)
const animal = getChineseZodiacSign(birthYear);

// NEW (timezone-aware)
const animal = getChineseZodiacWithTimeZone({
  isoDateTime: `${birthDate}T${birthTime}`,  // '1980-02-16T21:55'
  timeZone: user.timeZone,                   // 'Australia/Sydney'
});
```

## Common Timezones

- **Australia**: `Australia/Sydney`, `Australia/Melbourne`, `Australia/Brisbane`
- **USA**: `America/New_York`, `America/Los_Angeles`, `America/Chicago`
- **Europe**: `Europe/London`, `Europe/Paris`, `Europe/Berlin`
- **Asia**: `Asia/Tokyo`, `Asia/Singapore`, `Asia/Hong_Kong`
- **Default**: `UTC`

## API Reference

### `getChineseZodiacWithTimeZone(input: BirthInput): ChineseAnimal`

Main function for timezone-aware calculation.

**Parameters:**
- `input.isoDateTime` (string): ISO datetime string (e.g., '1980-02-16T21:55')
- `input.timeZone` (string): IANA timezone identifier (e.g., 'Australia/Sydney')

**Returns:** ChineseAnimal ('Rat' | 'Ox' | 'Tiger' | ...)

**Throws:** Error if invalid datetime or timezone

### `getChineseZodiacSimple(birthDate: string, timeZone?: string): ChineseAnimal`

Simplified version for when you only have a date.

**Parameters:**
- `birthDate` (string): Date in 'YYYY-MM-DD' format
- `timeZone` (string, optional): IANA timezone identifier, defaults to 'UTC'

**Returns:** ChineseAnimal

## Data Coverage

The system includes accurate Chinese New Year dates for:
- **1960 - 2035** (75 years)

For years outside this range, it falls back to simplified calculation.

## Edge Cases Handled

1. **Exact CNY Boundary**: Properly handles births at the exact moment of CNY
2. **Timezone Transitions**: Uses UTC comparison to avoid DST issues  
3. **Historical Dates**: Works for any date with CNY data available
4. **Missing Data**: Falls back gracefully for years not in table

## Testing Examples

```typescript
// Test Case 1: Born after CNY in Sydney
const test1 = getChineseZodiacWithTimeZone({
  isoDateTime: '1980-02-16T21:55',
  timeZone: 'Australia/Sydney',
});
console.assert(test1 === 'Monkey');

// Test Case 2: Born before CNY in LA
const test2 = getChineseZodiacWithTimeZone({
  isoDateTime: '1980-02-15T23:00',
  timeZone: 'America/Los_Angeles',
});
console.assert(test2 === 'Goat');

// Test Case 3: Simple calculation
const test3 = getChineseZodiacSimple('1980-03-01', 'UTC');
console.assert(test3 === 'Monkey');
```

## Why This Matters

For a dating app based on Chinese zodiac compatibility:
- **Accuracy is crucial** for match calculations
- **Trust is essential** - users will verify their sign
- **Edge cases matter** - CNY boundary dates are common birthdates

This implementation ensures every user gets the correct zodiac animal, regardless of where or when they were born.

## Future Enhancements

- Add Wu Xing (Five Elements) with timezone awareness
- Include lunar month and day calculations
- Support for birth time unknown (probabilistic approach)
- Cache calculations for performance

