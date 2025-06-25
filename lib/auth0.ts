// Simple Auth0 configuration for production deployment
export const auth0Config = {
  domain: process.env.AUTH0_DOMAIN!,
  clientId: process.env.AUTH0_CLIENT_ID!,
  clientSecret: process.env.AUTH0_CLIENT_SECRET!,
  secret: process.env.AUTH0_SECRET!,
  baseURL: process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : process.env.AUTH0_BASE_URL || 'http://localhost:3001',
  issuerBaseURL: process.env.AUTH0_ISSUER_BASE_URL || `https://${process.env.AUTH0_DOMAIN}`,
};

// Simple auth0 client fallback
export const auth0 = {
  getSession: async () => null, // Fallback for development
};

// Helper function to get current user session
export async function getCurrentSession() {
  try {
    const session = await auth0.getSession();
    return session;
  } catch (error) {
    console.error('Error getting session:', error);
    return null;
  }
}

// Helper function to get user info from session
export function getUserFromSession(session: any) {
  if (!session?.user) return null;
  
  return {
    id: session.user.sub,
    name: session.user.name,
    email: session.user.email,
    avatar: session.user.picture,
    isVerified: session.user.email_verified || false,
    // Extract connected social accounts from identities
    connectedAccounts: session.user.identities?.filter((identity: any) => 
      identity.provider !== 'auth0' && // Not the primary username/password connection
      ['google-oauth2', 'facebook', 'linkedin', 'twitter', 'instagram', 'github'].includes(identity.provider)
    ) || [],
    // Map Auth0 user to platform user format
    trustScore: 75, // Default trust score for new Auth0 users
    joinDate: new Date().toISOString().split('T')[0],
    location: 'Location not set',
    bio: 'New to ScoopSocials! Looking forward to connecting with the community.',
    friendsCount: 0,
    reviewsCount: 0,
    eventsAttended: 0,
    eventsHosted: 0,
    badges: ['Verified Account'],
    interests: [],
    socialLinks: {
      instagram: '',
      twitter: ''
    },
    phoneVerified: false,
    emailVerified: session.user.email_verified || false
  };
} 