-- Scoop Social MVP Database Schema
-- PostgreSQL 15+ with UUID extension
-- Created for Digital Ocean Managed Database

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Enable trigram extension for better search
CREATE EXTENSION IF NOT EXISTS pg_trgm;

-- =============================================
-- USERS TABLE
-- =============================================
CREATE TABLE users (
    id BIGSERIAL PRIMARY KEY,                    -- Sequential user IDs: 1, 2, 3, 4, 5...
    auth0_user_id VARCHAR(255) UNIQUE,           -- Auth0 user identifier
    email VARCHAR(255) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    username VARCHAR(50) UNIQUE,                 -- Optional unique username
    avatar_url TEXT,
    bio TEXT,
    location VARCHAR(255),
    phone VARCHAR(20),
    
    -- Core metrics
    trust_score INTEGER DEFAULT 50 CHECK (trust_score >= 0 AND trust_score <= 100),
    join_date TIMESTAMP DEFAULT NOW(),
    
    -- Verification status
    is_verified BOOLEAN DEFAULT FALSE,
    phone_verified BOOLEAN DEFAULT FALSE,
    email_verified BOOLEAN DEFAULT FALSE,
    
    -- Social metrics (denormalized for performance)
    friends_count INTEGER DEFAULT 0,
    reviews_count INTEGER DEFAULT 0,
    events_attended INTEGER DEFAULT 0,
    events_hosted INTEGER DEFAULT 0,
    
    -- User status and settings
    status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'suspended', 'banned', 'deleted')),
    preferences JSONB DEFAULT '{}',
    
    -- Metadata
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- =============================================
-- SOCIAL ACCOUNTS TABLE
-- =============================================
CREATE TABLE social_accounts (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT REFERENCES users(id) ON DELETE CASCADE,
    
    -- Platform details
    platform VARCHAR(50) NOT NULL,               -- 'instagram', 'twitter', 'linkedin', etc.
    platform_user_id VARCHAR(255) NOT NULL,      -- Platform's internal user ID
    username VARCHAR(255) NOT NULL,              -- Platform username/handle
    display_name VARCHAR(255),                   -- Display name on that platform
    
    -- Verification and trust data
    verified BOOLEAN DEFAULT FALSE,              -- Platform verification status
    follower_count INTEGER,
    following_count INTEGER,
    account_age DATE,                           -- When the social account was created
    
    -- OAuth and connection data
    oauth_token_encrypted TEXT,                 -- Encrypted OAuth token
    profile_url TEXT,
    avatar_url TEXT,
    bio TEXT,
    
    -- Trust contribution
    trust_contribution INTEGER DEFAULT 0,       -- How much this account adds to trust score
    authenticity_score INTEGER DEFAULT 0,       -- 0-100 authenticity rating
    
    -- Status
    status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'disconnected', 'error')),
    last_verified TIMESTAMP DEFAULT NOW(),
    
    -- Metadata
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    
    UNIQUE(user_id, platform),                  -- One account per platform per user
    UNIQUE(platform, platform_user_id)         -- Platform user IDs are unique
);

-- =============================================
-- FRIEND RELATIONSHIPS TABLE
-- =============================================
CREATE TABLE friendships (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT REFERENCES users(id) ON DELETE CASCADE,
    friend_id BIGINT REFERENCES users(id) ON DELETE CASCADE,
    
    -- Friendship status
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'blocked', 'declined')),
    
    -- Who initiated the friendship
    initiated_by BIGINT REFERENCES users(id),
    
    -- Timestamps
    requested_at TIMESTAMP DEFAULT NOW(),
    accepted_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    
    UNIQUE(user_id, friend_id),
    CHECK(user_id != friend_id)                 -- Users can't friend themselves
);

-- =============================================
-- REVIEWS TABLE
-- =============================================
CREATE TABLE reviews (
    id BIGSERIAL PRIMARY KEY,
    reviewer_id BIGINT REFERENCES users(id) ON DELETE CASCADE,
    reviewed_id BIGINT REFERENCES users(id) ON DELETE CASCADE,
    
    -- Review content
    content TEXT NOT NULL,
    category VARCHAR(50) NOT NULL,              -- 'Professional', 'Social Scoop', etc.
    tags TEXT[],                               -- Array of tag strings
    
    -- Event context (if this is an event review)
    is_event_review BOOLEAN DEFAULT FALSE,
    event_id BIGINT,                           -- Will reference events table
    
    -- Voting and engagement
    upvotes INTEGER DEFAULT 0,
    downvotes INTEGER DEFAULT 0,
    total_votes INTEGER DEFAULT 0,             -- Denormalized: upvotes - downvotes
    
    -- Review status
    status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'flagged', 'removed', 'pending')),
    flagged_count INTEGER DEFAULT 0,
    
    -- Metadata
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    
    CHECK(reviewer_id != reviewed_id)          -- Users can't review themselves
);

-- =============================================
-- REVIEW VOTES TABLE
-- =============================================
CREATE TABLE review_votes (
    id BIGSERIAL PRIMARY KEY,
    review_id BIGINT REFERENCES reviews(id) ON DELETE CASCADE,
    user_id BIGINT REFERENCES users(id) ON DELETE CASCADE,
    
    vote_type VARCHAR(10) NOT NULL CHECK (vote_type IN ('up', 'down')),
    
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    
    UNIQUE(review_id, user_id)                 -- One vote per user per review
);

-- =============================================
-- EVENTS TABLE
-- =============================================
CREATE TABLE events (
    id BIGSERIAL PRIMARY KEY,
    host_id BIGINT REFERENCES users(id) ON DELETE CASCADE,
    
    -- Event details
    title VARCHAR(255) NOT NULL,
    description TEXT,
    category VARCHAR(50) NOT NULL,
    
    -- Date and time
    event_date DATE NOT NULL,
    start_time TIME,
    end_time TIME,
    timezone VARCHAR(50) DEFAULT 'America/Phoenix',
    
    -- Location
    location_name VARCHAR(255),
    address TEXT,
    latitude DECIMAL(10, 8),
    longitude DECIMAL(11, 8),
    
    -- Event settings
    max_attendees INTEGER,
    current_attendees INTEGER DEFAULT 0,
    price_cents INTEGER DEFAULT 0,            -- Price in cents (0 = free)
    
    -- Privacy and requirements
    is_private BOOLEAN DEFAULT FALSE,
    trust_requirement INTEGER DEFAULT 50,     -- Minimum trust score to attend
    
    -- Event status
    status VARCHAR(20) DEFAULT 'upcoming' CHECK (status IN ('draft', 'upcoming', 'ongoing', 'completed', 'cancelled')),
    
    -- Media
    image_url TEXT,
    tags TEXT[],
    
    -- Metadata
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- =============================================
-- EVENT ATTENDEES TABLE
-- =============================================
CREATE TABLE event_attendees (
    id BIGSERIAL PRIMARY KEY,
    event_id BIGINT REFERENCES events(id) ON DELETE CASCADE,
    user_id BIGINT REFERENCES users(id) ON DELETE CASCADE,
    
    -- Attendance status
    status VARCHAR(20) DEFAULT 'registered' CHECK (status IN ('invited', 'registered', 'attended', 'no_show', 'cancelled')),
    
    -- Payment (if applicable)
    payment_status VARCHAR(20) DEFAULT 'pending' CHECK (payment_status IN ('pending', 'paid', 'refunded', 'comp')),
    amount_paid_cents INTEGER DEFAULT 0,
    
    -- Timestamps
    registered_at TIMESTAMP DEFAULT NOW(),
    attended_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    
    UNIQUE(event_id, user_id)
);

-- =============================================
-- TRUST SCORE HISTORY TABLE
-- =============================================
CREATE TABLE trust_score_history (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT REFERENCES users(id) ON DELETE CASCADE,
    
    -- Score change details
    old_score INTEGER NOT NULL,
    new_score INTEGER NOT NULL,
    change_amount INTEGER GENERATED ALWAYS AS (new_score - old_score) STORED,
    
    -- Reason for change
    activity_type VARCHAR(50) NOT NULL,        -- 'review_created', 'event_attended', etc.
    activity_description TEXT,
    
    -- Related entities
    related_user_id BIGINT REFERENCES users(id),    -- Who caused this change (e.g., who reviewed)
    related_review_id BIGINT REFERENCES reviews(id),
    related_event_id BIGINT REFERENCES events(id),
    
    -- Metadata
    created_at TIMESTAMP DEFAULT NOW()
);

-- =============================================
-- NOTIFICATIONS TABLE
-- =============================================
CREATE TABLE notifications (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT REFERENCES users(id) ON DELETE CASCADE,
    
    -- Notification content
    type VARCHAR(50) NOT NULL,                 -- 'friend_request', 'review_received', 'event_invite', etc.
    title VARCHAR(255) NOT NULL,
    message TEXT,
    
    -- Related entities
    related_user_id BIGINT REFERENCES users(id),
    related_review_id BIGINT REFERENCES reviews(id),
    related_event_id BIGINT REFERENCES events(id),
    
    -- Notification status
    is_read BOOLEAN DEFAULT FALSE,
    is_dismissed BOOLEAN DEFAULT FALSE,
    
    -- Delivery
    sent_via VARCHAR(20) DEFAULT 'in_app' CHECK (sent_via IN ('in_app', 'email', 'push', 'sms')),
    
    -- Metadata
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- =============================================
-- USER BADGES TABLE
-- =============================================
CREATE TABLE user_badges (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT REFERENCES users(id) ON DELETE CASCADE,
    
    badge_type VARCHAR(50) NOT NULL,           -- 'Verified Host', 'Tech Expert', etc.
    badge_description TEXT,
    
    -- Achievement context
    earned_for VARCHAR(100),                  -- What did they do to earn this?
    related_event_id BIGINT REFERENCES events(id),
    related_review_id BIGINT REFERENCES reviews(id),
    
    -- Badge status
    is_active BOOLEAN DEFAULT TRUE,
    
    -- Metadata
    earned_at TIMESTAMP DEFAULT NOW(),
    created_at TIMESTAMP DEFAULT NOW()
);

-- =============================================
-- USER INTERESTS TABLE
-- =============================================
CREATE TABLE user_interests (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT REFERENCES users(id) ON DELETE CASCADE,
    
    interest_name VARCHAR(100) NOT NULL,
    interest_category VARCHAR(50),             -- 'Technology', 'Sports', 'Arts', etc.
    
    -- How was this interest determined?
    source VARCHAR(50) DEFAULT 'manual' CHECK (source IN ('manual', 'ai_detected', 'social_import')),
    confidence_score INTEGER DEFAULT 100,     -- 0-100 how confident we are
    
    created_at TIMESTAMP DEFAULT NOW(),
    
    UNIQUE(user_id, interest_name)
);

-- =============================================
-- PERSONALITY FLAVORS TABLE (AI-Generated)
-- =============================================
CREATE TABLE user_flavors (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT REFERENCES users(id) ON DELETE CASCADE,
    
    flavor_name VARCHAR(50) NOT NULL,         -- 'helpful', 'tech-savvy', 'creative', etc.
    score INTEGER NOT NULL CHECK (score >= 0 AND score <= 100),
    
    -- How was this flavor calculated?
    calculation_method VARCHAR(50) DEFAULT 'ai_analysis',
    based_on_reviews_count INTEGER DEFAULT 0,
    last_calculated TIMESTAMP DEFAULT NOW(),
    
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    
    UNIQUE(user_id, flavor_name)
);

-- =============================================
-- REAL-TIME SESSIONS TABLE (For WebSocket management)
-- =============================================
CREATE TABLE user_sessions (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT REFERENCES users(id) ON DELETE CASCADE,
    
    session_id VARCHAR(255) UNIQUE NOT NULL,   -- WebSocket session identifier
    socket_id VARCHAR(255),                    -- Socket.io socket ID
    
    -- Session details
    ip_address INET,
    user_agent TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    
    -- Real-time features
    current_page VARCHAR(255),                 -- What page they're on
    last_activity TIMESTAMP DEFAULT NOW(),
    
    -- Metadata
    connected_at TIMESTAMP DEFAULT NOW(),
    disconnected_at TIMESTAMP
);

-- =============================================
-- INDEXES FOR PERFORMANCE
-- =============================================

-- Users table indexes
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_auth0_user_id ON users(auth0_user_id);
CREATE INDEX idx_users_username ON users(username);
CREATE INDEX idx_users_trust_score ON users(trust_score DESC);
CREATE INDEX idx_users_status ON users(status);
CREATE INDEX idx_users_created_at ON users(created_at);

-- Social accounts indexes
CREATE INDEX idx_social_accounts_user_id ON social_accounts(user_id);
CREATE INDEX idx_social_accounts_platform ON social_accounts(platform);
CREATE INDEX idx_social_accounts_status ON social_accounts(status);

-- Friendships indexes
CREATE INDEX idx_friendships_user_id ON friendships(user_id);
CREATE INDEX idx_friendships_friend_id ON friendships(friend_id);
CREATE INDEX idx_friendships_status ON friendships(status);

-- Reviews indexes
CREATE INDEX idx_reviews_reviewer_id ON reviews(reviewer_id);
CREATE INDEX idx_reviews_reviewed_id ON reviews(reviewed_id);
CREATE INDEX idx_reviews_category ON reviews(category);
CREATE INDEX idx_reviews_created_at ON reviews(created_at DESC);
CREATE INDEX idx_reviews_total_votes ON reviews(total_votes DESC);
CREATE INDEX idx_reviews_event_id ON reviews(event_id);

-- Events indexes
CREATE INDEX idx_events_host_id ON events(host_id);
CREATE INDEX idx_events_category ON events(category);
CREATE INDEX idx_events_event_date ON events(event_date);
CREATE INDEX idx_events_status ON events(status);
CREATE INDEX idx_events_location ON events(latitude, longitude);

-- Event attendees indexes
CREATE INDEX idx_event_attendees_event_id ON event_attendees(event_id);
CREATE INDEX idx_event_attendees_user_id ON event_attendees(user_id);
CREATE INDEX idx_event_attendees_status ON event_attendees(status);

-- Notifications indexes
CREATE INDEX idx_notifications_user_id ON notifications(user_id);
CREATE INDEX idx_notifications_type ON notifications(type);
CREATE INDEX idx_notifications_is_read ON notifications(is_read);
CREATE INDEX idx_notifications_created_at ON notifications(created_at DESC);

-- Trust score history indexes
CREATE INDEX idx_trust_history_user_id ON trust_score_history(user_id);
CREATE INDEX idx_trust_history_created_at ON trust_score_history(created_at DESC);

-- Full-text search indexes
CREATE INDEX idx_users_search ON users USING gin(to_tsvector('english', name || ' ' || COALESCE(bio, '') || ' ' || COALESCE(location, '')));
CREATE INDEX idx_events_search ON events USING gin(to_tsvector('english', title || ' ' || COALESCE(description, '') || ' ' || COALESCE(location_name, '')));

-- =============================================
-- TRIGGERS FOR AUTOMATIC UPDATES
-- =============================================

-- Function to update updated_at timestamps
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply updated_at triggers
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_social_accounts_updated_at BEFORE UPDATE ON social_accounts FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_friendships_updated_at BEFORE UPDATE ON friendships FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_reviews_updated_at BEFORE UPDATE ON reviews FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_events_updated_at BEFORE UPDATE ON events FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_notifications_updated_at BEFORE UPDATE ON notifications FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Function to update denormalized counts
CREATE OR REPLACE FUNCTION update_user_counts()
RETURNS TRIGGER AS $$
BEGIN
    -- Update friends_count
    UPDATE users SET friends_count = (
        SELECT COUNT(*) FROM friendships 
        WHERE (user_id = NEW.user_id OR friend_id = NEW.user_id) 
        AND status = 'accepted'
    ) WHERE id = NEW.user_id;
    
    IF NEW.user_id != NEW.friend_id THEN
        UPDATE users SET friends_count = (
            SELECT COUNT(*) FROM friendships 
            WHERE (user_id = NEW.friend_id OR friend_id = NEW.friend_id) 
            AND status = 'accepted'
        ) WHERE id = NEW.friend_id;
    END IF;
    
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger to update friend counts
CREATE TRIGGER update_friendship_counts AFTER INSERT OR UPDATE ON friendships FOR EACH ROW EXECUTE FUNCTION update_user_counts();

-- =============================================
-- SAMPLE DATA INSERTION (for demo purposes)
-- =============================================

-- We'll add the demo data insertion here later
-- This will include migrating the existing sample users with new sequential IDs 