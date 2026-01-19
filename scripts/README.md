# Database Setup Guide

This guide will help you set up the Supabase database for your AstroMatch dating app.

## Prerequisites
- Supabase project created at https://supabase.com
- Environment variables configured in `.env.local`

## Setup Instructions

### Step 1: Access Supabase SQL Editor

1. Go to your Supabase project dashboard: https://supabase.com/dashboard/project/umorkbxikucjlluzezhq
2. Click on **SQL Editor** in the left sidebar
3. Click **New Query**

### Step 2: Run SQL Scripts in Order

Run the following scripts **in this exact order** by copying and pasting each script content into the SQL Editor and clicking "Run":

#### 1. Create Profiles Table (001_create_profiles.sql)
- Creates the main profiles table with user information
- Includes location fields (latitude, longitude) for GPS matching
- Sets up Row Level Security (RLS) policies
- **Run this first**

#### 2. Create Profile Trigger (002_profile_trigger.sql)
- Automatically creates a profile when a new user signs up
- **Run this second**

#### 3. Create Matches and Related Tables (003_create_matches_tables.sql)
- Creates matches table for storing likes/matches between users
- Creates blocked_users table for user blocking functionality
- Creates conversations and messages tables for chat functionality
- Creates notifications table
- Sets up all RLS policies
- **Run this third**

#### 4. Add Location Columns (004_add_location_columns.sql) - OPTIONAL
- **Only run this if you already have an existing profiles table without location fields**
- Adds latitude, longitude, and location_updated_at columns
- Creates distance calculation functions for finding nearby users
- Creates `find_nearby_profiles()` function for location-based matching
- **Skip this if you're starting fresh and already ran script 001**

#### 5. Add Zodiac Fields (005_add_zodiac_fields.sql)
- Adds `date_of_birth` column for storing user birthdates
- Ensures `zodiac_sign` and `chinese_zodiac` columns exist
- Creates indexes for efficient querying
- **Run this to enable the astrology matching engine**

### Step 3: Enable Email Authentication

1. In your Supabase dashboard, go to **Authentication** > **Providers**
2. Make sure **Email** provider is enabled
3. Go to **Authentication** > **URL Configuration**
4. Set your **Site URL** to: `http://localhost:3000` (for development) or your production URL
5. Add redirect URLs:
   - `http://localhost:3000/auth/verify-email`
   - Your production URL + `/auth/verify-email`

### Step 4: Configure Email Templates (Optional but Recommended)

1. Go to **Authentication** > **Email Templates**
2. Customize the email verification template to match your brand
3. Make sure the confirmation URL points to your app

## Database Schema Overview

### Tables Created:

1. **profiles** - User profile information
   - Basic info: name, age, bio
   - Astrology data: zodiac_sign, chinese_zodiac
   - Location data: latitude, longitude, location_updated_at
   - Email verification: email_verified
   - Photos and interests

2. **matches** - User matches/likes
   - Tracks who liked whom
   - Match status: pending, accepted, rejected

3. **blocked_users** - Blocked users
   - Users can block others from appearing in their matches

4. **conversations** - Chat conversations between matched users

5. **messages** - Individual messages within conversations

6. **notifications** - User notifications for matches, messages, likes

## Useful SQL Functions

### Find Nearby Users
```sql
select * from find_nearby_profiles(
  40.7128,  -- Your latitude
  -74.0060, -- Your longitude
  50        -- Radius in kilometers (default: 50km)
);
```

This function returns users within the specified radius, ordered by distance.

## Security Notes

- All tables have Row Level Security (RLS) enabled
- Users can only:
  - View their own profile data and public profiles
  - Create/update their own profile
  - View matches where they are involved
  - Block/unblock users
  - Send messages in conversations they're part of
  - View their own notifications

## Troubleshooting

### Error: "relation already exists"
- This is normal if running scripts multiple times
- The scripts use `create table if not exists` to prevent errors

### Error: "permission denied"
- Make sure you're running the scripts in the SQL Editor
- Check that RLS policies are properly set up

### Users can't see each other's profiles
- Verify the `profiles_select_others` policy exists
- Check that `auth.uid()` is working (user is logged in)

## Next Steps

After setting up the database:
1. Test user registration and login
2. Test profile creation
3. Test location updates
4. Test matching functionality

