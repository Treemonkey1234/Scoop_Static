# Scoop Social MVP API Endpoints

## Base URL Structure
```
Production: https://api.scoopsocial.com/v1
Development: http://localhost:3001/api/v1
```

## Authentication
- All protected endpoints require `Authorization: Bearer <jwt_token>` header
- JWT tokens provided by Auth0
- User ID extracted from Auth0 token claims

---

## **1. Authentication & User Management**

### **POST /auth/signup**
Create new user account (called after Auth0 registration)
```json
// Request
{
  "auth0UserId": "auth0|123abc",
  "email": "user@example.com",
  "name": "John Doe",
  "avatar": "https://auth0.com/avatar.jpg"
}

// Response (201)
{
  "success": true,
  "user": {
    "id": 1,
    "auth0UserId": "auth0|123abc",
    "email": "user@example.com",
    "name": "John Doe",
    "trustScore": 50,
    "isVerified": false,
    "createdAt": "2024-12-27T10:00:00Z"
  }
}
```

### **GET /auth/me**
Get current user profile
```json
// Response (200)
{
  "success": true,
  "user": {
    "id": 1,
    "email": "user@example.com",
    "name": "John Doe",
    "username": "johndoe",
    "avatar": "https://example.com/avatar.jpg",
    "bio": "Software developer from Phoenix",
    "location": "Phoenix, AZ",
    "trustScore": 75,
    "isVerified": true,
    "phoneVerified": true,
    "emailVerified": true,
    "friendsCount": 12,
    "reviewsCount": 8,
    "eventsAttended": 15,
    "eventsHosted": 3,
    "badges": ["Tech Expert", "Event Host"],
    "interests": ["Technology", "Networking"],
    "socialAccounts": [
      {
        "platform": "twitter",
        "username": "@johndoe",
        "verified": true
      }
    ],
    "createdAt": "2024-12-01T10:00:00Z"
  }
}
```

### **PUT /auth/me**
Update current user profile
```json
// Request
{
  "name": "John Doe",
  "bio": "Updated bio",
  "location": "Phoenix, AZ",
  "interests": ["Technology", "Networking", "Startups"]
}

// Response (200)
{
  "success": true,
  "user": { /* updated user object */ }
}
```

---

## **2. Social Account Management**

### **POST /social-accounts**
Connect a social media account
```json
// Request
{
  "platform": "twitter",
  "oauthToken": "encrypted_token",
  "platformUserId": "123456789",
  "username": "@johndoe",
  "displayName": "John Doe",
  "verified": true,
  "followerCount": 1500
}

// Response (201)
{
  "success": true,
  "account": {
    "id": 1,
    "platform": "twitter",
    "username": "@johndoe",
    "verified": true,
    "trustContribution": 5,
    "authenticityScore": 92
  }
}
```

### **GET /social-accounts**
Get user's connected social accounts
```json
// Response (200)
{
  "success": true,
  "accounts": [
    {
      "id": 1,
      "platform": "twitter",
      "username": "@johndoe",
      "verified": true,
      "followerCount": 1500,
      "trustContribution": 5,
      "connectedAt": "2024-12-01T10:00:00Z"
    }
  ]
}
```

### **DELETE /social-accounts/:id**
Disconnect a social media account
```json
// Response (200)
{
  "success": true,
  "message": "Social account disconnected"
}
```

---

## **3. Friends & Relationships**

### **GET /friends**
Get user's friend list
```json
// Query params: ?status=accepted&limit=20&offset=0
// Response (200)
{
  "success": true,
  "friends": [
    {
      "id": 2,
      "name": "Jane Smith",
      "username": "janesmith",
      "avatar": "https://example.com/jane.jpg",
      "trustScore": 88,
      "mutualFriends": 5,
      "friendsSince": "2024-11-15T10:00:00Z"
    }
  ],
  "pagination": {
    "total": 25,
    "limit": 20,
    "offset": 0,
    "hasMore": true
  }
}
```

### **POST /friends/request**
Send friend request
```json
// Request
{
  "userId": 2
}

// Response (201)
{
  "success": true,
  "friendship": {
    "id": 1,
    "userId": 2,
    "status": "pending",
    "requestedAt": "2024-12-27T10:00:00Z"
  }
}
```

### **PUT /friends/:friendshipId**
Accept/decline friend request
```json
// Request
{
  "action": "accept" // or "decline"
}

// Response (200)
{
  "success": true,
  "friendship": {
    "id": 1,
    "userId": 2,
    "status": "accepted",
    "acceptedAt": "2024-12-27T10:15:00Z"
  }
}
```

### **GET /friends/requests**
Get pending friend requests
```json
// Response (200)
{
  "success": true,
  "requests": [
    {
      "id": 1,
      "user": {
        "id": 3,
        "name": "Bob Wilson",
        "avatar": "https://example.com/bob.jpg",
        "trustScore": 72,
        "mutualFriends": 2
      },
      "requestedAt": "2024-12-27T09:00:00Z"
    }
  ]
}
```

---

## **4. Reviews System**

### **GET /reviews**
Get reviews feed or user-specific reviews
```json
// Query params: ?userId=2&category=Professional&limit=20&offset=0
// Response (200)
{
  "success": true,
  "reviews": [
    {
      "id": 1,
      "reviewer": {
        "id": 2,
        "name": "Jane Smith",
        "avatar": "https://example.com/jane.jpg",
        "trustScore": 88
      },
      "reviewed": {
        "id": 3,
        "name": "Bob Wilson",
        "avatar": "https://example.com/bob.jpg"
      },
      "content": "Bob is an excellent project manager...",
      "category": "Professional",
      "tags": ["reliable", "professional", "timely"],
      "totalVotes": 15,
      "userVote": "up", // or "down" or null
      "isEventReview": false,
      "createdAt": "2024-12-27T10:00:00Z"
    }
  ],
  "pagination": { /* pagination info */ }
}
```

### **POST /reviews**
Create a new review
```json
// Request
{
  "reviewedUserId": 3,
  "content": "Bob is an excellent project manager...",
  "category": "Professional",
  "tags": ["reliable", "professional"],
  "isEventReview": false,
  "eventId": null
}

// Response (201)
{
  "success": true,
  "review": {
    "id": 1,
    "reviewedUserId": 3,
    "content": "Bob is an excellent project manager...",
    "category": "Professional",
    "totalVotes": 0,
    "createdAt": "2024-12-27T10:00:00Z"
  }
}
```

### **POST /reviews/:id/vote**
Vote on a review
```json
// Request
{
  "voteType": "up" // or "down"
}

// Response (200)
{
  "success": true,
  "review": {
    "id": 1,
    "totalVotes": 16,
    "userVote": "up"
  }
}
```

### **DELETE /reviews/:id/vote**
Remove vote from a review
```json
// Response (200)
{
  "success": true,
  "review": {
    "id": 1,
    "totalVotes": 15,
    "userVote": null
  }
}
```

---

## **5. Events System**

### **GET /events**
Get events feed
```json
// Query params: ?category=Technology&status=upcoming&location=Phoenix&limit=20
// Response (200)
{
  "success": true,
  "events": [
    {
      "id": 1,
      "title": "Phoenix Tech Meetup",
      "description": "Join us for networking...",
      "host": {
        "id": 2,
        "name": "Jane Smith",
        "avatar": "https://example.com/jane.jpg",
        "trustScore": 88
      },
      "category": "Technology",
      "eventDate": "2024-12-30",
      "startTime": "18:00:00",
      "endTime": "21:00:00",
      "locationName": "Tech Hub Phoenix",
      "address": "123 Tech St, Phoenix, AZ",
      "maxAttendees": 50,
      "currentAttendees": 23,
      "priceCents": 0,
      "trustRequirement": 60,
      "isPrivate": false,
      "status": "upcoming",
      "imageUrl": "https://example.com/event.jpg",
      "tags": ["networking", "tech", "startups"],
      "userAttendanceStatus": "registered", // or null
      "createdAt": "2024-12-20T10:00:00Z"
    }
  ]
}
```

### **POST /events**
Create a new event
```json
// Request
{
  "title": "Phoenix Tech Meetup",
  "description": "Join us for networking...",
  "category": "Technology",
  "eventDate": "2024-12-30",
  "startTime": "18:00:00",
  "endTime": "21:00:00",
  "locationName": "Tech Hub Phoenix",
  "address": "123 Tech St, Phoenix, AZ",
  "latitude": 33.4484,
  "longitude": -112.0740,
  "maxAttendees": 50,
  "priceCents": 0,
  "trustRequirement": 60,
  "isPrivate": false,
  "tags": ["networking", "tech"]
}

// Response (201)
{
  "success": true,
  "event": { /* created event object */ }
}
```

### **GET /events/:id**
Get specific event details
```json
// Response (200)
{
  "success": true,
  "event": { /* event details */ },
  "attendees": [
    {
      "id": 2,
      "name": "Jane Smith",
      "avatar": "https://example.com/jane.jpg",
      "trustScore": 88,
      "status": "registered",
      "registeredAt": "2024-12-25T10:00:00Z"
    }
  ]
}
```

### **POST /events/:id/attend**
Register for an event
```json
// Response (200)
{
  "success": true,
  "attendance": {
    "eventId": 1,
    "status": "registered",
    "registeredAt": "2024-12-27T10:00:00Z"
  }
}
```

### **DELETE /events/:id/attend**
Cancel event registration
```json
// Response (200)
{
  "success": true,
  "message": "Event registration cancelled"
}
```

---

## **6. Trust Score System**

### **GET /trust-score/history**
Get user's trust score history
```json
// Response (200)
{
  "success": true,
  "history": [
    {
      "id": 1,
      "oldScore": 72,
      "newScore": 75,
      "changeAmount": 3,
      "activityType": "review_received",
      "activityDescription": "Received positive review from Jane Smith",
      "relatedUser": {
        "id": 2,
        "name": "Jane Smith"
      },
      "createdAt": "2024-12-27T10:00:00Z"
    }
  ]
}
```

### **GET /trust-score/breakdown**
Get trust score breakdown and factors
```json
// Response (200)
{
  "success": true,
  "breakdown": {
    "currentScore": 75,
    "factors": {
      "baseScore": 50,
      "reviewsReceived": 15,
      "socialAccountsConnected": 8,
      "eventParticipation": 5,
      "phoneVerification": 10,
      "penalties": -3
    },
    "recommendations": [
      "Connect more social accounts for +2 points each",
      "Get phone verified for +10 points",
      "Attend more events for trust building"
    ]
  }
}
```

---

## **7. Notifications System**

### **GET /notifications**
Get user notifications
```json
// Query params: ?unread=true&limit=20&offset=0
// Response (200)
{
  "success": true,
  "notifications": [
    {
      "id": 1,
      "type": "friend_request",
      "title": "New Friend Request",
      "message": "Bob Wilson sent you a friend request",
      "relatedUser": {
        "id": 3,
        "name": "Bob Wilson",
        "avatar": "https://example.com/bob.jpg"
      },
      "isRead": false,
      "createdAt": "2024-12-27T09:00:00Z"
    }
  ],
  "unreadCount": 5
}
```

### **PUT /notifications/:id/read**
Mark notification as read
```json
// Response (200)
{
  "success": true,
  "message": "Notification marked as read"
}
```

### **PUT /notifications/read-all**
Mark all notifications as read
```json
// Response (200)
{
  "success": true,
  "message": "All notifications marked as read"
}
```

---

## **8. Search & Discovery**

### **GET /search/users**
Search for users
```json
// Query params: ?q=john&location=Phoenix&trustScore=70&limit=20
// Response (200)
{
  "success": true,
  "users": [
    {
      "id": 1,
      "name": "John Doe",
      "username": "johndoe",
      "avatar": "https://example.com/john.jpg",
      "bio": "Software developer",
      "location": "Phoenix, AZ",
      "trustScore": 75,
      "mutualFriends": 3,
      "connectionStatus": "not_connected" // or "friends", "pending", "blocked"
    }
  ]
}
```

### **GET /search/events**
Search for events
```json
// Query params: ?q=tech&category=Technology&date=2024-12-30&location=Phoenix
// Response (200)
{
  "success": true,
  "events": [ /* array of event objects */ ]
}
```

---

## **9. Real-time WebSocket Events**

### Connection
```javascript
// Connect to WebSocket
const socket = io('ws://localhost:3001', {
  auth: {
    token: 'jwt_token_here'
  }
});
```

### Events Emitted by Server
```javascript
// New friend request received
socket.on('friend_request_received', (data) => {
  // data: { friendshipId, user: { id, name, avatar } }
});

// Friend request accepted
socket.on('friend_request_accepted', (data) => {
  // data: { friendshipId, user: { id, name, avatar } }
});

// New review received
socket.on('review_received', (data) => {
  // data: { reviewId, reviewer: { id, name, avatar }, content, category }
});

// Trust score updated
socket.on('trust_score_updated', (data) => {
  // data: { oldScore, newScore, reason, activityType }
});

// Event attendance updated
socket.on('event_attendance_updated', (data) => {
  // data: { eventId, currentAttendees, maxAttendees }
});

// New notification
socket.on('notification', (data) => {
  // data: { id, type, title, message, createdAt }
});
```

### Events Emitted by Client
```javascript
// Join event room for real-time updates
socket.emit('join_event', { eventId: 1 });

// Leave event room
socket.emit('leave_event', { eventId: 1 });

// Update user status
socket.emit('update_status', { status: 'online' });
```

---

## **10. File Upload**

### **POST /upload/avatar**
Upload user avatar
```json
// Form data: file (image)
// Response (200)
{
  "success": true,
  "avatarUrl": "https://cdn.scoopsocial.com/avatars/user-1-avatar.jpg"
}
```

### **POST /upload/event-image**
Upload event image
```json
// Form data: file (image), eventId
// Response (200)
{
  "success": true,
  "imageUrl": "https://cdn.scoopsocial.com/events/event-1-image.jpg"
}
```

---

## **Error Response Format**

All error responses follow this format:
```json
{
  "success": false,
  "error": {
    "code": "INVALID_INPUT",
    "message": "The provided email is already in use",
    "details": {
      "field": "email",
      "value": "user@example.com"
    }
  },
  "timestamp": "2024-12-27T10:00:00Z"
}
```

### Common Error Codes
- `UNAUTHORIZED` (401) - Invalid or missing authentication
- `FORBIDDEN` (403) - Insufficient permissions
- `NOT_FOUND` (404) - Resource not found
- `VALIDATION_ERROR` (400) - Invalid input data
- `TRUST_SCORE_TOO_LOW` (403) - User doesn't meet trust requirements
- `FRIENDSHIP_REQUIRED` (403) - Action requires friendship
- `RATE_LIMIT_EXCEEDED` (429) - Too many requests

---

## **Response Headers**

All API responses include:
```
X-RateLimit-Limit: 1000
X-RateLimit-Remaining: 999
X-RateLimit-Reset: 1640635200
Content-Type: application/json
``` 