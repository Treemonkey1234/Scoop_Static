import { Auth0Client } from "@auth0/nextjs-auth0/server";

export const auth0 = new Auth0Client({
  // Auth0 v4.7.0+ configuration for both authentication and social connections
  authorizationParameters: {
    // Enable social connections and account linking
    scope: 'openid profile email',
    // Add audience if you need API access tokens
    audience: process.env.AUTH0_AUDIENCE
  }
}); 