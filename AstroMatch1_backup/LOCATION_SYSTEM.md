# Location System

## 📍 Complete Geolocation Management

### Features Overview

```
✅ GPS location access
✅ Permission management
✅ Auto-updates with throttling
✅ Location caching
✅ Distance calculation
✅ Reverse geocoding (city names)
✅ Real-time tracking
✅ Privacy-focused
```

---

## 🎯 Core Utilities

### Location Functions (`lib/location.ts`)

| Function | Description |
|----------|-------------|
| `getCurrentLocation()` | Get current GPS coordinates |
| `updateMyLocation()` | Update user's location in database |
| `getCachedLocation()` | Get cached location (1hr expiry) |
| `checkLocationPermission()` | Check permission status |
| `requestLocationPermission()` | Request location access |
| `calculateDistance()` | Distance between two points (km) |
| `formatDistance()` | Format distance for display |
| `reverseGeocode()` | Get city name from coordinates |
| `watchLocation()` | Real-time location tracking |

---

## 🪝 React Hooks

### `useLocationOnStart()`
Auto-updates location on app start with throttling.

```typescript
import { useLocationOnStart } from "@/lib/hooks/use-location";

function App() {
  // Updates location every 6 minutes max
  useLocationOnStart(6);
  
  return <YourApp />;
}
```

### `useCurrentLocation()`
Get current location with loading/error states.

```typescript
const { location, loading, error, fetchLocation } = useCurrentLocation();

if (loading) return <Loading />;
if (error) return <Error message={error} />;
if (location) return <Map center={location} />;
```

### `useLocationPermission()`
Track permission status.

```typescript
const { permission, checking } = useLocationPermission();

if (permission === "denied") {
  return <EnableLocationInstructions />;
}
```

### `useLocationWithCache()`
Get location with fallback to cached data.

```typescript
const { location, source, loading, error, refresh } = useLocationWithCache();

// source: "live" | "cached"
{source === "cached" && <CachedIndicator />}
```

### `usePeriodicLocationUpdate()`
Automatically update location at intervals.

```typescript
// Updates every 10 minutes
usePeriodicLocationUpdate(10);
```

### `useRequireLocation()`
Require location for a feature.

```typescript
const { hasLocation, loading, error } = useRequireLocation();

if (!hasLocation) {
  return <EnableLocationPrompt />;
}
```

---

## 🎨 UI Components

### Location Permission Page
Full-screen prompt with benefits and privacy info.

```typescript
import LocationPermissionPage from "@/app/auth/enable-location/page";

// Route: /auth/enable-location
export default LocationPermissionPage;
```

### Location Status
Shows current location with update button.

```typescript
import { LocationStatus } from "@/components/location-status";

<LocationStatus />
// Displays: 📍 San Francisco [refresh icon]
```

### Location Badge
Compact indicator for profile cards.

```typescript
import { LocationBadge } from "@/components/location-status";

<LocationBadge className="text-gray-500" />
// Shows: 📍 or 📌 (live vs cached)
```

---

## 📖 Common Patterns

### 1. Auto-Update in Layout

```typescript
// app/layout.tsx or _app.tsx
import { useLocationOnStart } from "@/lib/hooks/use-location";

export default function RootLayout({ children }) {
  useLocationOnStart(6); // Throttle to 6 minutes
  
  return <html>{children}</html>;
}
```

### 2. Show Distance to Matches

```typescript
import { calculateDistance, formatDistance } from "@/lib/location";

function MatchCard({ match, myLocation }) {
  const distance = calculateDistance(myLocation, {
    lat: match.lat,
    lon: match.lon,
  });
  
  return (
    <div>
      <h3>{match.name}</h3>
      <p>{formatDistance(distance)}</p>
    </div>
  );
}
```

### 3. Require Location for Feature

```typescript
function MatchesPage() {
  const { hasLocation, loading } = useRequireLocation();
  
  if (loading) return <Loading />;
  
  if (!hasLocation) {
    return <EnableLocationPrompt />;
  }
  
  return <MatchesList />;
}
```

### 4. Manual Location Update

```typescript
import { updateMyLocation } from "@/lib/location";

async function handleRefresh() {
  try {
    const coords = await updateMyLocation();
    toast.success(`Location updated: ${coords.lat}, ${coords.lon}`);
  } catch (error) {
    toast.error("Failed to update location");
  }
}
```

### 5. Real-Time Tracking

```typescript
import { useLocationTracking } from "@/lib/hooks/use-location";

function LiveMap() {
  const [tracking, setTracking] = useState(true);
  const { location, error } = useLocationTracking(tracking);
  
  return (
    <Map
      center={location}
      tracking={tracking}
      onToggle={() => setTracking(!tracking)}
    />
  );
}
```

---

## 🔒 Privacy & Security

### Best Practices

```typescript
// ✅ DO: Show approximate distance only
<p>{Math.round(distance)}km away</p>

// ❌ DON'T: Show exact coordinates
<p>{match.lat}, {match.lon}</p> // Too precise!

// ✅ DO: Cache location locally
localStorage.setItem("cached_location", JSON.stringify(coords));

// ✅ DO: Throttle updates
if (Date.now() - last < 6 * 60 * 1000) return;

// ✅ DO: Handle permission denial gracefully
catch (error) {
  // Allow app to continue without location
}
```

### Privacy Policy Points

```
- We collect location to show nearby matches
- Only approximate distance is visible to others
- Exact coordinates are never shared
- Location updates are throttled
- You can disable location anytime
- Location data is encrypted in transit
```

---

## 🧪 Testing

### Browser Testing

```javascript
// Mock geolocation in browser console
navigator.geolocation.getCurrentPosition = (success) => {
  success({
    coords: {
      latitude: 37.7749,
      longitude: -122.4194,
      accuracy: 10,
    },
    timestamp: Date.now(),
  });
};
```

### Jest Testing

```typescript
const mockGeolocation = {
  getCurrentPosition: jest.fn(),
  watchPosition: jest.fn(),
  clearWatch: jest.fn(),
};

global.navigator.geolocation = mockGeolocation;

test("gets current location", async () => {
  mockGeolocation.getCurrentPosition.mockImplementation((success) => {
    success({
      coords: { latitude: 40.7128, longitude: -74.0060 },
    });
  });
  
  const location = await getCurrentLocation();
  expect(location.lat).toBe(40.7128);
});
```

---

## 🐛 Troubleshooting

### Permission Denied

```typescript
// Check browser settings
if (permission === "denied") {
  // Show instructions to enable in browser settings
}

// Gracefully degrade
if (!location) {
  // Show all users (no distance filter)
}
```

### Location Inaccurate

```typescript
// Use high accuracy mode
navigator.geolocation.getCurrentPosition(
  success,
  error,
  { enableHighAccuracy: true }
);

// Check accuracy
if (coords.accuracy > 100) {
  toast.warn("Location accuracy is low");
}
```

### Updates Too Frequent

```typescript
// Increase throttle time
useLocationOnStart(30); // 30 minutes

// Or disable auto-updates
// Remove useLocationOnStart() completely
```

---

## 📊 Performance Tips

### 1. Cache Location
```typescript
// Cache for 1 hour to reduce API calls
const cached = getCachedLocation();
if (cached) use(cached);
```

### 2. Throttle Updates
```typescript
// Don't update more than once per 6 minutes
const throttleMinutes = 6;
```

### 3. Use Bounding Box
```typescript
// Pre-filter by bounding box before precise distance
if (lat < minLat || lat > maxLat) continue;
const distance = calculateDistance(a, b);
```

### 4. Lazy Load
```typescript
// Only get location when needed
<MatchesPage onMount={() => updateMyLocation()} />
```

---

## 🎯 Integration Checklist

- [ ] Added `useLocationOnStart()` to app layout
- [ ] Created `/auth/enable-location` page
- [ ] Updated guards to check location
- [ ] Added location to profile
- [ ] Show distance in match cards
- [ ] Added location status indicator
- [ ] Implemented location caching
- [ ] Added privacy policy section
- [ ] Tested permission flows
- [ ] Tested on mobile devices
- [ ] Added error handling
- [ ] Throttled location updates

---

**🎉 Your location system is complete and privacy-focused!** 📍✨

