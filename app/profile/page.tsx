'use client'

import React, { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import Layout from '@/components/Layout'
import TrustBadge from '@/components/TrustBadge'
import FlagModal from '@/components/FlagModal'
import { sampleUsers, sampleReviews } from '@/lib/sampleData'
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
  StarIcon
} from '@heroicons/react/24/outline'
import { CheckBadgeIcon as CheckBadgeIconSolid } from '@heroicons/react/24/solid'

export default function ProfilePage() {
  // Using the first user as the current user
  const currentUser = sampleUsers[0]
  const userReviews = sampleReviews.filter(r => r.reviewedId === currentUser.id)
  
  const [showAllSocials, setShowAllSocials] = useState(false)
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
  const visibleSocials = showAllSocials ? currentUser.socialAccounts : currentUser.socialAccounts.slice(0, 3)

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

  const trustBreakdown = [
    { category: 'Professional Reviews', score: 94, count: 12 },
    { category: 'Social Interactions', score: 89, count: 8 },
    { category: 'Event Hosting', score: 96, count: 5 },
    { category: 'Community Participation', score: 88, count: 15 },
    { category: 'Verified Connections', score: 92, count: 234 }
  ]

  const achievements = [
    { title: 'Verified Professional', icon: '💼', description: 'LinkedIn verified' },
    { title: 'Community Leader', icon: '🏆', description: '10+ events hosted' },
    { title: 'Trusted Reviewer', icon: '⭐', description: '50+ helpful reviews' },
    { title: 'Early Adopter', icon: '🚀', description: 'Joined in 2023' }
  ]

  return (
    <Layout>
      <div className="p-4 space-y-6">
        {/* Profile Header */}
        <div className="card-soft">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-2">
              <h1 className="text-2xl font-bold text-slate-800">Profile</h1>
              {currentUser.isVerified && (
                <CheckBadgeIconSolid className="w-6 h-6 text-primary-500" />
              )}
            </div>
            <div className="flex items-center space-x-2">
              <Link
                href="/notifications"
                className="p-2 rounded-xl hover:bg-slate-100 transition-colors duration-200"
              >
                <BellIcon className="w-5 h-5 text-slate-600" />
              </Link>
              <Link
                href="/settings"
                className="p-2 rounded-xl hover:bg-slate-100 transition-colors duration-200"
              >
                <Cog6ToothIcon className="w-5 h-5 text-slate-600" />
              </Link>
            </div>
          </div>

          {/* Profile Info */}
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
                <div className="absolute -bottom-2 -right-2 w-6 h-6 bg-primary-500 rounded-full flex items-center justify-center">
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

        {/* Trust Score Breakdown */}
        <div className="card-soft">
          <h3 className="text-lg font-semibold text-slate-800 mb-4 flex items-center">
            <TrophyIcon className="w-5 h-5 mr-2 text-primary-500" />
            Trust Score Breakdown
          </h3>
          <div className="space-y-4">
            {trustBreakdown.map((item, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-medium text-slate-700">{item.category}</span>
                    <span className="text-sm font-semibold text-slate-800">{item.score}/100</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="flex-1 bg-slate-200 rounded-full h-2">
                      <div 
                        className="bg-gradient-to-r from-primary-500 to-primary-600 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${item.score}%` }}
                      />
                    </div>
                    <span className="text-xs text-slate-500">({item.count})</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Social Accounts */}
        <div className="card-soft">
          <h3 className="text-lg font-semibold text-slate-800 mb-4">Connected Accounts</h3>
          <div className="space-y-3">
            {visibleSocials.map((social, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-slate-50 rounded-xl">
                <div className="flex items-center space-x-3">
                  <span className="text-2xl">{social.icon}</span>
                  <div>
                    <div className="flex items-center space-x-2">
                      <span className="font-medium text-slate-800">{social.platform}</span>
                      {social.verified && (
                        <CheckBadgeIconSolid className="w-4 h-4 text-primary-500" />
                      )}
                    </div>
                    <span className="text-sm text-slate-600">{social.handle}</span>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  {social.verified && (
                    <span className="text-xs bg-trust-excellent/10 text-trust-excellent px-2 py-1 rounded-full">
                      Verified
                    </span>
                  )}
                  <button 
                    onClick={(e) => {
                      e.preventDefault()
                      e.stopPropagation()
                      handleFlag('social', `${social.platform}-${social.handle}`, `${social.platform} account: ${social.handle}`)
                    }}
                    className="p-1 rounded-lg hover:bg-orange-100 transition-colors duration-200"
                  >
                    <svg className="w-4 h-4 text-slate-400 hover:text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 21v-4m0 0V5a2 2 0 012-2h6.5l1 1H21l-3 6 3 6v1a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
                    </svg>
                  </button>
                </div>
              </div>
            ))}
            
            {currentUser.socialAccounts.length > 3 && (
              <button
                onClick={() => setShowAllSocials(!showAllSocials)}
                className="w-full text-center py-2 text-primary-600 hover:text-primary-700 font-medium text-sm"
              >
                {showAllSocials 
                  ? 'Show Less' 
                  : `and ${currentUser.socialAccounts.length - 3} more...`
                }
              </button>
            )}
          </div>
        </div>

        {/* Achievements */}
        <div className="card-soft">
          <h3 className="text-lg font-semibold text-slate-800 mb-4">Achievements</h3>
          <div className="grid grid-cols-2 gap-3">
            {achievements.map((achievement, index) => (
              <div key={index} className="p-3 bg-gradient-to-br from-primary-50 to-primary-100/50 rounded-xl">
                <div className="text-2xl mb-2">{achievement.icon}</div>
                <h4 className="font-semibold text-slate-800 text-sm mb-1">{achievement.title}</h4>
                <p className="text-xs text-slate-600">{achievement.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Reviews */}
        <div className="card-soft">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-slate-800 flex items-center">
              <StarIcon className="w-5 h-5 mr-2 text-primary-500" />
              Recent Reviews
            </h3>
            <Link 
              href="/reviews" 
              className="text-sm text-primary-600 hover:text-primary-700 font-medium"
            >
              View All
            </Link>
          </div>
          
          <div className="space-y-4">
            {userReviews.slice(0, 3).map((review, index) => {
              const reviewer = sampleUsers.find(u => u.id === review.reviewerId)
              if (!reviewer) return null
              
              return (
                <div key={index} className="p-4 bg-slate-50 rounded-xl">
                  <div className="flex items-start space-x-3">
                    <Image
                      src={reviewer.avatar}
                      alt={reviewer.name}
                      width={40}
                      height={40}
                      className="rounded-full"
                    />
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-1">
                        <span className="font-medium text-slate-800">{reviewer.name}</span>
                        <span className="text-xs bg-primary-50 text-primary-600 px-2 py-1 rounded-full">
                          {review.category}
                        </span>
                      </div>
                      <p className="text-sm text-slate-600 mb-2">{review.content}</p>
                      <div className="flex items-center space-x-2 text-xs text-slate-500">
                        <span>Community validation: {review.communityValidation}%</span>
                        <span>•</span>
                        <span>{new Date(review.timestamp).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="card-soft">
          <h3 className="text-lg font-semibold text-slate-800 mb-4">Quick Actions</h3>
          <div className="grid grid-cols-2 gap-3">
            <Link
              href="/edit-profile"
              className="flex items-center justify-center space-x-2 p-4 bg-primary-50 hover:bg-primary-100 rounded-xl transition-colors duration-200"
            >
              <DocumentTextIcon className="w-5 h-5 text-primary-600" />
              <span className="font-medium text-primary-700">Edit Profile</span>
            </Link>
            <button className="flex items-center justify-center space-x-2 p-4 bg-slate-50 hover:bg-slate-100 rounded-xl transition-colors duration-200">
              <ShareIcon className="w-5 h-5 text-slate-600" />
              <span className="font-medium text-slate-700">Share Profile</span>
            </button>
          </div>
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