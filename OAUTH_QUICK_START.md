# OAuth Quick Start Checklist

Your AstroMatch app already has Google and Apple OAuth buttons implemented! You just need to configure the OAuth providers.

## ✅ What's Already Done
- ✅ Login page with Google and Apple buttons (`app/login/page.tsx`)
- ✅ Signup page with Google and Apple buttons (`app/signup/page.tsx`)
- ✅ OAuth callback handler (`app/auth/callback/route.ts`)
- ✅ Supabase client configuration

## 📋 What You Need to Do

### Google OAuth (15-20 minutes)

1. **Google Cloud Console Setup**
   - [ ] Go to https://console.cloud.google.com/
   - [ ] Create/select a project
   - [ ] Enable Google+ API
   - [ ] Configure OAuth consent screen
   - [ ] Create OAuth 2.0 Client ID (Web application)
   - [ ] Add redirect URI: `https://umorkbxikucjlluzezhq.supabase.co/auth/v1/callback`
   - [ ] Copy Client ID and Client Secret

2. **Supabase Configuration**
   - [ ] Go to https://supabase.com/dashboard
   - [ ] Select project: `umorkbxikucjlluzezhq`
   - [ ] Navigate to Authentication > Providers
   - [ ] Enable Google provider
   - [ ] Enter Client ID and Client Secret
   - [ ] Save

### Apple Sign In (20-30 minutes)

1. **Apple Developer Console Setup**
   - [ ] Go to https://developer.apple.com/account/
   - [ ] Create App ID with "Sign In with Apple" capability
   - [ ] Create Services ID for web
   - [ ] Configure Services ID with return URL: `https://umorkbxikucjlluzezhq.supabase.co/auth/v1/callback`
   - [ ] Create Key for Sign In with Apple
   - [ ] Download .p8 key file (only once!)
   - [ ] Note Key ID and Team ID

2. **Supabase Configuration**
   - [ ] Go to Supabase Dashboard
   - [ ] Navigate to Authentication > Providers
   - [ ] Enable Apple provider
   - [ ] Enter Services ID
   - [ ] Paste .p8 key file contents as Secret Key
   - [ ] Enter Key ID
   - [ ] Enter Team ID
   - [ ] Save

## 🧪 Testing

1. **Start your dev server** (if not already running)
   ```bash
   npm run dev
   ```

2. **Test Google Sign In**
   - Go to http://localhost:3000/login
   - Click "Sign in with Google"
   - Should redirect to Google OAuth page

3. **Test Apple Sign In**
   - Go to http://localhost:3000/login
   - Click "Sign in with Apple"
   - Should redirect to Apple sign-in page

## 📚 Detailed Instructions

See `OAUTH_SETUP_GUIDE.md` for step-by-step instructions with screenshots guidance.

## 🔗 Important URLs

- **Supabase Project**: https://supabase.com/dashboard/project/umorkbxikucjlluzezhq
- **Google Cloud Console**: https://console.cloud.google.com/
- **Apple Developer Portal**: https://developer.apple.com/account/
- **OAuth Redirect URI**: `https://umorkbxikucjlluzezhq.supabase.co/auth/v1/callback`

## ⚠️ Common Issues

1. **"Redirect URI mismatch"**
   - Make sure redirect URI in Google/Apple console exactly matches: `https://umorkbxikucjlluzezhq.supabase.co/auth/v1/callback`

2. **"Invalid credentials"**
   - Double-check Client ID/Secret (Google) or Key ID/Team ID (Apple) in Supabase
   - Make sure .p8 file content is pasted correctly (no extra spaces)

3. **OAuth not working**
   - Check Supabase dashboard > Logs > Auth Logs for errors
   - Verify provider is enabled in Supabase
   - Check browser console for client-side errors

## 🚀 Next Steps After Setup

Once OAuth is configured:
1. Test both Google and Apple sign-in flows
2. Test signup flows
3. Verify users are created in Supabase Auth
4. Test on mobile devices if needed
5. Configure production redirect URIs when deploying

