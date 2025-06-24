import { NextRequest, NextResponse } from "next/server";
import { cookies } from 'next/headers';

export async function GET(request: NextRequest) {
  try {
    // For now, return null user session to avoid Auth0 deployment issues
    // This maintains the API contract while we debug the Auth0 integration
    return NextResponse.json({ 
      user: null,
      session: null
    }, { status: 200 });

  } catch (error) {
    console.error('Error getting user session:', error);
    return NextResponse.json({ user: null, error: 'Session error' }, { status: 200 });
  }
} 