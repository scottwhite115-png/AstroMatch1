# Apple Sign In Troubleshooting

## Check These Settings:

### 1. Supabase Settings
- **Client IDs** field should contain: `com.astromatch.ios.web`
- Make sure there are no extra spaces or characters

### 2. Apple Developer Console
- Go to: https://developer.apple.com/account/resources/identifiers/list/serviceId
- Find your Services ID (should be `com.astromatch.ios.web`)
- Click on it
- Under "Sign In with Apple", verify:
  - Primary App ID: `com.astromatch.ios` (or AstroMatch)
  - Domains: `umorkbxikucjlluzezhq.supabase.co`
  - Return URLs: `https://umorkbxikucjlluzezhq.supabase.co/auth/v1/callback`

### 3. Common Issues:
- Services ID mismatch between Supabase and Apple
- JWT expired (though we just generated it, so unlikely)
- Services ID not properly configured in Apple Developer Console

