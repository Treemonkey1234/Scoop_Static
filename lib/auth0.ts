import { Auth0Client } from "@auth0/nextjs-auth0/server";

export const auth0 = new Auth0Client({
  // Explicit configuration to avoid undefined values
  domain: process.env.AUTH0_DOMAIN!,
  clientId: process.env.AUTH0_CLIENT_ID!,
  clientSecret: process.env.AUTH0_CLIENT_SECRET!,
  secret: process.env.AUTH0_SECRET!,
  appBaseUrl: process.env.APP_BASE_URL || 'http://localhost:3003',
  
  // Auth0 v4.7.0+ configuration for both authentication and social connections
  authorizationParameters: {
    // Enable social connections and account linking
    scope: 'openid profile email',
    // Add audience if you need API access tokens
    audience: process.env.AUTH0_AUDIENCE
  }
}); 