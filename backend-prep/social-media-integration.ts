/**
 * Social Media Integration Service for Scoop Social Platform
 * Integrates with Auth0 social connections and calculates authenticity scores
 * Supports verification of connected accounts for trust score calculation
 */

import { DatabaseService } from './database-service';

// =============================================
// Social Platform Configurations
// =============================================

export interface SocialPlatformConfig {
  name: string;
  auth0Connection: string;
  apiEndpoint?: string;
  apiVersion?: string;
  requiresApiKey: boolean;
  supportsFollowerCount: boolean;
  supportsVerification: boolean;
  supportsAccountAge: boolean;
  maxFollowerWeight: number; // Weight in authenticity calculation
}

export const SOCIAL_PLATFORMS: Record<string, SocialPlatformConfig> = {
  google: {
    name: 'Google',
    auth0Connection: 'google-oauth2',
    apiEndpoint: 'https://www.googleapis.com/oauth2/v2',
    apiVersion: 'v2',
    requiresApiKey: false,
    supportsFollowerCount: false,
    supportsVerification: true,
    supportsAccountAge: true,
    maxFollowerWeight: 10
  },
  facebook: {
    name: 'Facebook', 
    auth0Connection: 'facebook',
    apiEndpoint: 'https://graph.facebook.com',
    apiVersion: 'v18.0',
    requiresApiKey: false,
    supportsFollowerCount: true,
    supportsVerification: false, // Requires business verification
    supportsAccountAge: true,
    maxFollowerWeight: 20
  },
  linkedin: {
    name: 'LinkedIn',
    auth0Connection: 'linkedin',
    apiEndpoint: 'https://api.linkedin.com',
    apiVersion: 'v2',
    requiresApiKey: false,
    supportsFollowerCount: true,
    supportsVerification: false,
    supportsAccountAge: true,
    maxFollowerWeight: 25
  },
  twitter: {
    name: 'Twitter',
    auth0Connection: 'twitter',
    apiEndpoint: 'https://api.twitter.com',
    apiVersion: '2',
    requiresApiKey: true,
    supportsFollowerCount: true,
    supportsVerification: true,
    supportsAccountAge: true,
    maxFollowerWeight: 20
  },
  instagram: {
    name: 'Instagram',
    auth0Connection: 'instagram',
    apiEndpoint: 'https://graph.instagram.com',
    apiVersion: 'v18.0',
    requiresApiKey: false,
    supportsFollowerCount: true,
    supportsVerification: false, // Basic Display API limitations
    supportsAccountAge: false,
    maxFollowerWeight: 15
  },
  github: {
    name: 'GitHub',
    auth0Connection: 'github',
    apiEndpoint: 'https://api.github.com',
    apiVersion: '',
    requiresApiKey: false,
    supportsFollowerCount: true,
    supportsVerification: false,
    supportsAccountAge: true,
    maxFollowerWeight: 15
  },
  apple: {
    name: 'Apple',
    auth0Connection: 'apple',
    requiresApiKey: false,
    supportsFollowerCount: false,
    supportsVerification: true,
    supportsAccountAge: false,
    maxFollowerWeight: 20
  },
  microsoft: {
    name: 'Microsoft',
    auth0Connection: 'windowslive',
    apiEndpoint: 'https://graph.microsoft.com',
    apiVersion: 'v1.0',
    requiresApiKey: false,
    supportsFollowerCount: false,
    supportsVerification: true,
    supportsAccountAge: true,
    maxFollowerWeight: 15
  }
};

// =============================================
// Social Account Data Structures
// =============================================

export interface Auth0UserIdentity {
  provider: string;
  user_id: string;
  connection: string;
  isSocial: boolean;
  profileData?: {
    email?: string;
    name?: string;
    nickname?: string;
    picture?: string;
    user_id?: string;
    username?: string;
    [key: string]: any;
  };
}

export interface SocialAccountData {
  platform: string;
  platformUserId: string;
  username: string;
  displayName?: string;
  email?: string;
  verified: boolean;
  followerCount?: number;
  followingCount?: number;
  accountAge?: Date;
  profileUrl?: string;
  avatarUrl?: string;
  bio?: string;
  accessToken?: string;
}

export interface AuthenticityMetrics {
  followerToFollowingRatio: number;
  accountAgeMonths: number;
  hasVerifiedBadge: boolean;
  profileCompleteness: number;
  activityLevel: number;
}

export interface AuthenticityScore {
  totalScore: number; // 0-100
  metrics: AuthenticityMetrics;
  factors: {
    accountAge: number;
    followerCount: number;
    verification: number;
    profileQuality: number;
    platformReliability: number;
  };
  trustContribution: number; // Points added to user's trust score
}

// =============================================
// Social Media Integration Service
// =============================================

export class SocialMediaService {
  private db: DatabaseService;
  private apiKeys: Record<string, string>;

  constructor(db: DatabaseService, apiKeys: Record<string, string> = {}) {
    this.db = db;
    this.apiKeys = apiKeys;
  }

  // =============================================
  // Auth0 Integration Methods
  // =============================================

  /**
   * Process Auth0 user identities and extract social accounts
   */
  async processAuth0UserIdentities(
    userId: number, 
    auth0Identities: Auth0UserIdentity[]
  ): Promise<SocialAccountData[]> {
    const socialAccounts: SocialAccountData[] = [];

    for (const identity of auth0Identities) {
      if (identity.isSocial && identity.profileData) {
        const platformConfig = this.findPlatformByConnection(identity.connection);
        if (platformConfig) {
          const accountData = await this.extractSocialAccountData(
            platformConfig,
            identity
          );
          socialAccounts.push(accountData);
        }
      }
    }

    return socialAccounts;
  }

  /**
   * Find platform configuration by Auth0 connection name
   */
  private findPlatformByConnection(connection: string): SocialPlatformConfig | null {
    return Object.values(SOCIAL_PLATFORMS).find(
      platform => platform.auth0Connection === connection
    ) || null;
  }

  /**
   * Extract social account data from Auth0 identity
   */
  private async extractSocialAccountData(
    platform: SocialPlatformConfig,
    identity: Auth0UserIdentity
  ): Promise<SocialAccountData> {
    const profile = identity.profileData!;
    
    const accountData: SocialAccountData = {
      platform: platform.name.toLowerCase(),
      platformUserId: identity.user_id,
      username: profile.username || profile.nickname || profile.email || '',
      displayName: profile.name,
      email: profile.email,
      verified: false, // Will be determined by API call
      profileUrl: this.generateProfileUrl(platform, profile),
      avatarUrl: profile.picture,
      bio: profile.bio || profile.description
    };

    // Enhance with API data if possible
    try {
      const enhancedData = await this.enhanceWithApiData(platform, accountData, profile);
      return { ...accountData, ...enhancedData };
    } catch (error) {
      console.warn(`Failed to enhance ${platform.name} data:`, error);
      return accountData;
    }
  }

  /**
   * Generate profile URL for the platform
   */
  private generateProfileUrl(platform: SocialPlatformConfig, profile: any): string {
    const username = profile.username || profile.nickname;
    
    switch (platform.name.toLowerCase()) {
      case 'twitter':
        return username ? `https://twitter.com/${username}` : '';
      case 'instagram':
        return username ? `https://instagram.com/${username}` : '';
      case 'linkedin':
        return profile.publicProfileUrl || '';
      case 'github':
        return username ? `https://github.com/${username}` : '';
      case 'facebook':
        return profile.link || '';
      default:
        return '';
    }
  }

  // =============================================
  // API Enhancement Methods
  // =============================================

  /**
   * Enhance account data with platform-specific API calls
   */
  private async enhanceWithApiData(
    platform: SocialPlatformConfig,
    accountData: SocialAccountData,
    profile: any
  ): Promise<Partial<SocialAccountData>> {
    const enhancements: Partial<SocialAccountData> = {};

    try {
      switch (platform.name.toLowerCase()) {
        case 'twitter':
          if (this.apiKeys.TWITTER_BEARER_TOKEN) {
            const twitterData = await this.getTwitterData(accountData.platformUserId);
            Object.assign(enhancements, twitterData);
          }
          break;

        case 'github':
          const githubData = await this.getGitHubData(accountData.username);
          Object.assign(enhancements, githubData);
          break;

        case 'linkedin':
          // LinkedIn API requires OAuth token from user session
          if (profile.accessToken) {
            const linkedinData = await this.getLinkedInData(profile.accessToken);
            Object.assign(enhancements, linkedinData);
          }
          break;

        // Add more platforms as needed
      }
    } catch (error) {
      console.warn(`API enhancement failed for ${platform.name}:`, error);
    }

    return enhancements;
  }

  /**
   * Get Twitter user data via API v2
   */
  private async getTwitterData(userId: string): Promise<Partial<SocialAccountData>> {
    const response = await fetch(
      `https://api.twitter.com/2/users/${userId}?user.fields=created_at,verified,public_metrics,description`,
      {
        headers: {
          'Authorization': `Bearer ${this.apiKeys.TWITTER_BEARER_TOKEN}`,
          'Content-Type': 'application/json'
        }
      }
    );

    if (!response.ok) {
      throw new Error(`Twitter API error: ${response.status}`);
    }

    const data = await response.json();
    const user = data.data;

    return {
      verified: user.verified || false,
      followerCount: user.public_metrics?.followers_count,
      followingCount: user.public_metrics?.following_count,
      accountAge: user.created_at ? new Date(user.created_at) : undefined,
      bio: user.description
    };
  }

  /**
   * Get GitHub user data via public API
   */
  private async getGitHubData(username: string): Promise<Partial<SocialAccountData>> {
    const response = await fetch(`https://api.github.com/users/${username}`);
    
    if (!response.ok) {
      throw new Error(`GitHub API error: ${response.status}`);
    }

    const user = await response.json();

    return {
      followerCount: user.followers,
      followingCount: user.following,
      accountAge: user.created_at ? new Date(user.created_at) : undefined,
      bio: user.bio,
      verified: false // GitHub doesn't have verification badges like Twitter
    };
  }

  /**
   * Get LinkedIn data via OAuth token
   */
  private async getLinkedInData(accessToken: string): Promise<Partial<SocialAccountData>> {
    const response = await fetch(
      'https://api.linkedin.com/v2/people/~:(id,firstName,lastName,headline,vanityName)',
      {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        }
      }
    );

    if (!response.ok) {
      throw new Error(`LinkedIn API error: ${response.status}`);
    }

    const profile = await response.json();

    return {
      bio: profile.headline,
      displayName: `${profile.firstName?.localized?.en_US} ${profile.lastName?.localized?.en_US}`.trim(),
      username: profile.vanityName
    };
  }

  // =============================================
  // Authenticity Score Calculation
  // =============================================

  /**
   * Calculate authenticity score for a social account
   */
  calculateAuthenticityScore(
    accountData: SocialAccountData,
    platform: SocialPlatformConfig
  ): AuthenticityScore {
    const metrics = this.calculateAuthenticityMetrics(accountData);
    
    // Calculate individual factor scores
    const factors = {
      accountAge: this.calculateAccountAgeScore(metrics.accountAgeMonths),
      followerCount: this.calculateFollowerScore(accountData.followerCount || 0, platform.maxFollowerWeight),
      verification: metrics.hasVerifiedBadge ? 25 : 0,
      profileQuality: metrics.profileCompleteness * 20, // Max 20 points
      platformReliability: this.getPlatformReliabilityScore(platform.name)
    };

    // Calculate total score (weighted average)
    const totalScore = Math.min(100, Math.round(
      factors.accountAge * 0.25 +
      factors.followerCount * 0.20 +
      factors.verification * 0.25 +
      factors.profileQuality * 0.15 +
      factors.platformReliability * 0.15
    ));

    // Calculate trust contribution (how much this account adds to user's trust score)
    const trustContribution = Math.round(totalScore * 0.1); // Max 10 points per account

    return {
      totalScore,
      metrics,
      factors,
      trustContribution
    };
  }

  /**
   * Calculate authenticity metrics from account data
   */
  private calculateAuthenticityMetrics(accountData: SocialAccountData): AuthenticityMetrics {
    const accountAgeMonths = accountData.accountAge 
      ? Math.floor((Date.now() - accountData.accountAge.getTime()) / (1000 * 60 * 60 * 24 * 30))
      : 0;

    const followerToFollowingRatio = accountData.followerCount && accountData.followingCount
      ? accountData.followingCount > 0 ? accountData.followerCount / accountData.followingCount : accountData.followerCount
      : 0;

    const profileCompleteness = this.calculateProfileCompleteness(accountData);

    return {
      followerToFollowingRatio,
      accountAgeMonths,
      hasVerifiedBadge: accountData.verified,
      profileCompleteness,
      activityLevel: 0.5 // Placeholder - would need activity data from APIs
    };
  }

  /**
   * Calculate profile completeness score (0-1)
   */
  private calculateProfileCompleteness(accountData: SocialAccountData): number {
    let completedFields = 0;
    const totalFields = 5;

    if (accountData.displayName) completedFields++;
    if (accountData.bio) completedFields++;
    if (accountData.avatarUrl) completedFields++;
    if (accountData.username) completedFields++;
    if (accountData.profileUrl) completedFields++;

    return completedFields / totalFields;
  }

  /**
   * Calculate account age score (0-30 points)
   */
  private calculateAccountAgeScore(ageMonths: number): number {
    if (ageMonths >= 60) return 30; // 5+ years = max points
    if (ageMonths >= 36) return 25; // 3+ years
    if (ageMonths >= 24) return 20; // 2+ years  
    if (ageMonths >= 12) return 15; // 1+ year
    if (ageMonths >= 6) return 10;  // 6+ months
    if (ageMonths >= 3) return 5;   // 3+ months
    return 0; // Less than 3 months
  }

  /**
   * Calculate follower count score with platform-specific weighting
   */
  private calculateFollowerScore(followerCount: number, maxWeight: number): number {
    if (followerCount === 0) return 0;
    
    // Use logarithmic scale to prevent gaming with massive follower counts
    const logScore = Math.log10(followerCount + 1) / Math.log10(10000); // Normalize to 10k followers = 1.0
    return Math.min(maxWeight, Math.round(logScore * maxWeight));
  }

  /**
   * Get platform reliability score based on verification capabilities
   */
  private getPlatformReliabilityScore(platformName: string): number {
    const reliabilityScores: Record<string, number> = {
      'google': 25,     // High trust, verified OAuth
      'apple': 25,      // High trust, strict verification
      'linkedin': 20,   // Professional network, good verification
      'microsoft': 20,  // Enterprise grade, good verification
      'twitter': 15,    // Good verification but changeable usernames
      'github': 15,     // Developer focused, good for tech trust
      'facebook': 10,   // Moderate trust, privacy concerns
      'instagram': 10   // Moderate trust, visual focused
    };

    return reliabilityScores[platformName.toLowerCase()] || 5;
  }

  // =============================================
  // Database Integration Methods
  // =============================================

  /**
   * Save social account to database with authenticity score
   */
  async saveSocialAccount(
    userId: number,
    accountData: SocialAccountData
  ): Promise<void> {
    const platform = SOCIAL_PLATFORMS[accountData.platform];
    if (!platform) {
      throw new Error(`Unsupported platform: ${accountData.platform}`);
    }

    const authenticityScore = this.calculateAuthenticityScore(accountData, platform);

    await this.db.createSocialAccount({
      userId,
      platform: accountData.platform,
      platformUserId: accountData.platformUserId,
      username: accountData.username,
      displayName: accountData.displayName,
      verified: accountData.verified,
      followerCount: accountData.followerCount,
      followingCount: accountData.followingCount,
      profileUrl: accountData.profileUrl,
      avatarUrl: accountData.avatarUrl,
      bio: accountData.bio,
      authenticityScore: authenticityScore.totalScore
    });

    // Recalculate user's trust score with new social account
    await this.db.calculateAndUpdateTrustScore(userId);
  }

  /**
   * Update social account data and recalculate authenticity
   */
  async updateSocialAccount(
    userId: number,
    platform: string,
    updates: Partial<SocialAccountData>
  ): Promise<void> {
    // Get existing account
    const accounts = await this.db.getSocialAccountsByUserId(userId);
    const existingAccount = accounts.find(acc => acc.platform === platform);
    
    if (!existingAccount) {
      throw new Error(`Social account not found: ${platform}`);
    }

    // Merge updates
    const updatedData: SocialAccountData = {
      platform: existingAccount.platform,
      platformUserId: existingAccount.platform_user_id,
      username: updates.username || existingAccount.username,
      displayName: updates.displayName || existingAccount.display_name,
      verified: updates.verified !== undefined ? updates.verified : existingAccount.verified,
      followerCount: updates.followerCount || existingAccount.follower_count,
      followingCount: updates.followingCount || existingAccount.following_count,
      accountAge: updates.accountAge || existingAccount.account_age,
      profileUrl: updates.profileUrl || existingAccount.profile_url,
      avatarUrl: updates.avatarUrl || existingAccount.avatar_url,
      bio: updates.bio || existingAccount.bio
    };

    // Recalculate authenticity score
    const platformConfig = SOCIAL_PLATFORMS[platform];
    const authenticityScore = this.calculateAuthenticityScore(updatedData, platformConfig);

    // Update in database
    // Note: Would need an updateSocialAccount method in DatabaseService
    
    // Recalculate user's trust score
    await this.db.calculateAndUpdateTrustScore(userId);
  }

  // =============================================
  // Social Media Verification Methods
  // =============================================

  /**
   * Verify social media account ownership
   */
  async verifySocialAccountOwnership(
    userId: number,
    platform: string,
    verificationMethod: 'post' | 'bio' | 'oauth' = 'oauth'
  ): Promise<boolean> {
    try {
      switch (verificationMethod) {
        case 'oauth':
          // Already verified through Auth0 OAuth flow
          return true;
          
        case 'post':
          // Verify by posting a specific code (future implementation)
          return await this.verifyByPost(userId, platform);
          
        case 'bio':
          // Verify by adding code to bio (future implementation)
          return await this.verifyByBio(userId, platform);
          
        default:
          return false;
      }
    } catch (error) {
      console.error(`Verification failed for ${platform}:`, error);
      return false;
    }
  }

  private async verifyByPost(userId: number, platform: string): Promise<boolean> {
    // Future implementation: Check for verification post
    return false;
  }

  private async verifyByBio(userId: number, platform: string): Promise<boolean> {
    // Future implementation: Check bio for verification code
    return false;
  }

  // =============================================
  // Batch Processing for Existing Users
  // =============================================

  /**
   * Process existing Auth0 users and create social accounts
   */
  async migrateExistingAuth0Users(): Promise<void> {
    console.log('Starting migration of existing Auth0 users...');
    
    // This would typically iterate through users and process their Auth0 identities
    // Implementation depends on your specific Auth0 setup and user data
    
    console.log('Migration completed');
  }
}

// =============================================
// Factory and Utility Functions
// =============================================

/**
 * Create social media service instance
 */
export function createSocialMediaService(
  db: DatabaseService,
  apiKeys: Record<string, string> = {}
): SocialMediaService {
  return new SocialMediaService(db, apiKeys);
}

/**
 * Get supported platforms list
 */
export function getSupportedPlatforms(): string[] {
  return Object.keys(SOCIAL_PLATFORMS);
}

/**
 * Get platform configuration
 */
export function getPlatformConfig(platform: string): SocialPlatformConfig | null {
  return SOCIAL_PLATFORMS[platform.toLowerCase()] || null;
}

// Export types and constants
export {
  SOCIAL_PLATFORMS,
  type SocialPlatformConfig,
  type SocialAccountData,
  type AuthenticityScore
}; 