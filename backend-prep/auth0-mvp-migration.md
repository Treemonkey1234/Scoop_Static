# Auth0 MVP Migration Guide

## Overview
This guide shows how to migrate your existing Auth0 setup to support the MVP backend while preserving your current demo environment.

## 🎯 Migration Strategy

### Current State
- **Existing Auth0 Tenant**: `dev-av6q4m54qqcs5n00.us.auth0.com`
- **Current Application**: Demo frontend with social connections
- **Current Users**: Demo accounts with existing social connections

### Target MVP State
- **Same Auth0 Tenant**: `dev-av6q4m54qqcs5n00.us.auth0.com` ✅
- **New Application**: MVP backend API + frontend
- **User Migration**: Fresh start for beta users (demo preserved)
- **Social Connections**: Reuse existing Facebook, Google, LinkedIn, Twitter

## 📋 Step-by-Step Migration Process

### Step 1: Create New Auth0 Application for MVP

**In your Auth0 Dashboard:**

1. **Navigate to Applications**
   - Go to Applications section
   - Click "Create Application"

2. **Application Configuration**
   ```
   Name: Scoop Social MVP Backend
   Type: Machine to Machine
   APIs: Create new API (see Step 2)
   ```

3. **Application Settings**
   ```
   Application Type: Single Page Application
   Token Endpoint Authentication Method: None
   Allowed Callback URLs: 
     https://app.scoopsocials.com/api/auth/callback
     http://localhost:3000/api/auth/callback (for development)
   
   Allowed Logout URLs:
     https://app.scoopsocials.com
     http://localhost:3000 (for development)
   
   Allowed Web Origins:
     https://app.scoopsocials.com
     http://localhost:3000 (for development)
   
   Allowed Origins (CORS):
     https://app.scoopsocials.com
     https://api.scoopsocials.com
     http://localhost:3000 (for development)
     http://localhost:3001 (for development)
   ```

### Step 2: Create API Configuration

**Create New API:**
1. **Navigate to APIs**
   - Click "Create API"

2. **API Configuration**
   ```
   Name: Scoop Social MVP API
   Identifier: https://api.scoopsocials.com
   Signing Algorithm: RS256
   ```

3. **API Settings**
   ```
   Enable RBAC: Yes
   Add Permissions in the Access Token: Yes
   Allow Skipping User Consent: Yes
   Allow Offline Access: Yes
   ```

4. **API Scopes (Permissions)**
   ```
   read:profile - Read user profile data
   write:profile - Update user profile data
   read:social-accounts - Read connected social accounts
   write:social-accounts - Connect/disconnect social accounts
   read:reviews - Read reviews and ratings
   write:reviews - Create reviews and ratings
   read:events - Read events
   write:events - Create and manage events
   read:friends - Read friend connections
   write:friends - Manage friend requests
   read:trust-score - Read trust score data
   admin:platform - Platform administration (for moderators)
   ```

### Step 3: Configure Social Connections

**Reuse Existing Social Connections:**

Your existing social connections will work automatically with the new application. The test keys from Auth0 include:

1. **Google OAuth2**
   - Uses Auth0's test client ID/secret
   - Automatically configured for basic profile access
   - Scopes: `openid profile email`

2. **Facebook**
   - Uses Auth0's test app ID/secret  
   - Basic profile information
   - Scopes: `public_profile email`

3. **LinkedIn**
   - Uses Auth0's test client credentials
   - Professional profile data
   - Scopes: `r_liteprofile r_emailaddress`

4. **Twitter**
   - Uses Auth0's test API keys
   - Basic profile information
   - Scopes: `include_email=true`

**Enable for MVP Application:**
1. Go to Authentication > Social
2. For each connection (Google, Facebook, LinkedIn, Twitter):
   - Click on the connection
   - Go to "Applications" tab
   - Enable your new "Scoop Social MVP Backend" application

### Step 4: User Management Strategy

**Fresh Start Approach (Recommended):**

```javascript
// Environment variable to control user migration
ENABLE_DEMO_USER_MIGRATION=false  // Start fresh for MVP

// Optional: If you want to migrate specific demo users later
DEMO_USER_MIGRATION_LIST=user1@example.com,user2@example.com
```

**Benefits:**
- Clean analytics and metrics for MVP
- No demo data pollution
- Beta testers get authentic experience
- Easier to track MVP-specific engagement

**Demo Data Preservation:**
- Existing demo users remain in Auth0
- Can be accessed through original demo application
- Can be migrated to MVP later if needed

### Step 5: Environment Configuration

**Update your environment variables:**

```bash
# Auth0 Configuration for MVP
AUTH0_DOMAIN=dev-av6q4m54qqcs5n00.us.auth0.com
AUTH0_CLIENT_ID=your_new_mvp_client_id
AUTH0_CLIENT_SECRET=your_new_mvp_client_secret
AUTH0_AUDIENCE=https://api.scoopsocials.com
AUTH0_ISSUER_BASE_URL=https://dev-av6q4m54qqcs5n00.us.auth0.com
AUTH0_SECRET=your_32_character_secret_for_sessions

# Frontend Auth0 Configuration
AUTH0_BASE_URL=https://app.scoopsocials.com
```

### Step 6: Social Account Mapping

**Trust Score Integration:**

The social media integration service will automatically process Auth0 identities:

```typescript
// Example of how Auth0 social data maps to trust scores
const auth0Identity = {
  provider: 'google-oauth2',
  user_id: 'google-oauth2|1234567890',
  connection: 'google-oauth2',
  isSocial: true,
  profileData: {
    email: 'user@gmail.com',
    name: 'John Doe',
    picture: 'https://...',
    email_verified: true
  }
};

// Converts to trust score factors:
// ✅ Email verified: +10 points
// ✅ Google account (high trust): +20 points  
// ✅ Profile completeness: +15 points
// Total contribution: ~45 points to trust score
```

## 🔧 Testing the Migration

### Development Testing
1. **Test Social Login Flow**
   ```bash
   # Start your development environment
   npm run dev
   
   # Test each social provider:
   # - Google: Should redirect to Google OAuth
   # - Facebook: Should redirect to Facebook OAuth  
   # - LinkedIn: Should redirect to LinkedIn OAuth
   # - Twitter: Should redirect to Twitter OAuth
   ```

2. **Verify Token Exchange**
   ```bash
   # Check JWT tokens include correct audience and scopes
   curl -H "Authorization: Bearer <token>" \
        https://api.scoopsocials.com/api/v1/profile
   ```

3. **Test Trust Score Calculation**
   ```bash
   # After connecting social accounts, verify trust score updates
   curl -H "Authorization: Bearer <token>" \
        https://api.scoopsocials.com/api/v1/trust-score
   ```

### Production Deployment Testing
1. **SSL Certificate Verification**
   - Verify `app.scoopsocials.com` resolves correctly
   - Verify `api.scoopsocials.com` resolves correctly
   - Test HTTPS redirect works

2. **Auth0 Callback Testing**
   - Test social login from production frontend
   - Verify JWT tokens are correctly formatted
   - Test logout and session management

## 🚨 Important Security Notes

### Rate Limiting with Auth0 Test Keys
```javascript
// Auth0 test keys have usage limits:
const AUTH0_TEST_LIMITS = {
  google: '1000 requests/day',
  facebook: '500 requests/day', 
  linkedin: '500 requests/day',
  twitter: '300 requests/day'
};

// For 100-500 beta users, this should be sufficient
// Monitor usage in Auth0 dashboard
```

### JWT Token Security
```javascript
// Ensure JWT tokens include correct claims
const expectedClaims = {
  aud: 'https://api.scoopsocials.com',
  iss: 'https://dev-av6q4m54qqcs5n00.us.auth0.com/',
  sub: 'google-oauth2|...',
  scope: 'read:profile write:profile...',
  permissions: ['read:profile', 'write:profile']
};
```

## 📊 Migration Rollback Plan

If you need to rollback:

1. **Disable MVP Application**
   - In Auth0 dashboard, disable the MVP application
   - Users will fallback to original demo application

2. **DNS Rollback**
   - Remove `app.scoopsocials.com` DNS record
   - Remove `api.scoopsocials.com` DNS record
   - Original `scoopsocials.com` continues working

3. **Database Rollback**
   - MVP database is separate from demo data
   - Original demo functionality unaffected

## 🎯 Success Metrics

**Week 1 Targets:**
- [ ] 10+ beta users successfully sign up via social login
- [ ] All 4 social providers working (Google, Facebook, LinkedIn, Twitter)
- [ ] Trust scores calculating correctly based on social accounts
- [ ] No Auth0 rate limit violations

**Week 2 Targets:**
- [ ] 50+ active beta users
- [ ] Social account verification contributing to trust scores
- [ ] Real-time features working for multiple concurrent users

This migration approach gives you the best of both worlds: preserving your existing demo while creating a clean, production-ready MVP environment using your existing Auth0 investment. 