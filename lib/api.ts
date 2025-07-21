// API service for connecting to the Scoop Social backend
const API_BASE_URL = 'https://coral-app-tjel2.ondigitalocean.app/api/v1';

export interface User {
  id: number;
  auth0_user_id: string;
  email: string;
  name: string;
  username?: string;
  avatar_url?: string;
  bio?: string;
  location?: string;
  phone?: string;
  trust_score: number;
  join_date: Date;
  is_verified: boolean;
  phone_verified: boolean;
  email_verified: boolean;
  friends_count: number;
  reviews_count: number;
  events_attended: number;
  events_hosted: number;
  status: string;
  preferences: any;
  created_at: Date;
  updated_at: Date;
}

export interface Friendship {
  id: number;
  user_id: number;
  friend_id: number;
  status: 'pending' | 'accepted' | 'blocked' | 'declined';
  initiated_by: number;
  requested_at: Date;
  accepted_at?: Date;
  created_at: Date;
  updated_at: Date;
}

// Helper function to get Auth0 user ID from session
async function getAuth0UserId(): Promise<string | null> {
  try {
    const response = await fetch('/api/auth/me');
    const data = await response.json();
    return data.user?.sub || null;
  } catch (error) {
    console.error('Error getting Auth0 user ID:', error);
    return null;
  }
}

// API helper function
async function apiRequest(endpoint: string, options: RequestInit = {}): Promise<any> {
  const auth0UserId = await getAuth0UserId();
  
  const headers = {
    'Content-Type': 'application/json',
    ...(auth0UserId && { 'x-auth0-user-id': auth0UserId }),
    ...options.headers,
  };

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    throw new Error(`API Error: ${response.status} ${response.statusText}`);
  }

  return response.json();
}

// User API
export const userAPI = {
  // Get current user
  async getCurrentUser(): Promise<User | null> {
    try {
      const result = await apiRequest('/users/me');
      return result.user;
    } catch (error) {
      console.error('Error fetching current user:', error);
      return null;
    }
  },

  // Create user (during Auth0 registration)
  async createUser(userData: {
    auth0UserId: string;
    email: string;
    name: string;
    avatar?: string;
  }): Promise<User> {
    const result = await apiRequest('/users', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
    return result.user;
  },

  // Update user profile
  async updateUser(userId: number, updates: Partial<User>): Promise<User> {
    const result = await apiRequest(`/users/${userId}`, {
      method: 'PUT',
      body: JSON.stringify(updates),
    });
    return result.user;
  },

  // Get user by ID
  async getUserById(userId: number): Promise<User> {
    const result = await apiRequest(`/users/${userId}`);
    return result.user;
  },
};

// Friends API
export const friendsAPI = {
  // Get friends list
  async getFriends(userId: number): Promise<User[]> {
    const result = await apiRequest(`/friends/${userId}`);
    return result.friends;
  },

  // Send friend request
  async sendFriendRequest(userId: number, friendId: number): Promise<Friendship> {
    const result = await apiRequest('/friends/request', {
      method: 'POST',
      body: JSON.stringify({ userId, friendId }),
    });
    return result.friendship;
  },

  // Accept friend request
  async acceptFriendRequest(friendshipId: number): Promise<Friendship> {
    const result = await apiRequest(`/friends/accept/${friendshipId}`, {
      method: 'PUT',
    });
    return result.friendship;
  },

  // Get friend requests
  async getFriendRequests(userId: number): Promise<any[]> {
    const result = await apiRequest(`/friends/requests/${userId}`);
    return result.requests;
  },
};

// Health check
export const healthAPI = {
  async checkHealth(): Promise<{ status: string; timestamp: string; version: string }> {
    const response = await fetch(`${API_BASE_URL}/health`);
    return response.json();
  },
}; 