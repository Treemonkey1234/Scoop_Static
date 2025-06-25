# 🔧 ScoopSocials Implementation Guide

## **Complete Platform Rebuild Documentation**

This guide provides the exact implementation details needed to rebuild the current ScoopSocials platform from scratch, including component specifications, data models, and business logic patterns.

---

## **1. Core Data Models & Interfaces**

### **1.1 Primary User Interface**
```typescript
// lib/types.ts
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
```

### **1.2 Review System Interface**
```typescript
export interface Review {
  id: string
  reviewerId: string
  reviewedId: string
  content: string
  category: 'professional' | 'marketplace' | 'dating' | 'social' | 'general'
  timestamp: string
  votes: number
  isEventReview: boolean
  eventId?: string
}

export interface CreateReviewData {
  reviewFor: string
  category: string
  content: string
  tags: string[]
  photo?: File | null
}
```

### **1.3 Event System Interface**
```typescript
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
```

---

## **2. Component Architecture**

### **2.1 Layout Component Structure**
```typescript
// components/Layout.tsx
interface LayoutProps {
  children: React.ReactNode
}

// Key features implemented:
// - Mobile-first navigation
// - Global walkthrough system
// - Real-time loading indicators
// - User session management
// - Active page highlighting

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null)
  const [isWalkthroughOpen, setIsWalkthroughOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  
  // Implementation patterns:
  // 1. User state management with localStorage persistence
  // 2. Navigation state tracking
  // 3. Walkthrough modal system with step-by-step navigation
  // 4. Loading states for all transitions
}
```

### **2.2 Create Post Form Implementation**
```typescript
// app/create-post/page.tsx
interface FormData {
  reviewFor: string
  category: string
  content: string
  tags: string[]
  photo: File | null
}

// Key implementation details:
const CreatePostPage = () => {
  const [formData, setFormData] = useState<FormData>({
    reviewFor: '',
    category: '',
    content: '',
    tags: [],
    photo: null
  })

  // Critical business rules:
  // 1. Only verified friends can be reviewed
  // 2. Content limited to 300 characters
  // 3. Categories: Professional, Marketplace, Dating, Social, General
  // 4. Optional single photo upload
  // 5. Tag system with quick suggestions

  const categories = [
    { id: 'professional', label: '💼 Professional', emoji: '💼' },
    { id: 'marketplace', label: '🛒 Marketplace', emoji: '🛒' },
    { id: 'dating', label: '💕 Dating', emoji: '💕' },
    { id: 'social', label: '🤝 Social', emoji: '🤝' },
    { id: 'general', label: '🔗 General', emoji: '🔗' }
  ]

  const quickTags = ['#reliable', '#skilled', '#responsive', '#professional', '#recommended']
}
```

---

## **3. State Management Patterns**

### **3.1 LocalStorage-Based Data Persistence**
```typescript
// lib/dataManager.ts
export class DataManager {
  // User management
  static getCurrentUser(): User {
    if (typeof window === 'undefined') return defaultUser
    
    try {
      const userData = localStorage.getItem('currentUser')
      if (userData) {
        return { ...JSON.parse(userData), ...requiredDefaults }
      }
    } catch (error) {
      console.error('Error parsing user data:', error)
    }
    return defaultUser
  }

  static saveCurrentUser(user: User): void {
    if (typeof window === 'undefined') return
    localStorage.setItem('currentUser', JSON.stringify(user))
  }

  // Review management
  static getAllReviews(): Review[] {
    const reviews = localStorage.getItem('reviews')
    return reviews ? JSON.parse(reviews) : defaultReviews
  }

  static createReview(reviewData: CreateReviewData): Review {
    const reviews = this.getAllReviews()
    const newReview: Review = {
      id: Date.now().toString(),
      reviewerId: this.getCurrentUser().id,
      reviewedId: reviewData.reviewFor,
      content: reviewData.content,
      category: reviewData.category,
      timestamp: new Date().toISOString(),
      votes: 0,
      isEventReview: false
    }
    
    reviews.unshift(newReview)
    localStorage.setItem('reviews', JSON.stringify(reviews))
    
    // Update trust scores
    this.updateTrustScore(reviewData.reviewFor, 'review_received')
    this.updateTrustScore(newReview.reviewerId, 'review_given')
    
    return newReview
  }
}
```

### **3.2 Trust Score Calculation Engine**
```typescript
// lib/trustEngine.ts
export class TrustEngine {
  static calculateTrustScore(userId: string): number {
    const user = DataManager.getUserById(userId)
    const activities = DataManager.getUserActivities(userId)
    
    let score = 50 // Base score
    
    // Social Media Verification (20% weight)
    score += this.calculateSocialScore(user)
    
    // Community Network (20% weight)
    score += this.calculateNetworkScore(user)
    
    // Platform Activity (15% weight)
    score += this.calculateActivityScore(activities)
    
    // Content Quality (15% weight)
    score += this.calculateContentScore(user)
    
    // Additional factors...
    
    return Math.min(Math.max(score, 0), 100)
  }

  private static calculateSocialScore(user: User): number {
    let score = 0
    const socialAccounts = Object.values(user.socialLinks).filter(link => link)
    
    // Base points for connections
    score += Math.min(socialAccounts.length * 3, 15)
    
    // Verification bonuses
    if (user.phoneVerified) score += 3
    if (user.emailVerified) score += 2
    
    return score
  }
}
```

---

## **4. UI Component Specifications**

### **4.1 Form Components**
```typescript
// components/FormElements.tsx
interface FormInputProps {
  label: string
  value: string
  onChange: (value: string) => void
  placeholder?: string
  maxLength?: number
  required?: boolean
}

const FormInput: React.FC<FormInputProps> = ({
  label, value, onChange, placeholder, maxLength, required
}) => (
  <div className="space-y-2">
    <label className="block text-sm font-medium text-slate-700">
      {label} {required && <span className="text-red-500">*</span>}
    </label>
    <input
      type="text"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      maxLength={maxLength}
      className="w-full px-3 py-2 border border-slate-300 rounded-lg 
                 focus:ring-2 focus:ring-cyan-500 focus:border-transparent
                 transition-colors duration-200"
      required={required}
    />
    {maxLength && (
      <div className="text-xs text-slate-500 text-right">
        {value.length}/{maxLength}
      </div>
    )}
  </div>
)
```

### **4.2 Trust Score Display Component**
```typescript
// components/TrustScore.tsx
interface TrustScoreProps {
  score: number
  size?: 'sm' | 'md' | 'lg'
  showDetails?: boolean
}

const TrustScore: React.FC<TrustScoreProps> = ({ score, size = 'md', showDetails = false }) => {
  const getTrustLevel = (score: number) => {
    if (score >= 96) return { level: 'Elite', color: 'text-purple-600', bg: 'bg-purple-100' }
    if (score >= 90) return { level: 'Highly Trusted', color: 'text-green-600', bg: 'bg-green-100' }
    if (score >= 80) return { level: 'Trusted', color: 'text-blue-600', bg: 'bg-blue-100' }
    if (score >= 70) return { level: 'Verified', color: 'text-cyan-600', bg: 'bg-cyan-100' }
    return { level: 'New', color: 'text-slate-600', bg: 'bg-slate-100' }
  }

  const trust = getTrustLevel(score)
  
  return (
    <div className={`inline-flex items-center space-x-2 px-3 py-1 rounded-full ${trust.bg}`}>
      <span className={`font-semibold ${trust.color}`}>{score}</span>
      {showDetails && <span className={`text-xs ${trust.color}`}>{trust.level}</span>}
    </div>
  )
}
```

---

## **5. Business Logic Implementation**

### **5.1 Friend System Logic**
```typescript
// lib/friendSystem.ts
export class FriendSystem {
  static areUsersFriends(userId1: string, userId2: string): boolean {
    const user1Friends = this.getUserFriends(userId1)
    return user1Friends.some(friend => friend.id === userId2)
  }

  static getUserFriends(userId: string): User[] {
    const friendships = this.getAllFriendships()
    const userFriendIds = friendships
      .filter(f => f.userId === userId || f.friendId === userId)
      .map(f => f.userId === userId ? f.friendId : f.userId)
    
    return userFriendIds.map(id => DataManager.getUserById(id)).filter(Boolean)
  }

  static sendFriendRequest(fromUserId: string, toUserId: string): boolean {
    if (this.areUsersFriends(fromUserId, toUserId)) return false
    
    const requests = this.getFriendRequests()
    const existingRequest = requests.find(r => 
      r.fromUserId === fromUserId && r.toUserId === toUserId
    )
    
    if (existingRequest) return false
    
    requests.push({
      id: Date.now().toString(),
      fromUserId,
      toUserId,
      status: 'pending',
      timestamp: new Date().toISOString()
    })
    
    localStorage.setItem('friendRequests', JSON.stringify(requests))
    return true
  }
}
```

### **5.2 Event Management System**
```typescript
// lib/eventSystem.ts
export class EventSystem {
  static createEvent(eventData: CreateEventData): Event {
    const events = this.getAllEvents()
    const currentUser = DataManager.getCurrentUser()
    
    const newEvent: Event = {
      id: Date.now().toString(),
      ...eventData,
      hostId: currentUser.id,
      attendeeCount: 0,
      attendees: [],
      isPast: false,
      imageUrl: this.getCategoryImage(eventData.category)
    }
    
    events.unshift(newEvent)
    localStorage.setItem('events', JSON.stringify(events))
    
    // Update user's hosted events count
    DataManager.incrementUserEvents(currentUser.id)
    
    return newEvent
  }

  static attendEvent(eventId: string, userId?: string): boolean {
    const events = this.getAllEvents()
    const event = events.find(e => e.id === eventId)
    const user = userId ? DataManager.getUserById(userId) : DataManager.getCurrentUser()
    
    if (!event || !user) return false
    if (event.attendees?.includes(user.id)) return false
    if (event.attendeeCount >= event.maxAttendees) return false
    if (user.trustScore < event.trustRequirement) return false
    
    event.attendees = [...(event.attendees || []), user.id]
    event.attendeeCount += 1
    
    localStorage.setItem('events', JSON.stringify(events))
    DataManager.incrementUserEvents(user.id)
    
    return true
  }
}
```

---

## **6. Validation & Security Patterns**

### **6.1 Input Validation**
```typescript
// lib/validation.ts
export class ValidationEngine {
  static validateReviewContent(content: string): ValidationResult {
    const errors: string[] = []
    
    if (!content.trim()) {
      errors.push('Review content is required')
    }
    
    if (content.length > 300) {
      errors.push('Review must be 300 characters or less')
    }
    
    if (content.length < 10) {
      errors.push('Review must be at least 10 characters')
    }
    
    // Check for inappropriate content
    if (this.containsInappropriateContent(content)) {
      errors.push('Review contains inappropriate content')
    }
    
    return {
      isValid: errors.length === 0,
      errors
    }
  }

  static validateEventData(eventData: CreateEventData): ValidationResult {
    const errors: string[] = []
    
    if (!eventData.title.trim()) errors.push('Event title is required')
    if (!eventData.date) errors.push('Event date is required')
    if (!eventData.location.trim()) errors.push('Event location is required')
    
    if (eventData.maxAttendees < 1) {
      errors.push('Event must allow at least 1 attendee')
    }
    
    if (eventData.trustRequirement < 0 || eventData.trustRequirement > 100) {
      errors.push('Trust requirement must be between 0 and 100')
    }
    
    return {
      isValid: errors.length === 0,
      errors
    }
  }
}
```

### **6.2 Content Moderation**
```typescript
// lib/moderation.ts
export class ModerationEngine {
  private static bannedWords = ['spam', 'fake', 'bot', 'scam']
  
  static moderateContent(content: string): ModerationResult {
    const flags: string[] = []
    
    // Check for banned words
    const lowerContent = content.toLowerCase()
    this.bannedWords.forEach(word => {
      if (lowerContent.includes(word)) {
        flags.push(`Contains banned word: ${word}`)
      }
    })
    
    // Check for excessive caps
    const capsRatio = (content.match(/[A-Z]/g) || []).length / content.length
    if (capsRatio > 0.5 && content.length > 20) {
      flags.push('Excessive capital letters')
    }
    
    // Check for repeated characters
    if (/(.)\1{4,}/.test(content)) {
      flags.push('Contains repeated characters')
    }
    
    return {
      isApproved: flags.length === 0,
      flags,
      confidence: this.calculateConfidence(flags)
    }
  }
}
```

---

## **7. Navigation & Routing Logic**

### **7.1 Walkthrough System Implementation**
```typescript
// components/WalkthroughSystem.tsx
interface WalkthroughStep {
  title: string
  content: string
  highlight: string
  page: string
  action?: string
}

export const WalkthroughManager = {
  steps: [
    {
      title: "Welcome to ScoopSocials! 🍦",
      content: "Let's take a quick tour of your new trust-based social platform.",
      highlight: "header",
      page: "/"
    },
    {
      title: "Analytics Dashboard 📈",
      content: "Track your trust score trends and community impact.",
      highlight: "analytics",
      page: "/analytics"
    },
    // ... 14 total steps
  ],

  startWalkthrough(): void {
    localStorage.setItem('walkthroughInProgress', 'true')
    localStorage.setItem('currentWalkthroughStep', '0')
  },

  nextStep(currentStep: number, router: NextRouter): Promise<void> {
    const nextStepData = this.steps[currentStep + 1]
    
    if (nextStepData?.page && nextStepData.page !== window.location.pathname) {
      return router.push(nextStepData.page)
    }
    
    localStorage.setItem('currentWalkthroughStep', (currentStep + 1).toString())
    return Promise.resolve()
  },

  completeWalkthrough(): void {
    localStorage.removeItem('walkthroughInProgress')
    localStorage.removeItem('currentWalkthroughStep')
  }
}
```

---

## **8. Styling & Design System**

### **8.1 Tailwind Configuration**
```typescript
// tailwind.config.js
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        'cyan': {
          50: '#ecfeff',
          500: '#06b6d4',
          600: '#0891b2',
        },
        'teal': {
          600: '#0d9488',
          700: '#0f766e',
        }
      },
      boxShadow: {
        'soft': '0 2px 15px -3px rgba(0, 0, 0, 0.07), 0 10px 20px -2px rgba(0, 0, 0, 0.04)',
      },
      animation: {
        'bounce-gentle': 'bounce 2s infinite',
        'pulse-slow': 'pulse 3s infinite',
      }
    },
  },
  plugins: [],
}
```

### **8.2 Component Styling Patterns**
```typescript
// Design system constants
export const StyleGuide = {
  colors: {
    primary: 'from-cyan-500 to-teal-600',
    secondary: 'from-slate-100 to-slate-200',
    success: 'from-green-500 to-emerald-600',
    warning: 'from-yellow-500 to-orange-600',
    error: 'from-red-500 to-pink-600'
  },
  
  spacing: {
    container: 'max-w-2xl mx-auto p-4',
    section: 'space-y-6',
    card: 'bg-white rounded-2xl shadow-soft p-6'
  },
  
  typography: {
    heading: 'text-xl font-bold text-slate-800',
    subheading: 'text-lg font-semibold text-slate-800',
    body: 'text-slate-600',
    caption: 'text-xs text-slate-500'
  }
}
```

---

## **9. Error Handling & Loading States**

### **9.1 Error Boundary Implementation**
```typescript
// components/ErrorBoundary.tsx
interface ErrorBoundaryState {
  hasError: boolean
  error?: Error
}

export class ErrorBoundary extends React.Component<
  React.PropsWithChildren<{}>,
  ErrorBoundaryState
> {
  constructor(props: React.PropsWithChildren<{}>) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Error boundary caught an error:', error, errorInfo)
    
    // Log to analytics service
    this.logError(error, errorInfo)
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-slate-50">
          <div className="text-center p-8">
            <h2 className="text-2xl font-bold text-slate-800 mb-4">
              Oops! Something went wrong
            </h2>
            <p className="text-slate-600 mb-6">
              We're sorry for the inconvenience. Please try refreshing the page.
            </p>
            <button
              onClick={() => window.location.reload()}
              className="px-6 py-2 bg-gradient-to-r from-cyan-500 to-teal-600 
                         text-white rounded-lg hover:from-cyan-600 hover:to-teal-700"
            >
              Refresh Page
            </button>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}
```

### **9.2 Loading State Management**
```typescript
// hooks/useLoadingState.ts
export const useLoadingState = () => {
  const [isLoading, setIsLoading] = useState(false)
  const [loadingMessage, setLoadingMessage] = useState('')

  const startLoading = (message: string = 'Loading...') => {
    setIsLoading(true)
    setLoadingMessage(message)
  }

  const stopLoading = () => {
    setIsLoading(false)
    setLoadingMessage('')
  }

  const withLoading = async <T>(
    promise: Promise<T>,
    message: string = 'Loading...'
  ): Promise<T> => {
    startLoading(message)
    try {
      const result = await promise
      return result
    } finally {
      stopLoading()
    }
  }

  return {
    isLoading,
    loadingMessage,
    startLoading,
    stopLoading,
    withLoading
  }
}
```

---

## **10. Performance Optimization Patterns**

### **10.1 Memoization Strategies**
```typescript
// hooks/useMemoizedData.ts
export const useMemoizedUserData = (userId: string) => {
  return useMemo(() => {
    return DataManager.getUserById(userId)
  }, [userId])
}

export const useMemoizedReviews = (filters?: ReviewFilters) => {
  return useMemo(() => {
    let reviews = DataManager.getAllReviews()
    
    if (filters?.category) {
      reviews = reviews.filter(r => r.category === filters.category)
    }
    
    if (filters?.userId) {
      reviews = reviews.filter(r => 
        r.reviewerId === filters.userId || r.reviewedId === filters.userId
      )
    }
    
    return reviews.sort((a, b) => 
      new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    )
  }, [filters])
}
```

### **10.2 Image Optimization**
```typescript
// utils/imageOptimization.ts
export const ImageOptimizer = {
  getOptimizedUrl(originalUrl: string, options: ImageOptions): string {
    const { width = 150, height = 150, quality = 80 } = options
    
    if (originalUrl.includes('unsplash.com')) {
      return `${originalUrl}?w=${width}&h=${height}&q=${quality}&fit=crop&crop=face`
    }
    
    return originalUrl
  },

  preloadCriticalImages(): void {
    const criticalImages = [
      '/scoop-logo.png',
      // Add other critical images
    ]
    
    criticalImages.forEach(src => {
      const link = document.createElement('link')
      link.rel = 'preload'
      link.as = 'image'
      link.href = src
      document.head.appendChild(link)
    })
  }
}
```

---

## **Conclusion**

This implementation guide provides the specific technical details needed to rebuild the ScoopSocials platform exactly as it currently exists. Key implementation patterns include:

✅ **Complete component specifications** with props and state management
✅ **Exact data models** matching current localStorage structure  
✅ **Business logic implementations** for trust scores, reviews, and events
✅ **UI/UX patterns** with specific Tailwind classes and interactions
✅ **Validation and security** patterns for user input and content moderation
✅ **Performance optimization** strategies for data management and rendering

Combined with the architecture and business documents, this guide enables complete platform reconstruction with all current features and functionality.

---

*Implementation Guide Version: 1.0*
*Last Updated: January 2025*
*© 2025 Scoop Technologies LLC* 