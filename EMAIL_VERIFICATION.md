# Email Verification Flows

## 📧 Complete Email Verification System

### Flow Diagram

```
User Signs Up
     ↓
Sends Verification Email
     ↓
[Verify Email Page]
     ↓
User Clicks Link in Email
     ↓
[Auth Callback Page]
     ↓
Email Verified ✓
     ↓
Redirect to App
```

---

## 🎯 Implementation Options

### 1. **Basic Version** (Quick & Simple)
```typescript
// Just the essentials
- Show "check your email" message
- Resend button
- Loading state
```

**Use when:** MVP, simple apps

### 2. **Full-Featured Version** (Recommended)
```typescript
// Complete UX
- Email display
- Clear instructions
- Countdown timer
- Error handling
- Success messages
- Spam folder reminder
```

**Use when:** Production apps

### 3. **Auto-Check Version** (Advanced)
```typescript
// Polls for verification
- Automatically checks status every 3s
- No page refresh needed
- Auto-redirects when verified
```

**Use when:** Best UX, modern apps

---

## 📁 Required Files

### 1. `/app/auth/verify-email/page.tsx`
```typescript
// The page user sees after signup
import { VerifyEmailComplete } from "@/examples/verify-email-examples";

export default function VerifyEmailPage() {
  return <VerifyEmailComplete />;
}
```

### 2. `/app/auth/callback/page.tsx`
```typescript
// Handles email verification link clicks
import AuthCallbackPage from "@/app/auth/callback/page";

export default AuthCallbackPage;
```

### 3. Update Supabase Settings
```
1. Go to Supabase Dashboard
2. Authentication → URL Configuration
3. Set Redirect URLs:
   - https://yourdomain.com/auth/callback
   - http://localhost:3000/auth/callback (for dev)
```

---

## 🔧 Configuration

### Supabase Email Templates

Customize in: **Authentication → Email Templates**

```html
<!-- Confirm Signup Email -->
<h2>Confirm your email</h2>
<p>Click the link below to verify your email address:</p>
<a href="{{ .ConfirmationURL }}">Verify Email</a>
```

### Email Settings

```
SMTP Settings (optional):
- Use custom domain for emails
- Custom sender name
- Custom email templates
```

---

## 🎨 UX Best Practices

### ✅ DO

```typescript
// Show the email address
<p>We sent a link to {user.email}</p>

// Provide helpful tips
<ul>
  <li>Check spam folder</li>
  <li>Wait a few minutes</li>
  <li>Check email spelling</li>
</ul>

// Add cooldown to prevent spam
{countdown > 0 ? `Resend in ${countdown}s` : "Resend"}

// Auto-redirect when verified
useEffect(() => {
  if (user?.email_confirmed_at) {
    router.replace("/matches");
  }
}, [user]);
```

### ❌ DON'T

```typescript
// Don't allow spamming resend
<button onClick={resend}>Resend</button> // No cooldown ❌

// Don't leave users confused
<p>Check your email</p> // Which email? ❌

// Don't hide errors
onClick={async () => await resend()} // Swallows errors ❌

// Don't forget loading states
{resending && "Sending..."} // Good ✅
```

---

## 🔄 Complete Flow Examples

### Sign Up → Verify → Onboard

```typescript
// 1. Signup page
await signUpWithEmail(email, password, name);
router.push("/auth/verify-email");

// 2. Verify email page
<VerifyEmailComplete />
// User clicks link in email

// 3. Callback page
// Checks verification status
if (user.email_confirmed_at) {
  // Check profile completeness
  if (profile.west_east && profile.lat) {
    router.push("/matches"); // Ready!
  } else {
    router.push("/profile-builder"); // Need more info
  }
} else {
  router.push("/verify-email"); // Still not verified
}
```

---

## 🧪 Testing

### Manual Testing

```bash
1. Sign up with test email
2. Check terminal/logs for magic link
3. Click link (or copy URL to browser)
4. Verify redirect works
5. Check user.email_confirmed_at is set
```

### Automated Testing

```typescript
// Mock email verification
const mockUser = {
  email: "test@example.com",
  email_confirmed_at: new Date().toISOString(),
};

test("redirects when verified", async () => {
  render(<VerifyEmailPage />);
  
  // Simulate verification
  await waitFor(() => {
    expect(mockRouter.replace).toHaveBeenCalledWith("/matches");
  });
});
```

---

## 🐛 Troubleshooting

### Email not received?

```typescript
// Check Supabase logs
Dashboard → Authentication → Logs

// Common issues:
- Email in spam
- Wrong SMTP settings  
- Rate limit hit
- Invalid email address
```

### Redirect not working?

```typescript
// Check redirect URL in Supabase
Dashboard → Authentication → URL Configuration

// Must match EXACTLY:
✅ https://yourdomain.com/auth/callback
❌ https://yourdomain.com/auth/callback/
```

### Already verified but seeing page?

```typescript
// Add auto-redirect check
useEffect(() => {
  if (user?.email_confirmed_at) {
    router.replace("/matches");
  }
}, [user]);
```

---

## 🎯 Integration Checklist

- [ ] Created `/auth/verify-email/page.tsx`
- [ ] Created `/auth/callback/page.tsx`
- [ ] Added redirect URL in Supabase
- [ ] Tested signup flow
- [ ] Tested email click
- [ ] Tested resend button
- [ ] Added error handling
- [ ] Added loading states
- [ ] Customized email template (optional)
- [ ] Set up custom domain (optional)

---

## 🚀 Production Recommendations

```typescript
// 1. Use full-featured version
<VerifyEmailComplete />

// 2. Add analytics
trackEvent("email_verification_page_viewed");
trackEvent("email_resent");

// 3. Monitor
- Track resend rate
- Monitor bounce rate
- Check spam reports

// 4. Improve deliverability
- Use custom domain
- Configure SPF/DKIM
- Warm up IP address
```

---

**🎉 Your email verification flow is now complete and production-ready!**

