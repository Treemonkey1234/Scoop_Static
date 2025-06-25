import { NextRequest, NextResponse } from 'next/server';

export async function middleware(request: NextRequest) {
  // Simple middleware - just pass through all requests
  // Auth0 routes are handled by the API route handlers
  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
}; 