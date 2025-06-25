# Vercel Deployment Guide for Scoop Social Platform

## Prerequisites
1. GitHub repository with your code
2. Auth0 account and application set up
3. Vercel account

## Step 1: Push to GitHub

```bash
git add .
git commit -m "Prepare for Vercel deployment with Auth0 integration"
git push origin master
```

## Step 2: Deploy to Vercel

1. Go to [vercel.com](https://vercel.com) and sign in
2. Click "New Project"
3. Import your GitHub repository
4. Select "Next.js" as the framework
5. Click "Deploy"

## Step 3: Configure Environment Variables in Vercel

Go to your Vercel project dashboard → Settings → Environment Variables and add:

### Required Auth0 Environment Variables:

```
AUTH0_DOMAIN=your-auth0-domain.us.auth0.com
AUTH0_CLIENT_ID=your-auth0-client-id
AUTH0_CLIENT_SECRET=your-auth0-client-secret
AUTH0_SECRET=RHU9{Gx:!S$!m{P.-u3-r|lYdrHpv2Aekh*[&sKG4YxWmNx)$[#)?[*|0=Nvx@u8
AUTH0_ISSUER_BASE_URL=https://your-auth0-domain.us.auth0.com
```

### Where to find these values:
1. **AUTH0_DOMAIN**: Auth0 Dashboard → Applications → Your App → Domain
2. **AUTH0_CLIENT_ID**: Auth0 Dashboard → Applications → Your App → Client ID
3. **AUTH0_CLIENT_SECRET**: Auth0 Dashboard → Applications → Your App → Client Secret
4. **AUTH0_SECRET**: Use the generated secret above (or generate a new one)
5. **AUTH0_ISSUER_BASE_URL**: Same as AUTH0_DOMAIN but with `https://` prefix

## Step 4: Update Auth0 Application Settings

In your Auth0 Dashboard → Applications → Your App → Settings, update:

### Allowed Callback URLs:
```
https://your-vercel-app.vercel.app/api/auth/callback
```

### Allowed Logout URLs:
```
https://your-vercel-app.vercel.app/signin
```

### Allowed Web Origins:
```
https://your-vercel-app.vercel.app
```

Replace `your-vercel-app.vercel.app` with your actual Vercel deployment URL.

## Step 5: Redeploy

After adding environment variables, trigger a new deployment:
1. Go to your Vercel project dashboard
2. Click "Deployments" tab
3. Click "Redeploy" on the latest deployment

## Step 6: Test Social Login

1. Visit your deployed site: `https://your-vercel-app.vercel.app/signin`
2. Click on Google, Facebook, or LinkedIn buttons
3. You should be redirected to the respective social login provider
4. After successful authentication, you should be redirected back to your app

## Notes

- The app uses `VERCEL_URL` environment variable automatically provided by Vercel
- No need to manually set base URLs - they are auto-detected
- Make sure your Auth0 social connections (Google, Facebook, LinkedIn) are properly configured in Auth0 Dashboard
- The platform will still work with sample users when Auth0 is not configured (for development)

## Troubleshooting

### Common Issues:

1. **"Invalid URL" errors**: Check that all Auth0 environment variables are set correctly
2. **"Connection failed" errors**: Verify Auth0 application URLs match your Vercel deployment URL
3. **Social login not working**: Ensure social connections are enabled in Auth0 Dashboard

### Debug Steps:

1. Check Vercel function logs: Project → Functions → View Function Logs
2. Verify environment variables are set: Project → Settings → Environment Variables
3. Check Auth0 logs: Auth0 Dashboard → Monitoring → Logs 