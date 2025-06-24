import { NextRequest, NextResponse } from "next/server";

export async function middleware(request: NextRequest) {
  try {
    // Only handle Auth0 routes
    if (request.nextUrl.pathname.startsWith('/auth/')) {
      const pathname = request.nextUrl.pathname;
      
      if (pathname === '/auth/login') {
        // Redirect to Auth0 login
        const loginUrl = new URL('/authorize', `https://${process.env.AUTH0_DOMAIN}`);
        loginUrl.searchParams.append('response_type', 'code');
        loginUrl.searchParams.append('client_id', process.env.AUTH0_CLIENT_ID!);
        loginUrl.searchParams.append('redirect_uri', `${process.env.APP_BASE_URL || 'http://localhost:3003'}/auth/callback`);
        loginUrl.searchParams.append('scope', 'openid profile email');
        if (process.env.AUTH0_AUDIENCE) {
          loginUrl.searchParams.append('audience', process.env.AUTH0_AUDIENCE);
        }
        return NextResponse.redirect(loginUrl);
      }
      
      if (pathname === '/auth/logout') {
        // Redirect to Auth0 logout
        const logoutUrl = new URL('/v2/logout', `https://${process.env.AUTH0_DOMAIN}`);
        logoutUrl.searchParams.append('client_id', process.env.AUTH0_CLIENT_ID!);
        logoutUrl.searchParams.append('returnTo', process.env.APP_BASE_URL || 'http://localhost:3003');
        return NextResponse.redirect(logoutUrl);
      }
      
      if (pathname === '/auth/callback') {
        // For now, just redirect to home after callback
        return NextResponse.redirect(new URL('/', process.env.APP_BASE_URL || 'http://localhost:3003'));
      }
    }
    
    // For all other routes, just continue
    return NextResponse.next();
  } catch (error) {
    // If anything else fails, just continue
    console.error('Middleware error:', error);
    return NextResponse.next();
  }
}

export const config = {
  matcher: [
    // Only match auth routes to avoid unnecessary middleware execution
    "/auth/:path*"
  ]
}; 