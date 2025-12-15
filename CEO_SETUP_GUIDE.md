# CEO/OWNER Setup Guide

## ✅ Step 1: Environment Variable (DONE)

Added to `.env.local`:
```bash
ASTROMATCH_OWNER_EMAIL=scottwhite115@gmail.com
```

This email will be **auto-promoted to OWNER role** on first login.

---

## 📋 Quick Test Checklist

### 1. **Restart Dev Server**
```bash
# Stop current server (Ctrl+C)
npm run dev
# Or
yarn dev
```

The new environment variable needs to be loaded.

### 2. **Sign Up / Log In**
- Go to your app
- Sign up or log in with: `scottwhite115@gmail.com`
- Complete profile setup if needed

### 3. **Check Profile Tabs**
Navigate to `/profile/account` or `/profile/profile`

**You should now see:**
```
Profile | Account | Backoffice
```

If the "Backoffice" tab appears → ✅ Auto-promotion worked!

### 4. **Access Admin Dashboard**
Click "Backoffice" or go to: `/admin`

**You should see:**
- ✅ Admin Dashboard with two cards:
  - User Management
  - Content Moderation
- ✅ Your role displayed as "Owner Access"

### 5. **Check User List**
Go to `/admin/users`

**You should see:**
- ✅ Yourself listed in the table
- ✅ Your role badge showing "OWNER" (yellow/gold color)
- ✅ Status showing "Active" (green)
- ✅ Search and filter controls
- ✅ Stats showing 1 user (you)

### 6. **Test User Detail Page**
Click "View Details →" on your own profile

**You should see:**
- ✅ Your profile information
- ✅ Warning: "This is your account - You cannot modify your own account"
- ✅ Controls are disabled (as expected)

### 7. **Create Test User** (Optional)
- Sign up with a different email in incognito/private window
- Go back to `/admin/users` as the owner
- You should see the new user listed as "USER" role
- Click their detail page
- You should see full admin controls:
  - Suspend for 1 Week
  - Permanent Ban
  - Change Role (dropdown)

---

## 🔄 What Happens Automatically

### On First Login with `scottwhite115@gmail.com`:

1. **Auto-Promotion Flow:**
   ```typescript
   // lib/auth-helpers.ts → getCurrentProfileWithRole()
   
   if (user.email === ASTROMATCH_OWNER_EMAIL) {
     if (profile.role !== "OWNER") {
       profile = update({ role: "OWNER", isStaff: true })
     }
   }
   ```

2. **Database Changes:**
   ```sql
   -- Your profile gets updated:
   UPDATE profiles 
   SET 
     role = 'OWNER',
     isStaff = true
   WHERE email = 'scottwhite115@gmail.com';
   ```

3. **UI Changes:**
   - "Backoffice" tab appears in profile navigation
   - `/admin` routes become accessible
   - 3-dot menus appear on community posts
   - Full moderation controls visible

---

## 🎯 Expected Behavior by Role

### **OWNER (You):**
- ✅ See "Backoffice" tab
- ✅ Access `/admin` dashboard
- ✅ View all users in `/admin/users`
- ✅ Suspend/ban/unban any user (except yourself)
- ✅ Change roles (promote USER ↔ ADMIN)
- ✅ See 3-dot menu on all community posts
- ✅ Hide/unhide posts
- ✅ Ban post authors directly from feed

### **ADMIN (Promoted by Owner):**
- ✅ See "Backoffice" tab
- ✅ Access `/admin` dashboard
- ✅ View all users
- ✅ Suspend/ban/unban users
- ❌ Cannot change roles (Owner-only)
- ✅ See 3-dot menu on posts
- ✅ Hide/unhide posts
- ✅ Ban post authors

### **USER (Regular Members):**
- ❌ No "Backoffice" tab
- ❌ No access to `/admin` (redirected)
- ❌ No 3-dot menu on posts
- ❌ No moderation controls
- ✅ Normal app access

---

## 🧪 Testing Scenarios

### Test 1: Owner Auto-Promotion
```bash
1. Start dev server
2. Log in as scottwhite115@gmail.com
3. Go to /admin/users
4. Check your role is "OWNER"
✅ PASS if you see yourself as OWNER
```

### Test 2: Promote Someone to Admin
```bash
1. Sign up test user: test@example.com
2. As owner, go to /admin/users/[test-user-id]
3. Select "Admin" from dropdown
4. Click "Change Role"
5. Confirm
6. Check role updated to "ADMIN"
✅ PASS if role changes and isStaff = true
```

### Test 3: Suspend a User
```bash
1. Go to /admin/users/[test-user-id]
2. Click "Suspend for 1 Week"
3. Confirm
4. Status should show "SUSPENDED"
5. Log in as that test user
6. Try to create a post
7. Should see error: "Account suspended"
✅ PASS if suspended user can't post
```

### Test 4: Ban from Post
```bash
1. Create a test post as test user
2. Log in as owner
3. Go to community feed
4. See 3-dot menu on test user's post
5. Click → "Suspend 1 week"
6. Confirm
7. Check /admin/users/[test-user-id]
8. Status should be "SUSPENDED"
✅ PASS if user is suspended
```

### Test 5: Regular User Can't Access Admin
```bash
1. Sign up as regular@example.com
2. Try to go to /admin
3. Should redirect to / or /community
4. No "Backoffice" tab should appear
✅ PASS if redirected
```

---

## 🐛 Troubleshooting

### "Backoffice tab doesn't appear"

**Check:**
1. `.env.local` has `ASTROMATCH_OWNER_EMAIL=scottwhite115@gmail.com`
2. Dev server restarted after adding env var
3. Logged in with exact email: `scottwhite115@gmail.com`
4. Check database:
   ```sql
   SELECT email, role, isStaff FROM profiles 
   WHERE email = 'scottwhite115@gmail.com';
   ```
5. Should show: `role = 'OWNER', isStaff = true`

### "Redirected from /admin"

**Check:**
1. Your profile role in database
2. `getCurrentProfileWithRole()` is being called
3. Check browser console for errors
4. Verify Supabase auth is working

### "Can't see 3-dot menu on posts"

**Check:**
1. `canModerate` prop is true
2. Your role is ADMIN or OWNER
3. Component is receiving correct role
4. `PostAdminActions` component is imported

### "Role won't change"

**Check:**
1. Only OWNER can change roles
2. Can't change your own role
3. Can't change another OWNER's role
4. Check API endpoint: `/api/admin/users/change-role`

---

## 📊 Database Verification

After logging in, verify in your database:

```sql
-- Check your profile
SELECT 
  email, 
  role, 
  isStaff, 
  status, 
  created_at 
FROM profiles 
WHERE email = 'scottwhite115@gmail.com';

-- Expected result:
-- email: scottwhite115@gmail.com
-- role: OWNER
-- isStaff: true
-- status: ACTIVE
-- created_at: [your signup date]
```

---

## 🎉 Success Criteria

You'll know everything is working when:

✅ "Backoffice" tab appears in profile navigation  
✅ `/admin` dashboard is accessible  
✅ Your role shows as "OWNER" in `/admin/users`  
✅ You can view any user's detail page  
✅ Admin controls work (suspend/ban/promote)  
✅ 3-dot menu appears on community posts  
✅ You can hide posts and ban users from feed  
✅ Regular users can't access admin areas  
✅ Suspended users can't post or comment  

---

## 🚀 Next Steps After Setup

Once you confirm it's working:

1. **Invite an Admin:**
   - Sign up with your admin's email
   - As OWNER, go to their user detail page
   - Change role to "ADMIN"
   - They'll see Backoffice tab on next login

2. **Run Database Migration:**
   ```bash
   npx prisma migrate dev --name add_moderation_system
   npx prisma generate
   ```

3. **Deploy to Production:**
   ```bash
   # Add env var to Vercel:
   vercel env add ASTROMATCH_OWNER_EMAIL
   # Enter: scottwhite115@gmail.com
   
   # Deploy:
   git push
   ```

4. **Test in Production:**
   - Log in with owner email
   - Verify auto-promotion works
   - Check admin dashboard
   - Test moderation features

---

## 📝 Summary

**What You Just Got:**

- ✅ Auto-promotion to OWNER role
- ✅ Complete admin dashboard
- ✅ User management interface
- ✅ In-feed moderation (3-dot menu)
- ✅ Suspend/ban/unban system
- ✅ Auto-unban after 1 week
- ✅ Role management (promote to ADMIN)
- ✅ Write action guards (block suspended users)
- ✅ Beautiful, production-ready UI

**Your Email:** `scottwhite115@gmail.com`  
**Your Role:** OWNER (CEO)  
**Your Powers:** Everything 🎯

Now go test it! 🚀

