-- Database Migration Scripts for Scoop Social MVP
-- Run these in order to set up the complete database structure

-- =============================================
-- MIGRATION 001: Core Extensions and Setup
-- =============================================

-- Enable required PostgreSQL extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Create custom types
CREATE TYPE user_status AS ENUM ('active', 'suspended', 'banned', 'deleted');
CREATE TYPE friendship_status AS ENUM ('pending', 'accepted', 'blocked', 'declined');
CREATE TYPE event_status AS ENUM ('draft', 'upcoming', 'ongoing', 'completed', 'cancelled');
CREATE TYPE review_status AS ENUM ('active', 'flagged', 'removed', 'pending');
CREATE TYPE attendance_status AS ENUM ('invited', 'registered', 'attended', 'no_show', 'cancelled');
CREATE TYPE payment_status AS ENUM ('pending', 'paid', 'refunded', 'comp');
CREATE TYPE notification_type AS ENUM ('friend_request', 'friend_accepted', 'review_received', 'event_invite', 'trust_score_updated', 'general');
CREATE TYPE verification_method AS ENUM ('oauth', 'manual', 'api');

-- =============================================
-- MIGRATION 002: Users and Identity Tables
-- =============================================

-- Users table with comprehensive profile data
CREATE TABLE users (
    id BIGSERIAL PRIMARY KEY,
    auth0_user_id VARCHAR(255) UNIQUE,
    email VARCHAR(255) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    username VARCHAR(50) UNIQUE,
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
    status user_status DEFAULT 'active',
    preferences JSONB DEFAULT '{}',
    
    -- Metadata
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Social accounts table
CREATE TABLE social_accounts (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT REFERENCES users(id) ON DELETE CASCADE,
    
    -- Platform details
    platform VARCHAR(50) NOT NULL,
    platform_user_id VARCHAR(255) NOT NULL,
    username VARCHAR(255) NOT NULL,
    display_name VARCHAR(255),
    
    -- Verification and trust data
    verified BOOLEAN DEFAULT FALSE,
    follower_count INTEGER,
    following_count INTEGER,
    account_age DATE,
    
    -- OAuth and connection data
    oauth_token_encrypted TEXT,
    profile_url TEXT,
    avatar_url TEXT,
    bio TEXT,
    
    -- Trust contribution
    trust_contribution INTEGER DEFAULT 0,
    authenticity_score INTEGER DEFAULT 0 CHECK (authenticity_score >= 0 AND authenticity_score <= 100),
    
    -- Status
    status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'disconnected', 'error')),
    verification_method verification_method DEFAULT 'oauth',
    last_verified TIMESTAMP DEFAULT NOW(),
    
    -- Metadata
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    
    UNIQUE(user_id, platform),
    UNIQUE(platform, platform_user_id)
);

-- =============================================
-- MIGRATION 003: Social Network Tables
-- =============================================

-- Friendships table
CREATE TABLE friendships (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT REFERENCES users(id) ON DELETE CASCADE,
    friend_id BIGINT REFERENCES users(id) ON DELETE CASCADE,
    
    -- Friendship status
    status friendship_status DEFAULT 'pending',
    
    -- Who initiated the friendship
    initiated_by BIGINT REFERENCES users(id),
    
    -- Timestamps
    requested_at TIMESTAMP DEFAULT NOW(),
    accepted_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    
    UNIQUE(user_id, friend_id),
    CHECK(user_id != friend_id)
);

-- Reviews table
CREATE TABLE reviews (
    id BIGSERIAL PRIMARY KEY,
    reviewer_id BIGINT REFERENCES users(id) ON DELETE CASCADE,
    reviewed_id BIGINT REFERENCES users(id) ON DELETE CASCADE,
    
    -- Review content
    content TEXT NOT NULL,
    category VARCHAR(50) NOT NULL,
    tags TEXT[],
    
    -- Event context (if this is an event review)
    is_event_review BOOLEAN DEFAULT FALSE,
    event_id BIGINT, -- Will reference events table
    
    -- Voting and engagement
    upvotes INTEGER DEFAULT 0,
    downvotes INTEGER DEFAULT 0,
    total_votes INTEGER DEFAULT 0,
    
    -- Review status
    status review_status DEFAULT 'active',
    flagged_count INTEGER DEFAULT 0,
    
    -- Metadata
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    
    CHECK(reviewer_id != reviewed_id)
);

-- Review votes table
CREATE TABLE review_votes (
    id BIGSERIAL PRIMARY KEY,
    review_id BIGINT REFERENCES reviews(id) ON DELETE CASCADE,
    user_id BIGINT REFERENCES users(id) ON DELETE CASCADE,
    
    vote_type VARCHAR(10) NOT NULL CHECK (vote_type IN ('up', 'down')),
    
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    
    UNIQUE(review_id, user_id)
);

-- =============================================
-- MIGRATION 004: Events System Tables
-- =============================================

-- Events table
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
    price_cents INTEGER DEFAULT 0,
    
    -- Privacy and requirements
    is_private BOOLEAN DEFAULT FALSE,
    trust_requirement INTEGER DEFAULT 50 CHECK (trust_requirement >= 0 AND trust_requirement <= 100),
    
    -- Event status
    status event_status DEFAULT 'upcoming',
    
    -- Media
    image_url TEXT,
    tags TEXT[],
    
    -- Metadata
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Event attendees table
CREATE TABLE event_attendees (
    id BIGSERIAL PRIMARY KEY,
    event_id BIGINT REFERENCES events(id) ON DELETE CASCADE,
    user_id BIGINT REFERENCES users(id) ON DELETE CASCADE,
    
    -- Attendance status
    status attendance_status DEFAULT 'registered',
    
    -- Payment (if applicable)
    payment_status payment_status DEFAULT 'pending',
    amount_paid_cents INTEGER DEFAULT 0,
    
    -- Timestamps
    registered_at TIMESTAMP DEFAULT NOW(),
    attended_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    
    UNIQUE(event_id, user_id)
);

-- =============================================
-- MIGRATION 005: Trust and Notification System
-- =============================================

-- Trust score history table
CREATE TABLE trust_score_history (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT REFERENCES users(id) ON DELETE CASCADE,
    
    -- Score change details
    old_score INTEGER NOT NULL,
    new_score INTEGER NOT NULL,
    change_amount INTEGER GENERATED ALWAYS AS (new_score - old_score) STORED,
    
    -- Reason for change
    activity_type VARCHAR(50) NOT NULL,
    activity_description TEXT,
    
    -- Related entities
    related_user_id BIGINT REFERENCES users(id),
    related_review_id BIGINT REFERENCES reviews(id),
    related_event_id BIGINT REFERENCES events(id),
    
    -- Metadata
    created_at TIMESTAMP DEFAULT NOW()
);

-- Notifications table
CREATE TABLE notifications (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT REFERENCES users(id) ON DELETE CASCADE,
    
    -- Notification content
    type notification_type NOT NULL,
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
-- MIGRATION 006: User Profile Enhancement Tables
-- =============================================

-- User badges table
CREATE TABLE user_badges (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT REFERENCES users(id) ON DELETE CASCADE,
    
    badge_type VARCHAR(50) NOT NULL,
    badge_description TEXT,
    
    -- Achievement context
    earned_for VARCHAR(100),
    related_event_id BIGINT REFERENCES events(id),
    related_review_id BIGINT REFERENCES reviews(id),
    
    -- Badge status
    is_active BOOLEAN DEFAULT TRUE,
    
    -- Metadata
    earned_at TIMESTAMP DEFAULT NOW(),
    created_at TIMESTAMP DEFAULT NOW()
);

-- User interests table
CREATE TABLE user_interests (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT REFERENCES users(id) ON DELETE CASCADE,
    
    interest_name VARCHAR(100) NOT NULL,
    interest_category VARCHAR(50),
    
    -- How was this interest determined?
    source VARCHAR(50) DEFAULT 'manual' CHECK (source IN ('manual', 'ai_detected', 'social_import')),
    confidence_score INTEGER DEFAULT 100 CHECK (confidence_score >= 0 AND confidence_score <= 100),
    
    created_at TIMESTAMP DEFAULT NOW(),
    
    UNIQUE(user_id, interest_name)
);

-- User flavors table (AI-generated personality traits)
CREATE TABLE user_flavors (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT REFERENCES users(id) ON DELETE CASCADE,
    
    flavor_name VARCHAR(50) NOT NULL,
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
-- MIGRATION 007: Real-time and Session Management
-- =============================================

-- User sessions table (for WebSocket management)
CREATE TABLE user_sessions (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT REFERENCES users(id) ON DELETE CASCADE,
    
    session_id VARCHAR(255) UNIQUE NOT NULL,
    socket_id VARCHAR(255),
    
    -- Session details
    ip_address INET,
    user_agent TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    
    -- Real-time features
    current_page VARCHAR(255),
    last_activity TIMESTAMP DEFAULT NOW(),
    
    -- Metadata
    connected_at TIMESTAMP DEFAULT NOW(),
    disconnected_at TIMESTAMP
);

-- =============================================
-- MIGRATION 008: Performance Indexes
-- =============================================

-- Users table indexes
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_auth0_user_id ON users(auth0_user_id);
CREATE INDEX idx_users_username ON users(username) WHERE username IS NOT NULL;
CREATE INDEX idx_users_trust_score ON users(trust_score DESC);
CREATE INDEX idx_users_status ON users(status);
CREATE INDEX idx_users_created_at ON users(created_at);
CREATE INDEX idx_users_location ON users(location) WHERE location IS NOT NULL;

-- Social accounts indexes
CREATE INDEX idx_social_accounts_user_id ON social_accounts(user_id);
CREATE INDEX idx_social_accounts_platform ON social_accounts(platform);
CREATE INDEX idx_social_accounts_status ON social_accounts(status);
CREATE INDEX idx_social_accounts_username ON social_accounts(username);

-- Friendships indexes
CREATE INDEX idx_friendships_user_id ON friendships(user_id);
CREATE INDEX idx_friendships_friend_id ON friendships(friend_id);
CREATE INDEX idx_friendships_status ON friendships(status);
CREATE INDEX idx_friendships_initiated_by ON friendships(initiated_by);

-- Reviews indexes
CREATE INDEX idx_reviews_reviewer_id ON reviews(reviewer_id);
CREATE INDEX idx_reviews_reviewed_id ON reviews(reviewed_id);
CREATE INDEX idx_reviews_category ON reviews(category);
CREATE INDEX idx_reviews_created_at ON reviews(created_at DESC);
CREATE INDEX idx_reviews_total_votes ON reviews(total_votes DESC);
CREATE INDEX idx_reviews_event_id ON reviews(event_id) WHERE event_id IS NOT NULL;
CREATE INDEX idx_reviews_status ON reviews(status);

-- Review votes indexes
CREATE INDEX idx_review_votes_review_id ON review_votes(review_id);
CREATE INDEX idx_review_votes_user_id ON review_votes(user_id);

-- Events indexes
CREATE INDEX idx_events_host_id ON events(host_id);
CREATE INDEX idx_events_category ON events(category);
CREATE INDEX idx_events_event_date ON events(event_date);
CREATE INDEX idx_events_status ON events(status);
CREATE INDEX idx_events_location ON events(latitude, longitude) WHERE latitude IS NOT NULL AND longitude IS NOT NULL;
CREATE INDEX idx_events_trust_requirement ON events(trust_requirement);
CREATE INDEX idx_events_created_at ON events(created_at);

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
CREATE INDEX idx_trust_history_activity_type ON trust_score_history(activity_type);

-- User sessions indexes
CREATE INDEX idx_user_sessions_user_id ON user_sessions(user_id);
CREATE INDEX idx_user_sessions_session_id ON user_sessions(session_id);
CREATE INDEX idx_user_sessions_is_active ON user_sessions(is_active);

-- =============================================
-- MIGRATION 009: Full-Text Search Indexes
-- =============================================

-- Full-text search indexes
CREATE INDEX idx_users_search ON users USING gin(to_tsvector('english', 
    name || ' ' || COALESCE(bio, '') || ' ' || COALESCE(location, '')
));

CREATE INDEX idx_events_search ON events USING gin(to_tsvector('english', 
    title || ' ' || COALESCE(description, '') || ' ' || COALESCE(location_name, '')
));

CREATE INDEX idx_reviews_search ON reviews USING gin(to_tsvector('english', content));

-- =============================================
-- MIGRATION 010: Database Functions and Triggers
-- =============================================

-- Function to update updated_at timestamps
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply updated_at triggers to all relevant tables
CREATE TRIGGER update_users_updated_at 
    BEFORE UPDATE ON users 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_social_accounts_updated_at 
    BEFORE UPDATE ON social_accounts 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_friendships_updated_at 
    BEFORE UPDATE ON friendships 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_reviews_updated_at 
    BEFORE UPDATE ON reviews 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_review_votes_updated_at 
    BEFORE UPDATE ON review_votes 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_events_updated_at 
    BEFORE UPDATE ON events 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_event_attendees_updated_at 
    BEFORE UPDATE ON event_attendees 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_notifications_updated_at 
    BEFORE UPDATE ON notifications 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_flavors_updated_at 
    BEFORE UPDATE ON user_flavors 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Function to update denormalized friend counts
CREATE OR REPLACE FUNCTION update_friend_counts()
RETURNS TRIGGER AS $$
BEGIN
    -- Update friends_count for both users when friendship status changes to 'accepted'
    IF NEW.status = 'accepted' AND (OLD.status IS NULL OR OLD.status != 'accepted') THEN
        -- Update user's friend count
        UPDATE users SET friends_count = (
            SELECT COUNT(*) FROM friendships 
            WHERE (user_id = NEW.user_id OR friend_id = NEW.user_id) 
            AND status = 'accepted'
        ) WHERE id = NEW.user_id;
        
        -- Update friend's friend count
        UPDATE users SET friends_count = (
            SELECT COUNT(*) FROM friendships 
            WHERE (user_id = NEW.friend_id OR friend_id = NEW.friend_id) 
            AND status = 'accepted'
        ) WHERE id = NEW.friend_id;
    END IF;
    
    -- Decrease friend counts when friendship is removed or blocked
    IF OLD.status = 'accepted' AND NEW.status != 'accepted' THEN
        -- Update user's friend count
        UPDATE users SET friends_count = (
            SELECT COUNT(*) FROM friendships 
            WHERE (user_id = NEW.user_id OR friend_id = NEW.user_id) 
            AND status = 'accepted'
        ) WHERE id = NEW.user_id;
        
        -- Update friend's friend count
        UPDATE users SET friends_count = (
            SELECT COUNT(*) FROM friendships 
            WHERE (user_id = NEW.friend_id OR friend_id = NEW.friend_id) 
            AND status = 'accepted'
        ) WHERE id = NEW.friend_id;
    END IF;
    
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply friend count trigger
CREATE TRIGGER update_friendship_counts 
    AFTER INSERT OR UPDATE ON friendships 
    FOR EACH ROW EXECUTE FUNCTION update_friend_counts();

-- Function to update review counts
CREATE OR REPLACE FUNCTION update_review_counts()
RETURNS TRIGGER AS $$
BEGIN
    -- Update reviews_count for the reviewed user
    UPDATE users SET reviews_count = (
        SELECT COUNT(*) FROM reviews 
        WHERE reviewed_id = NEW.reviewed_id 
        AND status = 'active'
    ) WHERE id = NEW.reviewed_id;
    
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply review count trigger
CREATE TRIGGER update_review_counts_trigger 
    AFTER INSERT OR UPDATE ON reviews 
    FOR EACH ROW EXECUTE FUNCTION update_review_counts();

-- Function to update event attendance counts
CREATE OR REPLACE FUNCTION update_event_attendance()
RETURNS TRIGGER AS $$
BEGIN
    -- Update current_attendees for the event
    UPDATE events SET current_attendees = (
        SELECT COUNT(*) FROM event_attendees 
        WHERE event_id = NEW.event_id 
        AND status IN ('registered', 'attended')
    ) WHERE id = NEW.event_id;
    
    -- Update events_attended for the user
    UPDATE users SET events_attended = (
        SELECT COUNT(*) FROM event_attendees 
        WHERE user_id = NEW.user_id 
        AND status IN ('attended')
    ) WHERE id = NEW.user_id;
    
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply event attendance trigger
CREATE TRIGGER update_event_attendance_trigger 
    AFTER INSERT OR UPDATE ON event_attendees 
    FOR EACH ROW EXECUTE FUNCTION update_event_attendance();

-- =============================================
-- MIGRATION 011: Security and Constraints
-- =============================================

-- Row Level Security (RLS) policies
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE social_accounts ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

-- Policy: Users can only see their own sensitive data
CREATE POLICY users_own_data ON users
    FOR ALL TO authenticated
    USING (auth0_user_id = current_setting('app.user_id', true));

-- Policy: Users can only manage their own social accounts
CREATE POLICY social_accounts_own_data ON social_accounts
    FOR ALL TO authenticated
    USING (user_id IN (
        SELECT id FROM users WHERE auth0_user_id = current_setting('app.user_id', true)
    ));

-- Policy: Users can see reviews they wrote or received
CREATE POLICY reviews_accessible ON reviews
    FOR SELECT TO authenticated
    USING (
        reviewer_id IN (SELECT id FROM users WHERE auth0_user_id = current_setting('app.user_id', true))
        OR 
        reviewed_id IN (SELECT id FROM users WHERE auth0_user_id = current_setting('app.user_id', true))
        OR
        status = 'active' -- Public reviews are visible to all
    );

-- Policy: Users can only see their own notifications
CREATE POLICY notifications_own_data ON notifications
    FOR ALL TO authenticated
    USING (user_id IN (
        SELECT id FROM users WHERE auth0_user_id = current_setting('app.user_id', true)
    ));

-- =============================================
-- MIGRATION 012: Sample Data Indexes and Constraints
-- =============================================

-- Add foreign key constraint for reviews event_id after events table exists
ALTER TABLE reviews 
ADD CONSTRAINT fk_reviews_event_id 
FOREIGN KEY (event_id) REFERENCES events(id) ON DELETE SET NULL;

-- Add check constraints for data integrity
ALTER TABLE users ADD CONSTRAINT check_email_format 
CHECK (email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$');

ALTER TABLE events ADD CONSTRAINT check_event_date_future 
CHECK (event_date >= CURRENT_DATE - INTERVAL '1 day'); -- Allow same day events

ALTER TABLE event_attendees ADD CONSTRAINT check_payment_amount_positive 
CHECK (amount_paid_cents >= 0);

-- =============================================
-- FINAL: Database Setup Verification
-- =============================================

-- Create a view to check migration status
CREATE OR REPLACE VIEW migration_status AS
SELECT 
    schemaname,
    tablename,
    hasindexes,
    hastriggers,
    hasrules
FROM pg_tables 
WHERE schemaname = 'public'
ORDER BY tablename;

-- Create a function to verify database setup
CREATE OR REPLACE FUNCTION verify_database_setup()
RETURNS TABLE(
    component VARCHAR,
    status VARCHAR,
    details TEXT
) AS $$
BEGIN
    -- Check if all required tables exist
    RETURN QUERY
    SELECT 'Tables'::VARCHAR, 
           CASE WHEN COUNT(*) >= 12 THEN 'OK' ELSE 'MISSING' END::VARCHAR,
           ('Found ' || COUNT(*) || ' tables')::TEXT
    FROM information_schema.tables 
    WHERE table_schema = 'public' AND table_type = 'BASE TABLE';
    
    -- Check if all required indexes exist
    RETURN QUERY
    SELECT 'Indexes'::VARCHAR,
           CASE WHEN COUNT(*) >= 30 THEN 'OK' ELSE 'INCOMPLETE' END::VARCHAR,
           ('Found ' || COUNT(*) || ' indexes')::TEXT
    FROM pg_indexes 
    WHERE schemaname = 'public';
    
    -- Check if all required triggers exist
    RETURN QUERY
    SELECT 'Triggers'::VARCHAR,
           CASE WHEN COUNT(*) >= 5 THEN 'OK' ELSE 'INCOMPLETE' END::VARCHAR,
           ('Found ' || COUNT(*) || ' triggers')::TEXT
    FROM information_schema.triggers 
    WHERE trigger_schema = 'public';
    
    -- Check if all required extensions exist
    RETURN QUERY
    SELECT 'Extensions'::VARCHAR,
           CASE WHEN COUNT(*) >= 3 THEN 'OK' ELSE 'MISSING' END::VARCHAR,
           ('Found ' || COUNT(*) || ' extensions')::TEXT
    FROM pg_extension 
    WHERE extname IN ('uuid-ossp', 'pg_trgm', 'pgcrypto');
END;
$$ LANGUAGE plpgsql;

-- =============================================
-- USAGE INSTRUCTIONS
-- =============================================

-- Run this query to verify setup completion:
-- SELECT * FROM verify_database_setup();

-- Run this query to see all tables and their status:
-- SELECT * FROM migration_status;

-- Check database size and performance:
-- SELECT 
--     schemaname,
--     tablename,
--     attname,
--     n_distinct,
--     correlation
-- FROM pg_stats 
-- WHERE schemaname = 'public'
-- ORDER BY tablename, attname; 