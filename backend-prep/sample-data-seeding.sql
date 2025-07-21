-- Sample Data Seeding for Scoop Social MVP
-- This script populates the database with demo users, events, and interactions
-- Run this after the database migrations are complete

-- =============================================
-- DEMO USERS (Sequential IDs: 1, 2, 3, 4, 5...)
-- =============================================

-- Insert demo users with sequential IDs starting from 1
INSERT INTO users (
    id, email, name, username, avatar_url, bio, location, phone,
    trust_score, join_date, is_verified, phone_verified, email_verified,
    friends_count, reviews_count, events_attended, events_hosted,
    status, preferences, created_at
) VALUES 
(1, 'jake.martinez@gmail.com', 'Jake Martinez', 'jakemartinez', 
 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
 'Tech entrepreneur and event organizer. Love bringing people together for meaningful conversations and innovative projects.',
 'Phoenix, AZ', '+1-602-555-0101',
 85, '2024-01-15 10:00:00', true, true, true,
 18, 15, 12, 8,
 'active', '{"notifications": {"email": true, "push": true}, "privacy": {"profile": "public"}}',
 '2024-01-15 10:00:00'),

(2, 'sarah.chen@outlook.com', 'Sarah Chen', 'sarahchen', 
 'https://images.unsplash.com/photo-1494790108755-2616c5c4a8c1?w=150&h=150&fit=crop&crop=face',
 'Creative designer and community builder. Passionate about sustainable living and connecting with like-minded individuals.',
 'Phoenix, AZ', '+1-602-555-0102',
 78, '2024-02-01 14:30:00', true, true, true,
 22, 9, 15, 3,
 'active', '{"notifications": {"email": true, "push": false}, "privacy": {"profile": "public"}}',
 '2024-02-01 14:30:00'),

(3, 'alex.rodriguez@yahoo.com', 'Alex Rodriguez', 'alexrodriguez', 
 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
 'Software developer and fitness enthusiast. Always looking for new challenges and ways to stay active in the community.',
 'Scottsdale, AZ', '+1-480-555-0103',
 72, '2024-02-15 09:15:00', false, true, true,
 12, 7, 8, 2,
 'active', '{"notifications": {"email": false, "push": true}, "privacy": {"profile": "public"}}',
 '2024-02-15 09:15:00'),

(4, 'emily.johnson@gmail.com', 'Emily Johnson', 'emilyjohnson', 
 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face',
 'Marketing professional and yoga instructor. Believer in work-life balance and mindful living.',
 'Tempe, AZ', '+1-480-555-0104',
 89, '2024-03-01 16:45:00', true, true, true,
 25, 18, 20, 5,
 'active', '{"notifications": {"email": true, "push": true}, "privacy": {"profile": "public"}}',
 '2024-03-01 16:45:00'),

(5, 'michael.brown@protonmail.com', 'Michael Brown', 'michaelbrown', 
 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face',
 'Freelance photographer and travel blogger. Love capturing moments and sharing stories from around the world.',
 'Phoenix, AZ', '+1-623-555-0105',
 91, '2024-03-10 11:20:00', true, true, true,
 31, 22, 18, 7,
 'active', '{"notifications": {"email": true, "push": true}, "privacy": {"profile": "public"}}',
 '2024-03-10 11:20:00');

-- Reset the sequence to continue from 6
SELECT setval('users_id_seq', 5, true);

-- =============================================
-- SOCIAL ACCOUNTS FOR DEMO USERS
-- =============================================

INSERT INTO social_accounts (
    user_id, platform, platform_user_id, username, display_name,
    verified, follower_count, following_count, account_age,
    profile_url, avatar_url, bio, trust_contribution, authenticity_score,
    status, verification_method, last_verified, created_at
) VALUES 
-- Jake Martinez social accounts
(1, 'google', 'google_101234567890', 'jake.martinez@gmail.com', 'Jake Martinez',
 true, 0, 0, '2020-01-15',
 'https://plus.google.com/101234567890', 'https://lh3.googleusercontent.com/a/default-user',
 'Tech entrepreneur in Phoenix', 5, 95,
 'active', 'oauth', NOW(), NOW()),

(1, 'linkedin', 'linkedin_jakemartinez', 'jakemartinez', 'Jake Martinez',
 true, 2847, 1523, '2019-03-20',
 'https://linkedin.com/in/jakemartinez', 'https://media.licdn.com/dms/image/default',
 'Tech entrepreneur and event organizer', 8, 92,
 'active', 'oauth', NOW(), NOW()),

(1, 'twitter', 'twitter_1234567890', '@JakeMartinezAZ', 'Jake Martinez',
 false, 1203, 856, '2020-05-10',
 'https://twitter.com/JakeMartinezAZ', 'https://pbs.twimg.com/profile_images/default.jpg',
 'Building the future in Phoenix 🌵', 3, 78,
 'active', 'oauth', NOW(), NOW()),

-- Sarah Chen social accounts
(2, 'google', 'google_102345678901', 'sarah.chen@outlook.com', 'Sarah Chen',
 true, 0, 0, '2021-06-22',
 'https://plus.google.com/102345678901', 'https://lh3.googleusercontent.com/a/default-user',
 'Creative designer', 5, 94,
 'active', 'oauth', NOW(), NOW()),

(2, 'instagram', 'instagram_sarahchendesign', 'sarahchendesign', 'Sarah Chen',
 true, 5672, 2341, '2019-08-15',
 'https://instagram.com/sarahchendesign', 'https://scontent.cdninstagram.com/default.jpg',
 '✨ Creative designer | 🌱 Sustainability advocate | 📍Phoenix', 7, 89,
 'active', 'oauth', NOW(), NOW()),

-- Alex Rodriguez social accounts
(3, 'github', 'github_alexdev', 'alexdev', 'Alex Rodriguez',
 true, 234, 189, '2018-11-05',
 'https://github.com/alexdev', 'https://avatars.githubusercontent.com/default',
 'Full-stack developer | Phoenix, AZ', 6, 88,
 'active', 'oauth', NOW(), NOW()),

-- Emily Johnson social accounts
(4, 'google', 'google_103456789012', 'emily.johnson@gmail.com', 'Emily Johnson',
 true, 0, 0, '2022-01-08',
 'https://plus.google.com/103456789012', 'https://lh3.googleusercontent.com/a/default-user',
 'Marketing professional', 5, 96,
 'active', 'oauth', NOW(), NOW()),

(4, 'linkedin', 'linkedin_emilyjohnson', 'emilyjohnson', 'Emily Johnson',
 true, 3456, 2103, '2020-04-12',
 'https://linkedin.com/in/emilyjohnson', 'https://media.licdn.com/dms/image/default',
 'Marketing professional and yoga instructor', 8, 93,
 'active', 'oauth', NOW(), NOW()),

-- Michael Brown social accounts
(5, 'instagram', 'instagram_mikebphoto', 'mikebphoto', 'Michael Brown',
 true, 12847, 3256, '2017-09-30',
 'https://instagram.com/mikebphoto', 'https://scontent.cdninstagram.com/default.jpg',
 '📸 Travel photographer | 🌍 Storyteller | Based in Phoenix', 9, 91,
 'active', 'oauth', NOW(), NOW()),

(5, 'twitter', 'twitter_2345678901', '@MikeBPhoto', 'Michael Brown',
 true, 8934, 4567, '2018-02-14',
 'https://twitter.com/MikeBPhoto', 'https://pbs.twimg.com/profile_images/default.jpg',
 '📸 Capturing moments worldwide | Phoenix based', 4, 87,
 'active', 'oauth', NOW(), NOW());

-- =============================================
-- FRIENDSHIPS BETWEEN DEMO USERS
-- =============================================

INSERT INTO friendships (
    user_id, friend_id, status, initiated_by, requested_at, accepted_at, created_at
) VALUES 
-- Jake and Sarah are friends
(1, 2, 'accepted', 1, '2024-02-05 10:30:00', '2024-02-05 14:20:00', '2024-02-05 10:30:00'),
(2, 1, 'accepted', 1, '2024-02-05 10:30:00', '2024-02-05 14:20:00', '2024-02-05 10:30:00'),

-- Jake and Alex are friends
(1, 3, 'accepted', 3, '2024-02-20 16:45:00', '2024-02-20 18:30:00', '2024-02-20 16:45:00'),
(3, 1, 'accepted', 3, '2024-02-20 16:45:00', '2024-02-20 18:30:00', '2024-02-20 16:45:00'),

-- Sarah and Emily are friends
(2, 4, 'accepted', 2, '2024-03-05 09:15:00', '2024-03-05 11:45:00', '2024-03-05 09:15:00'),
(4, 2, 'accepted', 2, '2024-03-05 09:15:00', '2024-03-05 11:45:00', '2024-03-05 09:15:00'),

-- Emily and Michael are friends
(4, 5, 'accepted', 5, '2024-03-15 13:20:00', '2024-03-15 15:10:00', '2024-03-15 13:20:00'),
(5, 4, 'accepted', 5, '2024-03-15 13:20:00', '2024-03-15 15:10:00', '2024-03-15 13:20:00'),

-- Jake and Emily are friends
(1, 4, 'accepted', 1, '2024-03-08 12:00:00', '2024-03-08 14:30:00', '2024-03-08 12:00:00'),
(4, 1, 'accepted', 1, '2024-03-08 12:00:00', '2024-03-08 14:30:00', '2024-03-08 12:00:00'),

-- Pending friend request from Alex to Emily
(3, 4, 'pending', 3, '2024-03-20 10:15:00', NULL, '2024-03-20 10:15:00');

-- =============================================
-- SAMPLE EVENTS
-- =============================================

INSERT INTO events (
    id, host_id, title, description, category, event_date, start_time, end_time,
    location_name, address, latitude, longitude, max_attendees, current_attendees,
    price_cents, is_private, trust_requirement, image_url, tags, status, created_at
) VALUES 
(1, 1, 'Phoenix Tech Networking Mixer', 
 'Join us for an evening of networking with fellow tech professionals in the Phoenix area. Great opportunity to share ideas, find collaborators, and build meaningful connections.',
 'Networking', '2024-04-15', '18:30', '21:00',
 'CityScape Phoenix', '1 E Washington St, Phoenix, AZ 85004', 33.4484, -112.0740,
 50, 12, 0, false, 60,
 'https://images.unsplash.com/photo-1515187029135-18ee286d815b?w=800&h=400&fit=crop',
 ARRAY['networking', 'tech', 'professional', 'phoenix'], 'upcoming', '2024-03-01 09:00:00'),

(2, 2, 'Sustainable Living Workshop',
 'Learn practical tips for reducing your environmental footprint. We''ll cover composting, zero-waste lifestyle, and sustainable product alternatives.',
 'Sweet Workshop', '2024-04-20', '14:00', '16:30',
 'Phoenix Central Library', '1221 N Central Ave, Phoenix, AZ 85004', 33.4734, -112.0740,
 25, 8, 1500, false, 50,
 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=800&h=400&fit=crop',
 ARRAY['sustainability', 'workshop', 'environment', 'education'], 'upcoming', '2024-03-05 11:20:00'),

(3, 4, 'Morning Yoga in the Park',
 'Start your Saturday with a rejuvenating yoga session in beautiful Steele Indian School Park. All levels welcome!',
 'Fitness Scoop', '2024-04-13', '08:00', '09:30',
 'Steele Indian School Park', '300 E Indian School Rd, Phoenix, AZ 85012', 33.4940, -112.0665,
 20, 15, 0, false, 40,
 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=800&h=400&fit=crop',
 ARRAY['yoga', 'fitness', 'morning', 'outdoor', 'wellness'], 'upcoming', '2024-03-10 16:45:00'),

(4, 5, 'Photography Walk: Downtown Phoenix',
 'Explore the urban landscape of downtown Phoenix with fellow photography enthusiasts. We''ll share tips and capture the city''s unique character.',
 'Arts & Culture', '2024-04-18', '17:00', '19:30',
 'Roosevelt Row', 'Roosevelt St & Central Ave, Phoenix, AZ 85004', 33.4734, -112.0740,
 15, 6, 0, false, 55,
 'https://images.unsplash.com/photo-1452587925148-ce544e77e70d?w=800&h=400&fit=crop',
 ARRAY['photography', 'art', 'downtown', 'creative', 'urban'], 'upcoming', '2024-03-12 14:20:00'),

(5, 1, 'Startup Founders Meetup',
 'Monthly gathering for startup founders and entrepreneurs. Share challenges, celebrate wins, and connect with the Phoenix startup ecosystem.',
 'Professional', '2024-04-25', '19:00', '21:30',
 'Galvanize Phoenix', '515 E Grant St, Phoenix, AZ 85004', 33.4734, -112.0665,
 30, 9, 0, false, 70,
 'https://images.unsplash.com/photo-1559136555-9303baea8ebd?w=800&h=400&fit=crop',
 ARRAY['startup', 'entrepreneur', 'business', 'meetup'], 'upcoming', '2024-03-15 10:30:00');

-- Reset the sequence
SELECT setval('events_id_seq', 5, true);

-- =============================================
-- EVENT ATTENDEES
-- =============================================

INSERT INTO event_attendees (
    event_id, user_id, status, payment_status, amount_paid_cents,
    registered_at, attended_at, created_at
) VALUES 
-- Tech Networking Mixer attendees
(1, 2, 'registered', 'comp', 0, '2024-03-02 10:15:00', NULL, '2024-03-02 10:15:00'),
(1, 3, 'registered', 'comp', 0, '2024-03-05 14:30:00', NULL, '2024-03-05 14:30:00'),
(1, 4, 'registered', 'comp', 0, '2024-03-08 09:45:00', NULL, '2024-03-08 09:45:00'),

-- Sustainable Living Workshop attendees
(2, 1, 'registered', 'paid', 1500, '2024-03-06 11:20:00', NULL, '2024-03-06 11:20:00'),
(2, 4, 'registered', 'paid', 1500, '2024-03-10 16:15:00', NULL, '2024-03-10 16:15:00'),
(2, 5, 'registered', 'paid', 1500, '2024-03-12 13:45:00', NULL, '2024-03-12 13:45:00'),

-- Morning Yoga attendees
(3, 1, 'registered', 'comp', 0, '2024-03-11 08:30:00', NULL, '2024-03-11 08:30:00'),
(3, 2, 'registered', 'comp', 0, '2024-03-11 12:15:00', NULL, '2024-03-11 12:15:00'),
(3, 5, 'registered', 'comp', 0, '2024-03-13 19:20:00', NULL, '2024-03-13 19:20:00'),

-- Photography Walk attendees
(4, 1, 'registered', 'comp', 0, '2024-03-13 10:45:00', NULL, '2024-03-13 10:45:00'),
(4, 2, 'registered', 'comp', 0, '2024-03-14 15:30:00', NULL, '2024-03-14 15:30:00'),

-- Startup Founders Meetup attendees
(5, 2, 'registered', 'comp', 0, '2024-03-16 09:20:00', NULL, '2024-03-16 09:20:00'),
(5, 3, 'registered', 'comp', 0, '2024-03-18 11:45:00', NULL, '2024-03-18 11:45:00');

-- =============================================
-- SAMPLE REVIEWS
-- =============================================

INSERT INTO reviews (
    id, reviewer_id, reviewed_id, content, category, tags,
    is_event_review, event_id, upvotes, downvotes, total_votes,
    status, created_at
) VALUES 
(1, 2, 1, 'Jake is an excellent event organizer who really knows how to bring people together. His tech meetups are always well-planned and create great networking opportunities.',
 'Professional', ARRAY['organized', 'networking', 'tech'], false, NULL, 8, 1, 9, 'active', '2024-02-10 15:30:00'),

(2, 3, 1, 'Had a great experience working with Jake on a startup project. He''s reliable, creative, and brings positive energy to every collaboration.',
 'Professional', ARRAY['reliable', 'creative', 'positive'], false, NULL, 6, 0, 6, 'active', '2024-02-25 11:20:00'),

(3, 1, 2, 'Sarah is incredibly talented and has a great eye for design. She helped me with my website and the results exceeded my expectations.',
 'Service Sundae', ARRAY['talented', 'design', 'professional'], false, NULL, 12, 0, 12, 'active', '2024-02-12 14:45:00'),

(4, 4, 2, 'Sarah is a wonderful friend and mentor. Her sustainability workshop was informative and inspiring. Highly recommend connecting with her!',
 'Social Scoop', ARRAY['inspiring', 'knowledgeable', 'friendly'], false, NULL, 9, 1, 10, 'active', '2024-03-07 16:20:00'),

(5, 1, 3, 'Alex is a skilled developer who writes clean, efficient code. Great to work with and always meets deadlines.',
 'Professional', ARRAY['skilled', 'efficient', 'reliable'], false, NULL, 7, 0, 7, 'active', '2024-03-01 10:15:00'),

(6, 5, 4, 'Emily''s yoga classes are amazing! She creates a welcoming environment for all skill levels and her instruction is clear and helpful.',
 'Service Sundae', ARRAY['welcoming', 'skilled', 'helpful'], false, NULL, 15, 0, 15, 'active', '2024-03-18 09:30:00'),

(7, 2, 5, 'Michael captured our event beautifully. His photography skills are exceptional and he''s great to work with.',
 'Service Sundae', ARRAY['skilled', 'professional', 'creative'], false, NULL, 11, 0, 11, 'active', '2024-03-20 13:45:00'),

(8, 4, 1, 'Jake''s startup meetup was incredibly valuable. Great speaker lineup and excellent networking opportunities.',
 'Event Organizer', ARRAY['valuable', 'networking', 'organized'], true, 5, 10, 0, 10, 'active', '2024-03-22 18:20:00');

-- Reset the sequence
SELECT setval('reviews_id_seq', 8, true);

-- =============================================
-- REVIEW VOTES
-- =============================================

INSERT INTO review_votes (review_id, user_id, vote_type, created_at) VALUES 
-- Votes on Jake's reviews
(1, 1, 'up', '2024-02-10 16:00:00'),
(1, 4, 'up', '2024-02-11 09:15:00'),
(1, 5, 'up', '2024-02-11 14:30:00'),
(1, 3, 'down', '2024-02-12 10:45:00'),

-- Votes on Sarah's reviews
(3, 3, 'up', '2024-02-13 11:20:00'),
(3, 4, 'up', '2024-02-13 15:45:00'),
(3, 5, 'up', '2024-02-14 09:30:00'),

-- Votes on other reviews
(4, 1, 'up', '2024-03-08 12:15:00'),
(4, 3, 'up', '2024-03-08 16:30:00'),
(5, 2, 'up', '2024-03-02 14:20:00'),
(6, 1, 'up', '2024-03-19 10:45:00'),
(6, 2, 'up', '2024-03-19 13:20:00'),
(7, 1, 'up', '2024-03-21 11:30:00'),
(8, 2, 'up', '2024-03-23 09:15:00');

-- =============================================
-- USER INTERESTS
-- =============================================

INSERT INTO user_interests (user_id, interest_name, interest_category, source, confidence_score, created_at) VALUES 
-- Jake's interests
(1, 'Technology', 'Professional', 'manual', 100, '2024-01-15 10:00:00'),
(1, 'Entrepreneurship', 'Professional', 'manual', 95, '2024-01-15 10:00:00'),
(1, 'Networking', 'Social', 'manual', 90, '2024-01-15 10:00:00'),
(1, 'Innovation', 'Professional', 'ai_detected', 85, '2024-02-01 14:30:00'),

-- Sarah's interests
(2, 'Sustainability', 'Lifestyle', 'manual', 100, '2024-02-01 14:30:00'),
(2, 'Design', 'Creative', 'manual', 95, '2024-02-01 14:30:00'),
(2, 'Community Building', 'Social', 'manual', 90, '2024-02-01 14:30:00'),
(2, 'Environmental Science', 'Education', 'ai_detected', 80, '2024-02-15 16:20:00'),

-- Alex's interests
(3, 'Software Development', 'Professional', 'manual', 100, '2024-02-15 09:15:00'),
(3, 'Fitness', 'Health', 'manual', 85, '2024-02-15 09:15:00'),
(3, 'Gaming', 'Entertainment', 'manual', 75, '2024-02-15 09:15:00'),

-- Emily's interests
(4, 'Marketing', 'Professional', 'manual', 100, '2024-03-01 16:45:00'),
(4, 'Yoga', 'Health', 'manual', 95, '2024-03-01 16:45:00'),
(4, 'Wellness', 'Health', 'manual', 90, '2024-03-01 16:45:00'),
(4, 'Mindfulness', 'Lifestyle', 'ai_detected', 85, '2024-03-10 12:30:00'),

-- Michael's interests
(5, 'Photography', 'Creative', 'manual', 100, '2024-03-10 11:20:00'),
(5, 'Travel', 'Lifestyle', 'manual', 95, '2024-03-10 11:20:00'),
(5, 'Storytelling', 'Creative', 'manual', 90, '2024-03-10 11:20:00'),
(5, 'Adventure', 'Lifestyle', 'ai_detected', 80, '2024-03-15 18:45:00');

-- =============================================
-- USER BADGES
-- =============================================

INSERT INTO user_badges (user_id, badge_type, badge_description, earned_for, earned_at, created_at) VALUES 
-- Jake's badges
(1, 'Early Adopter', 'One of the first users to join Scoop Social', 'Platform Pioneer', '2024-01-15 10:00:00', '2024-01-15 10:00:00'),
(1, 'Event Host', 'Successfully organized multiple community events', 'Community Building', '2024-02-01 12:00:00', '2024-02-01 12:00:00'),
(1, 'Tech Expert', 'Recognized expertise in technology field', 'Professional Excellence', '2024-02-15 14:30:00', '2024-02-15 14:30:00'),

-- Sarah's badges
(2, 'Community Builder', 'Active in building and nurturing community connections', 'Social Impact', '2024-02-20 16:00:00', '2024-02-20 16:00:00'),
(2, 'Sustainability Champion', 'Promoting environmental awareness and action', 'Environmental Leadership', '2024-03-01 10:30:00', '2024-03-01 10:30:00'),

-- Emily's badges
(4, 'Wellness Advocate', 'Promoting health and wellness in the community', 'Health Leadership', '2024-03-15 09:45:00', '2024-03-15 09:45:00'),
(4, 'Trusted Reviewer', 'Providing valuable and helpful reviews', 'Community Contribution', '2024-03-20 14:20:00', '2024-03-20 14:20:00'),

-- Michael's badges
(5, 'Creative Vision', 'Outstanding creative contributions to the community', 'Artistic Excellence', '2024-03-18 11:15:00', '2024-03-18 11:15:00');

-- =============================================
-- TRUST SCORE HISTORY
-- =============================================

INSERT INTO trust_score_history (
    user_id, old_score, new_score, activity_type, activity_description,
    related_user_id, related_review_id, created_at
) VALUES 
-- Jake's trust score changes
(1, 50, 65, 'phone_verified', 'Phone number verified', NULL, NULL, '2024-01-15 10:30:00'),
(1, 65, 70, 'profile_updated', 'Profile completed with bio and interests', NULL, NULL, '2024-01-15 11:00:00'),
(1, 70, 75, 'social_account_connected', 'LinkedIn account connected and verified', NULL, NULL, '2024-01-16 09:15:00'),
(1, 75, 78, 'review_received', 'Received positive review from Sarah', 2, 1, '2024-02-10 15:30:00'),
(1, 78, 82, 'event_hosted', 'Successfully hosted Phoenix Tech Networking Mixer', NULL, NULL, '2024-02-15 20:00:00'),
(1, 82, 85, 'friend_added', 'Connected with multiple verified users', NULL, NULL, '2024-03-01 14:20:00'),

-- Sarah's trust score changes  
(2, 50, 65, 'email_verified', 'Email address verified', NULL, NULL, '2024-02-01 15:00:00'),
(2, 65, 70, 'phone_verified', 'Phone number verified', NULL, NULL, '2024-02-01 15:30:00'),
(2, 70, 75, 'social_account_connected', 'Instagram account connected', NULL, NULL, '2024-02-02 10:45:00'),
(2, 75, 78, 'review_received', 'Received excellent review for design work', 1, 3, '2024-02-12 14:45:00'),

-- Alex's trust score changes
(3, 50, 65, 'phone_verified', 'Phone number verified', NULL, NULL, '2024-02-15 09:45:00'),
(3, 65, 70, 'social_account_connected', 'GitHub account connected', NULL, NULL, '2024-02-16 11:20:00'),
(3, 70, 72, 'review_given', 'Provided helpful review for Jake', 1, 2, '2024-02-25 11:20:00'),

-- Emily's trust score changes
(4, 50, 65, 'phone_verified', 'Phone number verified', NULL, NULL, '2024-03-01 17:15:00'),
(4, 65, 75, 'email_verified', 'Email verified', NULL, NULL, '2024-03-01 17:30:00'),
(4, 75, 80, 'social_account_connected', 'LinkedIn account connected and verified', NULL, NULL, '2024-03-02 09:30:00'),
(4, 80, 85, 'review_received', 'Received outstanding review for yoga instruction', 5, 6, '2024-03-18 09:30:00'),
(4, 85, 89, 'event_hosted', 'Successfully hosted Morning Yoga in the Park', NULL, NULL, '2024-03-20 10:00:00'),

-- Michael's trust score changes
(5, 50, 65, 'phone_verified', 'Phone number verified', NULL, NULL, '2024-03-10 11:50:00'),
(5, 65, 75, 'social_account_connected', 'Instagram account connected with high follower count', NULL, NULL, '2024-03-11 14:20:00'),
(5, 75, 80, 'social_account_connected', 'Twitter account connected and verified', NULL, NULL, '2024-03-12 16:45:00'),
(5, 80, 85, 'review_received', 'Received excellent review for photography services', 2, 7, '2024-03-20 13:45:00'),
(5, 85, 91, 'friend_added', 'Built strong network of verified connections', NULL, NULL, '2024-03-22 15:30:00');

-- =============================================
-- SAMPLE NOTIFICATIONS
-- =============================================

INSERT INTO notifications (
    user_id, type, title, message, related_user_id, related_review_id, related_event_id,
    is_read, is_dismissed, sent_via, created_at
) VALUES 
-- Jake's notifications
(1, 'review_received', 'New Review Received', 'Sarah Chen left you a positive review!', 2, 1, NULL, 
 true, false, 'in_app', '2024-02-10 15:30:00'),
(1, 'friend_accepted', 'Friend Request Accepted', 'Alex Rodriguez accepted your friend request', 3, NULL, NULL,
 true, false, 'in_app', '2024-02-20 18:30:00'),
(1, 'trust_score_updated', 'Trust Score Increased', 'Your trust score increased to 85 points!', NULL, NULL, NULL,
 false, false, 'in_app', '2024-03-01 14:20:00'),

-- Sarah's notifications  
(2, 'friend_request', 'New Friend Request', 'Jake Martinez sent you a friend request', 1, NULL, NULL,
 true, false, 'in_app', '2024-02-05 10:30:00'),
(2, 'review_received', 'New Review Received', 'Emily Johnson left you a wonderful review!', 4, 4, NULL,
 false, false, 'in_app', '2024-03-07 16:20:00'),

-- Alex's notifications
(3, 'friend_accepted', 'Friend Request Accepted', 'Jake Martinez accepted your friend request', 1, NULL, NULL,
 true, false, 'in_app', '2024-02-20 18:30:00'),
(3, 'event_invite', 'Event Invitation', 'You were invited to Startup Founders Meetup', 1, NULL, 5,
 false, false, 'in_app', '2024-03-16 10:00:00'),

-- Emily's notifications
(4, 'review_received', 'New Review Received', 'Michael Brown gave you 5 stars for your yoga class!', 5, 6, NULL,
 false, false, 'in_app', '2024-03-18 09:30:00'),
(4, 'trust_score_updated', 'Trust Score Milestone', 'Congratulations! Your trust score reached 89 points', NULL, NULL, NULL,
 false, false, 'in_app', '2024-03-20 10:00:00'),

-- Michael's notifications
(5, 'friend_accepted', 'Friend Request Accepted', 'Emily Johnson accepted your friend request', 4, NULL, NULL,
 true, false, 'in_app', '2024-03-15 15:10:00'),
(5, 'review_received', 'New Review Received', 'Sarah Chen left an amazing review for your photography!', 2, 7, NULL,
 false, false, 'in_app', '2024-03-20 13:45:00');

-- =============================================
-- VERIFICATION AND CLEANUP
-- =============================================

-- Update denormalized counts (these should normally be handled by triggers)
UPDATE users SET 
    friends_count = (
        SELECT COUNT(*) FROM friendships 
        WHERE (user_id = users.id OR friend_id = users.id) 
        AND status = 'accepted'
    ),
    reviews_count = (
        SELECT COUNT(*) FROM reviews 
        WHERE reviewed_id = users.id 
        AND status = 'active'
    );

UPDATE events SET 
    current_attendees = (
        SELECT COUNT(*) FROM event_attendees 
        WHERE event_id = events.id 
        AND status IN ('registered', 'attended')
    );

-- Verify data integrity
DO $$
BEGIN
    -- Check that all users have sequential IDs starting from 1
    IF (SELECT COUNT(*) FROM users WHERE id NOT IN (1,2,3,4,5)) > 0 THEN
        RAISE EXCEPTION 'User IDs are not sequential starting from 1';
    END IF;
    
    -- Check that all friendships are bidirectional
    IF (SELECT COUNT(*) FROM friendships f1 
        WHERE NOT EXISTS (
            SELECT 1 FROM friendships f2 
            WHERE f1.user_id = f2.friend_id 
            AND f1.friend_id = f2.user_id 
            AND f1.status = f2.status
        )) > 0 THEN
        RAISE EXCEPTION 'Found unidirectional friendships';
    END IF;
    
    -- Check that review vote counts match
    IF (SELECT COUNT(*) FROM reviews r 
        WHERE r.total_votes != (
            SELECT COUNT(*) FROM review_votes rv 
            WHERE rv.review_id = r.id
        )) > 0 THEN
        RAISE EXCEPTION 'Review vote counts do not match';
    END IF;
    
    RAISE NOTICE 'Sample data seeding completed successfully! ✅';
    RAISE NOTICE 'Created % users, % events, % reviews, % friendships', 
        (SELECT COUNT(*) FROM users),
        (SELECT COUNT(*) FROM events),
        (SELECT COUNT(*) FROM reviews),
        (SELECT COUNT(*) FROM friendships WHERE user_id < friend_id);
END $$; 