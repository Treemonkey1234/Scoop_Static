'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import Layout from '@/components/Layout'
import SocialIcon from '@/components/SocialIcon'
import { getCurrentUser, User, connectSocialAccount, socialPlatforms } from '@/lib/sampleData'
import { getCurrentScoopProfile, getConnectedPlatformNames, formatConnectedAccountsForDisplay } from '@/lib/scoopProfile'
import { 
  ArrowLeftIcon,
  PlusIcon,
  CheckBadgeIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  BoltIcon
} from '@heroicons/react/24/outline'

export default function ConnectedAccounts() {
  const router = useRouter()
  const [currentUser, setCurrentUser] = useState<User | null>(null)
  const [authUser, setAuthUser] = useState<any>(null)
  const [currentPage, setCurrentPage] = useState(0)
  const [selectedPlatform, setSelectedPlatform] = useState<string | null>(null)
  const [usernameInput, setUsernameInput] = useState('')
  const [startX, setStartX] = useState(0)
  const platformsPerPage = 6

  // Define which platforms have Auth0 integration (ordered by popularity)
  const auth0Platforms = [
    'Google', 'Facebook', 'Apple', 'Microsoft', 'LinkedIn', 'GitHub', 
    'YouTube', 'Twitter', 'Discord', 'PayPal', 'Snapchat', 'Spotify', 'Twitch', 
    'Fitbit', 'ID.me', 'IDPartner', 'Okta'
  ]
  
  // Fetch Auth0 user session data
  const fetchUserSession = async () => {
    try {
      const response = await fetch('/api/user')
      if (response.ok) {
        const data = await response.json()
        setAuthUser(data.session)
        
        // Check if this is an account linking operation
        if (data.session?.isAccountLinking) {
          // Account linking detected, adding account to Scoop profile
          await handleAccountLinking(data.session)
        }
        
        // Debug logging to understand Auth0 data structure
        if (data.session) {
          console.log('Auth0 User Session:', data.session)
        }
      } else {
        setAuthUser(null)
      }
    } catch (error) {
      console.error('Error fetching user session:', error)
      setAuthUser(null)
    }
  }

  // Handle adding a new connected account to existing Scoop profile
  const handleAccountLinking = async (authSession: any) => {
    try {
      // Import the account linking function
      const { addConnectedAccount } = await import('@/lib/scoopProfile')
      const success = addConnectedAccount(authSession)
      
      if (success) {
        // Successfully added connected account
        // Refresh the page data
        const updatedUser = getCurrentUser()
        setCurrentUser(updatedUser)
      } else {
        console.error('Failed to add connected account')
      }
    } catch (error) {
      console.error('Error during account linking:', error)
    }
  }
  
  useEffect(() => {
    fetchUserSession()
    const user = getCurrentUser()
    setCurrentUser(user)
    
    // Check if user just connected a social account via Auth0
    checkAuth0Connection()
  }, [])
  
  const checkAuth0Connection = async () => {
    try {
      const response = await fetch('/api/user')
      const data = await response.json()
      
      if (data.user?.connectedPlatform && data.user?.connectedUsername) {
        // Save the connection to the current user
        handleConnect(data.user.connectedPlatform, data.user.connectedUsername)
        
        // Show success message (optional)
        console.log(`Connected ${data.user.connectedPlatform} account: ${data.user.connectedUsername}`)
      }
    } catch (error) {
      console.error('Error checking Auth0 connection:', error)
    }
  }

  const handleConnect = (platform: string, username?: string) => {
    if (currentUser) {
      connectSocialAccount(platform, currentUser.id, username)
      // Refresh user data
      const updatedUser = getCurrentUser()
      setCurrentUser(updatedUser)
    }
  }

  const handleAuth0Connect = (platform: string) => {
    // Map platform names to Auth0 connection strings
    const connectionMap: { [key: string]: string } = {
      'Google': 'google-oauth2',
      'Facebook': 'facebook',
      'Apple': 'apple',
      'Microsoft': 'windowslive',
      'LinkedIn': 'linkedin',
      'GitHub': 'github',
      'YouTube': 'google-oauth2', // YouTube uses Google OAuth with YouTube scopes
      'Twitter': 'twitter',
      'Discord': 'discord',
      'PayPal': 'paypal',
      'Snapchat': 'snapchat',
      'Spotify': 'spotify',
      'Twitch': 'twitch',
      'Fitbit': 'fitbit',
      'ID.me': 'samlp', // ID.me uses SAML
      'IDPartner': 'samlp', // IDPartner uses SAML  
      'Okta': 'okta'
    }
    
    const connection = connectionMap[platform]
    if (connection) {
      let authUrl = `/api/auth/login?connection=${connection}&returnTo=${encodeURIComponent('/connected-accounts')}`
      
      // For YouTube, add YouTube scopes to Google OAuth
      if (platform === 'YouTube') {
        const youtubeScopes = 'openid profile email https://www.googleapis.com/auth/youtube.readonly https://www.googleapis.com/auth/youtube'
        authUrl += `&scope=${encodeURIComponent(youtubeScopes)}`
      }
      
      // Redirect to Auth0 login with the specific social provider
      window.location.href = authUrl
    }
  }

  // Get connected platform names from Scoop profile or fallback to old system
  const scoopProfile = getCurrentScoopProfile()
  const connectedPlatformNames = scoopProfile ? getConnectedPlatformNames() : (
    authUser ? (
      authUser.identities?.filter((identity: any) => 
        identity.provider !== 'auth0' && 
        ['google-oauth2', 'facebook', 'linkedin', 'twitter', 'instagram', 'github'].includes(identity.provider)
      ).map((identity: any) => {
        // Map Auth0 provider names to platform names
        const providerMap: { [key: string]: string } = {
          'google-oauth2': 'Google',
          'facebook': 'Facebook', 
          'linkedin': 'LinkedIn',
          'twitter': 'Twitter',
          'instagram': 'Instagram',
          'github': 'GitHub'
        }
        return providerMap[identity.provider] || identity.provider
      }) || []
    ) : (
      // For sample data users
      Object.entries(currentUser?.socialLinks || {})
        .filter(([_, handle]) => handle)
        .map(([platform, _]) => platform.charAt(0).toUpperCase() + platform.slice(1))
    )
  )
  
  // Filter out connected platforms from available platforms
  const availablePlatforms = Object.entries(socialPlatforms).filter(([platform, _]) => 
    !connectedPlatformNames.includes(platform)
  )
  
  const totalPages = Math.ceil(availablePlatforms.length / platformsPerPage)
  const currentPlatforms = availablePlatforms.slice(
    currentPage * platformsPerPage,
    (currentPage + 1) * platformsPerPage
  )

  // Touch event handlers for swipe navigation
  const handleTouchStart = (e: React.TouchEvent) => {
    setStartX(e.touches[0].clientX)
  }

  const handleTouchEnd = (e: React.TouchEvent) => {
    const endX = e.changedTouches[0].clientX
    const diff = startX - endX

    if (Math.abs(diff) > 50) { // Minimum swipe distance
      if (diff > 0 && currentPage < totalPages - 1) {
        // Swipe left - next page
        setCurrentPage(prev => prev + 1)
      } else if (diff < 0 && currentPage > 0) {
        // Swipe right - previous page
        setCurrentPage(prev => prev - 1)
      }
    }
  }

  return (
    <Layout>
      <div className="max-w-4xl mx-auto p-4 md:p-6 space-y-8 md:space-y-10">
        {/* Header */}
        <div className="mb-6 md:mb-8 flex items-center justify-between">
          <div className="flex items-center space-x-3 md:space-x-4">
            <Link href="/profile" className="p-2 hover:bg-slate-100 rounded-lg transition-colors">
              <ArrowLeftIcon className="w-5 h-5 md:w-6 md:h-6 text-slate-600" />
            </Link>
            <div className="min-w-0">
              <h1 className="text-xl md:text-2xl font-bold text-slate-800">Connected Accounts</h1>
              <p className="text-sm text-slate-600 mt-1 hidden sm:block">Manage your social media connections</p>
            </div>
          </div>
          <div className="bg-gradient-to-r from-cyan-500 to-teal-500 text-white px-3 md:px-4 py-2 rounded-full text-xs md:text-sm font-medium whitespace-nowrap">
            {authUser 
              ? (authUser.identities?.filter((identity: any) => 
                  identity.provider !== 'auth0' && 
                  ['google-oauth2', 'facebook', 'linkedin', 'twitter', 'instagram', 'github'].includes(identity.provider)
                )?.length || 0)
              : (Object.values(currentUser?.socialLinks || {}).filter(Boolean).length || 0)
            } connected
          </div>
        </div>

        {/* Connected Social Accounts */}
        {(scoopProfile ? 
          (scoopProfile.connectedAccounts.length > 0) :
          (authUser ? 
            (authUser.identities?.filter((identity: any) => 
              identity.provider !== 'auth0' && 
              ['google-oauth2', 'facebook', 'linkedin', 'twitter', 'instagram', 'github'].includes(identity.provider)
            )?.length > 0) :
            Object.values(currentUser?.socialLinks || {}).some(Boolean)
          )
        ) && (
          <div className="bg-white rounded-2xl border border-slate-200 shadow-lg p-5 md:p-6">
            <div className="flex items-center space-x-2 mb-6">
              <div className="w-3 h-3 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full"></div>
              <h2 className="text-lg font-semibold text-slate-800">Your Connected Accounts</h2>
            </div>
            
            <div className="space-y-4">
              {scoopProfile ? (
                // Display Scoop profile connected accounts
                scoopProfile.connectedAccounts.map((account, index) => {
                  const platformMap: { [key: string]: { name: string } } = {
                    'Google': { name: 'Google' },
                    'Facebook': { name: 'Facebook' },
                    'LinkedIn': { name: 'LinkedIn' },
                    'Twitter': { name: 'Twitter' },
                    'Instagram': { name: 'Instagram' },
                    'GitHub': { name: 'GitHub' }
                  }
                  
                  const platformInfo = platformMap[account.provider] || { name: account.provider }
                  
                  return (
                    <div key={index} className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-xl p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4 min-w-0 flex-1">
                          <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center shadow-sm border border-green-100 flex-shrink-0">
                            <SocialIcon platform={platformInfo.name} size={24} />
                          </div>
                          <div className="min-w-0 flex-1">
                            <h3 className="font-medium text-slate-800">{platformInfo.name}</h3>
                            <p className="text-sm text-slate-600 truncate">
                              {account.email || account.name || 'Connected account'}
                            </p>
                            <p className="text-xs text-slate-500">
                              Connected {new Date(account.connectedAt).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2 flex-shrink-0">
                          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                          <span className="text-xs text-green-700 font-medium">Verified</span>
                        </div>
                      </div>
                    </div>
                  )
                })
              ) : authUser ? (
                // Fallback: Display Auth0 connected accounts
                authUser.identities?.filter((identity: any) => 
                  identity.provider !== 'auth0' && 
                  ['google-oauth2', 'facebook', 'linkedin', 'twitter', 'instagram', 'github'].includes(identity.provider)
                ).map((identity: any, index: number) => {
                  // Map Auth0 provider names to display names
                  const platformMap: { [key: string]: { name: string } } = {
                    'google-oauth2': { name: 'Google' },
                    'facebook': { name: 'Facebook' },
                    'linkedin': { name: 'LinkedIn' },
                    'twitter': { name: 'Twitter' },
                    'instagram': { name: 'Instagram' },
                    'github': { name: 'GitHub' }
                  }
                  
                  const platformInfo = platformMap[identity.provider] || { name: identity.provider }
                  
                  return (
                    <div key={index} className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-xl p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4 min-w-0 flex-1">
                          <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center shadow-sm border border-green-100 flex-shrink-0">
                            <SocialIcon platform={platformInfo.name} size={24} />
                          </div>
                          <div className="min-w-0 flex-1">
                            <h3 className="font-medium text-slate-800">{platformInfo.name}</h3>
                            <p className="text-sm text-slate-600 truncate">
                              {identity.profileData?.email || identity.profileData?.name || 'Connected account'}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2 flex-shrink-0">
                          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                          <span className="text-xs text-green-700 font-medium">Connected</span>
                        </div>
                      </div>
                    </div>
                  )
                })
              ) : (
                // Display sample data connected accounts (fallback)
                Object.entries(currentUser?.socialLinks || {}).map(([platform, handle], index) => (
                  handle && (
                    <div key={index} className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-xl p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4 min-w-0 flex-1">
                          <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center shadow-sm border border-green-100 flex-shrink-0">
                            <SocialIcon platform={platform} size={24} />
                          </div>
                          <div className="min-w-0 flex-1">
                            <h3 className="font-medium text-slate-800 capitalize">{platform}</h3>
                            <p className="text-sm text-slate-600 truncate">{handle}</p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2 flex-shrink-0">
                          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                          <span className="text-xs text-green-700 font-medium">Connected</span>
                        </div>
                      </div>
                    </div>
                  )
                ))
              )}
            </div>
          </div>
        )}

        {/* Available Platforms - Swipeable */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-lg p-5 md:p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="min-w-0">
              <h2 className="text-lg font-semibold text-slate-800">Available Platforms</h2>
            </div>
            <div className="flex items-center space-x-2 flex-shrink-0">
              <span className="text-xs text-slate-500">Page {currentPage + 1} of {totalPages}</span>
              <div className="flex space-x-1">
                <button
                  onClick={() => setCurrentPage(prev => prev > 0 ? prev - 1 : prev)}
                  disabled={currentPage === 0}
                  className="p-2 rounded-lg hover:bg-slate-100 disabled:opacity-50 disabled:hover:bg-transparent transition-colors"
                >
                  <ChevronLeftIcon className="w-5 h-5" />
                </button>
                <button
                  onClick={() => setCurrentPage(prev => prev < totalPages - 1 ? prev + 1 : prev)}
                  disabled={currentPage === totalPages - 1}
                  className="p-2 rounded-lg hover:bg-slate-100 disabled:opacity-50 disabled:hover:bg-transparent transition-colors"
                >
                  <ChevronRightIcon className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>

          {/* Swipe instruction for mobile */}
          <div className="text-center text-sm text-slate-500 mb-6 md:hidden bg-slate-50 py-3 rounded-lg">
            ← Swipe to navigate between platforms →
          </div>

          {/* Swipeable platform grid */}
          <div
            className="grid grid-cols-2 gap-4"
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
          >
            {currentPlatforms.map(([platform, icon]) => {
              // Check if platform is connected (should not happen since we filter them out, but keeping for safety)
              const isConnected = connectedPlatformNames.includes(platform)

              return (
                <div
                  key={platform}
                  className={`relative p-4 rounded-xl border-2 transition-all hover:shadow-lg transform hover:-translate-y-1 ${
                    isConnected
                      ? 'border-green-200 bg-gradient-to-br from-green-50 to-emerald-50'
                      : 'border-slate-200 bg-white hover:border-cyan-200 hover:bg-gradient-to-br hover:from-cyan-50 hover:to-teal-50'
                  }`}
                >
                  <div className="flex flex-col items-center space-y-3">
                    <div className="w-12 h-12 flex items-center justify-center bg-white rounded-xl shadow-sm border border-gray-100">
                      <SocialIcon platform={platform} size={24} />
                    </div>
                    <div className="text-center min-w-0 w-full">
                      <h3 className="font-medium text-slate-800 text-sm truncate">{platform}</h3>
                      {isConnected ? (
                        <span className="text-xs text-green-600 flex items-center justify-center mt-1">
                          <CheckBadgeIcon className="w-3 h-3 mr-1 flex-shrink-0" />
                          Connected
                        </span>
                      ) : (
                        <button
                          onClick={() => {
                            if (auth0Platforms.includes(platform)) {
                              handleAuth0Connect(platform)
                            } else {
                              setSelectedPlatform(platform)
                            }
                          }}
                          className="text-xs text-cyan-600 hover:text-cyan-700 mt-1 hover:underline transition-colors"
                        >
                          Connect →
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Connect Platform Form - Only for non-Auth0 platforms */}
        {selectedPlatform && !auth0Platforms.includes(selectedPlatform) && (
          <div className="bg-white rounded-2xl border border-slate-200 shadow-lg p-5 md:p-6">
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-3 h-3 bg-gradient-to-r from-cyan-500 to-teal-500 rounded-full"></div>
              <h2 className="text-lg font-semibold text-slate-800">
                Connect {selectedPlatform}
              </h2>
            </div>
            
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  {selectedPlatform} Username
                </label>
                <input
                  type="text"
                  value={usernameInput}
                  onChange={(e) => setUsernameInput(e.target.value)}
                  placeholder={`Enter your ${selectedPlatform} username`}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition-colors"
                />
              </div>
              
              <div className="flex space-x-3">
                <button
                  onClick={() => {
                    handleConnect(selectedPlatform, usernameInput.trim())
                    setSelectedPlatform(null)
                    setUsernameInput('')
                  }}
                  disabled={!usernameInput.trim()}
                  className="flex-1 btn-primary py-3 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                >
                  Connect Account
                </button>
                <button
                  onClick={() => {
                    setSelectedPlatform(null)
                    setUsernameInput('')
                  }}
                  className="px-6 py-3 text-slate-600 hover:bg-slate-100 rounded-xl transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </Layout>
  )
} 