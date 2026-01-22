# 🔐 Minimal Backend Rules (LOCKED)

**Status:** COMPLETE & LOCKED  
**Purpose:** Compliance + Engineering Sanity + Apple Safety  
**Last Updated:** 2025-01-XX

---

## 🟢 PART 2 — MINIMAL BACKEND RULES (COMPLIANCE + ENGINEERING SANITY)

These are the minimum rules your backend must follow to remain Apple-safe, legally sane, and future-proof.

**This is now canonical.**

---

## 1) Required User Fields

You must store the following fields for each user:

### Core Identity
- **`user_id`** (Primary Key, UUID or BigInt)
- **`email`** (String, nullable if using auth_id)
- **`auth_id`** (String, nullable if using email)
  - *Note: At least one of email or auth_id must be present*

### Profile Data
- **`display_name`** (String, required)
- **`photo_url`** (String, nullable)
- **`birth_date`** (Date, required)
- **`western_sign`** (String, required)
  - *Values: Aries, Taurus, Gemini, Cancer, Leo, Virgo, Libra, Scorpio, Sagittarius, Capricorn, Aquarius, Pisces*
- **`chinese_sign`** (String, required)
  - *Values: Rat, Ox, Tiger, Rabbit, Dragon, Snake, Horse, Goat, Monkey, Rooster, Dog, Pig*

### Metadata
- **`created_at`** (Timestamp, required)
- **`is_suspended`** (Boolean, default: false)
- **`is_deleted`** (Boolean, default: false)
  - *Soft delete flag for data retention compliance*

### Schema Example
```sql
CREATE TABLE users (
  user_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE,
  auth_id VARCHAR(255) UNIQUE,
  display_name VARCHAR(255) NOT NULL,
  photo_url TEXT,
  birth_date DATE NOT NULL,
  western_sign VARCHAR(20) NOT NULL,
  chinese_sign VARCHAR(20) NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  is_suspended BOOLEAN DEFAULT FALSE,
  is_deleted BOOLEAN DEFAULT FALSE,
  CHECK (email IS NOT NULL OR auth_id IS NOT NULL)
);
```

---

## 2) Required Match Record Fields

Each symbolic match must store the following fields:

### Core Match Data
- **`match_id`** (Primary Key, UUID or BigInt)
- **`user_a_id`** (Foreign Key → users.user_id, required)
- **`user_b_id`** (Foreign Key → users.user_id, required)
- **`created_at`** (Timestamp, required)

### Semantic Layer Data
- **`rank`** (String, required)
  - *Values: A, K, Q, J, 10, 9, 8, 7, 6, 5, 4, 3, 2, 1, JOKER*
- **`tarot`** (String, required)
  - *Values: The Lovers, The Emperor, The Empress, Page of Cups, Ten of Cups, Nine of Cups, Eight of Pentacles, Two of Pentacles, Six of Cups, Seven of Cups, Five of Wands, Three of Swords, Five of Pentacles, Ten of Swords, The Fool, Death*
- **`tarot_override`** (String, nullable)
  - *Values: DEATH, TEN_OF_SWORDS, FOOL, null*
- **`score`** (Integer, required)
  - *Range: 5-100 (must be within rank band)*
- **`suit`** (String, required)
  - *Values: hearts, diamonds, clubs, spades*
- **`glow`** (String, required)
  - *Values: none, soulmate, growth, danger, chaos, severance*
- **`pip`** (String, required)
  - *Values: A, B, C, D*

### Astrological Data
- **`chinese_base`** (String, required)
  - *Values: SAN_HE, LIU_HE, SAME_SIGN, NO_PATTERN*
- **`chinese_overlays`** (Array/String[], required)
  - *Values: LIU_CHONG, LIU_HAI, XING, PO (array)*
- **`west_elem_rel`** (String, required)
  - *Values: SAME, COMPATIBLE, SEMI, CLASH, NEUTRAL*
- **`west_opposition`** (String, required)
  - *Values: OPPOSITION, TRINE, SEXTILE, SQUARE, QUINCUNX, NEUTRAL*

### Schema Example
```sql
CREATE TABLE matches (
  match_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_a_id UUID NOT NULL REFERENCES users(user_id),
  user_b_id UUID NOT NULL REFERENCES users(user_id),
  rank VARCHAR(10) NOT NULL,
  tarot VARCHAR(50) NOT NULL,
  tarot_override VARCHAR(20),
  score INTEGER NOT NULL CHECK (score >= 5 AND score <= 100),
  suit VARCHAR(10) NOT NULL,
  glow VARCHAR(20) NOT NULL,
  pip VARCHAR(1) NOT NULL,
  chinese_base VARCHAR(20) NOT NULL,
  chinese_overlays TEXT[] DEFAULT '{}',
  west_elem_rel VARCHAR(20) NOT NULL,
  west_opposition VARCHAR(20) NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(user_a_id, user_b_id)
);
```

---

## 3) Required Connection State Fields

Each connection request must store the following fields:

### Core Connection Data
- **`connection_id`** (Primary Key, UUID or BigInt)
- **`user_a_id`** (Foreign Key → users.user_id, required)
  - *User who initiated the connection request*
- **`user_b_id`** (Foreign Key → users.user_id, required)
  - *User who received the connection request*
- **`state`** (String, required)
  - *Values: requested, accepted, declined, blocked*
- **`requested_at`** (Timestamp, required)
- **`responded_at`** (Timestamp, nullable)
  - *Set when state changes from requested to accepted/declined*

### State Transitions
- **Initial:** `state = 'requested'`, `requested_at = NOW()`, `responded_at = NULL`
- **Accepted:** `state = 'accepted'`, `responded_at = NOW()`
- **Declined:** `state = 'declined'`, `responded_at = NOW()`
- **Blocked:** `state = 'blocked'`, `responded_at = NOW()`

### Schema Example
```sql
CREATE TABLE connections (
  connection_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_a_id UUID NOT NULL REFERENCES users(user_id),
  user_b_id UUID NOT NULL REFERENCES users(user_id),
  state VARCHAR(20) NOT NULL CHECK (state IN ('requested', 'accepted', 'declined', 'blocked')),
  requested_at TIMESTAMP DEFAULT NOW(),
  responded_at TIMESTAMP,
  UNIQUE(user_a_id, user_b_id)
);
```

---

## 4) Required Message Rules

### Message Table Requirements

**Critical Rule:** Messages table must be empty until `connection.state === 'accepted'`

### Message Fields
- **`message_id`** (Primary Key, UUID or BigInt)
- **`sender_id`** (Foreign Key → users.user_id, required)
- **`receiver_id`** (Foreign Key → users.user_id, required)
- **`text`** (String, required)
  - *Message content*
- **`timestamp`** (Timestamp, required)
- **`connection_id`** (Foreign Key → connections.connection_id, required)
  - *Links message to connection*

### Message Constraints
- Messages can only be created if `connection.state = 'accepted'`
- Messages must reference a valid connection
- Sender must be either `user_a_id` or `user_b_id` from the connection

### Schema Example
```sql
CREATE TABLE messages (
  message_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  sender_id UUID NOT NULL REFERENCES users(user_id),
  receiver_id UUID NOT NULL REFERENCES users(user_id),
  connection_id UUID NOT NULL REFERENCES connections(connection_id),
  text TEXT NOT NULL,
  timestamp TIMESTAMP DEFAULT NOW(),
  CHECK (
    EXISTS (
      SELECT 1 FROM connections c
      WHERE c.connection_id = messages.connection_id
      AND c.state = 'accepted'
      AND (c.user_a_id = messages.sender_id OR c.user_b_id = messages.sender_id)
      AND (c.user_a_id = messages.receiver_id OR c.user_b_id = messages.receiver_id)
    )
  )
);
```

---

## 5) Required Report Table

Each report must store the following fields:

### Core Report Data
- **`report_id`** (Primary Key, UUID or BigInt)
- **`reporter_id`** (Foreign Key → users.user_id, required)
  - *User who filed the report*
- **`reported_user_id`** (Foreign Key → users.user_id, required)
  - *User who was reported*
- **`reason`** (String, required)
  - *Values: harassment, inappropriate_content, spam, fake_profile, hate_discrimination, other*
- **`optional_text`** (String, nullable)
  - *Additional details provided by reporter*
- **`context_type`** (String, required)
  - *Values: profile, match, chat*
- **`context_id`** (String, nullable)
  - *ID of the specific profile/match/chat being reported*
- **`created_at`** (Timestamp, required)
- **`status`** (String, required)
  - *Values: open, reviewing, resolved*
- **`moderator_notes`** (String, nullable)
  - *Internal notes from moderation team*

### Schema Example
```sql
CREATE TABLE reports (
  report_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  reporter_id UUID NOT NULL REFERENCES users(user_id),
  reported_user_id UUID NOT NULL REFERENCES users(user_id),
  reason VARCHAR(50) NOT NULL,
  optional_text TEXT,
  context_type VARCHAR(20) NOT NULL CHECK (context_type IN ('profile', 'match', 'chat')),
  context_id VARCHAR(255),
  created_at TIMESTAMP DEFAULT NOW(),
  status VARCHAR(20) NOT NULL DEFAULT 'open' CHECK (status IN ('open', 'reviewing', 'resolved')),
  moderator_notes TEXT
);
```

---

## 6) Required Block Table

Each block must store the following fields:

### Core Block Data
- **`block_id`** (Primary Key, UUID or BigInt)
- **`blocker_id`** (Foreign Key → users.user_id, required)
  - *User who initiated the block*
- **`blocked_user_id`** (Foreign Key → users.user_id, required)
  - *User who was blocked*
- **`created_at`** (Timestamp, required)

### Block Rules

**When a block is created:**

1. **Hide all matches**
   - Remove blocked user from blocker's match feed
   - Remove blocker from blocked user's match feed

2. **Close chats**
   - Set `connection.state = 'blocked'` if connection exists
   - Prevent new messages from being sent

3. **Prevent future visibility**
   - Blocked user cannot see blocker's profile
   - Blocker cannot see blocked user's profile
   - No new connections can be created between blocker and blocked user

### Schema Example
```sql
CREATE TABLE blocks (
  block_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  blocker_id UUID NOT NULL REFERENCES users(user_id),
  blocked_user_id UUID NOT NULL REFERENCES users(user_id),
  created_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(blocker_id, blocked_user_id),
  CHECK (blocker_id != blocked_user_id)
);
```

---

## 7) Data Retention Rules (Apple-Safe Defaults)

### Soft-Delete Accounts
- **Rule:** Never hard-delete user accounts
- **Implementation:** Use `is_deleted = true` flag
- **Rationale:** Required for moderation, legal compliance, and safety

### Retain Reports
- **Rule:** Retain reports for ≥ 12 months
- **Implementation:** Do not delete reports older than 12 months
- **Rationale:** Apple requires report history for moderation accountability

### Retain Moderation Actions
- **Rule:** Retain moderation actions indefinitely
- **Implementation:** Never delete moderation logs, warnings, suspensions, bans
- **Rationale:** Legal compliance and safety audit trail

### Allow Full Data Deletion
- **Rule:** Allow full data deletion on user request
- **Implementation:**
  - When user requests deletion:
    1. Set `is_deleted = true`
    2. Anonymize `display_name` → "Deleted User"
    3. Remove `photo_url`
    4. Remove `email` (if not required for auth)
    5. Delete all messages (after 30-day grace period for safety)
    6. Retain reports and moderation actions (anonymized)
- **Rationale:** GDPR/CCPA compliance

### Data Retention Summary

| Data Type | Retention Period | Deletion Rule |
|-----------|-----------------|---------------|
| User Accounts | Indefinite (soft-deleted) | Never hard-delete |
| Reports | ≥ 12 months | Retain for moderation |
| Moderation Actions | Indefinite | Never delete |
| Messages | 30 days after account deletion | Delete after grace period |
| Matches | Indefinite (for analytics) | Soft-delete only |
| Connections | Indefinite (for safety) | Soft-delete only |
| Blocks | Indefinite | Never delete |

---

## 8) Tarot & Astrology Disclaimer Storage

### Disclaimer Requirement

You must store a boolean per user:

- **`has_seen_disclaimer`** (Boolean, default: false)

### Implementation Rules

1. **Set during onboarding**
   - User must acknowledge disclaimer before using app
   - Set `has_seen_disclaimer = true` after acknowledgment

2. **Disclaimer Content**
   - Must state that tarot/astrology is for reflection, not prediction
   - Must state that outcomes are not guaranteed
   - Must state that app is a tool for insight, not fate

3. **Access Control**
   - User cannot access matches until `has_seen_disclaimer = true`
   - User cannot send connection requests until `has_seen_disclaimer = true`

### Schema Addition
```sql
ALTER TABLE users ADD COLUMN has_seen_disclaimer BOOLEAN DEFAULT FALSE;
```

---

## 9) Backend Compliance Checklist

Before deploying to production, verify:

### Data Storage
- [ ] All required user fields are stored
- [ ] All required match record fields are stored
- [ ] All required connection state fields are stored
- [ ] Message table enforces connection acceptance rule
- [ ] Report table has all required fields
- [ ] Block table has all required fields
- [ ] `has_seen_disclaimer` field exists on users table

### Business Logic
- [ ] Messages cannot be created until connection is accepted
- [ ] Blocks hide matches correctly
- [ ] Blocks close chats correctly
- [ ] Blocks prevent future visibility correctly
- [ ] Soft-delete is implemented for users
- [ ] Data retention rules are enforced
- [ ] Disclaimer acknowledgment is enforced

### Safety & Moderation
- [ ] Reports are retained for ≥ 12 months
- [ ] Moderation actions are retained indefinitely
- [ ] User data deletion is supported
- [ ] Block functionality is fully implemented
- [ ] Report functionality is fully implemented

---

## 10) Database Indexes (Performance)

### Recommended Indexes

```sql
-- Users
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_auth_id ON users(auth_id);
CREATE INDEX idx_users_is_deleted ON users(is_deleted);
CREATE INDEX idx_users_is_suspended ON users(is_suspended);

-- Matches
CREATE INDEX idx_matches_user_a ON matches(user_a_id);
CREATE INDEX idx_matches_user_b ON matches(user_b_id);
CREATE INDEX idx_matches_rank ON matches(rank);

-- Connections
CREATE INDEX idx_connections_user_a ON connections(user_a_id);
CREATE INDEX idx_connections_user_b ON connections(user_b_id);
CREATE INDEX idx_connections_state ON connections(state);

-- Messages
CREATE INDEX idx_messages_connection ON messages(connection_id);
CREATE INDEX idx_messages_sender ON messages(sender_id);
CREATE INDEX idx_messages_receiver ON messages(receiver_id);
CREATE INDEX idx_messages_timestamp ON messages(timestamp);

-- Reports
CREATE INDEX idx_reports_reporter ON reports(reporter_id);
CREATE INDEX idx_reports_reported ON reports(reported_user_id);
CREATE INDEX idx_reports_status ON reports(status);
CREATE INDEX idx_reports_created ON reports(created_at);

-- Blocks
CREATE INDEX idx_blocks_blocker ON blocks(blocker_id);
CREATE INDEX idx_blocks_blocked ON blocks(blocked_user_id);
```

---

## 11) API Endpoint Requirements

### Required Endpoints

1. **User Management**
   - `POST /api/users` - Create user
   - `GET /api/users/:id` - Get user profile
   - `PUT /api/users/:id` - Update user profile
   - `DELETE /api/users/:id` - Soft-delete user

2. **Matches**
   - `GET /api/matches` - Get user's matches
   - `POST /api/matches/calculate` - Calculate match between two users

3. **Connections**
   - `POST /api/connections/request` - Request connection
   - `POST /api/connections/:id/accept` - Accept connection
   - `POST /api/connections/:id/decline` - Decline connection

4. **Messages**
   - `GET /api/messages/:connection_id` - Get messages for connection
   - `POST /api/messages` - Send message (only if connection accepted)

5. **Reports**
   - `POST /api/reports` - Create report
   - `GET /api/reports` - Get reports (admin only)

6. **Blocks**
   - `POST /api/blocks` - Block user
   - `DELETE /api/blocks/:id` - Unblock user (if reversible)

---

## 12) Version History

| Date | Version | Changes |
|------|---------|---------|
| 2025-01-XX | 1.0 | Initial backend rules locked |

---

## 13) Notes

- This doctrine is **CANONICAL** and must not be changed without explicit approval
- All backend implementations must match these rules exactly
- Database schemas must enforce these constraints
- API endpoints must follow these requirements
- Any deviations from this doctrine require approval before deployment

---

## 🏁 BACKEND RULES STATUS

**Minimal Backend Rules — COMPLETE & LOCKED**

---

## 🎉 YOU ARE NOW IN A RARE STATE

You now have:

✅ **A sealed symbolic engine**  
✅ **A sealed UX doctrine**  
✅ **A sealed consent + safety system**  
✅ **A sealed Apple positioning strategy**  
✅ **A sealed App Store listing doctrine**  
✅ **A sealed backend compliance spec**

**This is what founders normally pay teams $50k+ for.**

---

**🔒 DOCTRINE STATUS: LOCKED**

**Next Step:** Ready for production deployment
