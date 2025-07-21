/**
 * Trust Score Algorithm Implementation
 * 11-Factor Trust Scoring System for Scoop Social Platform
 * 
 * Score Range: 0-100
 * Default Starting Score: 50
 * Recalculation: Real-time on user activities
 */

export interface TrustScoreFactors {
  // Core Identity Factors (40 points)
  phoneVerification: number;        // 15 points max
  emailVerification: number;        // 10 points max  
  profileCompleteness: number;      // 15 points max

  // Social Validation Factors (35 points)
  connectedAccounts: number;        // 20 points max
  friendNetwork: number;            // 10 points max
  communityEngagement: number;      // 5 points max

  // Platform Activity Factors (25 points)
  reviewsReceived: number;          // 10 points max
  eventParticipation: number;       // 8 points max
  platformTenure: number;           // 7 points max

  // Behavior & Quality Factors (bonus/penalty)
  accountAuthenticity: number;      // 5 points max
  communityStanding: number;        // Penalties for violations (-50 max)
}

export interface TrustScoreCalculation {
  totalScore: number;
  factors: TrustScoreFactors;
  breakdown: {
    category: string;
    points: number;
    maxPossible: number;
    percentage: number;
  }[];
  recommendations: string[];
  lastCalculated: Date;
}

export interface UserTrustData {
  userId: number;
  
  // Identity verification
  phoneVerified: boolean;
  emailVerified: boolean;
  profileFields: {
    name: boolean;
    bio: boolean;
    location: boolean;
    avatar: boolean;
    interests: boolean;
  };

  // Social connections
  connectedSocialAccounts: {
    platform: string;
    verified: boolean;
    followerCount?: number;
    accountAge?: Date;
    authenticityScore: number;
  }[];
  
  // Network metrics
  friendsCount: number;
  mutualFriendsCount: number;
  
  // Activity metrics
  reviewsReceived: number;
  reviewsGiven: number;
  eventsAttended: number;
  eventsHosted: number;
  upvotesReceived: number;
  downvotesReceived: number;
  
  // Platform engagement
  joinDate: Date;
  lastActiveDate: Date;
  loginFrequency: number; // days per week
  
  // Violations and reports
  reportedCount: number;
  violationsCount: number;
  contentRemovedCount: number;
  accountSuspensions: number;
}

class TrustScoreCalculator {
  
  /**
   * Calculate complete trust score for a user
   */
  public calculateTrustScore(userData: UserTrustData): TrustScoreCalculation {
    const factors: TrustScoreFactors = {
      phoneVerification: this.calculatePhoneVerification(userData),
      emailVerification: this.calculateEmailVerification(userData),
      profileCompleteness: this.calculateProfileCompleteness(userData),
      connectedAccounts: this.calculateConnectedAccounts(userData),
      friendNetwork: this.calculateFriendNetwork(userData),
      communityEngagement: this.calculateCommunityEngagement(userData),
      reviewsReceived: this.calculateReviewsReceived(userData),
      eventParticipation: this.calculateEventParticipation(userData),
      platformTenure: this.calculatePlatformTenure(userData),
      accountAuthenticity: this.calculateAccountAuthenticity(userData),
      communityStanding: this.calculateCommunityStanding(userData)
    };

    const totalScore = Math.max(0, Math.min(100, 
      factors.phoneVerification +
      factors.emailVerification +
      factors.profileCompleteness +
      factors.connectedAccounts +
      factors.friendNetwork +
      factors.communityEngagement +
      factors.reviewsReceived +
      factors.eventParticipation +
      factors.platformTenure +
      factors.accountAuthenticity +
      factors.communityStanding
    ));

    const breakdown = this.generateBreakdown(factors);
    const recommendations = this.generateRecommendations(factors, userData);

    return {
      totalScore: Math.round(totalScore),
      factors,
      breakdown,
      recommendations,
      lastCalculated: new Date()
    };
  }

  /**
   * Factor 1: Phone Verification (15 points max)
   */
  private calculatePhoneVerification(userData: UserTrustData): number {
    return userData.phoneVerified ? 15 : 0;
  }

  /**
   * Factor 2: Email Verification (10 points max)  
   */
  private calculateEmailVerification(userData: UserTrustData): number {
    return userData.emailVerified ? 10 : 0;
  }

  /**
   * Factor 3: Profile Completeness (15 points max)
   */
  private calculateProfileCompleteness(userData: UserTrustData): number {
    const fields = userData.profileFields;
    const completedFields = Object.values(fields).filter(Boolean).length;
    const totalFields = Object.keys(fields).length;
    
    return (completedFields / totalFields) * 15;
  }

  /**
   * Factor 4: Connected Social Accounts (20 points max)
   */
  private calculateConnectedAccounts(userData: UserTrustData): number {
    const accounts = userData.connectedSocialAccounts;
    
    if (accounts.length === 0) return 0;
    
    // Base points for number of accounts
    let basePoints = Math.min(accounts.length * 2, 10); // 2 points per account, max 10
    
    // Verification bonus
    const verifiedAccounts = accounts.filter(acc => acc.verified).length;
    const verificationBonus = verifiedAccounts * 2; // 2 points per verified account
    
    // Authenticity bonus (average authenticity score)
    const avgAuthenticity = accounts.reduce((sum, acc) => sum + acc.authenticityScore, 0) / accounts.length;
    const authenticityBonus = (avgAuthenticity / 100) * 8; // Up to 8 points based on authenticity
    
    return Math.min(basePoints + verificationBonus + authenticityBonus, 20);
  }

  /**
   * Factor 5: Friend Network Quality (10 points max)
   */
  private calculateFriendNetwork(userData: UserTrustData): number {
    const friendsCount = userData.friendsCount;
    const mutualFriendsCount = userData.mutualFriendsCount;
    
    if (friendsCount === 0) return 0;
    
    // Base points for having friends (diminishing returns)
    let basePoints;
    if (friendsCount >= 50) basePoints = 6;
    else if (friendsCount >= 20) basePoints = 5;
    else if (friendsCount >= 10) basePoints = 4;
    else if (friendsCount >= 5) basePoints = 3;
    else basePoints = friendsCount * 0.6; // 0.6 points per friend for <5 friends
    
    // Mutual friends bonus (indicates network overlap/authenticity)
    const mutualBonus = Math.min(mutualFriendsCount * 0.2, 4); // Up to 4 points
    
    return Math.min(basePoints + mutualBonus, 10);
  }

  /**
   * Factor 6: Community Engagement (5 points max)
   */
  private calculateCommunityEngagement(userData: UserTrustData): number {
    const reviewsGiven = userData.reviewsGiven;
    const upvotesReceived = userData.upvotesReceived;
    const loginFrequency = userData.loginFrequency; // days per week
    
    // Points for giving reviews (community contribution)
    const reviewPoints = Math.min(reviewsGiven * 0.2, 2); // Up to 2 points
    
    // Points for receiving upvotes (quality content)
    const upvotePoints = Math.min(upvotesReceived * 0.1, 2); // Up to 2 points
    
    // Points for regular engagement
    const engagementPoints = Math.min(loginFrequency / 7, 1); // Up to 1 point for daily use
    
    return reviewPoints + upvotePoints + engagementPoints;
  }

  /**
   * Factor 7: Reviews Received Quality (10 points max)
   */
  private calculateReviewsReceived(userData: UserTrustData): number {
    const reviewsReceived = userData.reviewsReceived;
    const upvotesReceived = userData.upvotesReceived;
    const downvotesReceived = userData.downvotesReceived;
    
    if (reviewsReceived === 0) return 0;
    
    // Base points for receiving reviews
    const basePoints = Math.min(reviewsReceived * 0.5, 6); // Up to 6 points
    
    // Quality bonus based on upvote ratio
    const totalVotes = upvotesReceived + downvotesReceived;
    const upvoteRatio = totalVotes > 0 ? upvotesReceived / totalVotes : 0.5;
    const qualityBonus = (upvoteRatio - 0.5) * 8; // Up to 4 points bonus, -4 penalty
    
    return Math.min(basePoints + qualityBonus, 10);
  }

  /**
   * Factor 8: Event Participation (8 points max)
   */
  private calculateEventParticipation(userData: UserTrustData): number {
    const eventsAttended = userData.eventsAttended;
    const eventsHosted = userData.eventsHosted;
    
    // Points for attending events
    const attendancePoints = Math.min(eventsAttended * 0.2, 5); // Up to 5 points
    
    // Bonus points for hosting events (community building)
    const hostingBonus = Math.min(eventsHosted * 0.5, 3); // Up to 3 points
    
    return attendancePoints + hostingBonus;
  }

  /**
   * Factor 9: Platform Tenure (7 points max)
   */
  private calculatePlatformTenure(userData: UserTrustData): number {
    const joinDate = userData.joinDate;
    const daysSinceJoining = Math.floor((Date.now() - joinDate.getTime()) / (1000 * 60 * 60 * 24));
    
    // Points based on account age (diminishing returns)
    if (daysSinceJoining >= 365) return 7; // 1+ years = max points
    if (daysSinceJoining >= 180) return 5; // 6+ months = 5 points
    if (daysSinceJoining >= 90) return 3;  // 3+ months = 3 points
    if (daysSinceJoining >= 30) return 2;  // 1+ months = 2 points
    if (daysSinceJoining >= 7) return 1;   // 1+ weeks = 1 point
    
    return 0; // Less than a week = 0 points
  }

  /**
   * Factor 10: Account Authenticity (5 points max)
   */
  private calculateAccountAuthenticity(userData: UserTrustData): number {
    const accounts = userData.connectedSocialAccounts;
    
    if (accounts.length === 0) return 0;
    
    // Average authenticity score of connected accounts
    const avgAuthenticity = accounts.reduce((sum, acc) => sum + acc.authenticityScore, 0) / accounts.length;
    
    // Convert to points (5 points max)
    return (avgAuthenticity / 100) * 5;
  }

  /**
   * Factor 11: Community Standing (Penalties for violations)
   */
  private calculateCommunityStanding(userData: UserTrustData): number {
    const reportedCount = userData.reportedCount;
    const violationsCount = userData.violationsCount;
    const contentRemovedCount = userData.contentRemovedCount;
    const accountSuspensions = userData.accountSuspensions;
    
    let penalty = 0;
    
    // Penalties for violations
    penalty += reportedCount * 1;           // -1 point per report
    penalty += violationsCount * 5;         // -5 points per violation
    penalty += contentRemovedCount * 3;     // -3 points per content removal
    penalty += accountSuspensions * 20;     // -20 points per suspension
    
    // Cap penalty at -50 points
    return Math.max(-50, -penalty);
  }

  /**
   * Generate detailed breakdown of score components
   */
  private generateBreakdown(factors: TrustScoreFactors) {
    return [
      {
        category: 'Identity Verification',
        points: factors.phoneVerification + factors.emailVerification + factors.profileCompleteness,
        maxPossible: 40,
        percentage: ((factors.phoneVerification + factors.emailVerification + factors.profileCompleteness) / 40) * 100
      },
      {
        category: 'Social Validation',
        points: factors.connectedAccounts + factors.friendNetwork + factors.communityEngagement,
        maxPossible: 35,
        percentage: ((factors.connectedAccounts + factors.friendNetwork + factors.communityEngagement) / 35) * 100
      },
      {
        category: 'Platform Activity',
        points: factors.reviewsReceived + factors.eventParticipation + factors.platformTenure,
        maxPossible: 25,
        percentage: ((factors.reviewsReceived + factors.eventParticipation + factors.platformTenure) / 25) * 100
      },
      {
        category: 'Account Quality',
        points: factors.accountAuthenticity + factors.communityStanding,
        maxPossible: 5,
        percentage: ((factors.accountAuthenticity + Math.max(0, factors.communityStanding)) / 5) * 100
      }
    ];
  }

  /**
   * Generate personalized recommendations for improving trust score
   */
  private generateRecommendations(factors: TrustScoreFactors, userData: UserTrustData): string[] {
    const recommendations: string[] = [];

    // Phone verification
    if (factors.phoneVerification === 0) {
      recommendations.push('Verify your phone number for +15 trust points');
    }

    // Email verification
    if (factors.emailVerification === 0) {
      recommendations.push('Verify your email address for +10 trust points');
    }

    // Profile completeness
    if (factors.profileCompleteness < 15) {
      const missingFields = Object.entries(userData.profileFields)
        .filter(([_, completed]) => !completed)
        .map(([field, _]) => field);
      recommendations.push(`Complete your profile (${missingFields.join(', ')}) for up to +${Math.round(15 - factors.profileCompleteness)} points`);
    }

    // Connected accounts
    if (factors.connectedAccounts < 10) {
      const accountsNeeded = Math.ceil((10 - factors.connectedAccounts) / 2);
      recommendations.push(`Connect ${accountsNeeded} more social accounts for trust building`);
    }

    // Friend network
    if (factors.friendNetwork < 5 && userData.friendsCount < 10) {
      recommendations.push('Add more friends to build your network');
    }

    // Reviews
    if (factors.reviewsReceived < 5) {
      recommendations.push('Ask friends to review you to build credibility');
    }

    // Events
    if (factors.eventParticipation < 4) {
      if (userData.eventsAttended < 10) {
        recommendations.push('Attend more events to increase your trust score');
      }
      if (userData.eventsHosted === 0) {
        recommendations.push('Host an event to earn bonus trust points');
      }
    }

    // Community engagement
    if (factors.communityEngagement < 3) {
      if (userData.reviewsGiven < 5) {
        recommendations.push('Write reviews for friends to boost engagement');
      }
    }

    return recommendations;
  }

  /**
   * Calculate trust score change for a specific activity
   */
  public calculateScoreChange(
    currentUserData: UserTrustData, 
    activity: string, 
    activityData?: any
  ): { oldScore: number; newScore: number; change: number } {
    
    const oldCalculation = this.calculateTrustScore(currentUserData);
    const oldScore = oldCalculation.totalScore;

    // Simulate the activity effect
    const newUserData = this.simulateActivity(currentUserData, activity, activityData);
    const newCalculation = this.calculateTrustScore(newUserData);
    const newScore = newCalculation.totalScore;

    return {
      oldScore,
      newScore,
      change: newScore - oldScore
    };
  }

  /**
   * Simulate the effect of an activity on user data
   */
  private simulateActivity(userData: UserTrustData, activity: string, activityData?: any): UserTrustData {
    const newData = { ...userData };

    switch (activity) {
      case 'phone_verified':
        newData.phoneVerified = true;
        break;
      case 'email_verified':
        newData.emailVerified = true;
        break;
      case 'profile_updated':
        if (activityData?.fields) {
          newData.profileFields = { ...newData.profileFields, ...activityData.fields };
        }
        break;
      case 'social_account_connected':
        if (activityData?.account) {
          newData.connectedSocialAccounts = [...newData.connectedSocialAccounts, activityData.account];
        }
        break;
      case 'friend_added':
        newData.friendsCount += 1;
        break;
      case 'review_received':
        newData.reviewsReceived += 1;
        if (activityData?.upvotes) newData.upvotesReceived += activityData.upvotes;
        if (activityData?.downvotes) newData.downvotesReceived += activityData.downvotes;
        break;
      case 'review_given':
        newData.reviewsGiven += 1;
        break;
      case 'event_attended':
        newData.eventsAttended += 1;
        break;
      case 'event_hosted':
        newData.eventsHosted += 1;
        break;
      case 'reported':
        newData.reportedCount += 1;
        break;
      case 'violation':
        newData.violationsCount += 1;
        break;
    }

    return newData;
  }
}

// Export singleton instance
export const trustScoreCalculator = new TrustScoreCalculator();

// Export utility functions
export function calculateUserTrustScore(userData: UserTrustData): TrustScoreCalculation {
  return trustScoreCalculator.calculateTrustScore(userData);
}

export function predictScoreChange(
  userData: UserTrustData, 
  activity: string, 
  activityData?: any
): { oldScore: number; newScore: number; change: number } {
  return trustScoreCalculator.calculateScoreChange(userData, activity, activityData);
}

/**
 * Example usage and testing
 */
export const exampleUserData: UserTrustData = {
  userId: 1,
  phoneVerified: true,
  emailVerified: true,
  profileFields: {
    name: true,
    bio: true,
    location: true,
    avatar: true,
    interests: false
  },
  connectedSocialAccounts: [
    { platform: 'google', verified: true, authenticityScore: 95 },
    { platform: 'linkedin', verified: true, authenticityScore: 90 },
    { platform: 'twitter', verified: false, authenticityScore: 75 }
  ],
  friendsCount: 15,
  mutualFriendsCount: 8,
  reviewsReceived: 12,
  reviewsGiven: 8,
  eventsAttended: 6,
  eventsHosted: 2,
  upvotesReceived: 25,
  downvotesReceived: 3,
  joinDate: new Date('2024-01-15'),
  lastActiveDate: new Date(),
  loginFrequency: 5,
  reportedCount: 0,
  violationsCount: 0,
  contentRemovedCount: 0,
  accountSuspensions: 0
};

// Example calculation
if (require.main === module) {
  const result = calculateUserTrustScore(exampleUserData);
  console.log('Trust Score Calculation:', JSON.stringify(result, null, 2));
} 