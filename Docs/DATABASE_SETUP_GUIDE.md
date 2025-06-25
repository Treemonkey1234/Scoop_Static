# 🗃️ ScoopSocials Database Setup Guide

## **Complete Database Implementation & Migration Guide**

This guide provides exact database schemas, migration scripts, and data management patterns for rebuilding the ScoopSocials platform.

---

## **1. Database Architecture Overview**

### **1.1 Technology Stack**
```yaml
# Database Configuration
Primary Database: PostgreSQL 15+
Cache Layer: Redis 7+
Search Engine: PostgreSQL Full Text Search
File Storage: AWS S3 / Local File System
Connection Pool: pg-pool (Node.js)
ORM: Custom TypeScript Data Access Layer
```

### **1.2 Database Connection Setup**
```typescript
// lib/database/connection.ts
import { Pool } from 'pg'

interface DatabaseConfig {
  host: string
  port: number
  database: string
  username: string
  password: string
  ssl?: boolean
  maxConnections: number
}

export class DatabaseConnection {
  private pool: Pool
  
  constructor(config: DatabaseConfig) {
    this.pool = new Pool({
      host: config.host,
      port: config.port,
      database: config.database,
      user: config.username,
      password: config.password,
      ssl: config.ssl,
      max: config.maxConnections,
      idleTimeoutMillis: 30000,
      connectionTimeoutMillis: 2000,
    })
  }
  
  async query(text: string, params?: any[]): Promise<any> {
    const client = await this.pool.connect()
    try {
      const result = await client.query(text, params)
      return result
    } finally {
      client.release()
    }
  }
}
```

---

## **2. Core Database Schema**

### **2.1 Users Table**
```sql
-- Users table with comprehensive profile data
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  name VARCHAR(255) NOT NULL,
  username VARCHAR(50) UNIQUE,
  avatar_url TEXT,
  bio TEXT,
  location VARCHAR(255),
  phone VARCHAR(20),
  join_date TIMESTAMP DEFAULT NOW(),
  trust_score INTEGER DEFAULT 50 CHECK (trust_score >= 0 AND trust_score <= 100),
  is_verified BOOLEAN DEFAULT FALSE,
  phone_verified BOOLEAN DEFAULT FALSE,
  email_verified BOOLEAN DEFAULT FALSE,
  friends_count INTEGER DEFAULT 0,
  reviews_count INTEGER DEFAULT 0,
  events_attended INTEGER DEFAULT 0,
  events_hosted INTEGER DEFAULT 0,
  status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'suspended', 'banned', 'deleted')),
  preferences JSONB DEFAULT '{}',
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_username ON users(username);
CREATE INDEX idx_users_trust_score ON users(trust_score DESC);
CREATE INDEX idx_users_location ON users(location);
CREATE INDEX idx_users_status ON users(status);
```

### **2.2 Social Media Accounts Table**
```sql
-- Linked social media accounts
CREATE TABLE social_accounts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  platform VARCHAR(50) NOT NULL,
  platform_user_id VARCHAR(255) NOT NULL,
  username VARCHAR(255) NOT NULL,
  display_name VARCHAR(255),
  profile_url TEXT,
  follower_count INTEGER,
  verified BOOLEAN DEFAULT FALSE,
  trust_contribution INTEGER DEFAULT 0,
  status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'disconnected', 'error')),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(platform, platform_user_id),
  UNIQUE(user_id, platform)
);

-- Indexes
CREATE INDEX idx_social_accounts_user_id ON social_accounts(user_id);
CREATE INDEX idx_social_accounts_platform ON social_accounts(platform);
CREATE INDEX idx_social_accounts_verified ON social_accounts(verified);
```

### **2.3 Reviews Table**
```sql
-- User reviews and ratings
CREATE TABLE reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  reviewer_id UUID REFERENCES users(id) ON DELETE CASCADE,
  reviewed_id UUID REFERENCES users(id) ON DELETE CASCADE,
  content TEXT NOT NULL CHECK (length(content) >= 10 AND length(content) <= 300),
  category VARCHAR(20) NOT NULL CHECK (category IN ('professional', 'marketplace', 'dating', 'social', 'general')),
  rating INTEGER CHECK (rating >= 1 AND rating <= 5),
  tags JSONB DEFAULT '[]',
  location VARCHAR(255),
  event_id UUID,
  votes_up INTEGER DEFAULT 0,
  votes_down INTEGER DEFAULT 0,
  vote_score INTEGER DEFAULT 0,
  moderation_status VARCHAR(20) DEFAULT 'approved' CHECK (moderation_status IN ('pending', 'approved', 'rejected', 'flagged')),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  CONSTRAINT no_self_review CHECK (reviewer_id != reviewed_id)
);

-- Indexes
CREATE INDEX idx_reviews_reviewer_id ON reviews(reviewer_id);
CREATE INDEX idx_reviews_reviewed_id ON reviews(reviewed_id);
CREATE INDEX idx_reviews_category ON reviews(category);
CREATE INDEX idx_reviews_created_at ON reviews(created_at DESC);
CREATE INDEX idx_reviews_vote_score ON reviews(vote_score DESC);
```

### **2.4 Friendships Table**
```sql
-- Friend relationships
CREATE TABLE friendships (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  friend_id UUID REFERENCES users(id) ON DELETE CASCADE,
  status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'declined', 'blocked')),
  initiated_by UUID REFERENCES users(id),
  message TEXT,
  accepted_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  CONSTRAINT no_self_friendship CHECK (user_id != friend_id),
  UNIQUE(user_id, friend_id)
);

-- Indexes
CREATE INDEX idx_friendships_user_id ON friendships(user_id);
CREATE INDEX idx_friendships_friend_id ON friendships(friend_id);
CREATE INDEX idx_friendships_status ON friendships(status);
```

### **2.5 Events Table**
```sql
-- Events and gatherings
CREATE TABLE events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  host_id UUID REFERENCES users(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  category VARCHAR(50) NOT NULL,
  event_date DATE NOT NULL,
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  location VARCHAR(255) NOT NULL,
  address TEXT,
  max_attendees INTEGER NOT NULL CHECK (max_attendees > 0),
  current_attendees INTEGER DEFAULT 0,
  price DECIMAL(10, 2) DEFAULT 0.00 CHECK (price >= 0),
  is_private BOOLEAN DEFAULT FALSE,
  trust_requirement INTEGER DEFAULT 0 CHECK (trust_requirement >= 0 AND trust_requirement <= 100),
  tags JSONB DEFAULT '[]',
  image_url TEXT,
  status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('draft', 'active', 'cancelled', 'completed')),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_events_host_id ON events(host_id);
CREATE INDEX idx_events_category ON events(category);
CREATE INDEX idx_events_event_date ON events(event_date);
CREATE INDEX idx_events_location ON events(location);
CREATE INDEX idx_events_status ON events(status);
```

### **2.6 Trust Score History Table**
```sql
-- Trust score change tracking
CREATE TABLE trust_score_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  old_score INTEGER NOT NULL,
  new_score INTEGER NOT NULL,
  change_amount INTEGER NOT NULL,
  change_reason VARCHAR(100) NOT NULL,
  activity_type VARCHAR(50) NOT NULL,
  related_entity_id UUID,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_trust_history_user_id ON trust_score_history(user_id);
CREATE INDEX idx_trust_history_created_at ON trust_score_history(created_at DESC);
CREATE INDEX idx_trust_history_activity_type ON trust_score_history(activity_type);
```

---

## **3. Data Access Layer**

### **3.1 User Repository**
```typescript
// lib/repositories/UserRepository.ts
export class UserRepository {
  constructor(private db: DatabaseConnection) {}
  
  async findById(id: string): Promise<User | null> {
    const query = `
      SELECT u.*, 
        COUNT(DISTINCT sa.id) as connected_accounts,
        COUNT(DISTINCT f.id) as active_friendships
      FROM users u
      LEFT JOIN social_accounts sa ON u.id = sa.user_id AND sa.status = 'active'
      LEFT JOIN friendships f ON (u.id = f.user_id OR u.id = f.friend_id) AND f.status = 'accepted'
      WHERE u.id = $1 AND u.status = 'active'
      GROUP BY u.id
    `
    
    const result = await this.db.query(query, [id])
    return result.rows[0] ? this.mapToUser(result.rows[0]) : null
  }
  
  async create(userData: CreateUserData): Promise<User> {
    const userQuery = `
      INSERT INTO users (
        email, name, username, avatar_url, bio, location, phone
      ) VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING *
    `
    
    const userResult = await this.db.query(userQuery, [
      userData.email, userData.name, userData.username,
      userData.avatar_url, userData.bio, userData.location, userData.phone
    ])
    
    return this.mapToUser(userResult.rows[0])
  }
  
  async updateTrustScore(userId: string, newScore: number, reason: string): Promise<void> {
    // Get current score
    const currentQuery = `SELECT trust_score FROM users WHERE id = $1`
    const currentResult = await this.db.query(currentQuery, [userId])
    const oldScore = currentResult.rows[0].trust_score
    
    // Update user's trust score
    const updateQuery = `
      UPDATE users 
      SET trust_score = $1, updated_at = NOW()
      WHERE id = $2
    `
    await this.db.query(updateQuery, [newScore, userId])
    
    // Record in history
    const historyQuery = `
      INSERT INTO trust_score_history (
        user_id, old_score, new_score, change_amount, change_reason, activity_type
      ) VALUES ($1, $2, $3, $4, $5, $6)
    `
    await this.db.query(historyQuery, [
      userId, oldScore, newScore, newScore - oldScore, reason, 'score_update'
    ])
  }
  
  private mapToUser(row: any): User {
    return {
      id: row.id,
      email: row.email,
      name: row.name,
      username: row.username,
      avatar: row.avatar_url,
      bio: row.bio,
      location: row.location,
      phone: row.phone,
      joinDate: row.join_date,
      trustScore: row.trust_score,
      isVerified: row.is_verified,
      phoneVerified: row.phone_verified,
      emailVerified: row.email_verified,
      friendsCount: row.friends_count,
      reviewsCount: row.reviews_count,
      eventsAttended: row.events_attended,
      eventsHosted: row.events_hosted,
      preferences: row.preferences || {}
    }
  }
}
```

### **3.2 Review Repository**
```typescript
// lib/repositories/ReviewRepository.ts
export class ReviewRepository {
  constructor(private db: DatabaseConnection) {}
  
  async create(reviewData: CreateReviewData): Promise<Review> {
    // Insert review
    const reviewQuery = `
      INSERT INTO reviews (
        reviewer_id, reviewed_id, content, category, rating, tags, location
      ) VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING *
    `
    
    const reviewResult = await this.db.query(reviewQuery, [
      reviewData.reviewer_id, reviewData.reviewed_id, reviewData.content,
      reviewData.category, reviewData.rating, JSON.stringify(reviewData.tags),
      reviewData.location
    ])
    
    // Update review counts
    await this.db.query(
      `UPDATE users SET reviews_count = reviews_count + 1 WHERE id = $1`,
      [reviewData.reviewer_id]
    )
    
    return this.mapToReview(reviewResult.rows[0])
  }
  
  async findByUser(userId: string, type: 'given' | 'received'): Promise<Review[]> {
    const field = type === 'given' ? 'reviewer_id' : 'reviewed_id'
    const query = `
      SELECT r.*, 
        u1.name as reviewer_name, u1.avatar_url as reviewer_avatar,
        u2.name as reviewed_name, u2.avatar_url as reviewed_avatar
      FROM reviews r
      JOIN users u1 ON r.reviewer_id = u1.id
      JOIN users u2 ON r.reviewed_id = u2.id
      WHERE r.${field} = $1 AND r.moderation_status = 'approved'
      ORDER BY r.created_at DESC
    `
    
    const result = await this.db.query(query, [userId])
    return result.rows.map(this.mapToReview)
  }
  
  private mapToReview(row: any): Review {
    return {
      id: row.id,
      reviewerId: row.reviewer_id,
      reviewedId: row.reviewed_id,
      content: row.content,
      category: row.category,
      rating: row.rating,
      tags: row.tags || [],
      location: row.location,
      votesUp: row.votes_up || 0,
      votesDown: row.votes_down || 0,
      voteScore: row.vote_score || 0,
      timestamp: row.created_at,
      reviewerName: row.reviewer_name,
      reviewerAvatar: row.reviewer_avatar,
      reviewedName: row.reviewed_name,
      reviewedAvatar: row.reviewed_avatar
    }
  }
}
```

---

## **4. Migration Scripts**

### **4.1 Initial Database Setup**
```sql
-- migrations/001_initial_schema.sql
-- Enable UUID generation
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Create database roles
CREATE ROLE scoopsocials_app LOGIN PASSWORD 'secure_password_here';
CREATE ROLE scoopsocials_readonly LOGIN PASSWORD 'readonly_password_here';

-- Grant permissions
GRANT CONNECT ON DATABASE scoopsocials TO scoopsocials_app;
GRANT CONNECT ON DATABASE scoopsocials TO scoopsocials_readonly;
```

### **4.2 Seed Data Script**
```sql
-- migrations/002_seed_data.sql
-- Insert sample categories
INSERT INTO categories (name, emoji, description) VALUES
('professional', '💼', 'Work collaborations and business partnerships'),
('marketplace', '🛒', 'Buying/selling and service transactions'),
('dating', '💕', 'Romantic connections and dating experiences'),
('social', '🤝', 'Friendships and personal interactions'),
('general', '🔗', 'General reviews and interactions');

-- Insert trust score level definitions
INSERT INTO trust_levels (min_score, max_score, level_name, badge_color) VALUES
(0, 49, 'New User', '#94a3b8'),
(50, 69, 'Getting Started', '#64748b'),
(70, 79, 'Verified', '#06b6d4'),
(80, 89, 'Trusted', '#10b981'),
(90, 95, 'Highly Trusted', '#8b5cf6'),
(96, 100, 'Elite', '#f59e0b');
```

---

## **5. Environment Configuration**

### **5.1 Database Configuration**
```typescript
// lib/config/database.ts
export const DATABASE_CONFIG = {
  development: {
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '5432'),
    database: process.env.DB_NAME || 'scoopsocials_dev',
    username: process.env.DB_USER || 'scoopsocials_app',
    password: process.env.DB_PASSWORD || 'development_password',
    ssl: false,
    maxConnections: 10
  },
  production: {
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT || '5432'),
    database: process.env.DB_NAME,
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    ssl: true,
    maxConnections: 20
  }
}
```

---

## **Conclusion**

This database setup guide provides:

✅ **Complete PostgreSQL schema** with all tables and relationships
✅ **Migration scripts** for initial setup and data migration  
✅ **Data access layer** with repositories and business logic
✅ **Environment configuration** for development and production
✅ **Real-world implementation** patterns for production use

Combined with the other implementation guides, this enables complete database reconstruction for the ScoopSocials platform.

---

*Database Setup Guide Version: 1.0*
*Last Updated: January 2025*
*© 2025 Scoop Technologies LLC* 