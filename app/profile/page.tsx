'use client'

import React, { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import Layout from '@/components/Layout'
import TrustBadge from '@/components/TrustBadge'
import FlagModal from '@/components/FlagModal'
import { getCurrentUser, sampleReviews, sampleUsers, User } from '@/lib/sampleData'
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

export default function ProfilePage() {
  const [currentUser, setCurrentUser] = useState<User | null>(null)
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

  // Load current user on component mount
  useEffect(() => {
    const user = getCurrentUser()
    setCurrentUser(user)
  }, [])

  if (!currentUser) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="w-8 h-8 border-2 border-cyan-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      </Layout>
    )
  }

  const userReviews = sampleReviews.filter(r => r.reviewedId === currentUser.id)
  
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

  // Updated Trust Score Breakdown with 11 components (removed weight display)
  const trustBreakdown = [
    { category: 'Time Spent on App', score: currentUser.trustScore > 80 ? 94 : 65, count: currentUser.trustScore > 80 ? '120+ hours' : '20+ hours' },
    { category: 'Recent Activity', score: currentUser.trustScore > 80 ? 89 : 70, count: currentUser.trustScore > 80 ? 'Active daily' : 'Active weekly' },
    { category: 'Postings Quality', score: currentUser.trustScore > 80 ? 96 : 45, count: `${currentUser.reviewsCount} posts` },
    { category: 'Comments Engagement', score: currentUser.trustScore > 80 ? 88 : 50, count: currentUser.trustScore > 80 ? '156 comments' : '12 comments' },
    { category: 'Community Engagement', score: currentUser.trustScore > 80 ? 92 : 40, count: currentUser.trustScore > 80 ? '234 interactions' : '15 interactions' },
    { category: 'Friends Network', score: Math.min(95, 40 + (currentUser.friendsCount * 2)), count: `${currentUser.friendsCount} connections` },
    { category: 'Events Attended', score: Math.min(95, 40 + (currentUser.eventsAttended * 3)), count: `${currentUser.eventsAttended} events` },
    { category: 'Social Media Connected', score: Math.min(98, 30 + (currentUser.socialAccounts.length * 10)), count: `${currentUser.socialAccounts.length} accounts` },
    { category: 'Flagging Accuracy', score: currentUser.trustScore > 80 ? 91 : 60, count: currentUser.trustScore > 80 ? '23/25 accurate' : 'No flags yet' },
    { category: 'Positive Reactions', score: currentUser.trustScore > 80 ? 93 : 55, count: currentUser.trustScore > 80 ? '89% positive' : '65% positive' },
    { category: 'Profile Completeness', score: calculateProfileCompleteness(currentUser), count: `${calculateProfileCompleteness(currentUser)}% complete` }
  ]

  function calculateProfileCompleteness(user: User): number {
    let completeness = 0
    if (user.name) completeness += 15
    if (user.bio && user.bio !== 'New to ScoopSocials! Looking forward to connecting with the community.') completeness += 15
    if (user.location && user.location !== 'Location not set') completeness += 10
    if (user.avatar) completeness += 10
    if (user.email) completeness += 10
    if (user.phone) completeness += 10
    if (user.socialAccounts.length > 0) completeness += 15
    if (user.socialAccounts.length >= 3) completeness += 10
    if (user.isVerified) completeness += 5
    return completeness
  }

  // Social media icons mapping
  const socialIcons = {
    'Facebook': '📘',
    'Twitter': '🐦',
    'Instagram': '📷',
    'LinkedIn': '💼',
    'Spotify': '🎵',
    'YouTube': '▶️',
    'TikTok': '📱',
    'Discord': '🎮'
  }

  const visibleSocials = showAllSocials ? currentUser.socialAccounts : currentUser.socialAccounts.slice(0, 6)

  return (
    <Layout>
      <div className="p-4 space-y-6">
        {/* Profile Header */}
        <div className="card-soft bg-gradient-to-r from-cyan-50 to-teal-50 border-cyan-200">
          <div className="flex items-start space-x-4 mb-6">
            <div className="relative">
              <Image
                src={currentUser.avatar}
                alt={currentUser.name}
                width={80}
                height={80}
                className="rounded-2xl"
              />
              {currentUser.isVerified && (
                <div className="absolute -bottom-2 -right-2 w-6 h-6 bg-cyan-500 rounded-full flex items-center justify-center">
                  <CheckBadgeIcon className="w-4 h-4 text-white" />
                </div>
              )}
            </div>
            <div className="flex-1">
              <div className="flex items-center space-x-2 mb-1">
                <h2 className="text-xl font-bold text-slate-800">{currentUser.name}</h2>
                <TrustBadge score={currentUser.trustScore} size="sm" />
              </div>
              <p className="text-slate-600 mb-2">@{currentUser.username}</p>
              <p className="text-slate-700 mb-3">{currentUser.bio}</p>
              <div className="flex items-center space-x-2 text-sm text-slate-500">
                <MapPinIcon className="w-4 h-4" />
                <span>{currentUser.location}</span>
                <span>•</span>
                <CalendarIcon className="w-4 h-4" />
                <span>Joined {new Date(currentUser.joinDate).getFullYear()}</span>
              </div>
            </div>
          </div>

          {/* Account Type Badge */}
          <div className="mb-4">
            <div className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-semibold ${
              currentUser.accountType === 'pro' 
                ? 'bg-gradient-to-r from-amber-400 to-amber-500 text-white shadow-lg'
                : currentUser.accountType === 'venue'
                ? 'bg-gradient-to-r from-purple-500 to-purple-600 text-white shadow-lg'
                : 'bg-slate-100 text-slate-700'
            }`}>
              {currentUser.accountType === 'pro' && '👑 Pro Account'}
              {currentUser.accountType === 'venue' && '🏢 Venue Account'}
              {currentUser.accountType === 'free' && '🆓 Free Account'}
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-slate-800">{currentUser.friendsCount}</div>
              <div className="text-sm text-slate-500">Friends</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-slate-800">{currentUser.reviewsCount}</div>
              <div className="text-sm text-slate-500">Reviews</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-slate-800">{currentUser.eventsAttended}</div>
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
                <div className="text-3xl font-bold text-cyan-700">{currentUser.trustScore}</div>
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
              {currentUser.socialAccounts.length} connected
            </span>
          </div>
          
          {/* Icons Only View */}
          <div className="flex flex-wrap gap-3 mb-4">
            {visibleSocials.map((account, index) => (
              <div 
                key={index}
                className="w-12 h-12 bg-gradient-to-br from-cyan-100 to-teal-100 rounded-xl flex items-center justify-center text-2xl hover:scale-110 transition-transform duration-200 cursor-pointer border border-cyan-200"
                title={`${account.platform}: ${account.handle}`}
              >
                {socialIcons[account.platform as keyof typeof socialIcons] || '🔗'}
              </div>
            ))}
            
            {/* Add Account Button */}
            <div className="w-12 h-12 bg-slate-100 hover:bg-slate-200 rounded-xl flex items-center justify-center text-xl cursor-pointer transition-all duration-200 border-2 border-dashed border-slate-300">
              ➕
            </div>
          </div>

          {/* View More / View Less Button */}
          {currentUser.socialAccounts.length > 6 && (
            <button
              onClick={() => setShowAllSocials(!showAllSocials)}
              className="text-sm text-cyan-600 hover:text-cyan-700 font-medium"
            >
              {showAllSocials ? 'View Less' : `View More (${currentUser.socialAccounts.length - 6} more)`}
            </button>
          )}

          {/* Link to Detailed View */}
          <div className="mt-4 pt-4 border-t border-slate-200">
            <Link 
              href="/profile/accounts"
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