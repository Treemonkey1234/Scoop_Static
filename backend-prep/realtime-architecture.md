# Real-time Infrastructure Plan for Scoop Social

## Overview
This document outlines the real-time features implementation using WebSockets for instant user interaction and live updates.

## Technology Stack Decision
**Recommended: Node.js + Socket.io + Redis**
- **Socket.io**: Most mature WebSocket library with fallbacks
- **Redis**: For scaling WebSocket connections across multiple servers
- **Redis Pub/Sub**: For broadcasting messages between server instances

---

## **1. Real-time Features to Implement**

### **High Priority (MVP)**
1. **Friend Requests** - Instant notifications when received/accepted
2. **Review Notifications** - Real-time alerts when someone reviews you
3. **Trust Score Updates** - Live trust score changes
4. **Event Attendance** - Live attendee count updates
5. **General Notifications** - Friend activities, system messages

### **Medium Priority (Post-MVP)**
1. **Event Comments** - Live event discussion threads
2. **Live Event Updates** - Real-time event details changes
3. **User Presence** - Online/offline status indicators

### **Low Priority (Future)**
1. **Live Event Check-ins** - Real-time event attendance tracking
2. **Advanced User Presence** - Detailed activity status
3. **Real-time Event Reactions** - Live emoji reactions to events

---

## **2. WebSocket Connection Management**

### **Connection Authentication**
```javascript
// Client connects with JWT token
const socket = io('ws://localhost:3001', {
  auth: {
    token: localStorage.getItem('jwt_token')
  }
});

// Server validates token on connection
io.use((socket, next) => {
  const token = socket.handshake.auth.token;
  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) return next(new Error('Authentication error'));
    socket.userId = decoded.sub; // Auth0 user ID
    next();
  });
});
```

### **Connection Lifecycle**
```javascript
// When user connects
io.on('connection', (socket) => {
  console.log(`User ${socket.userId} connected`);
  
  // Store user session in database
  await storeUserSession({
    userId: socket.userId,
    socketId: socket.id,
    connectedAt: new Date(),
    isActive: true
  });
  
  // Join user to their personal room
  socket.join(`user_${socket.userId}`);
  
  // Handle disconnection
  socket.on('disconnect', () => {
    console.log(`User ${socket.userId} disconnected`);
    updateUserSession(socket.userId, { 
      isActive: false, 
      disconnectedAt: new Date() 
    });
  });
});
```

---

## **3. Real-time Event Broadcasting**

### **Friend Request System**
```javascript
// When friend request is sent
async function sendFriendRequest(fromUserId, toUserId) {
  // 1. Save to database
  const friendship = await createFriendship(fromUserId, toUserId);
  
  // 2. Send real-time notification to recipient
  io.to(`user_${toUserId}`).emit('friend_request_received', {
    friendshipId: friendship.id,
    user: {
      id: fromUserId,
      name: fromUser.name,
      avatar: fromUser.avatar,
      trustScore: fromUser.trustScore
    },
    timestamp: new Date().toISOString()
  });
  
  // 3. Create in-app notification
  await createNotification({
    userId: toUserId,
    type: 'friend_request',
    title: 'New Friend Request',
    message: `${fromUser.name} sent you a friend request`,
    relatedUserId: fromUserId
  });
}

// When friend request is accepted
async function acceptFriendRequest(friendshipId, acceptingUserId) {
  const friendship = await updateFriendship(friendshipId, { 
    status: 'accepted',
    acceptedAt: new Date()
  });
  
  // Notify the original requester
  io.to(`user_${friendship.initiatedBy}`).emit('friend_request_accepted', {
    friendshipId: friendship.id,
    user: {
      id: acceptingUserId,
      name: acceptingUser.name,
      avatar: acceptingUser.avatar
    }
  });
  
  // Update friend counts for both users (real-time)
  const [user1, user2] = await updateFriendCounts([friendship.initiatedBy, acceptingUserId]);
  
  io.to(`user_${friendship.initiatedBy}`).emit('friends_count_updated', { 
    friendsCount: user1.friendsCount 
  });
  io.to(`user_${acceptingUserId}`).emit('friends_count_updated', { 
    friendsCount: user2.friendsCount 
  });
}
```

### **Review Notifications**
```javascript
async function createReview(reviewData) {
  // 1. Save review to database
  const review = await saveReview(reviewData);
  
  // 2. Update trust score
  const oldScore = reviewData.reviewedUser.trustScore;
  const newScore = await calculateNewTrustScore(reviewData.reviewedUserId, 'review_received');
  
  // 3. Send real-time trust score update
  io.to(`user_${reviewData.reviewedUserId}`).emit('trust_score_updated', {
    oldScore,
    newScore,
    changeAmount: newScore - oldScore,
    reason: 'Received a new review',
    activityType: 'review_received',
    relatedUser: {
      id: reviewData.reviewerId,
      name: reviewData.reviewer.name
    }
  });
  
  // 4. Send review notification
  io.to(`user_${reviewData.reviewedUserId}`).emit('review_received', {
    reviewId: review.id,
    reviewer: {
      id: reviewData.reviewerId,
      name: reviewData.reviewer.name,
      avatar: reviewData.reviewer.avatar
    },
    content: review.content,
    category: review.category,
    timestamp: review.createdAt
  });
}
```

### **Event Attendance Updates**
```javascript
// Users can join event rooms for live updates
socket.on('join_event', async ({ eventId }) => {
  socket.join(`event_${eventId}`);
  
  // Send current event status
  const event = await getEvent(eventId);
  socket.emit('event_status', {
    eventId,
    currentAttendees: event.currentAttendees,
    maxAttendees: event.maxAttendees,
    status: event.status
  });
});

// When someone registers for an event
async function registerForEvent(eventId, userId) {
  const updatedEvent = await incrementEventAttendance(eventId);
  
  // Broadcast to all users watching this event
  io.to(`event_${eventId}`).emit('event_attendance_updated', {
    eventId,
    currentAttendees: updatedEvent.currentAttendees,
    maxAttendees: updatedEvent.maxAttendees,
    newAttendee: {
      id: userId,
      name: user.name,
      avatar: user.avatar
    }
  });
}
```

---

## **4. Scaling Real-time Infrastructure**

### **Redis Pub/Sub for Multi-Server Scaling**
```javascript
// Redis adapter for Socket.io (allows multiple server instances)
const RedisAdapter = require('socket.io-redis');
const redis = require('redis');

const pubClient = redis.createClient({ host: 'localhost', port: 6379 });
const subClient = pubClient.duplicate();

io.adapter(RedisAdapter(pubClient, subClient));
```

### **Real-time Broadcasting Architecture**
```
┌─────────────────────────────────────────────────────────────┐
│                    Load Balancer                            │
├─────────────────────────────────────────────────────────────┤
│  ┌─────────────┐    ┌─────────────┐    ┌─────────────┐     │
│  │   Server 1  │    │   Server 2  │    │   Server 3  │     │
│  │ WebSocket   │    │ WebSocket   │    │ WebSocket   │     │
│  │ Instances   │    │ Instances   │    │ Instances   │     │
│  └─────────────┘    └─────────────┘    └─────────────┘     │
├─────────────────────────────────────────────────────────────┤
│                    Redis Pub/Sub                           │
│              (Notification Broadcasting)                    │
├─────────────────────────────────────────────────────────────┤
│                  PostgreSQL Database                       │
│              (Persistent Storage)                           │
└─────────────────────────────────────────────────────────────┘
```

### **Notification Queuing for Reliability**
```javascript
// Use Redis for notification queuing to handle high load
const Queue = require('bull');
const notificationQueue = new Queue('notification processing');

// Add notification to queue instead of processing immediately
notificationQueue.add('send_notification', {
  userId: 123,
  type: 'friend_request',
  data: { /* notification data */ }
});

// Process notifications from queue
notificationQueue.process('send_notification', async (job) => {
  const { userId, type, data } = job.data;
  
  // Send real-time notification
  io.to(`user_${userId}`).emit(type, data);
  
  // Save to database
  await createNotification({ userId, type, ...data });
});
```

---

## **5. Connection Management & Performance**

### **Connection Pooling**
```javascript
// Limit connections per user (prevent abuse)
const userConnections = new Map();

io.on('connection', (socket) => {
  const userId = socket.userId;
  
  if (!userConnections.has(userId)) {
    userConnections.set(userId, new Set());
  }
  
  const userSockets = userConnections.get(userId);
  
  // Limit to 3 connections per user
  if (userSockets.size >= 3) {
    socket.emit('error', { message: 'Too many connections' });
    socket.disconnect();
    return;
  }
  
  userSockets.add(socket.id);
  
  socket.on('disconnect', () => {
    userSockets.delete(socket.id);
    if (userSockets.size === 0) {
      userConnections.delete(userId);
    }
  });
});
```

### **Action Rate Limiting**
```javascript
// Rate limit user actions (friend requests, reviews, etc.)
const rateLimiter = require('express-rate-limit');
const socketRateLimiter = new Map();

socket.on('user_action', (data) => {
  const userId = socket.userId;
  const now = Date.now();
  
  if (!socketRateLimiter.has(userId)) {
    socketRateLimiter.set(userId, { count: 0, resetTime: now + 60000 });
  }
  
  const userLimit = socketRateLimiter.get(userId);
  
  if (now > userLimit.resetTime) {
    userLimit.count = 0;
    userLimit.resetTime = now + 60000;
  }
  
  if (userLimit.count >= 30) { // 30 actions per minute
    socket.emit('rate_limit_exceeded');
    return;
  }
  
  userLimit.count++;
  // Process action...
});
```

---

## **6. Error Handling & Fallbacks**

### **Connection Recovery**
```javascript
// Client-side connection recovery
const socket = io('ws://localhost:3001', {
  auth: { token: getToken() },
  transports: ['websocket', 'polling'], // Fallback to polling if WebSocket fails
  timeout: 5000,
  reconnection: true,
  reconnectionAttempts: 5,
  reconnectionDelay: 1000
});

socket.on('connect', () => {
  console.log('Connected to server');
  // Re-join rooms after reconnection
  socket.emit('rejoin_rooms');
});

socket.on('disconnect', (reason) => {
  console.log('Disconnected:', reason);
  if (reason === 'io server disconnect') {
    // Server forced disconnect, manual reconnection required
    socket.connect();
  }
});
```

### **Offline Action Queuing**
```javascript
// Queue user actions when offline, send when reconnected
class OfflineQueue {
  constructor() {
    this.queue = [];
    this.isOnline = navigator.onLine;
    
    window.addEventListener('online', () => {
      this.isOnline = true;
      this.flushQueue();
    });
    
    window.addEventListener('offline', () => {
      this.isOnline = false;
    });
  }
  
  emit(event, data) {
    if (this.isOnline && socket.connected) {
      socket.emit(event, data);
    } else {
      // Queue actions like friend requests, review votes, event registrations
      this.queue.push({ event, data, timestamp: Date.now() });
    }
  }
  
  flushQueue() {
    while (this.queue.length > 0) {
      const { event, data } = this.queue.shift();
      socket.emit(event, data);
    }
  }
}
```

---

## **7. Monitoring & Analytics**

### **Real-time Metrics**
```javascript
// Track WebSocket metrics
const metrics = {
  activeConnections: 0,
  notificationsSent: 0,
  userActionsReceived: 0,
  averageLatency: 0
};

io.on('connection', (socket) => {
  metrics.activeConnections++;
  
  socket.on('disconnect', () => {
    metrics.activeConnections--;
  });
  
  // Track user actions
  socket.on('user_action', () => {
    metrics.userActionsReceived++;
  });
  
  // Measure latency
  socket.on('ping', (timestamp) => {
    const latency = Date.now() - timestamp;
    metrics.averageLatency = (metrics.averageLatency + latency) / 2;
    socket.emit('pong', { latency });
  });
});

// Expose metrics endpoint
app.get('/metrics', (req, res) => {
  res.json(metrics);
});
```

---

## **8. Digital Ocean Deployment Setup**

### **App Platform Configuration**
```yaml
# .do/app.yaml
name: scoop-social-realtime
services:
- name: websocket-server
  source_dir: /
  github:
    repo: your-repo/scoop-social-backend
    branch: main
  run_command: npm start
  environment_slug: node-js
  instance_count: 2
  instance_size_slug: basic-xxs
  http_port: 3001
  envs:
  - key: NODE_ENV
    value: production
  - key: REDIS_URL
    value: ${redis.DATABASE_URL}
  - key: DATABASE_URL
    value: ${db.DATABASE_URL}

databases:
- name: db
  engine: PG
  version: "15"
  
- name: redis
  engine: REDIS
  version: "7"
```

### **Infrastructure Costs (Digital Ocean)**
```
WebSocket Servers (2x Basic): $12/month
PostgreSQL Database: $15/month  
Redis Cache: $10/month
Load Balancer: $12/month
Total: ~$49/month (within budget)
```

---

## **9. Implementation Timeline**

### **Week 1: Core Infrastructure**
- Set up basic WebSocket server with Socket.io
- Implement authentication and connection management
- Create database session tracking

### **Week 2: Friend System Real-time**
- Friend request notifications
- Friend acceptance notifications
- Live friend count updates

### **Week 3: Review & Trust Score Real-time**
- Review notifications
- Trust score updates
- Voting notifications

### **Week 4: Event Real-time**
- Event attendance updates
- Event status changes
- Live attendee lists

### **Week 5: Scaling & Polish**
- Redis pub/sub implementation
- Rate limiting and security
- Error handling and fallbacks

This real-time infrastructure will provide instant feedback and engagement, making the platform feel responsive and alive! 