import { NextRequest, NextResponse } from "next/server";

export function middleware(request: NextRequest) {
  // For now, just pass through all requests to avoid the Auth0 URL errors
  // Auth0 v4.7.0 handles authentication routes automatically
  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico, sitemap.xml, robots.txt (metadata files)
     */
    "/((?!_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)"
  ]
}; 