# Caching Strategy - AstroMatch Performance Optimization

## Overview
Multi-layer caching strategy to optimize performance for 20,736 possible compatibility combinations while maintaining freshness and reducing server load.

## Cache Layers

### 1. **Browser Cache** (Client-Side)
**Duration**: 60 seconds  
**Header**: `max-age=60`  
**Purpose**: Immediate response for repeated requests within 1 minute

### 2. **CDN/Edge Cache** (Vercel Edge)
**Duration**: 5 minutes (300 seconds)  
**Header**: `s-maxage=300`  
**Purpose**: Serve cached responses from edge nodes closest to users

### 3. **Stale-While-Revalidate**
**Duration**: 10 minutes (600 seconds)  
**Header**: `stale-while-revalidate=600`  
**Purpose**: Serve stale content instantly while fetching fresh in background

### 4. **localStorage Cache** (Client-Side Persistent)
**Duration**: Permanent (until cleared)  
**Key Format**: `compat_longform:${pairId}`  
**Purpose**: Instant load for previously viewed pairs across sessions

## Complete Cache Header

```
Cache-Control: public, max-age=60, s-maxage=300, stale-while-revalidate=600
```

## Cache Flow Diagram

```
User Request
    ↓
1. Check localStorage (instant if found)
    ↓ (if miss)
2. Browser Cache (60s)
    ↓ (if miss)
3. CDN/Edge Cache (300s)
    ↓ (if miss)
4. API Route → Data Fetch → Return
    ↓
5. Cache at all layers
    ↓
6. Save to localStorage
```

## Error Cache Strategy

For 404 responses (pair not found):

```
Cache-Control: public, max-age=60, s-maxage=60, stale-while-revalidate=300
```

**Rationale**: 
- Shorter CDN cache (60s vs 300s) to allow faster updates when new pairs are added
- Still benefits from edge caching to prevent repeated 404 lookups
- Prevents hammering the origin with requests for non-existent pairs

## Implementation

### API Routes

Both `/api/compat/[pairId]` and `/api/longform/[pairId]`:

```typescript
const CACHE_HEADERS = 'public, max-age=60, s-maxage=300, stale-while-revalidate=600';
const ERROR_CACHE_HEADERS = 'public, max-age=60, s-maxage=60, stale-while-revalidate=300';

export async function GET(_: Request, { params }: { params: { pairId: string } }) {
  // ... lookup logic ...
  
  if (!data) {
    return NextResponse.json(
      { error: 'Not found' }, 
      { status: 404, headers: { 'Cache-Control': ERROR_CACHE_HEADERS } }
    );
  }
  
  return NextResponse.json(data, {
    headers: { 'Cache-Control': CACHE_HEADERS }
  });
}
```

### Client-Side Hook (useCompatibility)

```typescript
useEffect(() => {
  if (!enabled || !pairId) return;
  setStatus('loading');

  // 1. Check localStorage first
  const key = `compat_longform:${pairId}`;
  const cached = localStorage.getItem(key);
  if (cached) {
    try { 
      setData(JSON.parse(cached)); 
      setStatus('loaded'); 
    } catch {}
  }

  // 2. Fetch from API (will hit browser/CDN/edge cache)
  fetch(`/api/compat/${encodeURIComponent(pairId)}`)
    .then(r => r.ok ? r.json() : Promise.reject(r))
    .then((json) => {
      setData(json);
      // 3. Update localStorage
      try { localStorage.setItem(key, JSON.stringify(json)); } catch {}
      setStatus('loaded');
    })
    .catch(() => setStatus('error'));
}, [pairId, enabled]);
```

## Performance Metrics

### Cache Hit Scenarios

| Scenario | Cache Layer | Response Time | Cost |
|----------|-------------|---------------|------|
| **Repeat View (same session)** | localStorage | ~1ms | Free |
| **Recent View (<60s)** | Browser | ~5-10ms | Free |
| **Popular Pair (<5min)** | CDN/Edge | ~20-50ms | Low |
| **Stale Content (<10min)** | Stale-While-Revalidate | ~20-50ms | Low |
| **Cold Start** | Origin API | ~100-200ms | Normal |

### Expected Cache Hit Rates

- **localStorage**: 70-80% (returning users viewing same pairs)
- **Browser Cache**: 10-15% (rapid re-views within 60s)
- **CDN/Edge**: 5-10% (popular pairs, different users)
- **Origin**: 5-10% (truly cold starts or new pairs)

### Cost Savings

**Assumptions**:
- 10,000 daily compatibility views
- 70% localStorage hits = 7,000 free (instant)
- 20% CDN hits = 2,000 edge cached (low cost)
- 10% origin hits = 1,000 API executions

**Result**: 90% reduction in origin API calls

## Cache Invalidation Strategy

### Automatic Invalidation

1. **Browser Cache**: Auto-expires after 60s
2. **CDN Cache**: Auto-expires after 5min
3. **Stale Content**: Auto-revalidates after 10min

### Manual Invalidation (if needed)

```typescript
// Clear specific pair from localStorage
localStorage.removeItem(`compat_longform:${pairId}`);

// Clear all compatibility data
Object.keys(localStorage)
  .filter(key => key.startsWith('compat_longform:'))
  .forEach(key => localStorage.removeItem(key));
```

### Vercel Deployment

On new deployment:
- All edge caches are automatically purged
- CDN serves fresh content immediately
- localStorage persists (user must manually refresh or clear)

## Content Type Caching Strategy

### Premium Longform Content (10 pairs)

**Strategy**: Aggressive caching
- These are static, hand-written content
- Rarely change after initial creation
- High value for caching investment

**Implementation**: Current headers (60s/300s/600s)

### Auto-Generated Content (future 20,726 pairs)

**Strategy**: Dynamic generation with edge caching
- Generated on-demand from templates
- Cached aggressively once generated
- Same headers as premium content

**Future Enhancement**: Pre-generate and cache at build time for top 1,000 most common pairs

## Monitoring & Optimization

### Key Metrics to Track

1. **Cache Hit Rate**: Percentage of requests served from cache vs origin
2. **Average Response Time**: By cache layer
3. **localStorage Size**: Monitor storage usage per user
4. **CDN Bandwidth**: Cost tracking
5. **Origin Load**: API execution count

### Optimization Opportunities

**Current State** (10 premium pairs):
- Low origin load
- Fast response times
- Minimal bandwidth

**Future State** (20,736 pairs):
- Pre-generate top 1,000 pairs at build time
- Use edge functions for dynamic generation
- Implement LRU cache for localStorage (limit to 100 most recent)
- Add compression for stored JSON

## Browser Compatibility

### localStorage Support
- ✅ Chrome/Edge: Full support
- ✅ Firefox: Full support
- ✅ Safari: Full support (with 7-day expiry if not used)
- ⚠️ Private/Incognito: May be disabled or limited

### Fallback Strategy

```typescript
function safeLocalStorage(key: string, value: string) {
  try {
    if (typeof window !== 'undefined' && window.localStorage) {
      localStorage.setItem(key, value);
    }
  } catch (e) {
    // Silently fail - user still gets data, just no local cache
    console.warn('localStorage unavailable:', e);
  }
}
```

## CDN Configuration (Vercel)

### Automatic Optimizations

Vercel automatically applies:
- ✅ Brotli/Gzip compression
- ✅ HTTP/2 multiplexing
- ✅ Global edge network (40+ regions)
- ✅ Automatic HTTPS
- ✅ Smart routing to nearest edge node

### Additional Headers (Already Set)

```typescript
export const revalidate = 60; // ISR revalidation interval
```

This enables Incremental Static Regeneration for API routes.

## Security Considerations

### Public Content
All compatibility data is public (no user-specific info), so aggressive caching is safe.

### Cache Headers Explanation

- **`public`**: Can be cached by any cache (browser, CDN, proxy)
- **`max-age=60`**: Browser can cache for 60s without revalidation
- **`s-maxage=300`**: Shared caches (CDN) can cache for 5min, overrides max-age
- **`stale-while-revalidate=600`**: Serve stale content up to 10min while fetching fresh

### Privacy
- No sensitive data cached
- No user-specific information in responses
- localStorage keys don't expose user info

## Testing Cache Behavior

### Manual Testing

1. **First Load** (Cold Start):
```bash
curl -I https://your-domain.com/api/compat/aquarius_monkey%7Cgemini_rat
# Check: x-vercel-cache: MISS
```

2. **Second Load** (CDN Hit):
```bash
curl -I https://your-domain.com/api/compat/aquarius_monkey%7Cgemini_rat
# Check: x-vercel-cache: HIT
```

3. **After Expiry** (Stale-While-Revalidate):
```bash
# Wait 6 minutes, request again
# Should serve stale instantly while revalidating in background
# Check: x-vercel-cache: STALE
```

### Browser DevTools

1. Open Network tab
2. Reload page
3. Check response headers:
   - `cache-control`: Should show our headers
   - `age`: Shows how old cached response is
   - `x-vercel-cache`: Shows cache status (HIT/MISS/STALE)

## Summary

✅ **4-layer caching**: localStorage → Browser → CDN → Origin  
✅ **Optimal headers**: 60s/300s/600s for content, 60s/60s/300s for errors  
✅ **Expected hit rate**: 90%+ (with localStorage)  
✅ **Response time**: <50ms for 90% of requests  
✅ **Cost efficient**: 90% reduction in origin calls  
✅ **User experience**: Instant loads for repeat views  

**The caching strategy is production-ready and optimized for scale!** 🚀

