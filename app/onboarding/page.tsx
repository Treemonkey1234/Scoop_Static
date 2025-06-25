'use client'

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Layout from '@/components/Layout'
import { CheckIcon, XMarkIcon } from '@heroicons/react/24/outline'

export default function OnboardingPage() {
  const router = useRouter()
  const [authUser, setAuthUser] = useState<any>(null)
  const [username, setUsername] = useState('')
  const [isCheckingUsername, setIsCheckingUsername] = useState(false)
  const [usernameStatus, setUsernameStatus] = useState<'available' | 'taken' | 'invalid' | null>(null)
  const [isCreatingProfile, setIsCreatingProfile] = useState(false)
  const [step, setStep] = useState<'loading' | 'username' | 'complete'>('loading')

  useEffect(() => {
    checkAuthAndProfile()
  }, [])

  const checkAuthAndProfile = async () => {
    try {
      const response = await fetch('/api/user')
      const data = await response.json()
      
      if (!data.session) {
        // No Auth0 session, redirect to signin
        router.push('/signin')
        return
      }

      setAuthUser(data.session)
      
      // Check if user already has a Scoop profile
      const existingProfile = localStorage.getItem('scoopUserId')
      if (existingProfile) {
        // User already has a profile, redirect to connected accounts
        router.push('/connected-accounts')
        return
      }

      setStep('username')
    } catch (error) {
      console.error('Error checking auth:', error)
      router.push('/signin')
    }
  }

  const checkUsernameAvailability = async (usernameToCheck: string) => {
    if (!usernameToCheck || usernameToCheck.length < 3) {
      setUsernameStatus('invalid')
      return
    }

    // Remove @ if user typed it
    const cleanUsername = usernameToCheck.replace('@', '')
    
    // Basic validation
    if (!/^[a-zA-Z0-9_]{3,20}$/.test(cleanUsername)) {
      setUsernameStatus('invalid')
      return
    }

    setIsCheckingUsername(true)
    
    // Simulate username availability check (in real app, this would be an API call)
    await new Promise(resolve => setTimeout(resolve, 500))
    
    // For demo, make some usernames "taken"
    const takenUsernames = ['admin', 'scoop', 'user', 'test', 'grant', 'john', 'jane']
    if (takenUsernames.includes(cleanUsername.toLowerCase())) {
      setUsernameStatus('taken')
    } else {
      setUsernameStatus('available')
    }
    
    setIsCheckingUsername(false)
  }

  const handleUsernameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setUsername(value)
    
    // Reset status and debounce check
    setUsernameStatus(null)
    clearTimeout((window as any).usernameTimeout)
    
    if (value.trim()) {
      (window as any).usernameTimeout = setTimeout(() => {
        checkUsernameAvailability(value)
      }, 300)
    }
  }

  const createScoopProfile = async () => {
    if (usernameStatus !== 'available' || !authUser) return

    setIsCreatingProfile(true)
    
    try {
      // Create Scoop profile
      const cleanUsername = username.replace('@', '')
      const scoopUserId = Date.now().toString() // In real app, this would be a proper UUID

      const scoopProfile = {
        id: scoopUserId,
        username: cleanUsername,
        name: authUser.name || 'New User',
        email: authUser.email || '',
        avatar: authUser.picture || '',
        bio: 'New to ScoopSocials! 🍦',
        location: 'Not specified',
        trustScore: 60, // Starting score with first connected account
        joinDate: new Date().toISOString().split('T')[0],
        connectedAccounts: [
          {
            provider: getProviderFromSub(authUser.sub),
            sub: authUser.sub,
            name: authUser.name,
            email: authUser.email,
            picture: authUser.picture,
            connectedAt: new Date().toISOString()
          }
        ],
        friendsCount: 0,
        reviewsCount: 0,
        eventsAttended: 0,
        phoneVerified: false,
        emailVerified: authUser.email_verified || false
      }

      // Save to localStorage (in real app, this would be saved to database)
      localStorage.setItem('scoopUserId', scoopUserId)
      localStorage.setItem('scoopProfile', JSON.stringify(scoopProfile))

      setStep('complete')
      
      // Redirect after a moment
      setTimeout(() => {
        router.push('/profile')
      }, 2000)

    } catch (error) {
      console.error('Error creating profile:', error)
      setIsCreatingProfile(false)
    }
  }

  const getProviderFromSub = (sub: string): string => {
    if (sub.startsWith('linkedin|')) return 'LinkedIn'
    if (sub.startsWith('google-oauth2|')) return 'Google'
    if (sub.startsWith('facebook|')) return 'Facebook'
    return 'Unknown'
  }

  const getConnectedPlatform = () => {
    if (!authUser?.sub) return 'social account'
    return getProviderFromSub(authUser.sub)
  }

  if (step === 'loading') {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <div className="w-8 h-8 border-2 border-cyan-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-slate-600">Setting up your account...</p>
          </div>
        </div>
      </Layout>
    )
  }

  if (step === 'complete') {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center max-w-md">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckIcon className="w-8 h-8 text-green-600" />
            </div>
            <h1 className="text-2xl font-bold text-slate-800 mb-2">Welcome to Scoop!</h1>
            <p className="text-slate-600 mb-4">
              Your profile has been created successfully. You're now part of the ScoopSocials community!
            </p>
            <div className="bg-cyan-50 border border-cyan-200 rounded-xl p-4">
              <p className="text-sm text-cyan-800">
                <strong>@{username.replace('@', '')}</strong> is now your Scoop username
              </p>
            </div>
          </div>
        </div>
      </Layout>
    )
  }

  return (
    <Layout>
      <div className="max-w-2xl mx-auto p-4 md:p-6">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-r from-cyan-500 to-teal-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
            <span className="text-white text-2xl">🍦</span>
          </div>
          <h1 className="text-3xl font-bold text-slate-800 mb-2">Welcome to ScoopSocials!</h1>
          <p className="text-slate-600">
            Great! You've connected your {getConnectedPlatform()} account. 
            Now let's create your unique Scoop username.
          </p>
        </div>

        {/* Connected Account Display */}
        <div className="bg-green-50 border border-green-200 rounded-xl p-4 mb-6">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 rounded-xl overflow-hidden">
              <img src={authUser?.picture || ''} alt="Profile" className="w-full h-full object-cover" />
            </div>
            <div>
              <h3 className="font-medium text-slate-800">{authUser?.name}</h3>
              <p className="text-sm text-green-700">✅ {getConnectedPlatform()} Connected</p>
            </div>
          </div>
        </div>

        {/* Username Selection */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-lg p-6">
          <h2 className="text-xl font-semibold text-slate-800 mb-4">Choose Your Scoop Username</h2>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Your Scoop Username
              </label>
              <div className="relative">
                <span className="absolute left-3 top-3 text-slate-500">@</span>
                <input
                  type="text"
                  value={username}
                  onChange={handleUsernameChange}
                  placeholder="your_username"
                  className={`w-full pl-8 pr-12 py-3 rounded-xl border transition-all duration-200 ${
                    usernameStatus === 'available' ? 'border-green-500 bg-green-50' :
                    usernameStatus === 'taken' ? 'border-red-500 bg-red-50' :
                    usernameStatus === 'invalid' ? 'border-red-500 bg-red-50' :
                    'border-slate-200 bg-white focus:border-cyan-500 focus:ring-2 focus:ring-cyan-200'
                  }`}
                />
                <div className="absolute right-3 top-3">
                  {isCheckingUsername && (
                    <div className="w-5 h-5 border-2 border-slate-300 border-t-cyan-500 rounded-full animate-spin"></div>
                  )}
                  {usernameStatus === 'available' && (
                    <CheckIcon className="w-5 h-5 text-green-500" />
                  )}
                  {(usernameStatus === 'taken' || usernameStatus === 'invalid') && (
                    <XMarkIcon className="w-5 h-5 text-red-500" />
                  )}
                </div>
              </div>
              
              {/* Status Messages */}
              {usernameStatus === 'available' && (
                <p className="text-sm text-green-600 mt-2">✅ @{username.replace('@', '')} is available!</p>
              )}
              {usernameStatus === 'taken' && (
                <p className="text-sm text-red-600 mt-2">❌ This username is already taken</p>
              )}
              {usernameStatus === 'invalid' && (
                <p className="text-sm text-red-600 mt-2">❌ Username must be 3-20 characters (letters, numbers, underscore only)</p>
              )}
            </div>

            {/* Username Requirements */}
            <div className="bg-slate-50 rounded-xl p-4">
              <h4 className="text-sm font-medium text-slate-800 mb-2">Username Requirements:</h4>
              <ul className="text-xs text-slate-600 space-y-1">
                <li>• 3-20 characters long</li>
                <li>• Letters, numbers, and underscores only</li>
                <li>• Must be unique across ScoopSocials</li>
                <li>• Cannot be changed later</li>
              </ul>
            </div>

            {/* Create Profile Button */}
            <button
              onClick={createScoopProfile}
              disabled={usernameStatus !== 'available' || isCreatingProfile}
              className={`w-full py-3 rounded-xl font-medium transition-all duration-200 ${
                usernameStatus === 'available' && !isCreatingProfile
                  ? 'bg-gradient-to-r from-cyan-500 to-teal-600 text-white hover:from-cyan-600 hover:to-teal-700 shadow-lg'
                  : 'bg-slate-200 text-slate-500 cursor-not-allowed'
              }`}
            >
              {isCreatingProfile ? (
                <div className="flex items-center justify-center space-x-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Creating Profile...</span>
                </div>
              ) : (
                'Create My Scoop Profile'
              )}
            </button>
          </div>
        </div>

        {/* Trust Score Info */}
        <div className="bg-cyan-50 border border-cyan-200 rounded-xl p-4 mt-6">
          <h3 className="text-sm font-semibold text-cyan-800 mb-2">🛡️ Building Your Trust Score</h3>
          <p className="text-xs text-cyan-700 mb-2">
            You've started with 60 points by connecting {getConnectedPlatform()}! 
          </p>
          <p className="text-xs text-cyan-600">
            💡 <strong>Pro Tip:</strong> Connect 5+ social accounts for maximum authenticity and trust score.
          </p>
        </div>
      </div>
    </Layout>
  )
} 