# Environment Configuration & Secrets Management

## Overview
This document defines all environment variables, configuration management, and secrets required for the Scoop Social backend across development, staging, and production environments.

---

## **1. Complete Environment Variables List**

### **Core Application Settings**
```bash
# Application
NODE_ENV=production|development|staging
PORT=3001
API_VERSION=v1
APP_NAME=scoop-social-backend

# URLs
API_BASE_URL=https://api.scoopsocial.com
FRONTEND_URL=https://scoopsocial.com
CORS_ORIGINS=https://scoopsocial.com,https://staging.scoopsocial.com
```

### **Database Configuration**
```bash
# PostgreSQL
DATABASE_URL=postgresql://username:password@host:5432/database_name
DATABASE_HOST=db-postgresql-nyc3-12345-do-user-789.db.ondigitalocean.com
DATABASE_PORT=25060
DATABASE_NAME=scoop_social_prod
DATABASE_USER=doadmin
DATABASE_PASSWORD=your_secure_database_password
DATABASE_SSL_MODE=require

# Connection Pool Settings
DATABASE_POOL_MIN=2
DATABASE_POOL_MAX=20
DATABASE_POOL_IDLE_TIMEOUT=30000
DATABASE_POOL_ACQUIRE_TIMEOUT=60000

# Redis Cache
REDIS_URL=redis://default:password@redis-cluster-nyc3-12345.b.db.ondigitalocean.com:25061
REDIS_HOST=redis-cluster-nyc3-12345.b.db.ondigitalocean.com
REDIS_PORT=25061
REDIS_PASSWORD=your_redis_password
REDIS_TLS_ENABLED=true
```

### **Authentication & Security**
```bash
# Auth0 Configuration
AUTH0_DOMAIN=your-tenant.us.auth0.com
AUTH0_CLIENT_ID=your_auth0_client_id
AUTH0_CLIENT_SECRET=your_auth0_client_secret
AUTH0_AUDIENCE=https://api.scoopsocial.com
AUTH0_ISSUER_BASE_URL=https://your-tenant.us.auth0.com
AUTH0_SECRET=complex_jwt_secret_key_here

# JWT Configuration
JWT_SECRET=your_jwt_secret_key_minimum_32_characters
JWT_EXPIRES_IN=24h
JWT_REFRESH_EXPIRES_IN=7d

# API Security
API_RATE_LIMIT_MAX=1000
API_RATE_LIMIT_WINDOW=900000
API_CORS_MAX_AGE=3600
ENCRYPTION_KEY=32_character_encryption_key_here
```

### **File Storage (Digital Ocean Spaces)**
```bash
# Digital Ocean Spaces
DO_SPACES_ENDPOINT=https://nyc3.digitaloceanspaces.com
DO_SPACES_BUCKET=scoop-social-assets
DO_SPACES_ACCESS_KEY=your_spaces_access_key
DO_SPACES_SECRET_KEY=your_spaces_secret_key
DO_SPACES_REGION=nyc3
DO_SPACES_CDN_URL=https://scoop-social-assets.nyc3.cdn.digitaloceanspaces.com

# File Upload Settings
MAX_FILE_SIZE=10485760
ALLOWED_IMAGE_TYPES=image/jpeg,image/png,image/webp,image/gif
UPLOAD_TEMP_DIR=/tmp/uploads
```

### **External Services**
```bash
# Email Service (SendGrid)
SENDGRID_API_KEY=SG.your_sendgrid_api_key
FROM_EMAIL=noreply@scoopsocial.com
SUPPORT_EMAIL=support@scoopsocial.com

# Social Platform APIs (for verification)
TWITTER_API_KEY=your_twitter_api_key
TWITTER_API_SECRET=your_twitter_api_secret
TWITTER_BEARER_TOKEN=your_twitter_bearer_token

INSTAGRAM_CLIENT_ID=your_instagram_client_id
INSTAGRAM_CLIENT_SECRET=your_instagram_client_secret

LINKEDIN_CLIENT_ID=your_linkedin_client_id
LINKEDIN_CLIENT_SECRET=your_linkedin_client_secret

# AI Services (for trust scoring)
OPENAI_API_KEY=sk-your_openai_api_key
OPENAI_MODEL=gpt-3.5-turbo
OPENAI_MAX_TOKENS=500
```

### **Monitoring & Logging**
```bash
# Error Tracking
SENTRY_DSN=https://your_sentry_dsn@sentry.io/project_id
SENTRY_ENVIRONMENT=production
SENTRY_SAMPLE_RATE=0.1

# Logging
LOG_LEVEL=info|debug|warn|error
LOG_FORMAT=json|text
LOG_FILE_PATH=/var/log/scoop-social/app.log
ENABLE_CONSOLE_LOGS=true|false

# Metrics
METRICS_ENABLED=true
METRICS_PORT=9090
METRICS_PATH=/metrics
```

### **Feature Flags & Configuration**
```bash
# Feature Toggles
ENABLE_REAL_TIME=true
ENABLE_TRUST_SCORE_CALCULATION=true
ENABLE_FILE_UPLOADS=true
ENABLE_EMAIL_NOTIFICATIONS=true
ENABLE_RATE_LIMITING=true
ENABLE_REQUEST_LOGGING=true

# Trust Score Configuration
TRUST_SCORE_INITIAL=50
TRUST_SCORE_MIN=0
TRUST_SCORE_MAX=100
TRUST_SCORE_RECALC_INTERVAL=3600000

# Notification Settings
NOTIFICATION_BATCH_SIZE=100
NOTIFICATION_RETRY_ATTEMPTS=3
NOTIFICATION_RETRY_DELAY=5000
```

---

## **2. Environment File Templates**

### **Development (.env.development)**
```bash
# Development Environment
NODE_ENV=development
PORT=3001
API_BASE_URL=http://localhost:3001
FRONTEND_URL=http://localhost:3000
CORS_ORIGINS=http://localhost:3000,http://localhost:3001

# Local Database
DATABASE_URL=postgresql://postgres:password@localhost:5432/scoop_social_dev
REDIS_URL=redis://localhost:6379

# Auth0 Development
AUTH0_DOMAIN=dev-your-tenant.us.auth0.com
AUTH0_CLIENT_ID=dev_client_id
AUTH0_CLIENT_SECRET=dev_client_secret
AUTH0_AUDIENCE=http://localhost:3001
AUTH0_SECRET=development_jwt_secret_32_chars_min

# Development Settings
LOG_LEVEL=debug
ENABLE_CONSOLE_LOGS=true
API_RATE_LIMIT_MAX=10000
METRICS_ENABLED=false
SENTRY_SAMPLE_RATE=1.0
```

### **Production (.env.production)**
```bash
# Production Environment
NODE_ENV=production
PORT=3001
API_BASE_URL=https://api.scoopsocial.com
FRONTEND_URL=https://scoopsocial.com
CORS_ORIGINS=https://scoopsocial.com

# Production Database (from Digital Ocean)
DATABASE_URL=${DATABASE_URL}
REDIS_URL=${REDIS_URL}

# Production Auth0
AUTH0_DOMAIN=scoop-social.us.auth0.com
AUTH0_CLIENT_ID=${AUTH0_CLIENT_ID}
AUTH0_CLIENT_SECRET=${AUTH0_CLIENT_SECRET}
AUTH0_AUDIENCE=https://api.scoopsocial.com
AUTH0_SECRET=${AUTH0_SECRET}

# Production Settings
LOG_LEVEL=info
ENABLE_CONSOLE_LOGS=false
API_RATE_LIMIT_MAX=1000
METRICS_ENABLED=true
SENTRY_SAMPLE_RATE=0.1
```

---

## **3. Configuration Management Classes**

### **Environment Configuration Loader**
```typescript
// src/config/environment.ts
import dotenv from 'dotenv';

// Load environment files based on NODE_ENV
const envFile = process.env.NODE_ENV === 'production' ? '.env.production' :
                process.env.NODE_ENV === 'staging' ? '.env.staging' : 
                '.env.development';

dotenv.config({ path: envFile });

export interface DatabaseConfig {
  url: string;
  host: string;
  port: number;
  name: string;
  user: string;
  password: string;
  ssl: boolean;
  pool: {
    min: number;
    max: number;
    idleTimeout: number;
    acquireTimeout: number;
  };
}

export interface AuthConfig {
  auth0: {
    domain: string;
    clientId: string;
    clientSecret: string;
    audience: string;
    issuerBaseUrl: string;
    secret: string;
  };
  jwt: {
    secret: string;
    expiresIn: string;
    refreshExpiresIn: string;
  };
}

export interface StorageConfig {
  spaces: {
    endpoint: string;
    bucket: string;
    accessKey: string;
    secretKey: string;
    region: string;
    cdnUrl: string;
  };
  upload: {
    maxFileSize: number;
    allowedTypes: string[];
    tempDir: string;
  };
}

export interface AppConfig {
  env: string;
  port: number;
  apiVersion: string;
  baseUrl: string;
  frontendUrl: string;
  corsOrigins: string[];
}

class ConfigManager {
  private validateRequired(key: string): string {
    const value = process.env[key];
    if (!value) {
      throw new Error(`Missing required environment variable: ${key}`);
    }
    return value;
  }

  private getOptional(key: string, defaultValue: string): string {
    return process.env[key] || defaultValue;
  }

  private getNumber(key: string, defaultValue: number): number {
    const value = process.env[key];
    if (!value) return defaultValue;
    const parsed = parseInt(value, 10);
    if (isNaN(parsed)) {
      throw new Error(`Environment variable ${key} must be a number`);
    }
    return parsed;
  }

  private getBoolean(key: string, defaultValue: boolean): boolean {
    const value = process.env[key];
    if (!value) return defaultValue;
    return value.toLowerCase() === 'true';
  }

  public getAppConfig(): AppConfig {
    return {
      env: this.validateRequired('NODE_ENV'),
      port: this.getNumber('PORT', 3001),
      apiVersion: this.getOptional('API_VERSION', 'v1'),
      baseUrl: this.validateRequired('API_BASE_URL'),
      frontendUrl: this.validateRequired('FRONTEND_URL'),
      corsOrigins: this.getOptional('CORS_ORIGINS', 'http://localhost:3000').split(','),
    };
  }

  public getDatabaseConfig(): DatabaseConfig {
    return {
      url: this.validateRequired('DATABASE_URL'),
      host: this.validateRequired('DATABASE_HOST'),
      port: this.getNumber('DATABASE_PORT', 5432),
      name: this.validateRequired('DATABASE_NAME'),
      user: this.validateRequired('DATABASE_USER'),
      password: this.validateRequired('DATABASE_PASSWORD'),
      ssl: this.getBoolean('DATABASE_SSL_MODE', true),
      pool: {
        min: this.getNumber('DATABASE_POOL_MIN', 2),
        max: this.getNumber('DATABASE_POOL_MAX', 20),
        idleTimeout: this.getNumber('DATABASE_POOL_IDLE_TIMEOUT', 30000),
        acquireTimeout: this.getNumber('DATABASE_POOL_ACQUIRE_TIMEOUT', 60000),
      },
    };
  }

  public getAuthConfig(): AuthConfig {
    return {
      auth0: {
        domain: this.validateRequired('AUTH0_DOMAIN'),
        clientId: this.validateRequired('AUTH0_CLIENT_ID'),
        clientSecret: this.validateRequired('AUTH0_CLIENT_SECRET'),
        audience: this.validateRequired('AUTH0_AUDIENCE'),
        issuerBaseUrl: this.validateRequired('AUTH0_ISSUER_BASE_URL'),
        secret: this.validateRequired('AUTH0_SECRET'),
      },
      jwt: {
        secret: this.validateRequired('JWT_SECRET'),
        expiresIn: this.getOptional('JWT_EXPIRES_IN', '24h'),
        refreshExpiresIn: this.getOptional('JWT_REFRESH_EXPIRES_IN', '7d'),
      },
    };
  }

  public getStorageConfig(): StorageConfig {
    return {
      spaces: {
        endpoint: this.validateRequired('DO_SPACES_ENDPOINT'),
        bucket: this.validateRequired('DO_SPACES_BUCKET'),
        accessKey: this.validateRequired('DO_SPACES_ACCESS_KEY'),
        secretKey: this.validateRequired('DO_SPACES_SECRET_KEY'),
        region: this.validateRequired('DO_SPACES_REGION'),
        cdnUrl: this.validateRequired('DO_SPACES_CDN_URL'),
      },
      upload: {
        maxFileSize: this.getNumber('MAX_FILE_SIZE', 10 * 1024 * 1024), // 10MB
        allowedTypes: this.getOptional('ALLOWED_IMAGE_TYPES', 'image/jpeg,image/png,image/webp').split(','),
        tempDir: this.getOptional('UPLOAD_TEMP_DIR', '/tmp/uploads'),
      },
    };
  }

  public validateConfiguration(): void {
    try {
      this.getAppConfig();
      this.getDatabaseConfig();
      this.getAuthConfig();
      this.getStorageConfig();
      console.log('✅ Configuration validation passed');
    } catch (error) {
      console.error('❌ Configuration validation failed:', error);
      process.exit(1);
    }
  }
}

export const config = new ConfigManager();

// Validate configuration on startup
config.validateConfiguration();
```

---

## **4. Digital Ocean Environment Setup**

### **Environment Variables in App Platform**
```yaml
# .do/app.yaml environment section
envs:
  # Core Settings
  - key: NODE_ENV
    value: production
  - key: PORT
    value: "3001"
  - key: API_VERSION
    value: v1
    
  # Database (auto-injected by DO)
  - key: DATABASE_URL
    value: ${db.DATABASE_URL}
  - key: REDIS_URL
    value: ${redis.DATABASE_URL}
    
  # Auth0 (secrets)
  - key: AUTH0_DOMAIN
    scope: RUN_TIME
    type: SECRET
  - key: AUTH0_CLIENT_ID
    scope: RUN_TIME
    type: SECRET
  - key: AUTH0_CLIENT_SECRET
    scope: RUN_TIME
    type: SECRET
  - key: AUTH0_SECRET
    scope: RUN_TIME
    type: SECRET
    
  # File Storage (secrets)
  - key: DO_SPACES_ACCESS_KEY
    scope: RUN_TIME
    type: SECRET
  - key: DO_SPACES_SECRET_KEY
    scope: RUN_TIME
    type: SECRET
    
  # External APIs (secrets)
  - key: SENDGRID_API_KEY
    scope: RUN_TIME
    type: SECRET
  - key: OPENAI_API_KEY
    scope: RUN_TIME
    type: SECRET
    
  # Monitoring (secrets)
  - key: SENTRY_DSN
    scope: RUN_TIME
    type: SECRET
```

### **Secrets Management Commands**
```bash
# Create secrets in Digital Ocean App Platform
doctl apps create-deployment --app-id YOUR_APP_ID --spec .do/app.yaml

# Update specific secret
doctl apps update-env --app-id YOUR_APP_ID --key AUTH0_SECRET --value "new_secret_value"

# List all environment variables
doctl apps list-env --app-id YOUR_APP_ID
```

---

## **5. Security Best Practices**

### **Secret Rotation Schedule**
```bash
# Monthly rotation (high security)
AUTH0_SECRET=rotate_monthly
JWT_SECRET=rotate_monthly
ENCRYPTION_KEY=rotate_monthly

# Quarterly rotation (medium security)  
DATABASE_PASSWORD=rotate_quarterly
REDIS_PASSWORD=rotate_quarterly
DO_SPACES_SECRET_KEY=rotate_quarterly

# Annual rotation (low security)
SENDGRID_API_KEY=rotate_annually
OPENAI_API_KEY=rotate_annually
```

### **Environment Validation Script**
```typescript
// scripts/validate-env.ts
import { config } from '../src/config/environment';

function validateEnvironment() {
  console.log('🔍 Validating environment configuration...');
  
  try {
    config.validateConfiguration();
    
    // Additional security checks
    const authConfig = config.getAuthConfig();
    if (authConfig.jwt.secret.length < 32) {
      throw new Error('JWT_SECRET must be at least 32 characters');
    }
    
    const dbConfig = config.getDatabaseConfig();
    if (!dbConfig.ssl && process.env.NODE_ENV === 'production') {
      throw new Error('SSL must be enabled for production database');
    }
    
    console.log('✅ Environment validation successful');
    console.log('🔒 Security checks passed');
    
    return true;
  } catch (error) {
    console.error('❌ Environment validation failed:', error);
    return false;
  }
}

// Run validation
if (require.main === module) {
  const isValid = validateEnvironment();
  process.exit(isValid ? 0 : 1);
}

export { validateEnvironment };
```

This comprehensive environment configuration provides:
- ✅ **Complete variable definitions** for all services
- ✅ **Type-safe configuration management** 
- ✅ **Environment-specific templates**
- ✅ **Digital Ocean integration**
- ✅ **Security best practices**
- ✅ **Validation and error handling** 