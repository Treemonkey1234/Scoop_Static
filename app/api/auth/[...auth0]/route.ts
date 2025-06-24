// Auth0 v4.7.0+ automatically handles authentication routes
// The SDK no longer exports handleAuth, handleLogin, etc.
// Routes are automatically mounted through the Auth0Client instance

import { NextRequest, NextResponse } from "next/server";

// This route is optional in v4.7.0+ as Auth0 automatically mounts routes
// But we can provide a simple response for any direct access
export async function GET(request: NextRequest) {
  // Return a simple response
  return NextResponse.json({ message: "Auth0 route handler" });
}

// Export HTTP method handlers that Auth0 requires
export async function POST(request: NextRequest) {
  // Return a simple response
  return NextResponse.json({ message: "Auth0 route handler" });
} 