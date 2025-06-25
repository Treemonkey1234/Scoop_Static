export interface ScoopProfile {
  id: string
  username: string
  name: string
  email: string
  avatar: string
  bio: string
  location: string
  trustScore: number
  joinDate: string
  connectedAccounts: ConnectedAccount[]
  friendsCount: number
  reviewsCount: number
  eventsAttended: number
  phoneVerified: boolean
  emailVerified: boolean
}

export interface ConnectedAccount {
  provider: string
  sub: string
  name: string
  email: string
  picture: string
  connectedAt: string
}

// Get current Scoop profile from localStorage
export function getCurrentScoopProfile(): ScoopProfile | null {
  if (typeof window === 'undefined') return null
  
  try {
    const profileData = localStorage.getItem('scoopProfile')
    if (profileData) {
      return JSON.parse(profileData)
    }
  } catch (error) {
    console.error('Error loading Scoop profile:', error)
  }
  return null
}

// Save Scoop profile to localStorage
export function saveScoopProfile(profile: ScoopProfile): void {
  if (typeof window === 'undefined') return
  
  try {
    localStorage.setItem('scoopProfile', JSON.stringify(profile))
    localStorage.setItem('scoopUserId', profile.id)
  } catch (error) {
    console.error('Error saving Scoop profile:', error)
  }
}

// Add a connected account to existing Scoop profile
export function addConnectedAccount(authUser: any): boolean {
  const profile = getCurrentScoopProfile()
  if (!profile) return false

  const providerName = getProviderFromSub(authUser.sub)
  
  // Check if this account is already connected
  const existingAccount = profile.connectedAccounts.find(acc => acc.sub === authUser.sub)
  if (existingAccount) {
    console.log('Account already connected:', providerName)
    return true
  }

  // Add new connected account
  const newAccount: ConnectedAccount = {
    provider: providerName,
    sub: authUser.sub,
    name: authUser.name || '',
    email: authUser.email || '',
    picture: authUser.picture || '',
    connectedAt: new Date().toISOString()
  }

  profile.connectedAccounts.push(newAccount)
  
  // Update trust score based on number of connected accounts
  profile.trustScore = calculateTrustScore(profile.connectedAccounts.length)
  
  // Save updated profile
  saveScoopProfile(profile)
  
  console.log('Added connected account:', providerName)
  return true
}

// Calculate trust score based on connected accounts
function calculateTrustScore(accountCount: number): number {
  const baseScore = 50 // Starting score
  const maxScore = 95  // Maximum possible score
  
  if (accountCount === 0) return baseScore
  
  // Full points for first 5 accounts (10 points each)
  let score = baseScore + Math.min(accountCount, 5) * 10
  
  // Diminishing returns after 5 accounts (2 points each)
  if (accountCount > 5) {
    score += Math.min(accountCount - 5, 10) * 2
  }
  
  return Math.min(score, maxScore)
}

// Get provider name from Auth0 sub
function getProviderFromSub(sub: string): string {
  if (sub.startsWith('linkedin|')) return 'LinkedIn'
  if (sub.startsWith('google-oauth2|')) return 'Google'
  if (sub.startsWith('facebook|')) return 'Facebook'
  if (sub.startsWith('twitter|')) return 'Twitter'
  if (sub.startsWith('instagram|')) return 'Instagram'
  if (sub.startsWith('github|')) return 'GitHub'
  return 'Unknown'
}

// Check if user has Scoop profile
export function hasScoopProfile(): boolean {
  return getCurrentScoopProfile() !== null
}

// Get connected account names for filtering available platforms
export function getConnectedPlatformNames(): string[] {
  const profile = getCurrentScoopProfile()
  if (!profile) return []
  
  return profile.connectedAccounts.map(acc => acc.provider)
}

// Format connected accounts for display
export function formatConnectedAccountsForDisplay() {
  const profile = getCurrentScoopProfile()
  if (!profile) return []
  
  return profile.connectedAccounts.map(acc => ({
    platform: acc.provider,
    handle: acc.email || acc.name || 'Connected account',
    verified: true,
    icon: '',
    connectedAt: acc.connectedAt
  }))
}

// Check if user is authenticated (has Auth0 session)
export async function checkAuth0Session() {
  try {
    const response = await fetch('/api/user')
    const data = await response.json()
    return data.session || null
  } catch (error) {
    console.error('Error checking Auth0 session:', error)
    return null
  }
}

// Handle Auth0 callback for existing users (add account to profile)
export async function handleAccountLinking() {
  const authUser = await checkAuth0Session()
  if (!authUser) return false
  
  const hasProfile = hasScoopProfile()
  if (hasProfile) {
    // Add this account to existing profile
    return addConnectedAccount(authUser)
  } else {
    // New user, should go through onboarding
    return false
  }
} 