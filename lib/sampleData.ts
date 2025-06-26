// Sample data for ScoopSocials

export interface User {
  id: string
  name: string
  email: string
  avatar: string
  bio?: string
  location?: string
  joinDate: string
  trustScore: number
  isVerified: boolean
  friendsCount: number
  reviewsCount: number
  eventsAttended: number
  eventsHosted: number
  badges: string[]
  interests: string[]
  socialLinks: {
    instagram: string
    twitter: string
    linkedin?: string
    facebook?: string
    youtube?: string
    tiktok?: string
    snapchat?: string
    discord?: string
    reddit?: string
    whatsapp?: string
    telegram?: string
    pinterest?: string
    twitch?: string
    steam?: string
    signal?: string
    clubhouse?: string
    bereal?: string
    github?: string
  }
  phoneVerified: boolean
  emailVerified: boolean
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
  attendees?: string[]
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
    return {
      id: '0',
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
      eventsAttended: 15,
      eventsHosted: 2,
      badges: ['Early Adopter', 'Beta Tester'],
      interests: ['Technology', 'Networking', 'Testing'],
      socialLinks: {
        instagram: '@testuser',
        twitter: '@testuser'
      },
      phoneVerified: true,
      emailVerified: true
    }
  }

  try {
    const userData = localStorage.getItem('currentUser')
    if (userData) {
      const user = JSON.parse(userData)
      // Ensure all required properties exist with defaults
      return {
        ...user,
        eventsHosted: user.eventsHosted || 0,
        badges: user.badges || [],
        interests: user.interests || [],
        socialLinks: user.socialLinks || { instagram: '', twitter: '' },
        phoneVerified: user.phoneVerified || false,
        emailVerified: user.emailVerified || false
      }
    }
  } catch (error) {
    console.error('Error parsing user data:', error)
  }

  // Return Test User as default
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
    email: userData.email,
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
    bio: 'New to ScoopSocials! Looking forward to connecting with the community.',
    trustScore: 50, // Starting trust score for new users
    joinDate: new Date().toISOString().split('T')[0],
    location: 'Location not set',
    friendsCount: 0,
    reviewsCount: 0,
    eventsAttended: 0,
    isVerified: false,
    eventsHosted: 0,
    badges: [],
    interests: [],
    socialLinks: {
      instagram: '',
      twitter: ''
    },
    phoneVerified: false,
    emailVerified: false
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
      saveCurrentUser(updatedUser)
    }
    
    // Update in sample users if exists
    const userIndex = sampleUsers.findIndex(user => user.id === userId)
    if (userIndex !== -1) {
      sampleUsers[userIndex].reviewsCount += 1
      sampleUsers[userIndex].trustScore = calculateNewTrustScore(sampleUsers[userIndex].trustScore, 'review_created')
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
      saveCurrentUser(updatedUser)
    }
    
    // Update in sample users if exists
    const userIndex = sampleUsers.findIndex(user => user.id === userId)
    if (userIndex !== -1) {
      sampleUsers[userIndex].eventsAttended += 1
      sampleUsers[userIndex].trustScore = calculateNewTrustScore(sampleUsers[userIndex].trustScore, 'event_attended')
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
      saveCurrentUser(updatedUser)
    }
    
    // Update in sample users if exists
    const userIndex = sampleUsers.findIndex(user => user.id === userId)
    if (userIndex !== -1) {
      sampleUsers[userIndex].friendsCount += 1
      sampleUsers[userIndex].trustScore = calculateNewTrustScore(sampleUsers[userIndex].trustScore, 'friend_added')
    }
  } catch (error) {
    console.error('Error incrementing user friends:', error)
  }
}

export function updateTrustScore(userId: string, activity: string, amount?: number): boolean {
  if (typeof window === 'undefined') return false
  
  try {
    // Get current stored user data
    const userData = localStorage.getItem('scoopUsers')
    const users: User[] = userData ? JSON.parse(userData) : [...sampleUsers] // Create a copy

    const userIndex = users.findIndex(u => u.id === userId)
    if (userIndex !== -1) {
      const targetUser = users[userIndex]
      const newScore = amount ? targetUser.trustScore + amount : calculateNewTrustScore(targetUser.trustScore, activity)
      users[userIndex].trustScore = newScore
      localStorage.setItem('scoopUsers', JSON.stringify(users))

      // Only update the current user localStorage if it's the same user
      const currentUser = getCurrentUser()
      if (currentUser.id === userId) {
        const updatedUser = { ...currentUser, trustScore: newScore }
        saveCurrentUser(updatedUser)
      }

      // DO NOT update the sampleUsers array - this keeps post trust scores static
      // The sampleUsers array should remain unchanged to show original trust scores on posts

      return true
    }

    return false
  } catch (error) {
    console.error('Error updating trust score:', error)
    return false
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
    'upvote_removed': -0.5,     // -0.5 for having upvote removed
    'downvote_removed': 1,      // +1 for having downvote removed
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
    tags: [],
    attendees: eventData.invitedFriends
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
      const currentUser = getCurrentUser()
      
      // Get current user's vote history for this review
      const userVoteKey = `vote_${currentUser.id}_${reviewId}`
      const currentUserVote = localStorage.getItem(userVoteKey)
      
      // Handle vote logic
      if (currentUserVote === voteType) {
        // User is clicking the same vote - remove it
        if (voteType === 'up') {
          allReviews[reviewIndex].votes -= 1
          updateTrustScore(review.reviewerId, 'upvote_removed')
        } else {
          allReviews[reviewIndex].votes += 1
          updateTrustScore(review.reviewerId, 'downvote_removed')
        }
        localStorage.removeItem(userVoteKey)
      } else if (currentUserVote !== null) {
        // User is switching vote direction
        if (voteType === 'up') {
          allReviews[reviewIndex].votes += 2 // Remove downvote (-1) and add upvote (+1)
          updateTrustScore(review.reviewerId, 'upvote_received')
          updateTrustScore(review.reviewerId, 'downvote_removed')
        } else {
          allReviews[reviewIndex].votes -= 2 // Remove upvote (-1) and add downvote (-1)
          updateTrustScore(review.reviewerId, 'downvote_received')
          updateTrustScore(review.reviewerId, 'upvote_removed')
        }
        localStorage.setItem(userVoteKey, voteType)
      } else {
        // User is voting for the first time
        if (voteType === 'up') {
          allReviews[reviewIndex].votes += 1
          updateTrustScore(review.reviewerId, 'upvote_received')
        } else {
          allReviews[reviewIndex].votes -= 1
          updateTrustScore(review.reviewerId, 'downvote_received')
        }
        localStorage.setItem(userVoteKey, voteType)
      }
      
      saveAllReviews(allReviews)
      
      // Record activity
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

// Helper function to get user's current vote on a review
export function getUserVoteOnReview(reviewId: string): 'up' | 'down' | null {
  if (typeof window === 'undefined') return null
  
  try {
    const currentUser = getCurrentUser()
    const userVoteKey = `vote_${currentUser.id}_${reviewId}`
    const vote = localStorage.getItem(userVoteKey)
    return vote as 'up' | 'down' | null
  } catch (error) {
    console.error('Error getting user vote:', error)
    return null
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

export function connectSocialAccount(platform: string, userId?: string, username?: string): void {
  const currentUser = getCurrentUser()
  const targetUserId = userId || currentUser.id
  
  // If this is the current user, update their social links
  if (targetUserId === currentUser.id && username) {
    const platformKey = platform.toLowerCase() as keyof typeof currentUser.socialLinks
    const updatedSocialLinks = {
      ...currentUser.socialLinks,
      [platformKey]: username
    }
    
    const updatedUser = {
      ...currentUser,
      socialLinks: updatedSocialLinks
    }
    
    saveCurrentUser(updatedUser)
  }
  
  updateTrustScore(targetUserId, 'social_connected')
  recordUserActivity(targetUserId, 'social_connected', { platform, username })
}

// Friend relationships - who is friends with whom
export const friendRelationships: { [userId: string]: string[] } = {
  '0': ['1', '2', '3'], // Test User is friends with Jake, Sarah, Emily
  '1': ['0', '2', '4', '5'], // Jake is friends with Test User, Sarah, David, Lisa
  '2': ['0', '1', '3', '4'], // Sarah is friends with Test User, Jake, Emily, David
  '3': ['0', '2', '5'], // Emily is friends with Test User, Sarah, Lisa
  '4': ['1', '2', '5'], // David is friends with Jake, Sarah, Lisa
  '5': ['1', '3', '4'], // Lisa is friends with Jake, Emily, David
}

// Check if two users are friends
export function areUsersFriends(userId1: string, userId2: string): boolean {
  return friendRelationships[userId1]?.includes(userId2) || false
}

// Get user's friends
export function getUserFriends(userId: string): User[] {
  const friendIds = friendRelationships[userId] || []
  return sampleUsers.filter(user => friendIds.includes(user.id))
}

// Get mutual friends between two users
export function getMutualFriends(userId1: string, userId2: string): User[] {
  const user1Friends = friendRelationships[userId1] || []
  const user2Friends = friendRelationships[userId2] || []
  const mutualIds = user1Friends.filter(id => user2Friends.includes(id))
  return sampleUsers.filter(user => mutualIds.includes(user.id))
}

// Sample Users
export const sampleUsers: User[] = [
  {
    id: '0', // New default user
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
    id: '1',
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
    id: '2',
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
    id: '3',
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
    id: '4',
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
    id: '5',
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
  },
  // New Use Case Event Reviews
  {
    id: '9',
    reviewerId: '2', // Sarah Chen
    reviewedId: '1', // Jake Martinez
    content: 'Jake\'s Loft is the perfect blend of professional and casual. The venue\'s real-time capacity tracking helped us find the perfect time to arrive. The trust-verified entry system made everyone feel secure. Great spot for after-work networking!',
    category: 'Venue Events',
    timestamp: '2024-03-16T22:30:00Z',
    votes: 38,
    isEventReview: true,
    eventId: 'event5'
  },
  {
    id: '10',
    reviewerId: '4', // David Kim
    reviewedId: '1', // Jake Martinez
    content: 'As a freelance developer, this event was invaluable. The trust verification system helped me connect with genuine clients - I\'ve already secured two contracts! The event organizers used Scoop\'s professional profile integration perfectly, allowing us to showcase our work history and client reviews right on our badges. This is exactly how professional networking should work.',
    category: 'Professional Networking',
    timestamp: '2024-03-11T19:45:00Z',
    votes: 42,
    isEventReview: true,
    eventId: 'event6'
  },
  {
    id: '11',
    reviewerId: '3', // Emily Rodriguez
    reviewedId: '1', // Jake Martinez
    content: 'ASU\'s integration with Scoop made this the most secure and efficient career fair I\'ve attended. Student verification was seamless through our university profiles, and the trust scores helped employers quickly identify reliable candidates. The real-time event updates about which companies were actively hiring was incredibly helpful. This is the future of campus recruiting!',
    category: 'Education & Career',
    timestamp: '2024-03-09T16:20:00Z',
    votes: 51,
    isEventReview: true,
    eventId: 'event7'
  },
  {
    id: '12',
    reviewerId: '5', // Lisa Thompson (as an insurance professional for this review)
    reviewedId: '4', // David Kim
    content: 'Fantastic to see how Scoop\'s trust scores are being integrated into insurance risk assessment. The event demonstrated how high-trust users can receive better insurance rates. The verification process for attendees ensured meaningful connections with other insurance professionals. The platform\'s ability to track professional history while maintaining privacy is impressive.',
    category: 'Insurance & Technology',
    timestamp: '2024-03-06T18:15:00Z',
    votes: 35,
    isEventReview: true,
    eventId: 'event8'
  },
  {
    id: '13',
    reviewerId: '2', // Sarah Chen (as an e-commerce seller for this review)
    reviewedId: '1', // Jake Martinez
    content: 'This event showcased how Scoop\'s trust verification is transforming online marketplaces. The live demonstrations of fraud prevention through trust scores were eye-opening. As an online seller, I appreciate how the platform helps verify both buyer and seller identities while protecting privacy. The networking opportunities with other verified sellers were invaluable.',
    category: 'E-commerce & Trust',
    timestamp: '2024-03-02T20:00:00Z',
    votes: 44,
    isEventReview: true,
    eventId: 'event9'
  }
]

// Sample Past Events (for reviews)
export const sampleEvents: Event[] = [
  {
    id: 'event1',
    title: 'Tech Meetup & Networking',
    description: 'Join us for an evening of tech talks, networking, and delicious catering by Emily Rodriguez. Perfect for developers, designers, and tech enthusiasts.',
    hostId: '1', // Jake Martinez
    date: '2024-03-06', // Day before review
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
    attendees: ['1', '2', '3'] // Jake, Sarah, Emily (Emily catered and reviewed)
  },
  {
    id: 'event2',
    title: 'Phoenix Tech Summit 2024',
    description: 'The biggest tech conference in Phoenix! Join us for a day of inspiring speakers, workshops, and networking opportunities with industry leaders.',
    hostId: '1', // Jake Martinez
    date: '2024-03-04', // Day before review
    time: '9:00 AM',
    location: 'Jake\'s Loft - Main Hall',
    address: '123 Downtown Ave, Phoenix, AZ 85004',
    category: 'Technology',
    imageUrl: 'https://images.unsplash.com/photo-1505373877841-8d25f7d46678?w=600',
    maxAttendees: 200,
    attendeeCount: 180,
    price: 25,
    isPrivate: false,
    isPast: true,
    trustRequirement: 70,
    tags: ['tech', 'conference', 'workshops', 'networking'],
    attendees: ['1', '2', '4', '5'] // Jake, Sarah (reviewed), David, Lisa
  },
  {
    id: 'event3',
    title: 'Community Art Fair',
    description: 'Celebrate local artists at our monthly art fair! Featuring live music, food trucks, and amazing artwork from Phoenix\'s creative community.',
    hostId: '1', // Jake Martinez
    date: '2024-03-03', // Day before review
    time: '11:00 AM',
    location: 'Jake\'s Loft - Garden Space',
    address: '123 Downtown Ave, Phoenix, AZ 85004',
    category: 'Arts & Culture',
    imageUrl: 'https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?w=600',
    maxAttendees: 300,
    attendeeCount: 250,
    price: 0,
    isPrivate: false,
    isPast: true,
    trustRequirement: 50,
    tags: ['art', 'community', 'music', 'food'],
    attendees: ['1', '3', '5'] // Jake, Emily (reviewed), Lisa
  },
  {
    id: 'event4',
    title: 'Startup Networking Night',
    description: 'Connect with fellow entrepreneurs, investors, and startup enthusiasts. Perfect for networking, pitching ideas, and finding potential collaborators.',
    hostId: '1', // Jake Martinez
    date: '2024-03-02', // Day before review
    time: '7:00 PM',
    location: 'Jake\'s Loft - Mezzanine',
    address: '123 Downtown Ave, Phoenix, AZ 85004',
    category: 'Business',
    imageUrl: 'https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=600',
    maxAttendees: 150,
    attendeeCount: 130,
    price: 15,
    isPrivate: false,
    isPast: true,
    trustRequirement: 65,
    tags: ['startup', 'business', 'networking', 'entrepreneurship'],
    attendees: ['1', '2', '4', '5'] // Jake, Sarah, David, Lisa (reviewed)
  },
  // New Use Case Events
  {
    id: 'event5',
    title: 'Friday Night Live @ Jake\'s Loft',
    description: 'Join us for our weekly Friday night networking event! Experience our new real-time capacity tracking and trust-verified entry system. Perfect blend of professional networking and casual socializing with live music and craft cocktails.',
    hostId: '1', // Jake Martinez
    date: '2024-03-15', // Day before review
    time: '7:00 PM',
    location: 'Jake\'s Loft - Main Floor',
    address: '123 Downtown Ave, Phoenix, AZ 85004',
    category: 'Networking',
    imageUrl: 'https://images.unsplash.com/photo-1511632765486-a01980e01a18?w=600',
    maxAttendees: 100,
    attendeeCount: 85,
    price: 15,
    isPrivate: false,
    isPast: true,
    trustRequirement: 65,
    tags: ['venue', 'networking', 'live-music', 'professional'],
    attendees: ['1', '2', '4'] // Jake, Sarah (reviewed), David
  },
  {
    id: 'event6',
    title: 'Phoenix Tech Contractors Summit',
    description: 'The premier networking event for freelance developers, designers, and tech contractors. Features professional profile integration, client showcase opportunities, and direct connections with hiring managers. Showcase your portfolio and connect with genuine clients.',
    hostId: '1', // Jake Martinez
    date: '2024-03-10', // Day before review
    time: '10:00 AM',
    location: 'Phoenix Convention Center',
    address: '100 N 3rd St, Phoenix, AZ 85004',
    category: 'Professional',
    imageUrl: 'https://images.unsplash.com/photo-1521737711867-e3b97375f902?w=600',
    maxAttendees: 200,
    attendeeCount: 150,
    price: 25,
    isPrivate: false,
    isPast: true,
    trustRequirement: 70,
    tags: ['freelance', 'contractors', 'professional', 'portfolio'],
    attendees: ['1', '4', '5'] // Jake, David (reviewed), Lisa
  },
  {
    id: 'event7',
    title: 'ASU Spring Career Fair',
    description: 'Arizona State University\'s premier career fair featuring trust verification for students and employers. Real-time updates on company hiring status, verified student profiles, and secure networking environment. The future of campus recruiting starts here.',
    hostId: '1', // Jake Martinez (as event coordinator)
    date: '2024-03-08', // Day before review
    time: '9:00 AM',
    location: 'ASU Main Campus - Memorial Union',
    address: '1200 S Forest Ave, Tempe, AZ 85281',
    category: 'Education',
    imageUrl: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=600',
    maxAttendees: 350,
    attendeeCount: 300,
    price: 0,
    isPrivate: false,
    isPast: true,
    trustRequirement: 60,
    tags: ['career-fair', 'education', 'students', 'employment'],
    attendees: ['1', '3', '4'] // Jake, Emily (reviewed), David
  },
  {
    id: 'event8',
    title: 'InsurTech Innovation Meetup',
    description: 'Explore how trust scores and verification systems are revolutionizing insurance risk assessment. Learn how high-trust users can access better insurance rates and how the industry is evolving with technology. Network with insurance professionals and tech innovators.',
    hostId: '4', // David Kim (insurance professional)
    date: '2024-03-05', // Day before review
    time: '6:30 PM',
    location: 'State Farm Stadium - Conference Center',
    address: '1 Cardinals Dr, Glendale, AZ 85305',
    category: 'Technology',
    imageUrl: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600',
    maxAttendees: 100,
    attendeeCount: 75,
    price: 20,
    isPrivate: false,
    isPast: true,
    trustRequirement: 75,
    tags: ['insurance', 'technology', 'innovation', 'trust-scores'],
    attendees: ['1', '4', '5'] // Jake, David, Lisa (reviewed)
  },
  {
    id: 'event9',
    title: 'Arizona E-commerce Trust Summit',
    description: 'The premier event showcasing how trust verification is transforming online marketplaces. Features live fraud prevention demonstrations, seller verification processes, and networking opportunities for verified e-commerce professionals. Learn to build trust in digital transactions.',
    hostId: '1', // Jake Martinez
    date: '2024-03-01', // Day before review
    time: '1:00 PM',
    location: 'Phoenix Marketplace - Event Center',
    address: '9617 N Metro Pkwy W, Phoenix, AZ 85051',
    category: 'Business',
    imageUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600',
    maxAttendees: 150,
    attendeeCount: 120,
    price: 30,
    isPrivate: false,
    isPast: true,
    trustRequirement: 70,
    tags: ['e-commerce', 'trust', 'fraud-prevention', 'online-selling'],
    attendees: ['1', '2', '5'] // Jake, Sarah (reviewed), Lisa
  },
  // Upcoming Events
  {
    id: 'upcoming1',
    title: 'Weekly Tech Meetup Phoenix',
    description: 'Join us for our weekly tech discussion! This week we\'re covering React 18 features, Next.js updates, and the latest in web development. Great for networking and learning from fellow developers.',
    hostId: '2', // Sarah Chen
    date: '2024-12-28', // Future date
    time: '7:00 PM',
    location: 'WeWork Central Phoenix',
    address: '1 E Washington St, Phoenix, AZ 85004',
    category: 'Technology',
    imageUrl: 'https://images.unsplash.com/photo-1531482615713-2afd69097998?w=600',
    maxAttendees: 60,
    attendeeCount: 23,
    price: 0,
    isPrivate: false,
    isPast: false,
    trustRequirement: 65,
    tags: ['tech', 'react', 'nextjs', 'networking'],
    attendees: ['1', '2', '3', '4'] // Jake, Sarah (host), Emily, David
  },
  {
    id: 'upcoming2',
    title: 'Phoenix Coffee & Code',
    description: 'Casual coding session over coffee! Bring your laptop and work on personal projects while connecting with other developers. Perfect for freelancers and anyone looking to code in a social environment.',
    hostId: '4', // David Kim
    date: '2024-12-30', // Future date
    time: '10:00 AM',
    location: 'Starbucks Reserve - Downtown',
    address: '300 W Washington St, Phoenix, AZ 85003',
    category: 'Social',
    imageUrl: 'https://images.unsplash.com/photo-1521737604893-d14cc237f11d?w=600',
    maxAttendees: 15,
    attendeeCount: 8,
    price: 0,
    isPrivate: false,
    isPast: false,
    trustRequirement: 50,
    tags: ['coding', 'coffee', 'casual', 'freelancing'],
    attendees: ['2', '4', '5'] // Sarah, David (host), Lisa
  },
  {
    id: 'upcoming3',
    title: 'New Year\'s Networking Mixer',
    description: 'Ring in the new year with Phoenix\'s professional community! Join us for networking, appetizers, and a toast to new opportunities. Great for meeting potential collaborators and clients.',
    hostId: '1', // Jake Martinez
    date: '2024-12-31', // New Year's Eve
    time: '6:00 PM',
    location: 'Jake\'s Loft - Rooftop',
    address: '123 Downtown Ave, Phoenix, AZ 85004',
    category: 'Networking',
    imageUrl: 'https://images.unsplash.com/photo-1556761175-4b46a572b786?w=600',
    maxAttendees: 100,
    attendeeCount: 45,
    price: 25,
    isPrivate: false,
    isPast: false,
    trustRequirement: 70,
    tags: ['networking', 'new-years', 'professional', 'celebration'],
    attendees: ['1', '2', '3', '4', '5'] // All users attending
  },
  {
    id: 'upcoming4',
    title: 'Weekend Hiking Adventure',
    description: 'Explore Phoenix\'s beautiful desert trails! We\'ll hike Camelback Mountain at sunrise for stunning city views. All fitness levels welcome - we\'ll have multiple pace groups.',
    hostId: '3', // Emily Rodriguez
    date: '2025-01-04', // Future weekend
    time: '6:00 AM',
    location: 'Camelback Mountain Trailhead',
    address: '5700 N Echo Canyon Pkwy, Phoenix, AZ 85018',
    category: 'Outdoors',
    imageUrl: 'https://images.unsplash.com/photo-1551632811-561732d1e306?w=600',
    maxAttendees: 25,
    attendeeCount: 12,
    price: 0,
    isPrivate: false,
    isPast: false,
    trustRequirement: 60,
    tags: ['hiking', 'outdoors', 'fitness', 'sunrise'],
    attendees: ['1', '3', '4'] // Jake, Emily (host), David
  },
  {
    id: 'upcoming5',
    title: 'Startup Pitch Night',
    description: 'Local entrepreneurs present their startup ideas to the community! Whether you\'re looking to pitch, invest, or just learn about innovation in Phoenix, this event is perfect for you.',
    hostId: '5', // Lisa Thompson
    date: '2025-01-07', // Future date
    time: '7:30 PM',
    location: 'Phoenix Innovation District',
    address: '515 E Grant St, Phoenix, AZ 85004',
    category: 'Business',
    imageUrl: 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=600',
    maxAttendees: 80,
    attendeeCount: 34,
    price: 15,
    isPrivate: false,
    isPast: false,
    trustRequirement: 75,
    tags: ['startup', 'entrepreneurship', 'pitch', 'innovation'],
    attendees: ['1', '2', '4', '5'] // Jake, Sarah, David, Lisa (host)
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

// Social Platform Icons - Organized by Auth0 availability and popularity
export const socialPlatforms = {
  // Auth0 Available Platforms (Most to Least Popular)
  'Google': '🔍',
  'Facebook': '👥', 
  'Apple': '🍎',
  'Microsoft': '🪟',
  'LinkedIn': '💼',
  'GitHub': '💻',
  'YouTube': '📺',
  'Twitter': '🐦',
  'Discord': '🎮',
  'PayPal': '💰',
  'Snapchat': '👻',
  'Spotify': '🎵',
  'Twitch': '🎬',
  'Fitbit': '⌚',
  'ID.me': '🆔',
  'IDPartner': '🔗',
  'Okta': '🔐',
  
  // Non-Auth0 Platforms (Most to Least Popular)
  'Instagram': '📸',
  'TikTok': '🎵',
  'WhatsApp': '💬',
  'Telegram': '✈️',
  'Reddit': '🤖',
  'Pinterest': '📌',
  'Steam': '🎮',
  'Signal': '🔒',
  'Clubhouse': '🎙️',
  'BeReal': '📱',
}

export function createUserProfile(userData: any): User {
  const newUser: User = {
    id: Date.now().toString(),
    name: userData.fullName,
    email: userData.email,
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
    bio: 'New to ScoopSocials! Looking forward to connecting with the community.',
    trustScore: 50, // Starting trust score for new users
    joinDate: new Date().toISOString().split('T')[0],
    location: 'Location not set',
    friendsCount: 0,
    reviewsCount: 0,
    eventsAttended: 0,
    isVerified: false,
    eventsHosted: 0,
    badges: [],
    interests: [],
    socialLinks: {
      instagram: '',
      twitter: ''
    },
    phoneVerified: false,
    emailVerified: false
  }

  return newUser
} 