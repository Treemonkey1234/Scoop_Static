import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    // Simple session check from cookie
    const sessionCookie = request.cookies.get('appSession');
    
    if (sessionCookie) {
      const session = JSON.parse(sessionCookie.value);
      if (session.expiresAt > Date.now()) {
        return NextResponse.json({ 
          user: session.user,
          session: session.user
        }, { status: 200 });
      }
    }
    
    // For development - return null session to maintain current functionality
    // This allows the platform to work with sample users when Auth0 is not fully set up
    return NextResponse.json({ 
      user: null,
      session: null
    }, { status: 200 });

  } catch (error) {
    console.error('Error getting user session:', error);
    return NextResponse.json({ user: null, error: 'Session error' }, { status: 200 });
  }
} 