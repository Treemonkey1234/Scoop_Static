-- Database Migration Management System for Scoop Social
-- This file provides a proper migration framework with versioning and rollback capabilities

-- =============================================
-- Migration System Setup
-- =============================================

-- Create migrations tracking table
CREATE TABLE IF NOT EXISTS schema_migrations (
    id SERIAL PRIMARY KEY,
    version VARCHAR(255) NOT NULL UNIQUE,
    name VARCHAR(500) NOT NULL,
    executed_at TIMESTAMP DEFAULT NOW(),
    execution_time_ms INTEGER DEFAULT 0,
    checksum VARCHAR(64),
    success BOOLEAN DEFAULT TRUE,
    error_message TEXT
);

-- Create migration log for detailed tracking
CREATE TABLE IF NOT EXISTS migration_log (
    id SERIAL PRIMARY KEY,
    migration_version VARCHAR(255) NOT NULL,
    action VARCHAR(20) NOT NULL CHECK (action IN ('up', 'down')),
    started_at TIMESTAMP DEFAULT NOW(),
    completed_at TIMESTAMP,
    status VARCHAR(20) DEFAULT 'running' CHECK (status IN ('running', 'completed', 'failed', 'rolled_back')),
    sql_executed TEXT,
    error_details TEXT,
    executed_by VARCHAR(100) DEFAULT CURRENT_USER
);

-- Index for performance
CREATE INDEX IF NOT EXISTS idx_migrations_version ON schema_migrations(version);
CREATE INDEX IF NOT EXISTS idx_migration_log_version ON migration_log(migration_version);

-- =============================================
-- Migration Management Functions
-- =============================================

-- Function to check if a migration has been applied
CREATE OR REPLACE FUNCTION migration_exists(migration_version VARCHAR(255))
RETURNS BOOLEAN AS $$
BEGIN
    RETURN EXISTS(
        SELECT 1 FROM schema_migrations 
        WHERE version = migration_version AND success = TRUE
    );
END;
$$ LANGUAGE plpgsql;

-- Function to log migration start
CREATE OR REPLACE FUNCTION log_migration_start(
    migration_version VARCHAR(255),
    migration_action VARCHAR(20)
) RETURNS INTEGER AS $$
DECLARE
    log_id INTEGER;
BEGIN
    INSERT INTO migration_log (migration_version, action, started_at)
    VALUES (migration_version, migration_action, NOW())
    RETURNING id INTO log_id;
    
    RETURN log_id;
END;
$$ LANGUAGE plpgsql;

-- Function to log migration completion
CREATE OR REPLACE FUNCTION log_migration_complete(
    log_id INTEGER,
    success BOOLEAN,
    error_msg TEXT DEFAULT NULL
) RETURNS VOID AS $$
BEGIN
    UPDATE migration_log 
    SET 
        completed_at = NOW(),
        status = CASE WHEN success THEN 'completed' ELSE 'failed' END,
        error_details = error_msg
    WHERE id = log_id;
END;
$$ LANGUAGE plpgsql;

-- Function to apply a migration
CREATE OR REPLACE FUNCTION apply_migration(
    migration_version VARCHAR(255),
    migration_name VARCHAR(500),
    migration_sql TEXT
) RETURNS BOOLEAN AS $$
DECLARE
    log_id INTEGER;
    start_time TIMESTAMP;
    execution_time INTEGER;
    sql_checksum VARCHAR(64);
BEGIN
    -- Check if already applied
    IF migration_exists(migration_version) THEN
        RAISE NOTICE 'Migration % already applied', migration_version;
        RETURN TRUE;
    END IF;
    
    -- Start logging
    log_id := log_migration_start(migration_version, 'up');
    start_time := clock_timestamp();
    
    -- Calculate checksum
    sql_checksum := encode(digest(migration_sql, 'sha256'), 'hex');
    
    BEGIN
        -- Execute the migration SQL
        EXECUTE migration_sql;
        
        -- Calculate execution time
        execution_time := EXTRACT(EPOCH FROM (clock_timestamp() - start_time)) * 1000;
        
        -- Record successful migration
        INSERT INTO schema_migrations (version, name, executed_at, execution_time_ms, checksum, success)
        VALUES (migration_version, migration_name, NOW(), execution_time, sql_checksum, TRUE);
        
        -- Log completion
        PERFORM log_migration_complete(log_id, TRUE);
        
        RAISE NOTICE 'Migration % applied successfully in %ms', migration_version, execution_time;
        RETURN TRUE;
        
    EXCEPTION WHEN OTHERS THEN
        -- Log failure
        PERFORM log_migration_complete(log_id, FALSE, SQLERRM);
        
        -- Record failed migration
        INSERT INTO schema_migrations (version, name, executed_at, execution_time_ms, checksum, success, error_message)
        VALUES (migration_version, migration_name, NOW(), 0, sql_checksum, FALSE, SQLERRM);
        
        RAISE NOTICE 'Migration % failed: %', migration_version, SQLERRM;
        RETURN FALSE;
    END;
END;
$$ LANGUAGE plpgsql;

-- =============================================
-- Individual Migration Files
-- =============================================

-- MIGRATION 001: Core Extensions and Types
DO $$
BEGIN
    PERFORM apply_migration(
        '001_core_extensions_and_types',
        'Create core extensions and custom types',
        $SQL$
            -- Enable required PostgreSQL extensions
            CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
            CREATE EXTENSION IF NOT EXISTS "pg_trgm";
            CREATE EXTENSION IF NOT EXISTS "pgcrypto";
            
            -- Create custom types
            DO $TYPES$ BEGIN
                -- User status type
                IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'user_status') THEN
                    CREATE TYPE user_status AS ENUM ('active', 'suspended', 'banned', 'deleted');
                END IF;
                
                -- Friendship status type
                IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'friendship_status') THEN
                    CREATE TYPE friendship_status AS ENUM ('pending', 'accepted', 'blocked', 'declined');
                END IF;
                
                -- Event status type
                IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'event_status') THEN
                    CREATE TYPE event_status AS ENUM ('draft', 'upcoming', 'ongoing', 'completed', 'cancelled');
                END IF;
                
                -- Review status type
                IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'review_status') THEN
                    CREATE TYPE review_status AS ENUM ('active', 'flagged', 'removed', 'pending');
                END IF;
                
                -- Attendance status type
                IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'attendance_status') THEN
                    CREATE TYPE attendance_status AS ENUM ('invited', 'registered', 'attended', 'no_show', 'cancelled');
                END IF;
                
                -- Payment status type
                IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'payment_status') THEN
                    CREATE TYPE payment_status AS ENUM ('pending', 'paid', 'refunded', 'comp');
                END IF;
                
                -- Notification type
                IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'notification_type') THEN
                    CREATE TYPE notification_type AS ENUM ('friend_request', 'friend_accepted', 'review_received', 'event_invite', 'trust_score_updated', 'general');
                END IF;
                
                -- Verification method type
                IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'verification_method') THEN
                    CREATE TYPE verification_method AS ENUM ('oauth', 'manual', 'api');
                END IF;
            END $TYPES$;
        $SQL$
    );
END $$;

-- MIGRATION 002: Users and Identity Tables
DO $$
BEGIN
    PERFORM apply_migration(
        '002_users_and_identity_tables',
        'Create users and social accounts tables',
        $SQL$
            -- Users table
            CREATE TABLE IF NOT EXISTS users (
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
            CREATE TABLE IF NOT EXISTS social_accounts (
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
        $SQL$
    );
END $$;

-- MIGRATION 003: Social Network Tables
DO $$
BEGIN
    PERFORM apply_migration(
        '003_social_network_tables',
        'Create friendships and reviews tables',
        $SQL$
            -- Friendships table
            CREATE TABLE IF NOT EXISTS friendships (
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
            CREATE TABLE IF NOT EXISTS reviews (
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
            CREATE TABLE IF NOT EXISTS review_votes (
                id BIGSERIAL PRIMARY KEY,
                review_id BIGINT REFERENCES reviews(id) ON DELETE CASCADE,
                user_id BIGINT REFERENCES users(id) ON DELETE CASCADE,
                
                vote_type VARCHAR(10) NOT NULL CHECK (vote_type IN ('up', 'down')),
                
                created_at TIMESTAMP DEFAULT NOW(),
                updated_at TIMESTAMP DEFAULT NOW(),
                
                UNIQUE(review_id, user_id)
            );
        $SQL$
    );
END $$;

-- MIGRATION 004: Events System
DO $$
BEGIN
    PERFORM apply_migration(
        '004_events_system',
        'Create events and event attendees tables',
        $SQL$
            -- Events table
            CREATE TABLE IF NOT EXISTS events (
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
            CREATE TABLE IF NOT EXISTS event_attendees (
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
            
            -- Add foreign key constraint for reviews event_id
            ALTER TABLE reviews 
            ADD CONSTRAINT fk_reviews_event_id 
            FOREIGN KEY (event_id) REFERENCES events(id) ON DELETE SET NULL;
        $SQL$
    );
END $$;

-- MIGRATION 005: Trust and Notification System
DO $$
BEGIN
    PERFORM apply_migration(
        '005_trust_and_notification_system',
        'Create trust score history and notifications tables',
        $SQL$
            -- Trust score history table
            CREATE TABLE IF NOT EXISTS trust_score_history (
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
            CREATE TABLE IF NOT EXISTS notifications (
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
        $SQL$
    );
END $$;

-- MIGRATION 006: Supporting Tables
DO $$
BEGIN
    PERFORM apply_migration(
        '006_supporting_tables',
        'Create user badges, interests, flavors and sessions tables',
        $SQL$
            -- User badges table
            CREATE TABLE IF NOT EXISTS user_badges (
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
            CREATE TABLE IF NOT EXISTS user_interests (
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
            CREATE TABLE IF NOT EXISTS user_flavors (
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
            
            -- User sessions table (for WebSocket management)
            CREATE TABLE IF NOT EXISTS user_sessions (
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
        $SQL$
    );
END $$;

-- MIGRATION 007: Indexes and Performance
DO $$
BEGIN
    PERFORM apply_migration(
        '007_indexes_and_performance',
        'Create all performance indexes',
        $SQL$
            -- Users table indexes
            CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
            CREATE INDEX IF NOT EXISTS idx_users_auth0_user_id ON users(auth0_user_id);
            CREATE INDEX IF NOT EXISTS idx_users_username ON users(username) WHERE username IS NOT NULL;
            CREATE INDEX IF NOT EXISTS idx_users_trust_score ON users(trust_score DESC);
            CREATE INDEX IF NOT EXISTS idx_users_status ON users(status);
            CREATE INDEX IF NOT EXISTS idx_users_created_at ON users(created_at);
            CREATE INDEX IF NOT EXISTS idx_users_location ON users(location) WHERE location IS NOT NULL;
            
            -- Social accounts indexes
            CREATE INDEX IF NOT EXISTS idx_social_accounts_user_id ON social_accounts(user_id);
            CREATE INDEX IF NOT EXISTS idx_social_accounts_platform ON social_accounts(platform);
            CREATE INDEX IF NOT EXISTS idx_social_accounts_status ON social_accounts(status);
            CREATE INDEX IF NOT EXISTS idx_social_accounts_username ON social_accounts(username);
            
            -- Friendships indexes
            CREATE INDEX IF NOT EXISTS idx_friendships_user_id ON friendships(user_id);
            CREATE INDEX IF NOT EXISTS idx_friendships_friend_id ON friendships(friend_id);
            CREATE INDEX IF NOT EXISTS idx_friendships_status ON friendships(status);
            CREATE INDEX IF NOT EXISTS idx_friendships_initiated_by ON friendships(initiated_by);
            
            -- Reviews indexes
            CREATE INDEX IF NOT EXISTS idx_reviews_reviewer_id ON reviews(reviewer_id);
            CREATE INDEX IF NOT EXISTS idx_reviews_reviewed_id ON reviews(reviewed_id);
            CREATE INDEX IF NOT EXISTS idx_reviews_category ON reviews(category);
            CREATE INDEX IF NOT EXISTS idx_reviews_created_at ON reviews(created_at DESC);
            CREATE INDEX IF NOT EXISTS idx_reviews_total_votes ON reviews(total_votes DESC);
            CREATE INDEX IF NOT EXISTS idx_reviews_event_id ON reviews(event_id) WHERE event_id IS NOT NULL;
            CREATE INDEX IF NOT EXISTS idx_reviews_status ON reviews(status);
            
            -- Events indexes
            CREATE INDEX IF NOT EXISTS idx_events_host_id ON events(host_id);
            CREATE INDEX IF NOT EXISTS idx_events_category ON events(category);
            CREATE INDEX IF NOT EXISTS idx_events_event_date ON events(event_date);
            CREATE INDEX IF NOT EXISTS idx_events_status ON events(status);
            CREATE INDEX IF NOT EXISTS idx_events_location ON events(latitude, longitude) WHERE latitude IS NOT NULL AND longitude IS NOT NULL;
            CREATE INDEX IF NOT EXISTS idx_events_trust_requirement ON events(trust_requirement);
            CREATE INDEX IF NOT EXISTS idx_events_created_at ON events(created_at);
            
            -- Notifications indexes
            CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON notifications(user_id);
            CREATE INDEX IF NOT EXISTS idx_notifications_type ON notifications(type);
            CREATE INDEX IF NOT EXISTS idx_notifications_is_read ON notifications(is_read);
            CREATE INDEX IF NOT EXISTS idx_notifications_created_at ON notifications(created_at DESC);
            
            -- Trust score history indexes
            CREATE INDEX IF NOT EXISTS idx_trust_history_user_id ON trust_score_history(user_id);
            CREATE INDEX IF NOT EXISTS idx_trust_history_created_at ON trust_score_history(created_at DESC);
            CREATE INDEX IF NOT EXISTS idx_trust_history_activity_type ON trust_score_history(activity_type);
            
            -- Full-text search indexes
            CREATE INDEX IF NOT EXISTS idx_users_search ON users USING gin(to_tsvector('english', 
                name || ' ' || COALESCE(bio, '') || ' ' || COALESCE(location, '')
            ));
            
            CREATE INDEX IF NOT EXISTS idx_events_search ON events USING gin(to_tsvector('english', 
                title || ' ' || COALESCE(description, '') || ' ' || COALESCE(location_name, '')
            ));
            
            CREATE INDEX IF NOT EXISTS idx_reviews_search ON reviews USING gin(to_tsvector('english', content));
        $SQL$
    );
END $$;

-- MIGRATION 008: Triggers and Functions
DO $$
BEGIN
    PERFORM apply_migration(
        '008_triggers_and_functions',
        'Create triggers for automated updates',
        $SQL$
            -- Function to update updated_at timestamps
            CREATE OR REPLACE FUNCTION update_updated_at_column()
            RETURNS TRIGGER AS $trigger$
            BEGIN
                NEW.updated_at = CURRENT_TIMESTAMP;
                RETURN NEW;
            END;
            $trigger$ language 'plpgsql';
            
            -- Apply updated_at triggers to all relevant tables
            DROP TRIGGER IF EXISTS update_users_updated_at ON users;
            CREATE TRIGGER update_users_updated_at 
                BEFORE UPDATE ON users 
                FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
            
            DROP TRIGGER IF EXISTS update_social_accounts_updated_at ON social_accounts;
            CREATE TRIGGER update_social_accounts_updated_at 
                BEFORE UPDATE ON social_accounts 
                FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
            
            DROP TRIGGER IF EXISTS update_friendships_updated_at ON friendships;
            CREATE TRIGGER update_friendships_updated_at 
                BEFORE UPDATE ON friendships 
                FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
            
            DROP TRIGGER IF EXISTS update_reviews_updated_at ON reviews;
            CREATE TRIGGER update_reviews_updated_at 
                BEFORE UPDATE ON reviews 
                FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
            
            DROP TRIGGER IF EXISTS update_events_updated_at ON events;
            CREATE TRIGGER update_events_updated_at 
                BEFORE UPDATE ON events 
                FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
            
            -- Function to update denormalized friend counts
            CREATE OR REPLACE FUNCTION update_friend_counts()
            RETURNS TRIGGER AS $trigger$
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
                
                RETURN NEW;
            END;
            $trigger$ language 'plpgsql';
            
            -- Apply friend count trigger
            DROP TRIGGER IF EXISTS update_friendship_counts ON friendships;
            CREATE TRIGGER update_friendship_counts 
                AFTER INSERT OR UPDATE ON friendships 
                FOR EACH ROW EXECUTE FUNCTION update_friend_counts();
        $SQL$
    );
END $$;

-- =============================================
-- Migration Rollback Functions
-- =============================================

-- Function to rollback a specific migration
CREATE OR REPLACE FUNCTION rollback_migration(migration_version VARCHAR(255))
RETURNS BOOLEAN AS $$
DECLARE
    log_id INTEGER;
BEGIN
    -- Check if migration exists
    IF NOT migration_exists(migration_version) THEN
        RAISE NOTICE 'Migration % was not applied', migration_version;
        RETURN TRUE;
    END IF;
    
    -- Start logging rollback
    log_id := log_migration_start(migration_version, 'down');
    
    BEGIN
        -- Execute rollback based on migration version
        CASE migration_version
            WHEN '008_triggers_and_functions' THEN
                DROP TRIGGER IF EXISTS update_friendship_counts ON friendships;
                DROP TRIGGER IF EXISTS update_events_updated_at ON events;
                DROP TRIGGER IF EXISTS update_reviews_updated_at ON reviews;
                DROP TRIGGER IF EXISTS update_friendships_updated_at ON friendships;
                DROP TRIGGER IF EXISTS update_social_accounts_updated_at ON social_accounts;
                DROP TRIGGER IF EXISTS update_users_updated_at ON users;
                DROP FUNCTION IF EXISTS update_friend_counts();
                DROP FUNCTION IF EXISTS update_updated_at_column();
                
            WHEN '007_indexes_and_performance' THEN
                -- Drop all created indexes (they will be recreated if needed)
                DROP INDEX IF EXISTS idx_reviews_search;
                DROP INDEX IF EXISTS idx_events_search;
                DROP INDEX IF EXISTS idx_users_search;
                -- Note: Basic indexes are kept for performance
                
            WHEN '006_supporting_tables' THEN
                DROP TABLE IF EXISTS user_sessions;
                DROP TABLE IF EXISTS user_flavors;
                DROP TABLE IF EXISTS user_interests;
                DROP TABLE IF EXISTS user_badges;
                
            WHEN '005_trust_and_notification_system' THEN
                DROP TABLE IF EXISTS notifications;
                DROP TABLE IF EXISTS trust_score_history;
                
            WHEN '004_events_system' THEN
                ALTER TABLE reviews DROP CONSTRAINT IF EXISTS fk_reviews_event_id;
                DROP TABLE IF EXISTS event_attendees;
                DROP TABLE IF EXISTS events;
                
            WHEN '003_social_network_tables' THEN
                DROP TABLE IF EXISTS review_votes;
                DROP TABLE IF EXISTS reviews;
                DROP TABLE IF EXISTS friendships;
                
            WHEN '002_users_and_identity_tables' THEN
                DROP TABLE IF EXISTS social_accounts;
                DROP TABLE IF EXISTS users;
                
            WHEN '001_core_extensions_and_types' THEN
                DROP TYPE IF EXISTS verification_method;
                DROP TYPE IF EXISTS notification_type;
                DROP TYPE IF EXISTS payment_status;
                DROP TYPE IF EXISTS attendance_status;
                DROP TYPE IF EXISTS review_status;
                DROP TYPE IF EXISTS event_status;
                DROP TYPE IF EXISTS friendship_status;
                DROP TYPE IF EXISTS user_status;
                -- Note: Extensions are not dropped as they might be used elsewhere
                
            ELSE
                RAISE EXCEPTION 'Unknown migration version: %', migration_version;
        END CASE;
        
        -- Mark migration as rolled back
        UPDATE schema_migrations 
        SET success = FALSE 
        WHERE version = migration_version;
        
        -- Log successful rollback
        UPDATE migration_log 
        SET status = 'rolled_back' 
        WHERE id = log_id;
        
        RAISE NOTICE 'Migration % rolled back successfully', migration_version;
        RETURN TRUE;
        
    EXCEPTION WHEN OTHERS THEN
        -- Log failure
        PERFORM log_migration_complete(log_id, FALSE, SQLERRM);
        RAISE NOTICE 'Rollback of migration % failed: %', migration_version, SQLERRM;
        RETURN FALSE;
    END;
END;
$$ LANGUAGE plpgsql;

-- =============================================
-- Migration Status and Utility Functions
-- =============================================

-- Function to get migration status
CREATE OR REPLACE FUNCTION get_migration_status()
RETURNS TABLE (
    version VARCHAR(255),
    name VARCHAR(500),
    executed_at TIMESTAMP,
    execution_time_ms INTEGER,
    success BOOLEAN
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        sm.version,
        sm.name,
        sm.executed_at,
        sm.execution_time_ms,
        sm.success
    FROM schema_migrations sm
    ORDER BY sm.version;
END;
$$ LANGUAGE plpgsql;

-- Function to verify database integrity
CREATE OR REPLACE FUNCTION verify_database_integrity()
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
    WHERE table_schema = 'public' AND table_type = 'BASE TABLE'
    AND table_name NOT LIKE 'schema_migrations%' AND table_name NOT LIKE 'migration_log%';
    
    -- Check if all required indexes exist
    RETURN QUERY
    SELECT 'Indexes'::VARCHAR,
           CASE WHEN COUNT(*) >= 20 THEN 'OK' ELSE 'INCOMPLETE' END::VARCHAR,
           ('Found ' || COUNT(*) || ' indexes')::TEXT
    FROM pg_indexes 
    WHERE schemaname = 'public' AND indexname LIKE 'idx_%';
    
    -- Check if all required triggers exist
    RETURN QUERY
    SELECT 'Triggers'::VARCHAR,
           CASE WHEN COUNT(*) >= 5 THEN 'OK' ELSE 'INCOMPLETE' END::VARCHAR,
           ('Found ' || COUNT(*) || ' triggers')::TEXT
    FROM information_schema.triggers 
    WHERE trigger_schema = 'public';
END;
$$ LANGUAGE plpgsql;

-- =============================================
-- Usage Examples and Documentation
-- =============================================

-- To check migration status:
-- SELECT * FROM get_migration_status();

-- To verify database integrity:
-- SELECT * FROM verify_database_integrity();

-- To rollback a specific migration:
-- SELECT rollback_migration('008_triggers_and_functions');

-- To check if a migration exists:
-- SELECT migration_exists('001_core_extensions_and_types');

RAISE NOTICE 'Migration management system initialized successfully!';
RAISE NOTICE 'Use get_migration_status() to check current migration state.';
RAISE NOTICE 'Use verify_database_integrity() to verify setup completion.'; 