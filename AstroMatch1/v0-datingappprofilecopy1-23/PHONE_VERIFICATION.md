# Phone Verification System

## 📱 Complete SMS Verification Flow

### Flow Diagram

```
User Enters Phone
     ↓
Send SMS OTP
     ↓
[OTP Entry Page]
     ↓
User Enters 6-digit Code
     ↓
Verify OTP
     ↓
Phone Verified ✓
     ↓
Redirect to App
```

---

## 🎯 Features

### Phone Input Component
```typescript
✅ Country code selector (10+ countries)
✅ Auto-formatting (e.g., (415) 555-2671)
✅ Real-time validation
✅ Visual feedback (checkmark/error)
✅ E.164 format conversion
✅ Paste support
```

### OTP Input Component
```typescript
✅ 6-digit code entry
✅ Auto-focus next digit
✅ Backspace navigation
✅ Paste entire code
✅ Auto-submit on complete
✅ Large, easy-to-tap inputs
```

### Verification Flow
```typescript
✅ Two-step process (phone → OTP)
✅ Resend with cooldown timer
✅ Change number option
✅ Error handling
✅ Loading states
✅ Success feedback
```

---

## 🚀 Setup

### 1. Enable Phone Auth in Supabase

```
Dashboard → Authentication → Providers
- Enable Phone
- Configure Twilio (or other SMS provider)
  - Account SID
  - Auth Token
  - Phone Number
```

### 2. Configure SMS Template

```
Dashboard → Authentication → Templates → SMS OTP

Your verification code is: {{ .Code }}

Valid for 10 minutes.
```

### 3. Add Rate Limiting

```
Dashboard → Authentication → Rate Limits
- Set per-hour limit (e.g., 5 SMS per phone per hour)
- Prevents abuse and reduces costs
```

---

## 📝 Usage Examples

### Basic Implementation

```typescript
import PhoneVerificationPage from "@/app/auth/verify-phone/page";

// In your route
export default PhoneVerificationPage;
```

### Standalone Phone Input

```typescript
import { PhoneInput } from "@/components/phone-input";

function MyForm() {
  const [phone, setPhone] = useState("");
  const [isValid, setIsValid] = useState(false);

  return (
    <PhoneInput
      value={phone}
      onChange={setPhone}
      onValidChange={setIsValid}
      placeholder="(555) 555-5555"
    />
  );
}
```

### Standalone OTP Input

```typescript
import { OtpInput } from "@/components/phone-input";

function VerifyCode() {
  const [otp, setOtp] = useState("");

  const handleComplete = async (code: string) => {
    // Auto-called when all 6 digits entered
    await verifyPhoneOtp(phone, code);
  };

  return (
    <OtpInput
      value={otp}
      onChange={setOtp}
      onComplete={handleComplete}
    />
  );
}
```

### Link Phone to Existing Account

```typescript
import { linkPhoneToAccount } from "@/lib/phone";

async function addPhone() {
  const phone = "+14155552671";
  
  const { error } = await linkPhoneToAccount(phone);
  
  if (!error) {
    // Show OTP entry screen
    router.push("/verify-phone");
  }
}
```

---

## 🎨 Customization

### Change OTP Length

```typescript
<OtpInput
  value={otp}
  onChange={setOtp}
  length={4} // 4-digit code
/>
```

### Custom Phone Countries

```typescript
// In components/phone-input.tsx
<select>
  <option value="+1">🇺🇸 +1</option>
  <option value="+33">🇫🇷 +33</option>
  <option value="+81">🇯🇵 +81</option>
  // Add more...
</select>
```

### Custom Styling

```typescript
<PhoneInput
  className="border-2 border-blue-500 rounded-xl"
  // ... other props
/>
```

---

## 🔒 Security Best Practices

### ✅ DO

```typescript
// Rate limiting
- Limit SMS sends per phone (e.g., 5/hour)
- Track failed verification attempts
- Block suspicious patterns

// Validation
- Always validate E.164 format on backend
- Check phone isn't already verified by another user
- Expire OTP after 10 minutes

// User Privacy
- Mask phone numbers when displaying
- Don't store OTP codes
- Clear OTP input after max attempts
```

### ❌ DON'T

```typescript
// Don't allow unlimited resends
// Don't show detailed error messages
// Don't verify without rate limits
// Don't skip E.164 validation
```

---

## 💰 Cost Management

### SMS Provider Costs

```
Twilio Pricing (approximate):
- US/Canada: $0.0079 per SMS
- International: $0.04 - $0.20 per SMS

100 verifications = ~$0.79 - $20
1,000 verifications = ~$7.90 - $200
```

### Reduce Costs

```typescript
1. Add rate limiting (prevent abuse)
2. Use longer OTP expiry (fewer resends)
3. Implement email as primary verification
4. Add phone verification only for premium features
5. Use regional SMS providers
```

---

## 🧪 Testing

### Test Phone Numbers (Twilio)

```typescript
// Use test credentials in development
const TEST_PHONES = [
  "+15005550006", // Valid, accepts any OTP
];

// In development
if (process.env.NODE_ENV === "development") {
  // Use test phone
}
```

### Manual Testing

```bash
1. Enter phone number
2. Check SMS received
3. Enter OTP code
4. Verify success redirect
5. Test resend functionality
6. Test invalid code
7. Test cooldown timer
```

---

## 🐛 Troubleshooting

### SMS not received?

```typescript
// Check Supabase logs
Dashboard → Authentication → Logs

// Common issues:
- Invalid phone format (must be E.164)
- SMS provider not configured
- Phone number blocked/invalid
- Rate limit exceeded
- Insufficient SMS credits
```

### OTP verification fails?

```typescript
// Possible reasons:
- Code expired (10 minutes)
- Invalid code format
- Already used code
- Wrong phone number
- Rate limit hit
```

### Phone already in use?

```typescript
// Each phone can only be verified by one account
// Implement unlinking flow:

async function unlinkPhone(userId: string) {
  await updateProfile(userId, {
    phone: null,
    phone_verified: false
  });
}
```

---

## 📊 Analytics

### Track Key Events

```typescript
// Phone verification started
trackEvent("phone_verification_started");

// OTP sent
trackEvent("otp_sent", { phone: maskedPhone });

// OTP verified
trackEvent("phone_verified");

// Resend clicked
trackEvent("otp_resend", { attempt: resendCount });

// Verification failed
trackEvent("verification_failed", { reason: "invalid_code" });
```

---

## 🎯 Integration Checklist

- [ ] Enabled phone auth in Supabase
- [ ] Configured SMS provider (Twilio, etc.)
- [ ] Set up rate limiting
- [ ] Customized SMS template
- [ ] Added phone verification page
- [ ] Tested with real phone number
- [ ] Tested resend functionality
- [ ] Added error handling
- [ ] Implemented cooldown timer
- [ ] Added analytics tracking
- [ ] Set up cost alerts
- [ ] Documented for team

---

## 🚀 Production Recommendations

```typescript
1. Use email as primary verification
   - Phone as optional/secondary
   
2. Add progressive verification
   - Basic features: email only
   - Premium features: phone required
   
3. Monitor costs
   - Set up billing alerts
   - Track SMS usage
   - Optimize resend rates
   
4. Improve UX
   - Auto-detect country code from IP
   - Remember last used country code
   - Support international formats
   
5. Add fallback
   - Allow email verification if SMS fails
   - Provide support contact
```

---

## 🔄 Complete Flow Example

```typescript
// 1. User wants to verify phone
router.push("/verify-phone");

// 2. Enter phone number
<PhoneInput value={phone} onChange={setPhone} />
// Validates and converts to E.164

// 3. Send OTP
await sendPhoneOtp("+14155552671");
// SMS sent via Twilio

// 4. Enter OTP code
<OtpInput value={otp} onChange={setOtp} />
// Auto-submits when complete

// 5. Verify OTP
await verifyPhoneOtp(phone, "123456");
// Updates user.phone_confirmed_at

// 6. Success!
router.push("/matches");
```

---

**🎉 Your phone verification system is complete and production-ready!** 📱✨

