// Sample data for ScoopSocials

export interface User {
  id: string
  name: string
  username: string
  email: string
  avatar: string
  bio: string
  trustScore: number
  trustLevel: 'excellent' | 'good' | 'fair' | 'poor' | 'new'
  joinDate: string
  location: string
  accountType: 'free' | 'pro' | 'venue'
  socialAccounts: SocialAccount[]
  friendsCount: number
  reviewsCount: number
  eventsAttended: number
  isVerified: boolean
  mutualFriends?: number
  phone?: string
}

export interface SocialAccount {
  platform: string
  handle: string
  verified: boolean
  icon: string
}

export interface Review {
  id: string
  reviewerId: string
  reviewedId: string
  category: string
  rating: number
  content: string
  timestamp: string
  upvotes: number
  downvotes: number
  hasVoted: boolean
  voteType?: 'up' | 'down'
  isEventReview?: boolean
  eventId?: string
  trustScore: number
  communityValidation: number
}

export interface Event {
  id: string
  title: string
  description: string
  hostId: string
  date: string
  time: string
  location: string
  address: string
  coordinates: [number, number]
  attendeeCount: number
  maxAttendees: number
  trustRequirement: number
  isPrivate: boolean
  category: string
  price: number
  imageUrl: string
  tags: string[]
  rsvpStatus?: 'going' | 'interested' | 'not-going'
  userAttended?: boolean
  isPast?: boolean
}

export interface Comment {
  id: string
  postId: string
  userId: string
  content: string
  timestamp: string
  upvotes: number
  downvotes: number
  replies: Comment[]
  parentId?: string
}

// User Management Functions
export function getCurrentUser(): User {
  if (typeof window === 'undefined') {
    // Server-side rendering fallback
    return sampleUsers[0]
  }

  try {
    const storedUser = localStorage.getItem('currentUser')
    if (storedUser) {
      return JSON.parse(storedUser)
    }
  } catch (error) {
    console.error('Error parsing stored user data:', error)
  }
  
  // Fallback to first sample user
  return sampleUsers[0]
}

export function saveCurrentUser(user: User): void {
  if (typeof window === 'undefined') return
  
  try {
    localStorage.setItem('currentUser', JSON.stringify(user))
  } catch (error) {
    console.error('Error saving user data:', error)
  }
}

export function createNewUser(userData: {
  fullName: string
  email: string
  phone: string
}): User {
  const newUser: User = {
    id: Date.now().toString(),
    name: userData.fullName,
    username: userData.fullName.toLowerCase().replace(/\s+/g, '_'),
    email: userData.email,
    phone: userData.phone,
    avatar: `/scoop-logo.png`, // Default avatar - ScoopSocials logo
    bio: 'New to ScoopSocials! Looking forward to connecting with the community.',
    trustScore: 50, // Starting trust score for new users
    trustLevel: 'new',
    joinDate: new Date().toISOString().split('T')[0],
    location: 'Location not set',
    accountType: 'free',
    socialAccounts: [],
    friendsCount: 0,
    reviewsCount: 0,
    eventsAttended: 0,
    isVerified: false
  }
  
  // Set up initial user in localStorage for metrics tracking
  saveCurrentUser(newUser)
  
  // Give bonuses for initial setup
  setTimeout(() => {
    // Profile completion bonus (has name, email, phone)
    completeProfile(newUser.id)
    
    // Phone verification bonus (since they provided phone)
    verifyPhone(newUser.id)
    
    // Record account creation
    recordUserActivity(newUser.id, 'account_created', {
      name: userData.fullName,
      email: userData.email
    })
  }, 100) // Small delay to ensure user is saved first
  
  return newUser
}

export function updateUserProfile(updates: Partial<User>): User {
  const currentUser = getCurrentUser()
  const updatedUser = { ...currentUser, ...updates }
  saveCurrentUser(updatedUser)
  return updatedUser
}

// User Metrics Management Functions
export function incrementUserReviews(userId: string): void {
  if (typeof window === 'undefined') return
  
  try {
    // Update current user if it's them
    const currentUser = getCurrentUser()
    if (currentUser.id === userId) {
      const updatedUser = {
        ...currentUser,
        reviewsCount: currentUser.reviewsCount + 1,
        trustScore: calculateNewTrustScore(currentUser.trustScore, 'review_created')
      }
      updatedUser.trustLevel = getTrustLevel(updatedUser.trustScore)
      saveCurrentUser(updatedUser)
    }
    
    // Update in sample users if exists
    const userIndex = sampleUsers.findIndex(user => user.id === userId)
    if (userIndex !== -1) {
      sampleUsers[userIndex].reviewsCount += 1
      sampleUsers[userIndex].trustScore = calculateNewTrustScore(sampleUsers[userIndex].trustScore, 'review_created')
      sampleUsers[userIndex].trustLevel = getTrustLevel(sampleUsers[userIndex].trustScore)
    }
  } catch (error) {
    console.error('Error incrementing user reviews:', error)
  }
}

export function incrementUserEvents(userId: string): void {
  if (typeof window === 'undefined') return
  
  try {
    // Update current user if it's them
    const currentUser = getCurrentUser()
    if (currentUser.id === userId) {
      const updatedUser = {
        ...currentUser,
        eventsAttended: currentUser.eventsAttended + 1,
        trustScore: calculateNewTrustScore(currentUser.trustScore, 'event_attended')
      }
      updatedUser.trustLevel = getTrustLevel(updatedUser.trustScore)
      saveCurrentUser(updatedUser)
    }
    
    // Update in sample users if exists
    const userIndex = sampleUsers.findIndex(user => user.id === userId)
    if (userIndex !== -1) {
      sampleUsers[userIndex].eventsAttended += 1
      sampleUsers[userIndex].trustScore = calculateNewTrustScore(sampleUsers[userIndex].trustScore, 'event_attended')
      sampleUsers[userIndex].trustLevel = getTrustLevel(sampleUsers[userIndex].trustScore)
    }
  } catch (error) {
    console.error('Error incrementing user events:', error)
  }
}

export function incrementUserFriends(userId: string): void {
  if (typeof window === 'undefined') return
  
  try {
    // Update current user if it's them
    const currentUser = getCurrentUser()
    if (currentUser.id === userId) {
      const updatedUser = {
        ...currentUser,
        friendsCount: currentUser.friendsCount + 1,
        trustScore: calculateNewTrustScore(currentUser.trustScore, 'friend_added')
      }
      updatedUser.trustLevel = getTrustLevel(updatedUser.trustScore)
      saveCurrentUser(updatedUser)
    }
    
    // Update in sample users if exists
    const userIndex = sampleUsers.findIndex(user => user.id === userId)
    if (userIndex !== -1) {
      sampleUsers[userIndex].friendsCount += 1
      sampleUsers[userIndex].trustScore = calculateNewTrustScore(sampleUsers[userIndex].trustScore, 'friend_added')
      sampleUsers[userIndex].trustLevel = getTrustLevel(sampleUsers[userIndex].trustScore)
    }
  } catch (error) {
    console.error('Error incrementing user friends:', error)
  }
}

export function updateTrustScore(userId: string, activity: string, amount?: number): void {
  if (typeof window === 'undefined') return
  
  try {
    // Update current user if it's them
    const currentUser = getCurrentUser()
    if (currentUser.id === userId) {
      const newScore = amount ? currentUser.trustScore + amount : calculateNewTrustScore(currentUser.trustScore, activity)
      const updatedUser = {
        ...currentUser,
        trustScore: Math.max(0, Math.min(100, newScore)), // Keep between 0-100
        trustLevel: getTrustLevel(Math.max(0, Math.min(100, newScore)))
      }
      saveCurrentUser(updatedUser)
    }
    
    // Update in sample users if exists
    const userIndex = sampleUsers.findIndex(user => user.id === userId)
    if (userIndex !== -1) {
      const newScore = amount ? sampleUsers[userIndex].trustScore + amount : calculateNewTrustScore(sampleUsers[userIndex].trustScore, activity)
      sampleUsers[userIndex].trustScore = Math.max(0, Math.min(100, newScore))
      sampleUsers[userIndex].trustLevel = getTrustLevel(sampleUsers[userIndex].trustScore)
    }
  } catch (error) {
    console.error('Error updating trust score:', error)
  }
}

export function calculateNewTrustScore(currentScore: number, activity: string): number {
  const scoreChanges: { [key: string]: number } = {
    'review_created': 2,        // +2 for writing a review
    'review_received': 1,       // +1 for getting reviewed
    'event_created': 3,         // +3 for hosting an event
    'event_attended': 1,        // +1 for attending an event
    'friend_added': 0.5,        // +0.5 for making a friend
    'profile_completed': 5,     // +5 for completing profile
    'phone_verified': 10,       // +10 for phone verification
    'social_connected': 3,      // +3 for connecting social account
    'upvote_received': 0.5,     // +0.5 for getting upvoted
    'downvote_received': -1,    // -1 for getting downvoted
    'reported': -5,             // -5 for being reported
    'content_removed': -10      // -10 for content removal
  }
  
  const change = scoreChanges[activity] || 0
  return Math.max(0, Math.min(100, currentScore + change))
}

export function recordUserActivity(userId: string, activity: string, metadata?: any): void {
  if (typeof window === 'undefined') return
  
  try {
    const activities = getUserActivities()
    const newActivity = {
      id: Date.now().toString(),
      userId,
      activity,
      timestamp: new Date().toISOString(),
      metadata: metadata || {}
    }
    
    activities.unshift(newActivity) // Add to beginning
    
    // Keep only last 100 activities per user
    const userActivities = activities.filter(a => a.userId === userId)
    if (userActivities.length > 100) {
      const activitiesToKeep = activities.filter(a => a.userId !== userId)
      const recentUserActivities = userActivities.slice(0, 100)
      localStorage.setItem('userActivities', JSON.stringify([...activitiesToKeep, ...recentUserActivities]))
    } else {
      localStorage.setItem('userActivities', JSON.stringify(activities))
    }
    
    // Update trust score based on activity
    updateTrustScore(userId, activity)
  } catch (error) {
    console.error('Error recording user activity:', error)
  }
}

export function getUserActivities(): any[] {
  if (typeof window === 'undefined') return []
  
  try {
    const activities = localStorage.getItem('userActivities')
    return activities ? JSON.parse(activities) : []
  } catch (error) {
    console.error('Error getting user activities:', error)
    return []
  }
}

// Post Management Functions
export function getAllReviews(): Review[] {
  if (typeof window === 'undefined') {
    return sampleReviews
  }

  try {
    const storedReviews = localStorage.getItem('scoopReviews')
    if (storedReviews) {
      const reviews = JSON.parse(storedReviews)
      // Sort by timestamp (newest first)
      return reviews.sort((a: Review, b: Review) => 
        new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
      )
    }
  } catch (error) {
    console.error('Error parsing stored reviews:', error)
  }
  
  // Initialize with sample data and sort by timestamp
  const sortedReviews = [...sampleReviews].sort((a, b) => 
    new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
  )
  saveAllReviews(sortedReviews)
  return sortedReviews
}

export function saveAllReviews(reviews: Review[]): void {
  if (typeof window === 'undefined') return
  
  try {
    localStorage.setItem('scoopReviews', JSON.stringify(reviews))
  } catch (error) {
    console.error('Error saving reviews:', error)
  }
}

export function createNewReview(reviewData: {
  reviewedId: string
  category: string
  content: string
  location?: string
  tags: string[]
}): Review {
  const currentUser = getCurrentUser()
  const newReview: Review = {
    id: Date.now().toString(),
    reviewerId: currentUser.id,
    reviewedId: reviewData.reviewedId,
    category: reviewData.category,
    rating: 5, // Default rating
    content: reviewData.content,
    timestamp: new Date().toISOString(),
    upvotes: 0,
    downvotes: 0,
    hasVoted: false,
    trustScore: currentUser.trustScore,
    communityValidation: 0
  }
  
  // Add to existing reviews
  const allReviews = getAllReviews()
  allReviews.unshift(newReview) // Add to beginning (newest first)
  saveAllReviews(allReviews)
  
  // Update user metrics
  incrementUserReviews(currentUser.id)
  recordUserActivity(currentUser.id, 'review_created', {
    reviewId: newReview.id,
    reviewedId: reviewData.reviewedId,
    category: reviewData.category
  })
  
  // Give trust score boost to person being reviewed
  updateTrustScore(reviewData.reviewedId, 'review_received')
  
  return newReview
}

// Event Management Functions
export function getAllEvents(): Event[] {
  if (typeof window === 'undefined') {
    return sampleEvents
  }

  try {
    const storedEvents = localStorage.getItem('scoopEvents')
    if (storedEvents) {
      const events = JSON.parse(storedEvents)
      // Sort by date (newest first)
      return events.sort((a: Event, b: Event) => 
        new Date(b.date).getTime() - new Date(a.date).getTime()
      )
    }
  } catch (error) {
    console.error('Error parsing stored events:', error)
  }
  
  // Initialize with sample data and sort by date
  const sortedEvents = [...sampleEvents].sort((a, b) => 
    new Date(b.date).getTime() - new Date(a.date).getTime()
  )
  saveAllEvents(sortedEvents)
  return sortedEvents
}

export function saveAllEvents(events: Event[]): void {
  if (typeof window === 'undefined') return
  
  try {
    localStorage.setItem('scoopEvents', JSON.stringify(events))
  } catch (error) {
    console.error('Error saving events:', error)
  }
}

export function createNewEvent(eventData: {
  title: string
  category: string
  description: string
  date: string
  startTime: string
  endTime: string
  venueName: string
  address: string
  eventType: 'public' | 'private' | 'friends'
  trustRequirement: number
  maxAttendees: number
  invitedFriends: string[]
}): Event {
  const currentUser = getCurrentUser()
  const newEvent: Event = {
    id: Date.now().toString(),
    title: eventData.title,
    description: eventData.description,
    hostId: currentUser.id,
    date: eventData.date,
    time: eventData.startTime,
    location: eventData.venueName,
    address: eventData.address,
    coordinates: [-74.006, 40.7128], // Default coordinates
    attendeeCount: 1, // Host is automatically attending
    maxAttendees: eventData.maxAttendees,
    trustRequirement: eventData.trustRequirement,
    isPrivate: eventData.eventType === 'private',
    category: eventData.category,
    price: 0, // Default free
    imageUrl: 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=600', // Default event image
    tags: [],
    isPast: false
  }
  
  // Add to existing events
  const allEvents = getAllEvents()
  allEvents.unshift(newEvent) // Add to beginning (newest first)
  saveAllEvents(allEvents)
  
  // Update user metrics - creating an event gives trust score boost
  updateTrustScore(currentUser.id, 'event_created')
  recordUserActivity(currentUser.id, 'event_created', {
    eventId: newEvent.id,
    eventTitle: newEvent.title,
    category: newEvent.category
  })
  
  return newEvent
}

// Event Attendance Functions
export function attendEvent(eventId: string, userId?: string): boolean {
  if (typeof window === 'undefined') return false
  
  try {
    const currentUser = getCurrentUser()
    const attendeeId = userId || currentUser.id
    
    // Update event attendance count
    const allEvents = getAllEvents()
    const eventIndex = allEvents.findIndex(event => event.id === eventId)
    
    if (eventIndex !== -1) {
      allEvents[eventIndex].attendeeCount += 1
      allEvents[eventIndex].rsvpStatus = 'going'
      saveAllEvents(allEvents)
      
      // Update user metrics
      incrementUserEvents(attendeeId)
      recordUserActivity(attendeeId, 'event_attended', {
        eventId,
        eventTitle: allEvents[eventIndex].title
      })
      
      return true
    }
    
    return false
  } catch (error) {
    console.error('Error attending event:', error)
    return false
  }
}

// Friend Management Functions
export function addFriend(friendId: string): boolean {
  if (typeof window === 'undefined') return false
  
  try {
    const currentUser = getCurrentUser()
    
    // Prevent adding self as friend
    if (currentUser.id === friendId) return false
    
    // Update both users' friend counts
    incrementUserFriends(currentUser.id)
    incrementUserFriends(friendId)
    
    // Record activities
    recordUserActivity(currentUser.id, 'friend_added', { friendId })
    recordUserActivity(friendId, 'friend_added', { friendId: currentUser.id })
    
    return true
  } catch (error) {
    console.error('Error adding friend:', error)
    return false
  }
}

// Voting Functions
export function voteOnReview(reviewId: string, voteType: 'up' | 'down'): boolean {
  if (typeof window === 'undefined') return false
  
  try {
    const allReviews = getAllReviews()
    const reviewIndex = allReviews.findIndex(review => review.id === reviewId)
    
    if (reviewIndex !== -1) {
      const review = allReviews[reviewIndex]
      
      // Update vote counts
      if (voteType === 'up') {
        allReviews[reviewIndex].upvotes += 1
        // Give trust score boost to review author
        updateTrustScore(review.reviewerId, 'upvote_received')
      } else {
        allReviews[reviewIndex].downvotes += 1
        // Slight trust score penalty to review author
        updateTrustScore(review.reviewerId, 'downvote_received')
      }
      
      allReviews[reviewIndex].hasVoted = true
      allReviews[reviewIndex].voteType = voteType
      saveAllReviews(allReviews)
      
      // Record activity
      const currentUser = getCurrentUser()
      recordUserActivity(currentUser.id, `vote_${voteType}`, {
        reviewId,
        reviewAuthor: review.reviewerId
      })
      
      return true
    }
    
    return false
  } catch (error) {
    console.error('Error voting on review:', error)
    return false
  }
}

// Profile Enhancement Functions
export function completeProfile(userId?: string): void {
  const currentUser = getCurrentUser()
  const targetUserId = userId || currentUser.id
  
  updateTrustScore(targetUserId, 'profile_completed')
  recordUserActivity(targetUserId, 'profile_completed')
}

export function verifyPhone(userId?: string): void {
  const currentUser = getCurrentUser()
  const targetUserId = userId || currentUser.id
  
  updateTrustScore(targetUserId, 'phone_verified')
  recordUserActivity(targetUserId, 'phone_verified')
}

export function connectSocialAccount(platform: string, userId?: string): void {
  const currentUser = getCurrentUser()
  const targetUserId = userId || currentUser.id
  
  updateTrustScore(targetUserId, 'social_connected')
  recordUserActivity(targetUserId, 'social_connected', { platform })
}

// Sample Users
export const sampleUsers: User[] = [
  {
    id: '1',
    name: 'Sarah Chen',
    username: 'sarahc_designs',
    email: 'sarah@example.com',
    avatar: '/scoop-logo.png',
    bio: 'UX Designer passionate about creating meaningful experiences. Coffee enthusiast ☕',
    trustScore: 92,
    trustLevel: 'excellent',
    joinDate: '2023-01-15',
    location: 'San Francisco, CA',
    accountType: 'pro',
    socialAccounts: [
      { platform: 'LinkedIn', handle: 'sarah-chen-design', verified: true, icon: '💼' },
      { platform: 'Instagram', handle: '@sarahdesigns', verified: false, icon: '📸' },
      { platform: 'Twitter', handle: '@sarahc_ux', verified: true, icon: '🐦' },
    ],
    friendsCount: 3,
    reviewsCount: 2,
    eventsAttended: 3,
    isVerified: true,
  },
  {
    id: '2',
    name: 'Marcus Johnson',
    username: 'marcus_fit',
    email: 'marcus@example.com',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400',
    bio: 'Personal trainer helping people achieve their fitness goals 💪 Marathon runner',
    trustScore: 88,
    trustLevel: 'excellent',
    joinDate: '2023-02-10',
    location: 'Austin, TX',
    accountType: 'free',
    socialAccounts: [
      { platform: 'Instagram', handle: '@marcusfitness', verified: true, icon: '📸' },
      { platform: 'YouTube', handle: 'MarcusTrains', verified: false, icon: '📺' },
    ],
    friendsCount: 156,
    reviewsCount: 2,
    eventsAttended: 2,
    isVerified: true,
  },
  {
    id: '3',
    name: 'Elena Rodriguez',
    username: 'elena_chef',
    email: 'elena@example.com',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400',
    bio: 'Head Chef at Verde Kitchen. Food is love made visible 🍽️',
    trustScore: 94,
    trustLevel: 'excellent',
    joinDate: '2022-11-20',
    location: 'New York, NY',
    accountType: 'venue',
    socialAccounts: [
      { platform: 'Instagram', handle: '@elenachef', verified: true, icon: '📸' },
      { platform: 'TikTok', handle: '@cookingwithelen', verified: true, icon: '🎵' },
      { platform: 'Facebook', handle: 'Elena Rodriguez Chef', verified: false, icon: '👥' },
    ],
    friendsCount: 312,
    reviewsCount: 2,
    eventsAttended: 4,
    isVerified: true,
  },
  {
    id: '4',
    name: 'Alex Thompson',
    username: 'alex_outdoors',
    email: 'alex@example.com',
    avatar: '/scoop-logo.png',
    bio: 'Adventure seeker and photographer. Always planning the next hike 🏔️',
    trustScore: 76,
    trustLevel: 'good',
    joinDate: '2023-03-05',
    location: 'Denver, CO',
    accountType: 'free',
    socialAccounts: [
      { platform: 'Instagram', handle: '@alexadventures', verified: false, icon: '📸' },
      { platform: 'YouTube', handle: 'AlexOutdoors', verified: false, icon: '📺' },
    ],
    friendsCount: 89,
    reviewsCount: 1,
    eventsAttended: 3,
    isVerified: false,
  },
  {
    id: '5',
    name: 'Maya Patel',
    username: 'maya_dev',
    email: 'maya@example.com',
    avatar: 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=400',
    bio: 'Full-stack developer building the future, one line of code at a time 👩‍💻',
    trustScore: 85,
    trustLevel: 'good',
    joinDate: '2023-01-28',
    location: 'Seattle, WA',
    accountType: 'pro',
    socialAccounts: [
      { platform: 'GitHub', handle: '@mayapatel', verified: true, icon: '💻' },
      { platform: 'LinkedIn', handle: 'maya-patel-dev', verified: true, icon: '💼' },
      { platform: 'Twitter', handle: '@maya_codes', verified: false, icon: '🐦' },
    ],
    friendsCount: 167,
    reviewsCount: 2,
    eventsAttended: 3,
    isVerified: true,
  }
]

// Sample Reviews - Remixed Timeline for Better Distribution
export const sampleReviews: Review[] = [
  {
    id: '1',
    reviewerId: '2',
    reviewedId: '1',
    category: 'Professional',
    rating: 5,
    content: "Sarah's design work is absolutely sweet! 🍦 She delivered a premium vanilla experience with strawberry-level attention to detail. Her creative process is smooth as gelato and the final product was a triple-scoop delight. Highly recommend this flavor artist!",
    timestamp: '2025-06-18T10:30:00Z',
    upvotes: 24,
    downvotes: 2,
    hasVoted: false,
    trustScore: 92,
    communityValidation: 94,
  },
  {
    id: '6',
    reviewerId: '1',
    reviewedId: '3',
    category: 'Professional',
    rating: 5,
    content: 'Elena\'s Sunday Brunch & Networking event was absolutely phenomenal! The venue was perfect, the food was incredible, and she created such a welcoming atmosphere. I made 3 new professional connections and the whole experience felt effortless. Elena is a natural at bringing people together.',
    timestamp: '2025-06-17T14:30:00Z',
    upvotes: 18,
    downvotes: 1,
    hasVoted: false,
    isEventReview: true,
    eventId: 'past-1',
    trustScore: 92,
    communityValidation: 94,
  },
  {
    id: '2',
    reviewerId: '3',
    reviewedId: '2',
    category: 'Fitness',
    rating: 5,
    content: "Marcus is the Rocky Road of personal trainers - tough but incredibly rewarding! 💪🍨 His training sessions are like getting the perfect scoop - challenging but never overwhelming. He helped me achieve my fitness goals with a mint-chip level of freshness in his approach.",
    timestamp: '2025-06-16T14:45:00Z',
    upvotes: 31,
    downvotes: 1,
    hasVoted: false,
    trustScore: 88,
    communityValidation: 96,
  },
  {
    id: '3',
    reviewerId: '1',
    reviewedId: '3',
    category: 'Culinary',
    rating: 5,
    content: "Elena's cooking class was a sundae of amazing flavors! 🍽️🍨 She taught us to layer ingredients like building the perfect ice cream sundae. Her passion for food is as rich as chocolate fudge, and her teaching style is as refreshing as sorbet on a hot day.",
    timestamp: '2025-06-15T18:20:00Z',
    upvotes: 18,
    downvotes: 0,
    hasVoted: false,
    trustScore: 94,
    communityValidation: 98,
  },
  {
    id: '7',
    reviewerId: '5',
    reviewedId: '4',
    category: 'Creative',
    rating: 4,
    content: 'Alex\'s Mountain Photography Workshop was an amazing experience! The location was breathtaking and he really knows his stuff about landscape photography. Only minor issue was we started a bit late due to weather, but Alex handled it well and we still got great shots. Would definitely attend another workshop by him.',
    timestamp: '2025-06-14T16:45:00Z',
    upvotes: 12,
    downvotes: 0,
    hasVoted: false,
    isEventReview: true,
    eventId: 'past-2',
    trustScore: 76,
    communityValidation: 87,
  },
  {
    id: '8',
    reviewerId: '2',
    reviewedId: '5',
    category: 'Professional',
    rating: 5,
    content: 'Maya\'s Tech Meetup was incredibly well organized! The AI presentations were cutting-edge and she facilitated great discussions between attendees. The networking portion was structured perfectly - not awkward at all. As someone new to the tech scene, I felt welcomed and learned a ton. Maya clearly put a lot of thought into every detail.',
    timestamp: '2025-06-13T20:15:00Z',
    upvotes: 25,
    downvotes: 0,
    hasVoted: false,
    isEventReview: true,
    eventId: 'past-3',
    trustScore: 85,
    communityValidation: 96,
  },
  {
    id: '4',
    reviewerId: '5',
    reviewedId: '4',
    category: 'Social',
    rating: 4,
    content: 'Alex organized an amazing hiking trip to Rocky Mountain National Park. Great photographer too - got some incredible shots of our group. Definitely joining his next adventure!',
    timestamp: '2025-06-12T16:45:00Z',
    upvotes: 12,
    downvotes: 2,
    hasVoted: false,
    trustScore: 76,
    communityValidation: 78,
  },
  {
    id: '9',
    reviewerId: '4',
    reviewedId: '1',
    category: 'Creative',
    rating: 5,
    content: 'Sarah\'s Wine Tasting & Design Talk was absolutely brilliant! The way she paired different design principles with wine characteristics was so creative and insightful. I learned more about design trends in one evening than I have in months. The venue was perfect, the wine selection was excellent, and Sarah\'s presentation style was engaging and professional. This was exactly the kind of sophisticated networking event I was hoping for.',
    timestamp: '2025-06-11T19:45:00Z',
    upvotes: 15,
    downvotes: 0,
    hasVoted: false,
    isEventReview: true,
    eventId: 'past-5',
    trustScore: 76,
    communityValidation: 91,
  },
  {
    id: '5',
    reviewerId: '3',
    reviewedId: '5',
    category: 'Professional',
    rating: 5,
    content: 'Maya built our restaurant\'s online ordering system and it\'s been flawless. She\'s responsive, professional, and delivered exactly what we needed on time and under budget.',
    timestamp: '2025-06-10T11:30:00Z',
    upvotes: 22,
    downvotes: 0,
    hasVoted: false,
    trustScore: 85,
    communityValidation: 89,
  }
]

// Sample Events
export const sampleEvents: Event[] = [
  // Past Events (that current user attended and can review)
  {
    id: 'past-1',
    title: 'Sunday Brunch & Networking',
    description: 'Join us for a relaxed brunch and networking session with local professionals. Great food, great company, and meaningful connections.',
    hostId: '3',
    date: '2025-06-15',
    time: '11:00 AM',
    location: 'Verde Kitchen',
    address: '123 Main St, New York, NY 10001',
    coordinates: [-74.006, 40.7128],
    attendeeCount: 28,
    maxAttendees: 30,
    trustRequirement: 75,
    isPrivate: false,
    category: 'Networking',
    price: 25,
    imageUrl: 'https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=600',
    tags: ['brunch', 'networking', 'professionals'],
    userAttended: true,
    isPast: true,
  },
  {
    id: 'past-2',
    title: 'Mountain Photography Workshop',
    description: 'Learn landscape photography techniques in the beautiful Rocky Mountains. All skill levels welcome. Equipment provided.',
    hostId: '4',
    date: '2025-06-10',
    time: '6:00 AM',
    location: 'Rocky Mountain National Park',
    address: 'Estes Park, CO 80517',
    coordinates: [-105.6836, 40.3428],
    attendeeCount: 12,
    maxAttendees: 12,
    trustRequirement: 60,
    isPrivate: false,
    category: 'Workshop',
    price: 75,
    imageUrl: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600',
    tags: ['photography', 'outdoors', 'workshop'],
    userAttended: true,
    isPast: true,
  },
  {
    id: 'past-3',
    title: 'Tech Meetup: AI & Machine Learning',
    description: 'Monthly tech meetup discussing the latest in AI and ML. Presentations, demos, and networking with fellow developers.',
    hostId: '5',
    date: '2025-06-08',
    time: '7:00 PM',
    location: 'Seattle Tech Hub',
    address: '456 Tech Ave, Seattle, WA 98101',
    coordinates: [-122.3321, 47.6062],
    attendeeCount: 52,
    maxAttendees: 60,
    trustRequirement: 70,
    isPrivate: false,
    category: 'Technology',
    price: 0,
    imageUrl: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=600',
    tags: ['tech', 'AI', 'networking', 'developers'],
    userAttended: true,
    isPast: true,
  },
  {
    id: 'past-4',
    title: 'Morning Fitness Bootcamp',
    description: 'High-energy outdoor workout session in the park. All fitness levels welcome. Bring water and a positive attitude!',
    hostId: '2',
    date: '2025-06-05',
    time: '7:00 AM',
    location: 'Zilker Park',
    address: 'Austin, TX 78746',
    coordinates: [-97.7731, 30.2672],
    attendeeCount: 18,
    maxAttendees: 20,
    trustRequirement: 65,
    isPrivate: false,
    category: 'Fitness',
    price: 15,
    imageUrl: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=600',
    tags: ['fitness', 'outdoors', 'morning'],
    userAttended: false,
    isPast: true,
  },
  {
    id: 'past-5',
    title: 'Wine Tasting & Design Talk',
    description: 'An evening of fine wines paired with insights into modern design trends. Perfect blend of sophistication and creativity.',
    hostId: '1',
    date: '2025-06-01',
    time: '6:30 PM',
    location: 'The Design Studio',
    address: '789 Design Blvd, San Francisco, CA 94102',
    coordinates: [-122.4194, 37.7749],
    attendeeCount: 22,
    maxAttendees: 25,
    trustRequirement: 80,
    isPrivate: true,
    category: 'Social',
    price: 45,
    imageUrl: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=600',
    tags: ['wine', 'design', 'networking'],
    userAttended: false,
    isPast: true,
  },
  // Upcoming Events
  {
    id: '1',
    title: 'Sunday Brunch & Networking',
    description: 'Join us for a relaxed brunch and networking session with local professionals. Great food, great company, and meaningful connections.',
    hostId: '3',
    date: '2025-06-21',
    time: '11:00 AM',
    location: 'Verde Kitchen',
    address: '123 Main St, New York, NY 10001',
    coordinates: [-74.006, 40.7128],
    attendeeCount: 24,
    maxAttendees: 30,
    trustRequirement: 75,
    isPrivate: false,
    category: 'Networking',
    price: 25,
    imageUrl: 'https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=600',
    tags: ['brunch', 'networking', 'professionals'],
    rsvpStatus: 'interested',
    isPast: false,
  },
  {
    id: '2',
    title: 'Mountain Photography Workshop',
    description: 'Learn landscape photography techniques in the beautiful Rocky Mountains. All skill levels welcome. Equipment provided.',
    hostId: '4',
    date: '2025-06-28',
    time: '6:00 AM',
    location: 'Rocky Mountain National Park',
    address: 'Estes Park, CO 80517',
    coordinates: [-105.6836, 40.3428],
    attendeeCount: 8,
    maxAttendees: 12,
    trustRequirement: 60,
    isPrivate: false,
    category: 'Workshop',
    price: 75,
    imageUrl: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600',
    tags: ['photography', 'outdoors', 'workshop'],
    isPast: false,
  },
  {
    id: '3',
    title: 'Tech Meetup: AI & Machine Learning',
    description: 'Monthly tech meetup discussing the latest in AI and ML. Presentations, demos, and networking with fellow developers.',
    hostId: '5',
    date: '2025-06-25',
    time: '7:00 PM',
    location: 'Seattle Tech Hub',
    address: '456 Tech Ave, Seattle, WA 98101',
    coordinates: [-122.3321, 47.6062],
    attendeeCount: 45,
    maxAttendees: 60,
    trustRequirement: 70,
    isPrivate: false,
    category: 'Technology',
    price: 0,
    imageUrl: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=600',
    tags: ['tech', 'AI', 'networking', 'developers'],
    rsvpStatus: 'going',
    isPast: false,
  },
  {
    id: '4',
    title: 'Morning Fitness Bootcamp',
    description: 'High-energy outdoor workout session in the park. All fitness levels welcome. Bring water and a positive attitude!',
    hostId: '2',
    date: '2025-06-23',
    time: '7:00 AM',
    location: 'Zilker Park',
    address: 'Austin, TX 78746',
    coordinates: [-97.7731, 30.2672],
    attendeeCount: 16,
    maxAttendees: 20,
    trustRequirement: 65,
    isPrivate: false,
    category: 'Fitness',
    price: 15,
    imageUrl: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=600',
    tags: ['fitness', 'outdoors', 'morning'],
    isPast: false,
  },
  {
    id: '5',
    title: 'Wine Tasting & Design Talk',
    description: 'An evening of fine wines paired with insights into modern design trends. Perfect blend of sophistication and creativity.',
    hostId: '1',
    date: '2025-06-30',
    time: '6:30 PM',
    location: 'The Design Studio',
    address: '789 Design Blvd, San Francisco, CA 94102',
    coordinates: [-122.4194, 37.7749],
    attendeeCount: 18,
    maxAttendees: 25,
    trustRequirement: 80,
    isPrivate: true,
    category: 'Social',
    price: 45,
    imageUrl: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=600',
    tags: ['wine', 'design', 'networking'],
    isPast: false,
  },
  {
    id: '6',
    title: 'Sweet Summer Networking Mixer 🍦',
    description: 'Beat the heat with cool connections and even cooler treats! Join us for a professional networking event with appetizers, drinks, artisanal ice cream, and great conversation. Perfect for mid-year career planning and meeting like-minded professionals.',
    hostId: '1',
    date: '2025-07-05',
    time: '6:00 PM',
    location: 'The Rooftop Lounge',
    address: '555 Business District, San Francisco, CA 94105',
    coordinates: [-122.4194, 37.7849],
    attendeeCount: 0,
    maxAttendees: 40,
    trustRequirement: 75,
    isPrivate: false,
    category: 'Networking',
    price: 35,
    imageUrl: 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=600',
    tags: ['networking', 'summer', 'professionals', 'mixer', 'ice-cream'],
    isPast: false,
  },
  {
    id: '7',
    title: 'Summer Hiking Adventure',
    description: 'Experience the beauty of summer landscapes on this guided hiking adventure. We\'ll explore scenic mountain trails and enjoy refreshments by a stream. All experience levels welcome!',
    hostId: '4',
    date: '2025-07-12',
    time: '8:00 AM',
    location: 'Mount Evans Wilderness',
    address: 'Idaho Springs, CO 80452',
    coordinates: [-105.6447, 39.5881],
    attendeeCount: 3,
    maxAttendees: 15,
    trustRequirement: 60,
    isPrivate: false,
    category: 'Outdoors',
    price: 45,
    imageUrl: 'https://images.unsplash.com/photo-1551524164-6cf6ac833fb4?w=600',
    tags: ['hiking', 'summer', 'outdoors', 'adventure'],
    isPast: false,
  },
  {
    id: '8',
    title: 'Sweet & Savory Cooking Workshop 🍨',
    description: 'Learn to prepare delicious meals AND create amazing desserts! Chef Elena will teach you knife skills, flavor combinations, and how to make homemade ice cream. Take home recipes for both savory dishes and sweet treats.',
    hostId: '3',
    date: '2025-07-18',
    time: '2:00 PM',
    location: 'Verde Kitchen Studio',
    address: '123 Main St, New York, NY 10001',
    coordinates: [-74.006, 40.7128],
    attendeeCount: 8,
    maxAttendees: 16,
    trustRequirement: 70,
    isPrivate: false,
    category: 'Workshop',
    price: 85,
    imageUrl: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=600',
    tags: ['cooking', 'desserts', 'workshop', 'ice-cream'],
    isPast: false,
  },
  {
    id: '9',
    title: 'Strength Training Bootcamp',
    description: 'Build strength and confidence in this high-energy bootcamp! Marcus will guide you through functional movements, proper form, and progressive challenges. All fitness levels encouraged.',
    hostId: '2',
    date: '2025-07-25',
    time: '7:30 AM',
    location: 'Austin Fitness Park',
    address: 'Zilker Park, Austin, TX 78746',
    coordinates: [-97.7731, 30.2672],
    attendeeCount: 12,
    maxAttendees: 25,
    trustRequirement: 65,
    isPrivate: false,
    category: 'Fitness',
    price: 25,
    imageUrl: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=600',
    tags: ['fitness', 'strength', 'bootcamp', 'morning'],
    isPast: false,
  }
]

// Sample Comments
export const sampleComments: Comment[] = [
  {
    id: '1',
    postId: '1',
    userId: '3',
    content: 'Absolutely agree! Sarah\'s work ethic and creativity are unmatched.',
    timestamp: '2025-06-15T11:15:00Z',
    upvotes: 8,
    downvotes: 0,
    replies: [
      {
        id: '1-1',
        postId: '1',
        userId: '4',
        content: 'She helped with our hiking group\'s website too. Amazing work!',
        timestamp: '2025-06-15T12:30:00Z',
        upvotes: 3,
        downvotes: 0,
        replies: [],
        parentId: '1',
      }
    ],
  },
  {
    id: '2',
    postId: '2',
    userId: '2',
    content: 'Elena is not just an amazing chef but also such a kind person to work with!',
    timestamp: '2025-06-10T15:45:00Z',
    upvotes: 12,
    downvotes: 0,
    replies: [],
  }
]

// Review Categories
export const reviewCategories = [
      'Professional',
  'Social Scoop',
  'Roommate Ripple',
  'Service Sundae',
  'Financial Float',
  'Healthcare Swirl',
  'Education Cone',
  'Volunteer Vanilla',
  'Neighbor Neapolitan',
  'Online Transaction',
  'Event Organizer',
  'Sweet Other'
]

// Event Categories
export const eventCategories = [
  'Networking',
  'Ice Cream Social',
  'Professional',
  'Fitness Scoop',
  'Technology',
  'Arts & Culture',
  'Food & Flavor',
  'Outdoors',
  'Sweet Workshop',
  'Sports',
  'Community Cone',
  'Other'
]

// Trust Score Thresholds
export const trustScoreThresholds = {
  excellent: 85,
  good: 70,
  fair: 50,
  poor: 30,
  new: 0
}

// Get trust level from score
export function getTrustLevel(score: number): 'excellent' | 'good' | 'fair' | 'poor' | 'new' {
  if (score >= trustScoreThresholds.excellent) return 'excellent'
  if (score >= trustScoreThresholds.good) return 'good'
  if (score >= trustScoreThresholds.fair) return 'fair'
  if (score >= trustScoreThresholds.poor) return 'poor'
  return 'new'
}

// Social Platform Icons
export const socialPlatforms = {
  'Facebook': '👥',
  'Instagram': '📸',
  'Twitter': '🐦',
  'LinkedIn': '💼',
  'TikTok': '🎵',
  'YouTube': '📺',
  'Snapchat': '👻',
  'Discord': '🎮',
  'Reddit': '🤖',
  'Twitch': '🎬',
  'Pinterest': '📌',
  'GitHub': '💻',
} 