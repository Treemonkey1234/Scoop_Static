'use client'

import React, { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import Layout from '@/components/Layout'
import TrustBadge from '@/components/TrustBadge'
import FlagModal from '@/components/FlagModal'
import LoadingSpinner from '@/components/LoadingSpinner'
import { useToast } from '@/components/Toast'
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
    const currentVote = votedPosts[postId]
    let newVote: 'up' | 'down' | null = voteType
    
    if (currentVote === voteType) {
      newVote = null
    }
    
    setVotedPosts(prev => ({
      ...prev,
      [postId]: newVote
    }))

    if (newVote === 'up') {
      showSuccess('Upvoted!', 'This will help boost community trust scores.')
    } else if (newVote === 'down') {
      showError('Downvoted', 'This feedback helps maintain quality standards.')
    }
  }

  const handleLike = (postId: string) => {
    const isLiked = likedPosts[postId]
    setLikedPosts(prev => ({
      ...prev,
      [postId]: !isLiked
    }))

    if (!isLiked) {
      showSuccess('Liked!', 'Building positive community connections.')
    }
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

  const handleRefresh = () => {
    setRefreshing(true)
    setTimeout(() => {
      setRefreshing(false)
      showSuccess('Feed refreshed!', 'Latest community updates loaded.')
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
            <span className="bg-gradient-to-r from-cyan-600 via-teal-600 to-blue-600 bg-clip-text text-transparent">
              Get the Scoop
            </span>
          </h1>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed">
            The sweetest way to discover people's true flavors. Share scoops, build trust, and create the most delicious social connections.
          </p>
        </div>

        {/* Enhanced Welcome Header */}
        <div className="card-premium relative overflow-hidden bg-gradient-to-r from-cyan-50 to-teal-50 border-cyan-200">
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-cyan-100 to-transparent rounded-full -mr-16 -mt-16 opacity-50" />
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-2xl font-bold bg-gradient-to-r from-cyan-700 to-teal-700 bg-clip-text text-transparent mb-2">
                  Welcome back, {sampleUsers[0].name}! 
                </h2>
                <div className="flex items-center space-x-4">
                  <TrustBadge score={sampleUsers[0].trustScore} size="lg" />
                  <div className="text-sm text-slate-600">
                    <span className="font-medium">{sampleUsers[0].friendsCount}</span> friends • 
                    <span className="font-medium ml-1">{sampleUsers[0].reviewsCount}</span> reviews
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
            <Link href="/create-post" className="text-sm text-cyan-600 hover:text-cyan-700 font-medium">
              Share a scoop →
            </Link>
          </div>

          {sampleReviews.map((review, index) => {
            const reviewer = sampleUsers.find(u => u.id === review.reviewerId)
            const reviewee = sampleUsers.find(u => u.id === review.reviewedId)
            const currentVote = votedPosts[review.id]
            const isLiked = likedPosts[review.id]

            if (!reviewer || !reviewee) return null

            return (
              <div key={review.id} className="card-premium hover:shadow-xl transition-all duration-300 border-cyan-200/50">
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
                      <h4 className="font-semibold text-slate-800 truncate">{reviewer.name}</h4>
                      <span className="text-slate-400">→</span>
                      <span className="font-medium text-slate-700 truncate">{reviewee.name}</span>
                      <TrustBadge score={reviewer.trustScore} size="sm" />
                    </div>
                    <div className="flex items-center space-x-2 text-sm text-slate-500 mb-3">
                      <span className="px-2 py-1 bg-cyan-100 text-cyan-700 rounded-lg font-medium">
                        {review.category}
                      </span>
                      <span>•</span>
                      <span>{getPostDate(review.timestamp)}</span>
                      <span>•</span>
                      <div className="flex items-center space-x-1">
                        <MapPinIcon className="w-3 h-3" />
                        <span>{reviewer.location}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <blockquote className="text-slate-700 mb-4 bg-slate-50 p-4 rounded-xl border-l-4 border-cyan-400">
                  "{review.content}"
                </blockquote>

                {/* Community Validation */}
                <div className="mb-4 p-3 bg-gradient-to-r from-cyan-50 to-teal-50 rounded-xl border border-cyan-200">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-slate-700">Community Validation</span>
                    <span className="text-sm text-slate-600">{review.communityValidation}%</span>
                  </div>
                  <div className="w-full bg-slate-200 rounded-full h-2 mb-2">
                    <div 
                      className="bg-gradient-to-r from-cyan-500 to-teal-600 h-2 rounded-full transition-all duration-500"
                      style={{ width: `${review.communityValidation}%` }}
                    />
                  </div>
                  <div className="flex items-center justify-between text-xs text-slate-500">
                    <span>{review.upvotes} agrees</span>
                    <span>{review.downvotes} disagrees</span>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex items-center justify-between pt-4 border-t border-slate-200">
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-1">
                      <button
                        onClick={() => handleVote(review.id, 'up')}
                        className={`p-2 rounded-lg transition-all duration-200 ${
                          currentVote === 'up' 
                            ? 'bg-green-100 text-green-600' 
                            : 'hover:bg-slate-100 text-slate-600'
                        }`}
                      >
                        <ChevronUpIcon className="w-4 h-4" />
                      </button>
                      <span className="text-sm font-medium text-slate-700">
                        {review.upvotes + (currentVote === 'up' ? 1 : 0)}
                      </span>
                    </div>
                    
                    <div className="flex items-center space-x-1">
                      <button
                        onClick={() => handleVote(review.id, 'down')}
                        className={`p-2 rounded-lg transition-all duration-200 ${
                          currentVote === 'down' 
                            ? 'bg-red-100 text-red-600' 
                            : 'hover:bg-slate-100 text-slate-600'
                        }`}
                      >
                        <ChevronDownIcon className="w-4 h-4" />
                      </button>
                      <span className="text-sm font-medium text-slate-700">
                        {review.downvotes + (currentVote === 'down' ? 1 : 0)}
                      </span>
                    </div>

                    <button
                      onClick={() => handleLike(review.id)}
                      className={`flex items-center space-x-1 p-2 rounded-lg transition-all duration-200 ${
                        isLiked 
                          ? 'bg-pink-100 text-pink-600' 
                          : 'hover:bg-slate-100 text-slate-600'
                      }`}
                    >
                      {isLiked ? (
                        <HeartIconSolid className="w-4 h-4" />
                      ) : (
                        <HeartIcon className="w-4 h-4" />
                      )}
                      <span className="text-sm font-medium">Like</span>
                    </button>

                    <button className="flex items-center space-x-1 p-2 rounded-lg hover:bg-slate-100 text-slate-600 transition-all duration-200">
                      <ChatBubbleLeftIcon className="w-4 h-4" />
                      <span className="text-sm font-medium">Comment</span>
                    </button>
                  </div>

                  <div className="flex items-center space-x-2">
                    <button className="flex items-center space-x-1 p-2 rounded-lg hover:bg-slate-100 text-slate-600 transition-all duration-200">
                      <ShareIcon className="w-4 h-4" />
                      <span className="text-sm font-medium">Share</span>
                    </button>

                    <button 
                      onClick={() => handleFlag('post', review.id, `Review by ${reviewer.name}`)}
                      className="p-2 rounded-lg hover:bg-red-50 text-red-500 transition-all duration-200"
                    >
                      <span className="text-sm">🚩</span>
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

      {/* Toast Notifications */}
      <ToastContainer />
    </Layout>
  )
} 