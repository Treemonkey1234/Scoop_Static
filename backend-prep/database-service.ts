/**
 * Database Service Layer for Scoop Social Platform
 * Bridges between PostgreSQL database and business logic
 * Handles data transformation and trust score integration
 */

import { Pool, PoolClient } from 'pg';
import { UserTrustData, TrustScoreCalculation, calculateUserTrustScore, predictScoreChange } from './trust-score-algorithm';

// =============================================
// Database Connection & Configuration
// =============================================

export interface DatabaseConfig {
  host: string;
  port: number;
  database: string;
  user: string;
  password: string;
  ssl: boolean;
  poolMin: number;
  poolMax: number;
  idleTimeout: number;
  acquireTimeout: number;
}

export class DatabaseConnection {
  private pool: Pool;

  constructor(config: DatabaseConfig) {
    this.pool = new Pool({
      host: config.host,
      port: config.port,
      database: config.database,
      user: config.user,
      password: config.password,
      ssl: config.ssl ? { rejectUnauthorized: false } : false,
      min: config.poolMin,
      max: config.poolMax,
      idleTimeoutMillis: config.idleTimeout,
      acquireTimeoutMillis: config.acquireTimeout,
    });

    // Handle pool errors
    this.pool.on('error', (err) => {
      console.error('Unexpected error on idle client:', err);
    });
  }

  async query(text: string, params?: any[]): Promise<any> {
    const client = await this.pool.connect();
    try {
      const result = await client.query(text, params);
      return result;
    } finally {
      client.release();
    }
  }

  async transaction<T>(callback: (client: PoolClient) => Promise<T>): Promise<T> {
    const client = await this.pool.connect();
    try {
      await client.query('BEGIN');
      const result = await callback(client);
      await client.query('COMMIT');
      return result;
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  }

  async close(): Promise<void> {
    await this.pool.end();
  }
}

// =============================================
// Data Models (Database to TypeScript)
// =============================================

export interface DatabaseUser {
  id: number;
  auth0_user_id: string;
  email: string;
  name: string;
  username?: string;
  avatar_url?: string;
  bio?: string;
  location?: string;
  phone?: string;
  trust_score: number;
  join_date: Date;
  is_verified: boolean;
  phone_verified: boolean;
  email_verified: boolean;
  friends_count: number;
  reviews_count: number;
  events_attended: number;
  events_hosted: number;
  status: 'active' | 'suspended' | 'banned' | 'deleted';
  preferences: Record<string, any>;
  created_at: Date;
  updated_at: Date;
}

export interface DatabaseSocialAccount {
  id: number;
  user_id: number;
  platform: string;
  platform_user_id: string;
  username: string;
  display_name?: string;
  verified: boolean;
  follower_count?: number;
  following_count?: number;
  account_age?: Date;
  oauth_token_encrypted?: string;
  profile_url?: string;
  avatar_url?: string;
  bio?: string;
  trust_contribution: number;
  authenticity_score: number;
  status: 'active' | 'disconnected' | 'error';
  verification_method: 'oauth' | 'manual' | 'api';
  last_verified: Date;
  created_at: Date;
  updated_at: Date;
}

export interface DatabaseReview {
  id: number;
  reviewer_id: number;
  reviewed_id: number;
  content: string;
  category: string;
  tags: string[];
  is_event_review: boolean;
  event_id?: number;
  upvotes: number;
  downvotes: number;
  total_votes: number;
  status: 'active' | 'flagged' | 'removed' | 'pending';
  created_at: Date;
  updated_at: Date;
}

export interface DatabaseFriendship {
  id: number;
  user_id: number;
  friend_id: number;
  status: 'pending' | 'accepted' | 'blocked' | 'declined';
  initiated_by: number;
  requested_at: Date;
  accepted_at?: Date;
  created_at: Date;
  updated_at: Date;
}

// =============================================
// Core Database Service Class
// =============================================

export class DatabaseService {
  private db: DatabaseConnection;

  constructor(config: DatabaseConfig) {
    this.db = new DatabaseConnection(config);
  }

  // =============================================
  // User Management
  // =============================================

  async getUserById(userId: number): Promise<DatabaseUser | null> {
    const result = await this.db.query(
      'SELECT * FROM users WHERE id = $1 AND status = $2',
      [userId, 'active']
    );
    return result.rows[0] || null;
  }

  async getUserByAuth0Id(auth0UserId: string): Promise<DatabaseUser | null> {
    const result = await this.db.query(
      'SELECT * FROM users WHERE auth0_user_id = $1 AND status = $2',
      [auth0UserId, 'active']
    );
    return result.rows[0] || null;
  }

  async getUserByEmail(email: string): Promise<DatabaseUser | null> {
    const result = await this.db.query(
      'SELECT * FROM users WHERE email = $1 AND status = $2',
      [email, 'active']
    );
    return result.rows[0] || null;
  }

  async createUser(userData: {
    auth0UserId: string;
    email: string;
    name: string;
    avatar?: string;
  }): Promise<DatabaseUser> {
    const result = await this.db.query(`
      INSERT INTO users (auth0_user_id, email, name, avatar_url, trust_score, join_date, email_verified)
      VALUES ($1, $2, $3, $4, $5, NOW(), $6)
      RETURNING *
    `, [userData.auth0UserId, userData.email, userData.name, userData.avatar, 50, true]);

    return result.rows[0];
  }

  async updateUser(userId: number, updates: Partial<DatabaseUser>): Promise<DatabaseUser> {
    const updateFields: string[] = [];
    const updateValues: any[] = [];
    let paramIndex = 1;

    Object.entries(updates).forEach(([key, value]) => {
      if (value !== undefined && key !== 'id' && key !== 'created_at') {
        updateFields.push(`${key} = $${paramIndex}`);
        updateValues.push(value);
        paramIndex++;
      }
    });

    updateFields.push(`updated_at = NOW()`);
    updateValues.push(userId);

    const result = await this.db.query(`
      UPDATE users 
      SET ${updateFields.join(', ')}
      WHERE id = $${paramIndex}
      RETURNING *
    `, updateValues);

    return result.rows[0];
  }

  // =============================================
  // Social Account Management
  // =============================================

  async getSocialAccountsByUserId(userId: number): Promise<DatabaseSocialAccount[]> {
    const result = await this.db.query(
      'SELECT * FROM social_accounts WHERE user_id = $1 AND status = $2 ORDER BY created_at',
      [userId, 'active']
    );
    return result.rows;
  }

  async createSocialAccount(accountData: {
    userId: number;
    platform: string;
    platformUserId: string;
    username: string;
    displayName?: string;
    verified?: boolean;
    followerCount?: number;
    followingCount?: number;
    profileUrl?: string;
    avatarUrl?: string;
    bio?: string;
    authenticityScore?: number;
  }): Promise<DatabaseSocialAccount> {
    const result = await this.db.query(`
      INSERT INTO social_accounts (
        user_id, platform, platform_user_id, username, display_name,
        verified, follower_count, following_count, profile_url, avatar_url,
        bio, authenticity_score, status, verification_method, last_verified
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, NOW())
      RETURNING *
    `, [
      accountData.userId,
      accountData.platform,
      accountData.platformUserId,
      accountData.username,
      accountData.displayName,
      accountData.verified || false,
      accountData.followerCount,
      accountData.followingCount,
      accountData.profileUrl,
      accountData.avatarUrl,
      accountData.bio,
      accountData.authenticityScore || 0,
      'active',
      'oauth'
    ]);

    return result.rows[0];
  }

  // =============================================
  // Trust Score Integration
  // =============================================

  async getUserTrustData(userId: number): Promise<UserTrustData> {
    // Get basic user data
    const user = await this.getUserById(userId);
    if (!user) {
      throw new Error(`User ${userId} not found`);
    }

    // Get social accounts
    const socialAccounts = await this.getSocialAccountsByUserId(userId);

    // Get friendship data
    const friendshipResult = await this.db.query(`
      SELECT COUNT(*) as friends_count,
             COUNT(CASE WHEN f2.friend_id IS NOT NULL THEN 1 END) as mutual_friends
      FROM friendships f1
      LEFT JOIN friendships f2 ON f1.friend_id = f2.user_id 
                                AND f2.friend_id IN (
                                  SELECT friend_id FROM friendships 
                                  WHERE user_id = $1 AND status = 'accepted'
                                )
      WHERE f1.user_id = $1 AND f1.status = 'accepted'
    `, [userId]);

    // Get review stats
    const reviewResult = await this.db.query(`
      SELECT 
        COUNT(CASE WHEN reviewer_id = $1 THEN 1 END) as reviews_given,
        COUNT(CASE WHEN reviewed_id = $1 THEN 1 END) as reviews_received,
        COALESCE(SUM(CASE WHEN reviewed_id = $1 THEN total_votes END), 0) as total_votes,
        COALESCE(SUM(CASE WHEN reviewed_id = $1 THEN upvotes END), 0) as upvotes_received,
        COALESCE(SUM(CASE WHEN reviewed_id = $1 THEN downvotes END), 0) as downvotes_received
      FROM reviews 
      WHERE (reviewer_id = $1 OR reviewed_id = $1) AND status = 'active'
    `, [userId]);

    // Get event participation
    const eventResult = await this.db.query(`
      SELECT 
        COUNT(CASE WHEN ea.status = 'attended' THEN 1 END) as events_attended,
        COUNT(CASE WHEN e.host_id = $1 THEN 1 END) as events_hosted
      FROM events e
      LEFT JOIN event_attendees ea ON e.id = ea.event_id AND ea.user_id = $1
      WHERE e.host_id = $1 OR ea.user_id = $1
    `, [userId]);

    // Get violations and reports
    const violationResult = await this.db.query(`
      SELECT 
        COALESCE(reported_count, 0) as reported_count,
        COALESCE(violations_count, 0) as violations_count,
        COALESCE(content_removed_count, 0) as content_removed_count,
        COALESCE(account_suspensions, 0) as account_suspensions
      FROM users WHERE id = $1
    `, [userId]);

    // Calculate login frequency (simplified - days per week over last month)
    const loginResult = await this.db.query(`
      SELECT COUNT(DISTINCT DATE(created_at)) as login_days
      FROM user_sessions 
      WHERE user_id = $1 AND created_at > NOW() - INTERVAL '30 days'
    `, [userId]);

    const friendshipData = friendshipResult.rows[0];
    const reviewData = reviewResult.rows[0];
    const eventData = eventResult.rows[0];
    const violationData = violationResult.rows[0];
    const loginData = loginResult.rows[0];

    // Transform to UserTrustData format
    const userTrustData: UserTrustData = {
      userId: user.id,
      phoneVerified: user.phone_verified,
      emailVerified: user.email_verified,
      profileFields: {
        name: !!user.name,
        bio: !!user.bio,
        location: !!user.location,
        avatar: !!user.avatar_url,
        interests: true // Will need to check user_interests table
      },
      connectedSocialAccounts: socialAccounts.map(account => ({
        platform: account.platform,
        verified: account.verified,
        followerCount: account.follower_count,
        accountAge: account.account_age,
        authenticityScore: account.authenticity_score
      })),
      friendsCount: parseInt(friendshipData.friends_count) || 0,
      mutualFriendsCount: parseInt(friendshipData.mutual_friends) || 0,
      reviewsReceived: parseInt(reviewData.reviews_received) || 0,
      reviewsGiven: parseInt(reviewData.reviews_given) || 0,
      eventsAttended: parseInt(eventData.events_attended) || 0,
      eventsHosted: parseInt(eventData.events_hosted) || 0,
      upvotesReceived: parseInt(reviewData.upvotes_received) || 0,
      downvotesReceived: parseInt(reviewData.downvotes_received) || 0,
      joinDate: user.join_date,
      lastActiveDate: user.updated_at,
      loginFrequency: Math.min((parseInt(loginData.login_days) || 0) / 4, 7), // Convert to days per week
      reportedCount: parseInt(violationData.reported_count) || 0,
      violationsCount: parseInt(violationData.violations_count) || 0,
      contentRemovedCount: parseInt(violationData.content_removed_count) || 0,
      accountSuspensions: parseInt(violationData.account_suspensions) || 0
    };

    return userTrustData;
  }

  async calculateAndUpdateTrustScore(userId: number): Promise<TrustScoreCalculation> {
    const trustData = await this.getUserTrustData(userId);
    const calculation = calculateUserTrustScore(trustData);

    // Update user's trust score in database
    await this.updateUser(userId, { trust_score: calculation.totalScore });

    // Log trust score change
    await this.logTrustScoreChange(userId, calculation.totalScore, 'recalculated', 'Trust score recalculated');

    return calculation;
  }

  async logTrustScoreChange(
    userId: number, 
    newScore: number, 
    activityType: string, 
    description: string,
    relatedUserId?: number,
    relatedReviewId?: number,
    relatedEventId?: number
  ): Promise<void> {
    const user = await this.getUserById(userId);
    if (!user) return;

    await this.db.query(`
      INSERT INTO trust_score_history (
        user_id, old_score, new_score, activity_type, activity_description,
        related_user_id, related_review_id, related_event_id
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
    `, [userId, user.trust_score, newScore, activityType, description, relatedUserId, relatedReviewId, relatedEventId]);
  }

  // =============================================
  // Friend Management
  // =============================================

  async getFriendships(userId: number, status?: string): Promise<DatabaseFriendship[]> {
    let query = 'SELECT * FROM friendships WHERE (user_id = $1 OR friend_id = $1)';
    const params = [userId];

    if (status) {
      query += ' AND status = $2';
      params.push(status);
    }

    query += ' ORDER BY created_at DESC';

    const result = await this.db.query(query, params);
    return result.rows;
  }

  async createFriendship(userId: number, friendId: number): Promise<DatabaseFriendship> {
    return this.db.transaction(async (client) => {
      // Insert bidirectional friendship
      const result1 = await client.query(`
        INSERT INTO friendships (user_id, friend_id, status, initiated_by, requested_at)
        VALUES ($1, $2, 'pending', $1, NOW())
        RETURNING *
      `, [userId, friendId]);

      await client.query(`
        INSERT INTO friendships (user_id, friend_id, status, initiated_by, requested_at)
        VALUES ($1, $2, 'pending', $3, NOW())
      `, [friendId, userId, userId]);

      return result1.rows[0];
    });
  }

  async updateFriendship(friendshipId: number, status: string): Promise<DatabaseFriendship> {
    return this.db.transaction(async (client) => {
      // Get the friendship
      const friendship = await client.query('SELECT * FROM friendships WHERE id = $1', [friendshipId]);
      if (!friendship.rows[0]) {
        throw new Error('Friendship not found');
      }

      const { user_id, friend_id } = friendship.rows[0];

      // Update both directions
      const result = await client.query(`
        UPDATE friendships 
        SET status = $1, accepted_at = CASE WHEN $1 = 'accepted' THEN NOW() ELSE accepted_at END, updated_at = NOW()
        WHERE (user_id = $2 AND friend_id = $3) OR (user_id = $3 AND friend_id = $2)
        RETURNING *
      `, [status, user_id, friend_id]);

      return result.rows[0];
    });
  }

  // =============================================
  // Review Management
  // =============================================

  async createReview(reviewData: {
    reviewerId: number;
    reviewedId: number;
    content: string;
    category: string;
    tags?: string[];
    isEventReview?: boolean;
    eventId?: number;
  }): Promise<DatabaseReview> {
    const result = await this.db.query(`
      INSERT INTO reviews (
        reviewer_id, reviewed_id, content, category, tags, 
        is_event_review, event_id, status
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, 'active')
      RETURNING *
    `, [
      reviewData.reviewerId,
      reviewData.reviewedId,
      reviewData.content,
      reviewData.category,
      reviewData.tags || [],
      reviewData.isEventReview || false,
      reviewData.eventId
    ]);

    // Recalculate trust score for reviewed user
    await this.calculateAndUpdateTrustScore(reviewData.reviewedId);

    return result.rows[0];
  }

  async getReviewsByUserId(userId: number, received: boolean = true): Promise<DatabaseReview[]> {
    const field = received ? 'reviewed_id' : 'reviewer_id';
    const result = await this.db.query(
      `SELECT * FROM reviews WHERE ${field} = $1 AND status = 'active' ORDER BY created_at DESC`,
      [userId]
    );
    return result.rows;
  }

  // =============================================
  // Event Management
  // =============================================

  async createEvent(eventData: {
    hostId: number;
    title: string;
    description: string;
    category: string;
    eventDate: Date;
    startTime: string;
    endTime: string;
    locationName: string;
    address: string;
    latitude?: number;
    longitude?: number;
    maxAttendees?: number;
    priceCents?: number;
    trustRequirement?: number;
    isPrivate?: boolean;
    tags?: string[];
  }): Promise<any> {
    const result = await this.db.query(`
      INSERT INTO events (
        host_id, title, description, category, event_date, start_time, end_time,
        location_name, address, latitude, longitude, max_attendees, price_cents,
        trust_requirement, is_private, tags, status
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, 'upcoming')
      RETURNING *
    `, [
      eventData.hostId, eventData.title, eventData.description, eventData.category,
      eventData.eventDate, eventData.startTime, eventData.endTime,
      eventData.locationName, eventData.address, eventData.latitude, eventData.longitude,
      eventData.maxAttendees, eventData.priceCents || 0, eventData.trustRequirement || 50,
      eventData.isPrivate || false, eventData.tags || []
    ]);

    return result.rows[0];
  }

  // =============================================
  // Utility Methods
  // =============================================

  async healthCheck(): Promise<{ status: string; timestamp: Date }> {
    const result = await this.db.query('SELECT NOW() as timestamp');
    return {
      status: 'healthy',
      timestamp: result.rows[0].timestamp
    };
  }

  async close(): Promise<void> {
    await this.db.close();
  }
}

// =============================================
// Factory Function for Database Service
// =============================================

export function createDatabaseService(config: DatabaseConfig): DatabaseService {
  return new DatabaseService(config);
}

// Export utility functions
export { calculateUserTrustScore, predictScoreChange } from './trust-score-algorithm'; 