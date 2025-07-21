# Sentry Error Tracking Setup Guide

## 🎯 What is Sentry Error Tracking?

**Sentry** is a real-time error monitoring and performance tracking platform that helps you catch, monitor, and fix issues in your application before they affect users.

### **Think of Sentry as Your Digital Safety Net:**
```
Without Sentry:
User encounters error → User gets frustrated → You never know what happened

With Sentry:
User encounters error → Sentry captures everything → You get instant notification → You fix it quickly
```

## 🔍 What Sentry Captures for Your MVP

### **Frontend Errors (React/Next.js)**
```javascript
// Examples of errors Sentry catches automatically:
1. JavaScript runtime errors
2. Unhandled promise rejections  
3. Network request failures
4. React component crashes
5. Auth0 connection issues
6. API call failures
```

### **Backend Errors (Node.js)**
```javascript
// Examples of errors Sentry catches:
1. Database connection failures
2. Trust score calculation errors
3. Social media API timeouts
4. Authentication failures
5. File upload issues
6. WebSocket connection problems
```

### **Performance Monitoring**
```javascript
// Sentry also tracks:
- API response times
- Database query performance
- Frontend page load speeds
- Trust score calculation times
- Social account verification speeds
```

## 💡 Why Sentry is Essential for Your MVP

### **1. Beta Testing Benefits**
```
With 100-500 beta users, you WILL have issues:
✅ Sentry catches errors you'd never see in testing
✅ Shows which features are causing problems
✅ Identifies which browsers/devices have issues
✅ Tracks user actions leading to errors
```

### **2. Trust Score Reliability**
```
Trust scores are critical to your platform:
✅ Monitor social media API failures
✅ Track database calculation errors  
✅ Alert on Auth0 connection issues
✅ Ensure real-time updates work correctly
```

### **3. User Experience**
```
Beta users expect quality:
✅ Fix issues before users report them
✅ Proactive problem resolution
✅ Data-driven prioritization of bug fixes
✅ Performance optimization insights
```

## 📋 Sentry Setup Process

### **Step 1: Create Sentry Account (Free)**

1. **Go to [https://sentry.io](https://sentry.io)**
2. **Sign up with GitHub** (recommended for easy integration)
3. **Create Organization**: "Scoop Social"
4. **Create Two Projects**:
   ```
   Project 1: scoop-social-frontend (React/Next.js)
   Project 2: scoop-social-backend (Node.js/Express)
   ```

### **Step 2: Get Sentry DSN Keys**

**After creating projects, you'll get DSN URLs:**

```bash
# Frontend DSN (for React errors)
Frontend DSN: https://abc123@o12345.ingest.sentry.io/67890

# Backend DSN (for Node.js errors)  
Backend DSN: https://def456@o12345.ingest.sentry.io/78901
```

### **Step 3: Update Digital Ocean Configuration**

**Replace the placeholder DSNs in your deployment YAML:**

```yaml
# Backend Sentry Configuration
- key: SENTRY_DSN
  value: https://your_backend_dsn@sentry.io/project_id
  type: SECRET
  scope: RUN_TIME

# Frontend Sentry Configuration  
- key: NEXT_PUBLIC_SENTRY_DSN
  value: https://your_frontend_dsn@sentry.io/project_id
```

## 🔧 Sentry Integration Code

### **Frontend Integration (Next.js)**

**Create `sentry.client.config.js`:**
```javascript
import * as Sentry from "@sentry/nextjs";

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  environment: process.env.NEXT_PUBLIC_SENTRY_ENVIRONMENT || 'production',
  
  // Performance monitoring
  tracesSampleRate: 0.1, // 10% of transactions
  
  // Session replay (captures user interactions)
  replaysSessionSampleRate: 0.1, // 10% of sessions
  replaysOnErrorSampleRate: 1.0, // 100% of error sessions
  
  // Custom error filtering
  beforeSend(event) {
    // Don't send Auth0 development errors
    if (event.exception?.values?.[0]?.value?.includes('auth0-dev')) {
      return null;
    }
    return event;
  }
});
```

**Create `sentry.server.config.js`:**
```javascript
import * as Sentry from "@sentry/nextjs";

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  environment: process.env.NEXT_PUBLIC_SENTRY_ENVIRONMENT || 'production',
  tracesSampleRate: 0.1,
});
```

### **Backend Integration (Node.js)**

**In your main `app.js` or `index.js`:**
```javascript
import * as Sentry from "@sentry/node";
import { nodeProfilingIntegration } from "@sentry/profiling-node";

// Initialize Sentry BEFORE importing other modules
Sentry.init({
  dsn: process.env.SENTRY_DSN,
  environment: process.env.SENTRY_ENVIRONMENT || 'production',
  release: process.env.SENTRY_RELEASE || 'scoop-social-mvp@1.0.0',
  
  // Performance monitoring
  tracesSampleRate: parseFloat(process.env.SENTRY_TRACES_SAMPLE_RATE) || 0.1,
  
  // Profiling integration
  integrations: [
    nodeProfilingIntegration(),
  ],
  
  // Custom context
  beforeSend(event) {
    // Add user context for better debugging
    if (event.user) {
      event.user.id = event.user.id || 'anonymous';
    }
    return event;
  }
});

// Express error handler (add AFTER all routes)
app.use(Sentry.Handlers.errorHandler());
```

## 🚨 Custom Error Monitoring

### **Trust Score Error Tracking**

**Wrap trust score calculations:**
```javascript
import * as Sentry from "@sentry/node";

export async function calculateTrustScore(userId) {
  const transaction = Sentry.startTransaction({
    op: "trust-score",
    name: "Calculate User Trust Score"
  });

  try {
    Sentry.setContext("user", { id: userId });
    
    const trustData = await getUserTrustData(userId);
    const calculation = calculateUserTrustScore(trustData);
    
    // Track successful calculation
    Sentry.addBreadcrumb({
      message: 'Trust score calculated successfully',
      level: 'info',
      data: { userId, newScore: calculation.totalScore }
    });
    
    return calculation;
    
  } catch (error) {
    // Sentry automatically captures the error
    Sentry.captureException(error, {
      tags: {
        component: 'trust-score',
        operation: 'calculate'
      },
      extra: { userId }
    });
    
    throw error;
  } finally {
    transaction.finish();
  }
}
```

### **Social Media Integration Monitoring**

**Track social account verification:**
```javascript
export async function verifySocialAccount(platform, userId) {
  try {
    const result = await socialMediaService.verifyAccount(platform, userId);
    
    // Track successful verification
    Sentry.addBreadcrumb({
      message: `${platform} account verified`,
      level: 'info',
      data: { platform, userId, authenticityScore: result.score }
    });
    
    return result;
    
  } catch (error) {
    // Track verification failures by platform
    Sentry.captureException(error, {
      tags: {
        component: 'social-verification',
        platform: platform,
        error_type: error.name
      },
      extra: { userId, platform }
    });
    
    throw error;
  }
}
```

## 📊 Sentry Dashboard Features

### **Error Overview**
```
Real-time error tracking:
✅ Error frequency and trends
✅ Most common errors across platform
✅ Error impact on users
✅ Resolution status tracking
```

### **Performance Monitoring** 
```
API and page performance:
✅ Slowest API endpoints
✅ Database query optimization opportunities  
✅ Frontend page load analysis
✅ Trust score calculation performance
```

### **User Context**
```
For each error, you see:
✅ User ID and profile information
✅ Actions taken before error occurred
✅ Browser, device, and location data
✅ Auth0 authentication status
```

### **Release Tracking**
```
Deploy with confidence:
✅ Error rates before/after deployments
✅ New errors introduced in releases
✅ Performance regressions
✅ Rollback recommendations
```

## 🎯 Sentry Alerting for MVP

### **Critical Error Alerts**
```javascript
// Set up alerts for:
1. Database connection failures (immediate alert)
2. Auth0 authentication errors (5+ in 10 minutes) 
3. Trust score calculation failures (immediate alert)
4. Social media API failures (10+ in 1 hour)
5. WebSocket connection issues (20+ in 30 minutes)
```

### **Performance Alerts**
```javascript
// Set up alerts for:
1. API response time > 2 seconds (10+ occurrences)
2. Trust score calculation > 5 seconds (5+ occurrences)  
3. Database query time > 1 second (20+ occurrences)
4. Frontend page load > 3 seconds (50+ occurrences)
```

## 💰 Sentry Pricing (Perfect for MVP)

### **Free Tier** (Recommended for MVP)
```
✅ 5,000 errors/month (perfect for 100-500 users)
✅ 10,000 performance transactions/month  
✅ 30-day error history
✅ Real-time alerts
✅ Slack/email integrations
✅ Basic performance monitoring
```

### **Team Tier** ($26/month - if you grow)
```
✅ 50,000 errors/month
✅ 100,000 performance transactions/month
✅ 90-day error history  
✅ Advanced performance features
✅ Session replay
✅ Custom dashboards
```

## 🚀 Quick Setup Commands

### **Install Sentry Packages**

**Frontend:**
```bash
npm install @sentry/nextjs
```

**Backend:**
```bash
npm install @sentry/node @sentry/profiling-node
```

### **Configure Environment Variables**

**In your `.env.local` (development):**
```bash
NEXT_PUBLIC_SENTRY_DSN=https://your_frontend_dsn@sentry.io/project_id
NEXT_PUBLIC_SENTRY_ENVIRONMENT=development
SENTRY_DSN=https://your_backend_dsn@sentry.io/project_id
SENTRY_ENVIRONMENT=development
```

## 🎯 Day 1 Sentry Success Metrics

**Week 1 Targets:**
- [ ] 0 unhandled errors in production
- [ ] < 2 second average API response time
- [ ] 99%+ successful trust score calculations
- [ ] 95%+ successful social account verifications

**Week 2 Targets:**
- [ ] Identify top 3 performance optimization opportunities
- [ ] Zero critical database errors
- [ ] Real-time error resolution (< 1 hour to fix)
- [ ] User experience errors < 0.1% of sessions

## 🚨 Why Sentry is Crucial for MVP Success

**Without Error Tracking:**
```
❌ Beta users encounter bugs you never see
❌ Trust score calculations fail silently
❌ Social verification errors go unnoticed
❌ Performance issues drive users away
❌ You're always reacting to problems
```

**With Sentry Error Tracking:**
```
✅ Catch issues before users complain
✅ Monitor trust score reliability in real-time
✅ Optimize social media integration performance
✅ Proactive problem solving
✅ Data-driven development decisions
```

**For a trust-based social platform like yours, reliability is everything. Sentry ensures your MVP maintains the quality that builds user confidence.** 