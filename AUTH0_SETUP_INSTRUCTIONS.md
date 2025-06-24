# Auth0 Setup Instructions

## The Issue
You're getting 500 Internal Server Error because Auth0 v4.7.0 requires proper environment configuration to function.

## Steps to Fix

### 1. Create Environment File
Create a file named `.env.local` in your project root with the following content:

```env
AUTH0_DOMAIN=YOUR_DOMAIN.auth0.com
AUTH0_CLIENT_ID=YOUR_CLIENT_ID
AUTH0_CLIENT_SECRET=YOUR_CLIENT_SECRET
AUTH0_SECRET=a_random_32_character_secret_here
APP_BASE_URL=http://localhost:3000
```

### 2. Set Up Auth0 Application
1. Go to [Auth0 Dashboard](https://manage.auth0.com/)
2. Create a new "Regular Web Application"
3. Get your Domain, Client ID, and Client Secret from the application settings
4. Add these URLs to your Auth0 application:
   - **Allowed Callback URLs**: `http://localhost:3000/auth/callback`
   - **Allowed Logout URLs**: `http://localhost:3000`

### 3. Generate AUTH0_SECRET
You can generate a secure secret using one of these methods:

**Option A: Online Generator**
- Visit: https://generate-secret.vercel.app/32
- Copy the generated secret

**Option B: Node.js**
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

**Option C: OpenSSL (if available)**
```bash
openssl rand -hex 32
```

### 4. Update .env.local
Replace the placeholder values with your actual Auth0 credentials:

```env
AUTH0_DOMAIN=your-tenant.auth0.com
AUTH0_CLIENT_ID=your_actual_client_id
AUTH0_CLIENT_SECRET=your_actual_client_secret
AUTH0_SECRET=your_generated_32_character_secret
APP_BASE_URL=http://localhost:3000
```

### 5. Restart Development Server
```bash
npm run dev
```

## How Auth0 v4.7.0 Works
- The SDK automatically mounts authentication routes through middleware
- No API route handlers are needed (we deleted the old route.ts file)
- Available routes:
  - `/auth/login` - Login page
  - `/auth/logout` - Logout
  - `/auth/callback` - OAuth callback
  - `/auth/profile` - User profile data
  - `/auth/access-token` - Access token endpoint

## Test the Setup
1. Start your development server: `npm run dev`
2. Navigate to: `http://localhost:3000/auth/login`
3. You should see the Auth0 login page instead of a 500 error

## Troubleshooting
- Make sure `.env.local` is in your project root (same directory as `package.json`)
- Verify your Auth0 application is set to "Regular Web Application" type
- Check that callback URLs are correctly configured in Auth0 dashboard
- Ensure your AUTH0_SECRET is exactly 32 characters (64 hex characters)

## Files Updated
- ✅ `lib/auth0.ts` - Updated to use Auth0Client properly
- ✅ `middleware.ts` - Configured to handle Auth0 routing
- ❌ Deleted `app/api/auth/[...auth0]/route.ts` - No longer needed in v4.7.0 