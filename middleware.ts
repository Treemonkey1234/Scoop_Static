import { NextRequest, NextResponse } from "next/server";

export async function middleware(request: NextRequest) {
  // Temporarily disable Auth0 middleware to fix deployment issues
  // The Auth0 integration will be re-enabled once deployment is stable
  
  // Just pass through all requests for now
  return NextResponse.next();
}

export const config = {
  matcher: [
    // Only match auth routes to avoid unnecessary middleware execution
    "/auth/:path*"
  ]
}; 