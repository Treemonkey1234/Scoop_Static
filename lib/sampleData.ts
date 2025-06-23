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
  content: string
  category: string
  timestamp: string
  votes: number
  isEventReview: boolean
  eventId?: string
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
  category: string
  imageUrl: string
  maxAttendees: number
  attendeeCount: number
  price: number
  isPrivate: boolean
  isPast: boolean
  trustRequirement: number
  tags: string[]
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

export function createNewReview(reviewData: any) {
  const currentUser = getCurrentUser()
  if (!currentUser) return null

  const newReview: Review = {
    id: Math.random().toString(36).substr(2, 9),
    reviewerId: currentUser.id,
    reviewedId: reviewData.reviewedId,
    content: reviewData.content,
    category: reviewData.category,
    timestamp: new Date().toISOString(),
    votes: 0,
    isEventReview: false
  }

  // Add review to storage
  const allReviews = getAllReviews()
  allReviews.push(newReview)
  saveAllReviews(allReviews)

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
    category: eventData.category,
    imageUrl: 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=600', // Default event image
    maxAttendees: eventData.maxAttendees,
    attendeeCount: 1, // Host is automatically attending
    price: 0, // Default free
    isPrivate: eventData.eventType === 'private',
    isPast: false,
    trustRequirement: eventData.trustRequirement,
    tags: []
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
      allEvents[eventIndex].isPast = false
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
      
      // Check if user has already voted
      if (review.votes > 0) {
        // If trying to vote the same way again, remove the vote
        if (review.votes === 1 && voteType === 'up') {
          allReviews[reviewIndex].votes -= 1
          // Remove trust score boost from review author
          updateTrustScore(review.reviewerId, 'upvote_removed')
        } else if (review.votes === -1 && voteType === 'down') {
          allReviews[reviewIndex].votes += 1
          // Remove trust score penalty from review author
          updateTrustScore(review.reviewerId, 'downvote_removed')
        }
        allReviews[reviewIndex].votes = 0
      }
      
      // Update vote counts for new vote
      if (voteType === 'up') {
        allReviews[reviewIndex].votes += 1
        // Give trust score boost to review author
        updateTrustScore(review.reviewerId, 'upvote_received')
      } else {
        allReviews[reviewIndex].votes -= 1
        // Slight trust score penalty to review author
        updateTrustScore(review.reviewerId, 'downvote_received')
      }
      
      allReviews[reviewIndex].votes = Math.max(-1, Math.min(1, allReviews[reviewIndex].votes))
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
    name: 'Jake Martinez',
    username: 'jakes_loft',
    email: 'jake@jakesloft.com',
    avatar: '/scoop-logo.png',
    bio: '🏢 Owner of Jake\'s Loft Bar & Grill. Creating the best venue for Phoenix\'s community! 🎵 Live Music • 🍳 Sunday Brunch • 🍻 Happy Hour',
    trustScore: 94,
    trustLevel: 'excellent',
    joinDate: '2023-01-15',
    location: 'Phoenix, AZ',
    accountType: 'venue',
    socialAccounts: [
      { platform: 'Instagram', handle: '@jakesloftphx', verified: true, icon: '📸' },
      { platform: 'Facebook', handle: 'Jake\'s Loft Bar & Grill', verified: true, icon: '👥' },
      { platform: 'Yelp', handle: 'Jake\'s Loft Phoenix', verified: true, icon: '⭐' },
    ],
    friendsCount: 450,
    reviewsCount: 89,
    eventsAttended: 120,
    isVerified: true,
  },
  {
    id: '2',
    name: 'Sarah Chen',
    username: 'sarahc_designs',
    email: 'sarah@designimpact.co',
    avatar: '/scoop-logo.png',
    bio: 'UX Designer & Community Builder 🎨 | Hosting tech events @WeWork | Creating meaningful experiences through design ✨',
    trustScore: 92,
    trustLevel: 'excellent',
    joinDate: '2023-02-10',
    location: 'Phoenix, AZ',
    accountType: 'pro',
    socialAccounts: [
      { platform: 'LinkedIn', handle: 'sarah-chen-design', verified: true, icon: '💼' },
      { platform: 'Instagram', handle: '@sarahc.designs', verified: true, icon: '📸' },
      { platform: 'Dribbble', handle: 'sarahchen', verified: true, icon: '🎨' },
    ],
    friendsCount: 320,
    reviewsCount: 45,
    eventsAttended: 78,
    isVerified: true,
  },
  {
    id: '3',
    name: 'Emily Rodriguez',
    username: 'emily_asu',
    email: 'emily.r@asu.edu',
    avatar: '/scoop-logo.png',
    bio: '🎓 ASU Student Government | Creating safer campus connections | Organizing student events & mixers 📚',
    trustScore: 88,
    trustLevel: 'excellent',
    joinDate: '2023-03-15',
    location: 'Tempe, AZ',
    accountType: 'pro',
    socialAccounts: [
      { platform: 'LinkedIn', handle: 'emily-rodriguez-asu', verified: true, icon: '💼' },
      { platform: 'Instagram', handle: '@emilyasu', verified: true, icon: '📸' },
      { platform: 'Twitter', handle: '@emily_asu', verified: true, icon: '🐦' },
    ],
    friendsCount: 250,
    reviewsCount: 28,
    eventsAttended: 45,
    isVerified: true,
  },
  {
    id: '4',
    name: 'David Kim',
    username: 'david_trustguard',
    email: 'david.kim@trustguard.com',
    avatar: '/scoop-logo.png',
    bio: '🛡️ TrustGuard Insurance | Helping high-trust users save on insurance | Building safer communities through trust verification',
    trustScore: 95,
    trustLevel: 'excellent',
    joinDate: '2023-01-28',
    location: 'Phoenix, AZ',
    accountType: 'pro',
    socialAccounts: [
      { platform: 'LinkedIn', handle: 'david-kim-insurance', verified: true, icon: '💼' },
      { platform: 'Twitter', handle: '@davidkim_trust', verified: true, icon: '🐦' },
      { platform: 'Facebook', handle: 'David Kim - TrustGuard', verified: true, icon: '👥' },
    ],
    friendsCount: 280,
    reviewsCount: 42,
    eventsAttended: 56,
    isVerified: true,
  },
  {
    id: '5',
    name: 'Lisa Thompson',
    username: 'lisa_events',
    email: 'lisa@connectevents.co',
    avatar: '/scoop-logo.png',
    bio: '💝 Professional Event Planner | Specializing in social mixers & dating events | Creating meaningful connections in Phoenix',
    trustScore: 91,
    trustLevel: 'excellent',
    joinDate: '2023-02-15',
    location: 'Phoenix, AZ',
    accountType: 'pro',
    socialAccounts: [
      { platform: 'Instagram', handle: '@lisaeventsphx', verified: true, icon: '📸' },
      { platform: 'LinkedIn', handle: 'lisa-thompson-events', verified: true, icon: '💼' },
      { platform: 'Tinder', handle: 'Verified Event Host', verified: true, icon: '💕' },
    ],
    friendsCount: 380,
    reviewsCount: 65,
    eventsAttended: 92,
    isVerified: true,
  }
]

// Sample Reviews - Remixed Timeline for Better Distribution
export const sampleReviews: Review[] = [
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
  {
    id: '4',
    reviewerId: '1', // Jake Martinez
    reviewedId: '3', // Emily Rodriguez
    content: 'Emily did an amazing job catering for our tech meetup. The food was delicious and presentation was perfect.',
    category: 'Services',
    timestamp: '2024-03-07T20:00:00Z',
    votes: 39,
    isEventReview: true,
    eventId: 'event1'
  },
  {
    id: '5',
    reviewerId: '4', // David Kim
    reviewedId: '5', // Lisa Thompson
    content: 'Lisa is a skilled graphic designer. She created a beautiful logo for my business.',
    category: 'Professional',
    timestamp: '2024-03-06T14:20:00Z',
    votes: 35,
    isEventReview: false
  },
  {
    id: '6',
    reviewerId: '2', // Sarah Chen
    reviewedId: '1', // Jake Martinez
    content: 'The Phoenix Tech Summit was incredibly well-organized! Great speakers, perfect venue setup, and amazing networking opportunities.',
    category: 'Professional',
    timestamp: '2024-03-05T16:45:00Z',
    votes: 52,
    isEventReview: true,
    eventId: 'event2'
  },
  {
    id: '7',
    reviewerId: '3', // Emily Rodriguez
    reviewedId: '1', // Jake Martinez
    content: 'The Community Art Fair was a blast! So many talented local artists and great atmosphere. Looking forward to the next one!',
    category: 'Social',
    timestamp: '2024-03-04T19:30:00Z',
    votes: 43,
    isEventReview: true,
    eventId: 'event3'
  },
  {
    id: '8',
    reviewerId: '5', // Lisa Thompson
    reviewedId: '1', // Jake Martinez
    content: 'The Startup Networking Night exceeded expectations. Met some amazing entrepreneurs and potential investors.',
    category: 'Professional',
    timestamp: '2024-03-03T21:15:00Z',
    votes: 47,
    isEventReview: true,
    eventId: 'event4'
  }
]

// Sample Past Events (for reviews)
export const pastEvents = [
  {
    id: 'past-1',
    title: 'ASU Student-Business Mixer',
    description: 'Connecting ASU students with local business owners for internships and mentorship opportunities.',
    hostId: '3', // Emily Rodriguez
    date: '2025-06-10',
    time: '6:00 PM',
    location: 'ASU Downtown Campus',
    address: '411 N Central Ave, Phoenix, AZ 85004',
    coordinates: [-112.0740, 33.4484],
    attendeeCount: 75,
    maxAttendees: 100,
    trustRequirement: 70,
    isPrivate: false,
    category: 'Networking',
    price: 0,
    imageUrl: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=600',
    tags: ['students', 'networking', 'business', 'education'],
    isPast: true,
    reviews: ['6']
  },
  {
    id: 'past-4',
    title: 'Summer Singles Mixer',
    description: 'A sophisticated evening of meeting new people, enjoying craft cocktails, and engaging activities.',
    hostId: '5', // Lisa Thompson
    date: '2025-06-08',
    time: '7:00 PM',
    location: 'Jake\'s Loft Bar & Grill',
    address: '250 E Downtown Blvd, Phoenix, AZ 85004',
    coordinates: [-112.0740, 33.4484],
    attendeeCount: 45,
    maxAttendees: 50,
    trustRequirement: 85,
    isPrivate: false,
    category: 'Social',
    price: 30,
    imageUrl: 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=600',
    tags: ['singles', 'social', 'dating', 'mixer'],
    isPast: true,
    reviews: ['3']
  },
  {
    id: 'past-5',
    title: 'Singles Mixer at Jake\'s',
    description: 'An evening of meeting new people in the heart of downtown Phoenix.',
    hostId: '5', // Lisa Thompson
    date: '2025-06-05',
    time: '7:00 PM',
    location: 'Jake\'s Loft Bar & Grill',
    address: '250 E Downtown Blvd, Phoenix, AZ 85004',
    coordinates: [-112.0740, 33.4484],
    attendeeCount: 48,
    maxAttendees: 50,
    trustRequirement: 85,
    isPrivate: false,
    category: 'Social',
    price: 30,
    imageUrl: 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=600',
    tags: ['singles', 'social', 'dating', 'mixer'],
    isPast: true,
    reviews: ['7']
  }
]

// Sample Events
export const sampleEvents: Event[] = [
  {
    id: 'event1',
    title: 'Phoenix Tech Meetup',
    description: 'Monthly gathering of tech enthusiasts in Phoenix. This month featuring talks on AI and Machine Learning.',
    hostId: '1', // Jake Martinez
    date: '2024-03-15',
    time: '18:30',
    location: 'The Hub Phoenix',
    address: '123 Tech Ave, Phoenix, AZ',
    category: 'Technology',
    imageUrl: '/images/events/tech-meetup.jpg',
    maxAttendees: 60,
    attendeeCount: 45,
    price: 0,
    isPrivate: false,
    isPast: false,
    trustRequirement: 50,
    tags: ['tech', 'networking', 'ai', 'machine-learning']
  },
  {
    id: 'event2',
    title: 'Phoenix Tech Summit',
    description: 'Annual technology conference featuring industry leaders, workshops, and networking opportunities.',
    hostId: '1', // Jake Martinez
    date: '2024-02-20',
    time: '09:00',
    location: 'Phoenix Convention Center',
    address: '100 N 3rd St, Phoenix, AZ',
    category: 'Conference',
    imageUrl: '/images/events/tech-summit.jpg',
    maxAttendees: 500,
    attendeeCount: 478,
    price: 199,
    isPrivate: false,
    isPast: true,
    trustRequirement: 70,
    tags: ['conference', 'tech', 'professional', 'networking']
  },
  {
    id: 'event3',
    title: 'Community Art Fair',
    description: 'Showcase of local artists featuring paintings, sculptures, and interactive installations.',
    hostId: '1', // Jake Martinez
    date: '2024-02-15',
    time: '11:00',
    location: 'The Hub Phoenix',
    address: '123 Tech Ave, Phoenix, AZ',
    category: 'Art & Culture',
    imageUrl: '/images/events/art-fair.jpg',
    maxAttendees: 200,
    attendeeCount: 185,
    price: 10,
    isPrivate: false,
    isPast: true,
    trustRequirement: 0,
    tags: ['art', 'community', 'culture', 'local']
  },
  {
    id: 'event4',
    title: 'Startup Networking Night',
    description: 'Connect with fellow entrepreneurs, investors, and startup enthusiasts.',
    hostId: '1', // Jake Martinez
    date: '2024-02-10',
    time: '19:00',
    location: 'The Hub Phoenix',
    address: '123 Tech Ave, Phoenix, AZ',
    category: 'Networking',
    imageUrl: '/images/events/startup-night.jpg',
    maxAttendees: 100,
    attendeeCount: 98,
    price: 25,
    isPrivate: false,
    isPast: true,
    trustRequirement: 60,
    tags: ['startup', 'networking', 'business', 'entrepreneurship']
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