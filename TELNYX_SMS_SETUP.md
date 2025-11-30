# 📱 Telnyx SMS Verification Setup

## Why Telnyx vs Twilio?

| Feature | Telnyx | Twilio |
|---------|--------|--------|
| SMS Cost (US) | **$0.004/message** | $0.0079/message |
| International Coverage | 200+ countries | 180+ countries |
| API Quality | Modern REST API | REST API |
| Support | 24/7 support | 24/7 support |
| **Savings** | **~50% cheaper** | - |

---

## 🚀 Setup Steps

### **Step 1: Create Telnyx Account**

1. Go to https://telnyx.com/sign-up
2. Sign up for a free account
3. Verify your email
4. Complete identity verification (required for SMS)

---

### **Step 2: Get API Key**

1. Log into Telnyx Portal: https://portal.telnyx.com
2. Go to **API Keys** (left sidebar)
3. Click **Create API Key**
4. Name it: "AstroMatch Production"
5. Copy the API Key (starts with `KEY...`)
6. **Save it securely** - you won't see it again!

---

### **Step 3: Purchase a Phone Number**

1. In Telnyx Portal, go to **Numbers → Buy Numbers**
2. Select your country (e.g., United States)
3. Choose a phone number (local or toll-free)
4. Make sure it supports **SMS** (check the checkboxes)
5. Purchase the number (usually $1-2/month)
6. **Save the phone number** - you'll need it

---

### **Step 4: Create Messaging Profile**

1. Go to **Messaging → Messaging Profiles**
2. Click **Create New Profile**
3. Name it: "AstroMatch SMS"
4. **Enable SMS** (make sure it's checked)
5. Under **Numbers**, assign your purchased phone number
6. Click **Save**
7. Copy the **Messaging Profile ID** (starts with `4000...`)

---

### **Step 5: Configure Supabase to Use Telnyx**

In Supabase Dashboard:

1. Go to **Authentication → Providers**
2. Enable **Phone**
3. Select **Custom SMS Provider**
4. Add this configuration:

**SMS Provider Endpoint:**
```
https://api.telnyx.com/v2/messages
```

**HTTP Method:**
```
POST
```

**HTTP Headers:**
```json
{
  "Authorization": "Bearer YOUR_TELNYX_API_KEY",
  "Content-Type": "application/json"
}
```

**HTTP Body:**
```json
{
  "from": "YOUR_TELNYX_PHONE_NUMBER",
  "to": "{{.To}}",
  "text": "Your AstroMatch verification code is: {{.OTP}}. Valid for 10 minutes."
}
```

**Important:**
- Replace `YOUR_TELNYX_API_KEY` with your actual API key
- Replace `YOUR_TELNYX_PHONE_NUMBER` with your purchased number (format: `+12345678900`)

---

### **Step 6: Environment Variables**

Add to `.env.local`:

```bash
# Telnyx Configuration
TELNYX_API_KEY=KEY...your-key-here
TELNYX_PHONE_NUMBER=+12345678900
TELNYX_MESSAGING_PROFILE_ID=4000...your-profile-id
```

---

## 🔧 Alternative: Custom Telnyx Integration

If you want more control, you can integrate Telnyx directly in your code instead of through Supabase.

### **Install Telnyx SDK**

```bash
npm install telnyx
```

### **Update `/lib/phone.ts`**

Replace Twilio code with Telnyx:

```typescript
import Telnyx from 'telnyx'

const telnyx = Telnyx(process.env.TELNYX_API_KEY!)

export async function sendPhoneOtp(phoneNumber: string): Promise<{ error?: Error }> {
  try {
    // Generate 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString()
    
    // Store OTP in database (Supabase table or Redis)
    await storeOtp(phoneNumber, otp, 600) // 10 minutes expiry
    
    // Send SMS via Telnyx
    await telnyx.messages.create({
      from: process.env.TELNYX_PHONE_NUMBER!,
      to: phoneNumber,
      text: `Your AstroMatch verification code is: ${otp}. Valid for 10 minutes.`
    })
    
    return { error: undefined }
  } catch (error) {
    console.error('Telnyx SMS error:', error)
    return { error: error as Error }
  }
}

export async function verifyPhoneOtp(phoneNumber: string, code: string): Promise<{ error?: Error }> {
  try {
    // Verify OTP from database
    const isValid = await verifyStoredOtp(phoneNumber, code)
    
    if (!isValid) {
      throw new Error('Invalid or expired code')
    }
    
    // Mark phone as verified in Supabase profiles table
    await markPhoneVerified(phoneNumber)
    
    return { error: undefined }
  } catch (error) {
    console.error('OTP verification error:', error)
    return { error: error as Error }
  }
}

// Helper functions
async function storeOtp(phone: string, otp: string, expirySeconds: number) {
  const supabase = createClient()
  const expiresAt = new Date(Date.now() + expirySeconds * 1000)
  
  await supabase
    .from('phone_otps')
    .upsert({
      phone_number: phone,
      otp_code: otp,
      expires_at: expiresAt.toISOString(),
      created_at: new Date().toISOString()
    })
}

async function verifyStoredOtp(phone: string, code: string): Promise<boolean> {
  const supabase = createClient()
  
  const { data, error } = await supabase
    .from('phone_otps')
    .select('*')
    .eq('phone_number', phone)
    .eq('otp_code', code)
    .gt('expires_at', new Date().toISOString())
    .single()
  
  if (error || !data) return false
  
  // Delete OTP after successful verification
  await supabase
    .from('phone_otps')
    .delete()
    .eq('phone_number', phone)
  
  return true
}

async function markPhoneVerified(phone: string) {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  
  if (user) {
    await supabase
      .from('profiles')
      .update({
        phone: phone,
        phone_verified: true
      })
      .eq('id', user.id)
  }
}
```

---

## 📊 Database Table for OTP Storage

Create table for storing OTPs:

```sql
-- scripts/supabase/007_create_phone_otps.sql

CREATE TABLE IF NOT EXISTS public.phone_otps (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  phone_number TEXT NOT NULL,
  otp_code TEXT NOT NULL,
  expires_at TIMESTAMPTZ NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(phone_number)
);

CREATE INDEX idx_phone_otps_phone ON public.phone_otps(phone_number);
CREATE INDEX idx_phone_otps_expires ON public.phone_otps(expires_at);

-- Auto-delete expired OTPs (optional cleanup job)
CREATE OR REPLACE FUNCTION public.delete_expired_otps()
RETURNS void AS $$
BEGIN
  DELETE FROM public.phone_otps
  WHERE expires_at < NOW();
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Run cleanup every hour (using pg_cron extension)
-- SELECT cron.schedule('delete-expired-otps', '0 * * * *', 'SELECT delete_expired_otps()');
```

---

## 💰 Cost Comparison Example

**Scenario:** 1,000 new users/month, each needs 1 SMS for verification

### Twilio Cost:
```
1,000 SMS × $0.0079 = $7.90/month
12,000 SMS/year × $0.0079 = $94.80/year
```

### Telnyx Cost:
```
1,000 SMS × $0.004 = $4.00/month
12,000 SMS/year × $0.004 = $48.00/year
```

### Savings:
```
$7.90 - $4.00 = $3.90/month saved (~49% cheaper)
$94.80 - $48.00 = $46.80/year saved
```

**At 10,000 users/month:**
- Twilio: $79/month ($948/year)
- Telnyx: $40/month ($480/year)
- **Savings: $468/year** 💰

---

## ✅ Testing Telnyx Integration

### Test SMS Sending

```bash
curl -X POST "https://api.telnyx.com/v2/messages" \
  -H "Authorization: Bearer YOUR_TELNYX_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "from": "+12345678900",
    "to": "+YOUR_PHONE_NUMBER",
    "text": "Test message from AstroMatch! Your code is: 123456"
  }'
```

### Expected Response

```json
{
  "data": {
    "id": "...",
    "to": ["+1234567890"],
    "from": "+12345678900",
    "text": "Test message from AstroMatch! Your code is: 123456",
    "status": "queued",
    "cost": {
      "amount": "0.004",
      "currency": "USD"
    }
  }
}
```

---

## 🔐 Security Best Practices

1. **Never expose API keys** - Use environment variables
2. **Rate limiting** - Limit SMS requests per phone number (e.g., 3 per hour)
3. **Phone validation** - Verify phone format before sending
4. **OTP expiry** - 10 minutes max
5. **One-time use** - Delete OTP after successful verification
6. **Block disposable numbers** - Use Telnyx's number lookup API

---

## 📞 Telnyx Support

- **Documentation:** https://developers.telnyx.com/docs/api/v2/messaging
- **Portal:** https://portal.telnyx.com
- **Support:** support@telnyx.com
- **Status Page:** https://status.telnyx.com

---

## 🚀 Next Steps

1. [ ] Create Telnyx account
2. [ ] Get API key
3. [ ] Purchase phone number
4. [ ] Create messaging profile
5. [ ] Configure Supabase OR implement custom integration
6. [ ] Create `phone_otps` table (if using custom integration)
7. [ ] Test sending SMS to your phone
8. [ ] Update environment variables for production
9. [ ] Monitor costs in Telnyx dashboard

---

## ⚠️ Important Notes

- **International SMS costs more** - Check Telnyx pricing page
- **Number verification required** - May take 1-2 business days
- **10DLC registration (US)** - Required for high volume (5,000+ SMS/day)
- **Keep phone number active** - Don't let it expire or you'll lose it

---

**Cost Savings: ~50% cheaper than Twilio! 💰**

Let me know if you need help with any step!

