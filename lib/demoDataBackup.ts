/**
 * Demo Data Backup - Preserve Original Sample Data
 * This file contains all the original demo data for easy restoration
 * if we need to revert back to the demo state.
 */

// Backup of original sample users (IDs 0-5)
export const originalDemoUsers = [
  {
    id: '0', // Test User (will become demo-0)
    name: 'Test User',
    email: 'test@scoop.social',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
    bio: 'Beta tester exploring Scoop Social. Create your own profile to get started!',
    location: 'Phoenix, AZ',
    joinDate: '2024-03-01',
    trustScore: 75,
    isVerified: true,
    friendsCount: 8,
    reviewsCount: 12,
    eventsHosted: 2,
    eventsAttended: 15,
    badges: ['Early Adopter', 'Beta Tester'],
    interests: ['Technology', 'Networking', 'Testing'],
    socialLinks: {
      instagram: '',
      twitter: ''
    },
    phoneVerified: true,
    emailVerified: true
  },
  {
    id: '1', // Jake Martinez (will become demo-1)
    name: 'Jake Martinez',
    email: 'jake@example.com',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
    bio: 'Event organizer and community builder. Love bringing people together for meaningful connections and great experiences.',
    location: 'Phoenix, AZ',
    joinDate: '2024-01-15',
    trustScore: 89,
    isVerified: true,
    friendsCount: 234,
    reviewsCount: 89,
    eventsHosted: 12,
    eventsAttended: 45,
    badges: ['Verified Host', 'Community Builder', 'Top Reviewer'],
    interests: ['Event Planning', 'Networking', 'Community Building', 'Entrepreneurship'],
    socialLinks: {
      instagram: '@jake_martinez_phx',
      twitter: '@jakemartinez',
      linkedin: 'jake-martinez-phoenix'
    },
    phoneVerified: true,
    emailVerified: true
  },
  {
    id: '2', // Sarah Chen (will become demo-2)
    name: 'Sarah Chen',
    email: 'sarah@example.com',
    avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b47c?w=150&h=150&fit=crop&crop=face',
    bio: 'Software engineer passionate about technology and innovation. Always excited to meet fellow developers and share knowledge.',
    location: 'Phoenix, AZ',
    joinDate: '2024-02-01',
    trustScore: 85,
    isVerified: true,
    friendsCount: 156,
    reviewsCount: 34,
    eventsAttended: 28,
    eventsHosted: 3,
    badges: ['Tech Expert', 'Active Member'],
    interests: ['Software Development', 'AI/ML', 'Tech Meetups'],
    socialLinks: {
      instagram: '@sarahchen_dev',
      twitter: '@sarahchen',
      linkedin: 'sarah-chen-dev'
    },
    phoneVerified: true,
    emailVerified: true
  },
  {
    id: '3', // Emily Rodriguez (will become demo-3)
    name: 'Emily Rodriguez',
    email: 'emily@example.com',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face',
    bio: 'Creative professional and art enthusiast. Love exploring Phoenix\'s vibrant arts scene and connecting with fellow creatives.',
    location: 'Phoenix, AZ',
    joinDate: '2024-02-15',
    trustScore: 82,
    isVerified: true,
    friendsCount: 98,
    reviewsCount: 27,
    eventsAttended: 22,
    eventsHosted: 5,
    badges: ['Art Lover', 'Creative Professional'],
    interests: ['Art', 'Photography', 'Design', 'Cultural Events'],
    socialLinks: {
      instagram: '@emily_creates',
      twitter: '@emilyrodriguez'
    },
    phoneVerified: true,
    emailVerified: true
  },
  {
    id: '4', // David Kim (will become demo-4)
    name: 'David Kim',
    email: 'david@example.com',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
    bio: 'Freelance consultant helping businesses grow. Passionate about entrepreneurship and building meaningful professional relationships.',
    location: 'Phoenix, AZ',
    joinDate: '2024-01-20',
    trustScore: 88,
    isVerified: true,
    friendsCount: 203,
    reviewsCount: 56,
    eventsAttended: 35,
    eventsHosted: 8,
    badges: ['Business Pro', 'Verified Consultant', 'Networking Expert'],
    interests: ['Business', 'Consulting', 'Entrepreneurship', 'Networking'],
    socialLinks: {
      instagram: '@davidkim_biz',
      twitter: '@davidkimconsult',
      linkedin: 'david-kim-consultant'
    },
    phoneVerified: true,
    emailVerified: true
  },
  {
    id: '5', // Lisa Thompson (will become demo-5)
    name: 'Lisa Thompson',
    email: 'lisa@example.com',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&h=150&fit=crop&crop=face',
    bio: 'Insurance professional with a passion for helping others. Active in the Phoenix business community and love supporting local entrepreneurs.',
    location: 'Phoenix, AZ',
    joinDate: '2024-01-10',
    trustScore: 91,
    isVerified: true,
    friendsCount: 167,
    reviewsCount: 43,
    eventsAttended: 31,
    eventsHosted: 4,
    badges: ['Insurance Expert', 'Community Supporter', 'Trusted Professional'],
    interests: ['Insurance', 'Risk Management', 'Business Development', 'Community Service'],
    socialLinks: {
      instagram: '@lisa_thompson_ins',
      twitter: '@lisathompson',
      linkedin: 'lisa-thompson-insurance'
    },
    phoneVerified: true,
    emailVerified: true
  }
];

// Backup of original demo reviews
export const originalDemoReviews = [
  {
    id: '1',
    reviewerId: '2', // Sarah Chen
    reviewedId: '1', // Jake Martinez
    content: 'Jake is an amazing venue owner! His space is always clean and well-maintained. He\'s very professional and accommodating.',
    category: 'Professional',
    timestamp: '2024-03-10T15:30:00Z',
    votes: 45,
    isEventReview: false
  },
  {
    id: '2',
    reviewerId: '3', // Emily Rodriguez
    reviewedId: '4', // David Kim
    content: 'David was a great study partner for our coding bootcamp. Very knowledgeable and patient.',
    category: 'Academic',
    timestamp: '2024-03-09T18:45:00Z',
    votes: 32,
    isEventReview: false
  },
  {
    id: '3',
    reviewerId: '5', // Lisa Thompson
    reviewedId: '2', // Sarah Chen
    content: 'Sarah is a fantastic roommate. Always clean, respectful, and pays rent on time.',
    category: 'Roommate',
    timestamp: '2024-03-08T12:15:00Z',
    votes: 28,
    isEventReview: false
  },
  // ... Additional reviews would be here
];

// Backup of original demo events
export const originalDemoEvents = [
  {
    id: 'event1',
    title: 'Tech Meetup & Networking',
    description: 'Join us for an evening of tech talks, networking, and delicious catering by Emily Rodriguez.',
    hostId: '1', // Jake Martinez
    date: '2024-03-06',
    time: '6:00 PM',
    location: 'Jake\'s Loft',
    address: '123 Downtown Ave, Phoenix, AZ 85004',
    category: 'Technology',
    imageUrl: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=600',
    maxAttendees: 100,
    attendeeCount: 85,
    price: 0,
    isPrivate: false,
    isPast: true,
    trustRequirement: 60,
    tags: ['tech', 'networking', 'catering', 'talks'],
    attendees: ['1', '2', '3']
  },
  // ... Additional events would be here
];

// Backup of original friend relationships
export const originalFriendRelationships = {
  '0': ['1', '2', '3'], // Test User is friends with Jake, Sarah, Emily
  '1': ['0', '2', '4', '5'], // Jake is friends with Test User, Sarah, David, Lisa
  '2': ['0', '1', '3', '4'], // Sarah is friends with Test User, Jake, Emily, David
  '3': ['0', '2', '5'], // Emily is friends with Test User, Sarah, Lisa
  '4': ['1', '2', '5'], // David is friends with Jake, Sarah, Lisa
  '5': ['1', '3', '4'], // Lisa is friends with Jake, Emily, David
};

// Function to restore demo data (for fallback)
export function restoreDemoData(): void {
  if (typeof window === 'undefined') return;
  
  try {
    // Mark as demo mode
    localStorage.setItem('isDemoMode', 'true');
    
    // Restore original sample data
    localStorage.setItem('scoopUsers', JSON.stringify(originalDemoUsers));
    localStorage.setItem('scoopReviews', JSON.stringify(originalDemoReviews));
    localStorage.setItem('scoopEvents', JSON.stringify(originalDemoEvents));
    localStorage.setItem('friendRelationships', JSON.stringify(originalFriendRelationships));
    
    // Set current user to Test User
    localStorage.setItem('currentUser', JSON.stringify(originalDemoUsers[0]));
    
    console.log('✅ Demo data restored successfully');
  } catch (error) {
    console.error('❌ Error restoring demo data:', error);
  }
}

// Function to clear demo data and prepare for production
export function clearDemoDataForProduction(): void {
  if (typeof window === 'undefined') return;
  
  try {
    // Clear all demo-related localStorage
    localStorage.removeItem('isDemoMode');
    localStorage.removeItem('scoopUsers');
    localStorage.removeItem('scoopReviews');
    localStorage.removeItem('scoopEvents');
    localStorage.removeItem('friendRelationships');
    localStorage.removeItem('currentUser');
    localStorage.removeItem('userActivities');
    localStorage.removeItem('demoFlavors');
    localStorage.removeItem('demoFlavorsGenerated');
    
    console.log('✅ Demo data cleared for production');
  } catch (error) {
    console.error('❌ Error clearing demo data:', error);
  }
}

// Function to check if in demo mode
export function isDemoMode(): boolean {
  if (typeof window === 'undefined') return false;
  return localStorage.getItem('isDemoMode') === 'true';
} 