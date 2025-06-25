import { NextRequest, NextResponse } from "next/server";
import { auth0Config } from '@/lib/auth0';

export async function GET(request: NextRequest, context: { params: Promise<{ auth0: string[] }> }) {
  try {
    const params = await context.params;
    const route = params.auth0[0];
    
    switch (route) {
      case 'login':
        return handleLogin(request);
      case 'logout':
        return handleLogout(request);
      case 'callback':
        return handleCallback(request);
      case 'me':
        return handleMe(request);
      default:
        return NextResponse.json({ error: 'Route not found' }, { status: 404 });
    }
  } catch (error) {
    console.error('Auth0 route error:', error);
    return NextResponse.json({ error: 'Authentication error' }, { status: 500 });
  }
}

async function handleLogin(request: NextRequest) {
  const url = new URL(request.url);
  const connection = url.searchParams.get('connection');
  const returnTo = url.searchParams.get('returnTo');
  
  // Build Auth0 authorization URL
  const authUrl = new URL(`https://${auth0Config.domain}/authorize`);
  authUrl.searchParams.set('response_type', 'code');
  authUrl.searchParams.set('client_id', auth0Config.clientId);
  authUrl.searchParams.set('redirect_uri', `${auth0Config.baseURL}/api/auth/callback`);
  authUrl.searchParams.set('scope', 'openid profile email');
  
  // Include connection info in state for callback processing
  const stateData = {
    returnTo: returnTo || '/',
    connection: connection
  };
  authUrl.searchParams.set('state', btoa(JSON.stringify(stateData)));
  
  if (connection) {
    authUrl.searchParams.set('connection', connection);
  }
  
  return NextResponse.redirect(authUrl.toString());
}

async function handleLogout(request: NextRequest) {
  const logoutUrl = new URL(`https://${auth0Config.domain}/v2/logout`);
  logoutUrl.searchParams.set('returnTo', `${auth0Config.baseURL}/signin`);
  logoutUrl.searchParams.set('client_id', auth0Config.clientId);
  
  // Clear session cookie
  const response = NextResponse.redirect(logoutUrl.toString());
  response.cookies.delete('appSession');
  
  return response;
}

async function handleCallback(request: NextRequest) {
  const url = new URL(request.url);
  const code = url.searchParams.get('code');
  const stateParam = url.searchParams.get('state') || '{}';
  
  if (!code) {
    return NextResponse.redirect('/signin?error=no_code');
  }
  
  // Parse state data
  let stateData;
  try {
    stateData = JSON.parse(atob(stateParam));
  } catch {
    stateData = { returnTo: '/', connection: null };
  }
  
  try {
    // Exchange code for tokens
    const tokenResponse = await fetch(`https://${auth0Config.domain}/oauth/token`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        grant_type: 'authorization_code',
        client_id: auth0Config.clientId,
        client_secret: auth0Config.clientSecret,
        code: code,
        redirect_uri: `${auth0Config.baseURL}/api/auth/callback`,
      }),
    });
    
    const tokens = await tokenResponse.json();
    
    if (!tokenResponse.ok) {
      console.error('Token exchange failed:', tokens);
      return NextResponse.redirect('/signin?error=token_exchange_failed');
    }
    
    // Get user info
    const userResponse = await fetch(`https://${auth0Config.domain}/userinfo`, {
      headers: {
        'Authorization': `Bearer ${tokens.access_token}`,
      },
    });
    
    const user = await userResponse.json();
    
    if (!userResponse.ok) {
      console.error('User info failed:', user);
      return NextResponse.redirect('/signin?error=user_info_failed');
    }
    
    // Log user data for debugging
    console.log('Auth0 User Data:', JSON.stringify(user, null, 2));
    
    // Create identities array from the user's sub (connection info)
    // Auth0 user sub format: "provider|user_id" (e.g., "linkedin|18Q4GrE_N7")
    const createIdentitiesFromSub = (sub: string, userData: any) => {
      const identities = [];
      
      if (sub.startsWith('linkedin|')) {
        identities.push({
          provider: 'linkedin',
          connection: 'linkedin',
          user_id: sub.split('|')[1],
          isSocial: true,
          profileData: {
            name: userData.name,
            email: userData.email,
            picture: userData.picture
          }
        });
      } else if (sub.startsWith('google-oauth2|')) {
        identities.push({
          provider: 'google-oauth2',
          connection: 'google-oauth2',
          user_id: sub.split('|')[1],
          isSocial: true,
          profileData: {
            name: userData.name,
            email: userData.email,
            picture: userData.picture
          }
        });
      } else if (sub.startsWith('facebook|')) {
        identities.push({
          provider: 'facebook',
          connection: 'facebook',
          user_id: sub.split('|')[1],
          isSocial: true,
          profileData: {
            name: userData.name,
            email: userData.email,
            picture: userData.picture
          }
        });
      }
      
      return identities;
    };
    
    // Add identities based on the sub field
    user.identities = createIdentitiesFromSub(user.sub, user);
    console.log('Created identities from sub:', JSON.stringify(user.identities, null, 2));
    
    // If this was a social connection from Connected Accounts, save the connection
    if (stateData.connection && stateData.returnTo === '/connected-accounts') {
      const platformMap: { [key: string]: string } = {
        'google-oauth2': 'Google',
        'facebook': 'Facebook',
        'linkedin': 'LinkedIn'
      };
      
      const platform = platformMap[stateData.connection];
      if (platform && user.email) {
        // Extract username from email or use email
        const username = user.email.split('@')[0];
        
        // Call the connectSocialAccount function (we'll need to import this)
        // For now, we'll add the connection data to the session
        user.connectedPlatform = platform;
        user.connectedUsername = username;
      }
    }
    
    // Create session
    const sessionData = {
      user: user,
      accessToken: tokens.access_token,
      expiresAt: Date.now() + (tokens.expires_in * 1000),
    };
    
    // Check if this is a new user or existing user
    // For new users, redirect to onboarding. For existing users adding accounts, go to returnTo
    let redirectPath = stateData.returnTo;
    
    // If coming from connected-accounts page, user is adding an account
    if (stateData.returnTo === '/connected-accounts') {
      redirectPath = '/connected-accounts';
    } else {
      // This is a new user sign in, redirect to onboarding
      redirectPath = '/onboarding';
    }
    
    // Redirect to appropriate page
    const response = NextResponse.redirect(auth0Config.baseURL + redirectPath);
    
    // Set session cookie
    response.cookies.set('appSession', JSON.stringify(sessionData), {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: tokens.expires_in || 3600,
      path: '/',
    });
    
    return response;
    
  } catch (error) {
    console.error('Callback error:', error);
    return NextResponse.redirect('/signin?error=callback_failed');
  }
}

async function handleMe(request: NextRequest) {
  try {
    // Simple session check from cookie
    const sessionCookie = request.cookies.get('appSession');
    if (sessionCookie) {
      const session = JSON.parse(sessionCookie.value);
      if (session.expiresAt > Date.now()) {
        return NextResponse.json({ user: session.user });
      }
    }
    return NextResponse.json({ user: null });
  } catch (error) {
    return NextResponse.json({ user: null });
  }
} 