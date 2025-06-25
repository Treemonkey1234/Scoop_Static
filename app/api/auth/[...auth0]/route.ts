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
  
  // Build Auth0 authorization URL
  const authUrl = new URL(`https://${auth0Config.domain}/authorize`);
  authUrl.searchParams.set('response_type', 'code');
  authUrl.searchParams.set('client_id', auth0Config.clientId);
  authUrl.searchParams.set('redirect_uri', `${auth0Config.baseURL}/api/auth/callback`);
  authUrl.searchParams.set('scope', 'openid profile email');
  authUrl.searchParams.set('state', '/');
  
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
  const state = url.searchParams.get('state') || '/';
  
  if (!code) {
    return NextResponse.redirect('/signin?error=no_code');
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
    
    // Create session
    const sessionData = {
      user: user,
      accessToken: tokens.access_token,
      expiresAt: Date.now() + (tokens.expires_in * 1000),
    };
    
    // Redirect to success page
    const response = NextResponse.redirect(auth0Config.baseURL + state);
    
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