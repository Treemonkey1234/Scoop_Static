import { NextRequest, NextResponse } from "next/server";
import { getCurrentSession, getUserFromSession } from "@/lib/auth0";

export async function GET(request: NextRequest) {
  try {
    const session = await getCurrentSession();
    
    if (!session) {
      return NextResponse.json({ user: null }, { status: 200 });
    }

    const user = getUserFromSession(session);
    
    return NextResponse.json({ 
      user: user,
      session: {
        sub: session.user.sub,
        name: session.user.name,
        email: session.user.email,
        picture: session.user.picture,
        email_verified: session.user.email_verified,
        identities: session.user.identities
      }
    }, { status: 200 });

  } catch (error) {
    console.error('Error getting user session:', error);
    return NextResponse.json({ user: null, error: 'Session error' }, { status: 200 });
  }
} 