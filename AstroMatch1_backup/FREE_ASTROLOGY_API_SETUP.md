# Free Astrology API Setup

## API Endpoint Connected
✅ `/app/api/free-astrology-chart/route.ts` is properly configured

## Required: Add API Key

You need to add your Free Astrology API key to your `.env.local` file.

### Steps:

1. **Get your API key** from https://freeastrologyapi.com
   - Sign up for a free account
   - Copy your API key

2. **Add to `.env.local`** file in your project root:
   ```bash
   FREE_ASTROLOGY_API_KEY=your_actual_api_key_here
   ```

3. **Restart the dev server** after adding the key:
   ```bash
   # Stop the current server (Ctrl+C)
   npm run dev
   ```

## API Details

**Endpoint:** `https://json.freeastrologyapi.com/horoscope-chart-url`

**Method:** POST

**Required Parameters:**
- `year` - Birth year (e.g., 1990)
- `month` - Birth month (1-12)
- `date` - Birth date (1-31)
- `hours` - Birth hour (0-23, 24h format)
- `minutes` - Birth minute (0-59)
- `seconds` - Birth second (optional, defaults to 0)
- `latitude` - Birth location latitude
- `longitude` - Birth location longitude
- `timezone` - Timezone offset (calculated from longitude)
- `config.observation_point` - "topocentric" (standard)
- `config.ayanamsha` - "lahiri" (standard Vedic calculation)

## How It Works

1. User fills in birth details on `/astrology` page
2. Clicks "Vedic Chart" button
3. Frontend calls `/api/free-astrology-chart`
4. Backend calls Free Astrology API with your key
5. API returns chart image URL
6. Chart displays on the page

## Response Format

```json
{
  "success": true,
  "data": {
    "output": "https://api.freeastrologyapi.com/charts/image-url.png",
    "config": {
      "ayanamsha": "lahiri",
      "observation_point": "topocentric"
    }
  }
}
```

## Troubleshooting

### Error: "Failed to fetch chart from Free Astrology API"

**Cause:** API key is missing or invalid

**Solution:**
1. Check `.env.local` file exists
2. Verify `FREE_ASTROLOGY_API_KEY=your_key` is set
3. Restart dev server
4. Verify key is valid at https://freeastrologyapi.com

### Alternative: Test Without API Key

If you want to test the UI without an API key, the Free Astrology API might offer a free tier with limited requests. Check their documentation.

---

**Current Status:** ⚠️ API key needs to be added to `.env.local`

