# 🔌 ScoopSocials API Documentation

## **Complete API Reference & Integration Guide**

This document provides comprehensive API specifications for all ScoopSocials platform endpoints, data formats, and integration patterns.

---

## **1. API Overview**

### **1.1 Base Configuration**
```typescript
// lib/api/config.ts
export const API_CONFIG = {
  baseUrl: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000',
  version: 'v1',
  timeout: 10000,
  retryAttempts: 3
}

export const API_ENDPOINTS = {
  // User Management
  users: '/api/users',
  currentUser: '/api/users/me',
  userProfile: (id: string) => `/api/users/${id}`,
  
  // Authentication
  auth: '/api/auth',
  login: '/api/auth/login',
  logout: '/api/auth/logout',
  verify: '/api/auth/verify',
  
  // Reviews
  reviews: '/api/reviews',
  userReviews: (id: string) => `/api/reviews/user/${id}`,
  reviewVote: (id: string) => `/api/reviews/${id}/vote`,
  
  // Events
  events: '/api/events',
  eventDetails: (id: string) => `/api/events/${id}`,
  eventAttend: (id: string) => `/api/events/${id}/attend`,
  
  // Friends
  friends: '/api/friends',
  friendRequests: '/api/friends/requests',
  friendAction: (id: string) => `/api/friends/${id}`,
  
  // Trust System
  trustScore: '/api/trust/score',
  trustHistory: '/api/trust/history',
  trustFactors: '/api/trust/factors'
}
```

### **1.2 Authentication Headers**
```typescript
// lib/api/auth.ts
export const getAuthHeaders = (): Record<string, string> => {
  const token = localStorage.getItem('authToken')
  return {
    'Content-Type': 'application/json',
    'Authorization': token ? `Bearer ${token}` : '',
    'X-API-Version': API_CONFIG.version
  }
}
```

---

## **2. User Management APIs**

### **2.1 Get Current User**
```typescript
// GET /api/users/me
interface GetCurrentUserResponse {
  success: boolean
  user: User
  trustScore: number
  lastLogin: string
}

export const getCurrentUser = async (): Promise<GetCurrentUserResponse> => {
  const response = await fetch(`${API_CONFIG.baseUrl}/api/users/me`, {
    method: 'GET',
    headers: getAuthHeaders()
  })
  
  if (!response.ok) {
    throw new Error(`Failed to fetch user: ${response.statusText}`)
  }
  
  return response.json()
}
```

### **2.2 Update User Profile**
```typescript
// PUT /api/users/me
interface UpdateUserRequest {
  name?: string
  bio?: string
  location?: string
  interests?: string[]
  avatar?: string
}

interface UpdateUserResponse {
  success: boolean
  user: User
  message: string
}

export const updateUserProfile = async (
  updates: UpdateUserRequest
): Promise<UpdateUserResponse> => {
  const response = await fetch(`${API_CONFIG.baseUrl}/api/users/me`, {
    method: 'PUT',
    headers: getAuthHeaders(),
    body: JSON.stringify(updates)
  })
  
  return response.json()
}
```

---

## **3. Review System APIs**

### **3.1 Create Review**
```typescript
// POST /api/reviews
interface CreateReviewRequest {
  reviewedUserId: string
  category: 'professional' | 'marketplace' | 'dating' | 'social' | 'general'
  content: string
  tags: string[]
  eventId?: string
  rating?: number
}

interface CreateReviewResponse {
  success: boolean
  review: Review
  trustScoreImpact: {
    reviewer: number
    reviewed: number
  }
  message: string
}

export const createReview = async (
  reviewData: CreateReviewRequest
): Promise<CreateReviewResponse> => {
  const response = await fetch(`${API_CONFIG.baseUrl}/api/reviews`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify(reviewData)
  })
  
  return response.json()
}
```

### **3.2 Get Reviews**
```typescript
// GET /api/reviews
interface GetReviewsQuery {
  page?: number
  limit?: number
  category?: string
  userId?: string
  sortBy?: 'newest' | 'oldest' | 'most_voted'
}

interface GetReviewsResponse {
  success: boolean
  reviews: Review[]
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
}

export const getReviews = async (
  query: GetReviewsQuery = {}
): Promise<GetReviewsResponse> => {
  const searchParams = new URLSearchParams(
    Object.entries(query).map(([key, value]) => [key, String(value)])
  )
  
  const response = await fetch(
    `${API_CONFIG.baseUrl}/api/reviews?${searchParams}`,
    {
      method: 'GET',
      headers: getAuthHeaders()
    }
  )
  
  return response.json()
}
```

### **3.3 Vote on Review**
```typescript
// POST /api/reviews/{id}/vote
interface VoteReviewRequest {
  voteType: 'up' | 'down' | 'remove'
}

interface VoteReviewResponse {
  success: boolean
  review: Review
  newVoteCount: number
  userVote: 'up' | 'down' | null
}

export const voteOnReview = async (
  reviewId: string,
  voteData: VoteReviewRequest
): Promise<VoteReviewResponse> => {
  const response = await fetch(
    `${API_CONFIG.baseUrl}/api/reviews/${reviewId}/vote`,
    {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(voteData)
    }
  )
  
  return response.json()
}
```

---

## **4. Event Management APIs**

### **4.1 Create Event**
```typescript
// POST /api/events
interface CreateEventRequest {
  title: string
  description: string
  category: string
  date: string
  startTime: string
  endTime: string
  location: string
  address: string
  maxAttendees: number
  price: number
  isPrivate: boolean
  trustRequirement: number
  tags: string[]
  invitedFriends?: string[]
}

interface CreateEventResponse {
  success: boolean
  event: Event
  message: string
}

export const createEvent = async (
  eventData: CreateEventRequest
): Promise<CreateEventResponse> => {
  const response = await fetch(`${API_CONFIG.baseUrl}/api/events`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify(eventData)
  })
  
  return response.json()
}
```

---

## **5. Friend System APIs**

### **5.1 Get Friends**
```typescript
// GET /api/friends
interface GetFriendsResponse {
  success: boolean
  friends: User[]
  totalCount: number
}

export const getFriends = async (): Promise<GetFriendsResponse> => {
  const response = await fetch(`${API_CONFIG.baseUrl}/api/friends`, {
    method: 'GET',
    headers: getAuthHeaders()
  })
  
  return response.json()
}
```

### **5.2 Send Friend Request**
```typescript
// POST /api/friends/requests
interface SendFriendRequestRequest {
  userId: string
  message?: string
}

interface SendFriendRequestResponse {
  success: boolean
  request: FriendRequest
  message: string
}

export const sendFriendRequest = async (
  requestData: SendFriendRequestRequest
): Promise<SendFriendRequestResponse> => {
  const response = await fetch(`${API_CONFIG.baseUrl}/api/friends/requests`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify(requestData)
  })
  
  return response.json()
}
```

---

## **6. Trust System APIs**

### **6.1 Get Trust Score**
```typescript
// GET /api/trust/score
interface GetTrustScoreResponse {
  success: boolean
  trustScore: number
  level: string
  breakdown: TrustFactors
  lastUpdated: string
  trend: 'increasing' | 'decreasing' | 'stable'
}

export const getTrustScore = async (): Promise<GetTrustScoreResponse> => {
  const response = await fetch(`${API_CONFIG.baseUrl}/api/trust/score`, {
    method: 'GET',
    headers: getAuthHeaders()
  })
  
  return response.json()
}
```

### **6.2 Update Trust Score**
```typescript
// POST /api/trust/update
interface UpdateTrustScoreRequest {
  activity: string
  metadata?: Record<string, any>
}

interface UpdateTrustScoreResponse {
  success: boolean
  oldScore: number
  newScore: number
  change: number
  factors: TrustFactors
}

export const updateTrustScore = async (
  updateData: UpdateTrustScoreRequest
): Promise<UpdateTrustScoreResponse> => {
  const response = await fetch(`${API_CONFIG.baseUrl}/api/trust/update`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify(updateData)
  })
  
  return response.json()
}
```

---

## **7. Error Handling & Response Formats**

### **7.1 Standard Error Response**
```typescript
interface APIError {
  success: false
  error: {
    code: string
    message: string
    details?: any
  }
  timestamp: string
  requestId: string
}

export const ERROR_CODES = {
  UNAUTHORIZED: 'UNAUTHORIZED',
  FORBIDDEN: 'FORBIDDEN',
  NOT_FOUND: 'NOT_FOUND',
  VALIDATION_ERROR: 'VALIDATION_ERROR',
  RATE_LIMITED: 'RATE_LIMITED',
  INTERNAL_ERROR: 'INTERNAL_ERROR',
  
  // Business logic errors
  NOT_FRIENDS: 'NOT_FRIENDS',
  INSUFFICIENT_TRUST: 'INSUFFICIENT_TRUST',
  DUPLICATE_REQUEST: 'DUPLICATE_REQUEST',
  EVENT_FULL: 'EVENT_FULL',
  ALREADY_ATTENDED: 'ALREADY_ATTENDED'
}
```

### **7.2 API Client with Error Handling**
```typescript
// lib/api/client.ts
export class APIClient {
  private baseUrl: string
  private timeout: number

  constructor(config: { baseUrl: string; timeout?: number }) {
    this.baseUrl = config.baseUrl
    this.timeout = config.timeout || 10000
  }

  async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), this.timeout)

    try {
      const response = await fetch(`${this.baseUrl}${endpoint}`, {
        ...options,
        headers: {
          ...getAuthHeaders(),
          ...options.headers
        },
        signal: controller.signal
      })

      clearTimeout(timeoutId)

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new APIError(
          errorData.error?.code || 'UNKNOWN_ERROR',
          errorData.error?.message || `HTTP ${response.status}`,
          response.status,
          errorData.error?.details
        )
      }

      return response.json()
    } catch (error) {
      clearTimeout(timeoutId)
      
      if (error.name === 'AbortError') {
        throw new APIError('TIMEOUT', 'Request timed out', 408)
      }
      
      throw error
    }
  }

  get<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, { method: 'GET' })
  }

  post<T>(endpoint: string, data?: any): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'POST',
      body: data ? JSON.stringify(data) : undefined
    })
  }

  put<T>(endpoint: string, data?: any): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'PUT',
      body: data ? JSON.stringify(data) : undefined
    })
  }

  delete<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, { method: 'DELETE' })
  }
}

export const apiClient = new APIClient({
  baseUrl: API_CONFIG.baseUrl,
  timeout: API_CONFIG.timeout
})
```

---

## **Conclusion**

This API documentation provides complete specifications for:

✅ **All endpoint definitions** with request/response formats
✅ **Authentication and authorization** patterns  
✅ **Error handling** with standard error codes
✅ **TypeScript interfaces** for type safety
✅ **Real-world implementation** examples

Combined with the Implementation Guide and Architecture documents, this enables complete API integration and platform reconstruction.

---

*API Documentation Version: 1.0*
*Last Updated: January 2025*
*© 2025 Scoop Technologies LLC* 