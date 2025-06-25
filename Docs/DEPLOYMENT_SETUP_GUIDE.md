# 🚀 ScoopSocials Deployment Setup Guide

## **Complete Production Deployment & Configuration Guide**

This guide provides step-by-step instructions for deploying the ScoopSocials platform to production environments with proper configurations, security, and monitoring.

---

## **1. Environment Setup**

### **1.1 Environment Variables**
```bash
# .env.production
# Application Configuration
NEXT_PUBLIC_API_URL=https://api.scoopsocials.com
NEXT_PUBLIC_APP_URL=https://scoopsocials.com
NODE_ENV=production

# Database Configuration
DATABASE_URL=postgresql://username:password@localhost:5432/scoopsocials_prod
REDIS_URL=redis://localhost:6379

# Authentication (Auth0)
AUTH0_SECRET=your-auth0-secret-here
AUTH0_BASE_URL=https://scoopsocials.com
AUTH0_ISSUER_BASE_URL=https://your-tenant.auth0.com
AUTH0_CLIENT_ID=your-auth0-client-id
AUTH0_CLIENT_SECRET=your-auth0-client-secret

# Social Media API Keys
TWITTER_API_KEY=your-twitter-api-key
TWITTER_API_SECRET=your-twitter-api-secret
INSTAGRAM_CLIENT_ID=your-instagram-client-id
INSTAGRAM_CLIENT_SECRET=your-instagram-client-secret
LINKEDIN_CLIENT_ID=your-linkedin-client-id
LINKEDIN_CLIENT_SECRET=your-linkedin-client-secret

# File Storage
AWS_ACCESS_KEY_ID=your-aws-access-key
AWS_SECRET_ACCESS_KEY=your-aws-secret-key
AWS_S3_BUCKET=scoopsocials-assets
AWS_REGION=us-east-1

# Email Service
SENDGRID_API_KEY=your-sendgrid-api-key
FROM_EMAIL=noreply@scoopsocials.com

# Monitoring & Analytics
SENTRY_DSN=your-sentry-dsn
GOOGLE_ANALYTICS_ID=GA-XXXXXXXXX
```

### **1.2 Next.js Configuration**
```javascript
// next.config.js
/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  
  // Image optimization
  images: {
    domains: [
      'images.unsplash.com',
      'platform-lookaside.fbsbx.com',
      'pbs.twimg.com',
      'media.licdn.com',
      's3.amazonaws.com',
      'scoopsocials-assets.s3.amazonaws.com'
    ],
    formats: ['image/webp', 'image/avif'],
  },
  
  // Performance optimizations
  experimental: {
    optimizeCss: true,
    optimizeImages: true,
  },
  
  // Security headers
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Referrer-Policy',
            value: 'origin-when-cross-origin',
          },
          {
            key: 'Content-Security-Policy',
            value: "default-src 'self'; script-src 'self' 'unsafe-eval' 'unsafe-inline' *.googletagmanager.com; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self' data:; connect-src 'self' *.auth0.com *.sentry.io;"
          }
        ],
      },
    ]
  },
  
  // Redirects for SEO
  async redirects() {
    return [
      {
        source: '/home',
        destination: '/',
        permanent: true,
      },
    ]
  },
}

module.exports = nextConfig
```

---

## **2. Vercel Deployment**

### **2.1 Vercel Project Setup**
```bash
# Install Vercel CLI
npm i -g vercel

# Login to Vercel
vercel login

# Initialize project
vercel init

# Deploy to production
vercel --prod
```

### **2.2 Vercel Configuration**
```json
{
  "version": 2,
  "builds": [
    {
      "src": "package.json",
      "use": "@vercel/next"
    }
  ],
  "env": {
    "NODE_ENV": "production"
  },
  "functions": {
    "app/api/**/*.ts": {
      "maxDuration": 10
    }
  },
  "regions": ["iad1"],
  "github": {
    "enabled": true,
    "autoAlias": false
  }
}
```

### **2.3 Environment Variables Setup**
```bash
# Set production environment variables
vercel env add DATABASE_URL production
vercel env add AUTH0_SECRET production
vercel env add AUTH0_CLIENT_ID production
vercel env add AUTH0_CLIENT_SECRET production
vercel env add AWS_ACCESS_KEY_ID production
vercel env add AWS_SECRET_ACCESS_KEY production

# Bulk import from .env file
vercel env pull .env.production
```

---

## **3. Database Setup (PostgreSQL)**

### **3.1 Production Database Configuration**
```sql
-- Create production database
CREATE DATABASE scoopsocials_prod;

-- Create dedicated user
CREATE USER scoopsocials_app WITH PASSWORD 'secure_production_password';

-- Grant permissions
GRANT CONNECT ON DATABASE scoopsocials_prod TO scoopsocials_app;
GRANT ALL PRIVILEGES ON DATABASE scoopsocials_prod TO scoopsocials_app;

-- Enable required extensions
\c scoopsocials_prod;
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";
```

### **3.2 Database Migration Script**
```bash
#!/bin/bash
# scripts/deploy_database.sh

# Configuration
DB_HOST="your-db-host"
DB_NAME="scoopsocials_prod"
DB_USER="scoopsocials_app"
MIGRATIONS_DIR="./migrations"

echo "Starting database deployment..."

# Run migrations in order
for migration in $MIGRATIONS_DIR/*.sql; do
  echo "Running migration: $migration"
  psql -h $DB_HOST -U $DB_USER -d $DB_NAME -f $migration
  
  if [ $? -eq 0 ]; then
    echo "✅ Migration completed: $migration"
  else
    echo "❌ Migration failed: $migration"
    exit 1
  fi
done

echo "Database deployment completed successfully!"
```

### **3.3 Connection Pool Configuration**
```typescript
// lib/database/pool.ts
import { Pool } from 'pg'

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
  max: 20, // Maximum number of clients
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
  maxUses: 7500, // Close connection after 7500 uses
})

// Graceful shutdown
process.on('SIGINT', () => {
  pool.end(() => {
    console.log('Database pool has ended')
    process.exit(0)
  })
})

export default pool
```

---

## **4. Redis Setup (Caching)**

### **4.1 Redis Configuration**
```bash
# redis.conf
# Network
bind 127.0.0.1 ::1
port 6379
protected-mode yes

# Memory
maxmemory 256mb
maxmemory-policy allkeys-lru

# Persistence
save 900 1
save 300 10
save 60 10000

# Security
requirepass your-redis-password

# Logging
loglevel notice
logfile /var/log/redis/redis-server.log
```

### **4.2 Redis Client Setup**
```typescript
// lib/cache/redis.ts
import Redis from 'ioredis'

const redis = new Redis(process.env.REDIS_URL, {
  retryDelayOnFailover: 100,
  enableOfflineQueue: false,
  maxRetriesPerRequest: 3,
  lazyConnect: true,
})

redis.on('connect', () => {
  console.log('✅ Redis connected')
})

redis.on('error', (err) => {
  console.error('❌ Redis connection error:', err)
})

export default redis
```

---

## **5. CDN & File Storage**

### **5.1 AWS S3 Bucket Setup**
```bash
# Create S3 bucket
aws s3 mb s3://scoopsocials-assets --region us-east-1

# Set bucket policy for public read
aws s3api put-bucket-policy --bucket scoopsocials-assets --policy '{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "PublicReadGetObject",
      "Effect": "Allow",
      "Principal": "*",
      "Action": "s3:GetObject",
      "Resource": "arn:aws:s3:::scoopsocials-assets/*"
    }
  ]
}'

# Enable CORS
aws s3api put-bucket-cors --bucket scoopsocials-assets --cors-configuration '{
  "CORSRules": [
    {
      "AllowedOrigins": ["https://scoopsocials.com"],
      "AllowedMethods": ["GET", "PUT", "POST"],
      "AllowedHeaders": ["*"]
    }
  ]
}'
```

### **5.2 CloudFront Distribution**
```javascript
// Infrastructure setup (if using AWS CDK/CloudFormation)
const distribution = new cloudfront.Distribution(this, 'ScoopAssetsDistribution', {
  defaultBehavior: {
    origin: new origins.S3Origin(bucket),
    viewerProtocolPolicy: cloudfront.ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
    cachePolicy: cloudfront.CachePolicy.CACHING_OPTIMIZED,
  },
  domainNames: ['assets.scoopsocials.com'],
  certificate: cert,
  minimumProtocolVersion: cloudfront.SecurityPolicyProtocol.TLS_V1_2_2021,
})
```

---

## **6. Monitoring & Logging**

### **6.1 Application Monitoring**
```typescript
// lib/monitoring/sentry.ts
import * as Sentry from '@sentry/nextjs'

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  environment: process.env.NODE_ENV,
  tracesSampleRate: 0.1,
  beforeSend(event) {
    // Filter out sensitive data
    if (event.exception) {
      const error = event.exception.values?.[0]
      if (error?.value?.includes('password') || error?.value?.includes('token')) {
        return null
      }
    }
    return event
  },
})
```

### **6.2 Performance Monitoring**
```typescript
// lib/monitoring/analytics.ts
import { Analytics } from '@vercel/analytics/react'

// Google Analytics 4
export const GA_TRACKING_ID = process.env.NEXT_PUBLIC_GA_ID

export const pageview = (url: string) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('config', GA_TRACKING_ID, {
      page_location: url,
    })
  }
}

export const event = (action: string, category: string, label?: string, value?: number) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', action, {
      event_category: category,
      event_label: label,
      value: value,
    })
  }
}
```

### **6.3 Health Check Endpoint**
```typescript
// app/api/health/route.ts
import { NextResponse } from 'next/server'
import pool from '@/lib/database/pool'
import redis from '@/lib/cache/redis'

export async function GET() {
  const health = {
    status: 'healthy',
    timestamp: new Date().toISOString(),
    version: process.env.npm_package_version,
    checks: {
      database: 'checking',
      redis: 'checking',
      memory: 'checking'
    }
  }

  try {
    // Check database connection
    await pool.query('SELECT 1')
    health.checks.database = 'healthy'
  } catch (error) {
    health.checks.database = 'unhealthy'
    health.status = 'unhealthy'
  }

  try {
    // Check Redis connection
    await redis.ping()
    health.checks.redis = 'healthy'
  } catch (error) {
    health.checks.redis = 'unhealthy'
    health.status = 'unhealthy'
  }

  // Check memory usage
  const memUsage = process.memoryUsage()
  health.checks.memory = memUsage.heapUsed > 500 * 1024 * 1024 ? 'warning' : 'healthy'

  return NextResponse.json(health)
}
```

---

## **7. Security Configuration**

### **7.1 SSL/TLS Setup**
```bash
# Certbot for Let's Encrypt (if self-hosting)
sudo certbot --nginx -d scoopsocials.com -d www.scoopsocials.com

# Auto-renewal
sudo crontab -e
# Add: 0 12 * * * /usr/bin/certbot renew --quiet
```

### **7.2 Rate Limiting**
```typescript
// middleware.ts
import { NextRequest, NextResponse } from 'next/server'
import { RateLimiter } from 'limiter'

const limiters = new Map()

export function middleware(request: NextRequest) {
  const ip = request.ip || 'anonymous'
  
  if (!limiters.has(ip)) {
    limiters.set(ip, new RateLimiter(100, 'hour')) // 100 requests per hour
  }
  
  const limiter = limiters.get(ip)
  
  if (!limiter.tryRemoveTokens(1)) {
    return new NextResponse('Too Many Requests', { status: 429 })
  }
  
  return NextResponse.next()
}

export const config = {
  matcher: '/api/:path*'
}
```

### **7.3 API Security**
```typescript
// lib/security/validation.ts
import { NextRequest } from 'next/server'
import jwt from 'jsonwebtoken'

export const validateAPIKey = (request: NextRequest) => {
  const apiKey = request.headers.get('x-api-key')
  
  if (!apiKey || apiKey !== process.env.API_SECRET_KEY) {
    throw new Error('Invalid API key')
  }
}

export const validateJWT = (token: string) => {
  try {
    return jwt.verify(token, process.env.JWT_SECRET!)
  } catch (error) {
    throw new Error('Invalid token')
  }
}
```

---

## **8. Backup Strategy**

### **8.1 Automated Database Backups**
```bash
#!/bin/bash
# scripts/backup_production.sh

# Configuration
DB_HOST="your-production-db-host"
DB_NAME="scoopsocials_prod"
DB_USER="scoopsocials_app"
BACKUP_DIR="/backups/scoopsocials"
S3_BUCKET="scoopsocials-backups"
DATE=$(date +%Y%m%d_%H%M%S)

# Create backup directory
mkdir -p $BACKUP_DIR

# Create database backup
pg_dump -h $DB_HOST -U $DB_USER -d $DB_NAME -Fc > $BACKUP_DIR/db_backup_$DATE.dump

# Compress and encrypt
gpg --symmetric --cipher-algo AES256 $BACKUP_DIR/db_backup_$DATE.dump

# Upload to S3
aws s3 cp $BACKUP_DIR/db_backup_$DATE.dump.gpg s3://$S3_BUCKET/database/

# Clean up local files older than 7 days
find $BACKUP_DIR -name "*.dump*" -mtime +7 -delete

# Clean up S3 files older than 30 days
aws s3 ls s3://$S3_BUCKET/database/ | while read -r line; do
  createDate=$(echo $line | awk '{print $1" "$2}')
  createDate=$(date -d"$createDate" +%s)
  olderThan=$(date -d"30 days ago" +%s)
  if [[ $createDate -lt $olderThan ]]; then
    fileName=$(echo $line | awk '{print $4}')
    aws s3 rm s3://$S3_BUCKET/database/$fileName
  fi
done

echo "Backup completed: db_backup_$DATE.dump.gpg"
```

### **8.2 Backup Restoration**
```bash
#!/bin/bash
# scripts/restore_backup.sh

BACKUP_FILE=$1
DB_NAME="scoopsocials_prod"
DB_USER="scoopsocials_app"

if [ -z "$BACKUP_FILE" ]; then
  echo "Usage: $0 <backup_file.dump.gpg>"
  exit 1
fi

# Decrypt backup
gpg --decrypt $BACKUP_FILE > temp_backup.dump

# Restore database
pg_restore -h $DB_HOST -U $DB_USER -d $DB_NAME -c temp_backup.dump

# Clean up
rm temp_backup.dump

echo "Database restored from: $BACKUP_FILE"
```

---

## **9. CI/CD Pipeline**

### **9.1 GitHub Actions Workflow**
```yaml
# .github/workflows/deploy.yml
name: Deploy to Production

on:
  push:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
          cache: 'npm'
      
      - run: npm ci
      - run: npm run lint
      - run: npm run type-check
      - run: npm run test

  deploy:
    needs: test
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main'
    
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
          cache: 'npm'
      
      - run: npm ci
      - run: npm run build
      
      - name: Deploy to Vercel
        uses: amondnet/vercel-action@v20
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.ORG_ID }}
          vercel-project-id: ${{ secrets.PROJECT_ID }}
          vercel-args: '--prod'
```

### **9.2 Deployment Scripts**
```bash
#!/bin/bash
# scripts/deploy.sh

echo "🚀 Starting deployment process..."

# Run tests
echo "Running tests..."
npm test
if [ $? -ne 0 ]; then
  echo "❌ Tests failed. Deployment aborted."
  exit 1
fi

# Build application
echo "Building application..."
npm run build
if [ $? -ne 0 ]; then
  echo "❌ Build failed. Deployment aborted."
  exit 1
fi

# Run database migrations
echo "Running database migrations..."
./scripts/deploy_database.sh
if [ $? -ne 0 ]; then
  echo "❌ Database migration failed. Deployment aborted."
  exit 1
fi

# Deploy to Vercel
echo "Deploying to Vercel..."
vercel --prod --token $VERCEL_TOKEN
if [ $? -ne 0 ]; then
  echo "❌ Vercel deployment failed."
  exit 1
fi

# Create backup after successful deployment
echo "Creating post-deployment backup..."
./scripts/backup_production.sh

echo "✅ Deployment completed successfully!"
```

---

## **10. Domain & DNS Configuration**

### **10.1 DNS Records**
```bash
# DNS Configuration for scoopsocials.com

# A Records
scoopsocials.com.     300   IN  A     76.76.19.123
www.scoopsocials.com. 300   IN  A     76.76.19.123

# CNAME Records
api.scoopsocials.com.    300  IN  CNAME  cname.vercel-dns.com.
assets.scoopsocials.com. 300  IN  CNAME  d1234567890.cloudfront.net.

# MX Records (for email)
scoopsocials.com. 300 IN MX 10 mail.scoopsocials.com.

# TXT Records (for verification)
scoopsocials.com. 300 IN TXT "v=spf1 include:sendgrid.net ~all"
_dmarc.scoopsocials.com. 300 IN TXT "v=DMARC1; p=quarantine; rua=mailto:dmarc@scoopsocials.com"
```

---

## **Conclusion**

This deployment guide provides:

✅ **Complete environment setup** with all required configurations
✅ **Production database setup** with security and performance optimizations
✅ **CDN and file storage** configuration for optimal performance
✅ **Monitoring and logging** setup for production visibility
✅ **Security configurations** including SSL, rate limiting, and API protection
✅ **Backup and disaster recovery** procedures
✅ **CI/CD pipeline** for automated deployments
✅ **DNS and domain** configuration

Following this guide ensures a production-ready ScoopSocials deployment with proper security, performance, and reliability.

---

*Deployment Setup Guide Version: 1.0*
*Last Updated: January 2025*
*© 2025 Scoop Technologies LLC* 