# Frontend Integration Plan for Scoop Social Backend

## Overview
This document outlines the complete strategy for integrating the new Node.js backend with the existing Next.js frontend, ensuring seamless data migration and feature continuity.

---

## **1. Current Frontend Architecture Analysis**

### **Existing Data Sources**
```typescript
// Current frontend uses localStorage-based data
- lib/sampleData.ts - Demo users and content
- lib/scoopProfile.ts - User profile management
- lib/crossPlatformIdentity.ts - Social account linking
- lib/auth0.ts - Authentication handling
- components/ - React components with local state
```

### **Key Frontend Components to Update**
- **Authentication Flow** - Update Auth0 integration
- **User Profile Management** - Replace localStorage with API calls
- **Friend System** - Migrate to backend friend requests/management
- **Review System** - Connect to new review APIs
- **Event Management** - Integrate with backend event system
- **Trust Score Display** - Real-time trust score from backend
- **Social Account Linking** - Backend-verified social connections

---

## **2. API Integration Strategy**

### **API Client Setup**
```typescript
// lib/api/client.ts
import axios, { AxiosInstance, AxiosRequestConfig } from 'axios';

interface APIConfig {
  baseURL: string;
  timeout: number;
  retries: number;
}

class ScoopAPIClient {
  private client: AxiosInstance;
  private authToken: string | null = null;

  constructor(config: APIConfig) {
    this.client = axios.create({
      baseURL: config.baseURL,
      timeout: config.timeout,
      headers: {
        'Content-Type': 'application/json',
        'X-API-Version': 'v1'
      }
    });

    this.setupInterceptors();
  }

  private setupInterceptors() {
    // Request interceptor - add auth token
    this.client.interceptors.request.use((config) => {
      if (this.authToken) {
        config.headers.Authorization = `Bearer ${this.authToken}`;
      }
      config.headers['X-Request-ID'] = this.generateRequestId();
      return config;
    });

    // Response interceptor - handle errors and token refresh
    this.client.interceptors.response.use(
      (response) => response,
      async (error) => {
        if (error.response?.status === 401) {
          await this.refreshAuthToken();
          return this.client.request(error.config);
        }
        return Promise.reject(this.formatError(error));
      }
    );
  }

  setAuthToken(token: string) {
    this.authToken = token;
  }

  private generateRequestId(): string {
    return `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private async refreshAuthToken(): Promise<void> {
    // Implement Auth0 token refresh logic
    try {
      const response = await fetch('/api/auth/me');
      const data = await response.json();
      if (data.accessToken) {
        this.setAuthToken(data.accessToken);
      }
    } catch (error) {
      // Redirect to login if refresh fails
      window.location.href = '/signin';
    }
  }

  private formatError(error: any): APIError {
    return {
      code: error.response?.data?.error?.code || 'NETWORK_ERROR',
      message: error.response?.data?.error?.message || 'Network request failed',
      details: error.response?.data?.error?.details,
      httpStatus: error.response?.status || 0,
      requestId: error.response?.data?.error?.requestId
    };
  }

  // Generic request methods
  async get<T>(url: string, config?: AxiosRequestConfig): Promise<APIResponse<T>> {
    const response = await this.client.get(url, config);
    return response.data;
  }

  async post<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<APIResponse<T>> {
    const response = await this.client.post(url, data, config);
    return response.data;
  }

  async put<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<APIResponse<T>> {
    const response = await this.client.put(url, data, config);
    return response.data;
  }

  async delete<T>(url: string, config?: AxiosRequestConfig): Promise<APIResponse<T>> {
    const response = await this.client.delete(url, config);
    return response.data;
  }
}

// Export configured instance
export const apiClient = new ScoopAPIClient({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api/v1',
  timeout: 10000,
  retries: 3
});

// Types
export interface APIResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  meta?: Record<string, any>;
}

export interface APIError {
  code: string;
  message: string;
  details?: string;
  httpStatus: number;
  requestId?: string;
}
```

### **Service Layer Abstractions**
```typescript
// lib/api/services/userService.ts
import { apiClient } from '../client';
import { User, UserProfile, TrustScoreCalculation } from '../types';

export class UserService {
  async getCurrentUser(): Promise<User> {
    const response = await apiClient.get<User>('/auth/me');
    return response.data;
  }

  async updateProfile(profileData: Partial<UserProfile>): Promise<User> {
    const response = await apiClient.put<User>('/auth/me', profileData);
    return response.data;
  }

  async getUserById(userId: number): Promise<User> {
    const response = await apiClient.get<User>(`/users/${userId}`);
    return response.data;
  }

  async getTrustScore(userId?: number): Promise<TrustScoreCalculation> {
    const url = userId ? `/trust/score/${userId}` : '/trust/score';
    const response = await apiClient.get<TrustScoreCalculation>(url);
    return response.data;
  }

  async searchUsers(query: string, filters?: UserSearchFilters): Promise<User[]> {
    const response = await apiClient.get<User[]>('/search/users', {
      params: { q: query, ...filters }
    });
    return response.data;
  }
}

export const userService = new UserService();
```

---

## **3. Data Migration Strategy**

### **Phase 1: Preserve Demo Data**
```typescript
// lib/migration/demoDataMigration.ts
import { originalDemoUsers } from '../demoDataBackup';
import { userService } from '../api/services/userService';

export class DemoDataMigration {
  async preserveCurrentState(): Promise<void> {
    // Export current localStorage data
    const currentUsers = getCurrentUsers(); // from existing sampleData.ts
    const currentEvents = getCurrentEvents();
    const currentReviews = getCurrentReviews();

    // Store in backup format
    localStorage.setItem('scoop_backup_users', JSON.stringify(currentUsers));
    localStorage.setItem('scoop_backup_events', JSON.stringify(currentEvents));
    localStorage.setItem('scoop_backup_reviews', JSON.stringify(currentReviews));
    localStorage.setItem('scoop_migration_timestamp', Date.now().toString());
  }

  async migrateToBackend(): Promise<void> {
    try {
      // Check if backend is available
      await this.checkBackendConnection();

      // Migrate user data
      await this.migrateUsers();
      await this.migrateFriendships();
      await this.migrateEvents();
      await this.migrateReviews();

      // Mark migration as complete
      localStorage.setItem('scoop_migration_complete', 'true');
      localStorage.setItem('scoop_migration_completed_at', Date.now().toString());

    } catch (error) {
      console.error('Migration failed:', error);
      // Fallback to localStorage mode
      this.enableFallbackMode();
    }
  }

  private async checkBackendConnection(): Promise<void> {
    try {
      await apiClient.get('/health');
    } catch (error) {
      throw new Error('Backend not available');
    }
  }

  private enableFallbackMode(): void {
    localStorage.setItem('scoop_fallback_mode', 'true');
    // Continue using localStorage-based data
  }

  async restoreDemoData(): Promise<void> {
    // Restore original demo data if needed
    const backupUsers = localStorage.getItem('scoop_backup_users');
    if (backupUsers) {
      // Restore to localStorage for fallback
    }
  }
}
```

### **Phase 2: Progressive Enhancement**
```typescript
// lib/dataManager.ts - Unified data access layer
export class DataManager {
  private isBackendAvailable: boolean = false;
  private isMigrated: boolean = false;

  constructor() {
    this.checkMigrationStatus();
  }

  private checkMigrationStatus(): void {
    this.isMigrated = localStorage.getItem('scoop_migration_complete') === 'true';
    this.isBackendAvailable = !localStorage.getItem('scoop_fallback_mode');
  }

  async getUser(userId: number): Promise<User> {
    if (this.isBackendAvailable && this.isMigrated) {
      return await userService.getUserById(userId);
    } else {
      // Fallback to localStorage
      return getCurrentUser(); // existing function
    }
  }

  async updateUser(userId: number, data: Partial<User>): Promise<User> {
    if (this.isBackendAvailable && this.isMigrated) {
      return await userService.updateProfile(data);
    } else {
      // Update localStorage
      return updateCurrentUser(data); // existing function
    }
  }

  // Similar pattern for all data access methods
}

export const dataManager = new DataManager();
```

---

## **4. Component Migration Plan**

### **Authentication Integration**
```typescript
// components/AuthProvider.tsx - Updated Auth0 integration
import { useUser } from '@auth0/nextjs-auth0/client';
import { createContext, useContext, useEffect, useState } from 'react';
import { userService } from '../lib/api/services/userService';

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  error: Error | null;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { user: auth0User, isLoading: auth0Loading } = useUser();
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (auth0User && !auth0Loading) {
      loadUserProfile();
    } else if (!auth0Loading) {
      setIsLoading(false);
    }
  }, [auth0User, auth0Loading]);

  const loadUserProfile = async () => {
    try {
      setIsLoading(true);
      setError(null);

      // Check if user exists in backend
      const backendUser = await userService.getCurrentUser();
      setUser(backendUser);

    } catch (error: any) {
      if (error.code === 'USER_NOT_FOUND') {
        // Create user in backend
        await createUserInBackend();
      } else {
        setError(error);
        // Fallback to demo mode
        const demoUser = getCurrentUser(); // from existing localStorage
        setUser(demoUser);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const createUserInBackend = async () => {
    if (!auth0User) return;

    const userData = {
      auth0UserId: auth0User.sub!,
      email: auth0User.email!,
      name: auth0User.name!,
      avatar: auth0User.picture
    };

    const newUser = await userService.createUser(userData);
    setUser(newUser);
  };

  const refreshUser = async () => {
    if (auth0User) {
      await loadUserProfile();
    }
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, error, refreshUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
```

### **Real-time Integration with WebSockets**
```typescript
// lib/realtime/websocketClient.ts
import io, { Socket } from 'socket.io-client';
import { useAuth } from '../components/AuthProvider';

class WebSocketManager {
  private socket: Socket | null = null;
  private isConnected: boolean = false;

  connect(userId: number, authToken: string): void {
    if (this.socket) {
      this.disconnect();
    }

    this.socket = io(process.env.NEXT_PUBLIC_WS_URL || 'http://localhost:3001', {
      auth: {
        token: authToken,
        userId: userId
      },
      transports: ['websocket', 'polling']
    });

    this.setupEventListeners();
  }

  private setupEventListeners(): void {
    if (!this.socket) return;

    this.socket.on('connect', () => {
      this.isConnected = true;
      console.log('WebSocket connected');
    });

    this.socket.on('disconnect', () => {
      this.isConnected = false;
      console.log('WebSocket disconnected');
    });

    // Real-time event listeners
    this.socket.on('friend_request', (data) => {
      this.handleFriendRequest(data);
    });

    this.socket.on('review_received', (data) => {
      this.handleReviewReceived(data);
    });

    this.socket.on('trust_score_updated', (data) => {
      this.handleTrustScoreUpdate(data);
    });

    this.socket.on('event_invite', (data) => {
      this.handleEventInvite(data);
    });
  }

  private handleFriendRequest(data: any): void {
    // Update friend requests UI
    window.dispatchEvent(new CustomEvent('friendRequestReceived', { detail: data }));
  }

  private handleReviewReceived(data: any): void {
    // Update reviews and potentially trust score
    window.dispatchEvent(new CustomEvent('reviewReceived', { detail: data }));
  }

  private handleTrustScoreUpdate(data: any): void {
    // Update trust score display
    window.dispatchEvent(new CustomEvent('trustScoreUpdated', { detail: data }));
  }

  private handleEventInvite(data: any): void {
    // Show event invitation notification
    window.dispatchEvent(new CustomEvent('eventInviteReceived', { detail: data }));
  }

  disconnect(): void {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
      this.isConnected = false;
    }
  }

  // Send real-time events
  emitUserActivity(activity: string, data: any): void {
    if (this.socket && this.isConnected) {
      this.socket.emit('user_activity', { activity, data });
    }
  }
}

export const wsManager = new WebSocketManager();

// React hook for WebSocket integration
export function useWebSocket() {
  const { user } = useAuth();
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    if (user) {
      // Get auth token and connect
      const connectWebSocket = async () => {
        const token = await getAuthToken(); // implement this
        wsManager.connect(user.id, token);
        setIsConnected(true);
      };

      connectWebSocket();

      return () => {
        wsManager.disconnect();
        setIsConnected(false);
      };
    }
  }, [user]);

  return { isConnected, wsManager };
}
```

---

## **5. Error Handling and Fallback Strategy**

### **Progressive Enhancement Pattern**
```typescript
// lib/enhancedDataProvider.ts
export class EnhancedDataProvider {
  private fallbackToLocalStorage: boolean = false;

  async withFallback<T>(
    backendOperation: () => Promise<T>,
    fallbackOperation: () => T,
    cacheKey?: string
  ): Promise<T> {
    try {
      if (this.fallbackToLocalStorage) {
        return fallbackOperation();
      }

      const result = await backendOperation();
      
      // Cache successful result
      if (cacheKey) {
        localStorage.setItem(`cache_${cacheKey}`, JSON.stringify(result));
      }
      
      return result;
    } catch (error) {
      console.warn('Backend operation failed, falling back to localStorage:', error);
      
      // Try cached data first
      if (cacheKey) {
        const cached = localStorage.getItem(`cache_${cacheKey}`);
        if (cached) {
          return JSON.parse(cached);
        }
      }
      
      // Fall back to localStorage operation
      this.fallbackToLocalStorage = true;
      return fallbackOperation();
    }
  }

  resetBackendConnection(): void {
    this.fallbackToLocalStorage = false;
  }
}

export const dataProvider = new EnhancedDataProvider();
```

### **User Experience During Migration**
```typescript
// components/MigrationStatus.tsx
export function MigrationStatus() {
  const [migrationState, setMigrationState] = useState<'checking' | 'migrating' | 'complete' | 'fallback'>('checking');
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    checkMigrationStatus();
  }, []);

  const checkMigrationStatus = async () => {
    const isComplete = localStorage.getItem('scoop_migration_complete') === 'true';
    const isFallback = localStorage.getItem('scoop_fallback_mode') === 'true';

    if (isComplete) {
      setMigrationState('complete');
    } else if (isFallback) {
      setMigrationState('fallback');
    } else {
      setMigrationState('migrating');
      await performMigration();
    }
  };

  const performMigration = async () => {
    const migration = new DemoDataMigration();
    
    try {
      await migration.preserveCurrentState();
      setProgress(25);
      
      await migration.migrateToBackend();
      setProgress(100);
      
      setMigrationState('complete');
    } catch (error) {
      setMigrationState('fallback');
    }
  };

  if (migrationState === 'checking' || migrationState === 'migrating') {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-500 mx-auto mb-4"></div>
            <h3 className="text-lg font-semibold mb-2">
              {migrationState === 'checking' ? 'Connecting...' : 'Migrating Data...'}
            </h3>
            <p className="text-gray-600 mb-4">
              We're setting up your enhanced Scoop Social experience
            </p>
            {migrationState === 'migrating' && (
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-cyan-500 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${progress}%` }}
                ></div>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  return null; // Don't render anything when complete or in fallback mode
}
```

---

## **6. Performance Optimization**

### **Caching Strategy**
```typescript
// lib/cache/cacheManager.ts
export class CacheManager {
  private cache = new Map<string, { data: any; expiry: number }>();
  private readonly DEFAULT_TTL = 5 * 60 * 1000; // 5 minutes

  set(key: string, data: any, ttl: number = this.DEFAULT_TTL): void {
    this.cache.set(key, {
      data,
      expiry: Date.now() + ttl
    });
  }

  get<T>(key: string): T | null {
    const item = this.cache.get(key);
    
    if (!item) return null;
    
    if (Date.now() > item.expiry) {
      this.cache.delete(key);
      return null;
    }
    
    return item.data;
  }

  invalidate(pattern: string): void {
    for (const key of this.cache.keys()) {
      if (key.includes(pattern)) {
        this.cache.delete(key);
      }
    }
  }

  clear(): void {
    this.cache.clear();
  }
}

export const cacheManager = new CacheManager();
```

### **Optimistic Updates**
```typescript
// hooks/useOptimisticMutation.ts
export function useOptimisticMutation<T, P>(
  mutationFn: (params: P) => Promise<T>,
  optimisticUpdateFn: (params: P) => T,
  onSuccess?: (data: T) => void,
  onError?: (error: any, rollbackFn: () => void) => void
) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const mutate = async (params: P) => {
    setIsLoading(true);
    setError(null);

    // Apply optimistic update
    const optimisticResult = optimisticUpdateFn(params);
    let rollbackFn: (() => void) | null = null;

    try {
      // Perform actual mutation
      const result = await mutationFn(params);
      
      onSuccess?.(result);
      return result;
    } catch (error) {
      // Rollback optimistic update
      if (rollbackFn) {
        rollbackFn();
      }
      
      setError(error as Error);
      onError?.(error, rollbackFn || (() => {}));
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  return { mutate, isLoading, error };
}
```

---

## **7. Testing Strategy**

### **Integration Testing**
```typescript
// __tests__/integration/api.test.ts
import { apiClient } from '../../lib/api/client';
import { userService } from '../../lib/api/services/userService';

describe('API Integration', () => {
  beforeEach(() => {
    // Setup test environment
    process.env.NEXT_PUBLIC_API_URL = 'http://localhost:3001/api/v1';
  });

  test('should handle backend unavailable gracefully', async () => {
    // Mock network error
    jest.spyOn(apiClient, 'get').mockRejectedValue(new Error('Network Error'));

    // Should fallback to localStorage
    const user = await dataManager.getUser(1);
    expect(user).toBeDefined();
    expect(user.id).toBe(1);
  });

  test('should migrate data successfully', async () => {
    const migration = new DemoDataMigration();
    
    await migration.preserveCurrentState();
    await migration.migrateToBackend();
    
    const isComplete = localStorage.getItem('scoop_migration_complete');
    expect(isComplete).toBe('true');
  });
});
```

---

## **8. Deployment and Rollout Plan**

### **Phase 1: Infrastructure Setup**
```bash
# Backend deployment to Digital Ocean
1. Set up PostgreSQL and Redis databases
2. Deploy Node.js API server
3. Configure environment variables
4. Run database migrations
5. Seed with sample data
```

### **Phase 2: Frontend Integration**
```bash
# Frontend updates
1. Add new API client and services
2. Implement migration logic
3. Add fallback mechanisms
4. Deploy updated frontend
```

### **Phase 3: Migration Execution**
```bash
# User migration
1. Monitor backend health
2. Trigger data migration for existing users
3. Enable real-time features
4. Disable localStorage fallback for migrated users
```

### **Phase 4: Monitoring and Optimization**
```bash
# Post-deployment
1. Monitor API performance
2. Track migration success rates
3. Optimize based on usage patterns
4. Gradually remove localStorage dependencies
```

---

## **9. Risk Mitigation**

### **Rollback Strategy**
```typescript
// utils/rollback.ts
export class RollbackManager {
  async rollbackToLocalStorage(): Promise<void> {
    // Disable backend integration
    localStorage.setItem('scoop_fallback_mode', 'true');
    localStorage.removeItem('scoop_migration_complete');
    
    // Restore backup data
    const backupUsers = localStorage.getItem('scoop_backup_users');
    if (backupUsers) {
      localStorage.setItem('scoopUsers', backupUsers);
    }
    
    // Reload page to reinitialize with localStorage
    window.location.reload();
  }

  async validateMigration(): Promise<boolean> {
    try {
      // Check data integrity
      const backendUser = await userService.getCurrentUser();
      const localUser = getCurrentUser();
      
      return this.compareUserData(backendUser, localUser);
    } catch (error) {
      return false;
    }
  }

  private compareUserData(backendUser: any, localUser: any): boolean {
    // Compare essential fields
    return (
      backendUser.email === localUser.email &&
      backendUser.name === localUser.name &&
      backendUser.trustScore >= localUser.trustScore - 5 // Allow small variance
    );
  }
}
```

### **Feature Flags**
```typescript
// lib/featureFlags.ts
export const FEATURE_FLAGS = {
  BACKEND_INTEGRATION: process.env.NEXT_PUBLIC_ENABLE_BACKEND === 'true',
  REAL_TIME_FEATURES: process.env.NEXT_PUBLIC_ENABLE_REALTIME === 'true',
  TRUST_SCORE_LIVE_UPDATE: process.env.NEXT_PUBLIC_LIVE_TRUST_SCORE === 'true',
  SOCIAL_VERIFICATION: process.env.NEXT_PUBLIC_SOCIAL_VERIFICATION === 'true'
};

export function isFeatureEnabled(feature: keyof typeof FEATURE_FLAGS): boolean {
  return FEATURE_FLAGS[feature] ?? false;
}
```

This comprehensive integration plan ensures a smooth transition from the current localStorage-based system to the new backend while maintaining backward compatibility and providing fallback mechanisms for any issues that may arise. 