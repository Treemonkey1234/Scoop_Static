'use client'

import React, { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import Layout from '@/components/Layout'
import TrustBadge from '@/components/TrustBadge'
import FlagModal from '@/components/FlagModal'
import LoadingSpinner from '@/components/LoadingSpinner'

import { getCurrentUser, sampleUsers, sampleReviews, sampleEvents, User } from '@/lib/sampleData'
import { 
  ChevronUpIcon, 
  ChevronDownIcon, 
  ChatBubbleLeftIcon,
  ShareIcon,
  MapPinIcon,
  CalendarIcon,
  UsersIcon,
  FlagIcon
} from '@heroicons/react/24/outline'
import { useRouter } from 'next/navigation'



export default function HomePage() {
  const [votedPosts, setVotedPosts] = useState<{[key: string]: 'up' | 'down' | null}>({})
  const [isLoading, setIsLoading] = useState(true)
  const [currentUser, setCurrentUser] = useState<User | null>(null)

  const [refreshing, setRefreshing] = useState(false)

  const [flagModal, setFlagModal] = useState<{
    isOpen: boolean
    contentType: 'post' | 'event' | 'social' | 'comment'
    contentId: string
    contentTitle?: string
  }>({
    isOpen: false,
    contentType: 'post',
    contentId: '',
    contentTitle: ''
  })

  // Load current user on component mount
  React.useEffect(() => {
    const user = getCurrentUser()
    setCurrentUser(user)
  }, [])



  // Simulate loading
  React.useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 1500)

    return () => clearTimeout(timer)
  }, [])

  const handleVote = (postId: string, voteType: 'up' | 'down') => {
    const currentVote = votedPosts[postId]
    let newVote: 'up' | 'down' | null = voteType
    
    if (currentVote === voteType) {
      newVote = null
    }
    
    setVotedPosts(prev => ({
      ...prev,
      [postId]: newVote
    }))
  }

  const handleComment = (postId: string) => {
    // Navigate to comments page for this post
    window.location.href = `/comments/${postId}`
  }

  const handleFlag = (contentType: 'post' | 'event' | 'social' | 'comment', contentId: string, contentTitle?: string) => {
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

  const handleRefresh = () => {
    setRefreshing(true)
    setTimeout(() => {
      setRefreshing(false)
    }, 1000)
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
    }, 1500)
  }

  // Helper function to limit content preview
  const limitContentPreview = (content: string, maxLength: number = 150) => {
    if (content.length <= maxLength) return content
    return content.substring(0, maxLength) + '...'
  }

  // Mock comments for demonstration
  const getMockComments = (postId: string) => [
    { id: '1', author: 'Jane Smith', content: 'Great review! I had a similar experience.', timestamp: '2 hours ago' },
    { id: '2', author: 'Mike Johnson', content: 'Thanks for sharing this insight.', timestamp: '1 hour ago' }
  ]

  if (isLoading && !refreshing) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <LoadingSpinner />
        </div>
      </Layout>
    )
  }

  return (
    <Layout>
      <div className="space-y-4 p-4">
        <div className="text-center mb-12">
          <h1 className="text-5xl md:text-6xl font-bold mb-6">
            <span className="bg-gradient-to-r from-cyan-600 via-teal-600 to-blue-600 bg-clip-text text-transparent">
              Get the Scoop
            </span>
          </h1>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed">
            Connect with your community through trust-based reviews and authentic recommendations.
          </p>
        </div>

        {/* Enhanced Welcome Header */}
        <div className="card-premium relative overflow-hidden bg-gradient-to-r from-cyan-50 to-teal-50 border-cyan-200">
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-cyan-100 to-transparent rounded-full -mr-16 -mt-16 opacity-50" />
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-2xl font-bold bg-gradient-to-r from-cyan-700 to-teal-700 bg-clip-text text-transparent mb-2">
                  Welcome back, {currentUser?.name}! 
                </h2>
                                  <div className="flex items-center space-x-4">
                    <TrustBadge score={currentUser?.trustScore || 50} size="lg" />
                    <div className="text-sm text-slate-600">
                      <span className="font-medium">{currentUser?.friendsCount || 0}</span> friends • 
                      <span className="font-medium ml-1">{currentUser?.reviewsCount || 0}</span> reviews
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

        {/* Latest Scoops Section */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-bold text-slate-800">Latest Scoops</h3>
          </div>

          {sampleReviews.map((review, index) => {
            const reviewer = sampleUsers.find(u => u.id === review.reviewerId)
            const reviewee = sampleUsers.find(u => u.id === review.reviewedId)
            const currentVote = votedPosts[review.id]
            const mockComments = getMockComments(review.id)

            if (!reviewer || !reviewee) return null

            return (
              <div key={review.id} className="card-premium hover:shadow-xl transition-all duration-300 border-cyan-200/50 overflow-hidden">
                <div className="flex">
                  {/* Left Voting Section with Dynamic Gradient - Reduced Height */}
                  <div className="flex flex-col items-center justify-between mr-4 self-start min-h-[280px] w-12 mt-2">
                    {(() => {
                      const totalVotes = review.upvotes + review.downvotes
                      const positiveRatio = totalVotes > 0 ? (review.upvotes / totalVotes) * 100 : 50
                      const currentVoteAdjustment = currentVote === 'up' ? 1 : currentVote === 'down' ? -1 : 0
                      const adjustedUpvotes = review.upvotes + (currentVote === 'up' ? 1 : 0)
                      const adjustedDownvotes = review.downvotes + (currentVote === 'down' ? 1 : 0)
                      const adjustedTotal = adjustedUpvotes + adjustedDownvotes
                      const adjustedRatio = adjustedTotal > 0 ? (adjustedUpvotes / adjustedTotal) * 100 : 50
                      
                      // Create gradient based on vote ratio
                      let gradientStyle = {}
                      if (adjustedRatio >= 80) {
                        // Heavy positive - dark cyan at top
                        gradientStyle = { background: 'linear-gradient(to bottom, #0891b2 0%, #06b6d4 30%, #67e8f9 70%, #cffafe 100%)' }
                      } else if (adjustedRatio >= 60) {
                        // Medium positive - medium cyan at top
                        gradientStyle = { background: 'linear-gradient(to bottom, #06b6d4 0%, #22d3ee 40%, #a5f3fc 80%, #ecfeff 100%)' }
                      } else if (adjustedRatio >= 40) {
                        // Balanced - even gradient
                        gradientStyle = { background: 'linear-gradient(to bottom, #22d3ee 0%, #67e8f9 25%, #a5f3fc 50%, #cffafe 75%, #ecfeff 100%)' }
                      } else if (adjustedRatio >= 20) {
                        // Medium negative - medium red at bottom
                        gradientStyle = { background: 'linear-gradient(to bottom, #fef2f2 0%, #fecaca 20%, #f87171 60%, #dc2626 100%)' }
                      } else {
                        // Heavy negative - dark red at bottom
                        gradientStyle = { background: 'linear-gradient(to bottom, #fef2f2 0%, #fecaca 30%, #ef4444 70%, #b91c1c 100%)' }
                      }

                      return (
                        <div 
                          className="flex flex-col items-center justify-between h-full w-full rounded-xl border border-slate-200 shadow-sm p-1"
                          style={gradientStyle}
                        >
                          {/* Upvote Button */}
                          <button
                            onClick={() => handleVote(review.id, 'up')}
                            className={`w-8 h-8 rounded-full flex items-center justify-center transition-all duration-200 backdrop-blur-sm ${
                              currentVote === 'up' 
                                ? 'bg-white/90 shadow-lg ring-2 ring-cyan-500' 
                                : 'bg-white/70 hover:bg-white/90 hover:shadow-md'
                            }`}
                            title="Upvote this scoop"
                          >
                            <span className="text-lg">🍦</span>
                          </button>

                          {/* Vote Score */}
                          <div className="flex flex-col items-center space-y-1 bg-white/80 backdrop-blur-sm rounded-lg px-2 py-3">
                            <span className="text-sm font-bold text-slate-800">
                              {review.upvotes + (currentVote === 'up' ? 1 : currentVote === 'down' ? -1 : 0) - review.downvotes}
                            </span>
                            <span className="text-xs font-medium text-slate-600">
                              {Math.round(adjustedRatio)}%
                            </span>
                          </div>

                          {/* Downvote Button */}
                          <button
                            onClick={() => handleVote(review.id, 'down')}
                            className={`w-8 h-8 rounded-full flex items-center justify-center transition-all duration-200 backdrop-blur-sm ${
                              currentVote === 'down' 
                                ? 'bg-white/90 shadow-lg ring-2 ring-red-500' 
                                : 'bg-white/70 hover:bg-white/90 hover:shadow-md'
                            }`}
                            title="Downvote this scoop"
                          >
                            <span className="text-lg rotate-180">🍦</span>
                          </button>
                        </div>
                      )
                    })()}
                  </div>

                  {/* Main Content */}
                  <div className="flex-1 min-w-0 overflow-hidden">
                    <div className="flex items-start space-x-3 mb-4">
                      <Image
                        src={reviewer.avatar}
                        alt={reviewer.name}
                        width={48}
                        height={48}
                        className="rounded-xl shadow-sm"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-2 mb-1">
                          <h4 className="font-semibold text-slate-800 text-base">{reviewer.name}</h4>
                          <span className="text-slate-400 text-sm">→</span>
                          <span className="font-medium text-slate-700 text-base">{reviewee.name}</span>
                          <div className="bg-white/80 rounded-full">
                            <TrustBadge score={reviewer.trustScore} size="sm" />
                          </div>
                        </div>
                        <div className="flex items-center space-x-2 text-sm text-slate-500 mb-2">
                          <span className="px-2 py-1 bg-cyan-100 text-cyan-700 rounded-lg font-medium">
                            {review.category}
                          </span>
                          <span>•</span>
                          <span>{getPostDate(review.timestamp)}</span>
                        </div>
                        {/* Location moved under category and date */}
                        <div className="flex items-center space-x-1 text-xs text-slate-500 mb-3">
                          <MapPinIcon className="w-3 h-3" />
                          <span>{reviewer.location}</span>
                        </div>
                      </div>
                      
                      {/* Flag Button - Top Right - Standardized */}
                      <button 
                        onClick={() => handleFlag('post', review.id, `Review by ${reviewer.name}`)}
                        className="p-2 rounded-lg hover:bg-red-50 text-red-500 transition-all duration-200 self-start"
                        title="Flag this content"
                      >
                        <FlagIcon className="w-4 h-4" />
                      </button>
                    </div>

                    {/* Limited Content Preview */}
                    <blockquote className="text-slate-700 mb-4 bg-slate-50 p-4 rounded-xl border-l-4 border-cyan-400">
                      "{limitContentPreview(review.content, 120)}"
                    </blockquote>

                    {/* Mock Comments Section */}
                    <div className="bg-slate-50 rounded-xl p-3 mb-4">
                      <h5 className="text-sm font-medium text-slate-700 mb-2">Comments ({mockComments.length})</h5>
                      <div className="space-y-2">
                        {mockComments.map((comment) => (
                          <div key={comment.id} className="bg-white p-2 rounded-lg border border-slate-200">
                            <div className="flex items-start justify-between">
                              <div className="flex-1">
                                <div className="flex items-center space-x-2 mb-1">
                                  <span className="text-sm font-medium text-slate-800">{comment.author}</span>
                                  <span className="text-xs text-slate-500">{comment.timestamp}</span>
                                </div>
                                <p className="text-sm text-slate-700">{comment.content}</p>
                              </div>
                              <button 
                                onClick={() => handleFlag('comment', comment.id, `Comment by ${comment.author}`)}
                                className="p-1 rounded hover:bg-red-50 text-red-500 transition-all duration-200"
                                title="Flag this comment"
                              >
                                <FlagIcon className="w-3 h-3" />
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Action Buttons - Removed Like, Fixed Comment */}
                    <div className="flex items-center justify-between pt-4 border-t border-slate-200">
                      <div className="flex items-center space-x-4">
                        <button
                          onClick={() => handleComment(review.id)}
                          className="flex items-center space-x-1 p-2 rounded-lg hover:bg-slate-100 text-slate-600 transition-all duration-200"
                        >
                          <ChatBubbleLeftIcon className="w-4 h-4" />
                          <span className="text-sm font-medium">Comment</span>
                        </button>
                      </div>

                      <div className="flex items-center space-x-2">
                        <button className="flex items-center space-x-1 p-2 rounded-lg hover:bg-slate-100 text-slate-600 transition-all duration-200">
                          <ShareIcon className="w-4 h-4" />
                          <span className="text-sm font-medium">Share</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        {/* Load More */}
        {isLoading ? (
          <div className="flex justify-center py-8">
            <LoadingSpinner type="pull-refresh" />
          </div>
        ) : (
          <button 
            onClick={loadMore}
            className="btn-primary w-full group relative overflow-hidden bg-gradient-to-r from-cyan-500 to-teal-600 hover:from-cyan-600 hover:to-teal-700"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-cyan-600 to-teal-700 opacity-100 transition-opacity duration-300" />
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

    </Layout>
  )
} 