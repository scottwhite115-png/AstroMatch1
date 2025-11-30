# AstroMatch Backend Setup Guide

This guide covers all the backend features that have been added to your AstroMatch dating app.

## ✅ What's Been Added

### 1. Supabase Authentication & Database
- Real Supabase client and server setup
- Middleware for protecting routes
- Authentication context for managing user sessions
- Environment variables configured

### 2. User Storage
- Profile storage in Supabase database
- Automatic profile creation on signup
- Row Level Security (RLS) policies for data protection

### 3. Email Verification
- Email verification flow on signup
- Auth callback handler for email confirmation
- Verification page UI
- OAuth support (Google, Facebook)

### 4. Geolocation/GPS Matching
- Browser geolocation API integration
- Location storage in database
- Distance calculation utilities
- Nearby user matching with SQL function
- Location permission component

---

## 🚀 Setup Instructions

### Step 1: Verify Environment Variables

Your `.env.local` file has been created with your Supabase credentials:
```
NEXT_PUBLIC_SUPABASE_URL=https://umorkbxikucjlluzezhq.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_key_here
```

**✅ This is already done!**

### Step 2: Set Up Database

1. Go to your Supabase SQL Editor: https://supabase.com/dashboard/project/umorkbxikucjlluzezhq/sql

2. Run the SQL scripts in this order (see `/scripts/README.md` for details):
   - `001_create_profiles.sql` - Creates profiles table
   - `002_profile_trigger.sql` - Auto-creates profiles on signup
   - `003_create_matches_tables.sql` - Creates matches, messages, etc.
   - `004_add_location_columns.sql` - Adds location functionality (if needed)

### Step 3: Configure Email Authentication

1. In Supabase Dashboard, go to **Authentication** > **Providers**
2. Enable **Email** provider (should be enabled by default)
3. Go to **Authentication** > **URL Configuration**
4. Set your Site URL:
   - Development: `http://localhost:3000`
   - Production: Your actual domain
5. Add redirect URLs:
   - `http://localhost:3000/auth/callback`
   - `http://localhost:3000/auth/verify-email`
   - (Add production URLs when deploying)

### Step 4: (Optional) Configure OAuth Providers

#### Google OAuth
1. Go to **Authentication** > **Providers** > **Google**
2. Follow Supabase's guide to set up Google OAuth
3. Add your Google Client ID and Secret

#### Facebook OAuth
1. Go to **Authentication** > **Providers** > **Facebook**
2. Follow Supabase's guide to set up Facebook OAuth
3. Add your Facebook App ID and Secret

### Step 5: Start Development Server

```bash
pnpm install  # Install dependencies if needed
pnpm dev      # Start development server
```

Visit `http://localhost:3000` and test the authentication flow!

---

## 📚 Features Overview

### Authentication

#### Sign Up
- Email/password signup with automatic email verification
- OAuth signup (Google, Facebook) - requires provider setup
- Automatic profile creation on first signup
- Email verification required before full access

#### Login
- Email/password login
- OAuth login (Google, Facebook)
- Automatic redirect to matches page after successful login

#### Middleware Protection
- Unauthenticated users redirected to `/signup`
- Authenticated users redirected away from login/signup pages
- Public paths: `/login`, `/signup`, `/auth/*`

### Location-Based Matching

#### Location Utilities (`lib/utils/geolocation.ts`)
```typescript
import { getCurrentLocation, calculateDistance, formatDistance } from '@/lib/utils/geolocation'

// Get user's current location
const location = await getCurrentLocation()

// Calculate distance between two points
const distance = calculateDistance(lat1, lon1, lat2, lon2)

// Format distance for display
const formattedDistance = formatDistance(distance) // "5.2km away"
```

#### Location Service (`lib/utils/location-service.ts`)
```typescript
import { updateUserLocation, getNearbyUsers } from '@/lib/utils/location-service'

// Update user's location in database
await updateUserLocation(userId, location)

// Find nearby users within 50km radius
const nearbyUsers = await getNearbyUsers(latitude, longitude, 50)
```

#### Location Hook (`lib/hooks/use-location.ts`)
```typescript
import { useLocation } from '@/lib/hooks/use-location'

function MyComponent() {
  const { 
    location,      // Current location data
    loading,       // Loading state
    error,         // Error state
    requestLocation // Request location permission
  } = useLocation()

  return (
    <button onClick={requestLocation}>
      Enable Location
    </button>
  )
}
```

#### Location Permission Component
```typescript
import { LocationPermission } from '@/components/location-permission'

function ProfilePage() {
  return (
    <LocationPermission 
      showCard={true}
      onLocationEnabled={() => console.log('Location enabled!')}
    />
  )
}
```

---

## 🗄️ Database Schema

### Tables Created

#### `profiles`
User profile information
- `id` - UUID (references auth.users)
- `full_name` - Text
- `bio` - Text
- `age` - Integer
- `zodiac_sign` - Text
- `chinese_zodiac` - Text
- `location` - Text (city name)
- `latitude` - Double precision
- `longitude` - Double precision
- `location_updated_at` - Timestamp
- `email_verified` - Boolean
- `interests` - Text array
- `photos` - Text array
- `created_at` - Timestamp
- `updated_at` - Timestamp

#### `matches`
User likes and matches
- `id` - UUID
- `user_id` - UUID (references profiles)
- `matched_user_id` - UUID (references profiles)
- `status` - Text (pending, accepted, rejected)
- `created_at` - Timestamp
- `updated_at` - Timestamp

#### `blocked_users`
Blocked users list
- `id` - UUID
- `user_id` - UUID (references profiles)
- `blocked_user_id` - UUID (references profiles)
- `created_at` - Timestamp

#### `conversations`
Chat conversations between matched users
- `id` - UUID
- `user1_id` - UUID
- `user2_id` - UUID
- `last_message_at` - Timestamp
- `created_at` - Timestamp

#### `messages`
Individual messages in conversations
- `id` - UUID
- `conversation_id` - UUID
- `sender_id` - UUID
- `content` - Text
- `read` - Boolean
- `created_at` - Timestamp

#### `notifications`
User notifications
- `id` - UUID
- `user_id` - UUID
- `type` - Text (match, message, like)
- `content` - JSONB
- `read` - Boolean
- `created_at` - Timestamp

### SQL Functions

#### `find_nearby_profiles(user_lat, user_lon, radius_km)`
Finds users within a specified radius, ordered by distance
```sql
SELECT * FROM find_nearby_profiles(40.7128, -74.0060, 50);
```

#### `calculate_distance(lat1, lon1, lat2, lon2)`
Calculates distance between two coordinates in kilometers
```sql
SELECT calculate_distance(40.7128, -74.0060, 34.0522, -118.2437) as distance_km;
```

---

## 🔒 Security Features

### Row Level Security (RLS)
All tables have RLS enabled with policies:
- Users can only read/write their own data
- Users can view other users' public profiles for matching
- Conversation participants can access their messages
- Blocked users are excluded from queries

### Middleware Protection
- Routes are protected by authentication middleware
- Session refresh on every request
- Automatic logout on session expiration

### Email Verification
- Users must verify email before full access
- Verification link sent automatically on signup
- Email status tracked in profile

---

## 🧪 Testing the Setup

### Test Authentication
1. Go to `/signup`
2. Create an account with email/password
3. Check your email for verification link
4. Click the link (should redirect to `/profile-builder`)
5. Try logging out and back in at `/login`

### Test Location Features
1. Log in to your account
2. Use the `LocationPermission` component on any page
3. Click "Enable Location" button
4. Grant location permission in browser
5. Check Supabase database - your location should be saved

### Test Matching
```typescript
// In any component with auth
const { user } = useAuth()
const { location } = useLocation()

if (location) {
  const nearby = await getNearbyUsers(
    location.latitude, 
    location.longitude, 
    50 // 50km radius
  )
  console.log('Nearby users:', nearby)
}
```

---

## 📝 Example Usage

### Complete Profile Setup with Location

```typescript
'use client'

import { useAuth } from '@/lib/contexts/auth-context'
import { useLocation } from '@/lib/hooks/use-location'
import { LocationPermission } from '@/components/location-permission'

export default function ProfileSetup() {
  const { user } = useAuth()
  const { location } = useLocation()

  return (
    <div>
      <h1>Welcome {user?.email}</h1>
      
      {/* Location Permission Card */}
      <LocationPermission showCard={true} />
      
      {location && (
        <p>Your location is set! You can now find matches nearby.</p>
      )}
    </div>
  )
}
```

### Find Nearby Matches

```typescript
'use client'

import { useState, useEffect } from 'react'
import { useLocation } from '@/lib/hooks/use-location'
import { getNearbyUsers } from '@/lib/utils/location-service'
import { formatDistance } from '@/lib/utils/geolocation'

export default function MatchesPage() {
  const { location } = useLocation()
  const [matches, setMatches] = useState([])

  useEffect(() => {
    if (location) {
      getNearbyUsers(location.latitude, location.longitude, 50).then(setMatches)
    }
  }, [location])

  return (
    <div>
      <h1>Nearby Matches</h1>
      {matches.map(match => (
        <div key={match.id}>
          <h3>{match.full_name}</h3>
          <p>{formatDistance(match.distance_km)}</p>
          <p>{match.zodiac_sign} • {match.chinese_zodiac}</p>
        </div>
      ))}
    </div>
  )
}
```

---

## 🐛 Troubleshooting

### "Missing Supabase environment variables"
- Check that `.env.local` exists in project root
- Restart your dev server after creating `.env.local`

### Email verification not working
- Check Supabase Auth settings
- Verify redirect URLs are configured correctly
- Check spam folder for verification email

### Location not updating
- Check browser console for geolocation errors
- Ensure HTTPS in production (geolocation requires secure context)
- Check that location permissions are granted in browser

### Can't see nearby users
- Ensure SQL scripts (especially 004) have been run
- Check that users have location data (`latitude`/`longitude` not null)
- Verify RLS policies allow viewing other profiles

---

## 🚢 Deployment

### Environment Variables
Add these to your production environment:
```
NEXT_PUBLIC_SUPABASE_URL=https://umorkbxikucjlluzezhq.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
```

### Supabase URLs
Update in Supabase dashboard:
- Site URL: Your production domain
- Redirect URLs: 
  - `https://yourdomain.com/auth/callback`
  - `https://yourdomain.com/auth/verify-email`

### Important Notes
- Geolocation requires HTTPS in production
- Configure CORS if using from mobile apps
- Consider rate limiting for location updates
- Monitor Supabase usage quotas

---

## 📞 Need Help?

- **Supabase Docs**: https://supabase.com/docs
- **Next.js Docs**: https://nextjs.org/docs
- **Geolocation API**: https://developer.mozilla.org/en-US/docs/Web/API/Geolocation_API

---

## ✨ What's Next?

Consider adding:
1. Real-time messaging with Supabase Realtime
2. Push notifications for matches
3. Advanced matching algorithm (astrological compatibility)
4. Photo upload with Supabase Storage
5. User preferences and filters
6. Report/block functionality
7. Admin dashboard

---

**🎉 Your backend is ready! Start building amazing features on top of this foundation.**

