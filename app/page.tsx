'use client'

import React, { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import Layout from '@/components/Layout'
import TrustBadge from '@/components/TrustBadge'
import FlagModal from '@/components/FlagModal'
import LoadingSpinner from '@/components/LoadingSpinner'
import ClassicVoteSystem from '@/components/ClassicVoteSystem'

import { getCurrentUser, sampleUsers, getAllReviews, getAllEvents, User, voteOnReview } from '@/lib/sampleData'
import { 
  ChatBubbleLeftIcon,
  ShareIcon,
  MapPinIcon,
  CalendarIcon,
  UsersIcon,
  FlagIcon,
  TagIcon,
  UserIcon,
  BookmarkIcon
} from '@heroicons/react/24/outline'
import { useRouter } from 'next/navigation'



export default function HomePage() {
  const [isLoading, setIsLoading] = useState(true)
  const [currentUser, setCurrentUser] = useState<User | null>(null)
  const [reviews, setReviews] = useState<any[]>([])
  const [events, setEvents] = useState<any[]>([])

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

  // Load current user, reviews, and events on component mount
  useEffect(() => {
    const user = getCurrentUser()
    setCurrentUser(user)
    
    // Clear localStorage to force fresh timeline order
    localStorage.removeItem('scoopReviews')
    localStorage.removeItem('scoopEvents')
    
    const allReviews = getAllReviews()
    setReviews(allReviews)
    const allEvents = getAllEvents()
    setEvents(allEvents)
  }, [])

  // Refresh reviews when page becomes visible (returning from create post)
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (!document.hidden) {
        const allReviews = getAllReviews()
        setReviews(allReviews)
        const allEvents = getAllEvents()
        setEvents(allEvents)
      }
    }

    document.addEventListener('visibilitychange', handleVisibilityChange)
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange)
  }, [])



  // Simulate loading
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 1500)

    return () => clearTimeout(timer)
  }, [])

  const handleVote = (reviewId: string) => (direction: 'up' | 'down') => {
    // Update the vote in the backend
    const success = voteOnReview(reviewId, direction)
    if (success) {
      // Refresh reviews to show updated vote counts
      const updatedReviews = getAllReviews()
      setReviews(updatedReviews)
    }
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
    // Reload reviews and events from storage
    const allReviews = getAllReviews()
    setReviews(allReviews)
    const allEvents = getAllEvents()
    setEvents(allEvents)
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

          {reviews.map((review, index) => {
            const reviewer = sampleUsers.find(u => u.id === review.reviewerId)
            const reviewee = sampleUsers.find(u => u.id === review.reviewedId)
            const relatedEvent = review.isEventReview ? events.find(e => e.id === review.eventId) : null

            if (!reviewer || !reviewee) return null

            const isReviewOfAnotherUser = reviewer.id !== reviewee.id

            return (  
              <div key={review.id} className="card-premium hover:shadow-xl transition-all duration-300 border-cyan-200/50 overflow-hidden">
                {/* Header - Full Width */}
                <div className="px-4 py-3 border-b border-slate-100">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-3">
                      <div>
                        <Link href={`/user/${reviewer.id}`} className="font-medium text-slate-800 hover:text-cyan-600">
                          {reviewer.name}
                        </Link>
                        <div className="mt-1">
                          <TrustBadge score={reviewer.trustScore} size="sm" />
                        </div>
                      </div>
                      {isReviewOfAnotherUser && (
                        <>
                          <span className="text-slate-400 mx-2">→</span>
                          <div>
                            <Link href={`/user/${reviewee.id}`} className="font-medium text-slate-800 hover:text-cyan-600">
                              {reviewee.name}
                            </Link>
                            <div className="mt-1">
                              <TrustBadge score={reviewee.trustScore} size="sm" />
                            </div>
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                  <div className="flex flex-wrap items-center gap-3 text-sm text-slate-600">
                    <span className="flex items-center space-x-1">
                      <span className="w-4 h-4 bg-cyan-100 rounded-full flex items-center justify-center">
                        <span className="text-xs text-cyan-600">•</span>
                      </span>
                      <span>{review.category}</span>
                    </span>
                    <span className="flex items-center space-x-1">
                      <CalendarIcon className="w-4 h-4" />
                      <span>{getPostDate(review.timestamp)}</span>
                    </span>
                    <span className="flex items-center space-x-1">
                      <MapPinIcon className="w-4 h-4" />
                      <span>{reviewer.location}</span>
                    </span>
                  </div>
                </div>

                {/* Main Content Area */}
                <div className="flex min-h-full">
                  <div className="w-16 flex items-center justify-center border-r border-slate-100 px-1 self-stretch">
                    <ClassicVoteSystem
                      reviewId={review.id}
                      initialVotes={review.votes}
                      onVote={handleVote(review.id)}
                      className=""
                    />
                  </div>

                  {/* Content */}
                  <div className="flex-1 p-4">
                    {/* Review Type Indicator */}
                    {review.isEventReview && (
                      <div className="mb-3">
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-purple-100 text-purple-700">
                          <CalendarIcon className="w-4 h-4 mr-1" />
                          EVENT REVIEW
                        </span>
                      </div>
                    )}
                    
                    {/* Event Information */}
                    {review.isEventReview && relatedEvent && (
                      <div className="mb-4">
                        <div className="flex items-center space-x-2 mb-2">
                          <CalendarIcon className="w-5 h-5 text-purple-600" />
                          <span className="font-medium text-slate-800">{relatedEvent.title}</span>
                        </div>
                        <div className="flex flex-wrap items-center gap-3 text-sm text-slate-600">
                          <span className="flex items-center space-x-1">
                            <MapPinIcon className="w-4 h-4" />
                            <span>{relatedEvent.location}</span>
                          </span>
                          <span className="flex items-center space-x-1">
                            <CalendarIcon className="w-4 h-4" />
                            <span>{new Date(relatedEvent.date).toLocaleDateString()}</span>
                          </span>
                          <span className="flex items-center space-x-1">
                            <UsersIcon className="w-4 h-4" />
                            <span>{relatedEvent.attendeeCount} people</span>
                          </span>
                        </div>
                      </div>
                    )}

                    {/* Content Section */}
                    <div className="mb-4">
                      <div className="bg-slate-50 rounded-lg p-4 border-l-4 border-cyan-400">
                        <blockquote className="text-slate-700 leading-relaxed">
                          "{limitContentPreview(review.content, 150)}"
                        </blockquote>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Actions - Full Width Footer */}
                <div className="px-6 py-3 border-t border-slate-100 bg-slate-50/30">
                  <div className="flex items-center justify-center space-x-4">
                    <button
                      onClick={() => handleComment(review.id)}
                      className="flex items-center space-x-1 text-slate-600 hover:text-cyan-600 transition-colors duration-200 px-2 py-2 rounded-lg hover:bg-white/50"
                    >
                      <ChatBubbleLeftIcon className="w-4 h-4" />
                      <span className="text-sm font-medium">Comment</span>
                    </button>
                    <button className="flex items-center space-x-1 text-slate-600 hover:text-cyan-600 transition-colors duration-200 px-2 py-2 rounded-lg hover:bg-white/50">
                      <ShareIcon className="w-4 h-4" />
                      <span className="text-sm font-medium">Share</span>
                    </button>
                    <button className="flex items-center space-x-1 text-slate-600 hover:text-cyan-600 transition-colors duration-200 px-2 py-2 rounded-lg hover:bg-white/50">
                      <BookmarkIcon className="w-4 h-4" />
                      <span className="text-sm font-medium">Save</span>
                    </button>
                    <button
                      onClick={() => handleFlag('post', review.id, `Review by ${reviewer.name}`)}
                      className="flex items-center space-x-1 text-slate-500 hover:text-orange-500 transition-colors duration-200 px-2 py-2 rounded-lg hover:bg-white/50"
                    >
                      <FlagIcon className="w-4 h-4" />
                      <span className="text-sm font-medium">Flag</span>
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