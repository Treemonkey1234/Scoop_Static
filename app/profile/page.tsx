'use client'

import React, { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import Layout from '@/components/Layout'
import TrustBadge from '@/components/TrustBadge'
import FlagModal from '@/components/FlagModal'
import { getCurrentUser, sampleReviews, sampleUsers, User, getUserActivities } from '@/lib/sampleData'
import { 
  Cog6ToothIcon,
  BellIcon,
  ShareIcon,
  CalendarIcon,
  MapPinIcon,
  UserGroupIcon,
  DocumentTextIcon,
  TrophyIcon,
  CheckBadgeIcon,
  StarIcon,
  ChevronDownIcon,
  ChevronUpIcon
} from '@heroicons/react/24/outline'
import { CheckBadgeIcon as CheckBadgeIconSolid } from '@heroicons/react/24/solid'

interface AuthUser {
  sub: string
  name: string
  email: string
  picture?: string
  email_verified?: boolean
  identities?: any[]
}

export default function ProfilePage() {
  const [currentUser, setCurrentUser] = useState<User | null>(null)
  const [authUser, setAuthUser] = useState<AuthUser | null>(null)
  const [showAllSocials, setShowAllSocials] = useState(false)
  const [showTrustBreakdown, setShowTrustBreakdown] = useState(false)
  const [flagModal, setFlagModal] = useState<{
    isOpen: boolean
    contentType: 'post' | 'event' | 'social'
    contentId: string
    contentTitle?: string
  }>({
    isOpen: false,
    contentType: 'social',
    contentId: '',
    contentTitle: ''
  })
  const [activeTab, setActiveTab] = useState<'overview' | 'events' | 'reviews'>('overview')

  // Fetch Auth0 user session data
  const fetchUserSession = async () => {
    try {
      const response = await fetch('/api/user')
      if (response.ok) {
        const data = await response.json()
        setAuthUser(data.session)
      } else {
        setAuthUser(null)
      }
    } catch (error) {
      console.error('Error fetching user session:', error)
      setAuthUser(null)
    }
  }

  // Calculate profile completeness for Auth0 users
  const calculateAuth0ProfileCompleteness = (user: AuthUser) => {
    let score = 0
    if (user.name) score += 20
    if (user.email) score += 20
    if (user.email_verified) score += 20
    if (user.picture) score += 20
    const connectedSocialCount = user.identities?.filter(identity => 
      identity.provider !== 'auth0' && 
      ['google-oauth2', 'facebook', 'linkedin', 'twitter', 'instagram', 'github'].includes(identity.provider)
    )?.length || 0
    if (connectedSocialCount > 0) score += 20 // Multiple connected accounts bonus
    return score
  }

  // Calculate profile completeness for sample users
  const calculateProfileCompleteness = (user: User) => {
    let score = 0
    if (user.name) score += 10
    if (user.bio) score += 10
    if (user.location) score += 10
    if (user.email) score += 10
    if (user.phoneVerified) score += 15
    if (Object.values(user.socialLinks).filter(Boolean).length > 0) score += 15
    if (Object.values(user.socialLinks).filter(Boolean).length >= 2) score += 15
    if (user.avatar !== 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face') score += 15
    return score
  }

  // Load user data on component mount
  useEffect(() => {
    fetchUserSession()
    const user = getCurrentUser()
    setCurrentUser(user)
  }, [])

  // Create display user object combining Auth0 and sample data
  const displayUser = authUser ? {
    id: authUser.sub,
    name: authUser.name || 'Anonymous User',
    email: authUser.email || '',
    avatar: authUser.picture || 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
    bio: 'Welcome to ScoopSocials! 🍦',
    location: 'Connected via Auth0',
    trustScore: 75, // Default trust score for Auth0 users
    reviewsCount: 0,
    friendsCount: authUser.identities?.filter(identity => 
      identity.provider !== 'auth0' && // Not the primary username/password connection
      ['google-oauth2', 'facebook', 'linkedin', 'twitter', 'instagram', 'github'].includes(identity.provider)
    )?.length || 0,
    eventsAttended: 0,
    socialLinks: {},
    phoneVerified: authUser.email_verified || false,
    joinDate: new Date().toISOString().split('T')[0],
    lastActive: new Date().toISOString(),
    connectedAccounts: authUser.identities?.filter(identity => 
      identity.provider !== 'auth0' && // Not the primary username/password connection
      ['google-oauth2', 'facebook', 'linkedin', 'twitter', 'instagram', 'github'].includes(identity.provider)
    ) || [],
    isAuth0User: true
  } : currentUser

  if (!displayUser) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="w-8 h-8 border-2 border-cyan-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      </Layout>
    )
  }

  const userReviews = sampleReviews.filter(r => r.reviewedId === displayUser.id)
  
  const handleFlag = (contentType: 'post' | 'event' | 'social', contentId: string, contentTitle?: string) => {
    console.log('Profile flag clicked:', { contentType, contentId, contentTitle })
    setFlagModal({
      isOpen: true,
      contentType,
      contentId,
      contentTitle
    })
  }

  const closeFlagModal = () => {
    setFlagModal({
      isOpen: false,
      contentType: 'social',
      contentId: '',
      contentTitle: ''
    })
  }

  // Trust Score Breakdown for Auth0 users
  const authTrustBreakdown = authUser ? [
    { category: 'Account Verification', score: authUser.email_verified ? 95 : 30, count: authUser.email_verified ? 'Email verified' : 'Pending verification' },
    { category: 'Profile Completeness', score: calculateAuth0ProfileCompleteness(authUser), count: `${calculateAuth0ProfileCompleteness(authUser)}% complete` },
    { category: 'Connected Accounts', score: Math.min(95, 30 + ((authUser.identities?.filter(identity => 
      identity.provider !== 'auth0' && 
      ['google-oauth2', 'facebook', 'linkedin', 'twitter', 'instagram', 'github'].includes(identity.provider)
    )?.length || 0) * 20)), count: `${authUser.identities?.filter(identity => 
      identity.provider !== 'auth0' && 
      ['google-oauth2', 'facebook', 'linkedin', 'twitter', 'instagram', 'github'].includes(identity.provider)
    )?.length || 0} social accounts` },
    { category: 'Time on Platform', score: 65, count: 'New member' },
    { category: 'Community Activity', score: 40, count: 'Getting started' },
    { category: 'Content Quality', score: 50, count: 'No posts yet' },
    { category: 'Social Engagement', score: 45, count: 'Building network' },
    { category: 'Events Participation', score: 40, count: 'No events yet' },
    { category: 'Positive Interactions', score: 75, count: 'Good standing' },
    { category: 'Flagging Accuracy', score: 60, count: 'No flags yet' },
    { category: 'Platform Contribution', score: 50, count: 'Starting journey' }
  ] : []

  // Trust Score Breakdown for sample users
  const sampleTrustBreakdown = currentUser ? [
    { category: 'Time Spent on App', score: currentUser.trustScore > 80 ? 94 : 65, count: currentUser.trustScore > 80 ? '120+ hours' : '20+ hours' },
    { category: 'Recent Activity', score: currentUser.trustScore > 80 ? 89 : 70, count: currentUser.trustScore > 80 ? 'Active daily' : 'Active weekly' },
    { category: 'Postings Quality', score: currentUser.trustScore > 80 ? 96 : 45, count: `${currentUser.reviewsCount} posts` },
    { category: 'Comments Engagement', score: currentUser.trustScore > 80 ? 88 : 50, count: currentUser.trustScore > 80 ? '156 comments' : '12 comments' },
    { category: 'Community Engagement', score: currentUser.trustScore > 80 ? 92 : 40, count: currentUser.trustScore > 80 ? '234 interactions' : '15 interactions' },
    { category: 'Friends Network', score: Math.min(95, 40 + (currentUser.friendsCount * 2)), count: `${currentUser.friendsCount} connections` },
    { category: 'Events Attended', score: Math.min(95, 40 + (currentUser.eventsAttended * 3)), count: `${currentUser.eventsAttended} events` },
    { category: 'Social Media Connected', score: Math.min(98, 30 + (Object.values(currentUser.socialLinks).filter(Boolean).length * 10)), count: `${Object.values(currentUser.socialLinks).filter(Boolean).length} accounts` },
    { category: 'Flagging Accuracy', score: currentUser.trustScore > 80 ? 91 : 60, count: currentUser.trustScore > 80 ? '23/25 accurate' : 'No flags yet' },
    { category: 'Positive Reactions', score: currentUser.trustScore > 80 ? 93 : 55, count: currentUser.trustScore > 80 ? '89% positive' : '65% positive' },
    { category: 'Profile Completeness', score: calculateProfileCompleteness(currentUser), count: `${calculateProfileCompleteness(currentUser)}% complete` }
  ] : []

  const trustBreakdown = authUser ? authTrustBreakdown : sampleTrustBreakdown

  // Social media platform SVG components
  const SocialIcon = ({ platform }: { platform: string }) => {
    const getIcon = () => {
      switch (platform) {
        case 'Facebook':
          return (
            <svg width="16" height="16" viewBox="0 0 24 24" fill="#1877F2">
              <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
            </svg>
          )
        case 'Twitter':
          return (
            <svg width="16" height="16" viewBox="0 0 24 24" fill="#1DA1F2">
              <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
            </svg>
          )
        case 'Instagram':
          return (
            <svg width="16" height="16" viewBox="0 0 24 24" fill="url(#instagram-gradient-profile)">
              <defs>
                <linearGradient id="instagram-gradient-profile" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#833AB4"/>
                  <stop offset="50%" stopColor="#FD1D1D"/>
                  <stop offset="100%" stopColor="#FCB045"/>
                </linearGradient>
              </defs>
              <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
            </svg>
          )
        case 'LinkedIn':
          return (
            <svg width="16" height="16" viewBox="0 0 24 24" fill="#0A66C2">
              <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
            </svg>
          )
        case 'GitHub':
          return (
            <svg width="16" height="16" viewBox="0 0 24 24" fill="#333">
              <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
            </svg>
          )
        case 'YouTube':
          return (
            <svg width="16" height="16" viewBox="0 0 24 24" fill="#FF0000">
              <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
            </svg>
          )
        case 'TikTok':
          return (
            <svg width="16" height="16" viewBox="0 0 24 24" fill="#000">
              <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z"/>
            </svg>
          )
        default:
          return (
            <svg width="16" height="16" viewBox="0 0 24 24" fill="#6B7280">
              <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" fill="none"/>
              <path d="M8 12h8M12 8v8" stroke="currentColor" strokeWidth="2"/>
            </svg>
          )
      }
    }
    
    return <div className="w-4 h-4">{getIcon()}</div>
  }

  // Convert socialLinks to array format for display
  const socialAccountsArray = Object.entries(displayUser.socialLinks || {})
    .filter(([platform, handle]) => handle && typeof handle === 'string' && handle.trim() !== '')
    .map(([platform, handle]) => ({ platform, handle: handle as string, verified: false, icon: '' }))
  
  const visibleSocials = showAllSocials ? socialAccountsArray : socialAccountsArray.slice(0, 6)

  const getSocialMediaUrl = (platform: string, handle: string): string => {
    switch (platform) {
      case 'Facebook':
        return `https://facebook.com/${handle}`
      case 'Twitter':
        return `https://twitter.com/${handle}`
      case 'Instagram':
        return `https://instagram.com/${handle}`
      case 'LinkedIn':
        return `https://linkedin.com/in/${handle}`
      case 'TikTok':
        return `https://tiktok.com/@${handle}`
      case 'YouTube':
        return `https://youtube.com/@${handle}`
      case 'GitHub':
        return `https://github.com/${handle}`
      case 'Discord':
        return `https://discord.com/users/${handle}`
      case 'Reddit':
        return `https://reddit.com/user/${handle}`
      case 'Twitch':
        return `https://twitch.tv/${handle}`
      case 'Pinterest':
        return `https://pinterest.com/${handle}`
      case 'Snapchat':
        return `https://snapchat.com/add/${handle}`
      case 'WhatsApp':
        return `https://wa.me/${handle}`
      case 'Telegram':
        return `https://t.me/${handle}`
      case 'BeReal':
        return `https://bere.al/${handle}`
      default:
        return '#'
    }
  }

  // Recent Activity Component
  const RecentActivitySection = ({ userId }: { userId: string }) => {
    const activities = getUserActivities().filter(activity => activity.userId === userId).slice(0, 5)
    
    if (activities.length === 0) {
      return (
        <div className="text-center py-6 text-slate-500">
          <p className="text-sm">No recent activity to show</p>
          <p className="text-xs mt-1">Start creating reviews or attending events to see your activity here!</p>
        </div>
      )
    }

    const getActivityIcon = (activity: string) => {
      switch (activity) {
        case 'review_created': return '✍️'
        case 'event_created': return '🎉'
        case 'event_attended': return '🎪'
        case 'friend_added': return '👥'
        case 'profile_completed': return '✅'
        case 'phone_verified': return '📱'
        case 'social_connected': return '🔗'
        case 'account_created': return '🎊'
        default: return '📝'
      }
    }

    const getActivityText = (activity: any) => {
      switch (activity.activity) {
        case 'review_created': return `Created a review in ${activity.metadata?.category || 'General'}`
        case 'event_created': return `Created event "${activity.metadata?.eventTitle || 'Untitled'}"`
        case 'event_attended': return `Attended event "${activity.metadata?.eventTitle || 'Event'}"`
        case 'friend_added': return 'Added a new friend'
        case 'profile_completed': return 'Completed profile setup'
        case 'phone_verified': return 'Verified phone number'
        case 'social_connected': return `Connected ${activity.metadata?.platform || 'social'} account`
        case 'account_created': return 'Joined ScoopSocials'
        default: return activity.activity.replace(/_/g, ' ')
      }
    }

    const getTimeAgo = (timestamp: string) => {
      const now = new Date()
      const activityTime = new Date(timestamp)
      const diffMs = now.getTime() - activityTime.getTime()
      const diffMins = Math.floor(diffMs / (1000 * 60))
      const diffHours = Math.floor(diffMs / (1000 * 60 * 60))
      const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))

      if (diffMins < 60) return `${diffMins}m ago`
      if (diffHours < 24) return `${diffHours}h ago`
      return `${diffDays}d ago`
    }

    return (
      <div className="space-y-3">
        {activities.map((activity, index) => (
          <div key={activity.id} className="flex items-start space-x-3 p-3 bg-slate-50 rounded-xl">
            <div className="text-lg">{getActivityIcon(activity.activity)}</div>
            <div className="flex-1 min-w-0">
              <p className="text-sm text-slate-800">{getActivityText(activity)}</p>
              <p className="text-xs text-slate-500">{getTimeAgo(activity.timestamp)}</p>
            </div>
          </div>
        ))}
      </div>
    )
  }

  return (
    <Layout>
      <div className="p-4 space-y-6">
        {/* Profile Header */}
        <div className="card-soft bg-gradient-to-r from-cyan-50 to-teal-50 border-cyan-200">
          <div className="flex items-start space-x-4 mb-6">
            <div className="relative">
              <Image
                src={displayUser.avatar}
                alt={displayUser.name}
                width={80}
                height={80}
                className="rounded-2xl"
              />
                              {(displayUser as any).isAuth0User && (
                  <div className="absolute -bottom-2 -right-2 w-6 h-6 bg-cyan-500 rounded-full flex items-center justify-center">
                    <CheckBadgeIcon className="w-4 h-4 text-white" />
                  </div>
                )}
            </div>
            <div className="flex-1">
              <div className="flex items-center space-x-2 mb-1">
                <h2 className="text-xl font-bold text-slate-800">{displayUser.name}</h2>
                <TrustBadge score={displayUser.trustScore} size="sm" />
              </div>
              <p className="text-slate-600 mb-2">@{displayUser.name.toLowerCase().replace(/\s+/g, '_')}</p>
              <p className="text-slate-700 mb-3">{displayUser.bio}</p>
              <div className="flex items-center space-x-2 text-sm text-slate-500">
                <MapPinIcon className="w-4 h-4" />
                <span>{displayUser.location}</span>
                <span>•</span>
                <CalendarIcon className="w-4 h-4" />
                <span>Joined {new Date(displayUser.joinDate).getFullYear()}</span>
              </div>
            </div>
          </div>

          {/* Account Type Badge */}
          <div className="mb-4">
            <div className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-semibold ${
              displayUser.trustScore >= 80 
                ? 'bg-gradient-to-r from-amber-400 to-amber-500 text-white shadow-lg'
                : displayUser.trustScore >= 60
                ? 'bg-gradient-to-r from-cyan-500 to-cyan-600 text-white shadow-lg'
                : 'bg-slate-100 text-slate-700'
            }`}>
              {displayUser.trustScore >= 80 && '👑 Premium Member'}
              {displayUser.trustScore >= 60 && displayUser.trustScore < 80 && '⭐ Trusted Member'}
              {displayUser.trustScore < 60 && '🆓 Standard Member'}
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-slate-800">{displayUser.friendsCount}</div>
              <div className="text-sm text-slate-500">Friends</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-slate-800">{displayUser.reviewsCount}</div>
              <div className="text-sm text-slate-500">Reviews</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-slate-800">{displayUser.eventsAttended}</div>
              <div className="text-sm text-slate-500">Events</div>
            </div>
          </div>
        </div>

        {/* Trust Score Section - Collapsed by Default */}
        <div className="card-soft bg-gradient-to-r from-cyan-50 to-teal-50 border-cyan-200">
          <div 
            className="flex items-center justify-between cursor-pointer"
            onClick={() => setShowTrustBreakdown(!showTrustBreakdown)}
          >
            <div className="flex items-center space-x-3">
              <TrophyIcon className="w-5 h-5 text-cyan-500" />
              <div>
                <div className="text-3xl font-bold text-cyan-700">{displayUser.trustScore}</div>
                <div className="text-sm text-slate-600">Trust Score</div>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-sm text-slate-500">
                {showTrustBreakdown ? 'Hide breakdown' : 'View breakdown'}
              </span>
              {showTrustBreakdown ? (
                <ChevronUpIcon className="w-5 h-5 text-slate-500" />
              ) : (
                <ChevronDownIcon className="w-5 h-5 text-slate-500" />
              )}
            </div>
          </div>

          {/* Expanded Trust Score Breakdown */}
          {showTrustBreakdown && (
            <div className="mt-6 pt-6 border-t border-cyan-200">
              <h4 className="text-lg font-semibold text-slate-800 mb-4">Trust Score Components</h4>
              <div className="space-y-4">
                {trustBreakdown.map((item, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm font-medium text-slate-700">{item.category}</span>
                        <div className="flex items-center space-x-2">
                          <span className="text-sm font-semibold text-slate-800">{item.score}</span>
                          <span className="text-xs text-slate-500">({item.count})</span>
                        </div>
                      </div>
                      <div className="w-full bg-slate-200 rounded-full h-2">
                        <div 
                          className="bg-gradient-to-r from-cyan-500 to-teal-600 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${item.score}%` }}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="mt-6 p-4 bg-white/80 rounded-xl border border-cyan-200">
                <h5 className="text-sm font-semibold text-slate-800 mb-2">Trust Score Calculation</h5>
                <p className="text-xs text-slate-600">
                  Your trust score is calculated using a weighted average of 11 key factors. 
                  Social media verification and community engagement carry the highest weights.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Connected Accounts - Redesigned with Icons Only */}
        <div className="card-soft">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-slate-800 flex items-center">
              <span className="mr-2">🌐</span>
              Connected Accounts
            </h3>
            <span className="text-sm text-cyan-600 bg-cyan-100 px-2 py-1 rounded-full">
                              {socialAccountsArray.length} connected
            </span>
          </div>
          
          {/* Icons Only View */}
          <div className="flex flex-wrap gap-3 mb-4">
            {visibleSocials.map((account, index) => (
              <a 
                key={index}
                href={getSocialMediaUrl(account.platform, account.handle)}
                target="_blank"
                rel="noopener noreferrer"
                className="w-12 h-12 bg-gradient-to-br from-cyan-100 to-teal-100 rounded-xl flex items-center justify-center text-2xl hover:scale-110 transition-transform duration-200 cursor-pointer border border-cyan-200"
                title={`${account.platform}: ${account.handle}`}
              >
                <SocialIcon platform={account.platform} />
              </a>
            ))}
            
            {/* Add Account Button */}
            <Link
              href="/connected-accounts"
              className="w-12 h-12 bg-slate-100 hover:bg-slate-200 rounded-xl flex items-center justify-center text-xl cursor-pointer transition-all duration-200 border-2 border-dashed border-slate-300"
            >
              ➕
            </Link>
          </div>

          {/* View More / View Less Button */}
          {socialAccountsArray.length > 6 && (
            <button
              onClick={() => setShowAllSocials(!showAllSocials)}
              className="text-sm text-cyan-600 hover:text-cyan-700 font-medium"
            >
              {showAllSocials ? 'View Less' : `View More (${socialAccountsArray.length - 6} more)`}
            </button>
          )}

          {/* Link to Detailed View */}
          <div className="mt-4 pt-4 border-t border-slate-200">
            <Link 
              href="/connected-accounts"
              className="text-sm text-cyan-600 hover:text-cyan-700 font-medium"
            >
              View all accounts →
            </Link>
          </div>
        </div>

        {/* Recent Reviews */}
        <div className="card-soft">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-slate-800 flex items-center">
              <StarIcon className="w-5 h-5 mr-2 text-cyan-500" />
              Recent Reviews
            </h3>
            <Link href="/profile/reviews" className="text-sm text-cyan-600 hover:text-cyan-700 font-medium">
              View all →
            </Link>
          </div>
          <div className="space-y-3">
            {userReviews.slice(0, 3).map((review) => {
              const reviewer = sampleUsers.find(u => u.id === review.reviewerId)
              return (
                <div key={review.id} className="p-3 bg-slate-50 rounded-xl">
                  <div className="flex items-center space-x-2 mb-2">
                    <span className="text-sm font-medium text-slate-800">{reviewer?.name}</span>
                    <span className="text-xs text-cyan-600 bg-cyan-100 px-2 py-1 rounded-full">
                      {review.category}
                    </span>
                  </div>
                  <p className="text-sm text-slate-700">"{review.content}"</p>
                </div>
              )
            })}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="card-soft">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-slate-800 flex items-center">
              <DocumentTextIcon className="w-5 h-5 mr-2 text-cyan-500" />
              Recent Activity
            </h3>
            <span className="text-sm text-slate-500">Last 7 days</span>
          </div>
          <RecentActivitySection userId={displayUser.id} />
        </div>

        {/* Settings Link */}
        <div className="text-center">
          <Link
            href="/settings"
            className="inline-flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-cyan-500 to-teal-600 text-white rounded-xl hover:from-cyan-600 hover:to-teal-700 transition-all duration-200 shadow-lg"
          >
            <Cog6ToothIcon className="w-5 h-5" />
            <span className="font-medium">Settings</span>
          </Link>
        </div>
      </div>

      {/* Flag Modal */}
      <FlagModal
        isOpen={flagModal.isOpen}
        onClose={closeFlagModal}
        contentType={flagModal.contentType}
        contentId={flagModal.contentId}
        contentTitle={flagModal.contentTitle}
      />
    </Layout>
  )
} 