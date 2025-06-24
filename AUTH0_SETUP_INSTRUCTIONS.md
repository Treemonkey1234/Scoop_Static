# Auth0 Setup Instructions - UPDATED FOR v4.7.0

## Your Requirements ✅
1. **Sign in/Sign up** - Users can authenticate with Auth0
2. **Connected accounts** - Users can link their social media accounts via Auth0's social connections

## The Issue Was Fixed
You were getting 500 Internal Server Error because Auth0 v4.7.0 completely changed how it works compared to older versions.

## Steps to Complete Setup

### 1. Environment Variables (Already Done ✅)
Your `.env.local` file should have:
```env
AUTH0_DOMAIN=dev-av6q4m54qqcs5n00.us.auth0.com
AUTH0_CLIENT_ID=5uKzDSRavv2WqTOvDnDqsh2pGvHQ759C
AUTH0_CLIENT_SECRET=9JsSTKvK_hPS8bNPKWQQRQUU-Ll9e8xXAeOpy0pO0bQdrkryT95Ge5WAGQTxPt0X
AUTH0_SECRET=94f8b00605ac1952d50a2bc79c815e9a6446aed49f1ee5c739c126109d189b34
AUTH0_ISSUER_BASE_URL=https://dev-av6q4m54qqcs5n00.us.auth0.com
AUTH0_BASE_URL=https://scoop-static.vercel.app
AUTH0_AUDIENCE=https://your-api-identifier (optional - for API access)
```

### 2. Auth0 Dashboard Configuration
In your Auth0 Dashboard (https://manage.auth0.com/):

**Application Settings:**
- **Allowed Callback URLs**: `https://scoop-static.vercel.app/auth/callback`
- **Allowed Logout URLs**: `https://scoop-static.vercel.app`
- **Allowed Web Origins**: `https://scoop-static.vercel.app`

**Social Connections (for Connected Accounts feature):**
1. Go to **Authentication > Social**
2. Enable the social providers you want:
   - Google
   - Facebook
   - Twitter/X
   - LinkedIn
   - GitHub
   - Instagram
   - TikTok
   - etc.
3. Configure each provider with your API keys
4. Make sure they're enabled for your application

### 3. How Authentication Works Now

**Available Routes (Auto-mounted by Auth0 v4.7.0):**
- `/auth/login` - Login page
- `/auth/logout` - Logout 
- `/auth/callback` - OAuth callback
- `/auth/profile` - User profile data
- `/auth/access-token` - Access token endpoint

**For Sign In/Sign Up:**
```html
<a href="/auth/login">Sign In</a>
<a href="/auth/login?screen_hint=signup">Sign Up</a>
```

**For Connected Accounts:**
Users can connect their social accounts during login, or you can redirect them to:
```html
<a href="/auth/login?connection=google-oauth2">Connect Google</a>
<a href="/auth/login?connection=facebook">Connect Facebook</a>
```

### 4. Getting User Data in Your App

**Client-side (React components):**
```javascript
import { useUser } from '@auth0/nextjs-auth0/client';

export default function MyComponent() {
  const { user, error, isLoading } = useUser();
  
  if (user) {
    // User is authenticated
    // user.sub contains connected account info
    console.log('Connected accounts:', user.identities);
  }
}
```

**Server-side (API routes/server components):**
```javascript
import { auth0 } from '@/lib/auth0';

export async function GET() {
  const session = await auth0.getSession();
  if (session) {
    console.log('User:', session.user);
    console.log('Connected accounts:', session.user.identities);
  }
}
```

### 5. Connected Accounts Integration

The user object will contain an `identities` array with all connected social accounts:
```javascript
{
  "sub": "auth0|123456789",
  "identities": [
    {
      "provider": "auth0",
      "user_id": "123456789",
      "connection": "Username-Password-Authentication",
      "isSocial": false
    },
    {
      "provider": "google-oauth2", 
      "user_id": "987654321",
      "connection": "google-oauth2",
      "isSocial": true
    }
  ]
}
```

## Testing
1. Visit `https://scoop-static.vercel.app/auth/login`
2. You should see the Auth0 Universal Login page
3. Social connection buttons should appear based on your enabled providers
4. After login, user data should be available in your components

## What We Fixed
- ✅ Updated to Auth0 v4.7.0 API (no more handleAuth exports)
- ✅ Fixed middleware to prevent URL errors
- ✅ Configured social connections support
- ✅ Updated Next.js to v15.3.4 for compatibility
- ✅ Fixed Suspense boundary for useSearchParams
- ✅ Set up proper environment variables for Vercel deployment

Your ScoopSocials platform now supports both authentication AND social account connections! 🎉 