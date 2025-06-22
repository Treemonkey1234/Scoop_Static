'use client'

import React, { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import Layout from '@/components/Layout'
import TrustBadge from '@/components/TrustBadge'
import FlagModal from '@/components/FlagModal'
import LoadingSpinner from '@/components/LoadingSpinner'
import { useToast } from '@/components/Toast'
import { QuickStats } from '@/components/StatsWidget'
import { sampleUsers, sampleReviews, sampleEvents } from '@/lib/sampleData'
import { 
  ChevronUpIcon, 
  ChevronDownIcon, 
  ChatBubbleLeftIcon,
  HeartIcon,
  ShareIcon,
  MapPinIcon,
  CalendarIcon,
  UsersIcon
} from '@heroicons/react/24/outline'
import { HeartIcon as HeartIconSolid } from '@heroicons/react/24/solid'

export default function HomePage() {
  const [votedPosts, setVotedPosts] = useState<{[key: string]: 'up' | 'down' | null}>({})
  const [likedPosts, setLikedPosts] = useState<{[key: string]: boolean}>({})
  const [isLoading, setIsLoading] = useState(true)

  const [refreshing, setRefreshing] = useState(false)
  const { showSuccess, showError, showInfo, ToastContainer } = useToast()
  const [flagModal, setFlagModal] = useState<{
    isOpen: boolean
    contentType: 'post' | 'event' | 'social'
    contentId: string
    contentTitle?: string
  }>({
    isOpen: false,
    contentType: 'post',
    contentId: '',
    contentTitle: ''
  })

  // Simulate loading
  React.useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false)
      showInfo('Welcome back!', 'Your feed has been updated with the latest activity.')
    }, 1500)

    return () => clearTimeout(timer)
  }, [])

  const handleVote = (postId: string, voteType: 'up' | 'down') => {
    setVotedPosts(prev => ({
      ...prev,
      [postId]: prev[postId] === voteType ? null : voteType
    }))
    
    // Show toast feedback
    const isUpvote = voteType === 'up'
    const wasAlreadyVoted = votedPosts[postId] === voteType
    
    if (wasAlreadyVoted) {
      showInfo('Vote removed', 'Your vote has been removed from this post.')
    } else {
      showSuccess(
        isUpvote ? 'Upvoted!' : 'Downvoted!', 
        `Your ${isUpvote ? 'upvote' : 'downvote'} helps improve community trust.`
      )
    }
  }

  const handleLike = (postId: string) => {
    const wasLiked = likedPosts[postId]
    setLikedPosts(prev => ({
      ...prev,
      [postId]: !prev[postId]
    }))
    
    if (!wasLiked) {
      showSuccess('Liked!', 'This post has been added to your favorites.')
    }
  }

  const handleRefresh = async () => {
    setRefreshing(true)
    // Simulate refresh
    setTimeout(() => {
      setRefreshing(false)
      showSuccess('Feed refreshed!', 'Your feed is now up to date.')
    }, 1000)
  }

  const handleFlag = (contentType: 'post' | 'event' | 'social', contentId: string, contentTitle?: string) => {
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
      contentType: 'post',
      contentId: '',
      contentTitle: ''
    })
  }

  const getCurrentVoteCount = (review: any) => {
    const baseCount = review.upvotes - review.downvotes
    const userVote = votedPosts[review.id]
    
    if (userVote === 'up') {
      return baseCount + 1
    } else if (userVote === 'down') {
      return baseCount - 1
    }
    return baseCount
  }

  const getPostDate = (timestamp: string) => {
    const date = new Date(timestamp)
    const now = new Date()
    const diffTime = Math.abs(now.getTime() - date.getTime())
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    
    if (diffDays === 1) return 'Yesterday'
    if (diffDays < 7) return `${diffDays} days ago`
    return date.toLocaleDateString()
  }

  const loadMore = () => {
    setIsLoading(true)
    setTimeout(() => {
      setIsLoading(false)
      showSuccess('More scoops loaded!', 'Fresh content has been added to your feed.')
    }, 1500)
  }

  if (isLoading && !refreshing) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <LoadingSpinner />
        </div>
        <ToastContainer />
      </Layout>
    )
  }

  return (
    <Layout>
      <div className="space-y-4 p-4">
        <div className="text-center mb-12">
          <h1 className="text-5xl md:text-6xl font-bold mb-6">
            <span className="bg-gradient-to-r from-pink-600 via-purple-600 to-blue-600 bg-clip-text text-transparent">
              Get the Scoop
            </span>
            <br />
            <span className="text-slate-800">on Everyone! 🍦</span>
          </h1>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed">
            The sweetest way to discover people's true flavors. Share scoops, build trust, and create the most delicious social connections.
          </p>
        </div>

        {/* Enhanced Welcome Header */}
        <div className="card-premium relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-pink-100 to-transparent rounded-full -mr-16 -mt-16 opacity-50" />
          <div className="relative z-10">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent mb-2">Welcome back, Sarah! 🍦</h2>
                <p className="text-slate-600">Here's what's churning in your sweet community</p>
                <div className="flex items-center space-x-4 mt-3">
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-pink-500 rounded-full animate-pulse" />
                    <span className="text-sm text-slate-500">3 fresh scoops</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse" />
                    <span className="text-sm text-slate-500">2 sweet socials</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" />
                    <span className="text-sm text-slate-500">5 flavor friends online</span>
                  </div>
                </div>
              </div>
              <button
                onClick={handleRefresh}
                disabled={refreshing}
                className="p-3 rounded-xl bg-white/80 hover:bg-white transition-all duration-200 shadow-sm hover:shadow-md"
              >
                {refreshing ? (
                  <div className="w-5 h-5 border-2 border-slate-200 border-t-slate-400 rounded-full animate-spin" />
                ) : (
                  <svg className="w-5 h-5 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <QuickStats />

        {/* Ice Cream Achievement Banner */}
        <div className="card-soft bg-gradient-to-r from-yellow-50 via-orange-50 to-pink-50 border-2 border-yellow-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="text-4xl animate-bounce">🏆</div>
              <div>
                <h3 className="font-bold text-lg text-slate-800">Sweet Achievement Unlocked!</h3>
                <p className="text-slate-600">🍨 "Scoop Collector" - You've shared 25 flavor profiles!</p>
                <div className="flex space-x-2 mt-2">
                  <span className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs font-semibold">+50 Trust Sprinkles</span>
                  <span className="px-2 py-1 bg-pink-100 text-pink-800 rounded-full text-xs font-semibold">Legendary Status</span>
                </div>
              </div>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-yellow-600">25/25</div>
              <div className="text-xs text-slate-500">Scoops Shared</div>
            </div>
          </div>
        </div>

        {/* Feed */}
        <div className="space-y-4">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-slate-800 mb-4">Latest Flavor Profiles</h2>
            <p className="text-slate-600 mb-8">Fresh scoops from our community</p>
          </div>

          {/* Sample Reviews */}
          {sampleReviews.map((review, index) => {
            const reviewer = sampleUsers.find(u => u.id === review.reviewerId)
            const reviewed = sampleUsers.find(u => u.id === review.reviewedId)
            
            if (!reviewer || !reviewed) return null

            return (
              <div key={`review-${review.id}`} className="card-premium flex group transition-all duration-300">
                {/* Voting Section */}
                <div className="voting-section bg-gradient-to-b from-pink-50 to-purple-50 border-r border-pink-200/50">
                  <button
                    onClick={() => handleVote(review.id, 'up')}
                    className={`vote-btn scoop-btn ${votedPosts[review.id] === 'up' ? 'voted-up' : ''}`}
                    title="Sweet Scoop! (Upvote)"
                  >
                    <div className="scoop-shape bg-gradient-to-br from-pink-300 to-pink-400 flex items-center justify-center">
                      <svg 
                        width="20" 
                        height="24" 
                        viewBox="0 0 20 24" 
                        fill="none" 
                        xmlns="http://www.w3.org/2000/svg"
                        className="transform"
                      >
                        {/* Upward pointing ice cream cone */}
                        <defs>
                          <linearGradient id="upConeGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                            <stop offset="0%" stopColor="#D2691E"/>
                            <stop offset="50%" stopColor="#CD853F"/>
                            <stop offset="100%" stopColor="#8B4513"/>
                          </linearGradient>
                          <linearGradient id="upScoopGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                            <stop offset="0%" stopColor="#FFF8DC"/>
                            <stop offset="30%" stopColor="#FFFACD"/>
                            <stop offset="70%" stopColor="#F0E68C"/>
                            <stop offset="100%" stopColor="#DAA520"/>
                          </linearGradient>
                          <radialGradient id="upScoopRadial" cx="40%" cy="30%">
                            <stop offset="0%" stopColor="rgba(255,255,255,0.8)"/>
                            <stop offset="60%" stopColor="rgba(255,255,255,0.3)"/>
                            <stop offset="100%" stopColor="rgba(255,255,255,0)"/>
                          </radialGradient>
                        </defs>
                        
                        {/* Cone pointing up with shadow */}
                        <path 
                          d="M6 14 L10 4 L14 14 Z" 
                          fill="url(#upConeGrad)"
                          stroke="#8B4513"
                          strokeWidth="0.8"
                        />
                        
                        {/* Enhanced waffle pattern */}
                        <g stroke="#654321" strokeWidth="0.4" opacity="0.8">
                          {/* Horizontal lines */}
                          <line x1="6.5" y1="13" x2="13.5" y2="13"/>
                          <line x1="7" y1="11.5" x2="13" y2="11.5"/>
                          <line x1="7.5" y1="10" x2="12.5" y2="10"/>
                          <line x1="8" y1="8.5" x2="12" y2="8.5"/>
                          <line x1="8.5" y1="7" x2="11.5" y2="7"/>
                          <line x1="9" y1="5.5" x2="11" y2="5.5"/>
                          
                          {/* Diagonal lines */}
                          <line x1="7.5" y1="13.5" x2="9" y2="10"/>
                          <line x1="9" y1="13.5" x2="10.5" y2="10"/>
                          <line x1="10.5" y1="13.5" x2="12" y2="10"/>
                          <line x1="8.5" y1="10" x2="9.5" y2="7"/>
                          <line x1="10" y1="10" x2="11" y2="7"/>
                          <line x1="11" y1="10" x2="11.5" y2="8"/>
                        </g>
                        
                        {/* Ice cream scoop with enhanced gradients */}
                        <circle 
                          cx="10" 
                          cy="16" 
                          r="6.2" 
                          fill="url(#upScoopGrad)"
                          stroke="#DAA520"
                          strokeWidth="0.3"
                        />
                        
                        {/* Radial highlight for 3D effect */}
                        <circle 
                          cx="10" 
                          cy="16" 
                          r="6" 
                          fill="url(#upScoopRadial)"
                        />
                        
                        {/* Main highlight */}
                        <ellipse 
                          cx="8.5" 
                          cy="14" 
                          rx="2.5" 
                          ry="3.5" 
                          fill="rgba(255,255,255,0.6)"
                          opacity="0.8"
                        />
                        
                        {/* Secondary highlight */}
                        <ellipse 
                          cx="11.5" 
                          cy="17" 
                          rx="1" 
                          ry="1.5" 
                          fill="rgba(255,255,255,0.4)"
                          opacity="0.6"
                        />
                        
                        {/* Cone tip detail */}
                        <circle 
                          cx="10" 
                          cy="4.5" 
                          r="0.5" 
                          fill="#654321"
                          opacity="0.7"
                        />
                      </svg>
                    </div>
                  </button>
                  
                  <div className="vote-count">
                    <div className="font-bold text-lg text-slate-700">
                      {getCurrentVoteCount(review)}
                    </div>
                    <div className="text-xs text-slate-500">scoops</div>
                  </div>
                  
                  <button
                    onClick={() => handleVote(review.id, 'down')}
                    className={`vote-btn scoop-btn ${votedPosts[review.id] === 'down' ? 'voted-down' : ''}`}
                    title="Brain Freeze! (Downvote)"
                  >
                    <div className="scoop-shape bg-gradient-to-br from-blue-300 to-blue-400 flex items-center justify-center">
                      <svg 
                        width="20" 
                        height="24" 
                        viewBox="0 0 20 24" 
                        fill="none" 
                        xmlns="http://www.w3.org/2000/svg"
                        className="transform rotate-180"
                      >
                        {/* Downward pointing ice cream cone */}
                        <defs>
                          <linearGradient id="downConeGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                            <stop offset="0%" stopColor="#D2691E"/>
                            <stop offset="50%" stopColor="#CD853F"/>
                            <stop offset="100%" stopColor="#8B4513"/>
                          </linearGradient>
                          <linearGradient id="downScoopGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                            <stop offset="0%" stopColor="#87CEEB"/>
                            <stop offset="30%" stopColor="#B0E0E6"/>
                            <stop offset="70%" stopColor="#4682B4"/>
                            <stop offset="100%" stopColor="#1E90FF"/>
                          </linearGradient>
                          <radialGradient id="downScoopRadial" cx="40%" cy="30%">
                            <stop offset="0%" stopColor="rgba(255,255,255,0.9)"/>
                            <stop offset="60%" stopColor="rgba(255,255,255,0.4)"/>
                            <stop offset="100%" stopColor="rgba(255,255,255,0)"/>
                          </radialGradient>
                        </defs>
                        
                        {/* Cone pointing up with shadow (will be rotated) */}
                        <path 
                          d="M6 14 L10 4 L14 14 Z" 
                          fill="url(#downConeGrad)"
                          stroke="#8B4513"
                          strokeWidth="0.8"
                        />
                        
                        {/* Enhanced waffle pattern */}
                        <g stroke="#654321" strokeWidth="0.4" opacity="0.8">
                          {/* Horizontal lines */}
                          <line x1="6.5" y1="13" x2="13.5" y2="13"/>
                          <line x1="7" y1="11.5" x2="13" y2="11.5"/>
                          <line x1="7.5" y1="10" x2="12.5" y2="10"/>
                          <line x1="8" y1="8.5" x2="12" y2="8.5"/>
                          <line x1="8.5" y1="7" x2="11.5" y2="7"/>
                          <line x1="9" y1="5.5" x2="11" y2="5.5"/>
                          
                          {/* Diagonal lines */}
                          <line x1="7.5" y1="13.5" x2="9" y2="10"/>
                          <line x1="9" y1="13.5" x2="10.5" y2="10"/>
                          <line x1="10.5" y1="13.5" x2="12" y2="10"/>
                          <line x1="8.5" y1="10" x2="9.5" y2="7"/>
                          <line x1="10" y1="10" x2="11" y2="7"/>
                          <line x1="11" y1="10" x2="11.5" y2="8"/>
                        </g>
                        
                        {/* Ice cream scoop with enhanced gradients (blue theme) */}
                        <circle 
                          cx="10" 
                          cy="16" 
                          r="6.2" 
                          fill="url(#downScoopGrad)"
                          stroke="#1E90FF"
                          strokeWidth="0.3"
                        />
                        
                        {/* Radial highlight for 3D effect */}
                        <circle 
                          cx="10" 
                          cy="16" 
                          r="6" 
                          fill="url(#downScoopRadial)"
                        />
                        
                        {/* Main highlight */}
                        <ellipse 
                          cx="8.5" 
                          cy="14" 
                          rx="2.5" 
                          ry="3.5" 
                          fill="rgba(255,255,255,0.7)"
                          opacity="0.9"
                        />
                        
                        {/* Secondary highlight */}
                        <ellipse 
                          cx="11.5" 
                          cy="17" 
                          rx="1" 
                          ry="1.5" 
                          fill="rgba(255,255,255,0.5)"
                          opacity="0.7"
                        />
                        
                        {/* Ice crystals for frozen effect */}
                        <g fill="rgba(255,255,255,0.8)" opacity="0.6">
                          <circle cx="7.5" cy="15.5" r="0.3"/>
                          <circle cx="12" cy="14" r="0.2"/>
                          <circle cx="9" cy="18" r="0.25"/>
                          <circle cx="11.5" cy="19" r="0.2"/>
                        </g>
                        
                        {/* Cone tip detail */}
                        <circle 
                          cx="10" 
                          cy="4.5" 
                          r="0.5" 
                          fill="#654321"
                          opacity="0.7"
                        />
                      </svg>
                    </div>
                  </button>
                </div>

                {/* Main Content */}
                <div className="flex-1 pl-4">
                  {/* Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <div className="relative">
                        <Image
                          src={reviewer.avatar}
                          alt={reviewer.name}
                          width={48}
                          height={48}
                          className="rounded-full"
                        />
                        {reviewer.isVerified && (
                          <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-primary-500 rounded-full flex items-center justify-center">
                            <span className="text-white text-xs">✓</span>
                          </div>
                        )}
                      </div>
                      <div>
                        <h3 className="font-semibold text-slate-800">{reviewer.name}</h3>
                        <p className="text-sm text-slate-500">reviewed {reviewed.name}</p>
                        <p className="text-xs text-slate-400">{getPostDate(review.timestamp)}</p>
                      </div>
                    </div>
                    <TrustBadge score={review.trustScore} size="sm" />
                  </div>

                  {/* Review Content */}
                  <div className="mb-4">
                    <div className="flex items-center space-x-2 mb-2">
                      <span className={`text-sm font-medium px-2 py-1 rounded-full ${
                        review.isEventReview 
                          ? 'text-purple-600 bg-purple-50' 
                          : 'text-primary-600 bg-primary-50'
                      }`}>
                        {review.isEventReview ? '🎉 ' : ''}{review.category}
                      </span>
                      {review.isEventReview && (
                        <span className="text-xs text-purple-600 bg-purple-100 px-2 py-1 rounded-full">
                          Post-Event Review
                        </span>
                      )}
                      <div className="flex items-center space-x-1">
                        <span className="text-sm text-slate-500">Community validation:</span>
                        <span className="text-sm font-semibold text-trust-good">{review.communityValidation}%</span>
                      </div>
                    </div>
                    {review.isEventReview && review.eventId && (
                      <div className="mb-3 p-3 bg-purple-50 rounded-lg border border-purple-200">
                        <div className="flex items-center space-x-2">
                          <span className="text-purple-600">📅</span>
                          <span className="text-sm font-medium text-purple-800">
                            Event: {sampleEvents.find(e => e.id === review.eventId)?.title || 'Event'}
                          </span>
                        </div>
                        <div className="flex items-center space-x-2 mt-1">
                          <span className="text-purple-600">📍</span>
                          <span className="text-xs text-purple-600">
                            {sampleEvents.find(e => e.id === review.eventId)?.location || 'Location'}
                          </span>
                        </div>
                      </div>
                    )}
                    <p className="text-slate-700 leading-relaxed">{review.content}</p>
                  </div>

                  {/* Actions */}
                  <div className="flex flex-wrap gap-3">
                    <button
                      onClick={() => handleLike(review.id)}
                      className="flex items-center space-x-1 text-slate-500 hover:text-red-500 transition-colors duration-200"
                    >
                      {likedPosts[review.id] ? (
                        <HeartIconSolid className="w-5 h-5 text-red-500" />
                      ) : (
                        <HeartIcon className="w-5 h-5" />
                      )}
                      <span className="text-sm">Like</span>
                    </button>
                    <Link
                      href={`/comments/${review.id}`}
                      className="flex items-center space-x-1 text-slate-500 hover:text-primary-500 transition-colors duration-200"
                    >
                      <ChatBubbleLeftIcon className="w-5 h-5" />
                      <span className="text-sm">Comment</span>
                    </Link>
                    <button className="flex items-center space-x-1 text-slate-500 hover:text-primary-500 transition-colors duration-200">
                      <ShareIcon className="w-5 h-5" />
                      <span className="text-sm">Share</span>
                    </button>
                    <button 
                      onClick={() => handleFlag('post', review.id, `Review by ${reviewer.name}`)}
                      className="flex items-center space-x-1 text-slate-500 hover:text-orange-500 transition-colors duration-200"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 21v-4m0 0V5a2 2 0 012-2h6.5l1 1H21l-3 6 3 6v1a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
                      </svg>
                      <span className="text-sm">Flag</span>
                    </button>
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        {/* Load More */}
        {isLoading ? (
          <div className="flex justify-center py-8">
            <LoadingSpinner />
          </div>
        ) : (
          <button 
            onClick={loadMore}
            className="btn-primary w-full group relative overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-primary-600 to-primary-700 opacity-100 transition-opacity duration-300" />
            <span className="relative z-10 font-semibold">Load More Scoops 🍨</span>
          </button>
        )}
      </div>

      {/* Flag Modal */}
      <FlagModal
        isOpen={flagModal.isOpen}
        onClose={closeFlagModal}
        contentType={flagModal.contentType}
        contentId={flagModal.contentId}
        contentTitle={flagModal.contentTitle}
      />

      {/* Toast Notifications */}
      <ToastContainer />
    </Layout>
  )
} 