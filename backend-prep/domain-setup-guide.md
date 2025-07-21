# Domain Setup Guide for Scoop Social MVP

## 🎯 Recommended Subdomain Architecture

### Current vs MVP Setup
```
Current: https://scoopsocials.com (marketing/demo site)
         ↓
MVP:     https://app.scoopsocials.com (main application)
         https://api.scoopsocials.com (backend API)
```

## 📋 DNS Configuration Steps

### Step 1: Create Subdomain DNS Records

**In your domain registrar's DNS panel (where ScoopSocials.com is managed):**

1. **API Subdomain (Backend)**
   ```
   Type: CNAME
   Name: api
   Value: scoop-social-api-xxxx.ondigitalocean.app
   TTL: 300 (5 minutes)
   ```

2. **App Subdomain (Frontend)**
   ```
   Type: CNAME
   Name: app  
   Value: scoop-social-frontend-xxxx.ondigitalocean.app
   TTL: 300 (5 minutes)
   ```

**Note:** Replace `xxxx` with your actual Digital Ocean app hash (you'll get this after deployment)

### Step 2: Digital Ocean Domain Configuration

**In Digital Ocean App Platform:**

1. **Navigate to your deployed app**
2. **Go to Settings → Domains**
3. **Add Custom Domain:**
   ```
   Domain: api.scoopsocials.com
   Type: Primary
   Certificate: Let's Encrypt (automatic)
   ```
4. **Add Second Domain:**
   ```
   Domain: app.scoopsocials.com  
   Type: Primary
   Certificate: Let's Encrypt (automatic)
   ```

### Step 3: SSL Certificate Verification

**Digital Ocean will automatically:**
- Generate Let's Encrypt SSL certificates
- Verify domain ownership via DNS challenge
- Redirect HTTP to HTTPS
- Auto-renew certificates

**Verification Process:**
1. DNS propagation: 5-15 minutes
2. SSL generation: 2-5 minutes  
3. Total setup time: ~20 minutes

## 🔄 Domain Routing Strategy

### Traffic Flow
```
User Request Flow:
app.scoopsocials.com → Frontend (Next.js App)
                    ↓
                    Calls API
                    ↓
api.scoopsocials.com → Backend (Node.js API)
                    ↓
                    WebSocket Connection
                    ↓
api.scoopsocials.com/socket.io → Real-time Features
```

### URL Structure
```
Frontend URLs:
https://app.scoopsocials.com/           # Home page
https://app.scoopsocials.com/profile    # User profile
https://app.scoopsocials.com/events     # Events page
https://app.scoopsocials.com/discover   # Discover page

Backend API URLs:
https://api.scoopsocials.com/api/v1/users      # User endpoints
https://api.scoopsocials.com/api/v1/events     # Event endpoints  
https://api.scoopsocials.com/api/v1/reviews    # Review endpoints
https://api.scoopsocials.com/socket.io         # WebSocket connection
```

## 🛡️ Security Benefits

### CORS Configuration
```javascript
// Backend automatically configured for:
const allowedOrigins = [
  'https://app.scoopsocials.com',      // MVP frontend
  'https://scoopsocials.com',          // Current marketing site
  'https://www.scoopsocials.com',      // WWW redirect
  'http://localhost:3000',             // Development frontend
  'http://localhost:3001'              // Development backend
];
```

### SSL/TLS Security
- **TLS 1.2 minimum** (modern security standards)
- **HSTS headers** (HTTP Strict Transport Security)
- **Automatic redirects** (HTTP → HTTPS)
- **Certificate pinning** ready for production

## 🔧 Alternative Domain Options

### Option 2: Use ScoopSocials.online (if preferred)
```
Primary MVP: https://scoopsocials.online
API Backend: https://api.scoopsocials.online
```

**Pros:**
- Completely separate from main marketing site
- Easy to manage separately
- Clear beta/testing environment designation

**Cons:**
- Separate domain to manage
- No SEO benefit linking to main domain
- Users might be confused by different domain

### Option 3: Path-based routing (not recommended)
```
App: https://scoopsocials.com/app
API: https://scoopsocials.com/api
```

**Why not recommended:**
- Complex routing configuration
- Potential conflicts with existing site
- Harder to scale backend independently
- SSL certificate complexity

## 🚀 Deployment Integration

### Digital Ocean App Platform Configuration

**The deployment YAML is already configured for subdomains:**

```yaml
# Automatic domain mapping
domains:
  - domain: api.scoopsocials.com
    type: PRIMARY
    certificate:
      type: LETS_ENCRYPT
  
  - domain: app.scoopsocials.com
    type: PRIMARY  
    certificate:
      type: LETS_ENCRYPT

# Ingress routing
ingress:
  rules:
    - match:
        path:
          prefix: /api
      component:
        name: scoop-social-api
    
    - match:
        path:
          prefix: /socket.io
      component:
        name: scoop-social-api
    
    - match:
        path:
          prefix: /
      component:
        name: scoop-social-frontend
```

### Environment Variables Auto-configured

**Frontend:**
```bash
NEXT_PUBLIC_API_URL=https://api.scoopsocials.com/api/v1
NEXT_PUBLIC_WS_URL=https://api.scoopsocials.com
AUTH0_BASE_URL=https://app.scoopsocials.com
```

**Backend:**
```bash
API_BASE_URL=https://api.scoopsocials.com
FRONTEND_URL=https://app.scoopsocials.com
CORS_ORIGINS=https://app.scoopsocials.com,https://scoopsocials.com
```

## 📊 Testing Your Domain Setup

### Step 1: DNS Propagation Check
```bash
# Check if DNS records are propagated
nslookup api.scoopsocials.com
nslookup app.scoopsocials.com

# Expected response:
# api.scoopsocials.com canonical name = scoop-social-api-xxxx.ondigitalocean.app
# app.scoopsocials.com canonical name = scoop-social-frontend-xxxx.ondigitalocean.app
```

### Step 2: SSL Certificate Verification
```bash
# Check SSL certificate
curl -I https://api.scoopsocials.com
curl -I https://app.scoopsocials.com

# Expected response headers:
# HTTP/2 200
# server: nginx
# strict-transport-security: max-age=31536000
```

### Step 3: Application Health Check
```bash
# Test API health endpoint
curl https://api.scoopsocials.com/api/v1/health

# Expected response:
# {"status":"healthy","timestamp":"2024-01-XX","services":{"database":"connected","redis":"connected"}}
```

### Step 4: Frontend Accessibility
```bash
# Test frontend loads
curl -I https://app.scoopsocials.com

# Expected response:
# HTTP/2 200
# content-type: text/html
```

## 🎯 Final Domain Architecture

**Production Setup:**
```
Marketing Site: https://scoopsocials.com (unchanged)
                ↓
                "Try Beta" button links to:
                ↓  
MVP Application: https://app.scoopsocials.com
                ↓
                Connects to:
                ↓
Backend API: https://api.scoopsocials.com
```

**Development/Staging:**
```bash
# Local development still works:
Frontend: http://localhost:3000
Backend: http://localhost:3001

# Staging environment (optional):
Frontend: https://staging-app.scoopsocials.com  
Backend: https://staging-api.scoopsocials.com
```

This subdomain approach gives you the cleanest, most professional, and most scalable architecture for your MVP while preserving your existing marketing site. 